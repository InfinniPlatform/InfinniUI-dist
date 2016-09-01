if(InfinniUI.config.configName != null) {
    document.title = InfinniUI.config.configName;
}

moment.locale('ru');

(function ($target/*, metadata*/, homePageMetadata) {

    var host = InfinniUI.config.serverUrl;

    InfinniUI.providerRegister.register('ObjectDataSource', InfinniUI.Providers.ObjectDataProvider);

    setTimeout(InfinniUI.LayoutManager.init.bind(InfinniUI.LayoutManager), 1000);


    InfinniUI.providerRegister.register('MetadataDataSource', function (metadataValue) {
        var $pageContent = $('body');
        for (var i = 3; i >= 0; i--) {
            setTimeout(function () {
                InfinniUI.LayoutManager.init();
            }, 500 + i * 300);
        }

        return new InfinniUI.Providers.MetadataProviderREST(new InfinniUI.Providers.QueryConstructorMetadata(host, metadataValue));
    });

    /**
     * @description При изменении размеров окна пересчитывает высоту элементов представления
     */
    InfinniUI.AutoHeightService = (function () {
        var TIMEOUT = 40;
        var WAIT = 50;
        var resizeTimeout;

        $(window).resize(function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(_.debounce(onWindowResize, WAIT), TIMEOUT);
        });

        function onWindowResize() {
            InfinniUI.LayoutManager.init();
        }

    })();

    InfinniUI.providerRegister.register('DocumentDataSource', InfinniUI.Providers.RestDataProvider);
    InfinniUI.providerRegister.register('RestDataSource', InfinniUI.Providers.RestDataProvider);

     InfinniUI.providerRegister.register('ServerActionProvider', function () {
             return new InfinniUI.Providers.ServerActionProvider();
     });

    var builder = new InfinniUI.ApplicationBuilder(),
        rootView = new SpecialApplicationView(),
        mainView;

    InfinniUI.global.messageBus.subscribe('onViewCreated', function (context, args) {
        if(args.value.openMode == 'Default') {
            window.contextApp = args.value.view;
        }
    });

    rootView.open($target);
    openHomePage()
        .done(function (viewMetadata) {
            var action = builder.buildType('OpenAction', viewMetadata, {parentView: rootView});
            action.execute(function() {
                if( window.InfinniUI.RouterService ) {
                    window.InfinniUI.RouterService.startRouter();
                }
            });
        });

    function openHomePage() {
        var defer = $.Deferred();

        if (typeof homePageMetadata === 'string') {
            $.ajax({
                url: homePageMetadata,
                dataType: "json"
            })
                .then(function (data) {
                    defer.resolve({
                        LinkView: {
                            InlineView: {
                                View: data
                            }
                        }
                    })
                }, function (jqXHR, textStatus, errorThrown) {
                    console.error(textStatus);
                });
        } else {
            defer.resolve({
                LinkView: {
                    AutoView: homePageMetadata
                }
            });
        }
        return defer.promise();
    }

})(
    $('body'),
    window.InfinniUI.config.homePage
);


function SpecialApplicationView() {
    var $container;

    this.isView = true;

    this.getContainer = function () {
        return this.$container;
    };

    this.open = function ($el) {
        this.$container = $el;
    };

    this.getApplicationView = function () {
        return this;
    };

    this.menuIsInitialized = function () {
        this.isMenuInitialized = true;

        //this.initViewHandlers();
    };

    this.getContext = function(){
        return null;
    };
}
