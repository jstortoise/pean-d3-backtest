const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: fs.createReadStream('uploads/file-1496424034286.csv')
});

rl.on('line', function (line) {
  console.log('Line from file:', line);
});