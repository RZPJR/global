const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "vue-mf",
    projectName: "global",
    webpackConfigEnv,
  });

  const config = merge(defaultConfig, {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: ["vue-loader"],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'style-loader',
              },
              {
                  loader: 'css-loader',
                  options: {
                      sourceMap: true,
                  },
              },
              {
                  loader: 'sass-loader',
                  options: {
                      sourceMap: true,
                  },
              },
          ],
        }
      ],
    },
    externals: ["vue", "vue-router", /^@vue-mf\/.+/],
    plugins: [new VueLoaderPlugin()],
  });

  return config;
};
