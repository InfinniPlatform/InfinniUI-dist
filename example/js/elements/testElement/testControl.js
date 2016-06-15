var TestControl = function (viewMode) {
    _.superClass(TestControl, this, viewMode);
};

_.inherit(TestControl, InfinniUI.Control);

_.extend(TestControl.prototype, {

    createControlModel: function () {
        return new TestModel();
    },

    createControlView: function (model, viewMode) {
        return new TestView({model: model});
    }

});