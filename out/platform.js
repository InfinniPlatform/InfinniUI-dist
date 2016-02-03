//####app/utils/strict.js
'use strict';
//####app/utils/namespace.js

window.InfinniUI = window.InfinniUI || {};

window.InfinniUI.Utils = window.InfinniUI.Utils || {};

window.InfinniUI.Template = window.InfinniUI.Template || {};

window.InfinniUI.config = window.InfinniUI.config || {};

window.InfinniUI.global = window.InfinniUI.global || {};

window.InfinniUI.Metadata = window.InfinniUI.Metadata || {};

window.InfinniUI.localizations = window.InfinniUI.localizations || {
    'ru-RU': {
        caption: 'Русский'
    },
    'en-US': {
        caption: 'English'
    }
};
//####app/new/elements/scrollPanel/metadata/scrollVisibility.js
var ScrollVisibility = {
    auto: 'Auto',
    visible: 'Visible',
    hidden: 'Hidden'
};


//####app/new/elements/stackPanel/metadata/stackPanelOrientation.js
var StackPanelOrientation = {
    horizontal: 'Horizontal',
    vertical: 'Vertical'
};



//####app/new/elements/tabPanel/metadata/tabHeaderLocation.js
var TabHeaderLocation = {
    none: 'None',
    left: 'Left',
    top: 'Top',
    right: 'Right',
    bottom: 'Bottom'
};

//####app/new/elements/tabPanel/metadata/tabHeaderOrientation.js
var TabHeaderOrientation = {
    horizontal: 'Horizontal',
    vertical: 'Vertical'
};
//####app/element/_common/metadata/colorStyle.js
InfinniUI.Metadata.ColorStyle = [
    "Transparent",
    "Primary1",
    "Primary2",
    "Primary3",
    "Accent1",
    "Accent2",
    "Accent3",
    "White",
    "Black"
];
//####app/element/_common/metadata/horizontalTextAlignment.js
//InfinniUI.Metadata.HorizontalTextAlignment = [
//    "Left",
//    "Right",
//    "Center",
//    "Justify"
//];
//####app/element/_common/metadata/textHorizontalAlignment.js
InfinniUI.Metadata.TextHorizontalAlignment = {
    left: 'Left',
    right: 'Right',
    center: 'Center',
    justify: 'Justify'
};

//####app/element/_common/metadata/textStyle.js
InfinniUI.Metadata.TextStyle = [
    "Display4",
    "Display3",
    "Display2",
    "Display1",
    "Headline",
    "Title",
    "Subhead",
    "Body2",
    "Body1",
    "Caption",
    "Menu",
    "Button"
];
//####app/config.js
_.defaults( InfinniUI.config, {
    lang: 'ru-RU',
    maxLengthUrl: 2048,
    cacheMetadata: false, //boolean - enable/disable cache | milliseconds
    serverUrl: 'http://localhost:9900',//'http://10.0.0.32:9900';
    configId: 'PTA',
    configName: 'Хабинет'
});
//####app/utils/BlobUtils.js
/**
 * Набор утилит для работы с BlobData объектами
 **/


window.InfinniUI.BlobUtils = (function () {

    return  {
        createFromFile: function(file) {
            var blobData = {
                Info:{
                    Name:   file.name,
                    Type:   file.type,
                    Size:   file.size,
                    Time:   file.lastModifiedDate
                }
            };

            return blobData;
        }
    }

})();





//####app/utils/EventsManager.js
function EventsManager () {
    this.handlers = {};

}


EventsManager.prototype.on = function (event, handler) {
    if (typeof this.handlers[event] === 'undefined') {
        this.handlers[event] = [];
    }

    var handlers = this.handlers[event];
    var manager = this;
    handlers.push(handler);

    return {
        off: this.off.bind(this, event, handler)
    };
};

EventsManager.prototype.off = function (event, handler) {
    if (typeof event !== 'undefined') {
        var handlers = this.handlers[event];

        if (Array.isArray(handlers)) {
            for(var i = 0; i < handlers.length; i = i + 1) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    }
};

EventsManager.prototype.trigger = function (event) {
    var handlers = this.handlers[event],
        args = Array.prototype.slice.call(arguments, 1),
        deferred = $.Deferred();

    if (Array.isArray(handlers)) {
        var results = handlers.map(function (handler) {
            return handler.apply(null, args);
        });
        $.when.apply($, results)
            .done(function () {
                var results = Array.prototype.slice.call(arguments);
                var cancel = results.some(function (res) {
                    return res === false;
                });

                if (cancel) {
                    deferred.reject();
                } else {
                    deferred.resolve(results);
                }
            })
            .fail(function () {
                deferred.reject();
            });
    } else {
        deferred.resolve();
    }

    return deferred.promise();
};
//####app/utils/actionOnLoseFocus.js
var ActionOnLoseFocus = function ($el, action) {
    var that = this;
    this.$el = $el;
    this.action = action;
    this.checkNeedToAction_binded = _.bind(this.checkNeedToAction, this);

    $(document).on('mousedown', that.checkNeedToAction_binded);
};

ActionOnLoseFocus.prototype.checkNeedToAction = function (e) {
    if ($(e.target).closest(this.$el).length == 0) {
        this.action();
        $(document).off('mousedown', this.checkNeedToAction_binded)
    }
};
//####app/utils/basePathOfProperty.js
function BasePathOfProperty(basePathOfProperty, baseIndex, parentBasePath ) {


    if(this.isRelativeProperty(basePathOfProperty)){
        this.basePathOfProperty = parentBasePath.basePathOfProperty + this.excludeFirstChar(basePathOfProperty);
    }else{
        this.basePathOfProperty = basePathOfProperty;
    }

    if(!parentBasePath){
        if(baseIndex !== undefined && baseIndex !== null){
            this.indexesInParentLists = [baseIndex];
            this.basePathOfProperty += baseIndex;
        }

    }else{
        this.indexesInParentLists = parentBasePath.indexesInParentLists ? parentBasePath.indexesInParentLists.slice() : [];
        this.indexesInParentLists.push(baseIndex);

        this.parentBasePath = parentBasePath;
    }

}

_.extend(BasePathOfProperty.prototype, {
    /*���������� ������ ���� � �������� �������� � ���������*/
    resolveProperty: function(property) {
        if(property === undefined || property === null){
            property = '';
        }

        if(this.isRelativeProperty(property)){
            property = this.excludeFirstChar(property);
            return stringUtils.formatProperty(this.basePathOfProperty + property, this.indexesInParentLists);
        }else{
            return stringUtils.formatProperty(property, this.indexesInParentLists);
        }

    },

    /*���������� ������ ���� � �������� �������� � ��������� �� ��������� �������������� ����*/
    resolveRelativeProperty: function(relativeProperty) {
        var property;
        if(this.basePathOfProperty != ''){
            property = this.basePathOfProperty + '.' + relativeProperty;
        }else{
            property = relativeProperty;
        }
        return this.resolveProperty(property);
    },

    /*������� BasePathOfProperty ���������� ������*/
    buildChild: function(basePathOfProperty, baseIndex){
        return new BasePathOfProperty(basePathOfProperty, baseIndex, this);
    },

    /*������� BasePathOfProperty ���������� ������ � ������������� �����*/
    buildRelativeChild: function(basePathOfProperty, baseIndex){
        return new BasePathOfProperty(basePathOfProperty, baseIndex, this);
    },

    isRelativeProperty: function(property){
        return property.substr(0,1) == '@';
    },

    excludeFirstChar: function(str){
        return str.substr(1, str.length - 1);
    }
});
//####app/utils/cache.js
var Cache = function () {
    this.cleanup();
};

/**
 * @description Возвращает закешированное значение по ключу или false, если значения нет в кеше
 * @param {String|Object} key
 * @returns {*}
 */
Cache.prototype.get = function (key) {
    var hash = this.getKeyHash(key);
    var data = this.data[hash];

    if (typeof data === 'undefined') {
        return false;
    }

    if (this.isValid(hash)) {
        data.count = data.count + 1;
        return data.value;
    }

    return false;
};

/**
 * @description Сохраняет значение для указанного ключа
 * @param {*} key
 * @param {*} value
 * @returns {*}
 */
Cache.prototype.set = function (key, value) {
    var hash = this.getKeyHash(key);
    this.data[hash] = {
        value: value,
        date: new Date(),
        count: 0
    };

    return value;
};

/**
 * @description Сброс кеша
 * @returns {Cache}
 */
Cache.prototype.flush = function () {
    this.cleanup();
    return this
};

/**
 * @description Установка времени жизни кеша в лиллисекундах. 0 - Неограниченное время.
 * @param {numeric} lifetime
 * @returns {Cache}
 */
Cache.prototype.setLifetime = function (lifetime) {
    var value = parseInt(lifetime, 0);
    if (!isNaN(value)) {
        this.lifetime = value;
    }

    return this;
};

Cache.prototype.validFor = function (func) {
    if (typeof func !== 'function') {
        return;
    }
    if (this.list.indexOf(func) === -1) {
        this.list.push(func);
    }
};

Cache.prototype.cleanup = function () {
    this.count = 0;
    this.data = {};
    this.lifetime = 0;
    this.list = [];
};

Cache.prototype.invalidate = function (hash) {
    delete this.data[hash];
};

Cache.prototype.isValid = function (hash) {
    var data = this.data[hash];
    if (this.lifetime < 0) {
        this.invalidate(hash);
    } else if (this.lifetime > 0){
        if (Date.now() - data.date.getTime() > this.lifetime) {
            this.invalidate(hash);
            return false;
        }
    }

    for (var i = 0, ln = this.list.length; i < ln; i = i + 1) {
        if (this.list[i].call() === false) {
            this.invalidate(hash);
            return false;
        }
    }

    return true;
};

Cache.prototype.getKeyHash = function (key) {
    return JSON.stringify(key);
};

//####app/utils/clone.js
_.mixin({
    deepClone: function (value) {
        if (value !== null && typeof value !== 'undefined') {
            return JSON.parse(JSON.stringify(value));
        }
        return value;
    }
});
//####app/utils/collection/collection.js
/**
 *
 * @param {Array} items
 * @param {string} [idProperty]
 * @param {function} [comparator]
 * @constructor
 */
function Collection (items, idProperty, comparator) {
    if (!Array.isArray(items)) {
        items = [];
    }

    /**
     * @type {Array.<Object>}
     * @protected
     */
    this._items = items.map(function (value, index) {
        return this.createCollectionItem(value, index);
    }, this);

    /**
     * @type {string|null}
     * @protected
     */
    this._idProperty = idProperty;

    /**
     * @type {function}
     * @protected
     */
    this._comparator = comparator || defaultComparator;

    function defaultComparator (a, b) {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        return 0;
    }

    /**
     *
     * @type {CollectionEventManager}
     */
    this.events = new CollectionEventManager();
}

Object.defineProperties(Collection.prototype, /** @lends Collection.prototype */{
    /**
     * @type {string|null}
     */
    idProperty: {
        get: function () {
            return this._idProperty;
        },
        enumerable: false
    },
    /**
     * @type {function}
     */
    comparator: {
        get: function () {
            return this._comparator;
        },
        enumerable: false
    },
    /**
     * @type {number}
     */
    length: {
        get: function () {
            return this._items.length;
        },
        enumerable: false
    },
    /**
     * @type {boolean}
     */
    hasIdProperty: {
        get: function () {
            return typeof this._idProperty !== 'undefined';
        },
        enumerable: false
    }
});

/**
 *
 * @param {number} index
 * @param {string} propertyName
 * @param {*} value
 * @returns {Collection}
 */
Collection.prototype.setProperty = function (index, propertyName, value) {
    var item = this._items[index];

    if (item) {
        item[propertyName] = value;
    }
    return this;
};

/**
 *
 * @param {number} index
 * @param {string} propertyName
 * @returns {*}
 */
Collection.prototype.getProperty = function (index, propertyName) {
    var item = this._items[index];

    if (item) {
        return item[propertyName];
    }
};

/**
 * @description Возвращает количество элементов в коллекции
 * @returns {number} Количество элементов в коллекции
 */
Collection.prototype.size = function () {
    return this.length;
};

/**
 * @description Добавляет элемент в конец коллекции
 * @param {*} value
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.push = function (value) {
    var items = this._items;
    var item = this.createCollectionItem(value, items.length);

    items.push(item);

    this.events.onAdd([value]);
    return true;
};

/**
 * @description Добавляет элемент в конец коллекции. @see {@link Collection.push}
 */
Collection.prototype.add = Collection.prototype.push;

/**
 * @description Добавляет элементы в конец коллекции
 * @param {Array} values
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.addAll = function (values) {
    if (!Array.isArray(values)) {
        return false;
    }

    var items = this._items;
    var changed = values.length > 0;

    values.forEach(function (value) {
        var item = this.createCollectionItem(value, items.length);
        items.push(item);
    }, this);

    if (changed) {
        this.events.onAdd(values);
    }
    return changed;
};

/**
 * @description Вставляет элемент в указанную позицию коллекции
 * @param {number} index
 * @param {*} newItem
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.insert = function (index, newItem) {
    var item = this.createCollectionItem(newItem, index);
    this._items.splice(index, 0, item);

    this.events.onAdd([newItem], index);
    return true;
};

/**
 *
 * @param {number} index
 * @param {Array} newItems
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.insertAll = function (index, newItems) {
    if (!Array.isArray(newItems)) {
        return false;
    }

    var items = this._items;
    var changed = newItems.length > 0;

    newItems.forEach(function(value, i) {
        var start = index + i;
        var item = this.createCollectionItem(value, start);
        items.splice(start, 0, item);
    }, this);

    if (changed) {
        this.events.onAdd(newItems, index);
    }
    return changed;
};

/**
 * @description Устанавливает список элементов коллекции
 * @param {Array} newItems
 * @return {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.reset = function (newItems) {
    var changed, items;

    if (!Array.isArray(newItems)) {
        return false;
    }

    changed = this._items.length !== newItems.length;

    items = newItems.map(function (value, index) {
        if (!changed) {
            changed = !this.isEqual(value, this.getCollectionItemValue(index));
        }
        return this.createCollectionItem(value, index);

    }, this);

    this._items.length = 0;

    Array.prototype.push.apply(this._items, items);
    if (changed) {
        this.events.onReset();
    }
    return changed;
};


/**
 * @description Заменяет элемент коллекции на указанный
 * @param {Array} newItems
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.set = function (newItems, silent) {
    var items = this._items;

    if (!Array.isArray(newItems)) {
        return false;
    }

    var changed = items.length !== newItems.length;
    var _newItems = newItems.slice();
    var matched, i = 0;
    var itemValue, newValue = null, newValueIndex;



    _newItems.forEach(function(newItem, index){
        if (index < items.length) {
            //Изменение элементов
            if (!changed) {
                changed = !this.isEqual(this.getCollectionItemValue(index), _newItems[index]);
            }
            if (changed) {
                this.updateCollectionItem(items[index], newItem);
            }
        } else {
            //Новые элементы
            changed = true;
            items.push(this.createCollectionItem(newItem, items.length));
        }
    }, this);

    if (newItems.length < items.length) {
        items.splice(newItems.length)
    }

    if (changed && !silent) {
        this.events.onReset();
    }
    return changed;
};

/**
 * @description Заменяет элемент коллекции на указанный.
 * @param {*} oldItem
 * @param {*} newItem
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.replace = function (oldItem, newItem) {
    var itemValue;
    var changed = true;
    for (var i = 0; i < this._items.length; i = i + 1) {
        itemValue = this.getCollectionItemValue(i);
        if (this.isEqual(oldItem, itemValue)) {
            this.updateCollectionItem(this._items[i], newItem);
            changed = true;
            break;
        }
    }

    if (changed) {
        this.events.onReplace([oldItem], [newItem]);
    }
    return changed;
};

/**
 * @description Удаляет последний элемент из коллекции
 * @returns {*|undefined} Возвращает последний элемент коллекции, который был удален
 */
Collection.prototype.pop = function () {
    if (this._items.length === 0) {
        return;
    }

    var itemValue = this.getCollectionItemValue(this.length - 1);
    this._items.pop();
    this.events.onRemove([itemValue], this._items.length);
    return itemValue;
};

/**
 * @description Удаляет указанный элемент из коллекции
 * @param {*} item
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.remove = function (item) {
    var itemValue;
    var itemIndex;

    var changed = true;
    for (var i = 0; i < this._items.length; i = i + 1) {
        itemValue = this.getCollectionItemValue(i);
        itemIndex = i;
        if (this.isEqual(item, itemValue)) {
            this._items.splice(i, 1);
            changed = true;
            break;
        }
    }

    if (changed) {
        this.events.onRemove([item], itemIndex);
    }
    return changed;
};

/**
 * @description Удаляет элемент с указанным идентификатором из коллекции
 * @param {number|string} id
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.removeById = function (id) {
    if (!this.hasIdProperty) {
        return false;
    }

    var itemValue;
    var itemIndex;

    var changed = true;
    for (var i = 0; i < this._items.length; i = i + 1) {
        itemValue = this.getCollectionItemValue(i);
        itemIndex = i;
        if (this.getValueId(itemValue) === id) {
            this._items.splice(i, 1);
            changed = true;
            break;
        }
    }

    if (changed) {
        this.events.onRemove([itemValue], itemIndex);
    }
    return changed;
};

/**
 * @description Удаляет элемент с указанным индексом из коллекции
 * @param {number} index
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.removeAt = function (index) {
    if (index >= this._items.length) {
        return false;
    }

    var item = this.getCollectionItemValue(index);
    this._items.splice(index, 1);

    this.events.onRemove([item], index);
    return true;
};


/**
 * @description Удаляет указанные элементы из коллекции
 * @param {Array} items
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.removeAll = function (items) {
    if (!Array.isArray(items)) {
        return false;
    }

    var collectionItems = this._items;
    var deletedItems = [];
    var changed;

    items.forEach(function (value) {

        deletedItems = collectionItems.filter(function (item) {
            return this.isEqual(value, this.getItemValue(item));
        }, this);

        deletedItems.forEach(function (item) {
            var index = collectionItems.indexOf(item);
            collectionItems.splice(index, 1);
        });
    }, this);

    changed = deletedItems.length > 0;

    if (changed) {
        var values = deletedItems.map(function (item) {
            return this.getItemValue(item);
        }, this);
        //@TODO Добавить параметр oldStartingIndex для события
        this.events.onRemove(values);
    }
    return changed;
};


/**
 * @description Удаляет диапазон элементов из коллекции
 * @param {number} fromIndex
 * @param {number} [count]
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.removeRange = function (fromIndex, count) {
    var items = this._items;
    var changed;

    if (fromIndex >= items.length) {
        return false;
    }

    if (typeof count === 'undefined') {
        count = items.length - fromIndex;
    }

    var deletedItems = items.splice(fromIndex, count);
    changed = deletedItems.length > 0;

    if (changed) {
        var values = deletedItems.map(function (item) {
            return this.getItemValue(item);
        }, this);

        this.events.onRemove(values, fromIndex);
    }
    return changed;
};


/**
 * @description Удаляет все элементы из коллекции, удовлетворяющие указанному условию
 * @param {function} predicate
 * @param [thisArg]
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.removeEvery = function (predicate, thisArg) {
    if (typeof predicate !== 'function') {
        return false;
    }

    var items = this._items;
    var changed;
    var deletedItems = items.filter(function (item, index) {
        var itemValue = this.getItemValue(item);
        return predicate.call(thisArg, itemValue, index, this);
    }, this);

    deletedItems.forEach(function (deletedItem) {
        var index = items.indexOf(deletedItem);
        items.splice(index, 1);
    });

    changed = deletedItems.length > 0;
    if (changed) {
        var values = deletedItems.map(function (item) {
            return this.getItemValue(item);
        }, this);

        this.events.onRemove(values);
    }
    return changed;
};


/**
 * @description Удаляет все элементы из коллекции
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.clear = function () {
    var
        items = this._items,
        changed = items.length > 0,
        values = items.map(function (item) {
            return this.getItemValue(item);
        }, this);


    items.length = 0;

    if (changed) {
        this.events.onRemove(values, 0);
    }

    return changed;
};

/**
 * @description Возвращает элемент коллекции с заданным идентификатором.
 * @param {number|string} id
 * @returns {*|undefined} Элемент коллекции с заданным идентификатором
 */
Collection.prototype.getById = function (id) {
    if (!this.hasIdProperty) {
        return false;
    }

    var items = this._items;
    var itemValue, result;

    for (var i = 0; i < items.length; i = i + 1) {
        itemValue = this.getCollectionItemValue(i);
        if (this.getValueId(itemValue) === id) {
            result = itemValue;
            break;
        }
    }

    return result;
};

/**
 * @description Возвращает элемент коллекции с заданным индексом
 * @param {number} index
 * @returns {*|undefined}
 */
Collection.prototype.getByIndex = function (index) {
    return this.getCollectionItemValue(index);
};

/**
 * #description Возвращает первый найденный элемент коллекции, удовлетворяющий условию
 * @param {function} predicate
 * @param [thisArg]
 * @returns {*|undefined} Первый найденный элемент коллекции, удовлетворяющий указанному условию.
 */
Collection.prototype.find = function (predicate, thisArg) {
    if (typeof predicate !== 'function') {
        return false;
    }

    var items = this._items;
    var itemIndex;
    var matched = items.some(function (item, index) {
        var itemValue = this.getItemValue(item);
        itemIndex = index;
        return predicate.call(thisArg, itemValue, index, this);
    }, this);

    if (matched) {
        return this.getCollectionItemValue(itemIndex);
    }
};

/**
 * @description Возвращает индекс первого найденного элемента коллекции при поиске с начала
 * @param {*} item
 * @param {number} [fromIndex = 0]
 * @returns {number} �?ндекс первого найденного элемента коллекции или -1, если элемент не найден
 */
Collection.prototype.indexOf = function (item, fromIndex) {
    var
        items = this._items,
        index = -1;

    if (typeof fromIndex === 'undefined') {
        fromIndex = 0;
    }

    for (var i = fromIndex;  i < items.length; i = i + 1) {
        var itemValue = this.getItemValue(items[i]);
        if (this.isEqual(item, itemValue)) {
            index = i;
            break;
        }
    }

    return index;
};


/**
 * @description Возвращает индекс первого найденного элемента коллекции при поиске с конца
 * @param {*} item
 * @param {number} [fromIndex]
 * @returns {number} �?ндекс первого найденного элемента коллекции или -1, если элемент не найден
 */
Collection.prototype.lastIndexOf = function (item, fromIndex) {
    var
        items = this._items,
        index = -1;

    if (typeof fromIndex === 'undefined') {
        fromIndex = items.length - 1;
    }

    if (items.length === 0 || fromIndex >= items.length) {
        return -1;
    }

    for (var i = fromIndex;  i > 0; i = i - 1) {
        var itemValue = this.getItemValue(items[i]);
        if (this.isEqual(item, itemValue)) {
            index = i;
            break;
        }
    }

    return index;
};

/**
 * @description Возвращает индекс первого найденного элемента коллекции, удовлетворяющего условию
 * @param {function} predicate
 * @param [thisArg]
 * @returns {*} �?ндекс первого найденного элемента коллекции, удовлетворяющего указанному условию
 */
Collection.prototype.findIndex = function (predicate, thisArg) {
    if (typeof predicate !== 'function') {
        return false;
    }

    var items = this._items;
    var itemIndex = -1;
    var matched = items.some(function (item, index) {
        var itemValue = this.getItemValue(item);
        itemIndex = index;
        return predicate.call(thisArg, itemValue, index, this);
    }, this);

    return matched ? itemIndex : -1;
};

/**
 * @description Проверяет наличие указанного элемента в коллекции
 * @param {*} item
 * @param {number} [fromIndex = 0]
 * @returns {boolean} Возвращает true, если указанный элемент содержится в коллекции, иначе - false
 */
Collection.prototype.contains = function (item, fromIndex) {
    fromIndex = fromIndex || 0;

    var
        found = false,
        items = this._items;

    for (var i = fromIndex; i < items.length; i = i + 1) {
        var itemValue = this.getItemValue(items[i]);
        found = this.isEqual(itemValue, item);
        if (found) {
            break;
        }
    }

    return found;
};


/**
 * @description Проверяет, что каждый элемент коллекции удовлетворяет указанному условию
 * @param {function} predicate
 * @param [thisArg]
 * @returns {boolean} Возвращает true, если каждый элемент удовлетворяют указанному условию, иначе - false
 */
Collection.prototype.every = function (predicate, thisArg) {

    if (typeof predicate !== 'function') {
        return false;
    }

    var items = this._items;

    return items.every(function (item, index) {
        var itemValue = this.getItemValue(item);
        return predicate.call(thisArg, itemValue, index, this);
    }, this);
};


/**
 * @description Проверяет, что некоторый элемент коллекции удовлетворяет указанному условию
 * @param {function} predicate
 * @param [thisArg]
 * @returns {boolean} Возвращает true, если есть элемент, удовлетворяющий указанному условию, иначе - false
 */
Collection.prototype.some = function (predicate, thisArg) {
    if (typeof predicate !== 'function') {
        return false;
    }

    var items = this._items;

    return items.some(function (item, index) {
        var itemValue = this.getItemValue(item);
        return predicate.call(thisArg, itemValue, index, this);
    }, this);
};

/**
 * @description Перечисляет все элементы коллекции
 * @param {function} callback
 * @param [thisArg]
 */
Collection.prototype.forEach = function (callback, thisArg) {
    if (typeof callback !== 'function') {
        return;
    }

    var items = this._items;

    items.forEach(function (item, index) {
        var itemValue = this.getItemValue(item);

        callback.call(thisArg, itemValue, index, this);
    }, this);
};

/**
 * @description Возвращает элементы коллекции, удовлетворяющие указанному условию
 * @param {function} predicate
 * @param [thisArg]
 * @returns {Array}
 */
Collection.prototype.filter = function (predicate, thisArg) {
    if (typeof predicate !== 'function') {
        return [];
    }

    var items = this._items;

    return items
        .filter(function (item, index) {
            var itemValue = this.getItemValue(item);
            return predicate.call(thisArg, itemValue, index, this);
        }, this)
        .map(function (item) {
            return this.getItemValue(item);
        }, this);
};

/**
 * @description Возвращает указанный диапазон элементов коллекции
 * @param {number} fromIndex
 * @param {number} [count]
 * @returns {Array}
 */
Collection.prototype.take = function (fromIndex, count) {
    var items = this._items;

    if (typeof count == 'undefined') {
        count = items.length;
    }

    return items
        .slice(fromIndex, fromIndex + count)
        .map(function(item) {
            return this.getItemValue(item);
        }, this);
};

/**
 * @description Возвращает массив всех элементов коллекции
 * @returns {Array} Массив, содержащий все элементы коллекции
 */
Collection.prototype.toArray = function () {
    return this._items.map(function (item) {
        return this.getItemValue(item);
    }, this);
};

/**
 * @description Перемещает элемент коллекции в позицию с указанным индексом
 * @param {number} oldIndex
 * @param {number} newIndex
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.move = function (oldIndex, newIndex) {
    var items = this._items,
        item;

    if (oldIndex < 0 || oldIndex >= items.length || oldIndex === newIndex) {
        return false;
    }

    item = items.splice(oldIndex, 1).pop();

    if (oldIndex > newIndex) {
        items.splice(newIndex, 0, item);
    } else {
        items.splice(newIndex - 1, 0, item);
    }

    var changed = items[oldIndex] !== item;

    if (changed) {
        var value = this.getItemValue(item);
        this.events.onMove([value], [value], oldIndex, newIndex);
    }
    return changed;
};

/**
 * @description Сортирует список элементов коллекции
 * @param {function} comparator
 * @returns {boolean} Возвращает true, если коллекция была изменена, иначе - false
 */
Collection.prototype.sort = function (comparator) {
    if (typeof comparator !== 'function') {
        comparator = this._comparator;
    }

    var
        items = this._items,
        collection = this,
        _items= items.slice(),
        changed = false;

    items.sort(function(item1, item2) {
        return comparator(collection.getItemValue(item1), collection.getItemValue(item2));
    });

    for (var i = 0; i < items.length; i = i + 1) {
        if (items[i] !== _items[i]) {
            changed = true;
            break;
        }
    }

    if (changed) {
        this.events.onReset();
    }
    return changed;
};

/**
 * @description Создает копию коллекции элементов
 * @returns {Collection} Новый экземпляр коллекции элементов, который является копией исходной коллекции
 */
Collection.prototype.clone = function () {
    return new this.constructor(this.toArray(), this._idProperty, this.comparator);
};


Collection.prototype.onAdd = function (handler) {
    this.events.on('add', handler);
};

Collection.prototype.onReplace = function (handler) {
    this.events.on('replace', handler);
};

Collection.prototype.onRemove = function (handler) {
    this.events.on('remove', handler);
};

Collection.prototype.onMove = function (handler) {
    this.events.on('move', handler);
};

Collection.prototype.onReset = function (handler) {
    this.events.on('reset', handler);
};

Collection.prototype.onChange = function (handler) {
    this.events.on('change', handler);
};

Collection.prototype.toString = function () {
    return this._items
        .map(function (item) {
            return JSON.stringify(this.getItemValue(item));
        }, this)
        .join(',');
};

/**
 * @protected
 * @param value
 * @returns {*}
 */
Collection.prototype.getValueId = function (value) {
    if (this.hasIdProperty && typeof  value !== 'undefined' && value !== null) {
        return value[this._idProperty]
    }
};

/**
 * @protected
 * @param value1
 * @param value2
 * @returns {boolean}
 */
Collection.prototype.isEqual = function (value1, value2) {
    var idProperty = this.idProperty;

    if (this.hasIdProperty) {
        if(isNotEmpty(value1, value2)) {
            return value1[idProperty] === value2[idProperty];
        } else {
            return false;
        }
    } else {
        return value1 === value2;
    }

    function isNotEmpty() {
        var values = Array.prototype.slice.call(arguments);
        return values.every(function (value) {
            return typeof value !== 'undefined' && value !== null;
        });
    }
};

/**
 * @protected
 * @param {*} value
 * @param {number} [index]
 * @returns {CollectionItem}
 */
Collection.prototype.createCollectionItem = function (value, index) {
    var item = Object.create(null);

    item.__value = value;
    item.__index = index;

    return item;
};

/**
 * @protected
 * @param item
 * @param value
 * @returns {*}
 */
Collection.prototype.updateCollectionItem = function (item, value) {
    item.__value = value;
    return item;
};

/**
 * @protected
 * @param {number} index
 * @return {*}
 */
Collection.prototype.getCollectionItemValue = function (index) {
    var item = this._items[index];

    return this.getItemValue(item);
};

Collection.prototype.getItemValue = function (item) {
    if (item) {
        return item.__value;
    }
};

/**
 * @typedef {Object} CollectionItem
 * @property {*} __value
 * @property {number} __index
 */

//####app/utils/collection/collectionEventManager.js
/**
 *
 * @constructor
 */
function CollectionEventManager () {

}

_.extend(CollectionEventManager.prototype, Backbone.Events);


/**
 *
 * @param {Array} newItems
 * @param {number} [newStartingIndex]
 * @returns {CollectionEventManager}
 */
CollectionEventManager.prototype.onAdd = function (newItems, newStartingIndex) {
    var params = {
        action: 'add',
        newItems: newItems,
        newStartingIndex: typeof newStartingIndex !== 'undefined' ? newStartingIndex : -1
    };

    this.trigger('add', params);
    this.trigger('change', params);

    return this;
};

/**
 *
 * @returns {CollectionEventManager}
 */
CollectionEventManager.prototype.onReset = function () {
    var params = {
        action: 'reset'
    };

    this.trigger('reset', params);
    this.trigger('change', params);
    return this;
};

/**
 *
 * @param {Array} oldItems
 * @param {Array} newItems
 * @returns {CollectionEventManager}
 */
CollectionEventManager.prototype.onReplace = function (oldItems, newItems) {
    var params = {
        action: 'replace',
        oldItems: oldItems,
        newItems: newItems
    };

    this.trigger('replace', params);
    this.trigger('change', params);
    return this;
};

/**
 *
 * @param {Array} oldItems
 * @param {number} [oldStartingIndex]
 * @returns {CollectionEventManager}
 */
CollectionEventManager.prototype.onRemove = function (oldItems, oldStartingIndex) {
    var params = {
        action: 'remove',
        oldItems: oldItems,
        oldStartingIndex: typeof oldStartingIndex !== 'undefined' ? oldStartingIndex : -1
    };

    this.trigger('remove', params);
    this.trigger('change', params);
    return this;
};

/**
 *
 * @param {Array} oldItems
 * @param {Array} newItems
 * @param {number} oldStartingIndex
 * @param {number} newStartingIndex
 * @returns {CollectionEventManager}
 */
CollectionEventManager.prototype.onMove = function (oldItems, newItems, oldStartingIndex, newStartingIndex) {
    var params = {
        oldItems: oldItems,
        newItems: newItems,
        oldStartingIndex: oldStartingIndex,
        newStartingIndex: newStartingIndex
    };

    this.trigger('move', params);
    this.trigger('change', params);
    return this;
};




//####app/utils/currentView.js
var OpenedViewCollection = function () {

    var list = [];

    this.appendView = function (metadata, viewMetadata, view) {

        list.push({
            metadata:metadata,
            viewMetadata: viewMetadata,
            view: view
        });
    };

    this.removeView = function (view) {
        for (var i = 0, ln = list.length; i < ln; i = i + 1) {
            if (view === list[i].view) {
                list.splice(i, 1);
                break;
            }
        }
    };

    this.getLastView = function () {
        if (list.length === 0) {
            return;
        }

        return list[list.length - 1];
    };

    this.getList = function () {
        return list;
    }

};

window.InfinniUI.views = new OpenedViewCollection();


//####app/utils/date.js
window.InfinniUI.DateUtils = (function () {

    var padInt = function (value, size) {
        var str = '' + value;
        var pad = '';
        if (str.length < size) {
            pad = Array(size - str.length + 1).join('0');
        }
        return pad + str;
    };

    /**
     * @description Возвращает строковое представление даты в формате YYYY-MM-DDTHH:mm:ss.sss+HH:MM
     * @param {Date} date
     * @param {Object} options
     * @param {boolean} [options.resetTime = false]
     * @returns {string}
     */
    var toISO8601 = function (date, options) {

        var config = options || {};

        if (typeof date === 'undefined' || date === null) {
            return null;
        }

        if (date.constructor !== Date) {
            return null;
        }

        if (config.resetTime) {
            date.setHours(0, 0, 0, 0);
        }
        var datePart = [
            padInt(date.getFullYear(), 4),
            padInt(date.getMonth() + 1, 2),
            padInt(date.getDate(), 2)
        ].join('-');

        var timePart = [
            padInt(date.getHours(), 2),
            padInt(date.getMinutes(), 2),
            padInt(date.getSeconds(), 2)
        ].join(':');
        
        var sssPart = padInt(date.getMilliseconds(), 3) + '0';// '000' + '0'

        if(!Math.sign) { //fix for devices not support ES6
            Math.sign = function (x) {
                return x?x<0?-1:1:0;
            };
        }

        var tz = Math.abs(date.getTimezoneOffset());
        var tzOffsetPart = Math.sign(date.getTimezoneOffset()) > 0 ? '-' : '+';
        var tzPart = [
            padInt(Math.floor(tz / 60), 2),
            padInt(tz % 60, 2)
        ].join(':');

        return datePart + 'T' + timePart + '.' + sssPart + tzOffsetPart + tzPart;
    };

    return {
        toISO8601: toISO8601
    };
})();
//####app/utils/dot.js
/**
 * Синглтон для работы с путями построенными по dot-notation
 **/

window.InfinniUI.ObjectUtils = (function () {

    /**
     * Возвращает значение свойства.
     *
     * @private
     * @param {*} target Исходный объект.
     * @param {array} propertyPathTerms Путь к свойству объекта в виде коллекции термов.
     * @returns {*} Значение свойства.
     */
    function getPropertyByPath(target, propertyPathTerms) {
        if (target !== null && target !== undefined
            && propertyPathTerms !== null && propertyPathTerms !== undefined) {

            var parent = target;
            var length = propertyPathTerms.length;

            for (var i = 0; i < length; ++i) {
                if (parent !== null && parent !== undefined) {
                    var term = propertyPathTerms[i];

                    var termCollectionIndex = parseCollectionIndex(term);

                    if (termCollectionIndex >= 0) {
                        parent = getCollectionItem(parent, termCollectionIndex);
                    }
                    else {
                        parent = getObjectProperty(parent, term);
                    }
                }
                else {
                    return null;
                }
            }

            return parent;
        }

        return target;
    }

    /**
     * Возвращает значение свойства.
     *
     * @private
     * @param {*} target Исходный объект.
     * @param {array} propertyPathTerms Путь к свойству объекта в виде коллекции термов.
     * @param {*} propertyValue Значение свойства объекта.
     * @returns {*} Значение свойства.
     */
    function setPropertyByPath(target, propertyPathTerms, propertyValue) {
        var parent = target;
        var length = propertyPathTerms.length - 1;

        var term = propertyPathTerms[0];
        var termCollectionIndex = parseCollectionIndex(term);

        for (var i = 0; i < length; ++i) {
            var termValue = (termCollectionIndex >= 0)
                ? getCollectionItem(parent, termCollectionIndex)
                : getObjectProperty(parent, term);

            var nextTerm = propertyPathTerms[i + 1];
            var nextTermCollectionIndex = parseCollectionIndex(nextTerm);

            if (termValue === null || termValue === undefined) {
                if (nextTermCollectionIndex >= 0) {
                    termValue = [ ];
                }
                else {
                    termValue = { };
                }

                if (termCollectionIndex >= 0) {
                    setCollectionItem(parent, termCollectionIndex, termValue);
                }
                else {
                    setObjectProperty(parent, term, termValue);
                }
            }

            parent = termValue;
            term = nextTerm;
            termCollectionIndex = nextTermCollectionIndex;
        }

        if (termCollectionIndex >= 0) {
            setCollectionItem(parent, termCollectionIndex, propertyValue);
        }
        else {
            setObjectProperty(parent, term, propertyValue);
        }
    }


    /**
     * Разбивает путь к свойству, записанному в dot-notation, на термы.
     *
     * @private
     * @param {string} propertyPath Имя свойства.
     */
    function splitPropertyPath(propertyPath) {
        if (_.isEmpty(propertyPath)) {
            return null;
        }

        return propertyPath.split(".");
    }

    /**
     * Пытается интерпретировать имя свойства, как индекс элемента коллекции.
     *
     * @private
     * @param {string} propertyName Имя свойства.
     * @returns {number} Индекс элемента коллекции или -1.
     */
    function parseCollectionIndex(propertyName) {
        var index = -1;

        if (propertyName === "$") {
            index = 0;
        }
        else {
            var tryParse = parseInt(propertyName);

            if (!isNaN(tryParse)) {
                index = tryParse;
            }
        }

        return index;
    }


    /**
     * Возвращает элемент коллекции.
     *
     * @private
     * @param {array} target Исходная коллекция.
     * @param {number} index Индекс элемента.
     * @returns {*} Элемент коллекции.
     */
    function getCollectionItem(target, index) {
        if (target !== null && target !== undefined
            && Object.prototype.toString.call(target) === "[object Array]"
            && index >= 0 && index < target.length) {

            return target[index];
        }

        return null;
    }

    /**
     * Устанавливает элемент коллекции.
     *
     * @private
     * @param {array} target Исходная коллекция.
     * @param {number} index Индекс элемента.
     * @param {*} item Элемент коллекции.
     */
    function setCollectionItem(target, index, item) {
        if (target !== null && target !== undefined
            && Object.prototype.toString.call(target) === "[object Array]"
            && index >= 0 && index < target.length) {

            target[index] = item;
        }
    }


    /**
     * Возвращает значение свойства объекта.
     *
     * @private
     * @param {object} target Исходный объект.
     * @param {string} propertyName Наименование свойства.
     * @returns {*} Значение свойства.
     */
    function getObjectProperty(target, propertyName) {
        if (target !== null && target !== undefined
            && Object.prototype.toString.call(target) === "[object Object]"
            && propertyName !== null && propertyName !== undefined) {

            return target[propertyName];
        }

        return null;
    }

    /**
     * Устанавливает значение свойства объекта.
     *
     * @private
     * @param {object} target Исходный объект.
     * @param {string} propertyName Наименование свойства.
     * @param {*} propertyValue Значение свойства.
     */
    function setObjectProperty(target, propertyName, propertyValue) {
        if (target !== null && target !== undefined
            && Object.prototype.toString.call(target) === "[object Object]"
            && propertyName !== null && propertyName !== undefined) {

            target[propertyName] = propertyValue;
        }
    }

    return {

        /**
         * Возвращает значение свойства.
         *
         * @public
         * @param {*} target Исходный объект.
         * @param {string|Object} propertyPath Путь к свойству или объект для построения значения.
         * @returns {*} Значение свойства.
         */
        getPropertyValue: function (target, propertyPath) {
            var result;

            var getPropertyValue = function (target, propertyPath) {
                var propertyPathTerms = splitPropertyPath(propertyPath);
                var result = getPropertyByPath(target, propertyPathTerms);
                return typeof result === 'undefined' ? null : result;
            };

            if (_.isObject(propertyPath)) {
                result = {};
                _.each(propertyPath, function (v, n) {
                    result[n] = getPropertyValue(target, v);
                });
            } else {
                result = getPropertyValue(target, propertyPath);
            }
            return result;
        },

        /**
         * Устанавливает значение свойства.
         *
         * @public
         * @param {*} target Исходный объект.
         * @param {string} propertyPath Путь к свойству.
         * @param {*} propertyValue Значение свойства.
         */
        setPropertyValue: function (target, propertyPath, propertyValue) {
            if (target !== null && target !== undefined && !_.isEmpty(propertyPath)) {
                var propertyPathTerms = splitPropertyPath(propertyPath);

                if(propertyValue instanceof Date){
                    setPropertyByPath(target, propertyPathTerms, new Date(propertyValue));
                }else{
                    setPropertyByPath(target, propertyPathTerms, _.clone(propertyValue));
                }
            }
        },

        setPropertyValueDirect: function (target, propertyPath, propertyValue) {
            if (target !== null && target !== undefined && !_.isEmpty(propertyPath)) {
                var propertyPathTerms = splitPropertyPath(propertyPath);
                setPropertyByPath(target, propertyPathTerms, propertyValue);
            }
        }
    };
})();



//####app/utils/estimate.js
/**
 * @description Выводит в консоль информацию о времени выполнения функции
 * Напр. var someFunc = function () {// .... //}.estimate('someFunc');
 */
Function.prototype.estimate = function (name) {
    var func = this;

    return function () {
        var args  = Array.prototype.slice.call(arguments);
        var error = new Error("Stack trace");
        var start = Date.now();
        var result = func.apply(this, args);
        var end = Date.now();

        showInfo();
        return result;

        function showInfo() {
            console.groupCollapsed('%s: %s ms', name, (end - start).toLocaleString());
            console.log(Date(start));
            console.groupCollapsed('arguments');
            console.log(args);
            console.groupEnd();
            console.groupCollapsed('Stack trace');
            console.log(error.stack);
            console.groupEnd();
            console.groupEnd();
        }
    }
};
//####app/utils/fileSize.js
window.InfinniUI = window.InfinniUI || {};
window.InfinniUI.format = window.InfinniUI.format || {};

window.InfinniUI.format.humanFileSize = function (size) {
    /**
     * @see {@link http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable}
     */
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};
//####app/utils/hashMap.js
/**
 * @description Простая реализация хеша у которого в качестве ключей м.б. объект
 * @constructor
 */
function HashMap() {
    this._keys = [];
    this._values = [];
}

Object.defineProperties(HashMap.prototype, {
    length: {
        get: function () {
            return this._keys.length;
        }
    }
});

HashMap.prototype.add = function (key, value) {
    var i = this._getIndexOfKey(key);

    if (i === -1) {
        this._keys.push(key);
        this._values.push(value);
    } else {
        this._values[i] = value;
    }
};

HashMap.prototype.get = function (key) {
    var value,
        i = this._getIndexOfKey(key);

    if (i !== -1) {
        value = this._values[i];
    }

    return value;
};

HashMap.prototype.forEach = function (callback, thisArg) {
    this._keys.forEach(function (key, index) {
        callback.call(thisArg, this._values[index], key, index);
    }, this);
};

HashMap.prototype.clear = function (callback) {
    if (typeof callback === 'function') {
        this.forEach(callback);
    }
    this._keys.length = 0;
    this._values.length = 0;
};

/**
 * @param key
 * @returns {number}
 * @private
 */
HashMap.prototype._getIndexOfKey = function (key) {
    return this._keys.indexOf(key);
};
//####app/utils/heightAdaptation.js
function adaptRowsHeightModel(availableH, rowHeightList){
    var summ = 0,
        maxI = 0,
        diff, newH;

    for(var i = 0, ii = rowHeightList.length; i < ii; i++){
        summ += rowHeightList[i];
        if(rowHeightList[i] > rowHeightList[maxI]){
            maxI = i;
        }
    }

    if(summ <= availableH){
        return rowHeightList;
    }

    if(summ > availableH){
        if(rowHeightList[maxI] < availableH/2.0){
            return rowHeightList;
        }

        diff = summ - availableH;
        newH = rowHeightList[maxI] - diff;
        if(newH < 100){
            newH = 100;
        }
        rowHeightList[maxI] = newH;
        return rowHeightList;
    }
}

function adaptHeightInsideElement($el){
    console.info('call adaptHeightInsideElement');
    return;
    var $panels = $el.find('.pl-stack-panel:not(.horizontal-orientation), .pl-scroll-panel, .modal-scrollable').filter(':visible'),
        $modals = $el.find('.modal-scrollable');

    if($modals.length){
        setTimeout(function(){
            adaptAction($panels);
        }, 850);
    }else{
        adaptAction($panels);
    }
}

function adaptAction($panels){
    for(var i = 0, ii = $panels.length; i < ii; i++){
        if($panels.eq(i).hasClass('pl-stack-panel')){
            adaptStackPanelHeight($panels.eq(i));
        }

        if($panels.eq(i).hasClass('pl-scroll-panel')){
            adaptScrollPanelHeight($panels.eq(i));
        }

        if($panels.eq(i).hasClass('modal-scrollable')){
            adaptModalHeight($panels.eq(i));
        }
    }
}

function adaptStackPanelHeight($el){
    var $parent = $el.parent(),
        parentHeight = $parent.height() - siblingsHeight($el),
        $children = $el.children(),
        childrenHeight = $children.map(function(i, el){
            var $el = $(el),
                $child = $el.children().eq(0);
            $child.data('last-scroll', $child.scrollTop());
            $el.css('height', 'auto');
            return $el.height();
        }).get(),
        newchildrenHeight = adaptRowsHeightModel(parentHeight, childrenHeight);

    $children.each(function(i, el){
        var $el = $(el),
            $child = $el.children().eq(0);
        if($el.height() != newchildrenHeight[i]){
            $el.height(newchildrenHeight[i]);
            $child.scrollTop($child.data('last-scroll'));
        }
    });
}

function adaptScrollPanelHeight($el){

}

function adaptModalHeight($el){
    var wh = $(window).height(),
        $header = $el.find('.modal-header'),
        $body = $el.find('.modal-body'),
        headerH = $header.outerHeight(),
        avalableH = wh - headerH - 30;

    $body.css('max-height', avalableH + 'px');
}

function siblingsHeight($el){
    var result = 0,
        $siblings = $el.siblings(':visible');
    for( var i = 0, ii = $siblings.length; i < ii; i++ ){
        result += $siblings.eq(i).outerHeight(true);
    }
    return result;
}
//####app/utils/hiddenScreen.js
function hiddenScreen() {
    this.middleElement = $('<div></div>').css({
        'position': 'absolute',
        top: '-10000px'
    });
}
hiddenScreen.prototype = {
    add: function (element) {
        $('body').prepend(this.middleElement);
        this.middleElement.append(element);
    }
};
//####app/utils/inheritance.js
_.mixin({
    'inherit': function (child, parent) {
        var f = new Function();
        f.prototype = parent.prototype;

        child.prototype = new f();
        child.prototype.constructor = child;

        child.superclass = parent.prototype;
    },

    'superClass': function (obj, context, values) {
        var args = _.toArray(arguments);
        args.splice(0, 2);

        obj.superclass.constructor.apply(context, args);
    }
});
//####app/utils/isEqual.js
(function () {
    var isEqual = _.isEqual;
    _.isEqual = function(a, b) {
        if (typeof File !== 'undefined') {
            if (a instanceof File || b instanceof File) {
                return a === b;
            }
        }
        return isEqual(a, b);
    };

})();

//####app/utils/layoutManager.js
var layoutManager = {
    windowHeight: 0,
    clientHeight: 0,
    exchange: null,

    setOuterHeight: function ($el, height, fix) {
        var delta = 0;
        'border-top-width,border-bottom-width,padding-top,padding-bottom,margin-top,margin-bottom'
            .split(',')
            .forEach(function(name) {
                delta += parseInt($el.css(name));
            });
        var contentHeight = height - delta;
        if (fix) {
            contentHeight += fix;
        }

        //@TODO Разобраться с багом, при задании clearfix.height = 0 вылезает лишний 1 пиксел. Временное решение:
        //contentHeight = (contentHeight > 0) ? contentHeight - 1 : contentHeight;

        $el.height(contentHeight);

        return contentHeight;
    },

    getModalSelector: function () {
        return '.modal-scrollable';
    },

    getSelector: function () {
        //return '.pl-data-grid, .pl-scroll-panel, .pl-document-viewer, .pl-menu.vertical, .pl-tab-panel, .pl-treeview';
        return '.verticalAlignmentStretch:not(:hidden)';
    },

    resize: function (el, pageHeight) {
        var $el = $(el);
        var contentHeight = this.setOuterHeight($el, pageHeight);
        var elements = $el.find(this.getSelector());

        if (elements.length === 0) {
            return;
        }

        var $parent;
        var list = [];
        var $element;
        var element;

        //Строим дерево элементов: от концевых элементов поднимается к корневому элементу
        for (var i = 0, ln = elements.length; i < ln; i = i + 1) {
            element = elements[i];
            $element = $(element);
            do {
                $parent = $element.parent();

                var a = _.findWhere(list, {element: element});
                if (typeof a !== 'undefined') {
                    //Элемент уже занесен в список
                    break;
                }
                list.push({
                    element: element,
                    $element: $element,
                    parent: $parent.get(0),
                    $parent: $parent
                });

                $element = $parent;
                element = $parent.get(0);
            } while (element !== el);
        }

        var tree = (function f(items, parentEl, $parentEl) {
            var items = _.where(list, {parent: parentEl});

            return {
                isElement: _.indexOf(elements, parentEl) !== -1,
                element: parentEl,
                $element: $parentEl,
                child: _.map(items, function (item) {
                    return f(items, item.element, item.$element);
                })
            };
        })(list, el, $el);

        /**
         * Если внутри child один элемент:
         *   - устанавливаем высоту в 100%
         * Если внутри child несколько элементов
         *   - offsetTop совпадают - устанавливаем высоту в 100%
         *   - offsetTop не совпадают - устанавливаем высоту в (100 / child.length)%
         */

        var manager = this;
        (function h(node, height) {
            var children = node.$element.children(':not(:hidden):not(.modal-scrollable):not(.modal-backdrop)');
            /**
             * @TODO Возможно правильнее исключать из обсчета все элементы с абсолютным позиционированием
             */
            var originalHeight;
            var fixedHeight = 0;
            var setHeight = function (node, height) {
                originalHeight = node.$element.attr('data-height-original');
                if (originalHeight === '') {
                    node.$element.attr('data-height-original', node.element.style.height);
                }
                return manager.setOuterHeight(node.$element, height);
            };

            if(node.$element.parentsUntil('.modal').length) {
                node.$element.attr('data-height-original', node.element.style.height);
            }
            var nodeHeight = setHeight(node, height);
            if (node.$element.hasClass('pl-scroll-panel') || node.$element.hasClass('modal-scrollable')) {
                //Т.к. скроллпанель бесконечная по высоте, контролы внутри нее по высоте не растягиваем
                return;
            }


            if (node.$element.hasClass('tab-content')) {
                _.each(node.child, function (node) {
                    h(node, nodeHeight);
                });
            } else if (node.child.length > 0) {

                var grid = _.chain(children)
                    .filter(function (el) {
                        var position = $(el).css('position');
                        return ['absolute', 'fixed'].indexOf(position) === -1;
                    })
                    .groupBy('offsetTop')
                    .value();

                var heights = [];

                _.each(grid, function (row, i) {
                    var nodes = [];
                    _.each(row, function (e) {
                        var n = _.find(node.child, function (c) {return c.element === e;});
                        if (n) nodes.push(n);
                    });

                    heights.push(nodes.length ? 0 : _.reduce(row, function (height, e) {
                        return Math.max(height, $(e).outerHeight(true));
                    }, 0));

                    grid[i] = nodes;
                }, this);

                fixedHeight = _.reduce(heights, function (total, height) {return total + height}, 0);
                var count = _.reduce(grid, function (count, row) {return row.length ? count + 1 : count}, 0);

                var heightForNode = Math.floor((nodeHeight - fixedHeight) / count);

                _.each(grid, function (row) {
                    if (row.length === 0) return;
                    _.each(row, function (node) {
                        h(node, heightForNode);
                    }, this);
                }, this);

            }
        })(tree, pageHeight);

    },

    resizeView: function (container, clientHeight) {
        var $page = $('#page-content', container);
        //$page.height(clientHeight);
        var contentHeight = this.setOuterHeight($page, clientHeight);
        var that = this;

        this.resize($page.get(0), contentHeight);

        //$page.children().each(function (i, el) {
        //    if (el.style.display !== 'none') {
        //        //Обработка активной вкладки
        //        var $tab = $(el);
        //
        //        var $bar = $(".pl-active-bar:not(:hidden)", $tab);
        //
        //        var barHeight = $bar.length ? $bar.outerHeight(true) : 0;
        //        //var barHeight = $(".pl-active-bar", $tab).outerHeight(true);
        //        $tab.children().each(function (i, el) {
        //            if (false === el.classList.contains('pl-active-bar') && el.style.display !== 'none') {
        //                var pageHeight = contentHeight - barHeight;
        //                that.resize(el, pageHeight);
        //            }
        //        });
        //    }
        //});
    },

    resizeDialog: function () {
        var manager = this;
        $(this.getModalSelector()).each(function (i, el) {
            manager._resizeDialog($(el));
            manager.resetDialogHeight($(el));
        });
    },

    resetDialogHeight: function($modal){
        var space = 10;

        if($modal.children()) {
            var $container = $modal.children();

            var $header = $('.modal-header', $container);
            var $body = $('.modal-body', $container);

            var $el = $(this.getSelector(), $modal);

            $el.parentsUntil('.modal').css('height', 'auto');

            $modal.children('.modal:not(.messagebox)').height($body.outerHeight(true) + $header.outerHeight(true));

        }

        //var $header = $('.modal-header', $container);
        //var $body = $('.modal-body', $container);

        //var headerHeight = $header.outerHeight(true);
        //
        //$container.css('margin-top', 0);
        //
        //var el = $(this.getSelector(), $modal);
        //if (el.length === 0) {
        //    //Если диалог не содержит элементы которые должны растягиваться по вертикали на 100%
        //    //Выравниваем по вертикали в центр
        //    $container.css('top', (this.windowHeight - headerHeight - $body.outerHeight(true)) / 2);
        //    return;
        //}
        //
        //$body.css('min-height', '0');
        //var containerHeight = this.setOuterHeight($modal, 'auto');
        //
        ////Высота для содержимого окна диалога
        //var clientHeight = this.setOuterHeight($container, containerHeight) - $header.outerHeight();
        //
        //this.resize($body[0], clientHeight);
        //$container.css('top', (this.windowHeight - headerHeight - clientHeight) / 2);
    },

    _resizeDialog: function ($modal) {
        var space = 10;//Высота отступа от вертикальных границ диалога до границ экрана

        var $container = $modal.children();

        $container.css('margin-top', 0);
        //var marginTop = parseInt($container.css('margin-top'), 10);

        var $header = $('.modal-header', $container);
        var $body = $('.modal-body', $container);

        var headerHeight = $header.outerHeight(true);
        $body.css('max-height', this.windowHeight - headerHeight);

        $container.css('margin-top', 0);

        var el = $(this.getSelector(), $modal);
        if (el.length === 0) {
            //Если диалог не содержит элементы которые должны растягиваться по вертикали на 100%
            //Выравниваем по вертикали в центр
            $container.css('top', (this.windowHeight - headerHeight - $body.outerHeight(true)) / 2);
            return;
        }

        $body.css('min-height', (this.windowHeight - $header.outerHeight(true) - space * 2) / 2);
        var containerHeight = this.setOuterHeight($modal, this.windowHeight - space * 2);

        //Высота для содержимого окна диалога
        var clientHeight = this.setOuterHeight($container, containerHeight) - $header.outerHeight();

        this.resize($body[0], clientHeight);
        $container.css('top', (this.windowHeight - headerHeight - clientHeight) / 2);
    },

    init: function (container) {
        container = container || document;
        this.windowHeight = $(window).height();
        this.onChangeLayout(container);
        if (this.exchange === null) {
            this.exchange = window.InfinniUI.global.messageBus;
            this.exchange.subscribe('OnChangeLayout', _.debounce(this.onChangeLayout.bind(this), 42));
        }


        /*var exchange = messageBus.getExchange('modal-dialog');
        exchange.subscribe(messageTypes.onLoading, function () {
            this.resizeDialog();
        }.bind(this));*/
    },

    onChangeLayout: function (container) {
        if (_.isEmpty(container)) {
            container = document;
        }

        var clientHeight = this.windowHeight
            - $("#page-top:not(:hidden)", container).outerHeight()
            - $("#page-bottom:not(:hidden)", container).outerHeight()
            - $("#menu-area:not(:hidden)", container).outerHeight();
        this.resizeView(container, clientHeight);
        this.resizeDialog();
    }
};

//####app/utils/localStorageData.js
var LocalStorageData = function () {
    this.namePrefix = 'InfinniUI.';
};

LocalStorageData.prototype.getKeyName = function (name) {
    return [this.namePrefix, name].join('');
};

LocalStorageData.prototype.getData = function (name, defaultValue) {
    var value = window.localStorage.getItem(this.getKeyName(name));

    if (typeof value === 'undefined') {
        value = defaultValue;
    }

    return value;
};

LocalStorageData.prototype.setData = function (name, value) {
    window.localStorage.setItem(this.getKeyName(name), value);
};

LocalStorageData.prototype.clear = function () {
    window.localStorage.clear();
};
//####app/utils/logger.js
var LOG_LEVEL = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    trace: 5
}

function Logger(level){
    this.messages = [];
    this.setLevel(level || LOG_LEVEL.debug);


    this.showMessages = true;
};

_.extend(Logger.prototype, {
    getLevel: function(){
        return this.level;
    },

    setLevel: function(level){
        this.level = level;
    },

    addMessage: function(messageType, message){
        this.messages.push({
            type: messageType,
            message: message
        });
    },

    debug: function(message){
        if(this.level > LOG_LEVEL.debug){
            return;
        }

        if(this.showMessages){
            console.debug(message.message || message);
        }

        this.addMessage(LOG_LEVEL.debug, message);
    },

    info: function(message){
        if(this.level > LOG_LEVEL.info){
            return;
        }

        if(this.showMessages){
            console.info(message.message || message);
        }

        this.addMessage(LOG_LEVEL.info, message);
    },

    warn: function(message){
        if(this.level > LOG_LEVEL.warn){
            return;
        }

        if(this.showMessages){
            console.warn(message.message || message);
        }

        this.addMessage(LOG_LEVEL.warn, message);
    },

    error: function(message){
        if(this.level > LOG_LEVEL.error){
            return;
        }

        if(this.showMessages){
            console.error(message.message || message);
        }

        this.addMessage(LOG_LEVEL.error, message);
    },

    trace: function(message){
        if(this.level > LOG_LEVEL.trace){
            return;
        }

        if(this.showMessages){
            console.error(message.message || message);
        }

        this.addMessage(LOG_LEVEL.trace, message);
    }
})

window.InfinniUI.global.logger = new Logger();
//####app/utils/messageBox.js
var MessageBox = Backbone.View.extend({
    tagName: 'div',

    className: 'modal hide fade messagebox',

    events: {
        'click .btn': 'btnHandler'
    },

    template: _.template(
            ' <div class="modal-dialog">' +
            '  <div class="modal-content">' +
            '   <div class="modal-body">' +
            '       <p>' +
            '           <i class="fa-lg fa fa-warning" style="color: <%= color %>"></i>' +
            '           <%= text %>' +
            '       </p>' +
            '   </div>' +
            '   <div class="modal-footer">' +
            '       <% _.each( buttons, function(button, i){ %>' +
            '           <% if (i==0){%> <a href="javascript:;" tabindex="0" class="btn firstfocuselementinmodal <%= button.classes %> <%= button.type %>-modal" data-index="<%= i %>"><%= button.name %></a>' +
            '           <% }else{ %> <a href="javascript:;" class="btn <%= button.classes %> <%= button.type %>-modal" data-index="<%= i %>"><%= button.name %></a>'+
            '       <% }}); %>' +
            '   </div>' +
            '  </div>' +
            ' </div>'
    ),

    initialize: function (options) {
        this.options = options;

        this.addButtonClasses();
        this.addColor();

        this.render();

        this.$el
            .modal({show: true})
            .removeClass('hide')
            .css({
                top: '25%'
            });
    },

    render: function () {
        var $parent = this.options.$parent || $('body');

        this.$el
            .html($(this.template(this.options)));


        //FOCUS IN MODAL WITHOUT FALL

        var self = this;
        var $container = this.$el.find('.modal-footer');

        this.$el.on('shown.bs.modal', function (e) {
            $(e.target).find('.firstfocuselementinmodal').focus();
        });

        $container.append('<div class="lastfocuselementinmodal" tabindex="0">');
        this.$el.find('.lastfocuselementinmodal').on('focusin', function(){
            self.$el.find('.firstfocuselementinmodal').focus();
        });
        this.$el.on('keydown', function(e){
            if($(document.activeElement).hasClass('lastfocuselementinmodal') && (e.which || e.keyCode) == 9){
                e.preventDefault();
                self.$el.find('.firstfocuselementinmodal').focus();
            }

            if($(document.activeElement).hasClass('firstfocuselementinmodal') && (e.which || e.keyCode) == 9 && e.shiftKey){
                e.preventDefault();
                self.$el.find('.lastfocuselementinmodal').focus();
            }
        });
        //

        $parent
            .append(this.$el);

        return this;
    },

    addColor: function(){
        if(this.options.type){
            if(this.options.type == 'error'){
                this.options.color = '#E74C3C;';
            }
            if(this.options.type == 'warning'){
                this.options.color = '#F1C40F;';
            }
        }else{
            this.options.color = '#2ECC71;';
        }
    },

    addButtonClasses: function(){

        var button;

        for(var k in this.options.buttons){
            button = this.options.buttons[k];

            if(button.type){
                if(button.type == 'action'){
                    button.classes = 'blue';
                }
            }else{
                button.classes = 'default';
            }
        }

    },

    btnHandler: function (e) {
        var $el = $(e.target),
            i = parseInt( $el.data('index') ),
            handler = this.options.buttons[i].onClick;

        if(handler){
            handler.apply(this);
        }

        this.closeAndRemove();
    },

    closeAndRemove: function () {
        if (this.options.onClose) {
            this.options.onClose();
        }

        this.$el.modal('hide');
    }
});

/*new MessageBox({
    type: 'error',
    text:'asdasd',
    buttons:[
        {
            name:'Ok',
            onClick: function(){
                alert('ckicked');
            }
        },
        {
            name:'Error btn',
            type: 'action',
            onClick: function(){
                alert('error ckicked');
            }
        }
    ]
});*/
//####app/utils/metadata.js
InfinniUI.Metadata = InfinniUI.Metadata || {};

InfinniUI.Metadata.isValidValue = function (value, metadata) {
    var result = false;
    for (var i in metadata) {
        if (metadata[i] === value) {
            result = true;
            break;
        }
    }

    return result;
};
//####app/utils/numeric.js
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};
//####app/utils/state.js
var ApplicationState = function (storage) {
    var defaultMenu = 'MainMenu';

    this.getMenuName = function () {
        return storage.getData('MenuName', defaultMenu);
    };

    this.setMenuName = function (value) {
        storage.setData('MenuName', value);
    };

    this.getConfigId = function () {
        return storage.getData('ConfigId');
    };

    this.setConfigId = function (value) {
        storage.setData('ConfigId', value);
    };

    this.clear = function () {
        storage.clear();
    }

};

window.InfinniUI.State = new ApplicationState(new LocalStorageData());


//####app/utils/stringUtils.js
var stringUtils = {
    format: function(value,args){
        return value.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    },

    formatProperty: function(property, indexes){
        if(!indexes || indexes.length == 0){
            return property;
        }

        var i = 0;
        return property.replace(/\#/g, function(){
            i++;
            return indexes[i-1];
        });
    },

    padLeft: function a (value, len, char) {
        if (typeof char == 'undefined' || char === null) {
            char = ' ';
        }

        var str = String(value);

        if (str.length < len) {
            return new Array(len - str.length + 1).join(char) + str;
        }
        return str;
    }
};

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//####app/utils/testMode.js
(function (window, document, $) {
    'use strict';

    var DATA_NAME_ATTRIBUTE = 'data-pl-name';
    var DATA_NAME_VIEW_ATTRIBUTE = 'data-pl-name-view';
    var NO_NAME = 'No name';
    var DATA_NAME_SELECTOR = '[' + DATA_NAME_ATTRIBUTE + ']:first';
    var DATA_NAME_VIEW_SELECTOR = '[' + DATA_NAME_VIEW_ATTRIBUTE + ']:first';

    var location = window.location;
    if (location.hash !== '#test') {
        return;
    }

    $(function () {

        patchBootstrapTooltip();
        var info = new InfoElement();

        $(document).on('mouseover', function (event) {
            info.setElement(event.target);
        });

        function patchBootstrapTooltip() {
            $.fn.tooltip.Constructor.prototype.getTitle = function () {
                var $e = this.$element;
                var o = this.options;

                return o.title;
            }
        }
    });


    /*************************************/

    function ClickManager() {
        this._unsubscribe = [];
    }

    ClickManager.prototype.append = function (element, handler) {
        var EVENT_NAME = 'contextmenu';
        this.clear();

        if (typeof element === 'undefined' || element === null) {
            return;
        }
        element.addEventListener(EVENT_NAME, handler, true);
        this._unsubscribe.push(function () {
            element.removeEventListener(EVENT_NAME, handler, true);
        });
        return this;
    };

    ClickManager.prototype.clear = function () {
        this._unsubscribe.forEach(function (fn) {
            fn.call();
        });
        return this;
    };

    function InfoElement() {
        this.marker = new Marker();
        this.$currentControl = null;
        this.clickManager = new ClickManager();
    }

    InfoElement.prototype.setElement = function (el) {
        var
            $el = $(el),
            $control = getControl($el),
            name = getName($control),
            viewName = getViewName($control);

        this.hideInfo();
        if ($control) {
            this.showInfo($control, viewName, _.isEmpty(name) ? NO_NAME : name);
        }

        function getControl($el) {
            var $control;

            var name = $el.attr(DATA_NAME_ATTRIBUTE);
            if (typeof name !== 'undefined') {
                $control = $el;
            } else {
                $control = $el.parents(DATA_NAME_SELECTOR);
            }
            return $control;
        }

        function getName($el) {
            if ($el.length) {
                return $el.attr(DATA_NAME_ATTRIBUTE);
            }
        }

        function getViewName($el) {
            var $e = $el.parents(DATA_NAME_VIEW_SELECTOR);
            if ($e.length) {
                return $e.attr(DATA_NAME_VIEW_ATTRIBUTE);
            }
        }
    };

    InfoElement.prototype.copyInfo = function (viewName, name) {
        if (viewName || name) {
            window.prompt("Copy to clipboard: Ctrl+C", viewName + ':' + name);
        }
    };

    InfoElement.prototype.showInfo = function ($control, viewName, name) {
        if (this.$currentControl && this.$currentControl[0] !== $control[0]) {
            this.marker.reset(this.$currentControl);
            this.clickManager.clear();
        }
        this.marker.highlight($control);
        this.$currentControl = $control;
        this.clickManager.append($control[0], this.copyInfo.bind(this, viewName, name));

        $control.tooltip({
                title: viewName + ':' + name,
                placement: "auto"
            })
            .tooltip('show');
    };

    InfoElement.prototype.hideInfo = function () {
        this.clickManager.clear();
        if (this.$currentControl) {
            this.marker
                .reset(this.$currentControl);
            this.$currentControl.tooltip('destroy');
        }
    };


    /********************************************/

    function Marker() {
        this.DATA_NAME = 'data-pl-original-style';

        this.css = {
            'box-shadow': 'inset 0 0 1em #ff0000'
        };
    }

    Marker.prototype.highlight = function ($el) {
        var data;

        if ($el) {
            data = $el.data(this.DATA_NAME);
            if (!data) {
                data = Object.create(null);
                for (var i in this.css) {
                    data[i] = $el.css(i);
                }
                $el.data(this.DATA_NAME, data);
            }
            $el.css(this.css);
        }
        return this;
    };

    Marker.prototype.reset = function ($el) {
        var data;
        if ($el) {
            data = $el.data(this.DATA_NAME);
            $el.data(this.DATA_NAME, null);
            if (data) {
                $el.css(data);
            }
        }
        return this;
    };


})(window, document, jQuery);


//####app/utils/urlManager.js
var urlManager = {
    getParams: function(){
        var getPath = location.search,
            result = {},
            params, tmpParam;

        if(getPath.length == 0){
            return result;
        }

        getPath = getPath.substr(1);
        params = getPath.split('&');

        for(var i= 0, ii = params.length; i<ii; i++) {
            tmpParam = params[i].split("=");
            result[tmpParam[0]] = tmpParam[1];
        }

        return result;
    },

    clearUrlSearchPath: function(){
        var searchPath = location.search,
            index, newUrl;

        if(searchPath.length > 0){
            index = location.href.indexOf(searchPath);
            if(index > 0){
                newUrl = location.href.substr(0, index);
            }
        }

        if(newUrl){
            history.pushState(null, null, newUrl);
        }

    },

    setParameter: function(name, value){
        var oldSearch = location.search;
        var newSearch = _.isEmpty(oldSearch) ?
            stringUtils.format("?{0}={1}", [name, value]) :
            stringUtils.format("{0}&{1}={2}", [oldSearch, name, value]);

        var newUrl = stringUtils.format("{0}//{1}{2}{3}{4}",[location.protocol, location.host, location.pathname, newSearch, location.hash]);

        history.pushState(null, null, newUrl);
    },

    deleteParameter: function(name){
        var params = urlManager.getParams();
        delete params[name];

        var newSearch = generateSearch(params);

        var newUrl = stringUtils.format("{0}//{1}{2}{3}{4}",[location.protocol, location.host, location.pathname, newSearch, location.hash]);
        history.pushState(null, null, newUrl);

        function generateSearch(params){
            var paramsArray = [];
            _.mapObject(params, function(val, key){
                var param = stringUtils.format("{0}={1}",[key, val]);
                paramsArray.push( param );
            });

            return _.isEmpty(paramsArray) ?
                "" :
            "?" + paramsArray.join("&");
        };
    }
};
//####app/utils/valueProperty.js
/**
 * @description Работа с ValueProperty @see {@link http://demo.infinnity.ru:8081/display/MC/BaseListElement|BaseListElement}
 */
window.InfinniUI.ValueProperty = (function () {

    function getPropertyValue(item, valueProperty) {
        return InfinniUI.ObjectUtils.getPropertyValue(item, valueProperty);
    }

    var getValue = function (item, valueProperty) {
        var value;

        if (_.isEmpty(valueProperty)) {
            value = item;
        } else if (_.isObject(valueProperty)) {
            value = {};
            for (var i in valueProperty) {
                if (!valueProperty.hasOwnProperty(i)) {
                    continue;
                }
                value[i] = getPropertyValue(item, valueProperty[i]);
            }
        } else {
            value = getPropertyValue(item, valueProperty);
        }

        return value;
    };

    return {
        getValue: getValue
    }
})();
//####app/messaging/messageBus.js
function MessageBus(view) {
    var subscriptions = {};

    this.send = function (messageType, messageBody) {
        messageType = patchMessageType(messageType);
        if (subscriptions[messageType]) {
            var context;
            if (view && view.getContext) {
                context = view.getContext();
            }
            _.each(subscriptions[messageType], function (handler) {
                handler(context, { value: messageBody });
            });
        }
    };

    this.subscribe = function (messageType, messageHandler) {
        messageType = patchMessageType(messageType);
        if (!subscriptions[messageType]) {
            subscriptions[messageType] = [];
        }
        
        subscriptions[messageType].push(messageHandler);
    };

    this.unsubscribeByType = function (messageType) {
        messageType = patchMessageType(messageType);
        if (subscriptions[messageType]) {
            delete subscriptions[messageType];
        }
    };

    this.getView = function () {
        return view;
    };

    function patchMessageType(messageType) {

        if (typeof messageType === 'object' && typeof messageType.name !== 'undefined') {
            messageType = messageType.name;
        }

        return messageType;
    }
}

window.InfinniUI.global.messageBus = new MessageBus();
//####app/messaging/messageTypes.js
window.messageTypes = {
    onViewOpened: { name: 'onViewOpened' },
    onViewClosed: { name: 'onViewClosed' },
    onViewClosing: {name: 'onViewClosing'},
    onViewTextChange: {name: 'onViewTextChange'},

    onLoaded: { name: 'onLoaded' },
    onLoading: { name: 'onLoading' },   //Вызывается, когда выполнен рендеринг формы
    onSetSelectedItem: { name: 'onSetSelectedItem' },
    onSetTextFilter: { name: 'onSetTextFilter' },
    onSetPropertyFilters: { name: 'onSetPropertyFilters' },
    onSetPageSize: { name: 'onSetPageSize' },
    onSetPageNumber: { name: 'onSetPageNumber' },

    onShowView: {name: 'onShowView'},
    onRequestSwitchView: {name: 'onRequestSwitchView'},

    onSelectedItemChanged: {name: 'onSelectedItemChanged'},

    onValidate: {name: 'onValidate'},

    onKeyDown: {name: 'onKeyDown'},

    onCreateLayoutPanel: {name: 'onCreateLayoutPanel'},
    onRemoveLayoutPanel: {name: 'onRemoveLayoutPanel'},
    onNotifyUser: {name: 'onNotifyUser'},
    onToolTip: {name: 'onToolTip'},
    onToolTipShow: {name: 'onToolTipShow'},
    onToolTipHide: {name: 'onToolTipHide'},
    onDataLoading: {name: 'onDataLoading'},
    onDataLoaded: {name: 'onDataLoaded'}

    //onOpenViewInContainer: {name: 'onOpenViewInContainer'}

};


//####app/controls/_base/_mixins/backgroundPropertyMixin.js
var backgroundPropertyMixin = {

    initBackground: function () {
        this.listenTo(this.model, 'change:background', this.updateBackground);
    },

    updateBackground: function () {
        if (!this.wasRendered) {
            return;
        }
        this.switchClass('background', this.model.get('background'));
    }

};


//####app/controls/_base/_mixins/baseTextControlMixin.js
var baseTextControlMixin = {

};


//####app/controls/_base/_mixins/bindUIElementsMixin.js
var bindUIElementsMixin = {
    /**
     * Сохраняет в поле ui элементы по селектору в UI
     *
     * UI: {"name1": "selector1", "name2": "selector2"}
     */
    bindUIElements: function () {
        this.ui = {};

        if (typeof this.UI === 'undefined') {
            return;
        }

        for (var i in this.UI) {
            if (!this.UI.hasOwnProperty(i)) continue;

            this.ui[i] = this.$(this.UI[i]);
        }
    }
};
//####app/controls/_base/_mixins/errorTextPropertyMixin.js
var errorTextPropertyMixin = {

    initErrorText: function () {
        this.listenTo(this.model, 'change:errorText', this.updateErrorText);
    },

    updateErrorText: function () {
        if (!this.wasRendered) {
            return;
        }
        var errorText = this.model.get('errorText');
        var validationState = 'success';
        var validationMessage = '';
        if (_.isEmpty(errorText) === false) {
            validationMessage = errorText;
            validationState = 'error';
        }

        this.model.set('validationState', validationState);
        this.model.set('validationMessage', validationMessage);
    }
};

//####app/controls/_base/_mixins/eventHandlerMixin.js
var eventHandlerMixin = {

    /**
     *
     * @param {String} name
     * @callback handler
     * @returns {boolean}
     */
    addEventHandler: function (name, handler) {

        this.initEventHandlerMixin();

        if (name === null || typeof name === 'undefined') {
            return false;
        }

        if (handler === null || typeof handler === 'undefined') {
            return false;
        }

        if (typeof this.eventHandlers[name] === 'undefined') {
            this.eventHandlers[name] = [];
        }

        var handlers = this.eventHandlers[name];

        if (handlers.indexOf(handler) === -1) {
            handlers.push(handler);
        }
    },

    /**
     * @description Вызывает обработчики указанного события.
     * Формат вызова callEventHandler(name, [data],[handler])
     * @param {string} name Название события
     * @param {Array} [data] Параметры, которые будут переданы в обработчик
     * @callback [callback] Функцию в которую будут переданы результат вызова каждого обработчика
     */
    callEventHandler: function (name) {
        if (typeof this.eventHandlers === 'undefined' || name === null || typeof name === 'undefined') {
            return;
        }
        var handlers = this.eventHandlers[name];

        if (typeof handlers === 'undefined') {
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);

        var params = args.pop();
        var callback;

        if (typeof params === 'function') {
            callback = params;
        }
        params = args.pop();

        _.each(handlers, function (handler) {
            var result = handler.apply(undefined, params);
            if (typeof callback !== 'undefined') {
                callback(result);
            }
        });
    },

    /**
     * @private
     */
    initEventHandlerMixin: function () {
        if (typeof this.eventHandlers === 'undefined') {
            this.eventHandlers = {};
        }
    }


};
//####app/controls/_base/_mixins/foregroundPropertyMixin.js
var foregroundPropertyMixin = {

    initForeground: function () {
        this.listenTo(this.model, 'change:foreground', this.updateForeground);
    },

    updateForeground: function () {
        if (!this.wasRendered) {
            return;
        }
        this.switchClass('foreground', this.model.get('foreground'));
    }

};


//####app/controls/_base/_mixins/hintTextPropertyMixin.js
var hintTextPropertyMixin = {

    initHintText: function () {
        this.listenTo(this.model, 'change:hintText', this.updateHintText);
    },

    updateHintText: function () {
        if (!this.wasRendered) {
            return;
        }

        var text = this.model.get('hintText');
        if (typeof text === 'undefined' || text === null) {
            text = '';
        }
        this.ui.hintText.text(text);
    }

};


//####app/controls/_base/_mixins/horizontalTextAlignmentPropertyMixin.js
//var horizontalTextAlignmentPropertyMixin = {
//
//    initHorizontalTextAlignment: function () {
//        this.listenTo(this.model, 'change:horizontalTextAlignment', this.updateHorizontalTextAlignment);
//    },
//
//    updateHorizontalTextAlignment: function () {
//        if (!this.wasRendered) {
//            return;
//        }
//        var value = this.model.get('horizontalTextAlignment');
//
//        if (InfinniUI.Metadata.HorizontalTextAlignment.indexOf(value) === -1) {
//            return;
//        }
//        this.switchClass('horizontalTextAlignment', value);
//    }
//
//};

//####app/controls/_base/_mixins/labelTextPropertyMixin.js
var labelTextPropertyMixin = {

    initLabelText: function () {
        this.listenTo(this.model, 'change:labelText', this.updateLabelText);
    },

    updateLabelText: function () {
        if (!this.wasRendered) {
            return;
        }

        this.ui.rerender();
    }

};

//####app/controls/_base/_mixins/lineCountPropertyMixin.js
var lineCountPropertyMixin = {

    updateLineCount: function () {
        if (!this.wasRendered) {
            return;
        }

        var lineCount = this.model.get('lineCount');

        if (lineCount > 0) {
            this.switchClass('line-count',  lineCount, this.ui.container);
            //this.ui.container.removeAttr('class');
            //this.ui.container.addClass('line-count-' + lineCount);
        }
    },

    initUpdateLineCount: function () {
        this.listenTo(this.model, 'change:lineCount', this.updateLineCount);
    }

};

//####app/controls/_base/_mixins/textEditorMixin.js
/**
 * Миксин для контрола с использованием масок ввода.
 *
 * Для использования редактора маски ввода в контроле необходимо:
 *  - создать редактор методом {@see textEditorMixin.renderEditor} c указанием необходимых параметров
 *  - реализовать метод onEditorValidate(value) для проверки на допустимость введенного значения
 *
 * Для обработки дополнительной логике при показе/скрытии редактора масок
 * можно использовать события editor:show и editor:hide.
 *
 * @mixin textEditorMixin
 */
var textEditorMixin = {

    /**
     *
     * options.el Контейнер для редактора
     * options.validate Коллбек для проверки введеного в редакторе значения
     * options.done Коллбек для применения введеного в редакторе значения
     * options.show Функция для отображения поля ввода
     * options.hide Функция для скрытия поля ввода
     *
     * @param options
     */
    renderEditor: function (options) {

        var convert = function (value) {
            if (this.onEditorConvertValue) {
                return this.onEditorConvertValue(value);
            }
            return value;
        }.bind(this);

        var editor = new TextEditor({
            parent: this,
            el: options.el,
            validate: this.onEditorValidate.bind(this),
            convert: convert,
            done: this.onEditorDone.bind(this),
            editMask: this.model.get('editMask'),
            multiline: options.multiline,
            lineCount: options.lineCount,
            inputType: options.inputType
        });

        this.editor = editor;

        this.listenTo(editor, 'editor:show', function () {
            //При показе поля редактирование - скрытить поле ввода элемента
            this.onEditorHideControl();
            //Проброс события от редактора маски к контролу
            this.trigger('editor:show');

            if(this.ui.editorWrap){
                this.ui.editorWrap.show();
            }
        });

        this.listenTo(editor, 'editor:hide', function () {
            //При скрытии поля редактирование - показать поле ввода элемента
            this.onEditorShowControl();
            //Проброс события от редактора маски к контролу
            this.trigger('editor:hide');

            if(this.ui.editorWrap){
                this.ui.editorWrap.hide();
            }
        });

        this.listenTo(editor, 'onKeyDown', function (data) {
            //Проброс события от редактора маски к контролу
            this.trigger('onKeyDown', data);
        });

        this.listenTo(this.model, 'change:value', function (model, value) {
            editor.trigger('editor:update', value);
        });

        //Метод для показа поля редактирования
        //Обычно необходимо вызывать при получении фокуса полем ввод а элемента управления
        this.showEditor = function (value, skipRefocus) {
            editor.trigger('editor:show', value, skipRefocus);
        };


    },


    /**
     * Обработчик получения фокуса ввода полем ввода элемента.
     * Показывает поле редактирования с маской ввода и скрывает исходное поле
     * @param event
     */
    onFocusControlHandler: function (event) {
        if(this.model.get('enabled')) {
            this.showEditor(this.model.get('value'), false);
            this.onEditorHideControl();
        }
    },

    onMouseenterControlHandler: function (event) {
        //TODO: при ховере показывается маска (UI-854: убрал) по просьбе TeamLead'a
        //При ховере Editor нужен, чтобы при клике по полю, курсор выставлялся в указаннкю позицию
        if(this.model.get('enabled')) {
            this.showEditor(this.model.get('value'), true);
            this.onEditorHideControl();
        }
    },

    /**
     * Обработчик проверки значения из поля ввода с маской
     * @param value
     * @returns {boolean}
     */
    onEditorValidate: function (value) {
        return true;
    },

    /**
     * Обработчик применения значения из поля ввода с маской
     * @param value
     */
    onEditorDone: function (value) {
        if(typeof value === 'undefined' || value === null || !value.toString().length) {
            value = undefined;
        }
        this.model.set('value', value);
    },

    /**
     * Метод для восстановления видимости поля ввода элемента
     */
    onEditorShowControl: function () {
        this.ui.control.show();

        if(this.ui.controlWrap){
            this.ui.controlWrap.show();
        }
    },

    /**
     * Метод для скрытия поля ввода элемента
     */
    onEditorHideControl: function () {
        this.ui.control.hide();

        if(this.ui.controlWrap){
            this.ui.controlWrap.hide();
        }
    }

    /**
     * Метод выполняющий синхронизацию значения из эдитора в элемент
     */
    //synchValueHandler: function () {
    //    if(this.editor.isInFocus()){
    //        var val = this.editor.getValue();
    //        this.model.set('value', val);
    //    }
    //}


};

//####app/controls/_base/_mixins/textStylePropertyMixin.js
var textStylePropertyMixin = {

    initTextStyle: function () {
        this.listenTo(this.model, 'change:textStyle', this.updateTextStyle);
    },

    updateTextStyle: function () {
        if (!this.wasRendered) {
            return;
        }
        this.switchClass('textstyle', this.model.get('textStyle'));
    }

};

//####app/controls/_base/_mixins/textWrappingPropertyMixin.js
var textWrappingPropertyMixin = {

    initTextWrapping: function () {
        this.listenTo(this.model, 'change:textWrapping', this.updateLinkText);
    },

    updateTextWrapping: function () {
        var textWrapping = this.model.get('textWrapping');
        this.$el.toggleClass('TextWrapping', textWrapping);
        this.$el.toggleClass('NoTextWrapping', !textWrapping);
    }
};
//####app/controls/_base/_mixins/valuePropertyMixin.js
var controlValuePropertyMixin = {

    onValueChanged: function(handler){
        this.controlModel.on('change:value', handler);
    }

};
//####app/controls/_base/control/control.js
/**
 * @description Базовый класс контролов
 * @class Control
 */
var Control = function (viewMode) {
    this.controlModel = this.createControlModel();
    this.controlView = this.createControlView(this.controlModel, viewMode);

    this.initHandlers();

};

_.extend(Control.prototype, {

    createControlModel: function () {
        throw ('Не перегружен абстрактный метод Control.createControlModel()');
    },

    createControlView: function (model, viewMode) {
        throw ('Не перегружен абстрактный метод Control.createControlView()');
    },

    initHandlers: function () {
        this.controlView.on('onLoaded', function () {
            this.controlModel.set('isLoaded', true);
        }, this);
    },

    set: function (key, value) {
        this.controlModel.set(key, value);
    },

    get: function (key) {
        return this.controlModel.get(key);
    },

    on: function (name, handler) {
        return this.controlModel.on(name, handler);
    },

    render: function () {
        return this.controlView.render().$el;
    },

    getChildElements: function () {
        return [];
    },

    onLoaded: function (handler) {
        this.controlModel.on('change:isLoaded', function (isLoaded) {
            if (isLoaded) {
                handler();
            }
        });
    },

    isLoaded: function () {
        return this.controlModel.get('isLoaded');
    },

    onBeforeClick: function (handler) {
        this.controlView.on('beforeClick', handler);
    },

    onClick: function (handler) {
        this.controlView.$el.on('click', handler);
    },

    onDoubleClick: function (handler) {
        this.controlView.$el.on('dblclick', handler);
    },

    onMouseDown: function (handler) {
        this.controlView.$el.on('mousedown', handler);
    },

    onMouseUp: function (handler) {
        this.controlView.$el.on('mouseup', handler);
    },

    onMouseEnter: function (handler) {
        this.controlView.$el.on('mouseenter', handler);
    },

    onMouseLeave: function (handler) {
        this.controlView.$el.on('mouseleave', handler);
    },

    onMouseMove: function (handler) {
        this.controlView.$el.on('mousemove', handler);
    },

    onKeyDown: function (handler) {
        this.controlView.$el.on('keydown', handler);
    },

    onKeyUp: function (handler) {
        this.controlView.$el.on('keyup', handler);
    },

    remove: function () {
        this.controlView.remove();
    }
});

_.mixin({
    'inherit': function (child, parent) {
        var f = new Function();
        f.prototype = parent.prototype;

        child.prototype = new f();
        child.prototype.constructor = child;

        child.superclass = parent.prototype;
    },

    'superClass': function (obj, context, values) {
        var args = _.toArray(arguments);
        args.splice(0, 2);

        obj.superclass.constructor.apply(context, args);
    }
});
//####app/controls/_base/control/controlModel.js
var ControlModel = Backbone.Model.extend({
    defaults: {
        text: null,
        name: null,
        enabled: true,
        parentEnabled: true,
        visible: true,
        textHorizontalAlignment: InfinniUI.Metadata.TextHorizontalAlignment.left,
        horizontalAlignment: 'Stretch',
        verticalAlignment: 'Top',
        textStyle: null,
        background: null,
        foreground: null,
        texture: null,
        isLoaded: false,
        validationState: 'success',
        validationMessage: '',
        focusable: true,
        focused: false,
        showToolTip: false//Тоолтип не показывается
    },

    initialize: function(){
        this.set('guid', guid(), {silent: true});
        this.on('change:focused', function (model, value) {
            this.trigger(value ? 'OnGotFocus' : 'OnLostFocus');
        });
    },
    
    set: function (key, val, options) {
        var
            defaults = this.defaults,
            attrs;

        if (key == null) return this;
        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        for (var name in attrs) {
            if (typeof attrs[name] !== 'undefined' && attrs[name] !== null) {
                continue;
            }

            if (name in defaults) {
                attrs[name] = defaults[name];
            }
        }
        return Backbone.Model.prototype.set.call(this, attrs, options);
    }

});
//####app/controls/_base/control/controlView.js
/**
 * @class
 * @augments Backbone.View
 */
var ControlView = Backbone.View.extend(/** @lends ControlView.prototype */{

    initialize: function () {
        this.wasRendered = false;
        this.once('render', this.initHandlersForProperties, this);
        this._initDomHandlers();

    },

    classNameFocused: 'pl-focused',

    _initDomHandlers: function () {
        var
            view = this,
            $el = this.$el;

        $el[0].addEventListener('click', function (event) {
            view.trigger('beforeClick', null, {value: event});
        }, true);
    },

    initHandlersForProperties: function () {
        this.listenTo(this.model, 'change:visible', this.updateVisible);
        this.listenTo(this.model, 'change:horizontalAlignment', this.updateHorizontalAlignment);
        this.listenTo(this.model, 'change:textHorizontalAlignment', this.updateTextHorizontalAlignment);
        this.listenTo(this.model, 'change:verticalAlignment', this.updateVerticalAlignment);
        this.listenTo(this.model, 'change:enabled', this.updateEnabled);
        this.listenTo(this.model, 'change:name', this.updateName);
        this.listenTo(this.model, 'change:style', this.updateStyle);
        this.listenTo(this.model, 'change:text', this.updateText);

        this.listenTo(this.model, 'change:textStyle', this.updateTextStyle);
        this.listenTo(this.model, 'change:background', this.updateBackground);
        this.listenTo(this.model, 'change:foreground', this.updateForeground);
        this.listenTo(this.model, 'change:texture', this.updateTexture);

        this.listenTo(this.model, 'change:validationState', this.updateValidationState);


        this.listenTo(this.model, 'change:focusable', this.updateFocusable);
        this.listenTo(this.model, 'change:focused', this.updateFocused);

        this.initFocusHandlers();
        this.initTooltipHandlers();
    },

    initFocusHandlers: function () {
        var
            $el = this.$el,
            el = this.el,
            model = this.model;

        $el
            .on('focusin', onFocusIn)
            .on('focusout', onFocusOut);

        function onFocusIn(event) {
            model.set('focused', true);
        }

        function onFocusOut(event) {
            if ($.contains(el, event.relatedTarget)) {
                //focus out to element inside control
            } else {
                //focus out
                model.set('focused', false);
            }
        }
    },

    initTooltipHandlers: function () {
        var
            view = this,
            $el = this.$el,
            el = this.el,
            model = this.model;

        $el
            .on('mouseover', onMouseOver)
            .on('mouseout', onMouseOut);

        function onMouseOver(event) {
            model.set('showToolTip', true);
        }

        function onMouseOut(event) {
            if ($.contains(el, event.relatedTarget)) {
                //mouse out to element inside control
            } else {
                model.set('showToolTip', false);
            }
        }
    },

    updateProperties: function () {
        this.updateVisible();
        this.updateTextHorizontalAlignment();
        this.updateHorizontalAlignment();
        this.updateVerticalAlignment();
        this.updateEnabled();
        this.updateName();
        this.updateText();
        this.updateStyle();

        this.updateTextStyle();
        this.updateBackground();
        this.updateForeground();
        this.updateTexture();

        this.updateValidationState();

        this.updateFocusable();
        this.updateFocused();
    },

    /**
     * @description Изменяет контрол в соответсвии со значением focusable. Напр. добавить tabindex="0"
     */
    updateFocusable: function () {

    },

    /**
     * @description Возвращает элемент, который должен получить фокус
     */
    getElementForFocus: function () {
        return this.$el;
    },

    updateFocused: function () {
        var focused = this.model.get('focused');

        if (focused) {
            var $el = this.getElementForFocus();
            if ($el && $el.length) {
                $el.focus();
            }
        }
        this.$el.toggleClass(this.classNameFocused, focused);
    },


    onFocusHandler: function (event) {
        console.log('onFocus');
    },


    updateVisible: function () {
        var isVisible = this.model.get('visible');
        this.$el
            .toggleClass('hidden', !isVisible);

        this.onUpdateVisible();
    },

    onUpdateVisible: function () {
        var exchange = window.InfinniUI.global.messageBus;
        exchange.send('OnChangeLayout', {});
    },

    updateEnabled: function () {
        var isEnabled = this.model.get('enabled');
        this.$el
            .toggleClass('pl-disabled', !isEnabled);
    },

    updateVerticalAlignment: function () {
        var verticalAlignment = this.model.get('verticalAlignment');
        var prefix = 'verticalAlignment';
        var regexp = new RegExp('(^|\\s)' + prefix + '\\S+', 'ig');

        this.$el.removeClass(function (i, name) {
                return (name.match(regexp) || []).join(' ');
            })
            .addClass(prefix + verticalAlignment);
    },

    updateTextHorizontalAlignment: function () {
        this.switchClass('pl-text-horizontal', this.model.get('textHorizontalAlignment'));
    },

    updateHorizontalAlignment: function () {
        var horizontalAlignment = this.model.get('horizontalAlignment');
        switch (horizontalAlignment) {
            case 'Left':
            {
                this.$el
                    .removeClass('center-block pull-right')
                    .addClass('pull-left');
                break;
            }
            case 'Right':
            {
                this.$el
                    .removeClass('pull-left center-block')
                    .addClass('pull-right');
                break;
            }
            case 'Center':
            {
                this.$el
                    .removeClass('pull-left pull-right')
                    .addClass('center-block');
                break;
            }
            case 'Stretch':
            {
                this.$el
                    .removeClass('pull-left pull-right center-block')
                    .addClass('full-width');
                break;
            }
        }
    },

    updateName: function () {
        var newName = this.model.get('name'),
            currentName = this.$el.attr('data-pl-name');
        if (newName != currentName && typeof newName == 'string') {
            this.$el.attr('data-pl-name', newName);
        }
    },

    updateText: function () {

    },

    updateTextStyle: function () {
        var customStyle = this.model.get('textStyle');

        if (this.currentTextStyle) {
            this.$el
                .removeClass(this.valueToTextClassName(this.currentTextStyle));
        }

        if (customStyle) {
            this.$el
                .addClass(this.valueToTextClassName(customStyle));
        }

        this.currentTextStyle = customStyle;
    },

    updateBackground: function () {
        var customStyle = this.model.get('background');

        if (this.currentBackground) {
            this.$el
                .removeClass(this.valueToBackgroundClassName(this.currentBackground));
        }

        if (customStyle) {
            this.$el
                .addClass(this.valueToBackgroundClassName(customStyle));
        }

        this.currentBackground = customStyle;
    },

    updateForeground: function () {
        var customStyle = this.model.get('foreground');

        if (this.currentForeground) {
            this.$el
                .removeClass(this.valueToForegroundClassName(this.currentForeground));
        }

        if (customStyle) {
            this.$el
                .addClass(this.valueToForegroundClassName(customStyle));
        }

        this.currentForeground = customStyle;
    },

    updateTexture: function () {
        var customStyle = this.model.get('texture');

        if (this.currentTexture) {
            this.$el
                .removeClass(this.valueToTextureClassName(this.currentTexture));
        }

        if (customStyle) {
            this.$el
                .addClass(this.valueToTextureClassName(customStyle));
        }

        this.currentTexture = customStyle;
    },

    updateStyle: function () {
        var customStyle = this.model.get('style');

        if (this.currentStyle) {
            this.$el
                .removeClass(this.currentStyle);
        }

        if (customStyle) {
            this.$el
                .addClass(customStyle);
        }

        this.currentStyle = customStyle;
    },

    updateValidationState: function () {
        var newState = this.model.get('validationState'),
            message = this.model.get('validationMessage');
        switch (newState) {

            case 'success':
            {
                this.$el
                    .removeClass('has-warning has-error');
                this.hideErrorMessage();
            }
                break;

            case 'warning':
            {
                this.$el
                    .removeClass('has-error')
                    .addClass('has-warning');
                this.showErrorMessage(message);
            }
                break;

            case 'error':
            {
                this.$el
                    .removeClass('has-warning')
                    .addClass('has-error');
                this.showErrorMessage(message);
            }
                break;

        }

    },

    showErrorMessage: function (message) {
        var $errorIcn = $(_.template('<i class="2 error-icn fa fa-warning" data-placement="left" title="<%-message%>"></i>')({message: message}));

        this.hideErrorMessage();
        this.$el.find('.form-control:first')
            .before($errorIcn);

        $errorIcn.tooltip({'container': 'body'});
    },

    hideErrorMessage: function () {
        this.$el.find('.error-icn')
            .remove();
    },

    rerender: function () {
        if (this.wasRendered) {
            this.render();
        }
    },

    prerenderingActions: function () {
        this.wasRendered = true;
    },

    /**
     *
     * @param {Boolean} [onLoaded=true]
     */
    postrenderingActions: function (triggeringOnLoaded) {
        this.delegateEvents();

        triggeringOnLoaded = triggeringOnLoaded === undefined ? true : triggeringOnLoaded;

        if (triggeringOnLoaded) {
            this.trigger('onLoaded');
        }
    },

    switchClass: function (name, value, $el) {

        var startWith = name + '-';
        var regexp = new RegExp('(^|\\s)' + startWith + '\\S+', 'ig');
        var $element = $el || this.$el;
        $element.removeClass(function (i, name) {
                return (name.match(regexp) || []).join(' ');
            })
            .addClass(startWith + value);
    },

    valueToBackgroundClassName: function (value) {
        return 'pl-' + value.toLowerCase() + '-bg';
    },

    valueToForegroundClassName: function (value) {
        return 'pl-' + value.toLowerCase() + '-fg';
    },

    valueToTextClassName: function (value) {
        return 'pl-' + value.toLowerCase();
    },

    valueToTextureClassName: function (value) {
        return 'pl-' + value.toLowerCase();
    },

    renderTemplate: function (template) {
        var data = this.getData();
        this.$el.html(template(data));
        this.bindUIElements();
    },

    getData: function () {
        var model = this.model;
        return {
            name: model.get('name'),
            text: model.get('text'),
            focusable: model.get('focusable'),
            focused: model.get('focused'),
            enabled: model.get('enabled'),
            visible: model.get('visible'),
            horizontalAlignment: model.get('horizontalAlignment'),
            verticalAlignment: model.get('verticalAlignment'),
            textHorizontalAlignment: model.get('textHorizontalAlignment'),
            textVerticalAlignment: model.get('textVerticalAlignment'),
            textStyle: model.get('textStyle'),
            foreground: model.get('foreground'),
            background: model.get('background'),
            texture: model.get('texture')
        }
    }

});

_.extend(ControlView.prototype, bindUIElementsMixin, eventHandlerMixin);
//####app/controls/_base/control/pdfViewerViewBase.js
var PdfViewerViewBase = ControlView.extend({
    className: 'pl-document-viewer',

    template: _.template(
        '<div class="pl-documentViewer">' +
        '   <iframe id="documentViewer" name="documentViewer" style="width:100%;" src="/app/utils/pdf/web/viewer.html#<%= frameId %>"></iframe>' +
        '</div>'),

    events: {
        'click .print': 'onButtonPrintClickHandler'
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
        this.listenTo(this.model, 'change:dataSource', this.onChangeDataSource);
    },

    onChangeDataSource: function () {
        if (!this.wasRendered) {
            return;
        }
        this.renderDocument();
    },

    render: function () {
        this.prerenderingActions();

        this.renderDocument();

        this.postrenderingActions();
        return this;
    },

    renderPdf: function(data){
        window.pdfDocs = window.pdfDocs||[];

        var frameId = this.genId();
        window.pdfDocs[frameId] = data;
        var template = this.template({frameId: frameId});
        this.$el.html(template);
    },

    onButtonPrintClickHandler: function () {
        $('#documentViewer').get(0).contentWindow.print();
    },

    genId: function(){
        return Math.round((Math.random() * 100000));
    },

    sendRequest: function(url, handler){
        var xmlhttp = this.getXmlHttp();

        xmlhttp.open('GET', url, true);
        xmlhttp.withCredentials = true;
        xmlhttp.responseType = 'arraybuffer';
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    handler(xmlhttp.response);
                }
            }
        };
        xmlhttp.send();
    },

    getXmlHttp: function(){
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e1) {
                xmlhttp = false;
            }
        }

        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }

        return xmlhttp;
    }
});
//####app/controls/_base/editor/textEditor.js
/**
 * Редактор значений, используемый при вводе текста с использованием масок ввода данных
 *
 * Активизируется при получении фокуса ввода элементом {@see textEditorMixin.onFocusControlHandler},
 * скрывая поле ввода элемента и отображая собственное поле редактирование с заданной маской ввода.
 *
 * Подключается к элементу ввода посредством миксина {@see textEditorMixin}.
 */
var TextEditor = Backbone.View.extend({

    templateTextBox: InfinniUI.Template["controls/_base/editor/template/editorTextBox.tpl.html"],
    templateTextArea: InfinniUI.Template["controls/_base/editor/template/editorTextArea.tpl.html"],

    UI: {
        editor: ".pl-control-editor",
        icon: "i"
    },

    events: {
        'blur .pl-control-editor': 'onBlurEditorHandler',
        'keydown .pl-control-editor': 'onKeyDownEditorHandler',
        'keypress .pl-control-editor': 'onKeyPressEditorHandler',
        'keyup .pl-control-editor': 'onKeyUpEditorHandler',
        'click .pl-control-editor': 'onClickEditorHandler',
        'focus .pl-control-editor': 'onFocusEditorHandler',
        'paste .pl-control-editor': 'onPasteEditorHandler',
        //'contextmenu .pl-control-editor': 'onContextMenuEditorHandler',
        'mousewheel .pl-control-editor': 'onMouseWheelEditorHandler',
        'mouseleave .pl-control-editor': 'onMouseLeaveEditorHandler',
        'input .pl-control-editor': 'onInputHandler'
    },

    /**
     * options.parent {Backbone.View} ролительский элемент управления
     * options.el Элемент в который рендерить редактор
     * options.validate Коллбек для проверки введенного значения
     * options.done Коллбек для установки значения в контроле
     * @param options
     */
    initialize: function (options) {
        //Сразу скрываем редактор
        this.$el.hide();
        this.options = options;
        this.inFocus = false;
        this.on('editor:show', this.onShowEditorHandler);
        this.on('editor:hide', this.onHideEditorHandler);
        this.on('editor:update', this.onUpdateEditorHandler);
        this.isValid = true;

        return this.render();
    },

    render: function () {
        this.$el.find('.pl-control-editor').remove();

        if (this.options.multiline) {
            this.$el.prepend(this.templateTextArea({lineCount: this.options.lineCount}));
        } else {
            this.$el.prepend(this.templateTextBox({inputType: this.options.inputType}));
        }
        this.bindUIElements();

        return this;
    },

    setIsValid: function (isValid) {
        if (isValid === this.isValid) return;
        this.isValid = isValid;
        this.toggleValidateState(isValid);
    },

    toggleValidateState: function (isValid) {
        var error;
        this.$el.toggleClass('input-icon right has-error', isValid !== true);
        this.ui.icon.toggle(isValid !== true);
    },

    setValue: function (value) {
        var editMask = this.getOptions('editMask');
        var displayValue;
        //Если указана маска ввода - форматируем значение, иначе выводим как есть.
        if (typeof editMask === 'undefined' || editMask === null) {
            displayValue = value;
        } else {
            editMask.reset(value);
            displayValue = editMask.getText();
        }
        if (this.ui.editor.val() !== displayValue) {
            this.ui.editor.val(displayValue);
        }

        this.setIsValid(true);//По умолчанию считаем переданное значение валидно
    },

    getValue: function () {
        var editMask = this.getOptions('editMask');
        var convert = this.getOptions('convert');
        if (editMask) {
            return editMask.getValue();
        } else {
            return convert(this.ui.editor.val());
        }
    },

    isInFocus: function () {
        return this.inFocus;
    },

    /**
     * @description Обработчик события установки значения поля редактирования
     * @param {*} value
     */
    onUpdateEditorHandler: function (value) {
        this.setValue(value);
    },

    /**
     * Обработчик сообщения на отображение поля ввода
     * Показать поле редактирование и установить на нем фокус ввода
     * @param value
     */
    onShowEditorHandler: function (value, skipRefocus) {
        this.cancelled = false;
        this.setValue(value);
        this.$el.show();
        if (!skipRefocus) {
            this.ui.editor.focus();
        }
        this.checkCurrentPosition();
        this.inFocus = true;
    },

    onHideEditorHandler: function () {
        this.$el.hide();
    },
    onKeyDownEditorHandler: function (event) {

        if (event.ctrlKey || event.altKey) {
            return;
        }

        if (event.which === 27) {    //Escape
            //Отменить изменения и выйти из режима редактирования
            this.cancelled = true;
            this.trigger('editor:hide');
        }

        var maskEdit = this.getOptions('editMask');
        if (typeof maskEdit === 'undefined' || maskEdit === null) {
            return;
        }
        var editor = this.ui.editor;
        var elem = editor.get(0);
        var position;

        switch (event.which) {
            case 36:    //Home
                if(event.shiftKey) {
                    elem.selectionEnd = parseInt(elem.selectionEnd, 10);
                }else {
                    position = maskEdit.moveToPrevChar(0);
                    if (position !== false) {
                        this.setCaretPosition(position);
                        event.preventDefault();
                    }
                }
                break;
            case 37:    //Left arrow
                if(event.shiftKey) {
                    elem.selectionEnd = parseInt(elem.selectionEnd, 10);
                }else {
                    if (this.getSelectionLength() > 0){
                        event.preventDefault();
                        this.setCaretPosition(parseInt(elem.selectionStart, 10));
                    }else {
                        position = maskEdit.moveToPrevChar(this.getCaretPosition());
                        if (position !== false) {
                            this.setCaretPosition(position);
                            event.preventDefault();
                        }
                    }
                }
                break;
            case 39:    //Right arrow
                if(event.shiftKey) {
                    elem.selectionEnd = parseInt(elem.selectionEnd, 10);
                }else {
                    if (this.getSelectionLength() > 0){
                        event.preventDefault();
                        this.setCaretPosition(parseInt(elem.selectionEnd, 10));
                    }else {
                        position = maskEdit.moveToNextChar(this.getCaretPosition());
                        if (position !== false) {
                            this.setCaretPosition(position);
                            event.preventDefault();
                        }
                    }
                }
                break;
            case 35:    //End
                position = maskEdit.moveToNextChar(editor.val().length);
                if (position !== false) {
                    this.setCaretPosition(position);
                    event.preventDefault();
                }
                break;
            case 38:    //Up arrow
                if(event.shiftKey) {
                    elem.selectionEnd = parseInt(elem.selectionEnd, 10);
                }else {
                    if (this.getSelectionLength() > 0){
                        event.preventDefault();
                        this.setCaretPosition(parseInt(elem.selectionStart, 10));
                    }else {
                        position = maskEdit.setNextValue(this.getCaretPosition());
                        if (position !== false) {
                            event.preventDefault();
                            editor.val(maskEdit.getText());
                            this.setCaretPosition(position);
                        }
                    }
                }
                break;
            case 40:    //Down arrow
                if(event.shiftKey) {
                    elem.selectionEnd = parseInt(elem.selectionEnd, 10);
                }else {
                    if (this.getSelectionLength() > 0){
                        event.preventDefault();
                        this.setCaretPosition(parseInt(elem.selectionEnd, 10));
                    }else {
                        position = maskEdit.setPrevValue(this.getCaretPosition());
                        if (position !== false) {
                            event.preventDefault();
                            editor.val(maskEdit.getText());
                            this.setCaretPosition(position);
                        }
                    }
                }
                break;
            case 46:    //Delete
                // @TODO Если выделена вся строка - очистить поле редактирования
                //TODO: доделать SelectionLength
                if (this.getSelectionLength() > 0 && !(maskEdit.value instanceof Date)) {
                    event.preventDefault();
                    this.removeSelection(maskEdit);
                } else {
                    position = maskEdit.deleteCharRight(this.getCaretPosition(), this.getSelectionLength());
                    if (position !== false) {
                        event.preventDefault();
                        editor.val(maskEdit.getText());
                        this.setCaretPosition(position);
                    }
                }
                break;
            case 8:    //Backspace
                // @TODO Если выделена вся строка - очистить поле редактирования
                //TODO: доделать SelectionLength
                if (this.getSelectionLength() > 0 && !(maskEdit.value instanceof Date)) {
                    event.preventDefault();
                    this.removeSelection(maskEdit);
                } else {
                    position = maskEdit.deleteCharLeft(this.getCaretPosition(), this.getSelectionLength());
                    if (position !== false) {
                        event.preventDefault();
                        editor.val(maskEdit.getText());
                        this.setCaretPosition(position);
                    }
                }
                break;
            case 32:    //Space
                if (this.getSelectionLength() > 0 && !(maskEdit.value instanceof Date)) {
                    event.preventDefault();
                    this.removeSelection(maskEdit);
                }else {
                    position = maskEdit.getNextItemMask(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }
                break;

            default:
                //TODO: не работает для DateTimeFormat
                //TODO: доделать SelectionLength замена выделенного текста, по нажатию

                if((event.keyCode >= 96 && event.keyCode <= 105)){
                    event.keyCode = event.keyCode - 48; //hotfix for numpad keys
                }

                var inp = String.fromCharCode(event.keyCode);
                if (!isNaN(parseFloat(inp)) && isFinite(inp)){
                    if (this.getSelectionLength() > 0 && !(maskEdit.value instanceof Date)) {
                        event.preventDefault();
                        //Data
                        this.removeSelection(maskEdit, String.fromCharCode(event.keyCode));
                    }
                }
                break;
        }
    },

    removeSelection: function(mask, char){
        var res = mask.deleteSelectedText(this.getCaretPosition(), this.getSelectionLength(), char);
        mask.reset(res.result);

        this.ui.editor.val(mask.getText());

        if(!res.result){
            this.setCaretPosition(0);
        }else{
            this.setCaretPosition(res.position);
        }
    },

    checkCurrentPosition: function () {
        var maskEdit = this.getOptions('editMask');
        if (typeof maskEdit === 'undefined' || maskEdit === null) {
            return;
        }
        var currentPosition = this.getCaretPosition();
        var position = currentPosition === 0 ? maskEdit.moveToPrevChar(0) : maskEdit.moveToNextChar(currentPosition - 1);
        if (position !== currentPosition) {
            this.setCaretPosition(position);
        }

    },

    onClickEditorHandler: function (event) {
        this.checkCurrentPosition();
        event.preventDefault();
    },

    onFocusEditorHandler: function () {
        var maskEdit = this.getOptions('editMask');
        if (typeof maskEdit === 'undefined' || maskEdit === null) {
            return;
        }
        var position = maskEdit.moveToPrevChar(0);
        this.setCaretPosition(position);
        this.inFocus = true;
    },

    onKeyUpEditorHandler: function (event) {
        this.trigger('onKeyDown', {
            keyCode: event.which,
            value: this.parseInputValue()
        });
    },

    onKeyPressEditorHandler: function (event) {
        if (event.altKey || event.ctrlKey) {
            return;
        }

        var maskEdit = this.getOptions('editMask');
        if (typeof maskEdit === 'undefined' || maskEdit === null) {
            return;
        }

        var editor = this.ui.editor;
        var char = this.getCharFromKeypressEvent(event);
        var position;

        if (char === null) {
            return;
        }


        position = maskEdit.setCharAt(char, this.getCaretPosition(), this.getSelectionLength());
        if (position !== false) {
            event.preventDefault();
            editor.val(maskEdit.getText());
            this.setCaretPosition(position);
        }
    },

    onPasteEditorHandler: function (event) {
        var maskEdit = this.getOptions('editMask');
        var editor = this.ui.editor;

        if (typeof maskEdit === 'undefined' || maskEdit === null) {
            return;
        }

        var text = (event.originalEvent || event).clipboardData.getData('text/plain') || prompt('Paste something..');
        maskEdit.pasteStringToMask(text, this.getCaretPosition());

        event.preventDefault();
        editor.val(maskEdit.getText());
        //@TODO Реализовать обработку вставки значения из буфера обмена
    },

    onContextMenuEditorHandler: function (event) {
        event.preventDefault();
        this.checkCurrentPosition();
    },

    onMouseWheelEditorHandler: function (event) {
        var maskEdit = this.getOptions('editMask');
        if (typeof maskEdit === 'undefined' || maskEdit === null) {
            return;
        }

        event.preventDefault();
        //@TODO Реализовать изменение значений при прокретке колеса
    },

    onMouseLeaveEditorHandler: function (event) {
        var inFocus = event.currentTarget == document.activeElement;
        if (!inFocus && this.isValid) {
            this.$el.hide();
            this.onBlurEditorHandler();
        }
    },

    onInputHandler: function(event){
        this.options.parent.model.set('value', this.ui.editor.val());
    },

    /**
     * @private
     * Получение нажатого символа в событии keypress
     * @see {@link http://learn.javascript.ru/keyboard-events#получение-символа-в-keypress}
     * @param event
     * @returns {String}
     */
    getCharFromKeypressEvent: function (event) {
        if (event.which == null) {  // IE
            if (event.keyCode < 32) return null; // спец. символ
            return String.fromCharCode(event.keyCode)
        }

        if (event.which != 0 && event.charCode != 0) { // все кроме IE
            if (event.which < 32) return null; // спец. символ
            return String.fromCharCode(event.which); // остальные
        }

        return null; // спец. символ
    },

    /**
     * @private
     * Получение позиции курсора в поле редактирования
     * @see {@link http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field}
     * @returns {number}
     */
    getCaretPosition: function () {
        var elem = this.ui.editor.get(0);
        // Initialize
        var position = 0;

        // IE Support
        if (document.selection) {

            // Set focus on the element
            elem.focus();

            // To get cursor position, get empty selection range
            var selection = document.selection.createRange();

            // Move selection start to 0 position
            selection.moveStart('character', -elem.value.length);

            // The caret position is selection length
            position = selection.text.length;
        }

        // Firefox support
        else if (elem.selectionStart || elem.selectionStart == '0')
            position = elem.selectionStart;

        return position;
    },

    getSelectionLength: function () {
        var elem = this.ui.editor.get(0);
        var len = 0;
        var startPos = parseInt(elem.selectionStart, 10);
        var endPos = parseInt(elem.selectionEnd, 10);


        if (!isNaN(startPos) && !isNaN(endPos)) {
            len = endPos - startPos;
        }

        return len;
    },

    /**
     * @private
     * Установка позиции курсора в поле редактирования
     * @see {@link http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox}
     * @param {Integer} [position=0]
     */
    setCaretPosition: function (position) {
        var elem = this.ui.editor.get(0);

        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', position);
            range.select();
        }
        else {
            if (typeof elem.selectionStart !== 'undefined') {
                elem.setSelectionRange(position, position);
            }
        }
    },

    /**
     * Обработка ппотери фокуса полем ввода
     *
     * При потере фокуса надо проверить что введенное значение удовлетваряет контрол.
     * Если значение контрол принял - скрыть поле ввода, отобразить исходный контрол и вызвать setValue
     * Если контрол значение не принял - поле ввода не скрывать, установить ошибку
     */
    onBlurEditorHandler: function () {
        this.inFocus = false;

        if (this.cancelled) {
            //Выход из поля редактора с отменой изменений
            return;
        }
        var control = this.getOptions('parent');
        var done = this.getOptions('done');
        var validate = this.getOptions('validate');
        var convert = this.getOptions('convert');
        var value = convert(this.ui.editor.val());
        var editMask = this.getOptions('editMask');
        var complete = true;

        //Убираем маску при потере фокуса
        if (typeof editMask !== 'undefined' && editMask !== null) {
            if (!editMask.getIsComplete(this.ui.editor.val())) {
                value = null;
                editMask.reset(value);
                this.trigger('editor:hide');
            } else {
                complete = editMask.getIsComplete(value);
                value = editMask.getValue();
            }
        }

        if (typeof validate !== 'undefined' && validate !== null) {
            var isValid = complete && validate(value);
            this.setIsValid(isValid);

            if (!isValid) {
                //Если значение невалидно - редактор не закрываемю
                return;
            }
        }

        if (typeof done !== 'undefined' && done !== null) {
            //Если указан коллбек на установку значения - вызываем его
            done(editMask ? editMask.getData() : value);
        }
        //Триггерим событие для скрытия поля редактирования
        this.trigger('editor:hide');
    },

    parseInputValue: function () {
        var control = this.getOptions('parent');
        var done = this.getOptions('done');
        var validate = this.getOptions('validate');
        var convert = this.getOptions('convert');
        var value = convert(this.ui.editor.val());
        var editMask = this.getOptions('editMask');
        var complete = true;

        if (typeof editMask !== 'undefined' && editMask !== null) {
            if (!editMask.getIsComplete(this.ui.editor.val())) {
                return;
            } else {
                complete = editMask.getIsComplete(value);
                value = editMask.getValue();
            }
        }

        if (typeof validate !== 'undefined' && validate !== null) {
            var isValid = complete && validate(value);
            if (!isValid) {
                //Если значение невалидно
                return;
            }
        }

        return editMask ? editMask.getData() : value;
    },

    getOptions: function (name) {
        if (typeof name === 'undefined' || name === '' || name === null) {
            return;
        }
        return this.options[name];
    }

});

_.extend(TextEditor.prototype, bindUIElementsMixin);
//####app/new/controls/_base/button/buttonControlMixin.js
var buttonControlMixin = {

    click: function () {
        this.controlView.$el.click();
    }

};
//####app/new/controls/_base/container/containerControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments Control
 */
function ContainerControl(viewMode) {
    _.superClass(ContainerControl, this, viewMode);
}

_.inherit(ContainerControl, Control);

_.extend(ContainerControl.prototype, {});
//####app/new/controls/_base/container/containerModel.js
/**
 * @constructor
 * @augments ControlModel
 */
var ContainerModel = ControlModel.extend(

    /** @lends ContainerModel.prototype */
    {
        defaults: _.defaults({
            //items: new Collection()
            itemTemplate: null
        }, ControlModel.prototype.defaults),

        initialize: function () {
            ControlModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
            this.set('items', new Collection());
        }
    }
);




//####app/new/controls/_base/container/containerView.js
/**
 * @class
 * @augments ControlView
 */
var ContainerView = ControlView.extend(
    /** @lends ContainerView.prototype */
    {
        initialize: function (options) {
            ControlView.prototype.initialize.call(this, options);

            this.childElements = [];

            this.listenTo(this.model, 'change:groupValueSelector', this.updateGrouping);
            this.updateGrouping();
        },

        updateGrouping: function(){
            throw 'ContainerView.updateGrouping � ������� ContainerView �� ����������� ���������� �����������.';
        },

        initHandlersForProperties: function(){
            ControlView.prototype.initHandlersForProperties.call(this);

            var that = this;
            this.model.get('items').onChange(function(){
                that.rerender();
            });
        },

        removeChildElements: function(){
            for(var i = 0, ii = this.childElements.length; i < ii; i++){
                this.childElements[i].remove();
            }

            this.childElements = [];
        },

        addChildElement: function(child){
            this.childElements.push(child);
        }
    }
);

//####app/new/controls/_base/editorBase/editorBaseControlMixin.js
var editorBaseControlMixin = {

    initialize_editorBaseControl: function(){

    },

    setValue: function (value) {
        this.controlModel.set('value', value);
    },

    getValue: function () {
        return this.controlModel.get('value');
    },

    onValueChanging: function (handler) {
        this.controlModel.onValueChanging(handler);
    },

    onValueChanged: function (handler) {
        this.controlModel.onValueChanged(handler);
    }
};
//####app/new/controls/_base/editorBase/editorBaseModelMixin.js
var editorBaseModelMixin = {

    defaults_editorBaseModel: {
        value: null,
        hintText: null,
        errorText: null,
        warningText: null,
        labelFloating: false
    },

    initialize_editorBaseModel: function(){
       this.eventManager = new EventManager();
        this.isInited = true;
    },

    transformValue: function (value) {
        return value;
    },

    _setValue: function(value, options) {
        value = this.transformValue(value);
        var
            oldValue = this.get('value'),
            message = {
                oldValue: oldValue,
                newValue: value
            };

        if (value === oldValue) {
            return;
        }

        if(this.isInited){
            if (this.eventManager.trigger('onValueChanging', message)) {
                ContainerModel.prototype.set.call(this, 'value', value, options || {});
                this.trigger('onValueChanged', message);
            }
        }else{
            ContainerModel.prototype.set.call(this, 'value', value, options || {});
        }

    },

    set: function (key, value, options) {
        var attributes, options;
        if (key === null) {
            return this;
        }

        if (typeof key === 'object') {
            attributes = key;
            options = value;
        } else {
            (attributes = {})[key] = value;
        }

        options = options || {};

        if ('value' in attributes) {
            this._setValue(attributes.value, options);
            delete attributes.value;
        }

        var hasAttributes = false;

        for (var i in attributes) {
            hasAttributes = true;
            break;
        }

        if (hasAttributes) {
            return ContainerModel.prototype.set.call(this, attributes, options);
        }

        return false;
    },

    getValue: function () {
        return this.get('value');
    },

    onValueChanging: function (handler) {
        this.eventManager.on('onValueChanging', handler);
    },

    onValueChanged: function (handler) {
        this.on('onValueChanged', handler);
    }
};

//####app/new/controls/_base/editorBase/editorBaseViewMixin.js
var editorBaseViewMixin = {
    UI: {
        hintText: '.pl-control-hint-text',
        warningText: '.pl-control-warning-text',
        errorText: '.pl-control-error-text'
    },

    getData: function () {
        var model = this.model;

        return {
            guid: model.get('guid')
        }
    },

    initHandlersForProperties: function(){
        this.listenTo(this.model, 'onValueChanged', this.updateValue);
        this.listenTo(this.model, 'change:hintText', this.updateHintText);
        this.listenTo(this.model, 'change:errorText', this.updateErrorText);
        this.listenTo(this.model, 'change:warningText', this.updateWarningText);
    },

    updateProperties: function(){
        this.updateValue();
        this.updateLabelFloating();
        this.updateHintText();
        this.updateErrorText();
        this.updateWarningText();
    },


    updateValue: function(){
        throw 'editorBaseViewMixin.updateValue В потомке editorBaseViewMixin не реализовано обновление данных.';
    },

    updateValueState: function(){
        var value = this.model.get('value');
        var isEmpty = _.isEmpty(value) && !(_.isNumber(value));
        this.$el.toggleClass("pl-empty-text-editor", isEmpty);
    },

    updateLabelFloating: function () {
        var labelFloating = this.model.get('labelFloating');
        this.$el.toggleClass("pl-label-floating", labelFloating === true);
    },

    updateHintText: function(){
        var hintText = this.model.get('hintText');
        if(hintText){
            this.ui.hintText
                .text(hintText)
                .removeClass('hidden');
        }else{
            this.ui.hintText
                .text('')
                .addClass('hidden');
        }

    },

    updateErrorText: function(){
        var errorText = this.model.get('errorText');
        if(errorText){
            this.ui.errorText
                .text(errorText)
                .removeClass('hidden');
        }else{
            this.ui.errorText
                .text('')
                .addClass('hidden');
        }

    },

    updateWarningText: function(){
        var warningText = this.model.get('warningText');
        if(warningText){
            this.ui.warningText
                .text(warningText)
                .removeClass('hidden');
        }else{
            this.ui.warningText
                .text('')
                .addClass('hidden');
        }

    },

    updateEnabled: function () {
        ControlView.prototype.updateEnabled.call(this);

        if(this.ui.control){
            var isEnabled = this.model.get('enabled');
            this.ui.control.prop('disabled', !isEnabled);
        }

    },

    onInvalidHandler: function (model, error) {
        // что ита???
        // вот ето -  @see {@link http://backbonejs.org/#Model-validate} !!!


        //@TODO Можно ли использовать поля из API или реализовывать вывод ошибок отдельно?
        //this.model.set('errorText', error);
    }
};

//####app/new/controls/_base/eventManager.js
function EventManager() {
    this.handlers = {};
}

EventManager.prototype.on = function (name, handler) {
    if (typeof this.handlers[name] === 'undefined') {
        this.handlers[name] = [];
    }
    this.handlers[name].push(handler);
    return this;
};

EventManager.prototype.trigger = function (name, message, context) {
    var eventHandlers = this.handlers[name];
    var response = true;
    if (Array.isArray(eventHandlers)) {
        response = eventHandlers
            .map(function (handler) {
                return handler.call(context, message);
            })
            .every(function (result) {
                return result !== false;
            });
    }
    return response;
};

//####app/new/controls/_base/listEditorBase/listEditorBaseControl.js
function ListEditorBaseControl(viewMode) {
    _.superClass(ListEditorBaseControl, this, viewMode);
    this.initialize_editorBaseControl();
}

_.inherit(ListEditorBaseControl, ContainerControl);

_.extend(ListEditorBaseControl.prototype, {

    onSelectedItemChanged: function (handler) {
        this.controlModel.onSelectedItemChanged(handler);
    }
}, editorBaseControlMixin);
//####app/new/controls/_base/listEditorBase/listEditorBaseModel.js
var ListEditorBaseModel = ContainerModel.extend( _.extend({

    defaults: _.defaults({
        multiSelect: false
    }, ContainerModel.prototype.defaults),

    initialize: function () {
        var that = this;
        ContainerModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();

        this.bindSelectedItemsWithValue();

        this.get('items').onChange(function(){
            that.clearItemsStringifyCache();
        });
    },

    onSelectedItemChanged: function (handler) {
        this.on('change:selectedItem', function(source, newSelectedItem){
            handler({value: newSelectedItem});
        });
    },

    toggleValue: function (value, toggle) {
        var
            currentValue = this.get('value'),
            multiSelect = this.get('multiSelect'),
            index, clonedValue;

        if(multiSelect){
            currentValue = Array.isArray(currentValue) ? currentValue : [];

            var valueAsString = JSON.stringify(value);

            var newValue = currentValue.filter(function(val) {
                return JSON.stringify(val) !== valueAsString;
            });

            if (typeof toggle === 'undefined' || toggle === true) {
                if (newValue.length === currentValue.length) {
                    newValue.push(value);
                }
            }

            this.set('value', newValue);

        }else{
            if(value != currentValue){
                this.set('value', value);
            }
        }
    },

    bindSelectedItemsWithValue: function(){
        return;
        //this.on('change:selectedItem', function (model, newSelectedItem) {
        //    var value = this.get('value'),
        //        newItemValue = this.valueByItem(newSelectedItem);
        //
        //    if(!this.get('multiSelect') && !this.isStringifyEqualValues(newItemValue, value)){
        //        this.set('value', newItemValue);
        //    }
        //}, this);
        //
        //this.on('change:value', function (model, newValue) {
        //    var selectedItem = this.get('selectedItem'),
        //        newSelectedItem = this.itemByValue(newValue);
        //
        //    if(!this.get('multiSelect') && selectedItem != newSelectedItem){
        //        this.set('selectedItem', newSelectedItem);
        //    }
        //}, this);
    },

    valueByItem: function(item){
        var valueSelector = this.get('valueSelector');
        if(!valueSelector){
            return item;
        }else{
            return valueSelector(undefined, {value: item});
        }
    },

    itemInfoByValue: function(value){
        if(!this.itemsStringifyCache){
            this.updateItemsStringifyCache();
        }

        var stringifyValue = JSON.stringify(value);
        return this.itemsStringifyCache[stringifyValue];
    },

    itemByValue: function(value){
        var itemInfo = this.itemInfoByValue(value);

        if(!itemInfo){
            return undefined;
        }else{
            return itemInfo.item;
        }
    },

    itemIndexByValue: function(value){
        var itemInfo = this.itemInfoByValue(value);

        if(!itemInfo){
            return -1;
        }else{
            return itemInfo.index;
        }
    },

    itemIndexByItem: function(item){
        var value = this.valueByItem(item);
        return this.itemIndexByValue(value);
    },

    updateItemsStringifyCache: function(){
        var items = this.get('items'),
            that = this,
            stringify,
            value;
        this.itemsStringifyCache = {};

        items.forEach(function(item, index){
            value = that.valueByItem(item);
            stringify = JSON.stringify(value);
            that.itemsStringifyCache[stringify] = {
                item: item,
                index: index
            };
        });
    },

    clearItemsStringifyCache: function(){
        this.itemsStringifyCache = undefined;
    },

    isStringifyEqualValues: function(v1, v2){
        return JSON.stringify(v1) == JSON.stringify(v2);
    }

}, editorBaseModelMixin));

//####app/new/controls/_base/listEditorBase/listEditorBaseView.js
var ListEditorBaseView = ContainerView.extend( _.extend( {}, editorBaseViewMixin, {

    initHandlersForProperties: function(){
        ContainerView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:selectedItem', this.updateSelectedItem);
    },

    updateProperties: function(){
        ContainerView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);

        this.updateSelectedItem();
    }

}));
//####app/new/controls/_base/textEditorBase/textEditorBaseControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments Control
 * @mixes editorBaseControlMixin
 */
function TextEditorBaseControl(parent) {
    _.superClass(TextEditorBaseControl, this, parent);
    this.initialize_editorBaseControl();
}

_.inherit(TextEditorBaseControl, Control);

_.extend(TextEditorBaseControl.prototype, editorBaseControlMixin);
//####app/new/controls/_base/textEditorBase/textEditorBaseModel.js
/**
 * @class
 * @augments ControlModel
 * @mixes editorBaseModelMixin
 */
var TextEditorBaseModel = ControlModel.extend(/** @lends TextEditorBaseModel.prototype */ {
    defaults: _.defaults({
            labelText: null,
            displayFormat: null,
            editMask: null
        },
        editorBaseModelMixin.defaults_editorBaseModel,
        ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }
});

_.extend(TextEditorBaseModel.prototype, editorBaseModelMixin);


//####app/new/controls/_base/textEditorBase/textEditorBaseView.js
/**
 * @class TextEditorBaseView
 * @augments ControlView
 * @mixes textEditorMixin
 * @mixed editorBaseViewMixin
 */


var TextEditorBaseView = ControlView.extend(/** @lends TextEditorBaseView.prototype */ _.extend({}, editorBaseViewMixin, {

    UI: _.extend({}, editorBaseViewMixin.UI, {
        control: '.pl-control',
        editor: '.pl-control-editor',
        label: '.pl-control-label'
    }),

    events: {
        //Обработчик для показа поля редактирования с использованием маски ввода
        'focus .pl-text-box-input': 'onFocusControlHandler',
        'mouseenter .pl-text-box-input': 'onMouseenterControlHandler'

        //@TODO Генерация событий GotFocus/LostFocus должна происходить с учетом что происходит подмена контролов
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:labelText', this.updateLabelText);
        this.listenTo(this.model, 'change:labelFloating', this.updateLabelFloating);
        this.listenTo(this.model, 'change:displayFormat', this.updateDisplayFormat);
        this.listenTo(this.model, 'change:editMask', this.updateEditMask);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);

        this.updateLabelText();
    },

    updateValue: function(){
        editorBaseViewMixin.updateValueState.call(this);
        this.ui.control.val(this.getDisplayValue());
    },

    updateLabelText: function(){
        var labelText = this.model.get('labelText');
        if(labelText){
            this.ui.label
                .text(labelText)
                .removeClass('hidden');
        }else{
            this.ui.label
                .text('')
                .addClass('hidden');
        }

    },

    updateDisplayFormat: function(){
        this.updateValue();
    },

    updateEditMask: function(){
        this.updateValue();
    },


    /**
     * Рендеринг редактора значений
     * @params {Object} options
     * @params {jQuery} options.el
     * @params {Number} options.multiline
     * @params {Number} options.lineCount
     * @params {String} options.inputType
     *
     */
    renderControlEditor: function (options) {

        options = _.defaults(options, {
            el: this.ui.editor,
            multiline: false,
            lineCount: 1,
            inputType: 'text'
        });

        //@TODO Возможно при отсутвии maskEdit поле редактирования использовать не надо?
        this.renderEditor(options);
    },

    getData: function () {
        var model = this.model;

        return _.extend({},
            ControlView.prototype.getData.call(this),
            editorBaseViewMixin.getData.call(this), {
                labelText: model.get('labelText'),
                labelFloating: model.get('labelFloating'),
                value: this.getDisplayValue()
            });
    },

    onEditorValidate: function (value) {
        return true;
    },

    getDisplayValue: function () {
        var
            model = this.model,
            value = model.get('value'),
            displayFormat = model.get('displayFormat');

        return displayFormat ? displayFormat(null, {value: value}) : value;
    }

}));

_.extend(TextEditorBaseView.prototype, textEditorMixin); //Работа с масками ввода
//####app/new/controls/GridPanel/gridPanelControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function GridPanelControl(parent) {
    _.superClass(GridPanelControl, this, parent);
}

_.inherit(GridPanelControl, ContainerControl);

_.extend(GridPanelControl.prototype,
    /** @lends GridPanelControl.prototype */
    {
        createControlModel: function () {
            return new GridPanelModel();
        },

        createControlView: function (model) {
            return new GridPanelView({model: model});
        }
    }
);


//####app/new/controls/GridPanel/gridPanelModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var GridPanelModel = ContainerModel.extend(
    /** @lends GridPanelModel.prototype */
    {
        initialize: function () {
            ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        }
    }
);
//####app/new/controls/GridPanel/gridPanelView.js
/**
 * @class
 * @augments ControlView
 */
var GridPanelView = ContainerView.extend(
    /** @lends GridPanelView.prototype */
    {
        className: 'pl-grid-panel pl-clearfix',

        columnCount: 12,

        template: {
            row: InfinniUI.Template["new/controls/GridPanel/template/row.tpl.html"]
        },

        initialize: function (options) {
            ContainerView.prototype.initialize.call(this, options);
        },

        render: function () {
            this.prerenderingActions();

            this.removeChildElements();

            this.renderItemsContents();
            this.updateProperties();
            this.trigger('render');

            this.postrenderingActions();
            return this;
        },

        renderItemsContents: function(){
            var items = this.model.get('items'),
                itemTemplate = this.model.get('itemTemplate'),
                view = this,
                row = [],
                rowSize = 0,
                element, item;

            items.forEach(function(item, i){
                element = itemTemplate(undefined, {item: item, index: i});
                var span = element.getColumnSpan();
                if (rowSize + span > view.columnCount) {
                    view.renderRow(row);
                    row.length = 0;
                    rowSize = 0;
                }

                row.push(element);
                rowSize += span;
            });

            if (row.length) {
                view.renderRow(row);
            }
        },

        renderRow: function (row) {
            var view = this;
            var $row = $(this.template.row());
            $row.append(row.map(function(element) {
                view.addChildElement(element);
                return element.render();
            }));
            this.$el.append($row);
        },

        updateGrouping: function(){}
    }
);

//####app/new/controls/TablePanel/cell/cellControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function CellControl(parent) {
    _.superClass(CellControl, this, parent);
}

_.inherit(CellControl, ContainerControl);

_.extend(CellControl.prototype,
    /** @lends CellControl.prototype */
    {
        createControlModel: function () {
            return new CellModel();
        },

        createControlView: function (model) {
            return new CellView({model: model});
        }
    }
);


//####app/new/controls/TablePanel/cell/cellModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var CellModel = ContainerModel.extend(
    /** @lends CellModel.prototype */
    {
        defaults: _.defaults({
            columnSpan: 1
        }, ContainerModel.prototype.defaults),

        initialize: function () {
            ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        }
    }
);
//####app/new/controls/TablePanel/cell/cellView.js
/**
 * @class
 * @augments ControlView
 */
var CellView = ContainerView.extend(
    /** @lends CellView.prototype */
    {
        className: 'pl-cell',

        initialize: function (options) {
            ContainerView.prototype.initialize.call(this, options);

            this.initColumnSpan();
        },

        render: function () {
            this.prerenderingActions();

            this.removeChildElements();

            this.renderItemsContents();

            this.updateProperties();
            this.trigger('render');

            this.postrenderingActions();
            return this;
        },

        renderItemsContents: function(){
            var items = this.model.get('items'),
                itemTemplate = this.model.get('itemTemplate'),
                that = this,
                element, item;

            items.forEach(function(item, i){
                element = itemTemplate(undefined, {item: item, index: i});
                that.addChildElement(element);
                that.$el
                    .append(element.render());
            });
        },

        initColumnSpan: function () {
            this.listenTo(this.model, 'change:columnSpan', this.updateColumnSpan);
            this.updateColumnSpan();
        },

        updateColumnSpan: function () {
            var columnSpan = this.model.get('columnSpan'),
                currentColumnSpan = this.columnSpan;

            if(columnSpan != currentColumnSpan){

                if(currentColumnSpan){
                    this.$el
                        .removeClass('col-xs-' + currentColumnSpan);
                }

                this.$el
                    .addClass('col-xs-' + columnSpan);

                this.columnSpan = columnSpan;
            }

        },

        updateGrouping: function(){}
    }
);

//####app/new/controls/TablePanel/row/RowControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function RowControl(parent) {
    _.superClass(RowControl, this, parent);
}

_.inherit(RowControl, ContainerControl);

_.extend(RowControl.prototype,
    /** @lends RowControl.prototype */
    {
        createControlModel: function () {
            return new RowModel();
        },

        createControlView: function (model) {
            return new RowView({model: model});
        }
    }
);


//####app/new/controls/TablePanel/row/rowModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var RowModel = ContainerModel.extend(
    /** @lends RowModel.prototype */
    {
        initialize: function () {
            ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        }
    }
);
//####app/new/controls/TablePanel/row/rowView.js
/**
 * @class
 * @augments ControlView
 */
var RowView = ContainerView.extend(
    /** @lends RowView.prototype */
    {
        className: 'pl-row row',

        initialize: function (options) {
            ContainerView.prototype.initialize.call(this, options);
        },

        render: function () {
            this.prerenderingActions();

            this.removeChildElements();

            this.renderItemsContents();

            this.updateProperties();
            this.trigger('render');

            this.postrenderingActions();
            return this;
        },

        renderItemsContents: function(){
            var items = this.model.get('items'),
                itemTemplate = this.model.get('itemTemplate'),
                that = this,
                element, item;

            items.forEach(function(item, i){
                element = itemTemplate(undefined, {item: item, index: i});
                that.addChildElement(element);
                that.$el
                    .append(element.render());
            });
        },

        updateGrouping: function(){}
    }
);

//####app/new/controls/TablePanel/tablePanelControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function TablePanelControl(parent) {
    _.superClass(TablePanelControl, this, parent);
}

_.inherit(TablePanelControl, ContainerControl);

_.extend(TablePanelControl.prototype,
    /** @lends TablePanelControl.prototype */
    {
        createControlModel: function () {
            return new TablePanelModel();
        },

        createControlView: function (model) {
            return new TablePanelView({model: model});
        }
    }
);


//####app/new/controls/TablePanel/tablePanelModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var TablePanelModel = ContainerModel.extend(
    /** @lends TablePanelModel.prototype */
    {
        initialize: function () {
            ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        }
    }
);
//####app/new/controls/TablePanel/tablePanelView.js
/**
 * @class
 * @augments ControlView
 */
var TablePanelView = ContainerView.extend(
    /** @lends TablePanelView.prototype */
    {
        className: 'pl-table-panel',

        initialize: function (options) {
            ContainerView.prototype.initialize.call(this, options);
        },

        render: function () {
            this.prerenderingActions();

            this.removeChildElements();

            this.renderItemsContents();
            this.updateProperties();
            this.trigger('render');

            this.postrenderingActions();
            return this;
        },

        renderItemsContents: function(){
            var items = this.model.get('items'),
                itemTemplate = this.model.get('itemTemplate'),
                that = this,
                element, item;

            items.forEach(function(item, i){
                element = itemTemplate(undefined, {item: item, index: i});
                that.addChildElement(element);
                that.$el
                    .append(element.render());
            });
        },

        updateGrouping: function(){}
    }
);

//####app/new/controls/button/buttonControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments Control
 */
function ButtonControl(viewMode) {
    _.superClass(ButtonControl, this, viewMode);
}

_.inherit(ButtonControl, Control);

_.extend(ButtonControl.prototype, {

    createControlModel: function () {
        return new ButtonModel();
    },

    createControlView: function (model, viewMode) {
        if(!viewMode || ! viewMode in window.InfinniUI.Button){
            viewMode = 'common';
        }

        var ViewClass = window.InfinniUI.Button.viewModes[viewMode];

        return new ViewClass({model: model});
    }

}, buttonControlMixin);


//####app/new/controls/button/buttonModel.js
/**
 * @class
 * @augments ControlModel
 */
var ButtonModel = ControlModel.extend({

    defaults: _.defaults({
        content: null,
        contentTemplate: null

    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
    }

});
//####app/new/controls/button/commonView/buttonView.js
/**
 * @class ButtonView
 * @augments ControlView
 */
var CommonButtonView = ControlView.extend({

    className: 'pl-button',

    template: InfinniUI.Template["new/controls/button/commonView/template/button.tpl.html"],

    UI: {
        button: 'button'
    },

    events: {
        'click button': 'onClickHandler'
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);

        this.updateContent();
    },

    updateContent: function(){
        var contentTemplate = this.model.get('contentTemplate');
        var content = this.model.get('content');
        var args = {
            content: content
        };
        var contentElement;
        var $button = this.getButtonElement();

        if(contentTemplate){
            contentElement = contentTemplate(null, args);
            $button.html(contentElement.render());

        }else if(content !== undefined && content !== null){
            $button.html(content);
        }
    },

    updateText: function(){
        var textForButton = this.model.get('text');
        if (typeof textForButton == 'string'){
            this.getButtonElement().html(textForButton);
        }
    },

    updateEnabled: function(){
        ControlView.prototype.updateEnabled.call(this);

        var isEnabled = this.model.get('enabled');
        this.getButtonElement().prop('disabled', !isEnabled);
    },

    updateBackground: function () {
        var customStyle = this.model.get('background');

        if (this.currentBackground) {
            this.ui.button
                .removeClass(this.valueToBackgroundClassName(this.currentBackground));
        }

        if (customStyle) {
            this.ui.button
                .addClass(this.valueToBackgroundClassName(customStyle));
        }

        this.currentBackground = customStyle;
    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.template);
        this.updateProperties();
        this.trigger('render');

        this.postrenderingActions();
        return this;
    },

    getButtonElement: function(){
        return this.ui.button;
    }

});


InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Button.viewModes.common', CommonButtonView);

//####app/new/controls/button/linkView/buttonView.js
/**
 * @class ButtonView
 * @augments ControlView
 */
var LinkButtonView = CommonButtonView.extend({

    tagName: 'a',

    className: 'pl-button',

    attributes: {
        href: 'javascript:;'
    },

    events: {
        'click': 'onClickHandler'
    },

    template: function(){return '';},

    UI: {
    },

    updateBackground: function () {
        var customStyle = this.model.get('background');

        if (this.currentBackground) {
            this.$el
                .removeClass(this.valueToBackgroundClassName(this.currentBackground));
        }

        if (customStyle) {
            this.$el
                .addClass(this.valueToBackgroundClassName(customStyle));
        }

        this.currentBackground = customStyle;
    },

    //updateForeground: function () {
    //    var customStyle = this.model.get('foreground');
    //
    //    if (this.currentBackground) {
    //        this.ui.button
    //            .removeClass(this.valueToBackgroundClassName(this.currentBackground));
    //    }
    //
    //    if (customStyle) {
    //        this.ui.button
    //            .addClass(this.valueToBackgroundClassName(customStyle));
    //    }
    //
    //    this.currentBackground = customStyle;
    //},

    getButtonElement: function(){
        return this.$el;
    }

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Button.viewModes.link', LinkButtonView);
//####app/new/controls/button/menuItemView/buttonView.js
/**
 * @class ButtonView
 * @augments ControlView
 */
var MenuItemButtonView = LinkButtonView.extend({

    updateHorizontalAlignment: function(){
        var horizontalAlignment = this.model.get('horizontalAlignment');
        var that = this;
        var $el;

        this.whenReady(
            function(){
                $el = that.$el.parent().parent();
                return $el.length > 0;
            },

            function(){
                if(horizontalAlignment == 'Right'){
                    $el
                        .addClass('pull-right');
                }else{
                    $el
                        .removeClass('pull-right');
                }
            }
        );

    },

    whenReady: function(conditionFunction, onConditionFunction, n){
        var that = this;

        if(n === undefined){
            n = 100;
        }

        if(!conditionFunction()){
            if(n>0){
                setTimeout( function(){
                    that.whenReady(conditionFunction, onConditionFunction, n-1);
                }, 10);
            }
        }else{
            onConditionFunction();
        }
    }

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Button.viewModes.menuItem', MenuItemButtonView);
//####app/new/controls/checkBox/checkBoxControl.js
function CheckBoxControl(parent) {
    _.superClass(CheckBoxControl, this, parent);
    this.initialize_editorBaseControl();
}

_.inherit(CheckBoxControl, Control);

_.extend(CheckBoxControl.prototype, {

    createControlModel: function () {
        return new CheckBoxModel();
    },

    createControlView: function (model) {
        return new CheckBoxView({model: model});
    }
}, editorBaseControlMixin);


//####app/new/controls/checkBox/checkBoxModel.js
var CheckBoxModel = ControlModel.extend( _.extend({

    defaults: _.defaults({
        value: false
    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }

}, editorBaseModelMixin));
//####app/new/controls/checkBox/checkBoxView.js
/**
 * @class CheckBoxView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var CheckBoxView = ControlView.extend(/** @lends CheckBoxView.prototype */ _.extend({}, editorBaseViewMixin, {

    template: InfinniUI.Template["new/controls/checkBox/template/checkBox.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        text: 'span',
        input: 'input'
    }),

    events: {
        'click input': 'onClickHandler'
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (focusable) {
            this.ui.input.attr('tabindex', 0);
        } else {
            this.ui.input.removeAttr('tabindex');
        }
    },

    updateText: function () {
        var text = this.model.get('text');

        this.ui.text.text(text ? text : '');
    },

    updateEnabled: function () {
        ControlView.prototype.updateEnabled.call(this);
        var enabled = this.model.get('enabled');
        this.ui.input.prop('disabled', !enabled);
    },

    render: function () {
        this.prerenderingActions();
        this.renderTemplate(this.template);
        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    },

    onClickHandler: function () {
        var model = this.model;

        var enabled = model.get('enabled');
        if (enabled) {
            model.set('value', !model.get('value'));
        }
    },

    updateValue: function () {
        var value = this.model.get('value');
        this.ui.input.prop('checked', !!value);
    }
}));

//####app/new/controls/comboBox/comboBoxControl.js
function ComboBoxControl(viewMode) {
    _.superClass(ListBoxControl, this, viewMode);
}

_.inherit(ComboBoxControl, ListEditorBaseControl);

_.extend(ComboBoxControl.prototype, {

    createControlModel: function () {
        return new ComboBoxModel();
    },

    createControlView: function (model) {
        return new ComboBoxView({model: model});
    }
});


//####app/new/controls/comboBox/comboBoxModel.js
var ComboBoxModel = ListEditorBaseModel.extend({

    defaults: _.defaults({
        showClear: true,
        autocomplete: false,
        valueTemplate: function(context, args){
            return {
                render: function(){
                    return args.value;
                }
            };
        }
    }, ListEditorBaseModel.prototype.defaults),

    initialize: function () {
        ListEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    toggleItem: function (item, toggle) {
        var value = this.valueByItem(item);
        this.toggleValue(value, toggle);
        this.trigger('toggle');
    }
});
//####app/new/controls/comboBox/comboBoxView.js
var ComboBoxView = ListEditorBaseView.extend({

    className: 'pl-combobox form-group',

    template: InfinniUI.Template["new/controls/comboBox/template/combobox.tpl.html"],

    events: {
        'click .pl-combobox__grip': 'onClickGripHandler',
        'click .pl-combobox__value': 'onClickValueHandler',
        'click .pl-combobox__clear': 'onClickClearHandler'
    },

    UI: _.defaults({
        label: '.pl-control-label',
        value: '.pl-combobox__value',
        clear: '.pl-combobox__clear'
    }, ListEditorBaseView.prototype.UI),

    initialize: function (options) {
        ListEditorBaseView.prototype.initialize.call(this, options);
        var model = this.model,
            view = this;
        this.on('render', function () {
            view.renderValue();
            model.on('change:dropdown', function (model, dropdown) {
                if (dropdown) {
                    model.set('search', '');//Сброс фильтра
                    if (view.dropDownView) {
                        view.dropDownView.remove();
                    }
                    var dropdownView = new ComboBoxDropdownView({
                        model: model
                    });
                    view.dropDownView = dropdownView;

                    this.listenTo(dropdownView, 'search', _.debounce(view.onSearchValueHandler.bind(view), 300));

                    var $dropdown = dropdownView.render();

                    var rect = view.$el[0].getBoundingClientRect();
                    //@TODO Вынести общие стили в css
                    var style = {
                        position: "absolute",
                        top: window.pageYOffset + rect.bottom/* + parseInt(view.$el.css('margin-bottom'))*/,
                        left: window.pageXOffset + rect.left,
                        width: rect.width
                    };
                    //@TODO Добавить алгоритм определения куда расхлапывать список вверх/вниз
                    //Для расхлопывания вверх:
                    //bottom: pageYOffset - rect.height
                    //Для расхлопывания вниз:
                    //top: window.pageYOffset + rect.bottom

                    $dropdown.css(style);
                    $('body').append($dropdown);
                    if (!model.get('multiSelect')) {
                        dropdownView.setSearchFocus();
                    }
                }
            });
            model.onValueChanged(this.onChangeValueHandler.bind(this));

        }, this);
    },

    initHandlersForProperties: function(){
        ListEditorBaseView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:showClear', this.updateShowClear);
    },

    render: function () {
        this.prerenderingActions();

        //var preparedItems = this.strategy.prepareItemsForRendering();
        //var template = this.strategy.getTemplate();

        //this.removeChildElements();

        this.renderTemplate(this.getTemplate());

        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        return this;
    },

    getTemplate: function () {
        return this.template;
    },

    onClickClearHandler: function () {
        this.model.set('value', null);
    },

    onClickGripHandler: function () {
        var enabled = this.model.get('enabled');
        if (enabled) {
            this.toggleDropdown();
        }
    },

    updateProperties: function(){
        ListEditorBaseView.prototype.updateProperties.call(this);

        this.updateLabelText();
        this.updateShowClear();
    },

    updateGrouping: function(){
        this.toggleDropdown(false);
    },

    updateLabelText: function () {
        var labelText = this.model.get('labelText');
        if (labelText && labelText !== '') {
            this.ui.label.text(labelText);
            this.ui.label.toggleClass('hidden', false);
        } else {
            this.ui.label.toggleClass('hidden', true);
        }

    },

    updateEnabled: function () {
        ListEditorBaseView.prototype.updateEnabled.call(this);

        var enabled = this.model.get('enabled');

    },

    updateValue: function(){
        this.updateShowClear();
    },

    updateShowClear: function () {
        var
            model = this.model,
            showClear = model.get('showClear'),
            value = model.get('value'),
            noValue = value === null || typeof value === 'undefined';

        this.ui.clear.toggleClass('hidden', !showClear || noValue);
    },

    updateSelectedItem: function () {

    },

    toggleDropdown: function (toggle) {
        var model = this.model;
        if (typeof toggle === 'undefined') {
            toggle = !model.get('dropdown');
        }
        model.set('dropdown', toggle);
    },

    onChangeValueHandler: function () {
        this.renderValue();
    },

    rerender: function () {

    },

    renderValue: function () {
        var model = this.model,
            multiSelect = model.get('multiSelect'),
            value = this.model.get('value'),
            $value = [],
            valueTemplate = this.model.get('valueTemplate');

        if (multiSelect && Array.isArray(value)) {
            var valueView = new ComboBoxValues({
                items: value.map(function(val, i) {
                    return {
                        "$value": valueTemplate(null, {value: val, index: i}).render(),
                        "value": val,
                        "index": i
                    };
                })
            });
            valueView.listenTo(model, 'toggle', valueView.setFocus);
            this.listenTo(valueView, 'remove', this.onRemoveValueHandler);
            this.listenTo(valueView, 'search', _.debounce(this.onSearchValueHandler.bind(this), 300));
            $value = valueView.render();
        } else {
            $value = valueTemplate(null, {value: value}).render();
        }
        this.ui.value.empty();
        this.ui.value.append($value);

        editorBaseViewMixin.updateValueState.call(this);
    },

    onRemoveValueHandler: function (value) {
        this.model.toggleValue(value, false);
    },

    /**
     * @description Устанока фильтра быстрого выбора элемента из списка
     * @param {string} text
     */
    onSearchValueHandler: function (text) {
        this.toggleDropdown(true);
        this.model.set('search', text);
    },

    onClickValueHandler: function (event) {
        var enabled = this.model.get('enabled');

        if (enabled) {
            this.toggleDropdown(true);
        }
    }

});
//####app/new/controls/comboBox/dropdown/comboBoxDropdownView.js
var ComboBoxDropdownView = Backbone.View.extend({

    className: "pl-dropdown-container",
    events: {
        'click .backdrop': 'onClickBackdropHandler',
        //'keypress .pl-combobox-search-text': 'onKeyPressHandler',
        //'keydown .pl-combobox-search-text': 'onKeyDownHandler',
        'keyup .pl-combobox-filter-text': 'onKeyUpHandler'
    },

    UI: {
        items: '.pl-combobox-items',
        filter: '.pl-combobox-filter',
        text: '.pl-combobox-filter-text',
        noItems: '.pl-combobox-items-empty',
        search: '.pl-combobox-items-empty > span'
    },

    initialize: function () {
        var isGrouped = this.model.get('groupValueSelector') != null;

        if (isGrouped) {
            this.strategy = new ComboBoxGroupViewStrategy(this);
        } else {
            this.strategy = new ComboBoxPlainViewStrategy(this);
        }

        this.listenTo(this.model, 'change:dropdown', this.onChangeDropdownHandler);
        this.listenTo(this.model, 'change:search', this.onChangeSearchHandler);
        this.listenTo(this.model, 'change:autocomplete', this.updateAutocomplete);
        this.listenTo(this.strategy, 'click', this.onClickItemHandler);
        this.model.onValueChanged(this.onChangeValueHandler.bind(this));

        var items = this.model.get('items');

        var view = this;
        items.onChange(function () {
            view.renderItems();
        });
    },

    updateProperties: function () {
        this.updateAutocomplete();
    },

    render: function () {
        var template = this.strategy.getTemplate();
        this.$el.html(template({
            multiSelect: this.model.get('multiSelect')
        }));
        this.bindUIElements();
        this.updateProperties();
        this.renderItems();
        return this.$el;
    },

    renderItems: function () {
        var $items = this.strategy.renderItems();
        this.$items = $items;
        var items = this.model.get('items');

        var noItems = (items && items.length == 0);
        this.ui.noItems.toggleClass('hidden', !noItems);

        this.markCheckedItems();
    },

    setItemsContent: function (content) {
        var $items = this.ui.items;
        $items.empty();
        $items.append(content);
    },

    close: function () {
        this.model.set('dropdown', false);
    },

    setSearchFocus: function () {
        this.ui.text.focus();
    },

    onClickBackdropHandler: function () {
        this.close();
    },

    onChangeValueHandler: function () {
        this.markCheckedItems();
    },

    markCheckedItems: function () {
        var model = this.model;
        var value = model.getValue();

        if (!Array.isArray(this.$items)) {
            return;
        }

        var $items = this.$items;
        var isMultiSelect = !!model.get('multiSelect');
        var items = [];

        if (isMultiSelect && Array.isArray(value)) {
            items = value.map(function (val) {
                return model.itemByValue(val);
            });
        } else {
            items = [model.itemByValue(value)];
        }

        $items.forEach(function ($item) {
            var selected = items.indexOf($item.data('pl-data-item')) !== -1;
            $item.toggleClass('pl-combobox-selected', selected);
        });
    },

    onChangeDropdownHandler: function (model, dropdown) {
        if (!dropdown) {
            this.remove();
        }
    },

    updateAutocomplete: function () {
        var autocomplete = this.model.get('autocomplete');
        this.ui.filter.toggleClass('hidden', !autocomplete);
    },

    onClickItemHandler: function (item) {
        var model = this.model;

        model.toggleItem(item);
        this.close();
    },

    onKeyUpHandler: function (event) {
        //@TODO grow input
        var text = this.ui.text.val();
        this.trigger('search', text);
    },

    onChangeSearchHandler: function (model, value) {
        this.ui.search.text(value);
    }

});

_.extend(ComboBoxDropdownView.prototype, bindUIElementsMixin);
//####app/new/controls/comboBox/dropdown/group/groupView.js
var ComboBoxGroupView = Backbone.View.extend({

    template: InfinniUI.Template["new/controls/comboBox/dropdown/group/template/template.tpl.html"],

    UI: {
        header: '.pl-combobox-group__header',
        items: '.pl-combobox-group__items'
    },

    initialize: function (options) {
        this.options = {
            header: options.header,
            items: options.items
        };

    },

    render: function () {
        var options = this.options;
        this.$el.html(this.template());
        this.bindUIElements()
        this.ui.header.append(options.header);
        this.ui.items.append(options.items);

        return this.$el;
    }

});

_.extend(ComboBoxGroupView.prototype, bindUIElementsMixin);
//####app/new/controls/comboBox/dropdown/viewBaseStrategy.js
/**
 * @abstract
 * @param dropdownView
 * @constructor
 */
function ComboBoxBaseViewStrategy(dropdownView) {
    this.dropdownView = dropdownView;
}

/**
 *
 * @param {string} attributeName
 * @returns {*}
 */
ComboBoxBaseViewStrategy.prototype.getModelAttribute = function (attributeName) {
    var model = this.dropdownView.model;

    return model.get(attributeName);
};

/**
 * @description Рендеринг элементов списка
 * @abstract
 * @returns {Array.<jQuery>} Элементы списка
 */
ComboBoxBaseViewStrategy.prototype.renderItems = function () {
    throw new Error('Method renderItems not implemented');
};

/**
 * @abstract
 */
ComboBoxBaseViewStrategy.prototype.getTemplate = function () {

};

/**
 * Рендеринг заданных элементов списка
 * @param {Array.<Object>} items
 * @returns {Array.<jQuery>}
 * @private
 */
ComboBoxBaseViewStrategy.prototype._renderItems = function (items) {
    var
        $items,
        collection = this.getModelAttribute('items'),
        itemTemplate = this.getModelAttribute('itemTemplate');

    $items = items.map(function (item) {
        var $item = itemTemplate(undefined, {
            value: item,
            index: collection.indexOf(item)
        }).render();

        if (typeof item !== 'undefined') {
            $item.data('pl-data-item', item);
        }

        this.addOnClickEventListener($item, item);
        return $item;
    }, this);

    return $items;
};

ComboBoxBaseViewStrategy.prototype.toggle

/**
 *
 * @param {jQuery} $el
 */
ComboBoxBaseViewStrategy.prototype.addOnClickEventListener = function ($el) {
    var el = $el[0];
    var params = Array.prototype.slice.call(arguments, 1);
    var handler = this.trigger.bind(this, 'click');
    el.addEventListener('click', function () {
        handler.apply(this, params);
    });
};

_.extend(ComboBoxBaseViewStrategy.prototype, Backbone.Events);
//####app/new/controls/comboBox/dropdown/viewGroupStrategy.js
/**
 *
 * @param {ComboBoxDropdownView} dropdownView
 * @augments ComboBoxBaseViewStrategy
 * @constructor
 */
function ComboBoxGroupViewStrategy(dropdownView) {
    ComboBoxBaseViewStrategy.call(this, dropdownView);
}

ComboBoxGroupViewStrategy.prototype = Object.create(ComboBoxBaseViewStrategy.prototype);
ComboBoxGroupViewStrategy.prototype.constructor = ComboBoxGroupViewStrategy;

ComboBoxGroupViewStrategy.prototype.template = InfinniUI.Template["new/controls/comboBox/dropdown/template/group/template.tpl.html"];

ComboBoxGroupViewStrategy.prototype.renderItems = function () {
    var
        collection = this.getModelAttribute('items'),
        groupingFunction = this.getModelAttribute('groupValueSelector'),
        groups = {},
        $items;

    collection.forEach(function (item, index) {
        var groupKey = groupingFunction(undefined, {value: item, index: index});

        if (!(groupKey in groups)) {
            groups[groupKey] = [];
        }

        groups[groupKey].push(item);
    });

    $items = this.renderGroups(groups);
    return $items;
};

/**
 * @description Рендереинг группированных элементов
 * @param {Array.<Object>} groups
 * @returns {Array.<jQuery>} Элементы групп
 */
ComboBoxGroupViewStrategy.prototype.renderGroups = function (groups) {
    var
        groupItemTemplate = this.getModelAttribute('groupItemTemplate'),
        collection = this.getModelAttribute('items'),
        $items= [],
        $groupItems,
        $groups = [];

    for (var name in groups) {
        var items = groups[name];
        //Шаблонизированный заголовок группы
        var $header = groupItemTemplate(undefined, {
                index: collection.indexOf(items[0]),
                item: items[0]
            }
        );
        //Шаблонизированные элементы группы
        var $groupItems = this._renderItems(items);

        var groupView = new ComboBoxGroupView({
            header: $header.render(),
            items: $groupItems
        });

        Array.prototype.push.apply($items, $groupItems);
        $groups.push(groupView.render());
    }

    this.dropdownView.setItemsContent($groups);

    return $items;
};


ComboBoxGroupViewStrategy.prototype.getTemplate = function () {
    return this.template;
};


//####app/new/controls/comboBox/dropdown/viewPlainStrategy.js
/**
 *
 * @param {ComboBoxDropdownView} dropdownView
 * @augments ComboBoxBaseViewStrategy
 * @constructor
 */
function ComboBoxPlainViewStrategy(dropdownView) {
    ComboBoxBaseViewStrategy.call(this, dropdownView);
}

ComboBoxPlainViewStrategy.prototype = Object.create(ComboBoxBaseViewStrategy.prototype);
ComboBoxPlainViewStrategy.prototype.constructor = ComboBoxPlainViewStrategy;

ComboBoxPlainViewStrategy.prototype.renderItems = function () {
    var
        $items = [],
        items = this.getModelAttribute('items');

    if (items) {
        $items = this._renderItems(items.toArray());
    }

    this.dropdownView.setItemsContent($items);

    return $items;
};

ComboBoxPlainViewStrategy.prototype.template = InfinniUI.Template["new/controls/comboBox/dropdown/template/plain/template.tpl.html"];

ComboBoxPlainViewStrategy.prototype.getTemplate = function () {
    return this.template;
};

//####app/new/controls/comboBox/values/ComboBoxValue.js
var ComboBoxValueModel = Backbone.Model.extend({

});

var ComboBoxValue = Backbone.View.extend({

    template: InfinniUI.Template["new/controls/comboBox/values/template/value.tpl.html"],

    tagName: 'li',

    className: 'pl-combobox-value',

    events: {
        "click .pl-combobox-value-remove": "onClickRemoveHandler"
    },

    UI: {
        item: '.pl-combobox-value-item'
    },

    initialize: function (options) {
        this.model = new ComboBoxValueModel(options);
    },

    render: function () {
        this.$el.html(this.template());

        this.bindUIElements();
        var $value = this.model.get('$value');
        this.ui.item.append($value);
        return this.$el;
    },

    onClickRemoveHandler: function () {
        var value = this.model.get('value');
        this.trigger('remove', value);
    }

});

_.extend(ComboBoxValue.prototype, bindUIElementsMixin);
//####app/new/controls/comboBox/values/ComboBoxValues.js
var ComboBoxValuesModel = Backbone.Model.extend({
    defaults: {
        enabled: true
    },

    initialize: function () {
        this.items = [];
    }
});

var ComboBoxValues = Backbone.View.extend({

    tagName: 'ul',

    className: 'pl-combobox-values',

    template: InfinniUI.Template["new/controls/comboBox/values/template/values.tpl.html"],

    events: {
        'keypress .pl-combobox-search-text': 'onKeyPressHandler',
        'keydown .pl-combobox-search-text': 'onKeyDownHandler',
        'keyup .pl-combobox-search-text': 'onKeyUpHandler',
        'click': 'onClickHandler'
    },

    UI: {
        search: ".pl-combobox-search",
        text: ".pl-combobox-search-text"
    },

    initialize: function (options) {
        this.model = new ComboBoxValuesModel(options);
    },

    render: function () {

        this.$el.empty();

        this.$el.html(this.template());
        this.bindUIElements();

        var model = this.model;
        var $items =
            model.get('items')
                .map(function(item) {
                    var view = new ComboBoxValue({
                        "$value": item.$value,
                        "value": item.value
                    });

                    this.listenTo(view, 'remove', this.onRemoveValueHandler);
                    return view.render();
                }, this);

        this.ui.search.before($items);

        return this.$el;
    },

    KeyCode: {
        enter: 13,
        backspace: 8,
        left: 37,
        right: 39,
        home: 36,
        end: 35,
        tab: 9
    },

    setFocus: function () {
        this.ui.text.focus();
    },

    onKeyPressHandler: function (event) {
        var key = event.which;

        if (key === this.KeyCode.enter) {

        }

        console.log('onKeyPressHandler', event.which, this.ui.text.val());
    },

    onKeyDownHandler: function (event) {
        //handle left/right/tab/Shift-tab/backspace/end/home
        var key = event.which;
        if (key === this.KeyCode.left) {

        } else {

        }
        console.log('onKeyDownHandler', event.which, this.ui.text.val());
    },

    onKeyUpHandler: function (event) {
        //@TODO grow input
        var text = this.ui.text.val();
        this.trigger('search', text);
    },

    onRemoveValueHandler: function (value) {
        this.trigger('remove', value);
    },

    onClickHandler: function (event) {
        this.setFocus();
    }

});

_.extend(ComboBoxValues.prototype, bindUIElementsMixin);
//####app/new/controls/dataGrid/dataGridControl.js
/**
 *
 * @constructor
 * @augments ListEditorBaseControl
 */
function DataGridControl() {
    _.superClass(DataGridControl, this);
}

_.inherit(DataGridControl, ListEditorBaseControl);

_.extend(DataGridControl.prototype, {

    createControlModel: function () {
        return new DataGridModel();
    },

    createControlView: function (model) {
        return new DataGridView({model: model});
    }
});


//####app/new/controls/dataGrid/dataGridModel.js
/**
 * @constructor
 * @augments ListEditorBaseModel
 */
var DataGridModel = ListEditorBaseModel.extend({
    defaults: _.defaults({
        showSelectors: true
    }, ListEditorBaseModel.prototype.defaults),

    initialize: function () {
        ListEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        this.initColumns();
    },

    /**
     * @protected
     */
    initColumns: function () {
        this.set('columns', new Collection());
    }
});
//####app/new/controls/dataGrid/dataGridRow/dataGridRowControl.js
/**
 *
 * @constructor
 * @augments ListEditorBaseControl
 */
function DataGridRowControl() {
    _.superClass(DataGridRowControl, this);
}

_.inherit(DataGridRowControl, Control);

_.extend(DataGridRowControl.prototype, {

    onToggle: function (handler) {
        this.controlView.on('toggle', handler);
    },

    createControlModel: function () {
        return new DataGridRowModel();
    },

    createControlView: function (model) {
        return new DataGridRowView({model: model});
    }
});


//####app/new/controls/dataGrid/dataGridRow/dataGridRowModel.js
var DataGridRowModel = ControlModel.extend({

});
//####app/new/controls/dataGrid/dataGridRow/dataGridRowView.js
var DataGridRowView = ControlView.extend({

    className: 'pl-datagrid-row',

    classNameSelected: 'info',

    tagName: 'tr',

    events: {},

    template: {
        singleSelect: InfinniUI.Template["new/controls/dataGrid/dataGridRow/template/singleSelect.tpl.html"],
        multiSelect: InfinniUI.Template["new/controls/dataGrid/dataGridRow/template/multiSelect.tpl.html"]
    },

    UI: {
        toggleCell: '.pl-toggle-cell',
        toggle: '.toggle'
    },

    initialize: function () {
        ControlView.prototype.initialize.call(this);
        this.on('render', function () {
            this.ui.toggle.on('click', this.onToggleHandler.bind(this));
        }, this);
    },

    initHandlersForProperties: function () {
        ControlView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:toggle', this.updateToggle);
        this.listenTo(this.model, 'change:selected', this.updateSelected);
    },

    updateProperties: function () {
        ControlView.prototype.updateProperties.call(this);
        this.updateToggle();
        this.updateSelected();
        this.updateShowSelectors();
    },

    render: function () {
        this.prerenderingActions();
        var $el = this.$el;


        var templateName = this.model.get('multiSelect') ? 'multiSelect' : 'singleSelect';
        var template = this.template[templateName];
        $el.html(template());
        this.bindUIElements();

        var templates = this.model.get('cellTemplates');
        if (Array.isArray(templates)) {
            templates.forEach(function (template) {
                var $cell = $('<td></td>');
                $cell.append(template().render());
                $el.append($cell);
            });
        }
        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        return this;
    },

    updateShowSelectors: function () {
        var showSelectors = this.model.get('showSelectors');
        this.ui.toggleCell.toggleClass('hidden', !showSelectors);
    },

    updateToggle: function () {
        var toggle = this.model.get('toggle');
        this.ui.toggle.prop('checked', !!toggle);
    },

    updateSelected: function () {
        var selected = this.model.get('selected');
        this.$el.toggleClass(this.classNameSelected, !!selected);
    },

    onToggleHandler: function (event) {
        this.trigger('toggle');
    }

});


//####app/new/controls/dataGrid/dataGridView.js
/**
 * @constructor
 * @augments ListEditorBaseView
 */
var DataGridView = ListEditorBaseView.extend({

    template: InfinniUI.Template["new/controls/dataGrid/template/dataGrid.tpl.html"],

    className: 'pl-datagrid',

    events: {},

    UI: _.defaults({
        header: 'tr',
        toggleCell: ".pl-toggle-cell",
        items: 'tbody'
    }, ListEditorBaseView.prototype.UI),

    initialize: function (options) {
        ListEditorBaseView.prototype.initialize.call(this, options);
        this.childElements = new HashMap();
    },

    updateProperties: function () {
        ListEditorBaseView.prototype.updateProperties.call(this);
        this.updateShowSelectors();
    },

    updateShowSelectors: function () {
        var showSelectors = this.model.get('showSelectors');
        this.ui.toggleCell.toggleClass('hidden', !showSelectors);
    },

    updateGrouping: function () {

    },

    updateValue: function () {
        var
            model = this.model,
            value = model.get('value'),
            indices = [],
            items = model.get('items');

        if(!model.get('multiSelect') && value !== undefined && value !== null){
            value = [value];
        }

        if (Array.isArray(value)) {
            indices = value.map(function (val) {
                    return model.itemIndexByValue(val);
                })
                .filter(function (index) {
                    return index !== -1;
                });
        }

        this.childElements.forEach(function (rowElement, item) {
            var index = items.indexOf(item);
            var toggle = indices.indexOf(index) !== -1;
            rowElement.toggle(toggle);
        });

    },

    updateSelectedItem: function () {
        var
            model = this.model,
            selectedItem = model.get('selectedItem');

        this.childElements.forEach(function (rowElement, item) {
            rowElement.setSelected(item === selectedItem);
        });

    },

    render: function () {
        this.prerenderingActions();

        this.$el.html(this.template());

        this.bindUIElements();

        this.renderHeaders();
        this.renderItems();
        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        return this;


    },

    renderHeaders: function () {
        var columns = this.model.get('columns');

        var $headers = columns.toArray().map(function (column) {
            var $th = $('<th></th>');

            var headerTemplate = column.getHeaderTemplate();
            var header = column.getHeader();

            var headerElement;

            if (headerTemplate) {
                headerElement = headerTemplate(null, {value: header});
                $th.append(headerElement.render());

            } else {
                $th.append(header);
            }
            return $th;
        });

        this.ui.header.append($headers);
    },

    renderItems: function () {
        var
            model = this.model,
            itemTemplate = model.get('itemTemplate'),
            items = model.get('items'),
            $items = this.ui.items;

        this.removeChildElements();
        items.forEach(function (item, index) {
            var element = itemTemplate(undefined, {index: index, item: item});

            element.onBeforeClick(function() {
                model.set('selectedItem', item);
            });
            element.onToggle(function() {
                model.toggleValue(item);
            });
            this.addChildElement(item, element);
            $items.append(element.render());
        }, this);

    },

    addChildElement: function(item, element){
        this.childElements.add(item, element);
    },

    removeChildElements: function () {
        this.childElements.clear(function (element) {
            element.remove();
        });
    }


});



//####app/new/controls/dataNavigation/buttons/dataNavigationBaseButton.js
var DataNavigationBaseButtonModel = Backbone.Model.extend({

    initialize: function () {
        this.on('change:parent', this.subscribeToParent, this);
    },

    subscribeToParent: function () {

    }
});

var DataNavigationBaseButton = Backbone.View.extend({

    tagName: 'li',

    initialize: function (options) {
        Backbone.View.prototype.initialize.call(this, options);
        this.once('render', function () {
            this.initHandlersForProperties()
        }, this);
    },

    initHandlersForProperties: function () {

    },

    updateProperties: function () {

    },

    getData: function () {
        return this.model.toJSON();
    },

    setParent: function (parent) {
        this.model.set('parent', parent);
        this.subscribeForParent(parent);
    },

    render: function () {
        var template = this.template(this.getData());
        this.$el.html(template);
        this.trigger('render');
        this.updateProperties();
        return this;
    },

    subscribeForParent: function (parent) {

    }

});


//####app/new/controls/dataNavigation/buttons/dataNavigationNextButton.js
var DataNavigationNextButton = DataNavigationBaseButton.extend({

    template: InfinniUI.Template["new/controls/dataNavigation/buttons/template/next.tpl.html"],

    events: {
        "click": "onClickHandler"
    },

    initialize: function (options) {
        this.model = new DataNavigationBaseButtonModel();
        DataNavigationBaseButton.prototype.initialize.call(this, options);
    },

    onClickHandler: function (event) {
        this.trigger('command', "next");
    }

});

//####app/new/controls/dataNavigation/buttons/dataNavigationPageButton.js
var DataNavigationPageButton = DataNavigationBaseButton.extend({
    template: InfinniUI.Template["new/controls/dataNavigation/buttons/template/page.tpl.html"],

    events: {
        "click": "onClickHandler"
    },

    initialize: function (options) {
        this.model = new DataNavigationPageButtonModel();
        DataNavigationBaseButton.prototype.initialize.call(this, options);
        this.model.set('pageNumber', options.pageNumber);
    },

    initHandlersForProperties: function () {
        DataNavigationBaseButton.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:isCurrent', this.updateIsCurrent);
    },

    updateProperties: function () {
        DataNavigationBaseButton.prototype.updateProperties.call(this);
        this.updateIsCurrent();
    },

    updateIsCurrent: function () {
        this.$el.toggleClass('active', this.model.get('isCurrent'));
    },

    onClickHandler: function (event) {
        this.trigger('command', "page", {pageNumber: this.model.get('pageNumber')});
    }

});


var DataNavigationPageButtonModel = DataNavigationBaseButtonModel.extend({

    defaults: {
        isCurrent: false
    },

    subscribeToParent: function () {
        DataNavigationBaseButtonModel.prototype.subscribeToParent.call(this);

        var parent = this.get('parent');
        this.listenTo(parent.model, 'change:pageNumber', function () {
            this.updateIsCurrent();
        });
        this.updateIsCurrent();
    },

    updateIsCurrent: function () {
        var parent = this.get('parent');
        var isCurrent = parent.model.get('pageNumber') === this.get('pageNumber');
        this.set("isCurrent", isCurrent);
    }

});
//####app/new/controls/dataNavigation/buttons/dataNavigationPrevButton.js
var DataNavigationPrevButton = DataNavigationBaseButton.extend({

    template: InfinniUI.Template["new/controls/dataNavigation/buttons/template/prev.tpl.html"],

    events: {
        "click": "onClickHandler"
    },

    initialize: function (options) {
        this.model = new DataNavigationBaseButtonModel();
        DataNavigationBaseButton.prototype.initialize.call(this, options);
    },

    onClickHandler: function (event) {
        this.trigger('command', "prev");
    }

});

//####app/new/controls/dataNavigation/dataNavigationButtonFactory.js
function DataNavigationButtonFactory (dataNavigation) {

    this._dataNavigation = dataNavigation;
}

DataNavigationButtonFactory.prototype.buttons = {
    "prev": DataNavigationPrevButton,
    "page": DataNavigationPageButton,
    "next": DataNavigationNextButton
};

DataNavigationButtonFactory.prototype.createButton = function (type, options) {

    var buttonConstructor = this.buttons[type];
    if (typeof buttonConstructor !== 'function') {
        console.error('Wrong button type: ' + type);
        return;
    }

    var button = new buttonConstructor(options);
    button.setParent(this._dataNavigation);
    return button;
};
//####app/new/controls/dataNavigation/dataNavigationControl.js
function DataNavigationControl (parent) {
    _.superClass(DataNavigationControl, this, parent);
}

_.inherit(DataNavigationControl, Control);

_.extend(DataNavigationControl.prototype, {

    createControlModel: function () {
        return new DataNavigationModel();
    },

    createControlView: function (model) {
        return new DataNavigationView({model: model});
    },

    onPageNumberChanged: function (handler) {
        this.controlModel.onPageNumberChanged(handler);
    },

    onPageSizeChanged: function (handler) {
        this.controlModel.onPageSizeChanged(handler);
    }

});
//####app/new/controls/dataNavigation/dataNavigationModel.js
var DataNavigationModel = ControlModel.extend({

    defaults: _.defaults({
            pageNumber: 0,
            pageStart: 0,
            _buttonsCount: 5,
            _buttonsTemplate: ['prev', 'page', 'next']
        },
        ControlModel.prototype.defaults
    ),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.set('availablePageSizes', new Collection());
        this.on('change:pageNumber', this.updatePageStart, this);
        this.on('change:pageSize', this.updatePageSize, this);
    },

    updatePageStart: function () {
        var
            pageNumber = this.get('pageNumber'),
            pageStart = this.get('pageStart'),
            buttonsCount = this.get('_buttonsCount');

        if (pageNumber + 1 >= pageStart + buttonsCount) {
            //Выбрана последняя страница по кнопкам навигации. переместить ее в центр
            pageStart = pageStart + Math.floor(buttonsCount / 2);
        } else if (pageNumber === pageStart) {
            //Сдвинуть кнопки навигации вправо, чтобы выбранная страница была в центре
            pageStart = Math.max(0, pageStart - Math.floor(buttonsCount / 2));
        } else if (pageNumber + 1 < pageStart) {
            pageStart = Math.max(0, pageNumber - 1);
        }
        this.set('pageStart', pageStart);
    },

    updatePageSize: function () {
        //сьрос навигации
        this.set('pageNumber', 0);
    },

    nextPage: function () {
        var pageNumber = this.get('pageNumber');
        this.set('pageNumber', pageNumber + 1);
    },

    prevPage: function () {
        var pageNumber = this.get('pageNumber');
        if (pageNumber > 0) {
            this.set('pageNumber', pageNumber - 1);
        }
    },

    onPageNumberChanged: function (handler) {
        this.on('change:pageNumber', function (model, value) {
            handler.call(null, {value: value});
        });
    },

    onPageSizeChanged: function (handler) {
        this.on('change:pageSize', function (model, value) {
            handler.call(null, {value: value});
        });
    }

});
//####app/new/controls/dataNavigation/dataNavigationView.js
var DataNavigationView = ControlView.extend({

    template: InfinniUI.Template["new/controls/dataNavigation/template/dataNavigation.tpl.html"],

    className: 'pl-data-navigation',

    UI: {
        buttons: 'ul',
        sizes: '.pl-page-size'
    },

    initialize: function (options) {
        ControlView.prototype.initialize.call(this, options);
        this._childViews = [];
        this.buttonsFactory = new DataNavigationButtonFactory(this);
        this._pageSizes = new DataNavigationPageSizes();
        this._pageSizes.setParent(this);
    },

    initHandlersForProperties: function() {
        ControlView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:pageStart', this.updateButtons);
    },

    updateProperties: function() {
        ControlView.prototype.updateProperties.call(this);
        this.updateButtons();
    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.template);
        this.updateProperties();
        this.trigger('render');
        this.renderPageSizes();
        this.postrenderingActions();
        return this;
    },

    renderPageSizes: function () {
        this.ui.sizes.append(this._pageSizes.render().$el);
    },

    renderButtons: function () {
        var
            template = this.model.get('_buttonsTemplate'),
            buttonsCount = this.model.get('_buttonsCount'),
            buttons;

        this._removeChildViews();

        var
            buttonsFactory = this.buttonsFactory,
            model = this.model;

        buttons = template.reduce(function (buttons, buttonType) {
            if (buttonType === 'page') {
                var pageNumber = model.get('pageNumber');
                var pageStart = model.get('pageStart');
                for (var i = 0; i < buttonsCount; i = i + 1) {
                    var button = buttonsFactory.createButton(buttonType, {pageNumber: pageStart + i});
                    buttons.push(button)
                }
            } else {
                var button = buttonsFactory.createButton(buttonType);
                buttons.push(button);
            }

            return buttons;
        }, []);

        var $buttons = buttons.map(function (button) {
            this.listenTo(button, 'command', this.onCommandHandler);
            this._appendChildView(button);
            return button.render().$el;
        }, this);

        this.ui.buttons.append($buttons);
    },

    updateButtons: function () {
        this.renderButtons()
    },

    onCommandHandler: function (name, options) {
        switch (name) {
            case "prev":
                this.model.prevPage();
                break;
            case "next":
                this.model.nextPage();
                break;
            case "page":
                this.model.set('pageNumber', options.pageNumber);
                break;
        }
    },

    _removeChildViews: function () {
        this._childViews.forEach(function (view) {
            this.stopListening(view);
            view.remove();
        }, this);
        this._childViews.length = 0;
    },

    _appendChildView: function (view) {
        this._childViews.push(view);
    }

});

//####app/new/controls/dataNavigation/pageSizes/dataNavigationPageSizes.js
var DataNavigationPageSizes = Backbone.View.extend({

    className: "btn-group",

    template: InfinniUI.Template["new/controls/dataNavigation/pageSizes/template/pageSizes.tpl.html"],

    events: {
        "click button": "onClickButtonHandler"
    },

    setParent: function (parent) {
        this.model = parent.model;
        var collection = this.model.get('availablePageSizes');
        collection.onChange(this.onAvailablePageSizesChanged.bind(this));
        this.model.on('change:pageSize', this.renderButtons, this);
    },

    render: function () {
        this.renderButtons();
        return this;
    },

    renderButtons: function () {
        var collection = this.model.get('availablePageSizes');
        var pageSize = this.model.get('pageSize');

        var html = collection.toArray().map(function (size) {
            return this.template({size: size, active: pageSize === size});
        }, this);

        this.$el.html(html);
    },

    onAvailablePageSizesChanged: function () {
        this.renderButtons();
    },

    onClickButtonHandler: function (event) {
        var $el = $(event.target);

        var pageSize = parseInt($el.attr('data-size'), 10);
        this.model.set('pageSize', pageSize);
    }

});

//####app/new/controls/datePicker/components/base/datePickerComponent.js
var DatePickerComponent = Backbone.View.extend({

    modelClass: Backbone.Model,

    initialize: function (options) {
        var modelClass = this.modelClass;

        this.model = new modelClass({
            today: new Date(),
            value: options.value,
            date: options.date,
            max: options.max,
            min: options.min
        });
        this.render();
        return this;
    },

    show: function () {
        this.$el.css('display', 'block');
    },

    hide: function () {
        this.$el.css('display', 'none');
    },

    /**
     * @description Установка текущего положения списка выбора значений
     * Если устанавливается недействительная дата - используется текущая
     * @param date
     */
    setDate: function (date) {
        if (typeof date == 'undefined' || date === null){
            var value = this.model.get('value'),
                today = this.model.get('today');

            date = value || today;
        } else {
            date = new Date(date);
        }
        this.model.set('date', date);
    }

});


_.extend(DatePickerComponent.prototype, bindUIElementsMixin);
//####app/new/controls/datePicker/components/base/datePickerComponentModel.js
var DatePickerComponentModel = Backbone.Model.extend({

    initialize: function () {
        this.on('change:date', this.onChangeDateHandler, this);
    },

    onChangeDateHandler: function (model, value) {
        if (typeof value !== 'undefined' && value !== null) {
            model.set({
                year: moment(value).year(),
                month: moment(value).month(),
                day: moment(value).date(),
                hour: moment(value).hour(),
                minute: moment(value).minute(),
                second: moment(value).second(),
                millisecond: moment(value).millisecond()
            })
        } else {
            model.set({
                year: null,
                month: null,
                day: null,
                hour: null,
                minute: null,
                second: null,
                millisecond: null
            });
        }
    },

    updateDatePart: function (datePart, model, value) {
        var
            d = this.get('date'),
            date = new Date(d),
            data = this.toJSON();

        switch (datePart) {
            case 'hour':
            case 'minute':
            case 'second':
                date.setHours(data.hour, data.minute, data.second);
                break;
            case 'year':
            case 'month':
            case 'day':
                date.setFullYear(data.year, data.month, data.day);
                break;
        }
        this.set('date', date);
    },

    checkRange: function (value) {
        return true;
    }


});


//####app/new/controls/datePicker/components/datePickerDays.js
var DatePickerDaysModel = DatePickerComponentModel.extend({
    defaults: function () {
        var today = moment();

        return {
            today: today.toDate(),
            todayMonth: today.month(),
            todayDay: today.date(),
            todayYear: today.year()
        }
    },

    initialize: function () {
        DatePickerComponentModel.prototype.initialize.call(this);
        this.on('change:year', this.updateDatePart.bind(this, 'year'));
        this.on('change:month', this.updateDatePart.bind(this, 'month'));
        this.on('change:day', this.updateDatePart.bind(this, 'day'));
    },

    today: function () {
        this.set({
            year: this.get('todayYear'),
            month: this.get('todayMonth')
        });
    },

    nextMonth: function () {
        var
            month = this.get('month'),
            year = this.get('year');

        this.set({
            month: month === 11 ? 0 : month + 1,
            year: month === 11 ? year + 1 : year
        });
    },

    prevMonth: function () {
        var
            month = this.get('month'),
            year = this.get('year');

        this.set({
            month: month === 0 ? 11 : month - 1,
            year: month === 0 ? year - 1 : year
        });
    },

    checkRange: function (value) {
        var min = this.get('min'),
            max = this.get('max'),
            success = true;

        var mMin = moment(min),
            mMax = moment(max),
            mVal = moment(value);

        if (!isEmpty(min) && !isEmpty(max)) {
            success = mVal.isBetween(min, max, 'day') || mVal.isSame(mMin, 'day') || mVal.isSame(mMax, 'day');
        } else if (!isEmpty(min) && isEmpty(max)) {
            success = mMin.isBefore(value, 'day') || mMin.isSame(value, 'day');
        } else if (isEmpty(min) && !isEmpty(max)) {
            success = mMax.isAfter(value, 'day') || mMax.isSame(value, 'day');
        }

        return success;

        function isEmpty(value) {
            return typeof value === 'undefined' || _.isEmpty(value);
        }

    }

});

var DatePickerDays = DatePickerComponent.extend({

    modelClass: DatePickerDaysModel,

    template: InfinniUI.Template["new/controls/datePicker/template/date/days.tpl.html"],

    UI: {
        headerDays: '.weekdays-head .day',
        calendarDays: '.day-calendar',
        year: '.years-year',
        month: '.years-month'
    },

    events: {
        'click .years': 'onYearsClickHandler',
        'click .btn-month-prev': 'prevMonth',
        'click .btn-month-next': 'nextMonth',
        'click .today-date': 'showToday',
        'click .day-calendar:not(".day-unavailable")': 'useDay',
        'click .time': 'showTime'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.fillLegend();
        this.fillCalendar();
        this.initOnChangeHandlers();
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:month', this.onChangeMonthHandler);
        this.listenTo(this.model, 'change:year', this.onChangeYearHandler);
    },

    onChangeMonthHandler: function (model, value) {
        var dateTimeFormatInfo = localized.dateTimeFormatInfo;
        this.ui.month.text(dateTimeFormatInfo.monthNames[value]);
        this.fillCalendar();
    },

    onChangeYearHandler: function (model, value) {
        this.ui.year.text(value);
        this.fillCalendar();
    },

    fillLegend: function () {
        var date = new Date();

        var dateTimeFormatInfo = localized.dateTimeFormatInfo;
        var firstDayOfWeek = dateTimeFormatInfo.firstDayOfWeek;
        var days = dateTimeFormatInfo.abbreviatedDayNames.map(function (day, i) {
            return i;
        });

        if (firstDayOfWeek > 0) {
            days = days.splice(firstDayOfWeek).concat(days);
        }

        this.ui.headerDays.each(function (i, el) {
            var $el = $(el);
            var index = days[i];
            $el.text(dateTimeFormatInfo.abbreviatedDayNames[index]);
            markWeekend($el, index);
        });

        this.ui.calendarDays.each(function (i, el) {
            var $el = $(el);
            var index = days[i % 7];
            markWeekend($el, index);
        });

        function markWeekend($el, weekday) {
            $el.toggleClass('day-weekend', weekday === 0 || weekday === 6);
        }
    },

    fillCalendar: function () {
        var model = this.model;
        var valueDate = model.get('value');
        var month = model.get('month');
        var year = model.get('year');
        var day = model.get('day');
        var min = model.get('min');
        var max = model.get('max');
        var firstDayOfMonth = new Date(year, month, 1);
        var weekday = firstDayOfMonth.getDay();
        var dateTimeFormatInfo = localized.dateTimeFormatInfo;
        var firstDayOfWeek = dateTimeFormatInfo.firstDayOfWeek;

        var startDate = new Date(year, month, 1 - weekday + firstDayOfWeek);

        this.ui.calendarDays.each(function (i, el) {
            var $el = $(el);
            var d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            $el.text(d.getDate());
            $el.attr('data-date', moment(d).format('YYYY-MM-DD'));
            markActiveMonth($el, d.getMonth() === month);
            markToday($el, d);
            markSelected($el, d);
            markAvailable($el, d);
        });

        function markActiveMonth($el, active) {
            $el.toggleClass('day-inactive', !active);
        }

        function markToday($el, date) {
            var today = date.getMonth() === model.get('todayMonth')
                && date.getFullYear() === model.get('todayYear')
                && date.getDate() === model.get('todayDay');

            $el.toggleClass('day-today', today);
        }

        function markSelected($el, value) {
            var selected = false;

            if (valueDate) {
                selected = moment(valueDate).isSame(value, 'day');
            }

            $el.toggleClass('day-selected', selected);
        }

        function markAvailable($el, value) {
            $el.toggleClass('day-unavailable', !model.checkRange(value));
        }

    },

    onYearsClickHandler: function (event) {
        var date = this.model.get('date');

        this.trigger('year', date);
    },

    prevMonth: function () {
        this.model.prevMonth();
    },

    nextMonth: function () {
        this.model.nextMonth();
    },

    showToday: function () {
        this.today();
    },

    today: function () {
        this.model.today();
    },

    showTime: function () {
        this.trigger('time', this.model.get('value'));
    },

    useDay: function (event) {
        var $el = $(event.target),
            value = $el.attr('data-date'),
            m = moment(value, 'YYYY-MM-DD');

        this.model.set({
            year: m.year(),
            month: m.month(),
            day: m.date()
        });


        this.trigger('date', this.model.get('date'));
    }

});

//####app/new/controls/datePicker/components/datePickerHours.js
var DatePickerHoursModel = DatePickerComponentModel.extend({

    initialize: function () {
        DatePickerComponentModel.prototype.initialize.call(this);
        this.on('change:hour', this.updateDatePart.bind(this, 'hour'));
    },

    checkRange: function (value) {
        var min = this.get('min'),
            max = this.get('max'),
            success = true;

        var mMin = moment(min),
            mMax = moment(max),
            mVal = moment(value);

        [mMin, mMax].forEach(function (val) {
            val.set({
                year: mVal.year(),
                month: mVal.month(),
                date: mVal.date()
            });
        });


        if (!isEmpty(min) && !isEmpty(max)) {
            success = mVal.isBetween(mMin, mMax, 'minute') || mVal.isSame(mMin, 'minute') || mVal.isSame(mMax, 'minute');
        } else if (!isEmpty(min) && isEmpty(max)) {
            success = mMin.isBefore(value, 'minute') || mMin.isSame(value, 'minute');
        } else if (isEmpty(min) && !isEmpty(max)) {
            success = mMax.isAfter(value, 'minute') || mMax.isSame(value, 'minute');
        }

        return success;

        function isEmpty(value) {
            return typeof value === 'undefined' || _.isEmpty(value);
        }
    }

});

var DatePickerHours = DatePickerComponent.extend({

    modelClass: DatePickerHoursModel,

    template: InfinniUI.Template["new/controls/datePicker/template/time/hours.tpl.html"],

    events: {
        "click .hour:not('.hour-unavailable')": "useHour"
    },

    UI: {
        hour: '.hour'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.fillHoursTable();
        this.initOnChangeHandlers();
    },

    fillHoursTable: function () {
        //@TODO Заполнять в зависимости от формата 12/24
        var
            model = this.model,
            valueDate = model.get('value');
        var now = new Date();

        this.ui.hour.each(function (i, el) {
            var $el = $(el);
            var hour = stringUtils.padLeft(i, 2, '0');

            $el.attr('data-hour', i);
            $el.text(hour);
            markNow($el, i);
            markSelected($el, i);
            markAvailable($el, i);
        });

        function markSelected($el, value) {
            $el.toggleClass('hour-selected', now.getHours() === value);
        }

        function markNow($el, value) {
            var selected = moment(now).isSame(value, 'hour');
            $el.toggleClass('hour-today', selected);
        }

        function markAvailable($el, value) {
            var date = moment(model.get('date')).hour(value);
            $el.toggleClass('hour-unavailable', !model.checkRange(date));
        }
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:date', this.fillHoursTable);
    },

    useHour: function (event) {
        var
            $el = $(event.target),
            model = this.model,
            date = model.get('date'),
            hour = parseInt($el.attr('data-hour'), 10);

        date.setHours(hour);
        this.trigger('hour', date);
    }

});

//####app/new/controls/datePicker/components/datePickerMinutes.js
var DatePickerMinutesModel = DatePickerComponentModel.extend({

    initialize: function () {
        DatePickerComponentModel.prototype.initialize.call(this);
        this.on('change:minute', this.updateDatePart.bind(this, 'minute'));
    },

    checkRange: function (value) {
        var min = this.get('min'),
            max = this.get('max'),
            success = true;

        var mMin = moment(min),
            mMax = moment(max),
            mVal = moment(value);

        [mMin, mMax].forEach(function (val) {
            val.set({
                year: mVal.year(),
                month: mVal.month(),
                date: mVal.date()
            });
        });


        if (!isEmpty(min) && !isEmpty(max)) {
            success = mVal.isBetween(min, max, 'minute') || mVal.isSame(mMin, 'minute') || mVal.isSame(mMax, 'minute');
        } else if (!isEmpty(min) && isEmpty(max)) {
            success = mMin.isBefore(value, 'minute') || mMin.isSame(value, 'minute');
        } else if (isEmpty(min) && !isEmpty(max)) {
            success = mMax.isAfter(value, 'minute') || mMax.isSame(value, 'minute');
        }

        return success;

        function isEmpty(value) {
            return typeof value === 'undefined' || _.isEmpty(value);
        }
    }

});

var DatePickerMinutes = DatePickerComponent.extend({

    modelClass: DatePickerMinutesModel,

    template: InfinniUI.Template["new/controls/datePicker/template/time/minutes.tpl.html"],

    events: {
        "click .minute:not('.minute-unavailable')": "useMinute"
    },

    UI: {
        minute: '.minute'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.fillMinutesTable();
        this.initOnChangeHandlers();
    },

    fillMinutesTable: function () {
        var
            model = this.model,
            minute = model.get('minute');

        this.ui.minute.each(function (i, el) {
            var $el = $(el);
            var minute = $el.attr('data-minute');
            markSelected($el, parseInt(minute, 10));
            markAvailable($el, parseInt(minute, 10))
        });

        function markSelected($el, value) {
            $el.toggleClass('minute-selected', value === minute);
        }

        function markAvailable($el, value) {
            var date = moment(model.get('date')).minute(value);
            $el.toggleClass('minute-unavailable', !model.checkRange(date));
        }
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:date', this.fillMinutesTable);
    },

    useMinute: function (event) {
        var
            $el = $(event.target),
            model = this.model,
            date = model.get('date'),
            minute = parseInt($el.attr('data-minute'), 10);

        date.setMinutes(minute);
        this.trigger('minute', date);
    }

});

//####app/new/controls/datePicker/components/datePickerMonths.js
var DatePickerMonthsModel = DatePickerComponentModel.extend({

    defaults: {
        today: moment().toDate(),
        todayMonth: moment().month(),
        todayYear: moment().year()
    },

    initialize: function () {
        DatePickerComponentModel.prototype.initialize.call(this);
        this.on('change:month', this.updateDatePart.bind(this, 'month'));
        this.on('change:year', this.updateDatePart.bind(this, 'year'));
    },



    nextYear: function () {
        var year = this.get('year');
        this.set('year', year + 1);
    },

    prevYear: function () {
        var year = this.get('year');
        this.set('year', year - 1);
    },

    today: function () {
        this.set({
            month: this.get('todayMonth'),
            year: this.get('todayYear')
        });
    },

    checkRange: function (value) {
        var min = this.get('min'),
            max = this.get('max'),
            success = true;

        var mMin = moment(min),
            mMax = moment(max),
            mVal = moment(value);

        if (!isEmpty(min) && !isEmpty(max)) {
            success = mVal.isBetween(min, max, 'month') || mVal.isSame(mMin, 'month') || mVal.isSame(mMax, 'month');
        } else if (!isEmpty(min) && isEmpty(max)) {
            success = mMin.isBefore(value, 'month') || mMin.isSame(value, 'month');
        } else if (isEmpty(min) && !isEmpty(max)) {
            success = mMax.isAfter(value, 'month') || mMax.isSame(value, 'month');
        }

        return success;

        function isEmpty(value) {
            return typeof value === 'undefined' || _.isEmpty(value);
        }

    }



});

var DatePickerMonths = DatePickerComponent.extend({

    modelClass: DatePickerMonthsModel,

    template: InfinniUI.Template["new/controls/datePicker/template/date/months.tpl.html"],

    events: {
        "click .btn-year-prev": "prevYear",
        "click .btn-year-next": "nextYear",
        "click .month:not('.month-unavailable')": "useMonth",
        "click .year": "selectYear",
        "click .today-month": "showToday"
    },

    UI: {
        month: '.month',
        year: '.year'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.fillMonthsTable();
        this.initOnChangeHandlers();
    },

    fillMonthsTable: function () {
        this.ui.year.text(this.model.get('year'));

        var
            model = this.model,
            dateTimeFormatInfo = localized.dateTimeFormatInfo,
            todayMonth = model.get('todayMonth'),
            month = model.get('month');

        this.ui.month.each(function (i, el) {
            var $el = $(el);
            $el.text(dateTimeFormatInfo.abbreviatedMonthNames[i]);
            $el.attr('data-month', i);
            markTodayMonth($el, i);
            markSelected($el, i);
            markAvailable($el, i);
        });

        function markTodayMonth($el, value) {
            var date = moment([model.get('year'), value]);
            var today = model.get('today');

            $el.toggleClass('month-today', moment(date).isSame(today, 'month'));
        }

        function markSelected($el, value) {
            var date = moment([model.get('year'), value]);
            var selected = model.get('value');

            $el.toggleClass('month-selected', moment(date).isSame(selected, 'month'));
        }

        function markAvailable($el, value) {
            var date = moment([model.get('year'), value]);
            $el.toggleClass('month-unavailable', !model.checkRange(date));
        }
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:year', this.fillMonthsTable);
    },

    prevYear: function () {
        this.model.prevYear();
    },

    nextYear: function () {
        this.model.nextYear();
    },

    useMonth: function (event) {
        var
            $el = $(event.target),
            model = this.model;

        model.set({
            year: parseInt(model.get('year'), 10),
            month: parseInt($el.attr('data-month'), 10)
        });
        this.trigger('month', model.get('date'));
    },

    selectYear: function () {
        var
            model = this.model;

        this.trigger('year', model.get('data'));
    },

    showToday: function () {
        this.today();
    },

    today: function () {
        this.model.today();
    }



});

//####app/new/controls/datePicker/components/datePickerTime.js
var DatePickerTimeModel = DatePickerComponentModel.extend({

    defaults: {
        today: moment().toDate(),
        hour: moment().hour(),
        minute: moment().minute(),
        second: moment().second(),
        millisecond: moment().millisecond()
    },

    initialize: function () {
        DatePickerComponentModel.prototype.initialize.call(this);
        this.on('change:hour', this.updateDatePart.bind(this, 'hour'));
        this.on('change:minute', this.updateDatePart.bind(this, 'minute'));
        this.on('change:second', this.updateDatePart.bind(this, 'second'));
        this.on('change:millisecond', this.updateDatePart.bind(this, 'millisecond'));
    },

    nextHour: function () {
        var hour = this.get('hour');
        hour += 1;

        var value = moment().set({
            hour: hour,
            minute: this.get('minute'),
            second: this.get('second'),
            millisecond: this.get('millisecond')
        });


        //@TODO Границу использовать в зависимости от 12/24 формата записи даты из настроек локализации
        if (hour < 24) {
            this.set('hour', hour, {validate: true});
        }

    },

    prevHour: function () {
        var hour = this.get('hour');
        hour -= 1;

        if (hour >= 0) {
            this.set('hour', hour, {validate: true});
        }
    },

    nextMinute: function () {
        var minute = this.get('minute');
        minute += 1;

        if (minute < 60) {
            this.set('minute', minute, {validate: true});
        }

    },

    prevMinute: function () {
        var minute = this.get('minute');
        minute -= 1;

        if (minute >= 0) {
            this.set('minute', minute, {validate: true});
        }
    },

    validate: function (attr, options) {
        var value = moment().set({
            hour: attr.hour,
            minute: attr.minute,
            second: attr.second,
            millisecond: attr.millisecond
        });

        if (!this.checkRange(value)) {
            return 'Out of range';
        }
    },

    checkRange: function (value) {
        var min = this.get('min'),
            max = this.get('max'),
            success = true;

        var mMin = moment(min),
            mMax = moment(max),
            mVal = moment(value);

        [mMin, mMax].forEach(function (val) {
            val.set({
                year: mVal.year(),
                month: mVal.month(),
                date: mVal.date()
            });
        });


        if (!isEmpty(min) && !isEmpty(max)) {
            success = mVal.isBetween(min, max, 'minute') || mVal.isSame(mMin, 'minute') || mVal.isSame(mMax, 'minute');
        } else if (!isEmpty(min) && isEmpty(max)) {
            success = mMin.isBefore(value, 'minute') || mMin.isSame(value, 'minute');
        } else if (isEmpty(min) && !isEmpty(max)) {
            success = mMax.isAfter(value, 'minute') || mMax.isSame(value, 'minute');
        }

        return success;

        function isEmpty(value) {
            return typeof value === 'undefined' || _.isEmpty(value);
        }

    }


});

var DatePickerTime = DatePickerComponent.extend({

    modelClass: DatePickerTimeModel,

    template: InfinniUI.Template["new/controls/datePicker/template/time/time.tpl.html"],

    events: {
        "click .time-spin-down.time-spin-hour": "prevHour",
        "click .time-spin-up.time-spin-hour": "nextHour",
        "click .time-spin-down.time-spin-minute": "prevMinute",
        "click .time-spin-up.time-spin-minute": "nextMinute",
        "click .time-segment-hour": "selectHour",
        "click .time-segment-minute": "selectMinute",
        "click .days": "selectDay"
    },

    UI: {
        month: '.month',
        year: '.year',
        hour: '.time-segment-hour',
        minute: '.time-segment-minute'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.updateHour();
        this.updateMinute();
        this.initOnChangeHandlers();
    },

    selectHour: function () {
        var
            model = this.model,
            date = model.get('date'),
            hour = model.get('hour'),
            minute = model.get('minute'),
            second = model.get('second');

        date.setHours(hour, minute, second);
        this.trigger('hour', date);
    },

    selectMinute: function () {
        var
            model = this.model,
            date = model.get('date'),
            hour = model.get('hour'),
            minute = model.get('minute'),
            second = model.get('second');

        date.setHours(hour, minute, second);
        this.trigger('minute', date);
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:hour', this.updateHour);
        this.listenTo(this.model, 'change:minute', this.updateMinute);
        this.listenTo(this.model, 'change:date', this.useTime);
    },

    updateHour: function () {
        var hour = this.model.get('hour');
        this.ui.hour.text(stringUtils.padLeft(hour, 2, '0'));
    },

    updateMinute: function () {
        var minute = this.model.get('minute');
        this.ui.minute.text(stringUtils.padLeft(minute, 2, '0'));
    },

    prevHour: function () {
        this.model.prevHour();
    },

    nextHour: function () {
        this.model.nextHour();
    },

    prevMinute: function () {
        this.model.prevMinute();
    },

    nextMinute: function () {
        this.model.nextMinute();
    },

    useTime: function () {
        var
            date = this.model.get('date');

        this.trigger('date', date);
    },

    selectDay: function () {
        var
            date = this.model.get('date');

        this.trigger('day', date);

    }

});

//####app/new/controls/datePicker/components/datePickerYears.js
var DatePickerYearsModel = DatePickerComponentModel.extend({

    defaults: {
        pageSize: 20,
        page: 0,
        todayYear: moment().year()
    },

    initialize: function () {
        DatePickerComponentModel.prototype.initialize.call(this);
        this.on('change:year', this.updateDatePart.bind(this, 'year'));
        this.on('change:year', this.onChangeYearHandler);
    },

    prevPage: function () {
        var page = this.get('page');
        this.set('page', page - 1);
    },

    nextPage: function () {
        var page = this.get('page');
        this.set('page', page + 1);
    },

    resetPage: function () {
        this.set('page', 0);
    },

    onChangeYearHandler: function (model, value) {
        model.set('page', 0);
    },

    checkRange: function (value) {
        var min = this.get('min'),
            max = this.get('max'),
            success = true;

        var mMin = moment(min),
            mMax = moment(max),
            mVal = moment(value);

        if (!isEmpty(min) && !isEmpty(max)) {
            success = mVal.isBetween(min, max, 'year') || mVal.isSame(mMin, 'year') || mVal.isSame(mMax, 'year');
        } else if (!isEmpty(min) && isEmpty(max)) {
            success = mMin.isBefore(value, 'year') || mMin.isSame(value, 'year');
        } else if (isEmpty(min) && !isEmpty(max)) {
            success = mMax.isAfter(value, 'year') || mMax.isSame(value, 'year');
        }

        return success;

        function isEmpty(value) {
            return typeof value === 'undefined' || _.isEmpty(value);
        }

    }
});

var DatePickerYears = DatePickerComponent.extend({

    modelClass: DatePickerYearsModel,

    template: InfinniUI.Template["new/controls/datePicker/template/date/years.tpl.html"],

    events: {
        'click .btn-year-prev': "prevPage",
        'click .btn-year-next': "nextPage",
        'click .today-year': "showTodayYear",
        'click .year:not(".year-unavailable")': "useYear"
    },

    UI: {
        years: '.year',
        yearBegin: '.year-begin',
        yearEnd: '.year-end'
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:page', this.fillYearsTable);
        this.listenTo(this.model, 'change:year', this.fillYearsTable);
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        //this.fillCalendar();
        this.fillYearsTable();
        this.initOnChangeHandlers();
    },

    fillYearsTable: function () {
        var
            model = this.model,
            page = model.get('page'),
            pageSize = model.get('pageSize'),
            year = model.get('year'),
            todayYear = model.get('todayYear'),
            //startYear = Math.ceil((year || todayYear) - pageSize / 2) + page * pageSize;
            startYear = Math.ceil(year - pageSize / 2) + page * pageSize;

        this.ui.years.each(function (i, el) {
            var $el = $(el);
            var year = startYear + i;
            $el.text(year);
            $el.attr('data-year', year);
            markTodayYear($el, year);
            markSelected($el, year);
            markAvailable($el, year);
        });

        this.ui.yearBegin.text(startYear);
        this.ui.yearEnd.text(startYear + pageSize - 1);

        function markTodayYear($el, value) {
            $el.toggleClass('year-today', value === todayYear);
        }

        function markSelected($el, value) {
            $el.toggleClass('year-selected', value === year);
        }
        function markAvailable($el, value) {
            var date = moment([value]);
            $el.toggleClass('year-unavailable', !model.checkRange(date));
        }

    },

    prevPage: function () {
        this.model.prevPage();
    },

    nextPage: function () {
        this.model.nextPage();
    },

    showTodayYear: function () {
        this.today();
    },

    today: function () {
        this.model.resetPage();
    },

    useYear: function (event) {
        var $el = $(event.target),
            model = this.model;

        model.set({
            year: parseInt($el.attr('data-year'), 10)
        });

        this.trigger('year', model.get('date'));
    }

});

//####app/new/controls/datePicker/datePickerControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBaseControl
 */
function DatePickerControl(parent) {
    _.superClass(DatePickerControl, this, parent);
}

_.inherit(DatePickerControl, TextEditorBaseControl);

_.extend(DatePickerControl.prototype, {

    createControlModel: function () {
        return new DatePickerModel();
    },

    createControlView: function (model) {
        return new DatePickerView({model: model});
    }
});


//####app/new/controls/datePicker/datePickerDropdown.js
var DatePickerDropdown = Backbone.View.extend({

    className: 'pl-datepicker-dropdown pl-dropdown-container',

    template: InfinniUI.Template["new/controls/datePicker/template/datePicker.dropdown.tpl.html"],

    UI: {
        days: '.days',
        months: '.months',
        years: '.years'
    },

    events: {
        'click .backdrop': 'onClickBackdropHandler',
        'click .datepicker-clear': 'onClickClearValueHandler',
        'click .today-date': 'onClickTodayHandler'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.renderComponents();
    },

    renderComponents: function () {
        var model = this.model;
        var value = model.get('value');
        var m = moment(value);

        if (m.isValid()) {
            value = m.toDate();
        } else {
            value = null;
        }

        var options = {
            value: value,
            //date: value,
            max: model.get('maxValue'),
            min: model.get('minValue')
        };

        options.el = this.ui.months;
        var months = new DatePickerMonths(options);

        options.el = this.ui.years;
        var years = new DatePickerYears(options);

        options.el = this.ui.days;
        var days = new DatePickerDays(options);

        this.months = months;
        this.years = years;
        this.days = days;

        this.workflow(days, months, years, value)(value);
    },

    onClickBackdropHandler: function (event) {
        this.remove();
    },

    onClickClearValueHandler: function () {
        this.clearValue();
    },

    clearValue: function () {
        this.useValue(null);
    },

    useValue: function (date) {
        this.trigger('date', date);
        this.remove();
    },

    workflow: function (days, months, years) {

        this
            .listenTo(days, 'date', this.useValue)
            .listenTo(days, 'year', function (date) {
                showYears(date);//Needed select year from list
            })
            .listenTo(years, 'year', function (date) {
                showMonths(date);//Needed select month for year
            })
            .listenTo(months, 'year', function (date) {
                showYears(date);//Needed select year from list
            })
            .listenTo(months, 'month', function (date) {
                showDays(date);//Needed select day from calendar
            });

        return showDays;

        function showDays(date) {
            days.setDate(date);

            years.hide();
            months.hide();
            days.show();
        }

        function showMonths(date) {
            months.setDate(date);

            days.hide();
            years.hide();
            months.show();
        }

        function showYears(date) {
            years.setDate(date);

            days.hide();
            months.hide();
            years.show();
        }

    },

    onClickTodayHandler: function () {
        var days = this.days,
            months = this.months,
            years = this.years,
            today = moment().toDate();

        //days.setDate(today);
        //months.setDate(today);
        //years.setDate(today);

        days.today();
        months.today();
        years.today();
    }

});

_.extend(DatePickerDropdown.prototype, bindUIElementsMixin);
//####app/new/controls/datePicker/datePickerModel.js
/**
 * @class
 * @augments TextEditorBaseModel
 */
var DatePickerModel = TextEditorBaseModel.extend(/** @lends DatePickerModel.prototype */{
    defaults: _.extend(
        {},
        TextEditorBaseModel.prototype.defaults,
        {
            mode: "Date"
        }
    ),

    initialize: function () {
        TextEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    validate: function (attributes, options) {
        var
            min = attributes.minValue,
            max = attributes.maxValue;

        //@TODO Check as DateTime
        if (isSet(min) && isSet(max)) {
            if (attributes.value < min || attributes.value > max) {
                return 'Invalid value';
            }
        } else if (isSet(min) && attributes.value < min) {
            return 'Invalid value';
        } else if (isSet(max) && attributes.value > max) {
            return 'invalid value';
        }

        function isSet(value) {
            return value !== null && typeof value !== 'undefined';
        }
    }


});
//####app/new/controls/datePicker/datePickerStrategy.js
var datePickerStrategy = {
    Date: {
        getTemplate: function () {
            return InfinniUI.Template["new/controls/datePicker/template/datePicker.tpl.html"];
        },

        onClickDropdownHandler: function (event) {
            var calendar = new DatePickerDropdown({
                model: this.model
            });

            calendar.render();
            $('body').append(calendar.$el);

            calendar.$el.css({
                top: event.clientY,
                left: event.clientX
            });

            this.listenTo(calendar, 'date', function (date) {
                this.model.set('value', this.convertValue(date));
            });
        },

        convertValue: function (value) {
            return InfinniUI.DateUtils.toISO8601(value, {resetTime: true});
        }
    },

    DateTime: {
        getTemplate: function () {
            return InfinniUI.Template["new/controls/datePicker/template/dateTimePicker.tpl.html"];
        },

        onClickDropdownHandler: function (event) {
            var calendar = new DateTimePickerDropdown({
                model: this.model
            });
            calendar.render();
            $('body').append(calendar.$el);

            calendar.$el.css({
                top: event.clientY,
                left: event.clientX
            });

            this.listenTo(calendar, 'date', function (date) {
                this.model.set('value', InfinniUI.DateUtils.toISO8601(date));
            });
        },

        convertValue: function (value) {
            return InfinniUI.DateUtils.toISO8601(value);
        }

    },

    Time: {
        getTemplate: function () {
            return InfinniUI.Template["new/controls/datePicker/template/timePicker.tpl.html"];
        },

        onClickDropdownHandler: function (event) {
            var calendar = new TimePickerDropdown({
                model: this.model
            });
            calendar.render();
            $('body').append(calendar.$el);

            calendar.$el.css({
                top: event.clientY,
                left: event.clientX
            });

            this.listenTo(calendar, 'date', function (date) {
                this.model.set('value', InfinniUI.DateUtils.toISO8601(date));
            });
        },

        convertValue: function (value) {
            return InfinniUI.DateUtils.toISO8601(value);
        }

    }

};

//####app/new/controls/datePicker/datePickerView.js
/**
 * @class
 * @augments TextEditorBaseView
 */
var DatePickerView = TextEditorBaseView.extend(/** @lends DatePickerView.prototype */{

    className: "pl-datepicker form-group",

    template: InfinniUI.Template["new/controls/datePicker/template/datePicker.tpl.html"],

    UI: _.extend({}, TextEditorBaseView.prototype.UI, {
        dropdownButton: '.pl-datepicker-calendar',
        controlWrap: '.control-wrap',
        editorWrap: '.editor-wrap'
    }),

    events: _.extend({}, TextEditorBaseView.prototype.events, {
        'focus .pl-datepicker-input': 'onFocusControlHandler',
        'mouseenter .pl-datepicker-input': 'onMouseenterControlHandler',
        'click .pl-datepicker-calendar': 'onClickDropdownHandler'
    }),

    initialize: function () {
        TextEditorBaseView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        this.updateMode();
        this.listenTo(this.model, 'change:mode', this.updateMode);
    },

    initHandlersForProperties: function(){
        TextEditorBaseView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:minValue', this.updateMinValue);
        this.listenTo(this.model, 'change:maxValue', this.updateMaxValue);
    },

    updateProperties: function(){
        TextEditorBaseView.prototype.updateProperties.call(this);
    },

    updateMode: function(){
        var mode = this.model.get('mode');
        _.extend(this, datePickerStrategy[mode]);

        this.rerender();
    },

    updateMinValue: function(){
        var mode = this.model.get('mode');
        _.extend(this, datePickerStrategy[mode]);

        this.rerender();
    },

    updateMaxValue: function(){
        var mode = this.model.get('mode');
        _.extend(this, datePickerStrategy[mode]);

        this.rerender();
    },

    updateEnabled: function(){
        TextEditorBaseView.prototype.updateEnabled.call(this);

        var isEnabled = this.model.get('enabled');
        this.ui.dropdownButton.prop('disabled', !isEnabled);
    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.getTemplate());
        this.updateProperties();
        this.renderDatePickerEditor();

        this.trigger('render');

        this.postrenderingActions();
        return this;
    },

    getData: function () {
        var
            model = this.model;

        return _.extend({},
            TextEditorBaseView.prototype.getData.call(this), {
                minValue: model.get('minValue'),
                maxValue: model.get('maxValue'),
                mode: model.get('mode')
            });
    },

    renderDatePickerEditor: function () {
        var model = this.model;
        this.renderControlEditor({
            el: this.ui.editor,
            multiline: false,
            convert: this.convertValue
        });

        return this;
    },

    /**
     * Используется миксином textEditorMixin
     * @param value
     * @returns {boolean}
     */
    onEditorValidate: function (value) {
        return true;
    },


    getTemplate: function () {
        throw new Error('Не перекрыт getTemplate');
    },

    onClickDropdownHandler: function (event) {}

});

//####app/new/controls/datePicker/dateTimePickerDropdown.js
var DateTimePickerDropdown = DatePickerDropdown.extend({

    className: 'pl-datepicker-dropdown pl-dropdown-container',

    template: InfinniUI.Template["new/controls/datePicker/template/dateTimePicker.dropdown.tpl.html"],

    UI: {
        days: '.days',
        months: '.months',
        years: '.years',
        times: '.times',
        hours: '.hours',
        minutes: '.minutes'
    },

    onClickToggleDateHandler: function () {
        this.trigger('days');
    },

    onClickToggleTimeHandler: function () {
        this.trigger('time');
    },


    renderComponents: function () {
        var model = this.model;
        var value = model.get('value');
        var m = moment(value);

        if (m.isValid()) {
            value = m.toDate();
        } else {
            value = null;
        }

        var options = {
            value: value,
            //date: value,
            max: model.get('maxValue'),
            min: model.get('minValue')
        };

        options.el = this.ui.months;
        var months = new DatePickerMonths(options);

        options.el = this.ui.years;
        var years = new DatePickerYears(options);

        options.el = this.ui.days;
        var days = new DatePickerDays(options);

        options.el = this.ui.times;
        var time = new DatePickerTime(options);
        //time.setDate(undefined);

        options.el = this.ui.hours;
        var hours = new DatePickerHours(options);

        options.el = this.ui.minutes;
        var minutes = new DatePickerMinutes(options);


        this.workflow(days, months, years, time, hours, minutes)(value);
    },

    useTime: function (date) {
        this.trigger('date', date);
    },

    workflow: function (days, months, years, time, hours, minutes) {
        var useTime = this.useTime.bind(this);
        var components = Array.prototype.slice.call(arguments);

        this
            .listenTo(days, 'date', this.useValue)
            .listenTo(days, 'year', function (date) {
                showYears(date);//Needed select year from list
            })
            .listenTo(days, 'time', function (date) {
                showTime(date);
            })
            .listenTo(years, 'year', function (date) {
                showMonths(date);//Needed select month for year
            })
            .listenTo(months, 'year', function (date) {
                showYears(date);//Needed select year from list
            })
            .listenTo(months, 'month', function (date) {
                showDays(date);//Needed select day from calendar
            });

        this.listenTo(time, 'hour', function (date) {
                showHours(date);
            })
            .listenTo(time, 'minute', function (date) {
                showMinutes(date);
            })
            .listenTo(time, 'day', function (date) {
                showDays(date);
            })
            .listenTo(time, 'date', function (date) {
                useTime(date);
            })
            .listenTo(hours, 'hour', function (date) {
                useTime(date);
                showTime(date);
            })
            .listenTo(minutes, 'minute', function (date) {
                useTime(date);
                showTime(date);
            });

        //Переключатель режима Date/Time
        this
            .on('days', function (date) {
                showDays(date);
            })
            .on('time', function (date) {
                showTime(date);
            });

        return showDays;

        function switchComponent(component) {
            components.forEach(function (c) {
                if (c !== component) {
                    c.hide();
                }
            });
            component.show();
        }

        function showDays(date) {
            days.setDate(date);
            switchComponent(days);
        }

        function showMonths(date) {
            months.setDate(date);
            switchComponent(months);
        }

        function showYears(date) {
            years.setDate(date);
            switchComponent(years);
        }

        function showHours(date) {
            hours.setDate(date);
            switchComponent(hours);
        }

        function showMinutes(date) {
            minutes.setDate(date);
            switchComponent(minutes);
        }

        function showTime(date) {
            time.setDate(date);
            switchComponent(time);
        }

    }

});
//####app/new/controls/datePicker/timePickerDropdown.js
var TimePickerDropdown = DatePickerDropdown.extend({

    className: 'pl-timepicker-dropdown pl-dropdown-container',

    template: InfinniUI.Template["new/controls/datePicker/template/timePicker.dropdown.tpl.html"],

    UI: {
        times: '.times',
        hours: '.hours',
        minutes: '.minutes'
    },

    renderComponents: function () {
        var model = this.model;
        var value = model.get('value');
        var m = moment(value);

        if (m.isValid()) {
            value = m.toDate();
        } else {
            value = null;
        }

        var options = {
            value: value,
            //date: value,
            max: model.get('maxValue'),
            min: model.get('minValue')
        };

        options.el = this.ui.times;
        var time = new DatePickerTime(options);

        options.el = this.ui.hours;
        var hours = new DatePickerHours(options);

        options.el = this.ui.minutes;
        var minutes = new DatePickerMinutes(options);


        this.workflow(time, hours, minutes)(value);
    },

    useTime: function (date) {
        this.trigger('date', date);
    },

    workflow: function (time, hours, minutes) {
        var useTime = this.useTime.bind(this);
        var components = Array.prototype.slice.call(arguments);

        this.listenTo(time, 'hour', function (date) {
            showHours(date);
        })
            .listenTo(time, 'minute', function (date) {
                showMinutes(date);
            })
            .listenTo(time, 'date', function (date) {
                useTime(date);
            })
            .listenTo(hours, 'hour', function (date) {
                useTime(date);
                showTime(date);
            })
            .listenTo(minutes, 'minute', function (date) {
                useTime(date);
                showTime(date);
            });

        return showTime;

        function switchComponent(component) {
            components.forEach(function (c) {
                if (c !== component) {
                    c.hide();
                }
            });
            component.show();
        }

        function showHours(date) {
            hours.setDate(date);
            switchComponent(hours);
        }

        function showMinutes(date) {
            minutes.setDate(date);
            switchComponent(minutes);
        }

        function showTime(date) {
            time.setDate(date);
            switchComponent(time);
        }

    }

});
//####app/new/controls/fileBox/fileBoxControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments Control
 * @mixes editorBaseControlMixin
 */
function FileBoxControl(parent) {
    _.superClass(FileBoxControl, this, parent);
    this.initialize_editorBaseControl();
}

_.inherit(FileBoxControl, Control);

_.extend(FileBoxControl.prototype, {

    createControlModel: function () {
        return new FileBoxModel();
    },

    createControlView: function (model) {
        return new FileBoxView({model: model});
    }

}, editorBaseControlMixin);


//####app/new/controls/fileBox/fileBoxModel.js
/**
 * @constructor
 * @augments ControlModel
 * @mixes editorBaseModelMixin
 */
var FileBoxModel = ControlModel.extend( _.extend({

    defaults: _.defaults({

        },
        editorBaseModelMixin.defaults_editorBaseModel,
        ControlModel.prototype.defaults
    ),
    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();

        this.set('acceptTypes', new Collection());
        this.on('change:file', this.onChangeFileHandler);

        this.on("invalid", function(model, error) {
            this.set('errorText', error);
        });
    },

    validate: function (attrs, options) {
        var file = attrs.file;
        var maxSize = this.get('maxSize');
        var acceptTypes = this.get('acceptTypes');
        if (file) {
            if (maxSize) {
                if (file.size > maxSize) {
                    return 'Размер выбранного файла ' + (file.size/(1024*1024)).toFixed(1) + 'Мб больше допустимого размера ' + (maxSize/(1024*1024)).toFixed(1) + 'Мб';
                }
            }

            if (acceptTypes.length && !acceptTypes.contains(file.type)) {
                return 'Загрузка данного типа файла не разрешена';
            }
        }
    },

    setFile: function (file) {
        if (this.set('file', file, {validate: true})) {
            this.set('errorText', '');
        }
    },

    removeFile: function () {
        this.setFile(null);
    },

    onChangeFileHandler: function (model, file) {
        if (file) {
            model.set('fileName', file.name);
            model.set('fileSize', file.size);
        } else {
            model.set('fileName', null);
            model.set('fileSize', null);
        }
        model.set('value', null);
    }

    //stopLoadingFile: function () {
    //    var fileLoader = this.fileLoader;
    //    if (fileLoader && fileLoader.state() === 'pending') {
    //        fileLoader.reject();
    //    }
    //},

    //loadPreview: function (file) {
    //    var defer = $.Deferred();
    //    var reader = new FileReader();
    //    reader.onload = (function (file) {
    //        return function (event) {
    //            defer.resolve(file, event.target.result);
    //        };
    //    }(file));
    //    reader.onerror  = function (event) {
    //        defer.reject(event);
    //    };
    //    reader.readAsDataURL(file);
    //    return defer.promise();
    //}

}, editorBaseModelMixin));
//####app/new/controls/fileBox/fileBoxView.js
/**
 * @augments ControlView
 * @mixes editorBaseViewMixin
 * @constructor
 */
var FileBoxView = ControlView.extend(/** @lends FileBoxView.prototype */ _.extend({}, editorBaseViewMixin, {

    template: InfinniUI.Template["new/controls/fileBox/template/fileBox.tpl.html"],

    className: 'pl-file-box',

    UI: _.extend({}, editorBaseViewMixin.UI, {
        input: 'input',
        link: '.pl-filebox-link',
        download: '.pl-filebox-download',
        fileSize: '.pl-filebox-size',
        file: '.pl-filebox-file',
        remove: '.pl-filebox-remove',
        empty: '.pl-filebox-empty',
        info: '.pl-filebox-info',
        gripButton: '.pl-filebox-grip'
    }),

    events: {
        'change input': 'onChangeFileHandler',
        'click .pl-filebox-remove': 'onClickRemoveImageHandler'
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:fileName', this.updateFileName);
        this.listenTo(this.model, 'change:fileSize', this.updateFileSize);
        this.listenTo(this.model, 'change:fileTime', this.updateFileTime);
        this.listenTo(this.model, 'change:fileType', this.updateFileType);
        this.listenTo(this.model, 'change:value', this.updateUrl);

        this.listenTo(this.model, 'change:hintText', this.updateHintText);
        this.listenTo(this.model, 'change:errorText', this.updateErrorText);
        this.listenTo(this.model, 'change:warningText', this.updateWarningText);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);

        this.updateFileName();
        this.updateFileSize();
        this.updateFileType();
        this.updateFileTime();
        this.updateUrl();

        this.updateHintText();
        this.updateErrorText();
        this.updateWarningText();
    },

    updateText: function () {
        var text = this.model.get('text');
        this.ui.gripButton.text(text);
    },

    updateHintText: function(){
        var hintText = this.model.get('hintText');
        if(hintText){
            this.ui.hintText
                .text(hintText)
                .removeClass('hidden');
        }else{
            this.ui.hintText
                .text('')
                .addClass('hidden');
        }

    },

    updateErrorText: function(){
        var errorText = this.model.get('errorText');
        if(errorText){
            this.ui.errorText
                .text(errorText)
                .removeClass('hidden');
        }else{
            this.ui.errorText
                .text('')
                .addClass('hidden');
        }

    },

    updateWarningText: function(){
        var warningText = this.model.get('warningText');
        if(warningText){
            this.ui.warningText
                .text(warningText)
                .removeClass('hidden');
        }else{
            this.ui.warningText
                .text('')
                .addClass('hidden');
        }

    },

    updateEnabled: function () {
        ControlView.prototype.updateEnabled.call(this);

        var isEnabled = this.model.get('enabled');
        var fileName = this.model.get('fileName');
        this.updateRemoveButtonState();
        this.ui.file.toggleClass('hidden', !isEnabled);
    },

    updateFileName: function () {
        var fileName = this.model.get('fileName');
        var enabled = this.model.get('enabled');

        this.ui.download.text(fileName);

        this.ui.empty.toggleClass('hidden', !!fileName);
        this.ui.info.toggleClass('hidden', !fileName);

        this.updateRemoveButtonState();
    },

    updateFileSize: function () {
        var fileSize = this.model.get('fileSize');

        var text = '';
        if (typeof fileSize !== 'undefined' && fileSize !== null) {
            text = InfinniUI.format.humanFileSize(fileSize);
        }
        this.ui.fileSize.text(text);
    },

    updateRemoveButtonState: function () {
        var enabled = this.model.get('enabled');
        var fileName = this.model.get('fileName');
        this.ui.remove.toggleClass('hidden', !enabled ||!fileName);
        this.ui.remove.prop('disabled', !enabled || !fileName);
    },

    updateFileTime: function () {
        var time = this.model.get('fileTime');

        //@TODO Update file's datetime on view
    },

    updateFileType: function () {
        var fileType = this.model.get('fileType');

        //@TODO Update file's mime type on view
    },

    updateUrl: function () {
        var url = this.model.get('value');
        if (!url) {
            this.ui.download.removeAttr('href');
        } else {
            this.ui.download.attr('href', url);
        }

    },

    onClickRemoveImageHandler: function () {
        this.model.removeFile();
        this.ui.input.val('');
    },

    onChangeFileHandler: function () {
        var file = null;
        var files = this.ui.input[0].files;

        if (files && files[0]) {
            file = files[0];
        }
        this.model.setFile(file);
    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.template);
        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        return this;
    }

}));

//####app/new/controls/frame/frameControl.js
/**
 *
 * @constructor
 * @augments Control
 * @mixes editorBaseControlMixin
 */
var FrameControl = function () {
    _.superClass(FrameControl, this);
    this.initialize_editorBaseControl();
};

_.inherit(FrameControl, Control);

_.extend(FrameControl.prototype, {

    createControlModel: function () {
        return new FrameModel();
    },

    createControlView: function (model) {
        return new FrameView({model: model});
    }

}, editorBaseControlMixin);
//####app/new/controls/frame/frameModel.js
var FrameModel = ControlModel.extend(_.extend({

    defaults: _.defaults({},
        editorBaseModelMixin.defaults_editorBaseModel,
        ControlModel.prototype.defaults
    ),

    initialize: function(){
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }
}, editorBaseModelMixin));
//####app/new/controls/frame/frameView.js
/**
 * @class FrameView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var FrameView = ControlView.extend(_.extend({}, editorBaseViewMixin, /** @lends FrameView.prototype */{

    className: 'pl-frame',

    template: InfinniUI.Template["new/controls/frame/template/frame.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        iframe: 'iframe'
    }),

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);
    },

    updateValue: function(){
        var value = this.model.get('value');

        this.ui.iframe.attr('src', value);
    },

    getData: function () {
        return _.extend(
            {},
            ControlView.prototype.getData.call(this),
            editorBaseViewMixin.getData.call(this),
            {

            }
        );
    },

    render: function () {
        var model = this.model;

        this.prerenderingActions();
        this.renderTemplate(this.template);

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    }

}));

//####app/new/controls/icon/iconControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments Control
 */
function IconControl() {
    _.superClass(IconControl, this);
}

_.inherit(IconControl, Control);

_.extend(IconControl.prototype, {

    createControlModel: function () {
        return new IconModel();
    },

    createControlView: function (model) {
        return new IconView({model: model});
    }

});
//####app/new/controls/icon/iconModel.js
/**
 * @class
 * @augments ControlModel
 */
var IconModel = ControlModel.extend({

    defaults: _.defaults({
        value: null

    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
    }

});
//####app/new/controls/icon/iconView.js
/**
 * @class IconView
 * @arguments ControlView
 */
var IconView = ControlView.extend({

    tagName: 'i',

    render: function(){
        this.prerenderingActions();
        
        var value = this.model.get('value');
        this.$el.attr('class', 'pl-icon fa fa-' + value);
        
        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    }

});
//####app/new/controls/imageBox/imageBoxControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments Control
 * @mixes editorBaseControlMixin
 */
function ImageBoxControl(parent) {
    _.superClass(ImageBoxControl, this, parent);
    this.initialize_editorBaseControl();
}

_.inherit(ImageBoxControl, Control);

_.extend(ImageBoxControl.prototype, {

    createControlModel: function () {
        return new ImageBoxModel();
    },

    createControlView: function (model) {
        return new ImageBoxView({model: model});
    }

}, editorBaseControlMixin);


//####app/new/controls/imageBox/imageBoxModel.js
/**
 * @constructor
 * @augments ControlModel
 * @mixes editorBaseModelMixin
 */
var ImageBoxModel = ControlModel.extend( _.extend({

    defaults: _.defaults({
            readOnly: true,
            text: 'Выбрать изображение'
        },
        editorBaseModelMixin.defaults_editorBaseModel,
        ControlModel.prototype.defaults
    ),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();

        this.set('acceptTypes', new Collection());
        this.on('change:file', this.onChangeFileHandler);

        this.on("invalid", function(model, error) {
            this.set('errorText', error);
        });
    },

    validate: function (attrs, options) {
        var file = attrs.file;
        var maxSize = this.get('maxSize');
        var acceptTypes = this.get('acceptTypes');
        if (file) {
            if (maxSize) {
                if (file.size > maxSize) {
                    return 'Размер выбранного файла ' + (file.size/(1024*1024)).toFixed(1) + 'Мб больше допустимого размера ' + (maxSize/(1024*1024)).toFixed(1) + 'Мб';
                }
            }

            if (acceptTypes.length && !acceptTypes.contains(file.type)) {
                return 'Загрузка данного типа файла не разрешена';
            }
        }
    },

    setFile: function (file) {
        if (this.set('file', file, {validate: true})) {
            this.set('errorText', '');
        }
    },

    removeFile: function () {
        this.setFile(null);
    },

    onChangeFileHandler: function (model, file) {
        this.stopLoadingFile();
        if (file) {
            var fileLoader = this.loadPreview(file);

            this.fileLoader = fileLoader;

            fileLoader.then(function (file, content) {
                model.set('value', content);
            }, function (err) {
                console.log(err);
            });
        } else {
            model.set('value', null);
        }
    },

    stopLoadingFile: function () {
        var fileLoader = this.fileLoader;
        if (fileLoader && fileLoader.state() === 'pending') {
            fileLoader.reject();
        }
    },

    loadPreview: function (file) {
        var defer = $.Deferred();
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (event) {
                defer.resolve(file, event.target.result);
            };
        }(file));
        reader.onerror  = function (event) {
            defer.reject(event);
        };
        reader.readAsDataURL(file);
        return defer.promise();
    }

}, editorBaseModelMixin));
//####app/new/controls/imageBox/imageBoxView.js
/**
 * @augments ControlView
 * @mixes editorBaseViewMixin
 * @constructor
 */
var ImageBoxView = ControlView.extend(/** @lends ImageBoxView.prototype */ _.extend({}, editorBaseViewMixin, {

    className: 'pl-imagebox',

    template: InfinniUI.Template["new/controls/imageBox/template/imageBox.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        input: 'input',
        img: 'img',
        file: '.pl-image-file',
        remove: '.pl-image-remove',
        uploadButton: '.pl-image-file-upload-button'
    }),

    events: {
        'change input': 'onChangeFileHandler',
        'click .pl-image-remove': 'onClickRemoveImageHandler'
    },


    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:value', this.updateUrl);
        this.listenTo(this.model, 'change:hintText', this.updateHintText);
        this.listenTo(this.model, 'change:errorText', this.updateErrorText);
        this.listenTo(this.model, 'change:warningText', this.updateWarningText);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);

        this.updateUrl();
        this.updateHintText();
        this.updateErrorText();
        this.updateWarningText();
    },

    updateText: function () {
        var text = this.model.get('text');
        this.ui.uploadButton.text(text);
    },

    updateEnabled: function () {
        ControlView.prototype.updateEnabled.call(this);
        var isEnabled = this.model.get('enabled');
        this.ui.input.prop('disabled', !isEnabled);
    },

    updateUrl: function () {
        var url = this.model.get('value');

        this.ui.img.attr('src', url);
        var none = url === null || typeof url === 'undefined';
        this.$el.toggleClass('pl-empty', none);
    },

    onClickRemoveImageHandler: function () {
        this.model.removeFile();
        this.ui.input.val('');
    },

    onChangeFileHandler: function () {
        var file = null;
        var files = this.ui.input[0].files;

        if (files && files[0]) {
            file = files[0];
        }
        this.model.setFile(file);
    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.template);
        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        return this;
    }

}));

//####app/new/controls/label/commonView/labelView.js
/**
 * @class LabelView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var CommonLabelView = ControlView.extend(_.extend({}, editorBaseViewMixin, /** @lends LabelView.prototype */{
    className: 'pl-label',

    template: InfinniUI.Template["new/controls/label/commonView/template/label.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        control: '.label-control'
    }),

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:displayFormat', this.updateDisplayFormat);
        this.listenTo(this.model, 'change:textWrapping', this.updateTextWrapping);
        this.listenTo(this.model, 'change:textTrimming', this.updateTextTrimming);
        this.listenTo(this.model, 'change:lineCount', this.updateLineCount);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);

        this.updateDisplayFormat();
        this.updateTextWrapping();
        this.updateTextTrimming();
        this.updateLineCount();
    },

    updateValue: function(){
        var textForLabel = this.getLabelText();
        var $label = this.getLabelElement();
        $label
            .text(textForLabel)
            .attr('title', textForLabel);
    },

    updateDisplayFormat: function(){
        this.updateValue();
    },

    updateTextWrapping: function(){
        var textWrapping = this.model.get('textWrapping');
        this.getLabelElement().toggleClass('pl-text-wrapping', textWrapping);
    },

    updateTextTrimming: function(){
        var textTrimming = this.model.get('textTrimming');
        this.getLabelElement().toggleClass('pl-text-trimming', textTrimming);
    },

    updateText: function () {
        this.updateValue();
    },

    updateLineCount: function(){

    },

    getData: function () {
        return _.extend(
            {},
            ControlView.prototype.getData.call(this),
            editorBaseViewMixin.getData.call(this),
            {
                text: this.getLabelText() 
            }
        );
    },

    render: function () {
        var model = this.model;

        this.prerenderingActions();
        this.renderTemplate(this.template);

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    },

    getLabelText: function () {
        var model = this.model;
        var value = model.get('value');
        var text;
        var format = model.get('displayFormat');

        if (typeof value !== 'undefined' && value !== null) {
            text = typeof format === 'function' ? format(null, {value: value}) : value;
        }else{
            text = this.model.get('text');
            if (typeof text === 'undefined' || text == null) {
                text = '';
            }
        }

        return text;
    },

    getLabelElement: function(){
        return this.ui.control;
    }

}));

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Label.viewModes.common', CommonLabelView);
//####app/new/controls/label/label.js
var LabelControl = function (viewMode) {
    _.superClass(LabelControl, this, viewMode);
    this.initialize_editorBaseControl();
};

_.inherit(LabelControl, Control);

_.extend(LabelControl.prototype, {

    createControlModel: function () {
        return new LabelModel();
    },

    createControlView: function (model, viewMode) {
        if(!viewMode || ! (viewMode in window.InfinniUI.Label)){
            viewMode = 'simple';
        }

        var ViewClass = window.InfinniUI.Label.viewModes[viewMode];

        return new ViewClass({model: model});
    },
    
    getDisplayValue: function () {
        return this.controlView.getLabelText();
    }

}, editorBaseControlMixin);
//####app/new/controls/label/labelModel.js
var LabelModel = ControlModel.extend(_.extend({

    defaults: _.defaults({
        horizontalTextAlignment: 'Left',
        verticalAlignment: 'Top',
        textWrapping: true,
        textTrimming: true
    }, ControlModel.prototype.defaults),

    initialize: function(){
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }
}, editorBaseModelMixin));
//####app/new/controls/label/simpleView/labelView.js
/**
 * @class SimpleLabelView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var SimpleLabelView = CommonLabelView.extend({
    tagName: 'span',

    template: function(){return '';},
    UI: _.extend({}, editorBaseViewMixin.UI, {

    }),

    getLabelElement: function(){
        return this.$el;
    }

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Label.viewModes.simple', SimpleLabelView);
//####app/new/controls/listBox/baseView/listBoxView.js
var BaseListBoxView = ListEditorBaseView.extend({

    template: {
        plain: InfinniUI.Template["new/controls/listBox/baseView/template/listBox.tpl.html"],
        grouped: InfinniUI.Template["new/controls/listBox/baseView/template/listBoxGrouped.tpl.html"]
    },


    className: 'pl-listbox',

    events: {
        'change .pl-listbox-input': 'onChangeHandler'
    },

    UI: _.defaults({
        items: '.pl-listbox-i',
        checkingInputs: '.pl-listbox-input input'
    }, ListEditorBaseView.prototype.UI),

    initialize: function (options) {
        //@TODO Реализовать обработку значений по умолчанию!
        ListEditorBaseView.prototype.initialize.call(this, options);

    },

    updateGrouping: function(){
        var isGrouped = this.model.get('groupValueSelector') != null;

        if(isGrouped){
            this.strategy = new ListBoxViewGroupStrategy(this);
        }else{
            this.strategy = new ListBoxViewPlainStrategy(this);
        }
    },

    updateValue: function(){
        this.ui.items.removeClass('pl-listbox-i-chosen');
        this.ui.checkingInputs.prop('checked', false);

        var value = this.model.get('value'),
            indexOfChoosingItem;

        if(!this.isMultiselect() && value !== undefined && value !== null){
            value = [value];
        }

        if($.isArray(value)){
            for(var i= 0, ii=value.length; i < ii; i++){
                indexOfChoosingItem = this.model.itemIndexByValue(value[i]);
                if(indexOfChoosingItem != -1){
                    this.ui.items.eq(indexOfChoosingItem).addClass('pl-listbox-i-chosen');
                    this.ui.checkingInputs.eq(indexOfChoosingItem).prop('checked', true);
                }
            }
        }
    },

    updateSelectedItem: function(ignoreWasRendered){
        if(!this.wasRendered && ignoreWasRendered != true){
            return;
        }

        this.ui.items.removeClass('pl-listbox-i-selected');

        var selectedItem = this.model.get('selectedItem'),
            indexOfItem = this.model.itemIndexByItem(selectedItem);

        if(indexOfItem >= 0){
            this.ui.items.eq(indexOfItem).addClass('pl-listbox-i-selected');
        }
    },

    render: function () {
        this.prerenderingActions();

        var preparedItems = this.strategy.prepareItemsForRendering();
        var template = this.strategy.getTemplate();

        this.removeChildElements();

        this.$el.html(template(preparedItems));
        this.bindUIElements();

        this.strategy.appendItemsContent(preparedItems);

        this.bindUIElements();

        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        return this;
    },

    getItems: function(){
        return this.model.get('items');
    },

    getItemTemplate: function(){
        return this.model.get('itemTemplate');
    },

    getGroupValueSelector: function(){
        return this.model.get('groupValueSelector');
    },

    isMultiselect: function(){
        return this.model.get('multiSelect');
    },

    getGroupItemTemplate: function(){
        return this.model.get('groupItemTemplate');
    },

    onChangeHandler: function(){
        var $checked = this.ui.checkingInputs.filter(':checked').parent().parent(),
            valueForModel = null,
            model = this.model,
            val;

        if(this.isMultiselect()){
            valueForModel = [];

            $checked.each(function(i, el){
                val = $(el).data('pl-data-item');
                valueForModel.push(model.valueByItem(val));
            });

        }else{
            if($checked.length > 0){
                valueForModel = model.valueByItem($checked.data('pl-data-item'));
            }
        }

        this.model.set('value', valueForModel);
    }
});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Listbox.viewModes.base', BaseListBoxView);
//####app/new/controls/listBox/baseView/viewGroupStrategy.js
function ListBoxViewGroupStrategy(listbox) {
    this.listbox = listbox;
};

_.extend(ListBoxViewGroupStrategy.prototype, {

    prepareItemsForRendering: function(){
        var items = this.listbox.getItems(),
            inputName = 'listbox-' + guid(),
            result = {
                isMultiselect: this.listbox.isMultiselect(),
                inputName: inputName,
                groups: []
            },
            groups = {},
            groupingFunction = this.listbox.getGroupValueSelector();

        items.forEach(function(item, index){
            var groupKey = groupingFunction(undefined, {value:item});

            if(! (groupKey in groups)){
                groups[groupKey] = [];
            }

            groups[groupKey].push(item);
        });

        for(var k in groups){
            result.groups.push({
                items: groups[k]
            })
        }

        return result;
    },

    getTemplate: function(){
        return this.listbox.template.grouped;
    },

    appendItemsContent: function(preparedItems){
        var $listbox = this.listbox.$el,
            $listboxItems = $listbox.find('.pl-listbox-body'),
            itemTemplate = this.listbox.getItemTemplate(),
            groupTitleTemplate = this.listbox.getGroupItemTemplate(),
            index = 0,
            groups = preparedItems.groups,
            listbox = this.listbox,
            itemEl, titleEl;

        $listbox.find('.pl-listbox-group-title').each(function(i, el){
            titleEl = groupTitleTemplate(undefined, {index: index, item: groups[i]});
            listbox.addChildElement(titleEl);
            $(el).append(titleEl.render());

            _.forEach( groups[i].items, function(item){
                itemEl = itemTemplate(undefined, {index: i, item: item});
                listbox.addChildElement(itemEl);
                $listboxItems.eq(index).append(itemEl.render());

                $listboxItems.eq(index).parent()
                    .data('pl-data-item', item);

                index++;
            });

        });
    }
});
//####app/new/controls/listBox/baseView/viewPlainStrategy.js
function ListBoxViewPlainStrategy(listbox) {
    this.listbox = listbox;
};

_.extend(ListBoxViewPlainStrategy.prototype, {

    prepareItemsForRendering: function(){
        var items = this.listbox.getItems(),
            inputName = 'listbox-' + guid(),
            result = {
                isMultiselect: this.listbox.isMultiselect(),
                inputName: inputName,
                items: items.toArray()
            };

        return result;
    },

    getTemplate: function(){
        return this.listbox.template.plain;
    },

    appendItemsContent: function(preparedItems){
        var $listbox = this.listbox.$el,
            itemTemplate = this.listbox.getItemTemplate(),
            items = preparedItems.items,
            listbox = this.listbox,
            itemEl, $el;

        $listbox.find('.pl-listbox-body').each(function(i, el){
            $el = $(el);
            itemEl = itemTemplate(undefined, {index: i, item: items[i]});
            listbox.addChildElement(itemEl);
            $el.append(itemEl.render());

            $el.parent().data('pl-data-item', items[i]);
        });
    }
});
//####app/new/controls/listBox/checkingView/listBoxView.js
var CheckingListBoxView = BaseListBoxView.extend({
    className: 'pl-listbox',

    template: {
        plain: InfinniUI.Template["new/controls/listBox/checkingView/template/listBox.tpl.html"],
        grouped: InfinniUI.Template["new/controls/listBox/checkingView/template/listBoxGrouped.tpl.html"]
    },

    events: _.extend( {

    }, BaseListBoxView.prototype.events),

    initialize: function (options) {
        BaseListBoxView.prototype.initialize.call(this, options);
        this.initDomHandlers();
    },

    initDomHandlers: function(){
        var $listBox = this.$el,
            that = this;

        $listBox.get(0).addEventListener('click', function(e){
            e = $.event.fix(e);
            var $el = $(e.target),
                $currentListItem, item;

            while($el.get(0) != $listBox.get(0)){
                if($el.hasClass('pl-listbox-i')){
                    $currentListItem = $el;
                }

                $el = $el.parent();
            }

            if($currentListItem && $currentListItem.length > 0){
                item = $currentListItem.data('pl-data-item');
                that.model.toggleValue(item);

                that.model.set('selectedItem', item);
            }

        }, true);
    }
});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Listbox.viewModes.checking', CheckingListBoxView);
//####app/new/controls/listBox/commonView/listBoxView.js
var CommonListBoxView = BaseListBoxView.extend({
    className: 'pl-listbox pl-listbox-common-mode',

    events: _.extend( {

    }, BaseListBoxView.prototype.events),

    initialize: function (options) {
        BaseListBoxView.prototype.initialize.call(this, options);
        this.initDomHandlers();
    },

    initDomHandlers: function(){
        var $listBox = this.$el,
            that = this;

        $listBox.get(0).addEventListener('click', function(e){
            e = $.event.fix(e);
            var $el = $(e.target),
                $currentListItem, item;

            while($el.get(0) != $listBox.get(0)){
                if($el.hasClass('pl-listbox-i')){
                    $currentListItem = $el;
                }

                $el = $el.parent();
            }

            if($currentListItem.length > 0){
                item = $currentListItem.data('pl-data-item');
                that.model.toggleValue(item);

                that.model.set('selectedItem', item);
            }

        }, true);
    }
});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'Listbox.viewModes.common', CommonListBoxView);
//####app/new/controls/listBox/listBoxControl.js
function ListBoxControl(viewMode) {
    _.superClass(ListBoxControl, this, viewMode);
}

_.inherit(ListBoxControl, ListEditorBaseControl);

_.extend(ListBoxControl.prototype, {

    createControlModel: function () {
        return new ListBoxModel();
    },

    createControlView: function (model, viewMode) {
        if(!viewMode || ! viewMode in window.InfinniUI.Listbox){
            viewMode = 'common';
        }

        var ViewClass = window.InfinniUI.Listbox.viewModes[viewMode];

        return new ViewClass({model: model});
    }
});


//####app/new/controls/listBox/listBoxModel.js
var ListBoxModel = ListEditorBaseModel.extend({
    initialize: function () {
        ListEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    }
});
//####app/new/controls/menuBar/menuBarControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function MenuBarControl(parent) {
    _.superClass(MenuBarControl, this, parent);
}

_.inherit(MenuBarControl, ContainerControl);

_.extend(MenuBarControl.prototype,
    /** @lends MenuBarControl.prototype */
    {
        createControlModel: function () {
            return new MenuBarModel();
        },

        createControlView: function (model) {
            return new MenuBarView({model: model});
        }
    }
);


//####app/new/controls/menuBar/menuBarModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var MenuBarModel = ContainerModel.extend(
    /** @lends MenuBarModel.prototype */
    {
        initialize: function () {
            ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        }
    }
);
//####app/new/controls/menuBar/menuBarView.js
/**
 * @class
 * @augments ControlView
 */
var MenuBarView = ContainerView.extend(
    /** @lends MenuBarView.prototype */
    {
        tagName: 'nav',
        className: 'pl-menu-bar navbar navbar-default',

        template: InfinniUI.Template["new/controls/menuBar/template/menuBar.tpl.html"],

        UI: {

        },

        render: function () {
            this.prerenderingActions();

            this.removeChildElements();

            this.$el.html(this.template({
                items: this.model.get('items')
            }));
            this.renderItemsContents();

            this.bindUIElements();

            this.updateProperties();
            this.trigger('render');

            this.postrenderingActions();
            return this;
        },

        renderItemsContents: function(){
            var $items = this.$el.find('.pl-menu-bar-item'),
                items = this.model.get('items'),
                itemTemplate = this.model.get('itemTemplate'),
                that = this,
                element, item;

            $items.each(function(i, el){
                item = items.getByIndex(i);
                element = itemTemplate(undefined, {item: item, index: i});
                that.addChildElement(element);
                $(el)
                    .append(element.render());
            });
        },

        updateGrouping: function(){}
    }
);

//####app/new/controls/numericBox/numericBoxControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBaseControl
 */
function NumericBoxControl(parent) {
    _.superClass(NumericBoxControl, this, parent);
}

_.inherit(NumericBoxControl, TextEditorBaseControl);

_.extend(NumericBoxControl.prototype, {

    createControlModel: function () {
        return new NumericBoxModel();
    },

    createControlView: function (model) {
        return new NumericBoxView({model: model});
    }
});


//####app/new/controls/numericBox/numericBoxModel.js
/**
 * @class
 * @augments TextEditorBaseModel
 */
var NumericBoxModel = TextEditorBaseModel.extend(/** @lends TextBoxModel.prototype */{
    defaults: _.extend(
        {},
        TextEditorBaseModel.prototype.defaults,
        {
            increment: 1
        }
    ),

    transformValue: function (value) {
        if (typeof value !== 'undefined' && value !== null) {
            var value = +value;
            if (isNaN(value) || !isFinite(value)) {
                value = null;
            }
        }
        return value;
    },

    initialize: function () {
        TextEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    validate: function (attributes, options) {
        var
            min = attributes.minValue,
            max = attributes.maxValue;

        if (isSet(min) && isSet(max)) {
            if (attributes.value < min || attributes.value > max) {
                return 'Invalid value';
            }
        } else if (isSet(min) && attributes.value < min) {
                return 'Invalid value';
        } else if (isSet(max) && attributes.value > max) {
            return 'invalid value';
        }

        function isSet(value) {
            return value !== null && typeof value !== 'undefined';
        }
    }


});
//####app/new/controls/numericBox/numericBoxView.js
/**
 * @class
 * @augments TextEditorBaseView
 */
var NumericBoxView = TextEditorBaseView.extend(/** @lends TextBoxView.prototype */{

    className: "pl-numericbox form-group",

    template: InfinniUI.Template["new/controls/numericBox/template/numericBox.tpl.html"],

    UI: _.extend({}, TextEditorBaseView.prototype.UI, {
        min: '.pl-numeric-box-min',
        max: '.pl-numeric-box-max'
    }),

    events: _.extend({}, TextEditorBaseView.prototype.events, {
        'focus .pl-numeric-box-input': 'onFocusControlHandler',
        'mouseenter .pl-numeric-box-input': 'onMouseenterControlHandler',
        'click .pl-numeric-box-min': 'onClickMinControlHandler',
        'click .pl-numeric-box-max': 'onClickMaxControlHandler',
        'mousedown .pl-numeric-box-min': 'onMousedownMinControlHandler',
        'mousedown .pl-numeric-box-max': 'onMousedownMaxControlHandler'
    }),

    render: function () {
        this.prerenderingActions();
        this.renderTemplate(this.template);
        this.renderNumericBoxEditor();
        this.updateProperties();
        this.trigger('render');
        this.postrenderingActions();
        return this;
    },

    getData: function () {
        var
            model = this.model;

        return _.extend({},
            TextEditorBaseView.prototype.getData.call(this), {
                minValue: model.get('minValue'),
                maxValue: model.get('maxValue'),
                increment: model.get('increment')
            });
    },

    renderNumericBoxEditor: function () {
        var model = this.model;

        this.renderControlEditor({
            el: this.ui.editor,
            multiline: false,
            lineCount: 1,
            inputType: model.get('inputType')
        });

        return this;
    },

    onChangeEnabledHandler: function (model, value) {
        this.ui.control.prop('disabled', !value);
        this.ui.min.prop('disabled', !value);
        this.ui.max.prop('disabled', !value);
    },

    onClickMinControlHandler: function () {
        var increment = this.model.get('increment');
        this.addToValue(increment * -1);
    },

    onClickMaxControlHandler: function () {
        var increment = this.model.get('increment');
        this.addToValue(increment);
    },

    onMousedownMinControlHandler: function (event) {
        var el = event.target,
            increment = this.model.get('increment');

        this.repeatAddToValue(el, increment * -1);
    },

    onMousedownMaxControlHandler: function (event) {
        var el = event.target,
            increment = this.model.get('increment');

        this.repeatAddToValue(el, increment);
    },

    repeatAddToValue: function (el, delta) {
        var
            numericBox = this,
            intervalId;

        window.document.addEventListener('mouseup', stopRepeat);

        intervalId = setInterval(function () {
            numericBox.addToValue(delta);
        }, 200);

        function stopRepeat() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            window.document.removeEventListener('mouseup', stopRepeat);
        }
    },

    addToValue: function (delta) {
        var value = this.model.get('value');

        value = (value === null || typeof value === 'undefined') ? 0 : parseInt(value, 10);

        if (!isFinite(value)) {
            return;
        }

        value = value + delta;
        this.model.set('value', value, {validate: true});
    },

    /**
     * Используется миксином textEditorMixin
     * @param value
     * @returns {boolean}
     */
    onEditorValidate: function (value) {
        return true;
    }

});

//####app/new/controls/panel/panelControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function PanelControl(parent) {
    _.superClass(PanelControl, this, parent);
}

_.inherit(PanelControl, ContainerControl);

_.extend(PanelControl.prototype, /** @lends PanelControl.prototype */ {
    createControlModel: function () {
        return new PanelModel();
    },

    createControlView: function (model) {
        return new PanelView({model: model});
    }

});


//####app/new/controls/panel/panelModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var PanelModel = ContainerModel.extend(/** @lends PanelModel.prototype */ {
    initialize: function () {
        ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        this.on('change:collapsed', function (model, value) {
            model.trigger(value ? 'collapsed' : 'expanded', null, {});
        });
    },

    defaults: _.defaults({
        collapsible: false,
        collapsed: false
    }, ContainerModel.prototype.defaults),

    set: function (key, val, options) {
        if (key == null) return this;

        var attrs;
        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        var oldValue, newValue;
        if ('collapsed' in attrs) {
            //Вызов обработчиков перед collapsing/expanding
            oldValue = this.get('collapsed');
            newValue = attrs.collapsed;
            var allow;

            if (newValue && !oldValue) {
                allow = this
                    .set('_collapsing', true, {validate: false})
                    .trigger('collapsing', null, {})
                    .get('_collapsing');
            } else if (!newValue && oldValue) {
                allow = this
                    .set('_expanding', true, {validate: false})
                    .trigger('expanding', null, {})
                    .get('_expanding');
            }
            if (allow === false) {
                //Если collapsing/expanding отменен в обработчиках collapsing/expanding - не меняем collapsed
                delete attrs.collapsed;
            }
        }
        return ContainerModel.prototype.set.call(this, attrs, options);
    },

    //@TODO Add support an event map syntax
    on: function (name, callback, context) {
        var handler;
        var model = this;
        switch (name) {
            case 'collapsing':
                handler = function () {
                    var allow = callback(null, {});
                    if (allow === false) {
                        model.set('_collapsing', false);
                    }
                };
                break;
            case 'expanding':
                handler = function () {
                    var allow = callback(null, {});
                    if (allow === false) {
                        model.set('_expanding', false);
                    }
                };
                break;
            default:
                handler = callback;
                break;
        }
        ContainerModel.prototype.on.call(this, name, handler, context);
    }

});
//####app/new/controls/panel/panelView.js
/**
 * @class
 * @augments ControlView
 */
var PanelView = ContainerView.extend(/** @lends PanelView.prototype */ {

    className: 'pl-panel panel panel-default',

    template: InfinniUI.Template["new/controls/panel/template/panel.tpl.html"],

    UI: {
        header: '.pl-panel-header',
        items: '.panel-items'
    },

    events: {
        'click .pl-panel-header': 'onClickHeaderHandler'
    },

    initialize: function (options) {
        ContainerView.prototype.initialize.call(this, options);
    },

    render: function () {
        this.prerenderingActions();

        this.removeChildElements();

        this.$el.html(this.template({
            items: this.model.get('items')
        }));

        this.bindUIElements();

        this.renderItemsContents();

        this.postrenderingActions();

        this.trigger('render');
        this.updateProperties();
        return this;
    },

    initHandlersForProperties: function () {
        ContainerView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:collapsed', this.updateCollapsed);
        this.listenTo(this.model, 'change:collapsible', this.updateCollapsible);
        this.listenTo(this.model, 'change:header', this.updateHeader);
    },

    updateProperties: function () {
        ContainerView.prototype.updateProperties.call(this);
        this.updateCollapsed();
        this.updateCollapsible();
        this.updateHeader();
    },

    updateCollapsed: function () {
        this.ui.header.toggleClass('pl-collapsed', this.model.get('collapsed'));
    },

    updateCollapsible: function (model, value) {
        this.ui.header.toggleClass('pl-collapsible', this.model.get('collapsible'));
    },

    updateHeader: function () {
        var model = this.model;

        this.ui.header.empty();
        var headerTemplate = model.get('headerTemplate');
        if (typeof headerTemplate === 'function') {
            var header = model.get('header');
            this.ui.header.append(headerTemplate(null, {value: header}).render());
        }
    },



    renderItemsContents: function () {
        var $items = this.$el.find('.pl-panel-i'),
            items = this.model.get('items'),
            itemTemplate = this.model.get('itemTemplate'),
            that = this,
            element, item;

        $items.each(function (i, el) {
            item = items.getByIndex(i);
            element = itemTemplate(undefined, {item: item, index: i});
            that.addChildElement(element);
            $(el)
                .append(element.render());
        });
    },
    //
    //initOrientation: function () {
    //    this.listenTo(this.model, 'change:orientation', this.updateOrientation);
    //    this.updateOrientation();
    //},

    //updateOrientation: function () {
    //    var orientation = this.model.get('orientation');
    //    this.$el.toggleClass('horizontal-orientation', orientation == 'Horizontal');
    //},

    updateGrouping: function () {

    },

    onClickHeaderHandler: function (event) {
        var collapsible = this.model.get('collapsible');
        if (collapsible) {
            var collapsed = this.model.get('collapsed');
            this.model.set('collapsed', !collapsed);
        }
    }
});

//####app/new/controls/passwordBox/passwordBoxControl.js
/**
 *
 * @constructor
 * @augments Control
 * @mixes editorBaseControlMixin
 */
var PasswordBoxControl = function () {
    _.superClass(PasswordBoxControl, this);
    this.initialize_editorBaseControl();
};

_.inherit(PasswordBoxControl, Control);

_.extend(PasswordBoxControl.prototype, /** @lends PasswordBoxControl.prototype */ {

    createControlModel: function () {
        return new PasswordBoxModel();
    },

    createControlView: function (model) {
        return new PasswordBoxView({model: model});
    }

}, editorBaseControlMixin);
//####app/new/controls/passwordBox/passwordBoxModel.js
/**
 * @constructor
 * @augments ControlModel
 * @mixes editorBaseModelMixin
 */
var PasswordBoxModel = ControlModel.extend(_.extend({

    defaults: _.defaults(
        editorBaseModelMixin.defaults_editorBaseModel,
        ControlModel.prototype.defaults
    ),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }

}, editorBaseModelMixin));
//####app/new/controls/passwordBox/passwordBoxView.js
/**
 * @class PasswordBoxView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var PasswordBoxView = ControlView.extend(_.extend({}, editorBaseViewMixin, {

    className: 'pl-password-box form-group',

    template: InfinniUI.Template["new/controls/passwordBox/template/passwordBox.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        label: '.pl-control-label',
        input: '.pl-control'
    }),

    events: {
        'blur .pl-control': 'onBlurHandler'
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:labelText', this.updateLabelText);
        this.listenTo(this.model, 'change:labelFloating', this.updateLabelFloating);
        this.listenTo(this.model, 'change:passwordChar', this.updatePasswordChar);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);
        this.updateLabelText();
        this.updatePasswordChar();
    },

    updateLabelText: function () {
        var labelText = this.model.get('labelText');
        this.ui.label.text(labelText);
    },

    updatePasswordChar: function () {
        //Can't use on native input[type=password]
    },

    updateValue: function(){
        editorBaseViewMixin.updateValueState.call(this);

        var value = this.model.get('value');
        this.ui.input.val(value);
    },

    updateEnabled: function () {
        ControlView.prototype.updateEnabled.call(this);

        var enabled = this.model.get('enabled');
        this.ui.input.prop('disabled', !enabled);
    },

    getData: function () {
        return _.extend(
            {},
            ControlView.prototype.getData.call(this),
            editorBaseViewMixin.getData.call(this)
        );
    },

    render: function () {
        var model = this.model;

        this.prerenderingActions();
        this.renderTemplate(this.template);

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    },

    onBlurHandler: function () {
        var model = this.model;

        var value = this.ui.input.val();

        model.set('value', value);
    }

}));

//####app/new/controls/popupButton/commonView/popupButtonView.js
var CommonPopupButtonView = ContainerView.extend({

    className: 'pl-popup-button',

    template: InfinniUI.Template["new/controls/popupButton/commonView/template/popupButton.tpl.html"],
    dropdownTemplate: InfinniUI.Template["new/controls/popupButton/commonView/template/popupButton.dropdown.tpl.html"],

    events: {
        'click .pl-popup-button__grip': 'onClickGripHandler',
        'click .pl-popup-button__button': 'onClickHandler'
    },

    UI: {
        button: '.pl-popup-button__button',
        grip: '.pl-popup-button__grip'
    },

    updateProperties: function(){
        ContainerView.prototype.updateProperties.call(this);

        this.updateContent();
    },

    updateContent: CommonButtonView.prototype.updateContent,
    updateText: CommonButtonView.prototype.updateText,

    getButtonElement: function(){
        return this.ui.button;
    },

    render: function () {
        this.prerenderingActions();

        var items = this.model.get('items').toArray();
        var template = this.template;

        this.removeChildElements();

        this.$el.html(template({items: items}));
        this.bindUIElements();

        this.$dropdown = this.renderDropdown();

        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();

        return this;
    },

    renderDropdown: function(){
        var template = this.dropdownTemplate;
        var items = this.model.get('items').toArray();
        var $result = $(template({items: items}));

        this.appendItemsContent($result, items);

        return $result;
    },

    appendItemsContent: function($dropdown, items){
        var that = this,
            itemTemplate = this.model.get('itemTemplate'),
            itemEl, $el;

        $dropdown.find('.pl-popup-button__item').each(function(i, el){
            $el = $(el);
            itemEl = itemTemplate(undefined, {index: i, item: items[i]});
            that.addChildElement(itemEl);
            $el.append(itemEl.render());
        });
    },

    open: function(){
        var that = this;

        $('body').append(this.$dropdown);

        this.$dropdown.addClass('open');
        this.alignDropdown();

        var $ignoredElements = this.$dropdown.add (this.ui.grip);
        this.$dropdown.on('click', function () {
            that.close();
        });
        //new ActionOnLoseFocus($ignoredElements, function(){
        //    that.close();
        //});
    },

    close: function(){
        this.$dropdown.removeClass('open');
        this.$dropdown.detach();
    },

    alignDropdown: function(){
        var offset = this.$el.offset();
        var top = offset.top + this.$el.height();
        var left = offset.left;

        this.$dropdown.offset({
            top: top,
            left: left
        });
    },

    onClickGripHandler: function(){
        if(!this.$dropdown.hasClass('open')){
            this.open();
        }else{
            this.close();
        }
    },

    updateGrouping: function(){}

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'PopupButton.viewModes.common', CommonPopupButtonView);

//####app/new/controls/popupButton/forMenuView/popupButtonView.js
var ForMenuPopupButtonView = CommonPopupButtonView.extend({

    tagName: 'a',
    className: 'pl-popup-button',
    attributes: {
        href: 'javascript:;'
    },

    template: InfinniUI.Template["new/controls/popupButton/forMenuView/template/popupButton.tpl.html"],
    dropdownTemplate: InfinniUI.Template["new/controls/popupButton/commonView/template/popupButton.dropdown.tpl.html"],

    events: {
        'click': 'onClickGripHandler'
        //'click .pl-popup-button__button': 'onClickHandler'
    },

    UI: {
        button: '.pl-popup-button__button',
        grip: '.pl-popup-button__grip'
    },

    updateProperties: function(){
        ContainerView.prototype.updateProperties.call(this);

        this.updateContent();
    },

    updateContent: CommonButtonView.prototype.updateContent,
    updateText: CommonButtonView.prototype.updateText,

    updateHorizontalAlignment: function(){
        var horizontalAlignment = this.model.get('horizontalAlignment');
        var that = this;
        var $el;

        this.whenReady(
            function(){
                $el = that.$el.parent().parent();
                return $el.length > 0;
            },

            function(){
                if(horizontalAlignment == 'Right'){
                    $el
                        .addClass('pull-right');
                }else{
                    $el
                        .removeClass('pull-right');
                }
            }
        );

    },

    getButtonElement: function(){
        return this.ui.button;
    },

    render: function () {
        this.prerenderingActions();

        var items = this.model.get('items').toArray();
        var template = this.template;

        this.removeChildElements();

        this.$el.html(template({items: items}));
        this.bindUIElements();

        this.$dropdown = this.renderDropdown();

        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();

        return this;
    },

    renderDropdown: function(){
        var template = this.dropdownTemplate;
        var items = this.model.get('items').toArray();
        var $result = $(template({items: items}));

        this.appendItemsContent($result, items);
        $result.on('click', function () {
            this.close();
        }.bind(this));
        return $result;
    },

    appendItemsContent: function($dropdown, items){
        var that = this,
            itemTemplate = this.model.get('itemTemplate'),
            itemEl, $el;

        $dropdown.find('.pl-popup-button__item').each(function(i, el){
            $el = $(el);
            itemEl = itemTemplate(undefined, {index: i, item: items[i]});
            that.addChildElement(itemEl);
            $el.append(itemEl.render());
        });
    },

    open: function(){
        var that = this;
        var $parent = this.$el.parent();

        $('body').append(this.$dropdown);

        this.$dropdown.addClass('open');
        $parent.addClass('open');

        this.alignDropdown();

        var $ignoredElements = this.$dropdown.add (this.$el);
        new ActionOnLoseFocus($ignoredElements, function(){
            that.close();
        });
    },

    close: function(){
        this.$dropdown.removeClass('open');
        this.$el.parent().removeClass('open');
        this.$dropdown.detach();
    },

    alignDropdown: function(){
        var horizontalAlignment = this.model.get('horizontalAlignment');
        var $el = this.$el.parent();
        var offset = $el.offset();
        var top = offset.top + $el.height()- 2;
        var $dropdownMenu = this.$dropdown.find('.dropdown-menu');
        var left;

        if(horizontalAlignment == "Right"){
            left = offset.left - ($dropdownMenu.width() - $el.width());
        }else{
            left = offset.left;
        }

        this.$dropdown.offset({
            top: top,
            left: left
        });
    },

    onClickGripHandler: function(){
        if(!this.$dropdown.hasClass('open')){
            this.open();
        }else{
            this.close();
        }
    },

    updateGrouping: function(){},

    whenReady: function(conditionFunction, onConditionFunction, n){
        var that = this;

        if(n === undefined){
            n = 100;
        }

        if(!conditionFunction()){
            if(n>0){
                setTimeout( function(){
                    that.whenReady(conditionFunction, onConditionFunction, n-1);
                }, 10);
            }
        }else{
            onConditionFunction();
        }
    }

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'PopupButton.viewModes.forMenu', ForMenuPopupButtonView);

//####app/new/controls/popupButton/popupButtonControl.js
function PopupButtonControl(viewMode) {
    _.superClass(PopupButtonControl, this, viewMode);
}

_.inherit(PopupButtonControl, ContainerControl);

_.extend(PopupButtonControl.prototype, /** @lends PopupButtonControl.prototype */ {

    createControlModel: function () {
        return new PopupButtonModel();
    },

    createControlView: function (model, viewMode) {
        if(!viewMode || ! viewMode in window.InfinniUI.PopupButton){
            viewMode = 'common';
        }

        var ViewClass = window.InfinniUI.PopupButton.viewModes[viewMode];

        return new ViewClass({model: model});
    }

}, buttonControlMixin);


//####app/new/controls/popupButton/popupButtonModel.js
var PopupButtonModel = ContainerModel.extend({

});
//####app/new/controls/scrollPanel/scrollPanelControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function ScrollPanelControl(parent) {
    _.superClass(ScrollPanelControl, this, parent);
}

_.inherit(ScrollPanelControl, ContainerControl);

_.extend(ScrollPanelControl.prototype, /** @lends ScrollPanelControl.prototype */ {

    createControlModel: function () {
        return new ScrollPanelModel();
    },

    createControlView: function (model) {
        return new ScrollPanelView({model: model});
    }

});


//####app/new/controls/scrollPanel/scrollPanelModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var ScrollPanelModel = ContainerModel.extend(/** @lends ScrollPanelModel.prototype */ {

    initialize: function () {
        ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    defaults: _.defaults(
        {
            verticalAlignment: 'Stretch',
            horizontalScroll: ScrollVisibility.auto,
            verticalScroll: ScrollVisibility.auto
        },
        ContainerModel.prototype.defaults
    )

});
//####app/new/controls/scrollPanel/scrollPanelView.js
/**
 * @class
 * @augments ControlView
 */
var ScrollPanelView = ContainerView.extend(/** @lends ScrollPanelView.prototype */ {

    className: 'pl-scrollpanel panel panel-default',

    template: InfinniUI.Template["new/controls/scrollPanel/template/scrollPanel.tpl.html"],

    UI: {

    },

    initialize: function (options) {
        ContainerView.prototype.initialize.call(this, options);
    },

    render: function () {
        this.prerenderingActions();

        this.removeChildElements();
        this.$el.html(this.template({
            items: this.model.get('items')
        }));
        this.renderItemsContents();

        this.bindUIElements();

        this.postrenderingActions();

        this.trigger('render');
        this.updateProperties();
        return this;
    },

    initHandlersForProperties: function () {
        ContainerView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:horizontalScroll', this.updateHorizontalScroll);
        this.listenTo(this.model, 'change:verticalScroll', this.updateVerticalScroll);
    },

    updateProperties: function () {
        ContainerView.prototype.updateProperties.call(this);
        this.updateHorizontalScroll();
        this.updateVerticalScroll();
    },

    /**
     * @protected
     * @description Set one of CSS class: "pl-horizontal-scroll-(visible|hidden|auto)",
     */
    updateHorizontalScroll: function () {
        var name = '';
        switch (this.model.get('horizontalScroll')) {
            case ScrollVisibility.visible:
                name = 'visible';
                break;
            case ScrollVisibility.hidden:
                name = 'hidden';
                break;
            case ScrollVisibility.auto:
            default:
                name = 'auto';
                break;
        }
        this.switchClass('pl-horizontal-scroll', name, this.$el);
    },

    /**
     * @protected
     * @description Set one of CSS class: "pl-vertical-scroll-(visible|hidden|auto)",
     */
    updateVerticalScroll: function (model, value) {
        var name = '';
        switch (this.model.get('verticalScroll')) {
            case ScrollVisibility.visible:
                name = 'visible';
                break;
            case ScrollVisibility.hidden:
                name = 'hidden';
                break;
            case ScrollVisibility.auto:
            default:
                name = 'auto';
                break;
        }
        this.switchClass('pl-vertical-scroll', name, this.$el);
    },

    renderItemsContents: function () {
        var $items = this.$el.find('.pl-scrollpanel-i'),
            items = this.model.get('items'),
            itemTemplate = this.model.get('itemTemplate'),
            that = this,
            element, item;

        $items.each(function (i, el) {
            item = items.getByIndex(i);
            element = itemTemplate(undefined, {item: item, index: i});
            that.addChildElement(element);
            $(el)
                .append(element.render());
        });
    },

    updateGrouping: function () {

    }

});

//####app/new/controls/stackPanel/baseView/stackPanelView.js
/**
 * @class
 * @augments ControlView
 */
var StackPanelView = ContainerView.extend(
    /** @lends StackPanelView.prototype */
    {
        tagName: 'ul',
        className: 'pl-stack-panel pl-clearfix',

        template: {
            plain: InfinniUI.Template["new/controls/stackPanel/baseView/template/stackPanel.tpl.html"],
            grouped: InfinniUI.Template["new/controls/stackPanel/baseView/template/stackPanelGrouped.tpl.html"]
        },

        UI: {
            items: '.stackpanel-items'
        },

        initialize: function (options) {
            ContainerView.prototype.initialize.call(this, options);

            this.initOrientation();
        },

        updateGrouping: function(){
            var isGrouped = this.model.get('groupValueSelector') != null;

            if(isGrouped){
                this.strategy = new StackPanelViewGroupStrategy(this);
            }else{
                this.strategy = new StackPanelViewPlainStrategy(this);
            }
        },

        render: function () {
            this.prerenderingActions();

            this.removeChildElements();

            var preparedItems = this.strategy.prepareItemsForRendering();
            var template = this.strategy.getTemplate();

            this.$el.html(template(preparedItems));

            this.strategy.appendItemsContent(preparedItems);

            this.bindUIElements();
            this.updateProperties();

            this.trigger('render');


            this.postrenderingActions();
            return this;
        },

        //renderItemsContents: function(){
        //    var $items = this.$el.find('.pl-stack-panel-i'),
        //        items = this.model.get('items'),
        //        itemTemplate = this.model.get('itemTemplate'),
        //        that = this,
        //        element, item;
        //
        //    $items.each(function(i, el){
        //        item = items.getByIndex(i);
        //        element = itemTemplate(undefined, {item: item, index: i});
        //        that.addChildElement(element);
        //        $(el)
        //            .append(element.render());
        //    });
        //},

        initOrientation: function () {
            this.listenTo(this.model, 'change:orientation', this.updateOrientation);
            this.updateOrientation();
        },

        updateOrientation: function () {
            var orientation = this.model.get('orientation');
            this.$el.toggleClass('horizontal-orientation', orientation == 'Horizontal');
        },

        getItems: function(){
            return this.model.get('items');
        },

        getItemTemplate: function(){
            return this.model.get('itemTemplate');
        },

        getGroupValueSelector: function(){
            return this.model.get('groupValueSelector');
        },

        getGroupItemTemplate: function(){
            return this.model.get('groupItemTemplate');
        },
    }
);

//####app/new/controls/stackPanel/baseView/viewGroupStrategy.js
function StackPanelViewGroupStrategy(stackPanel) {
    this.stackPanel = stackPanel;
};

_.extend(StackPanelViewGroupStrategy.prototype, {

    prepareItemsForRendering: function(){
        var items = this.stackPanel.getItems(),
            inputName = 'listbox-' + guid(),
            result = {
                isMultiselect: this.stackPanel.isMultiselect(),
                inputName: inputName,
                groups: []
            },
            groups = {},
            groupingFunction = this.stackPanel.getGroupValueSelector();

        items.forEach(function(item, index){
            var groupKey = groupingFunction(undefined, {value:item});

            if(! (groupKey in groups)){
                groups[groupKey] = [];
            }

            groups[groupKey].push(item);
        });

        for(var k in groups){
            result.groups.push({
                items: groups[k]
            })
        }

        return result;
    },

    getTemplate: function(){
        return this.stackPanel.template.grouped;
    },

    appendItemsContent: function(preparedItems){
        var $stackPanel = this.stackPanel.$el,
            $stackPanelItems = $stackPanel.find('.pl-stack-panel-i'),
            itemTemplate = this.stackPanel.getItemTemplate(),
            groupTitleTemplate = this.stackPanel.getGroupItemTemplate(),
            index = 0,
            groups = preparedItems.groups,
            stackPanel = this.stackPanel,
            itemEl, titleEl;

        $stackPanel.find('.pl-stack-panel-group-title').each(function(i, el){
            titleEl = groupTitleTemplate(undefined, {index: index, item: groups[i]});
            stackPanel.addChildElement(titleEl);
            $(el).append(titleEl.render());

            _.forEach( groups[i].items, function(item){
                itemEl = itemTemplate(undefined, {index: i, item: item});
                stackPanel.addChildElement(itemEl);
                $stackPanelItems.eq(index).append(itemEl.render());

                $stackPanelItems.eq(index).parent()
                    .data('pl-data-item', item);

                index++;
            });

        });
    }
});
//####app/new/controls/stackPanel/baseView/viewPlainStrategy.js
function StackPanelViewPlainStrategy(stackPanel) {
    this.stackPanel = stackPanel;
};

_.extend(StackPanelViewPlainStrategy.prototype, {

    prepareItemsForRendering: function(){
        var items = this.stackPanel.getItems(),
            result = {
                items: items.toArray()
            };

        return result;
    },

    getTemplate: function(){
        return this.stackPanel.template.plain;
    },

    appendItemsContent: function(preparedItems){
        var $stackPanel = this.stackPanel.$el,
            itemTemplate = this.stackPanel.getItemTemplate(),
            items = preparedItems.items,
            stackPanel = this.stackPanel,
            itemEl, $el;

        $stackPanel.find('.pl-stack-panel-i').each(function(i, el){
            $el = $(el);
            itemEl = itemTemplate(undefined, {index: i, item: items[i]});
            stackPanel.addChildElement(itemEl);
            $el.append(itemEl.render());

            $el.parent().data('pl-data-item', items[i]);
        });
    }
});
//####app/new/controls/stackPanel/stackPanelControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function StackPanelControl(parent) {
    _.superClass(StackPanelControl, this, parent);
}

_.inherit(StackPanelControl, ContainerControl);

_.extend(StackPanelControl.prototype,
    /** @lends StackPanelControl.prototype */
    {
        createControlModel: function () {
            return new StackPanelModel();
        },

        createControlView: function (model) {
            return new StackPanelView({model: model});
        }
    }
);


//####app/new/controls/stackPanel/stackPanelModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var StackPanelModel = ContainerModel.extend(
    /** @lends StackPanelModel.prototype */
    {
        initialize: function () {
            ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        }
    }
);
//####app/new/controls/tabPanel/tabHeader/tabHeaderView.js
var TabHeaderModel = Backbone.Model.extend({

    defaults: {
        text: '',
        canClose: false
    }
});

var TabHeaderView = Backbone.View.extend({

    className: "pl-tabheader",

    tagName: "li",

    template: InfinniUI.Template["new/controls/tabPanel/tabHeader/template/tabHeader.tpl.html"],

    events: {
        "click": "onClickHandler",
        "click .pl-close": "onClickCloseHandler"
    },

    UI: {
        label: '.pl-tabheader-text',
        close: '.pl-close'
    },

    initialize: function (options) {
        this.model = new TabHeaderModel(options);

        this.on('rendered', this.onRenderedHandler);
    },

    render: function () {
        this.$el.html(this.template);
        this.bindUIElements();
        this.trigger('rendered');
        return this;
    },

    /**
     *
     * @param {string} value
     */
    setText: function (value) {
        this.model.set('text', value);
    },

    /**
     *
     * @param {boolean} value
     */
    setCanClose: function (value) {
        this.model.set('canClose', value);
    },

    /**
     *
     * @param {boolean} value
     */
    setSelected: function (value) {
        this.model.set('selected', value);
    },

    /**
     * @protected
     */
    updateProperties: function () {
        this.updateTextHandler();
        this.updateCanClose();
        this.updateSelectedHandler();
    },

    /**
     * @protected
     */
    onRenderedHandler: function () {
        this.updateProperties();
        this.listenTo(this.model, 'change:text', this.updateTextHandler);
        this.listenTo(this.model, 'change:selected', this.updateSelectedHandler);
        this.listenTo(this.model, 'cahnge:canClose', this.updateCanClose);
    },

    /**
     * @protected
     */
    updateTextHandler: function () {
        var text = this.model.get('text');
        this.ui.label.text(text);
    },

    /**
     * @protected
     */
    updateCanClose: function () {
        var canClose = this.model.get('canClose');
        this.ui.close.toggleClass('hidden', !canClose);
    },

    /**
     * @protected
     */
    updateSelectedHandler: function () {
        var selected = this.model.get('selected');
        this.$el.toggleClass('pl-active active', selected);
    },

    onClickHandler: function (event) {
        this.trigger('selected');
    },

    onClickCloseHandler: function (event) {
        event.stopPropagation();
        this.trigger('close');
    }

});

_.extend(TabHeaderView.prototype, bindUIElementsMixin);
//####app/new/controls/tabPanel/tabPage/tabPageControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function TabPageControl(parent) {
    _.superClass(TabPageControl, this, parent);
}

_.inherit(TabPageControl, ContainerControl);

_.extend(TabPageControl.prototype, /** @lends TabPageControl.prototype */ {


    createControlModel: function () {
        return new TabPageModel();
    },

    createControlView: function (model) {
        return new TabPageView({model: model});
    }


});


//####app/new/controls/tabPanel/tabPage/tabPageModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var TabPageModel = ContainerModel.extend(/** @lends TabPageModel.prototype */ {

    initialize: function () {
        ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    defaults: _.defaults(
        {
            canClose: false,
            selected: false
        },
        ContainerModel.prototype.defaults
    )

});
//####app/new/controls/tabPanel/tabPage/tabPageView.js
/**
 * @class
 * @augments ControlView
 */
var TabPageView = ContainerView.extend(/** @lends TabPageView.prototype */ {

    className: 'pl-tabpage hidden',

    template: InfinniUI.Template["new/controls/tabPanel/tabPage/template/tabPage.tpl.html"],

    UI: {

    },

    initHandlersForProperties: function () {
        ContainerView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:selected', this.updateSelected);
    },

    updateProperties: function () {
        ContainerView.prototype.updateProperties.call(this);
        this.updateSelected();
    },

    render: function () {
        this.prerenderingActions();

        this.removeChildElements();

        this.$el.html(this.template({
            items: this.model.get('items')
        }));
        this.renderItemsContents();

        this.bindUIElements();

        this.postrenderingActions();

        this.trigger('render');
        this.updateProperties();
        return this;
    },

    renderItemsContents: function () {
        var $items = this.$el.find('.pl-tabpage-i'),
            items = this.model.get('items'),
            itemTemplate = this.model.get('itemTemplate'),
            that = this,
            element, item;

        $items.each(function (i, el) {
            item = items.getByIndex(i);
            element = itemTemplate(undefined, {item: item, index: i});
            that.addChildElement(element);
            $(el)
                .append(element.render());
        });
    },

    updateSelected: function () {
        var selected = this.model.get('selected');
        this.$el.toggleClass('hidden', !selected);
    },

    /**
     * @protected
     */
    updateGrouping: function () {

    }

});
//####app/new/controls/tabPanel/tabPanelControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function TabPanelControl(parent) {
    _.superClass(TabPanelControl, this, parent);
}

_.inherit(TabPanelControl, ContainerControl);

_.extend(TabPanelControl.prototype, /** @lends TabPanelControl.prototype */ {

    setSelectedItem: function (value) {
        /**
         * @TODO Отрефакторить! Временное решение т.к. коллекция model.items содержит не экземпляры страниц а метаданные! см. templating в Container
         */
        var
            selectedItem = null,
            model = this.controlModel,
            elements = this.controlView.childElements,
            items = model.get('items');

        if (value instanceof TabPage) {
            model.set('selectedItem', value)
        } else if (Array.isArray(elements)) {
            var index = items.indexOf(value);
            if (index !== -1) {
                selectedItem = elements[index];
            }
            this.controlModel.set('selectedItem', selectedItem);
        }
    },

    createControlModel: function () {
        return new TabPanelModel();
    },

    createControlView: function (model) {
        return new TabPanelView({model: model});
    }

});


//####app/new/controls/tabPanel/tabPanelModel.js
/**
 * @constructor
 * @augments ContainerModel
 */
var TabPanelModel = ContainerModel.extend(/** @lends TabPanelModel.prototype */ {

    initialize: function () {
        ContainerModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    defaults: _.defaults(
        {
            headerLocation: TabHeaderLocation.top,
            headerOrientation: TabHeaderOrientation.horizontal
        },
        ContainerModel.prototype.defaults
    )

});
//####app/new/controls/tabPanel/tabPanelView.js
/**
 * @class
 * @augments ControlView
 */
var TabPanelView = ContainerView.extend(/** @lends TabPanelView.prototype */ {

    className: 'pl-tabpanel',

    template: {
        top: InfinniUI.Template["new/controls/tabPanel/template/tabPanel.top.tpl.html"],
        right: InfinniUI.Template["new/controls/tabPanel/template/tabPanel.right.tpl.html"],
        bottom: InfinniUI.Template["new/controls/tabPanel/template/tabPanel.bottom.tpl.html"],
        left: InfinniUI.Template["new/controls/tabPanel/template/tabPanel.left.tpl.html"],
        none: InfinniUI.Template["new/controls/tabPanel/template/tabPanel.none.tpl.html"]
    },

    UI: {
        header: '.pl-tabpanel-header',
        content: '.pl-tabpanel-content'
    },

    initHandlersForProperties: function () {
        ContainerView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:headerLocation', this.onChangeHeaderLocation);
        this.listenTo(this.model, 'change:headerOrientation', this.updateHeaderOrientation);
        this.listenTo(this.model, 'change:selectedItem', this.updateSelectedItem);
    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.getTemplate());

        this.renderItemsContents();
        this.checkSelectedItem();

        this.postrenderingActions();

        this.trigger('render');
        this.updateProperties();
        return this;
    },

    /**
     * @protected
     */
    renderItemsContents: function () {
        var items = this.model.get('items');

        this.removeChildElements();
        this.ui.content.empty();
        this.model.set('selectedItemIndex', -1);

        var data = [];
        items.forEach(function (item, index) {
            data.push({
                tabElement: this.renderTabContent(item, index),
                item: item,
                index: index
            });
        }, this);

        this.renderTabHeaders(data);
    },

    /**
     * @protected
     * @param {Array.<Object>} data
     */
    renderTabHeaders: function (data) {
        var header,
            model = this.model,
            items = model.get('items'),
            selectedItem = model.get('selectedItem');

        if (Array.isArray(this.tabHeaders)) {
            while (header = this.tabHeaders.pop()) {
                this.stopListening(header);
                header.remove();
            }
        }

        this.tabHeaders = data.map(function (data) {
            var selected = items.indexOf(data.item) !== -1;
            var header = this.renderTabHeader(data.tabElement, selected);

            this.listenTo(header, 'selected', function () {
                model.set('selectedItem', data.tabElement);
            });

            this.listenTo(header, 'close', function () {
                data.tabElement.close();
            });

            return header;
        }, this);

    },

    /**
     *
     * @param {TabPage} tabPageElement
     * @param {boolean} selected
     * @returns {TabHeaderView}
     */
    renderTabHeader: function (tabPageElement, selected) {
        var header = new TabHeaderView({
            text: tabPageElement.getText(),
            canClose: tabPageElement.getCanClose(),
            selected: selected
        });

        tabPageElement.onPropertyChanged('text', function () {
            header.setText(tabPageElement.getText());
        });

        tabPageElement.onPropertyChanged('canClose', function () {
            header.setCanClose(tabPageElement.getCanClose());
        });

        this.ui.header.append(header.render().$el);
        return header;
    },

    renderTabContent: function (item, index) {
        var
            itemTemplate = this.model.get('itemTemplate'),
            element = itemTemplate(undefined, {item: item, index: index});

        this.addChildElement(element);
        this.ui.content.append(element.render());
        return element;
    },

    /**
     * @protected
     * @returns {Function}
     */
    getTemplate: function () {
        var
            template,
            headerLocation = this.model.get('headerLocation');

        switch (headerLocation) {
            case TabHeaderLocation.top:
                template = this.template.top;
                break;
            case TabHeaderLocation.right:
                template = this.template.right;
                break;
            case TabHeaderLocation.bottom:
                template = this.template.bottom;
                break;
            case TabHeaderLocation.left:
                template = this.template.left;
                break;
            case TabHeaderLocation.none:
            default:
                template = this.template.none;
                break;
        }

        return template;
    },

    /**
     * @protected
     */
    updateProperties: function () {
        ContainerView.prototype.updateProperties.call(this);
        this.updateHeaderOrientation();
        this.updateSelectedItem();
    },

    /**
     * @protected
     */
    onChangeHeaderLocation: function () {
        //При изменении положения вкладок меняется весь шаблон
        this.rerender();
    },

    /**
     * @protected
     */
    updateHeaderOrientation: function () {
        //@TODO Реализовать TabPanel.updateHeaderOrientation()
    },


    /**
     * @protected
     * @description Проверяет чтобы одна из вкладок была активна
     */
    checkSelectedItem: function () {
        var
            model = this.model,
            tabPages = this.childElements,
            selectedItem = model.get('selectedItem');

        if (!Array.isArray(tabPages)) {
            model.set('selectedItem', null);
        } else if (tabPages.length) {
            if (tabPages.indexOf(selectedItem) === -1) {
                model.set('selectedItem', tabPages[0]);
            }
        } else {
            model.set('selectedItem', null);
        }
    },

    /**
     * @protected
     */
    updateSelectedItem: function () {
        if (!this.wasRendered) {
            return;
        }

        var
            tabPages = this.childElements,
            tabHeaders = this.tabHeaders,
            selectedItem = this.model.get('selectedItem'),
            selectedIndex = tabPages.indexOf(selectedItem);

        //TabPage
        if (Array.isArray(tabPages)) {
            tabPages.forEach(function (tabPage) {
                tabPage.setSelected(false);
            });

            if (selectedIndex !== -1) {
                tabPages[selectedIndex].setSelected(true);
            }
        }

        //TabHeader
        if (Array.isArray(tabHeaders)) {
            tabHeaders.forEach(function (tabHeader) {
                tabHeader.setSelected(false);
            });
            if (selectedIndex !== -1) {
                tabHeaders[selectedIndex].setSelected(true);
            }
        }

    },



    /**
     * @protected
     */
    updateGrouping: function () {

    }

});
//####app/new/controls/textBox/textBoxControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBaseControl
 */
function TextBoxControl(parent) {
    _.superClass(TextBoxControl, this, parent);
}

_.inherit(TextBoxControl, TextEditorBaseControl);

_.extend(TextBoxControl.prototype, {

    createControlModel: function () {
        return new TextBoxModel();
    },

    createControlView: function (model) {
        return new TextBoxView({model: model});
    }
});


//####app/new/controls/textBox/textBoxModel.js
/**
 * @class
 * @augments TextEditorBaseModel
 */
var TextBoxModel = TextEditorBaseModel.extend(/** @lends TextBoxModel.prototype */{
    defaults: _.extend(
        {},
        TextEditorBaseModel.prototype.defaults,
        {
            multiline: false
        }
    ),

    initialize: function () {
        TextEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    }

});
//####app/new/controls/textBox/textBoxView.js
/**
 * @class
 * @augments TextEditorBaseView
 */
var TextBoxView = TextEditorBaseView.extend(/** @lends TextBoxView.prototype */{

    template: {
        oneline: InfinniUI.Template["new/controls/textBox/template/textBoxInput.tpl.html"],
        multiline: InfinniUI.Template["new/controls/textBox/template/textBoxArea.tpl.html"]
    },

    className: 'pl-textbox form-group',

    UI: _.extend({}, TextEditorBaseView.prototype.UI),

    events: _.extend({}, TextEditorBaseView.prototype.events, {
        //Отображение поля редактирования для INPUT[TEXT]
        'focus .pl-text-box-input': 'onFocusControlHandler',
        'mouseenter .pl-text-box-input': 'onMouseenterControlHandler',

        //Отображение поля редактирования для TEXTAREA
        'focus .pl-text-area-input': 'onFocusControlHandler',
        'mouseenter .pl-text-area-input': 'onMouseenterControlHandler'
    }),

    initHandlersForProperties: function(){
        TextEditorBaseView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:multiline', this.updateMultiline);
        this.listenTo(this.model, 'change:lineCount', this.updateLineCount);
    },

    updateProperties: function(){
        TextEditorBaseView.prototype.updateProperties.call(this);

        this.updateLineCount();
    },

    updateMultiline: function(){
        this.rerender();
    },

    updateLineCount: function(){
        var lineCount = this.model.get('lineCount');
        this.ui.control.attr('rows', lineCount);
    },

    render: function () {
        var model = this.model;
        var template = model.get('multiline') ? this.template.multiline : this.template.oneline;

        this.prerenderingActions();
        this.renderTemplate(template);
        this.renderTextBoxEditor();
        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    },

    getData: function () {
        var data = TextEditorBaseView.prototype.getData.call(this);
        var model = this.model;
        return _.extend(
            data,
            {
                multiline: model.get('multiline'),
                lineCount: model.get('lineCount')
            }
        );
    },

    renderTextBoxEditor: function () {
        var model = this.model;
        this.renderControlEditor({
            el: this.ui.editor,
            multiline: model.get('multiline'),
            lineCount: model.get('lineCount'),
            inputType: model.get('inputType')
        });

        return this;
    }

});

//####app/new/controls/toggleButton/toggleButtonControl.js
function ToggleButtonControl(parent) {
    _.superClass(ToggleButtonControl, this, parent);
    this.initialize_editorBaseControl();
}

_.inherit(ToggleButtonControl, Control);

_.extend(ToggleButtonControl.prototype, {

    createControlModel: function () {
        return new ToggleButtonModel();
    },

    createControlView: function (model) {
        return new ToggleButtonView({model: model});
    }
}, editorBaseControlMixin);


//####app/new/controls/toggleButton/toggleButtonModel.js
var ToggleButtonModel = ControlModel.extend( _.extend({

    defaults: _.defaults({
        value: false,
        textOn: 'ON',
        textOff: 'OFF',
        horizontalAlignment: 'Left'
    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }

}, editorBaseModelMixin));
//####app/new/controls/toggleButton/toggleButtonView.js
/**
 * @class ToggleButtonView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var ToggleButtonView = ControlView.extend(/** @lends ToggleButtonView.prototype */ _.extend({}, editorBaseViewMixin, {

    template: InfinniUI.Template["new/controls/toggleButton/template/toggleButton.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        textOn: '.togglebutton-handle-on',
        textOff: '.togglebutton-handle-off',
        container: '.togglebutton-container'
    }),

    events: {
        'click': 'onClickHandler'
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:textOn', this.updateTextOn);
        this.listenTo(this.model, 'change:textOff', this.updateTextOff);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);

        this.updateTextOn();
        this.updateTextOff();
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (focusable) {
            this.ui.container.attr('tabindex', 0);
        } else {
            this.ui.container.removeAttr('tabindex');
        }
    },

    updateTextOn: function () {
        var textOn = this.model.get('textOn');
        this.ui.textOn.html(textOn || '&nbsp;');
    },

    updateTextOff: function () {
        var textOff = this.model.get('textOff');
        this.ui.textOff.html(textOff || '&nbsp;');
    },

    render: function () {
        this.prerenderingActions();
        this.renderTemplate(this.template);
        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        return this;
    },

    getData: function () {
        var model = this.model;

        return _.extend({},
            ControlView.prototype.getData.call(this),
            editorBaseViewMixin.getData.call(this),
            {
                textOn: model.get('textOn'),
                textOff: model.get('textOff')
            }
        );
    },


    onClickHandler: function (event) {
        var model = this.model;
        model.set('value', !model.get('value'));
    },

    updateValue: function () {
        var value = this.model.get('value');
        this.switchClass('toggle', value ? 'on' : 'off', this.$el);
    }
}));

//####app/new/controls/toolBar/toolBarControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function ToolBarControl(parent) {
    _.superClass(ToolBarControl, this, parent);
}

_.inherit(ToolBarControl, ContainerControl);

_.extend(ToolBarControl.prototype, /** @lends ToolBarControl.prototype */ {

    createControlModel: function () {
        return new ToolBarModel();
    },

    createControlView: function (model) {
        return new ToolBarView({model: model});
    }
});


//####app/new/controls/toolBar/toolBarModel.js
/**
 * @constructor
 * @aurments ContainerModel
 */
var ToolBarModel = ContainerModel.extend({

});

//####app/new/controls/toolBar/toolBarView.js
/**
 * @constructor
 * @augments ContainerView
 */
var ToolBarView = ContainerView.extend({

    className: 'pl-tool-bar',

    template: InfinniUI.Template["new/controls/toolBar/template/toolBar.tpl.html"],

    itemTemplate: InfinniUI.Template["new/controls/toolBar/template/toolBarItem.tpl.html"],

    UI: {
        container: '.pl-tool-bar__container'
    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.template);
        this.ui.container.append(this.renderItems());
        this.updateProperties();
        this.trigger('render');

        this.postrenderingActions();

        return this;
    },

    renderItems: function () {
        var model = this.model;
        var items = model.get('items');
        var itemTemplate = model.get('itemTemplate');

        this.removeChildElements();

        var $elements = [];

        items.forEach(function (item, index) {
            var template = this.itemTemplate();
            var $template = $(template);

            var element = itemTemplate(null, {
                index: index,
                item: item
            });
            this.addChildElement(element);
            $template.append(element.render());
            $elements.push($template);
        }, this);

        return $elements;
    },

    updateGrouping: function(){}
});

//####app/new/controls/view/viewControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function ViewControl(parent) {
    _.superClass(ViewControl, this, parent);
}

_.inherit(ViewControl, ContainerControl);

_.extend(ViewControl.prototype,
    /** @lends ViewControl.prototype */
    {
        createControlModel: function () {
            return new ViewModel();
        },

        createControlView: function (model) {
            return new ViewView({model: model});
        }
    }
);


//####app/new/controls/view/viewModel.js
var DialogResult = {
    none: 0,
    accepted: 1,
    canceled: 2
};

var ViewModel = ContainerModel.extend({

    defaults: _.defaults({
        dialogResult: DialogResult.none,
        isApplication: false,
        closeButton: true
    }, ContainerModel.prototype.defaults),

    initialize: function () {
        ContainerModel.prototype.initialize.apply(this);

        this.set('scripts', new Collection([], 'name'));
        this.set('parameters', new Collection([], 'name'));
        this.set('dataSources', new Collection([], 'name'));
    }
});
//####app/new/controls/view/viewView.js
/**
 * @class
 * @augments ContainerView
 */
var ViewView = ContainerView.extend(
    /** @lends ViewView.prototype */
    {
        className: 'pl-view',

        initialize: function (options) {
            ContainerView.prototype.initialize.call(this, options);
        },

        render: function () {
            this.prerenderingActions();

            this.$el.empty();

            this.renderItemsContents();

            this.updateProperties();
            this.trigger('render');

            this.postrenderingActions();
            return this;
        },

        renderItemsContents: function(){
            var that = this,
                items = this.model.get('items'),
                itemTemplate = this.model.get('itemTemplate'),
                element;

            items.forEach(function(item, i){
                element = itemTemplate(undefined, {item: item, index: i});
                if (element) {
                    that.$el
                        .append(element.render());
                }
            });
        },

        updateGrouping: function(){}
    }
);

//####app/element/_mixins/builderEditMaskPropertyMixin.js
var builderEditMaskPropertyMixin = {

    initEditMaskProperty: function(params){
        var metadata = params.metadata;
        var builder = params.builder;
        var data = metadata.EditMask;

        //data = {NumberEditMask: {Mask: "n3"}}}

        if(typeof data !== 'undefined' && data !== null && data !== '' ) {
            var editMask = builder.build(params.view, data);
            params.element.setEditMask(editMask);
        }
    }

};
//####app/element/_mixins/builderFormatPropertyMixin.js
var builderFormatPropertyMixin = {

    initFormatProperty: function(params){
        var metadata = params.metadata;
        var builder = params.builder;
        var formatField = metadata.DisplayFormat || metadata.ItemFormat;

        if(formatField !== undefined){
            var format = builder.build(params.view, formatField);
            params.element.setFormat(format);
        }
    }

};
//####app/element/_mixins/builderHorizontalTextAlignmentPropertyMixin.js
//var builderHorizontalTextAlignmentPropertyMixin = {
//
//    initHorizontalTextAlignmentProperty: function(params){
//        var metadata = params.metadata;
//
//        if(metadata.HorizontalTextAlignment !== undefined){
//            params.element.setHorizontalTextAlignment(metadata.HorizontalTextAlignment);
//        }
//    }
//
//};
//####app/element/_mixins/builderPropertyBindingMixin.js
var builderPropertyBindingMixin = {

    /**
     * @description Инициализация датабиндинга для заданного свойства
     * @param propertyName Атрибут в метаданных
     * @param params.metadata
     * @param params.parent
     * @param params.collectionProperty
     * @param params.builder
     * @param params.element
     * @param {function} callbackSetValue Функция для установки значения из DataBinding
     * @param {function|undefined} callbackGetValue Функция для установки значения в DataBinding
     * @returns {*}
     */
    initPropertyBinding: function (propertyName, params, callbackSetValue, callbackGetValue) {

        var setValue = function (value) {
            if (callbackSetValue === null || typeof callbackSetValue === 'undefined') {
                return;
            }
            callbackSetValue(value);
        };

        var getValue = function () {
            if (callbackGetValue === null || typeof callbackGetValue === 'undefined') {
                return;
            }
            return callbackGetValue();
        };



        var metadata = params.metadata;

        if (metadata !== undefined && metadata[propertyName]) {
            var dataBinding = params.builder.build(params.view, metadata[propertyName], params.collectionProperty);


            if (dataBinding != null) {
                dataBinding.onPropertyValueChanged(function (dataSourceName, value) {
                    setValue(dataBinding.getPropertyValue());
                });

                setValue(dataBinding.getPropertyValue());
            }

            return dataBinding;
        }
    }

};
//####app/element/_mixins/builderValuePropertyMixin.js
var builderValuePropertyMixin = {

    /**
     * @param {Object} params
     * @param {Boolean|false} useValidation Использовать валидацию
     * @returns {*}
     */
    initValueProperty: function (params, useValidation) {
        var metadata = params.metadata;

        if (typeof useValidation === 'undefined') {
            useValidation = false;
        }

        if (metadata.Value !== undefined) {
            var dataBinding = params.builder.build(params.view, metadata.Value, params.collectionProperty);

            dataBinding.setElement(params.element);

            if (dataBinding != null) {
                dataBinding.onPropertyValueChanged(function (dataSourceName, value) {
                    params.element.setValue(dataBinding.getPropertyValue());
                });

                var data = dataBinding.getPropertyValue();
                if (data !== null && typeof data !== 'undefined') {
                    params.element.setValue(data);
                }

                params.element.onValueChanged(function (dataSourceName, value) {
                    dataBinding.setPropertyValue(value);
                });
            }


            if (useValidation && dataBinding) {
                params.element.onLostFocus(function () {
                    dataBinding.validate();
                });
            }

            return dataBinding;
        }
    }

};
//####app/element/_mixins/editMaskPropertyMixin.js
var editMaskPropertyMixin = {

    /**
     * Устанавливает маску ввода данных.
     * @param editMask
     */
    setEditMask: function(editMask){
        this.control.set('editMask', editMask);
    }

};
//####app/element/_mixins/formatPropertyMixin.js
var formatPropertyMixin = {

    /**
     * Возвращает формат отображения данных.
     * @returns {BooleanFormat|DateTimeFormat|NumberFormat|ObjectFormat}
     */
    getDisplayFormat: function(){
        return this.control.get('format');
    },

    /**
     * Устанавливает формат отображения данных.
     * @param {BooleanFormat|DateTimeFormat|NumberFormat|ObjectFormat} format
     * @returns {*}
     */
    setDisplayFormat: function(format){
        return this.control.set('format', format);
    }

};
//####app/element/_mixins/valuePropertyMixin.js
var valuePropertyMixin = {

    getValue: function(){
        return this.control.get('value');
    },

    setValue: function(value){
        return this.control.set('value', value);
    },

    onValueChanged: function(handler){
        this.control.onValueChanged(handler);
    }

};
//####app/element/element.js
var Element = function (parent, viewMode) {
    this.parent = parent;
    this.control = this.createControl(viewMode);
    this.state = {
        Enabled: true
    };

    this.childElements = [];

    this.eventStore = new EventStore();
};

Object.defineProperties(Element.prototype, {
    name: {
        get: function () {
            return this.getName()
        }
    }
});

_.extend(Element.prototype, {

    createControl: function (viewMode) {
        throw ('Не перегружен абстрактный метод Element.createControl');
    },

    setParent: function (parentElement) {
        this.parent = parentElement;
    },

    getParent: function () {
        return this.parent;
    },

    getChildElements: function () {
        return this.childElements;
    },

    findAllChildrenByType: function (type) {
        return this._findAllChildren(predicate, getChildElements);

        function predicate() {
            return this.constructor.name === type;
        }

        function getChildElements(element) {
            return element.findAllChildrenByType(type);
        }
    },

    findAllChildrenByName: function (name) {
        return this._findAllChildren(predicate, getChildElements);

        function predicate () {
            return this.getName() === name;
        }

        function getChildElements (element) {
            return element.findAllChildrenByName(name);
        }

    },

    _findAllChildren: function (predicate, getChildElements) {
        var elements = this.getChildElements();
        var items = [];
        if (Array.isArray(elements)) {
            elements.forEach(function (element) {
                if (predicate.call(element)) {
                    items.push(element);
                }
                Array.prototype.push.apply(items, getChildElements(element));
            });
        }

        return items;
    },

    getView: function () {
        if (!this.parentView) {
            if (this.parent instanceof View) {
                this.parentView = this.parent;

            } else {
                if (this.parent && this.parent.getView) {
                    this.parentView = this.parent.getView();
                } else {
                    this.parentView = null;
                }
            }
        }

        return this.parentView;
    },

    getName: function () {
        return this.control.get('name');
    },

    setName: function (name) {
        if (typeof name == 'string') {
            this.control.set('name', name);
        }
    },

    getProperty: function (name) {
        var getterMethodName = 'get' + this._upperFirstSymbol(name);
        if (typeof this[getterMethodName] == 'function') {
            return this[getterMethodName]();
        } else {
            throw 'expect that ' + getterMethodName + ' is getter function';
        }
    },

    setProperty: function (name, value) {
        var setterMethodName = 'set' + this._upperFirstSymbol(name),
            getterMethodName;

        if (typeof this[setterMethodName] == 'function') {
            this[setterMethodName](value);
        } else {
            if (this._isCollectionProperty(name)) {
                getterMethodName = 'get' + this._upperFirstSymbol(name);
                this[getterMethodName]().set(value);
            } else {
                throw 'expect that ' + setterMethodName + ' is setter function';
            }
        }
    },

    _isCollectionProperty: function (propertyName) {
        var getterMethodName = 'get' + this._upperFirstSymbol(propertyName);
        return (typeof this[getterMethodName] == 'function') && this[getterMethodName]() instanceof Collection;
    },

    onPropertyChanged: function (propertyName, handler) {
        var subscribingMethodName = 'on' + this._upperFirstSymbol(propertyName) + 'Changed';
        if (typeof this[subscribingMethodName] == 'function') {
            this[subscribingMethodName](handler);
        } else {
            this.control.on('change:' + propertyName, function (model, value) {
                var parentView = this.getView(),
                    context = parentView ? parentView.getContext() : undefined,
                    args = {
                        oldValue: model.previous(propertyName),
                        newValue: value
                    };
                handler(context, args);
            }.bind(this));
        }
    },

    getText: function () {
        return this.control.get('text');
    },

    setText: function (text) {
        if (typeof text !== 'undefined') {
            this.control.set('text', text);
        }
    },

    getEnabled: function () {
        return this.control.get('enabled');
    },

    setEnabled: function (isEnabled) {
        if (typeof isEnabled !== 'boolean') {
            return;
        }

        this.setState('Enabled', isEnabled);

        var parentEnabled = this.control.get('parentEnabled');
        var old = this.control.get('enabled');

        isEnabled = parentEnabled && isEnabled;

        if (isEnabled === old) {
            return;
        }

        this.control.set('enabled', isEnabled);
        this.setParentEnabledOnChild(isEnabled);
    },

    setParentEnabledOnChild: function (value) {
        var elements = this.getChildElements();
        if (_.isEmpty(elements) === false) {
            for (var i = 0, ln = elements.length; i < ln; i = i + 1) {
                if (typeof elements[i].setParentEnabled === 'undefined') {
                    continue;
                }
                elements[i].setParentEnabled(value);
            }
        }
    },

    setParentEnabled: function (value) {

        if (typeof value !== 'boolean') {
            return;
        }

        var old = this.control.get('parentEnabled');
        this.control.set('parentEnabled', value);

        if (old !== value) {
            var enabled = value && this.getState('Enabled');
            this.control.set('enabled', enabled);
            this.setParentEnabled(enabled);
            this.setParentEnabledOnChild(enabled);
        }
    },

    getVisible: function () {
        return this.control.get('visible');
    },

    setVisible: function (isVisible) {
        if (typeof isVisible == 'boolean') {
            this.control.set('visible', isVisible);
        }
    },

    getStyle: function () {
        return this.control.get('style');
    },

    setStyle: function (style) {
        if (typeof style == 'string') {
            this.control.set('style', style);
        }
    },

    getTextHorizontalAlignment: function () {
        return this.control.get('textHorizontalAlignment');
    },

    setTextHorizontalAlignment: function (value) {
        if (InfinniUI.Metadata.isValidValue(value, InfinniUI.Metadata.TextHorizontalAlignment)) {
            this.control.set('textHorizontalAlignment', value);
        }
    },

    getHorizontalAlignment: function () {
        return this.control.get('horizontalAlignment');
    },

    setHorizontalAlignment: function (horizontalAlignment) {
        if (typeof horizontalAlignment == 'string') {
            this.control.set('horizontalAlignment', horizontalAlignment);
        }
    },

    getVerticalAlignment: function () {
        return this.control.get('verticalAlignment');
    },

    setVerticalAlignment: function (verticalAlignment) {
        if (typeof verticalAlignment == 'string') {
            this.control.set('verticalAlignment', verticalAlignment);
        }
    },

    getTextStyle: function () {
        return this.control.get('textStyle');
    },

    setTextStyle: function (textStyle) {
        if (typeof textStyle == 'string') {
            this.control.set('textStyle', textStyle);
        }
    },

    getBackground: function () {
        return this.control.get('background');
    },

    setBackground: function (background) {
        if (typeof background == 'string') {
            this.control.set('background', background);
        }
    },

    getForeground: function () {
        return this.control.get('foreground');
    },

    setForeground: function (foreground) {
        if (typeof foreground == 'string') {
            this.control.set('foreground', foreground);
        }
    },

    getTexture: function () {
        return this.control.get('texture');
    },

    setTexture: function (texture) {
        if (typeof texture == 'string') {
            this.control.set('texture', texture);
        }
    },

    onLoaded: function (handler) {
        this.control.onLoaded(handler);
    },

    isLoaded: function () {
        return this.control.isLoaded();
    },

    getFocusable: function () {
        return this.control.get('focusable')
    },

    setFocusable: function (value) {
        this.control.get('focusable', !!value)
    },

    getFocused: function () {
        return this.control.get('focused');
    },

    setFocused: function (value) {
        return this.control.set('focused', !!value);
    },

    onLostFocus: function (handler) {
        this.control.on('OnLostFocus', handler);
    },

    onGotFocus: function (handler) {
        this.control.on('OnGotFocus', handler);
    },

    setToolTip: function (value) {
        this.control.set('toolTip', value);
    },

    getToolTip: function () {
        return this.control.get('toolTip');
    },

    getIsLoaded: function () {
        return this.control.get('isLoaded');
    },

    setIsLoaded: function () {
        this.control.set('isLoaded', true);
    },

    setTag: function (value) {
        this.control.set('tag', value);
    },

    getTag: function () {
        return this.control.get('tag');
    },

    render: function () {
        return this.control.render();
    },

    getWidth: function () {
    },

    getHeight: function () {
    },

    getScriptsStorage: function () {
        return this.getView();
    },

    /**
     * Установка состояния валидации элеменат
     * @param {String} [state="success"]
     * @param {String} [message]
     */
    setValidationState: function (state, message) {
        this.control.set('validationMessage', message);
        this.control.set('validationState', state);
    },

    /**
     * Получение состояния валидации элеменат
     * @return {String} [state="success"]
     */
    getValidationState: function () {
        return this.control.get('validationState');
    },

    getState: function (name) {
        return this.state[name];
    },

    setState: function (name, value) {
        this.state[name] = value;
    },

    onBeforeClick: function (handler) {
        return this.control.onBeforeClick(handler);
    },

    onKeyDown: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingKeyEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onKeyDown(callback);
    },

    onKeyUp: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingKeyEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onKeyUp(callback);
    },

    onClick: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onClick(callback);
    },

    onDoubleClick: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onDoubleClick(callback);
    },

    onMouseDown: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onMouseDown(callback);
    },

    onMouseUp: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onMouseUp(callback);
    },

    onMouseEnter: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onMouseEnter(callback);
    },

    onMouseLeave: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onMouseLeave(callback);
    },

    onMouseMove: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onMouseMove(callback);
    },

    onShowToolTip: function (handler) {
        var control = this.control;

        control.on('change:showToolTip', function () {
            var showToolTip = control.get('showToolTip');
            if (showToolTip && typeof handler === 'function') {
                handler();
            }
        });
    },

    onHideToolTip: function (handler) {
        var control = this.control;

        control.on('change:showToolTip', function () {
            var showToolTip = control.get('showToolTip');
            if (!showToolTip && typeof handler === 'function') {
                handler();
            }
        });
    },

    remove: function (isInitiatedByParent) {
        var logger = window.InfinniUI.global.logger;
        if(this.isRemoved){
            logger.warn('Element.remove: Попытка удалить элемент, который уже был удален');
            return;
        }

        var children = this.childElements;

        for (var i = 0, ii = children.length; i < ii; i++) {
            children[i].remove(true);
        }

        this.control.remove();

        if (this.parent && this.parent.removeChild && !isInitiatedByParent) {
            if(this.parent.isRemoved){
                logger.warn('Element.remove: Попытка удалить элемент из родителя, который помечан как удаленный');
            }else{
                this.parent.removeChild(this);
            }

        }

        this.isRemoved = true;

        this.childElements = undefined;
    },

    removeChild: function (child) {
        var index = this.childElements.indexOf(child);
        if (index != -1) {
            this.childElements.splice(index, 1);
        }
    },

    addChild: function (child) {
        if(!this.isRemoved){
            this.childElements.push(child);

        }else{
            var logger = window.InfinniUI.global.logger;
            logger.warn('Element.addChild: Попытка добавить потомка в удаленный элемент');
        }

    },

    createControlEventHandler: function(element, handler, additionParams) {
        var context;
        additionParams = additionParams || {};

        if (element.parentView) {
            context = element.parentView.context;
        }

        return function (message) {
            _.extend(
                message,
                additionParams
            );
            message.source = element;

            return handler.call(undefined, context, message);
        };
    },

    _getHandlingKeyEventData: function (nativeData) {
        var result = {};

        result = {
            source: this,
            key: nativeData.which,
            altKey: nativeData.altKey,
            ctrlKey: nativeData.ctrlKey,
            shiftKey: nativeData.shiftKey,
            nativeEventData: nativeData
        };
        return result;
    },

    _getHandlingMouseEventData: function (nativeData) {
        var result = {};

        result = {
            source: this,
            button: nativeData.which,
            altKey: nativeData.altKey,
            ctrlKey: nativeData.ctrlKey,
            shiftKey: nativeData.shiftKey,
            nativeEventData: nativeData
        };
        return result;
    },

    _upperFirstSymbol: function (s) {
        return s[0].toUpperCase() + s.substr(1);
    }
});
//####app/element/elementBuilder.js
/**
 *
 * @constructor
 */
var ElementBuilder = function () {
};

_.extend(ElementBuilder.prototype, /** @lends ElementBuilder.prototype */ {

    build: function (context, args) {
        args = args || {};
        var element = this.createElement(args);
        var params = _.extend(args, { element: element });

        this.applyMetadata(params);

        if (args.parentView && args.parentView.registerElement) {
            args.parentView.registerElement(element);
        }

        if (args.parent && args.parent.addChild) {
            args.parent.addChild(element);
        }

        return element;
    },

    /**
     *
     * @param {Object} params
     * @param {Builder} params.builder
     * @param {View} params.parent
     * @param {Object} params.metadata
     * @param {ListBoxItemCollectionProperty} params.collectionProperty
     */
    createElement: function (params) {
        throw ('Не перегружен абстрактный метод ElementBuilder.createElement()');
    },

    /**
     *
     * @param {Object} params
     * @param {Builder} params.builder
     * @param {View} params.parent
     * @param {Object} params.metadata
     * @param {ListBoxItemCollectionProperty} params.collectionProperty
     * @param {Element} params.element
     */
    applyMetadata: function (params) {
        var metadata = params.metadata,
            element = params.element;

        this.initBindingToProperty(params, 'Text');
        this.initBindingToProperty(params, 'Visible', true);
        this.initBindingToProperty(params, 'Enabled', true);
        this.initBindingToProperty(params, 'HorizontalAlignment');
        this.initBindingToProperty(params, 'TextHorizontalAlignment');
        this.initBindingToProperty(params, 'VerticalAlignment');
        this.initBindingToProperty(params, 'TextStyle');
        this.initBindingToProperty(params, 'Foreground');
        this.initBindingToProperty(params, 'Background');
        this.initBindingToProperty(params, 'Texture');
        this.initBindingToProperty(params, 'Style');
        this.initBindingToProperty(params, 'Tag');

        this.initToolTip(params);

        if ('Name' in metadata) {
            element.setName(metadata.Name);
        }


        if (metadata.OnLoaded) {
            element.onLoaded(function () {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnLoaded.Name || metadata.OnLoaded, { source: element });
            });
        }

        if (metadata.OnGotFocus) {
            element.onGotFocus(function () {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnGotFocus.Name || metadata.OnGotFocus, { source: element });
            });
        }

        if (metadata.OnLostFocus) {
            element.onLostFocus(function () {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnLostFocus.Name || metadata.OnLostFocus, { source: element });
            });
        }

        if (metadata.OnDoubleClick) {
            element.onDoubleClick(function (args) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnDoubleClick.Name || metadata.OnDoubleClick, args);
            });
        }

        if (metadata.OnClick) {
            element.onClick(function (args) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnClick.Name || metadata.OnClick, args);
            });
        }

        if (metadata.OnKeyDown) {
            element.onKeyDown(function (args) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnKeyDown.Name || metadata.OnKeyDown, args);
            });
        }
    },

    initBindingToProperty: function (params, propertyName, isBooleanBinding) {
        var metadata = params.metadata;
        var propertyMetadata = metadata[propertyName];
        var element = params.element;
        var lowerCasePropertyName = propertyName.toLowerCase();
        var converter;

        if (!propertyMetadata || typeof propertyMetadata != 'object') {
            if (propertyMetadata !== undefined) {
                params.element['set' + propertyName](propertyMetadata);
            }
            return null;

        } else {
            var args = {
                parent: params.parent,
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            };

            var dataBinding = params.builder.buildBinding(metadata[propertyName], args);
            var oldConverter;

            if (isBooleanBinding) {
                dataBinding.setMode(BindingModes.toElement);

                converter = dataBinding.getConverter();
                if (!converter) {
                    converter = {};
                }
                
                if(!converter.toElement){
                    converter.toElement = function (context, args) {
                        return !!args.value;
                    };
                }else{
                    oldConverter = converter.toElement;

                    converter.toElement = function (context, args) {
                        var tmp = oldConverter(context, args);
                        return !!tmp;
                    };
                }


                dataBinding.setConverter(converter);
            }

            dataBinding.bindElement(element, lowerCasePropertyName);

            return dataBinding;
        }
    },

    initToolTip: function (params) {
        var
            exchange = window.InfinniUI.global.messageBus,
            builder = params.builder,
            element = params.element,
            metadata = params.metadata,
            tooltip;

        if (metadata.ToolTip) {
            var argumentForBuilder = {
                parent: element,
                parentView: params.parentView
            };
            tooltip = builder.build(metadata.ToolTip, argumentForBuilder);
            element.setToolTip(tooltip);
            exchange.send(messageTypes.onToolTip.name, { source: element, content: tooltip.render() });
        }

        element.onShowToolTip(function () {
            if (tooltip) {
                exchange.send(messageTypes.onToolTipShow.name, { source: element, content: tooltip.render() });
            }
        });

        element.onHideToolTip(function () {
            exchange.send(messageTypes.onToolTipHide.name, { source: element });
        });

    }

});
//####app/data/_common/ajaxRequestMixin.js
var ajaxRequestMixin = (function (bus) {

    function invokeCallback(cb, args) {
        var result;
        if (typeof cb === 'function') {
            result = cb.apply(null, Array.prototype.slice.call(args));
        }
        return result;
    }

    return {

        onBeforeRequest: function (callback) {
            return function () {
                bus.send(messageTypes.onDataLoading, {});
                return invokeCallback(callback, arguments);
            }
        },

        onSuccessRequest: function (callback) {
            return function () {
                bus.send(messageTypes.onDataLoaded, {success: true});
                return invokeCallback(callback, arguments);
            }
        },

        onErrorRequest: function (callback) {
            return function () {
                bus.send(messageTypes.onDataLoaded, {success: false});
                return invokeCallback(callback, arguments);
            }
        }
    }

})(window.InfinniUI.global.messageBus);
//####app/new/elements/_base/_common/buttonBuilderMixin.js
var buttonBuilderMixin = {
    applyButtonMetadata: function(params){
        var element = params.element;
        var metadata = params.metadata;
        var builder = params.builder;

        this.initTemplatingContent(params);

        if (metadata.Action) {
            var args = {
                parentView: params.parentView,
                parent: element,
                basePathOfProperty: params.basePathOfProperty
            };
            var action = builder.build(metadata.Action, args);
            element.onClick(function(){
                action.execute();
            });
        }
    },

    initTemplatingContent: function(params){
        var element = params.element;
        var metadata = params.metadata;
        var builder = params.builder;
        var contentTemplate, contentBinding;

        if('ContentTemplate' in metadata){
            contentTemplate = this.buildContentTemplate(metadata['ContentTemplate'], params);
            element.setContentTemplate(contentTemplate);
        }

        if('Content' in metadata){
            contentBinding = builder.buildBinding(metadata['Content'], {
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            });

            contentBinding.bindElement(element, 'content');
        }
    },

    buildContentTemplate: function (templateMetadata, params) {
        var element = params.element;
        var builder = params.builder;
        var basePathOfProperty = params.basePathOfProperty;

        return function(context, args) {
            var argumentForBuilder = {
                parent: params.element,
                parentView: params.parentView,
                basePathOfProperty: basePathOfProperty
            };

            return builder.build(templateMetadata, argumentForBuilder);
        };
    }
};
//####app/new/elements/_base/_common/buttonMixin.js
var buttonMixin = {

    buttonInit: function () {
        this.isFirstAction = true;
    },

    getContent: function () {
        return this.control.get('content');
    },

    setContent: function (value) {
        this.control.set('content', value);
    },

    getContentTemplate: function () {
        return this.control.get('contentTemplate');
    },

    setContentTemplate: function (value) {
        this.control.set('contentTemplate', value);
    },

    setAction: function (value) {
        var control = this.control;

        control.set('action', value);

        if (this.isFirstAction) {
            this.isFirstAction = false;

            this.onClick(function () {
                var action = control.get('action');

                if (action ) {
                    action.execute();
                }
            });
        }
    },

    getAction: function () {
        return this.control.get('action');
    },

    click: function () {
        this.control.click();
    },

    onClick: function(handler){
        var that = this;

        Element.prototype.onClick.call(this, onClickHandlerWrap);

        function onClickHandlerWrap(args){
            var enabled = that.getEnabled();

            if(enabled){
                handler(args);
            }
        }
    }

};
//####app/new/elements/_base/_common/displayFormatBuilderMixin.js
/**
 * @mixin
 */
var displayFormatBuilderMixin = {

    /**
     * Возвращает функцию форматирования значения
     * @see {@link http://docs.infinnity.ru/docs/Specifications/UserInterface/Components/TextEditorBase/TextEditorBase.setDisplayFormat/}
     * @param {String} displayFormat
     * @param {Object} params
     * @param {ApplicationBuilder} params.builder
     * @returns {Function}
     */
    buildDisplayFormat: function (displayFormat, params) {
        var builder = params.builder;
        var formatter, format = defaultFormat;
        if (typeof displayFormat === 'string') {
            formatter = builder.buildType('ObjectFormat', {Format: displayFormat});
            format = function (context, args){
                args = args || {};
                return formatter.format(args.value);
            }
        }

        return format;

        function defaultFormat(context, args) {
            args = args || {};
            return args.value;
        }
    }
};

//####app/new/elements/_base/_common/veiwBuilderHeaderTemplateMixin.js
var viewBuilderHeaderTemplateMixin = {

    /**
     * @protected
     * @param params
     */
    buildHeaderTemplate: function (view, params) {
        var
            builder = params.builder,
            metadata = params.metadata,
            headerTemplate;

        if (metadata.HeaderTemplate) {
            //@TODO Build header template by metadata
            headerTemplate = function (context, args) {
                var
                    paramsForBuilder = {
                        parent: view,
                        parentView: view,
                        basePathOfProperty: params.basePathOfProperty
                    };

                return builder.build(metadata.HeaderTemplate, paramsForBuilder);
            }
        } else {
            //@TODO Build header template by default
            headerTemplate = function (context, args) {
                var
                    label = new Label();

                label.setValue(view.getText());
                view.onPropertyChanged("text", function (context, args) {
                    label.setValue(args.newValue);
                });

                return label;
            }
        }
        return headerTemplate;
    }

};

//####app/new/elements/_base/container/container.js
/**
 * @param parent
 * @constructor
 * @augments Element
 */
function Container(parent, viewMode) {
    _.superClass(Container, this, parent, viewMode);
}

_.inherit(Container, Element);

Container.prototype.getItemTemplate = function () {
    return this.control.get('itemTemplate');
};

Container.prototype.setItemTemplate = function (itemTemplate) {
    if (typeof itemTemplate !== 'function') {
        throw new Error('Function expected');
    }
    this.control.set('itemTemplate', itemTemplate);
};

Container.prototype.getItems = function () {
    return this.control.get('items');
};

Container.prototype.getGroupValueSelector = function () {
    return this.control.get('groupValueSelector');
};

Container.prototype.setGroupValueSelector = function (value) {
    this.control.set('groupValueSelector', value);
};

Container.prototype.getGroupItemTemplate = function () {
    return this.control.get('groupItemTemplate');
};

Container.prototype.setGroupItemTemplate = function (value) {
    this.control.set('groupItemTemplate', value);
};

Container.prototype.getGroupItemComparator = function () {
    return this.control.get('groupItemComparator');
};

Container.prototype.setGroupItemComparator = function (value) {
    this.control.set('groupItemComparator', value);
};


//####app/new/elements/_base/container/containerBuilder.js
function ContainerBuilder() {
    _.superClass(ContainerBuilder, this);
}

_.inherit(ContainerBuilder, ElementBuilder);

/**
 * @abstract
 */
_.extend(ContainerBuilder.prototype, {

    /**
     *
     * @param params
     * @returns {{itemsBinding: {DataBinding}}}
     */
    applyMetadata: function (params) {
        var metadata = params.metadata;
        var element = params.element;
        var itemsBinding;

        ElementBuilder.prototype.applyMetadata.call(this, params);

        itemsBinding = this.initItems(params);
        if (itemsBinding) {
            this.tuneItemsBinding(itemsBinding);
        }
        this.initGroup(params, itemsBinding);

        return {
            itemsBinding: itemsBinding
        };
    },

    initItems: function (params) {
        var metadata = params.metadata;
        var itemsBinding = null;

        if (Array.isArray(metadata.Items)) {  // отдельные не шаблонизируемые items, в metadata.Items - список методанных item'ов
            this.initNotTemplatingItems(params);
        } else if (metadata.Items) {                          // шаблонизируемые однотипные items, в metadata.Items - биндинг на данные item'ов
            itemsBinding = this.initTemplatingItems(params);
        }

        return itemsBinding;
    },

    initTemplatingItems: function (params) {
        var metadata = params.metadata;
        var element = params.element;
        var itemTemplate;
        var binding;
        var property;

        binding = params.builder.buildBinding(metadata.Items, {
            parentView: params.parentView,
            basePathOfProperty: params.basePathOfProperty
        });

        binding.setMode(BindingModes.toElement);

        //if ('ItemComparator' in metadata) {
        this.bindElementItemsWithSorting(binding, params);
        //} else {
        //    binding.bindElement(element, 'items');
        //}


        if ('ItemTemplate' in metadata) {
            itemTemplate = this.buildItemTemplate(metadata.ItemTemplate, params);
        } else if ('ItemFormat' in metadata) {
            itemTemplate = this.buildItemFormat(binding, metadata.ItemFormat, params);
        } else if ('ItemSelector' in metadata) {
            itemTemplate = this.buildItemSelector(binding, metadata.ItemSelector, params);
        } else {
            if ('ItemProperty' in metadata) {
                property = metadata.ItemProperty;
            } else {
                property = '';
            }
            itemTemplate = this.buildItemProperty(binding, property, params);
        }

        element.setItemTemplate(itemTemplate);

        return binding;
    },

    initNotTemplatingItems: function (params) {
        var itemsMetadata = params.metadata.Items;
        var element = params.element;
        //var fakeItems = (new Array(itemsMetadata.length + 1)).join(' ').split('');
        var items = itemsMetadata.slice(0);
        element.getItems().set(items);
        var itemTemplate = this.buildItemTemplateForUniqueItem(items, params);
        element.setItemTemplate(itemTemplate);
    },

    tuneItemsBinding: function (itemsBinding) {
        var source = itemsBinding.getSource();
        if (typeof source.tryInitData == 'function') {
            source.tryInitData();
        }
    },

    initGroup: function (params, itemsBinding) {
        if (this.hasGrouping(params)) {
            this.initGroupValueSelector(params);
            this.initGroupItemTemplate(params, itemsBinding);
        }
    },

    hasGrouping: function (params) {
        return params.metadata.GroupValueSelector || params.metadata.GroupValueProperty;
    },

    initGroupValueSelector: function (params) {
        var metadata = params.metadata,
            element = params.element,
            groupValueSelector;

        /* element.setGroupItemComparator(function(a, b) {
         if (a < b) {
         return -1;
         }

         if (a > b) {
         return 1;
         }

         return 0;
         });*/

        if (metadata.GroupValueSelector) {
            groupValueSelector = function (context, args) {
                var scriptExecutor = new ScriptExecutor(element.getScriptsStorage());
                return scriptExecutor.executeScript(metadata.GroupValueSelector.Name || metadata.GroupValueSelector, args)
            };
        } else if (metadata.GroupValueProperty) {
            groupValueSelector = function (context, args) {
                return InfinniUI.ObjectUtils.getPropertyValue(args.value, metadata.GroupValueProperty);
            }
        } else {
            //Без группировки
            groupValueSelector = null
        }
        element.setGroupValueSelector(groupValueSelector);
    },

    initGroupItemTemplate: function (params, itemsBinding) {
        var metadata = params.metadata;
        var element = params.element;
        var itemTemplate;
        var property;

        if (metadata.GroupItemTemplate) {
            itemTemplate = this.buildItemTemplate(metadata.GroupItemTemplate, params);
        } else if (metadata.GroupItemFormat) {
            itemTemplate = this.buildItemFormat(itemsBinding, metadata.GroupItemFormat, params);
        } else if (metadata.GroupItemSelector) {
            itemTemplate = this.buildItemSelector(itemsBinding, metadata.GroupItemSelector, params);
        } else if (metadata.GroupItemProperty) {
            itemTemplate = this.buildItemProperty(itemsBinding, metadata.GroupItemProperty, params);
        }

        if (itemTemplate) {
            element.setGroupItemTemplate(itemTemplate);
        }
    },

    buildItemProperty: function (itemsBinding, itemPropertyMetadata, params) {

        return function (context, args) {
            var index = args.index;
            var label = new Label(this);
            var sourceProperty;
            var source = itemsBinding.getSource();
            var binding = new DataBinding(this);

            sourceProperty = index.toString();
            if (itemsBinding.getSourceProperty() != '') {
                sourceProperty = itemsBinding.getSourceProperty() + '.' + sourceProperty;
            }
            if (itemPropertyMetadata != '') {
                sourceProperty = sourceProperty + '.' + itemPropertyMetadata;
            }

            binding.bindSource(source, sourceProperty);
            binding.bindElement(label, 'value');

            return label;
        };
    },

    buildItemFormat: function (itemsBinding, itemFormatMetadata, params) {

        var format = this.buildDisplayFormat(itemFormatMetadata, params);
        return function (context, args) {
            var index = args.index;
            var label = new Label(this);

            var sourceProperty = itemsBinding.getSourceProperty();
            var source = itemsBinding.getSource();
            var binding = new DataBinding(this);

            sourceProperty = index.toString();
            if (itemsBinding.getSourceProperty() != '') {
                sourceProperty = itemsBinding.getSourceProperty() + '.' + sourceProperty;
            }

            label.setDisplayFormat(format);

            binding.bindSource(source, sourceProperty);
            binding.bindElement(label, 'value');

            return label;
        };

    },

    buildItemSelector: function (itemsBinding, itemSelectorMetadata, params) {

        return function (context, args) {
            var index = args.index;
            var label = new Label(this);
            var scriptExecutor = new ScriptExecutor(params.parentView);

            var sourceProperty = itemsBinding.getSourceProperty();
            var source = itemsBinding.getSource();
            var binding = new DataBinding(this);

            sourceProperty = index.toString();
            if (itemsBinding.getSourceProperty() != '') {
                sourceProperty = itemsBinding.getSourceProperty() + '.' + sourceProperty;
            }

            binding.setConverter({
                toElement: function (_context, _args) {
                    return scriptExecutor.executeScript(itemSelectorMetadata.Name || itemSelectorMetadata, _args);
                }
            });

            binding.bindSource(source, sourceProperty);
            binding.bindElement(label, 'value');

            return label;
        }
    },

    buildItemTemplate: function (templateMetadata, params) {
        var element = params.element;
        var builder = params.builder;
        var basePathOfProperty = params.basePathOfProperty || new BasePathOfProperty('');
        var propertyForSource = params.metadata['Items']['Property'] || '';
        var that = this;

        return function (context, args) {
            var index = args.index;
            var bindingIndex;
            var argumentForBuilder = {
                parent: params.element,
                parentView: params.parentView
            };

            if (index !== undefined && index !== null) {
                bindingIndex = that.bindingIndexByItemsIndex(index, params);

                if (bindingIndex !== undefined && bindingIndex !== null) {
                    argumentForBuilder.basePathOfProperty = basePathOfProperty.buildChild(propertyForSource, bindingIndex);
                } else {
                    argumentForBuilder.basePathOfProperty = basePathOfProperty.buildChild(propertyForSource, index);
                }
            }

            return builder.build(templateMetadata, argumentForBuilder);
        };
    },

    /**
     * @public
     * @memberOf ContainerBuilder
     * @description Возвращает функцию itemTemplate для не шаблонизируемого item'а.
     * @param {Object} itemMetadata метаданные.
     * @param {Object} params стандартные params, передаваемые внутри билдеров.
     **/
    buildItemTemplateForUniqueItem: function (itemsMetadata, params) {
        var element = params.element;
        var builder = params.builder;
        var basePathOfProperty = params.basePathOfProperty || new BasePathOfProperty('');

        return function (context, args) {

            var
                index = args.index,
                item = element.getItems().getByIndex(index),
                argumentForBuilder = {
                    parent: params.element,
                    parentView: params.parentView,
                    basePathOfProperty: basePathOfProperty
                };

            return builder.build(item, argumentForBuilder);
        };
    },

    bindingIndexByItemsIndex: function (index, params) {
        var element = params.element,
            items = element.getItems();

        return items.getProperty(index, 'bindingIndex');
    },

    bindElementItemsWithSorting: function (binding, params) {
        // нетривиальный биндинг элементов нужен для того, чтобы правильно учитывались индексы при сортировке элементов

        var metadata = params.metadata,
            element = params.element,
            scriptExecutor = new ScriptExecutor(params.parent),
            itemComparator;

        if(metadata.ItemComparator){
            itemComparator = function (item1, item2) {
                return scriptExecutor.executeScript(metadata.ItemComparator.Name, {item1: item1, item2: item2});
            };
        }

        binding.bindElement({
            setProperty: function (name, value) {
                var items = element.getItems(),
                    isCollectionChanged;

                if(itemComparator){

                    isCollectionChanged = items.set(value, true);

                    items.forEach(function (item, index, collection) {
                        collection.setProperty(index, 'bindingIndex', index);
                    });

                    if (isCollectionChanged) {
                        items.sort(itemComparator);
                    }

                }else{

                    isCollectionChanged = items.set(value);

                    items.forEach(function (item, index, collection) {
                        collection.setProperty(index, 'bindingIndex', index);
                    });
                }

            },

            onPropertyChanged: function () {
            }

        }, 'items');
    }

}, displayFormatBuilderMixin);


//####app/new/elements/_base/editorBase/editorBaseBuilderMixin.js
var editorBaseBuilderMixin = {
    initialize_editorBaseBuilder: function () {

    },

    /**
     *
     * @param params
     * @param {Object} [bindingOptions
     * @param {Function} [bindingOptions.converter] Конвертер
     * @param {string} [bindingOptions.valueProperty="value'] Имя атрибута значения
     * @returns {*}
     */


    /**
     *
     * @param params
     * @param bindingOptions
     * @returns {{valueBinding: {DataBinding}}}
     */
    applyMetadata_editorBaseBuilder: function (params, bindingOptions) {
        var metadata = params.metadata;
        var element = params.element;

        bindingOptions = bindingOptions || {};
        bindingOptions.valueProperty = bindingOptions.valueProperty || 'value';

        element.setLabelFloating(metadata.LabelFloating);
        element.setHintText(metadata.HintText);
        element.setErrorText(metadata.ErrorText);
        element.setWarningText(metadata.WarningText);

        if (metadata.OnValueChanging) {
            element.onValueChanging(function (context, args) {
                var scriptExecutor = new ScriptExecutor(params.parentView);
                return scriptExecutor.executeScript(metadata.OnValueChanging.Name || metadata.OnValueChanging, args);
            });
        }
        if (metadata.OnValueChanged) {
            element.onValueChanged(function (context, args) {
                new ScriptExecutor(params.parentView).executeScript(metadata.OnValueChanged.Name || metadata.OnValueChanged, args);
            });
        }

        if (metadata.Value !== undefined) {
            var buildParams = {
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            };

            var dataBinding = params.builder.buildBinding(metadata.Value, buildParams);
            if (bindingOptions.converter) {
                dataBinding.setConverter(bindingOptions.converter);
            }
            dataBinding.bindElement(params.element, bindingOptions.valueProperty);

            var source = dataBinding.getSource();
            if (typeof source.tryInitData == 'function') {
                source.tryInitData();
            }

            this.initValidationResultText(element, dataBinding);
        }

        return {
            valueBinding: dataBinding
        };
    },

    /**
     * @description Инициализация подписки на события валидации для оповещения элемента
     * @param binding
     */
    initValidationResultText: function (element, binding) {
        var source = binding.getSource();
        var property = binding.getSourceProperty();

        if(typeof source.onErrorValidator == 'function'){
            source.onErrorValidator(function (context, args) {
                var result = args.value,
                    text = '';

                if (!result.isValid && Array.isArray(result.items)) {
                    text = getTextForItems(result.items);
                }
                element.setErrorText(text);
            });
        }

        if(typeof source.onWarningValidator == 'function'){
            source.onWarningValidator(function (context, args) {
                var result = args.value,
                    text = '';

                if (!result.isValid && Array.isArray(result.items)) {
                    text = getTextForItems(result.items);
                }
                element.setWarningText(text);
            });
        }


        function getTextForItems(items, callback) {
            return items
                .filter(function (item) {
                    return property === item.property;
                })
                .map(function (item) {
                    return item.message;
                })
                .join(' ');
        }
    }
};

//####app/new/elements/_base/editorBase/editorBaseMixin.js
var editorBaseMixin = {
    initialize_editorBase: function(){

    },

    getValue: function () {
        return this.control.getValue();
    },

    setValue: function (value) {
        this.control.setValue(value);
    },

    getLabelFloating: function () {
        return this.control.get('labelFloating');
    },

    setLabelFloating: function (value) {
        this.control.set('labelFloating', value);
    },

    getHintText: function () {
        return this.control.get('hintText');
    },

    setHintText: function (value) {
        this.control.set('hintText', value);
    },

    getErrorText: function () {
        return this.control.get('errorText');
    },

    setErrorText: function (value) {
        this.control.set('errorText', value);
    },

    getWarningText: function () {
        return this.control.get('warningText');
    },

    setWarningText: function (value) {
        this.control.set('warningText', value);
    },

    onValueChanging:  function (handler) {
        this.control.onValueChanging(
            this.createControlEventHandler(this, handler, {property: 'value'})
        );
    },

    onValueChanged: function (handler) {
        this.control.onValueChanged(
            this.createControlEventHandler(this, handler, {property: 'value'})
        );
    }

};
//####app/new/elements/_base/listEditorBase/listEditorBase.js
function ListEditorBase(parent, viewMode) {
    _.superClass(ListEditorBase, this, parent, viewMode);

    this.initialize_editorBase();
}

_.inherit(ListEditorBase, Container);


_.extend(ListEditorBase.prototype, {

    getMultiSelect: function () {
        return this.control.get('multiSelect');
    },

    setMultiSelect: function (value) {
        this.control.set('multiSelect', value);
    },

    getValueSelector: function () {
        return this.control.get('valueSelector');
    },

    setValueSelector: function (value) {
        this.control.set('valueSelector', value);
    },

    setValueItem: function(item){
        var result;
        var isMultiSelect = this.getMultiSelect();
        var valueSelector = this.getValueSelector();

        if(isMultiSelect){
            result = [];

            for(var i = 0, ii = item.length; i < ii; i++){
                result[i] = valueSelector(null, {value: item[i]});
            }

        }else{
            result = valueSelector(null, {value: item});
        }

        this.setValue(result);
    },

    getSelectedItem: function () {
        return this.control.get('selectedItem');
    },

    setSelectedItem: function (value) {
        this.control.set('selectedItem', value);
    },

    onSelectedItemChanged: function (handler) {
        this.control.onSelectedItemChanged(this.createControlEventHandler(this, handler));
    },

    getValueComparator: function () {
        return this.control.get('valueComparator');
    }

}, editorBaseMixin);

//####app/new/elements/_base/listEditorBase/listEditorBaseBuilder.js
function ListEditorBaseBuilder() {
    _.superClass(ListEditorBaseBuilder, this);

    this.initialize_editorBaseBuilder();
}

_.inherit(ListEditorBaseBuilder, ContainerBuilder);


_.extend(ListEditorBaseBuilder.prototype, {

    applyMetadata: function (params) {
        var itemsBinding;

        var applyingMetadataResult = ContainerBuilder.prototype.applyMetadata.call(this, params),
            itemsBinding = applyingMetadataResult.itemsBinding,
            applyingMetadataResult2;

        this.initSelecting(params, itemsBinding);

        this.initValueFeatures(params);

        applyingMetadataResult2 = this.applyMetadata_editorBaseBuilder(params);
        return _.extend(applyingMetadataResult, applyingMetadataResult2);
    },


    initSelecting: function(params, itemsBinding){
        var metadata = params.metadata;
        var element = params.element;
        var dataSource = itemsBinding.getSource();
        var sourceProperty = itemsBinding.getSourceProperty();
        var isBindingOnWholeDS = sourceProperty == '';
        var that = this;

        if(isBindingOnWholeDS){
            dataSource.setSelectedItem(null);

            dataSource.onSelectedItemChanged(function(context, args){
                var currentSelectedItem = element.getSelectedItem(),
                    newSelectedItem = args.value;

                if(newSelectedItem != currentSelectedItem){
                    element.setSelectedItem(newSelectedItem);
                }
            });
        }

        element.onSelectedItemChanged(function(context, args){
            var currentSelectedItem = dataSource.getSelectedItem(),
                newSelectedItem = args.value;

            if(isBindingOnWholeDS && newSelectedItem != currentSelectedItem){
                dataSource.setSelectedItem(newSelectedItem);
            }

            if (metadata.OnSelectedItemChanged) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnSelectedItemChanged.Name || metadata.OnSelectedItemChanged, args);
            }
        });
    },

    initValueFeatures: function(params){
        var metadata = params.metadata;
        var element = params.element;

        if (typeof metadata.MultiSelect !== 'undefined' && metadata.MultiSelect !== null) {
            element.setMultiSelect(metadata.MultiSelect);
        }

        this.initValueSelector(params);
    },

    initValueSelector: function (params) {
        var metadata = params.metadata,
            element = params.element,
            valueSelector;

        if (metadata.ValueSelector) {
            valueSelector = function (context, args) {
                var scriptExecutor = new ScriptExecutor(params.element.getScriptsStorage());
                return scriptExecutor.executeScript(metadata.ValueSelector.Name || metadata.ValueSelector, args)
            };
        } else if (metadata.ValueProperty) {
            valueSelector = function (context, args) {
                return InfinniUI.ObjectUtils.getPropertyValue(args.value, metadata.ValueProperty);
            }
        } else {
            valueSelector = function (context, args) {
                return args.value;
            }
        }
        element.setValueSelector(valueSelector);
    }
}, editorBaseBuilderMixin);
/*
    initValue: function(params){
        var metadata = params.metadata;
        var element = params.element;

        if (typeof metadata.MultiSelect !== 'undefined' && metadata.MultiSelect !== null) {
            element.setMultiSelect(metadata.MultiSelect);
        }

        this.initValueSelector(params);
    }
});


ListEditorBaseBuilder.prototype.initGroupItemTemplate = function (params) {
};

ListEditorBaseBuilder.prototype.initGroupItemTemplate = function (params) {
};


ListEditorBaseBuilder.prototype.getGroupItemTemplateBuilder = function () {
    throw new Error('Не перекрыт метод getGroupItemTemplateBuilder')
};

ListEditorBaseBuilder.prototype.initItemsBinding = function (params) {
    var element = params.element;
    var metadata = params.metadata.Items;
    var itemsCollection = element.getItems();
    if(!metadata) {
        return;
    }

    var binding = params.builder.build(params.parent, metadata, params.collectionProperty);

    if (typeof binding !== 'undefined' && binding !== null) {
        binding.onPropertyValueChanged(function (context, argument) {
            var newItems = argument.value;

            if (!Array.isArray(newItems)) {
                itemsCollection.clear();
                return;
            }

            //Удалить элементы, которых нет в новых данных
            itemsCollection
                .filter(function (item) {
                    return newItems.indexOf(item) === -1;
                })
                .forEach(function(item) {
                    itemsCollection.remove(item);
                });

            //Добавить новые элементы,которые появились в данных
            newItems.filter(function (item) {
                    return !itemsCollection.contains(item)
                })
                .forEach(function(item){
                    itemsCollection.add(item);
                });

        });
    }
    return binding;
};
*/
//####app/new/elements/_base/textEditorBase/textEditorBase.js
/**
 *
 * @param parent
 * @constructor
 * @augments Element
 * @mixes editorBaseMixin
 */
function TextEditorBase(parent) {
    _.superClass(TextEditorBase, this, parent);
    this.initialize_editorBase();
}

_.inherit(TextEditorBase, Element);

_.extend(TextEditorBase.prototype, {

    setLabelText: function (value) {
        this.control.set('labelText', value);
    },

    getLabelText: function () {
        return this.control.get('labelText');
    },

    setDisplayFormat: function (value) {
        this.control.set('displayFormat', value);
    },

    getDisplayFormat: function () {
        return this.control.get('displayFormat');
    },

    setEditMask: function (value) {
        this.control.set('editMask', value);
    },

    getEditMask: function () {
        return this.control.get('editMask');
    }
}, editorBaseMixin);

//####app/new/elements/_base/textEditorBase/textEditorBaseBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 * @mixes editorBaseBuilderMixin
 * @mixes displayFormatBuilderMixin
 *
 */
function TextEditorBaseBuilder() {
    _.superClass(TextEditorBaseBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(TextEditorBaseBuilder, ElementBuilder);

_.extend(TextEditorBaseBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);
        this.applyMetadata_editorBaseBuilder(params);

        var metadata = params.metadata;
        var element = params.element;

        element.setLabelText(metadata.LabelText);

        this
            .initDisplayFormat(params)
            .initEditMask(params);
    },

    initDisplayFormat: function (params) {


        var
            metadata = params.metadata,
            format = this.buildDisplayFormat(metadata.DisplayFormat, params);

        params.element.setDisplayFormat(format);
        return this;
    },

    initEditMask: function (params) {
        var
            metadata = params.metadata,
            builder = params.builder,
            editMask;

        if (metadata.EditMask) {
            editMask = builder.build(metadata.EditMask, {parentView: params.parentView});
        }
        params.element.setEditMask(editMask);
        return this;
    }
}, editorBaseBuilderMixin, displayFormatBuilderMixin);




//####app/new/elements/listBox/listBox.js
function ListBox(parent, viewMode) {
    _.superClass(ListBox, this, parent, viewMode);
}

_.inherit(ListBox, ListEditorBase);

ListBox.prototype.createControl = function (viewMode) {
    return new ListBoxControl(viewMode);
};
//####app/new/elements/listBox/listBoxBuilder.js
function ListBoxBuilder() {
    _.superClass(ListBoxBuilder, this);
}

_.inherit(ListBoxBuilder, ListEditorBaseBuilder);

_.extend(ListBoxBuilder.prototype, /** @lends ListBoxBuilder.prototype */{

    createElement: function (params) {
        return new ListBox(params.parent, params.metadata['ViewMode']);
    },

    applyMetadata: function (params) {
        ListEditorBaseBuilder.prototype.applyMetadata.call(this, params);
    }

});
//####app/new/elements/GridPanel/gridPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function GridPanel(parent) {
    _.superClass(GridPanel, this, parent);
}

_.inherit(GridPanel, Container);

_.extend(GridPanel.prototype, {
    createControl: function () {
        return new GridPanelControl();
    }
});
//####app/new/elements/GridPanel/gridPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function GridPanelBuilder() {
    _.superClass(GridPanelBuilder, this);
}

_.inherit(GridPanelBuilder, ContainerBuilder);

_.extend(GridPanelBuilder.prototype,
    /** @lends GridPanelBuilder.prototype*/
    {
        createElement: function (params) {
            return new GridPanel(params.parent);
        },

        /**
         * @param {Object} params
         * @param {TablePanel} params.element
         * @param {Object} params.metadata
         */
        applyMetadata: function (params) {
            var
                metadata = params.metadata,
                element = params.element;

            ContainerBuilder.prototype.applyMetadata.call(this, params);
        }

    });

//####app/new/elements/button/button.js
/**
 * @param parent
 * @augments Element
 * @constructor
 */
function Button(parent, viewMode) {
    _.superClass(Button, this, parent, viewMode);
    this.buttonInit();
}

_.inherit(Button, Element);

_.extend(Button.prototype, {

    createControl: function (viewMode) {
        return new ButtonControl(viewMode);
    }

}, buttonMixin);

//####app/new/elements/button/buttonBuilder.js
function ButtonBuilder() {
    _.superClass(ButtonBuilder, this);
}

_.inherit(ButtonBuilder, ElementBuilder);

_.extend(ButtonBuilder.prototype, {

    createElement: function (params) {
        var viewMode = this.detectViewMode(params);
        return new Button(params.parent, viewMode);
    },

    detectViewMode: function(params){
        var viewMode = params.metadata['ViewMode'];
        var el = params.parent;
        var exit = false;

        if(!viewMode){
            while(!exit){
                if(el){
                    if(el instanceof PopupButton){
                        viewMode = 'link';
                        exit = true;

                    }else if(el instanceof MenuBar){
                        viewMode = 'menuItem';
                        exit = true;

                    }else if(el instanceof View){
                        exit = true;

                    }else{
                        el = el.parent;

                    }
                }else{
                    exit = true;
                }
            }

        }

        return viewMode
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        this.applyButtonMetadata(params);
    }

}, buttonBuilderMixin);
//####app/new/elements/checkBox/checkBox.js
/**
 *
 * @param parent
 * @constructor
 * @augment Element
 */
function CheckBox(parent) {
    _.superClass(CheckBox, this, parent);
    this.initialize_editorBase();
}

_.inherit(CheckBox, Element);


_.extend(CheckBox.prototype, {

    createControl: function (parent) {
        return new CheckBoxControl(parent);
    }

}, editorBaseMixin);
//####app/new/elements/checkBox/checkBoxBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 */
function CheckBoxBuilder() {
    _.superClass(CheckBoxBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(CheckBoxBuilder, ElementBuilder);


_.extend(CheckBoxBuilder.prototype, {
    createElement: function (params) {
        return new CheckBox(params.parent);
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);
        this.applyMetadata_editorBaseBuilder(params);

        //var element = params.element;
        //var metadata = params.metadata;
    }
}, editorBaseBuilderMixin);


//####app/new/elements/comboBox/comboBox.js
/**
 * @augments ListEditorBase
 * @param parent
 * @constructor
 */
function ComboBox(parent) {
    _.superClass(ComboBox, this, parent);
}

_.inherit(ComboBox, ListEditorBase);

ComboBox.prototype.createControl = function () {
    return new ComboBoxControl();
};

ComboBox.prototype.getLabelText = function () {
    return this.control.get('labelText');
};

ComboBox.prototype.setLabelText = function (value) {
    this.control.set('labelText', value);
};

ComboBox.prototype.setValueTemplate = function (value) {
    this.control.set('valueTemplate', value);
};

ComboBox.prototype.getValueTemplate = function () {
    return this.control.get('valueTemplate');
};

ComboBox.prototype.setValueFormat = function (value) {
    this.control.set('valueFormat', value);
};

ComboBox.prototype.getValueFormat = function () {
    return this.control.get('valueFormat');
};

ComboBox.prototype.getAutocomplete = function () {
    return this.control.get('autocomplete');
};

ComboBox.prototype.setAutocomplete = function (value) {
    if (typeof value === 'boolean') {
        this.control.set('autocomplete', value);
    }
};

ComboBox.prototype.setShowClear = function (value) {
    if (typeof value === 'boolean') {
        this.control.set('showClear', value);
    }
};

ComboBox.prototype.getShowClear = function () {
    return this.control.get('showClear');
};


//####app/new/elements/comboBox/comboBoxBuilder.js
/**
 * @augments ListEditorBaseBuilder
 * @constructor
 */
function ComboBoxBuilder() {
    _.superClass(ComboBoxBuilder, this);
}

_.inherit(ComboBoxBuilder, ListEditorBaseBuilder);

_.extend(ComboBoxBuilder.prototype, /** @lends ComboBoxBuilder.prototype */{

    createElement: function (params) {
        return new ComboBox(params.parent);
    },

    applyMetadata: function (params) {
        var element = params.element;

        var data = ListEditorBaseBuilder.prototype.applyMetadata.call(this, params);
        this.initValueTemplate(data.valueBinding, params);
        element.setLabelText(params.metadata.LabelText);
        element.setAutocomplete(params.metadata.Autocomplete);
        element.setShowClear(params.metadata.ShowClear);

        (function (binding) {
            var source = binding.getSource();
            var fullSearchFilter = {
                CriteriaType: criteriaType.FullTextSearch,
                Property: "",
                Value: null
            };
            element.onPropertyChanged('search', function (context, args) {
                fullSearchFilter.Value = args.newValue;
                if (source.setFilter) {
                    source.setFilter([fullSearchFilter]);
                }
            });

        })(data.itemsBinding);
    },

    initValueTemplate: function (binding, params) {

        var metadata = params.metadata;
        var element = params.element;
        var valueTemplate;
        var property;


        if ('ValueTemplate' in metadata) {
            valueTemplate = this.buildValueTemplate(metadata.ValueTemplate, params);
        } else if ('ValueFormat' in metadata) {
            valueTemplate = this.buildValueTemplateByFormat(binding, metadata.ValueFormat, params);
        } else {
            valueTemplate = this.buildValueTemplateByDefault(binding, params);
        }

        element.setValueTemplate(valueTemplate);
    },

    buildValueTemplate: function (templateMetadata, params) {
        var element = params.element;
        var builder = params.builder;
        var basePathOfProperty = params.basePathOfProperty || new BasePathOfProperty('');
        var that = this;

        return function (context, args) {
            var index = args.index;
            var bindingIndex;
            var argumentForBuilder = {
                parent: params.element,
                parentView: params.parentView
            };

            if (index !== undefined && index !== null) {
                //bindingIndex = that.bindingIndexByItemsIndex(index, params);
                bindingIndex = index;

                if (bindingIndex !== undefined && bindingIndex !== null) {
                    argumentForBuilder.basePathOfProperty = basePathOfProperty.buildChild('', bindingIndex);
                } else {
                    argumentForBuilder.basePathOfProperty = basePathOfProperty.buildChild('', index);
                }
            }

            return builder.build(templateMetadata, argumentForBuilder);
        };
    },

    buildValueTemplateByFormat: function (binding, valueFormatMetadata, params) {
        var format = this.buildDisplayFormat(valueFormatMetadata, params);
        return function (context, args) {
            var index = args.index;
            var value = args.value;

            var label = new Label(this);
            label.setHorizontalAlignment('Left');
            label.setDisplayFormat(format);
            //var labelBinding = new DataBinding(this);
            //labelBinding.setMode(BindingModes.toElement);
            //
            //var source = binding.getSource();
            //var property = binding.getSourceProperty();
            //
            //if (params.element.getMultiSelect()) {
            //    if (property && property !== '') {
            //        property = [property, index].join('.');
            //    } else {
            //        property = String(index);
            //    }
            //}
            //
            //labelBinding.bindSource(source, property);
            //labelBinding.bindElement(label, 'value');
            label.setValue(value);
            return label;
        };
        //return function(context, args){
        //    var index = args.index;
        //    var label = new Label(this);
        //
        //    label.setDisplayFormat(format);
        //    label.setValue(format.call(null, args));
        //    return label;
        //};
    },

    buildValueTemplateByDefault: function (binding, params) {

        return function (context, args) {
            var index = args.index;
            var value = args.value;

            var label = new Label(this);
            label.setHorizontalAlignment('Left');

            //if (binding) {
                //var labelBinding = new DataBinding(this);
                //labelBinding.setMode(BindingModes.toElement);
                //
                //var source = binding.getSource();
                //var property = binding.getSourceProperty();
                //
                //if (params.element.getMultiSelect()) {
                //    if (property && property !== '') {
                //        property = [property, index].join('.');
                //    } else {
                //        property = String(index);
                //    }
                //}
                //
                //labelBinding.bindSource(source, property);
                //labelBinding.bindElement(label, 'value');

            //} else {
                label.setValue(value);
            //}

            return label;
        };
    }
});
//####app/new/elements/dataGrid/dataGrid.js
function DataGrid(parent) {
    _.superClass(DataGrid, this, parent);
}

_.inherit(DataGrid, ListEditorBase);

/**
 * Возвращает коллекцию колонок таблицы {@see DataGridColumn}
 * @returns {Collection}
 */
DataGrid.prototype.getColumns = function () {
    return this.control.get('columns');
};

DataGrid.prototype.setShowSelectors = function (value) {
    if (typeof value !== 'undefined' && value !== null) {
        this.control.set('showSelectors', !!value);
    }
};

DataGrid.prototype.getShowSelectors = function () {
    return this.control.get('showSelectors');
};

DataGrid.prototype.createRow = function () {
    return new DataGridRow(this);
};

DataGrid.prototype.createControl = function () {
    return new DataGridControl();
};
//####app/new/elements/dataGrid/dataGridBuilder.js
function DataGridBuilder() {
    _.superClass(DataGridBuilder, this);
    this.columnBuilder = new DataGridColumnBuilder();
}

_.inherit(DataGridBuilder, ListEditorBaseBuilder);

_.extend(DataGridBuilder.prototype, /** @lends DataGridBuilder.prototype */{

    createElement: function (params) {
        return new DataGrid(params.parent);
    },

    applyMetadata: function (params) {
        ListEditorBaseBuilder.prototype.applyMetadata.call(this, params);

        params.element.setShowSelectors(params.metadata.ShowSelectors);
        this.applyColumnsMetadata(params);
    },

    applyColumnsMetadata: function (params) {
        var metadata = params.metadata,
            element = params.element,
            collection = element.getColumns();

        if (Array.isArray(metadata.Columns)) {
            var columns = metadata.Columns.map(function (columnMetaData) {
                return this.buildColumn(columnMetaData, params);
            }, this);

            collection.reset(columns);
        }

    },

    buildColumn: function (metadata, params) {
        return this.columnBuilder.build(params.element, metadata, params);
    },

    buildItemProperty: function (itemsBinding, itemPropertyMetadata, params) {
        var dataGrid = params.element;

        return function (context, args) {
            var index = args.index;
            var row = dataGrid.createRow();
            var columns = dataGrid.getColumns();

            var cellItemTemplates = columns.toArray().map(function (column, index) {
                var cellTemplate = column.getCellTemplate();
                var template = cellTemplate(itemsBinding);
                return template.bind(column, context, args);
            });
            row.setCellTemplates(cellItemTemplates);
            row.setMultiSelect(dataGrid.getMultiSelect());
            row.setShowSelectors(dataGrid.getShowSelectors());
            return row;
        };
    }

});
//####app/new/elements/dataGrid/dataGridColumn.js
function DataGridColumn() {
    this._values = Object.create(null);
}

DataGridColumn.prototype.setHeader = function (value) {
    this.setProperty('header', value);
};

DataGridColumn.prototype.getHeader = function () {
    return this.getProperty('header');
};

DataGridColumn.prototype.setCellTemplate = function (value) {
    this.setProperty('cellTemplate', value);
};

DataGridColumn.prototype.getCellTemplate = function () {
    return this.getProperty('cellTemplate');
};

DataGridColumn.prototype.setCellSelector = function (value) {
    this.setProperty('cellSelector', value);
};

DataGridColumn.prototype.getCellSelector = function () {
    return this.getProperty('cellSelector');
};

DataGridColumn.prototype.setHeaderTemplate = function (value) {
    this.setProperty('cellHeaderTemplate', value);
};

DataGridColumn.prototype.getHeaderTemplate = function () {
    return this.getProperty('cellHeaderTemplate');
};


/**
 * @description Для взаимодействие с DataBinding
 * @param propertyName
 * @param callback
 */
DataGridColumn.prototype.onPropertyChanged = function (propertyName, callback) {
    this.on('change:' + propertyName, callback);
};

/**
 * @description Для взаимодействие с DataBinding
 * @param propertyName
 * @param propertyValue
 */
DataGridColumn.prototype.setProperty = function (propertyName, propertyValue) {
    var oldValue = this._values[propertyName];

    this._values[propertyName] = propertyValue;
    if (oldValue !== propertyValue) {
        this.trigger('change:' + propertyName, null, {
            property: propertyName,
            oldValue: oldValue,
            newValue: propertyValue
        });
    }
};

DataGridColumn.prototype.getProperty = function (propertyName) {
    return this._values[propertyName];
};

_.extend(DataGridColumn.prototype, Backbone.Events);
//####app/new/elements/dataGrid/dataGridColumnBuilder.js
/**
 *
 * @constructor
 */
function DataGridColumnBuilder () {


}

_.extend(DataGridColumnBuilder.prototype, displayFormatBuilderMixin);

/**
 *
 * @param {DataGrid} element
 * @param {Object} metadata метаданные колонки грида
 * @param {Object} params
 * @returns {DataGridColumn}
 */
DataGridColumnBuilder.prototype.build = function (element, metadata, params) {
    var column = new DataGridColumn();

    this
        .buildHeader(column, metadata, params)
        .buildHeaderTemplate(column, metadata, params)
        .buildCellTemplate(column, metadata, params);

    return column;
};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildHeader = function (column, metadata, params) {

    if (metadata.Header && typeof metadata.Header === 'object') {
        //Header указывает на DataBinding
        var
            builder = params.builder,
            binding = builder.buildType('PropertyBinding', metadata.Header, {
                parent: params.element,
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            });

        binding.bindElement(column, 'header');
    } else {
        //Header содержит значение для шаблона
        column.setHeader(metadata.Header);
    }
    return this;
};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildCellTemplate = function (column, metadata, params) {
    var cellTemplate;

    if ('CellTemplate' in metadata) {
        cellTemplate = this.buildCellTemplateByTemplate(params, metadata.CellTemplate);
    } else if ('CellFormat' in metadata) {
        cellTemplate = this.buildCellTemplateByFormat(params, metadata.CellFormat);
    } else if ('CellSelector' in metadata) {
        cellTemplate = this.buildCellTemplateBySelector(params, metadata.CellSelector);
    } else {
        var cellProperty = 'CellProperty' in metadata ? metadata.CellProperty : '';
        cellTemplate = this.buildCellTemplateByDefault(params, cellProperty);
    }
    column.setCellTemplate(cellTemplate);
    return this;
};

DataGridColumnBuilder.prototype.buildCellTemplateByTemplate = function (params, cellTemplateMetadata) {
    var dataGrid = params.element;
    var builder = params.builder;
    var basePathOfProperty = params.basePathOfProperty || new BasePathOfProperty('');

    return function (itemsBinding) {
        return function  (context, args) {
            var index = args.index;
            var argumentForBuilder = {
                parent: dataGrid,
                parentView: params.parentView
            };
            argumentForBuilder.basePathOfProperty = basePathOfProperty.buildChild('', index);

            return builder.build(cellTemplateMetadata, argumentForBuilder);
        }

    };
};

DataGridColumnBuilder.prototype.buildCellTemplateByFormat = function (params, cellFormatMetadata) {
    var column = params.element,
        grid = column.parent,
        format = this.buildDisplayFormat(cellFormatMetadata, params);

    return function  (itemsBinding) {
        return function (context, args) {
            var index = args.index;
            var label = new Label(this);

            var sourceProperty = itemsBinding.getSourceProperty();
            var source = itemsBinding.getSource();
            var binding = new DataBinding(this);

            sourceProperty = index.toString();
            if (itemsBinding.getSourceProperty() != '') {
                sourceProperty = itemsBinding.getSourceProperty() + '.' + sourceProperty;
            }

            label.setDisplayFormat(format);

            binding.bindSource(source, sourceProperty);
            binding.bindElement(label, 'value');

            return label;
        };
    };

};

DataGridColumnBuilder.prototype.buildCellTemplateBySelector = function (params, cellSelectorMetadata) {
    var column = params.element,
        grid = column.parent;

    return function  () {
        return function (context, args) {
            var label = new Label(this);
            var scriptExecutor = new ScriptExecutor(grid.getScriptsStorage());
            var value = scriptExecutor.executeScript(cellSelectorMetadata.Name || cellSelectorMetadata, {
                value: args.item
            });

            label.setText(value);
            return label;
        };
    };
};

DataGridColumnBuilder.prototype.buildCellTemplateByDefault = function (params, cellProperty) {
    var column = params.element,
        grid = column.parent;

    return function  (itemsBinding) {

        return function (context, args) {
            var index = args.index;
            var label = new Label(grid);


            var sourceProperty;
            var source = itemsBinding.getSource();
            var binding = new DataBinding(this);

            sourceProperty = index.toString();
            if (itemsBinding.getSourceProperty() != '') {
                sourceProperty = itemsBinding.getSourceProperty() + '.' + sourceProperty;
            }

            if (cellProperty != '') {
                sourceProperty = sourceProperty + '.' + cellProperty;
            }

            binding.bindSource(source, sourceProperty);
            binding.bindElement(label, 'value');

            return label;
        }
    }

};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildCellSelector = function (column, metadata, params) {

    var cellSelector;

    if (metadata.CellSelector) {
        cellSelector = function (context, args) {
            var scriptExecutor = new ScriptExecutor(params.parent);
            return scriptExecutor.executeScript(metadata.CellSelector.Name || metadata.CellSelector, args)
        };
    } else if (metadata.CellProperty) {
        var propertyName = metadata.CellProperty;
        cellSelector = function (value) {
            return InfinniUI.ObjectUtils.getPropertyValue(value, propertyName);
        }
    } else {
        cellSelector = function (value) {
            return value;
        }
    }

    column.setCellSelector(cellSelector);
    return this;
};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildHeaderTemplate = function (column, metadata, params) {
    var
        headerTemplate,
        headerTemplateMetadata = metadata.HeaderTemplate;

    if (typeof headerTemplateMetadata === 'undefined' || _.isEmpty(headerTemplateMetadata)) {
        headerTemplate = this.buildHeaderTemplateByDefault(params);
    } else {
        headerTemplate = this.buildHeaderTemplateByMetadata(headerTemplateMetadata, params);
    }

    column.setHeaderTemplate(headerTemplate);

    return this;
};

/**
 * @protected
 * @param {Object} headerTemplateMetadata
 * @param {Object} params
 * @returns {Function}
 */
DataGridColumnBuilder.prototype.buildHeaderTemplateByMetadata = function (headerTemplateMetadata, params) {
    var element = params.element;
    var builder = params.builder;

    return function(context, args) {
        var argumentForBuilder = {
            parent: element,
            parentView: params.parentView
        };

        return builder.build(headerTemplateMetadata, argumentForBuilder);
    };
};

/**
 * @protected
 * @param {Object} params
 * @returns {Function}
 */
DataGridColumnBuilder.prototype.buildHeaderTemplateByDefault = function (params) {

    return function (context, args) {
        var label = new Label(this);
        label.setText(args.value);
        return label;
    };

};

//####app/new/elements/dataGrid/dataGridRow/dataGridRow.js
function DataGridRow() {
    _.superClass(DataGridRow, this);

}

_.inherit(DataGridRow, Element);


_.extend(DataGridRow.prototype, {

    createControl: function () {
        return new DataGridRowControl()
    },

    setCellTemplates: function (cellTemplates) {
        this.control.set('cellTemplates', cellTemplates);
    },

    toggle: function (toggle) {
        this.control.set('toggle', toggle);
    },

    setSelected: function (selected) {
        this.control.set('selected', selected);
    },

    setMultiSelect: function (multiSelect) {
        this.control.set('multiSelect', multiSelect);
    },

    setShowSelectors: function (showSelectors) {
        this.control.set('showSelectors', showSelectors);
    },

    onToggle: function (handler) {
        this.control.onToggle(handler);
    }

});


//####app/new/elements/dataNavigation/dataNavigation.js
function DataNavigation (parent) {
    _.superClass(DataNavigation, this, parent);
}

_.inherit(DataNavigation, Element);

_.extend(DataNavigation.prototype, {

    createControl: function () {
        return new DataNavigationControl();
    },

    getDataSource: function () {
        return this.control.get('dataSource');
    },

    setDataSource: function (value) {
        this.control.set('dataSource', value);
    },

    getAvailablePageSizes: function () {
        return this.control.get('availablePageSizes');
    },

    setPageNumber: function (value) {
        this.control.set('pageNumber', value)
    },

    getPageNumber: function () {
        return this.control.get('pageNumber');
    },

    onPageNumberChanged: function (handler) {
        this.control.onPageNumberChanged(this.createControlEventHandler(this, handler));
    },

    setPageSize: function (value) {
        this.control.set('pageSize', value)
    },

    getPageSize: function () {
        return this.control.get('pageSize');
    },

    onPageSizeChanged: function (handler) {
        this.control.onPageSizeChanged(this.createControlEventHandler(this, handler));
    }

});
//####app/new/elements/dataNavigation/dataNavigationBuilder.js
function DataNavigationBuilder () {
    _.superClass(DataNavigationBuilder, this);
}

_.inherit(DataNavigationBuilder, ElementBuilder);

_.extend(DataNavigationBuilder.prototype, {

    createElement: function (params) {
        return new DataNavigation(params.parent);
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var element = params.element;
        var metadata = params.metadata;

        if (Array.isArray(metadata.AvailablePageSizes)) {
            element.getAvailablePageSizes().reset(metadata.AvailablePageSizes);
        }

        var ds = this.findDataSource(params);
        if (ds) {
            element.setDataSource(ds);
            element.setPageNumber(ds.getPageNumber());
            element.setPageSize(ds.getPageSize());

            element.onPageNumberChanged(function (context, message) {
                ds.setPageNumber(message.value);
            });

            element.onPageSizeChanged(function (context, message) {
                ds.setPageSize(message.value);
            });
        } else {
            console.error('DataSource not found');
        }

    },

    findDataSource: function (params) {
        var
            name = params.metadata.DataSource,
            parent = params.parent,
            view,
            context,
            dataSource;

        if (parent) {
            view = parent.getView()
        }
        if (name && view) {
            context = view.getContext();
            dataSource = context.dataSources[name];
        }

        return dataSource;
    }

});
//####app/new/elements/datePicker/datePicker.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBase
 */
function DatePicker(parent) {
    _.superClass(DatePicker, this, parent);
}

_.inherit(DatePicker, TextEditorBase);

DatePicker.prototype.createControl = function (parent) {
    return new DatePickerControl(parent);
};

DatePicker.prototype.getMinValue = function () {
    return this.control.get('minValue');
};

DatePicker.prototype.setMinValue = function (value) {
    this.control.set('minValue', value);
};

DatePicker.prototype.getMaxValue = function () {
    return this.control.get('maxValue');
};

DatePicker.prototype.setMaxValue = function (value) {
    this.control.set('maxValue', value);
};

DatePicker.prototype.getMode = function () {
    return this.control.get('mode');
};

DatePicker.prototype.setMode = function (value) {
    this.control.set('mode', value);
};

DatePicker.prototype.setDateFormat = function (value) {
    this.control.set('format', value);
};



//####app/new/elements/datePicker/datePickerBuilder.js
/**
 *
 * @constructor
 * @augments TextEditorBaseBuilder
 */
function DatePickerBuilder() {
    _.superClass(DatePickerBuilder, this);
}

_.inherit(DatePickerBuilder, TextEditorBaseBuilder);

DatePickerBuilder.prototype.createElement = function (params) {
    return new DatePicker(params.parent);
};

DatePickerBuilder.prototype.applyMetadata = function (params) {
    var element = params.element;
    var metadata = params.metadata;
    this.applyDefaultMetadata(params);
    TextEditorBaseBuilder.prototype.applyMetadata.call(this, params);

    element.setMinValue(metadata.MinValue);
    element.setMaxValue(metadata.MaxValue);
    element.setMode(metadata.Mode);


    //var format = params.builder.buildType(params.parent, 'DateFormat', {}, null);
    //element.setDateFormat(format);
};

DatePickerBuilder.prototype.applyDefaultMetadata = function (params) {
    var metadata = params.metadata;

    var defaultFormat = {
            Date: '{:d}',
            DateTime: '{:g}',
            Time: '{:t}'
        },
        defaultEditMask = {
            Date: {DateTimeEditMask: {Mask: 'd'}},
            DateTime: {DateTimeEditMask: {Mask: 'g'}},
            Time: {DateTimeEditMask: {Mask: 't'}}
        };

    _.defaults(metadata, {Mode: 'Date'});
    _.defaults(metadata, {DisplayFormat: defaultFormat[metadata.Mode], EditMask: defaultEditMask[metadata.Mode]});
};

//####app/new/elements/fileBox/fileBox.js
/**
 *
 * @param parent
 * @augments Element
 * @mixes editorBaseMixin
 * @constructor
 */
function FileBox(parent) {
    _.superClass(FileBox, this, parent);

    this.initialize_editorBase();
}

_.inherit(FileBox, Element);

_.extend(FileBox.prototype, {
    getFile: function () {
        return this.control.get('file');
    },

    createControl: function () {
        return new FileBoxControl();
    },

    /**
     * @description Возвращает максимальный размер данных в байтах
     * @returns {number}
     */
    getMaxSize: function () {
        return this.control.get('maxSize');
    },

    /**
     * @description Устанавливает максимальный размер данных в байтах
     * @param {number} value
     */
    setMaxSize: function (value) {
        this.control.set('maxSize', value);
    },

    /**
     * @description Возвращает коллекцию допустимых форматов данных
     * @returns {Collection}
     */
    getAcceptTypes: function () {
        return this.control.get('acceptTypes');
    },


    /**
     *  Методы, не описанные в документации
     */


    /**
     * @description Недокументированный!
     * @param {Array} types
     */
    setAcceptTypes: function (types) {
        var collection = this.getAcceptTypes();
        if (Array.isArray(types)) {
            collection.set(types)
        }
    },

    // НЕдокументированные методы
    setFileName: function (value) {
        this.control.set('fileName', value);
        return this;
    },

    setFileSize: function (value) {
        this.control.set('fileSize', value);
        return this;
    },

    setFileTime: function (value) {
        this.control.set('fileTime', value);
        return this;
    },

    setFileType: function (value) {
        this.control.set('fileType', value);
        return this;
    }

    //
    //setUrl: function (value) {
    //    this.control.set('url', value);
    //},
    //
    //getUrl: function () {
    //    return this.control.get('url');
    //}

}, editorBaseMixin);
//####app/new/elements/fileBox/fileBoxBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 * @mixes editorBaseBuilderMixin
 */
function FileBoxBuilder() {
    _.superClass(FileBoxBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(FileBoxBuilder, ElementBuilder);

_.extend(FileBoxBuilder.prototype, {

    createElement: function (params) {
        return new FileBox(params.parent);
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var element = params.element;
        var metadata = params.metadata;

        if (Array.isArray(metadata.AcceptTypes)) {
            element.setAcceptTypes(metadata.AcceptTypes);
        }

        if (metadata.MaxSize !== null && typeof metadata.MaxSize !== 'undefined') {
            element.setMaxSize(metadata.MaxSize);
        }

        // Привязка данных односторонняя т.к.:
        // 1. по значению из источника данных - сформировать URL изображения.
        // 2. при выборе в элементе файла на загрузку - добавить выбранный файл в очередь на загрузку

        var converter = {
            toElement: function (context, args) {
                var value = args.value;
                var binding = args.binding;
                var ds = binding.getSource();
                var sourceProperty = binding.getSourceProperty();
                var fileProvider = ds.getFileProvider();
                var url = null;
                var info = {};
                //Формируем URL изображения
                if (value && value.Info && value.Info.ContentId && fileProvider) {
                    info = value.Info;
                    var instanceId = ds.lookupIdPropertyValue(sourceProperty);
                    if (typeof instanceId !== 'undefined') {
                        url = fileProvider.getFileUrl(binding.getSourceProperty(), instanceId, value.Info.ContentId);
                    }
                }

                element.setFileName(info.Name)
                    .setFileSize(info.Size)
                    .setFileTime(info.Time)
                    .setFileType(info.Type);

                return url;
            }
        };

        var data = this.applyMetadata_editorBaseBuilder(params, {
            //valueProperty: 'url',
            converter: converter
        });

        var binding = data.valueBinding;

        if (binding) {
            binding.setMode(BindingModes.toElement);

            params.element.onPropertyChanged('file', function (context, args) {
                var ds = binding.getSource();
                var property = args.property,
                    file = args.newValue;

                //Файл в очередь на загрузк
                ds.setFile(file, binding.getSourceProperty());
            })
        }

    }

}, editorBaseBuilderMixin);
//####app/new/elements/frame/frame.js
/**
 *
 * @constructor
 * @augments Element
 * @mixes editorBaseMixin
 */
function Frame() {
    _.superClass(Frame, this);
    this.initialize_editorBase();
}

_.inherit(Frame, Element);

_.extend(Frame.prototype, {

        createControl: function () {
            return new FrameControl();
        }

    },
    editorBaseMixin
);
//####app/new/elements/frame/frameBuilder.js
/**
 *
 * @constructor
 * @augments TextEditorBaseBuilder
 * @mixes displayFormatBuilderMixin
 * @mixes editorBaseBuilderMixin
 */
function FrameBuilder() {
    _.superClass(TextEditorBaseBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(FrameBuilder, TextEditorBaseBuilder);

_.extend(FrameBuilder.prototype, {
        applyMetadata: function(params){
            var element = params.element;
            ElementBuilder.prototype.applyMetadata.call(this, params);
            this.applyMetadata_editorBaseBuilder(params);
        },

        createElement: function(params){
            var element = new Frame(params.parent);
            return element;
        }

    },
    editorBaseBuilderMixin
);
//####app/new/elements/icon/icon.js
function Icon(parent) {
    _.superClass(Icon, this, parent);
}

_.inherit(Icon, Element);

_.extend(Icon.prototype, {

    createControl: function () {
        return new IconControl();
    },

    setValue: function(value){
        this.control.set('value', value);
    },

    getValue: function(){
        return this.control.get('value');
    },

    onValueChanged: function(){}

});
//####app/new/elements/icon/iconBuilder.js
function IconBuilder() {
    _.superClass(ButtonBuilder, this);
}

_.inherit(IconBuilder, ElementBuilder);

_.extend(IconBuilder.prototype, {

    createElement: function (params) {
        return new Icon(params.parent);
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var metadata = params.metadata;

        this.initBindingToProperty(params, 'Value');
    }

});
//####app/new/elements/imageBox/imageBox.js
/**
 *
 * @param parent
 * @augments Element
 * @mixes editorBaseMixin
 * @constructor
 */
function ImageBox(parent) {
    _.superClass(ImageBox, this, parent);

    this.initialize_editorBase();
}

_.inherit(ImageBox, Element);

_.extend(ImageBox.prototype, {
    getFile: function () {
        return this.control.get('file');
    },

    createControl: function () {
        return new ImageBoxControl();
    },

    /**
     * @description Возвращает максимальный размер данных в байтах
     * @returns {number}
     */
    getMaxSize: function () {
        return this.control.get('maxSize');
    },

    /**
     * @description Устанавливает максимальный размер данных в байтах
     * @param {number} value
     */
    setMaxSize: function (value) {
        this.control.set('maxSize', value);
    },

    /**
     * @description Возвращает коллекцию допустимых форматов данных
     * @returns {Collection}
     */
    getAcceptTypes: function () {
        return this.control.get('acceptTypes');
    },


    /**
     *  Методы, не описанные в документации
     */
    setReadOnly: function (value) {
        this.control.set('readOnly', value);
    },

    getReadOnly: function () {
        return this.control.get('readOnly');
    },

    /**
     * @description Недокументированный!
     * @param {Array} types
     */
    setAcceptTypes: function (types) {
        var collection = this.getAcceptTypes();
        if (Array.isArray(types)) {
            collection.set(types)
        }
    }

    //setUrl: function (value) {
    //    this.control.set('url', value);
    //},
    //
    //getUrl: function () {
    //    return this.control.get('url');
    //}

}, editorBaseMixin);
//####app/new/elements/imageBox/imageBoxBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 * @mixes editorBaseBuilderMixin
 */
function ImageBoxBuilder() {
    _.superClass(ImageBoxBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(ImageBoxBuilder, ElementBuilder);

_.extend(ImageBoxBuilder.prototype, {

    createElement: function (params) {
        return new ImageBox(params.parent);
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var element = params.element;
        var metadata = params.metadata;

        element.setReadOnly(metadata.ReadOnly);

        if (Array.isArray(metadata.AcceptTypes)) {
            element.setAcceptTypes(metadata.AcceptTypes);
        }

        if (metadata.MaxSize !== null && typeof metadata.MaxSize !== 'undefined') {
            element.setMaxSize(metadata.MaxSize);
        }

        // Привязка данных односторонняя т.к.:
        // 1. по значению из источника данных - сформировать URL изображения.
        // 2. при выборе в элементе файла на загрузку - добавить выбранный файл в очередь на загрузку

        var converter = {
            toElement: function (context, args) {
                var value = args.value;
                var binding = args.binding;
                var ds = binding.getSource();
                var sourceProperty = binding.getSourceProperty();
                var fileProvider = ds.getFileProvider();
                var url = null;
                //Формируем URL изображения

                if (value && value.Info && value.Info.ContentId && fileProvider) {
                    var instanceId = ds.lookupIdPropertyValue(sourceProperty);
                    if (typeof instanceId !== 'undefined') {
                        url = fileProvider.getFileUrl(binding.getSourceProperty(), instanceId, value.Info.ContentId);
                    }
                }
                return url;
            }
        };

        var data = this.applyMetadata_editorBaseBuilder(params, {
            //valueProperty: 'url',
            converter: converter
        });

        var binding = data.valueBinding;
        if (binding) {
            binding.setMode(BindingModes.toElement);

            var ds = binding.getSource();
            var fileProvider = ds.getFileProvider();

            params.element.onPropertyChanged('file', function (context, args) {
                var property = args.property,
                    file = args.newValue;

                //Файл в очередь на загрузк
                ds.setFile(file, binding.getSourceProperty());
            });

            ds.onItemsUpdated(function (context, args) {
                /**
                 * @TODO Принудительное обновление изображений. Удалить после изменений на backend'е,
                 * когда будет изменяться BlobInfo
                 */
                var element = params.element;
                var url = element.getValue();
                var pattern = /&salt=.*$/;
                if (url) {
                    var salt = '&salt=' + Date.now();
                    if (pattern.test(url)) {
                        url.replace(pattern, salt);
                    } else {
                        url += salt;
                    }
                    element.setValue(url);
                }
            });

            //params.element.onPropertyChanged('value', function (context, args) {
            //    var url = null;
            //    var value = args.newValue;
            //    //Формируем URL изображения
            //    if (value && value.ContentId && fileProvider) {
            //        url = fileProvider.getFileUrl(binding.getSourceProperty(), value.ContentId);
            //    }
            //    params.element.setProperty('url', url);
            //});
        }

    }

}, editorBaseBuilderMixin);
//####app/new/elements/label/label.js
function Label(parent, viewMode) {
    _.superClass(Label, this, parent, viewMode);
    this.initialize_editorBase();
}

_.inherit(Label, Element);


_.extend(Label.prototype, {

        createControl: function () {
            return new LabelControl();
        },

        getLineCount: function () {
            return this.control.get('lineCount');
        },

        setLineCount: function (value) {
            this.control.set('lineCount', value);
        },

        setTextWrapping: function (value) {
            if (typeof value === 'boolean') {
                this.control.set('textWrapping', value);
            }
        },

        getTextWrapping: function () {
            return this.control.get('textWrapping');
        },

        setTextTrimming: function (value) {
            if (typeof value === 'boolean') {
                this.control.set('textTrimming', value);
            }
        },

        getTextTrimming: function () {
            return this.control.get('textTrimming');
        },

        getDisplayFormat: function () {
            return this.control.get('displayFormat');
        },

        setDisplayFormat: function (value) {
            return this.control.set('displayFormat', value);
        },
        
        getDisplayValue: function () {
            return this.control.getDisplayValue();
        }

    },
    editorBaseMixin
    //formatPropertyMixin,
    //elementHorizontalTextAlignmentMixin,
    //@TODO TextTrimming
    //elementBackgroundMixin,
    //elementForegroundMixin,
    //elementTextStyleMixin
);
//####app/new/elements/label/labelBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 * @mixes displayFormatBuilderMixin
 * @mixes editorBaseBuilderMixin
 */
function LabelBuilder() {
    _.superClass(TextEditorBaseBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(LabelBuilder, ElementBuilder);
_.extend(LabelBuilder.prototype, {
    applyMetadata: function(params){
        var element = params.element;
        ElementBuilder.prototype.applyMetadata.call(this, params);
        this.applyMetadata_editorBaseBuilder(params);

        element.setLineCount(params.metadata.LineCount);
        element.setTextWrapping(params.metadata.TextWrapping);
        element.setTextTrimming(params.metadata.TextTrimming);
        
        this.initDisplayFormat(params);
        this.initScriptsHandlers(params);
        //this.initHorizontalTextAlignmentProperty(params);
        //this.initForeground(params);
        //this.initBackground(params);
        //this.initTextStyle(params);

    },

    initDisplayFormat: function (params) {
        var metadata = params.metadata;
        var format = this.buildDisplayFormat(metadata.DisplayFormat, params);
        params.element.setDisplayFormat(format);
    },

    initScriptsHandlers: function(params){
        var metadata = params.metadata;

        //Скриптовые обработчики на события
        if (params.view && metadata.OnLoaded){
            params.element.onLoaded(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name || metadata.OnLoaded);
            });
        }

        if (params.view && metadata.OnValueChanged){
            params.element.onValueChanged(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnValueChanged.Name || metadata.OnValueChanged);
            });
        }
    },

    createElement: function(params){
        var label = new Label(params.parent, params.metadata['ViewMode']);
        label.getHeight = function () {
            return 34;
        };
        return label;
    }

},
    editorBaseBuilderMixin,
    displayFormatBuilderMixin
    //builderHorizontalTextAlignmentPropertyMixin,
    //builderBackgroundMixin,
    //builderForegroundMixin,
    //builderTextStyleMixin
);
//####app/new/elements/menuBar/menuBar.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function MenuBar(parent) {
    _.superClass(MenuBar, this, parent);
}

_.inherit(MenuBar, Container);

_.extend(MenuBar.prototype, {
    createControl: function (viewMode) {
        return new MenuBarControl(viewMode);
    }
});
//####app/new/elements/menuBar/menuBarBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function MenuBarBuilder() {
    _.superClass(MenuBarBuilder, this);
}

_.inherit(MenuBarBuilder, ContainerBuilder);

_.extend(MenuBarBuilder.prototype,
    /** @lends MenuBarBuilder.prototype*/
    {
        createElement: function (params) {
            return new MenuBar(params.parent);
        }

    });

//####app/new/elements/numericBox/numericBox.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBase
 */
function NumericBox(parent) {
    _.superClass(NumericBox, this, parent);
}

_.inherit(NumericBox, TextEditorBase);

NumericBox.prototype.createControl = function (parent) {
    return new NumericBoxControl(parent);
};

NumericBox.prototype.getMinValue = function () {
    return this.control.get('minValue');
};

NumericBox.prototype.setMinValue = function (value) {
    this.control.set('minValue', value);
};

NumericBox.prototype.getMaxValue = function () {
    return this.control.get('maxValue');
};

NumericBox.prototype.setMaxValue = function (value) {
    this.control.set('maxValue', value);
};

NumericBox.prototype.getIncrement = function () {
    return this.control.get('increment');
};

NumericBox.prototype.setIncrement = function (value) {
    this.control.set('increment', value);
};

//####app/new/elements/numericBox/numericBoxBuilder.js
/**
 *
 * @constructor
 * @augments TextEditorBaseBuilder
 */
function NumericBoxBuilder() {
    _.superClass(NumericBoxBuilder, this);
}

_.inherit(NumericBoxBuilder, TextEditorBaseBuilder);

NumericBoxBuilder.prototype.createElement = function (params) {
    return new NumericBox(params.parent);
};

NumericBoxBuilder.prototype.applyMetadata = function (params) {
    TextEditorBaseBuilder.prototype.applyMetadata.call(this, params);

    var element = params.element;
    var metadata = params.metadata;

    element.setMinValue(metadata.MinValue);
    element.setMaxValue(metadata.MaxValue);
    element.setIncrement(metadata.Increment);
};


//####app/new/elements/panel/panel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function Panel(parent) {
    _.superClass(Panel, this, parent);
}

_.inherit(Panel, Container);

/**
 * @description Возвращает значение, определяющее, свернута ли панель
 * @returns {boolean}
 */
Panel.prototype.getCollapsible = function () {
    return this.control.get('collapsible');
};

/**
 * @description Устанавливает значение, определяющее, разрешено ли сворачивание панели
 * @param {boolean} value
 */
Panel.prototype.setCollapsible = function (value) {
    if (typeof value !== 'undefined') {
        this.control.set('collapsible', !!value);
    }
};

/**
 * @description Возвращает значение, определяющее, свернута ли панель
 * @returns {boolean}
 */
Panel.prototype.getCollapsed = function () {
    return this.control.get('collapsed');
};

/**
 * @description Устанавливает значение, определяющее, свернута ли панель
 * @param {boolean} value
 */
Panel.prototype.setCollapsed = function (value) {
    if (typeof value !== 'undefined') {
        this.control.set('collapsed', !!value);
    }
};

/**
 * @description Возвращает функцию шаблонизации заголовка панели
 * @returns {Function}
 */
Panel.prototype.getHeaderTemplate = function () {
    return this.control.get('headerTemplate');
};

/**
 * @description Устанавливает функцию шаблонизации заголовка панели
 * @param {Function} value
 */
Panel.prototype.setHeaderTemplate = function (value) {
    this.control.set('headerTemplate', value);
};

/**
 * @description Возвращает заголовок панели
 * @returns {*}
 */
Panel.prototype.getHeader = function () {
    return this.control.get('header');
};

/**
 * @description Устанавливает заголовок панели
 * @param {*} value
 */
Panel.prototype.setHeader = function (value) {
    this.control.set('header', value);
};

/**
 * @description Устанавливает обработчик события о том, что панель разворачивается
 * @param {Function} handler
 */
Panel.prototype.onExpanding = function (handler) {
    this.control.on('expanding', handler);
};

/**
 * @description Устанавливает обработчик события о том, что панель была развернута
 * @param {Function} handler
 */
Panel.prototype.onExpanded = function (handler) {
    this.control.on('expanded', handler);
};

/**
 * @description Устанавливает обработчик события о том, что панель сворачивается
 * @param {Function} handler
 */
Panel.prototype.onCollapsing = function (handler) {
    this.control.on('collapsing', handler);
};

/**
 * @description Устанавливает обработчик события о том, что панель была свернута
 * @param {Function} handler
 */
Panel.prototype.onCollapsed = function (handler) {
    this.control.on('collapsed', handler);
};

/**
 *
 * @returns {PanelControl}
 */
Panel.prototype.createControl = function () {
    return new PanelControl();
};
//####app/new/elements/panel/panelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function PanelBuilder() {
    _.superClass(PanelBuilder, this);
}

_.inherit(PanelBuilder, ContainerBuilder);

_.extend(PanelBuilder.prototype, /** @lends PanelBuilder.prototype*/ {
    createElement: function (params) {
        return new Panel(params.parent);
    },

    /**
     * @param {Object} params
     * @param {Panel} params.element
     * @param {Object} params.metadata
     */
    applyMetadata: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        var data = ContainerBuilder.prototype.applyMetadata.call(this, params);

        element.setCollapsible(metadata.Collapsible);
        element.setCollapsed(metadata.Collapsed);

        var headerTemplate = this.buildHeaderTemplate(metadata.HeaderTemplate, params);
        element.setHeaderTemplate(headerTemplate);

        if (metadata.Header && typeof metadata.Header === 'object') {
            //Header указывает на DataBinding
            var
                builder = params.builder,
                binding = builder.buildType('PropertyBinding', metadata.Header, {
                    parent: element,
                    parentView: params.parentView,
                    basePathOfProperty: params.basePathOfProperty
                });

            binding.bindElement(element, 'header');
        } else {
            //Header содержит значение для шаблона
            element.setHeader(metadata.Header);
        }

        this.initEventHandler(params);

        return data;
    },

    /**
     * @protected
     * @param {Object} params
     */
    initEventHandler: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        if (metadata.OnExpanding) {
            element.onExpanding(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnExpanding.Name, args);
            });
        }
        if (metadata.OnExpanded) {
            element.onExpanded(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnExpanded.Name, args);
            });
        }
        if (metadata.OnCollapsing) {
            element.onCollapsing(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnCollapsing.Name, args);
            });
        }
        if (metadata.OnCollapsed) {
            element.onCollapsed(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnCollapsed.Name, args);
            });
        }

        function createScriptExecutor () {
            return new ScriptExecutor(params.parentView)
        }
    },

    /**
     * @protected
     * @param {Object} headerTemplateMetadata
     * @param {Object} params
     * @returns {Function}
     */
    buildHeaderTemplate: function (headerTemplateMetadata, params) {
        var headerTemplate;
        if (typeof headerTemplateMetadata === 'undefined' || _.isEmpty(headerTemplateMetadata)) {
            headerTemplate = this.buildDefaultHeaderTemplate(params);
        } else {
            headerTemplate = this.buildMetadataHeaderTemplate(headerTemplateMetadata, params);
        }

        return headerTemplate;
    },

    /**
     * @protected
     * @params {Object} params
     * @return {Function}
     */
    buildDefaultHeaderTemplate: function (params) {

        return function (context, args) {
            var label = new Label(this);
            label.setText(args.value);
            return label;
        }
    },

    /**
     * @protected
     * @param {Object} headerTemplateMetadata
     * @param {Object} params
     * @returns {Function}
     */
    buildMetadataHeaderTemplate: function (headerTemplateMetadata, params) {
        var element = params.element;
        var builder = params.builder;

        return function(context, args) {
            var argumentForBuilder = {
                parent: element,
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            };

            return builder.build(headerTemplateMetadata, argumentForBuilder);
        };
    }

});

//####app/new/elements/passwordBox/passwordBox.js
/**
 *
 * @constructor
 * @augments Element
 * @mixes editorBaseMixin
 */
function PasswordBox(parent) {
    _.superClass(PasswordBox, this, parent);
    this.initialize_editorBase();
}

_.inherit(PasswordBox, Element);

_.extend(PasswordBox.prototype, /* @lends PasswordBox.prototype */ {

        getLabelText: function () {
            return this.control.get('labelText');
        },

        setLabelText: function (value) {
            this.control.set('labelText', value);
        },

        getPasswordChar: function () {
            return this.control.get('passwordChar');
        },

        setPasswordChar: function (value) {
            this.control.set('passwordChar', value);
        },

        createControl: function () {
            return new PasswordBoxControl();
        }

    },
    editorBaseMixin
);

//####app/new/elements/passwordBox/passwordBoxBuilder.js
/**
 * @constructor
 * @augments ElementBuilder
 * @mixes editorBaseBuilderMixin
 */
function PasswordBoxBuilder() {
    _.superClass(PasswordBoxBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(PasswordBoxBuilder, ElementBuilder);

_.extend(PasswordBoxBuilder.prototype, /** @lends PasswordBoxBuilder.prototype */ {

        applyMetadata: function (params) {
            ElementBuilder.prototype.applyMetadata.call(this, params);
            this.applyMetadata_editorBaseBuilder(params);

            var metadata = params.metadata,
                element = params.element;

            element.setLabelText(metadata.LabelText);
            element.setPasswordChar(metadata.PasswordChar);
        },

        createElement: function (params) {
            var element = new PasswordBox(params.parent);
            return element;
        }

    },
    editorBaseBuilderMixin
);
//####app/new/elements/popupButton/popupButton.js
/**
 * @class
 * @constructor
 * @augments Container
 * @augments Button
 */
function PopupButton(parent, viewMode) {
    _.superClass(PopupButton, this, parent, viewMode);
    this.buttonInit();
}

_.inherit(PopupButton, Container);

_.extend(PopupButton.prototype, {

    createControl: function (viewMode) {
        return new PopupButtonControl(viewMode);
    }

}, buttonMixin);
//####app/new/elements/popupButton/popupButtonBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function PopupButtonBuilder() {
    _.superClass(PopupButtonBuilder, this);
}

_.inherit(PopupButtonBuilder, ContainerBuilder);

_.extend(PopupButtonBuilder.prototype, /** @lends PopupButtonBuilder.prototype */{

    createElement: function (params) {
        var viewMode = this.detectViewMode(params);
        return new PopupButton(params.parent, viewMode);
    },

    detectViewMode: function(params){
        var viewMode = params.metadata['ViewMode'];
        var el = params.parent;
        var exit = false;

        if(!viewMode){
            while(!exit){
                if(el){
                    if(el instanceof MenuBar){
                        viewMode = 'forMenu';
                        exit = true;
                    }else{
                        el = el.parent;
                    }
                }else{
                    exit = true;
                }
            }

        }

        return viewMode
    },

    applyMetadata: function (params) {
        ContainerBuilder.prototype.applyMetadata.call(this, params);
        this.applyButtonMetadata.call(this, params);
    }

}, buttonBuilderMixin);
//####app/new/elements/radioGroup/radioGroupBuilder.js
function RadioGroupBuilder() {
    _.superClass(RadioGroupBuilder, this);
}

_.inherit(RadioGroupBuilder, ListBoxBuilder);

_.extend(RadioGroupBuilder.prototype, {

    createElement: function (params) {
        var viewMode = params.metadata['ViewMode'] || 'checking';
        return new ListBox(params.parent, viewMode);
    },

    applyMetadata: function (params) {
        var element = params.element;
        ListBoxBuilder.prototype.applyMetadata.call(this, params);

        element.setMultiSelect(false);
    }

});
//####app/new/elements/scrollPanel/scrollPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function ScrollPanel(parent) {
    _.superClass(ScrollPanel, this, parent);
}

_.inherit(ScrollPanel, Container);

/**
 * @description Возвращает видимость полосы прокрутки по горизонтали
 * @returns {*}
 */
ScrollPanel.prototype.getHorizontalScroll = function () {
    return this.control.get('horizontalScroll');
};

/**
 * @description Устанавливает видимость полосы прокрутки по горизонтали
 * @param value
 */
ScrollPanel.prototype.setHorizontalScroll = function (value) {
    if (InfinniUI.Metadata.isValidValue(value, ScrollVisibility)) {
        this.control.set('horizontalScroll', value);
    }
};

/**
 * @description Возвращает видимость полосы прокрутки по вертикали
 * @returns {*}
 */
ScrollPanel.prototype.getVerticalScroll = function () {
    return this.control.get('verticalScroll');
};

/**
 * @description Устанавливает видимость полосы прокрутки по вертикали
 * @param value
 */
ScrollPanel.prototype.setVerticalScroll = function (value) {
    if (InfinniUI.Metadata.isValidValue(value, ScrollVisibility)) {
        this.control.set('verticalScroll', value);
    }
};

/**
 * @protected
 * @returns {PanelControl}
 */
ScrollPanel.prototype.createControl = function () {
    return new ScrollPanelControl();
};
//####app/new/elements/scrollPanel/scrollPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function ScrollPanelBuilder() {
    _.superClass(ScrollPanelBuilder, this);
}

_.inherit(ScrollPanelBuilder, ContainerBuilder);

_.extend(ScrollPanelBuilder.prototype, /** @lends ScrollPanelBuilder.prototype*/ {

    createElement: function (params) {
        return new ScrollPanel(params.parent);
    },

    /**
     * @param {Object} params
     * @param {Panel} params.element
     * @param {Object} params.metadata
     */
    applyMetadata: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        var data = ContainerBuilder.prototype.applyMetadata.call(this, params);

        element.setHorizontalScroll(metadata.HorizontalScroll);
        element.setVerticalScroll(metadata.VerticalScroll);

        return data;
    }

});

//####app/new/elements/stackPanel/stackPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function StackPanel(parent) {
    _.superClass(StackPanel, this, parent);
}

_.inherit(StackPanel, Container);

StackPanel.prototype.getOrientation = function () {
    return this.control.get('orientation');
};

StackPanel.prototype.setOrientation = function (value) {
    if (InfinniUI.Metadata.isValidValue(value, StackPanelOrientation)) {
        this.control.set('orientation', value)
    }
};

StackPanel.prototype.createControl = function () {
    return new StackPanelControl();
};
//####app/new/elements/stackPanel/stackPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function StackPanelBuilder() {
    _.superClass(StackPanelBuilder, this);
}

_.inherit(StackPanelBuilder, ContainerBuilder);

_.extend(StackPanelBuilder.prototype,
    /** @lends StackPanelBuilder.prototype*/
    {
        createElement: function (params) {
            return new StackPanel(params.parent);
        },

        /**
         * @param {Object} params
         * @param {StackPanel} params.element
         * @param {Object} params.metadata
         */
        applyMetadata: function (params) {
            var
                metadata = params.metadata,
                element = params.element;

            ContainerBuilder.prototype.applyMetadata.call(this, params);
            element.setOrientation(metadata.Orientation);
        }

    });

//####app/new/elements/tabPanel/tabPage/tabPage.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function TabPage(parent) {
    _.superClass(TabPage, this, parent);
    this.events = new EventsManager();
    var element = this;

    this.control.on('close', function () {
        element.close();
    });
}

_.inherit(TabPage, Container);

/**
 * @description Возвращает изображение заголовка страницы
 * @returns {string}
 */
TabPage.prototype.getIcon = function () {
    return this.control.get('icon');
};

/**
 * @description Устанавливает изображение заголовка страницы
 * @param {string} value
 */
TabPage.prototype.setIcon = function (value) {
    this.control.set('icon', value);
};

/**
 * @description Возвращает значение, определяющее, разрешено ли закрытие страницы
 * @returns {boolean}
 */
TabPage.prototype.getCanClose = function () {
    return this.control.get('canClose');
};

/**
 * @description Устанавливает значение, определяющее, разрешено ли закрытие страницы
 * @param {boolean} value
 */
TabPage.prototype.setCanClose = function (value) {
    this.control.set('canClose', value);
};

/**
 * @description Закрывает страницу
 * @param {Function} [success] Необязательный. Обработчик события о том, что страница была закрыта
 * @param {Function} [error] Необязательный. Обработчик события о том, что при закрытии произошла ошибка
 */
TabPage.prototype.close = function (success, error) {
    var
        canClose = this.getCanClose(),
        element = this,
        events = this.events;

    if (canClose) {
        this.events.trigger('closing')
            .done(function () {
                //@TODO Закрыть представление
                if (element.parent) {
                    element.parent.closeTab(element);
                }
                typeof success === 'function' && success();
                events.trigger('closed');
            })
            .fail(function () {
                typeof error === 'function' && error();
            });
    }
};

/**
 * @description Устанавливает обработчик события о том, что страница закрывается
 * @param handler
 */
TabPage.prototype.onClosing = function (handler) {
    this.events.on('closing', handler)
};

/**
 * @description Устанавливает обработчик события о том, что страница была закрыта
 * @param handler
 */
TabPage.prototype.onClosed = function (handler) {
    this.events.on('closed', handler)
};

/**
 * @description Возвращает значение, определябщее что данная вкладка выбрана
 * @returns {boolean}
 */
TabPage.prototype.getSelected = function () {
    return this.control.get('selected');
};

TabPage.prototype.setSelected = function (value) {
    this.control.set('selected', value);
};

/**
 * @protected
 * @returns {PanelControl}
 */
TabPage.prototype.createControl = function () {
    return new TabPageControl();
};


//####app/new/elements/tabPanel/tabPage/tabPageBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function TabPageBuilder() {
    _.superClass(TabPageBuilder, this);
}

_.inherit(TabPageBuilder, ContainerBuilder);

_.extend(TabPageBuilder.prototype, /** @lends TabPageBuilder.prototype*/ {

    createElement: function (params) {
        return new TabPage(params.parent);
    },

    /**
     * @param {Object} params
     * @param {Panel} params.element
     * @param {Object} params.metadata
     */
    applyMetadata: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        var data = ContainerBuilder.prototype.applyMetadata.call(this, params);

        element.setIcon(metadata.Icon);
        element.setCanClose(metadata.CanClose);

        this.initScriptHandlers(params);

        return data;
    },

    /**
     * @protected
     * @param params
     */
    initScriptHandlers: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        if (metadata.OnClosing) {
            element.onClosing(function () {
                return new ScriptExecutor(params.parentView).executeScript(metadata.OnClosing.Name || metadata.OnClosing, {});
            });
        }

        if (metadata.OnClosed) {
            element.onClosed(function () {
                return new ScriptExecutor(params.parentView).executeScript(metadata.OnClosed.Name || metadata.OnClosed, {});
            });
        }
    }



});

//####app/new/elements/tabPanel/tabPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function TabPanel(parent) {
    _.superClass(TabPanel, this, parent);
}

_.inherit(TabPanel, Container);


/**
 * @description Возвращает расположение закладок
 * @returns {*}
 */
TabPanel.prototype.getHeaderLocation = function () {
    return this.control.get('headerLocation');
};

/**
 * @description Устанавливает расположение закладок
 * @param value
 */
TabPanel.prototype.setHeaderLocation = function (value) {
    if (InfinniUI.Metadata.isValidValue(value, TabHeaderLocation)) {
        this.control.set('headerLocation', value);
    }
};

/**
 * @description Возвращает ориентацию закладок.
 * @returns {*}
 */
TabPanel.prototype.getHeaderOrientation = function () {
    return this.control.get('headerOrientation');
};

/**
 * @description Устанавливает ориентацию закладок
 * @param value
 */
TabPanel.prototype.setHeaderOrientation = function (value) {
    if (InfinniUI.Metadata.isValidValue(value, TabHeaderOrientation)) {
        this.control.set('headerOrientation', value);
    }
};

/**
 * @description Устанавливает функцию шаблонизации закладок дочерних элементов панели
 * @param {Function} value
 */
TabPanel.prototype.setHeaderTemplate = function (value) {
    this.control.set('headerTemplate', value);
};

/**
 * @description Возвращает функцию шаблонизации закладок дочерних элементов панели
 * @returns {Function}
 */
TabPanel.prototype.getHeaderTemplate = function () {
    return this.control.get('headerTemplate');
};

/**
 * @description Устанавливает выделенный дочерний элемент панели
 * @param {TabPage} value
 * @returns {boolean} успешность выделения дочернего элемента панели. false - элемент не был выделен, true - элемент успешно выделен
 */
TabPanel.prototype.setSelectedItem = function (value) {
    return this.control.setSelectedItem(value);
};

/**
 * @description Возвращает выделенный дочерний элемент панели
 * @returns {TabPage}
 */
TabPanel.prototype.getSelectedItem = function () {
    return this.control.get('selectedItem');
};

/**
 * @description Устанавливает обработчик события о том, что выделенный элемент изменился
 * @param {Function} handler
 */
TabPanel.prototype.onSelectedItemChanged = function (handler) {
    this.control.on('change:selectedItem', handler);
};

/**
 * @description Недокументированный метод. Закрывает заданную вкладку
 * @param {TabPage} element
 */
TabPanel.prototype.closeTab = function (element) {
    var
        index = this.childElements.indexOf(element);

    if (index === -1 ) {
        throw new Error('TabPage not found in TabPanel.childElements');
    } else {
        this.getItems().removeAt(index);
    }
};

/**
 * @protected
 * @returns {PanelControl}
 */
TabPanel.prototype.createControl = function () {
    return new TabPanelControl();
};
//####app/new/elements/tabPanel/tabPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function TabPanelBuilder() {
    _.superClass(TabPanelBuilder, this);
}

_.inherit(TabPanelBuilder, ContainerBuilder);

_.extend(TabPanelBuilder.prototype, /** @lends TabPanelBuilder.prototype*/ {

    createElement: function (params) {
        return new TabPanel(params.parent);
    },

    /**
     * @param {Object} params
     * @param {Panel} params.element
     * @param {Object} params.metadata
     */
    applyMetadata: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        var data = ContainerBuilder.prototype.applyMetadata.call(this, params);

        element.setHeaderLocation(metadata.HeaderLocation);
        element.setHeaderOrientation(metadata.HeaderOrientation);

        this.initScriptHandlers(params);
        return data;
    },

    initScriptHandlers: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        element.onSelectedItemChanged(function (context, args) {
            var exchange = window.InfinniUI.global.messageBus;
            exchange.send('OnChangeLayout', {});
        });

        if (metadata.OnSelectedItemChanged) {
            element.onSelectedItemChanged(function (context, args) {
                return new ScriptExecutor(params.parentView)
                    .executeScript(metadata.OnSelectedItemChanged.Name, args);
            });
        }
    }


});

//####app/new/elements/tablePanel/cell/cell.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function Cell(parent) {
    _.superClass(Cell, this, parent);
}

_.inherit(Cell, Container);

_.extend(Cell.prototype, {
    createControl: function () {
        return new CellControl();
    },

    getColumnSpan: function(){
        return this.control.get('columnSpan');
    },

    setColumnSpan: function(newColumnSpan){
        this.control.set('columnSpan', newColumnSpan);
    }
});
//####app/new/elements/tablePanel/cell/cellBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function CellBuilder() {
    _.superClass(CellBuilder, this);
}

_.inherit(CellBuilder, ContainerBuilder);

_.extend(CellBuilder.prototype,
    /** @lends CellBuilder.prototype*/
    {
        createElement: function (params) {
            return new Cell(params.parent);
        },

        /**
         * @param {Object} params
         * @param {CellBuilder} params.element
         * @param {Object} params.metadata
         */
        applyMetadata: function (params) {
            var
                metadata = params.metadata,
                element = params.element;

            ContainerBuilder.prototype.applyMetadata.call(this, params);

            params.element.setColumnSpan(metadata.ColumnSpan);
        }

    });

//####app/new/elements/tablePanel/row/RowBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function RowBuilder() {
    _.superClass(RowBuilder, this);
}

_.inherit(RowBuilder, ContainerBuilder);

_.extend(RowBuilder.prototype,
    /** @lends RowBuilder.prototype*/
    {
        createElement: function (params) {
            return new Row(params.parent);
        },

        /**
         * @param {Object} params
         * @param {RowBuilder} params.element
         * @param {Object} params.metadata
         */
        applyMetadata: function (params) {
            var
                metadata = params.metadata,
                element = params.element;

            ContainerBuilder.prototype.applyMetadata.call(this, params);
        }

    });

//####app/new/elements/tablePanel/row/row.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function Row(parent) {
    _.superClass(Row, this, parent);
}

_.inherit(Row, Container);

_.extend(Row.prototype, {
    createControl: function () {
        return new RowControl();
    }
});
//####app/new/elements/tablePanel/tablePanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function TablePanel(parent) {
    _.superClass(TablePanel, this, parent);
}

_.inherit(TablePanel, Container);

_.extend(TablePanel.prototype, {
    createControl: function () {
        return new TablePanelControl();
    }
});
//####app/new/elements/tablePanel/tablePanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function TablePanelBuilder() {
    _.superClass(TablePanelBuilder, this);
}

_.inherit(TablePanelBuilder, ContainerBuilder);

_.extend(TablePanelBuilder.prototype,
    /** @lends TablePanelBuilder.prototype*/
    {
        createElement: function (params) {
            return new TablePanel(params.parent);
        },

        /**
         * @param {Object} params
         * @param {TablePanel} params.element
         * @param {Object} params.metadata
         */
        applyMetadata: function (params) {
            var
                metadata = params.metadata,
                element = params.element;

            ContainerBuilder.prototype.applyMetadata.call(this, params);
        }

    });

//####app/new/elements/textBox/textBox.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBase
 */
function TextBox(parent) {
    _.superClass(TextBox, this, parent);
}

_.inherit(TextBox, TextEditorBase);

TextBox.prototype.createControl = function (parent) {
    return new TextBoxControl(parent);
};

TextBox.prototype.getMultiline = function () {
    return this.control.get('multiline');
};

TextBox.prototype.setMultiline = function (value) {
    this.control.set('multiline', value);
};

TextBox.prototype.getLineCount = function () {
    return this.control.get('lineCount');
};

TextBox.prototype.setLineCount = function (value) {
    this.control.set('lineCount', value);
};



//####app/new/elements/textBox/textBoxBuilder.js
/**
 *
 * @constructor
 * @augments TextEditorBaseBuilder
 */
function TextBoxBuilder() {
    _.superClass(TextBoxBuilder, this);
}

_.inherit(TextBoxBuilder, TextEditorBaseBuilder);

TextBoxBuilder.prototype.createElement = function (params) {
    return new TextBox(params.parent);
};

TextBoxBuilder.prototype.applyMetadata = function (params) {
    TextEditorBaseBuilder.prototype.applyMetadata.call(this, params);

    var element = params.element;
    var metadata = params.metadata;

    element.setMultiline(metadata.Multiline);
    element.setLineCount(metadata.LineCount);
};


//####app/new/elements/toggleButton/toggleButton.js
/**
 *
 * @param parent
 * @constructor
 * @augment Element
 */
function ToggleButton(parent) {
    _.superClass(ToggleButton, this, parent);
    this.initialize_editorBase();
}

_.inherit(ToggleButton, Element);


_.extend(ToggleButton.prototype, {

    createControl: function (parent) {
        return new ToggleButtonControl(parent);
    },

    getTextOn: function () {
        return this.control.get('textOn');
    },

    setTextOn: function (value) {
        return this.control.set('textOn', value ? value : '');
    },

    getTextOff: function () {
        return this.control.get('textOff');
    },

    setTextOff: function (value) {
        return this.control.set('textOff', value ? value : '');
    }
}, editorBaseMixin);
//####app/new/elements/toggleButton/toggleButtonBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 */
function ToggleButtonBuilder() {
    _.superClass(ToggleButtonBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(ToggleButtonBuilder, ElementBuilder);


_.extend(ToggleButtonBuilder.prototype, {
    createElement: function (params) {
        return new ToggleButton(params.parent);
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);
        this.applyMetadata_editorBaseBuilder(params);

        /** @type {ToggleButton} */
        var element = params.element;
        /** @type {ToggleButtonMetadata} */
        var metadata = params.metadata;

        element.setTextOff(metadata.TextOff);
        element.setTextOn(metadata.TextOn);
    }
}, editorBaseBuilderMixin);

/**
 * @typedef {Object} ToggleButtonMetadata
 * @property {String} TextOn
 * @property {String} TextOff
 */

//####app/new/elements/toolBar/toolBar.js
/**
 *
 * @param parent
 * @constructor
 * @augments Container
 */
var ToolBar = function (parent) {
    _.superClass(ToolBar, this, parent);
};

_.inherit(ToolBar, Container);

ToolBar.prototype.createControl = function () {
    return new ToolBarControl();
};
//####app/new/elements/toolBar/toolBarBuilder.js
/**
 *
 * @constructor
 * @augments ContainerBuilder
 */
function ToolBarBuilder() {
    _.superClass(ToolBarBuilder, this);
}

_.inherit(ToolBarBuilder, ContainerBuilder);

_.extend(ToolBarBuilder.prototype, /** @lends ToolBarBuilder.prototype */{

    createElement: function (params) {
        return new ToolBar(params.parent);
    }

});
//####app/new/elements/view/view.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function View(parent) {
    _.superClass(View, this, parent);

    var view = this;

    this.eventManager = new EventManager();

    this.openStrategy = new OpenModeDefaultStrategy();
    this.openStrategy.setView(this);

    this.members = {};
    this.membersDeferreds = {};

    this.handlers = {
        onBeforeLoaded: $.Deferred(),
        onLoaded: $.Deferred()
    };

    this._initContext();

    var parentView = this.getView();

    if (parentView) {
        // перед закрытием родительской view необходимо также убедиться, что могут быть закрыты все дочерние view
        parentView.onClosing && parentView.onClosing(function (context, message) {
            if(!view.isRemoved) {
                return view.eventManager.trigger('onClosing', view.getContext(), view._getScriptArgs());
            }
        });

        // при закрытии родительской view необходимо закрыть все дочерние view
        parentView.onClosed && parentView.onClosed(function (context, message) {
            view.close(null, null, true);
        });
    }

    this.control.get('dataSources').onChange(function(){
        view._initDataSourceHandlers();
    });
}

_.inherit(View, Container);

_.extend(View.prototype,
    {

        _initDataSourceHandlers: function(){
            var that = this;
            var dataSources = this.getContext().dataSources;
            var readyDsDeferred = [];

            this.control.onLoaded(function(){
                for(var k in dataSources){
                    readyDsDeferred.push(dataSources[k].getCurrentRequestPromise());
                }

                if(readyDsDeferred.length > 0){
                    $.when.apply($, readyDsDeferred).done(function(){
                        that._notifyAboutDsReady();
                    });
                }else{
                    that._notifyAboutDsReady();
                }

            });
        },

        _notifyAboutDsReady: function(){
            this.handlers.onBeforeLoaded.resolve();
            this.handlers.onLoaded.resolve();
        },

        createControl: function () {
            return new ViewControl();
        },

        _initContext: function(){
            this.context = {
                view: this,
                scripts: {},
                parameters: {},
                dataSources: {},
                controls: {},
                messageBus: new MessageBus(this),
                global: InfinniUI.global
            };

            var that = this;

            // on scripts changing
            this.control.get('scripts').onChange(function(){
                that.context.scripts = {};

                var newScripts = that.getScripts();

                newScripts.forEach(function(item){
                    that.context.scripts[item.name] = item.func;
                });
            });

            // on parameters changing
            this.control.get('parameters').onChange(function(){
                that.context.parameters = {};

                var newParameters = that.getParameters();

                newParameters.forEach(function(item){
                    that.context.parameters[item.name] = item;
                    that.registerMember(item.name, item);
                });
            });

            // on dataSources changing
            this.control.get('dataSources').onChange(function(){
                that.context.dataSources = {};

                var newParameters = that.getDataSources();

                newParameters.forEach(function(item){
                    that.context.dataSources[item.get('name')] = item;
                    that.registerMember(item.name, item);
                });
            });
        },

        getApplicationView: function(){
            var isApplication = this.control.get('isApplication');
            var parent = this.parent;

            if (isApplication) {
                return this;
            } else {
                return _.isEmpty(parent) ? null : parent.getApplicationView();
            }
        },

        isApplication: function (param) {
            var result = this.control.get('isApplication');

            if (_.isBoolean(param)) {
                this.control.set('isApplication', param);
            }

            return result;
        },

        registerElement: function(element){
            this.context.controls[element.name] = element;

            this.registerMember(element.name, element);
        },

        getIcon: function(){
            return this.control.get('icon');
        },

        setIcon: function(value){
            return this.control.set('icon', value);
        },

        getContext: function(){
            return this.context;
        },

        getScripts: function () {
            return this.control.get('scripts');
        },

        getParameters: function () {
            return this.control.get('parameters');
        },

        getDataSources: function () {
            return this.control.get('dataSources');
        },

        getDialogResult: function(){
            return this.control.get('dialogResult');
        },

        setDialogResult: function(value){
            return this.control.set('dialogResult', value);
        },

        open: function(success, error){

            var context = this.getContext();
            var scriptArgs = this._getScriptArgs();

            if(this.eventManager.trigger('onOpening', scriptArgs, context)){

                this.openStrategy.open();

                this.eventManager.trigger('onOpened', scriptArgs, context);

                if(success){
                    success(context, scriptArgs);
                }

            } else if(error){
                error(context, scriptArgs);
            }
        },

        close: function(success, error, notCallOnClosing){

            if(this.isClosing){
                return;
            }else{
                this.isClosing = true;
            }

            var context = this.getContext();
            var scriptArgs = this._getScriptArgs();

            if( notCallOnClosing || this.eventManager.trigger('onClosing', scriptArgs, context) ){
                this.eventManager.trigger('onClosed', scriptArgs, context);

                this.openStrategy.close();

                if(success){
                    success(context, scriptArgs);
                }

            } else if(error){
                error(context, scriptArgs);
            }
        },

        getScriptsStorage: function(){
            return this;
        },

        setOpenStrategy: function(openStrategy){
            this.openStrategy = openStrategy;
        },

        onBeforeLoaded: function (handler) {
            this.handlers.onBeforeLoaded.done(handler);
        },

        onLoaded: function (handler) {
            this.handlers.onLoaded.done(handler);
        },

        onOpening: function(callback){
            this.eventManager.on('onOpening', callback);
        },

        onOpened: function(callback){
            this.eventManager.on('onOpened', callback);
        },

        onClosing: function(callback){
            this.eventManager.on('onClosing', callback);
        },

        onClosed: function(callback){
            this.eventManager.on('onClosed', callback);
        },

        _getScriptArgs: function(){
            return {
                source: this
            };
        },

        /**
         * @description Устанаваливает шаблон заголовка
         * @param {Function} template
         */
        setHeaderTemplate: function (template) {
            this.headerTemplate  = template;
        },

        /**
         * @description Возвращает шаблон заголовка
         * @returns {Function|*}
         */
        getHeaderTemplate: function () {
            return this.headerTemplate;
        },

        /**
         * @description Устанавливает флаг видитмости кнопки закрытия
         * @param {boolean} value
         */
        setCloseButton: function (value) {
            if (typeof value === 'boolean') {
                this.control.set('closeButton', value);
            }
        },

        /**
         * @description Возвращает флаг видимости кнопки закрытия
         * @returns {boolean}
         */
        getCloseButton: function () {
            return this.control.get('closeButton');
        },

        noDataSourceOnView: function(){
            this._initDataSourceHandlers();
        },

        registerMember: function(memberName, member){
            this.members[memberName] = member;

            if(memberName in this.membersDeferreds){
                this.membersDeferreds[memberName].resolve(member);
            }
        },

        getDeferredOfMember: function(memberName){
            if(! (memberName in this.membersDeferreds) ){
                this.membersDeferreds[memberName] = $.Deferred();

                if(this.members[memberName]){
                    var member = this.members[memberName];
                    this.membersDeferreds[memberName].resolve(member);
                }
            }

            return this.membersDeferreds[memberName];
        }
    }
);
//####app/new/elements/view/viewBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function ViewBuilder() {
    _.superClass(ViewBuilder, this);
}

_.inherit(ViewBuilder, ContainerBuilder);

_.extend(ViewBuilder.prototype, {
    createElement: function (params) {
        return new View(params.parent);
    },

    applyMetadata: function (params) {

        var parentView = params.parentView;

        // новые params, где parentView будет уже текущая вьюха
        params = _.extend({}, params);
        params.parentView = params.element;

        var
            metadata = params.metadata,
            element = params.element,
            builder = params.builder;

        var scripts = element.getScripts();
        var parameters = element.getParameters();

        element.setIcon(metadata.Icon);

        if (metadata.Scripts) {
            for (var i = 0, len = metadata.Scripts.length; i < len; ++i) {
                var scriptMetadata = metadata.Scripts[i];

                var script = {
                    name: scriptMetadata.Name,
                    func: builder.buildType('Script', scriptMetadata, {parentView: element})
                };

                scripts.add(script);
            }
        }

        if (metadata.Parameters) {
            var passedParams = params.params || {};
            var parameterName;
            var defaultValue;
            var param;

            for (var i = 0, len = metadata.Parameters.length; i < len; ++i) {
                parameterName = metadata.Parameters[i]['Name'];
                param = passedParams[parameterName];

                if(!param){
                    param = new Parameter({view: element});
                    param.setName(parameterName);


                    if('DefaultValue' in metadata.Parameters[i]){
                        defaultValue = metadata.Parameters[i]['DefaultValue'];
                        param.setValue(defaultValue);
                    }
                }

                parameters.add(param);
                if(metadata.Parameters[i]['OnPropertyChanged']){
                    param.onPropertyChanged(function(){
                        new ScriptExecutor(element).executeScript(metadata.Parameters[i]['OnPropertyChanged']);
                    });
                }
            }
        }

        if (metadata.DataSources) {
            var dataSources = builder.buildMany(metadata.DataSources, {parentView: element});

            element.getDataSources()
                .set(dataSources);

            for(var i = 0, ii = dataSources.length; i < ii; i++){
                if(!dataSources[i].isLazy()){
                    dataSources[i].tryInitData();
                }
            }
        }else{
            element.noDataSourceOnView();
        }

        element.setHeaderTemplate(this.buildHeaderTemplate(element, params));
        element.setCloseButton(metadata.CloseButton);

        if(metadata.OnOpening){
            element.onOpening(function() {
                new ScriptExecutor(element).executeScript(metadata.OnOpening.Name || metadata.OnOpening);
            });
        }

        if(metadata.OnOpened){
            element.onOpened(function() {
                new ScriptExecutor(element).executeScript(metadata.OnOpened.Name || metadata.OnOpened);
            });
        }

        if(metadata.OnClosing){
            element.onClosing(function() {
                return new ScriptExecutor(element).executeScript(metadata.OnClosing.Name || metadata.OnClosing);
            });
        }

        if(metadata.OnClosed){
            element.onClosed(function() {
                new ScriptExecutor(element).executeScript(metadata.OnClosed.Name || metadata.OnClosed);
            });
        }

        ContainerBuilder.prototype.applyMetadata.call(this, params);
    }
},
    viewBuilderHeaderTemplateMixin
);
//####app/actions/baseAction.js
function BaseAction(parentView){
    this.parentView = parentView;
    this._properties = Object.create(null);
    _.defaults(this._properties, this.defaults);
    this.initDefaultValues();
}

_.extend(BaseAction.prototype, {
    defaults: {

    },

    setProperty: function(name, value){
        var props= this._properties;
        if (props[name] !== value) {
            props[name] = value;
            this.trigger('change:' + name, this, value);
        }
    },

    getProperty: function(name){
        return this._properties[name];
    },

    initDefaultValues: function () {

    }

}, Backbone.Events);

InfinniUI.global.executeAction = function (context, executeActionMetadata, resultCallback) {
    var builder = new ApplicationBuilder();

    var action = builder.build( executeActionMetadata, {parentView: context.view});

    action.execute(resultCallback);
};
//####app/actions/baseEditAction.js
function BaseEditAction(parentView){
    _.superClass(BaseEditAction, this, parentView);
}

_.inherit(BaseEditAction, BaseAction);

_.extend(BaseEditAction.prototype, {
    execute: function(callback){
        var that = this;
        var linkView = this.getProperty('linkView');

        this.setProperty('callback', callback);

        linkView.createView(function(createdView){
            that.handleViewReady(createdView);
        });
    },

    handleViewReady: function(editView){
        var editSourceName = this.getProperty('sourceSource'),
            editDataSource = editView.getContext().dataSources[editSourceName],
            destinationSourceName = this.getProperty('destinationSource'),
            destinationDataSource = this.parentView.getContext().dataSources[destinationSourceName],
            that = this;

        this.setProperty('editDataSource', editDataSource);
        this.setProperty('destinationDataSource', destinationDataSource);
        this.setSelectedItem();

        editView.open();

        editView.onClosed(function(){
            var dialogResult = editView.getDialogResult();

            if (dialogResult == DialogResult.accepted) {
                that.handleClosingView();
            }
        });
    },

    handleClosingView: function(){
        var callback = this.getProperty('callback');

        this.save();

        if (_.isFunction(callback)) {
            callback();
        }
    },

    _isObjectDataSource: function( source ) {
        return 'setItems' in source;
    }
});
//####app/actions/acceptAction/acceptAction.js
function AcceptAction(parentView){
    _.superClass(AcceptAction, this, parentView);
}

_.inherit(AcceptAction, BaseAction);


_.extend(AcceptAction.prototype, {
    execute: function(callback){
        if (callback) {
            this.parentView.onClosed(function () {
                callback();
            });
        }

        this.parentView.setDialogResult(DialogResult.accepted);
        this.parentView.close();
    }
});
//####app/actions/acceptAction/acceptActionBuilder.js
function AcceptActionBuilder() {
    this.build = function (context, args) {
        return new AcceptAction(args.parentView);
    }
}
//####app/actions/addAction/addAction.js
function AddAction(parentView){
    _.superClass(AddAction, this, parentView);
}

_.inherit(AddAction, BaseEditAction);


_.extend(AddAction.prototype, {
    setSelectedItem: function(){
        var editDataSource = this.getProperty('editDataSource'),
            editView = editDataSource.getView();

        if( this._isObjectDataSource(editDataSource) ) {
            editDataSource.setItems([{}]);
            editDataSource.setSelectedItem({});
        } else {
            var criteria = [ { CriteriaType:1, Property: "Id", Value:  "0000"  } ];
            editDataSource.setFilter( criteria );

            editView.onBeforeLoaded(function() {
                editDataSource.createItem();
            });
        }
    },

    save: function(){
        var editDataSource = this.getProperty('editDataSource'),
            destinationDataSource = this.getProperty('destinationDataSource'),
            destinationProperty = this.getProperty('destinationProperty');

        if( this._isObjectDataSource(editDataSource) ) {
            var items = destinationDataSource.getProperty(destinationProperty),
                newItem = editDataSource.getSelectedItem();

            items = _.clone(items);
            items.push(newItem);

            destinationDataSource.setProperty(destinationProperty, items);
        } else {
            destinationDataSource.updateItems();
        }
    }
});
//####app/actions/addAction/addActionBuilder.js
function AddActionBuilder(){
    this.build = function(context, args){
        var metadata = args.metadata,
            parentView = args.parentView,
            builder = args.builder;

        var action = new AddAction(parentView);

        var linkView = builder.build(metadata['LinkView'], {parent: args.parent, parentView: parentView});

        action.setProperty('linkView', linkView);
		action.setProperty('sourceSource', metadata.SourceValue.Source);
        action.setProperty('destinationSource', metadata.DestinationValue.Source);

        if( !_.isEmpty(metadata.DestinationValue.Property) ){
            var destinationProperty = (args.basePathOfProperty != null) ?
                                        args.basePathOfProperty.resolveProperty( metadata.DestinationValue.Property ) :
                                        metadata.DestinationValue.Property;

            action.setProperty('destinationProperty', metadata.DestinationValue.Property);
        }

        return action;
    }
}
//####app/actions/cancelAction/cancelAction.js
function CancelAction(parentView){
    _.superClass(CancelAction, this, parentView);
}

_.inherit(CancelAction, BaseAction);


_.extend(CancelAction.prototype, {
    execute: function(callback){
        if (callback) {
            this.parentView.onClosed(function () {
                callback();
            });
        }

        this.parentView.setDialogResult(DialogResult.canceled);
        this.parentView.close();
    }
});
//####app/actions/cancelAction/cancelActionBuilder.js
function CancelActionBuilder() {
    this.build = function (context, args) {
        return new CancelAction(args.parentView);
    }
}
//####app/actions/deleteAction/deleteAction.js
function DeleteAction(parentView){
    _.superClass(DeleteAction, this, parentView);
}

_.inherit(DeleteAction, BaseAction);


_.extend(DeleteAction.prototype, {
    execute: function(callback){
        var accept = this.getProperty('accept');
        var that = this;

        if(accept){
            new MessageBox({
                text: 'Вы уверены, что хотите удалить?',
                buttons: [
                    {
                        name: 'Да',
                        type: 'action',
                        onClick: function() {
                            that.remove(callback);
                        }
                    },
                    {
                        name: 'Нет'
                    }
                ]
            });
        } else {
            this.remove(callback);
        }
    },

    remove: function (callback) {
        var dataSource = this.getProperty('destinationSource'),
            property = this.getProperty('destinationProperty');

        if( this._isPredefinedIdentifierProperty(property) ) {
            this._deleteDocument(dataSource, property, callback);
        } else {
            this._deleteItem(dataSource, property, callback);
        }
    },

    _deleteDocument: function(dataSource, property, callback){
        var onSuccessDelete = function () {
            dataSource.updateItems();

            if (_.isFunction(callback)) {
                callback();
            }
        };

        var selectedItem = dataSource.getProperty(property);
        dataSource.deleteItem(selectedItem, onSuccessDelete);
    },

    _deleteItem: function(dataSource, property, callback){
        var propertyPathList = property.split("."),
            index = propertyPathList.pop(),
            parentProperty = propertyPathList.join("."),
            items = dataSource.getProperty(parentProperty);

        items = _.clone( items );
        items.splice(index, 1);
        dataSource.setProperty(parentProperty, items);

        if (_.isFunction(callback)) {
            callback();
        }
    },

    _isPredefinedIdentifierProperty: function(propertyName){
        return propertyName == '$' || propertyName == '#';
    }
});

//####app/actions/deleteAction/deleteActionBuilder.js
function DeleteActionBuilder(){
    this.build = function(context, args){
        var metadata = args.metadata,
            parentView = args.parentView,
            sourceName = metadata.DestinationValue.Source,
            propertyName = metadata.DestinationValue.Property || '$';

        var action = new DeleteAction(parentView);

        var accept = (metadata['Accept'] !== false),
            dataSource = parentView.getContext().dataSources[sourceName],
            destinationProperty = (args.basePathOfProperty != null) ?
                                    args.basePathOfProperty.resolveProperty( propertyName ) :
                                    propertyName;

        action.setProperty('accept', accept);
        action.setProperty('destinationSource', dataSource);
        action.setProperty('destinationProperty', destinationProperty);

        return action;
    }
}
//####app/actions/editAction/editAction.js
function EditAction(parentView){
    _.superClass(EditAction, this, parentView);
}

_.inherit(EditAction, BaseEditAction);


_.extend(EditAction.prototype, {
    setSelectedItem: function(){
        var editDataSource = this.getProperty('editDataSource'),
            destinationDataSource = this.getProperty('destinationDataSource'),
            destinationProperty = this.getProperty('destinationProperty');

        var selectedItem = destinationDataSource.getProperty(destinationProperty);

        if( this._isObjectDataSource(editDataSource) ) {
            this.setItem(editDataSource, selectedItem);
        } else {
            this.setDocument(editDataSource, selectedItem);
        }
    },

    setDocument: function (editDataSource, selectedItem){
        var selectedItemId = editDataSource.idOfItem( selectedItem );

        var criteria = [ { CriteriaType:1, Property: "Id", Value:  selectedItemId  } ];
        editDataSource.setFilter( criteria );
    },

    setItem: function(editDataSource, selectedItem){
        var item = _.clone( selectedItem );

        editDataSource.setItems( [item] );
        editDataSource.setSelectedItem( item );
    },

    save: function(){
        var editDataSource = this.getProperty('editDataSource'),
            destinationDataSource = this.getProperty('destinationDataSource'),
            destinationProperty = this.getProperty('destinationProperty');

        if( this._isObjectDataSource(editDataSource) ) {
            var item = editDataSource.getSelectedItem();
            destinationDataSource.setProperty(destinationProperty, item);
        } else {
            destinationDataSource.updateItems();
        }
    }
});
//####app/actions/editAction/editActionBuilder.js
function EditActionBuilder(){
    this.build = function(context, args){
        var metadata = args.metadata,
            parentView = args.parentView,
            builder = args.builder;

        var destinationProperty = (args.basePathOfProperty != null) ?
            args.basePathOfProperty.resolveProperty( metadata.DestinationValue.Property ) :
            metadata.DestinationValue.Property;

        var action = new EditAction(parentView);

        var linkView = builder.build(metadata['LinkView'], {parent: args.parent, parentView: parentView});
        action.setProperty('linkView', linkView);

        action.setProperty('sourceSource', metadata.SourceValue.Source);
        action.setProperty('destinationSource', metadata.DestinationValue.Source);

        action.setProperty('destinationProperty', destinationProperty || '$');

        return action;
    }
}
//####app/actions/openAction/openAction.js
function OpenAction(parentView){
    _.superClass(OpenAction, this, parentView);
}

_.inherit(OpenAction, BaseAction);


_.extend(OpenAction.prototype, {
    execute: function(callback){
        var linkView = this.getProperty('linkView');

        linkView.createView(function (view) {
            if (callback) {
                view.onLoaded(function () {
                    callback(view);
                });
            }

            view.open();
        });
    }
});
//####app/actions/openAction/openActionBuilder.js
function OpenActionBuilder(){

}


_.extend(OpenActionBuilder.prototype, {
    build: function(context, args){
        var action = new OpenAction(args.parentView);

        var linkView = args.builder.build(args.metadata.LinkView, {parent: args.parent, parentView: args.parentView, basePathOfProperty: args.basePathOfProperty});
        action.setProperty('linkView', linkView);

        return action;
    }
});
//####app/actions/printReportAction/printReportAction.js
function PrintReportAction(parentView){
    _.superClass(PrintReportAction, this, parentView);
}

_.inherit(PrintReportAction, BaseAction);


_.extend(PrintReportAction.prototype, {
    execute: function(callback){
        var $submitForm = this.getProperty('$submitForm');

        $submitForm.submit(callback);
    }
});
//####app/actions/printReportAction/printReportActionBuilder.js
function PrintReportActionBuilder() {
    this.build = function (context, args) {
        var action = new PrintReportAction(args.parentView);

        var data = {
            Configuration: args.metadata.Configuration,
            Template: args.metadata.Template,
            Parameters: args.metadata.Parameters,
            FileFormat: 0 //metadata.FileFormat
        };
        var formData = (JSON.stringify(data)).replace(/"/g, '\'');

        var $submitForm = this.createSubmitForm(formData);

        action.setProperty('$submitForm', $submitForm);

        return action;
    };

    this.createSubmitForm = function(formData) {
        var $submitForm = $(this.getSubmitForm(formData));
        var $modal = $(this.getModalTemplate());

        $submitForm.on('submit', function() {
            $modal.modal('show');
        });

        $submitForm.appendTo('body');
        $modal.appendTo('body');

        return $submitForm;
    };

    this.getSubmitForm = function(data){
        return '<form id="form" enctype="application/x-www-form-urlencoded" target="frame" action="http://ic:9900/SystemConfig/UrlEncodedData/Reporting/GetReport" method="post">' +
            '<input type="text" style="display:none" name="Form" value='+data+'>'+
            '</form>'
    };

    this.getModalTemplate = function(){
        return '<div class="custom-modal modal container fade" id="full-width" tabindex="-1">'+
            '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
            '<h3>Отчет</h3>'+
            '</div>'+
            '<div class="modal-body">'+
            '<iframe name="frame" style="width: 100%; height: 600px"></iframe>'+
            '</div>'+
            '</div>'
    };
}
//####app/actions/printViewAction/printViewAction.js
function PrintViewAction(parentView){
    _.superClass(PrintViewAction, this, parentView);
}

_.inherit(PrintViewAction, BaseAction);


_.extend(PrintViewAction.prototype, {
    execute: function(callback){
        var self = this;

        var printViewBaseFormData = this.get('printViewBaseFormData');
        var dataSource = this.get('dataSource');
        var formData = _.extend(printViewBaseFormData,
            {
                ConfigId : dataSource.getConfigId(),
                DocumentId : dataSource.getDocumentId(),
                PageNumber : dataSource.getPageNumber(),
                PageSize : dataSource.getPageSize(),
                ActionId: dataSource.getUpdateAction(),
                Item: dataSource.getSelectedItem(),
                Query : dataSource.getFilter()
            });

        this.sendRequest(formData, function(message){
            var frameId = window.pdfDocs.length;
            window.pdfDocs[frameId] = message;

            var _$modal = $(self.getModalTemplate(frameId));
            _$modal.appendTo('body');

            if (_.isFunction(callback)) {
                _$modal.one('shown.bs.modal', function () {
                    callback();
                });
            }

            _$modal.modal('show');

            $('.btn-close'+ frameId).on('click', function(e){
                _$modal.modal('hide');
            });

            $('.btn-print' + frameId).on('click', function(e){
                var frame = self.getFrame('frame'+frameId);
                var printButtonElement = frame.window.document.getElementById('print');
                printButtonElement.click();
            });
        });
    },

    getModalTemplate: function(frameId){
        return '<div class="custom-modal modal container fade" id="full-width" tabindex="-1">'+
            '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
            //'<h3>Отчет</h3>'+
            '</div>'+
            '<div class="modal-body">'+
            '<iframe name="frame' + frameId + '" src="/app/utils/pdf/web/viewer.html#' + frameId + '" id="print-report" style="width: 100%; height: 600px"></iframe>'+
            '</div>'+
            '<button type="button" class="btn btn-default btn-close' + frameId + '" style="float: right; margin: 0 10px 10px 0; border: none">Закрыть</button>'+
            '<button type="button" class="btn btn-default btn-print' + frameId + '" style="float: right; margin: 0 10px 10px 0; border: none">Печать</button>'+
            '</div>'
    },

    getFrame: function(fName)
    {
        var frames = window.frames;
        for(var i=0; i<frames.length; i++){
            try{
                if(frames[i].name == fName)
                    return frames[i];
            }catch(e) {}
        }

    },

    sendRequest: function(params, handler){
        var url = InfinniUI.config.serverUrl+"/SystemConfig/UrlEncodedData/Reporting/GetPrintView";
        var xmlhttp = this.getProperty('xmlhttp');

        xmlhttp.open('POST', url, true);
        xmlhttp.withCredentials = true;
        xmlhttp.responseType = 'arraybuffer';
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    handler(xmlhttp.response);
                }
            }
        };
        xmlhttp.send($.param({
            Form: (JSON.stringify(params)).replace(/"/g, '\'')
        }));
    }
});
//####app/actions/printViewAction/printViewActionBuilder.js
function PrintViewActionBuilder() {
    this.build = function (context, args) {
        window.pdfDocs = window.pdfDocs || [];

        var action = new PrintViewAction(args.parentView);

        var dataSource = args.parentView.getContext().dataSources[args.metadata.SourceValue.Source];
        var printViewBaseFormData = {
            PrintViewId : args.metadata.PrintViewId,
            PrintViewType : args.metadata.PrintViewType
        };

        action.setProperty('xmlhttp', this.getXmlHttp());
        action.setProperty('dataSource', dataSource);
        action.setProperty('printViewBaseFormData', printViewBaseFormData);

        return action;
    };

    this.getXmlHttp = function(){
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e1) {
                xmlhttp = false;
            }
        }

        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }

        return xmlhttp;
    };
}
//####app/actions/saveAction/saveAction.js
function SaveAction(parentView){
    _.superClass(SaveAction, this, parentView);
}

_.inherit(SaveAction, BaseAction);


_.extend(SaveAction.prototype, {
    execute: function(callback){
        var parentView = this.parentView;
        var dataSource = this.getProperty('dataSource');
        var canClose = this.getProperty('canClose');

        var onSuccessSave = function(context, args){
            if(canClose){
                parentView.setDialogResult(DialogResult.accepted);
                parentView.close();
            }

            if(_.isFunction(callback)){
                callback(context, args);
            }
        };

        var selectedItem = dataSource.getSelectedItem();
        dataSource.saveItem(selectedItem, onSuccessSave, callback);
    }
});
//####app/actions/saveAction/saveActionBuilder.js
function SaveActionBuilder() {
    this.build = function (context, args) {
        var parentView = args.parentView;
        var dataSource = parentView.getContext().dataSources[args.metadata.DestinationValue.Source];
        var canClose = (args.metadata.CanClose !== false);

        var action = new SaveAction(parentView);

        action.setProperty('dataSource', dataSource);
        action.setProperty('canClose', canClose);

        return action;
    }
}
//####app/actions/selectAction/selectAction.js
function SelectAction(parentView){
    _.superClass(SelectAction, this, parentView);
}

_.inherit(SelectAction, BaseAction);


_.extend(SelectAction.prototype, {
    execute: function(callback){
        var linkView = this.getProperty('linkView');

        var srcDataSourceName = this.getProperty('srcDataSourceName');
        var srcPropertyName = this.getProperty('srcPropertyName');

        var dstDataSourceName = this.getProperty('dstDataSourceName');
        var dstPropertyName = this.getProperty('dstPropertyName');

        linkView.createView(function(createdView){

            createdView.onClosed(function () {
                var dialogResult = createdView.getDialogResult();

                if (dialogResult == DialogResult.accepted) {
                    var srcDataSource = createdView.getContext().dataSources[srcDataSourceName];
                    var dstDataSource = createdView.getContext().dataSources[dstDataSourceName];

                    var value = srcDataSource.getProperty(srcPropertyName);
                    dstDataSource.setProperty(srcPropertyName, value);

                    if (callback) {
                        callback(value);
                    }
                }
            });

            createdView.open();
        });
    }
});
//####app/actions/selectAction/selectActionBuilder.js
function SelectActionBuilder() {
    this.build = function (context, args) {
        var builder = args.builder,
            metadata = args.metadata,
            parentView = args.parentView;
        var action = new SelectAction(parentView);

        var linkView = builder.build(metadata['LinkView'], {parentView: parentView});

        action.setProperty('linkView', linkView);
        action.setProperty('srcDataSourceName', metadata.SourceValue.Source);
        action.setProperty('srcPropertyName', metadata.SourceValue.Property);
        action.setProperty('dstDataSourceName', metadata.DestinationValue.Source);
        action.setProperty('dstPropertyName', metadata.DestinationValue.Property);

        return action;
    }
}


//####app/actions/serverAction/downloadExecutor.js
/**
 * @description
 * Для закачки контента по POST запросу используется подход: {@link http://gruffcode.com/2010/10/28/detecting-the-file-download-dialog-in-the-browser/}
 * @param resultCallback
 * @param successCallback
 * @param failCallback
 * @constructor
 */
function DownloadExecutor(resultCallback, successCallback, failCallback) {
    this.guid = guid();
    this.options = {
        timeout: 1 * 60 * 1000,
        poll: 100
    };

    this.resultCallback = resultCallback;
    this.successCallback = successCallback;
    this.failCallback = failCallback;
}

DownloadExecutor.prototype.config = function (options) {
    _.extend(this.options, options);
};

DownloadExecutor.prototype.run = function (requestData) {

    var cleanup = this.cleanup.bind(this);

    var onResult = function () {
        if (typeof this.resultCallback === 'function') {
            this.resultCallback.apply(this, arguments);
        }
    }.bind(this);

    var onSuccess = function (data) {
        if (typeof this.successCallback === 'function') {
            this.successCallback.call(this, data);
        }
        onResult(data);
    }.bind(this);

    var onError = function (err) {
        if (typeof this.successCallback === 'function') {
            this.successCallback.call(this, data);
        }
        onResult(err);
    };

    this.waitResponse(cleanup)
        .always(function () {
            cleanup();
        })
        .done(onSuccess)
        .fail(onError);

    this.openWindow(requestData);
};

DownloadExecutor.prototype.openWindow = function (requestData) {
    var windowName = this.getName("window");
    var form = document.createElement("form");
    this.form = form;

    form.setAttribute("method", requestData.method);
    form.setAttribute("action", requestData.requestUrl);
    form.setAttribute("target", windowName);
    form.setAttribute("style", "display: none;");

    var dataField = document.createElement("input");
    dataField.setAttribute("name", "data");
    dataField.setAttribute("value", JSON.stringify(requestData.args));
    form.appendChild(dataField);

    //Cookie которую долден вернуть сервер с отправкой запрошенного контента
    var tokenField = document.createElement("input");
    tokenField.setAttribute("name", "token");
    tokenField.setAttribute("value", this.getName('token'));
    form.appendChild(tokenField);


    document.body.appendChild(form);
    this.popup = window.open("about:blank", windowName);
    form.submit();
};

DownloadExecutor.prototype.getName = function (name) {
    return name + this.guid;
};

DownloadExecutor.prototype.cleanup = function () {
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
    $.removeCookie(this.getName('token'));
    if (this.form) {
        this.form.remove();
        this.form = null;
    }
    if (this.popup) {
        this.popup.close();
        this.popup = null;
    }
};

DownloadExecutor.prototype.waitResponse = function (beforeStart) {
    var cookieName = this.getName('token');
    var defer = $.Deferred(beforeStart);

    //Check cookie from server's response
    this.intervalId = setInterval(function () {
        var cookie = $.cookie(cookieName);
        if (cookie === cookieName) {
            defer.resolve();
        }
    }, this.options.poll);

    //Check timeout
    this.timeout = setTimeout(function () {
        defer.reject();
    }, this.options.timeout);

    return defer.promise();
};
//####app/actions/serverAction/serverAction.js
function ServerAction(parentView) {
    _.superClass(ServerAction, this, parentView);
    this.updateContentTypeStrategy();
    this.on('change:contentType', this.updateContentTypeStrategy);
}

_.inherit(ServerAction, BaseAction);

_.extend(ServerAction.prototype, {

    defaults: {
        contentType: 'Object'
    },

    updateContentTypeStrategy: function () {
        var contentType = this.getProperty('contentType');
        this.contentTypeStrategy = serverActionContentTypeStrategy[contentType];
    },

    execute: function (callback) {
        this.contentTypeStrategy.run(this.getProperty('provider'), this.getParametersValue(), callback);
    },

    setParameters: function (parameters) {
        this.setProperty('parameters', parameters);
    },

    getParametersValue: function () {
        var parameters = this.getProperty('parameters');
        var values = {};

        for (var i in parameters) {
            if (!parameters.hasOwnProperty(i)) {
                continue;
            }

            values[i] = parameters[i].getValue();
        }

        return values;
    }
});

//####app/actions/serverAction/serverActionBuilder.js
function ServerActionBuilder() {
    this.build = function (context, args) {
        var builder = args.builder,
            metadata = args.metadata,
            parentView = args.parentView;

        var action = new ServerAction(parentView);
        var provider = window.providerRegister.build('ServerActionProvider', metadata);

        //action.setProperty('linkView', linkView);
        action.setProperty('provider', provider);

        var parameters = {};

        if (Array.isArray(metadata.Parameters)) {
            metadata.Parameters.forEach(function (metadata) {
                var param = builder.buildType('Parameter', metadata, {parentView: parentView});
                parameters[param.getName()] = param;
            });
            action.setParameters(parameters);
        }

        if (metadata.ContentType) {
            action.setProperty('contentType', metadata.ContentType);
        }

        return action;
    }
}

//####app/actions/serverAction/serverActionContentTypeStrategy.js
var serverActionContentTypeStrategy = {
    "File": {
        run: function (provider, params, callback) {
            provider.download(params, callback);
        }
    },
    "Object": {
        run: function (provider, params, callback) {

            provider.request(params, callback);
        }
    }
};
//####app/actions/updateAction/updateAction.js
function UpdateAction(parentView){
    _.superClass(UpdateAction, this, parentView);
}

_.inherit(UpdateAction, BaseAction);


_.extend(UpdateAction.prototype, {
    execute: function(callback){

        var dataSource = this.getProperty('dataSource');

        dataSource.updateItems(callback, callback);
    }
});
//####app/actions/updateAction/updateActionBuilder.js
function UpdateActionBuilder() {
    this.build = function (context, args) {

        var dataSource = args.parentView.getContext().dataSources[args.metadata.DestinationValue.Source];

        var action = new UpdateAction(args.parentView);

        action.setProperty('dataSource', dataSource);

        return action;
    }
}
//####app/builders/applicationBuilder.js
function ApplicationBuilder() {
    if(!this.builder){
        this.builder = new Builder();
        this.registerElementBuilders();
    }

    window.InfinniUI.global.factory = this;
}

_.extend(ApplicationBuilder.prototype, {
    builder: null,

    registerElementBuilders: function(){
        var builder = this.builder;

        builder.register('View', new ViewBuilder());
        builder.register('InlineView', new InlineViewBuilder());
        builder.register('ChildView', new ChildViewBuilder());
        builder.register('AutoView', new MetadataViewBuilder());
        builder.register('ExistsView', new MetadataViewBuilder());

        builder.register('StackPanel', new StackPanelBuilder());
        builder.register('GridPanel', new GridPanelBuilder());
        builder.register('ScrollPanel', new ScrollPanelBuilder());
        builder.register('Panel', new PanelBuilder());
        builder.register('ScrollPanel', new ScrollPanelBuilder());
        builder.register('ViewPanel', new ViewPanelBuilder());
        builder.register('TabPanel', new TabPanelBuilder());
        builder.register('TabPage', new TabPageBuilder());

        builder.register('TablePanel', new TablePanelBuilder());
        builder.register('Cell', new CellBuilder());
        builder.register('Row', new RowBuilder());

        builder.register('MenuBar', new MenuBarBuilder());
        
        builder.register('DataGrid', new DataGridBuilder());
        builder.register('DataGridColumn', new DataGridColumnBuilder());
        builder.register('ListBox', new ListBoxBuilder());

        builder.register('TextBox', new TextBoxBuilder());
        builder.register('PasswordBox', new PasswordBoxBuilder());
        builder.register('CheckBox', new CheckBoxBuilder());
        builder.register('ImageBox', new ImageBoxBuilder());
        builder.register('FileBox', new FileBoxBuilder());
        builder.register('Label', new LabelBuilder());
        builder.register('Icon', new IconBuilder());
        builder.register('LinkLabel', new LinkLabelBuilder());
        builder.register('DatePicker', new DatePickerBuilder());
        builder.register('ToggleButton', new ToggleButtonBuilder());
        builder.register('NumericBox', new NumericBoxBuilder());
        builder.register('Button', new ButtonBuilder());
        builder.register('ToolBar', new ToolBarBuilder());
        builder.register('ToolBarButton', new ButtonBuilder());
        //builder.register('ToolBarSeparator', new ToolBarSeparatorBuilder());
        builder.register('ComboBox', new ComboBoxBuilder());
        builder.register('RadioGroup', new RadioGroupBuilder());
        builder.register('SearchPanel', new SearchPanelBuilder());
        builder.register('ExtensionPanel', new ExtensionPanelBuilder());
        builder.register('FilterPanel', new FilterPanelBuilder());
        builder.register('PopupButton', new PopupButtonBuilder());
        builder.register('DataNavigation', new DataNavigationBuilder());
        builder.register('DocumentViewer', new DocumentViewerBuilder());
        builder.register('PdfViewer', new PdfViewerBuilder());
        builder.register('TreeView', new TreeViewBuilder());
        builder.register('Frame', new FrameBuilder());

        builder.register('DocumentDataSource', new DocumentDataSourceBuilder());
        builder.register('DataBinding', new DataBindingBuilder());
        builder.register('PropertyBinding', new DataBindingBuilder());
        builder.register('ObjectDataSource', new ObjectDataSourceBuilder());
        builder.register('Parameter', new ParameterBuilder());
        builder.register('Validation', new ValidationBuilder());
        builder.register('Criteria', new CriteriaBuilder());


        builder.register('AcceptAction', new AcceptActionBuilder());
        builder.register('AddAction', new AddActionBuilder());
        builder.register('CancelAction', new CancelActionBuilder());
        builder.register('DeleteAction', new DeleteActionBuilder());
        builder.register('EditAction', new EditActionBuilder());
        builder.register('OpenAction', new OpenActionBuilder());
        builder.register('PrintReportAction', new PrintReportActionBuilder());
        builder.register('PrintViewAction', new PrintViewActionBuilder());
        builder.register('SaveAction', new SaveActionBuilder());
        builder.register('SelectAction', new SelectActionBuilder());
        builder.register('UpdateAction', new UpdateActionBuilder());
        builder.register('ServerAction', new ServerActionBuilder());


        builder.register('BooleanFormat', new BooleanFormatBuilder());
        builder.register('DateTimeFormat', new DateTimeFormatBuilder());
        builder.register('NumberFormat', new NumberFormatBuilder());
        builder.register('ObjectFormat', new ObjectFormatBuilder());

        builder.register('DateTimeEditMask', new DateTimeEditMaskBuilder());
        builder.register('NumberEditMask', new NumberEditMaskBuilder());
        builder.register('TemplateEditMask', new TemplateEditMaskBuilder());
        builder.register('RegexEditMask', new RegexEditMaskBuilder());

        builder.register('Comparator', new ComparatorBuilder());
        builder.register('GlobalNavigationBar', new GlobalNavigationBarBuilder());
        builder.register('ActionBar', new ActionBarBuilder());

        builder.register('Script', new ScriptBuilder());


        var registerQueue = ApplicationBuilder.registerQueue;
        for(var i = 0, ii = registerQueue.length; i<ii; i++){
            builder.register(registerQueue[i].name, registerQueue[i].builder);
        }
    },

    build: function(metadataValue, args){
        return this.builder.build(metadataValue, args);
    },

    buildType: function(metadataType, metadataValue, args){
        return this.builder.buildType(metadataType, metadataValue, args);
    },

    buildMany: function(metadataValue, args){
        return this.builder.buildMany(metadataValue, args);
    }
});

ApplicationBuilder.registerQueue = [];

ApplicationBuilder.addToRegisterQueue = function(name, builder){
    ApplicationBuilder.registerQueue.push({
        name: name,
        builder: builder
    });
};

//####app/builders/builder.js
function Builder() {
    var objectBuilders = [];

    this.appView = null;

    this.register = function (metadataType, objectBuilder) {
        objectBuilders[metadataType] = objectBuilder;
    };

    this.buildType = function (metadataType, metadataValue, args) {
        args = args || {};
        if (objectBuilders[metadataType] === undefined) {
            return null;
        }

        var resultArgs = _.extend({
                builder: this,
                metadata: metadataValue
            }, args);
        var context = args.parentView ? args.parentView.getContext() : {};
        return objectBuilders[metadataType].build(context, resultArgs);
    };

    this.build = function (metadataValue, args) {
        var key,
            value,
            result = null;

        args = args || {};

        for (var p in metadataValue) {
            key = p;
            break; // берем первое найденное свойство в объекте! Остальное игнорируем
        }

        if (typeof key === 'undefined' || key === null) {
            console.error('Builder: Не переданы метаданные');
        } else {
            value = metadataValue[key];
            result = this.buildType(key, value, args);
        }
        return result;
    };

    this.buildMany = function (metadataValue, args) {

        var items = [];

        if (metadataValue) {
            for (var i = 0; i < metadataValue.length; i++) {
                var item = this.build(metadataValue[i], args);

                if (item !== null) {
                    items.push(item);
                }
            }
        }

        return items;
    };

    this.buildBinding = function(bindingMetadata, args){
        var dataBinding = this.buildType('PropertyBinding', bindingMetadata, args);

        return dataBinding;
    };
}

//####app/controls/abstractGridPanel/abstractGridPanel.js
var AbstractGridPanelControl = function(){
    _.superClass(AbstractGridPanelControl, this);
};

_.inherit(AbstractGridPanelControl, Control);

_.extend(AbstractGridPanelControl.prototype, {

    addRow: function(row){
        this.controlModel.addRow(row);
    },

    getRows: function(){
        return this.controlModel.getRows();
    }

});
//####app/controls/abstractGridPanel/abstractGridPanelModel.js
var AbstractGridPanelModel = ControlModel.extend({

    defaults: _.defaults({
        rows: null
    }, ControlModel.prototype.defaults),

    initialize: function(){
        this.set('rows', [])

        ControlModel.prototype.initialize.apply(this);
    },

    addRow: function(row){
        this.get('rows').push(row);
        this.trigger('rowsIsChange', this.get('rows'));
        this.initRowHandlers(row);
    },

    getRows: function(){
        return this.get('rows');
    },

    initRowHandlers: function(row){
        var self = this;

        row.onCellsChange( function(){
            self.trigger('cellsIsChange');
        });

        row.onItemsChange( function(){
            self.trigger('itemsIsChange');
        });
    }

});
//####app/controls/abstractGridPanel/abstractGridPanelView.js
var AbstractGridPanelView = ControlView.extend({

    templates: {
        row: null,
        cell: null
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
        this.listenTo(this.model, 'rowsIsChange', this.rerender);
        this.listenTo(this.model, 'cellsIsChange', this.rerender);
        this.listenTo(this.model, 'itemsIsChange', this.rerender);
    },

    render: function () {
        var $row;
        this.prerenderingActions();

        this.$el
            .empty();

        _.each(this.model.getRows(), function(row){
            $row = this.renderRow(row);
            this.$el
                .append($row);
        }, this);

        this.postrenderingActions();
        return this;
    },

    renderRow: function(row){
        var $row = $(this.templates.row({})),
            $cell;

        _.each(row.getCells(), function(cell){
            $cell = this.renderCell(cell);
            $row.append($cell);
        }, this);

        return $row;
    },

    renderCell: function(cell){
        var $cell = $(this.templates.cell({colSpan: cell.colSpan})),
            $item;

        _.each(cell.getItems(), function(item){
            $item = this.renderItem(item);
            $cell.append($item);
        }, this);

        return $cell;
    },

    renderItem: function(item){
        return item.render();
    }

});
//####app/controls/actionBar/actioinBarControl.js
var ActionBarControl = function () {
    _.superClass(ActionBarControl, this);
};

_.inherit(ActionBarControl, Control);

_.extend(ActionBarControl.prototype, {
    createControlModel: function () {
        return new ActionBarModel();
    },

    createControlView: function (model) {
        return new ActionBarView({model: model});
    }
});

//####app/controls/actionBar/actionBarModel.js
var ActionBarModel = ControlModel.extend({

    initialize: function () {
        this.set('pages', []);
        ControlModel.prototype.initialize.apply(this);
    }

});

//####app/controls/actionBar/actionBarView.js
var ActionBarView = ControlView.extend({

    className: 'pl-action-bar',

    template: {
        //panel: InfinniUI.Template["controls/filterPanel/template/template.tpl.html"],
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
        this.listenTo(this.model, 'change:pages', this.onPagesChange);
    },

    render: function () {
        this.renderButtons();
        return this;
    },

    renderButtons: function () {
        var pages = this.model.get('pages');
        var buttons = _.map(pages, function (pageView) {
            var button = new ActionBarButtonView({
                key: pageView.getGuid(),
                text: pageView.getText()
            });
        }, this);
    },

    onPagesChange: function () {

        var pages = this.model.get('pages');
        console.log(pages);
        for (var i = 0, ln = pages.length; i < ln; i = i + 1) {

        }
    }

});
//####app/controls/actionBar/buttons/actionBarButton.js
var ActionBarButtonModel = Backbone.Model.extend({

});

var ActionBarButtonView = Backbone.Model.extend({

    initialize: function (options) {
        this.model = new ActionBarButtonModel(options);
    }
});
//####app/controls/application/activeBar/activeBar.js
var ActiveBarModel = Backbone.Model.extend({
	
	defaults: {
		tabs: null,
		title: '',
		appId: '',
		appName: '',
		viewId: ''
	},

	initialize: function () {
		var appId = this.get('appId');
		var tabs = new ActiveBarTabCollection();
		this.set('tabs', tabs);

		messageBus.getExchange(appId)
			.subscribe(messageTypes.onViewOpened, this.onViewOpenedHandler.bind(this));

		messageBus.getExchange(appId)
			.subscribe(messageTypes.onViewClosed, this.onViewClosedHandler.bind(this));
	},

	/**
	 * @description Обработчик события открытия представления приложения
	 */
	onViewOpenedHandler: function (message) {
		var tabs = this.get('tabs');
		tabs.add({
			title: message.view.getText(),
			view: message.view,
			viewId: message.viewId,
			appId: this.get('appId')
		});
	},

	/**
	 * @description Обработчик события закрытия представления приложения
	 */
	onViewClosedHandler: function (message) {
		var tabs = this.get('tabs');
		var viewId = message.viewId;
		var deleted = tabs.where({viewId: viewId});
		_.forEach(deleted, function (tab) {
			tabs.remove(tab);
		});

	}
});

var ActiveBarView = Backbone.View.extend({

	className: 'pl-active-bar',

	template: InfinniUI.Template['controls/application/activeBar/template/template.tpl.html'],
	
	UI: {
		navbar: '.navbar-nav',
		list: '.navigation-list',
		popup: '.navbar-list-container'
	},

	events: {
		'click .navigation-list': 'onTogglePopupHandler'
	},

	initialize: function () {
		var tabs = this.model.get('tabs');

		this.listenTo(tabs, 'add', this.onAddTabHandler.bind(this));
		this.listenTo(tabs, 'view:close', this.onCloseView);
		this.listenTo(tabs, 'view:active', this.onActiveView);

		this.once('render', function (){
			tabs.add({
				home: true,
                view: this.model.get('view'),
				appId: this.model.get('appId'),
				viewId: this.model.get('viewId'),
				appName: this.model.get('appName')
			});
		});
	},

	/**
	 * @description Обработчик добавления вкладки в коллекцию
	 * @param model
	 * @param collection
	 */
	onAddTabHandler: function (model, collection) {
		var tabView = new ActiveBarTabView({
			model: model
		});
        var view = model.get('view');
        view.onTextChange(function () {
            collection.trigger('onTextChange');
        });
		this.renderTab(tabView);
		model.set('active', true);
	},

	onCloseView: function(viewModel){
		//Отправить в шину сообщение на закрытие представления
		var appId = viewModel.get('appId');
		var exchange = messageBus.getExchange(appId);
		exchange.send(messageTypes.onViewClosing, {
			viewId: viewModel.get('viewId'),
			appId: appId
		});
	},

	onActiveView: function(viewModel){
		var collection = viewModel.collection;
		var viewId = viewModel.get('viewId');
		if (!viewModel.get('active') === true) {
			// Сброс атрибута активности у других вкладок
			collection.forEach(function (tab) {
				tab.set('active', tab === viewModel);
			});

			messageBus.getExchange(viewModel.get('appId')).send(messageTypes.onShowView, {viewId: viewId});
		}
	},

	render: function () {
		var data = this.model.toJSON();
		this.$el.html(this.template(data));
		this.bindUIElements();

		var list = new ActiveBarPopup({collection: this.model.get('tabs')});
		this.ui.popup.append(list.render().$el);

		this.trigger('render');
		return this;
	},

	renderTab: function (tabView) {
		this.ui.navbar.append(tabView.render().$el);
	},

	requestClose: function (callback) {
		var exchange;
		var tabs = this.model.get('tabs');
		var messages = tabs.map(function (tab) {
			return {
				viewId: tab.get('viewId'),
				appId: tab.get('appId')
			};
		});
		messages.shift();//Пропускаем home

		if (messages.length === 0) {
			//Нечего закрывать
			callback();
		} else {

			this.listenTo(tabs, 'remove', function () {
				if (tabs.length === 1) {
					callback()
				}
			});

			_.forEach(messages, function (message) {
				exchange = messageBus.getExchange(message.appId);
				exchange.send(messageTypes.onViewClosing, message);
			});
		}
	},

	onTogglePopupHandler: function (event) {
		event.preventDefault();
		this.toggleList();
	},

	toggleList: function () {
		var tabs = this.model.get('tabs');
		var messages = tabs.map();
		messages.shift();//Пропускаем home

		if (messages.length != 0) {
			if (this.ui.popup.hasClass('hidden')) {
				this.ui.popup.toggleClass('hidden', false);
			} else {
				this.ui.popup.toggleClass('hidden', true);
			}
		}
	}

});

_.extend(ActiveBarView.prototype, bindUIElementsMixin);

//####app/controls/application/activeBar/activeBarControl.js
var ActiveBarControl = function (appId, view, viewId) {
    this.appId = appId;
    this.appName = view.getText();
    this.viewId = viewId;
    this.view = view;

    _.superClass(ActiveBarControl, this);
};
_.inherit(ActiveBarControl, Control);
_.extend(ActiveBarControl.prototype, {
    createControlModel: function () {
        return new ActiveBarModel({appId: this.appId, appName: this.appName, viewId: this.viewId, view: this.view});
    },
    createControlView: function (model) {
        return new ActiveBarView({model: model});
    },

    /**
     * @description Закрытие дочерних представлений приложения
     * @param {Function} callback
     */
    closingViews: function (callback) {
        this.controlView.requestClose(callback);
        //var views = this.controlModel.get('views');
        //this.controlView.onClosedAllViews = callback;
        //if (views.length > 0) {
        //    var exchange = messageBus.getExchange(this.appId);
        //    // Рассылка всем представлениям из ActiveBar запроса на закрытие
        //    views.each(function (data) {
        //        exchange.send(messageTypes.onViewClosing, {viewId: data.get('viewId'), appId: this.appId});
        //    });
        //} else {
        //    //Нет открытых дочерних представлений
        //    callback();
        //}
    },

    remove: function () {
        this.controlView.remove();
    }

});
//####app/controls/application/activeBar/activeBarTab.js
var ActiveBarTabModel = Backbone.Model.extend({
	defaults: {
		title: '',
		view: null,
		viewId: null,
		appId: null,
		home: false,
		active: false
	},

	initialize: function () {
		this.on('change:active', this.onChangeActiveHandler);
	},

	onChangeActiveHandler: function (model, value) {
		var collection = this.collection;
		var viewId = this.get('viewId');
		if (value === true) {
			// Сброс атрибута активности у других вкладок
			collection.forEach(function (tab) {
				tab.set('active', tab === model);
			});

			messageBus.getExchange(this.get('appId')).send(messageTypes.onShowView, {viewId: viewId});
		}
	},

	requestClose: function () {
		//Отправить в шину сообщение на закрытие представления
		var appId = this.get('appId');
		var exchange = messageBus.getExchange(appId);
		exchange.send(messageTypes.onViewClosing, {
			viewId: this.get('viewId'), 
			appId: appId
		});
	}
});

var ActiveBarTabCollection = Backbone.Collection.extend({
	model: ActiveBarTabModel,

	initialize: function () {
		this.on('remove', this.onRemoveHandler);
	},

	onRemoveHandler: function (model, collection) {
		var model = collection.findWhere({active: true});
		if (typeof model !== 'undefined') {
			return;
		}

		//Активные вкладки были закрыты
		model = collection.at(0);
		if (typeof model !== 'undefined') {
			model.set('active', true);
		}

	}
});

var ActiveBarTabView = Backbone.View.extend({

	tagName: 'li',

	template: {
		normal: InfinniUI.Template['controls/application/activeBar/template/button/normal.tpl.html'],
		home: InfinniUI.Template['controls/application/activeBar/template/button/home.tpl.html']
	},

	UI: {
		close: '.close'
	},

	events: {
		'click .close-inset': 'onClickCloseHandler',
		'click': 'onClickHandler'
	},

	initialize: function () {
		this.listenTo(this.model, 'change', this.onChangeHandler);
		this.listenTo(this.model, 'remove', this.onRemoveHandler);
        var view = this.model.get('view');
        view.onTextChange(this.render.bind(this));
	},

	/** @description Обработчик удаления модели из коллекции. Удаляем Представление модели **/
	onRemoveHandler: function () {
		this.remove();
	},

	onChangeHandler: function (model) {
		var viewId = this.model.get('viewId');
		var $app = this.$el.parents('.app-area');

		$app.children('[data-view-id]').hide();

		if (model.get('active') === true) {
			var $el = $app.children('[data-view-id="' + viewId + '"]').show();
		}
		this.render();// @TODO Возможно лучше произвести изменения в DOM, чем перерендеривать представление
	},

	render: function () {
		var data = this.model.toJSON();
		this.$el.toggleClass('active', data.active);
		this.$el.toggleClass('home', this.model.get('home'));

		var template = (this.model.get('home')) ? this.template['home'] : this.template['normal'];

        var view = this.model.get('view');
		this.$el.html(template({
            viewId: this.model.get('viewId'),
            appName: view.getText(),
            title: view.getText()
        }));
		this.bindUIElements();
		return this;
	},

	/** @description Обработчик нажатия на кнопку закрытия вкладки **/	
	onClickCloseHandler: function (event) {
		this.model.requestClose();
		event.preventDefault();
		event.stopPropagation();
	},

	/** @description Обработчик нажатия на вкладку, для переключения ее активизации **/
	onClickHandler: function (event) {
		event.preventDefault();
		this.model.set('active', true);
	}

});

_.extend(ActiveBarTabView.prototype, bindUIElementsMixin);

//####app/controls/application/activeBar/list.js
var ActiveBarPopup = Backbone.View.extend({

    tagName: 'ul',

    className: 'navbar-list-items',

    template: {
        item: InfinniUI.Template['controls/application/activeBar/template/item.tpl.html']
    },

    UI: {
        items: '.items'
    },

    events: {
        'click .navbar-list-item': 'onItemClickHandler',
        'click .navbar-list-item-close': 'onCloseClickHandler',
        'mouseleave': 'onMouseOutHandler'
    },

    /**
     * @param {*} options
     * @param {ActiveBarTabsCollection} options.collection
     */
    initialize: function (options) {
        var collection = options.collection;

        this.listenTo(collection, 'add', this.onChangeHandler);
        this.listenTo(collection, 'remove', this.onChangeHandler);
        this.listenTo(collection, 'onTextChange', this.onChangeHandler);

        this.collection = collection;
    },

    onChangeHandler: function (model, collection) {
        this.renderItems();
    },

    renderItems: function () {
        var collection = this.collection;
        var template = this.template.item;
        var $items = this.$el;
        $items.empty();

        collection.forEach(function (model) {
            if (model.get('home') !== true) {
                var view = model.get('view');
                $items.append(template({
                    viewId: model.get('viewId'),
                    title: view.getText()
                }));
            }
        }, this);
    },

    render: function () {
        this.$el.empty();
        this.renderItems();
        return this;
    },

    onItemClickHandler: function (event) {
        event.preventDefault();
        var $el = $(event.target);
        var viewId = $el.attr('data-view-id');
        var view = this.collection.findWhere({viewId: viewId});
        view.trigger('view:active', view);
    },

    onCloseClickHandler: function (event) {
        event.preventDefault();
        event.stopPropagation();
        var $el = $(event.target);
        var viewId = $el.attr('data-view-id');
        var view = this.collection.findWhere({viewId: viewId});
        view.trigger('view:close', view);
    },

    onMouseOutHandler: function () {
        this.$el.parent().addClass('hidden');
    }

});
//####app/controls/application/applicationView/applicationView.js
function ApplicationView() {

    var $top;
    var $bottom;
    var $container;

    var template = InfinniUI.Template['controls/application/applicationView/template.tpl.html'];

    this.getContainer = function () {
        return $container;
    };

    this.open = function ($el) {
        $el.prepend(template({}));

        $top = $('#page-top', $el);
        $bottom = $('#page-bottom', $el);
        $container = $('#page-content', $el);

        $('#page-top')
            .empty()
            .append(new StatusBarControl().render());
        $('#page-bottom')
            .empty()
            .append(new GlobalNavigationBarControl().render());
    };

    this.getApplicationView = function () {
        return this;
    }

}

//####app/controls/application/globalNavigationBar/applications.js
var GlobalNavigationBarApplicationModel = Backbone.Model.extend({

    defaults: {
        appId: null,
        viewId: null,
        name: null,
        pinned:false,
        active: false,
        home: false
    }

});

var GlobalNavigationBarApplicationCollection = Backbone.Collection.extend({
    model: GlobalNavigationBarApplicationModel,

    initialize: function () {
        this.on('add', this.onAddHandler, this);
    },

    onAddHandler: function (model) {
        this.listenTo(model, 'change:active', this.onChangeModelHandler.bind(this));
    },

    onChangeModelHandler: function (model, value) {
        var index = this.indexOf(model);
        var button;

        if (value === true) {
            for (var i = 0; i < this.length; i = i + 1) {
                button = this.at(i);
                button.set('before-active', i === index - 1);
                button.set('after-active', i === index + 1);
                button.set('last', this.length === i + 1);
            }
        }
    }

});


var GlobalNavigationBarApplicationView = Backbone.View.extend({

    className: 'pl-gn-button',

    tagName: 'div',

    template: {
        home: InfinniUI.Template['controls/application/globalNavigationBar/template/button/home.tpl.html'],
        pinned: InfinniUI.Template['controls/application/globalNavigationBar/template/button/pinned.tpl.html'],
        normal: InfinniUI.Template['controls/application/globalNavigationBar/template/button/normal.tpl.html']
    },

    activeClass: 'pl-active',

    UI: {
        link: '.pl-gn-button-link',
        close: '.pl-gn-button-close'
    },

    events: {
        'click .pl-gn-button-link': 'onClickLinkHandler',
        'click .pl-gn-button-close': 'onClickCloseHandler'
    },

    onClickLinkHandler: function (event) {
        this.model.trigger('application:active', this.model);
        event.preventDefault();
    },

    onClickCloseHandler: function (event) {
        this.model.trigger('application:close', this.model);
        event.preventDefault();
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.onChangeHandler);
    },

    render: function () {
        var model = this.model;
        var pinned = model.get('pinned');
        var active = model.get('active');
        var home = model.get('home');
        var view = model.get('view');
        var template;

        if (home === true) {
            template = this.template.home;
        } else {
            template = pinned ? this.template.pinned : this.template.normal;
        }

        this.$el.html(template({
            appId: model.get('appId'),
            name: view.getText()
        }));

        this.$el.toggleClass('pl-before-active', !!model.get('before-active'));
        this.$el.toggleClass('pl-after-active', !!model.get('after-active'));
        this.$el.toggleClass('last', !!model.get('last'));
        this.$el.toggleClass(this.activeClass, active);
        this.$el.toggleClass(this.activeClass, active);
        this.$el.toggleClass('pl-gn-button-home', home);

        this.bindUIElements();
        this.delegateEvents();

        return this;
    },

    onChangeHandler: function () {
        //При ищменении атрибутов приложения - перерисовка кнопки
        this.render();
    }

});

_.extend(GlobalNavigationBarApplicationView.prototype, bindUIElementsMixin);

//####app/controls/application/globalNavigationBar/bar.js
var GlobalNavigationBarControl = function () {
    _.superClass(GlobalNavigationBarControl, this);
};

_.inherit(GlobalNavigationBarControl, Control);

_.extend(GlobalNavigationBarControl.prototype, {
    createControlModel: function () {
        return new GlobalNavigationBarModel();
    },
    createControlView: function (model) {
        return new GlobalNavigationBarView({model: model});
    }
});

var GlobalNavigationBarModel = ControlModel.extend({
    defaults: _.defaults({}, ControlModel.prototype.defaults)
});


var GlobalNavigationBarView = ControlView.extend({

    className: 'pl-global-navigation-bar',

    UI: {
        fixed: '.pl-gn-buttons-fixed',
        pinned: '.pl-gn-buttons-pinned',
        normal: '.pl-gn-buttons-applications',
        list: '.pl-global-navigation-list',
        popup: '.pl-gn-list-container'
    },

    template: InfinniUI.Template['controls/application/globalNavigationBar/template/template.tpl.html'],

    events: {
        'click .home': 'onClickHomeHandler',
        'click .pl-global-navigation-list': 'onTogglePopupHandler'
    },

    homePageHandler: true,

    initialize: function () {
        var applications = new GlobalNavigationBarApplicationCollection();
        this.model.set('applications', applications);
        this.listenTo(applications, 'add', this.onAddApplicationHandler);
        this.listenTo(applications, 'remove', this.onRemoveApplicationHandler);

        window.applications = applications;

        this.buttons = {};
        window.InfinniUI.global.messageBus.subscribe(messageTypes.onViewOpened, this.onAddViewEventHandler.bind(this));
    },

    /**
     * @description Обработчик добавления данных о приложении в список приложений
     * @param application
     */
    onAddApplicationHandler: function (application, applications) {
        var appId = application.get('appId');
        var pinned = application.get('pinned');
        var home = application.get('home');
        var view = application.get('view');

        view.onTextChange(function () {
            applications.trigger('onTextChange');
        });

        this.listenTo(application, 'change:pinned', this.onChangePinnedHandler);

        var button = new GlobalNavigationBarApplicationView({model: application});

        this.buttons[appId] = button;

        var $container;
        $container = this.ui.normal;
        //
        //if (home) {
        //    $container = this.ui.fixed;
        //} else {
        //    $container = pinned ? this.ui.pinned : this.ui.normal;
        //}
        var $el = button.render().$el;
        $container.append($el);
        view.onTextChange(function ($el, view) {
            $el.find('.pl-gn-button-link > span').text(view.getText());
        }.bind(this, $el, view));

        this.listenTo(application, 'application:close', this.onCloseApplication);
        this.listenTo(application, 'application:active', this.onActiveApplication);

        this.setActiveApplication(appId);
    },

    onRemoveApplicationHandler: function (application) {
        var appId = application.get('appId');
        var button = this.buttons[appId];
        button.remove();
    },

    setActiveApplication: function (appId) {
        var applications = this.model.get('applications');
        var application = applications.findWhere({appId: appId});
        /** @TODO Скрыть другие приложения, показать выбранное приложение **/

        /** @TODO Отрефакторить! Нужно сделать ч/з getApplicationView **/
        $('#page-content').find('[data-app-id]').hide();
        $('#page-content').find('[data-app-id="' + appId + '"]').show();

        var button = this.buttons[appId];
        this.setActiveButton(appId);
    },


    onActiveApplication: function (application) {
        this.setActiveApplication(application.get('appId'));
        this.toggleList(false);
    },

    /**
     * @description Обработчик нажатия кнопки закрытия вкладки приложения
     * @param application
     */
    onCloseApplication: function (application) {
        var appId = application.get('appId');
        this.closeApplication(appId);
        this.toggleList(false);
    },

    /**
     * @description Закрытие приложения
     * @param appId
     */
    closeApplication: function (appId) {
        var application = applications.findWhere({appId: appId});
        var activeBar = application.get('activeBar');
        activeBar.closingViews(this.closingApplicationView.bind(this, appId));
    },

    /**
     * #description Закрытие представления приложения
     * @param appId
     */
    closingApplicationView: function (appId) {
        var application = applications.findWhere({appId: appId});
        var view = application.get('view');
        var exchange = window.InfinniUI.global.messageBus;

        var message = {appId: appId, viewId: application.get('viewId')};
        exchange.send(messageTypes.onViewClosing, message);
    },

    /**
     * Установка признака активности кнопки преключения указанного приложения
     * @param button
     */
    setActiveButton: function (appId) {
        _.each(this.buttons, function (btn, id) {
            btn.model.set('active', id === appId);
        });
    },

    /**
     * @description Обработчик изменения признака закрепления кнопки на панели задач. Перемещает кнопку в нужный раздел
     * @param application
     * @param {Boolean} pinned
     */
    onChangePinnedHandler: function (application, pinned) {
        var appId = application.get('appId');
        var button = this.buttons[appId];
        //var $container = pinned ? this.ui.pinned : this.ui.normal;
        var $container = this.ui.normal;
        button.$el.detach().appendTo($container);
    },

    /**
     * @description Обработчик открытия представления.
     * @param message
     */
    onAddViewEventHandler: function (message) {
        var activeBar;
        var applications = this.model.get('applications');
        var application = applications.add({
            name: message.view.getText(),
            appId: message.appId,
            viewId: message.viewId,
            view: message.view,
            home: this.homePageHandler
        });


        if (this.homePageHandler) {
            this.homePageHandler = false;
        } else {
            activeBar = new ActiveBarControl(message.appId, message.view, message.viewId);
            application.set('activeBar', activeBar, {silent: true});
            message.container.prepend(activeBar.render());
            this.show(message.appId);
        }

        var exchange = window.InfinniUI.global.messageBus;
        exchange.subscribe(messageTypes.onViewClosed, this.onViewClosedHandler.bind(this, message.appId));

        //exchange.subscribe(messageTypes.onViewClosing, this.closingApplicationView.bind(this, message.appId));
    },

    /**
     * @description Обработчик закрытия представления приложения
     * @param appId
     * @param message
     */
    onViewClosedHandler: function (appId, message) {
        var applications = this.model.get('applications');
        var application = applications.findWhere({appId: appId});
        var activeBar;

        if (application && message.viewId === application.get('viewId')) {
            activeBar = application.get('activeBar');
            applications.remove(application);
            activeBar.remove();
            // @TODO Активировать соседнее приложение
            application = applications.last(1).pop();
            this.setActiveApplication(application.get('appId'));
        }

    },

    show: function (appId) {
        if (_.isEmpty(appId)) {
            alert('appId is null');
            return;
        }

        this.setActiveButton(appId);


    },

    hide: function (appId, appIdActive) {
        if (_.isEmpty(appId)) {
            alert('appId is null');
            return;
        }
        if (_.isEmpty(appIdActive)) {
            appIdActive = this.$el.find('.navbar-nav li:first a').data('app-anchor');
        }

        $('#page-content').find('[data-app-id]').hide();
        $('#page-content').find('[data-app-id="' + appId + '"]').remove();
        $('#page-content').find('[data-app-id="' + appIdActive + '"]').show();
    },

    render: function () {
        this.$el.html(this.template({}));
        this.bindUIElements();

        var list = new GlobalNavigationPopup({collection: this.model.get('applications')});

        this.ui.popup.append(list.render().$el);
        return this;
    },

    /**
     * Обработка нажатия ссылки переходна на домашнюю страницу
     * @param event
     */
    onClickHomeHandler: function (event) {

    },

    onTogglePopupHandler: function (event) {
        event.preventDefault();
        this.toggleList();
    },

    toggleList: function (show) {
        if (typeof show === 'boolean') {
            this.ui.popup.toggleClass('hidden', !show);
        } else {
            this.ui.popup.toggleClass('hidden');
        }

    }

});
//####app/controls/application/globalNavigationBar/list.js
var GlobalNavigationPopup = Backbone.View.extend({

    tagName: 'ul',

    className: 'pl-gn-list',

    template: {
        item: InfinniUI.Template['controls/application/globalNavigationBar/template/item.tpl.html']
    },

    UI: {
        items: '.items'
    },

    events: {
        'click .pl-application-item': 'onItemClickHandler',
        'click .pl-application-close': 'onCloseClickHandler',
        'mouseleave': 'onMouseOutHandler'
    },

    /**
     * @param {*} options
     * @param {GlobalNavigationBarApplicationCollection} options.collection
     */
    initialize: function (options) {
        var collection = options.collection;

        this.listenTo(collection, 'add', this.onChangeHandler);
        this.listenTo(collection, 'remove', this.onChangeHandler);
        this.listenTo(collection, 'onTextChange', this.onChangeHandler);

        this.collection = collection;
    },

    onChangeHandler: function (model, collection) {
        this.renderItems();
    },

    renderItems: function () {
        var collection = this.collection;
        var template = this.template.item;
        var $items = this.$el;
        $items.empty();

        collection.forEach(function (model) {
            if (model.get('home') !== true) {
                var view = model.get('view');
                $items.append(template({
                    name: view.getText(),
                    appId: model.get('appId')
                }));
            }
        }, this);
    },

    render: function () {
        this.$el.empty();
        this.renderItems();
        return this;
    },

    onItemClickHandler: function (event) {
        event.preventDefault();
        var $el = $(event.target);
        var appId = $el.attr('data-app-id');
        var application = this.collection.findWhere({appId: appId});
        application.trigger('application:active', application);
    },

    onCloseClickHandler: function (event) {
        event.preventDefault();
        event.stopPropagation();
        var $el = $(event.target);
        var appId = $el.attr('data-app-id');
        var application = this.collection.findWhere({appId: appId});
        application.trigger('application:close', application);
    },

    onMouseOutHandler: function () {
        this.$el.parent().addClass('hidden');
    }

});
//####app/controls/application/statusBar/authentication/SignInSuccessView.js
jQuery(document).ready(function () {
    refreshUserInfo();
});

function getUserInfo(self){
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);
    authProvider.getCurrentUser(
        function (result) {
            self.model.set('result', result);
        },
        function (error) {
            showObject('#signInInternalResult', error);
        }
    );
}

function refreshUserInfo() {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);
    authProvider.getCurrentUser(
        function (result) {
            setUserInfo(result);
        },
        function (error) {
            showObject('#getCurrentUserResult', error);
        }
    );
}

function changePassword() {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);

    authProvider.changePassword(
        $('#oldPassword').val(),
        $('#newPassword').val(),
        function (result) {
            refreshUserInfo();
        },
        function (error) {
            showObject('#changePasswordResult', error);
        }
    );
}

function changeProfile() {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);

    authProvider.changeProfile(
        $('#displayName').val(),
        $('#description').val(),
        function (result) {
            refreshUserInfo();
        },
        function (error) {
            showObject('#changeProfileResult', error);
        }
    );
}

function changeActiveRole() {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);

    authProvider.changeActiveRole(
        $('#activeRole').val(),
        function (result) {
            refreshUserInfo();
        },
        function (error) {
            showObject('#сhangeActiveRoleResult', error);
        }
    );
}

function getLinkExternalLoginForm() {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);

    authProvider.getLinkExternalLoginForm(
        getAbsoluteUri('/Home/SignInSuccess'),
        getAbsoluteUri('/Home/SignInFailure'),
        function (result) {
            $('#linkExternalLoginForm').append(result);
        },
        function (error) {
            showObject('#linkExternalLoginResult', error);
        }
    );
}

function unlinkExternalLogin(provider, providerKey) {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);

    authProvider.unlinkExternalLogin(
        provider,
        providerKey,
        function (result) {
            refreshUserInfo();
        },
        function (error) {
            showObject('#unlinkExternalLoginResult', error);
        }
    );
}

function signOut(self) {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);

    onSuccessSignOut(getHomePageContext());

    authProvider.signOut(
        function (result) {


            window.getCurrentUserName = function(){
                return null;
            };

            //self.model.set('result', result);
            self.model.set('result', null);
            location.reload();
//            window.location = '/Home/SignIn';
        },
        function (error) {
            showObject('#getCurrentUserResult', error.responseJSON);
        }
    );
}

function setUserInfo(userInfo) {
    //showObject('#getCurrentUserResult', userInfo);
    //$('#displayName').val(userInfo.DisplayName);
    //$('#description').val(userInfo.Description);
    //$('#activeRole').val(userInfo.ActiveRole);

    if (userInfo.Logins !== null && userInfo.Logins !== undefined) {
        var externalLogins = $('#externalLogins');

        for (var i = 0; i < userInfo.Logins.length; ++i) {
            var loginInfo = userInfo.Logins[i];
            var provider = loginInfo.Provider;
            var providerKey = loginInfo.ProviderKey;

            var unlinkButton = $(document.createElement('input'));
            unlinkButton.attr('type', 'button');
            unlinkButton.attr('value', provider);
            unlinkButton.attr('onclick', 'unlinkExternalLogin(\'' + provider + '\', \'' + providerKey + '\')');
            externalLogins.append(unlinkButton);
        }
    }
    getLinkExternalLoginForm();
}

function getAbsoluteUri(relativeUri) {
    return location.protocol + '//' + location.host + relativeUri;
}

function showObject(element, object) {
    var text = formatObject(object);
    $(element).text(text);
}

function formatObject(object) {
    return JSON.stringify(object, null, 4);
}
//####app/controls/application/statusBar/authentication/SignInView.js
jQuery(document).ready(function () {
    getSignInExternalForm();
});

function signInInternal(self) {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);
    authProvider.signInInternal(
        $('#userName').val(),
        $('#password').val(),
        $('#remember').is(':checked'),
        function (result) {


            window.getCurrentUserName = function(){
                return result.UserName;
            };

            self.model.set('result', result);
            self.$modal.modal('hide');
            location.reload();
        },
        function (error) {
            if(error.Error.indexOf('Invalid username or password') > -1){
                toastr.error('Неверный логин или пароль', "Ошибка!");
            }
            showObject('#signInInternalResult', error);
        }
    );
}

function getSignInExternalForm() {
    var authProvider = new AuthenticationProvider(InfinniUI.config.serverUrl);
    authProvider.getSignInExternalForm(
        getAbsoluteUri('/Home/SignInSuccess'),
        getAbsoluteUri('/Home/SignInFailure'),
        function (result) {
            $('#signInExternalForm').append(result);
        },
        function (error) {
            showObject('#signInExternalResult', error);
        }
    );
}

function getAbsoluteUri(relativeUri) {
    return location.protocol + '//' + location.host + relativeUri;
}

function showObject(element, object) {
    var text = formatObject(object);
    $(element).text(text);
}

function formatObject(object) {
    return JSON.stringify(object, null, 4);
}
//####app/controls/application/statusBar/authentication/authenticationProvider.js
/**
  * Провайдер аутентификации.
  *
  * @constructor
  */
function AuthenticationProvider(baseAddress) {
    this.baseAddress = baseAddress;
}


_.extend(AuthenticationProvider.prototype, {
    handlers: {
        onActiveRoleChanged: $.Callbacks(),
        onSignInInternal: $.Callbacks(),
        onSignOut: $.Callbacks()
    },

    /**
          * Возвращает информацию о текущем пользователе.
          *
          * @public
          */
    getCurrentUser: function(resultCallback, errorCallback) {
        this.sendPostRequest('/Auth/GetCurrentUser', {}, resultCallback, errorCallback);
    },

    /**
          * Изменяет пароль текущего пользователя.
          *
          * @public
          */
    changePassword: function (oldPassword, newPassword, resultCallback, errorCallback) {
        var changePasswordForm = {
            OldPassword: oldPassword,
            NewPassword: newPassword
        };

        this.sendPostRequest('/Auth/ChangePassword', changePasswordForm, resultCallback, errorCallback);
    },

    /**
          * Изменяет персональную информацию текущего пользователя.
          *
          * @public
          */
    changeProfile: function (displayName, description, resultCallback, errorCallback) {
        var changeProfileForm = {
            DisplayName: displayName,
            Description: description
        };

        this.sendPostRequest('/Auth/ChangeProfile', changeProfileForm, resultCallback, errorCallback);
    },

    /**
          * Изменяет активную роль текущего пользователя.
          *
          * @public
          */
    changeActiveRole: function (activeRole, resultCallback, errorCallback) {
        var changeActiveRoleForm = {
            ActiveRole: activeRole
        };

        this.sendPostRequest('/Auth/ChangeActiveRole', changeActiveRoleForm, function(){
            var args = _.toArray(arguments);
            args.push(activeRole);
            if(resultCallback){
                resultCallback.apply(this, args);
            }

            this.handlers.onActiveRoleChanged.fire.apply(this.handlers.onActiveRoleChanged, args);
            var exchange = messageBus.getExchange('global');
            exchange.send('OnActiveRoleChanged', {value: args});
        }, errorCallback);
    },

    /**
          * Осуществляет вход пользователя в систему через внутренний провайдер.
          *
          * @public
          */
    signInInternal: function (userName, password, remember, resultCallback, errorCallback) {
        var signInInternalForm = {
            UserName: userName,
            Password: password,
            Remember: remember
        };

        this.sendPostRequest('/Auth/SignInInternal', signInInternalForm, resultCallback, errorCallback);
    },

    /**
          * Возвращает форму входа пользователя в систему через внешний провайдер.
          *
          * @public
          */
    getSignInExternalForm: function (successUrl, failureUrl, resultCallback, errorCallback) {
        this.getExternalLoginForm('/Auth/SignInExternal', successUrl, failureUrl, resultCallback, errorCallback);
    },

    /**
          * Возвращает форму добавления текущему пользователю имени входа у внешнего провайдера.
          *
          * @public
          */
    getLinkExternalLoginForm: function (successUrl, failureUrl, resultCallback, errorCallback) {
        this.getExternalLoginForm('/Auth/LinkExternalLogin', successUrl, failureUrl, resultCallback, errorCallback);
    },

    /**
          * Удаляет у текущего пользователя имя входа у внешнего провайдера.
          *
          * @public
          */
    unlinkExternalLogin: function (provider, providerKey, resultCallback, errorCallback) {
        var unlinkExternalLoginForm = {
            Provider: provider,
            ProviderKey: providerKey
        };

        this.sendPostRequest('/Auth/UnlinkExternalLogin', unlinkExternalLoginForm, resultCallback, errorCallback);
    },

    addClaim: function(userName, claimName, claimValue, resultCallback, errorCallback) {
        var claim = {
            "id" : null,
            "changesObject" : {
                "UserName" : userName,
                "ClaimType": claimName,
                "ClaimValue": claimValue
            },
            "replace" : false
        };

        this.sendPostRequest('/RestfulApi/StandardApi/authorization/setsessiondata', claim, resultCallback, errorCallback);
    },

    setSessionData: function(claimType, claimValue, resultCallback, errorCallback) {
        var claim = {
            "id" : null,
            "changesObject" : {
                "ClaimType": claimType,
                "ClaimValue": claimValue
            },
            "replace" : false
        };

        this.sendPostRequest('/RestfulApi/StandardApi/authorization/setsessiondata', claim, resultCallback, errorCallback);
    },

    getSessionData: function(claimType, resultCallback, errorCallback) {
        var claim = {
            "id" : null,
            "changesObject" : {
                "ClaimType": claimType,
            },
            "replace" : false
        };

        this.sendPostRequest('/RestfulApi/StandardApi/authorization/getsessiondata', claim, resultCallback, errorCallback);
    },

    /**
          * Выход пользователя из системы.
          *
          * @public
          */
    signOut: function (resultCallback, errorCallback) {
        var signOutInternalForm = {
            "id" : null,
            "changesObject" : {},
            "replace" : false
        };

        this.sendPostRequest('/Auth/SignOut', null, function(){
            var args = _.toArray(arguments);
            if(resultCallback){
                resultCallback.apply(this, args);
            }

            this.handlers.onSignOut.fire.apply(this.handlers.onSignOut, args);
            var exchange = messageBus.getExchange('global');
            exchange.send('OnSignOut', {value: args});
        }.bind(this), errorCallback);
    },

    getExternalLoginForm: function (requestUri, successUrl, failureUrl, resultCallback, errorCallback) {
        var url = this.baseAddress + requestUri;
        this.sendPostRequest('/Auth/GetExternalProviders', {},
            function (result) {
                var formElement = $(document.createElement('form'));
                formElement.attr('method', 'POST');
                formElement.attr('action', url);

                var successUrlElement = $(document.createElement('input'));
                successUrlElement.attr('type', 'hidden');
                successUrlElement.attr('name', 'SuccessUrl');
                successUrlElement.attr('value', successUrl);
                formElement.append(successUrlElement);

                var failureUrlElement = $(document.createElement('input'));
                failureUrlElement.attr('type', 'hidden');
                failureUrlElement.attr('name', 'FailureUrl');
                failureUrlElement.attr('value', failureUrl);
                formElement.append(failureUrlElement);

                if (result !== null && result !== undefined) {
                    for (var i = 0; i < result.length; ++i) {
                        var providerInfo = result[i];
                        var providerType = providerInfo.Type;
                        var providerName = providerInfo.Name;

                        var loginButton = $(document.createElement('button'));
                        loginButton.attr('type', 'submit');
                        loginButton.attr('name', 'Provider');
                        loginButton.attr('value', providerType);
                        loginButton.text(providerName);
                        formElement.append(loginButton);
                    }
                }

                resultCallback(formElement);
            },
            errorCallback
        );
    },

    sendGetRequest: function (requestUri, resultCallback, errorCallback) {
        $.ajax(this.baseAddress + requestUri, {
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            beforeSend: this.onBeforeRequest(),
            success: this.onSuccessRequest(resultCallback),
            error: this.onErrorRequest(function (error) {
                if(errorCallback) {
                    errorCallback(error.responseJSON);
                }
            })
        });
    },

    sendPostRequest: function (requestUri, requestData, resultCallback, errorCallback) {
        if (requestData !== null) {
            requestData = JSON.stringify(requestData);
        }
        $.ajax(this.baseAddress + requestUri, {
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: requestData,
            contentType: 'application/json',
            beforeSend: this.onBeforeRequest(),
            success: this.onSuccessRequest(resultCallback),
            error: this.onErrorRequest(function (error) {
                if(errorCallback) {
                    errorCallback(error.responseJSON);
                }
            })
        });
    },

    onActiveRoleChanged: function(handler){
        this.handlers.onActiveRoleChanged.add(handler);
    },

    onSignInInternal: function(handler){
        this.handlers.onSignInInternal.add(handler);
    },

    onSignOut: function(handler){
        this.handlers.onSignOut.add(handler);
    }
});

_.extend(AuthenticationProvider.prototype, ajaxRequestMixin);

InfinniUI.global.session = new AuthenticationProvider(InfinniUI.config.serverUrl);
//####app/controls/application/statusBar/statusBar.js
var StatusBarControl = function () {
    _.superClass(StatusBarControl, this);
};
_.inherit(StatusBarControl, Control);
_.extend(StatusBarControl.prototype, {
    createControlModel: function () {
        return new StatusBarModel();
    },
    createControlView: function (model) {
        return new StatusBarView({model: model});
    }
});

var StatusBarModel = ControlModel.extend({
    defaults: _.defaults({}, ControlModel.prototype.defaults, {
        time: '',
        date: '',
        result: null
    })
});

var StatusBarView = ControlView.extend({
    className: 'pl-status-bar',

    events: {
        'click .signIn': 'signInHandler',
        'click .signOut': 'signOutHandler',
        'click .status-bar-menu': 'openMenuHandler'
    },

    template: InfinniUI.Template['controls/application/statusBar/template.tpl.html'],
    loginTemplate: InfinniUI.Template['controls/application/statusBar/authentication/loginTemplate.tpl.html'],

    enterTemplate: InfinniUI.Template['controls/application/statusBar/authentication/enterTemplate.tpl.html'],
    successTemplate: InfinniUI.Template['controls/application/statusBar/authentication/successTemplate.tpl.html'],

    initialize: function () {
        var self = this;
        self.model.set('time', moment().format('HH:mm'));
        self.model.set('date', moment().format('D MMMM'));

        window.setInterval(function () {
            self.model.set('time', moment().format('HH:mm'));
            self.model.set('date', moment().format('D MMMM'));
            self.dateRender();
        }, 10 * 1000);

        getUserInfo(this);
        this.listenTo(this.model, 'change:result', this.render);
    },

    dateRender: function () {
        this.$el.find('.time').text(this.model.get('time'));
        this.$el.find('.date').text(this.model.get('date'));
    },

    signInHandler: function () {
        var self = this;
        if (!this.$modal) {
            this.$modal = $(this.loginTemplate({}));
            this.$modal.appendTo('body');
        }

        this.$modal.modal('show');
        this.$modal.on('hidden.bs.modal', function () {
            $(this).find('#password, #userName').val('');
            $(this).find('#remember').attr('checked', false);
        });
        this.$modal.find('.post').on('click', function () {
            signInInternal(self);
        })
    },
    openMenuHandler: function(){
        var menu = $('.app-area').find('.pl-menu');
        var area = menu.closest('.app-area');

        if(menu.length && area.length) {
            if($(area).is(':visible')) {
                area.css({
                    'display': 'none'
                });
            }else{
                area.css({
                    'position': 'absolute',
                    'width': '100%',
                    'display': 'block',
                    'overflow': 'hidden'
                });
            }
        }
    },

    signOutHandler: function () {
        signOut(this);
    },

    render: function () {
        var result = this.model.get('result');debugger;
        var header = InfinniUI.config.configName;
        var $wrap = $(this.template({header: header}));
        var $loginTemplate,
            self = this;

        window.adjustLoginResult(result).then(function(r){
            if (result) {
                $loginTemplate = $(self.successTemplate({
                    displayName: r.UserName,
                    activeRole: r.ActiveRole,
                    roles: _.pluck(result.Roles, 'DisplayName').join(', ')
                }));
            } else {
                $loginTemplate = $(self.enterTemplate({}));
            }

            $wrap.find('.page-header-inner').prepend($loginTemplate);
            self.$el
                .empty()
                .append($wrap);
        });

        this.$el.find('.calendar').datepicker({
            todayHighlight: true,
            language: 'ru'
        });

        //~fix DatePicker auto close
        this.$el.find('.dropdown-toggle').on('click.bs.dropdown', function() {
            var clicks = $(this).data('clicks');
            if (clicks) {
                $(this).parent('.dropdown').off('hide.bs.dropdown');
            } else {
                $(this).parent('.dropdown').on('hide.bs.dropdown', function () {return false;});
            }
            $(this).data("clicks", !clicks);
        });

        return this;
    }
});
//####app/controls/documentViewer/documentViewerControl .js
var DocumentViewerControl = function () {
    _.superClass(DocumentViewerControl, this);
};

_.inherit(DocumentViewerControl, Control);

_.extend(DocumentViewerControl.prototype, {
    createControlModel: function () {
        return new DocumentViewerModel();
    },

    createControlView: function (model) {
        return new DocumentViewerView({model: model});
    },

    onValueChanged: function(handler){
        this.controlModel.on('change:value', handler);
    },

    renderDocument: function(){
        this.controlView.renderDocument();
    }
});
//####app/controls/documentViewer/documentViewerModel.js
var DocumentViewerModel = ControlModel.extend({
    initialize: function(){
        ControlModel.prototype.initialize.apply(this);
    }
});
//####app/controls/documentViewer/documentViewerView.js
var DocumentViewerView = PdfViewerViewBase.extend({
    renderDocument: function(){
        var that = this,
            renderFrame = function(){
            this.$el.empty();
            var requestData = {
                PrintViewId: this.model.get('viewId'),
                ConfigId: dataSource.getConfigId(),
                DocumentId: dataSource.getDocumentId(),
                PageNumber: dataSource.getPageNumber(),
                PageSize: dataSource.getPageSize(),
                Query: dataSource.getFilter()
            };

            var urlParams = $.param({Form: JSON.stringify(requestData)}).replace(/%22/g, '%27');
            this.sendRequest(InfinniUI.config.serverUrl+'/SystemConfig/UrlEncodedData/Reporting/GetPrintView/?' + urlParams, function(data){
                that.renderPdf(data);
            });
        }.bind(this);

        var parentView = this.model.get('view');
        var dataSource = parentView.getContext().dataSources[this.model.get('dataSource')];

        if (typeof this.onDataSourceItemsUpdated !== 'undefined') {
            this.onDataSourceItemsUpdated.unsubscribe();
        }

        this.onDataSourceItemsUpdated = dataSource.onItemsUpdated(function(){
            renderFrame();
        });

        renderFrame();
    }
});
//####app/controls/extensionPanel/extensionPanel.js
var ExtensionPanelControl = function () {
    _.superClass(ExtensionPanelControl, this);
};

_.inherit(ExtensionPanelControl, ContainerControl);

_.extend(ExtensionPanelControl.prototype, {

    createControlModel: function () {
        return new ExtensionPanelModel();
    },

    createControlView: function (model) {
        return new ExtensionPanelView({model: model});
    }
});
//####app/controls/extensionPanel/extensionPanelModel.js
var ExtensionPanelModel = ContainerModel.extend({
    defaults: _.defaults({
        extensionName: null,
        context: null
    }, ContainerModel.prototype.defaults),

    initialize: function () {
        ContainerModel.prototype.initialize.apply(this);
    }
});
//####app/controls/extensionPanel/extensionPanelView.js
var ExtensionPanelView = ContainerView.extend({
    className: 'pl-extension-panel',

    initialize: function () {
        ContainerView.prototype.initialize.apply(this);
        this.extensionObject = null;
    },

    render: function () {
        this.prerenderingActions();

        if (!this.extensionObject) {
            this.initExtensionObject();
        }

        this.extensionObject.render();

        this.updateProperties();
        this.trigger('render');

        this.postrenderingActions();
        return this;
    },

    updateGrouping: function(){

    },

    initExtensionObject: function () {
        var extensionName = this.model.get('extensionName'),
            context = this.model.get('context'),
            itemTemplate = this.model.get('itemTemplate'),
            parameters = this.model.get('parameters'),
            items = this.model.get('items');

        this.extensionObject = new window[extensionName](context, {$el: this.$el, parameters: parameters, itemTemplate: itemTemplate, items: items});
    }
});
//####app/controls/filterPanel/filterPanel.js
var FilterPanelControl = function () {
    _.superClass(FilterPanelControl, this);
};

_.inherit(FilterPanelControl, Control);

_.extend(FilterPanelControl.prototype, {
    createControlModel: function () {
        return new FilterPanelModel();
    },

    createControlView: function (model) {
        return new FilterPanelView({model: model});
    },

    onValueChanged: function (handler) {
        this.controlView.on('onValueChanged', handler);
    },

    filter: function () {
        this.controlView.trigger('applyFilter');
    }

});
//####app/controls/filterPanel/filterPanelModel.js
var FilterPanelModel = ControlModel.extend({
    defaults: _.defaults({
    }, ControlModel.prototype.defaults),

    initialize: function(){
        ControlModel.prototype.initialize.apply(this);
        this.set({
            text: 'Найти'
        }, {silent: true});
    }
});
//####app/controls/filterPanel/filterPanelView.js
var FilterPanelView = ControlView.extend({
    className: 'pl-filter-panel',

    template: {
        panel: InfinniUI.Template["controls/filterPanel/template/template.tpl.html"],
        item: InfinniUI.Template["controls/filterPanel/template/item.tpl.html"]
    },


    controlsPerLine: 6,

    events: {
        'click .btn_reset': 'onButtonResetClickHandler',
        'submit form': 'submitFormHandler'
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);

        this.listenTo(this.model, 'change:enabled', this.updateEnabled);
        this.on('applyFilter', this.onApplyFilterHandler);
    },

    render: function () {
        this.prerenderingActions();
        var filters = this.model.get('filters');
        var $item;

        this.$el.html(this.template.panel({
            text: this.model.get('text')
        }));
        var $controls = this.$('.pl-filter-controls');

        for (var i = 0; i < filters.length; i = i + 1) {
            $item = $(this.template.item());
            $('.pl-filter-panel-label', $item).append(filters[i].text.render());
            for (var j = 0; j < filters[i].operators.length; j++) {
                $('.pl-filter-panel-control', $item).append(filters[i].operators[j].el.render());
            }

            $controls.append($item);
        }

        this.updateEnabled();

        this.postrenderingActions();
        return this;
    },

    onApplyFilterHandler: function () {
        this.$el.find('.pl-text-box').trigger('synchValue');
        this.onButtonSearchClickHandler();
    },

    submitFormHandler: function(event){
        event.preventDefault();
        this.trigger('applyFilter');
    },

    onButtonSearchClickHandler: function () {
        var query = this.collectFormQuery();

        if(this.model.get('value') !== undefined && JSON.stringify(this.model.get('value')) == JSON.stringify(query)) {
            return;
        }

        this.model.set('value', query);
        this.trigger('onValueChanged', this.model.get('value'));
    },

    filter:function(){
        this.onButtonSearchClickHandler();
    },

    onButtonResetClickHandler: function () {
        var filters = this.model.get('filters');
        var value = [];

        for (var i = 0; i < filters.length; i++) {
            for (var j = 0; j < filters[i].operators.length; j++) {
                filters[i].operators[j].el.control.set('value', null);
            }
        }

        this.model.set('value', value);
        this.trigger('onValueChanged', this.model.get('value'));

        this.$el.find('.dropdown').one('hidden.bs.dropdown', function(){
            $(this).children('button.dropdown-toggle').focus();
        })
    },

    collectFormQuery: function(){
        var query = [];
        var filters = this.model.get('filters');

        for (var i = 0; i < filters.length; i++) {
            for (var j = 0; j < filters[i].operators.length; j++) {
                var val = filters[i].operators[j].el.getValue();
                if(val) {
                    var obj = {};
                    obj.Property = filters[i].property;
                    if(obj.Property) {
                        obj.CriteriaType = toEnum(filters[i].operators[j].operator);

                        if (typeof val == 'object' && !(val instanceof Date)) {
                            obj.Value = val.Id;
                        } else {
                            obj.Value = val;
                        }
                        query.push(obj);
                    }
                }
            }
        }
        query.push.apply(query, this.model.get('query'));
        //console.log(query);
        return query;
    },

    updateEnabled: function(){
        this.$el.find('input, button').prop('disabled', !this.model.get('enabled'));
    }
});
//####app/controls/globalNavigationBar/buttons/globalNavigationBarButton.js
var GlobalNavigationBarButtonModel = Backbone.Model.extend({
    defaults: {
        key: '',
        text: '',
        active: false,
        description: ''
    }
});

var GlobalNavigationBarButtonView = Backbone.View.extend({

    //className: 'pl-global-navigation-bar-button',
    className: 'pl-gn-button',

    activeClass: 'pl-active',

    template: InfinniUI.Template["controls/globalNavigationBar/buttons/template/template.tpl.html"],
    //template: _.template('<a data-key="<%=key%>"><%=text%><i class="fa fa-times"></i></a>'),

    events: {
        'click .pl-gn-button-link': 'onClickHandler',
        'click .pl-gn-button-close': 'onClickCloseHandler'
    },

    initialize: function (options) {
        this.model = new GlobalNavigationBarButtonModel(options);
        this.listenTo(this.model, 'change:text', this.render);
        this.listenTo(this.model, 'change:active', this.onChangeActiveHandler);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    setText: function (text) {
        this.model.set('text', text);
    },

    setActive: function (active) {
        var activate = this.model.get('key') == active;
        this.model.set('active', activate);
    },

    getKey: function () {
        return this.model.get('key');
    },

    onClickHandler: function (event) {
        event.preventDefault();

        this.trigger('application:activate', this.model.get('key'));
    },

    onClickCloseHandler: function (event) {
        event.preventDefault();
        this.trigger('application:closing');
    },

    onClick: function (handler) {
        this.on('click', handler)
    },

    onChangeActiveHandler: function () {
        var active = this.model.get('active');

        this.$el.toggleClass(this.activeClass, active);
    }

});
//####app/controls/globalNavigationBar/globalNavigationBarControl.js
var GlobalNavigationBarControl = function () {
    _.superClass(GlobalNavigationBarControl, this);
};

_.inherit(GlobalNavigationBarControl, Control);

_.extend(GlobalNavigationBarControl.prototype, {
    createControlModel: function () {
        return new GlobalNavigationBarModel();
    },

    createControlView: function (model) {
        return new GlobalNavigationBarView({model: model});
    },

    addApplicationView: function (view) {
        var model = this.controlModel;
        var applications = model.get('applications').slice();
        if (applications.indexOf(view) === -1) {
            applications.push(view);
            model.set('applications', applications);
        }
        model.set('active', view.getGuid());
    },

    removeApplicationView: function (view) {
        var model = this.controlModel;
        var applications = model.get('applications').slice();
        var i = applications.indexOf(view);
        if (i === -1) {
            return;
        }
        var active = model.get('active');
        if (active === view.getGuid()) {
            model.set('active', null);
        }
        applications.splice(i, 1);
        model.set('applications', applications);
    },

    onActivateApplication: function (handler) {
        this.controlView.on('application:activate', handler);
    },

    onClosingApplication: function (handler) {
        this.controlView.on('application:closing', handler)
    },

    onCloseApplication: function (handler) {
        this.controlView.on('application:close', handler);
    },

    setApplications: function (applications) {
        this.set('applications', applications.slice());
    },

    setApplicationText: function (view) {
        var applications = this.controlModel.get('applications');

        if (applications.indexOf(view) === -1) {
            return;
        }

        this.controlModel.trigger('application:text', {
            key: view.getGuid(),
            text: view.getText()
        });


    }

});
//####app/controls/globalNavigationBar/globalNavigationBarModel.js
var GlobalNavigationBarModel = ControlModel.extend({

    initialize: function () {
        ControlModel.prototype.initialize.apply(this);
        this.set('applications', []);
    }

});

//####app/controls/globalNavigationBar/globalNavigationBarView.js
var GlobalNavigationBarView = ControlView.extend({

    className: 'pl-global-navigation-bar',

    UI: {
        buttons: '.pl-gn-buttons'
    },

    template: InfinniUI.Template["controls/globalNavigationBar/template/template.tpl.html"],

    initialize: function () {
        ControlView.prototype.initialize.apply(this);

        this.listenTo(this.model, 'change:applications', this.onChangeApplicationsHandler);
        this.listenTo(this.model, 'change:active', this.onChangeActiveHandler);
        this.model.set('buttons', []);
        this.model.set('list', []);
    },

    onChangeApplicationsHandler: function () {
        //@TODO Обновить список приложений (кнопки выбора и список)
        var applications = this.model.get('applications');
        this.renderApplications();
    },

    onChangeActiveHandler: function () {
        var buttons = this.model.get('buttons');

        var active = this.model.get('active');

        var index = _.findIndex(buttons, function (button) {
            return button.getKey() == active;
        });

        var button;
        for (var i = 0, ln = buttons.length; i < ln; i = i + 1) {
            button = buttons[i];
            button.$el.toggleClass('pl-before-active', i + 1 === index);
            button.$el.toggleClass('pl-after-active', i === index + 1);
            button.$el.toggleClass('last', i === ln - 1);
        }
    },

    render: function () {

        this.$el.html(this.template({}));
        this.bindUIElements();

        this.renderApplications();
        return this;
    },

    renderApplications: function () {
        this.renderButtons();
        this.renderList();
    },

    renderButtons: function () {
        //@TODO Рендеринг список кнопок выбора приложений
        var applications = this.model.get('applications');

        var control = this;

        var buttons = this.model.get('buttons');

        _.forEach(buttons, function (button) {
            button.remove();
        });


        if (_.isEmpty(applications)) {
            return;
        }

        var active = this.model.get('active');


        buttons = _.map(applications, function (app){
            var button = new GlobalNavigationBarButtonView({
                key: app.getGuid(),
                text: app.getText() || app.getGuid(),
                active: app.getGuid() === active
            });

            button.listenTo(this.model, 'application:text', function (data) {
                if (app.getGuid() === data.key) {
                    this.setText(data.text);
                }
            });

            button.listenTo(this.model, 'change:active', function (model, active) {
                button.setActive(active);
            });

            this.listenTo(button, 'application:closing', function () {
                control.trigger('application:closing', app);
            });

            this.listenTo(button, 'application:activate', function () {
                control.trigger('application:activate', app);
            });




            button.onClick(this.onActivateApplicationHandler);
            //this.$el.append(button.render().$el);
            this.ui.buttons.append(button.render().$el);
            return button;
        }, this);

        this.model.set('buttons', buttons);

    },

    onActivateApplicationHandler: function (key) {
        var applications = this.model.get('applications');

        var app = _.find(applications, function (app) {
            return app.getGuid() === key;
        });

        if (typeof app !== 'undefined') {
            this.trigger('application:activate', app);
        }
    },


    renderList: function () {
        //@TODO Рендеринг выпадающего списка приложений
    }

});
//####app/controls/linkLabel/linkLabelControl.js
var LinkLabelControl = function () {
    _.superClass(LinkLabelControl, this);
};

_.inherit(LinkLabelControl, Control);

_.extend(LinkLabelControl.prototype, {

    createControlModel: function () {
        return new LinkLabelModel();
    },

    createControlView: function (model) {
        return new LinkLabelView({model: model});
    },

    onClick: function(handler){
        this.controlView.onClick(handler);
    }

}, controlValuePropertyMixin);
//####app/controls/linkLabel/linkLabelModel.js
var LinkLabelModel = ControlModel.extend({
    defaults: _.defaults({
        horizontalTextAlignment: 'Left'
    }, ControlModel.prototype.defaults)
});
//####app/controls/linkLabel/linkLabelView.js
var LinkLabelView = ControlView.extend({
    className: 'pl-link-label TextWrapping',

    template: InfinniUI.Template["controls/linkLabel/template/linkLabel.tpl.html"],

    UI: {
        link: 'a',
        label: 'label',
        container: 'div'
    },

    events: {
        'click a': 'onClickHandler'
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
        this.updateLinkText = _.debounce(this._updateLinkText, 50);
        this.initModelHandlers();
    },

    updateReferenceHandler: function (model, value) {
        this.updateReference();
    },

    updateReference: function () {
        if(!this.wasRendered){
            return;
        }
        var href = this.model.get('reference');
        if(href == null || href == undefined || href == ''){
            this.ui.link.prop('href', 'javascript:;');
        }else{
            this.ui.link.prop('href', href);
        }
    },

    initModelHandlers: function () {
        this.listenTo(this.model, 'change:value', this.updateLinkText);
        this.listenTo(this.model, 'change:reference', this.updateReferenceHandler);
        this.listenTo(this.model, 'change:textTrimming', this.updateLinkText);
        //this.listenTo(this.model, 'change:textWrapping', this.updateLinkText);
        this.initHorizontalAlignment();
        this.initHorizontalTextAlignment();
        this.initForeground();
        this.initBackground();
        this.initTextStyle();
        this.initUpdateLineCount();
        this.initTextWrapping();
    },

    render: function () {
        this.prerenderingActions();

        this.$el
            .html(this.template({}));

        this.bindUIElements();
        this.updateLineCount();
        this.updateTextWrapping();
        this.updateLinkText();
        this.updateHorizontalTextAlignment();
        this.updateBackground();
        this.updateForeground();
        this.updateTextStyle();

        this.updateReference();

        this.postrenderingActions();
        return this;
    },

    /**
     * @private
     */
    _updateLinkText: function () {
        var text;

        if(!this.wasRendered){
            return;
        }

        var link = this.ui.link;
        var $container = this.ui.container;

        var model = this.model;
        var textTrimming = this.model.get('textTrimming');
        //var textWrapping = this.model.get('textWrapping');

        text = this.getTextLabel();

        //this.$el.toggleClass('TextWrapping', textWrapping);
        //this.$el.toggleClass('NoTextWrapping', !textWrapping);


        this.model.set('lineHeight', this.ui.label.innerHeight());

        /*
        @TODO Режим ellipsis не применяем т.к.
        setTimeout(function () {
            var txt = '';
            var txt2 = '';
            var ellipsis = ' ...';
            var lineCount = model.get('lineCount');

            if (textWrapping) {
                if (typeof lineCount === 'undefined' || lineCount === null) {
                    link.text(text);
                    return;
                }
            } else {
                if (!textTrimming) {
                    link.text(text);
                    return;
                }
            }

            var chars = [" ", "\n"];
            var fromPosition = 0;

            var maxWidth = $container.innerWidth();
            var lineHeight = model.get('lineHeight');

            var pos;
            while(fromPosition < text.length) {
                pos = Math.min.apply(Math, _.map(chars, function (char) {
                    var index = text.indexOf(char, fromPosition);
                    return index === -1 ? text.length : index;
                }));

                txt2 = text.substring(0, pos);

                if (textTrimming && pos < text.length) {
                    txt2 = txt2 + ellipsis;
                }
                link.text(txt2);

                if (textWrapping) {
                    if (link.innerHeight() > lineHeight * lineCount) {
                        break;
                    } else {
                        txt = txt2;
                    }
                } else {
                    if (link.innerWidth() > maxWidth) {
                        break;
                    } else {
                        txt = txt2;
                    }
                }
                fromPosition = pos + 1;
            }

            link.text(txt);
        }, 150);//Trimming применяется с задержкой
        */

        link.text(text);//Устанавливаем текст, Trimming примениться позже (см. setTimeOut выше)
        link.attr('title', text);

    },

    /**
     * @private
     * Возвращает текст для контрола.
     * @returns {String}
     */
    getTextLabel: function () {
        var text = this.model.get('value');
        var format = this.model.get('format');

        if (typeof text !== 'undefined' && text !== null) {
            if (typeof format !== 'undefined' && format !== null) {
                text = format.format(text);
            }
        }else{
            text = this.model.get('text');
            if (typeof text === 'undefined' || text == null) {
                text = '';
            }
        }

        return text;
    },

    /**
     * @description Обработчик щелчка. Если один из обработчиков вернул false - переход по ссылке отменяется
     * @private
     * @param event
     */
    onClickHandler: function (event) {
        var cancel = false;

        var enabled = this.model.get('enabled');

        if (!enabled) {
            event.preventDefault();
            return;
        }

        this.callEventHandler('OnClick', function (response) {
            if (response === false) {
                cancel = true;
            }
        });

        if (cancel) {
            event.preventDefault();
        }
    }

});

_.extend(LinkLabelView.prototype,
    foregroundPropertyMixin,
    backgroundPropertyMixin,
    textStylePropertyMixin,
    lineCountPropertyMixin,
    textWrappingPropertyMixin
    //horizontalTextAlignmentPropertyMixin
);

//####app/controls/loaderIndicator/loaderIndicator.js
(function () {
    var template = InfinniUI.Template["controls/loaderIndicator/template.tpl.html"];

    if (!InfinniUI.config.useLoaderIndicator) {
        return;
    }

    jQuery(function () {
        var $indicator = $(template());
        $('body').append($indicator);
        $.blockUI.defaults.css = {};
        $(document).ajaxStart(function () {
                $.blockUI({
                    message: $indicator,
                    ignoreIfBlocked: true,
                    baseZ: 99999
                });
            })
            .ajaxStop(function () {
                $.unblockUI();
            })
            .ajaxError(function () {
                $.unblockUI();
            });
    });

})();
//####app/controls/pdfViewer/pdfViewerControl.js
var PdfViewerControl = function () {
    _.superClass(PdfViewerControl, this);
};

_.inherit(PdfViewerControl, Control);

_.extend(PdfViewerControl.prototype, {
    createControlModel: function () {
        return new PdfViewerModel();
    },

    createControlView: function (model) {
        return new PdfViewerView({model: model});
    },

    onValueChanged: function(handler){
        this.controlModel.on('change:value', handler);
    }
});
//####app/controls/pdfViewer/pdfViewerModel.js
var PdfViewerModel = ControlModel.extend({
    initialize: function(){
        ControlModel.prototype.initialize.apply(this);
    }
});
//####app/controls/pdfViewer/pdfViewerView.js
var PdfViewerView = PdfViewerViewBase.extend({
    renderDocument: function () {
        var that = this,
            renderFrame = function(){
                if(this.model.get('url')){
                    var url = encodeURI(this.model.get('url'));
                    this.sendRequest(url, function(data){
                        that.renderPdf(data);
                    });
                }
            }.bind(this);

        renderFrame();

        this.listenTo(this.model, 'change:url', renderFrame);
    }
});
//####app/controls/searchPanel/searchPanel.js
var SearchPanelControl = function () {
    _.superClass(SearchPanelControl, this);
};

_.inherit(SearchPanelControl, Control);

_.extend(SearchPanelControl.prototype, {
    createControlModel: function () {
        return new SearchPanelModel();
    },

    createControlView: function (model) {
        return new SearchPanelView({model: model});
    },

    onValueChanged: function (handler) {
        this.controlView.on('onValueChanged', handler);
    }
});
//####app/controls/searchPanel/searchPanelModel.js
var SearchPanelModel = ControlModel.extend({
    defaults: _.extend({
        value: null
    }, ControlModel.prototype.defaults),

    initialize: function(){
        ControlModel.prototype.initialize.apply(this);
        this.set({
            text: 'Найти'
        }, {silent: true});
    }
});
//####app/controls/searchPanel/searchPanelView.js
var SearchPanelView = ControlView.extend({
    className: 'pl-search-panel',

    template: InfinniUI.Template["controls/searchPanel/template/template.tpl.html"],

    events: {
        'submit form': 'submitFormHandler',
        'click .btn_remove': 'onButtonRemoveClickHandler',
        'input .form-control': 'onUpdateUIValue'
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
        this.listenTo(this.model, 'change:value', this.updateValue);
    },

    render: function () {
        this.prerenderingActions();

        this.$el
            .html(this.template({
                placeholder: this.model.get('text')
            }));

        this.updateValue();
        this.updateEnabled();

        this.postrenderingActions();
        return this;
    },

    submitFormHandler: function(event){
        event.preventDefault();
        this.trigger('onValueChanged',this.model.get('value'));
    },

    updateEnabled: function () {
        ControlView.prototype.updateEnabled.apply(this);

        if (this.wasRendered) {
            var isEnabled = this.model.get('enabled'),
                $control = this.$el.find('.form-control'),
                $button_search = this.$el.find('.btn_search'),
                $button_remove = this.$el.find('.btn_remove');
            $control.prop('disabled', !isEnabled);
            $button_search.prop('disabled', !isEnabled);
            $button_remove.prop('disabled', !isEnabled);
        }
    },

    updateValue : function () {

        if (this.wasRendered) {
            this.$el.find('.form-control').val(this.model.get('value'));
        }
    },

    onUpdateUIValue : function(e){
        var newVal = $(e.target).val();
        this.model.set('value', newVal);
    },

    onButtonRemoveClickHandler: function() {
        this.model.set('value','');
        this.render();
        this.trigger('onValueChanged',this.model.get('value'));
    }
});
//####app/controls/treeView/treeViewControl.js
var TreeViewControl = function () {
    _.superClass(TreeViewControl, this);
};

_.inherit(TreeViewControl, Control);

_.extend(TreeViewControl.prototype, {

    createControlModel: function () {
        return new TreeViewModel();
    },

    createControlView: function (model) {
        return new TreeViewView({model: model});
    },

    getSelectedItem: function () {
        return this.controlView.getSelectedItem();
    }

    //onChangeTerm: function (handler) {
    //    var fn = function (model, value) {
    //        handler(value);
    //    };
    //    this.controlModel.on('change:term', fn);
    //},
    //
    //setOpenListFunction: function(f){
    //    this.controlView.setOpenListFunction(f);
    //},
    //
    //onFirstOpening: function(handler){
    //    this.controlView.on('firstOpening', handler);
    //}

}, controlValuePropertyMixin);
//####app/controls/treeView/treeViewModel.js
var TreeViewModel = ControlModel.extend({
    defaults: _.extend({
        multiSelect: false,
        showNodeImages: false,
        keyProperty: '',
        parentProperty: '',
        imageProperty: '',
        verticalAlignment: 'Stretch',
        /** Inherited from BaseListElement */
        readOnly: false,
        items: []
    }, ControlModel.prototype.defaults)
});

//####app/controls/treeView/treeViewView.js
var TreeViewView = ControlView.extend({

    className: 'pl-treeview',

    template: InfinniUI.Template["controls/treeView/template/treeview.tpl.html"],

    UI: {
        container: 'div'
    },

    initialize: function () {
        this.listenTo(this.model, 'change:value', this.onUpdateValueHandler);
        this.listenTo(this.model, 'change:items', this.onUpdateItemsHandler);
        this.listenTo(this.model, 'change:readOnly', this.onUpdateMultipleHandler);
    },

    render: function () {
        this.prerenderingActions();
        var html = this.template();

        this.$el.html(html);
        this.bindUIElements();

        this.renderData();
        this.bindTreeEvent();

        this.postrenderingActions();
        return this;
    },

    /**
     * @descroption Конвертирует данные из источника данных в формат, подходящий для используемого плагина TreeView
     * @param {Array} data
     * @returns *
     */
    convertData: function (data) {
        var parentProperty = this.model.get('parentProperty');
        var keyProperty = this.model.get('keyProperty');
        var displayProperty = this.model.get('displayProperty');
        var disabled = this.model.get('readOnly');
        var roots = _.pluck(data, keyProperty);
        roots = _.unique(roots);

        return _.map(data, function (item) {
            var id = InfinniUI.ObjectUtils.getPropertyValue(item, keyProperty);
            var result = {
                id: id,
                parent: "#",
                text: this.getDisplayNameValue(item),//item[displayProperty],
                state: {
                    disabled: disabled
                }
            };
            var parentValue;

            if (typeof parentProperty !== 'undefined' && parentProperty !== null) {
                parentValue = InfinniUI.ObjectUtils.getPropertyValue(item, parentProperty);

                if (typeof parentValue !== 'undefined' && parentValue !== null && _.contains(roots, parentValue)) {
                    result.parent = parentValue;
                }
            }

            return result;
        }, this);
    },

    getSelectedItem: function () {
        var items = this.model.get('items');
        var value = this.model.get('value');
        var keyProperty = this.model.get('keyProperty');

        if (value === null || typeof value === 'undefined') {
            return;
        }

        var condition;
        var result;

        var f = function (value) {
            (condition = {})[keyProperty] = value.Id;
            return _.findWhere(items, condition);
        };

        result = (value.constructor === Array) ? _.map(value, f) : f(value);

        return result;
    },

    /**
     * @description Рендеринг дерева
     */
    renderData: function () {
        var $el = this.ui.container;
        var data = this.model.get('items');
        var multiple = this.model.get('multiSelect');

        var plugins = ['wholerow'];
        if (multiple) {
            plugins.push('checkbox');
        }
        $el.jstree({
            plugins: plugins,
            checkbox: {
                three_state: false
            },
            core: {
                multiple: multiple,
                data: this.convertData(data),
                themes: {
                    name: 'proton',
                    responsive: true
                }
            }
        });
        this.updateTree();
    },


    /**
     * @description Конвертирование информации об элементе из плагина jsTree в значение контрола
     * @param data
     * @returns {*}
     */
    buildValueFromTreeData: function (data) {
        var convertData = function (item) {
            var data;
            if (item !== null && typeof item !== 'undefined') {
                data = {
                    Id: item.id,
                    DisplayName: item.text
                };
            }

            return data;
        };

        return (_.isArray(data)) ? _.map(data, convertData) : convertData(data);
    },

    /**
     * @description Обработка выборки элемента
     */
    bindTreeEvent: function () {
        var $el = this.ui.container;

        $el.on('changed.jstree', function() {
            var model = this.model;
            var multiple = model.get('multiSelect');
            var value;

            var data;

            if (multiple) {
                data = $el.jstree("get_checked", true);
            } else {
                data = $el.jstree("get_selected", true);
                if (_.isArray(data) && data.length > 0) {
                    data = data[0];
                }
            }

            value = this.buildValueFromTreeData(data);

            model.set('value', value);
        }.bind(this));
    },


    /**
     * @description Обновляет дерево данными из модели
     */
    updateTree: function () {
        if (!this.wasRendered) {
            return;
        }

        var $el = this.ui.container;
        var data = this.model.get('items');

        if (typeof data === 'undefined' || data === null) {
            data = [];
        }
        $el.jstree(true).settings.core.data = this.convertData(data);
        $el.jstree(true).refresh();
        this.updateTreeState();
    },

    /**
     * @description Обработчик установки значения. Отмечает соотвествующие элементы в TreeView
     */
    onUpdateValueHandler: function (/*model, value*/) {
        this.updateTreeState();
    },

    /**
     * @description Возвращает текстовое значение элемента из дерева.
     * Приоритет: ItemTemplate, ItemFormat, DisplayProperty, toString()
     * @param {Object} item
     */
    getDisplayNameValue: function (item) {
        var itemFormat = this.model.get('itemFormat');
        var displayProperty = this.model.get('displayProperty');
        var result = '' + item;//Вариант по умолчанию - toString()

        /**
         * @TODO Необходимо реализовать поддержку ItemTemplate
         */
        if (typeof itemFormat !== 'undefined' && itemFormat !== null) {
            result = itemFormat.format(item);
        } else if (typeof displayProperty !== 'undefined' && displayProperty !== null){
            result = InfinniUI.ObjectUtils.getPropertyValue(item, displayProperty);
        }

        return result;
    },

    /**
     * @private
     * @description Отмечает выбранные элементы в дереве, по значениям Value компонента
     */
    updateTreeState: function () {
        if (!this.wasRendered) {
            return;
        }

        var value = this.model.get('value');
        var $el = this.ui.container;
        var selected = $el.jstree(true).get_selected();
        var data;
        var deselect;

        if (_.isArray(value)) {
            data = _.pluck(value, 'Id');

            deselect = _.difference(selected, data);
            var select = _.difference(data, selected);
            if (deselect.length > 0) {
                $el.jstree(true).deselect_node(deselect, true);
            }
            if (select.length > 0) {
                $el.jstree(true).select_node(select, true);
            }
        } else {
            deselect = _.without(selected, value);
            $el.jstree(true).deselect_node(deselect, true);

            if (typeof value !== 'undefined' && value !== null) {
                $el.jstree(true).select_node(value.Id, true);
            }
        }
    },

    onUpdateItemsHandler: function (/*model, value*/) {
        this.updateTree();
    },

    onUpdateMultipleHandler: function () {
        this.updateTree();
    }

});

//####app/controls/viewPanel/viewPanelControl.js
var ViewPanelControl = function () {
    _.superClass(ViewPanelControl, this);
};

_.inherit(ViewPanelControl, Control);

ViewPanelControl.prototype.createControlModel = function () {
    return new ViewPanelModel();
};

ViewPanelControl.prototype.createControlView = function (model) {
    return new ViewPanelView({model: model});
};

var ViewPanelModel = ControlModel.extend({
    defaults: _.defaults({
        layout: null
    }, ControlModel.prototype.defaults),

    initialize: function(){
        var that = this;

        ControlModel.prototype.initialize.apply(this);

        this.once('change:layout', function (model, layout) {
            if(layout && layout.onLoaded){
                that.subscribeOnLoaded();
            }
        });
    },

    subscribeOnLoaded: function(){
        var that = this;
        var layout = this.get('layout');

        layout.onLoaded(function(){
            that.set('isLoaded', true);
        });
    }
});

var ViewPanelView = ControlView.extend({
    className: 'pl-view-panel',

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
        this.listenTo(this.model, 'change:layout', this.onChangeLayoutHandler);
    },

    onChangeLayoutHandler: function (model, layout) {
        this.$el.empty();
        if(layout){
            this.$el.append(layout.render());
        }
    },

    render: function () {
        this.prerenderingActions();

        var layout = this.model.get('layout');

        if(layout){
            this.$el.append(layout.render());
        }

        this.updateProperties();
        this.trigger('render');

        this.postrenderingActions(false);
        return this;
    }
});
//####app/data/comparators/comparatorBuilder.js
var ComparatorBuilder = function  () {

};

ComparatorBuilder.prototype.build = function () {

    return new ComparatorId();
};



//####app/data/comparators/comparatorId.js
var ComparatorId = function () {

    this.propertyName = 'Id';
};

ComparatorId.prototype.isEqual = function (a, b) {
    var result = false;
    var value1, value2;
    if (a && b) {
        value1 = InfinniUI.ObjectUtils.getPropertyValue(a, this.propertyName);
        value2 = InfinniUI.ObjectUtils.getPropertyValue(b, this.propertyName);
        result = value1 == value2;
    }

    return result;
};
//####app/data/criteria/criteria.js
var Criteria = function (items) {
    this.onValueChangedHandlers = [];
    this.items = items || [];
};

Criteria.prototype.onValueChanged = function (handler) {
    if (typeof handler === 'function' && this.onValueChangedHandlers.indexOf(handler) === -1) {
        this.onValueChangedHandlers.push(handler);
    }
};

Criteria.prototype.valueChanged = function () {
    _.each(this.onValueChangedHandlers, function (handler) {
        handler();
    });
};



Criteria.prototype.getAsArray = function () {
    var list = [];
    _.each(this.items, function (item) {
        var criteria = {};
        for (var key in item) {
            if (!item.hasOwnProperty(key)) continue;
            if (key === 'Value' && typeof item.Value === 'function') {
                criteria[key] = item.Value();
            } else {
                criteria[key] = item[key];
            }
        }
        list.push(criteria);
    });

    return list;
};

Criteria.prototype.setItems = function (items) {
    if (typeof items !== 'undefined' && items !== null) {
        this.items = items;
    } else {
        this.items = [];
    }
};


/**
 * Обратная совместимость (если строка то конвертирует в "флаговое соответствие")
 */
Criteria.prototype.decodeCriteriaType = function (value) {
    var criteriaType = value;

    if (typeof value === 'string') {
        criteriaType = parseInt(value, 10);
        if (isNaN(criteriaType)) {
            criteriaType = this.criteriaType[value]
        }
    }

    return criteriaType;
};

Criteria.prototype.normalizeCriteria = function (criteria) {

};

Criteria.prototype.criteriaType = {
    IsEquals: 1,
    IsNotEquals: 2,
    IsMoreThan: 4,
    IsLessThan: 8,
    IsMoreThanOrEquals: 16,
    IsLessThanOrEquals: 32,
    IsContains: 64,
    IsNotContains: 128,
    IsEmpty: 256,
    IsNotEmpty: 512,
    IsStartsWith: 1024,
    IsNotStartsWith: 2048,
    IsEndsWith: 4096,
    IsNotEndsWith: 8192,
    IsIn: 16384,
    Script: 32768,
    FullTextSearch: 65536,
    IsIdIn: 131072
};


/**
 * Функция конвертирует CriteriaType в "флаговое соответствие"
 * @param val
 * @returns {number}
 */

function toEnum(val) {

    var criteria = new Criteria();

    return criteria.decodeCriteriaType(val);
}

var criteriaType = {
    IsEquals: 1,
    IsNotEquals: 2,
    IsMoreThan: 4,
    IsLessThan: 8,
    IsMoreThanOrEquals: 16,
    IsLessThanOrEquals: 32,
    IsContains: 64,
    IsNotContains: 128,
    IsEmpty: 256,
    IsNotEmpty: 512,
    IsStartsWith: 1024,
    IsNotStartsWith: 2048,
    IsEndsWith: 4096,
    IsNotEndsWith: 8192,
    IsIn: 16384,
    Script: 32768,
    FullTextSearch: 65536,
    IsIdIn: 131072
};


//####app/data/criteria/criteriaBuilder.js
var CriteriaBuilder = function () {

};

CriteriaBuilder.prototype.build = function(context, args){

    var criteria = new Criteria();
    var items = [];

    var metadata = args.metadata;

    if (typeof metadata !== 'undefined' && metadata !== null && metadata.length) {
        for (var i = 0, ln = metadata.length; i < ln; i = i + 1) {
            items.push(this.buildCriteriaItem(args.builder, args.view, metadata[i], criteria));
        }
    }

    criteria.setItems(items);

    return criteria;
};

CriteriaBuilder.prototype.buildCriteriaItem = function(builder, parent, metadata, criteria){

    var item = {
        Property: metadata.Property,
        CriteriaType: criteria.decodeCriteriaType(metadata.CriteriaType)
    };

    var value = metadata.Value;
    var binding;
    item.Value = value;

    if (value !== null && typeof value === 'object') {
        binding = builder.build(parent, value);
        if (typeof binding !== 'undefined' && binding !== null) {
            //Если объект пострен билдером - это Binding
            item.Value = function () {
                return binding.getPropertyValue();
            };
            binding.onPropertyValueChanged(function () {
                //Уведомить условие об изменении значение в биндинге
                criteria.valueChanged();
            });
        }
    }

    return item;
};


//####app/data/criteria/criteriaType.js
var CriteriaType = (function () {

    return {
        IsEquals: IsEquals,
        IsNotEquals: IsNotEquals,
        IsMoreThan: IsMoreThan,
        IsLessThan: IsLessThan,
        IsMoreThanOrEquals: IsMoreThanOrEquals,
        IsLessThanOrEquals: IsLessThanOrEquals,
        IsContains: IsContains,
        IsNotContains: IsNotContains,
        IsEmpty: IsEmpty,
        IsNotEmpty: IsNotEmpty,
        IsStartsWith: IsStartsWith,
        IsNotStartsWith: IsNotStartsWith,
        IsEndsWith: IsEndsWith,
        IsNotEndsWith: IsNotEndsWith,
        IsIn: IsIn,
        isNotIn: isNotIn
    };

    function IsEquals(target, property, value) {
        return InfinniUI.ObjectUtils.getPropertyValue(target, property) === value;
    }

    function IsNotEquals(target, property, value) {
        return !IsEquals(target, property, value);
    }

    function IsMoreThan(target, property, value) {
        return InfinniUI.ObjectUtils.getPropertyValue(target, property) > value;
    }

    function IsLessThan(target, property, value) {
        return InfinniUI.ObjectUtils.getPropertyValue(target, property) < value;
    }

    function IsMoreThanOrEquals(target, property, value) {
        return InfinniUI.ObjectUtils.getPropertyValue(target, property) >= value;
    }

    function IsLessThanOrEquals(target, property, value) {
        return InfinniUI.ObjectUtils.getPropertyValue(target, property) <= value;
    }

    function IsContains(target, property, value) {
        var text = String(InfinniUI.ObjectUtils.getPropertyValue(target, property));
        return text.indexOf(value) !== -1;
    }

    function IsNotContains(target, property, value) {
        return !IsContains(target, property, value);
    }

    function IsEmpty(target, property, value) {
        var data = InfinniUI.ObjectUtils.getPropertyValue(target, property);

        return typeof data === 'undefined' || _.isEmpty(data);
    }

    function IsNotEmpty(target, property, value) {
        return !IsEmpty(target, property, value);
    }

    function IsStartsWith(target, property, value) {
        var text = String(InfinniUI.ObjectUtils.getPropertyValue(target, property));
        return text.indexOf(value) === 0;
    }

    function IsNotStartsWith(target, property, value) {
        return !IsStartsWith(target, property, value);
    }

    function IsEndsWith(target, property, value) {
        var
            searchValue = String(value),
            text = String(InfinniUI.ObjectUtils.getPropertyValue(target, property));

        var i = text.lastIndexOf(searchValue);

        return (i === -1) ? false : i + searchValue.length === text.length;
    }

    function IsNotEndsWith(target, property, value) {
        return !IsEndsWith(target, property, value);
    }

    function IsIn(target, property, value) {
        var
            data = InfinniUI.ObjectUtils.getPropertyValue(target, property),
            match = false;

        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i = i + 1) {
                if (data === value[i]) {
                    match = true;
                    break;
                }
            }
        }

        return match;
    }

    function isNotIn(target, property, value) {
        return !IsIn(target, property, value);
    }

})();

//####app/data/criteria/filterCriteriaType.js
function FilterCriteriaType() {

}

FilterCriteriaType.prototype.getFilterCallback = function (filter) {
    var callback = function (item) {
        return true;
    };

    if (Array.isArray(filter)) {
        var chain = filter.map(this.getCriteriaCallback, this);
        callback = function (item) {
            return chain.every(function (cb) {
                return cb(item);
            });
        }
    }

    return callback;
};

FilterCriteriaType.prototype.getCriteriaCallback = function (criteria) {
    var filter = function () {
        return true;
    };

    if (criteria && criteria.criteriaType) {
        var method = this.getCriteriaByCode(criteria.criteriaType);
        if (typeof method === 'function') {
            filter = function (value) {
                return method(value, criteria.property, criteria.value);
            }
        }
    }

    return filter;
};

FilterCriteriaType.prototype.CriteriaTypeCode = {
    IsEquals: 1,
    IsNotEquals: 2,
    IsMoreThan: 4,
    IsLessThan: 8,
    IsMoreThanOrEquals: 16,
    IsLessThanOrEquals: 32,
    IsContains: 64,
    IsNotContains: 128,
    IsEmpty: 256,
    IsNotEmpty: 512,
    IsStartsWith: 1024,
    IsNotStartsWith: 2048,
    IsEndsWith: 4096,
    IsNotEndsWith: 8192,
    IsIn: 16384,
    IsNotIn: 32768
};

FilterCriteriaType.prototype.decodeCriteria = function (name) {
    return this.CriteriaTypeCode[name];
};

FilterCriteriaType.prototype.getCriteriaByName = function (name) {
    return this.criteria[name];
};

FilterCriteriaType.prototype.getCriteriaByCode = function (code) {
    if (typeof this._criteriaByCode === 'undefined') {
        this._criteriaByCode = {};

        var i;
        for (var name in this.CriteriaTypeCode) {
            i = this.CriteriaTypeCode[name];
            this._criteriaByCode[i] = CriteriaType[name];
        }
    }
    return this._criteriaByCode[code];
};





//####app/data/dataBinding/dataBinding.js
var BindingModes = {
    twoWay: 'TwoWay',
    toSource: 'ToSource',
    toElement: 'ToElement'
};


var DataBinding = Backbone.Model.extend({
    defaults: {
        mode: BindingModes.twoWay,
        converter: null,
        source: null,
        sourceProperty: null,
        element: null,
        elementProperty: null
    },


    setMode: function (mode) {
        this.set('mode', mode);
    },

    getMode: function () {
        return this.get('mode');
    },

    setConverter: function (converter) {
        this.set('converter', converter);
    },

    getConverter: function () {
        return this.get('converter');
    },


    bindSource: function (source, property) {
        var logger = window.InfinniUI.global.logger;
        var element = this.getElement();

        if(this.get('source') != null){
            var message = stringUtils.format('DataBinding. bindSource: повторная инициализация. {0} заменен на {1}', [this.get('source').getName(), source.getName()])
            logger.warn(message);
        }

        this.set('source', source);
        this.set('sourceProperty', property);

        var that = this;

        if(element){
            this._initPropertyOnElement();
        }

        source.onPropertyChanged(property, function(context, argument){
            that.onSourcePropertyChangedHandler(context, argument);
        });

        if( this._isWorkingWithSelectedItems(source) ){
            this._initBehaviorWithSelectedItem();
        }
    },

    _isWorkingWithSelectedItems: function(source){
        return typeof source.onSelectedItemChanged == 'function'
    },

    _initBehaviorWithSelectedItem: function(){
        var sourceProperty = this.get('sourceProperty');
        var source = this.get('source');
        var that = this;

        if(this._isRelativeProperty(sourceProperty)){
            source.onSelectedItemChanged(function(context, argument){
                var args = {
                    property: sourceProperty,
                    newValue: source.getProperty(sourceProperty)
                };
                that.onSourcePropertyChangedHandler(context, args);
            });
        }
    },

    _isRelativeProperty: function(property){
        return ! /^\d/.test(property) && property != '';
    },

    getSource: function () {
        return this.get('source');
    },

    getSourceProperty: function () {
        return this.get('sourceProperty');
    },


    bindElement: function (element, property) {
        var that = this;
        var logger = window.InfinniUI.global.logger;

        if(this.get('element') != null){
            var message = stringUtils.format('DataBinding. bindElement: повторная инициализация. {0} заменен на {1}', [this.get('element').getName(), element.getName()])
            logger.warn(message);
        }

        this.set('element', element);
        this.set('elementProperty', property);

        this._initPropertyOnElement();

        element.onPropertyChanged(property, function(context, argument){
            that.onElementPropertyChangedHandler(context, argument);
        });
    },

    _initPropertyOnElement: function(){
        var sourceProperty = this.get('sourceProperty');
        var source = this.get('source');
        var that = this;
        var value;

        if(this.shouldRefreshElement(this.get('mode')) && source){
            if(typeof source.isDataReady == 'function' && !source.isDataReady()){
                return;

            }else{
                value = source.getProperty(sourceProperty);
                this._setValueToElement(value);
            }
        }
    },

    getElement: function () {
        return this.get('element');
    },

    getElementProperty: function () {
        return this.get('elementProperty');
    },

    /**
     * @description Обработчик события изменения значения элемента
     */
    onElementPropertyChangedHandler: function (context, argument) {
        var mode = this.get('mode');
        var element = this.get('element');
        var elementProperty = this.get('elementProperty');

        if(this.shouldRefreshSource(mode) && argument.property == elementProperty){
            this._setValueToSource(argument.newValue);
        }
    },

    _setValueToSource: function(value){
        var element = this.get('element');
        var source = this.get('source');
        var sourceProperty = this.get('sourceProperty');
        var converter = this.get('converter');

        if(converter != null && converter.toSource != null){
            value = converter.toSource(context, {value: value, binding: this, source: element});
        }

        source.setProperty(sourceProperty, value);
    },



    /**
     * @description Обработчик события изменения значения источника
     */
    onSourcePropertyChangedHandler: function (context, argument) {
        var mode = this.get('mode');
        var sourceProperty = this.get('sourceProperty');

        if(this.shouldRefreshElement(mode) && argument.property == sourceProperty){
            this._setValueToElement(argument.newValue);
        }
    },

    _setValueToElement: function(value){
        var source = this.get('source');
        var element = this.get('element');
        var elementProperty = this.get('elementProperty');
        var converter = this.get('converter');
        var context = this._getContext();

        if(converter != null && converter.toElement != null){
            value = converter.toElement(context, {value: value, binding: this, source: source});
        }

        element.setProperty(elementProperty, value);
    },

    _getContext: function(){
        var source = this.getSource(),
            context;
        if(source.getView && source.getView()){
            context = source.getView().getContext();
        }

        return context;
    },

    shouldRefreshSource: function(mode){
        return mode == BindingModes.twoWay || mode == BindingModes.toSource;
    },

    shouldRefreshElement: function(mode){
        return mode == BindingModes.twoWay || mode == BindingModes.toElement;
    }
});
//####app/data/dataBinding/dataBindingBuilder.js
var DataBindingBuilder = function () {};

DataBindingBuilder.prototype.build = function (context, args) {
    var result = new DataBinding();
    var metadata = args.metadata;
    var logger = window.InfinniUI.global.logger;
    var converter = {};
    var that = this;
    var property;
    var scriptName;


    if(metadata.Source == null){
        logger.error('DataBindingBuilder: не указан источник.');
        throw new Error('DataBindingBuilder: not declared source in DataBinding metadata.');
    }


    var sourceDeferred = args.parentView.getDeferredOfMember(metadata.Source);
    sourceDeferred.done(function(source){
        var metadataProperty = typeof metadata.Property === 'undefined' || metadata.Property === null ? "" : metadata.Property;

        if(args.basePathOfProperty){
            property = args.basePathOfProperty.resolveProperty(metadataProperty);
        }else{
            property = metadataProperty;
        }
        result.bindSource(source, property);

        if(metadata.Mode){
            result.setMode(metadata.Mode);
        }

        if(metadata.Converter){
            if(metadata['Converter']['ToSource']){
                scriptName = metadata['Converter']['ToSource'];
                converter.toSource = that.scriptByNameOrBody(scriptName, context);
            }
            if(metadata['Converter']['ToElement']){
                scriptName = metadata['Converter']['ToElement'];
                converter.toElement = that.scriptByNameOrBody(scriptName, context);
            }
            result.setConverter(converter);
        }
    });

    return result;
};

DataBindingBuilder.prototype.findSource = function(view, sourceName){
    var context = view.getContext();
    var dataSource = context.dataSources[sourceName];
    var parameter = context.parameters[sourceName];
    var element = context.controls[sourceName];
    return dataSource || parameter || element;
};

DataBindingBuilder.prototype.isScriptBody = function(value){
    return value && value.substr(0, 1) == '{';
};

DataBindingBuilder.prototype.scriptByNameOrBody = function(nameOrBody, context){
    if(this.isScriptBody(nameOrBody)){
        var scriptExecutor = new ScriptExecutor(context.view);
        return scriptExecutor.buildScriptByBody(nameOrBody);
    }else{
        return context.scripts[nameOrBody];
    }

};

//####app/data/dataProviders/REST/dataProviderREST.js
function DataProviderREST(urlConstructor, successCallback, failCallback) {

    var queueReplaceItem = new DataProviderReplaceItemQueue();

    this.getItems = function (criteriaList, pageNumber, pageSize, sorting, resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructReadDocumentRequest(criteriaList, pageNumber, pageSize, sorting));
    };

    this.createItem = function (resultCallback, idProperty) {
        new RequestExecutor(function(data){
            data[idProperty] = this._generateLocalId();
            data['__Id'] = data[idProperty];
            resultCallback(data);
        }, successCallback, failCallback).makeRequest(urlConstructor.constructCreateDocumentRequest());
    };

    this.createLocalItem = function (idProperty) {
        var result = {};

        result[idProperty] = this._generateLocalId();
        result['__Id'] = result[idProperty];

        return result;
    };

    this._generateLocalId = function(){
        return guid();
    };

    this.createIdFilter = function(id){
        return [{
            "Property": "Id",
            "Value": id,
            "CriteriaType": 1
        }];
    };

    this.saveItem = function (value, resultCallback, warnings, idProperty) {

        var callback = function(data){
            data = adaptAnswerOnSavingItem(data);
            resultCallback(data);
        };

        if(value['__Id']){
            delete value[idProperty];
        }

        var request = (function (success) {
            return function (data) {
                var request = new RequestExecutor(success, successCallback, failCallback);
                return request.makeRequest(urlConstructor.constructUpdateDocumentRequest(data.value, data.warnings));
            }
        })(callback);

        queueReplaceItem.append({
            value: value,
            warnings: warnings
        }, request);

    };

    this.setConfigId = function(configId){
        urlConstructor.setConfigId (configId);
    };

    this.setDocumentId = function(documentId){
        urlConstructor.setDocumentId (documentId);
    };

    this.setCreateAction = function(actionName){
        urlConstructor.setCreateAction (actionName);
    };

    this.setReadAction = function(actionName){
        urlConstructor.setReadAction (actionName);
    };

    this.setUpdateAction = function(actionName){
        urlConstructor.setUpdateAction (actionName);
    };

    this.setDeleteAction = function(actionName){
        urlConstructor.setDeleteAction (actionName);
    };


    function adaptAnswerOnSavingItem(data){
        if("IsValid" in data){
            data.isValid = data.IsValid;
            delete data.IsValid;
        }

        if(data.ValidationMessage && data.ValidationMessage.ValidationErrors){
            var errors = data.ValidationMessage.ValidationErrors;
            var items = [];
            if (typeof errors.Message !== 'undefined') {
                if (!Array.isArray(errors.Message)) {
                    items = [{Message: errors.Message}];
                } else {
                    items = errors.Message;
                }
            }
            data.items = items.map(function (item) {
                return {
                    message: item.Message,
                    property: item.Property
                }
            });

            delete data.ValidationMessage.ValidationErrors;
        }
        return data;
    }

    this.deleteItem = function (item, resultCallback) {
        var instanceId = item["Id"];

        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructDeleteDocumentRequest(instanceId));
    };

    this.getItem = function (itemId, resultCallback, criteriaList) {
        var criteria = {
            "Property": "Id",
            "Value": itemId,
            "CriteriaType": 1
        };

        criteriaList = criteriaList || [];
        criteriaList.push(criteria);
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructReadDocumentRequest(criteriaList, 0, 1));
    };


    this.getCreateAction = proxyTo(urlConstructor, 'getCreateAction');
    this.setCreateAction = proxyTo(urlConstructor, 'setCreateAction');
    this.getReadAction = proxyTo(urlConstructor, 'getReadAction');
    this.setReadAction = proxyTo(urlConstructor, 'setReadeAction');
    this.getUpdateAction = proxyTo(urlConstructor, 'getUpdateAction');
    this.setUpdateAction = proxyTo(urlConstructor, 'setUpdateAction');
    this.getDeleteAction = proxyTo(urlConstructor, 'getDeleteAction');
    this.setDeleteAction = proxyTo(urlConstructor, 'setDeleteAction');

    function proxyTo(obj, methodName) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var method = obj[methodName];
            if (typeof method === 'function') {
                return method.apply(obj, args);
            }
        }
    }
}
//####app/data/dataProviders/REST/metadataDataSourceProvider.js
function MetadataDataSourceProvider(urlConstructor, successCallback, failCallback) {

    this.getRegisteredConfigList = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback)
            .makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getConfigurationMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getDocumentListMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getDocumentMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getDocumentElementListMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getMenuListMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getMenuMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getValidationWarningMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };

    this.getValidationErrorMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(urlConstructor.constructMetadataRequest());
    };
}

//####app/data/dataProviders/REST/metadataProviderREST.js
function MetadataProviderREST(metadataUrlConstructor, successCallback, failCallback) {

    //var makeRequest = function (requestData) {
    //    return $.ajax({
    //        type: 'post',
    //        url: requestData.requestUrl,
    //        data: JSON.stringify(requestData.args),
    //        contentType: "application/json;charset=UTF-8",
    //        success: successCallback,
    //        fail: failCallback
    //    });
    //};

    this.getViewMetadata = function (resultCallback) {
        var data = metadataUrlConstructor.constructViewMetadataRequest();
        new RequestExecutor(resultCallback,successCallback,failCallback, this.cache).makeRequest(data);
    };

    this.getConfigMetadata = function (resultCallback) {

        new RequestExecutor(resultCallback, successCallback, failCallback).makeRequest(metadataUrlConstructor.constructConfigMetadataRequest());
    };


    this.getMenuMetadata = function (resultCallback) {
        new RequestExecutor(resultCallback, successCallback, failCallback, this.cache).makeRequest(metadataUrlConstructor.constructMenuMetadataRequest());
    };

    this.setCache = function (cache) {
        this.cache = cache;
    }
}
//####app/data/dataProviders/REST/queryConstructorMetadata.js
function QueryConstructorMetadata(host,metadata){

    var viewMetadataUrlTemplate = '{0}/systemconfig/StandardApi/metadata/getmanagedmetadata';

    var metadataUrlTemplate = '{0}/RestfulApi/StandardApi/configuration/getconfigmetadata';

    var metadataConfigListUrlTemplate = '{0}/RestfulApi/StandardApi/configuration/getconfigmetadatalist';

    var makeGetViewMetadataRequestParams = function() {
        return {
            "id": null,
            "changesObject": {
                "Configuration": metadata.ConfigId,
                "MetadataObject": metadata.DocumentId,
                "MetadataType": metadata.ViewType,
                "MetadataName": metadata.MetadataName,
                "Parameters": metadata.Parameters
            },
            "replace": false
        }
    };

    var makeGetConfigMetadataRequestParams = function() {
        return {
            "id": null,
            "changesObject":null,
            "replace":false
        }
    };

    var makeGetMenuMetadataRequestParams = function() {
        return {
            "id": null,
            "changesObject":{
                "Configuration":metadata.ConfigId,
                "MetadataType":'Menu'
             },
            "replace":false
        }
    };

    this.constructConfigMetadataRequest = function(){
        return {
            "requestUrl" : stringUtils.format(metadataConfigListUrlTemplate,[host]),
            "args" : makeGetConfigMetadataRequestParams()
        };
    };

    this.constructViewMetadataRequest = function(){
        return {
            "requestUrl" : stringUtils.format(viewMetadataUrlTemplate,[host]),
            "args" : makeGetViewMetadataRequestParams()
        };
    };

    this.constructMenuMetadataRequest = function(){
        return {
            "requestUrl" : stringUtils.format(metadataConfigListUrlTemplate,[host]),
            "args" : makeGetMenuMetadataRequestParams()
        };
    };

}
//####app/data/dataProviders/REST/queryConstructorMetadataDataSource.js
function QueryConstructorMetadataDataSource(host, metadata) {

    metadata = metadata || {};

    var urlTemplate = '{0}/RestfulApi/StandardApi/configuration/getConfigMetadata';
    var configId = metadata.ConfigId;
    var documentId = metadata.DocumentId;
    var metadataType = metadata.MetadataType;
    var metadataName = metadata.MetadataName;

    var getRequestParams = function() {
        var changesObject = 'null';

        if(configId || documentId|| metadataType || metadataName){
            changesObject = {};

            if(configId){
                changesObject.ConfigId = configId;
            }
            if(documentId){
                changesObject.DocumentId = documentId;
            }
            if(metadataType){
                changesObject.MetadataType = metadataType;
            }
            if(metadataName){
                changesObject.MetadataName = metadataName;
            }
        }

        return {
            "id": null,
            "changesObject": changesObject,
            "replace": false
        };
    };


    this.constructMetadataRequest = function(){
         return {
             "requestUrl" : stringUtils.format(urlTemplate,[host]),
             "args" : getRequestParams()
         };
    };


}
//####app/data/dataProviders/REST/queryConstructorStandard.js
/**
 *
 * @param {string} host
 * @param {Object} metadata
 * @param {string} metadata.ConfigId
 * @param {string} metadata.DocumentId
 * @param {string} [metadata.CreateAction = 'CreateDocument']
 * @param {string} [metadata.ReadAction = 'GetDocument']
 * @param {string} [metadata.UpdateAction = 'SetDocument']
 * @param {string} [metadata.DeleteAction = 'DeleteDocument']
 * @constructor
 */
function QueryConstructorStandard(host) {

    this._host = host;

    //this._configId = metadata.ConfigId;
    //this._documentId = metadata.DocumentId;

    this._actions = {
        CreateAction: 'CreateDocument',
        ReadAction: 'GetDocument',
        UpdateAction: 'SetDocument',
        DeleteAction: 'DeleteDocument'
    };

    this.isCustom = false;
    //this.setCreateAction(metadata.CreateAction);
    //this.setReadAction(metadata.ReadAction);
    //this.setUpdateAction(metadata.UpdateAction);
    //this.setDeleteAction(metadata.DeleteAction);
}

_.extend(QueryConstructorStandard.prototype, /** @lends QueryConstructorStandard.prototype */{

    urlTemplate: _.template('<%=host%>/<%=api%>/StandardApi/<%=document%>/<%=action%>'),

    setCreateAction: function (value) {
        if (value && this._actions.CreateAction != value) {
            this._actions.CreateAction = value;
            this.isCustom = true;
        }
    },

    getCreateAction: function () {
        return this._actions.CreateAction;
    },

    setReadAction: function (value) {
        if (value && this._actions.ReadAction != value) {
            this._actions.ReadAction = value;
            this.isCustom = true;
        }
    },

    getReadAction: function () {
        return this._actions.ReadAction;
    },

    setUpdateAction: function (value) {
        if (value && this._actions.UpdateAction != value) {
            this._actions.UpdateAction = value;
            this.isCustom = true;
        }
    },

    getUpdateAction: function () {
        return this._actions.UpdateAction;
    },

    setDeleteAction: function (value) {
        if (value && this._actions.DeleteAction != value) {
            this._actions.DeleteAction = value;
            this.isCustom = true;
        }
    },

    getDeleteAction: function () {
        return this._actions.DeleteAction;
    },

    setConfigId: function(configId){
        this._configId = configId;
    },

    setDocumentId: function(documentId){
        this._documentId = documentId;
    },

    constructCreateDocumentRequest: function () {
        return {
            requestUrl: this._constructUrl('CreateAction'),
            args: this._makeCreateDocumentRequestParams()
        };
    },

    constructReadDocumentRequest: function (filter, pageNumber, pageSize, sorting) {
        return {
            requestUrl: this._constructUrl('ReadAction'),
            args: this._makeReadDocumentRequestParams(filter, pageNumber, pageSize, sorting)
        };
    },

    constructUpdateDocumentRequest: function (document, warnings) {
        return {
            requestUrl: this._constructUrl('UpdateAction'),
            args: this._makeUpdateDocumentRequestParams(document, warnings)
        };
    },

    constructDeleteDocumentRequest: function (instanceId) {
        return {
            requestUrl: this._constructUrl('DeleteAction'),
            args: this._makeDeleteDocumentRequestParams(instanceId)
        };
    },

    _constructUrl: function (action) {
        return this.urlTemplate({
            host: this._host,
            api: this.isCustom ? this._configId : 'RestfulApi', //this._configId,
            document: this.isCustom ? this._documentId : 'configuration', //this._documentId,
            action: this._actions[action]
        });
        //var urlTemplate = '{0}/{1}/StandardApi/{2}/{3}',
        //    document = 'configuration',
        //    api = 'RestfulApi';
        //
        //if (_.contains(['CreateDocument', 'GetDocument', 'SetDocument', 'DeleteDocument', 'GetDocumentCrossConfig'], action) == false) {
        //    document = documentId;
        //    api = configId;
        //}

        //return stringUtils.format(urlTemplate, [host, api, document, action]);
    },

    _makeCreateDocumentRequestParams: function () {
        return {
            id: null,
            changesObject: {
                Configuration: this._configId,
                Metadata: this._documentId
            },
            replace: false
        };
    },

    _makeReadDocumentRequestParams: function (filter, pageNumber, pageSize, sorting) {
        var params;

        params = {
            id: null,
            changesObject: {
                Configuration: this._configId,
                Metadata: this._documentId,
                Filter: filter,
                PageNumber: pageNumber,
                PageSize: pageSize
            },
            replace: false
        };

        if (typeof sorting !== 'undefined' && sorting !== null && sorting.length > 0) {
            params.changesObject.Sorting = sorting;
        }

        return params;
    },

    _makeUpdateDocumentRequestParams: function (document, warnings) {
        var ignoreWarnings = warnings ? warnings : false;
        return {
            id: null,
            changesObject: {
                Configuration: this._configId,
                Metadata: this._documentId,
                Document: document,
                IgnoreWarnings: ignoreWarnings
            },
            replace: false
        };
    },

    _makeDeleteDocumentRequestParams: function (instanceId) {
        return {
            id: null,
            changesObject: {
                Configuration: this._configId,
                Metadata: this._documentId,
                Id: instanceId
            },
            replace: false
        };
    }

});

//####app/data/dataProviders/REST/requestExecutor.js
var RequestExecutorDataStrategy = function (type) {
    if (typeof this.strategies[type] === 'undefined') {
        this.strategy = this.strategies.json
    } else {
        this.strategy = this.strategies[type];
    }
};

RequestExecutorDataStrategy.prototype.request = function (requestData, successCallbackHandler, failCallbackHandler) {
    return this.strategy.apply(this, Array.prototype.slice.call(arguments));
};

RequestExecutorDataStrategy.prototype.strategies = {

    json: function (requestData, onSuccess, onFail) {
        return $.ajax({
            type: requestData.method || 'post',
            url: requestData.requestUrl,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: this.onBeforeRequest(),
            success: this.onSuccessRequest(onSuccess),
            error: this.onErrorRequest(onFail),
            data: JSON.stringify(requestData.args),
            contentType: "application/json;charset=UTF-8"
        });
    },

    raw: function (requestData, onSuccess, onFail) {
        var method = requestData.method || 'post';
        var processData = method.toUpperCase() === 'GET';
        return $.ajax({
            type: method,
            url: requestData.requestUrl,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: this.onBeforeRequest(),
            success: this.onSuccessRequest(onSuccess),
            error: this.onErrorRequest(onFail),
            processData: processData,
            contentType: false,
            data: requestData.args
        });
    }
};

_.extend(RequestExecutorDataStrategy.prototype, ajaxRequestMixin);

function RequestExecutor(resultCallback, successCallback, failCallback, cache) {

    var successCallbackHandler = function (data) {
        if (successCallback) {
            successCallback(data);
        }
        if (resultCallback) {
            resultCallback(data);
        }
    };

    var failCallbackHandler = function (err) {
        if (failCallback) {
            failCallback(err);
        }
        if (resultCallback) {
            resultCallback(err.responseJSON);
        }
    };

    var cacheRequest = function (requestData, request) {
        if (typeof cache === 'undefined' || cache === null) {
            return request(requestData);
        } else {
            var data = cache.get(requestData);
            if (data !== false) {
                console.log('Fetch from cache');
                var defer = $.Deferred();
                successCallbackHandler(data);
                defer.resolve(data);
                return defer.promise();
            }
            return request(requestData).then(function (data) {
                cache.set(requestData, data);
            });
        }
    };

    var request = function (type, requestData) {
        var strategy = new RequestExecutorDataStrategy(type);
        return strategy.request(requestData, successCallbackHandler, failCallbackHandler);
    };

    this.makeRequest = function (requestData) {
        return cacheRequest(requestData, request.bind(undefined, 'json'))
    };

    this.makeRequestRaw = function (requestData) {
        return cacheRequest(requestData, request.bind(undefined, 'raw'))
    };

}
//####app/data/dataProviders/dataProviderRegister.js
function DataProviderRegister() {
    var dataProviders = {};

    this.register = function (metadataType, dataProviderConstructor) {
        dataProviders[metadataType] = dataProviderConstructor;
    };

    this.build = function (metadataType, props) {
        var dataProvider = dataProviders[metadataType];
        if (dataProvider !== undefined && dataProvider !== null) {
            return new dataProviders[metadataType](props);
        }
        return null;
    };
}


window.providerRegister = new DataProviderRegister();

//####app/data/dataProviders/file/dataProviderUpload.js
var DataProviderUpload = function (urlConstructor, successCallback, failCallback) {
    this.urlConstructor = urlConstructor;
    this.successCallback = successCallback;
    this.failCallback = failCallback;
};

DataProviderUpload.prototype.uploadFile = function (fieldName, instanceId, file, resultCallback) {
    var requestData = this.urlConstructor.constructUploadFileRequest(fieldName, instanceId, file);
    new RequestExecutor(resultCallback, this.successCallback, this.failCallback).makeRequestRaw(requestData);
};

DataProviderUpload.prototype.getFileUrl = function (fieldName, instanceId) {
    return this.urlConstructor.getFileUrl(fieldName, instanceId);
};
//####app/data/dataProviders/file/document/documentFileProvider.js
/**
 *
 * @param {DocumentUploadQueryConstructor} urlConstructor
 * @param {Function} [successCallback]
 * @param {Function} [failCallback]
 * @constructor
 */
var DocumentFileProvider = function (urlConstructor, successCallback, failCallback) {
    this.urlConstructor = urlConstructor;
    this.successCallback = successCallback;
    this.failCallback = failCallback;
};

/**
 * @description Загружает файл для указанного поля документа
 * @param {string} fieldName
 * @param {string} instanceId
 * @param {*} file
 * @param {Function} resultCallback
 */
DocumentFileProvider.prototype.uploadFile = function (fieldName, instanceId, file, resultCallback) {
    var deferred = $.Deferred();
    var requestData = this.urlConstructor.constructUploadFileRequest(fieldName, instanceId, file);
    new RequestExecutor(resultCallback, function () {
        deferred.resolve();
        if (this.successCallback) {
            this.successCallback();
        }
    }.bind(this), function (err) {
        deferred.reject(err);
        if (this.failCallback) {
            this.failCallback();
        }
    }.bind(this)).makeRequestRaw(requestData);

    return deferred.promise();
};

/**
 * Возвращает URL ранее загруженного файла
 * @param {string} fieldName
 * @param {string} instanceId
 * @returns {String}
 */
DocumentFileProvider.prototype.getFileUrl = function (fieldName, instanceId, contentId) {
    return this.urlConstructor.getFileUrl(fieldName, instanceId, contentId);
};

//####app/data/dataProviders/file/document/documentFileQueryConstructor.js
/**
 * @param {string} host
 * @param {Object} params
 * @param {string} params.configId
 * @param {string} params.documentId
 * @constructor
 */
var DocumentUploadQueryConstructor = function (host, params) {
    this.host = host;
    this.configId = params.configId;
    this.documentId = params.documentId;
};

DocumentUploadQueryConstructor.prototype.template = {
    download: _.template('<%= host %>/RestfulApi/UrlEncodedData/configuration/downloadbinarycontent/?Form=<%= form %>'),
    upload: _.template('<%= host %>/RestfulApi/Upload/configuration/uploadbinarycontent/?linkedData=<%= data %>')
};

DocumentUploadQueryConstructor.prototype.normalizeFieldName = function (fieldName) {
    return String(fieldName).replace(/^[\d\$]+\./, '');
};

/**
 * @public
 * @param fieldName
 * @param instanceId
 * @param file
 * @returns {{requestUrl: {String}, args: (FormData|*)}}
 */
DocumentUploadQueryConstructor.prototype.constructUploadFileRequest = function (fieldName, instanceId, file) {
    return {
        requestUrl: this.getUploadUrl(fieldName, instanceId),
        args: this.getUploadParams(file)
    };
};

/**
 * @public
 * @description Возвращает ссылку на загруженный ранее файл
 * @param instanceId
 * @param fieldName
 * @returns {String}
 */
DocumentUploadQueryConstructor.prototype.getFileUrl = function (fieldName, instanceId, contentId) {

    if (typeof instanceId === 'undefined' || instanceId === null) {
        return null;
    }

    var data = {
        Configuration: this.configId,
        Metadata: this.documentId,
        DocumentId: instanceId,
        ContentId: contentId,
        FieldName: this.normalizeFieldName(fieldName)
    };
    var template = this.template.download;

    return template({
        host: this.host,
        form: JSON.stringify((data))
    });
};

/**
 * @description Возвращает URL для запроса загрузки файла
 * @protected
 * @param instanceId
 * @param fieldName
 * @returns {String}
 */
DocumentUploadQueryConstructor.prototype.getUploadUrl = function (fieldName, instanceId) {
    var data = {
        "Configuration": this.configId,
        "Metadata": this.documentId,
        "DocumentId": instanceId,
        "FieldName": this.normalizeFieldName(fieldName)
    };

    var template = this.template.upload;

    return template({
        host: this.host,
        data: JSON.stringify(data)
    });
};


/**
 * @protected
 * @param file
 * @returns {FormData}
 */
DocumentUploadQueryConstructor.prototype.getUploadParams = function (file) {
    var data = new FormData();
    data.append('file', file);
    return data;
};


//####app/data/dataProviders/file/queryConstructorUpload.js
/**
 * @class QueryConstructorUpload
 * @param host
 * @param metadata
 * @constructor
 */
var QueryConstructorUpload = function (host, metadata) {
    this.host = host;
    this.metadata = metadata;
};

/**
 * @public
 * @memberOf QueryConstructorUpload.prototype
 * @param fieldName
 * @param instanceId
 * @param file
 * @returns {{requestUrl: {String}, args: (FormData|*)}}
 */
QueryConstructorUpload.prototype.constructUploadFileRequest = function (fieldName, instanceId, file) {
    return {
        requestUrl: this.getUploadUrl(instanceId, fieldName),
        args: this.getUploadParams(file)
    };
};

/**
 * @public
 * @description Возвращает ссылкц на загруженный ранее файл
 * @memberOf QueryConstructorUpload.prototype
 * @param instanceId
 * @param fieldName
 * @returns {String}
 */
QueryConstructorUpload.prototype.getFileUrl = function (fieldName, instanceId) {

    if (typeof instanceId === 'undefined' || instanceId === null) {
        return null;
    }

    var data = {
        "Configuration": this.metadata.ConfigId,
        "Metadata": this.metadata.DocumentId,
        "DocumentId": instanceId,
        "FieldName": fieldName
    };
    var urlTemplate = '{0}/RestfulApi/UrlEncodedData/configuration/downloadbinarycontent/?Form={1}';

    return stringUtils.format(urlTemplate, [this.host, JSON.stringify(data)]);
};

/**
 * @protected
 * @memberOf QueryConstructorUpload.prototype
 * @param instanceId
 * @param fieldName
 * @returns {String}
 */
QueryConstructorUpload.prototype.getUploadUrl = function (instanceId, fieldName) {
    var data = {
        "Configuration": this.metadata.ConfigId,
        "Metadata": this.metadata.DocumentId,
        "DocumentId": instanceId,
        "FieldName": fieldName
    };
    var urlTemplate = '{0}/RestfulApi/Upload/configuration/uploadbinarycontent/?linkedData={1}';

    return stringUtils.format(urlTemplate, [this.host, JSON.stringify(data)]);
};


/**
 * @protected
 * @memberOf QueryConstructorUpload.prototype
 * @param file
 * @returns {FormData}
 */
QueryConstructorUpload.prototype.getUploadParams = function (file) {
    var data = new FormData();
    data.append('file', file);
    return data;
};


//####app/data/dataProviders/objectDataProvider.js
var ObjectDataProvider = function (items, idProperty) {
    this.items = items || [];
    this.idProperty = idProperty || 'Id';
};

_.extend(ObjectDataProvider.prototype, {

    setItems: function (items) {
        this.items = items;
    },

    getItems: function (criteriaList, pageNumber, pageSize, sorting, resultCallback) {
        var filter = new FilterCriteriaType();
        var callback = filter.getFilterCallback(criteriaList);
        resultCallback(this.items.filter(callback));
    },

    createItem: function (resultCallback) {
        var item = this.createLocalItem(this.idProperty);
        resultCallback(item);
    },

    saveItem: function (item, resultCallback) {
        var items = this.items,
            itemIndex = this._getIndexOfItem(item),
            result = {
                isValid: true
            };

        if (itemIndex == -1) {
            items.push(item);
        } else {
            items[itemIndex] = item;
        }

        resultCallback(result);
    },

    deleteItem: function (item, resultCallback) {
        var items = this.items,
            itemIndex = this._getIndexOfItem(item),
            result = {
                isValid: true
            };

        if (itemIndex == -1) {
            result.isValid = false;
            result.message = 'Удаляемый элемент не найден';
        } else {
            items.splice(itemIndex, 1);
        }

        resultCallback(result);
    },

    createIdFilter: function (id) {
        return [{
            "Property": "Id",
            "Value": id,
            "CriteriaType": 1
        }];
    },

    _getIndexOfItem: function (item) {
        return  _.indexOf(this.items, item);
    },

    createLocalItem: function (idProperty) {
        var result = {};

        result[idProperty] = this._generateLocalId();

        return result;
    },

    _generateLocalId: function () {
        return guid();
    }
});

//####app/data/dataProviders/serverAction/queryConstructorServerAction.js
function QueryConstructorServerAction (host, metadata) {
    var defaults = {
        Method: 'post'
    };

    this.host = host;
    this.metadata = _.extend({}, defaults, metadata);
}

QueryConstructorServerAction.prototype.constructUrlRequest = function (params) {
    //var data = {
    //    "Configuration": this.metadata.ConfigId,
    //    "Metadata": this.metadata.DocumentId,
    //    "Params": params
    //};

    var urlTemplate = '{0}/{1}/{2}/{3}';
    //var urlTemplate = 'http://localhost:3000/json';
    //var urlTemplate = 'http://localhost:3000/file';

    //@TODO Переделать шаблон, когда будет ясно что нужно.
    return {
        requestUrl: stringUtils.format(urlTemplate,[
            this.host,
            this.metadata.ConfigId,
            this.metadata.DocumentId,
            this.metadata.Action
        ]),
        method: this.metadata.Method,
        args: params
    };
};
//####app/data/dataProviders/serverAction/serverActionProvider.js
var ServerActionProvider = function (urlConstructor, successCallback, failCallback) {
    this.urlConstructor = urlConstructor;
    this.successCallback = successCallback;
    this.failCallback = failCallback;
};

ServerActionProvider.prototype.request = function (params, resultCallback) {
    var requestData = this.urlConstructor.constructUrlRequest(params);
    new RequestExecutor(resultCallback, this.successCallback, this.failCallback)
        .makeRequestRaw(requestData);

};

ServerActionProvider.prototype.download = function (params, resultCallback) {
    var requestData = this.urlConstructor.constructUrlRequest(params);
    new DownloadExecutor(resultCallback, this.successCallback, this.failCallback)
        .run(requestData);
};


//####app/data/dataSource/_mixins/dataSourceFileProviderMixin.js
/**
 *
 * @mixin dataSourceFileProviderMixin
 */
var dataSourceFileProviderMixin = {

    setFileProvider: function (fileProvider) {
        this.set('fileProvider', fileProvider);
    },

    getFileProvider: function () {
        return this.get('fileProvider');
    },

    setFile: function (file, propertyName) {
        var queue = this.get('queueFiles');
        var item;
        if (!queue) {
            queue = [];
            this.set('queueFiles', queue);
        }
        //Отмечаем элемент данных как измененный при установке файла на загрузку
        this._includeItemToModifiedSet(this.getSelectedItem());

        var items = queue.filter(function(item) {
            return item.name === propertyName;
        });

        if (items.length) {
            var item = items[0];
            item.file = file;
        } else {
            queue.push({
                name: propertyName,
                file: file
            });
        }
    },

    uploadFiles: function (instanceId) {
        var promises = [];
        var fileProvider = this.getFileProvider();
        var ds = this;
        var queue = this.get('queueFiles');
        if (fileProvider  && queue && queue.length) {
            promises = queue.map(function (item, index) {
                return fileProvider.uploadFile(item.name, instanceId, item.file)
                    .then(function () {
                        //@TODO Как обрабатывать ошибки загрузки файлов?
                        var i = queue.indexOf(item);
                        queue.splice(i, 1);
                        ds.trigger('onFileUploaded', ds.getContext, {value: item.file});
                        return true;
                    });
            }, this);
        }

        return $.when.apply($, promises);
    }
};
//####app/data/dataSource/_mixins/dataSourceLookupMixin.js
var dataSourceLookupMixin = {

    lookupIdPropertyValue: function (sourceProperty) {
        var items = this.getItems();
        var value, item;

        if (Array.isArray(items)) {
            var
                name = [sourceProperty.split('.')[0], this.getIdProperty()].join('.');

            value = this.getProperty(name);
        }

        return value;
    },

    lookupPropertyValue: function (name, cb, sourceProperty) {
        var items = this.getItems();
        var value, item;

        if (Array.isArray(items) && typeof cb === 'function') {
            var path = sourceProperty.split('.');

            var propertyValue = this.getProperty(sourceProperty);

            for (var i = 0; i < items.length; i = i + 1) {
                item = items[i];
                if (cb.call(null, propertyValue) === true) {
                    value = InfinniUI.ObjectUtils.getPropertyValue(item, name);
                    break;
                }
            }
        }

        return value;
    }

};
//####app/data/dataSource/_mixins/dataSourceValidationNotifierMixin.js
/**
 *
 * @mixin
 */
var DataSourceValidationNotifierMixin = {
    /**
     * @param dataSource
     */
    initNotifyValidation: function (dataSource) {
        dataSource.onErrorValidator(this.notifyOnValidationError.bind(this));
        dataSource.onWarningValidator(this.notifyOnValidationError.bind(this));
    },

    /**
     * @param context
     * @param args
     */
    notifyOnValidationError: function (context, args) {
        this.notifyOnValidationResult(args.value, 'error');
    },

    /**
     * @param context
     * @param args
     */
    notifyOnValidationWarning: function (context, args) {
        this.notifyOnValidationResult(args.value, 'warning');
    },

    /**
     * @param {Object} result
     * @param {boolean} result.isValid
     * @param {Array.<Object>} result.items
     * @param {string} validationType Тип сообщения "error" или "warning"
     */
    notifyOnValidationResult: function (result, validationType) {
        if (typeof result === 'undefined' || result === null || result.isValid || !Array.isArray(result.items)) {
            return;
        }

        result.items.forEach(function (item) {
            if (typeof item.property === 'undefined' || _.isEmpty(item.property)) {

                var exchange = window.InfinniUI.global.messageBus;
                exchange.send(messageTypes.onNotifyUser, {messageText: item.message, messageType: validationType});
            }
        });
    }
};
//####app/data/dataSource/baseDataSource.js
/**
 * @constructor
 * @augments Backbone.Model
 * @mixes dataSourceFileProviderMixin, dataSourceFindItemMixin
 */
var BaseDataSource = Backbone.Model.extend({
    defaults: {
        name: null,
        idProperty: 'Id',
        pageNumber: 0,
        pageSize: 15,
        sorting: null,
        criteriaList: [],

        view: null,

        isDataReady: false,

        dataProvider: null,

        modifiedItems: {},
        items: null,
        itemsById: {},
        selectedItem: null,

        fillCreatedItem: true,
        isUpdateSuspended: false,

        errorValidator: null,
        warningValidator: null,
        showingWarnings: false,

        isRequestInProcess: false,

        isLazy: true,

        bindingBuilder: function(){} // нужен для создания биндингов в фильтрах

    },

    initialize: function () {
        this.initDataProvider();

        if (!this.get('view')) {
            throw 'BaseDataSource.initialize: При создании объекта не была задана view.'
        }

        this._onPropertyChangesList = [];
    },

    initDataProvider: function () {
        throw 'BaseDataSource.initDataProvider В потомке BaseDataSource не задан провайдер данных.'
    },

    onPageNumberChanged: function (handler) {
        this.on('change:pageNumber', handler);
    },

    onPageNumberSize: function (handler) {
        this.on('change:pageSize', handler);
    },

    onError: function (handler) {
        this.on('error', handler);
    },

    onPropertyChanged: function (property, handler) {
        var list = this._onPropertyChangesList;
        if (list.indexOf(property) === -1) {
            list.push(property);
        }
        if (typeof property == 'function') {
            handler = property;
            this.on('onPropertyChanged', handler);
        } else {
            this.on('onPropertyChanged:' + property, handler);
        }

    },

    onSelectedItemChanged: function (handler) {
        this.on('onSelectedItemChanged', handler);
    },

    onSelectedItemModified: function (handler) {
        this.on('onPropertyChanged', handler);
    },

    onErrorValidator: function (handler) {
        this.on('onErrorValidator', handler);
    },

    onWarningValidator: function (handler) {
        this.on('onWarningValidator', handler);
    },

    onItemSaved: function (handler) {
        this.on('onItemSaved', handler);
    },

    onItemCreated: function (handler) {
        this.on('onItemCreated', handler);
    },

    onItemsUpdated: function (handler) {
        this.on('onItemsUpdated', handler);
    },

    onItemDeleted: function (handler) {
        this.on('onItemDeleted', handler);
    },

    getName: function () {
        return this.get('name');
    },

    setName: function (name) {
        this.set('name', name);
        this.name = name;
    },

    getView: function () {
        return this.get('view');
    },

    _setItems: function (items) {
        var indexOfItemsById;

        this.set('isDataReady', true);
        this.set('items', items);
        this._clearModifiedSet();
        if (items && items.length > 0) {
            indexOfItemsById = this._indexItemsById(items);
            this.set('itemsById', indexOfItemsById);

            if( !this._restoreSelectedItem() ){
                this.setSelectedItem(items[0]);
            }

        } else {
            this.setSelectedItem(null);
        }

        this._notifyAboutItemsUpdatedAsPropertyChanged(items);
        //this.trigger('settingNewItemsComplete');
    },

    _restoreSelectedItem: function(){
        var selectedItem = this.getSelectedItem(),
            selectedItemId = this.idOfItem(selectedItem);

        if( selectedItemId != null ){
            var items = this.get('itemsById');
            var newSelectedItem = items[selectedItemId];

            if( newSelectedItem != null ){
                this.setSelectedItem(newSelectedItem);
                return true;
            }
        }

        return false;
    },

    _addItems: function (newItems) {
        var indexedItemsById = this.get('itemsById'),
            items = this.getItems(),
            newIndexedItemsById;

        this.set('isDataReady', true);
        items = _.union(items, newItems);
        this.set('items', items);
        if (newItems && newItems.length > 0) {
            newIndexedItemsById = this._indexItemsById(newItems);
            _.extend(indexedItemsById, newIndexedItemsById);
            this.set('itemsById', indexedItemsById);
        }

        this._notifyAboutItemsUpdatedAsPropertyChanged(items);
        //this.trigger('settingNewItemsComplete');
    },

    getSelectedItem: function () {
        return this.get('selectedItem');
    },

    setSelectedItem: function (item, success, error) {
        var currentSelectedItem = this.getSelectedItem(),
            items = this.get('itemsById'),
            itemId = this.idOfItem(item);


        if (typeof item == 'undefined') {
            item = null;
        }

        if (item == currentSelectedItem) {
            return;
        }

        if (item !== null) {
            if (!items[itemId]) {
                if (!error) {
                    throw 'BaseDataSource.setSelectedItem() Попытка выбрать элемент в источнике, которого нет среди элементов этого источника.';
                } else {
                    error(this.getContext(), {error: 'BaseDataSource.setSelectedItem() Попытка выбрать элемент в источнике, которого нет среди элементов этого источника.'});
                    return;
                }
            }
        }

        this.set('selectedItem', item);

        this._notifyAboutSelectedItem(item, success);
    },

    _notifyAboutSelectedItem: function (item, successHandler) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.value = item;

        if (successHandler) {
            successHandler(context, argument);
        }
        this.trigger('onSelectedItemChanged', context, argument);
    },

    getIdProperty: function () {
        return this.get('idProperty');
    },

    setIdProperty: function (value) {
        this.set('idProperty', value);
    },

    getFillCreatedItem: function () {
        return this.get('fillCreatedItem');
    },

    setFillCreatedItem: function (fillCreatedItem) {
        this.set('fillCreatedItem', fillCreatedItem);
    },

    suspendUpdate: function () {
        this.set('isUpdateSuspended', true);
    },

    resumeUpdate: function () {
        this.set('isUpdateSuspended', false);
    },

    getPageNumber: function () {
        return this.get('pageNumber');
    },

    setPageNumber: function (value) {
        if (!Number.isInteger(value) || value < 0) {
            throw 'BaseDataSource.setPageNumber() Заданно недопустимое значение: ' + value + '. Должно быть целое, неотрицательное число.';
        }

        if (value != this.get('pageNumber')) {
            this.set('pageNumber', value);
            this.updateItems();
        }
    },

    getPageSize: function () {
        return this.get('pageSize');
    },

    setPageSize: function (value) {
        var pageSize = parseInt(value, 10);
        if (!Number.isInteger(pageSize) || pageSize < 0) {
            throw 'BaseDataSource.setPageSize() Заданно недопустимое значение: ' + pageSize + '. Должно быть целое, неотрицательное число.';
        }

        if (pageSize != this.get('pageSize')) {
            this.set('pageSize', pageSize);
            this.updateItems();
        }
    },

    isModifiedItems: function () {
        return this.isModified();
    },

    isModified: function (item) {
        if (arguments.length == 0) {
            return _.size(this.get('modifiedItems')) > 0;
        }

        if (item === null || item === undefined) {
            return false;
        }
        else {
            var itemId = this.idOfItem(item);
            return itemId in this.get('modifiedItems');
        }
    },

    _includeItemToModifiedSet: function (item) {
        var itemId = this.idOfItem(item);
        this.get('modifiedItems')[itemId] = item;
    },

    _excludeItemFromModifiedSet: function (item) {
        var itemId = this.idOfItem(item);
        delete this.get('modifiedItems')[itemId];
    },

    _clearModifiedSet: function () {
        this.set('modifiedItems', {});
    },

    /**
     * @description Проверяет формат имя свойства атрибута
     * @param propertyName
     * @private
     */
    _checkPropertyName: function (propertyName) {
        var result = true;
        try {
            if (propertyName && propertyName.length > 0) {
                result = propertyName.match(/^[\$#@\d]+/);
            }
            if (!result) {
                throw new Error('Wrong property name "' + propertyName + '"');
            }
        } catch (e) {
            console.debug(e);
        }
    },

    getProperty: function (property) {
        var selectedItem = this.getSelectedItem(),
            bindingByIndexRegEx = /^\d/,
            relativeProperty, source;

        this._checkPropertyName(property);

        if(!this.isDataReady()){
            return undefined;
        }

        if (property == '') {
            return this.getItems();
        } else if (property == '$') {
            return selectedItem;
        } else {
            if (property.substr(0, 2) == '$.') {
                relativeProperty = property.substr(2);
                source = selectedItem;
            } else {
                relativeProperty = property;

                if (bindingByIndexRegEx.test(property)) {
                    source = this.getItems();
                } else {
                    source = selectedItem;
                }
            }


            return InfinniUI.ObjectUtils.getPropertyValue(source, relativeProperty);


        }
    },

    setProperty: function (property, value) {

        this._checkPropertyName(property);

        var selectedItem = this.getSelectedItem(),
            bindingByIndexRegEx = /^\d/,
            relativeProperty, oldValue, source;

        if (property == '') {
            oldValue = this.get('items');
            this._setItems(value);

        } else if (property == '$') {

            if (!selectedItem) {
                return;
            }

            if (value != selectedItem) {
                oldValue = this._copyObject(selectedItem);
                this._replaceAllProperties(selectedItem, value);
            } else {
                return;
            }

        } else {

            if (!selectedItem) {
                return;
            }

            if (property.substr(0, 2) == '$.') {
                relativeProperty = property.substr(2);
                source = selectedItem;
            } else {
                relativeProperty = property;

                if (bindingByIndexRegEx.test(property)) {
                    source = this.getItems();
                } else {
                    source = selectedItem;
                }
            }

            oldValue = InfinniUI.ObjectUtils.getPropertyValue(source, relativeProperty);
            if (value != oldValue) {
                InfinniUI.ObjectUtils.setPropertyValue(source, relativeProperty, value);
            } else {
                return;
            }
        }

        this._includeItemToModifiedSet(selectedItem);
        this._notifyAboutPropertyChanged(property, value, oldValue);
    },

    prepareAndGetProperty: function(property, onReady){
        var that = this;

        if (this.get('isDataReady')){
            onReady( this.getProperty(property) );
        }else{
            if (!this.get('isRequestInProcess')){
                this.updateItems();
            }

            this.once('onItemsUpdated', function(){
                onReady( that.getProperty(property) );
            });
        }
    },

    tryInitData: function(){
        if (!this.get('isDataReady') && !this.get('isRequestInProcess')){
            this.updateItems();
        }
    },

    _notifyAboutPropertyChanged: function (property, newValue, oldValue) {
        var
            ds = this,
            context = this.getContext(),
            argument = this._getArgumentTemplate(),
            selectedItem = ds.getSelectedItem(),
            items = ds.getItems(),
            selectedItemIndex = items.indexOf(selectedItem);

        argument.property = property;
        argument.newValue = newValue;
        argument.oldValue = oldValue;

        this.trigger('onPropertyChanged', context, argument);

        /**
         * Генерация событий на обновление связанных полей ($ и Значения вложенных полей)
         */
        this._onPropertyChangesList
            .filter(function (name) {
                var prop, matched = false;
                if (property === name) {
                    matched = false;
                } else if (property.length && name.length){
                    if (isBindToSelectedItem(name) && isBindToSelectedItem(property)) {
                        if (name.indexOf(property) === 0) {
                            matched = true;
                        }
                    } else  if (isBindToSelectedItem(name)) {
                        prop = resolveProperty(name);
                        if (prop.indexOf(property) === 0) {
                            matched = true;
                        }
                    } else if (isBindToSelectedItem(property)) {
                        prop = resolveProperty(property);
                        if (name.indexOf(prop) === 0) {
                            matched = true;
                        }
                    }
                }

                return matched;
            })
            .map(function (name) {
                var prop,
                    argument = ds._getArgumentTemplate();

                argument.property = name;

                if(isBindToSelectedItem(name)) {
                    var prop1 = resolveProperty(name),
                        prop2 = resolveProperty(property);

                    prop = prop1.substr(prop2.length);
                } else {
                    prop = name.substr(property.length);
                }

                prop = prop.replace(/^\.+/, '');

                argument.newValue = InfinniUI.ObjectUtils.getPropertyValue(newValue, prop);
                argument.oldValue = InfinniUI.ObjectUtils.getPropertyValue(oldValue, prop);

                return argument
            })
            .forEach(function (argument) {
                ds.trigger('onPropertyChanged:' + argument.property, context, argument);
            });

        argument.property = property;
        this.trigger('onPropertyChanged:' + property, context, argument);

        function resolveProperty () {

        }
        function resolveProperty(property) {
            return property.replace(/^\$/, selectedItemIndex);
        }

        function  isBindToSelectedItem(property) {
            return /^\$/.test(property);
        }


    },

    saveItem: function (item, success, error) {
        var dataProvider = this.get('dataProvider'),
            ds = this,
            logger = window.InfinniUI.global.logger,
            validateResult;

        if (!this.isModified(item)) {
            this._notifyAboutItemSaved(item, 'notModified', success);
            return;
        }

        validateResult = this.validateOnErrors(item);
        if (!validateResult.isValid) {
            this._notifyAboutFailValidationBySaving(item, validateResult, error);
            return;
        }

        dataProvider.saveItem(item, function (data) {
            if (!('isValid' in data) || data.isValid === true) {
                //@TODO Что приходит в ответ на сохранение?????
                ds.uploadFiles(data.Id)
                    .then(function () {
                        ds._excludeItemFromModifiedSet(item);
                        ds._notifyAboutItemSaved(item, data, success);
                    }, function (err) {
                        logger.error(err);
                        if (error) {
                            error(err);
                        }
                    });
            } else {
                ds._notifyAboutFailValidationBySaving(item, data, error);
            }
        });
    },

    _notifyAboutItemSaved: function (item, result, successHandler) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.value = item;
        argument.result = result;

        if (successHandler) {
            successHandler(context, argument);
        }
        this.trigger('onItemSaved', context, argument);
    },

    _notifyAboutFailValidationBySaving: function (item, validationResult, errorHandler) {
        this._notifyAboutValidation(validationResult, errorHandler, 'error');
    },

    deleteItem: function (item, success, error) {
        var dataProvider = this.get('dataProvider'),
            that = this,
            itemId = this.idOfItem(item),
            isItemInSet = this.get('itemsById')[itemId] !== undefined;

        if ( item == null || ( itemId !== undefined && !isItemInSet ) ) {
            this._notifyAboutMissingDeletedItem(item, error);
            return;
        }

        dataProvider.deleteItem(item, function (data) {
            if (!('isValid' in data) || data.isValid === true) {
                that._handleDeletedItem(item, success);
            } else {
                that._notifyAboutFailValidationByDeleting(item, data, error);
            }
        });
    },

    _handleDeletedItem: function (item, successHandler) {
        var items = this.get('items'),
            idProperty = this.get('idProperty'),
            itemId = this.idOfItem(item),
            selectedItem = this.getSelectedItem();

        for (var i = 0, ii = items.length, needExit = false; i < ii && !needExit; i++) {
            if (items[i][idProperty] == itemId) {
                items.splice(i, 1);
                needExit = true;
            }
        }
        delete this.get('itemsById')[itemId];
        this._excludeItemFromModifiedSet(item);

        if (selectedItem && selectedItem[idProperty] == itemId) {
            this.setSelectedItem(null);
        }

        this._notifyAboutItemDeleted(item, successHandler);
    },

    _notifyAboutItemDeleted: function (item, successHandler) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.value = item;

        if (successHandler) {
            successHandler(context, argument);
        }
        this.trigger('onItemDeleted', context, argument);
    },

    _notifyAboutMissingDeletedItem: function (item, errorHandler) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.value = item;
        argument.error = {
            message: 'Нельзя удалить элемент, которого нет текущем наборе источника данных'
        };

        if (errorHandler) {
            errorHandler(context, argument);
        }
    },

    _notifyAboutFailValidationByDeleting: function (item, errorData, errorHandler) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.value = item;
        argument.error = errorData;

        if (errorHandler) {
            errorHandler(context, argument);
        }
    },

    isDataReady: function () {
        return this.get('isDataReady');
    },

    getItems: function () {
        var logger = window.InfinniUI.global.logger;

        if (!this.isDataReady()) {
            logger.warn({
                message: 'BaseDataSource: Попытка получить данные источника данных (' + this.get('name') + '), до того как он был проинициализирован данными',
                source: this
            });
        }

        return this.get('items');
    },

    updateItems: function (onSuccess, onError) {
        if (!this.get('isUpdateSuspended')) {
            var filters = this.getFilter(),
                pageNumber = this.get('pageNumber'),
                pageSize = this.get('pageSize'),
                sorting = this.get('sorting'),
                dataProvider = this.get('dataProvider'),
                that = this;

            this.set('isRequestInProcess', true);
            dataProvider.getItems(filters, pageNumber, pageSize, sorting, function (data) {

                that.set('isRequestInProcess', false);
                that._handleUpdatedItemsData(data, onSuccess);

            }, onError);
        }

    },

    _handleUpdatedItemsData: function (itemsData, successHandler) {
        this._setItems(itemsData);
        this._notifyAboutItemsUpdated(itemsData, successHandler);
    },

    _notifyAboutItemsUpdated: function (itemsData, successHandler) {
        var context = this.getContext(),
            argument = {
                value: itemsData
            };

        if (successHandler) {
            successHandler(context, argument);
        }
        this.trigger('onItemsUpdated', context, argument);
    },

    _notifyAboutItemsUpdatedAsPropertyChanged: function (itemsData) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.property = '';
        argument.newValue = itemsData;
        argument.oldValue = null;

        this.trigger('onPropertyChanged', context, argument);
        this.trigger('onPropertyChanged:', context, argument);
    },

    addNextItems: function (success, error) {
        if (!this.get('isUpdateSuspended')) {
            var filters = this.getFilter(),
                pageNumber = this.get('pageNumber'),
                pageSize = this.get('pageSize'),
                sorting = this.get('sorting'),
                dataProvider = this.get('dataProvider'),
                that = this;

            this.set('isRequestInProcess', true);
            this.set('pageNumber', pageNumber + 1);
            dataProvider.getItems(filters, pageNumber + 1, pageSize, sorting, function (data) {

                that.set('isRequestInProcess', false);
                that._handleAddedItems(data, success);

            }, error);
        }
    },

    _handleAddedItems: function (itemsData, successHandler) {
        this._addItems(itemsData);
        this._notifyAboutItemsAdded(itemsData, successHandler);

    },

    _notifyAboutItemsAdded: function (itemsData, successHandler) {
        var context = this.getContext(),
            argument = {
                value: itemsData
            };

        if (successHandler) {
            successHandler(context, argument);
        }
        this.trigger('onItemsAdded', context, argument);
    },

    createItem: function (success, error) {
        var dataProvider = this.get('dataProvider'),
            idProperty = this.get('idProperty'),
            that = this,
            localItem;

        if (this.get('fillCreatedItem')) {
            dataProvider.createItem(
                function (item) {
                    that._handleDataForCreatingItem(item, success);
                },
                idProperty
            );
        } else {
            localItem = dataProvider.createLocalItem(idProperty);
            this._handleDataForCreatingItem(localItem, success);
        }
    },

    _handleDataForCreatingItem: function (itemData, successHandler) {
        var items = this.get('items');

        if(items) {
            items = items.slice();
            items.push(itemData);
        }else{
            items = [itemData];
        }

        this._setItems(items);
        this.setSelectedItem(itemData);
        this._notifyAboutItemCreated(itemData, successHandler);
    },

    _notifyAboutItemCreated: function (createdItem, successHandler) {
        var context = this.getContext(),
            argument = {
                value: createdItem
            };

        if (successHandler) {
            successHandler(context, argument);
        }
        this.trigger('onItemCreated', context, argument);
    },

    getFilter: function () {
        return this.get('criteriaList');
    },

    setFilter: function (filters, onSuccess, onError) {
        var bindingBuilder = this.get('bindingBuilder');
        var boundFilter = new BoundFilter(filters, bindingBuilder);
        var that = this;

        if(boundFilter.isReady()){
            that._setCriteriaList(boundFilter.getCriteriaList(), onSuccess, onError);
        }

        boundFilter.onChange(function(newCriteriaList){
            if(boundFilter.isReady()){
                that._setCriteriaList(newCriteriaList, onSuccess, onError);
            }
        });

        //this._setCriteriaList(filters);
    },

    _setCriteriaList: function(criteriaList, onSuccess, onError){
        this.set('criteriaList', criteriaList);
        this.updateItems(onSuccess, onError);
    },

    setIdFilter: function (itemId) {
        var dataProvider = this.get('dataProvider'),
            idFilter = dataProvider.createIdFilter(itemId);

        this.setFilter(idFilter);
    },

    getErrorValidator: function () {
        return this.get('errorValidator');
    },

    setErrorValidator: function (validatingFunction) {
        this.set('errorValidator', validatingFunction);
    },

    getWarningValidator: function () {
        return this.get('warningValidator');
    },

    setWarningValidator: function (validatingFunction) {
        this.set('warningValidator', validatingFunction);
    },

    validateOnErrors: function (item, callback) {
        return this._validatingActions(item, callback, 'error');
    },

    validateOnWarnings: function (item, callback) {
        return this._validatingActions(item, callback, 'warning');
    },

    _validatingActions: function (item, callback, validationType) {
        var validatingFunction = validationType == 'error' ? this.get('errorValidator') : this.get('warningValidator'),
            result = {
                isValid: true,
                items: []
            },
            isCheckingOneItem = !!item,
            context = this.getContext(),
            items, subResult, itemIndex;

        if (validatingFunction) {
            if (isCheckingOneItem) {

                result = validatingFunction(context, item);

            } else {

                items = this.getItems();
                for (var i = 0, ii = items.length; i < ii; i++) {

                    subResult = validatingFunction(context, items[i]);
                    if (!subResult.isValid) {
                        this._addIndexToPropertiesOfValidationMessage(subResult.items, i);
                        result.isValid = false;
                        result.items = _.union(result.items, subResult.items);
                    }

                }

            }
        }

        this._notifyAboutValidation(result, callback, validationType);

        return result;
    },

    _addIndexToPropertiesOfValidationMessage: function (validationMessages, index) {
        for (var i = 0, ii = validationMessages.length; i < ii; i++) {
            validationMessages[i].property = index + '.' + validationMessages[i].property;
        }
    },

    _notifyAboutValidation: function (validationResult, validationHandler, validationType) {
        var context = this.getContext(),
            argument = {
                value: validationResult
            };

        if (validationHandler) {
            validationHandler(context, argument);
        }

        if (validationType == 'error') {
            this.trigger('onErrorValidator', context, argument);
        } else {
            this.trigger('onWarningValidator', context, argument);
        }
    },

    getContext: function () {
        return this.getView().getContext();
    },

    _indexItemsById: function (items) {
        var idProperty = this.get('idProperty'),
            result = {},
            idValue;
        for (var i = 0, ii = items.length; i < ii; i++) {
            idValue = items[i][idProperty];
            result[idValue] = items[i];
        }

        return result;
    },

    idOfItem: function (item) {
        var idProperty = this.get('idProperty');
        if (!item) {
            return undefined;
        }
        return item[idProperty];
    },

    getCurrentRequestPromise: function(){
        var promise = $.Deferred();
        var logger = window.InfinniUI.global.logger;

        if(this.get('isRequestInProcess')){
            this.once('onPropertyChanged:', function(){
                if(this.isDataReady()){
                    promise.resolve();
                }else{
                    logger.warn({
                        message: 'BaseDataSource: strange, expected other dataReady status',
                        source: this
                    });
                }
            });
        }else{
            promise.resolve();
        }

        return promise;
    },

    setBindingBuilder: function(bindingBuilder){
        this.set('bindingBuilder', bindingBuilder);
    },

    setIsLazy: function(isLazy){
        this.set('isLazy', isLazy);
    },

    isLazy: function(){
        return this.get('isLazy');
    },

    _replaceAllProperties: function (currentObject, newPropertiesSet) {
        for (var property in currentObject) {
            delete(currentObject[property]);
        }

        for (var property in newPropertiesSet) {
            currentObject[property] = newPropertiesSet[property];
        }
    },

    _copyObject: function (currentObject) {
        return JSON.parse(JSON.stringify(currentObject));
    },

    _getArgumentTemplate: function () {
        return {
            source: this
        };
    }

});

_.extend(BaseDataSource.prototype, dataSourceFileProviderMixin, dataSourceLookupMixin);

//####app/data/dataSource/baseDataSourceBuilder.js
/**
 * @constructor
 * @mixes DataSourceValidationNotifierMixin
 */
function BaseDataSourceBuilder() {
}

_.extend(BaseDataSourceBuilder.prototype, /** @lends BaseDataSourceBuilder.prototype */ {
    build: function (context, args) {
        var dataSource = this.createDataSource(args.parentView);
        dataSource.suspendUpdate();

        var bindingBuilder = this.buildBindingBuilder(args);
        dataSource.setBindingBuilder(bindingBuilder);

        this.applyMetadata(args.builder, args.parentView, args.metadata, dataSource);
        this.initFileProvider(dataSource, args.metadata);

        dataSource.resumeUpdate();

        /*if(args.parentView.onLoading){
         args.parentView.onLoading(function () {
         //dataSource.resumeUpdate();
         dataSource.updateItems();
         });
         }else{
         //dataSource.resumeUpdate();
         dataSource.updateItems();
         }*/

        return dataSource;
    },

    applyMetadata: function (builder, parentView, metadata, dataSource) {
        var idProperty = metadata.IdProperty;
        if (idProperty) {
            dataSource.setIdProperty(idProperty);
        }

        dataSource.setName(metadata.Name);
        dataSource.setFillCreatedItem(metadata.FillCreatedItem);
        dataSource.setPageSize(metadata.PageSize || 15);
        dataSource.setPageNumber(metadata.PageNumber || 0);

        if('Query' in metadata){
            dataSource.setFilter(metadata['Query']);
        }

        if('IsLazy' in metadata){
            dataSource.setIsLazy(metadata['IsLazy']);
        }

        this.initValidation(parentView, dataSource, metadata);
        this.initNotifyValidation(dataSource);
        this.initScriptsHandlers(parentView, metadata, dataSource);
    },

    createDataSource: function (parent) {
        throw 'BaseDataSourceBuilder.createDataSource В потомке BaseDataSourceBuilder не переопределен метод createDataSource.';
    },

    /**
     * @protected
     * @description Инициализация обработчиков для валидации данных
     * @param parentView
     * @param dataSource
     * @param metadata
     */
    initValidation: function (parentView, dataSource, metadata) {
        if (metadata.ValidationErrors) {
            dataSource.setErrorValidator(function (context, args) {
                return new ScriptExecutor(parentView).executeScript(metadata.ValidationErrors.Name || metadata.ValidationErrors, args);
            });
        }

        if (metadata.ValidationWarnings) {
            dataSource.setWarningValidator(function (context, args) {
                return new ScriptExecutor(parentView).executeScript(metadata.ValidationWarnings.Name || metadata.ValidationWarnings, args);
            });
        }
    },

    initScriptsHandlers: function (parentView, metadata, dataSource) {
        //Скриптовые обработчики на события
        if (parentView && metadata.OnSelectedItemChanged) {
            dataSource.onSelectedItemChanged(function () {
                new ScriptExecutor(parentView).executeScript(metadata.OnSelectedItemChanged.Name || metadata.OnSelectedItemChanged);
            });
        }

        if (parentView && metadata.OnItemsUpdated) {
            dataSource.onItemsUpdated(function () {
                new ScriptExecutor(parentView).executeScript(metadata.OnItemsUpdated.Name || metadata.OnItemsUpdated);
            });
        }

        if (parentView && metadata.OnSelectedItemModified) {
            dataSource.onSelectedItemModified(function () {
                new ScriptExecutor(parentView).executeScript(metadata.OnSelectedItemModified.Name || metadata.OnSelectedItemModified);
            });
        }

        if (parentView && metadata.OnItemDeleted) {
            dataSource.onItemDeleted(function () {
                new ScriptExecutor(parentView).executeScript(metadata.OnItemDeleted.Name || metadata.OnItemDeleted);
            });
        }
    },

    buildBindingBuilder: function(params){

        return function(bindingMetadata){
            return params.builder.buildBinding(bindingMetadata, {
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            });
        };
    },

    initFileProvider: function (dataSource, metadata) {

    }
});


_.extend(BaseDataSourceBuilder.prototype, DataSourceValidationNotifierMixin);
//####app/data/dataSource/boundFilter.js
var BoundFilter = function(filtersMetadata, bindingBuilder){
    this.filtersMetadata = filtersMetadata;
    this.filters = filtersMetadata.slice(0);
    this.bindingBuilder = bindingBuilder;
    this.bindings = {};
    this.handlers = {
        onChange: $.Callbacks()
    };

    this.init();
};

_.extend(BoundFilter.prototype, {

    init: function(){
        var filter;
        var that = this;

        if($.isArray(this.filtersMetadata)){
            for(var i = 0, ii = this.filtersMetadata.length; i < ii; i++){
                filter = this.filtersMetadata[i];

                if('Value' in filter && $.isPlainObject(filter['Value'])){
                    this.bindToValue(filter['Value'], i);
                }
            }
        }
    },

    isReady: function(){
        var source;

        for(var k in this.bindings){
            source = this.bindings[k].getSource();

            if('isReady' in source){
                if(!source.isReady()){
                    return false;
                }
            }
        }

        return true;
    },

    getCriteriaList: function(){
        return this.filters;
    },

    onChange: function(handler){
        this.handlers.onChange.add(handler);
    },

    bindToValue: function(valueMetadata, indexOfFilter){
        var binding = this.bindingBuilder(valueMetadata);
        var that = this;

        binding.bindElement({

            setProperty: function(propName, propValue){
                that.filters[indexOfFilter]['Value'] = propValue;
                that.handlers.onChange.fire(that.filters);
            },

            onPropertyChanged: function(){}
        });

        this.bindings[indexOfFilter] = binding;
    }

});
//####app/data/dataSource/dataProviderReplaceItemQueue.js
/**
 * @description Организация очереди запросов на создание/изменение документа.
 * Признак одного и того же документа по атрибутам Id или __Id (@see {@link EditDataSourceStrategy.getItems})
 * @param attributes
 * @constructor
 */
var DataProviderReplaceItemQueue = function (attributes) {
    var _attributes = attributes || [];
    var _queue = [];
    var requestIdProperty = '__Id';

    var getQueueItemCriteria = function (data) {
        var criteria = _.pick(data, _attributes);
        var idProperty = _.isEmpty(data[requestIdProperty]) ? 'Id' : requestIdProperty;
        criteria[idProperty] = data[idProperty];
        return criteria;
    };

    var getQueueItem = function (data) {
        return _.findWhere(_queue, getQueueItemCriteria(data));
    };

    var getQueueItems = function (data) {
        return _.where(_queue, getQueueItemCriteria(data));
    };

    var updateInstanceId = function (data, response) {
        var items = getQueueItems(data);
        items.forEach(function (item) {
            item.Id = response.Id;
            item.value.Id = response.Id;
        });
    };

    var next = function (data) {
        var index = _queue.indexOf(data);
        if (index === -1) {
            console.error('DataProviderReplaceItemQueue: Не найден запрос в очереди');
        }
        _queue.splice(index, 1);
        var item = getQueueItem(data);
        run(item);
    };

    var run = function (data) {
        if (typeof data === 'undefined' || data === null) {
            return;
        }
        data.request(data)
            .done(updateInstanceId.bind(undefined, data))
            .always(next.bind(undefined, data));
    };


    this.append = function (data, request) {
        var item = _.defaults(data, _.pick(data.value, ['Id', requestIdProperty]));
        item.request = request;

        var items = getQueueItems(item);
        _queue.push(item);

        if (items.length === 0) {
            //В очереди нет запросов с заданными параметрами
            run(data);
        } else if (items.length > 1) {
            //В очереди несколько элементов, удаляем промежуточные
            for (var i = 1, ln = items.length; i < ln; i = i + 1) {
                var index = _queue.indexOf(items[i]);
                _queue.splice(index, 1);
            }
        }
    };

};
//####app/data/dataSource/documentDataSource.js
var DocumentDataSource = BaseDataSource.extend({
    defaults: _.defaults({

        configId:           null,
        documentId:         null,
        createActionName:   'CreateDocument',
        readActionName:     'GetDocument',
        updateActionName:   'SetDocument',
        deleteActionName:   'DeleteDocument'

    }, BaseDataSource.prototype.defaults),


    initDataProvider: function(){
        var dataProvider = window.providerRegister.build('DocumentDataSource'),
            createActionName = this.getCreateAction(),
            readActionName = this.getReadAction(),
            updateActionName = this.getUpdateAction(),
            deleteActionName = this.getDeleteAction();

        dataProvider.setCreateAction(createActionName);
        dataProvider.setReadAction(readActionName);
        dataProvider.setUpdateAction(updateActionName);
        dataProvider.setDeleteAction(deleteActionName);

        this.set('dataProvider', dataProvider);
    },

    getConfigId: function(){
        return this.get('configId');
    },

    setConfigId: function(configId){
        var dataProvider = this.get('dataProvider');

        dataProvider.setConfigId(configId);
        this.set('configId', configId);
    },

    getDocumentId: function(){
        return this.get('documentId');
    },

    setDocumentId: function(documentId){
        var dataProvider = this.get('dataProvider');

        dataProvider.setDocumentId(documentId);
        this.set('documentId', documentId);
    },

    getCreateAction: function(){
        return this.get('createActionName');
    },

    setCreateAction: function(createActionName){
        var dataProvider = this.get('dataProvider');

        dataProvider.setCreateAction(createActionName);
        this.set('createActionName', createActionName);
    },

    getReadAction: function(){
        return this.get('readActionName');
    },

    setReadAction: function(readActionName){
        var dataProvider = this.get('dataProvider');

        dataProvider.setReadAction(readActionName);
        this.set('readActionName', readActionName);
    },

    getUpdateAction: function(){
        return this.get('updateActionName');
    },

    setUpdateAction: function(updateActionName){
        var dataProvider = this.get('dataProvider');

        dataProvider.setUpdateAction(updateActionName);
        this.set('updateActionName', updateActionName);
    },

    getDeleteAction: function(){
        return this.get('deleteActionName');
    },

    setDeleteAction: function(deleteActionName){
        var dataProvider = this.get('dataProvider');

        dataProvider.setDeleteAction(deleteActionName);
        this.set('deleteActionName', deleteActionName);
    }

});

//####app/data/dataSource/documentDataSourceBuilder.js
function DocumentDataSourceBuilder() {
}

_.inherit(DocumentDataSourceBuilder, BaseDataSourceBuilder);

_.extend(DocumentDataSourceBuilder.prototype, {
    applyMetadata: function(builder, parent, metadata, dataSource){
        BaseDataSourceBuilder.prototype.applyMetadata.call(this, builder, parent, metadata, dataSource);

        dataSource.setConfigId(metadata['ConfigId']);
        dataSource.setDocumentId(metadata['DocumentId']);

        if('CreateAction' in metadata){
            dataSource.setCreateAction(metadata['CreateAction']);
        }
        if('ReadAction' in metadata){
            dataSource.setReadAction(metadata['ReadAction']);
        }
        if('UpdateAction' in metadata){
            dataSource.setUpdateAction(metadata['UpdateAction']);
        }
        if('DeleteAction' in metadata){
            dataSource.setDeleteAction(metadata['DeleteAction']);
        }

    },

    createDataSource: function(parent){
        return new DocumentDataSource({
            view: parent
        });
    },

    initFileProvider: function (dataSource) {
        var fileProvider = window.providerRegister.build('DocumentFileProvider', {
            documentId: dataSource.getDocumentId(),
            configId: dataSource.getConfigId()
        });

        dataSource.setFileProvider(fileProvider);
    }
});

//####app/data/dataSource/metadataDataSource.js
function MetadataDataSource(view, metadata) {

    var  provider = window.providerRegister.build('MetadataInfoDataSource', metadata);

    var baseDataSource = new BaseDataSource(view, metadata.IdProperty, provider);

    baseDataSource.getRegisteredConfigList = function (resultCallback) {
        provider.getRegisteredConfigList(resultCallback);
    };

    baseDataSource.getConfigurationMetadata = function (resultCallback) {
        provider.getConfigurationMetadata(resultCallback);
    };

    baseDataSource.getDocumentListMetadata = function (resultCallback) {
        provider.getDocumentListMetadata(resultCallback);
    };

    baseDataSource.getDocumentMetadata = function (resultCallback) {
        provider.getDocumentMetadata(resultCallback);
    };

    baseDataSource.getDocumentElementListMetadata = function (resultCallback) {
        provider.getDocumentElementListMetadata(resultCallback);
    };

    baseDataSource.getMenuListMetadata = function (resultCallback) {
        provider.getMenuListMetadata(resultCallback);
    };

    baseDataSource.getMenuMetadata = function (resultCallback) {
        provider.getMenuMetadata(resultCallback);
    };

    baseDataSource.getValidationWarningMetadata = function (resultCallback) {
        provider.getValidationWarningMetadata(resultCallback);
    };

    baseDataSource.getValidationErrorMetadata = function (resultCallback) {
        provider.getValidationErrorMetadata(resultCallback);
    };



    return baseDataSource;
}

//####app/data/dataSource/metadataDataSourceBuilder.js
function MetadataDataSourceBuilder() {

    this.build = function (context, args) {

        var idProperty = args.metadata.IdProperty || 'Id';

        var dataSource = new MetadataDataSource(args.view, args.metadata);
        new BaseDataSourceBuilder().build(context,
                                            _.extend(args, {dataSource: dataSource}));

        return dataSource;
    }
}

//####app/data/dataSource/objectDataSource.js
var ObjectDataSource = BaseDataSource.extend({

    initDataProvider: function(){
        var dataProvider = window.providerRegister.build('ObjectDataSource');
        this.set('dataProvider', dataProvider);
    },

    setItems: function(items){
        this.get('dataProvider').setItems(items);
        this.updateItems();
    }

});
//####app/data/dataSource/objectDataSourceBuilder.js
function ObjectDataSourceBuilder() {
}

_.inherit(ObjectDataSourceBuilder, BaseDataSourceBuilder);

_.extend(ObjectDataSourceBuilder.prototype, {
    createDataSource: function(parent){
        return new ObjectDataSource({
            view: parent
        });
    },

    applyMetadata: function(builder, parent, metadata, dataSource){
        BaseDataSourceBuilder.prototype.applyMetadata.call(this, builder, parent, metadata, dataSource);
        if(metadata.Items){
            if($.isArray(metadata.Items)){
                dataSource.setItems(metadata.Items);
            }

            if($.isPlainObject(metadata.Items)){
                var binding = builder.buildBinding(metadata.Items, {
                    parentView: parent
                });

                binding.setMode(BindingModes.toElement);

                binding.bindElement(dataSource, '');
            }

        }

    },

    initFileProvider: function (dataSource) {
        var fileProvider = window.providerRegister.build('DocumentFileProvider', {
            documentId: "documentId",
            configId: "configId"
        });

        dataSource.setFileProvider(fileProvider);
    }
});
//####app/data/parameter/parameter.js
/**
 * @constructor
 * @arguments Backbone.Model
 */
var Parameter = Backbone.Model.extend({
    defaults: {
        name: null,
        view: null,
        value: undefined
    },

    initialize: function () {

    },

    onPropertyChanged: function (property, handler) {
        if (typeof property == 'function') {
            handler = property;
            this.on('onPropertyChanged', handler);
        } else {
            this.on('onPropertyChanged:' + property, handler);
        }

    },

    getName: function(){
        return this.get('name');
    },

    setName: function(newName){
        this.set('name', newName);
        this.name = newName;
    },

    getView: function(){
        return this.get('view');
    },

    getValue: function(){
        return this.getProperty('');
    },

    setValue: function(value){
        this.setProperty('', value);
    },

    getProperty: function(property){
        var value = this.get('value');

        if (property == '') {
            return value;
        } else {
            return this._nullToUndefined (InfinniUI.ObjectUtils.getPropertyValue(value, property));
        }
    },

    setProperty: function(property, value){
        var fullParameterValue = this.getValue(),
            oldValue = this.getProperty(property);

        if(value == oldValue){
            return;
        }

        if (property == '') {
            this.set('value', value);

        } else {
            InfinniUI.ObjectUtils.setPropertyValue(fullParameterValue, property, value);
        }

        this._notifyAboutPropertyChanged(property, value, oldValue);
    },

    _notifyAboutPropertyChanged: function (property, newValue, oldValue) {
        var context = this._getContext(),
            argument = {};

        argument.property = property;
        argument.newValue = newValue;
        argument.oldValue = oldValue;

        this.trigger('onPropertyChanged', context, argument);
        this.trigger('onPropertyChanged:' + property, context, argument);
    },

    _getContext: function(){
        var view = this.getView();
        if(view){
            return view.getContext();
        }else{
            return undefined;
        }
    },

    _nullToUndefined: function(val){
        if(val === null){
            return undefined;
        }else{
            return val;
        }
    }
});


//{
//
//    var _name;
//    var _value;
//    var _bindings = [];
//
//    var notifyOnValueChanged = function () {
//        for(var i = 0; i < onValueChangedHandlers.length; i++){
//            //Уведомление от DataBinding об изменившемся значении
//            onValueChangedHandlers[i](null, _value);
//        }
//    };
//
//
//    /**
//     * @description Уведомить PropertyBinding об изменении значения
//     */
//    var notifyParameterBinding = function () {
//        for (var i = 0, ln = _bindings.length; i < ln; i = i + 1) {
//            _bindings[i].propertyValueChanged(_value);
//        }
//    };
//
//    this.getName = function(){
//        return _name;
//    };
//
//    this.setName = function(value){
//        _name = value;
//    };
//
//    this.getValue = function() {
//        return _value;
//    };
//
//    /**
//     * @description Установка значения из источника данных
//     * @param value
//     */
//    this.setValue = function(value){
//        if (_.isEqual(value, _value)) {
//            return;
//        }
//        _value = value;
//        notifyOnValueChanged();
//        notifyParameterBinding();
//    };
//
//    /**
//     *
//     * @param {ParameterBinding} binding
//     */
//    this.addDataBinding = function (binding) {
//        if (typeof binding === 'undefined' || binding === null) {
//            return;
//        }
//        //Подписка на изменение значения в элементе
//        binding.onSetPropertyValue(onSetPropertyValueHandler);
//        //Установка текущего значения
//        binding.propertyValueChanged(this.getValue());
//        _bindings.push(binding);
//    };
//
//    var onValueChangedHandlers = [];
//
//    this.onValueChanged = function(handler) {
//        onValueChangedHandlers.push(handler);
//    };
//
//    /**
//     * @description Обработчик изменения значения в элементе.
//     * Устанавливает значение в параметре
//     * @param context
//     * @param args
//     */
//    var onSetPropertyValueHandler = function (context, args) {
//        var propertyName = args.property;
//        var propertyValue = args.value;
//
//        if (propertyName !== undefined && propertyName !== null) {
//            InfinniUI.ObjectUtils.setPropertyValue(_value, propertyName, propertyValue);
//        } else {
//            _value = propertyValue;
//        }
//
//        //@TODO Сгенерировать событие для уведомления об изменении значения параметра
//    }
//}

//####app/data/parameter/parameterBuilder.js
function ParameterBuilder() {

    this.build = function (context, args) {
        var metadata = args.metadata;
        var builder = args.builder;
        var parentView = args.parentView;
        var basePathOfProperty = args.basePathOfProperty;



        if('Value' in metadata){
            var parameter = new Parameter({view: parentView});
            parameter.setName(metadata['Name']);

            if(this.isBindingMetadata(metadata['Value'])){
                var dataBinding = builder.buildBinding(metadata['Value'], {parentView: parentView, basePathOfProperty: basePathOfProperty});
                dataBinding.bindElement(parameter, '');
            }else{
                parameter.setValue(metadata['Value']);
            }
        }

        return parameter;
    };

    this.isBindingMetadata = function(metadata){
        return $.isPlainObject(metadata) && 'Source' in metadata;
    };
}
//####app/data/upload/uploadService.js
var UploadApi = function () {

};

UploadApi.prototype.serviceInstance = null;

UploadApi.prototype.uploadBinaryContent = function (configurationId, documentId, docId, file) {

};



//####app/data/validation/booleanValidator/andValidator.js
/**
 * Объект должен удовлетворять всем заданным условиям.
 *
 * @constructor
 */
function AndValidator() {

    this.message = null;
    this.property = null;
    this.operators = [];

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        var isValid = true;
        var compositeResult = null;

        if (this.operators != null) {
            var propertyPath = combinePropertyPath(parentProperty, this.property);
            var propertyValue = InfinniUI.ObjectUtils.getPropertyValue(target, this.property);

            compositeResult = new ValidationResult();

            for (var i = 0; i < this.operators.length; ++i) {
                var operator = this.operators[i];
                isValid = operator.validate(propertyPath, propertyValue, compositeResult) && isValid;
            }
        }

        copyValidationResult(result, isValid, compositeResult);

        return isValid;
    }
}
//####app/data/validation/booleanValidator/andValidatorBuilder.js
/**
 * Построитель объекта AndValidator.
 *
 * @constructor
 */
function AndValidatorBuilder() {
}

AndValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new AndValidator();
        result.message = meta.Message;
        result.property = meta.Property;

        if (meta.Operators !== null && meta.Operators !== undefined) {
            for (var i = 0; i < meta.Operators.length; ++i) {
                var operator = factory.build(meta.Operators[i]);
                result.operators.push(operator);
            }
        }

        return result;
    }
};
//####app/data/validation/booleanValidator/falseValidator.js
/**
 * Объект никогда не проходит проверку.
 *
 * @constructor
 */
function FalseValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return false;
        });
    }
}
//####app/data/validation/booleanValidator/falseValidatorBuilder.js
/**
 * Построитель объекта FalseValidator.
 *
 * @constructor
 */
function FalseValidatorBuilder() {
}

FalseValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new FalseValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/booleanValidator/notValidator.js
/**
 * Объект не должен удовлетворять заданному условию.
 *
 * @constructor
 */
function NotValidator() {

    this.message = null;
    this.property = null;
    this.operator = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return (validator.operator === null) || !validator.operator.validate(null, propertyValue, null);
        });
    }
}
//####app/data/validation/booleanValidator/notValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function NotValidatorBuilder() {
}

NotValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new NotValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.operator = factory.build(meta.Operator);
        return result;
    }
};
//####app/data/validation/booleanValidator/orValidator.js
/**
 * Объект должен удовлетворять хотя бы одному из заданных условий.
 *
 * @constructor
 */
function OrValidator() {

    this.message = null;
    this.property = null;
    this.operators = [];

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        var isValid = false;
        var compositeResult = null;

        if (this.operators != null) {
            var propertyPath = combinePropertyPath(parentProperty, this.property);
            var propertyValue = InfinniUI.ObjectUtils.getPropertyValue(target, this.property);

            compositeResult = new ValidationResult();

            for (var i = 0; i < this.operators.length; ++i) {
                var operator = this.operators[i];

                if (operator.validate(propertyPath, propertyValue, compositeResult)) {
                    isValid = true;
                    break;
                }
            }
        }

        copyValidationResult(result, isValid, compositeResult);

        return isValid;
    }
}
//####app/data/validation/booleanValidator/orValidatorBuilder.js
/**
 * Построитель объекта OrValidator.
 *
 * @constructor
 */
function OrValidatorBuilder() {
}

OrValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new OrValidator();
        result.message = meta.Message;
        result.property = meta.Property;

        if (meta.Operators !== null && meta.Operators !== undefined) {
            for (var i = 0; i < meta.Operators.length; ++i) {
                var operator = factory.build(meta.Operators[i]);
                result.operators.push(operator);
            }
        }

        return result;
    }
};
//####app/data/validation/booleanValidator/predicateValidator.js
/**
 * Объект проходит проверку, если удовлетворяет предикату.
 *
 * @constructor
 */
function PredicateValidator() {

    this.message = null;
    this.property = null;
    this.predicate = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return validator.predicate !== null
                && validator.predicate !== undefined
                && validator.predicate(propertyValue);
        });
    }
}
//####app/data/validation/booleanValidator/trueValidator.js
/**
 * Объект всегда проходит проверку.
 *
 * @constructor
 */
function TrueValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return true;
        });
    }
}
//####app/data/validation/booleanValidator/trueValidatorBuilder.js
/**
 * Построитель объекта TrueValidator.
 *
 * @constructor
 */
function TrueValidatorBuilder() {
}

TrueValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new TrueValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/collectionValidator/allValidator.js
/**
 * Все элементы коллекции удовлетворяют заданному условию.
 *
 * @constructor
 */
function AllValidator() {

    this.operator = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        var isValid = true;
        var compositeResult = null;

        if (target !== null && this.operator !== null) {

            compositeResult = new ValidationResult();

            for (var i = 0; i < target.length; ++i) {
                var element = target[i];
                isValid = this.operator.validate(combinePropertyPath(parentProperty, i), element, compositeResult) && isValid;
            }
        }

        copyValidationResult(result, isValid, compositeResult);

        return isValid;
    }
}
//####app/data/validation/collectionValidator/allValidatorBuilder.js
/**
 *
 * Построитель объекта AllValidator.
 *
 * @constructor
 */
function AllValidatorBuilder() {
}

AllValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new AllValidator();
        result.operator = factory.build(meta.Operator);
        return result;
    }
};
//####app/data/validation/collectionValidator/anyValidator.js
/**
 * Один из элементов коллекции удовлетворяют заданному условию.
 *
 * @constructor
 */
function AnyValidator() {

    this.operator = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        var isValid = false;
        var compositeResult = null;

        if (target !== null && this.operator !== null) {

            compositeResult = new ValidationResult();

            for (var i = 0; i < target.length; ++i) {
                var element = target[i];

                if (this.operator.validate(combinePropertyPath(parentProperty, i), element, compositeResult)) {
                    isValid = true;
                    break;
                }
            }
        }

        copyValidationResult(result, isValid, compositeResult);

        return isValid;
    }
}
//####app/data/validation/collectionValidator/anyValidatorBuilder.js
/**
 *
 * Построитель объекта AnyValidator.
 *
 * @constructor
 */
function AnyValidatorBuilder() {
}

AnyValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new AnyValidator();
        result.operator = factory.build(meta.Operator);
        return result;
    }
};
//####app/data/validation/collectionValidator/isContainsCollectionValidator.js
/**
 * Коллекция содержит заданное значение.
 *
 * @constructor
 */
function IsContainsCollectionValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {

            if (propertyValue !== null && propertyValue !== undefined) {
                for (var i = 0; i < propertyValue.length; ++i) {
                    var element = propertyValue[i];

                    if (element === validator.value) {
                        return true;
                    }
                }
            }

            return false;
        });
    }
}
//####app/data/validation/collectionValidator/isContainsCollectionValidatorBuilder.js
/**
 * Построитель объекта IsContainsCollectionValidator.
 *
 * @constructor
 */
function IsContainsCollectionValidatorBuilder() {
}

IsContainsCollectionValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsContainsCollectionValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/collectionValidator/isNullOrEmptyCollectionValidator.js
/**
 * Коллекция является нулевым указателем или пустой коллекцией.
 *
 * @constructor
 */
function IsNullOrEmptyCollectionValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return (propertyValue === null || propertyValue === undefined || propertyValue.length === 0);
        });
    }
}
//####app/data/validation/collectionValidator/isNullOrEmptyCollectionValidatorBuilder.js
/**
 * Построитель объекта IsNullOrEmptyCollectionValidator.
 *
 * @constructor
 */
function IsNullOrEmptyCollectionValidatorBuilder() {
}

IsNullOrEmptyCollectionValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsNullOrEmptyCollectionValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isAbsoluteUriValidator.js
/**
 * Объект является абсолютным URI.
 *
 * @constructor
 */
function IsAbsoluteUriValidator() {

    this.message = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue !== null
                && propertyValue !== undefined
                && typeof propertyValue === "string"
                && /^((http|https):\/\/)/.test(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isAbsoluteUriValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsAbsoluteUriValidatorBuilder() {
}

IsAbsoluteUriValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsAbsoluteUriValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isContainsValidator.js
/**
 * Объект содержит заданную подстроку.
 *
 * @constructor
 */
function IsContainsValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue !== null
                && propertyValue !== undefined
                && typeof propertyValue === "string"
                && new RegExp(validator.value, "i").test(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isContainsValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsContainsValidatorBuilder() {
}

IsContainsValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsContainsValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/objectValidator/isDefaultValueValidator.js
/**
 * Объект является значением по умолчанию для данного типа.
 *
 * @constructor
 */
function IsDefaultValueValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            if (propertyValue !== null && propertyValue !== undefined) {
                var propertyType = typeof propertyValue;

                switch (propertyType) {
                    case "number":
                    case "integer":
                    case "Double":
                        return (propertyValue === 0);
                    case "boolean":
                        return (propertyValue === false);
                    case "string":
                        return (propertyValue === "");
                    default:
                        return false;
                }
            }

            return true;
        });
    }
}
//####app/data/validation/objectValidator/isDefaultValueValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsDefaultValueValidatorBuilder() {
}

IsDefaultValueValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsDefaultValueValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isEndsWithValidator.js
/**
 * Объект оканчивается заданной подстрокой.
 *
 * @constructor
 */
function IsEndsWithValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue !== null
                && propertyValue !== undefined
                && typeof propertyValue === "string"
                && new RegExp(validator.value + "$", "gi").test(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isEndsWithValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsEndsWithValidatorBuilder() {
}

IsEndsWithValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsEndsWithValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};

//####app/data/validation/objectValidator/isEqualValidator.js
/**
 * Объект равен заданному объекту.
 *
 * @constructor
 */
function IsEqualValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return (propertyValue == validator.value);
        });
    }
}
//####app/data/validation/objectValidator/isEqualValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsEqualValidatorBuilder() {
}

IsEqualValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsEqualValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/objectValidator/isGuidValidator.js
/**
 * Объект является глобально уникальным идентификатором (GUID).
 *
 * @constructor
 */
function IsGuidValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return /^(\{){0,1}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\}){0,1}$/.test(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isGuidValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsGuidValidatorBuilder() {
}

IsGuidValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsGuidValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isInValidator.js
/**
 * Объект содержится в заданной коллекции.
 *
 * @constructor
 */
function IsInValidator() {

    this.message = null;
    this.property = null;
    this.items = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return validator.items !== null
                && validator.items.indexOf(propertyValue) > -1;
        });
    }
}
//####app/data/validation/objectValidator/isInValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsInValidatorBuilder() {
}

IsInValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsInValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.items = meta.Items;
        return result;
    }
};
//####app/data/validation/objectValidator/isLessThanOrEqualValidator.js
/**
 * Объект меньше или равен заданного объекта.
 *
 * @constructor
 */
function IsLessThanOrEqualValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            if (propertyValue !== null && propertyValue !== undefined) {
                return propertyValue <= validator.value;
            }

            return false;
        });
    }
}
//####app/data/validation/objectValidator/isLessThanOrEqualValidatorBuilder.js
/**
 * Построитель объекта NotValidator.
 *
 * @constructor
 */
function IsLessThanOrEqualValidatorBuilder() {
}

IsLessThanOrEqualValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsLessThanOrEqualValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/objectValidator/isLessThanValidator.js
/**
 * Объект меньше заданного объекта.
 *
 * @constructor
 */
function IsLessThanValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            if (propertyValue !== null && propertyValue !== undefined) {
                return propertyValue < validator.value;
            }

            return false;
        });
    }
}
//####app/data/validation/objectValidator/isLessThanValidatorBuilder.js
/**
 * Построитель объекта IsLessThanValidator.
 *
 * @constructor
 */
function IsLessThanValidatorBuilder() {
}

IsLessThanValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsLessThanValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/objectValidator/isMoreThanOrEqualValidator.js
/**
 * Объект больше или равен заданного объекта.
 *
 * @constructor
 */
function IsMoreThanOrEqualValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            if (propertyValue !== null && propertyValue !== undefined) {
                return propertyValue >= validator.value;
            }

            return false;
        });
    }
}
//####app/data/validation/objectValidator/isMoreThanOrEqualValidatorBuilder.js
/**
 * Построитель объекта IsMoreThanOrEqualValidator.
 *
 * @constructor
 */
function IsMoreThanOrEqualValidatorBuilder() {
}

IsMoreThanOrEqualValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsMoreThanOrEqualValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/objectValidator/isMoreThanValidator.js
/**
 * Объект больше заданного объекта.
 *
 * @constructor
 */
function IsMoreThanValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            if (propertyValue !== null && propertyValue !== undefined) {
                return propertyValue > validator.value;
            }

            return false;
        });
    }
}
//####app/data/validation/objectValidator/isMoreThanValidatorBuilder.js
/**
 * Построитель объекта IsMoreThanValidator.
 *
 * @constructor
 */
function IsMoreThanValidatorBuilder() {
}

IsMoreThanValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsMoreThanValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/objectValidator/isNullOrEmptyValidator.js
/**
 * Объект является нулевым указателем или пустой строкой.
 *
 * @constructor
 */
function IsNullOrEmptyValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue === null
                || propertyValue === undefined
                || (typeof propertyValue === "string" && _.isEmpty(propertyValue));
        });
    }
}
//####app/data/validation/objectValidator/isNullOrEmptyValidatorBuilder.js
/**
 * Построитель объекта IsNullOrEmptyValidator.
 *
 * @constructor
 */
function IsNullOrEmptyValidatorBuilder() {
}

IsNullOrEmptyValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsNullOrEmptyValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isNullOrWhiteSpaceValidator.js
/**
 * Объект является нулевым указателем или строкой из пробелов.
 *
 * @constructor
 */
function IsNullOrWhiteSpaceValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue === null
                || propertyValue === undefined
                || (typeof propertyValue === "string" && propertyValue.replace(/\s/g, '').length === 0);
        });
    }
}
//####app/data/validation/objectValidator/isNullOrWhiteSpaceValidatorBuilder.js
/**
 * Построитель объекта IsNullOrWhiteSpaceValidator.
 *
 * @constructor
 */
function IsNullOrWhiteSpaceValidatorBuilder() {
}

IsNullOrWhiteSpaceValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsNullOrWhiteSpaceValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isNullValidator.js
/**
 * Объект является нулевым указателем.
 *
 * @constructor
 */
function IsNullValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue === null || propertyValue === undefined;
        });
    }
}
//####app/data/validation/objectValidator/isNullValidatorBuilder.js
/**
 * Построитель объекта IsNullValidator.
 *
 * @constructor
 */
function IsNullValidatorBuilder() {
}

IsNullValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsNullValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isRegexValidator.js
/**
 * Объект удовлетворяет заданному регулярному выражению.
 *
 * @constructor
 */
function IsRegexValidator() {

    this.message = null;
    this.property = null;
    this.pattern = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue !== null
                && propertyValue !== undefined
                && typeof propertyValue === "string"
                && new RegExp(validator.pattern).test(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isRegexValidatorBuilder.js
/**
 * Построитель объекта IsRegexValidator.
 *
 * @constructor
 */
function IsRegexValidatorBuilder() {
}

IsRegexValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsRegexValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.pattern = meta.Pattern;
        return result;
    }
};
//####app/data/validation/objectValidator/isRelativeUriValidator.js
/**
 * Объект является относительным URI.
 *
 * @constructor
 */
function IsRelativeUriValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return !_.isEmpty(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isRelativeUriValidatorBuilder.js
/**
 * Построитель объекта IsRelativeUriValidator.
 *
 * @constructor
 */
function IsRelativeUriValidatorBuilder() {
}

IsRelativeUriValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsRelativeUriValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/objectValidator/isStartsWithValidator.js
/**
 * Объект начинается заданной подстрокой.
 *
 * @constructor
 */
function IsStartsWithValidator() {

    this.message = null;
    this.property = null;
    this.value = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue !== null
                && propertyValue !== undefined
                && typeof propertyValue === "string"
                && new RegExp("^" + validator.value + ".*", "gi").test(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isStartsWithValidatorBuilder.js
/**
 * Построитель объекта IsStartsWithValidator.
 *
 * @constructor
 */
function IsStartsWithValidatorBuilder() {
}

IsStartsWithValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsStartsWithValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        result.value = meta.Value;
        return result;
    }
};
//####app/data/validation/objectValidator/isUriValidator.js
/**
 * Объект является URI.
 *
 * @constructor
 */
function IsUriValidator() {

    this.message = null;
    this.property = null;

    /**
     * Проверяет объект.
     *
     * @public
     * @param {string} parentProperty Путь к проверяемому объекту.
     * @param {object} target Проверяемый объект.
     * @param {object} result Результат проверки.
     * @returns {boolean} Успешность проверки.
     */
    this.validate = function (parentProperty, target, result) {
        return generalValidate(this, parentProperty, target, result, function (validator, propertyValue) {
            return propertyValue !== null
                && propertyValue !== undefined
                && typeof propertyValue === "string"
                && !_.isEmpty(propertyValue);
        });
    }
}
//####app/data/validation/objectValidator/isUriValidatorBuilder.js
/**
 * Построитель объекта IsUriValidator.
 *
 * @constructor
 */
function IsUriValidatorBuilder() {
}

IsUriValidatorBuilder.prototype = {

    /**
     * Осуществляет построение объекта проверки данных.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @param {*} factory Фабрика для построения объектов проверки данных.
     */
    build: function (meta, factory) {
        var result = new IsUriValidator();
        result.message = meta.Message;
        result.property = meta.Property;
        return result;
    }
};
//####app/data/validation/validationBuilder.js
function ValidationBuilder() {

    this.build = function (context, args) {
        var validatorFactory = createValidationBuilderFactory();
        return validatorFactory.build(args.metadata);
    }
}
//####app/data/validation/validationBuilderFactory.js
/**
 * Фабрика для построения объектов проверки данных.
 *
 * @constructor
 */
function ValidationBuilderFactory() {
}

ValidationBuilderFactory.prototype = {

    builders: [],

    /**
     * Регистрирует построитель.
     *
     * @public
     * @param {string} type Тип объекта проверки данных.
     * @param {*} builder Построитель объекта проверки данных.
     */
    register: function (type, builder) {
        this.builders[type] = builder;
    },

    /**
     * Регистрирует построитель.
     *
     * @public
     * @param {*} meta Метаданные объекта проверки данных.
     * @return {*} Объект проверки данных.
     */
    build: function (meta) {

        // Определяем тип объекта проверки данных
        var type = (Object.keys(meta)[0]);

        if (type === "null" || type === "undefined") {
            return null;
        }

        // Ищем подходящий построитель для типа
        var builder = this.builders[type];

        if (type === "null" || type === "undefined") {
            return null;
        }

        // Осуществляем построение объекта
        return builder.build(meta[type], this);
    }
};


/**
 * Создает фабрику для построения объектов проверки данных.
 *
 * @public
 * @return {*} Фабрика для построения объектов проверки данных.
 */
function createValidationBuilderFactory() {
    var factory = new ValidationBuilderFactory();

    // BooleanValidator
    factory.register("False", new FalseValidatorBuilder());
    factory.register("True", new TrueValidatorBuilder());
    factory.register("Not", new NotValidatorBuilder());
    factory.register("And", new AndValidatorBuilder());
    factory.register("Or", new OrValidatorBuilder());

    // CollectionValidator
    factory.register("Any", new AnyValidatorBuilder());
    factory.register("All", new AllValidatorBuilder());
    factory.register("IsNullOrEmptyCollection", new IsNullOrEmptyCollectionValidatorBuilder());
    factory.register("IsContainsCollection", new IsContainsCollectionValidatorBuilder());

    // ObjectValidator
    factory.register("IsNull", new IsNullValidatorBuilder());
    factory.register("IsEqual", new IsEqualValidatorBuilder());
    factory.register("IsDefaultValue", new IsDefaultValueValidatorBuilder());
    factory.register("IsGuid", new IsGuidValidatorBuilder());
    factory.register("IsUri", new IsUriValidatorBuilder());
    factory.register("IsAbsoluteUri", new IsAbsoluteUriValidatorBuilder());
    factory.register("IsRelativeUri", new IsRelativeUriValidatorBuilder());
    factory.register("IsNullOrEmpty", new IsNullOrEmptyValidatorBuilder());
    factory.register("IsNullOrWhiteSpace", new IsNullOrWhiteSpaceValidatorBuilder());
    factory.register("IsContains", new IsContainsValidatorBuilder());
    factory.register("IsStartsWith", new IsStartsWithValidatorBuilder());
    factory.register("IsEndsWith", new IsEndsWithValidatorBuilder());
    factory.register("IsRegex", new IsRegexValidatorBuilder());
    factory.register("IsLessThan", new IsLessThanValidatorBuilder());
    factory.register("IsMoreThan", new IsMoreThanValidatorBuilder());
    factory.register("IsMoreThanOrEqual", new IsMoreThanOrEqualValidatorBuilder());
    factory.register("IsLessThanOrEqual", new IsLessThanOrEqualValidatorBuilder());
    factory.register("IsIn", new IsInValidatorBuilder());

    return factory;
}
//####app/data/validation/validationMethods.js
/**
 * Результат проверки объекта.
 *
 * @constructor
 */
function ValidationResult() {

    /**
     * @member {boolean} IsValid Признак успешности проверки.
     */
    this.IsValid = true;

    /**
     * @member {boolean} Items Список результатов проверки свойств объекта.
     */
    this.Items = [];
}

/**
 * Реализует базовую логику проверки объекта.
 *
 * @public
 * @param {*} validator Объект, предоставляющий интерфейс проверки.
 * @param {string} propertyPath Путь к родительскому объекту в dot-notation.
 * @param {object} target Родительский объект для проверки.
 * @param {object} result Результат проверки объекта.
 * @param {function} validateFunc Функция проверки.
 * @returns {boolean} Успешность проверки.
 */
function generalValidate(validator, propertyPath, target, result, validateFunc) {
    // Получаем значение свойства родительского объекта
    var property = validator.property;
    var propertyValue = InfinniUI.ObjectUtils.getPropertyValue(target, property);

    // Выполняем проверку свойства с помощью функции
    var isValid = validateFunc(validator, propertyValue);

    // Добавляем результат проверки свойства
    setValidationResult(result, isValid, propertyPath, property, validator.message);

    return isValid;
}

/**
 * Добавляет результат проверки объекта.
 *
 * @public
 * @param {object} result Результат проверки объекта.
 * @param {boolean} isValid Успешность проверки объекта.
 * @param {string} parent Путь к родительскому объекту в dot-notation.
 * @param {string} property Относительный путь к дочернему объекту в dot-notation.
 * @param {string} message Сообщение об ошибке.
 */
function setValidationResult(result, isValid, parent, property, message) {
    if (result !== null && result !== undefined) {
        result.IsValid = isValid;

        if (!isValid) {
            if (result.Items === null || result.Items === undefined) {
                result.Items = [];
            }

            var item = {
                Property: combinePropertyPath(parent, property),
                Message: message
            };

            result.Items.push(item);
        }
    }
}

/**
 * Копирует результат проверки объекта.
 *
 * @public
 * @param {object} result Результат проверки объекта.
 * @param {boolean} isValid Успешность проверки объекта.
 * @param {object} source Копируемый результат проверки объекта.
 */
function copyValidationResult(result, isValid, source) {
    if (result !== null && result !== undefined) {

        result.IsValid = isValid;

        if (!isValid
            && source !== null && source !== undefined
            && source.Items !== null && source.Items !== undefined) {

            if (result.Items === null || result.Items === undefined) {
                result.Items = [];
            }

            for (var i = 0; i < source.Items.length; ++i) {
                result.Items.push(source.Items[i]);
            }
        }
    }
}

/**
 * Возвращает объединенный путь к объекту в dot-notation.
 *
 * @public
 * @param {string} parent Путь к родительскому объекту в dot-notation.
 * @param {string} property Относительный путь к дочернему объекту в dot-notation.
 * @returns {string} Объединенный путь к дочернему объекту в dot-notation.
 */
function combinePropertyPath(parent, property) {
    var result= parent;

    if (parent !== null && parent !== undefined) {
        parent = parent.toString();
    }else{
        parent = '';
    }

    if (property !== null && property !== undefined) {
        property = property.toString();
    }

    var parentIsNull = _.isEmpty(parent);
    var propertyIsNull = _.isEmpty(property);

    if (!parentIsNull && !propertyIsNull) {
        result += "." + property;
    }
    else if (parentIsNull) {
        result = property;
    }

    if (result === null || result === undefined) {
        result = "";
    }

    return result;
}
//####app/dialogResult.js
window.dialogResult = {
    accept: 'Accepted',
    cancel: 'Canceled'
};
//####app/element/_mixins/builder/builderBackgroundMixin.js
var builderBackgroundMixin = {

    initBackground: function (params) {
        params.element.setBackground(params.metadata.Background);
    }

};
//####app/element/_mixins/builder/builderBaseTextElementMixin.js
var builderBaseTextElementMixin = {

    initBaseTextElementEvents: function (params) {
        this.initOnKeyDownEvent(params);
    },

    initOnKeyDownEvent: function (params) {
        var metadata = params.metadata;
        var view = params.view;
        var element = params.element;

        if (metadata.OnKeyDown) {
            element.onKeyDown(function (data) {
                new ScriptExecutor(view).executeScript(metadata.OnKeyDown.Name || metadata.OnKeyDown, data);
            });
        }

    }

};
//####app/element/_mixins/builder/builderErrorTextMixin.js
var builderErrorTextMixin = {

    initErrorText: function (params) {
        var element = params.element;
        element.setErrorText(params.metadata.ErrorText);
    }
};
//####app/element/_mixins/builder/builderForegroundMixin.js
var builderForegroundMixin = {

    initForeground: function (params) {
        params.element.setForeground(params.metadata.Foreground);
    }

};
//####app/element/_mixins/builder/builderHintTextMixin.js
var builderHintTextMixin = {

    initHintText: function (params) {
        var element = params.element;
        element.setHintText(params.metadata.HintText);
    }

};
//####app/element/_mixins/builder/builderLabelTextMixin.js
var builderLabelTextMixin = {

    initLabelText: function (params) {
        params.element.setLabelText(params.metadata.LabelText);
    }
};

//####app/element/_mixins/builder/builderLayoutPanelMixin.js
var builderLayoutPanelMixin = {
    registerLayoutPanel: function (params) {
        var exchange = window.InfinniUI.global.messageBus;
        exchange.send(messageTypes.onCreateLayoutPanel, {source: params.view, value: params.element});
    }
};
//####app/element/_mixins/builder/builderTextStyleMixin.js
var builderTextStyleMixin = {

    initTextStyle: function (params) {
        params.element.setTextStyle(params.metadata.TextStyle);
    }

};
//####app/element/_mixins/element/baseTextElementMixin.js
var baseTextElementMixin = {

};
//####app/element/_mixins/element/elementBackgroundMixin.js
var elementBackgroundMixin = {

    getBackground: function () {
        return this.control.get('background');
    },

    setBackground: function (value) {
        if (InfinniUI.Metadata.ColorStyle.indexOf(value) === -1) {
            return;
        }
        this.control.set('background', value);
    }

};
//####app/element/_mixins/element/elementErrorTextMixin.js
var elementErrorTextMixin = {

    getErrorText: function () {
        return this.control.get('errorText');
    },

    setErrorText: function (value) {
        this.control.set('errorText', value);
    }

};

//####app/element/_mixins/element/elementForegroundMixin.js
var elementForegroundMixin = {

    getForeground: function () {
        return this.control.get('foreground');
    },

    setForeground: function (value) {
        if (InfinniUI.Metadata.ColorStyle.indexOf(value) === -1) {
            return;
        }
        this.control.set('foreground', value);
    }

};

//####app/element/_mixins/element/elementHintTextMixin.js
var elementHintTextMixin = {

    getHintText: function () {
        return this.control.get('hintText');
    },

    setHintText: function (value) {
        var text = typeof value === 'undefined' || value === null ? '' : value;
        this.control.set('hintText', text);
    }

};

//####app/element/_mixins/element/elementHorizontalTextAlignmentMixin.js
var elementHorizontalTextAlignmentMixin = {

    getHorizontalTextAlignment: function () {
        return this.control.get('horizontalTextAlignment');
    },

    setHorizontalTextAlignment: function (value) {
        if (InfinniUI.Metadata.HorizontalTextAlignment.indexOf(value) === -1) {
            return;
        }
        this.control.set('horizontalTextAlignment', value);
    }

};
//####app/element/_mixins/element/elementLabelTextMixin.js
var elementLabelTextMixin = {

    getLabelText: function () {
        return this.control.get('labelText');
    },

    setLabelText: function (value) {
        this.control.set('labelText', value);
    }
};

//####app/element/_mixins/element/elementTextStyleMixin.js
var elementTextStyleMixin = {

    getTextStyle: function () {
        return this.control.get('textStyle');
    },

    setTextStyle: function (value) {
        if (InfinniUI.Metadata.TextStyle.indexOf(value) === -1) {
            return;
        }
        this.control.set('textStyle', value);
    }

};
//####app/element/dataElement/documentViewer/documentViewer.js
function DocumentViewer(parentView) {
    _.superClass(DocumentViewer, this, parentView);
}

_.inherit(DocumentViewer, Element);

_.extend(DocumentViewer.prototype, {

    createControl: function () {
        return new DocumentViewerControl();
    },

    setView: function (view) {
        return this.control.set('view', view);
    },

    setPrintViewId: function(viewId) {
        return this.control.set('viewId', viewId);
    },

    getPrintViewId: function() {
        return this.control.get('viewId');
    },

    setSource: function (dataSource) {
        return this.control.set('dataSource', dataSource);
    },

    getSource: function () {
        return this.control.get('dataSource');
    },

    build: function (){
        this.control.renderDocument();
    }

}, valuePropertyMixin);
//####app/element/dataElement/documentViewer/documentViewerBuilder.js
function DocumentViewerBuilder() {
}

_.inherit(DocumentViewerBuilder, ElementBuilder);

_.extend(DocumentViewerBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        this.initScriptsHandlers(params);

        params.element.setView(params.parentView);
        params.element.setParent(params.parent);

        params.element.setPrintViewId(params.metadata.PrintViewId);
        params.element.setSource(params.metadata.Source.Source);
    },

    createElement: function (params) {
        return new DocumentViewer(params.view);
    },

    initScriptsHandlers: function(params){
        var metadata = params.metadata;

        //Скриптовые обработчики на события
        if (params.view && metadata.OnLoaded){
            params.element.onLoaded(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name || metadata.OnLoaded);
            });
        }
    }
}, builderValuePropertyMixin);

//####app/element/dataElement/filterPanel/filterPanel.js
function FilterPanel(parentView) {
    _.superClass(FilterPanel, this, parentView);
}

_.inherit(FilterPanel, Element);

_.extend(FilterPanel.prototype, {

    createControl: function () {
        return new FilterPanelControl();
    },

    setView: function (view) {
        return this.control.set('view', view);
    },

    getView: function () {
        return this.control.get('view');
    },

    setDataSource: function (dataSource) {
        return this.control.set('dataSource', dataSource);
    },

    getDataSource: function () {
        return this.control.get('dataSource');
    },

    setFilters: function(filters){
        return this.control.set('filters', filters);
    },

    getFilters: function(){
        return this.control.get('filters');
    },

    setQuery: function(query){
        return this.control.set('query', query);
    },

    getQuery: function(){
        if(!this.control.get('value')) {
            return this.control.get('query');
        }else{
            return this.control.get('value');
        }
    },

//    setProperty: function(property){
//        return this.control.set('property', property)
//    },

    getOrientation: function () {
        return this.control.get('orientation');
    },

    setOrientation: function (orientation) {
        if (typeof orientation == 'string') {
            this.control.set('orientation', orientation);
        }
    },

    getHeight: function () {
        return 44;
    },

    /**
     * @see {@link http://jira.infinnity.lan/browse/UI-772}
     */
    filter: function () {
        this.control.filter();
    }

}, valuePropertyMixin);
//####app/element/dataElement/filterPanel/filterPanelBuilder.js
function FilterPanelBuilder() {
}

_.inherit(FilterPanelBuilder, ElementBuilder);

_.extend(FilterPanelBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        this.initValueProperty(params);
        this.initScriptsHandlers(params);

        params.element.setDataSource(params.metadata.DataSource);
        params.element.setView(params.view);
        //params.metadata.Query = [
        //        {
        //            CriteriaType: 1,
        //            Property: "MedicalWorker.Id",
        //            Value: "9f7df52a-229a-4b6c-978f-83e19573d510"
        //        }
        //];
        params.element.setQuery(params.metadata.Query);

        var array = [];
        _.each(params.metadata.GeneralProperties, function (metadataProperty) {
            var obj = {};
            var label = params.builder.build(params.view, {Label: {}});
            label.setValue(metadataProperty.Text);

            obj.text = label;
            obj.property = metadataProperty.Property;
            obj.operators = [];

            _.each(metadataProperty.Operators, function (metadataOperator) {
                var operator = {};
                operator.operator = metadataOperator.Operator;
                operator.el = params.builder.build(params.view, metadataOperator.Editor);
                obj.operators.push(operator);
            });

            array.push(obj);
        });
        params.element.setFilters(array);

        this.initDataSource(params);
    },

    createElement: function (params) {
        return new FilterPanel(params.view);
    },

    initScriptsHandlers: function(params){
        var metadata = params.metadata;

        //Скриптовые обработчики на события
        if (params.view && metadata.OnLoaded){
            params.element.onLoaded(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name);
            });
        }

        if (params.view && metadata.OnValueChanged){
            params.element.onValueChanged(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnValueChanged.Name);
            });
        }
    },

    initDataSource: function (params) {
        var self = params;

        params.element.onValueChanged(function (value) {
            var args = {
                source: self.element,
                dataSource: self.metadata.DataSource,
                value: value
            };

            var view = self.element.getView();
            var exchange = view.getExchange();
            exchange.send(messageTypes.onSetPropertyFilters, args);
        });
    }

}, builderValuePropertyMixin);

//####app/element/dataElement/linkLabel/linkLabel.js
function LinkLabel() {
    _.superClass(LinkLabel, this);
}

_.inherit(LinkLabel, Element);

_.extend(LinkLabel.prototype, {

        createControl: function () {
            return new LinkLabelControl();
        },

        getReference: function () {
            return this.control.get('reference');
        },

        setReference: function (value) {
            this.control.set('reference', value);
        },

        onClick: function (handler) {
            this.control.controlView.addEventHandler('OnClick', handler);
        },

        getTextTrimming: function () {
            return this.control.get('textTrimming');
        },

        setTextTrimming: function (value) {
            this.control.set('textTrimming', value);
        },

        getTextWrapping: function () {
            return this.control.get('textWrapping');
        },

        setTextWrapping: function (value) {
            this.control.set('textWrapping', value);
        },

        getLineCount: function () {
            return this.control.get('lineCount');
        },

        setLineCount: function (value) {
            this.control.set('lineCount', value);
        },
        getAction: function () {
            return this.control.get('action');
        },

        setAction: function (action) {
            this.control.set('action', action);

            this.onClick(function () {
                var action = this.getAction();
                if (action) {
                    action.execute();
                }
            }.bind(this));
        }

    },
    valuePropertyMixin,
    formatPropertyMixin,
    elementHorizontalTextAlignmentMixin,
    elementBackgroundMixin,
    elementForegroundMixin,
    elementTextStyleMixin
);
//####app/element/dataElement/linkLabel/linkLabelBuilder.js
function LinkLabelBuilder() {
}

_.inherit(LinkLabelBuilder, ElementBuilder);

_.extend(LinkLabelBuilder.prototype,
    {
        defaults: {
            Foreground: "Black",
            Background: "Transparent",
            HorizontalTextAlignment: "Left",
            TextStyle: "Body1",
            TextTrimming: true,
            TextWrapping: true
        },

        applyDefaults: function (metadata) {
            var defaults = this.defaults;

            for (var i in defaults) {
                if (typeof metadata[i] === 'undefined') {
                    metadata[i] = defaults[i];
                }
            }
        },

        applyMetadata: function (params) {
            this.applyDefaults(params.metadata);
            var metadata = params.metadata;
            var element = params.element;

            ElementBuilder.prototype.applyMetadata.call(this, params);

            element.setTextWrapping(metadata.TextWrapping);
            element.setTextTrimming(metadata.TextTrimming);
            element.setLineCount(metadata.LineCount);

            this.initHorizontalTextAlignmentProperty(params);
            this.initForeground(params);
            this.initBackground(params);
            this.initTextStyle(params);
            this.initFormatProperty(params);
            this.initValueProperty(params);
            this.initBindingToProperty(params, metadata.Reference, 'Reference');
            this.initScriptsHandlers(params);

            if(params.metadata.Action) {
                params.element.setAction(params.builder.build(params.view, params.metadata.Action, params.collectionProperty));
            }
        },

        initScriptsHandlers: function (params) {
            var metadata = params.metadata;

            //Скриптовые обработчики на события
            if (params.view && metadata.OnLoaded) {
                params.element.onLoaded(function () {
                    new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name);
                });
            }

            if (params.view && metadata.OnValueChanged) {
                params.element.onValueChanged(function () {
                    new ScriptExecutor(params.view).executeScript(metadata.OnValueChanged.Name);
                });
            }

            if (params.view && metadata.OnClick) {
                params.element.onClick(function () {
                    var script = new ScriptExecutor(params.view);
                    return script.executeScript(metadata.OnClick.Name);
                });
            }
        },

        createElement: function (params) {
            var linkLabel = new LinkLabel(params.view);
            linkLabel.getHeight = function () {
                return 34;
            };
            return linkLabel;
        }

    },
    builderValuePropertyMixin,
    builderFormatPropertyMixin,
    //builderHorizontalTextAlignmentPropertyMixin,
    builderBackgroundMixin,
    builderForegroundMixin,
    builderTextStyleMixin
);
//####app/element/dataElement/pdfViewer/pdfViewer.js
function PdfViewer(parentView) {
    _.superClass(PdfViewer, this, parentView);
}

_.inherit(PdfViewer, Element);

_.extend(PdfViewer.prototype, {

    createControl: function () {
        return new PdfViewerControl();
    },

    setUrl: function (url) {
        return this.control.set('url', url);
    }

}, valuePropertyMixin);
//####app/element/dataElement/pdfViewer/pdfViewerBuilder.js
function PdfViewerBuilder() {
}

_.inherit(PdfViewerBuilder, ElementBuilder);

_.extend(PdfViewerBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        this.initScriptsHandlers(params);

        params.element.setUrl(params.metadata.Value);
    },

    createElement: function (params) {

    return new PdfViewer(params.parentView);
},
    initScriptsHandlers: function(params){
        var metadata = params.metadata;

        //Скриптовые обработчики на события
        if (params.view && metadata.OnLoaded){
            params.element.onLoaded(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name);
            });
        }
    }
}, builderValuePropertyMixin);

//####app/element/dataElement/searchPanel/searchPanel.js
function SearchPanel(parentView) {
    _.superClass(SearchPanel, this, parentView);
}

_.inherit(SearchPanel, Element);

_.extend(SearchPanel.prototype, {

    createControl: function () {
        return new SearchPanelControl();
    },

    setDataSource: function (dataSource) {
        return this.control.set('dataSource', dataSource);
    },

    getDataSource: function () {
        return this.control.get('dataSource');
    },

    setView: function (view) {
        return this.control.set('view', view);
    },

    getView: function () {
        return this.control.get('view');
    },

    getHeight: function () {
        return 44;
    }

}, valuePropertyMixin);
//####app/element/dataElement/searchPanel/searchPanelBuilder.js
function SearchPanelBuilder() {
}

_.inherit(SearchPanelBuilder, ElementBuilder);

_.extend(SearchPanelBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        this.initScriptsHandlers(params);
        this.initValueProperty(params);
        this.initDataSource(params);

        params.element.setDataSource(params.metadata.DataSource);
        params.element.setView(params.view);
    },

    createElement: function (params) {
        return new SearchPanel(params.view);
    },

    initScriptsHandlers: function(params){
        var metadata = params.metadata;

        //Скриптовые обработчики на события
        if (params.view && metadata.OnLoaded){
            params.element.onLoaded(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name);
            });
        }

        if (params.view && metadata.OnValueChanged){
            params.element.onValueChanged(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnValueChanged.Name);
            });
        }
    },

    initDataSource: function (params) {
        var self = params;

        params.element.onValueChanged(function (value) {
            var args = {
                source: self.element,
                dataSource: self.metadata.DataSource,
                value: value
            };
            var view = self.element.getView();
            var exchange = view.getExchange();
            exchange.send(messageTypes.onSetTextFilter, args);
        });
    }

}, builderValuePropertyMixin);

//####app/element/dataElement/treeView/treeView.js
function TreeView() {
    _.superClass(TreeView, this);
}

_.inherit(TreeView, Element);

_.extend(TreeView.prototype, {

        createControl: function () {
            return new TreeViewControl();
        },

        /**
         * Возвращает значение, определяющее, разрешен ли выбор нескольких элементов.
         * @returns {Boolean}
         */
        getMultiSelect: function () {
            return this.control.get('multiSelect');
        },

        /**
         * Устанавливает значение, определяющее, разрешен ли выбор нескольких элементов.
         * @param {Boolean} value
         */
        setMultiSelect: function (value) {
            this.control.set('multiSelect', value);
        },

        /**
         * Возвращает значение, определяющее, запрещено ли редактирование значения.
         * @return {Boolean}
         */
        getReadOnly: function () {
            return this.control.get('readOnly');
        },

        /**
         * Устанавливает значение, определяющее, запрещено ли редактирование значения.
         * @param {Boolean} value
         */
        setReadOnly: function (value) {
            this.control.set('readOnly', value);
        },

        getValueProperty: function () {
            return this.control.get('valueProperty');
        },

        setValueProperty: function (value) {
            this.control.set('valueProperty', value);
        },

        getKeyProperty: function () {
            return this.control.get('keyProperty');
        },

        setKeyProperty: function (value) {
            this.control.set('keyProperty', value);
        },

        getParentProperty: function () {
            return this.control.get('parentProperty');
        },

        setParentProperty: function (value) {
            this.control.set('parentProperty', value);
        },

        getDisplayProperty: function () {
            return this.control.get('displayProperty');
        },

        setDisplayProperty: function (value) {
            this.control.set('displayProperty', value);
        },

        getFormat: function () {
            return this.control.get('itemFormat');
        },

        setFormat: function (itemFormat) {
            this.control.set('itemFormat', itemFormat);
        },

        getItemTemplate: function () {

        },

        setItemTemplate: function () {

        },

        addItem: function () {

        },

        removeItem: function () {

        },

        /**
         * Возвращает список элементов.
         * @returns {Object[]}
         */
        getItems: function () {
            return this.control.get('items');
        },

        /**
         * Устанавливает список элементов.
         * @param {Object[]}items
         */
        setItems: function (items) {
            this.control.set('items', items);
            this.control.controlView.trigger('afterchange:items');
        },

        getDataNavigation: function () {

        },

        setDataNavigation: function () {

        },

        getSelectedItem: function () {
            return this.control.controlView.getSelectedItem();
        }

    },
    valuePropertyMixin
);

//####app/element/dataElement/treeView/treeViewBuilder.js
function TreeViewBuilder () {

}

_.inherit(TreeViewBuilder, ElementBuilder);

_.extend(TreeViewBuilder.prototype, {

    applyMetadata: function (params) {

        ElementBuilder.prototype.applyMetadata.call(this, params);

        this.initFormatProperty(params);
        this.initValueProperty(params);
        this.initScriptsHandlers(params);

        var element = params.element,
            builder = params.builder,
            metadata = params.metadata,
            view = params.view,
            that = this;

        element.setMultiSelect(metadata.MultiSelect);
        element.setReadOnly(metadata.ReadOnly);
        element.setDisplayProperty(metadata.DisplayProperty);
        element.setValueProperty(metadata.ValueProperty);
        element.setKeyProperty(metadata.KeyProperty);
        element.setParentProperty(metadata.ParentProperty);
        this.initFormatProperty(params);

        if (metadata.Items) {
            // Привязка списка значений элемента к источнику данных
            var binding = builder.build(view, metadata.Items);

            binding.onPropertyValueChanged(function (dataSourceName, value) {
                element.setItems(value.value);
            });

            element.onValueChanged(function (context, args) {
                view.getExchange().send(messageTypes.onSetSelectedItem, {
                    dataSource: binding.getDataSource(),
                    property: '',
                    value: element.getSelectedItem()
                });
            });

            var items = binding.getPropertyValue();
            if (items) {
                element.setItems(items);
            }
        }
    },

    initScriptsHandlers: function(params){
        var metadata = params.metadata;

        //Скриптовые обработчики на события
        if (params.view && metadata.OnLoaded){
            params.element.onLoaded(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name);
            });
        }

        if (params.view && metadata.OnValueChanged){
            params.element.onValueChanged(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnValueChanged.Name);
            });
        }
    },

    createElement: function (params) {
        return new TreeView(params.view);
    }

}, builderValuePropertyMixin, builderFormatPropertyMixin, builderFormatPropertyMixin);

//####app/element/layoutPanel/abstractGridPanel/abstractGridPanel.js
function AbstractGridPanel(parentView) {
    _.superClass(AbstractGridPanel, this, parentView);
}

_.inherit(AbstractGridPanel, Element);

_.extend(AbstractGridPanel.prototype, {

    addRow: function(){
        var row = new GridRow();
        this.control.addRow(row);
        return row;
    },

    getRows: function(){
        return this.control.getRows();
    }

});

//####app/element/layoutPanel/abstractGridPanel/abstractGridPanelBuilder.js
function AbstractGridPanelBuilder() {
}

_.inherit(AbstractGridPanelBuilder, ElementBuilder);

_.extend(AbstractGridPanelBuilder.prototype, {

    applyMetadata: function(params){
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var metadata = params.metadata,
            gridPanel = params.element,
            row, cell, item;

        _.each(metadata.Rows, function (metadataItem, rowIndex) {
            row = gridPanel.addRow();

            if (metadataItem.Cells) {
                _.each(metadataItem.Cells, function (cellMetadata, cellIndex) {
                    cell = row.addCell(cellMetadata.ColumnSpan);

                    if (cellMetadata.Items) {
                        _.each(cellMetadata.Items, function (itemMetadata) {
                            item = params.builder.build(params.view, itemMetadata, params.collectionProperty);
                            cell.addItem(item);
                        }, this);
                    }
                }, this);
            }
        }, this);
    }

});
//####app/element/layoutPanel/abstractGridPanel/gridCell.js
var GridCell = function(colSpan){
    this.items = [];
    this.colSpan = colSpan || 1;
    this.handlers = {
        onItemsChange: $.Callbacks()
    };
};

_.extend(GridCell.prototype, {

    addItem: function(item){
        this.items.push(item);
        this.handlers.onItemsChange.fire();
    },

    getItems: function(){
        return this.items;
    },

    onItemsChange: function(handler){
        this.handlers.onItemsChange.add(handler);
    }

});
//####app/element/layoutPanel/abstractGridPanel/gridRow.js
var GridRow = function(){
    this.cells = [];
    this.handlers = {
        onCellsChange: $.Callbacks(),
        onItemsChange: $.Callbacks()
    };
};

_.extend(GridRow.prototype, {

    addCell: function(colSpan){
        var cell = new GridCell(colSpan);
        this.cells.push(cell);
        this.handlers.onCellsChange.fire();
        this.initCellHandlers(cell);
        return cell;
    },

    getCells: function(){
        return this.cells;
    },

    onCellsChange: function(handler){
        this.handlers.onCellsChange.add(handler);
    },

    onItemsChange: function(handler){
        this.handlers.onItemsChange.add(handler);
    },

    initCellHandlers: function(cell){
        var self = this;
        cell.onItemsChange(function(){
            self.handlers.onItemsChange.fire();
        });
    }

});
//####app/element/layoutPanel/extensionPanel/extensionPanel.js
function ExtensionPanel(parentView) {
    _.superClass(ExtensionPanel, this, parentView);
}

_.inherit(ExtensionPanel, Container);

_.extend(ExtensionPanel.prototype, {
    createControl: function () {
        var control = new ExtensionPanelControl();
        return control;
    },

    setExtensionName: function (extensionName) {
        return this.control.set('extensionName', extensionName);
    },

    setParameters: function (parameters) {
        return this.control.set('parameters', parameters);
    },

    setContext: function (context) {
        this.control.set('context', context);
    }
});
//####app/element/layoutPanel/extensionPanel/extensionPanelBuilder.js
function ExtensionPanelBuilder() {
}

_.inherit(ExtensionPanelBuilder, ContainerBuilder);

_.extend(ExtensionPanelBuilder.prototype, {

    applyMetadata: function (params) {
        var metadata = params.metadata;
        var element = params.element;
        var parentView = params.parentView;
        var builder = params.builder;

        ContainerBuilder.prototype.applyMetadata.call(this, params);

        element.setExtensionName(metadata['ExtensionName']);

        var parameters = {};
        _.each(metadata.Parameters, function (parameterMetadata) {
            var param = builder.buildType('Parameter', parameterMetadata, {parentView: parentView});
            parameters[param.getName()] = param;
        });

        element.setParameters(parameters);
        element.setContext(parentView.getContext());
    },

    createElement: function (params) {
        var element = new ExtensionPanel(params.parent);

        return element;
    }

});

//####app/element/layoutPanel/layoutPanelRegistry.js
var LayoutPanelRegistry = function () {

    var items = [];

    var exchange = window.InfinniUI.global.messageBus;

    /**
     *
     * @param message.source {View}
     * @param message.value {LayoutPanel}
     */
    var addLayoutPanel = function (message) {
        console.log('addLayoutPanel', message);
        var matched = false;
        for (var i = 0, ln = items.length; i < ln; i = i + 1) {
            if (items[i].layoutPanel === message.value) {
                matched = true;
                break;
            }
        }
        if (!matched) {
            items.push({view: message.source, layoutPanel: message.value});
        }

    };

    /**
     *
     * @param message.source {View}
     * @param message.value {LayoutPanel}
     */
    var removeLayoutPanel = function (message) {
        console.log('removeLayoutPanel', message);
        var view = message.source;
        var layoutPanel = message.value;

        var filterByLayoutPanel = function (item) {
            return item.layoutPanel !== layoutPanel;
        };

        var filterByView = function (item) {
            return item.view !== view;
        };

        var _items = items.filter(_.isEmpty(layoutPanel) ? filterByView : filterByLayoutPanel);

        items = _items;
    };

    var removeView = function (message) {
        removeLayoutPanel({source: message.view});
    };

    exchange.subscribe(messageTypes.onCreateLayoutPanel, addLayoutPanel);

    exchange.subscribe(messageTypes.onRemoveLayoutPanel, removeLayoutPanel);

    exchange.subscribe(messageTypes.onViewClosed, removeView);

    this.debug = function () {
        console.table(items);
    };

    this.getLayoutPanel = function (name) {
        var item = _.find(items, function (item) {
            var layoutPanel = item.layoutPanel;
            if (layoutPanel.getName() === name) {
                return true;
            }
        });

        return typeof item === 'undefined' ? item : item.layoutPanel;
    }

};


window.layoutPanelRegistry = new LayoutPanelRegistry();
//####app/element/layoutPanel/viewPanel/viewPanel.js
function ViewPanel(parentView) {
    _.superClass(ViewPanel, this, parentView);
}

_.inherit(ViewPanel, Element);

_.extend(ViewPanel.prototype, {

    setLayout: function (layout) {
        var oldLayout = this.getLayout();

        if(oldLayout) {
            oldLayout.close();
        }

        this.control.set('layout', layout);
    },

    getLayout: function () {
        return this.control.get('layout');
    },

    createControl: function () {
        return new ViewPanelControl();
    }

});
//####app/element/layoutPanel/viewPanel/viewPanelBuilder.js
function ViewPanelBuilder() {
}

_.inherit(ViewPanelBuilder, ElementBuilder);

_.extend(ViewPanelBuilder.prototype, {
    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var builder = params.builder;
        var panel = params.element;
        var metadata = params.metadata;
        var parentView = params.parentView;

        /* Помощь для обработки OpenMode = Inline */
        if (_.isEmpty(metadata.Name)) {
            metadata.Name = guid();
            panel.setName(metadata.Name);
        }

        InfinniUI.global.containers[metadata.Name] = panel;

        if ('LinkView' in metadata) {
            //var linkView = builder.build(params.view, metadata.View);
            var linkView = builder.build(metadata['LinkView'], {
                parentView: params.parentView,
                parent: params.element
            });

            linkView.setOpenMode('Container');
            linkView.setContainer(metadata.Name);

            linkView.createView(function (view) {
                view.open();
            });
        }

    },

    createElement: function (params) {
        return new ViewPanel(params.parent);
    }
},
    builderLayoutPanelMixin
);


InfinniUI.global.containers = {};

//####app/element/systemElement/actionBar/actionBar.js
function ActionBar(parent) {
    _.superClass(ActionBar, this, parent);
}

_.inherit(ActionBar, Element);

_.extend(ActionBar.prototype, {

    createControl: function () {
        return new ActionBarControl();
    },

    //setApplicationView: function (applicationView) {
    //    this.control.set('applicationView', applicationView);
    //},
    //
    //getApplicationView: function () {
    //    return this.control.get('applicationView');
    //},

    setPages: function (pages) {
        this.control.set('pages', pages);
    },

    getPages: function () {
        return this.control.get('pages');
    },

    refresh: function (pages) {
        //var view = this.getApplicationView();

        //console.log('ApplicationView', view);

        //var pages = InfinniUI.global.openMode.getPageViews(view);
        for (var i = 0, ln = pages.length; i < ln; i = i + 1) {
            console.log(pages[i]);
        }
    }

});
//####app/element/systemElement/actionBar/actionBarBuilder.js
function ActionBarBuilder() {

}

_.inherit(ActionBarBuilder, ElementBuilder);

_.extend(ActionBarBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);


        //var applicationView = params.parent.getApplicationView();
        //params.element.setApplicationView(applicationView);


        var exchange = window.InfinniUI.global.messageBus;

        exchange.subscribe(messageTypes.onViewOpened, this.onViewOpened.bind(this, params));

        exchange.subscribe(messageTypes.onViewClosed, this.onViewClosed.bind(this, params));

    },

    createElement: function (params) {
        return new ActionBar(params.view);
    },

    onViewOpened: function (params, message) {
        var applicationView = params.view.getApplicationView();
        if (message.openMode === 'Page' && applicationView === message.view.getApplicationView()) {
            //Открывается страница текущего приложения
            console.log('ActionBar.onViewOpened', message);
            //console.log(InfinniUI.global.openMode.getPageViews(message.view.getApplicationView()));
            this.updatePages(params);
        }
    },

    updatePages: function (params) {
        var applicationView = params.view.getApplicationView();
        var pageViews = InfinniUI.global.openMode.getPageViews(applicationView);
        params.element.setPages(pageViews.slice());
    },

    onViewClosed: function (params, message) {
        var applicationView = params.view.getApplicationView();
        if (applicationView === message.view.getApplicationView()) {
            //Закрыта страница текущего приложения
            console.log('ActionBar.onViewClosed', message);
            this.updatePages(params);
        }
    }

});
//####app/element/systemElement/globalNavigationBar.js
function GlobalNavigationBar(parent) {
    _.superClass(GlobalNavigationBar, this, parent);
}

_.inherit(GlobalNavigationBar, Element);

_.extend(GlobalNavigationBar.prototype, {

    createControl: function () {
        return new GlobalNavigationBarControl();
    },

    addApplicationView: function (view) {
        this.control.addApplicationView(view);
    },

    removeApplicationView: function (view) {
        this.control.removeApplicationView(view);
    },

    onActivateApplication: function (handler) {
        this.control.onActivateApplication(handler);
    },

    onClosingApplication: function (handler) {
        this.control.onClosingApplication(handler);
    },

    onCloseApplication: function (handler) {
        this.control.onCloseApplication(handler);
    },

    setApplicationText: function (view, text) {
        this.control.setApplicationText(view, text);
    },

    setApplications: function (applications) {
        this.control.setApplications(applications);
    }


});
//####app/element/systemElement/globalNavigationBarBuilder.js
function GlobalNavigationBarBuilder() {

}

_.inherit(GlobalNavigationBarBuilder, ElementBuilder);

_.extend(GlobalNavigationBarBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var element = params.element;

        element.setApplications(InfinniUI.global.openMode.getApplicationViews());
        var exchange = this.getGlobalMessageBus();
        exchange.subscribe(messageTypes.onViewOpened, this.onViewOpenedHandler.bind(this, params));

        exchange.subscribe(messageTypes.onViewClosed, this.onViewClosedHandler.bind(this, params));
        exchange.subscribe(messageTypes.onViewTextChange, this.onViewTextChangeHandler.bind(this, params));


        element.onActivateApplication(this.onActivateApplicationHandler.bind(this, params));
        element.onClosingApplication(this.onClosingApplicationHandler.bind(this, params));
    },

    getGlobalMessageBus: function () {
        return window.InfinniUI.global.messageBus;
    },

    /**
     * @description Обработчик запроса на закрытие представления от панели навигации
     * @param params
     * @param view
     */
    onClosingApplicationHandler: function (params, view) {
        view.close();
    },

    /**
     * @description Обработчик события переключения на другое приложение
     * @param params
     */
    onActivateApplicationHandler: function (params, view) {
        //@TODO Отправить в шину сообщение о необходимости активировать указанное приложение
        var exchange = this.getGlobalMessageBus();
        exchange.send(messageTypes.onShowView, {source: this, view: view});
    },

    /**
     * @description Обработчик события открытия представления
     */
    onViewOpenedHandler: function (params, message) {
        var element = params.element;

        if (message.openMode !== 'Application') {
            return;
        }

        console.log('messageTypes.onViewOpened', arguments);
        element.addApplicationView(message.view)

    },

    /**
     * @description Обработчик события закрытия представления
     */
    onViewClosedHandler: function (params, message) {
        console.log('messageTypes.onViewClosing', message);
        params.element.removeApplicationView(message.view)
    },

    /**
     * @description При изменении заголовка представления, уведомляем об этом компонент навигации
     * @param params
     */
    onViewTextChangeHandler: function (params, message) {
        params.element.setApplicationText(message.source, message.value);
    },

    createElement: function (params) {
        return new GlobalNavigationBar(params.view);
    }

});
//####app/eventStore.js
function EventStore() {
    var handlers = {};

    this.addEvent = function (name, action) {
        var event = handlers[name];
        if (event === undefined) {
            event = { actions: [] };
            handlers[name] = event;
        }

        event.actions.push(action);
        return {
            unsubscribe: this.removeEvent.bind(this, name, action)
        };
    };

    this.removeEvent = function (name, action) {
        var events = handlers[name];
        if (typeof events === 'undefined') {
            return;
        }
        var actions = events.actions;
        var i;
        while(true) {
            i = actions.indexOf(action);
            if (i === -1) {
                break;
            }
            actions.splice(i, 1);
        }
    };

    this.executeEvent = function (name) {
        var event = handlers[name],
            response = [],
            args = _.toArray(arguments).slice(1);

        if (event !== undefined) {
            response = _.map(event.actions, function (action) {
                return action.apply(null, args);
            });
        }
        return response;
    };

    this.executeEventAsync = function (name) {
        var args = Array.prototype.slice.call(arguments);
        var callback;
        if (typeof args[args.length - 1] === 'function') {
            callback = args.pop();
        }
        var response = this.executeEvent.apply(this, args);
        $.when.apply($, response)
            .done(function() {
                var results = [];
                if (typeof callback === 'function') {
                    callback(Array.prototype.push.apply(results, arguments));
                }
            });
    };
}
//####app/formats/displayFormat/_common/formatMixin.js
/**
 * @description Методы для форматоирования
 * @mixin
 */
var formatMixin = {
    /**
     * @memberOf formatMixin.prototype
     * @description Разделитель для форматирования коллекций
     */
    separator: ", ",

    /**
     * Форматирование объекта или коллекции объектов.
     * Для форматирования объекта вызывается метод formatValue
     *
     * @param {*} originalValue Форматируемое значение
     * @param {Culture} culture Культура
     * @param {String} format Строка форматирования
     * @returns {String}
     */
    format: function (originalValue, culture, format) {
        var result;

        if (originalValue !== null && typeof originalValue !== 'undefined' && originalValue.constructor === Array) {
            var values = [];
            for (var i = 0, ln = originalValue.length; i < ln; i = i + 1) {
                values.push(this.formatValue(originalValue[i], culture, format));
            }
            result = values.join(this.separator);
        } else {
            result = this.formatValue.apply(this, arguments);
        }

        return result;
    },

    getFormat: function () {
        return this.getPropertyValue('formatRule', this.defaultFormat);
    },

    setFormat: function (value) {
        this.formatRule = value;
    },

    /**
     * Получение значение свойства.
     * Возвращает установленное значение или defaultValue
     * @param name
     * @param defaultValue
     * @returns {*}
     */
    getPropertyValue: function (name, defaultValue) {
        var value = this[name];

        return (typeof value === 'undefined' || value === null) ? defaultValue : value;
    }

};
//####app/formats/displayFormat/boolean/booleanFormat.js
/**
 * @description Формат отображения логического значения.
 * @class BooleanFormat
 * @mixes formatMixin
 */
var BooleanFormat = function () {
};

_.extend(BooleanFormat.prototype, {

    /**
     * @description Текст для отображения истинного значения
     * @memberOf BooleanFormat.prototype
     */
    defaultTrueText: 'True',

    /**
     * @description Текст для отображения ложного значения
     * @memberOf BooleanFormat.prototype
     */
    defaultFalseText: 'False',

    /**
     * @description Возвращает текст для отображения ложного значения.
     * @memberOf BooleanFormat.prototype
     * @returns {String}
     */
    getFalseText: function () {
        return this.getPropertyValue('falseText', this.defaultFalseText);
    },

    /**
     * @description Устанавливает текст для отображения ложного значения.
     * @memberOf BooleanFormat.prototype
     * @param {String} value
     */
    setFalseText: function (value) {
        this.falseText = value;
    },

    /**
     * @description Возвращает текст для отображения истинного значения.
     * @memberOf BooleanFormat.prototype
     * @returns {String}
     */
    getTrueText: function () {
        return this.getPropertyValue('trueText', this.defaultTrueText);
    },

    /**
     * @description Устанавливает текст для отображения истинного значения
     * @memberOf BooleanFormat.prototype
     * @param {String} value
     */
    setTrueText: function (value) {
        this.trueText = value;
    },

    /**
     * @description Форматирует значение
     * @memberOf BooleanFormat.prototype
     * @param {Boolean} originalValue
     * @returns {String}
     */
    formatValue: function (originalValue) {
        if (originalValue === false || originalValue === null || typeof originalValue === 'undefined') {
            return this.getFalseText();
        } else {
            return this.getTrueText();
        }
    }

}, formatMixin);
//####app/formats/displayFormat/boolean/booleanFormatBuilder.js
/**
 * @description Билдер BooleanFormat
 * @class BooleanFormatBuilder
 */
function BooleanFormatBuilder () {

    /**
     * @description Создает и инициализирует экземпляр {@link BooleanFormat}
     * @memberOf BooleanFormatBuilder
     * @instance
     * @param context
     * @param args
     * @returns {BooleanFormat}
     */
    this.build = function (context, args) {

        var format = new BooleanFormat();

        format.setFalseText(args.metadata.FalseText);
        format.setTrueText(args.metadata.TrueText);

        return format;
    }
}
//####app/formats/displayFormat/dateTime/dateTimeFormat.js
/**
 * @description Формат отображения даты/времени.
 * @param format
 * @class DateTimeFormat
 * @mixes formatMixin
 */
function DateTimeFormat(format){

    this.setFormat(format);
}

_.extend(DateTimeFormat.prototype, {

    /**
     * @description Строка форматирования даты/времени по умолчанию
     * @memberOf DateTimeFormat.prototype
     */
    defaultFormat: 'G',

    /**
     * @description Форматирует дату
     * @memberOf DateTimeFormat.prototype
     * @param {Date} originalDate
     * @param {Culture} [culture]
     * @param {String} [format]
     * @returns {String}
     */
    formatValue: function(originalDate, culture, format){

        if (typeof originalDate === 'undefined' || originalDate === null) {
            return '';
        }
        var self = this;

        culture = culture || new Culture(InfinniUI.config.lang);

        var date = new Date(originalDate);

        format = format||this.getFormat();

        //if(format.length == 1){
        if(typeof InfinniUI.localizations[culture.name].patternDateFormats[format] !== 'undefined'){
            format = InfinniUI.localizations[culture.name].patternDateFormats[format];
        }

        return format.replace(this.rg, function(s){
            if(s[0] == '"' || s[0] == "'"){
                var len = s.length;
                return s.substring(1, len - 1);
            }else{
                return self.rules[s](date, culture);
            }
        });
    },


    rg: new RegExp(
        '"[\\s\\S]*"|' + "'[\\s\\S]*'"+

        '|yyyy|yy|%y|y' +
        '|MMMM|MMM|MM|%M|M' +
        '|dddd|ddd|dd|%d|d' +
        '|HH|%H|H|hh|%h|h' +
        '|mm|%m|m' +
        '|ss|%s|s' +
        '|tt|%t|t' +
        '|zzz|zz|%z|z' +
        '|:|/',

        'g'),

    rules: {
        'yyyy': function(date){
            return date.getFullYear().toString();
        },
        'yy': function(date){
            var year = date.getFullYear().toString();
            return year.substring(2);
        },
        '%y': function(date){
            var year = date.getFullYear().toString();
            year = year.substring(2);
            year = parseInt(year);
            return year.toString();
        },
        'y': function(date){
            var year = date.getFullYear().toString();
            year = year.substring(2);
            year = parseInt(year);
            return year.toString();
        },

        'MMMM': function(date, culture){
            var monthIndex = date.getMonth(),
                month = culture.dateTimeFormatInfo.monthNames[monthIndex];
            return month;
        },
        'MMM': function(date, culture){
            var monthIndex = date.getMonth(),
                month = culture.dateTimeFormatInfo.abbreviatedMonthNames[monthIndex];
            return month;
        },
        'MM': function(date){
            var monthIndex = date.getMonth() + 1;
            if(monthIndex < 10){
                return '0' + monthIndex.toString();
            }else{
                return monthIndex.toString();
            }
        },
        '%M': function(date){
            var monthIndex = date.getMonth() + 1;
            return monthIndex.toString();
        },
        'M': function(date){
            var monthIndex = date.getMonth() + 1;
            return monthIndex.toString();
        },

        'dddd': function(date, culture){
            var dayIndex = date.getDay(),
                day;

            dayIndex = (dayIndex == 0) ? 6 : dayIndex - 1;
            day = culture.dateTimeFormatInfo.dayNames[dayIndex];
            return day;
        },
        'ddd': function(date, culture){
            var dayIndex = date.getDay(),
                day;

            dayIndex = (dayIndex == 0) ? 6 : dayIndex - 1;
            day = culture.dateTimeFormatInfo.abbreviatedDayNames[dayIndex];
            return day;
        },
        'dd': function(date){
            var dayIndex = date.getDate();

            if(dayIndex < 10){
                return '0' + dayIndex.toString();
            }else{
                return dayIndex.toString();
            }
        },
        '%d': function(date){
            var dayIndex = date.getDate();
            return dayIndex.toString();
        },
        'd': function(date){
            var dayIndex = date.getDate();
            return dayIndex.toString();
        },

        'HH': function(date){
            var hoursIndex = date.getHours();

            if(hoursIndex < 10){
                return '0' + hoursIndex.toString();
            }else{
                return hoursIndex.toString();
            }
        },
        '%H': function(date){
            var hoursIndex = date.getHours();
            return hoursIndex.toString();
        },
        'H': function(date){
            var hoursIndex = date.getHours();
            return hoursIndex.toString();
        },
        'hh': function(date){
            var hoursIndex = date.getHours();

            if(hoursIndex > 12){
                hoursIndex -= 12;
            }

            if(hoursIndex < 10){
                return '0' + hoursIndex.toString();
            }else{
                return hoursIndex.toString();
            }
        },
        '%h': function(date){
            var hoursIndex = date.getHours();
            if(hoursIndex > 12){
                hoursIndex -= 12;
            }
            return hoursIndex.toString();
        },
        'h': function(date){
            var hoursIndex = date.getHours();
            if(hoursIndex > 12){
                hoursIndex -= 12;
            }
            return hoursIndex.toString();
        },

        'mm': function(date){
            var minuteIndex = date.getMinutes();

            if(minuteIndex < 10){
                return '0' + minuteIndex.toString();
            }else{
                return minuteIndex.toString();
            }
        },
        '%m': function(date){
            var minuteIndex = date.getMinutes();
            return minuteIndex.toString();
        },
        'm': function(date){
            var minuteIndex = date.getMinutes();
            return minuteIndex.toString();
        },

        'ss': function(date){
            var secondsIndex = date.getSeconds();

            if(secondsIndex < 10){
                return '0' + secondsIndex.toString();
            }else{
                return secondsIndex.toString();
            }
        },
        '%s': function(date){
            var secondsIndex = date.getSeconds();
            return secondsIndex.toString();
        },
        's': function(date){
            var secondsIndex = date.getSeconds();
            return secondsIndex.toString();
        },

        'tt': function(date, culture){
            var hoursIndex = date.getHours();

            if(hoursIndex < 12){
                return culture.dateTimeFormatInfo.amDesignator;
            }else{
                return culture.dateTimeFormatInfo.pmDesignator;
            }
        },
        '%t': function(date, culture){
            var hoursIndex = date.getHours();

            if(hoursIndex < 12){
                return culture.dateTimeFormatInfo.amDesignator.substr(0, 1);
            }else{
                return culture.dateTimeFormatInfo.pmDesignator.substr(0, 1);
            }
        },
        't': function(date, culture){
            var hoursIndex = date.getHours();

            if(hoursIndex < 12){
                return culture.dateTimeFormatInfo.amDesignator.substr(0, 1);
            }else{
                return culture.dateTimeFormatInfo.pmDesignator.substr(0, 1);
            }
        },

        'zzz': function(date){
            var offset = -date.getTimezoneOffset()/60,
                minutes,
                sign;

            minutes = (offset - Math.floor(offset)) * 100;
            offset = Math.floor(offset);

            if(offset < 0){
                sign = '-';
                offset = -offset;
            }else{
                sign = '+';
            }

            if(minutes < 10){
                minutes = '0' + minutes.toString();
            }else{
                minutes = minutes.toString();
            }

            if(offset < 10){
                return sign + '0' + offset.toString() + ':' + minutes;
            }else{
                return sign + offset.toString() + ':' + minutes;
            }
        },
        'zz': function(date){
            var offset = -date.getTimezoneOffset()/60,
                sign;

            offset = Math.floor(offset);

            if(offset < 0){
                sign = '-';
                offset = -offset;
            }else{
                sign = '+';
            }

            if(offset < 10){
                return sign + '0' + offset.toString();
            }else{
                return sign + offset.toString();
            }
        },
        'z': function(date, culture){
            var offset = -date.getTimezoneOffset()/60,
                sign;

            offset = Math.floor(offset);

            if(offset < 0){
                sign = '-';
                offset = -offset;
            }else{
                sign = '+';
            }

            return sign + offset.toString();
        },
        '%z': function(date, culture){
            var offset = -date.getTimezoneOffset()/60,
                sign;

            offset = Math.floor(offset);

            if(offset < 0){
                sign = '-';
                offset = -offset;
            }else{
                sign = '+';
            }

            return sign + offset.toString();
        },

        ':': function(date, culture){
            return culture.dateTimeFormatInfo.timeSeparator;
        },
        '/': function(date, culture){
            return culture.dateTimeFormatInfo.dateSeparator;
        }
    }
}, formatMixin);
//####app/formats/displayFormat/dateTime/dateTimeFormatBuilder.js
/**
 * @description Билдер DateTimeFormat
 * @class DateTimeFormatBuilder
 */
function DateTimeFormatBuilder () {

    /**
     * @description Создает и инициализирует экземпляр {@link DateTimeFormat}
     * @memberOf DateTimeFormatBuilder
     * @param context
     * @param args
     * @returns {DateTimeFormat}
     */
    this.build = function (context, args) {
        var format = new DateTimeFormat();

        format.setFormat(args.metadata.Format);

        return format;
    }

}
//####app/formats/displayFormat/number/NumberFormatBuilder.js
/**
 * @description Билдер NumberFormat
 * @class NumberFormatBuilder
 */
function NumberFormatBuilder () {

    /**
     * @description Создает и инициализирует экземпляр {@link NumberFormat}
     * @memberOf NumberFormatBuilder
     * @param context
     * @param args
     * @returns {NumberFormat}
     */
    this.build = function (context, args) {
        var format = new NumberFormat();

        format.setFormat(args.metadata.Format);

        return format;
    }
}
//####app/formats/displayFormat/number/numberFormat.js
/**
 * @description Формат отображения числового значения.
 * @param {String} format Строка форматирования
 * @class NumberFormat
 * @mixes formatMixin
 */
function NumberFormat(format){
    this.setFormat(format);
}

_.extend(NumberFormat.prototype, {

    /**
     * @description Строка форматирования числового значения по умолчанию
     * @memberOf NumberFormat.prototype
     */
    defaultFormat: "n",

    /**
     * @description Форматирует числовое значение
     * @memberOf NumberFormat.prototype
     * @param {Number} originalValue Форматируемое значение
     * @param {Culture} [culture] Культура
     * @param {String} [format] Строка форматирования
     * @returns {String}
     */
    formatValue: function(originalValue, culture, format){
        if (typeof originalValue === 'undefined' || originalValue === null) {
            return '';
        }
        var self = this;

        culture = culture || new Culture(InfinniUI.config.lang);

        format = format||this.getFormat();

        return format.replace(this.rg, function(s, formatName, formatParam){
            if(formatParam !== undefined && formatParam != ''){
                formatParam = parseInt(formatParam);
            }else{
                formatParam = undefined;
            }
            return self.rules[formatName].call(self, originalValue, formatParam, culture);
        });
    },

    rg: /^([pnc])(\d*)$/ig,

    rules: {
        'P': function(val, param, culture){
            param = (param !== undefined) ? param : culture.numberFormatInfo.percentDecimalDigits;
            var isPositive = val >= 0,
                formattedNumber = this.formatNumber(Math.abs(val), param, culture.numberFormatInfo.percentGroupSeparator, culture.numberFormatInfo.percentDecimalSeparator),
                result;

            if(isPositive){
                result = culture.numberFormatInfo.percentPositivePattern.replace('p', formattedNumber);
            }else{
                result = culture.numberFormatInfo.percentNegativePattern.replace('p', formattedNumber);
            }

            result = result.replace('%', culture.numberFormatInfo.percentSymbol);

            return result;
        },
        'p': function(val, param, culture){
            val *= 100;
            return this.rules.P.call(this, val, param, culture);
        },
        'n': function (val, param, culture) {
            param = (param !== undefined) ? param : culture.numberFormatInfo.numberDecimalDigits;
            var isPositive = val >= 0,
                formattedNumber = this.formatNumber(Math.abs(val), param, culture.numberFormatInfo.numberGroupSeparator, culture.numberFormatInfo.numberDecimalSeparator),
                result;

            if(isPositive){
                result = culture.numberFormatInfo.numberPositivePattern.replace('n', formattedNumber);
            }else{
                result = culture.numberFormatInfo.numberNegativePattern.replace('n', formattedNumber);
            }

            return result;
        },
        'N': function () {
            return this.rules.n.apply(this, arguments);
        },
        'c': function (val, param, culture) {
            param = (param !== undefined) ? param : culture.numberFormatInfo.currencyDecimalDigits;
            var isPositive = val >= 0,
                formattedNumber = this.formatNumber(Math.abs(val), param, culture.numberFormatInfo.currencyGroupSeparator, culture.numberFormatInfo.currencyDecimalSeparator),
                result;

            if(isPositive){
                result = culture.numberFormatInfo.currencyPositivePattern.replace('c', formattedNumber);
            }else{
                result = culture.numberFormatInfo.currencyNegativePattern.replace('c', formattedNumber);
            }
            result = result.replace('$', culture.numberFormatInfo.currencySymbol);

            return result;
        },
        'C': function () {
            return this.rules.c.apply(this, arguments);
        }
    },

    /**
     * @protected
     * @description Форматирует числовое значение
     * @memberOf NumberFormat.prototype
     * @param {Number} val Значение
     * @param {Number} capacity Количество знаков в дробной части
     * @param {Number} groupSeparator Разделитель между группами
     * @param {String} decimalSeparator Разделитель между целой и дробной частью
     * @returns {String}
     */
    formatNumber: function(val, capacity, groupSeparator, decimalSeparator){
        val = val.toFixed(capacity);

        var stringOfVal = val.toString(),
            splittedVal = stringOfVal.split('.'),
            intPath = this.formatIntPath(splittedVal[0], groupSeparator),
            fractPath = this.formatFractPath(splittedVal[1], decimalSeparator, capacity);

        return intPath + fractPath;
    },

    /**
     * @protected
     * @description Форматирует целую часть числа
     * @memberOf NumberFormat.prototype
     * @param {String} intPath Целая часть числа
     * @param {String} splitter Разделитель между группами
     * @returns {String}
     */
    formatIntPath: function(intPath, splitter){
        return intPath.replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, '$1' + splitter);
    },

    /**
     * @protected
     * @description Форматирует дробную часть числа
     * @memberOf NumberFormat.prototype
     * @param {String} fractPath Дробная часть числа
     * @param {String} splitter Разделитель между целой и дробной частью
     * @param {Number} capacity Количество знаков в дробной части
     * @returns {string}
     */
    formatFractPath: function(fractPath, splitter, capacity){
        var result = fractPath ? fractPath : '',
            postfix;

        if(capacity == 0){
            return '';
        }

        if(result.length >= capacity){
            return splitter + result.substr(0, capacity)
        }

        postfix = Math.pow(10, capacity - result.length);
        postfix = postfix.toString().substr(1);
        return splitter + result + postfix;
    }
}, formatMixin);
//####app/formats/displayFormat/object/objectFormat.js
/**
 * @description Формат отображения объекта
 * @param {String} format Строка форматирования
 * @class ObjectFormat
 * @mixes formatMixin
 */
function ObjectFormat(format) {
    this.setFormat(format);

    this.formatters = [DateTimeFormat, NumberFormat];
}

_.extend(ObjectFormat.prototype, {

    /**
     * @private
     * @description Форматирует объект
     * @memberOf ObjectFormat.prototype
     * @param {*} originalValue Форматируемое значение
     * @param {Culture} culture Культура
     * @param {String} format Строка форматирования
     * @returns {String}
     */
    formatValue: function (originalValue, culture, format) {

        if (typeof originalValue === 'undefined' || originalValue === null) {
            return '';
        }

        culture = culture || new Culture(InfinniUI.config.lang);
        format = format || this.getFormat();

        var regexp = /{[^}]*}/g;
        var trim = /^{|}$/g;
        var value = '';

        if (typeof originalValue !== 'undefined' && originalValue !== null) {
            value = format.replace(regexp, this.formatIterator.bind(this, originalValue, culture));
        }
        
        return value;

    },

    /**
     * @private
     * @description Форматирование каждого простого вхождения формата в строку форматирования объекта
     * @memberOf ObjectFormat.prototype
     * @param {*} originalValue Форматируемое значение
     * @param {Culture} culture
     * @param {String} match строка форматирования
     * @returns {String}
     */
    formatIterator: function (originalValue, culture, match) {
        var regexp = /{[^}]*}/g;
        var trim = /^{|}$/g;

        var result, text, formatter, value, parts;

        result = match;
        text = match.replace(trim, '');
        parts = text.split(':');

        if (typeof originalValue === 'object') {
            value = (parts[0] === '') ? originalValue : InfinniUI.ObjectUtils.getPropertyValue(originalValue, parts[0]);
        } else {
            value = originalValue;
        }

        if (parts.length === 2) {
            // Найдено "[Property]:Format"
            for (var i = 0, ln = this.formatters.length; i < ln; i = i + 1) {
                //Пытаемся по очереди отформатировать значение разными форматами
                formatter = new this.formatters[i](parts[1]);
                text = formatter.format(value, culture);
                if (text !== parts[1]) {
                    //Если формат отформатировал строку - оставляем ее
                    result = text;
                    break;
                }
            }
        } else {
            // Найдено "[Property]"
            result = value;
        }

        return (typeof result === 'undefined' || result === null) ? '' : result;
    }




}, formatMixin);
//####app/formats/displayFormat/object/objectFormatBuilder.js
/**
 * @description Билдер ObjectFormat
 * @class ObjectFormatBuilder
 */
function ObjectFormatBuilder () {

    /**
     * @description Создает и инициализирует экземпляр {@link ObjectFormat}
     * @memberOf ObjectFormatBuilder
     * @param context
     * @param args
     * @returns {ObjectFormat}
     */
    this.build = function (context, args) {
        var format = new ObjectFormat();

        format.setFormat(args.metadata.Format);

        return format;
    }
}
//####app/formats/editMask/_common/editMaskMixin.js
    var editMaskMixin = {
    /**
     * Установка начального значения
     * @param value
     */
    reset: function (value) {
        this.value = value;
        this.buildTemplate(value);
    },

    /**
     * Генерация шаблона ввода текста для текущей маски
     */
    buildTemplate: function () {

    },

    /**
     * Получить редактируемое значение
     * @returns {*}
     */
    getValue: function () {
        return this.value;
    },

    getData: function () {
        return this.getValue();
    },

    /**
     * Переход к предыдущему полю ввода
     * @param position
     * @returns {boolean|number}
     */
    moveToPrevChar: function (position) {

        return false;
    },

    /**
     * Переход к следующему полю ввода
     * @param position
     * @returns {boolean|number}
     */
    moveToNextChar: function (position) {

        return false;
    },

    /**
     * Установить следующее значение в текущей позиции
     * @param position
     * @returns {boolean|number}
     */
    setNextValue: function (position) {

        return false;
    },

    /**
     * Установить предыдущее значение в текущей позиции
     * @param position
     * @returns {boolean|number}
     */
    setPrevValue: function (position) {

        return false;
    },

    /**
     * Удалить выделенный текст
     * @param position
     * @returns {boolean|number}
     */
    deleteSelectedText: function(position){

        return false;
    },

    /**
     * Удалить символ справа от позиции
     * @param position
     * @returns {boolean|number}
     */
    deleteCharRight: function (position) {

        return false;
    },

    /**
     * Удалить символ слева от позиции
     * @param position
     * @returns {boolean|number}
     */
    deleteCharLeft: function (position) {

        return false;
    },

    /**
     * Обработка нажатия символа в указанной позиции
     * @param char
     * @param position
     * @returns {boolean|number}
     */
    setCharAt: function (char, position) {

        return false;
    },

    /**
     * Обработка вставки текста в маску
     * @param clipboardText
     * @param position
     * @returns {boolean}
     */
    pasteStringToMask: function(clipboardText, position){

        return false;
    },

    /**
     * Переход к следующей доступной маске ввода
     * @param position
     * @returns {boolean|number}
     */
    getNextItemMask: function (position) {
        return false;
    },

    /**
     * Получить текст для отображения в элементе
     * @returns {string}
     */
    getText: function () {
        return this.value.toString();
    },

    /**
     * Форматирование значения для заданной группы маски ввода
     * @param {*} value
     * @param {String} mask Маска для фоматтера this.format
     * @returns {String}
     */
    formatMask: function (value, mask) {
        return (value === null || typeof value === 'undefined') ? '' : value;
    },

    getNextIntValue: function (options, value) {
        options = options || {};
        var minValue = null,
            maxValue = null,
            step = (typeof options.step !== 'undefined') ? step : 1;
        if (typeof options.min !== 'undefined') {
            minValue = options.min;
        }
        if (typeof options.max !== 'undefined') {
            maxValue = options.max;
        }
        value = parseInt(value, 10);
        if (isNaN(value)) {
            value = (minValue === null) ? 0 : minValue;
        } else {
            value = value + step;
            if (maxValue !== null && value > maxValue) {
                value = maxValue;
            }
        }
        return value;
    },
    
    getPrevIntValue: function (options, value) {
        options = options || {};
        var minValue = null,
            step = (typeof options.step !== 'undefined') ? step : 1;
        if (typeof options.min !== 'undefined') {
            minValue = options.min;
        }
        value = parseInt(value, 10);
        if (isNaN(value)) {
            value = (minValue === null) ? 0 : minValue;
        } else {
            value = value - step;
            if (minValue !== null && value < minValue) {
                value = minValue;
            }
        }
        return value;
    },

    formatInt: function (options, value) {
        var width = (typeof options.width !== 'undefined') ? options.width : null;

        value = parseInt(value, 10);
        var text, ln;
        if (isNaN(value)) {
            value = '';
        }
        text = value.toString();
        ln = text.length;
        if (width !== null && ln < width) {
            text = Array(width - ln +1).join('0') + text;
        }
        return text;
    },

    /**
     * Проверка что маска была полностью заполнена
     * @param value
     * @returns {boolean}
     */
    getIsComplete: function (value) {

        return false;
    }

};
//####app/formats/editMask/dateTime/_base/dateTimeMaskPart.js
var DateTimeMaskPartStrategy = (function () {
    var regExpDay = /^(?:3[0-1]|[012]?[0-9]?)$/;
    var regExpMonth = /^(?:1[0-2]|0?[1-9]?)$/;
    var regExpFullYear = /^\d{1,4}$/;
    var regExpYear = /^\d{1,2}$/;
    var regExpHour24 = /^(?:[12][0-3]|[01]?[1-9]?)$/;
    var regExp60 = /^[0-5]?[0-9]$/;

    return {
        'd': {
            init: function () {
                this.width = 2;
                this.min = 1;
                this.max = 31;
            },
            match: function (value) {
                return regExpDay.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setDate(part);
                return value;
            }
        },
        'dd': {
            init: function () {
                this.width = 2;
                this.min = 1;
                this.max = 31;
            },
            match: function (value) {
                return regExpDay.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setDate(part);
                return value;
            }
        },
        'M': {
            init: function () {
                this.width = 2;
                this.min = 1;
                this.max = 12;
            },
            match: function (value) {
                return regExpMonth.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setMonth(parseInt(part, 10) - 1);
                return value;
            }
        },
        'MM': {
            init: function () {
                this.width = 2;
                this.min = 1;
                this.max = 12;
            },
            match: function (value) {
                return regExpMonth.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setMonth(parseInt(part, 10) - 1);
                return value;
            }
        },
        'y': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 99;
            },
            match: function (value) {
                return regExpYear.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                var year = parseInt(part, 10);
                if (!isNaN(year)) {
                    year = '0000' + year;
                    var date = new Date();
                    value.setFullYear(date.getFullYear().toString().substr(0, 2) + year.slice(-2));
                }
                return value;
            }
        },
        'yy': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 99;
            },
            match: function (value) {
                return regExpYear.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                var year = parseInt(part, 10);
                if (!isNaN(year)) {
                    year = '0000' + year;
                    var date = new Date();
                    value.setFullYear(date.getFullYear().toString().substr(0, 2) + year.slice(-2));
                }
                return value;
            }
        },
        'yyyy': {
            init: function () {
                this.width = 4;
                this.min = 0;
                this.max = 9999;
            },
            match: function (value) {
                return regExpFullYear.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setFullYear(part);
                return value;
            }
        },
        'H': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 23;
            },
            match: function (value) {
                return regExpHour24.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setHours(part);
                return value;
            }
        },
        'HH': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 23;
            },
            match: function (value) {
                return regExpHour24.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setHours(part);
                return value;
            }
        },
        'm': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 59;
            },
            match: function (value) {
                return regExp60.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setMinutes(part);
                return value;
            }
        },
        'mm': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 59;
            },
            match: function (value) {
                return regExp60.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setMinutes(part);
                return value;
            }
        },
        's': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 59;
            },
            match: function (value) {
                return regExp60.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setSeconds(part);
                return value;
            }
        },
        'ss': {
            init: function () {
                this.width = 2;
                this.min = 0;
                this.max = 59;
            },
            match: function (value) {
                return regExp60.test(value);
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevIntValue(value);
            },
            next: function (value) {
                return this.getNextIntValue(value);
            },
            format: function (value) {
                return this.padNumber(value);
            },
            apply: function (value, part) {
                value.setSeconds(part);
                return value;
            }
        },
        'MMM': {
            init: function () {
                this.min = 2;
                this.max = 12;
                this.width = 2;
            },
            match: function () {
                return false;   // Не даем ничего вводить
            },
            validator: function (value) {
                return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevMonthValue('MMM', value);
            },
            next: function (value) {
                return this.getNextMonthValue('MMM', value);
            },
            apply: function (value, part) {
                var index = this.getIndexMonthValue('MMM', part);
                if (index !== -1) {
                    value.setMonth(index);
                }

                return value;
            }
        },
        'MMMM': {
            init: function () {
                this.min = 2;
                this.max = 12;
                this.width = 2;
            },
            match: function () {
                return false;   // Не даем ничего вводить
            },
            validator: function (value) {
                var list = this.getListForMask('MMMM');
                return list.indexOf(value) > -1;
                //return this.rangeValidator(value);
            },
            prev: function (value) {
                return this.getPrevMonthValue('MMMM', value);
            },
            next: function (value) {
                return this.getNextMonthValue('MMMM', value);
            },
            apply: function (value, part) {
                var index = this.getIndexMonthValue('MMMM', part);
                if (index !== -1) {
                    value.setMonth(index);
                }
                return value;
            }
        }

    }

})();

var DateTimeMaskPart = function (mask) {
    _.extend(this, DateTimeMaskPartStrategy[mask]);
    this.init();
};

_.extend(DateTimeMaskPart.prototype, {

    init: function () {

    },

    match: function (value) {
        return true;
    },

    validator: function (value) {
        return true;
    },

    fulfilled: function (value) {
        return this.match(value) && this.validator(value);
    },

    prev: function (value) {
        return value;
    },

    next: function (value) {
        return value;
    },

    format: function (value) {
        return value;
    },

    applyPart: function(value, part) {
        return value;
    },

    padNumber: function (value) {
        var width = (typeof this.width !== 'undefined') ? this.width : null;

        value = parseInt(value, 10);
        var text, ln;
        text = (isNaN(value)) ? text = '': value.toString();
        ln = text.length;
        if (width !== null && ln < width) {
            text = Array(width - ln +1).join('0') + text;
        }

        return text;
    },

    getNextIntValue: function (value) {
        var minValue = (typeof this.min !== 'undefined') ? this.min : null,
            maxValue = (typeof this.max !== 'undefined') ? this.max : null,
            step = (typeof this.step !== 'undefined') ? this.step : 1;

        value = parseInt(value, 10);
        if (isNaN(value)) {
            value = (minValue === null) ? 0 : minValue;
        } else {
            value = value + step;
            if (maxValue !== null && value > maxValue) {
                value = maxValue;
            }
        }
        return value;
    },

    getPrevIntValue: function (value) {
        var minValue = (typeof this.min !== 'undefined') ? this.min : null,
            step = (typeof this.step !== 'undefined') ? this.step : 1;

        value = parseInt(value, 10);
        if (isNaN(value)) {
            value = (minValue === null) ? 0 : minValue;
        } else {
            value = value - step;
            if (minValue !== null && value < minValue) {
                value = minValue;
            }
        }
        return value;
    },

    getListForMask: function (mask) {
        //@TODO Получать культуру из контекста!
        var culture = new Culture(InfinniUI.config.lang);
        var formatInfo = culture.dateTimeFormatInfo;

        var list;

        switch (mask) {
            case 'MMMM':
                list = formatInfo.monthNames;
                break;
            case 'MMM':
                list = formatInfo.abbreviatedMonthNames;
                break;
            case 'dddd':
                list = formatInfo.dayNames;
                break;
            case 'ddd':
                list = formatInfo.abbreviatedDayNames;
                break;
        }

        return list;
    },

    getNextListValueForMask: function (mask, value) {
        var list = this.getListForMask(mask);
        var index = list.indexOf(value);
        if (typeof list === 'undefined') {
            return value;
        } else if (index === -1){
            return list.length ? list[0]: '';
        }
        index = index + 1;
        return (index < list.length) ? list[index] : value;
    },

    getPrevListValueForMask: function (mask, value) {
        var list = this.getListForMask(mask);
        var index = list.indexOf(value);
        if (typeof list === 'undefined') {
            return value;
        } else if (index === -1){
            return list.length ? list[list.length - 1]: '';
        }
        index = index - 1;
        return (index >= 0) ? list[index] : value;
    },

    getIndexListValueForMask: function (mask, value) {
        var list = this.getListForMask(mask);

        if (typeof list === 'undefined') {
            return -1;
        }

        return list.indexOf(value);
    },

    getNextMonthValue: function (mask, value) {
        return this.getNextListValueForMask(mask, value);
    },

    getPrevMonthValue: function (mask, value) {
        return this.getPrevListValueForMask(mask, value);
    },

    getIndexMonthValue: function (mask, value) {
        return this.getIndexListValueForMask(mask, value);
    },

    rangeValidator: function (value) {
        value = parseInt(value, 10);
        return  !(isNaN(value) || value < this.min || value > this.max);
    }

});

//####app/formats/editMask/dateTime/dateTimeEditMask.js
function DateTimeEditMask() {
    this.mask = null;
    this.format = null;
}

_.extend(DateTimeEditMask.prototype, {

    /**
     * Переход к следующему разделу маски
     * @param position
     * @returns {Integer}
     */
    getNextItemMask: function (position) {
        var data = this.getItemTemplate(position);
        var newPosition;

        if (data !== null) {
            newPosition = this.moveToNextChar(data.left + data.width);
            if (newPosition > data.left + data.width) {
                position = newPosition;
            }

        } else {
            position = this.moveToNextChar(position);
        }
        return position;
    },

    /**
     * Установить следущее из вожможных значений в элементе маски ввода
     * @param position
     * @returns {*}
     */
    setNextValue: function (position) {
        var data = this.getItemTemplate(position);
        var item, value, mask;

        if (data !== null) {
            item = data.item;
            mask = this.masks[item.mask];
            if (typeof mask.next !== 'undefined') {
                value = mask.next(item.text);
                if (typeof mask.format !== 'undefined') {
                    value = mask.format(value);
                }
                item.text = '' + value;

                position = Math.min(data.left + item.text.length, position);
            }
        } else {
            position = this.moveToNextChar(position);
        }
        return position;
    },

    /**
     * Установить предыдущее из вожможных значений в элементе маски ввода
     * @param position
     * @returns {*}
     */
    setPrevValue: function (position) {
        var data = this.getItemTemplate(position);
        var item, value, mask;

        if (data !== null) {
            item = data.item;
            mask = this.masks[item.mask];
            if (typeof mask.prev !== 'undefined') {
                value = mask.prev(item.text);
                if (typeof mask.format !== 'undefined') {
                    value = mask.format(value);
                }
                item.text = '' + value;
                position = Math.min(data.left + item.text.length, position);
            }
        } else {
            position = this.moveToNextChar(position);
        }
        return position;
    },

    /**
     * Удалить символ слева от курсора
     * @param position
     */
    deleteCharLeft: function (position) {
        var data = this.getItemTemplate(position);
        var item, text;

        var selection = window.getSelection().toString();

        if (selection) {
            this.selectRemove(this.template, position, selection);
        } else {
            if (data !== null) {
                if (data.index > 0) {
                    item = data.item;
                    position--;
                    text = item.text.slice(0, data.index - 1) + item.text.slice(data.index);
                    item.text = text;
                } else {
                    data = this.getItemTemplate(data.left - 1);
                    position = data.left + data.item.text.length;
                }
            } else {
                position = this.moveToNextChar(position);
            }
        }
        return position;
    },

    /**
     * Удалить символ справа от курсора
     * @param position
     */
    deleteCharRight: function (position) {
        var data = this.getItemTemplate(position);
        var item, text;

        var selection = window.getSelection().toString();

        if (selection) {
            this.selectRemove(this.template, position, selection);
        } else {
            if (data !== null) {
                item = data.item;
                text = item.text.slice(0, data.index) + item.text.slice(data.index + 1);
                item.text = text;
                if (item.text.length == 0) {
                    position = this.getNextItemMask(position);
                }
            } else {
                position = this.moveToNextChar(position);
            }
        }
        return position;
    },

    /**
     * Удаление выделенного текста
     * @param template
     * @param position
     * @param selection
     */
    selectRemove: function(template, position, selection){
        var firstItem = this.getItemTemplate(position);
        var lastItem = this.getItemTemplate(position + selection.length);

        var firstIndexItem = template.indexOf(firstItem.item);
        var lastIndexItem = template.indexOf(lastItem.item);

        for (var i = firstIndexItem; i < lastIndexItem + 1; i++) {
            if (typeof template[i] == "object") {
                if (firstIndexItem == lastIndexItem) {
                    build(template[i], position, selection);
                } else if (i == firstIndexItem) {
                    build(template[i], position, selection);
                } else if (i == lastIndexItem) {
                    build(template[i], position, selection);
                } else {
                    template[i].text = '';
                }
            }
        }

        function build(templateText, position, selection) {
            var arraySymbols = templateText.text.split('');
            var start = position - templateText.position;
            var end = (position + selection.length) - templateText.position;

            if (start < 0) start = 0;
            arraySymbols.splice(start, end - start);

            templateText.text = arraySymbols.join('');
            return templateText;
        }
    },

    /**
     * Вставка в маску
     * @param clipboardText
     * @param position
     */
    pasteStringToMask: function(clipboardText, position){
        clipboardText = clipboardText.replace(/\D/gi, '');

        var arraySymbols = clipboardText.split('');

        var firstItem = this.getItemTemplate(position);
        var firstIndexItem = this.template.indexOf(firstItem.item), lastIndexItem = 0;

        var lastItem = getLastTemplate(this.template);
        if(lastItem) {
            lastIndexItem = this.template.indexOf(lastItem);
        }else{
            lastIndexItem = firstIndexItem;
        }

        var tLength = 0, maxLength = 0;

        for(var i = firstIndexItem; i < lastIndexItem+1; i++) {
            if (typeof this.template[i] == "object") {
                if (i == firstIndexItem) {
                    maxLength = maxTemplateLength(this.template[i]);
                    tLength = maxLength - (position-this.template[i].position);

                    var first = this.template[i].text.slice(0, position - this.template[i].position);

                    var zero = '';
                    if(!first) {
                        for (var d = 0; d < position - this.template[i].position; d++) {
                            zero = zero + '0';
                        }
                    }

                    this.template[i].text = zero + first + clipboardText.slice(0, tLength);
                    arraySymbols.splice(0, tLength)
                }else{
                    if(i != lastIndexItem){
                        maxLength = maxTemplateLength(this.template[i]);

                        this.template[i].text = arraySymbols.join('').slice(0, maxLength);
                        arraySymbols.splice(0, maxLength);
                    }else{
                        maxLength = maxTemplateLength(this.template[i]);

                        if(arraySymbols.length > maxLength) arraySymbols.splice(maxLength, arraySymbols.length);
                        this.template[i].text = arraySymbols.join('') + this.template[i].text.slice(arraySymbols.length, maxLength);
                    }
                }
            }
        }

        function maxTemplateLength(template){
            return Math.max(template.mask.length, template.text.length)
        }

        function getLastTemplate(template) {
            var dotLength = 0;
            var arr = [];
            for (var i = firstIndexItem; i < template.length; i++) {
                if (typeof template[i] == "object") {
                    if (clipboardText.length > template[i].position - dotLength - position) {
                        arr.push(template[i]);
                    }
                } else {
                    dotLength = dotLength + template[i].length;
                }
            }
            return arr[arr.length-1];
        }
    },

    /**
     * @private
     * @description Получить элемент шаблона в заданной позиции
     * @param {Integer} position
     * @returns {*}
     */
    getItemTemplate: function (position) {
        var template = this.template;
        var item;
        var left = 0;
        var width;
        var index;
        var result = null;
        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') {
                left += item.length;
            } else {
                width = Math.max(this.masks[item.mask].width, item.text.length);
                if (position < left || position >= left && position <= left + width) {
                    index = position - left;
                    result = {
                        item: item,
                        left: left,
                        width: width,
                        index: position - left
                    };
                    break;
                }
                left += width;
            }
        }

        return result;
    },

    setCharAt: function (char, position) {
//        var template;
//
//        for (var i = 0, ln = this.template.length; i < ln; i = i + 1) {
//            template = this.template[i];
//            if (typeof template === 'string') { //Статический текст
//                continue;
//            }
//            if (template.position === position) {    //Маска ввода
//                mask = this.masks[template.mask];
//                console.log(mask);
//                text = char.substr(0,1);
//                if (mask.validator(text)) {
//                    template.text = text;
//                    position = this.getNextItemMask(position);
//                }
//                break;
//            }
//            if (template.position > position) {
//                break;
//            }
//        }
        var data = this.getItemTemplate(position);
        var text;
        var item;
        var mask;
        var index;
        var newpos;

        if (data !== null) {
            item = data.item;
            index = position - data.left;

            if (index > item.text.length) {
                position = data.left;
            }

            mask = this.masks[item.mask];

            newpos = position - item.position;
            if(newpos < 0) newpos = 0;

            if(item.text.slice(newpos, newpos+1)) {
                text = [item.text.slice(0, newpos), char, item.text.slice(newpos+1)].join('');
            }else{
                text = [item.text.slice(0, data.index), char, item.text.slice(data.index)].join('');
            }

            if(mask.match(text)) {
                item.text = text;
                position = this.moveToNextChar(position);
                if (mask.width === newpos+1) {
                    position = this.getNextItemMask(position);
                }
            } else {    //Нажатая кнопка не подходит под маску
                var nextItem = this.template.indexOf(data.item) + 1;
                if (this.template[nextItem] === char) {
                    position = this.getNextItemMask(position);
                }
            }

        } else {
            position = this.moveToNextChar(position);
        }


        return position;
    },

    /**
     * Получить предыдущую позицию, в которой возможен ввод
     */
    moveToPrevChar: function (position) {
        position = position - 1;
        var template = this.template;
        var item;
        var mask;
        var width;
        var left = 0;
        var last;
        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') { //Простой символ
                left += item.length;
                if (typeof last === 'undefined') {
                    last = left;
                }
            } else {    //элемент маски ввода
                mask = item.mask;
                width = Math.max(this.masks[mask].width, item.text.length);
                if (position >= left && position < left + width) {
                    break;
                } else if (position < left) {
                    position = last;
                    break;
                }
                left += width;
                last = left;
            }
        }

        if (i === ln && position > last) {
            position = last;
        }

        return position;
    },

    /**
     * Получить следущую позицию, в которой возможен ввод
     */
    moveToNextChar: function (position) {
        position = position + 1;
        var template = this.template;
        var item;
        var left = 0;
        var last;
        var mask;
        var width;
        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') {  //Простой исмвол
                left += item.length;
            } else {    //Элемент маски ввода
                mask = item.mask;
                width = Math.max(this.masks[mask].width, item.text.length);
                if (position >= left && position <= left + width) {
                    break;
                } else if (position < left) {
                    //position = (typeof last !== 'undefined') ? last : left;
                    position = left;
                    break;
                }
                left += width;
                last = left;

            }
        }
        if (i === ln && position >= last) { //Если вышли за границы маски
            position = last;
        }

        return position;
    },

    /**
     * Получить представление значения для MaskedEdit
     * @returns {string}
     */
    getText: function () {
        var template = this.template;
        var item;
        var result = [];
        var placeholder;

        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') {
                result.push(item);
            } else {
                placeholder = Array(this.masks[item.mask].width + 1).join('_');
                if (item.text.length < placeholder.length) {
                    result.push(item.text + placeholder.slice(item.text.length));
                } else {
                    result.push(item.text);
                }
            }
        }
        return result.join('');
    },

    /**
     * @private
     * @description Построение объекта для форматирования значения
     * @param {Date} [date] Значение
     * @returns {Array}
     */
    buildTemplate: function (date) {
        var mask = this.normalizeMask(this.mask);
        var i, ln;

        //Все доступные маски упорядочиваем по длине
        var masks = _.keys(this.masks);
        masks.sort(function (a, b) {
            return b.length - a.length;
        });

        //Ищем используемые в шаблоне маски
        var usedMasks = [];
        var maskLength;
        var position;
        for (i = 0, ln = masks.length; i < ln; i = i + 1) {
            position = mask.indexOf(masks[i]);
            if (position === -1) continue;
            //Вырезаем маску
            maskLength = masks[i].length;
            mask = [mask.substring(0, position), Array(maskLength + 1).join(" "), mask.substring(position + maskLength)].join('');
            usedMasks.push({
                mask: masks[i],
                position: position
            });
        }
        //Упорядочиваем использованные маски по позиции вхождения в шаблон
        usedMasks.sort(function (a, b) {
            return a.position - b.position;
        });

        var template = [];
        var lastPosition = 0;
        var usedMask;
        for (i = 0, ln = usedMasks.length; i < ln; i = i + 1) {
            usedMask = usedMasks[i];
            if (lastPosition < usedMask.position) {
                template.push(mask.substring(lastPosition, usedMask.position));
            }
            lastPosition = usedMask.position + usedMask.mask.length;
            //usedMask.mask = this.normalizeMask(usedMask.mask);
            //usedMask.text = (date === null || typeof date === 'undefined') ? '' : this.format.format(date, undefined, usedMask.mask);
            usedMask.text = this.formatMask(date, usedMask.mask);
            template.push(usedMask);
        }

        if (lastPosition < mask.length) {
            template.push(mask.substring(lastPosition));
        }

        return template;
    },


    /**
     * Вернуть введеный результат
     * @returns {*}
     */
    getValue: function () {
        var template = this.template;
        var item;
        var mask;
        var value = this.value;
        var done = true;

        for (var i = 0; i < template.length; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') continue;
            mask = this.masks[item.mask];
            if (typeof mask.apply !== 'undefined') {
                if (item.text === '') {
                    done = false;
                    break;
                }
                value = mask.apply(value, item.text);
            }
        }


        return done ? value : null;
    },

    /**
     * Вернуть результат в используемумом формате данных: строка в формате ISO8601
     * @returns {String}
     */
    getData: function () {
        return InfinniUI.DateUtils.toISO8601(this.getValue());
    },

    /**
     * Установка начального значения
     * @param value
     */
    reset: function (value) {
        this.value = null;
        var date = null;

        if (typeof value !== 'undefined' && value !== null && value !== '') {
            //Если переданное значение является датой - инициалищируем этим значением
            try {
                if(value instanceof Date){
                    date = value;
                }else {
                    date = new Date(value);
                }

            } catch (e) {
                date = null;
            }
            this.value = date;
        }

        this.template = this.buildTemplate(date);

        if (this.value === null) {
            this.value = new Date(0);
        }
    },

    /**
     * @private
     * @description Переводим %x => x
     * @param mask
     */
    normalizeMask: function (mask) {
        var localization = InfinniUI.localizations[InfinniUI.config.lang];

        if (typeof localization.patternDateFormats !== 'undefined' && typeof localization.patternDateFormats[mask] !== 'undefined') {
            mask = localization.patternDateFormats[mask];
        }

        return mask.replace(/%([yMdms])/g, '$1');
    },

    /**
     * Форматирование значения для заданной группы маски ввода
     * @param {*} value
     * @param {String} mask Маска для фоматтера this.format
     * @returns {String}
     */
    formatMask: function (value, mask) {
        mask = mask.replace(/^([yMdms])$/, '%$1');
        return (value === null || typeof value === 'undefined') ? '' : this.format.format(value, undefined, mask);
    },

    /**
     * Проверка что маска была полностью заполнена
     */
    getIsComplete: function () {
        var template = this.template;
        var item;
        var complete = true;
        var mask;

        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') continue;
            mask = this.masks[item.mask];
            if (!mask.validator(item.text)) {
                complete = false;
                break;
            }
        }
        return complete;
    },

    masks: {
        'd': new DateTimeMaskPart('d'),
        'dd': new DateTimeMaskPart('dd'),
        'M': new DateTimeMaskPart('M'),
        'MM': new DateTimeMaskPart('MM'),
        'y': new DateTimeMaskPart('y'),
        'yy': new DateTimeMaskPart('yy'),
        'yyyy': new DateTimeMaskPart('yyyy'),
        'H': new DateTimeMaskPart('H'),
        'HH': new DateTimeMaskPart('HH'),
        'm': new DateTimeMaskPart('m'),
        'mm': new DateTimeMaskPart('mm'),
        's': new DateTimeMaskPart('s'),
        'ss': new DateTimeMaskPart('ss'),
        'MMM': new DateTimeMaskPart('MMM'),
        'MMMM': new DateTimeMaskPart('MMMM')
    }

});



//####app/formats/editMask/dateTime/dateTimeEditMaskBuilder.js
/**
 * Билдер DateTimeEditMask
 * @constructor
 */
function DateTimeEditMaskBuilder () {
    this.build = function (context, args) {

        var editMask = new DateTimeEditMask();
        var culture = new Culture(InfinniUI.config.lang);
        var mask;

        if (typeof InfinniUI.localizations[culture.name].patternDateFormats[args.metadata.Mask] !== 'undefined') {
            mask = InfinniUI.localizations[culture.name].patternDateFormats[args.metadata.Mask];
        } else {
            mask = args.metadata.Mask;
        }

        editMask.mask = mask;

        editMask.format = args.builder.buildType('DateTimeFormat', {Format: args.metadata.Mask}, {parentView: args.parentView});

        return editMask;
    }
}
//####app/formats/editMask/number/numberEditMask.js
function NumberEditMask () {
    this.mask = null;
    this.format = null;
    //@TODO Получать культуру из контекста!
    this.culture = new Culture(InfinniUI.config.lang);
}

_.extend(NumberEditMask.prototype, editMaskMixin);


_.extend(NumberEditMask.prototype, {

    placeholder: '_',

    /**
     * Получение десятичного разделителя для текущего формата
     * @returns {String}
     */
    getDecimalSeparator: function () {
        var itemTemplate = this.getItemTemplate();
        var item = itemTemplate.item;
        var regexp = /^[npc]/i;
        var matches = item.mask.match(regexp);
        var separator;
        if (matches && matches.length > 0) {
            switch (matches[0]) {
                case 'n':
                case 'N':
                    separator = this.culture.numberFormatInfo.numberDecimalSeparator;
                    break;
                case 'p':
                case 'P':
                    separator = this.culture.numberFormatInfo.percentDecimalSeparator;
                    break;
                case 'c':
                case 'C':
                    separator = this.culture.numberFormatInfo.currencyDecimalSeparator;
                    break;
            }
        }

        return separator;
    },

    getDecimalDigits: function () {
        var itemTemplate = this.getItemTemplate();
        var item = itemTemplate.item;
        var regexp = /^([npc])(\d*)$/i;
        var matches = item.mask.match(regexp);
        var decimalDigits = 0;
        if (matches && matches.length > 0) {

            if (matches[2] !== '') {
                decimalDigits = +matches[2];
            } else {
                switch (matches[0]) {
                    case 'n':
                    case 'N':
                        decimalDigits = this.culture.numberFormatInfo.numberDecimalDigits;
                        break;
                    case 'p':
                    case 'P':
                        decimalDigits = this.culture.numberFormatInfo.percentDecimalDigits;
                        break;
                    case 'c':
                    case 'C':
                        decimalDigits = this.culture.numberFormatInfo.currencyDecimalDigits;
                        break;
                }
            }
        }
        return decimalDigits;
    },

    /**
     * Установка начального значения
     * @param value
     */
    reset: function (value) {
        this.value = null;

        if (typeof value !== 'undefined' && value !== null && value !== '') {
            value = +value;
            if (isNaN(value)) {
                value = null;
            }
            this.value = value;
        }

        this.template = this.buildTemplate(value);
    },

    buildTemplate: function (value) {
        var r = /([npc])(\d*)/i;

        var mask = this.mask;

        var template = [];

        var that = this;

        mask.replace(r, function (mask, name, precision, position, text) {
            //Часть перед шаблоном
            template.push(text.slice(0, position));
            //Шаблон
            template.push({
                mask: mask,
                text: (value === null) ? "" : that.formatMask(value, mask),
                value: value
            });
            //Часть после шаблона
            template.push(text.substring(position + mask.length));
        });

        return template;
    },

    getText: function () {
        var result = [];
        var item;

        for (var i = 0, ln = this.template.length; i < ln; i = i + 1) {
            item = this.template[i];
            if (typeof item === 'string') {
                result.push(item);
            } else {
                if (typeof item.value === 'undefined' || item.value === null) {
                    //Отдаем маску ввода
                    result.push(this.formatMask(0, item.mask).replace(/0/g, this.placeholder));
                } else {
                    //Отдаем форматированное значени
                    result.push(this.formatMask(item.value, item.mask));
                }
            }
        }

        return result.join('');
    },

    formatMask: function (value, mask) {
        return (value === null || typeof value === 'undefined') ? '' : this.format.format(value, undefined, mask);
    },

    /**
     * Переход к предыдущему символу в строке ввода
     * @param {number} position
     * @returns {number}
     */
    moveToPrevChar: function (position) {
        position = (position > 0) ? position - 1 : 0;
        var itemTemplate = this.getItemTemplate();
        var item = itemTemplate.item;
        var text = item.text;
        var index;
        var start;

        if (position < itemTemplate.left) {
            index = text.search(/\d/);
            position = (index === -1) ?  itemTemplate.left : itemTemplate.left + index;
        } else {
            start = position - itemTemplate.left + 1;
            //Переход к первой цифре слева от позиции
            var txt = text.substring(0, start);
            if (/\d/.test(txt)) {   //Слева есть цифры
                index = txt.length - txt.split('').reverse().join('').search(/\d/);
                if (index === start) {
                    index--;
                }
            } else {    //
                index = Math.max(0, text.search(/\d/));
            }

            position = itemTemplate.left + index;
        }

        return position;
    },

    /**
     * Переход к следущему символу в строке ввода
     * @param {number} position
     * @returns {number}
     */
    moveToNextChar: function (position) {
        position = (position < 0) ? 0 : position + 1;

        var itemTemplate = this.getItemTemplate();
        var item = itemTemplate.item;
        var text = item.text + " ";
        var start = Math.max(0, position - itemTemplate.left);
        var index;


        //Переход к первой цифре справа от позиции

        var r = /\d/;
        var last = 0;
        var char;
        for (var i = 0, ln = text.length; i < ln; i = i + 1) {
            if (r.test(text[i]) === false) {
                char =  text[i-1];
                if (typeof char !== 'undefined' && !r.test(char)) {
                    continue;
                }
            }
            if (i < start) {
                last = i;
            } else {
                index = i;
                break;
            }
        }
        if (typeof index === 'undefined') {
            index = last;
        }

        position = itemTemplate.left + index;
        return position;
    },

    /**
     * Обработка нажатия символа в указанной позиции
     * @param char
     * @param position
     */
    setCharAt: function (char, position) {
        var itemTemplate = this.getItemTemplate();
        var left = itemTemplate.left;
        var item = itemTemplate.item;
        var text = item.text;
        var decimalSeparator = this.getDecimalSeparator();
        var index;

        if (char === '-' && item.value !== null) {  //Смена знака
            item.value = -item.value;
            item.text = this.formatMask(item.value, item.mask);
            position += item.text.length - text.length;
        } else if (position >= itemTemplate.left && position <= itemTemplate.left + text.length) {
            //Позиция попадает в маску ввода
            index = position - left;

            if (char == decimalSeparator) { //Нажат разделитель
                if (item.value === null){
                    item.value = 0;
                    item.text = this.formatMask(item.value, item.mask);
                }
                //Переход на первую цифру дробной части
                if (item.text.indexOf(decimalSeparator) !== -1) {
                    position = left + item.text.indexOf(decimalSeparator) + decimalSeparator.length;
                }

            } else if (/\d/.test(char)) {  //Нажата цифра
                var fractional;

                fractional = text.indexOf(decimalSeparator) > -1 && index > text.indexOf(decimalSeparator);
                item.value = this.parseText([text.slice(0, index), char, text.slice(index)].join(''), item.value);
                item.text = this.formatMask(item.value, item.mask);

                if (text === '') {
                    position = this.moveToNextChar(left);
                } else {
                    position = (fractional) ?  position + 1: position + item.text.length - text.length;
                    position = Math.min(position, left + this.getIndexOfEndDigit(item.text));
                }
            }
        }

        return position;
    },

    /**
     * @private
     * @description увеличивает или уменьшает на 1 значение цифры слева от каретки.
     * @param position
     * @param delta
     * @returns {*}
     */
    updateDigitValue: function (position, delta) {
        var itemTemplate = this.getItemTemplate();
        var left = itemTemplate.left;
        var item = itemTemplate.item;
        var text = item.text;
        var index;


        if (position < itemTemplate.left || position > itemTemplate.left + text.length) {
            //Позиция не попадает в маску ввода
            return this.moveToNextChar(position);
        }

        index = position - left;

        if (index > 0) {
            var digit = text.substr(index - 1, 1);
            if (/\d/.test(digit)) {
                digit = parseInt(digit,10) + delta;
                if (digit > 9) digit = 9;
                if (digit < 0) digit = 0;
                item.value = this.parseText([text.slice(0, index - 1), digit, text.slice(index)].join(''), item.value);
                item.text = this.formatMask(item.value, item.mask);
            }

        }
        return position;
    },

    setNextValue: function (position) {
       return this.updateDigitValue(position, 1);
    },

    setPrevValue: function (position) {
        return this.updateDigitValue(position, -1);
    },

    /**
     * Удаление выделенного текста
     * @param position
     * @param len
     * @param char
     * @returns {*}
     */
    deleteSelectedText: function(position, len, char){
        var itemTemplate = this.getItemTemplate();
        var item = itemTemplate.item;
        var text = item.text;
        var val = item.value.toString();
        var endLength = len + position;
        if(!char)char = "";

        var preventPosition = text.slice(0, position);
        var preventLength = text.slice(0, endLength);

        var spacePreventPosition = (preventPosition.split(" ").length - 1);
        var spacePreventLength = (preventLength.split(" ").length - 1);

        position = position - spacePreventPosition;
        endLength = endLength - spacePreventLength;

        var res = val.slice(0, position) + char + val.slice(endLength, val.length);
        var masktext = this.formatMask(res, item.mask);

        if(char){
            position += char.length+spacePreventPosition;
            position += formatSpace(masktext, position);
        }else{
            position += formatSpace(masktext, position);
        }

        function formatSpace(text, position){
            return text.slice(0, position).split(" ").length - 1;
        }

        if(_.isEmpty(res)){
            res = null;
        }

        return {result: res, position: position};
    },

    /**
     * Удаление символов справа от позиции курсора
     * @param position
     * @param len
     * @returns {*}
     */
    deleteCharRight: function (position, len) {
        var itemTemplate = this.getItemTemplate();
        var left = itemTemplate.left;
        var item = itemTemplate.item;
        var text = item.text;
        var decimalSeparator = this.getDecimalSeparator();
        var index;

        if (position < itemTemplate.left || position > itemTemplate.left + text.length) {
            //Не попадаем в маску
            return this.moveToNextChar(0);
        }

        if (text.length === len) {
            return this.clearValue(item);
        }
        //Позиция попадает в маску ввода
        index = position - left;

        var decimalSeparatorIndex = text.indexOf(decimalSeparator);

        var i = text.substr(index).search(/\d/);
        if (item.value === 0) {
            item.value = null;
            item.text = this.formatMask(item.value, item.mask);
            position = left;
        } else if (i > -1){
            i += index;
            var parts = text.split(decimalSeparator);
            if (index === parts[0].length) { //Находимся в целой части, на границе с дробно - удаляем всю дробную
                item.value = this.parseText(parts[0], item.value);
            } else {
                item.value = this.parseText([text.substr(0, i), text.substr(i + 1)].join(''), item.value);
            }

            //item.value = this.parseText([text.substr(0, i), text.substr(i + 1)].join(''), item.value);
            item.text = this.formatMask(item.value, item.mask);
            if (i < decimalSeparatorIndex) {
                //Находились в целой части, должны в ней и остаться
                //position = left + Math.min(i, item.text.indexOf(decimalSeparator));
                position = left + Math.min(i - (text.length - 1 - item.text.length ), item.text.indexOf(decimalSeparator));
            }
        }

        return position;
    },

    clearValue: function (item) {
        item.value = null;
        item.text = this.formatMask(item.value, item.mask);

        return 0;
    },

    deleteCharLeft: function (position, len) {
        var itemTemplate = this.getItemTemplate();
        var left = itemTemplate.left;
        var item = itemTemplate.item;
        var text = item.text;
        var decimalSeparator = this.getDecimalSeparator();
        var decimalSeparatorIndex = text.indexOf(decimalSeparator);
        var index;
        if (position < itemTemplate.left || position > itemTemplate.left + text.length) {
            //Не попадаем в маску
            return this.moveToNextChar(0);
        }
        //Позиция попадает в маску ввода
        var decimalDigits = this.getDecimalDigits();
        index = position - left;

        if (text.length === len) {
            return this.clearValue(item);
        }

        var fractional = false;
        if (index <= 0) {
            return position;
        }

        if (decimalSeparatorIndex > -1) {
            fractional = index > decimalSeparatorIndex;
            if ((index === text.length - decimalDigits)) {
                //Позиция сразу справа от разделителя - переносим ее в целую часть
                index -= decimalSeparator.length;
                position -= decimalSeparator.length;
            }
        }

        var txt = text.slice(0, index);

        var i = (/\d/.test(txt)) ? txt.length - txt.split('').reverse().join('').search(/\d/) - 1 : 0;
        if (item.value === 0) {
            item.value = null;
            item.text = this.formatMask(item.value, item.mask);
            position = left;
        } else {
            item.value = this.parseText(text.slice(0, i) + text.slice(i + 1), item.value);
            item.text = this.formatMask(item.value, item.mask);
            position = fractional ? position - 1 : position + item.text.length - text.length;

        }


        return position;
    },

    getValue: function () {
        var itemTemplate = this.getItemTemplate();

        return itemTemplate.item.value;
    },

    /**
     * Возвращает позицию указывающую за последнюю цифку м строке
     * @param text
     * @returns {Number}
     */
    getIndexOfEndDigit: function (text) {
        var index = text.split('').reverse().join('').search(/\d/);
        return (index === -1) ? index : text.length - index;
    },

    /**
     * Переводит форматированное представление в числовое
     * @param text
     * @param {number} oldValue
     * @returns {number}
     */
    parseText: function (text, oldValue) {
        var itemTemplate = this.getItemTemplate();
        var item = itemTemplate.item;
        var mask = item.mask;

        var decimalSeparator = this.getDecimalSeparator();
        var decimalDigits = this.getDecimalDigits();
        var parts = text.split(decimalSeparator);
        var value;

        parts = parts.map(function (item, index) {
            var txt = item.replace(/[^\d]/g, '');
            return (index === 1) ? txt.substr(0, decimalDigits) : txt;
        });


        text = parts.join('.');

        if (text === '') {
            value = null;
        } else {
            value = +text;

            if (oldValue < 0) {
                value = -value;
            }

            if (/^p/.test(mask)) {
                value = value / 100;
            }
        }
        return value;
    },

    /**
     * Возвращает часть шаблона для ввода значения
     * @returns {*}
     */
    getItemTemplate: function () {
        var template = this.template;
        var item;
        var left = 0;
        var result = null;
        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') {
                left += item.length;
            } else {
                result = {
                    item: item,
                    left: left
                };
                break;
            }
        }

        return result;
    },

    /**
     * Проверка что маска была полностью заполнена
     */
    getIsComplete: function () {

        return true;
    }
});


//####app/formats/editMask/number/numberEditMaskBuilder.js
/**
 * Билдер NumberEditMask
 * @constructor
 */
function NumberEditMaskBuilder () {
    this.build = function (context, args) {

        var editMask = new NumberEditMask();

        editMask.mask = args.metadata.Mask;

        editMask.format = args.builder.buildType('NumberFormat', {Format: args.metadata.Mask}, {parentView: args.parentView});

        return editMask;
    }
}
//####app/formats/editMask/regex/regexEditMask.js
function RegexEditMask () {
    this.mask = null;
}

_.extend(RegexEditMask.prototype, editMaskMixin);

_.extend(RegexEditMask.prototype, {

    /**
     * Проверка что маска была полностью заполнена
     */
    getIsComplete: function (value) {
        var regExp;
        this.value = value;
        if (this.mask !== null) {
            regExp = new RegExp(this.mask);
            return regExp.test(value);
        }
        return false;
    }


});


//####app/formats/editMask/regex/regexEditMaskBuilder.js
/**
 * Билдер RegexEditMask
 * @constructor
 */
function RegexEditMaskBuilder () {

    this.build = function (context, args) {

        var editMask = new RegexEditMask();

        editMask.mask = args.metadata.Mask;

        return editMask;
    }

}
//####app/formats/editMask/template/_base/templateEditMaskPart.js
var TemplateMaskPartStrategy = (function () {

    var regexpAnyLetter = /^[a-zA-Zа-яА-ЯёЁ]$/;
    var regexpAnyNumber = /^\d$/;
    var regexpSign = /^[-+]$/;

    function isEmptyValue(value) {
        return typeof value === 'undefined' || value === '' || value === null;
    }


    return {
        //Используемые метасимволы маски ввода

        'c': {  //Необязательный ввод любого символа.
            required: false,    //Признак обязательности элемента маски ввода
            width: 1,   //Ширина для заполнителя маски ввода
            validator: function (value) {   //Проверка на допустимость значения для текущего метасимвола
                return true;
            },
            regexp: '.?'    //Регулярное выражение для выделения символа соответствующего метасимволу из общей строки значения
        },

        'C': {  //Обязательный ввод любого символа.
            required: true,
            width: 1,
            validator: function (value) {
                return !isEmptyValue(value);
            },
            regexp: '.'
        },

        'l': {  //Необязательный ввод буквы.
            required: false,
            width: 1,
            validator: function (value) {
                return isEmptyValue(value) || regexpAnyLetter.test(value);
            },
            regexp: '[a-zA-Zа-яА-ЯёЁ]?'
        },

        'L': {  //Обязательный ввод буквы.
            required: true,
            width: 1,
            validator: function (value) {
                return !isEmptyValue(value) && regexpAnyLetter.test(value);
            },
            regexp: '[a-zA-Zа-яА-ЯёЁ]'
        },

        'a': {  //Необязательный ввод буквы или цифры.
            required: false,
            width: 1,
            validator: function (value) {
                return isEmptyValue(value) || regexpAnyLetter.test(value) || regexpAnyNumber.test(value);
            },
            regexp: '[a-zA-Zа-яА-ЯёЁ0-9]?'
        },

        'A': {  //Обязательный ввод буквы или цифры.
            required: true,
            width: 1,
            validator: function (value) {
                return !isEmptyValue(value) && (regexpAnyLetter.test(value) || regexpAnyNumber.test(value));
            },
            regexp: '[a-zA-Zа-яА-ЯёЁ0-9]?'
        },

        '#': {  //Необязательный ввод цифры, знака "-" или "+".
            required: false,
            width: 1,
            validator: function (value) {
                return isEmptyValue(value) || regexpSign.test(value);
            },
            regexp: '[-+]?'
        },

        '9': {  //Необязательный ввод цифры.
            required: false,
            width: 1,
            validator: function (value) {
                return isEmptyValue(value) || regexpAnyNumber.test(value);
            },
            regexp: '[0-9]?'
        },

        '0': {  //Обязательный ввод цифры.
            required: true,
            width: 1,
            validator: function (value) {
                return !isEmptyValue(value) && regexpAnyNumber.test(value);
            },
            regexp: '[0-9]'
        }
    }

})();


var TemplateMaskPart = function (mask) {
    _.extend(this, TemplateMaskPartStrategy[mask]);

};

_.extend(TemplateMaskPart.prototype, {

    /**
     * Проверка символа на допустимость для метасимвола маски
     * @param {string} value
     * @returns {boolean}
     */
    validate: function (value) {
        return this.validator(value);
    },

    /**
     * Проверка на заполненность значения для метасимвола маски
     * @param {string} value
     * @returns {boolean}
     */
    getIsComplete: function (value) {
        return !this.required || (value !== '' && typeof value !== 'undefined' && value !== null);
    }

});



//####app/formats/editMask/template/templateEditMask.js
function TemplateEditMask () {
    this.mask = null;
    this.maskSaveLiteral = true;
    this.maskPlaceHolder = '_';
}

_.extend(TemplateEditMask.prototype, editMaskMixin);

_.extend(TemplateEditMask.prototype, {
    /**
     * @private
     * @description Построение объекта для форматирования значения
     * @param {string} [text] Значение
     * @returns {Array}
     */
    buildTemplate: function (text) {
        var template = [];
        var mask = this.mask;

        var i = 0, ln = mask.length, char, prevChar = '';

        while(i < mask.length) {
            char = mask.substr(i, 1);
            if (char === '\\') {
                char = mask.substr(i + 1, 1);

                if (typeof this.masks[char] !== 'undefined') {  //Экранипрованная маска
                    template.push(char);
                    mask = [mask.substring(0, i), mask.substr(i + 1)].join('');
                    i = i + 1;
                } else {
                    template.push('\\');
                }
                continue;
            }

            if (typeof this.masks[char] !== 'undefined') {
                    template.push({
                        mask: char,
                        text: "",
                        position: i
                    });
            } else {
                template.push(char);
            }
            i = i + 1;
        }
        this.template = template;
        this.setValue(text);
        return template;
    },

    /**
     * @private
     * @description Получение регулярного выражения для разбора значения согласно шаблона маски ввода
     * @returns {RegExp}
     */
    getRegExpForMask: function () {
        var i = 0;
        var ln = this.mask.length;
        var char, next;
        var result = [];
        var decorator = ['(', ')'];
        var r = /([\+\^\*\(\)\|\{\}\[\]\.])/; //Маска для экранирования спец символов

        var store = function (pattern, skip) {
            skip = !!skip;
            result.push(skip ? pattern : decorator.join(pattern));
        };

        while(i < ln) {
            char = this.mask.substr(i, 1);
            if (typeof this.masks[char] !== 'undefined') {
                //Метасимвол маски ввода
                store(this.masks[char].regexp);
            } else if (char === '\\') {
                next = this.mask.substr(i + 1, 1);
                if (typeof this.masks[next] !== 'undefined') {   //Экранированный метасимвол маски ввода
                    if (this.maskSaveLiteral) {
                        store(next, true);
                        i = i + 1;
                    }
                } else {
                    if (this.maskSaveLiteral) {
                        store('\\\\', true);
                    }
                }
            } else {    //Не экранирующий символ и не менасимвол
                if (this.maskSaveLiteral) {
                    store( r.test(char) ? char.replace(r, '\\$1') : char, true);
                }
            }
            i = i + 1;
        }

        return new RegExp('^' + result.join('') + '$');
    },

    /**
     * Установка значения
     * @param value
     */
    setValue: function (value) {

        if (value === null || typeof value === 'undefined') {
            value = '';
        }

        value = value + '';
        var regexp = this.getRegExpForMask();
        var parts;
        var part;
        var i, ln;
        var template;

        parts = (regexp.test(value)) ? value.match(regexp).slice(1) : [];

        for (i = 0, ln = this.template.length; i < ln; i = i + 1) {
            template = this.template[i];
            if (typeof template === 'string') continue;
            part = parts.shift();
            template.text = (typeof part === 'undefined') ? '' : part[0];
        }
    },

    /**
     * Получение введенного значения
     * @returns {string}
     */
    getValue: function () {
        var template = this.template;
        var result = [];
        var text;
        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            if (typeof template[i] === 'string' && this.maskSaveLiteral) {
                result.push(template[i]);
            } else {
                text = template[i].text;
                if (text !== null && text !== '' && typeof text !== 'undefined') {
                    result.push(text);
                }
            }
        }

        return result.join('');
    },

    moveToNextChar: function (position) {
        position = Math.max(position, 0);
        var template = this.template;

        var test = template.slice(position);

        var i, ln, index = null;

        var start = false;
        for (i = 0, ln = test.length; i < ln; i = i + 1) {
            if (typeof test[i] === 'string') {
                start = true;
                continue;
            }
            index = test[i].position - (start ? 1 : 0);
            break;
        }

        if (index === null) {
            test = template.slice(0, position);
            for (i = test.length - 1; i >= 0; i = i - 1) {
                if (typeof test[i] === 'string') {
                    continue;
                }
                index = test[i].position;
                break;
            }
        }

        return (index === null) ? 0 : index + 1;
    },

    moveToPrevChar: function (position) {
        position = Math.max(position, 0);
        var template = this.template;

        var test = template.slice(0, position);

        var i, ln, index = null;

        var end = false;
        for (i = test.length - 1; i >= 0; i = i - 1) {
            if (typeof test[i] === 'string'){
                end = true;
                continue;
            }
            index = test[i].position + (end ? 1 : 0);
            break;
        }

        if (index === null) {
            test = template.slice(position);
            for (i = 0, ln = test.length; i < ln; i = i + 1) {
                if (typeof test[i] === 'string') continue;
                index = test[i].position;
                break;
            }
        }

        return (index === null) ? 0 : index;
    },

    /**
     * @private
     * @description Получить элемент шаблона в заданной позиции
     * @param {Integer} position
     * @returns {*}
     */
    getItemTemplate: function (position) {
        var template = this.template;
        var item;
        var left = 0;
        var width;
        var index;
        var result = null;
        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            item = template[i];
            if (typeof item === 'string') {
                left += item.length;
            } else {
                width = Math.max(this.masks[item.mask].width, item.text.length);
                if (position < left || position >= left && position <= left + width) {
                    index = position - left;
                    result = {
                        item: item,
                        left: left,
                        width: width,
                        index: position - left
                    };
                    break;
                }
                left += width;
            }
        }
        return result;
    },

    deleteCharRight: function (position) {
        var template;
        var i, ln;
        var left;

        var selection = window.getSelection().toString();

        if (selection) {
            this.selectRemove(this.template, position, selection);
        }else{
            for (i = 0, ln = this.template.length; i < ln; i = i + 1) {
                template = this.template[i];

                if (typeof template === 'string' || template.position < position) {
                    continue;
                }
                position = template.position + 1; // Перенос каретки на 1 символ вправо для корректной работы DEL
                template.text = '';
                break;
            }
        }
        return position;
    },

    deleteCharLeft: function (position) {
        var template;
        var i, ln;
        var left;

        var selection = window.getSelection().toString();

        if (selection) {
            this.selectRemove(this.template, position, selection);
        }else {
            for (i = this.template.length - 1; i >= 0; i = i - 1) {
                template = this.template[i];

                if (typeof template === 'string' || template.position >= position) {
                    continue;
                }
                position = template.position;
                template.text = '';
                break;
            }
        }
        return position;
    },

    /**
     * Удаление выделенного текста
     * @param template
     * @param position
     * @param selection
     */
    selectRemove: function(template, position, selection){
        var firstItem = this.getItemTemplate(position);
        var lastItem = this.getItemTemplate(position + selection.length);

        var firstIndexItem = template.indexOf(firstItem.item);
        var lastIndexItem = template.indexOf(lastItem.item);

        for (var i = firstIndexItem; i < lastIndexItem + 1; i++) {
            if (typeof template[i] == "object") {
                if (firstIndexItem == lastIndexItem) {
                    build(template[i], position, selection);
                } else if (i == firstIndexItem) {
                    build(template[i], position, selection);
                } else if (i == lastIndexItem) {
                    build(template[i], position, selection);
                } else {
                    template[i].text = '';
                }
            }
        }

        function build(templateText, position, selection) {
            var arraySymbols = templateText.text.split('');
            var start = position - templateText.position;
            var end = (position + selection.length) - templateText.position;

            if (start < 0) start = 0;
            arraySymbols.splice(start, end - start);

            templateText.text = arraySymbols.join('');
            return templateText;
        }
    },

    /**
     * Вставка в маску
     * @param clipboardText
     * @param position
     */
    pasteStringToMask: function(clipboardText, position){
        clipboardText = clipboardText.replace(/\D/gi, '');

        var arraySymbols = clipboardText.split('');

        var firstItem = this.getItemTemplate(position);
        var firstIndexItem = this.template.indexOf(firstItem.item), lastIndexItem = 0;

        var lastItem = getLastTemplate(this.template);
        if(lastItem) {
            lastIndexItem = this.template.indexOf(lastItem);
        }else{
            lastIndexItem = firstIndexItem;
        }

        var tLength = 0, maxLength = 0;

        for(var i = firstIndexItem; i < lastIndexItem+1; i++) {
            if (typeof this.template[i] == "object") {
                if (i == firstIndexItem) {
                    maxLength = maxTemplateLength(this.template[i]);
                    tLength = maxLength - (position-this.template[i].position);

                    var first = this.template[i].text.slice(0, position - this.template[i].position);

                    //TODO: вставка 0, если предыдущих значений нет
//                    var zero = '';
//                    if(!first) {
//                        for (var d = 0; d < position - this.template[i].position; d++) {
//                            zero = zero + '0';
//                        }
//                    }

                    this.template[i].text = first + clipboardText.slice(0, tLength);
                    arraySymbols.splice(0, tLength)
                }else{
                    if(i != lastIndexItem){
                        maxLength = maxTemplateLength(this.template[i]);

                        this.template[i].text = arraySymbols.join('').slice(0, maxLength);
                        arraySymbols.splice(0, maxLength);
                    }else{
                        maxLength = maxTemplateLength(this.template[i]);

                        if(arraySymbols.length > maxLength) arraySymbols.splice(maxLength, arraySymbols.length);
                        this.template[i].text = arraySymbols.join('') + this.template[i].text.slice(arraySymbols.length, maxLength);
                    }
                }
            }
        }

        function maxTemplateLength(template){
            return Math.max(template.mask.length, template.text.length)
        }

        function getLastTemplate(template) {
            var dotLength = 0;
            var arr = [];
            for (var i = firstIndexItem; i < template.length; i++) {
                if (typeof template[i] == "object") {
                    if (clipboardText.length > template[i].position - dotLength - position) {
                        arr.push(template[i]);
                    }
                } else {
                    dotLength = dotLength + template[i].length;
                }
            }
            return arr[arr.length-1];
        }
    },

    clearText: function (position, len) {
        var tmpl;
        var startFrom;

        for (var i = 0, ln = this.template.length; i < ln; i = i + 1) {
            tmpl = this.template[i];

            if (typeof tmpl === 'string') {
                continue;
            }

            if (tmpl.position >= position && tmpl.position < position + len) {
                if (typeof startFrom === 'undefined') {
                    startFrom = tmpl.position;
                }
                tmpl.text = '';
            }
        }

        return startFrom;
    },

    /**
     * Обработка нажатия символа в указанной позиции
     * @param char
     * @param position
     */
    setCharAt: function (char, position, len) {
        var template;
        var mask;
        var text;

        if (typeof len === 'undefined') {
            len = 0;
        }

        if (len > 0) {
            this.clearText(position, len);
        }

        for (var i = 0, ln = this.template.length; i < ln; i = i + 1) {
            template = this.template[i];
            if (typeof template === 'string') { //Статический текст
                continue;
            }
            if (template.position === position) {    //Маска ввода
                mask = this.masks[template.mask];
                text = char.substr(0,1);
                if (mask.validate(text)) {
                    template.text = text;
                    position = this.getNextItemMask(position);
                }
                break;
            }
            if (template.position > position) {
                break;
            }
        }
        return position;
    },

    deleteSelectedText: function(position, len, char){
        var startFrom = this.clearText(position, len);

        if (typeof char !== 'undefined') {
            startFrom = this.setCharAt(char, position);
        }

        return {
            position: startFrom,
            result: this.getText()
        };
    },

    getNextItemMask: function (position) {
        var template;
        var i, ln;
        var last;
        var index;

        for (i = this.template.length - 1; i >= 0; i = i - 1) {
            template = this.template[i];
            if (typeof template === 'string') {
                continue;
            }
            if (template.position <= position) {
                position = typeof last === 'undefined' ? this.moveToNextChar(position) : last;
                break;
            }
            last = template.position;
        }

        return position;
    },

    getText: function () {
        var template = this.template;
        var result = [];
        var text;

        for (var i = 0, ln = template.length; i < ln; i = i + 1) {
            if (typeof template[i] === 'string') {
                result.push(this.parseSpecialChars(template[i]));
            } else {
                text = template[i].text;
                if (typeof text === 'undefined' || text === '' || text === null) {
                    result.push(this.maskPlaceHolder);
                } else {
                    result.push(text);
                }
            }
        }
        return result.join('');
    },

    /**
     * Проверка что маска была полностью заполнена
     * @returns {boolean}
     */
    getIsComplete: function () {
        var i, ln;
        var template;
        var mask;
        var complete = true;

        for (i = 0, ln = this.template.length; i < ln; i = i + 1) {
            template = this.template[i];
            if (typeof template === 'string') {
                continue;
            }
            mask = this.masks[template.mask];
            complete = mask.getIsComplete(template.text);
            if (!complete) {
                break;
            }
        }

        return complete;
    },

    /**
     * Установка начального значения
     * @param value
     */
    reset: function (value) {
        this.value = null;

        if (typeof value !== 'undefined' && value !== null) {
            this.value = value;
        }

        this.buildTemplate(value);
    },

    /**
     * @private
     * @description Трансляция специальных символом в шаблоне маски ввода в соотвествующие установленной локали
     * @param {string} text
     * @returns {string}
     */
    parseSpecialChars: function (text) {
        var localization = InfinniUI.localizations[InfinniUI.config.lang];
        var map = {
            '/': localization.dateTimeFormatInfo.dateSeparator,
            ':': localization.dateTimeFormatInfo.timeSeparator,
            '%': localization.numberFormatInfo.percentSymbol,
            '$': localization.numberFormatInfo.currencySymbol
        };

        var i, ln, data = [];

        for (var char in map) {
            if (!map.hasOwnProperty(char)) {
                continue;
            }

            data = text.split('');
            for (i = 0, ln = data.length; i < ln; i = i + 1) {
                if (data[i] === char) {
                    data[i] = map[char];
                }
            }

            text = data.join('');
        }

        return text;
    },

    masks: {
        'c': new TemplateMaskPart('c'),
        'C': new TemplateMaskPart('C'),
        'l': new TemplateMaskPart('l'),
        'L': new TemplateMaskPart('L'),
        'a': new TemplateMaskPart('a'),
        'A': new TemplateMaskPart('A'),
        '#': new TemplateMaskPart('#'),
        '9': new TemplateMaskPart('9'),
        '0': new TemplateMaskPart('0')
    }

});

//####app/formats/editMask/template/templateEditMaskBuilder.js
/**
 * Билдер TemplateEditMask
 * @constructor
 */
function TemplateEditMaskBuilder () {
    this.build = function (context, args) {

        var editMask = new TemplateEditMask();

        if (typeof args.metadata.Mask !== 'undefined') {
            editMask.mask = args.metadata.Mask;
        }
        if (typeof args.metadata.MaskSaveLiteral !== 'undefined') {
            editMask.maskSaveLiteral = args.metadata.MaskSaveLiteral;
        }

        if (typeof args.metadata.MaskPlaceHolder !== 'undefined') {
            editMask.maskPlaceHolder = args.metadata.MaskPlaceHolder;
        }



        return editMask;
    }
}
//####app/linkView/childViewBuilder.js
function ChildViewBuilder() {
    this.build = function (context, args) {
        var linkView = args.parentView.getChildView(args.metadata.Name);
        linkView.setOpenMode(args.metadata.OpenMode);
        linkView.setContainer(args.metadata.Container);
        if (['Application', 'Page', 'Dialog'].indexOf(args.metadata.OpenMode) > -1) {
            InfinniUI.views.appendView(null, args.metadata, linkView);
        }

        return linkView;
    };
}
//####app/linkView/inlineViewBuilder.js
function InlineViewBuilder() {
    this.build = function (context, args){
        var that = this,
            metadata = args.metadata;

        var linkView = new LinkView(args.parentView);

        linkView.setViewTemplate(function(onViewReadyHandler){

            that.buildViewByMetadata(args, args.metadata['View'], function (view) {
                return onViewReadyHandler.call(null, view);
            });
        });

        if('OpenMode' in metadata){
            linkView.setOpenMode(metadata.OpenMode);
        }

        if('Container' in metadata){
            linkView.setContainer(metadata.Container);
        }

        if('DialogWidth' in metadata){
            linkView.setDialogWidth(metadata.DialogWidth);
        }

        return linkView;
    };



    this.buildViewByMetadata = function(params, viewMetadata, onViewReadyHandler){
        var builder = params.builder;
        var parentView = params.parentView;
        var parameters = this.buildParameters(params);

        if (viewMetadata !== null) {

            var view = builder.buildType("View", viewMetadata, {parentView: parentView, parent: params.parent, params: parameters});

            onViewReadyHandler(view);
        } else {
            logger.error('view metadata for ' + metadata + ' not found.');
        }
    };


   this.buildParameters = function(params){
        var parametersMetadata = params.metadata['Parameters'];
        var builder = params.builder;
        var parentView = params.parentView;
        var result = {};
        var parameter;

        if (typeof parametersMetadata !== 'undefined' && parametersMetadata !== null) {
            for (var i = 0; i < parametersMetadata.length; i++) {
                if (parametersMetadata[i].Value !== undefined) {
                    parameter = builder.buildType('Parameter', parametersMetadata[i], {parentView: parentView})
                    result[parameter.getName()] = parameter;
                }
            }
        }
        return result;
   };
}


//####app/linkView/linkView.js
function LinkView(parent) {
    this.openMode = 'Default';
    this.parent = parent;

    this.viewTemplate = function(){return '';};

    this.dialogWidth;
}

_.extend(LinkView.prototype, {

    setOpenMode: function (mode) {
        if (_.isEmpty(mode)) return;
        this.openMode = mode;
    },

    getOpenMode: function () {
        return this.openMode;
    },

    setContainer: function(containerName){
        this.containerName = containerName;
    },

    setViewTemplate: function(viewTemplate){
        this.viewTemplate = viewTemplate;
    },

    setDialogWidth: function(dialogWidth){
        dialogWidth = dialogWidth.toLowerCase();
        if(dialogWidth == 'extralarge'){
            dialogWidth = '100%';
        }
        this.dialogWidth = dialogWidth;
    },

    createView: function (resultCallback) {
        var that = this;

        this.viewTemplate(onViewReady);

        function onViewReady(createdView){
            that.view = createdView;

            that._initViewHandler(createdView);

            resultCallback(createdView);
        }

    },

    _initViewHandler: function(view){
        var that = this;
        var openMode = that.openMode;
        var openStrategy;
        var container;

        if(view.setParent){
            view.setParent(this.parent);
        }
        if(this.parent && this.parent.addChild){
            this.parent.addChild(view);
        }

        switch(openMode){
            case 'Container': {
                container = InfinniUI.global.containers[this.containerName];

                openStrategy = new OpenModeContainerStrategy();
                openStrategy.setView(view);
                openStrategy.setContainer(container);
                view.setOpenStrategy(openStrategy);
            } break;

            case 'Dialog': {
                openStrategy = new OpenModeDialogStrategy();
                openStrategy.setView(view);
                if(this.dialogWidth){
                    openStrategy.setDialogWidth(this.dialogWidth);
                }
                openStrategy.setView(view);
                view.setOpenStrategy(openStrategy);
            } break;
        }
    }
});

//####app/linkView/metadataViewBuilder.js
function MetadataViewBuilder() {

}

_.extend(MetadataViewBuilder.prototype, {

    build: function (context, args){
        var metadata = args.metadata;
        var viewTemplate = this.buildViewTemplate(args);
        var linkView = new LinkView(args.parent);

        linkView.setViewTemplate(viewTemplate);

        if('OpenMode' in metadata){
            linkView.setOpenMode(metadata.OpenMode);
        }

        if('Container' in metadata){
            linkView.setContainer(metadata.Container);
        }

        if('DialogWidth' in metadata){
            linkView.setDialogWidth(metadata.DialogWidth);
        }

        return linkView;
    },

    buildViewTemplate: function(params, cb){
        var metadata = params.metadata;
        var that = this;

        return function(onViewReadyHandler){
            var metadataProvider = window.providerRegister.build('MetadataDataSource', metadata);

            metadataProvider.getViewMetadata( function(viewMetadata){
                that.buildViewByMetadata(params, viewMetadata, onReady);
                function onReady() {
                    var args = Array.prototype.slice.call(arguments);
                    if (cb) {
                        cb.apply(null, args);
                    }
                    onViewReadyHandler.apply(null, args);
                }
            });
        };
    },

    buildViewByMetadata: function(params, viewMetadata, onViewReadyHandler){
        var builder = params.builder;
        var parentView = params.parentView;
        var logger = InfinniUI.global.logger;
        var parameters = this.buildParameters(params);

        if (viewMetadata !== null) {

            var view = builder.buildType("View", viewMetadata, {parentView: parentView, parent: params.parent, params: parameters});

            onViewReadyHandler(view);
        } else {
            logger.error('view metadata for ' + metadata + ' not found.');
        }
    },

    buildParameters: function(params){
        var parametersMetadata = params.metadata['Parameters'];
        var builder = params.builder;
        var parentView = params.parentView;
        var result = {};
        var parameter;

        if (typeof parametersMetadata !== 'undefined' && parametersMetadata !== null) {
            for (var i = 0; i < parametersMetadata.length; i++) {
                if (parametersMetadata[i].Value !== undefined) {
                    parameter = builder.buildType('Parameter', parametersMetadata[i], {parentView: parentView, basePathOfProperty: params.basePathOfProperty})
                    result[parameter.getName()] = parameter;
                }
            }
        }
        return result;
    }
});
//####app/linkView/openMode/openMode.js
var OpenMode = function () {

    var applications = [];
    var pages = [];

    this.getStrategy = function (linkView) {
        var openMode = linkView.openMode;

        var openModeStrategy = {
            Application: OpenModeApplicationStrategy,
            Container: OpenModeContainerStrategy,
            Page: OpenModePageStrategy,
            Dialog: OpenModeDialogStrategy
        };

        if (typeof openModeStrategy[openMode] === 'undefined') {
            throw new Error("Несуществующий OpenMode: " + openMode);
        }

        return new openModeStrategy[openMode](linkView);
    };

    this.getRootContainer = function () {
        return InfinniUI.config.$rootContainer || $('body');
    };

    this.resolveContainer = function (list, callback) {
        var name, layout;
        _.find(list, function (i) {
            if (_.isEmpty(i)) return false;
            name = i;
            layout = layoutPanelRegistry.getLayoutPanel(name);
            return !_.isEmpty(layout);
        });

        callback(name, layout);
    };

    this.registerPage = function (applicationView, view, openMethod) {
        pages.push({
            applicationView: applicationView,
            view: view,
            openMethod: openMethod
        });
    };

    this.registerApplication = function (applicationView, openMethod) {
        applications.push({
            applicationView: applicationView,
            openMethod: openMethod
        });
    };

    this.getApplicationViews = function () {
        return _.pluck(applications, 'view');
    };

    this.closeApplicationView = function (applicationView) {
        var i = _.findIndex(applications, function (app) {
            return app.applicationView === applicationView;
        });

        if (i !== -1) {
            applications.splice(i, 1);
        }

        //Получаем следущее доступное приложение
        var ln = applications.length;
        if (ln > 0) {
            var next = (i < ln) ? applications[i] : applications[ln - 1];
            return next.applicationView;
        }
    };

    this.closePageView = function (view) {
        var applicationView;
        var next;
        var i, ln;

        for (i = 0, ln = pages.length; i < ln; i = i + 1) {
            if (pages[i].view === view) {
                var data = pages.splice(i,1).pop();
                applicationView = data.applicationView;
                break;
            }
        }

        if (applicationView) {
            for (i = 0, ln = pages.length; i < ln; i = i + 1) {
                if (pages[i].applicationView === applicationView) {
                    next = pages[i].view;
                    break;
                }
            }
        }
        return next;
    };

    this.getApplication = function (applicationView) {
        return _.findWhere(applications, {applicationView: applicationView});
    };

    this.getPageViews = function (applicationView) {
        return _.chain(pages)
            .filter(function (data) {
                return data.applicationView === applicationView;
            })
            .pluck('view')
            .value();
    };

};

InfinniUI.global.openMode = new OpenMode();

//####app/linkView/openMode/strategy/openModeContainerStrategy.js
var OpenModeContainerStrategy = function () {
};

_.extend(OpenModeContainerStrategy.prototype, {
    setView: function(view){
        this.view = view;
    },

    setContainer: function(container){
        this.container = container;
    },

    open: function(){
        var logger = InfinniUI.global.logger;
        if(!this.container){
            logger.error('OpenModeContainerStrategy.open: не задан контейнер, в который должо быть помещено приложение');
        }

        this.container.setLayout(this.view);
    },

    close: function () {
        this.container.setLayout(null);
        this.view.remove();
    }
});
//####app/linkView/openMode/strategy/openModeDefaultStrategy.js
var OpenModeDefaultStrategy = function () {

};

_.extend(OpenModeDefaultStrategy.prototype, {
    setView: function(view){
        this.view = view;
    },

    open: function(){
        var $container = InfinniUI.config.$rootContainer || $('body');
        var oldView = $container.data('view');

        if(oldView){
            oldView.close();
        }

        $container
            .append(this.view.render())
            .data('view', this.view);
    },

    close: function () {
        this.view.remove();
    }
});

//####app/linkView/openMode/strategy/openModeDialogStrategy.js
var OpenModeDialogStrategy = function () {
    this.dialogWidth = 'default';
};

_.extend(OpenModeDialogStrategy.prototype, {
    template: InfinniUI.Template["linkView/template/dialog.tpl.html"],

    setView: function(view){
        this.view = view;
    },

    setDialogWidth: function(dialogWidth){
        this.dialogWidth = dialogWidth;
    },

    open: function(){
        var modalParams = {dialogWidth: this.dialogWidth};
        var $template = $(this.template(modalParams));
        var $closeButton = $('button', $template);
        var $header =  $('h4', $template);

        var $modal = $template.appendTo($('body'));
        this.$modal = $modal;

        $modal.on('shown.bs.modal', function (e) {
            $(e.target).find('.first-focus-element-in-modal').focus();
        });
        var $modalBody = $modal.find('.modal-body');

        $modalBody.append(this.view.render());

        $modal.modal({
            show: true,
            backdrop: 'static',
            modalOverflow: true,
            focus: this
        });

        this._initBehaviorFocusingInModal($modal, $modalBody);

        var view = this.view;

        var
            headerTemplate = view.getHeaderTemplate();
        $closeButton.toggleClass('hidden', !view.getCloseButton());
        $header.append(headerTemplate().render());

        $modal.find('.pl-close-modal').on('click', function(){
            view.close();
        });

    },

    _initBehaviorFocusingInModal: function($modal, $modalBody){
        $modalBody.append('<div class="lastfocuselementinmodal" tabindex="0">');
        $modal.find('.lastfocuselementinmodal').on('focusin', function(){
            $modal.find('.firstfocuselementinmodal').focus();
        });
        $modal.keydown(function(e){
            if($(document.activeElement).hasClass('lastfocuselementinmodal') && (e.which || e.keyCode) == 9){
                e.preventDefault();
                $modal.find('.firstfocuselementinmodal').focus();
            }

            if($(document.activeElement).hasClass('firstfocuselementinmodal') && (e.which || e.keyCode) == 9 && e.shiftKey){
                e.preventDefault();
                $modal.find('.lastfocuselementinmodal').focus();
            }
        });
    },

    close: function () {
        this.view.remove();
        if (this.$modal) {
            this.$modal.modal('hide');
            this.$modal.remove();
        }

    }
});
//####app/localizations/culture.js
function Culture(name){
    this.name = name;
    this.caption = InfinniUI.localizations[name].caption;
    this.dateTimeFormatInfo = InfinniUI.localizations[name].dateTimeFormatInfo;
    this.numberFormatInfo = InfinniUI.localizations[name].numberFormatInfo;
}

window.InfinniUI.global.culture = new Culture(InfinniUI.config.lang);
//####app/localizations/dateTimeFormatInfo.js
InfinniUI.localizations['ru-RU'].dateTimeFormatInfo = {
    monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
    abbreviatedMonthNames: ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"],
    dayNames: [ "воскресенье","понедельник","вторник","среда","четверг","пятница","суббота" ],
    abbreviatedDayNames: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
    dateSeparator: '.',
    timeSeparator: ':',
    amDesignator: '',
    pmDesignator: '',
    firstDayOfWeek: 1
};

InfinniUI.localizations['en-US'].dateTimeFormatInfo = {
    monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
    abbreviatedMonthNames: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    dayNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    abbreviatedDayNames: ["Sun", "Mon","Tue","Wed","Thu","Fri","Sat"],
    dateSeparator: '/',
    timeSeparator: ':',
    amDesignator: 'AM',
    pmDesignator: 'PM',
    firstDayOfWeek: 0
};
//####app/localizations/localized.js
var localized = InfinniUI.localizations [InfinniUI.config.lang];
//####app/localizations/numberFormatInfo.js
InfinniUI.localizations['ru-RU'].numberFormatInfo = {
    numberDecimalDigits: 2,
    numberDecimalSeparator: ',',
    numberGroupSeparator: ' ',
    numberNegativePattern: '-n',
    numberPositivePattern: 'n',

    percentDecimalDigits: 2,
    percentDecimalSeparator: ',',
    percentGroupSeparator: ' ',
    percentSymbol: '%',
    percentNegativePattern: '-p%',
    percentPositivePattern: 'p%',

    currencyDecimalDigits: 2,
    currencyDecimalSeparator: ',',
    currencyGroupSeparator: ' ',
    currencySymbol: 'р.',
    currencyNegativePattern: '-c$',
    currencyPositivePattern: 'c$',

    negativeInfinitySymbol: '-бесконечность',
    positiveInfinitySymbol: 'бесконечность',
    NaNSymbol: 'NaN'
};

InfinniUI.localizations['en-US'].numberFormatInfo = {
    numberDecimalDigits: 2,
    numberDecimalSeparator: '.',
    numberGroupSeparator: ',',
    numberNegativePattern: '-n',
    numberPositivePattern: 'n',

    percentDecimalDigits: 2,
    percentDecimalSeparator: '.',
    percentGroupSeparator: ',',
    percentSymbol: '%',
    percentNegativePattern: '-p %',
    percentPositivePattern: 'p %',

    currencyDecimalDigits: 2,
    currencyDecimalSeparator: '.',
    currencyGroupSeparator: ',',
    currencySymbol: '$',
    currencyNegativePattern: '($c)',
    currencyPositivePattern: '$c',

    negativeInfinitySymbol: '-Infinity',
    positiveInfinitySymbol: 'Infinity',
    NaNSymbol: 'NaN'
};
//####app/localizations/patternDateFormats.js
InfinniUI.localizations['ru-RU'].patternDateFormats = {
    f: 'dd MMMM yyyy г. HH:mm',
    F: 'dd MMMM yyyy г. HH:mm:ss',

    g: 'dd.MM.yyyy HH:mm',
    G: 'dd.MM.yyyy HH:mm:ss',

    d: 'dd.MM.yyyy',
    D: 'dd MMMM yyyy г.',

    t: 'H:mm',
    T: 'H:%m:%s',

    y: 'MMMM yyyy', Y: 'MMMM yyyy',
    m: 'MMMM yy', M: 'MMMM yy',

    s: 'yyyy-MM-ddTHH:mm:ss',
    u: 'yyyy-MM-dd HH:mm:ssZ'
};

InfinniUI.localizations['en-US'].patternDateFormats = {
    f: 'dddd, MMMM dd, yyyy h:%m tt',
    F: 'dddd, MMMM dd, yyyy h:%m:%s tt',

    g: 'M/%d/yyyy h:%m tt',
    G: 'M/%d/yyyy h:%m:%s tt',

    d: 'M/%d/yyyy',
    D: 'dddd, MMMM dd, yyyy',

    t: 'h:%m tt',
    T: 'h:%m:%s tt',

    y: 'MMMM, yyyy', Y: 'MMMM, yyyy',
    m: 'MMMM yy', M: 'MMMM yy',

    s: 'yyyy-MM-ddTHH:mm:ss',
    u: 'yyyy-MM-dd HH:mm:ssZ'
};
//####app/script/scriptBuilder.js
/**
 *
 * @constructor
 */
function ScriptBuilder() {
}

ScriptBuilder.prototype.build = function (context, args) {
    var
        metadata = args.metadata,
        name = metadata.Name,
        body = metadata.Body;

    var func = new Function('context', 'args', body);

    return function (context, args) {
        var result;
        try {
            result = func.call(undefined, context, args);
        } catch (err) {
            console.groupCollapsed('%2$s: %1$c%3$s', 'color: #ff0000', name, err.message);
            console.error(body);
            console.groupEnd();
        }
        return result;
    };
};


//####app/script/scriptExecutor.js
/**
 *
 * @param parent
 * @constructor
 */
function ScriptExecutor(parent) {
    this.parent = parent;
}

/**
 *
 * @param {string} scriptName
 * @param {Object} args
 * @returns {*}
 */
ScriptExecutor.prototype.executeScript = function (scriptName, args) {
    var parent = this.parent;
    var context = parent.getContext();
    var result;
    var scriptBody;
    var scriptCompiled;

    if(scriptName.substr(0, 1) == '{'){
        scriptBody = scriptName.substr(1, scriptName.length - 2);
        scriptCompiled = this.buildScriptByBody(scriptBody);
    }else{
        scriptCompiled = parent.getScripts().getById(scriptName);
        if(scriptCompiled){
            scriptCompiled = scriptCompiled.func;
        }
    }



    if (context && scriptCompiled) {
        result = scriptCompiled.call(undefined, context, args);
    }

    return result;
};

ScriptExecutor.prototype.buildScriptByBody = function(scriptBody){
    var context = this.parent.getContext();
    var args = {
        metadata: {
            "Body": scriptBody,
            "Name": "InlineScript"
        }
    };
    var scriptBuilder = new ScriptBuilder();
    return scriptBuilder.build(context, args);
};
//####app/services/ajaxLoaderIndicator/ajaxLoaderIndicator.js
var AjaxLoaderIndicator = function ($target, config) {
    var defaults = {
        delay: 50
    };

    var options = _.defaults({}, config, defaults);

    var model = new AjaxLoaderIndicatorModel({}, options);
    var ajaxLoaderIndicator = new AjaxLoaderIndicatorView({model: model});


    var $indicator = ajaxLoaderIndicator.render().$el;
    $target.append($indicator);
};


//####app/services/ajaxLoaderIndicator/ajaxLoaderIndicatorModel.js
var AjaxLoaderIndicatorModel = Backbone.Model.extend({

    defaults: {
        requests: 0,
        progress: false
    },

    initialize: function (attributes, options) {
        var exchange = window.InfinniUI.global.messageBus;

        exchange.subscribe(messageTypes.onDataLoaded, this.onDataLoaded.bind(this));
        exchange.subscribe(messageTypes.onDataLoading, this.onDataLoading.bind(this));

        var onRequestsChanged = (options.delay > 0) ? _.debounce(this.onRequestsChanged.bind(this), 50) :
            this.onRequestsChanged.bind(this);

        this.on('change:requests', onRequestsChanged);
    },

    onDataLoading: function () {
        var requests = this.get('requests');
        this.set('requests', requests + 1);
    },

    onDataLoaded: function () {
        var requests = this.get('requests');
        this.set('requests', requests - 1);
    },

    onRequestsChanged: function (model, value) {
        this.set('progress', value > 0);
    }

});
//####app/services/ajaxLoaderIndicator/ajaxLoaderIndicatorView.js
var AjaxLoaderIndicatorView = Backbone.View.extend({

    className: 'pl-ajaxloader',

    template: InfinniUI.Template["services/ajaxLoaderIndicator/template/template.tpl.html"],

    hiddenClassName: 'hidden',

    initialize: function () {
        var exchange = window.InfinniUI.global.messageBus;
        this.listenTo(this.model, 'change:progress', this.updateProgress);
    },

    render: function () {
        this.$el.html(this.template());
        this.updateProgress();
        return this;
    },

    updateProgress: function () {
        var progress = this.model.get('progress');
        this.$el.toggleClass(this.hiddenClassName, !progress);
    }

});
//####app/services/notifyService.js
/**
 * @description Отображает всплывающие сообщения на событие onNotifyUser.
 * Используется плдагин http://codeseven.github.io/toastr/
 */
InfinniUI.NotifyService = (function () {

    var exchange = window.InfinniUI.global.messageBus;

    exchange.subscribe(messageTypes.onNotifyUser, function (context, args) {
        var
            messageText = args.value.messageText,
            messageType = args.value.messageType || 'info';

        var type;

        switch (messageType) {
            case 'success':
            case 'error':
            case 'warning':
            case 'info':
                type = messageType;
                break;
            default:
                type = 'info';
        }

        if (typeof toastr !== 'undefined') {
            toastr[type](messageText);
        }

    });
})();
//####app/services/toolTipService/toolTipService.js
InfinniUI.ToolTipService = (function () {

    var template = InfinniUI.Template["services/toolTipService/template/tooltip.tpl.html"];

    var exchange = window.InfinniUI.global.messageBus;

    exchange.subscribe(messageTypes.onToolTip.name, function (context, args) {
        var message = args.value;
        initToolTip(getSourceElement(message.source));
    });

    exchange.subscribe(messageTypes.onToolTipShow.name, function (context, args) {
        var message = args.value;
        showToolTip(getSourceElement(message.source), message.content);
    });


    exchange.subscribe(messageTypes.onToolTipHide.name, function (context, args) {
        var message = args.value;
        hideToolTip(getSourceElement(message.source), message.content);
    });

    function getSourceElement(source) {
        return source.control.controlView.$el
    }
    function showToolTip($element, content) {
        $element
            .tooltip({
                html: true,
                title:content
            })
            .tooltip('show');
    }

    function hideToolTip($element) {
        $element.tooltip('hide');
    }

    function initToolTip($element) {

    }
})();
//####extensions/excelButton.js
function ExcelButton() {
    this.render = function (target, parameters, context) {
        var $button = $('<a>')
            .attr('href', '#')
            .append($('<img src="/launchers/main/excel.png" />').css('width', '34px'))
            .click(function () {
                context.Global.executeAction({
                    OpenViewAction: {
                        View: {
                            AutoView: {
                                ConfigId: 'Schedule',
                                DocumentId: 'OperationAppointment',
                                MetadataName: 'ExcelView',
                                OpenMode: 'Dialog'
                            }
                        }
                    }
                });

                return false;
            });

        target.append($button);
    }
}
//####extensions/testt/testt.js
function Testt(context, args) {
    this.context = args.context;

    this.$el = args.$el;
    this.parameters = args.parameters;
    this.itemTemplate = args.itemTemplate;
}

_.extend( Testt.prototype, {
    render: function(){
        this.$el
            .append(this.itemTemplate(this.context, {index:0}).render());
    }
});