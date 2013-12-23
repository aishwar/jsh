var assert = require('assert');
var fs = require('fs');
var parse = require('../lib/parse');

var lines = fs.readFileSync(__dirname + '/parse-test.jsh', 'utf8').split('\n');
var results = lines.map(parse);
var expectations = [
  {type: 'comment', value: 'Comment'},
  {type: 'comment', value: 'Comment with whitespace'},
  {type: 'log', value: 'Log'},
  {type: 'log', value: 'Log with whitespace'},
  {type: 'command', value: 'cd unknown1', errorMessage: "Unknown1 doesn't exist??"},
  {type: 'command', value: 'cd known', comment: 'this is just a comment'},
  {type: 'command', value: 'test "string with #!"'},
  {type: 'command', value: 'test \'quotes1"\''},
  {type: 'command', value: 'test \'quotes2""\''},
  {type: 'whitespace', value: ''}
];

console.log('Testing parse');

// Utility to help debugging:
//   console.log('Actual', results[4], '; Expected', expectations[4]);

assert.deepEqual(results[0], expectations[0], 'Comment parsing failed');
assert.deepEqual(results[1], expectations[1], 'Comment with whitespace parsing failed');
assert.deepEqual(results[2], expectations[2], 'Log parsing failed');
assert.deepEqual(results[3], expectations[3], 'Log with whitespace parsing failed');
assert.deepEqual(results[4], expectations[4], 'Command with error message parsing failed');
assert.deepEqual(results[5], expectations[5], 'Command with comment parsing failed');
assert.deepEqual(results[6], expectations[6], 'Quoted string parsing failed');
assert.deepEqual(results[7], expectations[7], 'Quoted string with mixed quotes 1 parsing failed');
assert.deepEqual(results[8], expectations[8], 'Quoted string with mixed quotes 2 parsing failed');

console.log('Test Passed :)');
