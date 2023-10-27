const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "production",
  entry: {
    login: path.resolve(__dirname, "client/src/script/login.ts"),
    register: path.resolve(__dirname, "client/src/script/register.ts"),
    forgotpassword: path.resolve(__dirname, "client/src/script/forgotpassword.ts"),
    bootstrap: path.resolve(__dirname, "client/src/script/bootstrap.ts"),
    tailwind: path.resolve(__dirname, "client/src/script/tailwind.ts"),
    wordle: path.resolve(__dirname, "client/src/script/wordle.ts"),
    music: path.resolve(__dirname, "client/src/script/music.ts"),
    video: path.resolve(__dirname, "client/src/script/video.ts"),
    search: path.resolve(__dirname, "client/src/script/search.ts"),
    profile: path.resolve(__dirname, "client/src/script/profile.ts"),
    settings: path.resolve(__dirname, "client/src/script/settings.ts"),
    account: path.resolve(__dirname, "client/src/script/account.ts"),
    changepassword: path.resolve(__dirname, "client/src/script/changepassword.ts"),
    bottomnav: path.resolve(__dirname, "client/src/script/bottomnav.ts"),
  },
  output: {
    path: path.resolve(__dirname, "client/dist/js"),
    filename: "[name].js",
    clean: true,
    assetModuleFilename: "[name][ext]",
  },
  // devtool: "source-map",
  target: ["web", "es5"],
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      // {
      //   test: /\.(cs|le|sa|sc)ss$/i,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     "less-loader",
      //     "sass-loader",
      //     "less-loader",
      //     "css-loader"
      //   ]
      // },
      {
        test: /\.ts$/i,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(j|t)s$/i,
        exclude: /node_modules/,
        include: /frontend/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
};
