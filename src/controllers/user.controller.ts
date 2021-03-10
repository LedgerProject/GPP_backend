//Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { get, getFilterSchemaFor, getJsonSchemaRef, getModelSchemaRef, HttpErrors, param, post, requestBody} from '@loopback/rest';
import { UserProfile } from '@loopback/security';
//Other imports
import _ from 'lodash';
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../authorization/keys';
import { v4 as uuidv4 } from 'uuid';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { UserTypeKeys } from '../authorization/user-type-keys';
import { OrganizationUser, OrganizationsUsersView, User } from '../models';
import { Credentials, OrganizationRepository, OrganizationsUsersViewRepository, OrganizationUserRepository, UserRepository } from '../repositories';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { JWTService } from '../services/jwt-service';
import { MyUserService } from '../services/user.service';
import { validateCredentials } from '../services/validator';
import { CredentialsRequestBody } from './specs/user.controller.spec';


interface InvitationOutcome {
  code: string;
  message: string;
}

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(OrganizationsUsersViewRepository)
    public organizationsUsersViewRepository: OrganizationsUsersViewRepository,
    @repository(OrganizationUserRepository)
    public organizationUserRepository: OrganizationUserRepository,
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService
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
    if (userData.userType === UserTypeKeys.gppOperator && secretKey !== process.env.GPP_REGISTRATION_KEY) {
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

    // Select the new user and omit some data
    const userCreated = await this.userRepository.findById(newUser.idUser, { fields: {idUser: true, userType: true, firstName: true, lastName: true, email: true} });

    return userCreated;
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
          PermissionKeys.GeneralOrganizationManagement,
          PermissionKeys.GeneralUsersManagement,
          PermissionKeys.GeneralStructuresManagement,
          PermissionKeys.GeneralCountriesManagement,
          PermissionKeys.GeneralIconsManagement,
          PermissionKeys.GeneralCategoriesManagement,
          PermissionKeys.GeneralNationalitiesManagement,
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.MyOrganizationList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ]
        break;

      case UserTypeKeys.operator:
        userProfile.permissions = [
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.OrganizationCreation,
          PermissionKeys.OrganizationUpdate,
          PermissionKeys.OrganizationDetail,
          PermissionKeys.OrganizationDelete,
          PermissionKeys.MyOrganizationList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ];
        break;

      default:
        userProfile.permissions = [
          PermissionKeys.DocWalletManagement,
          PermissionKeys.StructureList,
          PermissionKeys.StructureDetail,
          PermissionKeys.CountriesList,
          PermissionKeys.CountryDetail,
          PermissionKeys.CategoriesList,
          PermissionKeys.NationalitiesList,
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

  //*** LIST ***/
  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': { schema: { type: 'array', items: getModelSchemaRef(User, { includeRelations: true })}}
        }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationUsersManagement, PermissionKeys.GeneralUsersManagement] })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter<User>
  ): Promise<User[]> {
    let organizationFilter = false;

    // Avoid showing users
    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ userType: { "neq" : 'user' } }).build();

    filter.where = where;

    // If operator, show only the owned organizations
    if (currentUser.userType !== 'gppOperator') {
      if (filter === undefined) {
        filter = {};
      }

      filter.include = [{
        "relation": "organizationUser",
        "scope": {
          "where": {"idOrganization": currentUser.idOrganization}
        }
      }]

      organizationFilter = true;
    }

    let usersReturn: User[] = [];
    const userRep = await this.userRepository.find(filter);

    if (organizationFilter) {
      for (let key in userRep) {
        if (userRep[key]['organizationUser']) {
          usersReturn.push(userRep[key]);
        }
      }
    } else {
      usersReturn = userRep;
    }

    return usersReturn;
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
          PermissionKeys.GeneralOrganizationManagement,
          PermissionKeys.GeneralUsersManagement,
          PermissionKeys.GeneralStructuresManagement,
          PermissionKeys.GeneralCountriesManagement,
          PermissionKeys.GeneralIconsManagement,
          PermissionKeys.GeneralCategoriesManagement,
          PermissionKeys.GeneralNationalitiesManagement,
          PermissionKeys.StructureCreation,
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.MyOrganizationList,
          PermissionKeys.AuthFeatures,
          PermissionKeys.ProfileEdit
        ]
        break;

      case UserTypeKeys.operator:
        userProfile.permissions = [
          PermissionKeys.CheckTokenDocWallet,
          PermissionKeys.OrganizationCreation,
          PermissionKeys.OrganizationUpdate,
          PermissionKeys.OrganizationDetail,
          PermissionKeys.OrganizationDelete,
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

  //*** INVITE USER ***/
  @authenticate('jwt', { required: [PermissionKeys.OrganizationUsersManagement] })
  @get('/user/invite-organization/{id}/{permissions}', {
    responses: {
      '200': {
        description: 'Invite User into Organization',
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
  async inviteUser(
    @param.path.string('id') id: string,
    @param.path.string('permissions') permissions: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ invitationOutcome: InvitationOutcome }> {
    let response : InvitationOutcome = {
      code: '0',
      message: ''
    };

    // Get the organization information
    const orFilter: Filter = { where: { "idOrganization": currentUser.idOrganization }};
    const organizationData = await this.organizationRepository.find(orFilter);

    // Check if the operator is already into the organization
    const filter: Filter = { where: { "idUser": id, "idOrganization": currentUser.idOrganization, "confirmed": true }};
    const organizationExists = await this.organizationsUsersViewRepository.find(filter);

    if (organizationExists.length > 0) {
      response = {
        code: '10',
        message: 'User already assigned to the current organization'
      };
    } else {
      // Get operator information
      const opFilter: Filter = { where: { "idUser": id, "userType": "operator" }};
      const userData = await this.userRepository.find(opFilter);

      if (userData.length < 1) {
        response = {
          code: '30',
          message: 'User not exists'
        };
      } else {
        // Delete previous missed invitation from database
        const delFilter: Filter = { where: { "idUser": id, "idOrganization": currentUser.idOrganization }};
        const invitationRemove = await this.organizationUserRepository.find(delFilter);

        for (let x = 0; x < invitationRemove.length; x++) {
          await this.organizationUserRepository.deleteById(invitationRemove[x].idOrganizationUser);
        }

        // Save the invitation into database
        const newUserOrganization: OrganizationUser = new OrganizationUser();
        newUserOrganization.idOrganization = currentUser.idOrganization;
        newUserOrganization.idUser = id;
        newUserOrganization.permissions = [];

        // Set the permissions array
        const arrPermissions = permissions.split(',');
        for (let i = 0; i < arrPermissions.length; i++) {
          newUserOrganization.permissions.push(arrPermissions[i]);
        }
        newUserOrganization.confirmed = false;
        newUserOrganization.invitationToken = uuidv4();
        await this.organizationUserRepository.save(newUserOrganization);

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const confirmInvitationLink = process.env.PORTAL_URL + '/confirm-invitation/?confirm=' + newUserOrganization.invitationToken;

        const emailText = 'Hello ' + userData[0].firstName + ' ' + userData[0].lastName + ', \
          you were invited to be part of the organization named "' + organizationData[0].name + '". \
          Copy and paste this link on your browser to accept the invitation: ' + confirmInvitationLink;

        const htmlText = 'Hello ' + userData[0].firstName + ' ' + userData[0].lastName + ',<br /> \
        you were invited to be part of the organization named "' + organizationData[0].name + '".<br /><br /> \
        Click on this link to accept the invitation: <a href="' + confirmInvitationLink + '" target="_blank">' + confirmInvitationLink + '</a><br /><br /> \
        Global Passport Project staff';

        const msg = {
          to: userData[0].email,
          from: 'noreply@globalpassportproject.org',
          subject: 'Global Passport Project: organization invitation',
          text: emailText,
          html: htmlText,
        }

        await sgMail
          .send(msg)
          .then(() => {
            response = {
              code: '202',
              message: 'Invitation e-mail sent'
            };
          })
          .catch((error: any) => {
            console.error(error)
            response = {
              code: '20',
              message: 'Error sending e-mail'
            };
          })
      }
    }

    return Promise.resolve({ invitationOutcome: response });
  }

  //*** USER PROFILE ***/
  @get('/users/me')
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser);
  }

  //*** USER OWNED ORGANIZATIONS ***/
  @authenticate('jwt', { required: [PermissionKeys.MyOrganizationList] })
  @get('/users/my-organizations')
  async getMyOrganizations(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<OrganizationsUsersView[]> {
    const filter: Filter = { where: { "idUser": currentUser.idUser, "confirmed": true }, order: ["name"] };
    const myOrganizations = await this.organizationsUsersViewRepository.find(filter);
    return myOrganizations;
  }

  //*** USER PROFILE ***/
  @get('/users/token/{id}')
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async giveMeToken(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<any>  {
    const filter: Filter = { where: { "idUser": currentUser.idUser, "confirmed": true } };
    const myOrganizations = await this.organizationsUsersViewRepository.find(filter);
    return myOrganizations;
  }
}
