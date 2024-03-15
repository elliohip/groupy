const path = require('path');

module.exports = {
  entry: {
    app: './javascripts/main.js',
  },
  output: {
    filename: 'main.bundle.js',
    path: path.resolve('../public/dist'),
    clean: true,
  }
};