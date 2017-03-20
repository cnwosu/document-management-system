
const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const cleanCSS = require('gulp-clean-css');

gulp.task('default', ['watch'], () => {
});

gulp.task('watch', () => {
  gulp.watch('server/*.js', () => {
    gulp.src('server/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('/'));
  });
});

gulp.task('minify-css', () => {
  return gulp.src('client/styles/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('nodemon', () => {
  nodemon({
    script: 'bundle.js',
  });
});
