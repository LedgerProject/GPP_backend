import { EncryptedChunk } from '../models';
import scenarios from '../services/zenroom-scenarios';
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
    "header": "A very important secret",
    "message": stringToEncrypt
  }

  zenroom
    .print(printFunction)
    .script(scenarios.encrypt())
    .keys(keys)
    .data(data)
    .zencode_exec()

  const objectToSave = JSON.parse(savedLines);
  
  return objectToSave;
}
/* 
  This function is using zenroom to decrypt a specific chunk
*/
export function decrypt(chunk: EncryptedChunk, password:string) {
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
    .script(scenarios.decrypt())
    .keys(keys)
    .data(data)
    .zencode_exec()

  const result = JSON.parse(savedLines);
  
  return result;
}
