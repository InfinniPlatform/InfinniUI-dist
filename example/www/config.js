window.InfinniUI = window.InfinniUI || {};
window.InfinniUI.config = window.InfinniUI.config || {};

// перекрываем дефолтные конфиги, лажащие в InfinniUI/app/config.js

window.InfinniUI.config.cacheMetadata = false;
window.InfinniUI.config.serverUrl = 'http://localhost:9900';
window.InfinniUI.config.configId = 'PTA';
window.InfinniUI.config.configName = 'Хабинет';

window.InfinniUI.config.homePage = 'testConfigurations/indeterminatecheckbox.json'; //{ConfigId: InfinniUI.config.configId, DocumentId: 'Common', MetadataName: 'HomePage'}; //'stab.json'
