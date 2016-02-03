var <%=_.capitalize(file.name)%>Control = function () {
    _.superClass(<%=_.capitalize(file.name)%>Control, this);
};

_.inherit(<%=_.capitalize(file.name)%>Control, Control);

_.extend(<%=_.capitalize(file.name)%>Control.prototype, {
    createControlModel: function () {
        return new <%=_.capitalize(file.name)%>Model();
    },

    createControlView: function (model) {
        return new <%=_.capitalize(file.name)%>View({model: model});
    }
});

var <%=_.capitalize(file.name)%>View = ControlView.extend({
    className: 'pl-<%= _(file.name).dasherize()%>',

    template: _.template(
        '<div class="pl-<%= _(file.name).dasherize()%>"></div>' //TODO: отредактирвоать шаблон
    ),

    UI: {
                        //TODO: пары jQuery-элемент - селектор для быстрого доступа
    },


    initialize: function () {
        ControlView.prototype.initialize.apply(this);
    },

    render: function () {
        this.prerenderingActions();

        this.$el
            .html(this.template({}));

        this.bindUIElements();

        this.postrenderingActions();
        return this;
    }


});

var <%=_.capitalize(file.name)%>Model = ControlModel.extend({
    defaults: _.defaults({
        //TODO: параметры элемента (value:null например)
    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this);
    }
});