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

interface Invitation {
  idUser: string;
  invitationMessage: string;
  permissions: string;
}

interface ResetPasswordData {
  email: string;
}

interface ConfirmationTokenData {
  confirmationToken: string;
}

interface InvitationTokenData {
  invitationToken: string;
}

interface OperationOutcome {
  code: string;
  message: string;
}

interface UsersListInvitation {
  idUser: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ConfirmResetPasswordData {
  resetPasswordToken: string;
  newPassword: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface OrganizationUserData {
  idUser: string;
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
            exclude: ['idUser', 'additionalProp1'],
          }),
        },
      },
    }
    )
    userData: User) {
    // Credentials validations
    validateCredentials(_.pick(userData, ['userType', 'email', 'password']));

    if (userData.userType !== 'gppOperator' && userData.userType !== 'operator' && userData.userType !== 'user') {
      throw new HttpErrors.BadRequest('Incorrect user type');
    }

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
    userData.password = await this.hasher.hashPassword(userData.password);

    // Confirm account token
    userData.confirmAccountToken = uuidv4();

    // User creation
    const newUser = await this.userRepository.create(userData);

    // Select the new user and omit some data
    const userCreated = await this.userRepository.findById(newUser.idUser, { fields: {idUser: true, userType: true, firstName: true, lastName: true, email: true} });

    // Send e-mail for account confirmation
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const confirmationLink = process.env.PORTAL_URL + '/#/confirm-account/?confirm=' + userData.confirmAccountToken;

    let emailSubject = process.env.CONFIRM_ACCOUNT_EMAIL_SUBJECT;
    emailSubject = emailSubject?.replace(/%firstName%/g, userData.firstName);
    emailSubject = emailSubject?.replace(/%lastName%/g, userData.lastName);

    let emailText = process.env.CONFIRM_ACCOUNT_EMAIL_TEXT;
    emailText = emailText?.replace(/%firstName%/g, userData.firstName);
    emailText = emailText?.replace(/%lastName%/g, userData.lastName);
    emailText = emailText?.replace(/%confirmationLink%/g, confirmationLink);
        
    let htmlText = process.env.CONFIRM_ACCOUNT_EMAIL_HTML;
    htmlText = htmlText?.replace(/%firstName%/g, userData.firstName);
    htmlText = htmlText?.replace(/%lastName%/g, userData.lastName);
    htmlText = htmlText?.replace(/%confirmationLink%/g, confirmationLink);

    const msg = {
      to: userData.email,
      from: process.env.CONFIRM_ACCOUNT_EMAIL_FROM_EMAIL,
      fromname: process.env.CONFIRM_ACCOUNT_EMAIL_FROM_NAME,
      subject: emailSubject,
      text: emailText,
      html: htmlText,
    }

    await sgMail
      .send(msg)
      .then(() => {})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        console.error(error)
      })

    return userCreated;
  }

  //*** CONFIRM ACCOUNT ***/
  @post('/user/confirm-account', {
    responses: {
      '200': {
        description: 'Confirm Account',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                confirmAccount: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async confirmAccount(
    @requestBody()
    confirmationToken: ConfirmationTokenData
  ): Promise<{ confirmationOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    if (confirmationToken.confirmationToken) {
      // Check if the confirmation token exists
      const conFilter: Filter = { where: { "confirmAccountToken": confirmationToken.confirmationToken }};
      const userData = await this.userRepository.findOne(conFilter);

      if (userData) {
        // Check if the account is already confirmed
        if (userData.emailConfirmed) {
          response = {
            code: '20',
            message: 'Account already confirmed'
          };
        } else {
          // Update the account to confirmed
          userData.emailConfirmed = true;
          userData.confirmAccountToken = '';

          await this.userRepository.updateById(userData.idUser, userData);

          if (userData.userType === 'user') {
            response = {
              code: '202',
              message: 'User account confirmed'
            };
          } else {
            response = {
              code: '204',
              message: 'Operator account confirmed'
            };
          }
        }
      } else {
        response = {
          code: '10',
          message: 'Confirmation token not exists'
        };
      }
    } else {
      response = {
        code: '11',
        message: 'Specify a token'
      };
    }

    return Promise.resolve({ confirmationOutcome: response });
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

    //Check if e-mail confirmed
    if (!user.emailConfirmed) {
      throw new HttpErrors.Forbidden('E-mail not confirmed');
    }

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
      const filter: Filter = { where: { "idUser": user.idUser, "confirmed": true } };
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

  //*** USER PROFILE ***/
  @get('/users/me')
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser);
  }

  //*** RESET PASSWORD ***/
  @post('/user/reset-password', {
    responses: {
      '200': {
        description: 'Reset Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                resetPassword: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async resetPassword(
    @requestBody()
    resetPasswordData: ResetPasswordData,
  ): Promise<{ resetPasswordOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    if (resetPasswordData.email) {
      // Check if an user with this email exists
      const usrFilter: Filter = { where: { "email": resetPasswordData.email }};
      const userData = await this.userRepository.findOne(usrFilter);

      if (userData) {
        // Check if the user has already requested to reset the password
        let requestAlreadyDone = false;
        if (userData.passwordRecoveryDate) {
          const requestDiff = new Date().getTime() - new Date(userData.passwordRecoveryDate).getTime();
          const requestHours = requestDiff / 3600000;
          if (requestHours < 24) {
            requestAlreadyDone = true;
          }
        }

        if (requestAlreadyDone) {
          response = {
            code: '20',
            message: 'Request already done in the last 24 hours'
          };
        } else {
          userData.passwordRecoveryDate = new Date().toJSON();
          userData.passwordRecoveryToken = uuidv4();
          await this.userRepository.updateById(userData.idUser, userData);

          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);

          const resetPasswordLink = process.env.PORTAL_URL + '/#/reset-password/?confirm=' + userData.passwordRecoveryToken;

          let emailSubject = process.env.RESET_PASSWORD_EMAIL_SUBJECT;
          emailSubject = emailSubject?.replace(/%firstName%/g, userData.firstName);
          emailSubject = emailSubject?.replace(/%lastName%/g, userData.lastName);

          let emailText = process.env.RESET_PASSWORD_EMAIL_TEXT;
          emailText = emailText?.replace(/%firstName%/g, userData.firstName);
          emailText = emailText?.replace(/%lastName%/g, userData.lastName);
          emailText = emailText?.replace(/%resetPasswordLink%/g, resetPasswordLink);
          
          let htmlText = process.env.RESET_PASSWORD_EMAIL_HTML;
          htmlText = htmlText?.replace(/%firstName%/g, userData.firstName);
          htmlText = htmlText?.replace(/%lastName%/g, userData.lastName);
          htmlText = htmlText?.replace(/%resetPasswordLink%/g, resetPasswordLink);

          const msg = {
            to: userData.email,
            from: process.env.RESET_PASSWORD_EMAIL_FROM_EMAIL,
            fromname: process.env.RESET_PASSWORD_EMAIL_FROM_NAME,
            subject: emailSubject,
            text: emailText,
            html: htmlText,
          }

          await sgMail
            .send(msg)
            .then(() => {
              response = {
                code: '202',
                message: 'Reset password e-mail sent'
              };
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
              console.error(error)
              response = {
                code: '30',
                message: 'Error sending e-mail'
              };
            })
        }
      } else {
        response = {
          code: '10',
          message: 'Email not exists'
        };
      }
    } else {
      response = {
        code: '11',
        message: 'Specify an email'
      };
    }

    return Promise.resolve({ resetPasswordOutcome: response });
  }

  //*** CONFIRM RESET PASSWORD ***/
  @post('/user/confirm-reset-password', {
    responses: {
      '200': {
        description: 'Confirm Reset Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                resetPassword: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async confirmResetPassword(
    @requestBody()
    confirmResetPasswordData: ConfirmResetPasswordData,
  ): Promise<{ confirmResetPasswordOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    if (confirmResetPasswordData.resetPasswordToken) {
      // Check if an user with this token exists
      const usrFilter: Filter = { where: { "passwordRecoveryToken": confirmResetPasswordData.resetPasswordToken }};
      const userData = await this.userRepository.findOne(usrFilter);

      if (userData) {
        // Check if new password is at least 8 characters
        if (confirmResetPasswordData.newPassword.length >= 8) {
          // Password hashing
          userData.password = await this.hasher.hashPassword(confirmResetPasswordData.newPassword);
          userData.passwordRecoveryToken = '';
          await this.userRepository.updateById(userData.idUser, userData);

          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);

          let emailSubject = process.env.CONFIRM_RESET_PASSWORD_EMAIL_SUBJECT;
          emailSubject = emailSubject?.replace(/%firstName%/g, userData.firstName);
          emailSubject = emailSubject?.replace(/%lastName%/g, userData.lastName);

          let emailText = process.env.CONFIRM_RESET_PASSWORD_EMAIL_TEXT;
          emailText = emailText?.replace(/%firstName%/g, userData.firstName);
          emailText = emailText?.replace(/%lastName%/g, userData.lastName);
          
          let htmlText = process.env.CONFIRM_RESET_PASSWORD_EMAIL_HTML;
          htmlText = htmlText?.replace(/%firstName%/g, userData.firstName);
          htmlText = htmlText?.replace(/%lastName%/g, userData.lastName);

          const msg = {
            to: userData.email,
            from: process.env.CONFIRM_RESET_PASSWORD_EMAIL_FROM_EMAIL,
            fromname: process.env.CONFIRM_RESET_PASSWORD_EMAIL_FROM_NAME,
            subject: emailSubject,
            text: emailText,
            html: htmlText,
          }

          await sgMail
            .send(msg)
            .then(() => {
              response = {
                code: '202',
                message: 'Reset password confirmed and e-mail sent'
              };
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
              console.error(error)
              response = {
                code: '201',
                message: 'Reset password confirmed but e-mail not sent'
              };
            })
        } else {
          response = {
            code: '20',
            message: 'New password at least 8 characters'
          };
        }
      } else {
        response = {
          code: '10',
          message: 'Token not exists'
        };
      }
    } else {
      response = {
        code: '11',
        message: 'Specify a token'
      };
    }

    return Promise.resolve({ confirmResetPasswordOutcome: response });
  }

  //*** CHANGE PASSWORD ***/
  @post('/user/change-password', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                resetPassword: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.ProfileEdit] })
  async changePassword(
    @requestBody()
    changePasswordData: ChangePasswordData,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ changePasswordOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    // Check if the current password match
    const userType : string = currentUser.userType;
    const email : string = currentUser.email!;

    const credentials = {
      userType: userType,
      email: email,
      password: changePasswordData.currentPassword
    };
    const user = await this.userService.verifyCredentials(credentials);

    if (user) {
      // Check if new password is at least 8 characters
      if (changePasswordData.newPassword.length >= 8) {
        // Password hashing
        user.password = await this.hasher.hashPassword(changePasswordData.newPassword);
        await this.userRepository.updateById(user.idUser, user);

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        let emailSubject = process.env.CHANGE_PASSWORD_EMAIL_SUBJECT;
        emailSubject = emailSubject?.replace(/%firstName%/g, user.firstName);
        emailSubject = emailSubject?.replace(/%lastName%/g, user.lastName);

        let emailText = process.env.CHANGE_PASSWORD_EMAIL_TEXT;
        emailText = emailText?.replace(/%firstName%/g, user.firstName);
        emailText = emailText?.replace(/%lastName%/g, user.lastName);
        
        let htmlText = process.env.CHANGE_PASSWORD_EMAIL_HTML;
        htmlText = htmlText?.replace(/%firstName%/g, user.firstName);
        htmlText = htmlText?.replace(/%lastName%/g, user.lastName);

        const msg = {
          to: user.email,
          from: process.env.CHANGE_PASSWORD_EMAIL_FROM_EMAIL,
          fromname: process.env.CHANGE_PASSWORD_EMAIL_FROM_NAME,
          subject: emailSubject,
          text: emailText,
          html: htmlText,
        }

        await sgMail
          .send(msg)
          .then(() => {
            response = {
              code: '202',
              message: 'Change password confirmed and e-mail sent'
            };
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((error: any) => {
            console.error(error)
            response = {
              code: '201',
              message: 'Change password confirmed but e-mail not sent'
            };
          })
      } else {
        response = {
          code: '20',
          message: 'New password at least 8 characters'
        };
      }
    } else {
      response = {
        code: '10',
        message: 'Wrong current password'
      };
    }

    return Promise.resolve({ changePasswordOutcome: response });
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
      for (const key in userRep) {
        if (userRep[key]['organizationUser']) {
          usersReturn.push(userRep[key]);
        }
      }
    } else {
      usersReturn = userRep;
    }

    return usersReturn;
  }

  //*** USERS LIST TO INVITE ***/
  @get('/users/invite/{email}/{limit}', {
    responses: {
      '200': {
        description: 'Users List Invite',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationUsersManagement] })
  async usersListInvite(
    @param.path.string('email') email: string,
    @param.path.number('limit') limit: number,
  ): Promise<UsersListInvitation[]> {
    const usersListInvitation : UsersListInvitation[] = [];
    const filter : Filter = {};
    filter.where = {};
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ userType: "operator", emailConfirmed : true, "email": { ilike : '%' + email + '%' }}).build();
    filter.where = where;
    filter.limit = limit;
    filter.order = [ 'lastName', 'firstName', 'email' ];
    const usersReturn: User[] = await this.userRepository.find(filter, { fields: {idUser: true, firstName: true, lastName: true, email: true}});
    for (const key in usersReturn) {
      usersListInvitation.push({
        idUser : usersReturn[key]['idUser']!,
        firstName : usersReturn[key]['firstName'],
        lastName : usersReturn[key]['lastName'],
        email : usersReturn[key]['email'],
      });
    }
    return usersListInvitation;
  }

  //*** INVITE USER ***/
  @authenticate('jwt', { required: [PermissionKeys.OrganizationUsersManagement] })
  @post('/user/invite-organization', {
    responses: {
      '200': {
        description: 'Invite User into Organization',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                invitationOutcome: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async inviteUser(
    @requestBody()
    invitation: Invitation,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ invitationOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    const idUserInvite = invitation.idUser;
    const invitationMessage = invitation.invitationMessage;
    const permissions = invitation.permissions;

    // Get the organization information
    const orFilter: Filter = { where: { "idOrganization": currentUser.idOrganization }};
    const organizationData = await this.organizationRepository.find(orFilter);

    // Check if the operator is already into the organization
    const filter: Filter = { where: { "idUser": idUserInvite, "idOrganization": currentUser.idOrganization, "confirmed": true }};
    const organizationExists = await this.organizationUserRepository.find(filter);

    if (organizationExists.length > 0) {
      response = {
        code: '10',
        message: 'User already assigned to the current organization'
      };
    } else {
      // Get operator information
      const opFilter: Filter = { where: { "idUser": idUserInvite, "userType": "operator" }};
      const userData = await this.userRepository.find(opFilter);

      if (userData.length < 1) {
        response = {
          code: '30',
          message: 'User not exists'
        };
      } else {
        // Delete previous missed invitation from database
        const delFilter: Filter = { where: { "idUser": idUserInvite, "idOrganization": currentUser.idOrganization }};
        const invitationRemove = await this.organizationUserRepository.find(delFilter);

        for (const x in invitationRemove) {
          await this.organizationUserRepository.deleteById(invitationRemove[x].idOrganizationUser);
        }

        // Save the invitation into database
        const newUserOrganization: OrganizationUser = new OrganizationUser();
        newUserOrganization.idOrganization = currentUser.idOrganization;
        newUserOrganization.idUser = idUserInvite;
        newUserOrganization.permissions = [];

        // Set the permissions array
        const arrPermissions = permissions.split(',');
        for (const i in arrPermissions) {
          newUserOrganization.permissions.push(arrPermissions[i]);
        }
        newUserOrganization.confirmed = false;
        newUserOrganization.invitationToken = uuidv4();
        await this.organizationUserRepository.save(newUserOrganization);

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const invitationLink = process.env.PORTAL_URL + '/#/confirm-invitation/?confirm=' + newUserOrganization.invitationToken;

        let emailSubject = process.env.INVITATION_EMAIL_SUBJECT;
        emailSubject = emailSubject?.replace(/%firstName%/g, userData[0].firstName);
        emailSubject = emailSubject?.replace(/%lastName%/g, userData[0].lastName);

        let emailText = process.env.INVITATION_EMAIL_TEXT;
        emailText = emailText?.replace(/%firstName%/g, userData[0].firstName);
        emailText = emailText?.replace(/%lastName%/g, userData[0].lastName);
        emailText = emailText?.replace(/%organizationName%/g, organizationData[0].name);
        emailText = emailText?.replace(/%invitationLink%/g, invitationLink);
        emailText = emailText?.replace(/%invitationMessage%/g, invitationMessage);
        
        let htmlText = process.env.INVITATION_EMAIL_HTML;
        htmlText = htmlText?.replace(/%firstName%/g, userData[0].firstName);
        htmlText = htmlText?.replace(/%lastName%/g, userData[0].lastName);
        htmlText = htmlText?.replace(/%organizationName%/g, organizationData[0].name);
        htmlText = htmlText?.replace(/%invitationLink%/g, invitationLink);
        htmlText = htmlText?.replace(/%invitationMessage%/g, invitationMessage);

        const msg = {
          to: userData[0].email,
          from: process.env.INVITATION_EMAIL_FROM_EMAIL,
          fromname: process.env.INVITATION_EMAIL_FROM_NAME,
          subject: emailSubject,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  //*** CONFIRM INVITATION ***/
  @post('/user/confirm-invitation', {
    responses: {
      '200': {
        description: 'Confirm Invitation into Organization',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                confirmInvitation: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async confirmInvitation(
    @requestBody()
    invitationToken: InvitationTokenData
  ): Promise<{ invitationOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    if (invitationToken.invitationToken) {
      // Check if the invitation token exists
      const invFilter: Filter = { where: { "invitationToken": invitationToken.invitationToken }};
      const invitationData = await this.organizationUserRepository.findOne(invFilter);

      if (invitationData) {
        // Check if the invitation is already confirmed
        if (invitationData.confirmed) {
          response = {
            code: '20',
            message: 'Invitation already confirmed'
          };
        } else {
          // Get the invitation organization
          const orgFilter: Filter = { where: { "idOrganization": invitationData.idOrganization }};
          const invitationOrganization = await this.organizationRepository.findOne(orgFilter);

          let organizationName = '';
          if (invitationOrganization) {
            organizationName = invitationOrganization.name;
          }
          
          // Get the invitation operator
          const opFilter: Filter = { where: { "idUser": invitationData.idUser }};
          const invitationUser = await this.userRepository.findOne(opFilter);

          let userFirstName = '';
          let userLastName = '';
          let userEMail = '';
          if (invitationUser) {
            userFirstName = invitationUser.firstName;
            userLastName = invitationUser.lastName;
            userEMail = invitationUser.email;
          }

          // Update the invitation to confirmed
          invitationData.confirmed = true;
          invitationData.invitationToken = '';

          await this.organizationUserRepository.updateById(invitationData.idOrganizationUser, invitationData);

          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);

          let emailSubject = process.env.INVITATION_CONFIRMED_EMAIL_SUBJECT;
          emailSubject = emailSubject?.replace(/%firstName%/g, userFirstName);
          emailSubject = emailSubject?.replace(/%lastName%/g, userLastName);

          let emailText = process.env.INVITATION_CONFIRMED_EMAIL_TEXT;
          emailText = emailText?.replace(/%firstName%/g, userFirstName);
          emailText = emailText?.replace(/%lastName%/g, userLastName);
          emailText = emailText?.replace(/%organizationName%/g, organizationName);

          let htmlText = process.env.INVITATION_CONFIRMED_EMAIL_HTML;
          htmlText = htmlText?.replace(/%firstName%/g, userFirstName);
          htmlText = htmlText?.replace(/%lastName%/g, userLastName);
          htmlText = htmlText?.replace(/%organizationName%/g, organizationName);

          const msg = {
            to: userEMail,
            from: process.env.INVITATION_CONFIRMED_EMAIL_FROM_EMAIL,
            fromname: process.env.INVITATION_CONFIRMED_EMAIL_FROM_NAME,
            subject: emailSubject,
            text: emailText,
            html: htmlText,
          }
      
          await sgMail
            .send(msg)
            .then(() => {
              response = {
                code: '202',
                message: 'Invitation confirmed and e-mail sent'
              };
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
              console.error(error)
              response = {
                code: '201',
                message: 'Invitation confirmed but e-mail not sent'
              };
            })
        }
      } else {
        response = {
          code: '10',
          message: 'Invitation token not exists'
        };
      }
    } else {
      response = {
        code: '11',
        message: 'Specify a token'
      };
    }

    return Promise.resolve({ invitationOutcome: response });
  }

  //*** REMOVE USER FROM ORGANIZATION ***/
  @post('/user/remove-organization', {
    responses: {
      '200': {
        description: 'Remove User from organization',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                removeOrganizationUser: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationUsersManagement] })
  async removeOrganizationUser(
    @requestBody()
    removeOrganizationUser: OrganizationUserData,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ removeOrganizationUserOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    // Check if this is the last user admin of the organization
    let userRemovable = false;
    const orgFilter: Filter = { where: { "idOrganization": currentUser.idOrganization, "permissions": [ 'OrganizationAdministrator' ], "confirmed": true }};
    const numUsers = await this.organizationUserRepository.find(orgFilter);

    if (numUsers.length > 1) {
      userRemovable = true;
    } else if (numUsers.length === 1) {
      if (numUsers[0].idUser !== removeOrganizationUser.idUser) {
        userRemovable = true;
      }
    }

    if (userRemovable) {
      if (removeOrganizationUser.idUser) {
        // Check if the user exists
        const usrFilter: Filter = { where: { "idUser": removeOrganizationUser.idUser }};
        const userData = await this.userRepository.findOne(usrFilter);

        if (userData) {
          // Check if the user is a operator or gppOperator
          if (userData.userType === 'operator' || userData.userType === 'gppOperator') {
            // Get the authenticated user roles into the organization
            const curOrgUsrFilter: Filter = { where: { "idOrganization": currentUser.idOrganization, "idUser": currentUser.idUser }};
            const curOrganizationUser = await this.organizationUserRepository.findOne(curOrgUsrFilter);

            let authUserAdmin = false;
            if (curOrganizationUser) {
              for (const x in curOrganizationUser.permissions) {
                if (curOrganizationUser.permissions[x] === 'OrganizationAdministrator') {
                  authUserAdmin = true;
                }
              }
            }

            // Check if the user is into the organization
            const orgUsrFilter: Filter = { where: { "idOrganization": currentUser.idOrganization, "idUser": removeOrganizationUser.idUser }};
            const organizationUser = await this.organizationUserRepository.findOne(orgUsrFilter);

            if (organizationUser) {
              // Check if the user is not an administrator
              let userAdmin = false;
              for (const i in organizationUser.permissions) {
                if (organizationUser.permissions[i] === 'OrganizationAdministrator') {
                  userAdmin = true;
                }
              }

              if (authUserAdmin === false && userAdmin === true) {
                response = {
                  code: '21',
                  message: 'Cannot remove an administrator'
                };
              } else {
                // Get the organization name
                const namFilter: Filter = { where: { "idOrganization": currentUser.idOrganization }};
                const organizationInfo = await this.organizationRepository.findOne(namFilter);

                let organizationName  = '';
                if (organizationInfo) {
                  organizationName = organizationInfo.name;
                }

                // Remove the user from organization
                await this.organizationUserRepository.deleteById(organizationUser.idOrganizationUser);

                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                let emailSubject = process.env.REMOVED_FROM_ORGANIZATION_EMAIL_SUBJECT;
                emailSubject = emailSubject?.replace(/%firstName%/g, userData.firstName);
                emailSubject = emailSubject?.replace(/%lastName%/g, userData.lastName);

                let emailText = process.env.REMOVED_FROM_ORGANIZATION_EMAIL_TEXT;
                emailText = emailText?.replace(/%firstName%/g, userData.firstName);
                emailText = emailText?.replace(/%lastName%/g, userData.lastName);
                emailText = emailText?.replace(/%organizationName%/g, organizationName);

                let htmlText = process.env.REMOVED_FROM_ORGANIZATION_EMAIL_HTML;
                htmlText = htmlText?.replace(/%firstName%/g, userData.firstName);
                htmlText = htmlText?.replace(/%lastName%/g, userData.lastName);
                htmlText = emailText?.replace(/%organizationName%/g, organizationName);

                const msg = {
                  to: userData.email,
                  from: process.env.REMOVED_FROM_ORGANIZATION_EMAIL_FROM_EMAIL,
                  fromname: process.env.REMOVED_FROM_ORGANIZATION_EMAIL_FROM_NAME,
                  subject: emailSubject,
                  text: emailText,
                  html: htmlText,
                }
            
                await sgMail
                  .send(msg)
                  .then(() => {
                    response = {
                      code: '202',
                      message: 'Removed from organization and e-mail sent'
                    };
                  })
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .catch((error: any) => {
                    console.error(error)
                    response = {
                      code: '201',
                      message: 'Removed from organization but e-mail not sent'
                    };
                  })
              }
            } else {
              response = {
                code: '13',
                message: 'User is not in your organization'
              };
            }
          } else {
            response = {
              code: '12',
              message: 'User is not an administrator'
            };
          }
        } else {
          response = {
            code: '10',
            message: 'User not exists'
          };
        }
      } else {
        response = {
          code: '11',
          message: 'Specify an user id'
        };
      }
    } else {
      response = {
        code: '20',
        message: 'Cannot remove the last administrator from organization'
      };
    }

    return Promise.resolve({ removeOrganizationUserOutcome: response });
  }

  //*** ASSIGN USER TO GPP ***/
  @post('/user/set-admin', {
    responses: {
      '200': {
        description: 'Set User as GPP Administrator',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                confirmAdmin: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralUsersManagement] })
  async confirmAdmin(
    @requestBody()
    confirmAdmin: OrganizationUserData,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ setAdminOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    if (confirmAdmin.idUser) {
      // Check if the user exists
      const usrFilter: Filter = { where: { "idUser": confirmAdmin.idUser }};
      const userData = await this.userRepository.findOne(usrFilter);

      if (userData) {
        // Check if the user email is already confirmed
        if (userData.emailConfirmed) {
          // Check if the user is an operator
          if (userData.userType === 'operator') {
            // Set the user as administrator
            userData.userType = 'gppOperator';
            await this.userRepository.updateById(userData.idUser, userData);

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            let emailSubject = process.env.ADMIN_CONFIRMED_EMAIL_SUBJECT;
            emailSubject = emailSubject?.replace(/%firstName%/g, userData.firstName);
            emailSubject = emailSubject?.replace(/%lastName%/g, userData.lastName);

            let emailText = process.env.ADMIN_CONFIRMED_EMAIL_TEXT;
            emailText = emailText?.replace(/%firstName%/g, userData.firstName);
            emailText = emailText?.replace(/%lastName%/g, userData.lastName);

            let htmlText = process.env.ADMIN_CONFIRMED_EMAIL_HTML;
            htmlText = htmlText?.replace(/%firstName%/g, userData.firstName);
            htmlText = htmlText?.replace(/%lastName%/g, userData.lastName);

            const msg = {
              to: userData.email,
              from: process.env.ADMIN_CONFIRMED_EMAIL_FROM_EMAIL,
              fromname: process.env.ADMIN_CONFIRMED_EMAIL_FROM_NAME,
              subject: emailSubject,
              text: emailText,
              html: htmlText,
            }
        
            await sgMail
              .send(msg)
              .then(() => {
                response = {
                  code: '202',
                  message: 'Admin confirmed and e-mail sent'
                };
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((error: any) => {
                console.error(error)
                response = {
                  code: '201',
                  message: 'Admin confirmed but e-mail not sent'
                };
              })
          } else {
            response = {
              code: '13',
              message: 'User is not an operator'
            };
          }
        } else {
          response = {
            code: '12',
            message: 'User email not confirmed'
          };
        }
      } else {
        response = {
          code: '10',
          message: 'User not exists'
        };
      }
    } else {
      response = {
        code: '11',
        message: 'Specify an user id'
      };
    }

    return Promise.resolve({ setAdminOutcome: response });
  }

  //*** REMOVE USER FROM GPP ***/
  @post('/user/del-admin', {
    responses: {
      '200': {
        description: 'Remove User as GPP Administrator',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                removeAdmin: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralUsersManagement] })
  async removeAdmin(
    @requestBody()
    removeAdmin: OrganizationUserData,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ delAdminOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    // Check if the user to remove is not himself
    if (removeAdmin.idUser !== currentUser.idUser) {
      if (removeAdmin.idUser) {
        // Check if the user exists
        const usrFilter: Filter = { where: { "idUser": removeAdmin.idUser }};
        const userData = await this.userRepository.findOne(usrFilter);

        if (userData) {
          // Check if the user email is already confirmed
          if (userData.emailConfirmed) {
            // Check if the user is a gppOperator
            if (userData.userType === 'gppOperator') {
              // Set the user as operator
              userData.userType = 'operator';
              await this.userRepository.updateById(userData.idUser, userData);

              const sgMail = require('@sendgrid/mail');
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);

              let emailSubject = process.env.ADMIN_REMOVED_EMAIL_SUBJECT;
              emailSubject = emailSubject?.replace(/%firstName%/g, userData.firstName);
              emailSubject = emailSubject?.replace(/%lastName%/g, userData.lastName);

              let emailText = process.env.ADMIN_REMOVED_EMAIL_TEXT;
              emailText = emailText?.replace(/%firstName%/g, userData.firstName);
              emailText = emailText?.replace(/%lastName%/g, userData.lastName);

              let htmlText = process.env.ADMIN_REMOVED_EMAIL_HTML;
              htmlText = htmlText?.replace(/%firstName%/g, userData.firstName);
              htmlText = htmlText?.replace(/%lastName%/g, userData.lastName);

              const msg = {
                to: userData.email,
                from: process.env.ADMIN_REMOVED_EMAIL_FROM_EMAIL,
                fromname: process.env.ADMIN_REMOVED_EMAIL_FROM_NAME,
                subject: emailSubject,
                text: emailText,
                html: htmlText,
              }
          
              await sgMail
                .send(msg)
                .then(() => {
                  response = {
                    code: '202',
                    message: 'Admin removed and e-mail sent'
                  };
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((error: any) => {
                  console.error(error)
                  response = {
                    code: '201',
                    message: 'Admin removed but e-mail not sent'
                  };
                })
            } else {
              response = {
                code: '13',
                message: 'User is not an administrator'
              };
            }
          } else {
            response = {
              code: '12',
              message: 'User email not confirmed'
            };
          }
        } else {
          response = {
            code: '10',
            message: 'User not exists'
          };
        }
      } else {
        response = {
          code: '11',
          message: 'Specify an user id'
        };
      }
    } else {
      response = {
        code: '14',
        message: 'Cannot specify your id'
      };
    }

    return Promise.resolve({ delAdminOutcome: response });
  }

  //*** REMOVE ALL USER DATA ***/

  //*** EDIT USER PROFILE ***/

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
}
