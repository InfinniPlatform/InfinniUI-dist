window.testHelpers = {

    DEFAULT_VALUES: {
        /* Оптимальное время проверки существования элемента, иначе зависает */
        maxTimeout: 6000,
        timeoutStep: 500
    },

    waitCondition: function (condition, success, error, maxTimeout, step) {
        maxTimeout = maxTimeout || window.testHelpers.DEFAULT_VALUES.maxTimeout;
        step = step || window.testHelpers.DEFAULT_VALUES.timeoutStep;
        var i = 1;

        var waiting = function () {
            if (condition()) {
                if ($.isFunction(success)) {
                    success();
                }

                return;
            }

            if (i * step >= maxTimeout) {
                if ($.isFunction(error)) {
                    error();
                }

                return;
            }

            ++i;
            setTimeout(waiting, step);
        };

        setTimeout(waiting, step);
    },

    waitView: function (viewName, success, error, maxTimeout, step) {
        var waitView = function () {
            if (!window.configWindow.contextApp) {
                return false;
            }

            var view = window.configWindow.contextApp.context.controls[viewName];

            if(window.configWindow.contextApp.name == viewName) {
                view = window.configWindow.contextApp;
            }

            return view && view.isLoaded();
        };

        window.testHelpers.waitCondition(waitView, success, error, maxTimeout, step);
    },

    waitModalView: function (viewName, success, error, maxTimeout, step) {
        var waitView = function () {
            var view = window.currentView.context.controls[viewName] || window.configWindow.contextApp.context.controls[viewName];
            return view && view.isLoaded();
        };

        window.testHelpers.waitCondition(waitView, success, error, maxTimeout, step);
    },

    getDate: function (iterator) {
        iterator = iterator || 0;
        iterator *= 1000 * 60 * 60 * 24;

        var currentDate = this.getStandartDate(new Date(Date.now() + iterator));

        // TODO: Следить за датами
        return this.getFormattedDate(currentDate);
    },

    getFormattedDate: function (date) {
        return window.configWindow.moment(date.replace(/\./g, '/')).format("YYYY-MM-DDTHH:mm:ss.SSS");
    },

    getStandartDate: function (date) {
        if(typeof date === 'number') {
            return this.getStandartDate(new Date(date * 1000));
        }
        // YYYY-MM-DD
        return String.prototype.concat(date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate()); //+1 - January-0
    },

    convertDate: function (date) {
        // TODO: Только если формат даты "DD.MM.YYYY"
        var reg = date.match(/^\d{2}.\d{2}.\d{4}$/);

        if (reg && reg.length != 0) {
            var items = date.split('.');
            return this.getFormattedDate(items[2] + '-' + items[1] + '-' + items[0]);
        }

        return this.getFormattedDate(date);
    },

    convertToUnixTime: function (date, element) {
        if(!element) {
            return date;
        }

        if(element.getMode) {
            switch (element.getMode()) {
                case 'Date':
                case 'Time':
                case 'DateTime':
                    return date;
                default:
                    return new Date(date).getTime() / 1000;
            }
        }

        return date;
    },

    getControlByName: function (controlName) {
        var indexInfo = /\[(\d+)\]/.exec(controlName);

        if (indexInfo == null) {
            return window.currentViewContext.controls[controlName] || window.configWindow.contextApp.context.controls[controlName];
        } else {
            var itemIndex = parseInt(indexInfo[1]);
            var itemName = controlName.match(/\w+/)[0];

            if (window.currentListBox == undefined || isNaN(itemIndex) || window.currentListBox.getItems().getByIndex(itemIndex) == undefined) {
                return undefined;
            }

            var result = window.currentListBox.findAllChildrenByName(itemName)[itemIndex];

            if (window.currentListBox.setSelectedItem) {
                window.currentListBox.setSelectedItem(window.currentListBox.getItems().getByIndex(itemIndex));
            }

            return result;
        }
    },

    parseTableRow: function ($cells) {
        var result = '';

        $cells.each(function (i, item) {
            result += '|' + window.configWindow.$(item).find('.pl-label:visible').text().trim().replace(/"/g, '\'');
        });

        return result + '|';
    }
};

function TestInfoHelper($info) {
    var passed = $info.find('#passed-count');
    var failed = $info.find('#failed-count');
    var ignored = $info.find('#ignored-count');

    this.incrementPassed = function () {
        var oldValue = parseInt(passed.text());
        passed.text(++oldValue);
    };

    this.incrementFailed = function () {
        var oldValue = parseInt(failed.text());
        failed.text(++oldValue);
    };

    this.incrementIgnored = function () {
        var oldValue = parseInt(ignored.text());
        ignored.text(++oldValue);
    };
}