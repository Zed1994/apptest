const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const sass = require('sass');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || 102400,
  10
);
const PORT = process.env.PORT && Number(process.env.PORT);

const isEnvAnalyzer = process.env.ANALYZER === 'true';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const baseDomain = () => {
  let base = '';
  if (process.env.BUILDMODE === 'online') {
    base = `https://zk-smart.cdnjtzy.com${base}`;
  } else if (process.env.BUILDMODE === 'test') {
    //
  }
  return base;
};

// eslint-disable-next-line func-names
module.exports = function () {
  const mode = process.env.ENV || 'production';
  const isEnvDevelopment = mode === 'development';
  const isEnvProduction = mode === 'production';
  const shouldUseSourceMap = (!isEnvProduction && isEnvDevelopment) || false;

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          sourceMap: shouldUseSourceMap,
          ...cssOptions
        }
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            config: false,
            plugins: [
              // 'postcss-flexbugs-fixes',
              // [
              //   'postcss-preset-env',
              //   {
              //     autoprefixer: {
              //       flexbox: 'no-2009'
              //     },
              //     stage: 3
              //   }
              // ],
              [
                'postcss-pxtorem',
                {
                  rootValue: 128,
                  propList: ['*'],
                  unitPrecision: 12,
                  selectorBlackList: [/realpx/]
                }
              ]
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              // 'postcss-normalize'
            ]
          },
          sourceMap: shouldUseSourceMap
        }
      }
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            root: path.resolve(__dirname, 'src')
          }
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            implementation: sass,
            sourceMap: true,
            additionalData:
              '@use "sass:math";@import "./src/assets/style/variable.scss";@import "./src/assets/style/utils.scss";'
          }
        }
      );
    }
    return loaders;
  };

  return {
    target: ['browserslist'],
    mode,
    bail: isEnvProduction,
    ...(isEnvProduction ? {} : { devtool: 'cheap-module-source-map' }),
    entry: {
      main: `${__dirname}/src/main.ts`
    },
    output: {
      clean: true,
      path: `${__dirname}/dist`,
      publicPath: baseDomain(),
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].chunk.[contenthash:8].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext][query]',
      environment: {
        bigIntLiteral: false,
        destructuring: false,
        forOf: false,
        module: false,
        optionalChaining: false
      },
      pathinfo: false
    },
    cache: {
      name: 'ws-development-local-1.0.0',
      type: 'filesystem',
      cacheDirectory: `${__dirname}/node_modules/.smart-cache`,
      buildDependencies: {
        config: [`${__dirname}/webpack.config.js`]
      }
    },
    // infrastructureLogging: {
    //   level: 'none'
    // },
    optimization: {
      concatenateModules: !isEnvAnalyzer,
      runtimeChunk: false,
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          }
        }),
        new CssMinimizerPlugin()
      ]
      // splitChunks: {
      //   chunks: 'all',
      //   minSize: 20000,
      //   minRemainingSize: 0,
      //   minChunks: 1,
      //   maxAsyncRequests: 30,
      //   maxInitialRequests: 30,
      //   enforceSizeThreshold: 50000,
      //   cacheGroups: {
      //     vconsole: {
      //       test: /vconsole/,
      //       name: 'vconsole',
      //       priority: 1,
      //       reuseExistingChunk: true,
      //       chunks: 'all'
      //     },
      //     elementplus: {
      //       test: /element-plus/,
      //       name: 'element-plus',
      //       priority: 1,
      //       reuseExistingChunk: true,
      //       chunks: 'all'
      //     },
      //     vendor: {
      //       test: /[\\/]node_modules[\\/]/,
      //       name: 'vendor',
      //       priority: 0,
      //       reuseExistingChunk: true,
      //       chunks: 'all'
      //     },
      //     default: {
      //       minChunks: 2,
      //       priority: -1,
      //       reuseExistingChunk: true
      //     }
      //   }
      // }
    },
    resolve: {
      alias: {
        '@': `${__dirname}/src`
      },
      extensions: [
        '.js',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.css',
        '.scss',
        '.sass',
        '.json',
        '.wasm',
        '.vue',
        '.svg'
      ],
      modules: ['node_modules', `${__dirname}/src`]
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: [/@babel(?:\/|\\{1,2})runtime/, /@zhike\/driver\.js/],
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: require.resolve('source-map-loader')
        },
        { test: /\.vue$/, loader: 'vue-loader' },
        {
          oneOf: [
            {
              test: /\.svg$/,
              // include: [`${__dirname}/src`],
              // type: 'asset',
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx|vue)$/]
              },
              use: [
                {
                  loader: '@yzfe/svgicon-loader',
                  options: {
                    svgFilePath: [`${__dirname}/src`],
                    svgoConfig: null, // 自定义 svgo 配置
                    component: 'custom',
                    /** 自定义生成的代码 */
                    customCode: `;\n
                    const { defineComponent, h } = require('vue');
                    const { VueSvgIcon } = require('@yzfe/vue3-svgicon');
                    const SvgIconFC = defineComponent({
                      iconName: data.name,
                      name: data.name,
                      component: { VueSvgIcon },
                      setup(props) {
                        let newProps = { data };
                        if (props) {
                          Object.keys(props).forEach(function each(key) {
                              newProps[key] = props[key];
                          });
                        };
                        return ()=> h(VueSvgIcon, {...newProps});
                      }
                    });
                    export default SvgIconFC;
                    `
                  }
                }
              ]
            },
            {
              test: /\.(png|jpe?g|gif|webp|ico)$/i,
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit
                }
              }
            },
            { test: /\.mjs/, resolve: { fullySpecified: false } },
            {
              test: /\.(js|jsx|ts|tsx)$/,
              exclude: [/(node_modules|bower_components)/],
              loader: require.resolve('babel-loader'),
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  '@babel/plugin-syntax-import-meta',
                  [
                    '@vue/babel-plugin-jsx',
                    { transformOn: true, optimize: true, mergeProps: false }
                  ],
                  [
                    '@babel/plugin-transform-typescript',
                    { isTSX: true, allowExtensions: true }
                  ],
                  '@babel/plugin-transform-runtime'
                ]
              }
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                modules: {
                  mode: 'icss'
                }
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                modules: {
                  localIdentName: '[local]-[hash:base64:5]'
                }
              })
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  modules: {
                    mode: 'icss'
                  }
                },
                'sass-loader'
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  modules: {
                    localIdentName: '[local]-[hash:base64:5]'
                  }
                },
                'sass-loader'
              )
            },
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx|vue|html|json)$/],
              type: 'asset/resource'
            }
          ]
        }
      ].filter(Boolean)
    },
    plugins: [
      // new ZybApmPlugin(apmConfig),
      new HtmlWebpackPlugin({
        chunks: ['main'],
        filename: 'index.html',
        scriptLoading: 'defer',
        template: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        },
        environment: mode
      }),
      // new HtmlWebpackPlugin({
      //   // chunks: ['vendor', 'sck'],
      //   chunks: ['sck'],
      //   filename: 'sck.html',
      //   scriptLoading: 'defer',
      //   inject: true,
      //   template: 'sck.html'
      // }),
      // new HtmlWebpackPlugin({
      //   chunks: ['about'],
      //   excludeChunks: ['element-plus'],
      //   filename: 'about.html',
      //   scriptLoading: 'defer',
      //   inject: true,
      //   template: 'about.html'
      // }),
      new webpack.DefinePlugin({
        'process.env.mode': mode,
        'process.env.env': '',
        'process.env.proxyTarget': `'${process.env.proxyTarget}'`,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      }),
      new WebpackBarPlugin({
        name: '[something]',
        color: 'green',
        reporters: ['fancy'],
        reporter: null
      }),
      new VueLoaderPlugin({}),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css'
        }),
      isEnvProduction &&
        new CopyPlugin({
          patterns: [{ from: 'public', to: '.' }]
        }),
      isEnvAnalyzer && new BundleAnalyzerPlugin()
    ].filter(Boolean),
    experiments: { outputModule: false, topLevelAwait: true, backCompat: true },
    stats: { preset: 'errors-warnings' },
    devServer: {
      allowedHosts: ['all'],
      host: '0.0.0.0',
      port: 3000,
      historyApiFallback: true,
      static: [
        `${__dirname}/public`,
        {
          directory: `${__dirname}/dist`,
          publicPath: '/static/ws',
          staticOptions: {
            setHeaders(res, _path) {
              if (!_path.toString().endsWith('.d.ts') || !res) return;
              res.set('Content-Type', 'application/javascript; charset=utf-8');
            }
          }
        }
      ],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization'
      },
      client: { overlay: { errors: true, warnings: true } },
      open: false,
      hot: true,
      proxy: {}
    }
  };
};
