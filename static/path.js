module.exports = {

    build: {
        html: 'build/',
        css: 'build/css/',
        app: 'build/app/',
        lib: 'build/lib/',
        assets: 'build/assets/'
    },

    src: {
        html: 'src/**/*.html',
        css: 'src/css/*.css',
        app: 'src/app/app.js',
        lib: 'src/lib/*.+(js|map)',
        assets: 'src/assets/**/*'
    },

    watch: {
        html: 'src/**/*.html',
        css: 'src/css/*.css',
        app: 'src/app/**/*.js',
        lib: 'src/lib/*.+(js|map)',
        assets: 'src/assets/**/*'
    },

    clean: './build'

};