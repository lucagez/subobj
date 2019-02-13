const util = require('util');
const fs = require('fs');

const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const close = util.promisify(fs.close);

// const path = `${__dirname}/data/google_taxonomy.json`;
// const path = `${__dirname}/data/citylots.json`;
const path = `${__dirname}/data/huge.json`;

const forro = data => {
  return new Promise((resolve, reject) => {
    for (const byte of data) {
      // if (byte === 65) a = 'A';
    }
    // console.log('yeah')
    resolve('ciao');
  });
}

(async () => {
  const t = Date.now();
  const bsize = 4096 * 1024;
  const buffer = Buffer.alloc(bsize);
  const f = await open(path, 'r');
  let i = 0;
  for(;;) {
    const data = await read(f, buffer, 0, bsize, i * bsize);
    
    // console.log(data.buffer[3]);
    // console.log(data.buffer[18]);
    // await forro(data.buffer);

    // const search = 0;
    // const index = data.buffer.indexOf(search);
    // console.log(data.buffer.indexOf(0340650980981051031080));

    // console.log(data)

    if (data.bytesRead !== bsize) break;
    i += 1;
  }
  await close(f);
  // const mem = process.memoryUsage().heapUsed / 1024 / 1024;
  // console.log(`The script uses approximately ${mem.toFixed(1)} MB`);
  console.log(Date.now() - t);
})();


// sync
// const t1 = Date.now();
// fs.readFileSync(path);
// console.log('sync', Date.now() - t1);