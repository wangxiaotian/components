var gulp = require('gulp');
var less = require('gulp-less');
var connect = require('gulp-connect');

//	启动服务
gulp.task('connect',function(){
	connect.server({
		root: '',
		livereload: true,
		port: 3000
	})
})
//	html热更新
gulp.task('html',function(){
	gulp.src('./**/*.html')
	.pipe(connect.reload())
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
//	
gulp.task('watch',function(){
	gulp.watch(['./**/*.html'],['html'])
})

gulp.task('server',['connect','watch','watch-less']);