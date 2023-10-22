import * as path from 'path';
import { Configuration, LoaderOptionsPlugin } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const configs: Configuration = {
  target: 'web',
  entry: ['./src/index.tsx'],
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin() as any],
    alias: {
      '@mui/base': '@mui/base/modern',
      '@mui/lab': '@mui/lab/modern',
      '@mui/material': '@mui/material/modern',
      '@mui/styled-engine': '@mui/styled-engine/modern',
      '@mui/system': '@mui/system/modern',
    },
  },
  externals: {
    moment: 'moment',
    // '@aws-amplify': '@aws-amplify',
    // '@aws-sdk': '@aws-sdk',
    // lodash: {
    //   commonjs: 'lodash',
    //   amd: 'lodash',
    //   root: '_', // indicates global variable
    // },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [!process.env.NODE_ENV && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new MomentLocalesPlugin({
    //   localesToKeep: ['ja'],
    // }),
    // new MomentTimezoneDataPlugin({
    //   matchZones: 'Asia/Tokyo',
    // }),
    // @ts-ignore
    // new BundleAnalyzerPlugin(),
    new WebpackManifestPlugin({
      writeToFileEmit: true,
    }),
    new LoaderOptionsPlugin({
      debug: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10,
        },
      },
    },
    runtimeChunk: true,
  },
  bail: true,
};

export default configs;