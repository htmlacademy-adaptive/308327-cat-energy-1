import gulp from 'gulp';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso'; //styleMin
import terser from 'gulp-terser'; //jsMin
import squoosh from 'gulp-libsquoosh'; //imgMin
import svgo from 'gulp-svgo'; //svgMin
import svgstore from 'gulp-svgstore'; //svgSprite
import cheerio from 'gulp-cheerio'; //clearFill
import rename from 'gulp-rename';
import del from 'del';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Html

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('build/js'));
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

//WebP

const createWebp = () => {
  return gulp.src([
    'source/img/**/*.{jpg,png}',
    '!source/img/favicons/*.png'
  ])
  .pipe(squoosh({
    webp:{}
    })
  )
  .pipe(gulp.dest('build/img'));
}

//SVG

const optimizeSvg = () => {
  return gulp.src('source/img/**/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

export const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
  .pipe(svgo())
  .pipe(cheerio({
    run: ($) => {
        $('[fill]').removeAttr('fill');
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
}


//Clean

const clean = () => {
  return del('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/script/.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}


//Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  optimizeSvg,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);

//Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  sprite,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizeSvg,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
