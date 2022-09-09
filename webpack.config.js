/* eslint-disable no-undef */
/* COMMENTS AND TUTORIALS */

 const path = require('path');
 const pkg = require('./package.json');
 const webpack = require('webpack');
 const HtmlWebPackPlugin = require('html-webpack-plugin');
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 const TerserPlugin = require('terser-webpack-plugin');
 const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
 const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
 
 const devMode = process.env.NODE_ENV === 'development';
 console.log('devMode', process.env.NODE_ENV);
 module.exports = (env) => {
 
 
	 return {
		 entry: {
			 mn: ['./src/index.js', './src/styles/main.css']
		 }
		 ,
		 output: {
			 publicPath: '/',
			 path: path.resolve(__dirname, 'build'),
			 filename: '[name].[chunkhash].js',
		 },
		 resolve: {
			 alias: {
				 root: path.resolve(__dirname, ''),
				 handlebars: 'handlebars/dist/handlebars.min.js'
			 },
			 fallback: {
				 crypto: require.resolve('crypto-browserify'),
				 stream: require.resolve('stream-browserify'),
				 buffer: require.resolve('buffer')
			 },
		 },
		 target: 'web',
		 module: {
			 rules: [
				 {
					 test: /\.html$/,
					 use: {
						 loader: 'html-loader',
						 options: {
							 minimize: !devMode
						 }
					 }
				 },
				 {
					 test: /\.worker\.js$/,
					 use: {
						 loader: 'worker-loader'
					 },
				 },
				 {
					 test: /.s?css$/,
					 use: [MiniCssExtractPlugin.loader, 'css-loader'],
				 },
				 {
					 test: /\.hbs$/,
					 use: [{
						 loader: 'html-loader',
						 options: {
							 minimize: false
						 }
					 }]
				 },
				 {
					 test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
					 type: 'asset/resource',
				 },
			 ]
		 },
		 optimization: {
			 minimize: devMode ? false : true,
			 moduleIds: 'deterministic',
			 minimizer: [
				 new TerserPlugin({
					 terserOptions: {
						 output: {
							 comments: /@license/i
						 },
						 warnings: true
					 },
					 extractComments: true,
					 parallel: true
				 }),
				 new CssMinimizerPlugin()
			 ]
			 ,
			 runtimeChunk: false
		 },
		 plugins: [
			 new HtmlWebPackPlugin({
				 template: './src/index.html',
				 filename: './index.html',
				 chunks: ['mn']
			 }),
			 new MiniCssExtractPlugin({
				 filename: '[name].[chunkhash].css',
				 chunkFilename: '[id].css'
			 }),
			 new webpack.DefinePlugin({
				 'process.env.MEDIATOR_JS_COV': JSON.stringify('development')
			 }),
			 new CaseSensitivePathsPlugin()
		 ],
		 stats: {
			 colors: true
		 },
		 devtool: devMode ? 'source-map' : false,
		 watchOptions: {
			 aggregateTimeout: 200,
			 poll: 1000
		 },
		 devServer: {
			 static: './build',
			 compress: true,
			 port: 9000,
			 hot: 'only'
		 },
		 mode: devMode ? 'development' : 'production'
	 };
 };
 