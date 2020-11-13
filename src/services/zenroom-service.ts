import { DocumentEncryptedChunk } from '../models';
import { ENCRYPT, DECRYPT } from '../scenarios/zenroom-scenarios'
const zenroom = require('zenroom');
/* 
  This function is using zenroom to encrypt a given string with the password
*/
export function encrypt(stringToEncrypt: string, password:string) {
  const savedLines: any = []

  const printFunction = (text: any) => {
    savedLines.push(text)
  }

  const keys: any = {
    "password": password
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
export function decrypt(chunk: DocumentEncryptedChunk, password:string) {
  const savedLines: any = []
  const printFunction = (text: any) => {
    savedLines.push(text)
  }

  const keys: any = {
    "password": password
  }

  const data: any = {
    "secret_message": {
      "checksum": chunk.checksum,
      "header": chunk.header,
      "iv": chunk.iv,
      "text": chunk.text
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
