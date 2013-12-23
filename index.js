#!/usr/bin/env node

var program = require('commander');
var read = require('./lib/read');
var run = require('./lib/run');

program
  .version('0.0.1')
  .usage('[options] <file>')
  .option('-u, --using <configFile>', 'File to load variables from')
  .parse(process.argv);

// Only <file> should be left in process.argv
var file = program.args[0];
var vars = (program.using) ? read(program.using) : {};

if (!file) program.help();
else run(file, vars);