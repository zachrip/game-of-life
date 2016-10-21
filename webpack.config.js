const webpack = require('webpack');

module.exports = {  
  entry: './src/app.ts',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] }
    ]
  }
};
