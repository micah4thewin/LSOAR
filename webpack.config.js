const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const pages = require('./src/pages.js');

function generateEntryPoints() {
  const entries = {};
  for (const page of pages) {
    entries[page.name] = `${page.path}/index.js`;
  }
  return entries;
}

function generateHtmlPlugins() {
  const plugins = pages.map(
    (page) =>
    new HtmlWebpackPlugin({
      template: `${page.path}/index.html`,
      filename: `${page.name}.html`,
      chunks: [page.name],
      minify: true,
    })
  );
  return plugins;
}
module.exports = {
  mode: 'development',
  entry: {
    ...generateEntryPoints(),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  devtool: "source-map",
  devServer: {  proxy: {
      '/database': 'http://localhost:3001'
     }
    },

  module: {
    rules: [{
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]'
        }
      },
      {
        test: /\.glb$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/models/[name].[hash:7].[ext]' // Adjust the output path as needed
            }
          }
        ]
      },
      {
        test: /\.(ogg|ogv|ogx|webm|mp4)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'videos/[name][ext][query]'
        }
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource',
        generator: {
          filename: 'audio/[name][ext][query]'
        }
    },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', {
                interlaced: true
              }],
              ['jpegtran', {
                progressive: true
              }],
              ['optipng', {
                optimizationLevel: 5
              }],
              [
                'svgo',
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      convertShapeToPath: {
                        convertArcs: true,
                      },
                      convertPathData: false,
                    },
                  },
                },
              ],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8090,
    open: true,
    hot: true,
    historyApiFallback: {
        rewrites: [{
            from: /^\/$/,
            to: '/index.html'
          },
          // Add more rewrites as needed
        ],
      },
  },

  plugins: [
    ...generateHtmlPlugins(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],
};
