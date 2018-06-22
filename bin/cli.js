#!/usr/bin/env node

const program = require('commander');
const { version } = require('../package.json');
const core = require('./core');

// list/ls: List origin or local host files alias
// show: Show all current domain records in hosts file
// alias <name> <path>: Alias a(n) origin/local host file
// del <name>: Unalias a(n) origin/local host file
// set <ip> <domain>: Set a domain in the hosts file
// remove <domain>: Remove a set of host entries from URL or local path
// search <domain>: Search related domain records in hosts file
// use <alias>: Use a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)
// unuse <alias>: Unuse a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)
// test <alias>: Test a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`) is actived

program
  .version(`hfm@v${version}`);

program
  .command('list')
  .alias('ls')
  .description('List origin or local host files alias')
  .action(core.list);

program
  .command('show')
  .description('Show all current domain records in hosts file')
  .action(core.show);

program
  .command('alias <name> <path>')
  .description('Alias a(n) origin/local host file')
  .action(core.alias);

program
  .command('del <name>')
  .description('Unalias a(n) origin/local host file')
  .action(core.del);

program
  .command('set <ip> <domain...>')
  .description('Set a domain in the hosts file')
  .action(core.set);

program
  .command('remove <domain...>')
  .description('Remove a set of host entries from URL or local path')
  .action(core.remove);

program
  .command('search <domain>')
  .description('Search related domain records in hosts file')
  .action(core.search);

program
  .command('use <alias>')
  .description('Use a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)')
  .action(core.use);

program
  .command('unuse <alias>')
  .description('Unuse a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`)')
  .action(core.unuse);

program
  .command('test <alias>')
  .description('Test a(n) origin hosts path or an ALIAS_NAME(see `hfm ls`) is actived')
  .action(core.test);

program
  .command('help')
  .description('Print help for hfm')
  .action(program.outputHelp);

program
  .parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}
