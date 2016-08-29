function TestElementBuilder() {
    _.superClass(TestElementBuilder, this);
}

_.inherit(TestElementBuilder, InfinniUI.ElementBuilder);

_.extend(TestElementBuilder.prototype, {
        applyMetadata: function(params){
            var element = params.element;
            var metadata = params.metadata;

            InfinniUI.ElementBuilder.prototype.applyMetadata.call(this, params);

            if('TestProperty' in metadata){
                element.setTestProperty(metadata['TestProperty']);
            }
        },

        createElement: function(params){
            return new TestElement(params.parent, params.metadata['ViewMode']);
        }

    }
);

InfinniUI.ApplicationBuilder.addToRegisterQueue('TestElement', new TestElementBuilder());
