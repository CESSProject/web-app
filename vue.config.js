const FileManagerPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const production = process.env.NODE_ENV === 'production';
const path = require('path');

module.exports = {
  lintOnSave: true,
  publicPath: '/data',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://data.cesslab.co.uk/',
        changeOrigin: true,
        ws: false
        // pathRewrite: {
        //     '^/api': '/'
        // }
      },
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.module.rule('vue').use('vue-svg-inline-loader').loader('vue-svg-inline-loader').options({
      svgo: {
        plugins: [{
          removeViewBox: false

        }, {
          cleanupIDs: {
            remove: false,
            minify: false
          }
        }, {
          prefixIds: true
        }]
      }
    });
  },
  configureWebpack: config => {
    if (production) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // config.devtool = 'source-map';
      return {
        plugins: [new FileManagerPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })]
      }
    }
  },
  productionSourceMap: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/style/common.less')
      ]
    }
  }

};