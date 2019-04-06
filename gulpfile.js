const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const version = require('./package.json');

const $ = gulpLoadPlugins();

gulp.task('manifest', () => {
  return gulp
    .src('src/manifest.json')
    .pipe($.jsonEditor({ version: version.version }))
    .pipe(gulp.dest('build/'));
});

gulp.task('clean', () => {
  return del(['build']);
});
