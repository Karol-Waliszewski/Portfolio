const gulp = require("gulp"),
  sass = require("gulp-sass"),
  purify = require("gulp-purifycss"),
  sourcemaps = require("gulp-sourcemaps"),
  imagemin = require("gulp-imagemin"),
  mozjpeg = require("imagemin-mozjpeg"),
  optipng = require("imagemin-optipng"),
  uglify = require("gulp-uglify"),
  babel = require("gulp-babel"),
  browserSync = require("browser-sync").create();

// ------- EDIT SECTION ------- //

var distDir = "dist",
  buildDir = "docs",
  srcDir = "src";

var imageQuality = {
  jpg: 80, // %
  png: 6 // 1 - 7
};

// ----------- END ----------- //

var cssDev = () => {
  return gulp
    .src(`${srcDir}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write(`./maps`))
    .pipe(gulp.dest(`${distDir}/css`))
    .pipe(browserSync.stream());
};

var cssBuild = () => {
  return gulp
    .src(`${srcDir}/sass/**/*.scss`)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      purify([`${srcDir}/js/**/*.js`, `${srcDir}/*.html`], {
        minify: true
      })
    )
    .pipe(gulp.dest(`${distDir}/css`))
    .pipe(browserSync.stream());
};

var jsDev = () => {
  return gulp
    .src(`${srcDir}/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(sourcemaps.write(`./maps`))
    .pipe(gulp.dest(`${distDir}/js`));
};

var jsBuild = () => {
  return gulp
    .src(`${srcDir}/js/**/*.js`)
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(`${distDir}/js`));
};

var html = () => {
  return gulp.src(`${srcDir}/*.html`).pipe(gulp.dest(distDir));
};

var fonts = () => {
  return gulp.src(`${srcDir}/fonts/**/*.*`).pipe(gulp.dest(`${distDir}/fonts`));
};

var img = () => {
  return gulp
    .src(`${srcDir}/img/**/*.+(jpg|jpeg|png|svg|gif)`)
    .pipe(
      imagemin([
        //svg
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false
            }
          ]
        }),
        //jpg
        mozjpeg({
          quality: imageQuality.jpg,
          progressive: true
        }),
        //png
        optipng({
          optimizationLevel: imageQuality.png
        })
      ])
    )
    .pipe(gulp.dest(`${distDir}/img`));
};

var server = cb => {
  browserSync.init({
    server: {
      baseDir: distDir
    }
  });
  cb();
};

var watch = () => {
  gulp.watch(`${srcDir}/sass/**/*.scss`, cssDev);
  gulp.watch(`${srcDir}/js/**/*.js`, jsDev);
  gulp.watch(`${srcDir}/**/*.html`, html);
  gulp.watch(`${srcDir}/img/**/*.+(jpg|jpeg|png|svg|gif)`, img);
  gulp.watch(`${srcDir}/**/*.+(html|js)`).on("change", browserSync.reload);
};

var setBuild = cb => {
  distDir = buildDir;
  cb();
};

const copy = gulp.parallel(html, fonts, img);
const dev = gulp.series(gulp.parallel(cssDev, jsDev, html), server, watch);
const build = gulp.series(setBuild, gulp.parallel(cssBuild, jsBuild, copy));

exports.copy = copy;
exports.dev = dev;
exports.build = build;

exports.default = dev;
