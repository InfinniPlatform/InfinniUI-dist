//####js/elements/testElement/testControl.js
var TestControl = function (viewMode) {
    _.superClass(TestControl, this, viewMode);
};

_.inherit(TestControl, Control);

_.extend(TestControl.prototype, {

    createControlModel: function () {
        return new TestModel();
    },

    createControlView: function (model, viewMode) {
        return new TestView({model: model});
    }

});
//####js/elements/testElement/testElement.js
function TestElement(parent, viewMode) {
    _.superClass(TestElement, this, parent, viewMode);
}

_.inherit(TestElement, Element);


_.extend(TestElement.prototype, {

        createControl: function () {
            return new TestControl();
        },

        setTestProperty: function (value) {
            this.control.set('testProperty', value);
        },

        getTestProperty: function () {
            return this.control.get('testProperty');
        }

    }
);
//####js/elements/testElement/testElementBuilder.js
function TestElementBuilder() {
    _.superClass(TestElementBuilder, this);
}

_.inherit(TestElementBuilder, ElementBuilder);

_.extend(TestElementBuilder.prototype, {
        applyMetadata: function(params){
            var element = params.element;
            var metadata = params.metadata;

            ElementBuilder.prototype.applyMetadata.call(this, params);

            if('TestProperty' in metadata){
                element.setTestProperty(metadata['TestProperty']);
            }
        },

        createElement: function(params){
            return new TestElement(params.parent, params.metadata['ViewMode']);
        }

    }
);

ApplicationBuilder.addToRegisterQueue('TestElement', new TestElementBuilder());
//####js/elements/testElement/testModel.js
var TestModel = ControlModel.extend(_.extend({

    defaults: _.defaults({
        testProperty: 'testPropertyValue'
    }, ControlModel.prototype.defaults),

    initialize: function(){
        ControlModel.prototype.initialize.apply(this, arguments);
    }
}));
//####js/elements/testElement/testView.js
var TestView = ControlView.extend({
    tagName: 'div',
    className: 'pl-test-view',

    template: InfinniUI.Template["testElement/template/testElement.tpl.html"],

    UI: {
        control: '.pl-test-element-in'
    },


    initialize: function () {
        ControlView.prototype.initialize.apply(this);
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:testProperty', this.updateTestProperty);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);

        this.updateTestProperty();
    },

    updateTestProperty: function(){
        var testProperty = this.model.get('testProperty');
        this.ui.control.html(testProperty);
    },

    render: function () {
        var model = this.model;

        this.prerenderingActions();
        this.renderTemplate(this.template);

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    }

});
//####js/extentionPanels/testExtention.js
function TestExtension(context, args) {
    this.context = args.context;

    this.$el = args.$el;
    this.parameters = args.parameters;
    this.itemTemplate = args.itemTemplate;
}

_.extend( TestExtension.prototype, {
    render: function(){
        this.$el
            .append('<div>TestExtension</div> ')
            .append(this.itemTemplate(this.context, {index:0}).render());
    }
});