import { APIROOM_READ_ENDPOINT, APIROOM_WRITE_DICTIONARY_ENDPOINT, SAWROOM_READ_URI, SAWROOM_WRITE_URI } from "../constants";
const fetch = require("node-fetch");
/* 
  This function is calling SAWROOM to write a json into blockchain
*/
const headers = {
  'Content-Type': 'application/json',
  'accept': 'application/json'
};

export async function writeIntoBlockchain(jsonObject:any) {

  const messageToEncrypt = JSON.stringify(jsonObject);

  const apiroomBody: any = {
    "data" : {
      "sawroomEndpoint": SAWROOM_WRITE_URI,
      "message": messageToEncrypt,
      "password": process.env.SALT
    }
  }

  const response = await fetch(APIROOM_WRITE_DICTIONARY_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(apiroomBody), 
    headers: headers
  });
  
  try {
    const result = await response.json();

    return result.transactionId;
  } catch (err) {
    console.log(".writeIntoBlockchain ERROR: Impossible to WRITE to SAWROOM: ", err);
  }

}

/* 
  This function is calling SAWROOM to read a json into blockchain
*/
export async function retrieveJsonFromBlockchain(transactionId:string) {
  const apiroomBody: any = {
      "data": {
        "endpoint": SAWROOM_READ_URI,
        "password": process.env.SALT,
        "transactionId": transactionId
      }
  }

  const response = await fetch(APIROOM_READ_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(apiroomBody), 
    headers: headers
  });

  try {
    const result = await response.json();

    return JSON.parse(result.textDecrypted);
  } catch (err) {
    console.log(".retrieveJsonFromBlockchain ERROR: Impossible to READ from SAWROOM: ", err);
  }
}