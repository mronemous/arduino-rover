var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var traceur = require('gulp-traceur');
var header = require('gulp-header');
var footer = require('gulp-footer');
var install = require('gulp-install');


var ENVIRONMENT = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production'
}

var paths = {
	install: {
		 src: ['./package.json'],
     build: './build'
	},
  script: {
      src: ['./src/**/*.js'],
      build: './build'
  }
};

function ifEnvironment(environment, task) {
    return gutil.env.env === environment ? task : gutil.noop();
}

//Default args that were not provided.
if(!gutil.env.env) { gutil.env.env = ENVIRONMENT.DEVELOPMENT; }

gulp.task('default', ['script', 'watch']);

gulp.task('install', function() {

  return gulp.src(paths.install.src)
    .pipe(gulp.dest(paths.install.build))
	 	.pipe(install({production: true}));
});

// -- SCRIPTS -- //
gulp.task('script', function() {

  return gulp.src(paths.script.src)
    .pipe(ifEnvironment(ENVIRONMENT.DEVELOPMENT, sourcemaps.init()))
	  .pipe(traceur())
    .pipe(ifEnvironment(ENVIRONMENT.DEVELOPMENT, sourcemaps.write()))
    .pipe(gulp.dest(paths.script.build));
});

gulp.task('watch', function() {

  gulp.watch(paths.script.src, ['script']);
	//gulp.watch(paths.assets.src, ['assets']);

});
