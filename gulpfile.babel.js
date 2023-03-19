import gulp from 'gulp'
import cache from 'gulp-cached'
import plumber from 'gulp-plumber'
import { deleteSync } from 'del';
import browserSync from 'browser-sync'
import watch from 'gulp-watch'
import imagemin from 'gulp-imagemin'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import pngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import webpack from 'webpack'
import gulpWebpack from 'webpack-stream'

const config = {
  tasks: ['copy', 'sass', 'imagemin', 'script'],
  path: {
    root: {
      src: './src/',
      dest: './public/'
    },
    copy: {
      src: './src/**/*.+(html|pdf)'
    },
    imagemin: {
      src: './src/**/*.+(jpg|jpeg|png|gif|svg)'
    },
    sass: {
      src: './src/assets/sass/**/*.scss',
      base: './src/assets/sass/',
      dest: './public/assets/css/'
    },
    script: {
      src: './src/assets/js/**/*.js'
    }
  },
  options: {
    browserSync: {
      server: './public'
    },
    pngquant: { speed: 1 },
    sass: { outputStyle: 'expanded' },
    autoprefixer: {
      browsers: ['last 3 versions', 'ie >= 11']
    },
    webpack: {
      config: {
        prod: './webpack.prod.js',
        common: './webpack.common.js'
      }
    }
  }
}

// 掃除
gulp.task('clean', function (done) {
  deleteSync([config.path.root.dest])
  done()
})

// 開発サーバー
gulp.task('serve', function (done) {
  browserSync.init(config.options.browserSync)

  config.tasks.forEach(task => {
    watch(config.path[task].src, () => gulp.start(task))
  })
  done()
})

// コピー
gulp.task('copy', () => {
  return gulp
    .src(config.path.copy.src, { base: config.path.root.src })
    .pipe(cache('copy'))
    .pipe(plumber())
    .pipe(gulp.dest(config.path.root.dest))
    .pipe(browserSync.stream())
})

// 画像圧縮
gulp.task('imagemin', function (done) {
  gulp
    .src(config.path.imagemin.src, { base: config.path.root.src })
    .pipe(plumber())
    .pipe(
      imagemin([
        imageminGifsicle(),
        imageminSvgo(),
        pngquant(config.options.pngquant)
      ])
    )
    .pipe(gulp.dest(config.path.root.dest))
  done()
})

// Sass
gulp.task('sass', function (done) {
  gulp
    .src(config.path.sass.src, { base: config.path.sass.base })
    .pipe(plumber())
    .pipe(sass(config.options.sass))
    .pipe(gulp.dest(config.path.sass.dest))
    .pipe(browserSync.stream())
  done()
})

// JS
gulp.task('script', function (done) {
  async function asyncScript() {
    const name = 'prod'
    const webpackConfig = await import(config.options.webpack.config[name])

    gulp
      .src(config.path.script.src, { base: config.path.root.src })
      .pipe(cache('webpack'))
      .pipe(plumber())
      .pipe(gulpWebpack(webpackConfig.default, webpack))
      .pipe(gulp.dest(config.path.root.dest))
      .pipe(browserSync.stream())
    done()
  }
  asyncScript()
})

// gulp
gulp.task('default', gulp.series('imagemin', 'serve', function (done) {
  done()
}))

// ビルド
gulp.task('build', gulp.series('clean', config.tasks, function (done) {
  done()
}))
