const matchBracket = (string, index, brackets, counter = 0) => {
  const current = string.charAt(index);
  if (current === brackets[0]) counter += 1;
  else if (current === brackets[1]) counter -= 1;
  if (counter === 0) return index;
  return matchBracket(string, index += 1, brackets, counter);
};

const parser = (string, index = 0) => {
  const current = string.charAt(index);
  if (current === ',' || current === '}') return string.substr(0, index);
  else if (current === '[' || current === '{') {
    const brackets = current === '[' ? ['[', ']'] : ['{', '}'];
    return string.substr(0, matchBracket(string, index, brackets)) + brackets[1];
  };
  return parser(string, index += 1);
};

const slicer = (string, search) => {
  const regex = new RegExp(`"${search}":`);
  const minified = JSON.stringify(JSON.parse(string));
  const {
    index
  } = minified.match(regex);
  const substr = minified.substr(index);
  return '{' + parser(substr) + '}';
};

module.exports = slicer;