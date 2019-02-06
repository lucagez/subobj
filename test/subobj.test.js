const assert = require('assert');
const chai = require('chai');
const fs = require('fs');
const subobj = require('../dist/subobj');

describe('subobj', () => {
  const { expect } = chai;

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
  it('should parse correctly properties equal to objects', () => {
    const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');
    const sub = subobj(data, 'Abbigliamento e accessori');
    const obj = JSON.parse(sub);
    assert.equal(typeof obj, 'object');
  });
  it('should parse correctly properties equal to arrays', () => {
    const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');
    const arrays = {
      first: JSON.parse(subobj(data, 'Gonne')).Gonne,
      second: JSON.parse(subobj(data, 'Obi')).Obi
    };
    expect(arrays.first).to.be.an('array');
    expect(arrays.second).to.be.an('array');
  });
  it('should thow an error when a non-existent property is searched', () => {
    const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');
    expect(() => subobj(data, 'Kimondo')).to.throw();
  });
  it('works in pathMode', () => {
    const path = `${__dirname}/data/google_taxonomy.json`;
    const sub = subobj(path, 'Pigiami', { pathMode: true });
    const obj = JSON.parse(sub);
    assert.equal(typeof obj, 'object');
  });
});
