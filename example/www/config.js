window.InfinniUI = window.InfinniUI || {};
window.InfinniUI.config = window.InfinniUI.config || {};

// перекрываем дефолтные конфиги, лежащие в InfinniUI/app/config.js

window.InfinniUI.config.cacheMetadata = false;
window.InfinniUI.config.serverUrl = 'http://localhost:9900';
window.InfinniUI.config.configName = 'test';

window.InfinniUI.config.homePage = 'testConfigurations/stab.json';

// when disableLayoutManager = true, body will have full height and will scrollable
// window.InfinniUI.config.disableLayoutManager = true;

// when need to disable GetCurrentUser and when need to disable SignInExternalForm
InfinniUI.config.disableGetCurrentUser = InfinniUI.config.disableSignInExternalForm = false;


