import { BASE64_ENCODING } from '../constants';
const zlib = require('zlib');

/* 
  This function is using zlib to compress a specific string
*/
export function compressString(stringToUpload:string) {

  let data = '';
  zlib.gzip(stringToUpload, (err:any, buffer:any) => { 
  
    if (!err) { 
      data +=buffer.toString(BASE64_ENCODING);
       
    }  
    else { 
      console.log("ERROR"+ err); 
    }
  });

  return data;
}

/* 
  This function is using zlib to uncompress a specific string
*/
export function uncompressString(compressedString:string) {
  let data = '';
  zlib.gunzip(compressedString, (err:any, buffer:any) => { 
  
    if (!err) { 
      data +=buffer.toString(BASE64_ENCODING);
       
    }  
    else { 
      console.log("ERROR"+ err); 
    }
  });

  return data;
}