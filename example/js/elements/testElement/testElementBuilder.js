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