import { DocumentEncryptedChunk, ContentMediaEncryptedChunk } from '../models';
import { ENCRYPT, DECRYPT, ENCRYPT_STRING } from '../scenarios/zenroom-scenarios'
import { retrieveStringFromIPFS } from '../services/ipfs-service';
import { retrieveJsonFromBlockchain } from './fantom-service';
const zenroom = require('zenroom');
const saltedMd5 = require('salted-md5');

/* 
  This function is using zenroom to encrypt a given string with the password
*/
export function encrypt(stringToEncrypt: string, password: string) {
  const savedLines: any = []

  const printFunction = (text: any) => {
    savedLines.push(text)
  }

  const md5Password = saltedMd5(password, process.env.SALT);

  const keys: any = {
    "password": md5Password
  }

  const data: any = {
    "message": stringToEncrypt
  }

  zenroom
    .print(printFunction)
    .script(ENCRYPT)
    .keys(keys)
    .data(data)
    .zencode_exec()

  return JSON.parse(savedLines);
}

/* 
  This function is using zenroom to decrypt a specific chunk
*/
export async function decrypt(chunk: any, password: string) {
  const savedLines: any = []
  const printFunction = (text: any) => {
    savedLines.push(text)
  }

  let text = chunk.text;
  let checksum = chunk.checksum;
  let header = chunk.header;
  let iv = chunk.iv;
  let ipfsPath = chunk.ipfsPath;

  if (chunk.status === 'COMMITTED' && chunk.transactionId) {
    let json = await retrieveJsonFromBlockchain(chunk.transactionId, chunk.idDocumentEncryptedChunk);
    checksum = json.checksum;
    header = json.header;
    iv = json.iv;
    ipfsPath = json.ipfsPath ? json.ipfsPath : ipfsPath;
  }

  if (ipfsPath) {
    text = await retrieveStringFromIPFS(ipfsPath);
  }

  const md5Password = saltedMd5(password, process.env.SALT);

  const keys: any = {
    "password": md5Password
  }

  const data: any = {
    "secret_message": {
      "checksum": checksum,
      "header": header,
      "iv": iv,
      "text": text
    }
  }
  console.log(data);

  zenroom
    .print(printFunction)
    .script(DECRYPT)
    .keys(keys)
    .data(data)
    .zencode_exec()

  return JSON.parse(savedLines);
}

/* 
  This function is using zenroom to decrypt a specific chunk
*/
export async function decryptContentMedia(chunk: ContentMediaEncryptedChunk, password: string) {
  let text = chunk.text;
  let checksum = chunk.checksum;
  let header = chunk.header;
  let iv = chunk.iv;
  let ipfsPath = chunk.ipfsPath;

  if (chunk.status === 'COMMITTED' && chunk.transactionId) {
    let json = await retrieveJsonFromBlockchain(chunk.transactionId, chunk.idContentMediaEncryptedChunk);
    checksum = json.checksum;
    header = json.header;
    iv = json.iv;
    ipfsPath = json.ipfsPath ? json.ipfsPath : ipfsPath;
  }

  if (ipfsPath) {
    text = await retrieveStringFromIPFS(ipfsPath);
  }

  const savedLines: any = []
  const printFunction = (text: any) => {
    savedLines.push(text)
  }

  const md5Password = saltedMd5(password, process.env.SALT);

  const keys: any = {
    "password": md5Password
  }

  const data: any = {
    "secret_message": {
      "checksum": checksum,
      "header": header,
      "iv": iv,
      "text": text
    }
  }

  zenroom
    .print(printFunction)
    .script(DECRYPT)
    .keys(keys)
    .data(data)
    .zencode_exec()

  return JSON.parse(savedLines);
}

export function encryptString(stringToEncrypt: string, password: string) {
  const savedLines: any = []

  const printFunction = (text: any) => {
    savedLines.push(text)
  }

  const md5Password = saltedMd5(password, process.env.SALT);

  const keys: any = {
    "password": md5Password
  }

  const data: any = {
    "message": stringToEncrypt
  }

  zenroom
    .print(printFunction)
    .script(ENCRYPT_STRING)
    .keys(keys)
    .data(data)
    .zencode_exec()

  return JSON.parse(savedLines);
}

/* 
  This function is using zenroom to decrypt a specific string
*/
export async function decryptString(stringToDerypt: string, checksum: string, header: string, iv: string, password: string) {
  const savedLines: any = []
  const printFunction = (text: any) => {
    savedLines.push(text)
  }

  const md5Password = saltedMd5(password, process.env.SALT);

  const keys: any = {
    "password": md5Password
  }

  const data: any = {
    "secret_message": {
      "checksum": checksum,
      "header": header,
      "iv": iv,
      "text": stringToDerypt
    }
  }

  zenroom
    .print(printFunction)
    .script(DECRYPT)
    .keys(keys)
    .data(data)
    .zencode_exec()

  return JSON.parse(savedLines);
}