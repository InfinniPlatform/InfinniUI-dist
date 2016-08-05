'use strict';

var gulp = require('gulp'),
			$ = require('gulp-load-plugins')(),
			combiner = require('stream-combiner2').obj,
			isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {
	return function(callback) {
		return combiner(
			gulp.src(options.src, {base: '.'}),
			$.wrapper({
				header: function(file) {
					return '//####' + file.base.replace(file.cwd, '') + file.relative + '\n';
				}
			}),
			$.concat(options.finalName),
			$.if(!isDevelopment, $.uglify()),
			gulp.dest(options.dest)
		).on('error', $.notify.onError({
				title: options.taskName
		}));
	};
};
