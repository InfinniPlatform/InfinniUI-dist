'use strict';

var gulp = require('gulp'),
			$ = require('gulp-load-plugins')(),
			through2 = require('through2').obj,
			combiner = require('stream-combiner2').obj;

module.exports = function(options) {
	return function(callback) {
		return combiner(
			gulp.src(options.src),
			through2(function(file, enc, callback) {
				for(var key in options.changedVariables) {
					var re = new RegExp(key + ': "some.less";'),
							newValue = key + ': "' + options.changedVariables[key] + '";';
					file.contents = new Buffer(file.contents.toString().replace(re, newValue));
				}
				callback(null, file);
			}),
			$.less(),
			$.myth(),
			$.csso(),
			$.autoprefixer({browsers: ['last 2 versions']}),
			gulp.dest(options.dest)
		).on('error', $.notify.onError({
				title: options.taskName
		}));
	};
};
