// Given

this.Given(/^я нахожусь на экране "([^"]*)"$/, function (viewName, next) {
    window.testHelpers.waitView(viewName,
        function () {
            window.currentView = window.configWindow.contextApp.context.controls[viewName] || window.configWindow.contextApp;
            window.currentViewContext = window.currentView.getContext();
            next();
        },
        function () {
            next(new Error(viewName + ' not found'));
        }
    );
});


// Then

this.Then(/^система отобразит экран "([^"]*)"$/, function (viewName, next) {
    window.testHelpers.waitView(viewName,
        function () {
            window.currentView = window.configWindow.contextApp.context.controls[viewName] || window.configWindow.contextApp;
            window.currentViewContext = window.currentView.getContext();
            next();
        },
        function () {
            next(new Error(viewName + ' not found'));
        }
    );
});

this.Then(/^система отобразит окно-сообщение "([^"]*)"$/, function (message, next) {
    var hasMessageBox = function () {
        return (window.configWindow.$.find('.messagebox:visible').length > 0);
    };

    var checkMessageText = function () {
        var messageBody = window.configWindow.$.find('.messagebox:visible .modal-body');
        var text = $.trim($(messageBody).text());

        try {
            chai.assert.equal(text, message);
            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error('MessageBox not found'));
    };

    window.testHelpers.waitCondition(hasMessageBox, checkMessageText, fail);
});

this.Then(/^система отобразит список кнопок: (.*?)$/, function (values, next) {
    var extValues = values
        .split(",")
        .map(function (item) {
            var result = item.trim();
            return result.substring(1, result.length - 1); //Удаляются кавычки
        });

    var actValues = window.configWindow.$(".btn-group.open .dropdown-menu > li .btntext")
        .map(function (index, item) {
            return $(item).text();
        })
        .toArray();

    try {
        chai.assert.deepEqual(actValues, extValues);
        next();
    } catch (err) {
        next(err);
    }
});

this.Then(/^система отобразит модальное окно "([^"]*)"$/, function (dialogView, next) {
    window.testHelpers.waitModalView(dialogView,
        function () {
            window.currentView = window.currentView.context.controls[dialogView] || window.configWindow.contextApp.context.controls[dialogView];
            window.currentViewContext = window.currentView.getContext();
            next();
        },
        function () {
            next(new Error(dialogView + ' not found'));
        }
    );
});

this.When(/^я закрою текущее модальное окно$/, function (next) {
    if (window.currentView.close != undefined) {
        var previousView = window.currentView.getView();

        window.currentView.close();
        window.currentView = previousView;

        next();
    } else {
        next(new Error('Method close() not found!'));
    }
});

this.Then(/^система отобразит значения выпадающего списка: (.*?)$/, function (values, next) {
    var extValues = values
        .split(",")
        .map(function (item) {
            var result = item.trim();
            return result.substring(1, result.length - 1); //Удаляются кавычки
        });

    var actValues = window.configWindow.$(".select2-results > li .select2-result-label")
        .map(function (index, item) {
            return $(item).text();
        })
        .toArray();

    try {
        chai.assert.deepEqual(actValues, extValues);
        next();
    } catch (err) {
        next(err);
    }
});

this.Then(/^система отобразит список валидационных сообщений: (.*?)$/, function (msgs, next) {
    var getMessages = function (arrayString) {
        return arrayString.split('", ').map(function (item) {
            return item
                .trim()
                .replace(/"/g, "")
                .replace(/''/g, '"');
        });
    };

    window.toastrActualMessageCount = getMessages(msgs).length;

    var haveToastr = function () {
        return window.toastrMessageCount == window.toastrActualMessageCount;
    };
    var success = function () {
        var actual = window.configWindow.$(".toast-success .toast-message, .toast-error .toast-message");
        var actualMessages = [];

        for (var i = 0; i < actual.length; i++) {
            actualMessages.push(actual.eq(i).text().replace(/''/g, '"'));
        }

        var messages = getMessages(msgs);
        var errorString = "\n" +
            "Expected\n" +
            messages.join('\n') +
            "\nActual\n" +
            actualMessages.join('\n') + '\n';

        try {
            chai.assert.deepEqual(actualMessages, messages, errorString);
            window.toastrMessageCount = 0;
            window.configWindow.$('#toast-container').remove();
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error("Ожидается: " + window.toastrActualMessageCount + " Реально: " + window.toastrMessageCount + " сообщений"));
    };
    window.testHelpers.waitCondition(haveToastr, success, fail);
});

this.Then(/^система отобразит вкладку "([^"]*)" на панели "([^"]*)"$/, function (fieldText, panelName, next) {
    var havePanel = function () {
        return window.testHelpers.getControlByName(panelName) != undefined;
    };
    var success = function () {
        var panel = window.testHelpers.getControlByName(panelName);
        var selectedItem = panel.getSelectedItem();

        if (selectedItem.getText() == fieldText) {
            next();
        } else {
            next(new Error(fieldText + ' not selected!'));
        }
    };
    var fail = function () {
        next(new Error(panelName + ' not found!'));
    };

    window.testHelpers.waitCondition(havePanel, success, fail);
});

this.Then(/^система не отобразит валидационных сообщений$/, function (next) {
    var haveToastr = function () {
        return window.configWindow.$("#toast-container") !== null &&
            window.configWindow.$("#toast-container").length != 0;
    };
    var success = function () {
        next();
    };
    var fail = function () {
        var msgs = window.configWindow.$("#toast-container .toast-message");
        var line = "";
        for (var i = 0; i < msgs.length; i++) {
            line += msgs[i].innerHTML + ", ";
        }
        next(new Error("Было обнаружено одно или несколько окон: " + line.substring(0, line.length - 2)));
    };

    window.testHelpers.waitCondition(haveToastr, fail, success);
});

this.Then(/^я не увижу элемент "([^"]*)"$/, function (elementName, next) {
    var haveElement = function () {
        return window.testHelpers.getControlByName(elementName) != undefined;
    };
    var wasFound = function () {
        var element = window.testHelpers.getControlByName(elementName);

        if (!!element.getVisible && !element.getVisible()) {
            next();
        } else {
            var errorString = !!element.getVisible ? 'was found' : 'getVisible is undefined';
            next(new Error(elementName + ': ' + errorString));
        }
    };
    var wasntFound = function () {
        next();
    };

    window.testHelpers.waitCondition(haveElement, wasFound, wasntFound);
});

this.Then(/^я не увижу элемент "([^"]*)" с текстом "([^"]*)"$/, function (elementName, elementText, next) {
    var haveElement = function () {
        return window.testHelpers.getControlByName(elementName) != undefined;
    };
    var wasFound = function () {
        var element = window.testHelpers.getControlByName(elementName);

        var actText = element.getText();

        if ((actText === undefined || actText === null) && element.getValue) {
            actText = element.getValue();
        }

        if (element.getDisplayValue) {
            actText = element.getDisplayValue();
        }

        try {
            if (actText === undefined || actText === null) {
                // TODO: Текст может быть определен в элементе, который лежит внутри данного элемента
                actText = element.findAllChildrenByType('Label')[0].getDisplayValue();
            }

            if (actText.trim) {
                actText = actText.trim();
            }

            if (actText != elementText) {
                next();
            } else {
                next(new Error(elementName + ' was found!'));
            }
        } catch (err) {
            next(err);
        }
    };
    var wasntFound = function () {
        next();
    };

    window.testHelpers.waitCondition(haveElement, wasFound, wasntFound);
});

this.Then(/^я увижу элемент "([^"]*)" с текстом "([^"]*)"$/, function (elementName, elementText, next) {
    var haveElement = function () {
        return window.testHelpers.getControlByName(elementName) != undefined;
    };
    var wasFound = function () {
        var element = window.testHelpers.getControlByName(elementName);

        var actText = element.getText();

        if ((actText === undefined || actText === null) && element.getValue) {
            actText = element.getValue();
        }

        if (element.getDisplayValue) {
            actText = element.getDisplayValue();
        }

        try {
            if (actText === undefined || actText === null) {
                // TODO: Текст может быть определен в элементе, который лежит внутри данного элемента
                actText = element.findAllChildrenByType('Label')[0].getDisplayValue();
            }

            if (actText.trim) {
                actText = actText.trim();
            }

            chai.assert.equal(actText, elementText);
            next();
        } catch (err) {
            next(err);
        }
    };
    var wasntFound = function () {
        next(new Error(elementName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveElement, wasFound, wasntFound);
});

this.Then(/^я увижу элемент "([^"]*)"$/, function (elementName, next) {
    var haveElement = function () {
        return window.testHelpers.getControlByName(elementName) != undefined;
    };
    var wasFound = function () {
        var element = window.testHelpers.getControlByName(elementName);

        try {
            chai.assert.isTrue(element.getVisible(), elementName + ': Visible == false');
            next();
        } catch (err) {
            next(err);
        }
    };
    var wasntFound = function () {
        next(new Error(elementName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveElement, wasFound, wasntFound);
});

this.Then(/^я увижу в таблице "([^"]*)" строку под номером "([^"]*)" со значением "([^"]*)"$/, function (tableName, rowIndex, rowValue, next) {
    var haveTable = function () {
        return window.testHelpers.getControlByName(tableName) != undefined;
    };

    var success = function () {
        try {
            var $table = window.configWindow.$('.pl-datagrid[data-pl-name="' + tableName + '"] .table');
            var $row = $table.find('.pl-datagrid-row.pl-datagrid-row_data').eq(parseInt(rowIndex));
            var expectedCells = rowValue.split('|');

            if ($row.length == 0) {
                next(new Error("Index out of range"));
                return;
            }

            var $cells = $row.find('td');

            if($cells.eq(0).hasClass('hidden')) {
                $cells.splice(0, 1);
            }

            expectedCells.splice(0, 1);
            expectedCells.pop();

            expectedCells = expectedCells.map(function (item) {
                return item.replace(/''/g, '"');
            });

            if (expectedCells.length != $cells.length) {
                var err = "expectedRows.length(" + expectedCells.length + ") != $cells.length(" + $cells.length + ")\n" +
                    'Row: ' + window.testHelpers.parseTableRow($cells);
                next(new Error(err));
                return;
            }

            for (var i = 0, ii = expectedCells.length; i < ii; i++) {
                if(expectedCells[i] === '***') {
                    continue;
                }

                var cellText = $cells
                    .eq(i)
                    .find('.pl-label:visible')
                    .text()
                    .trim();

                if(cellText != expectedCells[i]) {
                    var err = "Expected: '" + expectedCells[i] + "', Actual: '" + cellText + "'\n" +
                        'Expected row:  ' + rowValue + '\n' +
                        'Actual row:    ' + window.testHelpers.parseTableRow($cells);
                    next(new Error(err));
                    return;
                }
            }

            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error(tableName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveTable, success, fail);
});

this.Then(/^экран будет иметь название "([^"]*)"$/, function (viewText, next) {
    if(window.currentView) {
        var condition = function () {
            return window.currentView.getText && window.currentView.getText() === viewText;
        };

        var fail = function () {
            next(new Error("'" + viewText + "' not found!"));
        };

        window.testHelpers.waitCondition(condition, next, fail);
    } else {
        next(new Error("View is not initialized"));
    }
});

this.Then(/^таблица "([^"]*)" будет пустой$/, function (tableName, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(tableName) != undefined;
    }, function () {
        try {
            var $table = window.configWindow.$('.pl-datagrid[data-pl-name="' + tableName + '"] .table');
            var $row = $table.find('.pl-datagrid-row.pl-datagrid-row_data');
            $row.length == 0 ? next() : next(new Error('Количество записей: ' + $row.length));
        } catch (err) {
            next(err);
        }
    }, function () {
        next(new Error(tableName + ' not found'));
    });
});