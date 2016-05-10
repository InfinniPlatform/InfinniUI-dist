module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        less: {
            default: {
                options: {
                    modifyVars: {}
                },
                src: ['app/styles/main.less'],
                dest: 'out/css/main.css'
            }
        },
        copy: {
            platform: {
                expand: true,
                cwd: 'out/platform',
                src: ['platform.js'],
                dest: 'out'
            },
            platformDev: {
                expand: true,
                cwd: 'out/platform',
                src: ['platform-dev.js'],
                rename: function () {
                    return 'out/platform.js';
                }
            },
            jsonEditorJs: {
                expand: true,
                flatten: true,
                src: [
                    '../jsoneditor/dist/jsoneditor.min.js'
                ],
                dest: 'out/jsonEditor'
            },
            jsonEditorCSS: {
                expand: true,
                flatten: true,
                src: [
                    '../jsoneditor/dist/jsoneditor.min.css'
                ],
                dest: 'out/jsonEditor/css'
            },
            jsonEditorSVG: {
                expand: true,
                flatten: true,
                src: [
                    '../jsoneditor/dist/img/jsoneditor-icons.svg'
                ],
                dest: 'out/jsonEditor/css/img'
            },
            jsonEditorDialog: {
                expand: true,
                flatten: true,
                src: [
                    'developer/jsonEditor/editorDialog/*'
                ],
                dest: 'out/jsonEditor'
            }
        },
        clean: {
            plaformJs: ['out/platform.js'],
            jsonEditor: ['out/jsonEditor']
        }
    });

    grunt.task.registerTask('build', function (props) {
        var tasks = [
            'less',
            'clean'
        ];

        if (typeof props == "string") {
            props = props.replace(/=/g, ':');
        }

        if (typeof props == "string" && props.indexOf('{') == -1) {
            props = require(props);
        }

        if (props) {
            eval('props = ' + props);

            if (props.override) {
                if (props.override.less) {
                    for (var k in props.override.less) {
                        grunt.config.set('less.default.options.modifyVars.' + k, props.override.less[k]);
                        grunt.log.writeln('path - ' + k);
                        grunt.log.writeln(grunt.config.get('less.default.options.modifyVars.' + k));
                    }
                }
            }

            if(props.mode == 'development') {
                tasks.push('copy:jsonEditorJs');
                tasks.push('copy:jsonEditorCSS');
                tasks.push('copy:jsonEditorSVG');
                tasks.push('copy:jsonEditorDialog');
                tasks.push('copy:platformDev');
            } else {
                tasks.push('copy:platform');
            }

        } else {
            tasks.push('copy:platform');
        }

        grunt.task.run(tasks);
    });
};