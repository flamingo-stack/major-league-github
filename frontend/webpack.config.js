const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Read environment variables with fallbacks
const PORT = process.env.PORT || '8450';
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://major-league-github.flamingo.cx';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Webpack config:', {
  PORT,
  BACKEND_API_URL,
  NODE_ENV
});

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        },
        {
          test: /\.svg$/,
          use: [{
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ref: true,
              svgoConfig: {
                plugins: [{
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      removeTitle: false
                    }
                  }
                }]
              },
              titleProp: true
            }
          }]
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new HtmlWebpackPlugin({
        template: 'index.html',
        templateParameters: {
          process: {
            env: {
              OG_TITLE: process.env.OG_TITLE || 'Major League GitHub',
              OG_DESCRIPTION: process.env.OG_DESCRIPTION || 'GitHub Scouting Report: Major League Edition',
              OG_TYPE: process.env.OG_TYPE || 'website',
              OG_IMAGE_URL: process.env.OG_IMAGE_URL || '/og-image.jpg',
              OG_URL: process.env.OG_URL || '',
              OG_SITE_NAME: process.env.OG_SITE_NAME || 'Major League GitHub',
              BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:8080',
              NODE_ENV: process.env.NODE_ENV || 'development'
            }
          }
        },
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/'
      },
      port: parseInt(PORT, 10),
      historyApiFallback: true,
      hot: true,
      proxy: {
        '/api': {
          target: BACKEND_API_URL,
          changeOrigin: true,
          secure: false,
        }
      },
      client: {
        overlay: {
          errors: true,
          warnings: false
        },
        logging: 'info'
      }
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: {
        name: 'runtime',
      },
    },
    performance: {
      hints: false,
    },
    devtool: isProduction ? false : 'source-map',
  };
}; 