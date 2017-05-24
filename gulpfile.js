var gulp = require('gulp'),
    dist = './dist', src = './src',
    compileTwigSrc = [src + '/**/*.twig', '!' + src + '/**/_*.twig'],
    watchTwigSrc = [src + '/**/*.twig', './twigConfig.js']
;

gulp.task('compile-twig', function () {
    'use strict';
    var twig = require('gulp-twig'),
        twigConfig = require('./twigConfig');

    return gulp.src(compileTwigSrc)
        .pipe(twig({
            data: twigConfig.data,
            functions: twigConfig.functions,
            filters: twigConfig.filters,
            errorLogToConsole: true
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('purge-dist', function () {
    var clean = require('gulp-clean');

    gulp.src(dist + '/*', {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    var watch = require('gulp-watch'),
        batch = require('gulp-batch');

    watch(watchTwigSrc, batch(function (events, done) {
        gulp.start('purge-dist', done);
        gulp.start('compile-twig', done);
    }));

    //css


    //js

});

gulp.task('default', ['purge-dist', 'compile-twig', 'watch']);
