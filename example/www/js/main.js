(function ($target) {

	var $target = $('body');

	InfinniUI.global.messageBus.subscribe('onViewCreated', function (context, args) {
		if(args.value.openMode == 'Default' && window.InfinniUI.RouterService) {
			window.InfinniUI.RouterService.setContext(args.value.view.context);
			window.InfinniUI.RouterService.startRouter();
		}
	});

	window.InfinniUI.openHomePage($target);

})();
