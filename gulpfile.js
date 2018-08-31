//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    babel = require("gulp-babel"),
    es2015 = require("babel-preset-es2015"),
    rev = require('gulp-rev'), //给文件加上版本号
    revCollector = require('gulp-rev-collector'), //替换内容 
    del = require('del'), //清空文件夹
    cleanCSS = require('gulp-clean-css'), //压缩css
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'), //压缩js
    changed = require('gulp-changed'),
    replace = require('gulp-replace'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    zip = require('gulp-zip'),
    connect = require('gulp-connect'),
    runSequence = require('run-sequence'); //gulp 任务执行顺序

var src = {
    basePath: 'master',
    scripts: ['master/scripts/**/*.js'],
    jsonData: 'master/**/*.{json,xlsx}',
    images: 'master/**/*',
    ycmapImages: 'master/views/_fragment/dashboard/sidebar/map/img/*.{jpg,png}',
    czImages: 'master/difference/cz/img/**/*.{jpg,png}',
    czmapImages: 'master/difference/cz/map/**/*.{jpg,png}',
    gaImages: 'master/difference/ga/img/**/*.{jpg,png}',
    gamapImages: 'master/difference/ga/map/**/*.{jpg,png}',
    dhImages: 'master/difference/dh/img/**/*.{jpg,png}',
    xsImages: 'master/difference/xs/img/**/*.{jpg,png}',
    ysImages: 'master/difference/ys/img/**/*.{jpg,png}',
    xsmapImages: 'master/difference/xs/map/**/*.{jpg,png,gif,woff,ttf}',
};

var dst = {
    basePath: 'dist',
    images: 'dist/img',
    jsonData: 'dist',
    ycmapImages: 'dist/views/_fragment/dashboard/sidebar/map/img',
    czmapImages: 'dist/views/_fragment/dashboard/sidebar/map/img',
    gamapImages: 'dist/views/_fragment/dashboard/sidebar/map/img',
    xsmapImages: 'dist/views/_fragment/dashboard/sidebar/map',
    difference: 'dist/difference'
};

const TEST_SERVER = "http://192.168.200.151:2080/";
/*const PRODUCT_SERVER = "http://59.52.254.220/";*/

const baseUrlAuth = "/uc_auth-frontend-inf";
const baseUrl = "/uc_dclot-frontend-inf";
const baseUrlLot = "/uc_dclot-frontend-inf";
const fileUploadUrl = "/uc_file-srv";

// 盐城
const baseUrlAuthProduct = "/yancheng_auth-frontend-inf";
const baseUrlLotProduct = "/yancheng_dclot-frontend-inf";
const fileUploadUrlProduct = "/yancheng_file-srv";
const baseUrlProduct = "/yancheng_dclot-frontend-inf";
const HOME_LOGO_TITLE = "城市停车场运营管理平台";
const HOME_COPY_RIGHT = '盐城城投集团';
const YANCHENG_MAPCENTER = [120.16, 33.35];

// 广安
const baseUrlAuthProductGuangan = "/guangan_auth-frontend-inf";
const baseUrlLotProductGuangan = "/guangan_dclot-frontend-inf";
const fileUploadUrlProductGuangan = "/guangan_file-srv";
const baseUrlProductGuangan = "/guangan_dclot-frontend-inf";
const GUANGAN_HOME_COPY_RIGHT = '优橙科技有限公司';
const GUANGAN_MAPCENTER = [106.63, 30.46];

/*沧州服务*/
const CANGZHOU_PRODUCT_SERVER = "http://47.92.55.19/";
const baseUrlAuthProductCangzhou = "/cangzhou_auth-frontend-inf";
const baseUrlLotProductCangzhou = "/cangzhou_dclot-frontend-inf";
const fileUploadUrlProductCangzhou = "/cangzhou_file-srv";
const baseUrlProductCangzhou = "/cangzhou_dclot-frontend-inf";
const CANGZHOU_HOME_LOGO_TITLE = "沧州市停车场运营管理平台";
const CANGZHOU_HOME_COPY_RIGHT = '泊车管理公司';
const CANGZOU_MAPCENTER = [116.88, 38.26];

/*东湖*/
const DONGHU_HOME_LOGO_TITLE = "停车场运营管理平台"


/*清空文件夹*/
gulp.task('clean', function (cb) {
    return del([dst.basePath, 'rev'], cb);
});

/*清空dist/difference文件夹*/
gulp.task('cleanDifference', function (cb) {
    return del([dst.difference, 'rev'], cb);
});

/* 必要时候才调用，比方图片名改了，但是内容没改 */
gulp.task('cleanCash', function (done) {
    return cache.clearAll(done);
});

gulp.task('css', function () {
    return gulp.src(['master/**/*.css', '!master/vender/**/*'])
        .pipe(rev())
        //.pipe(cleanCSS({compatibility: 'ie8'})) //压缩CSS
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

gulp.task('scripts', function () {
    return gulp.src(['master/**/*.js', '!master/vender/**/*'])
        .pipe(babel({
            presets: [es2015]
        }))
        .pipe(rev())
        .pipe(uglify({
            mangle: false, //类型：Boolean 默认：true 是否修改变量名
            compress: true, //类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

gulp.task('vender', function () {
    return gulp.src(['master/vender/**/*'])
        .pipe(changed('dist/vender'))
        .pipe(gulp.dest('dist/vender'));
});

gulp.task('images', function () {
    return gulp.src(src.images)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('json', function () {
    return gulp.src(src.jsonData)
        .pipe(gulp.dest(dst.jsonData));
});

gulp.task('czImages', function () {
    return gulp.src(src.czImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.images));
});

gulp.task('ycmapImages', function () {
    return gulp.src(src.ycmapImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.ycmapImages));
});

gulp.task('czmapImages', function () {
    return gulp.src(src.czmapImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.czmapImages));
});

gulp.task('gaImages', function () {
    return gulp.src(src.gaImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.images));
});

gulp.task('gamapImages', function () {
    return gulp.src(src.gamapImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.gamapImages));
});

gulp.task('dhImages', function () {
    return gulp.src(src.dhImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.images));
});

gulp.task('xsImages', function () {
    return gulp.src(src.xsImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.images));
});

gulp.task('xsmapImages', function () {
    return gulp.src(src.xsmapImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.xsmapImages));
});

gulp.task('ysImages', function () {
    return gulp.src(src.ysImages)
        // Pass in options to the task
        .pipe(cache(imagemin({
            optimizationLevel: 5
        })))
        .pipe(gulp.dest(dst.images));
});

gulp.task('copy', ['vender', 'images', 'ycmapImages'], function () {
    return;
});
gulp.task('copyCz', ['vender', 'czImages', 'czmapImages'], function () {
    return;
});
gulp.task('copyGa', ['vender', 'gaImages', 'gamapImages'], function () {
    return;
});

gulp.task('copyDh', ['vender', 'dhImages'], function () {
    return;
});

gulp.task('copyXs', ['vender', 'xsImages', 'xsmapImages'], function () {
    return;
});

gulp.task('copyYs', ['vender', 'ysImages'], function () {
    return;
});

gulp.task('revHtml', function () {
    return gulp.src(['rev/**/*.json', 'master/**/*.html', '!master/vender/**/*'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(replace(HOME_LOGO_TITLE, CANGZHOU_HOME_LOGO_TITLE))
        .pipe(replace(HOME_COPY_RIGHT, CANGZHOU_HOME_COPY_RIGHT))
        .pipe(gulp.dest('dist'));
});

gulp.task('revHtmlyc', function () {
    return gulp.src(['rev/**/*.json', 'master/**/*.html', '!master/vender/**/*'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('revHtmlga', function () {
    return gulp.src(['rev/**/*.json', 'master/**/*.html', '!master/vender/**/*'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(replace(HOME_COPY_RIGHT, GUANGAN_HOME_COPY_RIGHT))
        .pipe(gulp.dest('dist'));
});
gulp.task('revHtmluc', function () {
    return gulp.src(['rev/**/*.json', 'master/**/*.html', '!master/vender/**/*'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('revHtmldh', function () {
    return gulp.src(['rev/**/*.json', 'master/**/*.html', '!master/vender/**/*'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(replace(HOME_LOGO_TITLE, DONGHU_HOME_LOGO_TITLE))
        .pipe(gulp.dest('dist'));
});

gulp.task('revHtmlys', function () {
    return gulp.src(['rev/**/*.json', 'master/**/*.html', '!master/vender/**/*'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(replace(HOME_LOGO_TITLE, DONGHU_HOME_LOGO_TITLE))
        .pipe(gulp.dest('dist'));
});

gulp.task('revHtmlxs', function () {
    return gulp.src(['rev/**/*.json', 'master/**/*.html', '!master/vender/**/*'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(replace(HOME_LOGO_TITLE, DONGHU_HOME_LOGO_TITLE))
        .pipe(gulp.dest('dist'));
});
gulp.task('revAppjs', function () {
    return gulp.src(['rev/**/*.json', 'dist/scripts/app-*.js'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('repreatappjs', function () {
    return gulp.src(['dist/scripts/app-*.js'])
        .pipe(rev())
        .pipe(uglify({
            mangle: false, //类型：Boolean 默认：true 是否修改变量名
            compress: true, //类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/appjs'));
});

gulp.task('reRevHtmlForAppjs', function () {
    return gulp.src(['rev/appjs/*.json', 'dist/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('rev'));
});

gulp.task('replaceProductServer', function () {
    return gulp.src(['dist/scripts/constants/constants-*.js'])
        .pipe(replace(baseUrl, baseUrlProduct))
        .pipe(replace(baseUrlAuth, baseUrlAuthProduct))
        .pipe(replace(baseUrlLot, baseUrlLotProduct))
        .pipe(replace(fileUploadUrl, fileUploadUrlProduct))
        //.pipe(replace(/http:\/\/[0-9a-zA-Z\.:]{1,}\//g, PRODUCT_SERVER))                //正则替换
        .pipe(gulp.dest('dist/scripts/constants'));
});

gulp.task('replaceGuanganProductServer', function () {
    return gulp.src(['dist/scripts/constants/constants-*.js'])
        .pipe(replace(baseUrl, baseUrlProductGuangan))
        .pipe(replace(baseUrlAuth, baseUrlAuthProductGuangan))
        .pipe(replace(baseUrlLot, baseUrlLotProductGuangan))
        .pipe(replace(fileUploadUrl, fileUploadUrlProductGuangan))
        .pipe(replace(YANCHENG_MAPCENTER, GUANGAN_MAPCENTER))
        //.pipe(replace(/http:\/\/[0-9a-zA-Z\.:]{1,}\//g, PRODUCT_SERVER))                //正则替换
        .pipe(gulp.dest('dist/scripts/constants'));
});

gulp.task('replaceCangzhouProductServer', function () {
    return gulp.src(['dist/scripts/constants/constants-*.js'])
        .pipe(replace(baseUrl, baseUrlProductCangzhou))
        .pipe(replace(baseUrlAuth, baseUrlAuthProductCangzhou))
        .pipe(replace(baseUrlLot, baseUrlLotProductCangzhou))
        .pipe(replace(fileUploadUrl, fileUploadUrlProductCangzhou))
        .pipe(replace(YANCHENG_MAPCENTER, CANGZOU_MAPCENTER))
        //.pipe(replace(/http:\/\/[0-9a-zA-Z\.:]{1,}\//g, PRODUCT_SERVER))                //正则替换
        .pipe(gulp.dest('dist/scripts/constants'));
});

gulp.task('replaceTestServer', function () {
    return gulp.src(['dist/scripts/constants/constants-*.js'])
        .pipe(replace(/http:\/\/[0-9a-zA-Z\.:]{1,}\//g, TEST_SERVER)) //正则替换
        .pipe(gulp.dest('dist/scripts/constants'));
});

gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        port: 8000,
        livereload: true
    });
});

gulp.task('compressCZ', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('cz-dclot-frontend.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('compressGA', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('ga-dclot-frontend.zip'))
        .pipe(gulp.dest('.'));
});
gulp.task('compress', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('yc-dclot-frontend.zip'))
        .pipe(gulp.dest('.'));
});
gulp.task('compressUC', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('uc-dclot-frontend.zip'))
        .pipe(gulp.dest('.'));
});
gulp.task('compressDH', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('dh-dclot-frontend.zip'))
        .pipe(gulp.dest('.'));
});
gulp.task('compressXS', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('xs-dclot-frontend.zip'))
        .pipe(gulp.dest('.'));
});
gulp.task('compressYS', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('ys-dclot-frontend.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('uc', function () {
    runSequence(
        'clean',
        'css', //以新名称在dist里生成css文件，并生成名称映射json
        'scripts', //以新名称在dist里生成js文件，并生成名称映射json
        'revAppjs', //替换app.js里的js和css为新路径
        'revHtmluc',
        'copy',
        'json',
        'compressUC',
        'connect'
    );
});

gulp.task('yancheng', function () {
    runSequence(
        'clean',
        'css',
        'scripts',
        'revAppjs', //替换app.js里的js和css为新路径
        'revHtmlyc',
        'copy',
        'replaceProductServer',
        'compress',
        'connect'
    );
});

gulp.task('guangan', function () {
    runSequence(
        'clean',
        'css',
        'scripts',
        'revAppjs', //替换app.js里的js和css为新路径
        'revHtmlga',
        'copyGa',
        'replaceGuanganProductServer',
        'compressGA',
        'connect'
    );
});

gulp.task('cz', function () {
    runSequence(
        'clean',
        'css',
        'scripts',
        'revAppjs', //替换app.js里的js和css为新路径
        'revHtml',
        'copyCz',
        'replaceCangzhouProductServer',
        'compressCZ',
        'connect'
    );
});

gulp.task('dh', function () {
    runSequence(
        'clean',
        'cleanDifference',
        'css', //以新名称在dist里生成css文件，并生成名称映射json
        'scripts', //以新名称在dist里生成js文件，并生成名称映射json
        'revAppjs', //替换app.js里的js和css为新路径
        'revHtmldh',
        'copyDh',
        'compressDH',
        'connect'
    );
});

gulp.task('xs', function () {
    runSequence(
        'clean',
        'cleanDifference',
        'css', //以新名称在dist里生成css文件，并生成名称映射json
        'scripts', //以新名称在dist里生成js文件，并生成名称映射json
        'revAppjs', //替换app.js里的js和css为新路径
        'revHtmlxs',
        'copyXs',
        'json',
        'compressXS'
    );
});

gulp.task('ys', function () {
    runSequence(
        'clean',
        'cleanDifference',
        'css', //以新名称在dist里生成css文件，并生成名称映射json
        'scripts', //以新名称在dist里生成js文件，并生成名称映射json
        'revAppjs', //替换app.js里的js和css为新路径
        'revHtmlys',
        'copyYs',
        'json',
        'compressYS',
        'connect'
    );
});
//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径