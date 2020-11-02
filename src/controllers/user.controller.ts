//Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { get, getJsonSchemaRef, getModelSchemaRef, HttpErrors, param, post, requestBody } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
//Various imports
import _ from 'lodash';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { UserTypeKeys } from '../authorization/user-type-keys';
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../keys';
import { OrganizationsUsersView, User } from '../models';
import { Credentials, OrganizationsUsersViewRepository, OrganizationUserRepository, UserRepository } from '../repositories';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { JWTService } from '../services/jwt-service';
import { MyUserService } from '../services/user.service';
import { validateCredentials } from '../services/validator';
import { CredentialsRequestBody } from './specs/user.controller.spec';
const zenroom = require('zenroom');
import scenarios from './tools'
import fs = require('fs');
import { Base64 } from 'js-base64';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(OrganizationsUsersViewRepository)
    public organizationsUsersViewRepository: OrganizationsUsersViewRepository,
    @repository(OrganizationUserRepository)
    public organizationUserRepository: OrganizationUserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) { }

  //*** USER SIGNUP ***/
  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async signup(
    @param.query.string('secretKey') secretKey: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['idUser', 'permissions', 'additionalProp1'],
          }),
        },
      },
    }
    )
    userData: User) {
    // Credentials validations
    validateCredentials(_.pick(userData, ['userType', 'email', 'password']));

    // Check: if it is a GPP operator, if secretKey is correct
    if (userData.userType === UserTypeKeys.gppOperator && secretKey !== 'initGPP2020!') {
      throw new HttpErrors.Forbidden('Wrong secret key');
    }

    // Check: email duplication
    let filter: Filter = { where: { "email": userData.email, "userType": userData.userType } };

    if (userData.userType !== "user") {
      filter = { where: { "and": [{ "email": userData.email }, { "or": [{ "userType": UserTypeKeys.gppOperator }, { "userType": UserTypeKeys.operator }] }] } }
    }

    if ((await this.userRepository.find(filter))[0] !== undefined) {
      throw new HttpErrors.BadRequest('This email already exists');
    }

    // Set emailConfirmed to false
    userData.emailConfirmed = false;

    // Password hashing
    userData.password = await this.hasher.hashPassword(userData.password)

    // User creation
    const newUser = await this.userRepository.create(userData);
    delete newUser.idUser;
    delete newUser.userType;
    delete newUser.emailConfirmed;
    delete newUser.password;

    return newUser;
  }

  //*** USER LOGIN ***/
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials): Promise<{ token: string }> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);

    switch (user.userType) {
      case UserTypeKeys.gppOperator:
        userProfile.permissions = [
          PermissionKeys.CountriesManagement,
          PermissionKeys.GeneralUsersManagement,
          PermissionKeys.GeneralStructuresManagement,
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.OrganizationCreation,
          PermissionKeys.MyOrganizationList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ]
        break;

      case UserTypeKeys.operator:
        userProfile.permissions = [
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.OrganizationCreation,
          PermissionKeys.MyOrganizationList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ];
        break;

      default:
        userProfile.permissions = [
          PermissionKeys.DocWalletManagement,
          PermissionKeys.StructuresList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ]
    }

    if (user!.userType !== UserTypeKeys.gppOperator) {
      // Check permissions for first organization
      const filter: Filter = { where: { "idUser": user.idUser } };
      const firstOrganization = await this.organizationUserRepository.findOne(filter);

      if (firstOrganization !== undefined) {
        const permissions = firstOrganization?.permissions
        if (permissions?.includes(PermissionKeys.OrganizationAdministrator)) {
          userProfile.permissions.push(PermissionKeys.OrganizationUsersManagement);
          userProfile.permissions.push(PermissionKeys.OrganizationStructuresManagement);
          userProfile.permissions.push(PermissionKeys.StructureCreation);
          userProfile.permissions.push(PermissionKeys.StructureUpdate);
          userProfile.permissions.push(PermissionKeys.StructureList);
          userProfile.permissions.push(PermissionKeys.StructureDetail);
          userProfile.permissions.push(PermissionKeys.StructureDelete);
        } else {
          if (permissions?.includes(PermissionKeys.OrganizationUsersManagement)) {
            userProfile.permissions.push(PermissionKeys.OrganizationUsersManagement);
          }
          if (permissions?.includes(PermissionKeys.OrganizationStructuresManagement)) {
            userProfile.permissions.push(PermissionKeys.OrganizationStructuresManagement);
            userProfile.permissions.push(PermissionKeys.StructureCreation);
            userProfile.permissions.push(PermissionKeys.StructureUpdate);
            userProfile.permissions.push(PermissionKeys.StructureList);
            userProfile.permissions.push(PermissionKeys.StructureDetail);
            userProfile.permissions.push(PermissionKeys.StructureDelete);
          }
        }

        // Associate idOrganization to the userProfile
        userProfile.idOrganization = firstOrganization?.idOrganization;
      }
    } else {
      // Associate idOrganization null to the userProfile
      userProfile.idOrganization = null;
    }

    // Associate userType to the userProfile
    userProfile.userType = user.userType;

    //userProfile.permissions = user.permissions;
    const jwt = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({ token: jwt });
  }

  //*** CHANGE ORGANIZATION ***/
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  @get('/users/change-organization/{id}', {
    responses: {
      '200': {
        description: 'Token change organization',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async changeOrganization(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ token: string }> {
    const filter: Filter = { where: { "idUser": currentUser.idUser } };
    const user = await this.userRepository.findOne(filter);

    const userProfile = this.userService.convertToUserProfile(user!);

    switch (user!.userType) {
      case UserTypeKeys.gppOperator:
        userProfile.permissions = [
          PermissionKeys.CountriesManagement,
          PermissionKeys.GeneralUsersManagement,
          PermissionKeys.GeneralStructuresManagement,
          PermissionKeys.StructureCreation,
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.OrganizationCreation,
          PermissionKeys.MyOrganizationList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ]
        break;

      case UserTypeKeys.operator:
        userProfile.permissions = [
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.OrganizationCreation,
          PermissionKeys.MyOrganizationList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ];
        break;

      default:
        throw new HttpErrors.Forbidden('Not allowed');
    }

    if (user!.userType !== UserTypeKeys.gppOperator) {
      // Check permissions for first organization
      const filterOrg: Filter = { where: { "idUser": user!.idUser, "idOrganization": id } };
      const firstOrganization = await this.organizationUserRepository.findOne(filterOrg);

      if (firstOrganization !== undefined) {
        const permissions = firstOrganization?.permissions
        if (permissions?.includes(PermissionKeys.OrganizationAdministrator)) {
          userProfile.permissions.push(PermissionKeys.OrganizationUsersManagement);
          userProfile.permissions.push(PermissionKeys.OrganizationStructuresManagement);
          userProfile.permissions.push(PermissionKeys.StructureCreation);
          userProfile.permissions.push(PermissionKeys.StructureUpdate);
          userProfile.permissions.push(PermissionKeys.StructureList);
          userProfile.permissions.push(PermissionKeys.StructureDetail);
          userProfile.permissions.push(PermissionKeys.StructureDelete);
        } else {
          if (permissions?.includes(PermissionKeys.OrganizationUsersManagement)) {
            userProfile.permissions.push(PermissionKeys.OrganizationUsersManagement);
          }
          if (permissions?.includes(PermissionKeys.OrganizationStructuresManagement)) {
            userProfile.permissions.push(PermissionKeys.OrganizationStructuresManagement);
            userProfile.permissions.push(PermissionKeys.StructureCreation);
            userProfile.permissions.push(PermissionKeys.StructureUpdate);
            userProfile.permissions.push(PermissionKeys.StructureList);
            userProfile.permissions.push(PermissionKeys.StructureDetail);
            userProfile.permissions.push(PermissionKeys.StructureDelete);
          }
        }
      } else {
        throw new HttpErrors.Forbidden('Wrong organization');
      }

      // Associate idOrganization to the userProfile
      userProfile.idOrganization = id;
    } else {
      // Associate idOrganization to null value
      userProfile.idOrganization = null;
    }

    // Associate userType to the userProfile
    userProfile.userType = user!.userType;

    //userProfile.permissions = user.permissions;
    const jwt = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({ token: jwt });
  }

  //*** USER PROFILE ***/
  @get('/users/me')
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<UserProfile> {
    delete currentUser[securityId];
    return Promise.resolve(currentUser);
  }

  //*** USER OWNED ORGANIZATIONS ***/
  @authenticate('jwt', { required: [PermissionKeys.MyOrganizationList] })
  @get('/users/my-organizations')
  async getMyOrganizations(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<OrganizationsUsersView[]> {
    const filter: Filter = { where: { "idUser": currentUser.idUser, "confirmed": true } };
    const myOrganizations = await this.organizationsUsersViewRepository.find(filter);
    return myOrganizations;
  }

  @get('/users/upload')
  async upload(
  ): Promise<any> {

    const savedLines:any = []
    const printFunction = (text:any) => { savedLines.push(text) }

    var contents = fs.readFileSync('src/controllers/8kb.txt', 'utf8');
    var encodedString = Base64.encode(contents);

    const keys : any = {
      "password": "myVerySecretPassword"
    }

    const data : any =     {
      "header": "A very important secret",
      "message": encodedString
    }

    zenroom
      .print(printFunction)
      .script(scenarios.encrypt())
      .keys(keys)
      .data(data)
      .zencode_exec()

    return JSON.parse(savedLines);
  }
}
