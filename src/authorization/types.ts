// GPP imports
import { PermissionKeys } from "./permission-keys";

export interface RequiredPermissions {
    required: PermissionKeys[]
}

export interface MyUserProfile {
    idUser: string;
    userType: string;
    idOrganization?: string;
    email?: string;
    name: string;
    permissions: PermissionKeys[]
}
