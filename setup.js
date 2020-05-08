const fs = require('fs');
const file = process.argv[2];

const content = fs.readFileSync(file, 'UTF-8').split(/\n/);
let index = 0;
global.readline = () => {
  return content[index++];
};

require('./test.js');
