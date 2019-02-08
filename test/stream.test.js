const fs = require('fs');
const Stream = require('stream');

const path = `${__dirname}/data/google_taxonomy.json`;

const testStream = new Stream.Writable();
const charStream = new Stream.Writable();

charStream._write = (char, encoding, next) => {
  // console.log(char.toString());
  // char.toString();
  next();
};

testStream._write = (chunk, encoding, next) => {
  const string = chunk.toString();
  // // console.log(string);
  // for (const char of string) {
  //   charStream.write(char);
  // }
  let i = 0;
  const len = chunk.length;
  for (; i < len; ++i) {
    charStream.write(string.charAt(i));
  }

  next();
};

const t = Date.now();
fs.createReadStream(path).pipe(testStream);

testStream.on('finish', () => console.log(Date.now() - t));

const t1 = Date.now();
JSON.parse(fs.readFileSync(path));
console.log(Date.now() - t1)
// class Find {
//   constructor(term) {
//     this.term = term.split('');
//     this.target = this.term.length;
//     this.index = 0;
//     this.current = this.term[0];
//   }

//   search(char) {
//     if (char === this.current) {
//       this.index += 1;
//       this.current = this.term[this.index];
//       console.log(this.current);
//       if (this.index === this.target) return;
//     }
//     this.index = 0;
//   }
// }

// const store = {
//   term = '',
//   target = '',
//   index = 0,
//   current = term[0]
// };

// const createStore = string => {
//   const term = string.split('');
//   const target = term.length;
//   const index = 0;
//   const current = term[index];
//   return {
//     term,
//     target,
//     index,
//     current
//   }
// }

// // const updateStore = (obj, )

// let count = 0;
// stream.on('data', data => {
//   count += 1;
//   // console.log(data);

// });

// stream.on('end', () => console.log(count));
