const { src, dest } = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const htmlCompressor = require(`gulp-htmlmin`);

let validateHTML = () => {
    return src([ `html/*.html`, `/html/**/*.html`]).pipe(htmlValidator());
};

let compressHTML = () => {
    return src([`html/*.html`,`html/**/*.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let transpileJSForDev = () => {
    return src(`dev/scripts/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};

let compileCSSForDev = () => {
    return src(`dev/styles/main.scss`)
        .pipe(sass({
            outputStyle: `expanded`,
            precision: 10
        }).on(`error`, sass.logError))
        .pipe(dest(`temp/styles`));

let serve = () => {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `root(./)`
                `temp/css`,
                `temp/js`,
                `temp/html`
            ]
        }
    });

    watch(`dev/scripts/*.js`,
        series(lintJS, transpileJSForDev)
    ).on(`change`, reload);

    watch(`styles/**/*.scss`,
        series(compileCSSForDev)
    ).on(`change`, reload);

    watch(`html/**/*.html`,
        series(validateHTML)
    ).on(`change`, reload);

    watch(`dev/img/**/*`).on(`change`, reload);
};


exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.build = series(
    compressHTML,
    compileCSSForProd,
    transpileJSForProd,
    compressImages,
    copyUnprocessedAssetsForProd
);
