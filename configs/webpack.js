const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const { APP_DIR, ROOT_DIR, PUBLIC_DIR } = require('./webpack.consts');

module.exports = {
    devtool: 'eval-cheap-module-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.mjs'],
        modules: [APP_DIR, 'node_modules'],
    },
    entry: {
        app: [path.resolve(APP_DIR, 'app/index.tsx')],
    },
    target: 'web',
    output: {
        publicPath: '/',
        path: PUBLIC_DIR,
        // pathinfo: false,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
    },
    devServer: {
        contentBase: PUBLIC_DIR,
        publicPath: '/',
        headers: {
            'Access-Control-Allow-Origin': '*',
            https: true,
        },
        stats: {
            cachedAssets: false,
            chunkOrigins: false,
            colors: true,
            moduleTrace: false,
            providedExports: false,
            reasons: false,
            usedExports: false,
        },
        host: '0.0.0.0',
        hot: true, // Works with react 16
        disableHostCheck: true,
        historyApiFallback: { index: '/', disableDotRule: true },
        proxy: [
            {
                context: '/v1/ws',
                target: 'ws://[::1]:3000',
                ws: true,
            },
            {
                context: ['/v1'],
                target: 'http://[::1]:3000',
            },
            {
                context: ['/static'],
                target: 'http://[::1]:3000',
            },
        ],
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                type: 'javascript/auto',
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true,
                },
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: { url: false, sourceMap: true },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                ],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerNotifierWebpackPlugin({ excludeWarnings: true }),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
            title: 'Doqquz',
        }),
        new ForkTsCheckerWebpackPlugin({
            eslint: {
                // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
                files: './src/**/*.{ts,tsx,js,jsx}',
            },
        }),
        new StyleLintPlugin({
            context: APP_DIR,
            configFile: path.join(ROOT_DIR, '.stylelintrc.json'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(APP_DIR, 'assets/fonts'),
                    to: path.join(PUBLIC_DIR, 'assets/fonts'),
                    context: APP_DIR,
                },
                {
                    from: path.join(APP_DIR, 'assets/fonts'),
                    to: path.join(PUBLIC_DIR, 'assets/fonts'),
                    context: APP_DIR,
                },
                {
                    from: path.join(APP_DIR, 'assets/images'),
                    to: path.join(PUBLIC_DIR, 'assets/images'),
                    context: APP_DIR,
                },
                {
                    from: path.join(APP_DIR, 'assets/nls'),
                    to: path.join(PUBLIC_DIR, 'assets/nls'),
                    context: APP_DIR,
                },
                {
                    from: path.join(APP_DIR, 'assets/favicons'),
                    to: PUBLIC_DIR,
                    context: APP_DIR,
                },
            ],
        }),
    ],
};
