const assert = require('assert');
const fs = require('fs');
const subobj = require('../dist/subobj');

describe('subobj', () => {
  it('should return a string', () => {
    const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');
    const sub = subobj(data, 'Pigiami');
    assert.equal(typeof sub, 'string');
  });
  it('should return a valid JSON', () => {
    const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');
    const sub = subobj(data, 'Pigiami');
    const obj = JSON.parse(sub);
    assert.equal(typeof obj, 'object');
  });
  it('should parse correctly properties equal to numbers', () => {
    const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');
    const sub = subobj(data, 'Pigiami');
    const obj = JSON.parse(sub);
    const num = parseInt(obj.Pigiami, 10);
    assert.equal(typeof num, 'number');
  });
  it('should parse correctly properties equal to strings', () => {
    const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');
    const sub = subobj(data, 'Kimono');
    const str = JSON.parse(sub).Kimono;
    assert.equal(typeof str, 'string');
  });
});
