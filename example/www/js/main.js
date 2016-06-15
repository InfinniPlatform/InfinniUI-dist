if(InfinniUI.config.configName != null) {
    document.title = InfinniUI.config.configName;
}

moment.locale('ru');

(function ($target/*, metadata*/, homePageMetadata) {

    var host = InfinniUI.config.serverUrl;

    //Регистрация провайдера для работы с прикрепленными к документам файлами
    InfinniUI.providerRegister.register('DocumentFileProvider', function (metadata) {
        var params = {
            documentId: metadata.documentId,
            configId: metadata.configId
        };
        var urlConstructor = new DocumentUploadQueryConstructor(host, params);
        return new DocumentFileProvider(urlConstructor);
    });

    InfinniUI.providerRegister.register('UploadDocumentDataSource', function (metadataValue) {
        return new DataProviderUpload(new QueryConstructorUpload(host, metadataValue));
    });

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

    InfinniUI.providerRegister.register('MetadataInfoDataSource', function (metadataValue) {
        return new InfinniUI.Providers.MetadataDataSourceProvider(new InfinniUI.Providers.QueryConstructorMetadataDataSource(host, metadataValue));
    });

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
            action.execute();
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