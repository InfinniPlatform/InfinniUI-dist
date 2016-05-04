module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.initConfig({
        less: {
            default: {
                options: {
                    modifyVars: {}
                },
                src: ['app/styles/main.less'],
                dest: 'out/css/main.css'
            }
        }
    });

    grunt.task.registerTask('build', function (props) {
        var tasks = ['less'];

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
        }

        grunt.task.run(tasks);
    });
};