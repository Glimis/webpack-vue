var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  devServer: {
    host: '0.0.0.0',
    port: 8080
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  resolve: {
    // 设置别名
    alias: {
      '@': path.resolve('src')// 这样配置后 @ 可以指向 src 目录
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};