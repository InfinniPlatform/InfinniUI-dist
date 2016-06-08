module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            feature: {
                src: [],
                dest: 'out/feature.feature'
            },

            step_definitions: {
                src: [
                    "features/support/*.js",
                    "features/step_definitions/*.js"
                ],
                dest: 'out/step_definitions.js'
            },

            app: {
                src: ["app/*.js"],
                dest: 'out/app.js'
            },

            vendor: {
                src: ["vendor/*.js"],
                dest: 'out/vendor.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('build', function (extensionPath) {
        if (extensionPath) {
            var extFeaturesPath = extensionPath + '*.IntegrationTests/**/*.feature';
            var extStepDefinitionsPath = extensionPath + '*.IntegrationTests/**/step_definitions/*.js';
            var extTestHelpersPath = extensionPath + '*.IntegrationTests/*.js';

            var stepDefinitionsArray = grunt.config.get('concat.step_definitions.src');
            stepDefinitionsArray.push(extStepDefinitionsPath);

            var appArray = grunt.config.get('concat.app.src');
            appArray.push(extTestHelpersPath);

            grunt.config.set('concat.feature.src', [extFeaturesPath]);
            grunt.config.set('concat.step_definitions.src', stepDefinitionsArray);
            grunt.config.set('concat.app.src', appArray);
        }

        grunt.task.run(['concat']);
    });
};