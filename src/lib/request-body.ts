/** Bound bytes before buffering to avoid reading arbitrary request sizes into memory. */
export async function readJson(request:Request,maxBytes=8192):Promise<unknown> {
  if(!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Expected JSON');
  const reader=request.body?.getReader();
  if(!reader) throw new Error('Missing body');
  const chunks:Uint8Array[]=[];
  let length=0;
  try {
    while(true) {
      const {done,value}=await reader.read();
      if(done) break;
      length+=value.byteLength;
      if(length>maxBytes) {await reader.cancel();throw new Error('Too large');}
      chunks.push(value);
    }
  } finally {reader.releaseLock();}
  const bytes=new Uint8Array(length);
  let offset=0;
  for(const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.byteLength;}
  return JSON.parse(new TextDecoder().decode(bytes));
}
