const assert = require('assert');
const chai = require('chai');
const fs = require('fs');
const subobj = require('../dist/subobj');

describe('subobj', () => {
  const { expect } = chai;
  const data = fs.readFileSync(`${__dirname}/data/google_taxonomy.json`, 'UTF-8');

  it('should return an array', () => {
    const sub = subobj(data, 'Pigiami');
    expect(sub).to.be.an('array');
  });

  it('should return a valid JSON', () => {
    const sub = subobj(data, 'Pigiami')[0];
    const obj = JSON.parse(sub);
    assert.equal(typeof obj, 'object');
  });

  it('should parse correctly properties equal to numbers', () => {
    const sub = subobj(data, 'Pigiami')[0];
    const obj = JSON.parse(sub);
    const num = parseInt(obj.Pigiami, 10);
    assert.equal(typeof num, 'number');
  });

  it('should parse correctly properties equal to strings', () => {
    const sub = subobj(data, 'Kimono')[0];
    const str = JSON.parse(sub).Kimono;
    assert.equal(typeof str, 'string');
  });

  it('should parse correctly properties equal to objects', () => {
    const sub = subobj(data, 'Abbigliamento e accessori')[0];
    const obj = JSON.parse(sub);
    assert.equal(typeof obj, 'object');
  });

  it('should parse correctly properties equal to arrays', () => {
    const arrays = {
      first: JSON.parse(subobj(data, 'Gonne')[0]).Gonne,
      second: JSON.parse(subobj(data, 'Obi')[0]).Obi
    };
    expect(arrays.first).to.be.an('array');
    expect(arrays.second).to.be.an('array');
  });

  it('should return an empty array when a non-existent property is searched', () => {
    const sub = subobj(data, 'Kimondo');
    expect(sub)
      .to.be.an('array')
      .to.have.length(0);
  });

  it('works in pathMode', () => {
    const path = `${__dirname}/data/google_taxonomy.json`;
    const sub = subobj(path, 'Articoli', { pathMode: true })[0];
    const obj = JSON.parse(sub);
    assert.equal(typeof obj, 'object');
  });
});
