import { PermissionKeys } from "./authorization/permission-keys";
import {RequestHandler} from 'express-serve-static-core';

export type FileUploadHandler = RequestHandler;
export type MemoryUploadHandler = RequestHandler;

export interface RequiredPermissions {
    required: PermissionKeys[]
}

export interface MyUserProfile {
    idoperator: string;
    email?: string;
    name: string;
    permissions: PermissionKeys[]
}