window.InfinniUI = window.InfinniUI || {};
window.InfinniUI.config = window.InfinniUI.config || {};
window.InfinniUI.config.lang = 'en-US';

// перекрываем дефолтные конфиги, лежащие в InfinniUI/app/config.js

window.InfinniUI.config.cacheMetadata = false;
window.InfinniUI.config.serverUrl = 'http://' + window.location.host;
window.InfinniUI.config.configName = 'test';

window.InfinniUI.config.homePage = '/viewExample/homePage.json';

window.InfinniUI.config.lang = 'en-US';

// when disableAutoHeightService = true, body will have full height and will scrollable
// window.InfinniUI.config.disableAutoHeightService = true;

// when need to disable GetCurrentUser and when need to disable SignInExternalForm
window.InfinniUI.config.disableGetCurrentUser = window.InfinniUI.config.disableSignInExternalForm = false;



// Example for routing, launch with router.json config file

//History API settings for routing, read Backbone.history for possible options
window.InfinniUI.config.HistoryAPI = {
	pushState: true
};

window.InfinniUI.config.Routes = [
	{
		Name: "main",
		Path: "/",
		Action: "{ openDatagridPage(context, args); }"
	},
	{
		Name: "login",
		Path: "/login",
		Action: "{ openLoginPage(context, args); }"
	},
	{
		Name: "dataBinding",
		Path: "/data_binding",
		Action: "{ openDataBindingPage(context, args); }"
	}
];



