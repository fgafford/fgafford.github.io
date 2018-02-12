const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const autoprefixer = require('autoprefixer')

const TARGET_ENV =
  process.env.npm_lifecycle_event === 'build' ? 'production' : 'development'

const PORT = process.env.PORT || 3000

const common = {
  entry: {
    app: ['./src/index.js'],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'sass-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer()],
              },
            },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: ['elm-hot-loader', 'elm-webpack-loader?verbose=true&warn=true'],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],

    noParse: /\.elm$/,
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),

    new HtmlWebpackPlugin({
      title: 'cckids',
      template: 'src/index.html',
    }),

    new CopyWebpackPlugin([
      {
        from: 'src/img',
        to: 'img',
      },
      {
        from: 'src/favicon.ico',
      },
    ]),
  ],
}

//
// DEVELOPMENT
//

if (TARGET_ENV === 'development') {
  console.log('=== Building for development')
  module.exports = merge(common, {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      // Hot Module Reload plugin recommends this in the js console
      new webpack.NamedModulesPlugin(),

      // Notify on buld errors
      new WebpackBuildNotifierPlugin({
        suppressSuccess: 'always',
      }),

      new ExtractTextPlugin('app.css'),

      new OpenBrowserPlugin({
        url: `http://localhost:${PORT}`,
      }),
    ],

    devServer: {
      port: PORT,
      inline: true,
      historyApiFallback: true,
      stats: {
        colors: true,
        children: false,
      },
    },
  })
}

//
// PRODUCTION
//

if (TARGET_ENV === 'production') {
  console.log('=== Building for production')
  module.exports = merge(common, {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]-[hash].js',
    },
    plugins: [
      // Apparently necessary when using [hash]
      new webpack.optimize.OccurrenceOrderPlugin(),

      new ExtractTextPlugin('app-[hash].css'),
    ],
  })
}
