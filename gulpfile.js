const
    gulp = require('gulp'), 
    concat = require('gulp-concat'), 
    uglify = require('gulp-uglify'),
    postcss = require('gulp-postcss'), 
    autoprefixer = require('autoprefixer'), 
    cssnano = require('cssnano'), 
    gulpif = require('gulp-if'), 
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    browserSync = require('browser-sync');


// Check if the NODE_ENV command is 'production' or not & store a boolean.
const isPROD = process.env.NODE_ENV === 'production';

const jsFiles = [
    './src/scripts/*.js'
]

// Dev and production directories
const
    devDir = './dev/',
    prodDir = './prod/'
;

const jsonFiles = [
    './*.json'
]

// Run browserSync
serveFiles = () => {
    return browserSync.init({
            server: {
                baseDir: gulpif(!isPROD, devDir, prodDir)
            },
            port: 1989
        });
}



// BrowserSync Reload
browserSyncReload = (done) => {
    browserSync.reload();
    done();
}

// JS tasks
jsTasks = () => {
    return gulp
        .src(jsFiles)
                .pipe(gulpif(!isPROD, sourcemaps.init()))
                .pipe(babel({
                    presets: ['@babel/env']
                }))
                .pipe(gulpif(isPROD, uglify()))
                .pipe(gulpif(!isPROD, sourcemaps.write('.')))
                .pipe(
                    gulpif(!isPROD, gulp.dest(devDir + '/scripts/'), gulp.dest(prodDir + '/scripts/'))
                )
}

// CSS tasks
cssTasks = () => {
    const postcssPlugins = [
        autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }),
    ];
    if (isPROD) postcssPlugins.push(cssnano());
    return gulp
            .src('./src/main.css')
            .pipe(postcss(postcssPlugins))
            .pipe(
                gulpif(!isPROD, gulp.dest(devDir), gulp.dest(prodDir))
            );
}

// HTML tasks
htmlTasks = () => {
    return gulp
    .src('./src/*.html')
    .pipe(
        gulpif(isPROD, htmlmin({
            collapseWhitespace: true,
            removeComments: true,
        }))
    )
    .pipe(
        gulpif(!isPROD, gulp.dest(devDir), gulp.dest(prodDir))
    );
}


// Sounds Taks
soundFilesTasks = () => {
    return gulp
    .src('./src/sounds/**/*')
    .pipe(
        gulpif(!isPROD, gulp.dest(devDir + '/sounds/'), gulp.dest(prodDir + '/sounds/'))
    );
}

// JSON files tasks
jsonFilesTasks = () => {
    return gulp
    .src('./src/*.json')
    .pipe(
        gulpif(!isPROD, gulp.dest(devDir), gulp.dest(prodDir))
    );
}

// Optimize images
imagesTasks = () => {
    return gulp.src('./src/images/**/*')
                .pipe(
                    gulpif(isPROD, imagemin({verbose: true}))
                    )
                .pipe(
                    gulpif(!isPROD, gulp.dest(devDir + '/images/'), gulp.dest(prodDir + '/images/'))
                );
}

// Delete Dist folder
delDir = () => {
    return del([
        gulpif(!isPROD, devDir + 'images/', prodDir)
    ]).then(paths => {
        console.log('✔ Old site folder was deleted 🗑  ->', paths);
    });
}
gulp.task('del', delDir);

logShit = () => {
    console.log('💩 shit');
}



// Watch tasks
watchFiles = () => {
    gulp.watch('./src/*.html', htmlTasks);
    gulp.watch('./src/*.css', cssTasks);
    gulp.watch('./src/scripts/**/*', jsTasks);
    gulp.watch('./src/images/**/*', imagesTasks);
    gulp.watch('./src/sounds/**/*', soundFilesTasks);
    gulp.watch('./src/*.json', jsonFilesTasks)
    gulp.watch( // Reload page when files changes
        gulpif(!isPROD, devDir + '**/*', prodDir + '**/*'), // (if/else) Watch prod or dev folder
        browserSyncReload); 
}

// All tasks
gulp.task('serve', serveFiles);
gulp.task('js', jsTasks);
gulp.task('css', cssTasks);
gulp.task('html', htmlTasks);
gulp.task('images', imagesTasks);
gulp.task('sounds', soundFilesTasks);
gulp.task('jsonFiles', jsonFilesTasks);


// Main watch task
gulp.task('watch', gulp.series(
    delDir,
    gulp.parallel('html', 'css', 'js', 'images', 'sounds', 'jsonFiles'),
    gulp.parallel(watchFiles, 'serve')
    )
);

// Defaul Gulp task
gulp.task('default', gulp.parallel('watch'));

// Build website to publish
gulp.task('build', gulp.parallel(
    'html', 'css', 'js', 'images', 'sounds', 'jsonFiles'
    )
);