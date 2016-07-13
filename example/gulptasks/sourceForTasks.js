'use strict';
var infinniUIpath = '..';
var fromInfinniToNewStylesPath = '/example/styles/';
var platformOutputFolder = '/out/';
var exampleRootFolder = './www/';
var exampleFolderForPlatform = './www/compiled/platform/';
var exampleFolderForExtensions = './www/compiled/js/';
var stylesFile = '/app/styles/main.less';

var jsFiles = ['./js/**/*.js'];
var templateFiles = ["./js/**/*.tpl.html"];

var sourceForTasks = {
	cleanFolder: {
		src: exampleFolderForPlatform,
		taskPath: "./gulptasks/cleanFolder"
	},
	overrideLess: {
		src: infinniUIpath + stylesFile,
		changedVariables: {
			"pl-override-platform-variables-path": '../..' + fromInfinniToNewStylesPath + 'platform-variables.less',
			"pl-override-bootstrap-variables-path": '../..' + fromInfinniToNewStylesPath + 'bootstrap-variables.less',
			"pl-bootstrap-theme-path": '../..' + fromInfinniToNewStylesPath + 'bootstrap-theme.less',
			"pl-extension-path": '../..' + fromInfinniToNewStylesPath + 'extensions.less'
		},
		srcForWatch: "./styles/",
		finalName: "main.css",
		dest: exampleFolderForPlatform + "css/",
		taskPath: "./gulptasks/overrideLess"
	},
	copyPlatform: {
		src: [infinniUIpath + platformOutputFolder + '**/*.*', '!' + infinniUIpath + platformOutputFolder + 'unitTest.js'],
		dest: exampleFolderForPlatform,
		taskPath: "./gulptasks/copyFiles"
	},
	concatJs: {
		src: jsFiles,
		finalName: "app.js",
		dest: exampleFolderForExtensions,
		taskPath: "./gulptasks/concatJs"
	},
	concatTemplates: {
		src: templateFiles,
		finalName: "templates.js",
		dest: exampleFolderForExtensions,
		taskPath: "./gulptasks/concatTemplates"
	},
	'server:example': {
		src: "./www",
		watch: exampleRootFolder + "**/*.*",
		port: 4444,
		ui: {
			port: 4040
		},
		taskPath: "./gulptasks/startServer"
	}
}

module.exports = sourceForTasks;
