// When

this.When(/^я введу в текстовое поле "([^"]*)" значение "([^"]*)"$/, function (fieldName, value, next) {
    var haveField = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };
    var success = function () {
        try {
            window.testHelpers.getControlByName(fieldName).setValue(value.replace(/'/g, '"'));
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(fieldName + ' not found!'));
    };
    window.testHelpers.waitCondition(haveField, success, fail);
});


this.When(/^я введу в числовое поле "([^"]*)" значение "([^"]*)"$/, function (fieldName, value, next) {
    var haveField = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };
    var success = function () {
        try {
            var numValue = parseFloat(value.replace(/,/g, '.'));

            if (isNaN(numValue)) {
                next(new Error(value + ' is not number'));
                return;
            }

            window.testHelpers.getControlByName(fieldName).setValue(numValue);
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(fieldName + ' not found!'));
    };
    window.testHelpers.waitCondition(haveField, success, fail);
});

this.When(/^я введу в поле типа дата "([^"]*)" значение "([^"]*)"$/, function (fieldName, dateString, next) {
    var haveField = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };
    var success = function () {
        try {
            var date = dateString.match(/[а-я]*/i)[0];
            var iterator = dateString.match(/\w+/g) != null ? parseInt(dateString.match(/\w+/g)[0]) : 0;
            var element = window.testHelpers.getControlByName(fieldName);
            var value;

            if (date === "Сегодня" && !isNaN(iterator)) {
                value = window.testHelpers.getDate(iterator);
            } else {
                value = window.testHelpers.getFormattedDate(dateString);
            }

            value = window.testHelpers.convertToUnixTime(value, element);
            element.setValue(value);

            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(fieldName + ' not found!'));
    };
    window.testHelpers.waitCondition(haveField, success, fail);
});

// Then

this.Then(/^значение в поле "([^"]*)" равно "([^"]*)"$/, function (fieldName, value, next) {
    var haveValue = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };

    var checkValue = function () {
        try {
            var field = window.testHelpers.getControlByName(fieldName);
            chai.assert.isDefined(field);

            var actValue = field.getDisplayValue();
            chai.assert.isTrue((actValue == value), actValue + ' != ' + value);

            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error(fieldName + ' is undefined'));
    };

    window.testHelpers.waitCondition(haveValue, checkValue, fail);
});

this.Then(/^значение в поле типа дата "([^"]*)" равно "([^"]*)"$/, function (fieldName, dateString, next) {
    var haveValue = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };

    var checkValue = function () {
        try {
            var field = window.testHelpers.getControlByName(fieldName);
            chai.assert.isDefined(field);

            var actValue = field.getValue();

            if (field.getDisplayValue) {
                actValue = field.getDisplayValue();
            }

            if (typeof actValue == "string") {
                actValue = window.testHelpers.convertDate(actValue);
                actValue = new Date(actValue).getTime();
            } else {
                var standartDate = window.testHelpers.getStandartDate(actValue);
                var formattedDate = window.testHelpers.getFormattedDate(standartDate);
                actValue = new Date(formattedDate).getTime();
            }

            var date = dateString.match(/[а-я]*/i)[0];
            var iterator = dateString.match(/\w+/g) != null ? parseInt(dateString.match(/\w+/g)[0]) : 0;

            if (date === "Сегодня" && !isNaN(iterator)) {
                var value = window.testHelpers.getDate(iterator);
                chai.assert.equal(new Date(value).getTime(), actValue);
            } else {
                date = window.testHelpers.getFormattedDate(dateString);
                chai.assert.equal(new Date(date).getTime(), actValue);
            }

            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error(fieldName + ' is undefined'));
    };

    window.testHelpers.waitCondition(haveValue, checkValue, fail);
});

this.Then(/^значение в выпадающем списке "([^"]*)" равно "([^"]*)"$/, function (fieldName, value, next) {
    var haveValue = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };

    var checkValue = function () {
        try {
            var actValue = window.configWindow
                .$('.pl-combobox[data-pl-name="' + fieldName + '"]')
                .find('.pl-combobox__value')
                .text()
                .trim();

            chai.assert.equal(value, actValue);

            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error(fieldName + ' is undefined'));
    };

    window.testHelpers.waitCondition(haveValue, checkValue, fail);
});

this.Then(/^флаг "([^"]*)" будет иметь значение "([^"]*)"$/, function (flagName, value, next) {
    var haveFlag = function () {
        return window.testHelpers.getControlByName(flagName) != undefined;
    };
    var success = function () {
        var flag = window.testHelpers.getControlByName(flagName);

        try {
            chai.assert.isDefined(flag);
            chai.assert.equal(flag.getValue(), JSON.parse(value));
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(flagName + ' not found!'));
    };
    window.testHelpers.waitCondition(haveFlag, success, fail);
});

this.When(/^я поменяю значение флага "([^"]*)" на "([^"]*)"$/, function (flagName, value, next) {
    var haveFlag = function () {
        return window.testHelpers.getControlByName(flagName) != undefined;
    };
    var success = function () {
        var flag = window.testHelpers.getControlByName(flagName);
        var parseValue = JSON.parse(value);

        if (typeof parseValue == "boolean") {
            flag.setValue(parseValue);
            next();
        } else {
            next(new Error("'" + value + "' is not correct value"));
        }
    };
    var fail = function () {
        next(new Error(flagName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveFlag, success, fail);
});

this.Then(/^значение в текстовом поле "([^"]*)" равно "([^"]*)"$/, function (fieldName, value, next) {
    var haveField = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };

    var checkValue = function () {
        try {
            var field = window.testHelpers.getControlByName(fieldName);
            chai.assert.isDefined(field);

            var actValue = field.getValue();

            if (typeof actValue == "number") {
                value = parseFloat(value.replace(/,/g, '.'));
            }

            if (typeof actValue == "string") {
                value = value.replace(/'/g, '"');
            }

            chai.assert.isTrue((actValue === value), actValue + ' != ' + value);

            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error(fieldName + ' is undefined'));
    };

    window.testHelpers.waitCondition(haveField, checkValue, fail);
});

this.Then(/^значение в числовом поле "([^"]*)" равно "([^"]*)"$/, function (fieldName, value, next) {
    var haveField = function () {
        return window.testHelpers.getControlByName(fieldName) != undefined;
    };

    var checkValue = function () {
        try {
            var field = window.testHelpers.getControlByName(fieldName);
            chai.assert.isDefined(field);

            value = parseFloat(value.replace(/,/g, '.'));

            var actValue = field.getValue();

            if (field.getDisplayValue) {
                actValue = field.getDisplayValue();
            }

            chai.assert.typeOf(actValue, 'number');
            chai.assert.isTrue((actValue === value), actValue + ' != ' + value);

            next();
        } catch (err) {
            next(err);
        }
    };

    var fail = function () {
        next(new Error(fieldName + ' is undefined'));
    };

    window.testHelpers.waitCondition(haveField, checkValue, fail);
});

this.Then(/^элемент "([^"]*)" будет недоступным$/, function (elementName, next) {
    var haveElement = function () {
        return window.testHelpers.getControlByName(elementName) != undefined;
    };
    var success = function () {
        try {
            if (!window.testHelpers.getControlByName(elementName).getEnabled()) {
                next();
            } else {
                next(new Error(elementName + ' is enabled!'));
            }
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(elementName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveElement, success, fail);
});

this.Then(/^элемент "([^"]*)" будет доступным$/, function (elementName, next) {
    var haveElement = function () {
        return window.testHelpers.getControlByName(elementName) != undefined;
    };
    var success = function () {
        try {
            if (window.testHelpers.getControlByName(elementName).getEnabled()) {
                next();
            } else {
                next(new Error(elementName + ' is disabled!'));
            }
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(elementName + ' not found!'));
    };

    window.testHelpers.waitCondition(haveElement, success, fail);
});

this.Then(/^я увеличу значение в числовом поле "([^"]*)"$/, function (boxName, next) {
    var haveBox = function () {
        return window.testHelpers.getControlByName(boxName) != undefined;
    };
    var success = function () {
        try {
            var numBox = window.testHelpers.getControlByName(boxName);

            if (!numBox.getEnabled()) {
                next(new Error("Элемент " + boxName + " недоступен!"));
                return;
            }

            var incr = numBox.getIncrement();
            var oldValue = numBox.getValue();

            numBox.setValue(oldValue + incr);
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(boxName + ' не найден!'));
    };
    window.testHelpers.waitCondition(haveBox, success, fail);
});

this.Then(/^я уменьшу значение в числовом поле "([^"]*)"$/, function (boxName, next) {
    var haveBox = function () {
        return window.testHelpers.getControlByName(boxName) != undefined;
    };
    var success = function () {
        try {
            var numBox = window.testHelpers.getControlByName(boxName);

            if (!numBox.getEnabled()) {
                next(new Error("Элемент " + boxName + " недоступен!"));
                return;
            }

            var incr = numBox.getIncrement();
            var oldValue = numBox.getValue();

            numBox.setValue(oldValue - incr);
            next();
        } catch (err) {
            next(err);
        }
    };
    var fail = function () {
        next(new Error(boxName + ' не найден!'));
    };
    window.testHelpers.waitCondition(haveBox, success, fail);
});

this.Then(/^я загружу файл "([^"]*)" в "([^"]*)"$/, function (fileName, fileBoxName, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(fileBoxName) != undefined;
    }, function () {
        try {
            var fileBox = window.testHelpers.getControlByName(fileBoxName);
            var xhr = new XMLHttpRequest();

            xhr.open('GET', '/test/integration/files/' + fileName, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                try {
                    if(xhr.status == 200) {
                        var file = new File([xhr.response], fileName, { type: xhr.response.type });
                        fileBox.setFile(file);
                        next();
                    } else {
                        next(new Error(xhr.status == 404 ? 'File ' + fileName + ' not found' : 'XMLHttpRequest status == ' + xhr.status));
                    }
                } catch (err) {
                    next(err);
                }
            };
            xhr.send();
        } catch (err) {
            next(err);
        }
    }, function () {
        next(new Error(fileBoxName + ' не найден!'));
    });
});

this.Then(/^значение в файловом поле "([^"]*)" равно "([^"]*)"$/, function (fileBoxName, value, next) {
    window.testHelpers.waitCondition(function () {
        return window.testHelpers.getControlByName(fileBoxName) != undefined;
    }, function () {
        try {
            var text = window.testHelpers.getControlByName(fileBoxName).control.controlModel.get('fileName');
            chai.assert.equal(value, text);
            next();
        } catch (err) {
            next(err);
        }
    }, function () {
        next(new Error(fileBoxName + ' not found!'));
    });
});