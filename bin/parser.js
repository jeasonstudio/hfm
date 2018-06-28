const t = [
  { type: 'comment', line: ['# xxxxx'] },
  { type: 'single', line: ['127.0.0.1', 'localhost'] },
  { type: 'multiple', line: ['127.0.0.2', 'localhost2', 'jeason.cn'] },
];

/**
 * Split host file string by line, no blank line
 * @param {string} str string need to split
 * @param {RegExp|string} [eol=/\r?\n/]
 * @returns {string[]}
 */
function splitLine(str, eol = /\r?\n/) {
  return str.split(eol).filter(line => /\S/g.test(line));
}

/**
 * Judge a line is comment or not
 * @param {string} line each line string
 * @returns {Boolean}
 */
function isCommentLine(line) {
  return /^\s*#/g.test(line);
}

function formatLine(line) {
  if (isCommentLine(line)) {
    return { type: 'comment', line: [line.replace(/^\s*/, '')] };
  }
  //
}

module.exports.parse = function (hosts, options) {

};

module.exports.stringify = function (hostsList, options) {

};

const testHost = `
# test comment
127.0.0.1 localhost
::1 localhost
127.0.0.2 localhost2
127.0.0.3 localhost3 jeason.com`;

console.log(splitLine(testHost));
console.log('127.0.0.1 localhost # xxx'.replace(/#.*/, ''));
console.log(/^\s*?(.+?)\s+(.+?)\s*$/.exec(' 127.0.0.1 localhost asdfasdf # asdf'));
console.log(' 127.0.0.1 localhost asdfasdf # asdf'.split(/(\t| )/g));


