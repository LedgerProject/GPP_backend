/* 
  This function is splitting a string in fixed length chars chunks
*/ 
export function chunkString(str: string, length: number) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
