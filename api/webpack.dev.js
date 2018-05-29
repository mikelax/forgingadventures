const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

function pathToSrc(...args) {
  return path.join(__dirname, path.join(...args));
}

module.exports = {
  entry: './app.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dev'),
    filename: 'index.js'
  },
  devtool: '#cheap-module-source-map',
  externals: nodeExternals(),
  node: {
    __filename: true,
    __dirname: true
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install({environment: \'node\'});',
      raw: true,
      entryOnly: false
    })
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      // application aliases
      middleware: pathToSrc('middleware'),
      models: pathToSrc('models'),
      routes: pathToSrc('routes'),
      schemas: pathToSrc('schemas'),
      services: pathToSrc('services'),
      utils: pathToSrc('utils'),

      app: pathToSrc('app.js')
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: path.join(__dirname, 'node_modules'),
      use: {
        loader: 'babel-loader',
        query: {
          presets: ['stage-0']
        }
      }
    }]
  }
};
