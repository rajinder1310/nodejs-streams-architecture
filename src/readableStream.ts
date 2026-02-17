const fs = require('fs');

const stream = fs.createReadStream('test.txt');

stream.on('data', (chunk: Buffer) => {
  console.log('Chunk received:', chunk.toString());
  console.log('Chunk length:', chunk.length); //it is 65kb size
});

stream.on('end', () => {
  console.log('✅ Stream finished!');
});
