import * as nodePath from 'path'

const rootFolder = nodePath.basename(nodePath.resolve())

const buildFolder = 'dist'
const srcFolder = 'src'

export const path = {
    build: {
        js: `${buildFolder}/js/`,
        css: `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        files: `${buildFolder}/files/`,
        fonts:  `${buildFolder}/fonts/`,
        images: `${buildFolder}/img/`
    },
    src: {
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg`,
        js: `${srcFolder}/js/app.js`,
        sass: `${srcFolder}/sass/**/*.sass`,
        html: `${srcFolder}/*.html`,
        files: `${srcFolder}/files/**/*.* `,
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        sass: `${srcFolder}/sass/**/*.sass`,
        html: `${srcFolder}/**/*.html`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,ico,svg,webp}`,
        files: `${srcFolder}/files/**/*.*`
    },
    clean: buildFolder,
    rootFolder: rootFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    ftp: ''
}