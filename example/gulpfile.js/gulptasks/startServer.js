'use strict';

var browserSync = require('browser-sync').create('server:example');

module.exports = function(options) {
	return function(callback) {
		browserSync.init({
			server: options.src,
			port: options.port,
			ui: options.ui
		});
		browserSync.watch(options.watch).on('change', browserSync.reload);
	};
};
