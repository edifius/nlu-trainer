const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = function (env) {
  return {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    watchOptions: {
      poll: true
    },
    module: {
      rules: [{
          test: /\.(js|jsx)$/,
          resolve: {
            extensions: [".js", ".jsx"],
            alias: {
              //Alias for Dashboard
              dashboardComponents: path.resolve(__dirname, 'src/dashboard/components'),
              dashboardAssets: path.resolve(__dirname, 'src/dashboard/assets'),
              dashboardViews: path.resolve(__dirname, 'src/dashboard/views'),
              dashboardVariables: path.resolve(__dirname, 'src/dashboard/variables'),
              dashboardRoutes: path.resolve(__dirname, 'src/dashboard/routes'),
              dashboardLayouts: path.resolve(__dirname, 'src/dashboard/layouts'),

              //Alias For Landing Page
              landingPageComponents: path.resolve(__dirname, 'src/landingPage/components/'),
              landingPageAssets: path.resolve(__dirname, 'src/landingPage/assets/'),
              landingPageViews: path.resolve(__dirname, 'src/landingPage/views/'),
              landingPageRoutes: path.resolve(__dirname, 'src/landingPage/routes/'),
              landingPageLayouts: path.resolve(__dirname, 'src/landingPage/layouts/'),

              //App Aliases
              stores: path.resolve(__dirname, 'src/stores'),
              network: path.resolve(__dirname, 'src/network')
            }
          },
          exclude: '/node_modules/',
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
            "css-loader"
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg|jpg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
                disable: true,
              },
            },
          ],
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ]
  }
}
