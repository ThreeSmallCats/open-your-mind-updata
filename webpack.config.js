const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var getHtmlConfig = function (name, title) {
    return {
        template: './src/view/' + name + '.html',
        title: title,
        // favicon: './favicon.ico',
        filename: name + '.html',
        inject: true,
        hash: true,
        chunks: ['common', name]
    };
}

const config = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }]
            },
            {
                test: /\.less$/,
                use: extractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'pic/[name].[ext]',
                        publicPath: '../'
                    }
                }]
            },
            {
                test : /\.string$/,
                use :[
                    {loader : 'html-loader'}
                ]
            }
        ]
    },
    devServer: {
        port: 9000,
        contentBase: './dist',
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        // new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(getHtmlConfig('index', '打开你的思维')),
        new extractTextWebpackPlugin({
            filename: 'css/[name].css'
        })
    ]
}
module.exports = config;