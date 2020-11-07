/* 
  This function is splitting a string in fixed length chars chunks
*/ 
export function chunkString(bytes: string, length: number) {

  var size = bytes.length;
  var buf = Buffer.from(bytes);
  let str:string[] = [];

  let i:any;
  let start:any=0;
  console.log(size)
  if (length > size){
    length=size;
  }
  console.log(start, " -> ",length)
  str.push(buf.toString('hex', start, length));
  while (length < size) {
    start=start+length;
    length=length+length
    if (length > size){
      length=size;
    }
    console.log(start, " -> ",length)
    str.push(buf.toString('hex', start, length));
  }
  str = clean(str,"");
  console.log(str);
  return str;
  //return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function clean(array:string[], deleteValue:string) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == deleteValue) {         
      array.splice(i, 1);
      i--;
    }
  }
  return array;
};