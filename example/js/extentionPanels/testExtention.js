InfinniUI.extensionPanels.register( {
    name: 'TestExtension',
    initialize: function( context, args ) {
        this.context = args.context;

        this.$el = args.$el;
        this.parameters = args.parameters;
        this.itemTemplate = args.itemTemplate;
    },
    render: function() {
        this.$el.addClass( 'test-extension' );

        this.setColor();

        if( this.itemTemplate ) {
            this.$el
                .append( this.itemTemplate( this.context, { index: 0 } ).render() );
        }

        this.$el
            .append( '<div>TestExtension</div> ' );
    },
    setColor: function() {
        if( this.parameters && this.parameters[ 'color' ] ) {
            this.$el.addClass( 'pl-' + this.parameters[ 'color' ].getValue() + '-fg' );
        }
    }
} );
