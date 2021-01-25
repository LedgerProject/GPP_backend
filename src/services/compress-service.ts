import { BASE64_ENCODING } from '../constants';
const zlib = require('zlib');

/* 
  This function is using zlib to compress a specific string
*/
export function compressString(stringToUpload:string) {
  return zlib.gzipSync(stringToUpload).toString(BASE64_ENCODING);
}

/* 
  This function is using zlib to uncompress a specific string
*/
export function uncompressString(compressedString:string) {
  return zlib.gunzipSync(Buffer.from(compressedString, BASE64_ENCODING)).toString(); 
}
