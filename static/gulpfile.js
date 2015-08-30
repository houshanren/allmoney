/**
 * GULPFILE
 */

var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	bower = require('gulp-bower'),
	less = require('gulp-less');

var path = require('./path.js'),
	bundler = browserify({
		entries: [path.src.app],
		debug: true
	});

gulp.task('html:build', function () {

	return gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html));

});

gulp.task('css:build', function () {

	return gulp.src(path.src.css)
		.pipe(gulp.dest(path.build.css));

});

gulp.task('less:build', function () {

	return gulp.src(path.src.less)
		.pipe(less())
		.pipe(gulp.dest(path.build.css));

});

gulp.task('bower:build', function() {

	return bower(path.src.bower)
		.pipe(gulp.dest(path.build.lib));

});

gulp.task('lib:build', function () {

	return gulp.src(path.src.lib)
		.pipe(gulp.dest(path.build.lib));

});

gulp.task('app:build', function () {

	return bundler
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest(path.build.app));

});

gulp.task('assets:build', function () {

	return gulp.src(path.src.assets)
		.pipe(gulp.dest(path.build.assets));

});

gulp.task('build', [
	'html:build',
	'css:build',
	'less:build',
	'app:build',
	'bower:build',
	'lib:build',
	'assets:build'
]);

/**
 * Watch and rebuild files
 */
gulp.task('watch', function () {

	gulp.watch(path.watch.html, ['html:build']);
	gulp.watch(path.watch.css, ['css:build']);
	gulp.watch(path.watch.less, ['less:build']);
	gulp.watch(path.watch.app, ['app:build']);
	gulp.watch(path.watch.bower, ['bower:build']);
	gulp.watch(path.watch.lib, ['lib:build']);
	gulp.watch(path.watch.assets, ['assets:build']);

});

gulp.task('default', ['build', 'watch']);