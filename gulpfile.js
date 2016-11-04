var gulp = require('gulp');
var gutil = require('gulp-util');
var uglifyjs = require('gulp-uglify');
var watch = require('gulp-watch');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');
var fileinclude = require('gulp-file-include');
var imagemin = require('gulp-imagemin');
var gulpSequence = require('gulp-sequence');
var sass = require('gulp-sass');
var fs = require('fs');
var shell = require('gulp-shell');
var mustache = require('gulp-mustache');

gulp.task('cleanjs', shell.task('rm -f build/js/*'));
gulp.task('uglifyjs', function(){
  return gulp
    .src('src/js/*.js')
    .pipe(concat('all-'+ Date.now() +'.js'))
    .pipe(uglifyjs())
    .pipe(gulp.dest('build/js'));
});

gulp.task('cleancss', shell.task('rm -f build/css/*'));
gulp.task('minifycss', function(){
  return gulp
    .src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles-'+ Date.now() +'.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/css'));
});

gulp.task('copylibs', function(){
  return gulp
    .src('src/libs/*')
    .pipe(gulp.dest('build/libs'));
});

gulp.task('replacehtml', function(){
  var jsName = 'js/' + fs.readdirSync('./build/js/')[0];
  var cssName = 'css/' + fs.readdirSync('./build/css/')[0];

  return gulp
    .src('src/index.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlReplace({
      'js': jsName,
      'css': cssName
    }))
	.pipe(mustache('./src/settings.json'))
    .pipe(gulp.dest('build/'));
});

gulp.task('cleanimages', shell.task('rm -f build/images/*'));
gulp.task('minifyimages', function () {
  return gulp
    .src('src/images/*')
    //.pipe(imagemin())
    .pipe(gulp.dest('build/images'));
});


gulp.task('imagesSequence', function(callback) {
  gulpSequence('cleanimages', 'minifyimages')(callback);
});
gulp.task('jsSequence', function(callback) {
  gulpSequence('cleanjs', 'uglifyjs', 'replacehtml')(callback);
});
gulp.task('cssSequence', function(callback) {
  gulpSequence('cleancss', 'minifycss', 'replacehtml')(callback);
});

gulp.task('build', gulpSequence(['cleanimages', 'cleanjs', 'cleancss'], ['minifyimages', 'uglifyjs', 'minifycss', 'copylibs'], 'replacehtml'));

gulp.task('watch', function(){
  gulp.watch('src/js/*.js', ['jsSequence'])
  gulp.watch('src/css/*.scss', ['cssSequence']);
  gulp.watch('src/libs/*', ['copylibs']);
  gulp.watch('src/images/*', ['imagesSequence']);
  gulp.watch('src/*.html', ['replacehtml']);
  gulp.watch('src/*.json', ['replacehtml']);
});
