const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve('../public/dist'),
    clean: true,
  }
});