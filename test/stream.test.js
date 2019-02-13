// the stream method is a lot slow than in memory method.

const fs = require('fs');
const subobj = require('../dist/subobj');

// complex structure but small file
// const path = `${__dirname}/data/google_taxonomy.json`;
// const path = `${__dirname}/data/multi_complex.json`;

// test with BIG file
// const path = `${__dirname}/data/citylots.json`;

// test with HUGE file
const path = `${__dirname}/data/huge.json`;

const store = {
  overlap: '',
  overlapOBJ: ''
};

// test term for overlapping test (object on two different chunks)
// const term = 'Cambio pannolini';
// const term = 'Articoli';
const term = 'GEZ';
// const term = 'type';
let chunkCounter = 0;

// init
const find = (string, search) => {
  const regex = RegExp(`"${search}":`, 'g');
  const accumulator = [];
  let temp;
  while ((temp = regex.exec(string)) !== null) {
    accumulator.push(temp.index);
  }
  return accumulator;
};

// preferring for-loop over recursion to avoid `max call stack size exceeded error`
const matchBracket = (string, len, brackets) => {
  let counter = 0;
  let index = 0;
  let flag = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const char of string) {
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

const parse = (string, len, index = 0) => {
  if (index === len) return { end: false, string };
  const current = string.charAt(index);
  if (current === ',' || current === '}') return { end: true, string: string.substr(0, index) };
  if (current === '[' || current === '{') {
    const brackets = current === '[' ? ['[', ']'] : ['{', '}'];
    const matchedIndex = matchBracket(string, len, brackets);
    const sub = string.substr(0, matchedIndex.index);
    return {
      end: matchedIndex.end,
      // postponing a bracket if the match is complete
      string: sub + (matchedIndex.end ? brackets[1] : '')
    };
  }
  return parse(string, len, (index += 1));
};

const forParse = (string, len, index = 0) => {
  let parsed = {};
  for (; index < len;) {
    const current = string.charAt(index);
    // if (index === len) {
    //   parsed = { end: false, string };
    //   break;
    // };
    if (current === ',' || current === '}') {
      parsed = { end: true, string: string.substr(0, index) };
      break;
    };
    if (current === '[' || current === '{') {
      const brackets = current === '[' ? ['[', ']'] : ['{', '}'];
      const matchedIndex = matchBracket(string, len, brackets);
      const sub = string.substr(0, matchedIndex.index);
      // postponing a bracket if the match is complete
      parsed = {
        end: matchedIndex.end,
        string: sub + (matchedIndex.end ? brackets[1] : '')
      };
      break;
    }
    index += 1;
  }
  if (!parsed.end) parsed = { end: false, string };
  return parsed;
};

// test time
const t = Date.now();
const stream = fs.createReadStream(path, { highWaterMark: 8192 * 1024, encoding: 'UTF-8' });

stream.on('data', data => {
  chunkCounter += 1;
  // console.log(data);
  // // console.log('\n ######################## \n');

  // // returning a string that is equal to the actual chunk plus the optional
  // // overlap found in previous `data` iteration
  // const string = (store.overlapOBJ !== '' ? store.overlapOBJ : store.overlap) + data.toString();

  // // overlapping
  // const len = string.length;
  // const cut = len - `"${term}":`.length - 1;
  // store.overlap = string.substr(cut);
  // // console.log(string.substr(0, 20));

  // const indexes = find(string, term);
  // indexes.forEach(i => {
  //   const substr = string.substr(i);
  //   const extract = forParse(substr, len);

  //   // updating global store to contain overlapping objects across chunks
  //   store.overlapOBJ = !extract.end ? extract.string : '';
  //   if (extract.end) console.log(extract.string);
  //   // modify flow to return only completed strings
  //   // console.log(parse(substr, len));
  // });
});

stream.on('end', () => {
  console.log('stream:', Date.now() - t);
  // console.log('Data divided in', chunkCounter);
  // const mem = process.memoryUsage().heapUsed / 1024 / 1024;
  // console.log(`The script uses approximately ${mem.toFixed(1)} MB`);
});

// in memory test
// const t1 = Date.now();
// const data = fs.readFileSync(path, 'UTF-8');
// subobj(data, term);
// console.log('in memory:', Date.now() - t1);

// // memory usage
// const mem = process.memoryUsage().heapUsed / 1024 / 1024;
// console.log(`The script uses approximately ${mem.toFixed(1)} MB`);