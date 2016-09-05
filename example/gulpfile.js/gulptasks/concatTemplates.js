'use strict';

var gulp = require('gulp'),
			$ = require('gulp-load-plugins')(),
			through2 = require('through2').obj,
			combiner = require('stream-combiner2').obj;

module.exports = function(options) {
	return function(callback) {
		var firstStream = true;
		return combiner(
			gulp.src(options.src),
			$.templateCompile({
				namespace: "InfinniUI.Template"
			}),
			through2(function(file, enc, callback) {
				//convert file.content into string
				var newFileContent = new Buffer(file.contents).toString(),
						re = /\(function\(\) \{([\s\S]*)\}\)\(\);/,
						re2 = /\n/g,
						firstStr = 'this["InfinniUI"] = this["InfinniUI"] || {};\nthis["InfinniUI"]["Template"] = this["InfinniUI"]["Template"] || {};\n';
				newFileContent = '\nthis' + newFileContent.match(re)[1].slice(130).replace(re2, '') + ';';
				if( firstStream ) {
					firstStream = false;
					newFileContent = firstStr + newFileContent;
				}
				//convert file.content into Buffer
				file.contents = new Buffer(newFileContent);
				callback(null, file);
			}),
			$.concat(options.finalName),
			gulp.dest(options.dest)
		).on('error', $.notify.onError({
				title: options.taskName
		}));
	};
};
