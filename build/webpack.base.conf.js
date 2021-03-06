const path = require('path');
const utils = require('./utils');

const filename = process.env.NODE_ENV === 'production' ? 'min.' : (process.env.NODE_ENV === 'common' ? 'common.' : '');
const _target = process.env.NODE_ENV === 'common' ? 'commonjs2' : 'umd2';

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    'react-map': path.resolve(__dirname, '../src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `[name].${filename}js`,
    library: 'ReactMap',
    libraryTarget: _target
  },
  resolve: {
    extensions: [
      '.web.js',
      '.js',
      '.jsx',
      '.json',
    ],
    alias: {
      'src': utils.resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          utils.resolve('src'),
          utils.resolve('view'),
          utils.resolve('test')
        ],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true,
        },
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        include: [
          utils.resolve('src'),
          utils.resolve('view'),
          utils.resolve('test'),
        ],
        options: {
          cacheDirectory: true,
          plugins: process.env.LIB ? [
            'transform-react-remove-prop-types',
            'transform-class-properties',
            'transform-object-assign',
            'transform-object-rest-spread'
          ] : [
            'react-hot-loader/babel',
            'transform-react-remove-prop-types',
            'transform-class-properties',
            'transform-object-assign',
            'transform-object-rest-spread',
            [
              'transform-runtime',
              {
                'polyfill': false
              }
            ],
            [
              'import',
              {
                'libraryName': 'antd',
                'style': false
              }
            ]
          ]
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      }
    ],
  },
  node: {
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  }
};
