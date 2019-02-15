// multi-thread via https://github.com/audreyt/node-webworker-threads

const util = require('util');
const fs = require('fs');
// const numCPUs = require('os').cpus().length;

// file interactions
const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const close = util.promisify(fs.close);
const write = fs.createWriteStream('out.json');

// Available test datasets
// const path = `${__dirname}/data/google_taxonomy.json`;
const path = `${__dirname}/data/citylots.json`;
// const path = `${__dirname}/data/huge.json`;

// ############  PARSER  ############
// preferring for-loop over recursion to avoid `max call stack size exceeded error`
const matchBracket = (buffer, len, start, brackets) => {
  let index = start;
  let counter = 0;
  let flag = false;
  for (;;) {
    const current = buffer[index];
    if (current === brackets[0]) {
      counter += 1;
      flag = true;
    } else if (current === brackets[1]) {
      counter -= 1;
      if (counter === 0) if (flag) break;
    }
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
  for (;;) {
    const current = buffer[index];
    if (index === len) break;
    // 44: `comma`, 125: `}`
    if (current === 44 || current === 125) {
      parsed = { end: true, string: '{' + buffer.toString('utf8', start, index) + '}' };
      break;
    }
    // 91: `[`, 123: `{`
    if (current === 91 || current === 123) {
      // brackets = [`[`, `]`] or [`{`, `}`]
      const brackets = current === 91 ? [91, 93] : [123, 125];
      const matchedIndex = matchBracket(buffer, len, start, brackets);
      const sub = buffer.toString('utf8', start, matchedIndex.index);
      // postponing a bracket if the match is complete
      parsed = {
        end: matchedIndex.end,
        string: '{' + sub + (matchedIndex.end ? String.fromCharCode(brackets[1]) : '') + '}'
      };
      break;
    }
    index += 1;
  }
  if (!parsed.end) parsed = { end: false, string: '{' + buffer.toString('utf8', start, len) + '}' };

  return parsed;
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

        accumulator.push(parse(buffer, len, start));
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
//   // Equivalent to for solutionGEZ
//   // while ((lastMatch = bufferGEZastMatch + searchStr.length)) != -1) {
//   //   matches.push(lastMatch);GEZ
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
  write.write('[');

  let i = 0;
  for (;;) {
    const data = await read(f, buffer, 0, bsize, i * chunk);

    // If search term is found inside analized buffer..
    let matches;
    const firstMatch = data.buffer.indexOf(searchStr);
    if (firstMatch !== -1) matches = find(data.buffer, searchArr).filter(e => e.end === true);

    // Using indexOF method
    // const matches = findINDEXOF(data.buffer, searchStr);
    // c += matches.length;

    // The following condition is met at the last buffer that gets read
    // as its length will be minor of each previous buffer
    if (data.bytesRead !== bsize) {
      const len = matches.length;
      matches.forEach((e, j) => {
        const string = len === j + 1 ? e.string : e.string + ',';
        write.write(string);
      });
      break;
    } else {
      matches.forEach(e => write.write(e.string + ','));
    }
    i += 1;
  }
  await close(f);
  write.write(']');
  write.end();

  // ############  STATS  ############
  // Printing memory usage
  const mem = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${mem.toFixed(1)} MB`);

  // Printing execution time
  console.log('It took:', `${Date.now() - t}ms`);
})();
