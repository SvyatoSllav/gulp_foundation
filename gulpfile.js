const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
let browserSync = require('browser-sync').create();


const paths = {
  html: {
    src: "src/*.html",
    dest: "dist/"
  },
  styles: {
    src: "src/styles/**/*.less",
    dest: "dist/css/"
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/js/"
  },
  images: {
    src: "src/images/**",
    dest: "dist/images/"
  }
}

function clean() {
  return del(['dist', '!dist/img'])
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function img() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest(paths.images.dest))
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }})
  gulp.watch(paths.html.dest).on("change", browserSync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, img);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, img, html), watch);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.watch = watch;
exports.build = build;
exports.default = build;