// Loopback imports
import { UserService } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
// GPP imports
import { PasswordHasherBindings } from '../authorization/keys';
import { User } from '../models';
import { Credentials, UserRepository } from '../repositories/user.repository';
import { BcryptHasher } from './hash.password.bcrypt';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) { }
  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        userType: credentials.userType,
        email: credentials.email,
      },
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `user not found with this ${credentials.email}`,
      );
    }

    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      foundUser.password,
    );
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('password is not valid');
    }
    return foundUser;
  }
  convertToUserProfile(user: User): UserProfile {
    let userName = '';
    if (user.firstName) {
      userName = user.firstName;
    }
    if (user.lastName) {
      userName = user.firstName
        ? `${user.firstName} ${user.lastName}`
        : user.lastName;
    }
    return { [securityId]: `${user.idUser}`, name: userName, email: user.email, idUser: user.idUser }
  }
}
