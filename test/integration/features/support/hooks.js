this.BeforeScenario(function (scenario, callback) {

    window.toastrMessageCount = 0;

    var mongoServise = {
        url: window.IntegrationTestConfig.mongoDbService.url,
        body: {
            commands: [
                'remove',
                'restore'
            ]
        }
    };

    $.post(mongoServise.url, JSON.stringify(mongoServise.body))
        .always(function () {
            // TODO: При появлении непонятных ошибок взглянуть на лог mongoDB сервиса
            openHost(callback);
        });
});

this.AfterFeatures(function () {
    console.log('Test finished!');

    var p;

    if (window.startUpParameters && window.startUpParameters.saveContent) {
        var mongoServise = {
            url: window.IntegrationTestConfig.mongoDbService.url,
            body: {
                save: window
                    .document
                    .documentElement
                    .innerHTML
                    .replace('onload="runIntegrationTests()"', '')
                    .replace(/<script[\s\S]*<\/script>/g, '')
            }
        };
        p = $.post(mongoServise.url, JSON.stringify(mongoServise.body));
    }

    if (window.startUpParameters && window.startUpParameters.isClosing) {
        if(p) {
            p.always(function () {
                window.close();
            });
        } else {
            window.close();
        }
    }
});

this.AfterScenario(function (scenario, callback) {
    window.configWindow.close();
    callback();
});

this.AfterStep(function (step, callback) {
    if (!window.configWindow.toastr.options.onShown) {
        window.configWindow.toastr.options.onShown = function () {
            var toastClass = window.configWindow.$(this).attr('class');
            if (toastClass.indexOf('toast-error') != -1 || toastClass.indexOf('toast-success') != -1) {
                window.toastrMessageCount++;
            }
        }
    }
    callback();
});

var openHost = function (callback) {
    window.configWindow = window.open(window.IntegrationTestConfig.host);

    var signOut = function () {
        window.configWindow.contextApp.context.global.session.signOut(function () {
            window.configWindow.location.reload();
            callback();
        });
    };

    var error = function () {
        console.log('signOut not called!');
        callback();
    };

    window.testHelpers.waitCondition(function () {
        return window.configWindow.contextApp != null;
    }, signOut, error);
};