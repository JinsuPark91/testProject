const path = require('path');
const CracoLessPlugin = require('craco-less');
const TerserPlugin = require('terser-webpack-plugin');
const TalkLinkPlugin = require('teespace-talk-app/link');

// TalkLinkPlugin(externalPublicPath = 'public')
TalkLinkPlugin();

const cracoWebpackConfig = {
  alias: {
    react: require.resolve('react'),
    'react-dnd': require.resolve('react-dnd'),
    'react-router-dom': require.resolve('react-router-dom'),
    'teespace-core': path.resolve(__dirname, 'node_modules/teespace-core'),
    antd: path.resolve(__dirname, 'node_modules/antd'),
    'styled-components': require.resolve('styled-components'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
};

if (process.env.HOST_TYPE === 'mobile') {
  cracoWebpackConfig.configure = (webpackConfig, { paths }) => {
    // eslint-disable-next-line no-param-reassign
    webpackConfig.entry = './src/index.mobile.js';
    // eslint-disable-next-line no-param-reassign, no-multi-assign
    paths.appBuild = webpackConfig.output.path = path.resolve('build/mobile');
    return webpackConfig;
  };
}

module.exports = {
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-class-properties',
    ],
  },
  webpack: cracoWebpackConfig,
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  eslint: {
    configure: {
      rules: {
        'no-unused-vars': 'off',
        'no-unused-expressions': 'off',
      },
    },
  },
};
