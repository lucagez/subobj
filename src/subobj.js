const fs = require('fs');

const isFormatted = string => (string.match('\n') || []).length > 0;

const isValid = string => {
  try {
    JSON.parse(string);
    return true;
  } catch (e) {
    throw new Error('invalid JSON');
  }
};

const minify = string => {
  try {
    return JSON.stringify(JSON.parse(string));
  } catch (e) {
    throw new Error('invalid JSON');
  }
};

const find = (string, search) => {
  const regex = RegExp(`"${search}":`, 'g');
  const accumulator = [];
  let temp;
  while ((temp = regex.exec(string)) !== null) {
    accumulator.push(temp.index);
  }
  return accumulator;
};

const matchBracket = (string, index, brackets, counter = 0) => {
  const current = string.charAt(index);
  if (current === brackets[0]) counter += 1;
  else if (current === brackets[1]) counter -= 1;
  if (counter === 0) return index;
  return matchBracket(string, (index += 1), brackets, counter);
};

const parse = (string, index = 0) => {
  const current = string.charAt(index);
  if (current === ',' || current === '}') return string.substr(0, index);
  if (current === '[' || current === '{') {
    const brackets = current === '[' ? ['[', ']'] : ['{', '}'];
    return string.substr(0, matchBracket(string, index, brackets)) + brackets[1];
  }
  return parse(string, (index += 1));
};

const subobj = (string, search, params = {}) => {
  const { pathMode, validate } = params;
  const raw = pathMode ? fs.readFileSync(string, 'UTF-8') : string;
  if (validate) isValid(raw);
  const data = isFormatted(raw) ? minify(raw) : raw;
  const matches = find(data, search);
  return matches.map(index => {
    const substr = data.substr(index);
    return `{${parse(substr)}}`;
  });
};

module.exports = subobj;
