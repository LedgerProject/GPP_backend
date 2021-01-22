import { DocumentEncryptedChunk } from '../models';
import { ENCRYPT, DECRYPT } from '../scenarios/zenroom-scenarios'
import { retrieveStringFromIPFS } from '../services/ipfs-service';
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
export function decrypt(chunk: DocumentEncryptedChunk, password:string) {

  let text = chunk.text;
  if(chunk.ipfsPath){
    retrieveStringFromIPFS(chunk.ipfsPath).then((result:any)=>{
      if(result){
        // console.log("Reading result from IPFS");
        // console.log(result);
        text = result;
      }
    });
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
      "checksum": chunk.checksum,
      "header": chunk.header,
      "iv": chunk.iv,
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
