/**
 * GULPFILE
 */

var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream');

var path = require('./path.js'),
	bundler = browserify({
		entries: [path.src.app],
		debug: true
	});

gulp.task('html:build', function () {

	gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html));

});

gulp.task('css:build', function () {

	gulp.src(path.src.css)
		.pipe(gulp.dest(path.build.css));

});

gulp.task('lib:build', function () {

	gulp.src(path.src.lib)
		.pipe(gulp.dest(path.build.lib));

});

gulp.task('app:build', function () {

	return bundler
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest(path.build.app));

});

gulp.task('assets:build', function () {

	gulp.src(path.src.assets)
		.pipe(gulp.dest(path.build.assets));

});

gulp.task('build', [
	'html:build',
	'css:build',
	'app:build',
	'lib:build',
	'assets:build'
]);

/**
 * Watch and rebuild files
 */
gulp.task('watch', function () {

	gulp.watch(path.watch.html, ['html:build']);
	gulp.watch(path.watch.css, ['css:build']);
	gulp.watch(path.watch.app, ['app:build']);
	gulp.watch(path.watch.lib, ['lib:build']);
	gulp.watch(path.watch.assets, ['assets:build']);

});

gulp.task('default', ['build', 'watch']);