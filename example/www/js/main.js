(function ($target) {
	var $target = $('body');
	
    InfinniUI.global.messageBus.subscribe('onViewCreated', function (context, args) {
        if(args.value.openMode == 'Default') {
            window.contextApp = args.value.view;
        }
    });

    window.InfinniUI.openHomePage($target);
})();