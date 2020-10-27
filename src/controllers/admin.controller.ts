import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { getJsonSchemaRef, getModelSchemaRef, post, requestBody } from "@loopback/rest";
import * as _ from 'lodash';
import { PermissionKeys } from "../authorization/permission-keys";
import { PasswordHasherBindings } from "../keys";
import { User } from "../models";
import { UserRepository } from "../repositories";
import { BcryptHasher } from "../services/hash.password.bcrypt";
import { validateCredentials } from "../services/validator";

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


export class AdminController {
  constructor(
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/admin', {
    responses: {
      '200': {
        description: 'Admin',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async create(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          title: 'NewUser',
          exclude: ['isuser', 'permissions', 'additionalProp1'],
        }),
      },
    },
  })
  admin: User) {
    validateCredentials(_.pick(admin, ['email', 'password']));
    admin.permissions = [
      PermissionKeys.BlogManagement,
      PermissionKeys.UserManagement
    ]
    admin.password = await this.hasher.hashPassword(admin.password);
    const newAdmin = await this.userRepository.create(admin);
    delete newAdmin.password;

    return newAdmin;
  }

}
