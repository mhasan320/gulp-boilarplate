// import packages
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webp = require('gulp-webp');

// file path variables
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath:'app/js/**/*.js',
    imgPath:'app/img/**/*.{jpg,png}'
}

// Sass task
function scssTask() {
	return src(files.scssPath, { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()])) 
		.pipe(dest('dist/css', { sourcemaps: '.' })); 
}
// Js task

function jsTask(){
    return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('dist/js')
    );
}

// Cachebusting task
const cbString = new Date().getTime();
function cashBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, cbString))
        .pipe(dest('.')
    );
}


// Image minification task

function optimizeimg() {
    return src(files.imgPath)
      .pipe(imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
      ]))
      .pipe(dest('dist/img'))
  };

//webp image
function webpImage() {
    return src(files.imgPath)
      .pipe(webp())
      .pipe(dest('dist/img'))
  };


// watch task
function watchTask(){
    watch([files.scssPath, files.jsPath, files.imgPath],
        parallel(scssTask, jsTask, optimizeimg, webpImage));
}

// default task
exports.default = series(
    parallel(scssTask, jsTask, optimizeimg, webpImage),
    cashBustTask, 
    watchTask
);