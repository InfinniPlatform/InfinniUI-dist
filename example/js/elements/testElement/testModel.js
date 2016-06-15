var TestModel = InfinniUI.ControlModel.extend(_.extend({

    defaults: _.defaults({
        testProperty: 'testPropertyValue'
    }, InfinniUI.ControlModel.prototype.defaults),

    initialize: function(){
        InfinniUI.ControlModel.prototype.initialize.apply(this, arguments);
    }
}));