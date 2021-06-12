const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
	},
	resolve: {
		modules: [path.join(__dirname, 'src'), 'node_modules'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		})
	]
};