// Loopback imports
import { AuthenticationBindings, AuthenticationMetadata } from '@loopback/authentication';
import { Getter, globalInterceptor, Interceptor, InvocationContext, InvocationResult, Provider, ValueOrPromise } from '@loopback/context';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
// Other imports
import { intersection } from 'lodash';
import { PermissionKeys } from '../authorization/permission-keys';
// GPP imports
import { MyUserProfile, RequiredPermissions } from '../authorization/types';
import { UserTypeKeys } from '../authorization/user-type-keys';
import { OrganizationUserRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', { tags: { name: 'authorize' } })
export class AuthorizeInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA) public metadata: AuthenticationMetadata,
    @inject.getter(AuthenticationBindings.CURRENT_USER) public getCurrentUser: Getter<MyUserProfile>,
    @repository(OrganizationUserRepository) public organizationUserRepository: OrganizationUserRepository,
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // Add pre-invocation logic here
    if (!this.metadata) return next();

    const requiredPermissions = this.metadata.options as RequiredPermissions;
    // console.log("Required Permissions: ", requiredPermissions)

    const user = await this.getCurrentUser();
    // console.log("User Permissions: ", user.permissions)

    const results = intersection(user.permissions, requiredPermissions.required).length;
    
    if (!results) { // if (results !== requiredPermissions.required.length) {
      throw new HttpErrors.Forbidden('INVALID ACCESS PERMISSIONS');
    }
    // Check if the operator is yet in the organization (if selected)
    if (user.idOrganization) {
      const orgUsrFilter: Filter = { where: { "idOrganization": user.idOrganization, "idUser": user.idUser, "confirmed": true }};
      const organizationUser = await this.organizationUserRepository.findOne(orgUsrFilter);

      if (!organizationUser) {
        throw new HttpErrors.Forbidden('YOU HAVE NO MORE THIS PERMISSION');
      } else {
        let permissions = [''];

        switch (user.userType) {
          case UserTypeKeys.gppOperator:
            permissions = [
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
            permissions = [
              PermissionKeys.CheckTokenDocWallet,
              PermissionKeys.OrganizationCreation,
              PermissionKeys.OrganizationUpdate,
              PermissionKeys.OrganizationDetail,
              PermissionKeys.OrganizationDelete,
              PermissionKeys.MyOrganizationList,
              PermissionKeys.NationalitiesList,
              PermissionKeys.AuthFeatures,
              PermissionKeys.ProfileEdit
            ];
            break;
        }

        if (organizationUser.permissions.includes(PermissionKeys.OrganizationAdministrator)) {
          permissions.push(PermissionKeys.OrganizationUsersManagement);
          permissions.push(PermissionKeys.OrganizationStructuresManagement);
          permissions.push(PermissionKeys.StructureCreation);
          permissions.push(PermissionKeys.StructureUpdate);
          permissions.push(PermissionKeys.StructureList);
          permissions.push(PermissionKeys.StructureDetail);
          permissions.push(PermissionKeys.StructureDelete);
        } else {
          if (organizationUser.permissions.includes(PermissionKeys.OrganizationUsersManagement)) {
            permissions.push(PermissionKeys.OrganizationUsersManagement);
          }
          if (organizationUser.permissions.includes(PermissionKeys.OrganizationStructuresManagement)) {
            permissions.push(PermissionKeys.OrganizationStructuresManagement);
            permissions.push(PermissionKeys.StructureCreation);
            permissions.push(PermissionKeys.StructureUpdate);
            permissions.push(PermissionKeys.StructureList);
            permissions.push(PermissionKeys.StructureDetail);
            permissions.push(PermissionKeys.StructureDelete);
          }
        }

        const results2 = intersection(permissions, requiredPermissions.required).length;
        
        if (!results2) {
          throw new HttpErrors.Forbidden('YOU HAVE NO MORE THIS PERMISSION2');
        }
      }
    }

    const result = await next();
    return result;
  }
}
