const path = require('path');

const ROOT_DIR = path.join(__dirname, '../');
const APP_DIR = path.join(ROOT_DIR, 'src');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const PUBLIC_DIR = path.join(BUILD_DIR, 'public');

module.exports = {
    ROOT_DIR,
    APP_DIR,
    BUILD_DIR,
    PUBLIC_DIR,
};
