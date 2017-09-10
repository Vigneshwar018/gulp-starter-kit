var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    minifyHTML = require('gulp-minify-html'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync'),
    $           = require('gulp-load-plugins')(),
    autoprefixer = require('autoprefixer');

var env,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

var liv = browserSync.reload;
env = 'development';

if (env==='development') {
  outputDir = 'dev/';
  sassStyle = 'expanded';
} else {
  outputDir = 'prod/';
  sassStyle = 'compressed';
}

sassSources = ['work/sass/style.scss'];
htmlSources = [outputDir + '*.html'];


var    PHPMYADMIN_FOLDER = 'phpmyadmin',
    AUTOOPEN_ADMIN = false;    

var LIVE_RELOAD_FILES = [
    '**/*.css',
    '*.css',
    '**/*.php',
    '*.php',
    '*.html'
];

var SERVERS = {
  DEV: { // Use 0.0.0.0 for access on devices in the same wifi
    HOST: '127.0.0.1',
    PORT: 3000
  },
  DEV_PHP: {
    HOST: '127.0.0.1', // For PHP server that will be proxied to DEV
    PORT: 8000
  },
  ADMIN: { // phpMyAdmin
    HOST: '127.0.0.1',
    PORT: 1337
  }
};

// gulp.task('connect_2', function() {
  
// });



gulp.task('sass', function () {
    return sass('work/sass/style.scss', {
      sourcemap: true,
      style: sassStyle
    })
    .on('error', function (err) {
        console.error('Error!', err.message);
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dev/css/"))
    .pipe(connect.reload())
    .pipe(browserSync.reload({
      stream: true
    }));
});


// gulp.task('compass', function() {
//   gulp.src(sassSources)
//     .pipe(compass({
//       sass: 'work/tools/sass',
//       image: outputDir + 'images',
//        style: sassStyle,
//       sourcemap: true
      
//     })
//     .on('error', gutil.log))
//     .pipe(gulp.dest(outputDir + 'css'))
//     .pipe(connect.reload())
// });



gulp.task('watch', function() {
  'use strict';
  gulp.watch(['*.scss', 'work/sass/*.scss'], ['sass']);
  gulp.watch('dev/*.html', ['html']);
  gulp.watch(['dev/*.php', '*/*.php'], liv);
  gulp.watch(['dev/css/*.css', '*/*.css'], liv);
});

gulp.task('connect', function() {
  'use strict';
  connect.server({
    root: outputDir,
    livereload: true
  });

  // // Server for wordpress (will be proxied)
  // $.connectPhp.server({
  //   base: outputDir,
  //   hostname: SERVERS.DEV_PHP.HOST,
  //   port: SERVERS.DEV_PHP.PORT
  // });

  // // Another server for phpMyAdmin, since connect-php doesn't support multiple bases
  // $.connectPhp.server({
  //   base: PHPMYADMIN_FOLDER,
  //   open: AUTOOPEN_ADMIN,
  //   hostname: SERVERS.ADMIN.HOST,
  //   port: SERVERS.ADMIN.PORT
  // });
});

gulp.task('browser-sync', function() {
  browserSync({
    files: LIVE_RELOAD_FILES,
    // proxy: "http://localhost/s01",
    //port:8888,
    notify: false
  }, function (err, bs) {
      if (err)
        console.log(err);
      else
        console.log('BrowserSync is ready.');
  });
});

gulp.task('html', function() {
  'use strict';
  gulp.src('dev/*.html')
    .pipe(gulpif(env === 'n', minifyHTML()))
    .pipe(gulpif(env === 'n', gulp.dest(outputDir)))
    .pipe(connect.reload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Copy images to production
gulp.task('move', function() {
  'use strict';
  gulp.src('dev/css/img/**/*.*')
  .pipe(gulpif(env === 'n', gulp.dest(outputDir+'css/img')));
});

// gulp.task('default', ['watch', 'html', 'sass', 'move', 'browser-sync', 'connect']);
gulp.task('default', ['watch', 'sass', 'html', 'browser-sync', 'connect']);