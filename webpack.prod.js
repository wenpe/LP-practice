import pkg from 'webpack';
const webpack = pkg;
import { merge } from 'webpack-merge'
// import common from './webpack.common'
import webpackCommon from './webpack.common.js'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export default merge(webpackCommon, {
  plugins: [
    new UglifyJsPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
})
