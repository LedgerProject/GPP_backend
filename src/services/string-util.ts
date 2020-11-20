/* 
  This function is splitting a string in fixed length chars chunks
*/ 
export function chunkString(str: string, length: number) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

/* 
  This function is splitting a string in fixed length chars chunks
*/
export function generateFixedLengthRandomString(alphabet:string, length:number) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}