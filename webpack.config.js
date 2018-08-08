var webpack = require('webpack');

// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Paths
const path = require('path');

module.exports = {
    entry: './_src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'swagal.js'
    },
 
    module: {
        rules: [
            // Babel
            { 
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },

            // CSS
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                  ],
            },

        ] // End rules
    }, // End module

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'swagal.css'
        }),

        // ======= HTML pages ===========
        // Landing(index.html)
        new HtmlWebpackPlugin({  
            filename: 'index.html',
            template: '_example/index.html',
        }),
    ],

    /* ============================
            DEV SERVER
    =============================== */

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
    }
}


