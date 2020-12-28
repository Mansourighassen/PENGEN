const fs = require('fs');
const path = require('path');

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.dirname(__dirname) ;
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  }




};