//Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { post} from '@loopback/rest';
import { UserProfile } from '@loopback/security';
//GPP imports
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../authorization/keys';
import { PermissionKeys } from '../authorization/permission-keys';
import { UserToken } from '../models/user-token.model';
import { UserTokenRepository, OrganizationsUsersViewRepository, OrganizationUserRepository, UserRepository } from '../repositories';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { JWTService } from '../services/jwt-service';
import { MyUserService } from '../services/user.service';
import { generateFixedLengthRandomString } from '../services/string-util';
import { ALPHABET_CHARS, MINUTES_IN_MILLISECONDS, USER_TOKEN_DEFAULT_VALIDITY_IN_MINS, USER_TOKEN_LENGTH } from '../constants';

export class UserTokenController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTokenRepository)
    public userTokenRepository: UserTokenRepository,
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

  //*** USER TOKEN GENERATION ***/
  @post('/users-token')
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async postUserToken(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<UserToken>  {
    const userToken: UserToken = new UserToken();
    userToken.idUser = currentUser.idUser;
    let token = generateFixedLengthRandomString(ALPHABET_CHARS, USER_TOKEN_LENGTH);
    let notExistingToken  = true;

    //Try generating token until you find a free token
    while(notExistingToken){
      const filter: Filter = { where: { "token": token } };
      const foundTokens = await this.userTokenRepository.find(filter);
      if (foundTokens.length > 0){
        token = generateFixedLengthRandomString(ALPHABET_CHARS, USER_TOKEN_LENGTH);
      } else {
        notExistingToken = false;
      }
    }

    userToken.token = token;
    if (!userToken.validUntil){
      userToken.validUntil = new Date(new Date().getTime() + USER_TOKEN_DEFAULT_VALIDITY_IN_MINS * MINUTES_IN_MILLISECONDS).getTime();
    }
    await this.userTokenRepository.save(userToken);
    return userToken;
  }
}
