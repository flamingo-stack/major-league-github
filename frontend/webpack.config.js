const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconGeneratorPlugin = require('./webpack-plugins/favicon-generator-plugin');

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
      publicPath: '/',
      assetModuleFilename: 'assets/[name][ext]'
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: path.resolve(__dirname, 'tsconfig.json')
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(ico|png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]'
          }
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
          oneOf: [
            {
              issuer: /\.[jt]sx?$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    svgo: false,
                    ref: true,
                    titleProp: true,
                    memo: true
                  }
                }
              ]
            },
            {
              type: 'asset/resource',
              generator: {
                filename: 'assets/[name][ext]'
              }
            }
          ]
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@flamingo/ui-kit': path.resolve(__dirname, 'ui-kit/src'),
        // Force React to be resolved from main node_modules to prevent version conflicts
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
      modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'ui-kit/src'), 'node_modules']
    },
    plugins: [
      new FaviconGeneratorPlugin({
        svgPath: 'public/favicon.svg',
        icoPath: 'public/favicon.ico',
        size: 60
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            globOptions: {
              ignore: ['**/index.html']
            }
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: 'index.html',
        favicon: 'public/favicon.svg',
        templateParameters: {
          process: {
            env: {
              GTM_ID: process.env.GTM_ID || '',
              OG_TITLE: process.env.OG_TITLE || 'Major League GitHub',
              OG_DESCRIPTION: process.env.OG_DESCRIPTION || 'GitHub Scouting Report: Major League Edition',
              OG_TYPE: process.env.OG_TYPE || 'website',
              OG_IMAGE_URL: process.env.OG_IMAGE_URL || '/og-image.png',
              OG_URL: process.env.OG_URL || '',
              OG_SITE_NAME: process.env.OG_SITE_NAME || 'Major League GitHub',
              BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:8080',
              NODE_ENV: process.env.NODE_ENV || 'development',
              WEBAPP_EXTRA_BUTTON_LINK: process.env.WEBAPP_EXTRA_BUTTON_LINK || '/blog/why-we-built-mlg',
              WEBAPP_EXTRA_BUTTON_TEXT: process.env.WEBAPP_EXTRA_BUTTON_TEXT || 'Why MLG?'
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
          minifyJS: {
            compress: false,
            mangle: false
          },
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
      host: 'localhost',
      port: parseInt(PORT, 10),
      historyApiFallback: true,
      hot: true,
      open: true,
      proxy: [{
        context: ['/api'],
        target: BACKEND_API_URL,
        changeOrigin: true,
        secure: false,
      }],
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