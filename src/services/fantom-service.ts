import { FANTOM_READ_ENDPOINT, FANTOM_WRITE_ENDPOINT } from "../constants";
import { encryptString, decryptString } from '../services/zenroom-service';
const fetch = require("node-fetch");
/* 
  This function is calling FANTOM to write a json into blockchain
*/
const headers = {
  'Content-Type': 'application/json',
  'accept': 'application/json'
};

export async function writeIntoBlockchain(jsonObject: any) {

  const messageToEncrypt = JSON.stringify(jsonObject);
  const salt = process.env.SALT || '';

  const encryptedJson = await encryptString(messageToEncrypt, salt);

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
export async function retrieveJsonFromBlockchain(transactionId: string, idDocument: string) {

  const apiFantomUrl = `${FANTOM_READ_ENDPOINT}/${transactionId}`

  const response = await fetch(apiFantomUrl, {
    method: 'GET',
    headers: headers
  });

  try {
    const res = await response;
    console.log("LEGGO DA BLOCKCHAIN");
    console.log(res);
    console.log(res.text());
    const result = await response.json();

    let resultingJSON = JSON.parse(result);

    const decodedJSON = await decryptString(resultingJSON.text, resultingJSON.checksum, resultingJSON.header, resultingJSON.iv, idDocument);

    return decodedJSON;
  } catch (err) {
    console.log(".retrieveJsonFromBlockchain ERROR: Impossible to READ from FANTOM: ", err);
  }
}