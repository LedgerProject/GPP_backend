import { PermissionKeys } from "./authorization/permission-keys";
import { RequestHandler } from 'express-serve-static-core';

export type FileUploadHandler = RequestHandler;

export interface RequiredPermissions {
    required: PermissionKeys[]
}

export interface MyUserProfile {
    idoperator: string;
    email?: string;
    name: string;
    permissions: PermissionKeys[]
}

export interface TempFile {
    fieldname: string,
    originalname: string,
    tempfilename: string,
    encoding: string,
    mimetype: string,
    size: number
}

export interface CompressImageStatistic {
    input: string,
    path_out_new: string,
    algorithm: string,
    size_in: number,
    size_output: number,
    percent: number,
    err: null
}