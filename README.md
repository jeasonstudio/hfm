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
$ hfm help

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

### list|ls

> List origin or local host files alias

```bash
$ ./bin/cli.js ls
* Google        https://raw.githubusercontent.com/googlehosts/hosts/master/hosts-files/hosts
* GoogleMirror  https://coding.net/u/scaffrey/p/hosts/git/raw/master/hosts-files/hosts
```

### show

> Show all current domain records in hosts file

```bash
$ hfm show
# ----------------------------
# SYSTEM
127.0.0.1       localhost
255.255.255.255 broadcasthost
```

### set [ip] [domain]

> Set a domain in the hosts file

### remove [domain]

> Remove a set of host entries from URL or local path

### alias [name] [path]

> Alias a(n) origin/local host file  
> `path` could be local path or URL

### del [name]

> Unalias a(n) origin/local host file

### search [domain]

> Search related domain records in hosts file

```bash
$ hfm search \.com$
$ hfm search google.*
$ hfm search www.google.com
```

### use [alias]

> Use a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)

```bash
$ hfm use Google
```

### unuse [alias]

> Unuse a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)