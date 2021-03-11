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
export const ALPHABET_CHARS : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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
 * Sawtooth endpoints
 */
export const SAWTOOTH_WRITE_URI = 'http://195.201.41.35';

export const SAWTOOTH_READ_URI = 'http://195.201.42.48';

export const SAWTOOTH_STATUS_URI = SAWTOOTH_WRITE_URI+':8008';

export const SAWTOOTH_STATUS_PATH = '/batch_statuses?id=';

export const SAWTOOTH_STATUS_ENDPOINT = SAWTOOTH_STATUS_URI+SAWTOOTH_STATUS_PATH;

export const SAWTOOTH_GPP_CONTEXT = 'global_passport_project_documentsEncryptedChunk';

export const APIROOM_BASE_URI = 'https://apiroom.net/api/pasfranc';

export const APIROOM_WRITE_DICTIONARY_ENDPOINT = APIROOM_BASE_URI+ '/sawtooth-write-my-dictionary';

export const APIROOM_READ_ENDPOINT = APIROOM_BASE_URI+ '/sawtooth-read';

export const APIROOM_STATUS_ENDPOINT = APIROOM_BASE_URI+ '/sawtooth-read-status';


