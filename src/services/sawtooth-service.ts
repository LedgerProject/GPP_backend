/* 
  This function is calling sawtooth to write a json into blockchain
*/
export async function writeIntoBlockchain(json:any) {

  const apiroomBody: any = {
    "keys" : {
      "sawroomEndpoint": "http://195.201.41.35",
      "myContextId1": "global_passport_project_documentsEncryptedChunk"
    },
    "data" : {
      "JSONToSave": json
    }
  }

  const response = await fetch('https://apiroom.net/api/pasfranc/sawtooth-write-my-dictionary', {
    method: 'POST',
    body: apiroomBody, 
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });
  const result = await response.json(); //extract JSON from the http response
  // do something with myJson

  console.log(result);

  return result.sawroom.global_passport_project_documentsEncryptedChunk.batch_id;
}

/* 
  This function is callingsawtooth to read a json into blockchain
*/
export async function retrieveJsonFromBlockchain(batchId:string) {
  const apiroomBody: any = {
      "data": {
        "endpoint": "http://195.201.42.48",
        "batchId1": batchId
      }
  }

  const response = await fetch('https://apiroom.net/api/pasfranc/sawtooth-read', {
    method: 'POST',
    body: apiroomBody, 
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });

  const result = await response.json(); //extract JSON from the http response

  console.log(result);

  return result.sawroom[0].JSONToSave
}

/* 
  This function is calling retrieve transaction status from blockchain
*/
export async function retrieveStatusFromBlockchain(batchId:string) {
  const apiroomBody: any = {
      "data": {
          "endpoint": "http://195.201.41.35:8008/batch_statuses?id="+batchId,
          "batchId": batchId
      }
  }

  const response = await fetch('https://apiroom.net/api/pasfranc/sawtooth-read-status', {
    method: 'POST',
    body: apiroomBody, 
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });

  const result = await response.json(); //extract JSON from the http response

  console.log(result);

  return result.data.status;
}