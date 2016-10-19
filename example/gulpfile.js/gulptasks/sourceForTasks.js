'use strict';
// Необходимо указать путь до платфомы в bower_components
var infinniUIpath = './bower_components/infinni-ui/';

// Путь из infinniUIpath к прикладным стилям
var fromInfinniToNewStylesPath = '/../../styles/';

// Путь до папки-результата
var projectRootFolder = './www/';
// куда собирать платформу?
var projectFolderForPlatform = './www/compiled/platform/';
// куда собирать прикладную часть?
var projectFolderForExtensions = './www/compiled/js/';


// Платформенные перменные (не рекомендуется менять)
var platformOutputFolder = '/out/';
var stylesFile = '/app/styles/main.less';

var jsFiles = ['./js/**/*.js'];
var templateFiles = ["./js/**/*.tpl.html"];

var sourceForTasks = {
	cleanFolder: {
		src: projectFolderForPlatform,
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
		dest: projectFolderForPlatform + "css/",
		taskPath: "./gulptasks/overrideLess"
	},
	copyPlatform: {
		src: [infinniUIpath + platformOutputFolder + '**/*.*', '!' + infinniUIpath + platformOutputFolder + 'unitTest.js'],
		dest: projectFolderForPlatform,
		taskPath: "./gulptasks/copyFiles"
	},
	concatJs: {
		src: jsFiles,
		finalName: "app.js",
		dest: projectFolderForExtensions,
		taskPath: "./gulptasks/concatJs"
	},
	concatTemplates: {
		src: templateFiles,
		finalName: "templates.js",
		dest: projectFolderForExtensions,
		taskPath: "./gulptasks/concatTemplates"
	},
	'server:example': {
		src: "./www",
		// turn it on when develop single page application
		spa: true,
		watch: projectRootFolder + "**/*.*",
		port: 4444,
		ui: {
			port: 4040
		},
		taskPath: "./gulptasks/startServer"
	}
}

module.exports = sourceForTasks;
