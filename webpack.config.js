const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html引擎
const NODE_ENV = process.env.NODE_ENV

if (NODE_ENV === 'dev') {
    module.exports = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'demo'),
            filename: 'index.js'
        },
        devtool: "source-map",
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, './public/index.html'),
                chunks: ['main', 'vendors'],
                minify: {
                    //压缩HTML文件
                    removeComments: true //移除HTML中的注释
                }
            })
        ]
    }
} else if (NODE_ENV === 'prod') {
    module.exports = {
        entry: './src/components/Clamp.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js'
        }
    }
}