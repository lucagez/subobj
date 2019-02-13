// multi-thread via https://github.com/audreyt/node-webworker-threads

const util = require('util');
const fs = require('fs');
const numCPUs = require('os').cpus().length;

// file interactions
const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const close = util.promisify(fs.close);

// Available test datasets
// const path = `${__dirname}/data/google_taxonomy.json`;
// const path = `${__dirname}/data/citylots.json`;
const path = `${__dirname}/data/huge.json`;

// ############  UTILS  ############
let promises = [];
const parsePromise = index => {
  return new Promise((resolve, reject) => {
    resolve(`ciao ${index}`);
  });
};

const find = (buffer, search) => {
  const target = search.length;
  const len = buffer.length;
  let sIndex = 0;
  const accumulator = [];

  let i = 0;
  for (;;) {
    const current = search[sIndex];
    if (i === len) break;
    if (buffer[i] === current) {
      sIndex += 1;
      if (sIndex === target) {
        sIndex = 0;
        const start = i - target + 1;
        accumulator.push(start);

        promises.push(parsePromise(start));
      }
    } else {
      sIndex = 0;
    }
    i += 1;
  }
  return accumulator;
};

// const findINDEXOF = (buffer, search) => {
//   const matches = [];
//   let lastMatch;
//   // Equivalent to for solution
//   // while ((lastMatch = buffer.indexOf(searchStr, lastMatch + searchStr.length)) != -1) {
//   //   matches.push(lastMatch);
//   // }
//   for (;;) {
//     lastMatch = buffer.indexOf(search, lastMatch + search.length);
//     if (lastMatch === -1) break;
//     matches.push(lastMatch);
//   }
//   return matches;
// };

// ############  FLOW  ############

(async () => {
  // what to look for
  const search = 'type';
  const searchStr = `"${search}":`;
  const searchArr = searchStr.split('').map(e => e.charCodeAt(0));

  // Init execution time
  const t = Date.now();

  // Two measures:
  // - [1] chunk => dimension in kilobyte of the reading unit
  // - [2] bsize => effective dimension of the buffer. It's bigger than the `chunk` to overlap
  // the pieces that got red to avoid edge cases (eg. property name between two chunks)
  const chunk = 4096 * 1024;
  const bsize = chunk + Buffer.from(searchStr).length - 1;
  const buffer = Buffer.alloc(bsize);

  const f = await open(path, 'r');

  let i = 0;
  for (;;) {
    const data = await read(f, buffer, 0, bsize, i * chunk);

    // If search term is found inside analized buffer..
    const firstMatch = data.buffer.indexOf(searchStr);
    if (firstMatch !== -1) {
      const matches = find(data.buffer, searchArr);

      // test with promises
      // promises = [];
      // async parse => Promise.all()
      // let extractions = [];
      // let j = 0;
      // for (;;) {
      //   promises.push(doSomethingAsync(matches[j]));
      //   j += 1;
      // }
      // await Promise.all(promises);

      // const extractions = matches.map(match => parse(match));
      // Promise.all(extractions).then(data => data);
      // return;
    }

    // Using indexOF method
    // const matches = findINDEXOF(data.buffer, searchStr);
    // c += matches.length;

    // The following condition is met at the last buffer that gets read
    // as its length will be minor of each previous buffer
    if (data.bytesRead !== bsize) break;
    i += 1;
  }
  await close(f);
  console.log(numCPUs);

  // ############  STATS  ############
  // Printing memory usage
  const mem = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${mem.toFixed(1)} MB`);

  // Printing execution time
  console.log('It took:', `${Date.now() - t}ms`);
})();
