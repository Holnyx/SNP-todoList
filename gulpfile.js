
import gulp from 'gulp'
import { path } from './gulp/config/path.js'
import { reset } from './gulp/tasks/reset.js'
import { html } from './gulp/tasks/html.js'
import { plugins } from './gulp/config/plugins.js'
import { server } from './gulp/tasks/server.js'
import { scss } from './gulp/tasks/sass.js'
import { js } from './gulp/tasks/js.js'
import { images } from './gulp/tasks/images.js'
import ghPages from 'gulp-gh-pages'

global.app = {
    gulp: gulp,
    path: path,
    plugins: plugins
}

import { copy } from './gulp/tasks/copy.js'

function watcher() {
    gulp.watch(path.watch.files, copy)
    gulp.watch(path.watch.html, html)
    gulp.watch(path.watch.sass, scss)
    gulp.watch(path.watch.js, js)
    gulp.watch(path.watch.images, images)
}

const mainTasks = gulp.parallel(copy, html, scss, js, images)
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server),)
const deploy = () => {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
}

gulp.task('default', dev)
gulp.task('deploy', deploy)