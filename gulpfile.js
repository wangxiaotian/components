var gulp = require('gulp');
var less = require('gulp-less');
var connect = require('gulp-connect');
var through2 = require('through2');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var revCollector = require('gulp-rev-collector');
var minifyHTML   = require('gulp-minify-html');
var rev = require('gulp-rev');
var replace = require('gulp-replace');
//	启动服务
gulp.task('connect',function(){
	connect.server({
		root: '',
		livereload: true,
		port: 3000
	})
})




gulp.task('css', function () {
    return gulp.src('./table/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/css' ) );
});
 
gulp.task('scripts', function () {
    return gulp.src('./table/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/js' ) );
});



//	html热更新
gulp.task('html',function(){
	gulp.src('./table/*.html')
	.pipe(gulp.dest('./dest/pages'))
	.pipe(connect.reload())
})
gulp.task('cssPack',function(){
	gulp.src('./table/**/*.css')
	.pipe(gulp.dest('./dest/css'))
})
//	less编译
gulp.task('less',function(){
	gulp.src('./src/less/*.less')
	.pipe(less())
	.pipe(gulp.dest('./src/css'))
	.pipe(connect.reload())
})
//	监控less
gulp.task('watch-less',function(){
	gulp.watch(['./src/less/*.less'],['less'])
})
//	js编译
gulp.task('js',function(){
	gulp.src('./scripts/*.js')
	.pipe(through2.obj(function(file,enc,next){
		browserify(file.path,{
			debug: false
		})
		.bundle(function(err,res){
			if(err){
				console.log('browserify 编译失败'.error);
				console.log(err.toString());
				next(null,file);
			} else {
				console.log('编译成功'.info);
				file.contents = res;
				next(null,file);
			}
		})
	}))
	.pipe(uglify())
	.pipe(gulp.dest('./dest/scripts'))
})

gulp.task('rev',function(){
	return gulp.src(['./rev/**/*.json', './table/*.html'])
		.pipe(revCollector({
			replaceReved: true,
			dirReplacements: {
                'css': '/dist/css',
                'js': 'dist/js/'
                }
		}))
		.pipe(minifyHTML({
			empty: true,
			spare: true
		}))
		.pipe(gulp.dest('./dist'))
})

gulp.task('replace',function(){
	gulp.src('./table/*.html')
	.pipe(replace('css/table.css','dest/dist/css/table.css'))
	.pipe(gulp.dest('./bulid/'))
})

gulp.task('watch',function(){
	gulp.watch(['./**/*.html'],['html','js','cssPack','replace'])
})

gulp.task('server',['connect','watch','watch-less','js','css','scripts','replace']);