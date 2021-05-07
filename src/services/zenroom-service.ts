import { ENCRYPT, DECRYPT } from '../scenarios/zenroom-scenarios';
const zenroom = require('zenroom');
const saltedMd5 = require('salted-md5');
/* 
  This function is using zenroom to encrypt a given string with the password
*/
export function encrypt(stringToEncrypt: string, password:string) {
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
export async function decrypt(chunk: any, password:string) {
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