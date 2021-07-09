/* eslint-env node */

const path = require('path')
const { CleanWebpackPlugin} = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'production',
  context: __dirname,
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js'
    },
    extensions: ['.js', '.json', '.vue']
  },
  entry: './src/index.js',
  externals: {
    'accounting-js': {
      commonjs: 'accounting-js',
      commonjs2: 'accounting-js',
      amd: 'accounting-js',
      root: 'accounting'
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "vue-numeric.min.js",
    library: 'VueNumeric',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          // Here you should change 'env' to '@babel/preset-env'
          presets: ['@babel/preset-env'],
        },
        exclude: path.resolve(__dirname, 'node_modules')
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ]
}