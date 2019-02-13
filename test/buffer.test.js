// There is a bug in the parser function that prevent to return the correct string

const util = require('util');
const fs = require('fs');

const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const close = util.promisify(fs.close);

const path = `${__dirname}/data/google_taxonomy.json`;
// const path = `${__dirname}/data/citylots.json`;
// const path = `${__dirname}/data/huge.json`;

const store = {
  overlap: '',
  overlapOBJ: ''
};

// preferring for-loop over recursion to avoid `max call stack size exceeded error`
const matchBracket = (buffer, len, brackets) => {
  let counter = 0;
  let index = 0;
  let flag = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const char of buffer) {
    if (char === brackets[0]) {
      counter += 1;
      flag = true;
    } else if (char === brackets[1]) counter -= 1;
    if (counter === 0) if (flag) break;
    index += 1;
  }

  return {
    end: counter === 0,
    index
  };
};

const parse = (buffer, len, start) => {
  let index = start;
  let parsed = {};
  for (; index < len;) {
    const current = buffer[index];
    if (current === 44 || current === 125) {
      parsed = { end: true, string: buffer.toString('utf8', start, index) };
      break;
    };
    if (current === 91 || current === 123) {
      const brackets = current === 91 ? [91, 93] : [123, 125];
      const matchedIndex = matchBracket(buffer, len, brackets);
      const sub = buffer.toString('utf8', start, matchedIndex.index);
      // postponing a bracket if the match is complete
      parsed = {
        end: matchedIndex.end,
        string: sub + (matchedIndex.end ? brackets[1] : '')
      };
      break;
    }
    index += 1;
  }
  if (!parsed.end) parsed = { end: false, string: buffer.toString('utf8', start, len) };
  return parsed;
};

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
        const start = i - target + 1;
        // acc.push(i - target + 1);
        console.log('found');
        acc.push(parse(buffer, len, start));
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
  const search = 'Articolizzini';
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
      const found = find(data.buffer, term).acc;
      // console.log(found);
      // find(data.buffer, term);
      // counter += found.occ;
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