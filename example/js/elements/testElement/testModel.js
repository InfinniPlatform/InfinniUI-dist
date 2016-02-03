var TestModel = ControlModel.extend(_.extend({

    defaults: _.defaults({
        testProperty: 'testPropertyValue'
    }, ControlModel.prototype.defaults),

    initialize: function(){
        ControlModel.prototype.initialize.apply(this, arguments);
    }
}));