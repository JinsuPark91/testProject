const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    '/CMS',
    createProxyMiddleware({
      target: `http://${process.env.REACT_APP_DEV_SERVICE_DOMAIN}`,
      changeOrigin: true,
      preserveHeaderKeyCase: true,
      onProxyReq: (proxyReq, req, res) => {
        if (req.headers.proobjectwebfiletransfer) {
          proxyReq.setHeader('ProObjectWebFileTransfer', true);
        }
      },
    }),
  );
};
