// Loopback imports
import { HttpErrors } from '@loopback/rest';
// Other imports
import * as isEmail from 'isemail';
// GPP imports
import { Credentials } from '../repositories/user.repository';

export function validateCredentials(credentials: Credentials) {
  if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid Email');
  }

  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password length should be greater than 8'
    )
  }
}
