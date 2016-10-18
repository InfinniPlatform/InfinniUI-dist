window.InfinniUI = window.InfinniUI || {};
window.InfinniUI.config = window.InfinniUI.config || {};

// перекрываем дефолтные конфиги, лежащие в InfinniUI/app/config.js

window.InfinniUI.config.cacheMetadata = false;
window.InfinniUI.config.serverUrl = 'http://localhost:9900';
window.InfinniUI.config.configName = 'test';

window.InfinniUI.config.homePage = '/testConfigurations/stab.json';

window.InfinniUI.config.lang = 'ru-RU';

// when disableAutoHeightService = true, body will have full height and will scrollable
// window.InfinniUI.config.disableAutoHeightService = true;

// when need to disable GetCurrentUser and when need to disable SignInExternalForm
InfinniUI.config.disableGetCurrentUser = InfinniUI.config.disableSignInExternalForm = false;



// Example for routing, launch with router.json config file

// History API settings for routing, read Backbone.history for possible options
// InfinniUI.config.HistoryAPI = {
// 	pushState: true
// };

// InfinniUI.config.Routes = [
// 	{
// 		Name: "testRoute",
// 		Path: "/",
// 		Action: "{ startAction(context, args); }"
// 	},
// 	{
// 		Name: "testRoute1",
// 		Path: "/testRoute1",
// 		Action: "{ startAction1(context, args); }"
// 	},
// 	{
// 		Name: "testRoute2",
// 		Path: "/testRoute/testRoute2",
// 		Action: "{ startAction2(context, args); }"
// 	},
// 	{
// 		Name: "testRoute3",
// 		Path: "/testRoute3/<% userId %>/<% pageNumber %>",
// 		Action: "{ startAction3(context, args); }"
// 	},
// 	{
// 		Name: "testRoute4",
// 		Path: "/testRoute4WithQuery?queryId=<% queryId %>&userAge=<% userAge %>",
// 		Action: "{ startAction4(context, args); }"
// 	},
// 	{
// 		Name: "testRoute5",
// 		Path: "/testRoute5LinkHref/<% userId %>/<% pageNumber %>",
// 		Action: "{ startAction5(context, args); }"
// 	},
// 	{
// 		Name: "testRoute6",
// 		Path: "/testRoute6WithQuery?queryId=<% queryId %>&userAge=<% userAge %>",
// 		Action: "{ startAction6(context, args); }"
// 	},
// 	{
// 		Name: "testRoute7",
// 		Path: "/testRoute7WithQuery/<% pageNumber %>?queryId=<% queryId %>",
// 		Action: "{ startAction7(context, args); }"
// 	}
// ];



