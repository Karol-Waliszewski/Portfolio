const gulp = require('gulp'),
  sass = require('gulp-sass'),
  purify = require('gulp-purifycss'),
  sourcemaps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  mozjpeg = require('imagemin-mozjpeg'),
  pngquant = require('imagemin-pngquant'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  browserSync = require('browser-sync').create();

// ------- EDIT SECTION ------- //

var distDir = 'dist',
  buildDir = 'docs',
  srcDir = 'src';

var imageQuality = {
  jpg: 80, // %
  png: 90  // %
};

// ----------- END ----------- //

gulp.task('css-dev', () => {
  return gulp.src(`${srcDir}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write(`./maps`))
    .pipe(gulp.dest(`${distDir}/css`))
    .pipe(browserSync.stream());
});

gulp.task('css-build', () => {
  return gulp.src(`${srcDir}/sass/**/*.scss`)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(purify([`${srcDir}/js/**/*.js`, `${srcDir}/*.html`], {
      minify: true
    }))
    .pipe(gulp.dest(`${distDir}/css`))
    .pipe(browserSync.stream());
});

gulp.task('js-dev', () => {
  return gulp.src(`${srcDir}/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(sourcemaps.write(`./maps`))
    .pipe(gulp.dest(`${distDir}/js`));
});

gulp.task('js-build', () => {
  return gulp.src(`${srcDir}/js/**/*.js`)
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(`${distDir}/js`));
});

gulp.task('html', () => {
  return gulp.src(`${srcDir}/*.html`)
    .pipe(gulp.dest(distDir));
});

gulp.task('fonts', () => {
  return gulp.src(`${srcDir}/fonts/**/*.*`)
    .pipe(gulp.dest(`${distDir}/fonts`));
});

gulp.task('img', () => {
  return gulp.src(`${srcDir}/img/**/*.+(jpg|jpeg|png|svg|gif)`)
    .pipe(imagemin([
      //svg
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
      //jpg
      mozjpeg({
        quality: imageQuality.jpg,
        progressive: true
      }),
      //png
      pngquant({
        speed: 1,
        quality: imageQuality.png
      }),
    ]))
    .pipe(gulp.dest(`${distDir}/img`));
});

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: distDir
    }
  });
});

gulp.task('copy', ['html', 'fonts', 'img']);

gulp.task('watch', () => {
  gulp.watch(`${srcDir}/sass/**/*.scss`, ['css-dev']);
  gulp.watch(`${srcDir}/js/**/*.js`, ['js-dev']);
  gulp.watch(`${srcDir}/**/*.html`, ['html']);
  gulp.watch(`${srcDir}/img/**/*.+(jpg|jpeg|png|svg|gif)`, ['img']);
  gulp.watch(`${srcDir}/**/*.+(html|js)`).on('change', browserSync.reload);
});

gulp.task('default', ['css-dev', 'js-dev', 'copy', 'watch', 'server']);
gulp.task('dev', ['css-dev', 'js-dev', 'copy', 'watch', 'server']);
gulp.task('build', () => {
  distDir = buildDir;
  gulp.start(['css-build', 'js-build', 'copy']);
});
