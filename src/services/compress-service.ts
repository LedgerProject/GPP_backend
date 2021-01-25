import { BASE64_ENCODING } from '../constants';
const zlib = require('zlib');

/* 
  This function is using zlib to compress a specific string
*/
export async function compressString(stringToUpload:string) {
  return zlib.deflateSync(stringToUpload).toString(BASE64_ENCODING);
}

/* 
  This function is using zlib to uncompress a specific string
*/
export async function uncompressString(compressedString:string) {
  return zlib.inflateSync(Buffer.from(compressedString, BASE64_ENCODING)).toString(); 
}
