function TestElement(parent, viewMode) {
    _.superClass(TestElement, this, parent, viewMode);
}

_.inherit(TestElement, InfinniUI.Element);


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