var gulp = require('gulp'),
    rootPath = './',
    dist = rootPath + 'dist',
    src = rootPath + 'src',

    distAssetPath = dist + '/assets',
    jsDistAssetPath = distAssetPath + '/js',
    cssDistAssetPath = distAssetPath + '/css',
    fontsDistAssetPath = distAssetPath + '/fonts',
    imagesDistAssetPath = distAssetPath + '/images',

    srcAssetPath = src + '/assets',
    jsSrcAssetPath = srcAssetPath + '/js',
    cssSrcAssetPath = srcAssetPath + '/css',
    sassSrcAssetPath = srcAssetPath + '/sass',
    imagesSrcAssetPath = srcAssetPath + '/images',

    compileTwigSrc = [src + '/**/*.twig', '!' + src + '/**/_*.twig'],
    watchTwigSrc = [src + '/**/*.twig', rootPath + 'twigConfig.js'],

    watchBowerLibSrc = [rootPath + 'bower.json'],

    watchJsSrc = jsSrcAssetPath + '/**/*.js',
    watchCssSrc = cssSrcAssetPath + '/**/*.css',
    watchSassSrc = sassSrcAssetPath + '/**/*.sass',
    watchimagesSrc = imagesSrcAssetPath + '/**/*.*',
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

gulp.task('copy-libs', function () {
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

gulp.task('bower-install', function () {
    var bower = require('gulp-bower');
    return bower();
});

gulp.task('compile-js', function () {
    'use strict';
    var concat = require('gulp-concat');

    return gulp.src(watchJsSrc)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDistAssetPath));
});

gulp.task('concat-css', function () {
    'use strict';
    var concat = require('gulp-concat-css');

    return gulp.src(watchCssSrc)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(cssDistAssetPath));
});

gulp.task('compile-sass', function () {
    var sass = require('gulp-sass');

    return gulp.src(watchSassSrc)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssSrcAssetPath));
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
        gulp.start('bower-install', function () {
            gulp.start('copy-libs', done);
        });
    }));

    //src assets
    watch(watchJsSrc, batch(function (events, done) {
        gulp.start('compile-js', done);
    }));

    watch(watchCssSrc, batch(function (events, done) {
        gulp.start('concat-css', done);
    }));

    watch(watchSassSrc, batch(function (events, done) {
        gulp.start('compile-sass', done);
    }));

    watch(watchimagesSrc, batch(function (events, done) {
        gulp.start('copy-images', done);
    }));
});

gulp.task('copy-images', function () {

    return gulp.src(watchimagesSrc)
        .pipe(gulp.dest(imagesDistAssetPath));
});

gulp.task('build', function () {
    var runSequence = require('run-sequence');
    runSequence(
        'purge-dist',
        [ 'bower-install', 'compile-twig', 'compile-js', 'compile-sass', 'copy-images'],
        [ 'copy-libs', 'concat-css']
    );
});

gulp.task('default', ['build', 'watch']);

//todo use gulp.watch, cleanup and stuff