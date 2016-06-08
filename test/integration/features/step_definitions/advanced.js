this.When(/^замри на "([^"]*)"$/, function (seconds, next) {
    setTimeout(next, seconds * 1000);
});

this.When(/^debugger$/, function (next) {
    debugger;
    next();
});