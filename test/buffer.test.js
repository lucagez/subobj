const util = require('util');
const fs = require('fs');

const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const close = util.promisify(fs.close);

const path = `${__dirname}/data/google_taxonomy.json`;
// const path = `${__dirname}/data/citylots.json`;
// const path = `${__dirname}/data/huge.json`;

const forro = data => {
  return new Promise((resolve, reject) => {
    for (const byte of data) {
      // if (byte === 65) a = 'A';
    }
    // console.log('yeah')
    resolve('ciao');
  });
}

const find = (buffer, search) => {
  const searchArr = search.split('').map(e => e.charCodeAt(0));
  const target = searchArr.length;
  let index = 0;
  let occ = 0;
  let i = 0;
  let len = buffer.length;
  const acc = [];

  for (;;) {
    const current = searchArr[index];
    if (i === len) break;
    if (buffer[i] === current) {
      // console.log(buffer[i]);
      index += 1;
      if (index === target) {
        occ += 1;
        index = 0;
        acc.push(i - target + 1);
      };
    } else {
      index = 0;
    }
    i += 1;
  }
  // console.log(occ);
  return {
    acc,
    occ
  };
}

(async () => {
  const search = 'Accessori batteria';
  const term = `"${search}":`;

  const t = Date.now();
  const chunk = 4096 * 1024;
  const bsize = chunk + Buffer.from(term).length - 1;
  const buffer = Buffer.alloc(bsize);
  const f = await open(path, 'r');
  let i = 0;

  let counter = 0;
  for(;;) {
    const data = await read(f, buffer, 0, bsize, i * chunk);
    
    // console.log(data.buffer[3]);
    // console.log(data.buffer[18]);
    // await forro(data.buffer);

    // const search = 0;
    // const index = data.buffer.indexOf(search);
    if (data.buffer.indexOf(term) !== -1) {
      const found = find(data.buffer, term);
      counter += found.occ;
      console.log(found.acc);
      console.log(data.buffer[found.acc[0]])
      console.log(data.buffer[found.acc[0] + 1])
      console.log(data.buffer[found.acc[0] + 2])
      console.log(data.buffer[found.acc[0] + 3])
      console.log(data.buffer[found.acc[0] + 4])
    }

    if (data.bytesRead !== bsize) break;
    i += 1;
  }
  await close(f);
  console.log(counter);
  // const mem = process.memoryUsage().heapUsed / 1024 / 1024;
  // console.log(`The script uses approximately ${mem.toFixed(1)} MB`);
  console.log(Date.now() - t);
})();


// sync
// const t1 = Date.now();
// fs.readFileSync(path);
// console.log('sync', Date.now() - t1);