const gulp = require('gulp'),
  concat = require("gulp-concat");
const del = require("del");
gulp.task('inline', function () {
  return gulp.src(['dist/inline.*.js'])
    .pipe(concat("inline.bundle.js"))
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot'));
});

gulp.task('main', function () {
  return gulp.src(['dist/main.*.js'])
    .pipe(concat("main.bundle.js"))
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot'));
});

gulp.task('polyfills', function () {
  return gulp.src(['dist/polyfills.*.js'])
    .pipe(concat("polyfills.bundle.js"))
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot'));
});
gulp.task('vendor', function () {
  return gulp.src(['dist/vendor.*.js'])
    .pipe(concat("vendor.bundle.js"))
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot'));
});
gulp.task('css', function () {
  return gulp.src(['dist/*.css'])
    .pipe(concat("style.css"))
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot'));
});
gulp.task('icon', function () {
  return gulp.src(['dist/*.ico'])
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot'));
});
gulp.task('font', function () {
  return gulp.src(['dist/fontawesome-webfont.*', 'dist/glyphicons-halflings-regular.*'])
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot'));
});

gulp.task('asset', function () {
  return gulp.src(['dist/assets/*'])  
    .pipe(gulp.dest('../Seed/src/Seed/wwwroot/assets'));
});

gulp.task('default', [
  'inline',
  'main',
  'polyfills',
  'vendor',
  'css',
  'icon',
  'asset',
  'font'
]);