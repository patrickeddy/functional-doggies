module.exports = {
  entry: './src/index.js',
  output: {
    filename: './bundle.js'
  },
  devServer: {
    contentBase: './'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  }
}
