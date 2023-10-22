import { HotModuleReplacementPlugin, Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import * as path from 'path';
import Dotenv from 'dotenv-webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base';

const dev: Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: ['webpack-hot-middleware/client'],
  plugins: [
    // @ts-ignore
    new Dotenv(),
    new HtmlWebpackPlugin({
      title: 'Chat',
      filename: 'index.html',
      template: path.join(__dirname, '../app.ejs'),
      minify: false,
      hash: true,
      inject: 'body',
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
};

export default merge(baseConfig, dev);