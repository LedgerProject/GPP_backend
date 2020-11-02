import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { promisify } from 'util';
import { TokenServiceBindings } from '../keys';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService {
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret: string;
  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
  public readonly jwtExpiresIn: string;

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error while generating token : userprofile is null',
      );
    }
    let token = '';
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized(`error generating token ${err}`);
    }
    return token;
  }
  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }
    let userProfile: UserProfile;
    try {
      // decode user profile from token
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        { [securityId]: '', name: '', permissions: [] },
        {
          idUser: decryptedToken.idUser,
          userType: decryptedToken.userType,
          name: decryptedToken.name,
          permissions: decryptedToken.permissions,
          idOrganization: decryptedToken.idOrganization,
          email: decryptedToken.email
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }
}
