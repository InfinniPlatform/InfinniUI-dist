function openDatagridPage( context, args ) {
    context.global.executeAction( context, {
        OpenAction: {
            LinkView: {
                AutoView: {
                    Path: 'views/dataGrid.json',
                    OpenMode: 'Container',
                    Container: 'MainContent'
                }
            }
        }
    } );
}

function openLoginPage( context, args ) {
    context.global.executeAction( context, {
        OpenAction: {
            LinkView: {
                AutoView: {
                    Path: 'views/loginPage.json',
                    OpenMode: 'Container',
                    Container: 'MainContent'
                }
            }
        }
    } );
}

function openDataBindingPage( context, args ) {
    context.global.executeAction( context, {
        OpenAction: {
            LinkView: {
                AutoView: {
                    Path: 'views/binding.json',
                    OpenMode: 'Container',
                    Container: 'MainContent'
                }
            }
        }
    } );
}

function openCustomElementsPage( context, args ) {
    context.global.executeAction( context, {
        OpenAction: {
            LinkView: {
                AutoView: {
                    Path: 'views/customElements.json',
                    OpenMode: 'Container',
                    Container: 'MainContent'
                }
            }
        }
    } );
}
