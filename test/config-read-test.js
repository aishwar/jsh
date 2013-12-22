var read = require('../lib/read');
var assert = require('assert');

console.log('Starting test');
console.log(' - All top level keys should be prefixed with a $');
console.log(' - Values of the form "$(\'<command>\')" should be replaced with the output');
console.log(' - The above should apply to nested values as well');

assert.deepEqual(read(__dirname + '/test.yml'), {
  $topic: 'Source Control',
  $companies: {
    github: 1,
    bitbucket: 1
  },
  $nodejs: {
    version: 'v10',
    creator: {
      name: 'Ryan Dahl',
      github: 'https://www.github.com/ry'
    }
  }
});

console.log('Test Passed :)');
