const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://electronics-backend-production.up.railway.app",
      changeOrigin: true,
      secure: false,
    })
  );
};
