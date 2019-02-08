const fs = require('fs');
const Stream = require('stream');

const path = `${__dirname}/data/google_taxonomy.json`;

const charStream = new Stream.Writable();

const t = Date.now();
const stream = fs.createReadStream(path);


charStream._write = (char, encoding, next) => {
  // console.log(char.toString());
  char.toString();
  next();
};

stream.on('data', data => {
  const string = data.toString();
  let i = 0;
  const len = data.length;
  for (; i < len; ++i) {
    charStream.write(string.charAt(i));
  }
});

stream.on('end', () => console.log(Date.now() - t));
