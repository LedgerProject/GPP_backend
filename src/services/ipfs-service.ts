const createClient = require('ipfs-http-client');
const client = createClient(process.env.IPFS_GATEWAY);

/* 
  This function is using ipfs to upload a specific string
*/
export async function uploadStringToIPFS(stringToUpload:string) {
  try {
    const results = await client.add(stringToUpload);
    return results.path;
  } catch(err){
    console.log(".uploadStringToIPFS ERROR: Impossible to UPLOAD to IPFS: ",err);
  }
}

/* 
  This function is using ipfs to retrieve a specific string given a path
*/
export async function retrieveStringFromIPFS(path:string) {
  try {
    const stream = client.cat(path)
    let data = ''

    for await (const chunk of stream) {
      // chunks of data are returned as a Buffer, convert it back to a string
      data += chunk.toString()
    }

    return data; 
  } catch (err) {
    console.log(".retrieveStringFromIPFS ERROR: Impossible to RETRIEVE from IPFS: ",err);
  }
}
