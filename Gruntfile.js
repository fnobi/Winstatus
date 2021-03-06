module.exports = function (grunt) {
    var config = {}, build = [];

    var httpPath = '';

    var path = {
        src: {
            js:   'src/js',
            sass: 'src/sass',
            ejs:  'src/ejs'
        },
        dist: {
            js:   'js',
            css:  'css',
            html: '',
            img:  'img'
        },
        test: 'test',
        namespaces: { }
    };

    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-watch');
        config.watch = {};
    }


    // js
    {
        grunt.loadNpmTasks('grunt-auto-deps');
        config.auto_deps = {
            dist: {
                scripts: [
                    'Winstatus'
                ],
                dest: path.dist.js,
                loadPath: [path.src.js + '/*.js'],
                ignore: [],
                forced: [],
                locate: path.namespaces
            },
            demo: {
                scripts: [
                    'Winstatus-demo'
                ],
                dest: path.dist.js,
                loadPath: [path.src.js + '/*.js'],
                ignore: ['Winstatus'],
                forced: ['html5shiv'],
                locate: path.namespaces
            }
        };

        config.watch.js = {
            files: [path.src.js + '/*.js'],
            tasks: ['auto_deps:dist', 'auto_deps:demo']
        };

        build.push('auto_deps:dist');
        build.push('auto_deps:demo');
    }


    // css
    {
        grunt.loadNpmTasks('grunt-contrib-compass');

        config.compass =  {
            dist: {
                options: {
                    sassDir: path.src.sass,
                    cssDir: path.dist.css,
                    javascriptsDir: path.dist.js,
                    imagesDir: path.dist.img,
                    httpImagesPath: httpPath + '/' + path.dist.img,
                    environment: 'development'
                }
            }
        };

        config.watch.css = {
            files: [path.src.sass + '/*.scss', path.src.sass + '/**/*.scss'],
            tasks: ['compass:dist']
        };

        build.push('compass:dist');
    }


    // ejs
    {
        grunt.loadNpmTasks('grunt-simple-ejs');

        config.ejs = {
            dist: {
                template: [path.src.ejs + '/*.ejs'],
                dest: path.dist.html,
                options: [
                    {
                        http_path: httpPath,
                        css_path: [ httpPath, path.dist.css ].join('/'),
                        js_path: [ httpPath, path.dist.js ].join('/'),
                        img_path: [ httpPath, path.dist.img ].join('/')
                    },
                    'src/options.yaml'
                ]
            }
        };
        build.push('ejs:dist');

        config.watch.ejs = {
            files: [
                path.src.ejs + '/*.ejs',
                path.src.ejs + '/**/*.ejs',
                'src/options.yaml'
            ],
            tasks: ['ejs:dist']
        };
    }
    // 


    // test
    {
        grunt.loadNpmTasks('grunt-mocha-html');
        grunt.loadNpmTasks('grunt-mocha-phantomjs');

        config.mocha_html =  {
            all: {
                src   : [ path.dist.js + '/Winstatus.js' ],
                test  : [ path.test + '/*-test.js' ],
                assert : 'chai'
            }
        };
        build.push('mocha_html');

        config.watch.test = {
            files: [path.test + '/*-test.js'],
            tasks: ['mocha_phantomjs']
        };
        config.watch.js.tasks.push('mocha_html');

        config.mocha_phantomjs =  {
            all: [ path.test + '/*.html' ]
        };

        grunt.registerTask('test', ['mocha_phantomjs']);

    }
    // 


    // server
    {
        grunt.loadNpmTasks('grunt-koko');
        config.koko = {
            dist: {
                openPath: httpPath + '/' + path.dist.html
            }
        };

        grunt.registerTask('server', ['koko:dist']);
    }

    // release
    {
        grunt.loadNpmTasks('grunt-release');

        config.release = {
            options: {
                file: 'bower.json',
                npm: false
            }
        };
    }

    // init
    grunt.initConfig(config);
    grunt.registerTask('build', build);
    grunt.registerTask('default', ['build']);
};
