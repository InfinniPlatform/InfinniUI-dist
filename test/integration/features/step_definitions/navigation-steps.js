// When

this.When(/^я нажму на кнопку "([^"]*)"$/, function (buttonName, next) {
    var haveButton = function () {
        return window.testHelpers.getControlByName(buttonName) != undefined;
    };
    var success = function () {
        try {
            var button = window.testHelpers.getControlByName(buttonName);
            if (button.getVisible()) {
                button.click();
                next();
            } else {
                next(new Error(buttonName + ': Visible == false'));
            }
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(buttonName + " not found!"));
    };
    window.testHelpers.waitCondition(haveButton, success, fail);
});

this.When(/^я нажму на ссылку "([^"]*)"$/, function (linkName, next) {
    var haveLink = function () {
        return window.testHelpers.getControlByName(linkName) != undefined;
    };

    var success = function () {
        try {
            var link = window.testHelpers.getControlByName(linkName);
            link.click();
            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error(linkName + " not found!"));
    };

    window.testHelpers.waitCondition(haveLink, success, fail);
});

this.When(/^я нажму на элемент "([^"]*)"$/, function (elementName, next) {
    var haveElement = function () {
        return window.testHelpers.getControlByName(elementName) != undefined;
    };
    var success = function () {
        window.testHelpers.getControlByName(elementName).control.controlView.$el.click();

        next();
    };
    var fail = function () {
        next(new Error(elementName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveElement, success, fail);
});

this.When(/^я нажму на выпадающий список кнопок "([^"]*)"$/, function (buttonName, next) {
    var buttonSelector = "[data-pl-name=\"{buttonName}\"] .pl-popup-btn-toggle".replace("{buttonName}", buttonName);

    var haveButton = function () {
        return window.configWindow.$(buttonSelector).length != 0;
    };
    var success = function () {
        try {
            window.configWindow.$(buttonSelector).click();
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(buttonName + ' not found!'));
    };
    window.testHelpers.waitCondition(haveButton, success, fail);
});

this.When(/^я нажму на выпадающий список "([^"]*)"$/, function (buttonName, next) {
    var buttonSelector = "[data-pl-name=\"{buttonName}\"] .pl-combobox__grip".replace("{buttonName}", buttonName);

    var haveButton = function () {
        return window.configWindow.$(buttonSelector).length != 0;
    };
    var success = function () {
        try {
            window.configWindow.$(buttonSelector)[0].click();
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(buttonName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveButton, success, fail);
});

this.When(/^я выберу пункт "([^"]*)"$/, function (value, next) {
    var selector = ".pl-combobox-items > .pl-label:contains('{VALUE}')".replace("{VALUE}", value);

    var haveValue = function () {
        return window.configWindow.$(selector).length != 0;
    };
    var success = function () {
        window.configWindow.$(selector)[0].click();
        next();
    };
    var fail = function () {
        next(new Error(value + ' not found!'));
    };

    window.testHelpers.waitCondition(haveValue, success, fail);
});

this.When(/^я нажму в окне-сообщении на кнопку "([^"]*)"$/, function (buttonText, next) {
    var haveButton = function () {
        return window.configWindow.$.find('.messagebox:visible .modal-footer :contains({btnText})'.replace('{btnText}', buttonText)).length > 0;
    };
    var success = function () {
        var button = window.configWindow.$.find('.messagebox:visible .modal-footer :contains({btnText})'.replace('{btnText}', buttonText))[0];
        button.click();
        next();
    };
    var fail = function () {
        next(new Error(buttonText + ' not found!'));
    };

    window.testHelpers.waitCondition(haveButton, success, fail);
});

this.When(/^я выберу список "([^"]*)"$/, function (listBoxName, next) {
    var haveList = function () {
        return window.testHelpers.getControlByName(listBoxName) != undefined;
    };
    var success = function () {
        window.currentListBox = window.testHelpers.getControlByName(listBoxName);
        next();
    };
    var fail = function () {
        next(new Error(listBoxName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveList, success, fail);
});

this.When(/^я выберу вкладку "([^"]*)" на панели "([^"]*)"$/, function (fieldText, panelName, next) {
    var havePanel = function () {
        return window.testHelpers.getControlByName(panelName) != undefined;
    };
    var success = function () {
        try {
            var panel = window.testHelpers.getControlByName(panelName);
            var tabPanels = panel.getChildElements();
            var index = -1;

            for (var i = 0; i < tabPanels.length && index == -1; i++) {
                if (tabPanels[i].getText() === fieldText) {
                    index = i;
                }
            }

            if (index != -1) {
                panel.setSelectedItem(tabPanels[index]);
                next();
            } else {
                next(new Error(fieldText + ' not found!'));
            }
        } catch (error) {
            next(error);
        }
    };
    var fail = function () {
        next(new Error(panelName + ' not found!'));
    };

    window.testHelpers.waitCondition(havePanel, success, fail);
});

this.When(/^я нажму на радиокнопку "([^"]*)" в группе "([^"]*)"$/, function (buttonText, radioGroupName, next) {
    var haveGroup = function () {
        return window.testHelpers.getControlByName(radioGroupName) != undefined;
    };
    var success = function () {
        var radioGroup = window.testHelpers.getControlByName(radioGroupName);
        var items = radioGroup.getItems().toArray();
        var check = false;

        items.forEach(function (item) {
            for (var property in item) {
                if (item[property] === buttonText) {
                    radioGroup.setSelectedItem(item);
                    radioGroup.setValue(item);
                    check = true;
                }
            }
        });

        if (check) {
            next();
        } else {
            next(new Error(buttonText + ' not found!'));
        }
    };
    var fail = function () {
        next(new Error(radioGroupName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveGroup, success, fail);
});

this.When(/^я выберу в текущем списке элемент под номером "([^"]*)"$/, function (index, next) {
    if (!window.currentListBox) {
        next(new Error("Список не выбран"));
    } else {
        try {
            var item = window.currentListBox.getItems().getByIndex(index);

            if (item) {
                window.currentListBox.setSelectedItem(item);
                next();
            } else {
                next(new Error("Out of range, length = " + window.currentListBox.getItems().toArray().length));
            }
        } catch (err) {
            next(err);
        }
    }
});

this.When(/^я отмечу в текущем списке элемент под номером "([^"]*)"$/, function (index, next) {
    if (!window.currentListBox) {
        next(new Error("Список не выбран"));
    } else {
        try {
            var item = window.currentListBox.getItems().getByIndex(index);

            if (item) {
                var list = window.currentListBox.getValue();

                if (!list) {
                    list = [];
                }

                list.push(item);

                window.currentListBox.setValue(list);

                next();
            } else {
                next(new Error("Out of range, length = " + window.currentListBox.getItems().toArray().length));
            }
        } catch (err) {
            next(err);
        }
    }
});

this.Then(/^я отмечу в таблице "([^"]*)" строку под номером "([^"]*)"$/, function (tableName, rowIndex, next) {
    var haveTable = function () {
        return window.testHelpers.getControlByName(tableName) != undefined;
    };

    var success = function () {
        var $table = window.configWindow.$('.pl-datagrid[data-pl-name="' + tableName + '"] .table');
        var $row = $table.find('.pl-datagrid-row').eq(parseInt(rowIndex));

        if ($row.length == 0) {
            next(new Error("Index out of range"));
            return;
        }

        var $checkbox = $row.find('.pl-toggle-cell input:checkbox');

        $checkbox.prop('checked', !$checkbox.prop('checked'));

        next();
    };

    var fail = function () {
        next(new Error(tableName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveTable, success, fail);
});

this.Then(/^я выберу в выпадающем списке "([^"]*)" значение "([^"]*)"$/, function (listName, itemText, next) {
    itemText = itemText.replace(/'/g, '"');

    var listSelector = '.pl-combobox[data-pl-name="' + listName + '"]';
    var itemSelector = ".pl-dropdown-container .pl-combobox-dropdown .pl-combobox-items .pl-label:contains('" + itemText + "')";

    var haveCombobox = function () {
        return window.configWindow.$(listSelector).length != 0;
    };
    var haveItem = function () {
        return window.configWindow.$(itemSelector).length != 0;
    };

    var successCombobox = function () {
        window.configWindow.$(listSelector + ' .pl-combobox__grip').click();
        window.testHelpers.waitCondition(haveItem, successItem, failItem);
    };
    var successItem = function () {
        window.configWindow.$(itemSelector).click();
        next();
    };

    var failCombobox = function () {
        next(new Error(listName + ' not found!'));
    };
    var failItem = function () {
        next(new Error('"' + itemText + '" not found!'));
    };

    window.testHelpers.waitCondition(haveCombobox, successCombobox, failCombobox);
});

this.Then(/^я выберу в выпадающем списке "([^"]*)" с фильтром "([^"]*)" значение "([^"]*)"$/, function (listName, filterText, itemText, next) {
    itemText = itemText.replace(/'/g, '"');
    filterText = filterText.replace(/'/g, '"');

    var listSelector = '.pl-combobox[data-pl-name="' + listName + '"]';
    var itemSelector = ".pl-dropdown-container .pl-combobox-dropdown .pl-combobox-items .pl-label:contains('" + itemText + "')";

    var haveCombobox = function () {
        return window.configWindow.$(listSelector).length != 0;
    };
    var haveItem = function () {
        return window.configWindow.$(itemSelector).length != 0;
    };

    var successCombobox = function () {
        window.configWindow.$(listSelector + ' .pl-combobox__grip').click();
        setTimeout(function () {
            try {
                window.testHelpers.getControlByName(listName).setAutocompleteValue(filterText);
            } catch (err) {
                next(err);
                return;
            }
            window.testHelpers.waitCondition(haveItem, successItem, failItem);
        }, 300);
    };
    var successItem = function () {
        window.configWindow.$(itemSelector).click();
        next();
    };

    var failCombobox = function () {
        next(new Error(listName + ' not found!'));
    };
    var failItem = function () {
        next(new Error('"' + itemText + '" not found!'));
    };

    window.testHelpers.waitCondition(haveCombobox, successCombobox, failCombobox);
});

this.Then(/^я сверну панель "([^"]*)"$/, function (panelName, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(panelName) != undefined;
    }, function () {
        try{
            window.testHelpers.getControlByName(panelName).setCollapsed(true);
            next();
        }catch (err){
            next(err);
        }
    }, function () {
        next(new Error(panelName + ' not found!'));
    });
});

this.Then(/^я разверну панель "([^"]*)"$/, function (panelName, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(panelName) != undefined;
    }, function () {
        try{
            window.testHelpers.getControlByName(panelName).setCollapsed(false);
            next();
        }catch (err){
            next(err);
        }
    }, function () {
        next(new Error(panelName + ' not found!'));
    });
});

this.Then(/^я перейду на страницу "([^"]*)" по кнопке "([^"]*)"$/, function(buttonPage, navigatorName, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(navigatorName) != undefined;
    }, function () {
        try{
            var pageNavigator = window.testHelpers.getControlByName(navigatorName);
            var pageNumber = parseInt(buttonPage);
            pageNavigator.setPageNumber(pageNumber);
            next();
        }catch (err){
            next(err);
        }
    }, function () {
        next(new Error(navigatorName + ' not found!'));
    });
});

this.Then(/^я перейду на следующую страницу по кнопке "([^"]*)"$/, function(navigatorName, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(navigatorName) != undefined;
    }, function () {
        try{
            var pageNavigator = window.testHelpers.getControlByName(navigatorName);
            var oldPageNumber = pageNavigator.getPageNumber();
            pageNavigator.setPageNumber(oldPageNumber + 1);
            next();
        }catch (err){
            next(err);
        }
    }, function () {
        next(new Error(navigatorName + ' not found!'));
    });

});

this.Then(/^я перейду на предыдущую страницу по кнопке "([^"]*)"$/, function(navigatorName, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(navigatorName) != undefined;
    }, function () {
        try{
            var pageNavigator = window.testHelpers.getControlByName(navigatorName);
            var oldPageNumber = pageNavigator.getPageNumber();
            var newPageNumber = oldPageNumber - 1;
            if (newPageNumber >= 0)
               pageNavigator.setPageNumber(newPageNumber);
            next();
        }catch (err){
            next(err);
        }
    }, function () {
        next(new Error(navigatorName + ' not found!'));
    });

});
