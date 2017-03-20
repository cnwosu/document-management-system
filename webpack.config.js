module.exports = {
  entry: './server.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /server\/.+.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /css\/.+.(scss|css)$/,
        loader: 'style!css!sass'
      }
    ]

  },
  target: 'node'
};
