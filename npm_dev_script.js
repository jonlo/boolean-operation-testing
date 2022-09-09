/* eslint-disable no-undef */
const { execSync } = require('child_process');
execSync('npm install', { stdio: 'inherit' });
process.env.NODE_ENV = 'development';
execSync(`webpack-dev-server --progress --stats-children --stats-error-details --env ${process.env.NODE_ENV}`,
	{ stdio: 'inherit' }
);