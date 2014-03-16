var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var paths = {
    js: 'src/**/*.js'
};


gulp.task('lint', function () {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('minify', function () {
    return gulp.src(paths.js)
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['lint', 'minify']);