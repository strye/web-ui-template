const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        static: './dist',
		client: {
			overlay: true,
		},
        hot: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                'index.html'
            ]
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};