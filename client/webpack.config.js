// webpack.config.js

module.exports = function override(config, env) {
    config.devServer = {
      ...config.devServer,
      allowedHosts: 'all', // Allow all hosts
    };
    return config;
  };
  