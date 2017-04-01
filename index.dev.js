import webpack from 'webpack';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackconfig from './webpack.dev.config.js';

const webpackcompiler = webpack(webpackconfig);

// enable webpack middleware for hot-reloads in development
function useWebpackMiddleware(app) {
  app.use(webpackDevMiddleware(webpackcompiler, {
    publicPath: webpackconfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
      'errors-only': true
    }
  }));
  app.use(webpackHotMiddleware(webpackcompiler, {
    log: console.log
  }));

  return app;
}

module.exports = {
  useWebpackMiddleware
};
