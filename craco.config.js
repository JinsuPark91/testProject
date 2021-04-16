const path = require('path');
const CracoLessPlugin = require('craco-less');
const TalkLinkPlugin = require('teespace-talk-app/link');

// TalkLinkPlugin(externalPublicPath = 'public')
TalkLinkPlugin();

module.exports = {
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-class-properties',
    ],
  },
  webpack: {
    alias: {
      react: require.resolve('react'),
      'react-dnd': require.resolve('react-dnd'),
      'react-router-dom': require.resolve('react-router-dom'),
      'teespace-core': path.resolve(__dirname, 'node_modules/teespace-core'),
      antd: path.resolve(__dirname, 'node_modules/antd'),
    },
  },
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
