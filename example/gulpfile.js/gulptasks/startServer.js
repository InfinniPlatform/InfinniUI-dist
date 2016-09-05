'use strict';

var browserSync = require('browser-sync').create('server:example'),
		historyApiFallback = require('connect-history-api-fallback');

module.exports = function(options) {
	var serverSettings;
	if( options.spa ) {
		serverSettings = {
			baseDir: options.src,
			middleware: [ historyApiFallback() ]
		};
	} else {
		serverSettings = options.src;
	}
	return function(callback) {
		browserSync.init({
			server: serverSettings,
			port: options.port,
			ui: options.ui
		});
		browserSync.watch(options.watch).on('change', browserSync.reload);
	};
};
