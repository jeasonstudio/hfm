/* eslint-disable func-names, no-console */
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
// const once = require('once');
// const split = require('split');
// const through = require('through');
const chalk = require('chalk');

const HFMRC_PATH = path.resolve(process.env.HOME, '.hfmrc');
const WINDOWS = process.platform === 'win32';
const EOL = WINDOWS ? '\r\n' : '\n';
const HOSTS_PATH = WINDOWS
  ? path.normalize('C:/Windows/System32/drivers/etc/hosts')
  : path.normalize('/etc/hosts');

const HFM_CONFIG = {
  list: {
    Google: {
      url: 'https://raw.githubusercontent.com/googlehosts/hosts/master/hosts-files/hosts',
    },
    GoogleMirror: {
      url: 'https://coding.net/u/scaffrey/p/hosts/git/raw/master/hosts-files/hosts',
    },
  },
  custom: [],
};


function lineFormatter(line) {
  // Remove all comment text from the line
  const lineSansComments = line.replace(/#.*/, '');
  const matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec(lineSansComments);
  if (matches && matches.length === 3) {
    // Found a hosts entry
    const [, ip, host] = matches;
    return [ip, host];
  } else if (line.startsWith('#')) {
    return line;
  }
  return false;
}

/**
 * Decode a host file
 *
 * @param {string} str host file string
 * @returns {(string[]|string)[]}
 */
function fileDecoder(str) {
  return str.split(/\r?\n/).map(lineFormatter).filter(l => !!l);
}

/**
 * Get a list of the lines that make up the filePath. If the
 * `preserveFormatting` parameter is true, then include comments, blank lines
 * and other non-host entries in the result.
 * @param {string} filePath
 *
 */
function getFile(filePath) {
  return fileDecoder(fs.readFileSync(filePath, 'utf8'));
}

function writeRcFile(rc) {
  fs.writeFileSync(HFMRC_PATH, yaml.safeDump(rc, { sortKeys: true }), 'utf8');
}

function getRc() {
  if (!fs.existsSync(HFMRC_PATH)) {
    writeRcFile(HFM_CONFIG);
    return HFM_CONFIG;
  }
  return {
    list: {},
    custom: [],
    ...yaml.safeLoad(fs.readFileSync(HFMRC_PATH, 'utf8'))
  };
}

exports.list = function () {
  const listObj = getRc().list;
  Object.entries(listObj)
    .forEach(([name, { url }]) => {
      console.log(`* ${chalk.blue(name)}\t${url}`);
    });
};

exports.show = function () {
  console.log('\n');
  getFile(HOSTS_PATH)
    .forEach((hostLine) => {
      if (Array.isArray(hostLine)) {
        const [ip, host] = hostLine;
        console.log(`${ip}\t${chalk.green(host)}`);
      } else {
        console.log(chalk.gray(hostLine));
      }
    });
};

exports.alias = function (name, url) {
  console.log(name, url);
  const listObj = getRc().list;
  if (!listObj[name]) {
    listObj[name] = { url };
    writeRcFile({ ...getRc(), list: listObj });
  } else {
    console.error('You have added alias:', name);
  }
};

exports.set = function (ip, domain) {
  console.log(ip, domain);
};

exports.remove = function (domain) {
  console.log(domain);
};

exports.search = function (domain) {
  console.log(domain);
};

exports.use = function (alias) {
  console.log(alias);
};

exports.unuse = function (alias) {
  console.log(alias);
};
