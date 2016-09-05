'use strict';
var help = '';
var gulp = require('gulp'),
			watch = require('gulp-watch'),
			sourceForTasks = require('./gulptasks/sourceForTasks'),
			lazyRequireTask = function(taskName, path, options) {
				options = options || {};
				options.taskName = taskName;
				gulp.task(taskName, function(callback) {
					var task = require(path).call(this, options);
					return task(callback);
				});
			};
for(var key in sourceForTasks) {
	help += ('- gulp ' + key + '\n');
	lazyRequireTask(key, sourceForTasks[key].taskPath, sourceForTasks[key]);
}

gulp.task('build', gulp.series(
	gulp.parallel(gulp.series('copyPlatform', 'overrideLess'), 'concatJs', 'concatTemplates')
));

gulp.task('fullWatch', function() {
	watch(sourceForTasks.copyPlatform.src, gulp.series('copyPlatform', 'overrideLess'));
	watch(sourceForTasks.overrideLess.srcForWatch, gulp.series('overrideLess'));
	watch(sourceForTasks.concatJs.src, gulp.series('concatJs'));
	watch(sourceForTasks.concatTemplates.src, gulp.series('concatTemplates'));
});

gulp.task('example', gulp.series(
	'build',
	gulp.parallel('fullWatch', 'server:example')
));

gulp.task('default', function(cb) {
	console.log('####Task is not defined!\n' +
							'####Use any of defined tasks:\n' +
							help +
							'- gulp build\n' +
							'- gulp example'
							);
	cb();
});
