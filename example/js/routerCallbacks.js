function openHomePage(context, args) {
	if( context.controls["MainContent"] != null ) {
		context.controls["MainContent"].setLayout(null);
	}
};

function openDatagridPage(context, args) {
	context.global.executeAction(context, {
		OpenAction: {
			LinkView: {
				AutoView: {
					Path: "viewExample/dataGrid.json",
					OpenMode: "Container",
					Container: "MainContent"
				}
			}
		}
	});
};

function openLoginPage(context, args) {
	context.global.executeAction(context, {
		OpenAction: {
			LinkView: {
				AutoView: {
					Path: "viewExample/loginPage.json",
					OpenMode: "Container",
					Container: "MainContent"
				}
			}
		}
	});
};

function openDataBindingPage(context, args) {
	var itemId = args.params[0];

	context.global.executeAction(context, {
		OpenAction: {
			LinkView: {
				AutoView: {
					Path: "viewExample/binding.json",
					OpenMode: "Container",
					Container: "MainContent"
				}
			}
		}
	});
};

