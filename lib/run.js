
/**
 * Module dependencies
 */
var fs = require('fs');
var sh = require('execSync');
var parse = require('./parse');
var substituteValues = require('./substitute-values');
 
module.exports = function (file, vars) {
  var lines = fs.readFileSync(file, 'utf8').split('\n');
  
  try {
    lines.forEach(function (line) {
      var obj = parse(line);
      
      switch (obj.type) {
        case 'whitespace':
        case 'comment':
          return;
        
        case 'log':
          console.log('[LOG] ', obj.value);
          return;
        
        case 'command':
          var command = substituteValues(obj.value, vars);
          var result = sh.exec(command);
          
          if (result.code || result.stderr) {
            var message = 'Command "' + command + '" failed execution with ';
            if (result.stderr) message += 'error: ' + result.stderr;
            else if (result.code) message += 'a return value of: ' + result.code;
            
            console.error('[ERROR] ', obj.errorMessage || message);
            throw new Error(message);
          }
          
          console.log('[OUT] ', result.stdout);
          return;
          
        default:
          throw new Error('Unknown token type encountered!');
      }
    });
    console.log('Script executed');
  } catch (e) {
    console.error('Program terminated due to error');
  }
};
