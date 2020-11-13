// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
    BindingScope,
    config,
    ContextTags,
    injectable,
    Provider,
  } from '@loopback/core';
  import multer from 'multer';
  import { Request } from '@loopback/rest';
  import {MEMORY_UPLOAD_SERVICE} from '../keys';
  import {MemoryUploadHandler} from '../types';
  
  /**
   * A provider to return an `Express` request handler from `multer` middleware
   */
  @injectable({
    scope: BindingScope.TRANSIENT,
    tags: {[ContextTags.KEY]: MEMORY_UPLOAD_SERVICE},
  })
  export class MemoryUploadProvider implements Provider<MemoryUploadHandler> {
    constructor(@config() private options: multer.Options = {}) {}
  
    value(): MemoryUploadHandler {
      return multer(this.options).any();
    }
  }
  
  export function getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
      buffer: f.buffer
    });

    let files: any[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return files;
  }