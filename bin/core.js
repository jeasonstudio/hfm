/* eslint-disable func-names, no-console */
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require('chalk');
const net = require('net');
const anymatch = require('anymatch');
const fetch = require('node-fetch');

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

/**
 * Test if a str is url.
 * @param {String} str the str you want to test
 * @returns {boolean}
 */
function isUrl(str) {
  return !!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
}

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
 * @param {string} filePath localPath or URL
 * @returns {(string|string[])[]}
 *
 */
function getFile(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`No found that file: ${filePath}`);
  return fileDecoder(fs.readFileSync(filePath, 'utf8'));
}

/**
 * get hosts lines by url
 *
 * @param {string} url
 * @returns {string[][]}
 */
async function getOriginFile(url) {
  const originHostText = await fetch(url).then(r => r.text());
  return fileDecoder(originHostText);
}

function writeHostFile(lines) {
  const records = lines.map((line, lineNum) => {
    if (Array.isArray(line)) {
      // eslint-disable-next-line no-param-reassign
      line = `${line[0]} ${line[1]}`;
    }
    return line + (lineNum === lines.length - 1 ? '' : EOL);
  });
  const stat = fs.statSync(HOSTS_PATH);
  fs.writeFileSync(HOSTS_PATH, records.join(''), { mode: stat.mode });
  return true;
}

function writeRcFile(rc) {
  fs.writeFileSync(HFMRC_PATH, yaml.safeDump(rc, { sortKeys: true }), 'utf8');
}

/**
 * get the `~/.hfmrc` file parse to json
 */
function getRc() {
  if (!fs.existsSync(HFMRC_PATH)) {
    writeRcFile(HFM_CONFIG);
    return HFM_CONFIG;
  }
  return {
    list: {},
    custom: [],
    ...yaml.safeLoad(fs.readFileSync(HFMRC_PATH, 'utf8')),
  };
}

/**
 * Add a rule to /etc/hosts. If the rule already exists, then this does nothing.
 *
 * @param {string[][]} ipDomainList
 * @param {function} cb callback before
 * @returns {(string|string[])[]}
 */
function setHostRecord(ipDomainList, cb) {
  const lines = getFile(HOSTS_PATH);
  ipDomainList.forEach((item) => {
    if (typeof item === 'string') return;
    const [ip, domain] = item;
    const hasRecordIndex = lines
      .map(l => (Array.isArray(l) ? l[1] : null)).indexOf(domain);

    if (typeof cb === 'function') cb(ip, domain);
    // replace a line if both hostname and ip version of the address matches
    if (hasRecordIndex >= 0 && net.isIP(lines[hasRecordIndex][0]) === net.isIP(ip)) {
      lines[hasRecordIndex][0] = ip;
    } else {
      // If the last line is empty, or just whitespace, then insert the new entry
      // right before it
      const lastLine = lines[lines.length - 1];
      if (typeof lastLine === 'string' && /\s*/.test(lastLine)) {
        lines.splice(lines.length - 1, 0, [ip, domain]);
      } else {
        lines.push([ip, domain]);
      }
    }
  });
  return writeHostFile(lines);
}

/**
 * Remove a rule to /etc/hosts.
 *
 * @param {(string|string[])[]} ipDomainList
 * @param {function} cb callback before
 * @returns {(string|string[])[]}
 */
function removeHost(ipDomainList, cb) {
  // eslint-disable-next-line no-param-reassign
  ipDomainList = ipDomainList.filter(i => Array.isArray(i));
  const lines = getFile(HOSTS_PATH)
    .filter((line) => {
      const needRemoveIndex = ipDomainList.findIndex(([, d]) => (d === line[1]));
      if (typeof cb === 'function' && needRemoveIndex >= 0) cb(...line);
      return needRemoveIndex < 0;
    });
  return writeHostFile(lines);
}

/**
 * Get all the lines of the file as array of arrays [[IP, host]]
 * @param {string} filePath
 */
async function parseFile(filePath) {
  let lines;
  if (isUrl(filePath)) {
    lines = await getOriginFile(filePath);
  } else {
    lines = getFile(filePath);
  }
  return lines;
}

exports.list = function () {
  const listObj = getRc().list;
  Object.entries(listObj)
    .forEach(([name, { url }]) => {
      console.log(`* ${chalk.blue(name)}\t${url}`);
    });
};

exports.show = function () {
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
  const listObj = getRc().list;
  if (!listObj[name]) {
    listObj[name] = { url };
    writeRcFile({ ...getRc(), list: listObj });
    console.log(`Set the new alias success: ${chalk.green(`${name}=>${url}`)}`);
  } else {
    console.error(chalk.red(`This alias have been added: ${name}=>${url}`));
  }
};

exports.del = function (name) {
  const listObj = getRc().list;
  delete listObj[name];
  writeRcFile({ ...getRc(), list: listObj });
  console.log(`Removed alias '${name}'`);
};

exports.set = function (ip, domains) {
  if (!net.isIP(ip)) {
    console.error('Invalid IP address');
    return;
  }
  setHostRecord(domains.map(d => ([ip, d])), (_, domain) => console.log(chalk.green(`Added ${domain}`)));
};

exports.remove = function (domains) {
  removeHost(domains.map(d => ([null, d])), (_, domain) => console.log(chalk.green(`Removed ${domain}`)));
};

exports.search = function (domain) {
  getFile(HOSTS_PATH)
    .forEach((hostLine) => {
      if (Array.isArray(hostLine)) {
        const [ip, host] = hostLine;
        // eslint-disable-next-line no-param-reassign
        hostLine = `${ip} ${host}`;
      }
      const searchIndex = anymatch(new RegExp(domain, 'ig'), hostLine, true);
      const normalIndex = hostLine.indexOf(domain);
      if (searchIndex >= 0 || normalIndex >= 0) {
        console.log(chalk.green(hostLine));
      }
    });
};

exports.use = function (alias) {
  // eslint-disable-next-line no-param-reassign
  alias = getRc().list[alias] ? getRc().list[alias].url : alias;
  parseFile(alias).then((lines) => {
    let re = 0;
    setHostRecord(lines, () => { re += 1; });
    console.log(chalk.green('Added %d hosts!'), re);
  });
};

exports.unuse = function (alias) {
  // eslint-disable-next-line no-param-reassign
  alias = getRc().list[alias] ? getRc().list[alias].url : alias;
  parseFile(alias).then((lines) => {
    let re = 0;
    removeHost(lines, () => { re += 1; });
    console.log(chalk.green('Removed %d hosts!'), re);
  });
};
