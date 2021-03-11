import { APIROOM_READ_ENDPOINT, APIROOM_STATUS_ENDPOINT, APIROOM_WRITE_DICTIONARY_ENDPOINT, SAWTOOTH_GPP_CONTEXT, SAWTOOTH_READ_URI, SAWTOOTH_STATUS_ENDPOINT, SAWTOOTH_WRITE_URI } from "../constants";
const fetch = require("node-fetch");
/* 
  This function is calling sawtooth to write a json into blockchain
*/
export async function writeIntoBlockchain(jsonObject:any) {

  const apiroomBody: any = {
    "data" : {
      "sawroomEndpoint": SAWTOOTH_WRITE_URI,
      "myContextId1": SAWTOOTH_GPP_CONTEXT,
      "JSONToSave": jsonObject
    }
  }

  const response = await fetch(APIROOM_WRITE_DICTIONARY_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(apiroomBody), 
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });
  const result = await response.json(); //extract JSON from the http response
  // do something with myJson

  console.log(result);
  return result.sawroom[SAWTOOTH_GPP_CONTEXT].batch_id;
}

/* 
  This function is calling sawtooth to read a json into blockchain
*/
export async function retrieveJsonFromBlockchain(batchId:string) {
  const apiroomBody: any = {
      "data": {
        "endpoint": SAWTOOTH_READ_URI,
        "batchId1": batchId
      }
  }

  const response = await fetch(APIROOM_READ_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(apiroomBody), 
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });

  const result = await response.json(); //extract JSON from the http response

  console.log(result);

  return result.sawroom[0];
}

/* 
  This function is calling retrieve transaction status from blockchain
*/
export async function retrieveStatusFromBlockchain(batchId:string) {
  const apiroomBody: any = {
      "data": {
          "endpoint": SAWTOOTH_STATUS_ENDPOINT+batchId,
          "batchId": batchId
      }
  }

  const response = await fetch(APIROOM_STATUS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(apiroomBody), 
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });

  const result = await response.json(); //extract JSON from the http response

  console.log(result);

  return result.data[0].status;
}