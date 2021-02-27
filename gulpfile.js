const gulp = require("gulp");
const pug = require("gulp-pug");
const watch = require("gulp-watch");
const sass = require("gulp-sass");
const connect = require("gulp-connect");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

sass.compiler = require("node-sass");

const paths = {
    pug: { in: "src/**/*.pug", out: "public" },
    sass: { in: "src/assets/styles/**/*.scss", out: "public/assets/styles" },
    img: {
        in: "src/assets/images/**/*.{gif,jpg,png,svg}",
        out: "public/assets/images",
    },
    ts: {
        in: "src/assets/scripts/**/*.ts",
        out: "public/assets/scripts",
    },
};

gulp.task("ts", function () {
    return tsProject
        .src(paths.ts.in)
        .pipe(tsProject())
        .js.pipe(gulp.dest(paths.ts.out));
});

gulp.task("pug", function () {
    return gulp
        .src(paths.pug.in)
        .pipe(
            pug({
                doctype: "html",
                pretty: false,
            })
        )
        .pipe(gulp.dest(paths.pug.out));
});

gulp.task("sass", function () {
    return gulp
        .src(paths.sass.in)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(paths.sass.out));
});

gulp.task("img", () => gulp.src([paths.img.in]).pipe(gulp.dest(paths.img.out)));

gulp.task("build", gulp.parallel("sass", "pug", "img", "ts"));

gulp.task("watch", function () {
    watch(paths.pug.in, { ignoreInitial: false }, gulp.series("pug"));
    watch(paths.sass.in, { ignoreInitial: false }, gulp.series("sass"));
    watch(paths.img.in, { ignoreInitial: false }, gulp.series("img"));
    watch(paths.ts.in, { ignoreInitial: false }, gulp.series("ts"));
});

gulp.task("serve", () => {
    connect.server({
        livereload: true,
        root: "public",
    });
});

gulp.task("default", gulp.parallel(["watch", "serve"]));
