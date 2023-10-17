// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * Max number of chars for file chunks
 */
export const CHUNK_MAX_CHAR_SIZE: number = 700000;

/**
 * Max number of chars for file chunks
 */
export const BASE64_ENCODING: string = 'base64';

/**
 * Alphabet chars
 */
export const ALPHABET_CHARS: string = '0123456789';

/**
 * User token LENGTH
 */
export const USER_TOKEN_LENGTH: number = 6;

/**
 * Milliseconds needed to have a minute
 */
export const MINUTES_IN_MILLISECONDS: number = 60000;

/**
 * Default value for user token validity
 */
export const USER_TOKEN_DEFAULT_VALIDITY_IN_MINS = 30;

/**
 * Default value for user block check token validity
 */
export const USER_BLOCK_REQUEST_TOKEN_DEFAULT_VALIDITY_IN_MINS = 60;

/**
 * Attachment filename
 */
export const ATTACHMENT_FILENAME = 'attachment; filename=';

/**
 * Fantom endpoints
 */
export const FANTOM_RPC_ENDPOINT = process.env.FANTOM_RPC_ENDPOINT;

export const FANTOM_CONTRACT_ADDRESS = process.env.FANTOM_CONTRACT_ADDRESS;

export const FANTOM_WALLET_PRIVATE_KEY = process.env.FANTOM_WALLET_PRIVATE_KEY;


