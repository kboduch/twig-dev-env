var gulp = require('gulp'),
    rootPath = './',
    dist = rootPath + 'dist',
    src = rootPath + 'src',

    distAssetPath = dist + '/assets',
    jsDistAssetPath = distAssetPath + '/js',
    cssDistAssetPath = distAssetPath + '/css',
    fontsDistAssetPath = distAssetPath + '/fonts',

    compileTwigSrc = [src + '/**/*.twig', '!' + src + '/**/_*.twig'],
    watchTwigSrc = [src + '/**/*.twig', rootPath + 'twigConfig.js'],

    watchBowerLibSrc = [rootPath + 'bower.json'],
    env = (process.argv.indexOf("--prod") != -1) ? 'production' : 'development'
    ;

gulp.task('compile-twig', function () {
    'use strict';
    var twig = require('gulp-twig'),
        twigConfig = require(rootPath + 'twigConfig');

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

gulp.task('main-bower-files', function () {
    var mainBowerFiles = require('main-bower-files');

    gulp.src(mainBowerFiles("**/*.js", {
        "env": env,
        "paths": rootPath
    }))
        .pipe(gulp.dest(jsDistAssetPath));

    gulp.src(mainBowerFiles("**/*.css", {
        "env": env,
        "paths": rootPath
    }))
        .pipe(gulp.dest(cssDistAssetPath));

    gulp.src(mainBowerFiles("**/fonts/**", {
        "env": env,
        "paths": rootPath
    }))
        .pipe(gulp.dest(fontsDistAssetPath));
});

gulp.task('watch', function () {
    var watch = require('gulp-watch'),
        batch = require('gulp-batch');

    //twig
    watch(watchTwigSrc, batch(function (events, done) {
        gulp.start('compile-twig', done);
    }));

    //libs
    watch(watchBowerLibSrc, batch(function (events, done) {
        //run bower install
        //run main-bower-files
    }));

    //src/assets
});

gulp.task('build', ['compile-twig', 'main-bower-files']);
gulp.task('default', ['purge-dist', 'build', 'watch']);
