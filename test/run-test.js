
var assert = require('assert');
var sh = require('execSync');
var fs = require('fs');
var jsdiff = require('diff');
var run = require('../lib/run');
var read = require('../lib/read');


[ 'simple', 'default-error-message', 'custom-error-message' ].forEach(function (file) {
  console.log('Testing ' + file + '.jsh');
  
  var result = sh.exec('node .. --using ./run-test-fixtures/props.yml ./run-test-fixtures/' + file 
    + '.jsh');
  var actual = trimLineEndings(result.stdout);
  var expected = trimLineEndings(fs.readFileSync('./run-test-fixtures/' + file + '.out', 'utf8'));
  
  if (actual != expected) {
    var diff = jsdiff.diffChars(actual, expected);
    console.log(diff);
    diff.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
      process.stderr.write(part.value[color]);
    });
    assert.fail('Output expecation not fulfilled');
  }
  
  console.log('Test "' + file + '" passed!');
});

function trimLineEndings(text) {
  return text.split('\n').map(function (s) {
    return s.trimRight();
  }).join('\n');
}

console.log('Tests Passed :)');