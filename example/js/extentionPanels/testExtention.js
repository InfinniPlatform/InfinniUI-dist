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