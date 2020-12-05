let projectFolder = "assets";
let sourceFolder = "src";

let path = {
   build: {
      html: projectFolder + "/",
      css: projectFolder + "/css/",
      js: projectFolder + "/js/",
      img: projectFolder + "/img/",
      fonts: projectFolder + "/fonts/",
   },
   src: {
      html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
      css: sourceFolder + "/scss/*.+(scss|css)",
      js: sourceFolder + "/js/*.+(js|min.js)",
      img: sourceFolder + "/img/**/*.+(jpg|png|svg|gif|ico|webp|jpeg)",
      fonts: sourceFolder + "/fonts/*.+(ttf|woff|woff2|otf)",
   },
   watch: {
      html: sourceFolder + "/**/*.html",
      css: sourceFolder + "/scss/**/*.scss",
      js: sourceFolder + "/js/**/*.+(js|min.js)",
      img: sourceFolder + "/img/**/*.+(jpg|png|svg|gif|ico|webp|jpeg)",
   },
   clean: "./" + projectFolder + "/",
};

let { src, dest } = require("gulp"),
   gulp = require("gulp"),
   browserSync = require("browser-sync").create(),
   fileInclude = require("gulp-file-include"),
   del = require("del"),
   scss = require("gulp-sass"),
   autoprefixer = require("gulp-autoprefixer"),
   groupMedia = require("gulp-group-css-media-queries"),
   cleanCss = require("gulp-clean-css"),
   rename = require("gulp-rename"),
   uglify = require("gulp-uglify-es").default,
   imagemin = require("gulp-imagemin"),
   webp = require("gulp-webp"),
   webphtml = require("gulp-webp-html"),
   babel = require('gulp-babel');

function browser_sync() {
   browserSync.init({
      server: {
         baseDir: "./" + projectFolder + "/",
      },
      port: 3000,
      notify: false,
   });
}

function html() {
   return src(path.src.html)
      .pipe(fileInclude({
         prefix: '@',
         basepath: '@file'
      }))
      .pipe(webphtml())
      .pipe(dest(path.build.html))
      .pipe(browserSync.stream());
}

function css() {
   return src(path.src.css)
      .pipe(scss({ outputStyle: "expanded" }))
      .pipe(groupMedia())
      .pipe(
         autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true,
         })
      )
      .pipe(dest(path.build.css))
      .pipe(cleanCss())
      .pipe(
         rename({
            extname: ".min.css",
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browserSync.stream());
}

function js() {
   return src(path.src.js)
      .pipe(dest(path.build.js))
      .pipe(fileInclude())
      .pipe(dest(path.build.js))
      .pipe(uglify())
      .pipe(
         rename({
            extname: ".min.js",
         })
      )
      .pipe(
         babel({
            presets: ["@babel/env"],
         })
      )
      .pipe(dest(path.build.js))
      .pipe(browserSync.stream());
}

function images() {
   return src(path.src.img)
      .pipe(dest(path.build.img))
      .pipe(
         webp({
            quality: 70,
         })
      )
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(
         imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 3,
            svgoPlugins: [
               {
                  removeViewBox: false,
               },
            ],
         })
      )
      .pipe(dest(path.build.img))
      .pipe(browserSync.stream());
}

function fonts() {  
   return src(path.src.fonts).
      pipe(dest(path.build.fonts));
}

function watch_files() {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
}

function clean() {
   return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(images, js, css, html, fonts));
let watch = gulp.parallel(build, watch_files, browser_sync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
