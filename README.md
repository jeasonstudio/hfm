<h1 align="center">HFM</h1>

[![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] 

[travis-image]: https://img.shields.io/travis/jeasonstudio/hfm/master.svg
[travis-url]: https://travis-ci.org/jeasonstudio/hfm
[npm-image]: https://img.shields.io/npm/v/hfm.svg
[npm-url]: https://npmjs.org/package/hfm
[downloads-image]: https://img.shields.io/npm/dm/hfm.svg
[downloads-url]: https://npmjs.org/package/hfm

> Simple, programmatic `hosts` file manager. Just like `nrm`.


## Install

```bash
npm install hfm -g
```

## Usage

If you use OS X or Linux, this module assumes your hosts file is at `/etc/hosts`. On
Windows, it assumes your hosts file is at `C:/Windows/System32/drivers/etc/hosts`.

### help

> Print help message for hfm

```bash
$ hfm

  Usage: hfm [options] [command]

  Options:

    -V, --version         output the version number
    -h, --help            output usage information

  Commands:

    list|ls               List origin or local host files alias
    show                  Show all current domain records in hosts file
    alias <name> <path>   Alias a(n) origin/local host file
    del <name>            Unalias a(n) origin/local host file
    set <ip> <domain...>  Set a domain in the hosts file
    remove <domain...>    Remove a set of host entries from URL or local path
    search <domain>       Search related domain records in hosts file
    use <alias>           Use a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)
    unuse <alias>         Unuse a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)
    help                  Print help for hfm
```

### list all host file records

```bash
hostile list
```

#### set a domain in the hosts file

```bash
hostile set [ip] [host]
```

examples:
```bash
hostile set localhost domain.com
hostile set 192.168.33.10 domain.com
```

#### remove a domain from the hosts file

```bash
hostile remove [host]
```

example:
```bash
hostile remove domain.com
```

#### load a set of hosts from a file

```bash
hostile load [file_path]
```
hosts.txt
```bash
# hosts.txt
127.0.0.1 github.com
127.0.0.1 twitter.com
```

example:
```bash
hostile load hosts.txt
```

#### unload [remove] a set of hosts from a file

```bash
hostile unload [file_path]
```

```bash
# hosts.txt
127.0.0.1 github.com
127.0.0.1 twitter.com
```

example:
```bash
hostile unload hosts.txt
```

#### set up auto completion

bash:
```bash
hostile --completion >> ~/hostile.completion.sh
echo 'source ~/hostile.completion.sh' >> .bash_profile
```

zsh:
```bash
echo '. <(./hostile --completion)' >> .zshrc
```

## methods

Commands that modify the hosts file require root privileges.

I wouldn't recommend running your production node server with admin privileges unless you
downgrade to a normal user with
[`process.setuid(id)`](http://nodejs.org/api/process.html#process_process_setuid_id)
before you start accepting requests.

**All methods have sync versions. Just omit the callback parameter.**

#### add a rule to /etc/hosts

```js
var hostile = require('hostile')
hostile.set('127.0.0.1', 'peercdn.com', function (err) {
  if (err) {
    console.error(err)
  } else {
    console.log('set /etc/hosts successfully!')
  }
})
```

If the rule already exists, then this does nothing.

#### remove a rule from /etc/hosts

```js
hostile.remove('127.0.0.1', 'peercdn.com', function (err) {
  if (err) {
    console.error(err)
  } else {
    console.log('set /etc/hosts successfully!')
  }
})
```

If the rule does not exist, then this does nothing.

#### get all lines in /etc/hosts

```js
// If `preserveFormatting` is true, then include comments, blank lines and other
// non-host entries in the result
var preserveFormatting = false

hostile.get(preserveFormatting, function (err, lines) {
  if (err) {
    console.error(err.message)
  }
  lines.forEach(function (line) {
    console.log(line) // [IP, Host]
  })
})
```

#### get all lines in any file

```js
// If `preserveFormatting` is true, then include comments, blank lines and other
// non-host entries in the result
var preserveFormatting = false

hostile.getFile(file_path, preserveFormatting, function (err, lines) {
  if (err) {
    console.error(err.message)
  }
  lines.forEach(function (line) {
    console.log(line) // [IP, Host]
  })
})
```

## contributors

- [Feross Aboukhadijeh](http://feross.org) (author)
- [Maayan Glikser](https://github.com/morsdyce)

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
