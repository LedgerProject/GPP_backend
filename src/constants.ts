// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * Max number of chars for file chunks
 */
export const CHUNK_MAX_CHAR_SIZE : number = 700000;

/**
 * Max number of chars for file chunks
 */
export const BASE64_ENCODING : string = 'base64';

/**
 * Alphabet chars
 */
export const ALPHABET_CHARS : string = '0123456789';

/**
 * User token LENGTH
 */
export const USER_TOKEN_LENGTH : number = 6;

/**
 * Milliseconds needed to have a minute
 */
export const MINUTES_IN_MILLISECONDS : number = 60000;

/**
 * Default value for user token validity
 */
export const USER_TOKEN_DEFAULT_VALIDITY_IN_MINS = 5;

/**
 * Attachment filename
 */
export const ATTACHMENT_FILENAME = 'attachment; filename=';

/**
 * Sawroom endpoints
 */
export const SAWROOM_WRITE_URI = process.env.SAWROOM_WRITE_URI!;

export const SAWROOM_READ_URI = process.env.SAWROOM_READ_URI!;

export const APIROOM_BASE_URI = process.env.APIROOM_BASE_URI!;

export const APIROOM_WRITE_DICTIONARY_ENDPOINT = APIROOM_BASE_URI+process.env.APIROOM_WRITE_DICTIONARY_PATH!;

export const APIROOM_READ_ENDPOINT = APIROOM_BASE_URI+process.env.APIROOM_READ_PATH!;


