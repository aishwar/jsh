
var substituteValues = require('../lib/substitute-values');
var assert = require('assert');

console.log('Testing substitute-values');

assert.equal(substituteValues('hello', {}), 'hello', 
  'No substitution');
assert.equal(substituteValues('Howdy $name', {name: 'Aishwar'}), 'Howdy Aishwar', 
  'Root level subsitution');
assert.equal(substituteValues('Howdy $user.name', {user: {name: 'Aishwar'}}), 'Howdy Aishwar', 
  'Nested object substitution');
assert.equal(substituteValues('echo $(pwd)', {text: 'hello'}), 'echo $(pwd)',
  'Unrecognized values left as is');
assert.equal(substituteValues('hello'), 'hello', 
  "Empty property map doesn't break");

console.log('Tests completed :)');