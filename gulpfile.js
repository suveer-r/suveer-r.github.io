/* 
 * Template borrowed/stolen from https://github.com/cferdinandi/gulp-boilerplate 
 * Settings
 * Turn on/off build features
 */

var settings = {
	clean: true,
	concatScripts: true,
	scripts: false,
	lintscripts: true,
	polyfills: false,
	styles: true,
	copy: true,
	reload: true
};


/**
 * Paths to project folders
 */

var paths = {
	input: 'src/',
	output: 'build/',
	scripts: {
		input: ['src/js/*.js', 'node_modules/clipboard/dist/clipboard.min.js'],
		polyfills: '.polyfill.js',
		output: 'build/js/'
	},
	styles: {
		input: 'src/scss/**/*.scss',
		output: 'build/css/'
	},
	html: {
		input: 'src/*.html',
		output: './'
	},
	htmlMinify: {
		input: './index.html',
		output: './'
	},
	copy: {
		input: 'src/**/*.{svg,png,ico,webmanifest}',
		output: './build/'
	},
	reload: './build/'
};


/**
 * Template for banner to add to file headers
 */

var banner = {
	main:
		'/*!' +
		' <%= package.name %> v<%= package.version %>' +
		' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
		' | <%= package.license %> License\n' +
		' | <%= package.repository.url %>' +
		' */\n\n'
};


/**
 * Gulp Packages
 */

// General
var {gulp, src, dest, watch, series, parallel} = require('gulp');
var del = require('del');
var flatmap = require('gulp-flatmap');
var lazypipe = require('lazypipe');
var rename = require('gulp-rename');
var header = require('gulp-header');
var package = require('./package.json');

// Scripts
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-terser');
// var optimizejs = require('gulp-optimize-js');

// Styles
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var prefix = require('autoprefixer');
var minify = require('cssnano');

// HTML
var processhtml = require('gulp-processhtml');
var htmlmin = require('gulp-htmlmin');


/**
 * Gulp Tasks
 */

// Remove pre-existing content from output folders
var cleanDist = function (done) {

	// Make sure this feature is activated before running
	if (!settings.clean) return done();

	// Clean the build folder
	del.sync([
		paths.output
	]);

	// Signal completion
	return done();

};

// Process HTML
var buildHtml = function (done) {
	return src(paths.html.input)
		.pipe(processhtml())
		.pipe(dest(paths.html.output));
};

// HTML minify
var minifyHtml = function (done) {
	return src(paths.htmlMinify.input)
	  .pipe(htmlmin({ 
		  collapseWhitespace: true,
		  removeComments: true
	}))
	  .pipe(dest(paths.htmlMinify.output));
  };

  // Concat JS
  var jsConcat = function(done) {
	  if (!settings.concatScripts) return done();

	return src(paths.scripts.input)
	.pipe(concat('index.js'))
	.pipe(uglify())
	.pipe(header(banner.main, {package: package}))
	.pipe(rename({suffix: '.min'}))
	  .pipe(dest(paths.scripts.output));
  };

/* UNUSED BITS. GOOD TO KEEP FOR REF

// Repeated JavaScript tasks
var jsTasks = lazypipe()
	.pipe(header, banner.main, {package: package})
	// .pipe(optimizejs)
	.pipe(dest, paths.scripts.output)
	.pipe(rename, {suffix: '.min'})
	.pipe(uglify)
	// .pipe(optimizejs)
	.pipe(header, banner.main, {package: package})
	.pipe(dest, paths.scripts.output);

// Lint, minify, and concatenate scripts
var buildScripts = function (done) {

	// Make sure this feature is activated before running
	if (!settings.scripts) return done();

	// Run tasks on script files
	return src(paths.scripts.input)
		.pipe(flatmap(function(stream, file) {

			// If the file is a directory
			if (file.isDirectory()) {

				// Setup a suffix variable
				var suffix = '';

				// If separate polyfill files enabled
				if (settings.polyfills) {

					// Update the suffix
					suffix = '.polyfills';

					// Grab files that aren't polyfills, concatenate them, and process them
					src([file.path + '/*.js', '!' + file.path + '/*' + paths.scripts.polyfills])
						.pipe(concat(file.relative + '.js'))
						.pipe(jsTasks());

				}

				// Grab all files and concatenate them
				// If separate polyfills enabled, this will have .polyfills in the filename
				src(file.path + '/*.js')
					.pipe(concat(file.relative + suffix + '.js'))
					.pipe(jsTasks());

				return stream;

			}

			// Otherwise, process the file
			return stream.pipe(jsTasks());

		}));

}; */

// Lint scripts
var lintScripts = function (done) {

	// Make sure this feature is activated before running
	if (!settings.lintscripts) return done();

	// Lint scripts
	return src(paths.scripts.input)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));

}; 

// Process, lint, and minify Sass files
var buildStyles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.styles) return done();

	// Run tasks on all Sass files
	return src(paths.styles.input)
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}))
		.pipe(postcss([
			prefix({
				cascade: true,
				remove: true
			})
		]))
		.pipe(header(banner.main, {package: package}))
		.pipe(dest(paths.styles.output))

		.pipe(rename({suffix: '.min'}))
		.pipe(postcss([
			minify()
		]))
		.pipe(dest(paths.styles.output));

};

// Copy static files into output folder
var copyFiles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.copy) return done();

	// Copy static files
	return src(paths.copy.input)
		.pipe(dest(paths.copy.output));

};

// Watch for changes
var watchSource = function (done) {
	watch(paths.input, series(exports.default));
	done();
};

/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
	cleanDist,
	parallel(
		// buildScripts,
		jsConcat,
		lintScripts,
		buildStyles,
		copyFiles
		),
	buildHtml,
	// minifyHtml
);
// gulp watch
exports.watch = series(
	exports.default,
	watchSource
);