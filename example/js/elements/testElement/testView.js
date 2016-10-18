var TestView = InfinniUI.ControlView.extend({
    tagName: 'div',
    className: 'pl-test-view',

    template: InfinniUI.Template["elements/testElement/template/testElement.tpl.html"],

    UI: {
        control: '.pl-test-element-in'
    },


    initialize: function () {
        InfinniUI.ControlView.prototype.initialize.apply(this);
    },

    initHandlersForProperties: function(){
        InfinniUI.ControlView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:testProperty', this.updateTestProperty);
    },

    updateProperties: function(){
        InfinniUI.ControlView.prototype.updateProperties.call(this);

        this.updateTestProperty();
    },

    updateTestProperty: function(){
        var testProperty = this.model.get('testProperty');
        this.ui.control.html(testProperty);
    },

    render: function () {
        this.prerenderingActions();
        this.renderTemplate(this.template);

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    }

});
