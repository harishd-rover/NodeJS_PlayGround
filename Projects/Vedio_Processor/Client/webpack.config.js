const path = require("path");

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    filename: "scripts.js",
    path: path.resolve(__dirname, "../client/dist"),
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'src/assets'),
      },
      {
        directory: path.join(__dirname, 'dist'),
      },
    ],
    port: 4200,
    hot:true
  },
  resolve: {
    extensions: [".jsx", ".js"],
  },
};
