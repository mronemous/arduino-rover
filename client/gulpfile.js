var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var traceur = require('gulp-traceur');
var header = require('gulp-header');
var footer = require('gulp-footer');
var imagemin  = require('gulp-imagemin');
var install = require('gulp-install');

var ENVIRONMENT = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production'
}

var paths = {
  sass: {
      app: ['./www_src/theme/**/*.scss', './www_src/components/**/*.scss'],
      build: './www/css/'
  },
  script: {
      app: ['./www_src/models/**/*.js', './www_src/components/**/*.js', './www_src/services/**/*.js'],
      build: './www/js/'
  },
	image: {
		 src: ['./www_src/img/**/*'],
     build: './www/img'
	},
	html: {
		 src: ['./www_src/**/*.html'],
     build: './www'
	},
	lib: {
		 src: ['./www_src/lib/**/*'],
     build: './www/lib'
	},
	install: {
		 src: ['./package.json', './bower.json'],
     build: './'
	}
};

function ifEnvironment(environment, task) {
    return gutil.env.env === environment ? task : gutil.noop();
}

//Default args that were not provided.
if(!gutil.env.env) { gutil.env.env = ENVIRONMENT.DEVELOPMENT; }

gulp.task('default', ['sass', 'script', 'image', 'html', 'lib', 'watch']);


// -- SASS -- //
gulp.task('sass:build', function() {

  var sassConfig = (gutil.env.env === ENVIRONMENT.DEVELOPMENT) ? {sourceComments: 'map', sourceMap: 'sass'} : {};

  return gulp.src(paths.sass.app)
    .pipe(concat('style.scss'))
    .pipe(gulp.dest(paths.sass.build))
    .pipe(sass(sassConfig))
    .pipe(concat('style.css'))
    .pipe(ifEnvironment(ENVIRONMENT.PRODUCTION, minifyCss({keepSpecialComments: 0})))
    .pipe(gulp.dest(paths.sass.build));
});

gulp.task('sass', ['sass:build']);

// -- SCRIPTS -- //
gulp.task('script', function() {
        
  return gulp.src(paths.script.app)
    //.pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(ifEnvironment(ENVIRONMENT.DEVELOPMENT, sourcemaps.init()))  
	  .pipe(traceur())
    .pipe(concat('app.js'))
	  //Surround script with a scope enclosure
		.pipe(header('(function () {\n')).pipe(footer('\n})();'))
    .pipe(ifEnvironment(ENVIRONMENT.DEVELOPMENT, sourcemaps.write())) 
    .pipe(ifEnvironment(ENVIRONMENT.PRODUCTION, ngAnnotate()))
    .pipe(ifEnvironment(ENVIRONMENT.PRODUCTION, uglify()))
    .pipe(gulp.dest(paths.script.build));
});

// -- IMAGES -- //
gulp.task('image', function () {
	return gulp.src(paths.image.src)
			.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
			.pipe(gulp.dest(paths.image.build));
});

// -- HTML -- //
gulp.task('html', function () {
	return gulp.src(paths.html.src)
			.pipe(gulp.dest(paths.html.build));
});

// -- LIB -- //
gulp.task('lib', function () {
	return gulp.src(paths.lib.src)
			.pipe(gulp.dest(paths.lib.build));
});


gulp.task('watch', function() {
  
  gulp.watch(paths.sass.app, ['sass']);
  gulp.watch(paths.script.app, ['script']);
	gulp.watch(paths.image.src, ['image']);
	gulp.watch(paths.html.src, ['html']);
	gulp.watch(paths.lib.src, ['lib']);
    
});

gulp.task('install', function() {

	//NOTE: npm install --dev has to be called for gulp to run.
	
  return gulp.src(paths.install.src)
    .pipe(gulp.dest(paths.install.build))
	 	.pipe(install());
});

