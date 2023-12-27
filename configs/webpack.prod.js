const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const GitRevisionPlugin = require('git-revision-webpack-plugin');
// const deps = require('../package.json').dependencies;

const git = new GitRevisionPlugin({ branch: true });

const SRC_DIR = path.resolve(__dirname, '../src');
const BUILD_DIR = path.resolve(__dirname, '../build');

module.exports = {
    entry: {
        app: [path.resolve(SRC_DIR, 'app/index.tsx')],
    },
    output: {
        filename: '[name].[contenthash].js',
        publicPath: '/',
        path: BUILD_DIR,
    },
    devServer: {
        contentBase: BUILD_DIR,
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true,
        historyApiFallback: true,
        port: 2020,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
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
                include: SRC_DIR,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            // disable type checker - we will use it in fork plugin
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [
                                    tsImportPluginFactory({
                                        libraryDirectory: 'es',
                                        libraryName: 'antd',
                                    }),
                                ],
                            }),
                        },
                    },
                ],
            },
            {
                test: /\.s?css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { url: false, sourceMap: true },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['autoprefixer'],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.scss', '.css'],
        modules: [SRC_DIR, 'node_modules'],
        alias: {
            images: path.resolve(BUILD_DIR, 'assets/images'),
            fonts: path.resolve(BUILD_DIR, 'assets/fonts'),
            nls: path.resolve(BUILD_DIR, 'assets/nls'),
        },
    },
    optimization: {
        splitChunks: {
            name: false,
            cacheGroups: {
                default: false,
                commons: {
                    test: /[\\/]node_modules\/(react|react-dom)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            eslint: {
                files: './src/**/*.{ts,tsx}',
            },
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            title: 'Doqquz',
        }),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(SRC_DIR, 'assets/fonts'),
                    to: path.join(BUILD_DIR, 'assets/fonts'),
                    context: SRC_DIR,
                },
                {
                    from: path.join(SRC_DIR, 'assets/audio'),
                    to: path.join(BUILD_DIR, 'assets/audio'),
                    context: SRC_DIR,
                },
                {
                    from: path.join(SRC_DIR, 'assets/images'),
                    to: path.join(BUILD_DIR, 'assets/images'),
                    context: SRC_DIR,
                },
                {
                    from: path.join(SRC_DIR, 'assets/nls'),
                    to: path.join(BUILD_DIR, 'assets/nls'),
                    context: SRC_DIR,
                },
                {
                    from: path.join(SRC_DIR, 'assets/favicons'),
                    to: BUILD_DIR,
                    context: SRC_DIR,
                },
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.INFRA_ENV': JSON.stringify(git.branch() === 'master' ? 'production' : 'development'),
        }),
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(az|en-gb|ru)$/),
        // new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    ],
};
