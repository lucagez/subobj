const fs = require('fs');
const subobj = require('../dist/subobj');

const data = fs.readFileSync(`${__dirname}/data/multi.json`, 'UTF-8');

console.log(subobj(data, 'ciao'));
