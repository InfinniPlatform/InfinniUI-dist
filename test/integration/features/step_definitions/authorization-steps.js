// Given

this.Given(/^я не авторизован в системе$/, function (next) {
    if (window.configWindow.currentUser) {
        window.configWindow.contextApp.context.global.session.signOut(function () {
                window.configWindow.location.reload();
                next();
            },
            next);
    } else {
        next();
    }
});

// Then

this.Then(/^система авторизует меня под пользователем "([^"]*)"$/, function (userName, next) {
    var haveUser = function () {
        return window.configWindow.currentUser != null;
    };

    var checkUserName = function () {
        try {
            chai.assert.equal(window.configWindow.currentUser.UserName, userName);
            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error('User is undefined'));
    };

    window.testHelpers.waitCondition(haveUser, checkUserName, fail);
});