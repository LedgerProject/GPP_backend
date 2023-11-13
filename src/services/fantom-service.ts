import { FANTOM_READ_ENDPOINT, FANTOM_WRITE_ENDPOINT } from "../constants";
import { encryptString, decryptString } from '../services/zenroom-service';
const saltedMd5 = require('salted-md5');
const fetch = require("node-fetch");
/* 
  This function is calling FANTOM to write a json into blockchain
*/
const headers = {
  'Content-Type': 'application/json',
  'accept': 'application/json'
};

export async function writeIntoBlockchain(jsonObject: any, chunkId: string) {

  const messageToEncrypt = JSON.stringify(jsonObject);
  const salt = process.env.SALT || '';
  const md5Password = saltedMd5(chunkId, salt);

  const encryptedJson = await encryptString(messageToEncrypt, md5Password);

  const response = await fetch(FANTOM_WRITE_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(encryptedJson),
    headers: headers
  });

  try {
    const result = await response.json();

    return result;
  } catch (err) {
    console.log(".writeIntoBlockchain ERROR: Impossible to WRITE to FANTOM: ", err);
  }

}

/* 
  This function is calling FANTOM to read a json into blockchain
*/
export async function retrieveJsonFromBlockchain(transactionId: string, chunkId: string) {

  const apiFantomUrl = `${FANTOM_READ_ENDPOINT}/${transactionId}`

  const response = await fetch(apiFantomUrl);
  const salt = process.env.SALT || '';
  const md5Password = saltedMd5(chunkId, salt);


  try {

    const result = await response.json();

    let resultingJSON = result.secret_message;

    const decodedJSON = await decryptString(resultingJSON.text, resultingJSON.checksum, resultingJSON.header, resultingJSON.iv, md5Password);

    return decodedJSON;
  } catch (err) {
    console.log(".retrieveJsonFromBlockchain ERROR: Impossible to READ from FANTOM: ", err);
  }
}