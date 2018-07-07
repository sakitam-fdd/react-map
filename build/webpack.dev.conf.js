const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const utils = require('./utils');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      usePostCSS: true,
      extract: true
    })
  },
  devtool: 'source-map', // cheap-module-eval-source-map
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('development')
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath(`[name].${process.env.NODE_ENV === 'production' ? 'min.' : ''}css`),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      allChunks: true,
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: process.env.NODE_ENV === 'production'
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    new CaseSensitivePathsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.BannerPlugin(utils.getBanner)
  ],
  watch: process.env.NODE_ENV === 'development'
});

if (process.env.NODE_ENV === 'production') {
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  devWebpackConfig.externals = {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  };
  devWebpackConfig.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: true,
      parallel: true
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new BundleAnalyzerPlugin()
  );
}

module.exports = devWebpackConfig;
