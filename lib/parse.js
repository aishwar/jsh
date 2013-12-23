
/**
 * Parse a given line into an object representing the information
 * it contains with reference to the JSH spec
 */
module.exports = function (line) {
  var inComment = false;
  var inQuotes = false;
  var quoteType = '';
  var obj = {};
  
  // Remove any leading white space. They have no significance.
  line = line.trimLeft();
  
  // This was just whitespace
  if (!line.length) {
    obj.type = 'whitespace';
    obj.value = '';
    return obj;
  }
  
  // Is this a comment or a log message?
  if (line.charAt(0) === '#') {
    if (line.charAt(1) === '#') {
      // This is a log message
      obj.type = 'log';
      obj.value = line.substr(2).trim();
      return obj;
    } else {
      // This is a comment
      obj.type = 'comment';
      obj.value = line.substr(1).trim();
      return obj;
    }
  }
  
  // This is a command
  obj.type = 'command';
  for (var i = 0; i < line.length; i++) {
    var currentChar = line.charAt(i);
    var nextChar = line.charAt(i+1);
    var lastChar = line.charAt(i-1);
    
    if (!inQuotes) {
      // Beginning of a quoted string
      if (currentChar === "'" || currentChar === '"') {
        inQuotes = true;
        quoteType = currentChar;
      } else
      // Comment or Error logging
      if (currentChar === '#') {
        obj.value = line.substr(0, i).trim();
        if (nextChar === '!') obj.errorMessage = line.substr(i+2).trim();
        else obj.comment = line.substr(i+1).trim();
        return obj;
      }
    } else {
      // End of the quoted string
      // Make sure this is the same quote that opened the string
      // and it is not escaped. Not a very good check for escaped
      // character, but should be good enough for now.
      if (currentChar == quoteType && lastChar != "\\") {
        inQuotes = false;
        quoteType = '';
      }
    }
  }
  obj.value = line.trim();
  return obj;
}
