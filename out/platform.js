;(function(){
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

window.InfinniUI.Providers = {};
//####app/elements/_common/enums/colorStyle.js
InfinniUI.ColorStyle = {
    transparent: "Transparent",

    primary1: "Primary1",
    primary2: "Primary2",
    primary3: "Primary3",

    accent1: "Accent1",
    accent2: "Accent2",
    accent3: "Accent3",

    background1: "Background1",
    background2: "Background2",
    background3: "Background3",
    background4: "Background4",

    white: "White",
    black: "Black"
};
//####app/elements/_common/enums/elementHorizontalAlignment.js
InfinniUI.ElementHorizontalAlignment = {
    left: 'Left',
    right: 'Right',
    center: 'Center',
    justify: 'Stretch'
};

//####app/elements/_common/enums/textHorizontalAlignment.js
InfinniUI.TextHorizontalAlignment = {
    left: 'Left',
    right: 'Right',
    center: 'Center',
    justify: 'Justify'
};

//####app/elements/_common/enums/textStyle.js
InfinniUI.TextStyle = {
    display4: "Display4",
    display3: "Display3",
    display2: "Display2",
    display1: "Display1",

    headline: "Headline",
    title: "Title",
    subhead: "Subhead",
    caption: "Caption",

    body1: "Body1",
    body2: "Body2",

    menu: "Menu",
    button: "Button"
};
//####app/elements/scrollPanel/enums/scrollVisibility.js
InfinniUI.ScrollVisibility = {
    auto: 'Auto',
    visible: 'Visible',
    hidden: 'Hidden'
};


//####app/elements/stackPanel/enums/stackPanelOrientation.js
InfinniUI.StackPanelOrientation = {
    horizontal: 'Horizontal',
    vertical: 'Vertical'
};



//####app/elements/tabPanel/enums/tabHeaderLocation.js
InfinniUI.TabHeaderLocation = {
    none: 'None',
    left: 'Left',
    top: 'Top',
    right: 'Right',
    bottom: 'Bottom'
};

//####app/elements/tabPanel/enums/tabHeaderOrientation.js
InfinniUI.TabHeaderOrientation = {
    horizontal: 'Horizontal',
    vertical: 'Vertical'
};
//####app/config.js
_.defaults( InfinniUI.config, {
    lang: 'ru-RU',
    maxLengthUrl: 2048,
    cacheMetadata: false, //boolean - enable/disable cache | milliseconds
    serverUrl: 'http://localhost:9900',//'http://10.0.0.32:9900';
    configName: 'InfinniUI'
//devblockstart
    ,editorService: {
        url: 'http://localhost:5500/api/metadata'
    }
//devblockstop

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

window.InfinniUI.Collection = Collection;


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
    var changed = false;
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
function CollectionEventManager () {}

window.InfinniUI.CollectionEventManager = CollectionEventManager;


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

window.InfinniUI.ActionOnLoseFocus = ActionOnLoseFocus;

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

window.InfinniUI.BasePathOfProperty = BasePathOfProperty;

_.extend(BasePathOfProperty.prototype, {
    /*возвращает полный путь к свойству элемента в коллекции*/
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

    /*возвращает полный путь к свойству элемента в коллекции по заданному относительному пути*/
    resolveRelativeProperty: function(relativeProperty) {
        var property;
        if(this.basePathOfProperty != ''){
            property = this.basePathOfProperty + '.' + relativeProperty;
        }else{
            property = relativeProperty;
        }
        return this.resolveProperty(property);
    },

    /*создает BasePathOfProperty следующего уровня*/
    buildChild: function(basePathOfProperty, baseIndex){
        return new BasePathOfProperty(basePathOfProperty, baseIndex, this);
    },

    /*создает BasePathOfProperty следующего уровня с относительным путем*/
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

//####app/utils/blobUtils.js
/**
 * Набор утилит для работы с BlobData объектами
 **/


window.InfinniUI.BlobUtils = (function () {

    var blobUtils = {
        isFileInfo: isFileInfo,
        getContentId: getContentByName.bind(null, 'Id'),
        getName: getContentByName.bind(null, 'Name'),
        getSize: getContentByName.bind(null, 'Size'),
        getTime: getContentByName.bind(null, 'Time'),
        getType: getContentByName.bind(null, 'Type')
    };

    return blobUtils;

    function isFileInfo (data) {
        return data && blobUtils.getContentId(data);
    }

    function getContentByName(name, data, defaultValue) {
        return _.isObject(data) ? data[name] : defaultValue;
    }

})();





//####app/utils/clone.js
_.mixin({
    deepClone: function (value) {
        if (value !== null && typeof value !== 'undefined') {
            return JSON.parse(JSON.stringify(value));
        }
        return value;
    }
});
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

    init();

    var _defaultTimeZone;

    return {
        toISO8601: toISO8601,
        dateToTimestamp: dateToTimestamp,
        dateToTimestampTime: dateToTimestampTime,
        changeTimezoneOffset: changeTimezoneOffset,
        restoreTimezoneOffset: restoreTimezoneOffset,
        toDate: toDate,
        createDate: createDate,
        parseTimeISO8601toDate: parseTimeISO8601toDate,
        parseISO8601toDate:parseISO8601toDate,
        checkRangeDate: checkRangeDate,
        getNearestDate: getNearestDate,
        cloneDate: cloneDate,
        getDefaultTimeZone: getDefaultTimezone
    };

    function parseISO8601toDate(value) {
        if (value === null || typeof value ==='undefined') {
            return value;
        }
        return moment(value).toDate();
    }

    function cloneDate(date) {
        if (date instanceof Date) {
            return new Date(date.getTime());
        }
        return date;
    }

    /**
     * @description Возвращает ближаешее к исходному значению из диапазона
     * @param date
     * @param min
     * @param max
     * @returns {Date}
     */
    function getNearestDate(date, min, max) {
        var nearest;

        var mMin = moment(min || null),
            mMax = moment(max || null),
            mVal = moment(date);


        if (mMin.isValid() && mVal.isBefore(mMin)) {
            nearest = mMin.toDate();
        } else if (mMax.isValid() && mVal.isAfter(mMax)) {
            nearest = mMax.toDate();
        } else {
            nearest = date;
        }

        return nearest;
    }

    /**
     * @description Проверяет, что дата находится в заданном диапазоне
     * @param date
     * @param minDate
     * @param maxDate
     * @param {String} precision
     * @returns {boolean}
     */
    function checkRangeDate(date, minDate, maxDate, precision) {
        var success = true;

        var mMin = moment(minDate || null),
            mMax = moment(maxDate || null),
            mVal = moment(date);


        if (mMin.isValid() && mMax.isValid()) {
            success = mVal.isSameOrBefore(mMax, precision) && mVal.isSameOrAfter(mMin, precision);
        } else if (mMin.isValid()) {
            success = mVal.isSameOrAfter(mMin, precision);
        } else if (mMax.isValid()) {
            success = mVal.isSameOrBefore(mMax, precision);
        }

        return success;
    }

    function parseTimeISO8601toDate(value) {
        var date;
        var formats = ['HH:mm', 'HH:mm:ss', 'HH:mm:ss.SSS', 'HHmm', 'HHmmss', 'HHmmss.SSS'];
        var m = moment(value, formats);
        if (m.isValid()) {
            date = new Date(0);
            date.setHours(m.hours(), m.minute(), m.second(), m.millisecond());
        }
        return date;
    }

    function toDate(value) {
        var m = moment(value);
        var date = null;

        if (m.isValid()) {
            date = m.toDate();
        }

        return date;
    }

    function changeTimezoneOffset(date, timezoneOffset) {
        var newDate = date;

        if (typeof timezoneOffset !== 'undefined' && date instanceof Date) {
            var currentOffset = date.getTimezoneOffset();

            if (timezoneOffset !== currentOffset) {
                newDate = new Date(date.getTime() + (currentOffset - timezoneOffset) * 60 * 1000);
            }
        }

        return newDate;
    }

    function restoreTimezoneOffset(date, timezoneOffset) {
        var newDate = date;

        if (typeof timezoneOffset !== 'undefined' && date instanceof Date) {
            var currentOffset = date.getTimezoneOffset();

            if (timezoneOffset !== currentOffset) {
                newDate = new Date(date.getTime() - (currentOffset - timezoneOffset) * 60 * 1000);
            }
        }

        return newDate;
    }

    /**
     * @description Возвращает строковое представление даты в формате YYYY-MM-DDTHH:mm:ss.sss+HH:MM
     * @param {Date} date
     * @param {Object} options
     * @param {Number} options.timezoneOffset Смещение часового пояса относительно часового пояса UTC в минутах
     * @returns {string|null}
     */
    function toISO8601(date, options) {

        var config = options || {};

        if (typeof date === 'undefined' || date === null) {
            return null;
        }

        if (date.constructor !== Date) {
            return null;
        }

        var _date = changeTimezoneOffset(date, config.timezoneOffset);

        var datePart = [
            padInt(_date.getFullYear(), 4),
            padInt(_date.getMonth() + 1, 2),
            padInt(_date.getDate(), 2)
        ].join('-');

        var timePart = [
            padInt(_date.getHours(), 2),
            padInt(_date.getMinutes(), 2),
            padInt(_date.getSeconds(), 2)
        ].join(':');

        var sssPart = padInt(_date.getMilliseconds(), 3) + '0';// '000' + '0'


        var timezoneOffset = config.timezoneOffset;
        if (typeof timezoneOffset === 'undefined' || timezoneOffset === null) {
            timezoneOffset = date.getTimezoneOffset();
        }

        var tz = Math.abs(timezoneOffset);
        var tzOffsetPart = Math.sign(timezoneOffset) > 0 ? '-' : '+';
        var tzPart = [
            padInt(Math.floor(tz / 60), 2),
            padInt(tz % 60, 2)
        ].join(':');

        return datePart + 'T' + timePart + '.' + sssPart + tzOffsetPart + tzPart;
    }

    /**
     * @description Возвращает заданную дату как количество секунд, прошедших с 01-01-1970T00:00 по UTC
     * @param {String|Date} date ISO8601
     */
    function dateToTimestamp(date) {
        var _date, datetime = null;

        if (date && date.constructor === String) {
            _date = new Date(date);
        } else if (date && date.constructor === Date) {
            _date = date;
        }

        if (_date) {
            _date.setUTCHours(0, 0, 0, 0);
            datetime = _date.getTime() / 1000;
        }

        return datetime;
    }

    function dateToTimestampTime(date) {
        var time = null, _date, datetime;

        if (date && date.constructor === String) {
            _date = new Date(date);
        } else if (date && date.constructor === Date) {
            _date = date;
        }

        if (_date) {
            datetime = new Date(0);
            datetime.setUTCHours(_date.getUTCHours(), _date.getUTCMinutes(), _date.getUTCSeconds(), _date.getUTCMilliseconds());
            time = datetime.getTime() / 1000;
        }

        return time;
    }

    function createDate(d) {
        var date;

        if (typeof d === Date) {
            date = new Date(d.getTime());
        } else if (typeof d === 'number') {
            //Числовое значение интерпретируем как секунды (as unix-time)!
            date = new Date(d * 1000);
        } else if (typeof d === 'undefined' || d === null) {
            date = null;
        } else {
            date = toDate(d);
        }

        return date;
    }

    function getDefaultTimezone() {
        return _defaultTimeZone;
    }

    function padInt(value, size) {
        var str = '' + value;
        var pad = '';
        if (str.length < size) {
            pad = Array(size - str.length + 1).join('0');
        }
        return pad + str;
    }

    function init() {

        var date = new Date();
        _defaultTimeZone = date.getTimezoneOffset();

        if (!Math.sign) { //fix for devices not support ES6
            Math.sign = function (x) {
                return x ? x < 0 ? -1 : 1 : 0;
            };
        }
    }

})();
//####app/utils/domHelper.js
var domHelper = {

    whenReady: function(conditionFunction, onConditionFunction, n){
        var that = this;

        if(n === undefined){
            n = 100;
        }

        if(!conditionFunction()){
            if(n>0){
                setTimeout( function(){
                    that.whenReady(conditionFunction, onConditionFunction, n-1);
                }, 510);
            }
        }else{
            onConditionFunction();
        }
    }

};

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

            if(nextTermCollectionIndex >= 0){
                if(!$.isArray(termValue)){
                    termValue = [];
                }

                setCollectionItem(parent, termCollectionIndex, termValue);
            }else{
                if(!$.isPlainObject(termValue)){
                    termValue = {};
                }

                setObjectProperty(parent, term, termValue);
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
                } else if(propertyValue instanceof File){
                    setPropertyByPath(target, propertyPathTerms, propertyValue);
                } else{
                    setPropertyByPath(target, propertyPathTerms, propertyValue);
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



//####app/utils/eventsManager.js
function EventsManager () {
    this.handlers = {};
}

window.InfinniUI.EventsManager = EventsManager;

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
//####app/utils/filterItems.js
var filterItems = (function() {

	return function(items, filter) {
		if( !filter ){
			return items;
		}

		var itemsForFilter = JSON.parse(JSON.stringify(items)),
				filterMethods = filterItems.filterMethods,
				filterTree = filterItems.filterTreeBuilder.buildUpFilterTree(filter);

		function stringToNum(value) {
			if( typeof value === 'string' && !isNaN(value) ) {
				value = +value;
			}
			return value;
		}
		function stringToBoolean(value) {
			if( value === 'true' ) {
				value = true;
			} else if( value === 'false' ) {
				value = false;
			} else if( value === 'null' ) {
				value = null;
			}
			return value;
		}
		function stringToArr(value) {
			if( typeof value === 'string' && value.search(/\[[\'a-zA-Z0-9,]+\]/) !== -1 ) {
				value = value.slice(1, -1).split(',');
				for( var i = 0, ii = value.length; i < ii; i += 1 ) {
					if( value[i].slice(-1) === "'" ) {
						value[i] = value[i].slice(1, -1);
					}
					value[i] = stringToBoolean( value[i] );
					value[i] = stringToNum( value[i] );
				}
			}
			return value;
		}
		function findContext(currentContext, currentFunc) {
			if( currentFunc.functionName === 'match' ) {
				currentContext = currentFunc.children[0].valueName;
			}
			return currentContext;
		}
		function filterExec(filterTree, items, context) { // filterTree is object, items is array
			var tmpChild1, tmpChild2 = [];
			// find context
			context = findContext( context, filterTree );
			for( var j = 0, jj = filterTree.children.length; j < jj; j += 1 ) {
				// if any child is function
				// call filterExec with children of this child
				if( filterTree.children[j].type === 'function' ) {
					tmpChild1 = filterTree.children[j];

					filterTree.children[j].valueName = filterExec(tmpChild1, items, context);
					filterTree.children[j].newType = 'value';
				}
				if( filterTree.children[j].type === 'value' || filterTree.children[j].newType === 'value' ) {
					if( filterTree.children[j].type === 'value' ) {
						filterTree.children[j].valueName = stringToNum( filterTree.children[j].valueName ); // check on Number
						filterTree.children[j].valueName = stringToBoolean( filterTree.children[j].valueName ); // check on Boolean
						filterTree.children[j].valueName = stringToArr( filterTree.children[j].valueName ); // check on Array
					}
					tmpChild2.push( filterTree.children[j].valueName );
				}
			}
			return filterMethods[filterTree.functionName](tmpChild2, items, context); // tmpChild2 is array
		}
		return filterExec(filterTree, itemsForFilter);
	};
})(filterItems);

window.InfinniUI.FilterItems = filterItems;


filterItems.filterTreeBuilder = (function() {
	var that = {},
			splitStringToArray = function(filter) { //filter is string
				var tmpArr,
						tmpNum,
						tmpString,
						tmpString2,
						tmpRE,
						reForDates = /date\(\'[0-9a-zA-Z\:\-\+\.\s]+\'\)/g,
						reForParamAsArray = /\,[a-zA-Z0-9\'\,\_\.]+\)/g,
						reForArrayFromOneElem = /\[[a-zA-Z0-9\'\_\.]+\]/g,
						reForElemsOfTree = /[a-zA-Z]+[(]|\[[a-zA-Z0-9\S]+\]|[-\']{0,1}[a-zA-Z0-9_\.]+[\']{0,1}[,)$]/g,
						reForClosingBrackets = /[)]/g,
						reForRegExp = /\'([a-zA-Z0-9\S\W\D]+\s*)+\'/g,
						reForSpaces = /\s+/g,
						reForFewWordsInQuotes = /\'([a-zA-Z0-9\s]+\s*)+\'/g,
						arr = [];
				while( tmpArr = reForDates.exec(filter) ) { // search all dates and convert it to number of s [0.000]
					tmpNum = Date.parse( tmpArr[0].slice(6, -2) ) / 1000 + '';
					filter = filter.slice(0, tmpArr.index) + tmpNum + filter.slice(tmpArr.index + tmpArr[0].length);
					reForDates.lastIndex = tmpArr.index + tmpNum.length;
				}
				while( tmpArr = reForRegExp.exec(filter) ) { // search for regexp
					tmpNum = tmpArr[0];
					if( tmpNum.search(reForSpaces) !== -1 || tmpNum.search(reForFewWordsInQuotes) !== -1 ) {
						while( tmpString = reForFewWordsInQuotes.exec(tmpNum) ) {
							tmpString2 = tmpString[0].replace(reForSpaces, '_');
							tmpNum = tmpNum.slice(0, tmpString.index) + tmpString2 + tmpNum.slice(tmpString.index + tmpString[0].length);
						}
					} else {
						tmpRE = tmpNum.slice(1, -1);
						tmpNum = 'tmpRE';
					}
					filter = filter.slice(0, tmpArr.index) + tmpNum + filter.slice(tmpArr.index + tmpArr[0].length);
					reForRegExp.lastIndex = tmpArr.index + tmpNum.length;
				}
				filter = filter.replace(/\s+/g, '');
				while( tmpArr = reForParamAsArray.exec(filter) ) { // search second param
					tmpNum = '[' + tmpArr[0].slice(1, -1) + '])';
					filter = filter.slice(0, tmpArr.index + 1) + tmpNum + filter.slice(tmpArr.index + tmpArr[0].length);
					reForParamAsArray.lastIndex = tmpArr.index + tmpNum.length;
				}
				while( tmpArr = reForArrayFromOneElem.exec(filter) ) { // convert array from 1 element to number or string or boolean
					tmpNum = tmpArr[0].slice(1, -1);
					filter = filter.slice(0, tmpArr.index) + tmpNum + filter.slice(tmpArr.index + tmpArr[0].length);
					reForArrayFromOneElem.lastIndex = tmpArr.index + tmpNum.length;
				}
				while( tmpArr = reForElemsOfTree.exec(filter) ) { // search all functions and values with their index
					if( tmpArr[0].length > 1 && (tmpArr[0].slice(-1) === ',' || tmpArr[0].slice(-1) === ')')  ) {
						tmpArr[0] = tmpArr[0].slice(0, -1);
					}
					if( tmpArr[0].length > 1 && tmpArr[0].slice(0, 1) === "'" ) {
						tmpArr[0] = tmpArr[0].slice(1, -1);
					}
					if( tmpArr[0].search(/tmpRE/) !== -1 ) {
						tmpArr[0] = tmpArr[0].slice(1, -1).split(',');
						tmpArr[0][0] = tmpRE;
					}
					arr.push(tmpArr);
				}
				while( tmpArr = reForClosingBrackets.exec(filter) ) { // search all closing brackets with their index
					arr.push(tmpArr);
				}
				arr.sort(function(a, b) { // sort arr by indexes to put all data in right order
					return a.index - b.index;
				});
				return arr;
			},
			divideToFunctionsAndValues = function(arrayToDivide) { //arrayToDivide is array
				var tmpArr = [],
						values = [],
						filterArr = [],
						counter = 0,
						that,
						tmpSymbol,
						thatValue,
						firstPart;
				// split all data to different functions
				for( var i = 0, ii = arrayToDivide.length; i < ii; i += 1 ) {
					if( typeof arrayToDivide[i][0] === 'string' ) {
						tmpSymbol = arrayToDivide[i][0].slice(-1);
					} else {
						tmpSymbol = ']';
					}
					if( tmpSymbol === '(' ) { // define functions from string
						that = {};
						that.type = 'function';
						that.functionName = arrayToDivide[i][0].slice(0, -1);
						that.index = arrayToDivide[i].index;
						tmpArr.push( that );
					} else if( tmpSymbol === ')' ) { // define where end of function
						filterArr[counter] = [];
						firstPart = tmpArr.pop();
						firstPart.range = [];
						firstPart.range.push( firstPart.index );
						firstPart.children = [];
						firstPart.range.push( arrayToDivide[i].index );
						filterArr[counter] = firstPart;
						counter += 1;
					} else { // define params that are values
						thatValue = {};
						thatValue.type = 'value';
						thatValue.valueName = arrayToDivide[i][0];
						thatValue.index = arrayToDivide[i].index;
						values.push( thatValue );
					}
				}
				return [filterArr, values];
			},
			addValuesAsChildren = function(filterArr, values) { // filterArr, values are arrays
				//add values to right place as children for functions
				//define right place by range of index property
				for( var i = 0, ii = values.length; i < ii; i += 1 ) {
					for( var j = 0, jj = filterArr.length; j < jj; j += 1 ) {
						if( values[i] !== null ) {
							if( values[i].index > filterArr[j].range[0] && values[i].index < filterArr[j].range[1] ) {
								filterArr[j].children.push( values[i] );
								values[i] = null;
							}
						}
					}
				}
				return filterArr;
			},
			filterArrToTree = function(filterArr) { // filterArr is array
				// build up a filter tree
				// by putting some functions as children for other
				for( var i = 0; i < filterArr.length; i += 1 ) {
					for( var j = 0; j < filterArr.length; j += 1 ) {
						if( filterArr[j] !== null || filterArr[i] !== null ) {
							//search for first result[j] where we can put result[i] as his child
							//if find, put it and remove result[i]
							if( filterArr[i].range[0] > filterArr[j].range[0] && filterArr[i].range[1] < filterArr[j].range[1] ) {
								//if result[j] already have any children, check their indexes to define where put new child
								if( filterArr[j].children[0] !== undefined && filterArr[j].children[0].index > filterArr[i].range[0] ) {
									filterArr[j].children.unshift( filterArr[i] );
									filterArr.splice(i, 1);
									i -= 1;
									break;
								} else {
									filterArr[j].children.push( filterArr[i] );
									filterArr.splice(i, 1);
									i -= 1;
									break;
								}
							}
						}
					}
				}
				return filterArr[0];
			};
	that.buildUpFilterTree = function(filter) { // filter is string
		var tmpArr;
		tmpArr = splitStringToArray(filter);
		tmpArr = divideToFunctionsAndValues(tmpArr);
		tmpArr = addValuesAsChildren(tmpArr[0], tmpArr[1]);
		return filterArrToTree(tmpArr);
	};
	return that;
})();

//sub method for filterItems with filter methods
filterItems.filterMethods = (function() {
	var that = {};

	that.eq = function(value, items, context) { // value is array: value[0] - param, value[1] - value
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;
		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( globalUI.getPropertyValue( items[i][context][j], value[0] ) === value[1] ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( globalUI.getPropertyValue( items[i], value[0] ) === value[1] ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};

	that.and = function(values, items, context) {
		return _.intersection.apply(_, values);
	};

	that.or = function(values, items, context) {
		return _.union.apply(_, values);
	};

	that.not = function(values, items, context) { // values[0] is array
		var tmpResult = items.slice();
		return _.difference(tmpResult, values[0]);
	};

	that.notEq = function(value, items, context) {
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( globalUI.getPropertyValue( items[i][context][j], value[0] ) !== value[1] ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( globalUI.getPropertyValue( items[i], value[0] ) !== value[1] ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};
	// compare for numbers and dates
	that.gt = function(value, items, context) { // value is array: value[0] - param, value[1] - value
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( globalUI.getPropertyValue( items[i][context][j], value[0] ) > value[1] ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( globalUI.getPropertyValue( items[i], value[0] ) > value[1] ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};
	// compare for numbers and dates
	that.gte = function(value, items, context) { // value is array: value[0] - param, value[1] - value
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( globalUI.getPropertyValue( items[i][context][j], value[0] ) >= value[1] ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( globalUI.getPropertyValue( items[i], value[0] ) >= value[1] ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};
	// compare for numbers and dates
	that.lt = function(value, items, context) { // value is array: value[0] - param, value[1] - value
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( globalUI.getPropertyValue( items[i][context][j], value[0] ) < value[1] ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( globalUI.getPropertyValue( items[i], value[0] ) < value[1] ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};
	// compare for numbers and dates
	that.lte = function(value, items, context) { // value is array: value[0] - param, value[1] - value
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( globalUI.getPropertyValue( items[i][context][j], value[0] ) <= value[1] ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( globalUI.getPropertyValue( items[i], value[0] ) <= value[1] ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};

	that.in = function(values, items, context) { // values[1] is array
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( _.indexOf( values[1], globalUI.getPropertyValue( items[i][context][j], values[0] ) ) !== -1 ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( _.indexOf( values[1], globalUI.getPropertyValue( items[i], values[0] ) ) !== -1 ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};

	that.notIn = function(values, items, context) { // values[1] is array
		var tmpResult = [],
				tmpResult2,
				length,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			if( context ) {
				tmpResult2 = [];
				if( items[i][context] === undefined ) {
					length = -1;
				} else {
					length = items[i][context].length;
				}
				for( var j = 0, jj = length; j < jj; j += 1 ) {
					if( _.indexOf( values[1], globalUI.getPropertyValue( items[i][context][j], values[0] ) ) === -1 ) {
						tmpResult2.push( items[i] );
					}
				}
				if( length === tmpResult2.length ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( _.indexOf( values[1], globalUI.getPropertyValue( items[i], values[0] ) ) === -1 ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};

	that.exists = function(value, items, context) { // value[1] is string
		var tmpResult = [],
				tmpValue,
				globalUI = InfinniUI.ObjectUtils;

		if( value[1] === undefined ) {
			value[1] = true;
		}
		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpValue = globalUI.getPropertyValue( items[i], value[0] );
			if( value[1] === true ) {
				if( !_.isUndefined(tmpValue) && !_.isNull(tmpValue) ) {
					tmpResult.push( items[i] );
				}
			} else {
				if( _.isUndefined(tmpValue) || _.isNull(tmpValue) ) {
					tmpResult.push( items[i] );
				}
			}
		}
		return tmpResult;
	};

	that.match = function(values, items, context) {
		var tmpResult = [],
				globalUI = InfinniUI.ObjectUtils;
		for( var i = 0, ii = values[1].length; i < ii; i += 1 ) {
			if( globalUI.getPropertyValue( values[1][i], values[0] ) !== undefined ) {
				tmpResult.push( values[1][i] );
			}
		}
		return tmpResult;
	};

	that.all = function(values, items, context) { // value[1] is array
		var tmpResult = [],
				counter,
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], values[0] );
			counter = 0;
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( _.indexOf( values[1], tmpArr[j] ) !== -1 ) {
					counter += 1;
				}
			}
			if( jj === counter ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.anyIn = function(values, items, context) { // value[1] is array
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], values[0] );
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( _.indexOf( values[1], tmpArr[j] ) !== -1 ) {
					tmpResult.push( items[i] );
					break;
				}
			}
		}
		return tmpResult;
	};

	that.anyNotIn = function(values, items, context) { // value[1] is array
		var tmpResult = [],
				counter,
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], values[0] );
			counter = 0;
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( _.indexOf( values[1], tmpArr[j] ) !== -1 ) {
					counter += 1;
				}
			}
			if( counter === 0 ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.anyEq = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			if( _.indexOf(tmpArr, value[1]) !== -1 ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.anyNotEq = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( tmpArr[j] !== value[1] ) {
					tmpResult.push( items[i] );
					break;
				}
			}
		}
		return tmpResult;
	};

	that.anyGt = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( tmpArr[j] > value[1] ) {
					tmpResult.push( items[i] );
					break;
				}
			}
		}
		return tmpResult;
	};

	that.anyGte = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( tmpArr[j] >= value[1] ) {
					tmpResult.push( items[i] );
					break;
				}
			}
		}
		return tmpResult;
	};

	that.anyLt = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( tmpArr[j] < value[1] ) {
					tmpResult.push( items[i] );
					break;
				}
			}
		}
		return tmpResult;
	};

	that.anyLte = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			for( var j = 0, jj = tmpArr.length; j < jj; j += 1 ) {
				if( tmpArr[j] <= value[1] ) {
					tmpResult.push( items[i] );
					break;
				}
			}
		}
		return tmpResult;
	};

	that.sizeEq = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			if( tmpArr.length === value[1] ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.sizeNotEq = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			if( tmpArr.length !== value[1] ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.sizeGt = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			if( tmpArr.length > value[1] ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.sizeGte = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			if( tmpArr.length >= value[1] ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.sizeLt = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			if( tmpArr.length < value[1] ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.sizeLte = function(value, items, context) {
		var tmpResult = [],
				tmpArr,
				globalUI = InfinniUI.ObjectUtils;

		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpArr = globalUI.getPropertyValue( items[i], value[0] );
			if( tmpArr.length <= value[1] ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.regexp = function(values, items, context) { // value[1] is array
		var tmpResult = [],
				tmpObjValue,
				globalUI = InfinniUI.ObjectUtils,
				flags = '',
				regexp;
		for( var j = 1, jj = values[1].length; j < jj; j += 1 ) {
			flags += values[1][j];
		}
		regexp = new RegExp(values[1][0], flags);
		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpObjValue = globalUI.getPropertyValue( items[i], values[0] );
			if( tmpObjValue.search(regexp) !== -1 ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};

	that.text = function(value, items, context) {
		var tmpResult = [],
				tmpString,
				subString = value[0].replace('_', ' ').toLowerCase();
		for( var i = 0, ii = items.length; i < ii; i += 1 ) {
			tmpString = JSON.stringify(items[i]).toLowerCase();
			if( tmpString.indexOf( subString ) !== -1 ) {
				tmpResult.push( items[i] );
			}
		}
		return tmpResult;
	};
	return that;
})();

//####app/utils/hashMap.js
/**
 * @description Простая реализация хеша у которого в качестве ключей м.б. объект
 * @constructor
 */
function HashMap() {
    this._keys = [];
    this._values = [];
}

window.InfinniUI.HashMap = HashMap;

Object.defineProperties(HashMap.prototype, /** @lends HashMap.prototype **/{
    length: {
        get: function () {
            return this._keys.length;
        }
    },
    keys: {
        get: function () {
            return this._keys;
        }
    },

    values: {
        get: function () {
            return this._values;
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

HashMap.prototype.remove = function (key) {
    var i = this._getIndexOfKey(key);

    if (i !== -1) {
        this._keys.splice(i, 1);
        this._values.splice(i, 1);
    }
};

HashMap.prototype.getKeyByValue = function (value) {
    var key,
        i = this._getIndexOfValue(value);

    if (i !== -1) {
        key = this._keys[i];
    }
    return key;
};

/**
 *
 * @param {Function} predicate
 * @param thisArg
 * @returns {numeric}
 */
HashMap.prototype.findIndex = function (predicate, thisArg) {
    var key, value, index = -1;
    for (var i = 0; i < this._keys.length; i = i + 1) {
        key = this._keys[i];
        value = this._values[i];
        if (predicate.call(thisArg, key, value)) {
            index =  i;
            break;
        }
    }

    return index;
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

/**
 * @param {*} value
 * @returns {number}
 * @private
 */
HashMap.prototype._getIndexOfValue = function (value) {
    return this._values.indexOf(value);
};

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

window.InfinniUI.hiddenScreen = hiddenScreen;

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

//####app/utils/keycodes.js
window.InfinniUI.Keyboard = {
    KeyCode: {
        ESCAPE: 27,
        HOME: 36,
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        END: 35,
        UP_ARROW: 38,
        DOWN_ARROW: 40,
        DELETE: 46,
        BACKSPACE: 8,
        TAB: 9,
        SPACE: 32,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        PLUS: 43,
        MINUS: 45,
        ASTERISK: 42,
        SLASH: 47,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57
    },

    getCharByKeyCode: function (keyCode) {
        var char, code;

        if (keyCode < 32) {
            //Спецсимвол
            char = null;
        } else {
            //@see http://unixpapa.com/js/key.html
            if (keyCode >= this.KeyCode.NUMPAD_0 && keyCode <= this.KeyCode.NUMPAD_9) {
                code = keyCode - 48;
            } else {
                switch (keyCode) {
                    //convert numpad key codes
                    case 110:
                        code = this.KeyCode.DELETE;  //.Del
                        break;
                    case 107:
                        code = this.KeyCode.PLUS;  //+
                        break;
                    case 109:
                        code = this.KeyCode.MINUS;  //-
                        break;
                    case 106:
                        code = this.KeyCode.ASTERISK;  //*
                        break;
                    case 111:
                        code = this.KeyCode.SLASH;  // /
                        break;
                    //Symbol Keys
                    case 188:
                        code = 44;
                        break;
                    case 173:
                        code = 45;
                        break;
                    case 190:
                        code = 46;
                        break;
                    case 191:
                        code = 47;
                        break;
                    case 192:
                        code = 96;
                        break;
                    case 219:
                        code = 91;
                        break;
                    case 220:
                        code = 92;
                        break;
                    case 221:
                        code = 93;
                        break;
                    case 222:
                        code = 39;
                        break;
                    default:
                        code = keyCode;
                }
            }
            char = String.fromCharCode(code);
        }
        return char;
    }
};
//####app/utils/layoutManager.js
var layoutManager = {
	windowHeight: 0,
	clientHeight: 0,
	exchange: null,
	times: [],

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

	buildTree: function(items, parentEl, $parentEl, elements, list) {
		var items = _.where(list, {parent: parentEl}),
				manager = this;

		return {
			isElement: _.indexOf(elements, parentEl) !== -1,
			element: parentEl,
			$element: $parentEl,
			child: _.map(items, function (item) {
				return manager.buildTree(items, item.element, item.$element, elements, list );
			})
		};
	},

	formTree: function(elements, el, $el) {
		var $parent,
				list = [],
				$element,
				element;
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

		return this.buildTree(list, el, $el, elements, list);
	},

	setHeight: function (node, height) {
		var originalHeight = node.$element.attr('data-height-original');
		if (originalHeight === '') {
			node.$element.attr('data-height-original', node.element.style.height);
		}
		return this.setOuterHeight(node.$element, height);
	},

	defineWay: function(node, height) {
		var nodeHeight = this.setHeight(node, height),
				manager = this;

		if( node.$element.hasClass('pl-scroll-panel') || node.$element.hasClass('modal-scrollable') ) {
			//Т.к. скроллпанель бесконечная по высоте, контролы внутри нее по высоте не растягиваем
			return;
		} else if( node.$element.hasClass('tab-content') ) {
			_.each(node.child, function (node) {
				manager.defineWay(node, nodeHeight);
			});
		} else if( node.child.length > 0 ) {
			this.goThroughTree(node, nodeHeight);
		}
	},

	goThroughTree: function(node, height) {
		var manager = this;
		if( node.$element.parentsUntil('.modal').length ) {
			node.$element.attr('data-height-original', node.element.style.height);
		}

		var children = node.$element.children(':not(:hidden):not(.modal-scrollable):not(.modal-backdrop):not(.pl-dropdown-container)'),
		/*
		 * @TODO Возможно правильнее исключать из обсчета все элементы с абсолютным позиционированием
		*/
				grid = _.chain(children)
					.filter(function (el) {
						var position = $(el).css('position');
						return ['absolute', 'fixed'].indexOf(position) === -1;
					})
					.groupBy('offsetTop')
					.value(),

				heights = [];

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

		var fixedHeight = _.reduce(heights, function (total, height) {return total + height}, 0),
				count = _.reduce(grid, function (count, row) {return row.length ? count + 1 : count}, 0),

				heightForNode = Math.floor((height - fixedHeight) / count);

		_.each(grid, function (row) {
			if (row.length === 0) return;
			_.each(row, function (node) {
				manager.defineWay(node, heightForNode);
			}, this);
		}, this);
	},

	resize: function(el, pageHeight) {
		var startTime = Date.now(); //start time
		var $el = $(el),
				contentHeight = this.setOuterHeight($el, pageHeight),
				elements = $el.find(this.getSelector());

		//var elements = Array.prototype.filter.call($el.find(this.getSelector()), function (element) {
		//    //Исключаем элементы которые долдны занитмать всю доступную высоту,
		//    // которые по какой-то причине оказались внутри ScrollPanel
		//    return $(element).parents('.pl-scrollpanel').length === 0;
		//});
		if (elements.length === 0) {
			return;
		}

		var tree = this.formTree(elements, el, $el);
		/**
		 * Если внутри child один элемент:
		 *   - устанавливаем высоту в 100%
		 * Если внутри child несколько элементов
		 *   - offsetTop совпадают - устанавливаем высоту в 100%
		 *   - offsetTop не совпадают - устанавливаем высоту в (100 / child.length)%
		 */
		this.defineWay(tree, pageHeight);
		var endTime = Date.now(); //end time
		this.timeWatcher(endTime - startTime);
	},

	timeWatcher: function(time) {
		if( time >= 20 ) {
			this.times.push(time);
		}
	},

	getTimes: function() {
		return this.times;
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
			$container.css('top', (this.windowHeight - $header.outerHeight(true) - $body.outerHeight(true)) / 2);

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
		if (el.length !== 0) {
			// Если диалог содержит элементы которые должны растягиваться по вертикали на 100%
			// пересчитываем высоту

			//@TODO Зачем задавалась минимальная высота диалогов?
			//$body.css('min-height', (this.windowHeight - $header.outerHeight(true) - space * 2) / 2);
			var containerHeight = this.setOuterHeight($modal, this.windowHeight - space * 2);

			//Высота для содержимого окна диалога
			var clientHeight = this.setOuterHeight($container, containerHeight) - $header.outerHeight();

			this.resize($body[0], clientHeight);
		}
	},

	init: function (container) {
		if( window.InfinniUI.config.disableLayoutManager === true ) {
			return false;
		}
		container = container || document;
		$('#page-content').addClass('page-content-overflow-hidden');
		this.windowHeight = $(window).height();
		this.onChangeLayout(container);
		if (this.exchange === null) {
			this.exchange = window.InfinniUI.global.messageBus;
			this.exchange.subscribe('OnChangeLayout', _.debounce(this.onChangeLayout.bind(this), 42));
		}
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

window.InfinniUI.LayoutManager = layoutManager;

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

InfinniUI.Metadata.isBindingMetadata = function(metadata){
    return $.isPlainObject(metadata) && 'Source' in metadata;
};
//####app/utils/numeric.js
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};
//####app/utils/stringUtils.js
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

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
        if(!indexes || indexes.length == 0 || property == ''){
            return property;
        }

        var propertyPaths = property.split('.');

        var j = indexes.length-1;

        for(var i = propertyPaths.length-1; i>=0; i--){
            if(propertyPaths[i] == '#' && j >= 0){
                propertyPaths[i] = indexes[j];
                j--;
            }else if(propertyPaths[i] == '$' || stringUtils.isNumeric(propertyPaths[i])){
                j--;
            }
        }

        return propertyPaths.join('.');
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
    },

    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    replaced: {
        '+': '%2B'
    },

    joinDataForQuery: function(data){
        var result = [];
        var that = this;

        for(var k in data){
            var p = _.isString(data[k]) ? data[k].replace(/[\+]/g, function (c) {
                return that.replaced[c] || c;
            }) : data[k];

            result.push(k + '=' + p);
        }

        return result.join('&');
    }
};

window.InfinniUI.StringUtils = stringUtils;
window.InfinniUI.guid = guid;

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
            window.prompt("Copy to clipboard: Ctrl+C", formatInfo(viewName, name));
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
                title: formatInfo(viewName, name),
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


    /********************/

    function formatInfo(viewName, name) {
        var info = viewName ? [viewName] : [];
        info.push(name);

        return info.join(':');
    };


})(window, document, jQuery);


//####app/utils/treeModel.js
var TreeModel = function(context, source, startTree){
    this.context = context;
    this.source = source;
    this.dataTree = startTree || {};

    this.handlersTree = {};

    this.mirroringFrom = null;
    this.mirroringTo = null;
};

window.InfinniUI.TreeModel = TreeModel;

_.extend(TreeModel.prototype, {

    counter: 1,

    getProperty: function(propertyName){
        if(this.mirroringFrom){
            propertyName = propertyName.replace(this.mirroringFrom, this.mirroringTo);
        }
        return InfinniUI.ObjectUtils.getPropertyValue(this.dataTree, propertyName)
    },

    setProperty: function(propertyName, value){
        var oldValue = this.getProperty(propertyName);
        if(value == oldValue){
            return false;
        }

        InfinniUI.ObjectUtils.setPropertyValue(this.dataTree, propertyName, value);

        this._notifyAboutPropertyChanged(propertyName, oldValue);

        return true;
    },

    onPropertyChanged: function(propertyName, handler, params){
        var handlersNode;
        var bindId = this.counter + '-bindId';
        this.counter ++;

        if(_.isFunction(propertyName)){
            params = handler;
            handler = propertyName;

            handlersNode = this._getHandlersSubTree('*', true);
        }else{
            handlersNode = this._getHandlersSubTree(propertyName, true);
        }

        handler._bindId = bindId;
        if(params && 'owner' in params){
            handler._owner = params.owner;
        }

        handlersNode[bindId] = handler;
    },

    _getHandlersSubTree: function(propertyName, restoreIfNoProperty){
        if(propertyName == ''){
            return this.handlersTree;
        }

        var propertyPaths = propertyName.split('.');
        var tmpResult = this.handlersTree;
        for(var i = 0, ii = propertyPaths.length; i<ii; i++){
            if(tmpResult[propertyPaths[i]]){
                tmpResult = tmpResult[propertyPaths[i]];
            }else{
                if(restoreIfNoProperty){
                    tmpResult[propertyPaths[i]] = {};
                    tmpResult = tmpResult[propertyPaths[i]];
                }else{
                    return {};
                }
            }
        }

        return tmpResult;
    },

    _notifyAboutPropertyChanged: function(propertyName, oldValue){
        var handlers = this._getHandlersSubTree(propertyName);

        var needMirroring = this.mirroringTo != null && this.mirroringFrom != null && propertyName.indexOf(this.mirroringTo) == 0;
        var mirroringPath = propertyName.replace(this.mirroringTo, this.mirroringFrom);

        this._notifyAboutPropertyChanged_bubblingAction(propertyName, oldValue, handlers);

        this._notifyAboutPropertyChanged_capturingAction(propertyName, oldValue, handlers);
        if(needMirroring){
            handlers = this._getHandlersSubTree(mirroringPath);
            this._notifyAboutPropertyChanged_capturingAction(mirroringPath, oldValue, handlers);
        }
    },

    _notifyAboutPropertyChanged_capturingAction: function(propertyName, oldValue, handlersSubTree){
        var tmpValue;
        var tmpProperty;
        var handler;

        for( var k in handlersSubTree ){
            if($.isFunction(handlersSubTree[k])){

                handler = handlersSubTree[k];
                if(this._isOwnerAlive(handler)){
                    this._callHandlerAboutPropertyChanged(handler, propertyName, oldValue);
                }else{
                    delete handlersSubTree[k];
                }

            }
        }

        for( var k in handlersSubTree ){
            if($.isPlainObject(handlersSubTree[k]) && k != '*'){

                tmpValue = $.isPlainObject(oldValue) ? oldValue[k] : undefined;
                tmpProperty = propertyName == '' ? k :propertyName + '.' + k;
                this._notifyAboutPropertyChanged_capturingAction(tmpProperty, tmpValue, handlersSubTree[k]);

            }
        }
    },

    _notifyAboutPropertyChanged_bubblingAction: function(propertyName, oldValue, handlersSubTree){
        var propertyNamePaths = propertyName.split('.');
        var tmpPropertyName;

        var handlersNode = this.handlersTree;
        var that = this;

        checkAndCallAnyHandlers(handlersNode);

        if(propertyName != ''){
            for(var i = 0, ii = propertyNamePaths.length; i < ii; i++){

                tmpPropertyName = propertyNamePaths[i];
                if(handlersNode[tmpPropertyName]){
                    handlersNode = handlersNode[tmpPropertyName];
                    checkAndCallAnyHandlers(handlersNode);

                }else{
                    break;
                }
            }
        }



        function checkAndCallAnyHandlers(_handlersNode){
            var handler;

            if('*' in _handlersNode){
                for( var k in _handlersNode['*'] ){
                    handler = _handlersNode['*'][k];
                    if(that._isOwnerAlive(handler)){
                        that._callHandlerAboutPropertyChanged(handler, propertyName, oldValue);
                    }else{
                        delete _handlersNode['*'][k];
                    }
                }
            }
        }
    },

    _isOwnerAlive: function(handler){
        if(handler._owner && 'isRemoved' in handler._owner){

            if(typeof handler._owner.isRemoved == 'function'){
                return handler._owner.isRemoved();
            }else{
                return !handler._owner.isRemoved;
            }

        }else{
            return true;
        }
    },

    _callHandlerAboutPropertyChanged: function(handler, propertyName, oldValue){
        var args = {
            property: propertyName,
            newValue: this.getProperty(propertyName),
            oldValue: oldValue,
            source: this.source
        };

        handler(this.context, args);
    },

    setMirroring: function(mirroringFrom, mirroringTo){
        this.mirroringFrom = mirroringFrom;
        this.mirroringTo = mirroringTo;
    }

});

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

window.InfinniUI.UrlManager = urlManager;
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

    onViewBuildError: {name: 'onViewBuildError'},
    onViewCreated: {name: 'onViewCreated'},

    onChangeLayout: {name: 'OnChangeLayout'},
    onNotifyUser: {name: 'onNotifyUser'},
    onToolTip: {name: 'onToolTip'},

    onContextMenu: {name: 'onContextMenu'},
    onOpenContextMenu: {name: 'onOpenContextMenu'},

    onDataLoading: {name: 'onDataLoading'},
    onDataLoaded: {name: 'onDataLoaded'}

};


//####app/controls/_base/_mixins/ajaxRequestMixin.js
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

    onMouseWheel: function (handler) {
        this.controlView.$el.on('mousewheel DOMMouseScroll', handler);
    },

    onKeyDown: function (handler) {
        this.controlView.$el.on('keydown', handler);
    },

    onKeyUp: function (handler) {
        this.controlView.$el.on('keyup', handler);
    },

    remove: function () {
        this.controlView.remove();
    },

    setFocus: function () {
        this.controlView.setFocus();
    }
});

InfinniUI.Control = Control;
//####app/controls/_base/control/controlModel.js
var ControlModel = Backbone.Model.extend({
    defaults: {
        text: null,
        name: null,
        enabled: true,
        parentEnabled: true,
        visible: true,
        textHorizontalAlignment: InfinniUI.TextHorizontalAlignment.left,
        horizontalAlignment: 'Stretch',
        verticalAlignment: 'Top',
        textStyle: null,
        background: null,
        foreground: null,
        isLoaded: false,
        validationState: 'success',
        validationMessage: '',
        focusable: true,
        focused: false
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

InfinniUI.ControlModel = ControlModel;
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

        this.listenTo(this.model, 'change:validationState', this.updateValidationState);


        this.listenTo(this.model, 'change:focusable', this.updateFocusable);
        this.listenTo(this.model, 'change:focused', this.updateFocused);

        this.initFocusHandlers();
    },

    initFocusHandlers: function () {
        var $el = this.$el,
            el = this.el,
            view = this,
            model = this.model;


        $el
            .on('focusin', onFocusIn)
            .on('focusout', onFocusOut);

        function onFocusIn(event) {
            model.set('focused', true);
        }

        function onFocusOut(event) {
            if (view.isControlElement(event.relatedTarget)) {
                //focus out to element inside control
                model.set('focused', true);
            } else {
                //focus out
                model.set('focused', false);
            }
        }
    },

    isControlElement: function (el) {
        return this.el ===  el || $.contains(this.el, el)
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

        this.updateValidationState();

        this.updateFocusable();
        this.updateFocused();

        this.updateViewMode();
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
                //$el.focus();
            }
        }
        this.$el.toggleClass(this.classNameFocused, focused);
    },


    onFocusHandler: function (event) {
        //console.log('onFocus');
    },


    updateVisible: function () {
        var isVisible = this.model.get('visible');
        this.$el
            .toggleClass('hidden', !isVisible);

        this.onUpdateVisible();
    },

    onUpdateVisible: function () {
        this.updateLayout();
    },

    updateLayout: function () {
        var exchange = window.InfinniUI.global.messageBus;
        exchange.send('OnChangeLayout', {});
    },

    updateEnabled: function () {
        var isEnabled = this.model.get('enabled');
        this.$el
            .toggleClass('pl-disabled', !isEnabled);
    },

    updateVerticalAlignment: function () {
        //var verticalAlignment = this.model.get('verticalAlignment');
        this.switchClass('verticalAlignment', this.model.get('verticalAlignment'), this.$el, false);

        //var prefix = 'verticalAlignment';
        //var regexp = new RegExp('(^|\\s)' + prefix + '\\S+', 'ig');
        //
        //this.$el.removeClass(function (i, name) {
        //        return (name.match(regexp) || []).join(' ');
        //    })
        //    .addClass(prefix + verticalAlignment);
    },

    updateTextHorizontalAlignment: function () {
        this.switchClass('pl-text-horizontal', this.model.get('textHorizontalAlignment'));
    },

    updateHorizontalAlignment: function () {
        this.switchClass('pl-horizontal', this.model.get('horizontalAlignment'));
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

    updateViewMode: function () {
        if(this.viewMode == 'FormGroup' ){
            this.$el.addClass('pl-form-group');
        }
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

    switchClass: function (name, value, $el, separator) {
        if (typeof separator === 'undefined') {
            separator = '-';
        } else if (separator === false) {
            separator = '';
        }

        var startWith = name + separator;
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
            background: model.get('background')
        }
    },

    setFocus: function () {
        this.$el.focus();
    }

});

_.extend(ControlView.prototype, bindUIElementsMixin, eventHandlerMixin);

InfinniUI.ControlView = ControlView;

//####app/controls/_base/button/buttonControlMixin.js
var buttonControlMixin = {

    click: function () {
        this.controlView.$el.click();
    }

};
//####app/controls/_base/container/containerControl.js
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
//####app/controls/_base/container/containerModel.js
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




//####app/controls/_base/container/containerView.js
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
            throw 'ContainerView.updateGrouping В потомке ContainerView не реализовано обновление группировок.';
        },

        initHandlersForProperties: function(){
            ControlView.prototype.initHandlersForProperties.call(this);

            var that = this;
            this.model.get('items').onChange(function(event){
                switch (event.action) {
                    case 'replace':
                        break;
                    default:
                        that.rerender();
                }
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
//####app/controls/_base/editorBase/editorBaseControlMixin.js
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
//####app/controls/_base/editorBase/editorBaseModelMixin.js
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

    _applyDefaultValue: function (value) {
        var defaults = _.result(this, 'defaults');
        return typeof value === 'undefined' ? defaults['value'] : value;
    },

    _setValue: function(value, options) {
        value = this.transformValue(value);

        value = this._applyDefaultValue(value);

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

    isSetValue: function (value) {
        return value !== null && typeof value !== 'undefined' && value !== '';
    },

    onValueChanging: function (handler) {
        this.eventManager.on('onValueChanging', handler);
    },

    onValueChanged: function (handler) {
        this.on('onValueChanged', handler);
    }
};

//####app/controls/_base/editorBase/editorBaseViewMixin.js
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

//####app/controls/_base/listEditorBase/listEditorBaseControl.js
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
//####app/controls/_base/listEditorBase/listEditorBaseModel.js
var ListEditorBaseModel = ContainerModel.extend( _.extend({

    defaults: _.defaults({
        multiSelect: false,
        disabledItemCondition: null
    }, ContainerModel.prototype.defaults),

    initialize: function () {
        var that = this;
        this.hashValueByItem = new HashMap();
        ContainerModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();

        this.bindSelectedItemsWithValue();

        this.get('items').onChange(function(){
            that.hashValueByItem.clear();
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
        if (this.hashValueByItem.length === 0) {
            this.updateHashValueByItem();
        }
        var info,
            index,
            item = this.hashValueByItem.getKeyByValue(value);

        if (typeof item !== 'undefined') {
            info = {
                item: item,
                index: this.hashValueByItem.keys.indexOf(item)
            }
        } else {
            var text = JSON.stringify(value);
            index = this.hashValueByItem.findIndex(function (item, value) {
                return JSON.stringify(value) === text;
            });

            if (index !== -1) {
                info = {
                    index: index,
                    item: this.hashValueByItem.keys[index]
                }
            }
        }

        return info;
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

    isDisabledItem: function(item){
        var disabledItemCondition = this.get('disabledItemCondition');
        return (disabledItemCondition != null) && disabledItemCondition(undefined, {value: item});
    },

    updateHashValueByItem: function () {
        var items = this.get('items'),
            value;
        this.hashValueByItem.clear();
        items.forEach(function (item) {
            value = this.valueByItem(item);
            this.hashValueByItem.add(item, value);
        }, this);
    }

}, editorBaseModelMixin));

//####app/controls/_base/listEditorBase/listEditorBaseView.js
var ListEditorBaseView = ContainerView.extend( _.extend( {}, editorBaseViewMixin, {

    initHandlersForProperties: function(){
        ContainerView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:selectedItem', this.updateSelectedItem);
        this.listenTo(this.model, 'change:multiSelect', this.updateMultiSelect);
        this.listenTo(this.model, 'change:disabledItemCondition', this.updateDisabledItem);
    },

    updateProperties: function(){
        ContainerView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);

        this.updateSelectedItem();
        this.updateMultiSelect();
        this.updateDisabledItem();
    },

    updateMultiSelect: function () {

    }

}));
//####app/controls/_base/textEditorBase/textEditorBaseControl.js
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
//####app/controls/_base/textEditorBase/textEditorBaseModel.js
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


//####app/controls/_base/textEditorBase/textEditorBaseView.js
/**
 * @class TextEditorBaseView
 * @augments ControlView
 * @mixed editorBaseViewMixin
 */


var TextEditorBaseView = ControlView.extend(/** @lends TextEditorBaseView.prototype */ _.extend({}, editorBaseViewMixin, {

    UI: _.extend({}, editorBaseViewMixin.UI, {
        control: '.pl-control',
        //editor: '.pl-control-editor',
        editor: '.pl-editor',
        label: '.pl-control-label',
        textbox: '.pl-text-box-input'
    }),

    events: {

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
        this.listenTo(this.model, 'change:inputType', this.updateInputType);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);

        this.updateLabelText();
        this.updateInputType();
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (!focusable) {
            this.ui.editor.attr('tabindex', -1);
        } else {
            this.ui.editor.removeAttr('tabindex');
        }
    },

    updateInputType: function () {
        var inputType = this.model.get('inputType');
        var $editor = this.ui.editor;
        var tagName = $editor.prop('tagName');
        if (inputType && tagName.toLowerCase() === 'input') {
            $editor.attr('type', inputType);
        }
    },

    updateEditMask: function(){
        this.updateValue();
    },

    setFocus: function () {
        this.ui.editor.focus();
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

    /**
     * Рендеринг редактора значений
     *
     */
    renderControlEditor: function () {
        var model = this.model;
        var editor = model.get('editor');
        if (editor) {
            editor.render(this.ui.editor);
        }
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

    getDisplayValue: function () {
        var
            model = this.model,
            value = model.get('value'),
            displayFormat = model.get('displayFormat');

        return displayFormat ? displayFormat(null, {value: value}) : value;
    }

}));

//####app/controls/_base/eventManager.js
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

//####app/controls/_base/highlightMixin.js
var highlightMixin = {

    attributeName: '_highlight',

    highlightClassName: 'active',

    control: {

        setHighlight: function (highlight) {
            this.controlModel.set(highlightMixin.attributeName, highlight);
        },

        getHighlight: function () {
            return this.controlModel.get(highlightMixin.attributeName);
        }

    },

    controlView: {

        initHighlightMixin: function () {
            this.listenTo(this.model, 'change:' + highlightMixin.attributeName, function () {
                var model = this.model;
                this.$el.toggleClass(highlightMixin.highlightClassName, model.get(highlightMixin.attributeName));
                this.$el.parent().toggleClass(highlightMixin.highlightClassName, model.get(highlightMixin.attributeName));
            });
        }

    }
};


//####app/controls/_base/textEditor/textEditorModel.js
/**
 * @TODO Если маска заполнена не полностью - не выходить из режима редактирования
 */
var TextEditorModel = Backbone.Model.extend({

    Mode: {
        Edit: 'edit',
        Display: 'display'
    },

    initialize: function () {

        this.initEditMode();

        this.on('change:originalValue', this.onChangeOriginalValueHandler);
        this.on('change:value', this.onChangeValueHandler);
        this.on('change:mode', this.onChangeModeHandler);
        this.on('change:text', this.onChangeTextHandler);
    },

    onChangeTextHandler: function (model, value, options) {
        var modeStrategy = this.get('modeStrategy');
        modeStrategy.onChangeTextHandler(model, value, options);
    },

    convertValue: function (value) {
        var getConverter = this.get('valueConverter');
        var converter = getConverter.call(null);
        return (typeof converter === 'function') ? converter.call(this, value) : value;
    },

    initEditMode: function () {
        this.modeStrategies = {};
        this.modeStrategies[this.Mode.Edit] = new TextEditorModelEditModeStrategy();
        this.modeStrategies[this.Mode.Display] = new TextEditorModelDisplayModeStrategy();

        this.updateEditModeStrategy();
    },

    defaults: function () {
        return {
            mode: this.Mode.Display
        };
    },

    updateEditModeStrategy: function () {
        var mode = this.get('mode');
        this.set('modeStrategy', this.modeStrategies[mode]);
    },

    onChangeModeHandler: function (model, mode, options) {
        var prevMode = this.previous('mode');
        if (options.cancel) {
            this.cancelChanges();
        } else if (mode === this.Mode.Display && prevMode === this.Mode.Edit) {
            //При успешном переходе из режима редактирования в режим отображения - обновляем исходное значение
            this.applyChanges();
        }

        this.updateEditModeStrategy();
        this.updateText();
    },

    /**
     *
     * @param {boolean} [cancel = false]
     * @param {boolean} [validate = true]
     */
    setDisplayMode: function (cancel, validate) {
        cancel = !!cancel;
        validate = (typeof validate === 'undefined') ? true : !!validate;

        this.set('mode', this.Mode.Display, {
            cancel: cancel,
            validate: validate
        });

    },

    applyChanges: function () {
        this.set('originalValue', this.get('value'));
    },

    cancelChanges: function () {
        this.set('value', this.get('originalValue'));
    },

    /**
     *
     * @param text
     * @param {boolean} [ui = false]
     */
    setText: function (text, ui) {
        var modeStrategy = this.get('modeStrategy');
        modeStrategy.setText(this, text, ui);
    },

    getEditMask: function () {
        return this.get('editMask');
    },

    getValue: function () {
        return this.get('value');
        //
        //
        //var editMask = this.getEditMask();
        //var value;
        //
        //if (editMask) {
        //    value = editMask.getValue()
        //} else {
        //    value = this.$el.val();
        //}

        //return value;
    },

    getDisplayFormat: function () {
        return this.get('displayFormat');
    },

    setEditMode: function () {
        this.set('mode', this.Mode.Edit);
    },

    validate: function (attrs, options) {

        //@TODO Если меняется Mode Edit => Display, проверить введенное значение!!!
        var validateValue = this.get('validateValue'),
            value = this.getValue();

        if (_.isFunction(validateValue)) {
            return validateValue.call(null, value);
        }
    },

    updateText: function () {
        var modeStrategy = this.get('modeStrategy');
        modeStrategy.updateText(this);
    },

    onChangeValueHandler: function (model, value, options) {
        if (!options.ui) {
            this.updateText();
        }

    },

    onChangeOriginalValueHandler: function (model, value) {
        model.set('value', value, {originalValue: true});
    }

});
//####app/controls/_base/textEditor/textEditorView.js
var TextEditorView = Backbone.View.extend({

    /**
     * @member {TextEditorModel} model
     */

    classNameError: 'has-error',

    events: {
        'focusin': 'onFocusinHandler',
        'focusout': 'onFocusoutHandler',
        'keydown': 'onKeydownHandler',
        'change': 'onChangeHandler',
        'input': 'onInputHandler',
        'keyup': 'onKeyupHandler',  //trigger OnKeyDown Event
        'click': 'onClickHandler',
        'drop': 'onDropHandler',
        'dragstart': 'OnDragstartHandler',
        'dragend': 'OnDragendHandler',
        'dragover': 'OnDragoverHandler',
        'dragleave': 'OnDragleaveHandler',
        'dragenter': 'OnDragenterHandler',
        'paste': 'onPasteHandler'
    },

    updateModelTextFromEditor: function () {
        var model = this.model,
            editMask = model.getEditMask();

        if (!editMask) {
            model.setText(this.$el.val(), true);
        }
    },

    onChangeHandler: function () {
        //Обработка для корректной обработки автозаполняемых полей
        this.updateModelTextFromEditor();
    },

    onInputHandler: function () {
        var editMask = this.model.getEditMask();
        if (!editMask) {
            this.updateModelTextFromEditor();
        }
    },

    onKeydownHandler: function (event) {
        if (event.ctrlKey || event.altKey) {
            return;
        }

        if (event.which === InfinniUI.Keyboard.KeyCode.ESCAPE) {
            //Отменить изменения и выйти из режима редактирования
            this.model.setDisplayMode(true, false);
            this.$el.blur();
            return;
        }

        var editMask = this.model.getEditMask();
        if (!editMask) {
            //model.text будет изменено в обработчике onInputHandler
            return;
        }

        var model = this.model;
        var position;

        switch (event.which) {
            case InfinniUI.Keyboard.KeyCode.TAB:
                break;
            case InfinniUI.Keyboard.KeyCode.HOME:
                if (!event.shiftKey) {
                    position = editMask.moveToPrevChar(0);
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }

                break;

            case InfinniUI.Keyboard.KeyCode.LEFT_ARROW:
                if (!event.shiftKey) {
                    position = editMask.moveToPrevChar(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.RIGHT_ARROW:
                if (!event.shiftKey) {
                    position = editMask.moveToNextChar(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.END:
                if (!event.shiftKey) {
                    position = editMask.moveToNextChar(this.$el.val().length);
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.UP_ARROW:
                if (!event.shiftKey) {
                    position = editMask.setNextValue(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        model.setText(editMask.getText());
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.DOWN_ARROW:
                if (!event.shiftKey) {
                    position = editMask.setPrevValue(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        this.model.setText(editMask.getText());
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.DELETE:
                event.preventDefault();
                position = editMask.deleteCharRight(this.getCaretPosition(), this.getSelectionLength());

                this.model.setText(editMask.getText());
                if (position !== false) {
                    this.setCaretPosition(position);
                }
                break;

            case InfinniUI.Keyboard.KeyCode.BACKSPACE:
                event.preventDefault();
                position = editMask.deleteCharLeft(this.getCaretPosition(), this.getSelectionLength());

                this.model.setText(editMask.getText());
                if (position !== false) {
                    this.setCaretPosition(position);
                }
                break;

            case InfinniUI.Keyboard.KeyCode.SPACE:
                if (editMask.value instanceof Date) {
                    event.preventDefault();
                    position = editMask.getNextItemMask(this.getCaretPosition());
                    if (position !== false) {
                        this.setCaretPosition(position);
                    }
                }
                break;

            default:
                //замена выделенного текста, по нажатию
                var char = InfinniUI.Keyboard.getCharByKeyCode(event.keyCode);
                event.preventDefault();
                if (this.getSelectionLength() > 0) {
                    position = editMask.deleteSelectedText(this.getCaretPosition(), this.getSelectionLength(), char);
                } else {
                    //Ввод символа
                    position = editMask.setCharAt(char, this.getCaretPosition(), this.getSelectionLength());
                }

                this.model.setText(editMask.getText());
                if (position !== false) {
                    this.setCaretPosition(position);
                }
                break;
        }


    },

    onKeyupHandler: function (event) {

        this.trigger('onKeyDown', {
            keyCode: event.which,
            value: this.model.getValue()
        });
    },

    onClickHandler: function (event) {
        this.checkCurrentPosition();
        event.preventDefault();
    },

    onPasteHandler: function (event) {
        var originalEvent = event.originalEvent;
        var text = originalEvent.clipboardData.getData('text/plain');
        var editMask = this.model.getEditMask();

        if (editMask) {
            event.preventDefault();
            this.textTyping(text);
        }
    },

    OnDragstartHandler: function (event) {
        var originalEvent = event.originalEvent;
        originalEvent.dataTransfer.effectAllowed = 'copy';
        this.$el.attr('data-dragged', true);
    },

    OnDragendHandler: function (/*event*/) {
        this.$el.removeAttr('data-dragged', false);
    },

    OnDragoverHandler: function (event) {
        event.preventDefault();
    },

    OnDragenterHandler: function (event) {
        var dragged = this.$el.attr('data-dragged');

        if (!dragged && this.getCanChange()) {
            this.model.setEditMode();
        }
    },

    OnDragleaveHandler: function (event) {
        var dragged = this.$el.attr('data-dragged');

        if (!dragged) {
            this.model.setDisplayMode();
        }
    },

    onDropHandler: function (event) {
        event.preventDefault();
        event.stopPropagation();
        var dragged = this.$el.attr('data-dragged');

        if (dragged) {  //prevent drop on self
            return;
        }

        if (!this.getCanChange()) {
            return;
        }

        var originalEvent = event.originalEvent;
        var text = originalEvent.dataTransfer.getData('text/plain');



        this.textTyping(text, 0);
        this.$el.focus();
    },

    getCanChange: function () {
        var disabled = this.$el.prop('disabled');

        return disabled === false;
    },

    /**
     * @description Заполняет поле ввода строкой text начиная с позиции position
     * @protected
     *
     * @param {string} text
     * @param {number} [position]
     */
    textTyping: function (text, position) {
        var editMask = this.model.getEditMask();
        var newText = text;

        if (editMask) {
            text.split('')
                .reduce(function (pos, char) {
                    return editMask.setCharAt(char, pos);
                }, _.isNumber(position) ? position : this.getCaretPosition());

            newText = editMask.getText();
        }

        this.model.setText(newText);
    },

    checkCurrentPosition: function (currentPosition) {

        if (!this.canCaretPosition()) {
            return;
        }
        var editMask = this.model.getEditMask();
        if (!editMask) {
            return;
        }

        if (typeof currentPosition === 'undefined') {
            currentPosition = this.getCaretPosition();
        }

        var position = currentPosition === 0 ? editMask.moveToPrevChar(0) : editMask.moveToNextChar(currentPosition - 1);
        if (position !== currentPosition) {
            this.setCaretPosition(position);
        }

    },

    getSelectionLength: function () {
        var el = this.el,
            len = 0;

        if (this.canCaretPosition()) {
            var startPos = parseInt(el.selectionStart, 10),
                endPos = parseInt(el.selectionEnd, 10);

            if (!isNaN(startPos) && !isNaN(endPos)) {
                len = endPos - startPos;
            }
        }

        return len;
    },

    canCaretPosition: function () {
        return (/text|password|search|tel|url/).test(this.el.type);
    },

    setCaretPosition: function (caretPosition) {

        if (_.isNumber(caretPosition) && this.canCaretPosition()) {
            var el = this.el;

            //IE9+
            if (typeof el.selectionStart !== 'undefined') {
                el.setSelectionRange(caretPosition, caretPosition);
            }
        }

    },

    /**
     * @private
     * Получение позиции курсора в поле редактирования
     * @returns {number}
     */
    getCaretPosition: function () {
        /** @var {HTMLInputElement} **/
        var el = this.el;

        var position = 0;

        if (this.canCaretPosition()) {
            position = el.selectionStart;
        }

        return position;
    },

    initialize: function () {
        this.applyAutocomplete();
        this.listenTo(this.model, 'change:mode', this.onChangeModeHandler);
        this.listenTo(this.model, 'change:text', this.onChangeTextHandler);
        this.listenTo(this.model, 'invalid', this.onInvalidHandler);
    },

    /**
     * @description Для элементов с маской ввода отключаем поддержку автозаполнения
     */
    applyAutocomplete: function () {
        var editMask = this.model.getEditMask();
        if (editMask) {
            this.$el.attr('autocomplete', 'off');
        }
    },

    onInvalidHandler: function (model, error) {
        this.$el.toggleClass(this.classNameError, true);
    },

    onFocusinHandler: function (/* event */) {
        this.model.setEditMode();
        setTimeout(this.setCaretPosition.bind(this, 0), 4);
    },

    onFocusoutHandler: function (/* event */) {
        this.model.setDisplayMode();
    },

    onChangeModeHandler: function (model, mode) {
        this.checkCurrentPosition();
    },

    onChangeTextHandler: function (model, text) {
        var $input = this.$el;
        var position = this.getCaretPosition();

        $input.toggleClass(this.classNameError, false);

        if($input.val() !== text) {
            $input.val(text);
        }

        var editMask = this.model.getEditMask();

        if (editMask) {
            if ($input.is(':focus')) {
                this.checkCurrentPosition(position);
            }
        }

    }

});
//####app/controls/_base/textEditor/_mode/textEditorModelBaseModeStrategy.js
/**
 *
 * @constructor
 */
function TextEditorModelBaseModeStrategy() {
}

/**
 * Отображает текстовое представление значения элемента
 * @abstract
 * @param {TextEditorModel} model
 */
TextEditorModelBaseModeStrategy.prototype.updateText = function (model) {

};


/**
 * Устанавливает значение поля оторажения/ввода значения
 * @param {TextEditorModel} model
 * @param {string} text
 * @param {boolean} ui Признак исзменения со стороны UI
 */
TextEditorModelBaseModeStrategy.prototype.setText = function (model, text, ui) {

};


/**
 * @param model
 * @param value
 */
TextEditorModelBaseModeStrategy.prototype.onChangeTextHandler = function (model, value, options) {

};


//####app/controls/_base/textEditor/_mode/textEditorModelDisplayModeStrategy.js
/**
 * @augments TextEditorModelBaseModeStrategy
 * @constructor
 */
function TextEditorModelDisplayModeStrategy() {
    TextEditorModelBaseModeStrategy.call(this);
}

TextEditorModelDisplayModeStrategy.prototype = Object.create(TextEditorModelBaseModeStrategy.prototype);
TextEditorModelDisplayModeStrategy.prototype.constructor = TextEditorModelDisplayModeStrategy;

TextEditorModelDisplayModeStrategy.prototype.updateText = function (model) {
    var displayFormat = model.getDisplayFormat();
    var value = model.get('value');

    var text;

    if (_.isFunction(displayFormat)) {
        text = displayFormat.call(null, null, {value: value});
    } else {
        text = value;
    }

    model.set('text', text);
};

TextEditorModelDisplayModeStrategy.prototype.setText = function (model, text, ui) {
    if (ui) {
        //Изменение значения в поле ввода для режима просмотра - результат срабатывания автозаполнения браузера
        model.set('text', text, {ui: ui});
    }
};

TextEditorModelDisplayModeStrategy.prototype.onChangeTextHandler = function (model, text, options) {
    if (options.ui) {
        var value = model.convertValue(text);
        model.set('value', value, {ui: options.ui});
    }
    model.applyChanges();
};
//####app/controls/_base/textEditor/_mode/textEditorModelEditModeStrategy.js
/**
 * @augments TextEditorModelBaseModeStrategy
 * @constructor
 */
function TextEditorModelEditModeStrategy() {
    TextEditorModelBaseModeStrategy.call(this);
}

TextEditorModelEditModeStrategy.prototype = Object.create(TextEditorModelBaseModeStrategy.prototype);
TextEditorModelEditModeStrategy.prototype.constructor = TextEditorModelBaseModeStrategy;

TextEditorModelEditModeStrategy.prototype.updateText = function (model) {
    var editMask = model.getEditMask();
    var value = model.get('value');
    var text;

    if (!editMask) {
        text = value;
    } else {
        editMask.reset(value);
        text = editMask.getText();
    }

    if (typeof text === 'undefined' || text === null) {
        model.set('text', '');
    } else {
        model.set('text', text.toString());
    }

};

TextEditorModelEditModeStrategy.prototype.setText = function (model, text, ui) {
    model.set('text', text, {ui: ui});
};

TextEditorModelEditModeStrategy.prototype.onChangeTextHandler = function (model, newValue, options) {
    var editMask = model.getEditMask();
    var value = editMask ?  editMask.getData() : newValue;
    model.set('value', model.convertValue(value), {silent: !!editMask, ui: options.ui});
};


//####app/controls/textBox/textBoxControl.js
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


//####app/controls/textBox/textBoxModel.js
/**
 * @class
 * @augments TextEditorBaseModel
 */
var TextBoxModel = TextEditorBaseModel.extend(/** @lends TextBoxModel.prototype */{
    defaults: _.extend(
        {},
        TextEditorBaseModel.prototype.defaults,
        {
            multiline: false,
            inputType: 'text'
        }
    ),

    initialize: function () {
        TextEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    }

});
//####app/controls/textBox/textBoxView.js
/**
 * @class
 * @augments TextEditorBaseView
 */
var TextBoxView = TextEditorBaseView.extend(/** @lends TextBoxView.prototype */{

    template: {
        oneline: InfinniUI.Template["controls/textBox/template/oneline.tpl.html"],
        multiline: InfinniUI.Template["controls/textBox/template/multiline.tpl.html"]
    },

    className: 'pl-textbox form-group',

    UI: _.extend({}, TextEditorBaseView.prototype.UI),

    events: _.extend({}, TextEditorBaseView.prototype.events, {

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
        this.ui.editor.attr('rows', lineCount);
    },

    render: function () {
        this.prerenderingActions();

        var model = this.model;
        var template = model.get('multiline') ? this.template.multiline : this.template.oneline;

        this.renderTemplate(template);
        this.renderTextBoxEditor();

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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
        this.renderControlEditor();
    }

});

//####app/controls/dateTimePicker/_modes/dateTimePickerMode.date.js
var dateTimePickerModeDate = {
    getTemplate: function () {
        return InfinniUI.Template["controls/dateTimePicker/template/date.tpl.html"];
    },

    onClickDropdownHandler: function (event) {
        var model = this.model;
        var calendar = new SelectDate({
            model: model
        });
        calendar.render();
        $('body').append(calendar.$el);

        calendar.updatePosition(this.el);

        this.listenTo(calendar, 'date', function (date) {
            model.set('value', this.convertValue(date));
        });
    },

    convertValue: function (value) {
        return InfinniUI.DateUtils.toISO8601(value, {timezoneOffset: this.model.get('timeZone')});
    }
};

//####app/controls/dateTimePicker/_modes/dateTimePickerMode.dateTime.js
var dateTimePickerModeDateTime = {
    getTemplate: function () {
        return InfinniUI.Template["controls/dateTimePicker/template/dateTime.tpl.html"];
    },

    onClickDropdownHandler: function (event) {
        var model = this.model;
        var calendar = new SelectDateTime({
            model: model
        });
        calendar.render();
        $('body').append(calendar.$el);

        calendar.updatePosition(this.el);

        this.listenTo(calendar, 'date', function (date) {
            model.set('value', this.convertValue(date));
        });
    },

    convertValue: function (value) {
        return InfinniUI.DateUtils.toISO8601(value, {timezoneOffset: this.model.get('timeZone')});
    }
};

//####app/controls/dateTimePicker/_modes/dateTimePickerMode.time.js
var dateTimePickerModeTime = {
    getTemplate: function () {
        return InfinniUI.Template["controls/dateTimePicker/template/time.tpl.html"];
    },

    onClickDropdownHandler: function (event) {
        var model = this.model;
        var calendar = new SelectTime({
            model: model
        });
        calendar.render();
        $('body').append(calendar.$el);

        calendar.updatePosition(this.el);

        this.listenTo(calendar, 'date', function (date) {
            model.set('value', this.convertValue(date));
        });
    },

    convertValue: function (value) {
        return InfinniUI.DateUtils.toISO8601(value, {timezoneOffset: this.model.get('timeZone')});
    }
};

//####app/controls/dateTimePicker/components/base/selectComponent.js
var SelectComponent = Backbone.View.extend({

    modelClass: Backbone.Model,

    initialize: function (options) {
        var modelClass = this.modelClass;

        this.model = new modelClass({
            today: options.today || new Date(),
            value: options.value,
            date: options.value || options.today,
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
        this.model.setDate(date);
    }

});


_.extend(SelectComponent.prototype, bindUIElementsMixin);
//####app/controls/dateTimePicker/components/base/selectComponentModel.js
var SelectComponentModel = Backbone.Model.extend({

    defaults: function () {
        var today = new Date();

        return {
            today: today,
            todayMonth: today.getMonth(),
            todayDay: today.getDate(),
            todayYear: today.getFullYear(),
            hour: today.getHours(),
            minute: today.getMinutes(),
            second: today.getSeconds(),
            millisecond: today.getMilliseconds()
        }
    },

    initialize: function () {
        this.updateDateParts();
        this.on('change:date', this.onChangeDateHandler, this);
    },

    updateDateParts: function () {
        var date = this.get('date');

        if (date instanceof Date) {
            this.set({
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
                millisecond: date.getMilliseconds()
            });
        } else {
            this.set({
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
            date = InfinniUI.DateUtils.createDate(d) ||  this.get('today'),
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

    checkRange: function (date, precision) {
        var min = this.get('min'),
            max = this.get('max');

        return InfinniUI.DateUtils.checkRangeDate(date, min, max, precision);
    },

    keepDateInRange: function () {
        if (this.isValid()) {
            return;
        }
        var date = InfinniUI.DateUtils.getNearestDate(this.get('date'), this.get('min'), this.get('max'));
        this.set('date', date);
    },

    /**
     * @description Установка текущего положения списка выбора значений
     * Если устанавливается недействительная дата - используется текущая
     * @param date
     */
    setDate: function (date) {
        if (typeof date === 'undefined' || date === null){
            var value = this.get('value'),
                today = this.get('date');

            date = value || today;
        }

        if (date instanceof Date) {
            date = new Date(date.getTime());
        }
        this.set('date', date);
    }


});


//####app/controls/dateTimePicker/components/selectDays.js
var SelectDaysModel = SelectComponentModel.extend({

    initialize: function () {
        SelectComponentModel.prototype.initialize.call(this);
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

        this.keepDateInRange();
    },

    prevMonth: function () {
        var
            month = this.get('month'),
            year = this.get('year');

        this.set({
            month: month === 0 ? 11 : month - 1,
            year: month === 0 ? year - 1 : year
        });

        this.keepDateInRange();
    }

});

var SelectDays = SelectComponent.extend({

    modelClass: SelectDaysModel,

    template: InfinniUI.Template["controls/dateTimePicker/template/date/days.tpl.html"],

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
        this.renderMonth();
        this.renderYear();
        this.initOnChangeHandlers();
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:month', this.onChangeMonthHandler);
        this.listenTo(this.model, 'change:year', this.onChangeYearHandler);
        this.listenTo(this.model, 'change:day', this.onChangeDayHandler);
    },

    renderMonth: function () {
        var month = this.model.get('month');
        var dateTimeFormatInfo = localized.dateTimeFormatInfo;
        this.ui.month.text(dateTimeFormatInfo.monthNames[month]);
    },

    renderYear: function () {
        var year = this.model.get('year');
        this.ui.year.text(year);
    },

    onChangeMonthHandler: function (model, value) {
        this.renderMonth();
        this.fillCalendar();
    },

    onChangeYearHandler: function (model, value) {
        this.renderYear();
        this.fillCalendar();
    },

    fillLegend: function () {
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
        var firstDayOfMonth = new Date(year, month);
        var weekday = firstDayOfMonth.getDay();
        var dateTimeFormatInfo = localized.dateTimeFormatInfo;
        var firstDayOfWeek = dateTimeFormatInfo.firstDayOfWeek;

        var weekdays = [0,1,2,3,4,5,6];
        Array.prototype.push.apply(weekdays, weekdays.splice(0, firstDayOfWeek));
        var start = new Date(year, month, 1 - weekdays.indexOf(weekday));

        var startYear = start.getFullYear(),
            startMonth = start.getMonth(),
            startDate = start.getDate();

        this.ui.calendarDays.each(function (i, el) {
            var $el = $(el);
            var d = new Date(startYear, startMonth, startDate + i);
            $el.text(d.getDate());
            $el.attr('data-date', d);
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
            $el.toggleClass('day-unavailable', !model.checkRange(value, 'day'));
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
        this.trigger('time', this.model.get('date'));
    },

    useDay: function (event) {
        var $el = $(event.target),
            date = new Date($el.attr('data-date'));

        this.model.set({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        });

        this.trigger('date', this.model.get('date'));
    }

});

//####app/controls/dateTimePicker/components/selectHours.js
var SelectHoursModel = SelectComponentModel.extend({

    initialize: function () {
        SelectComponentModel.prototype.initialize.call(this);
        this.on('change:hour', this.updateDatePart.bind(this, 'hour'));
    }

});

var SelectHours = SelectComponent.extend({

    modelClass: SelectHoursModel,

    template: InfinniUI.Template["controls/dateTimePicker/template/time/hours.tpl.html"],

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
            model = this.model;
        var date = model.get('date') || model.get('today');
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
            $el.toggleClass('hour-selected', date.getHours() === value);
        }

        function markNow($el, value) {
            var selected = moment(now).isSame(value, 'hour');
            $el.toggleClass('hour-today', selected);
        }

        function markAvailable($el, value) {
            var date = moment(model.get('date')).hour(value);
            $el.toggleClass('hour-unavailable', !model.checkRange(date, 'hour'));
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

        var newDate = InfinniUI.DateUtils.cloneDate(date);
        newDate.setHours(hour);
        model.set('date', newDate);

        this.trigger('hour', newDate);
    }

});

//####app/controls/dateTimePicker/components/selectMinutes.js
var SelectMinutesModel = SelectComponentModel.extend({

    initialize: function () {
        SelectComponentModel.prototype.initialize.call(this);
        this.on('change:minute', this.updateDatePart.bind(this, 'minute'));
    }

});

var SelectMinutes = SelectComponent.extend({

    modelClass: SelectMinutesModel,

    template: InfinniUI.Template["controls/dateTimePicker/template/time/minutes.tpl.html"],

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
            $el.toggleClass('minute-unavailable', !model.checkRange(date, 'minute'));
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

        var newDate = InfinniUI.DateUtils.cloneDate(date);
        newDate.setMinutes(minute);
        this.trigger('minute', newDate);
    }

});

//####app/controls/dateTimePicker/components/selectMonths.js
var SelectMonthsModel = SelectComponentModel.extend({

    initialize: function () {
        SelectComponentModel.prototype.initialize.call(this);
        this.on('change:month', this.updateDatePart.bind(this, 'month'));
        this.on('change:year', this.updateDatePart.bind(this, 'year'));
    },



    nextYear: function () {
        var year = this.get('year');
        this.set('year', year + 1);
        this.keepDateInRange();
    },

    prevYear: function () {
        var year = this.get('year');
        this.set('year', year - 1);
        this.keepDateInRange();
    },

    today: function () {
        this.set({
            month: this.get('todayMonth'),
            year: this.get('todayYear')
        });
    }
});

var SelectMonths = SelectComponent.extend({

    modelClass: SelectMonthsModel,

    template: InfinniUI.Template["controls/dateTimePicker/template/date/months.tpl.html"],

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
            $el.toggleClass('month-unavailable', !model.checkRange(date, 'month'));
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

//####app/controls/dateTimePicker/components/selectSeconds.js
var SelectSecondsModel = SelectComponentModel.extend({

    initialize: function () {
        SelectComponentModel.prototype.initialize.call(this);
        this.on('change:second', this.updateDatePart.bind(this, 'second'));
    }

});

var SelectSeconds = SelectComponent.extend({

    modelClass: SelectSecondsModel,

    template: InfinniUI.Template["controls/dateTimePicker/template/time/seconds.tpl.html"],

    events: {
        "click .second:not('.second-unavailable')": "useSecond"
    },

    UI: {
        second: '.second'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.fillSecondsTable();
        this.initOnChangeHandlers();
    },

    fillSecondsTable: function () {
        var
            model = this.model,
            second = model.get('second');

        this.ui.second.each(function (i, el) {
            var $el = $(el);
            var second = $el.attr('data-second');
            markSelected($el, parseInt(second, 10));
            markAvailable($el, parseInt(second, 10))
        });

        function markSelected($el, value) {
            $el.toggleClass('second-selected', value === second);
        }

        function markAvailable($el, value) {
            var date = moment(model.get('date')).seconds(value);
            $el.toggleClass('second-unavailable', !model.checkRange(date));
        }
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:date', this.fillSecondsTable);
    },

    useSecond: function (event) {
        var
            $el = $(event.target),
            model = this.model,
            date = model.get('date'),
            second = parseInt($el.attr('data-second'), 10);

        var newDate = InfinniUI.DateUtils.cloneDate(date);

        newDate.setSeconds(second);
        this.trigger('second', newDate);
    }

});

//####app/controls/dateTimePicker/components/selectTimes.js
var SelectTimesModel = SelectComponentModel.extend({

    initialize: function () {
        SelectComponentModel.prototype.initialize.call(this);
        this.on('change:hour', this.updateDatePart.bind(this, 'hour'));
        this.on('change:minute', this.updateDatePart.bind(this, 'minute'));
        this.on('change:second', this.updateDatePart.bind(this, 'second'));
        this.on('change:millisecond', this.updateDatePart.bind(this, 'millisecond'));
    },

    nextHour: function () {
        var hour = this.get('hour');
        hour += 1;

        //@TODO Границу использовать в зависимости от 12/24 формата записи даты из настроек локализации
        if (hour > 23) {
            return;
        }

        this.set('hour', hour);
        this.keepDateInRange();
    },

    prevHour: function () {
        var hour = this.get('hour');
        hour -= 1;

        if (hour < 0) {
            return;
        }

        this.set('hour', hour);
        this.keepDateInRange();
    },

    nextMinute: function () {
        var minute = this.get('minute');
        minute += 1;

        if (minute >= 60) {
            return;
        }

        this.set('minute', minute);
        this.keepDateInRange();
    },

    prevMinute: function () {
        var minute = this.get('minute');
        minute -= 1;

        if (minute < 0) {
            return;
        }

        this.set('minute', minute);
        this.keepDateInRange();
    },

    nextSecond: function () {
        var second = this.get('second');
        second += 1;

        if (second >= 60) {
            return;
        }

        this.set('second', second);
        this.keepDateInRange();
    },

    prevSecond: function () {
        var second = this.get('second');
        second -= 1;

        if (second < 0) {
            return;
        }

        this.set('second', second);
        this.keepDateInRange();
    },

    validate: function (attr, options) {
        var value = InfinniUI.DateUtils.cloneDate(attr.date);
        value.setHours(attr.hour, attr.minute, attr.second, attr.millisecond);

        if (!this.checkRange(value)) {
            return 'Out of range';
        }
    }

});

var SelectTimes = SelectComponent.extend({

    modelClass: SelectTimesModel,

    template: InfinniUI.Template["controls/dateTimePicker/template/time/time.tpl.html"],

    events: {
        "click .time-spin-down.time-spin-hour": "prevHour",
        "click .time-spin-up.time-spin-hour": "nextHour",

        "click .time-spin-down.time-spin-minute": "prevMinute",
        "click .time-spin-up.time-spin-minute": "nextMinute",

        "click .time-spin-down.time-spin-second": "prevSecond",
        "click .time-spin-up.time-spin-second": "nextSecond",

        "click .time-segment-hour": "selectHour",
        "click .time-segment-minute": "selectMinute",
        "click .time-segment-second": "selectSecond",
        "click .days": "selectDay"
    },

    UI: {
        month: '.month',
        year: '.year',
        hour: '.time-segment-hour',
        minute: '.time-segment-minute',
        second: '.time-segment-second'
    },

    render: function () {
        var template = this.template();
        this.$el.html(template);
        this.bindUIElements();
        this.updateHour();
        this.updateMinute();
        this.updateSecond();
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

    selectSecond: function () {
        var
            model = this.model,
            date = model.get('date'),
            hour = model.get('hour'),
            minute = model.get('minute'),
            second = model.get('second');

        date.setHours(hour, minute, second);
        this.trigger('second', date);
    },

    initOnChangeHandlers: function () {
        this.listenTo(this.model, 'change:hour', this.updateHour);
        this.listenTo(this.model, 'change:minute', this.updateMinute);
        this.listenTo(this.model, 'change:second', this.updateSecond);
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

    updateSecond: function () {
        var second = this.model.get('second');
        this.ui.second.text(stringUtils.padLeft(second, 2, '0'));
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

    prevSecond: function () {
        this.model.prevSecond();
    },

    nextSecond: function () {
        this.model.nextSecond();
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

//####app/controls/dateTimePicker/components/selectYears.js
var SelectYearsModel = SelectComponentModel.extend({

    defaults: function () {
        var defaults = SelectComponentModel.prototype.defaults.call(this);

        return _.defaults({
            pageSize: 20,
            page: 0
        }, defaults);
    },

    initialize: function () {
        SelectComponentModel.prototype.initialize.call(this);
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
        this.keepDateInRange();
        model.set('page', 0);
    }

});

var SelectYears = SelectComponent.extend({

    modelClass: SelectYearsModel,

    template: InfinniUI.Template["controls/dateTimePicker/template/date/years.tpl.html"],

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
            $el.toggleClass('year-unavailable', !model.checkRange(date, 'year'));
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

//####app/controls/dateTimePicker/dateTimePickerControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBaseControl
 */
function DateTimePickerControl(parent) {
    _.superClass(DateTimePickerControl, this, parent);
}

window.InfinniUI.DateTimePickerControl = DateTimePickerControl;

_.inherit(DateTimePickerControl, TextEditorBaseControl);

_.extend(DateTimePickerControl.prototype, {

    createControlModel: function () {
        return new DateTimePickerModel();
    },

    createControlView: function (model) {
        return new DateTimePickerView({model: model});
    }
});


//####app/controls/dateTimePicker/dateTimePickerModel.js
/**
 * @class
 * @augments TextEditorBaseModel
 */
var DateTimePickerModel = TextEditorBaseModel.extend(/** @lends DateTimePickerModel.prototype */{
    defaults: _.extend(
        {},
        TextEditorBaseModel.prototype.defaults,
        {
            mode: "Date"
            //today: new Date()
        }
    ),

    initialize: function () {
        TextEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        this.set('today', new Date());
        this.set('timeZone', InfinniUI.DateUtils.getDefaultTimeZone());
    },

    validate: function (attributes, options) {
        var
            min = attributes.minValue,
            max = attributes.maxValue;

        return InfinniUI.DateUtils.checkRangeDate(attributes.value, attributes.minValue, attributes.maxValue);
    }


});
//####app/controls/dateTimePicker/dateTimePickerStrategy.js
var dateTimePickerStrategy = (function () {

    return {
        Date: dateTimePickerModeDate,
        DateTime: dateTimePickerModeDateTime,
        Time: dateTimePickerModeTime
    };

})();


//####app/controls/dateTimePicker/dateTimePickerView.js
/**
 * @class
 * @augments TextEditorBaseView
 */
var DateTimePickerView = TextEditorBaseView.extend(/** @lends DateTimePickerView.prototype */{

    className: "pl-datepicker form-group",

    template: InfinniUI.Template["controls/dateTimePicker/template/date.tpl.html"],

    UI: _.extend({}, TextEditorBaseView.prototype.UI, {
        dropdownButton: '.pl-datepicker-calendar',
        controlWrap: '.control-wrap',
        editorWrap: '.editor-wrap'
    }),

    events: _.extend({}, TextEditorBaseView.prototype.events, {
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
        _.extend(this, dateTimePickerStrategy[mode]);

        this.rerender();
    },

    updateMinValue: function(){
        var mode = this.model.get('mode');
        _.extend(this, dateTimePickerStrategy[mode]);

        this.rerender();
    },

    updateMaxValue: function(){
        var mode = this.model.get('mode');
        _.extend(this, dateTimePickerStrategy[mode]);

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
        this.renderDateTimePickerEditor();

        this.trigger('render');

        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

    renderDateTimePickerEditor: function () {
        var model = this.model;
        this.renderControlEditor();
        return this;
    },

    getTemplate: function () {
        throw new Error('Не перекрыт getTemplate');
    },

    onClickDropdownHandler: function (event) {}

});

//####app/controls/dateTimePicker/selectDate.js
var SelectDate = Backbone.View.extend({

    className: 'pl-datepicker-dropdown pl-dropdown-container',

    template: InfinniUI.Template["controls/dateTimePicker/template/select.date.tpl.html"],

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
        var value = InfinniUI.DateUtils.createDate(model.get('value'));
        var today = InfinniUI.DateUtils.createDate(model.get('today'));
        var timeZone = model.get('timeZone');
        var m = moment(value);

        if (m.isValid()) {
            value = m.toDate();
        } else {
            value = null;
        }

        value = InfinniUI.DateUtils.changeTimezoneOffset(value, timeZone);

        var options = {
            value: value,
            today: today || new Date(),
            //date: value,
            max: model.get('maxValue'),
            min: model.get('minValue')
        };

        options.el = this.ui.months;
        var months = new SelectMonths(options);

        options.el = this.ui.years;
        var years = new SelectYears(options);

        options.el = this.ui.days;
        var days = new SelectDays(options);

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
        var model = this.model;
        var timeZone = model.get('timeZone');

        var min = model.get('minValue'),
            max = model.get('maxValue');

        if (!InfinniUI.DateUtils.checkRangeDate(date, min, max)) {
            date = InfinniUI.DateUtils.getNearestDate(date, min, max);
        }

        this.trigger('date', InfinniUI.DateUtils.restoreTimezoneOffset(date, timeZone));
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
        this.useValue(new Date());
    },

    updatePosition: function (parentDOMElement) {
        var direction = this.getDropdownDirection(parentDOMElement);
        this.setPositionFor(parentDOMElement, direction );
    },

    setPositionFor: function (parentDOMElement, direction) {
        clearInterval(this._intervalId);

        this.applyStyle(parentDOMElement, direction);
        this._intervalId = setInterval(this.applyStyle.bind(this, parentDOMElement, direction), 100);
    },

    remove: function () {
        clearInterval(this._intervalId);
        return Backbone.View.prototype.remove.apply(this, arguments);
    },

    getDropdownDirection: function (parentDOMElement) {

        var windowHeight = $(window).height();
        var rect = parentDOMElement.getBoundingClientRect();
        var height = this.$el.height();

        var direction = 'bottom';
        if (rect.bottom + height + 30 > windowHeight && rect.bottom > windowHeight / 2 && rect.top > height) {
            direction = 'top';
        }

        return direction;
    },

    applyStyle: function (parentDOMElement, direction) {
        var rect = parentDOMElement.getBoundingClientRect();

        var rectDropdown = this.el.getBoundingClientRect();

        //@TODO Вынести общие стили в css
        var style = {
            position: "absolute",
            left: window.pageXOffset + rect.right - Math.round(rectDropdown.width)
        };

        if (direction === 'bottom') {
            style.top = window.pageYOffset + rect.bottom;
        } else {
            style.top = window.pageYOffset + rect.top - this.$el.height();
        }

        this.$el.css(style);
    }


});

_.extend(SelectDate.prototype, bindUIElementsMixin);

//####app/controls/dateTimePicker/selectDateTime.js
var SelectDateTime = SelectDate.extend({

    className: 'pl-datepicker-dropdown pl-dropdown-container',

    template: InfinniUI.Template["controls/dateTimePicker/template/select.dateTime.tpl.html"],

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
        var value = InfinniUI.DateUtils.createDate(model.get('value'));
        var today = InfinniUI.DateUtils.createDate(model.get('today'));
        var timeZone = model.get('timeZone');
        var m = moment(value);

        if (m.isValid()) {
            value = m.toDate();
        } else {
            value = null;
        }

        value = InfinniUI.DateUtils.changeTimezoneOffset(value, timeZone);

        var options = {
            value: value,
            today: today || new Date(),
            //date: value,
            max: model.get('maxValue'),
            min: model.get('minValue')
        };

        options.el = this.ui.months;
        var months = new SelectMonths(options);

        options.el = this.ui.years;
        var years = new SelectYears(options);

        options.el = this.ui.days;
        var days = new SelectDays(options);

        options.el = this.ui.times;
        var time = new SelectTimes(options);
        //time.setDate(undefined);

        options.el = this.ui.hours;
        var hours = new SelectHours(options);

        options.el = this.ui.minutes;
        var minutes = new SelectMinutes(options);


        this.workflow(days, months, years, time, hours, minutes)(value);
    },

    useTime: function (date) {
        var model = this.model;
        var timeZone = model.get('timeZone');

        var min = model.get('minValue'),
            max = model.get('maxValue');

        if (!InfinniUI.DateUtils.checkRangeDate(date, min, max)) {
            date = InfinniUI.DateUtils.getNearestDate(date, min, max);
        }

        this.trigger('date', InfinniUI.DateUtils.restoreTimezoneOffset(date, timeZone));

        return date;
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
                var newDate = useTime(date);
                showTime(newDate);
            })
            .listenTo(minutes, 'minute', function (date) {
                var newDate = useTime(date);
                showTime(newDate);
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
//####app/controls/dateTimePicker/selectTime.js
var SelectTime = SelectDate.extend({

    className: 'pl-timepicker-dropdown pl-dropdown-container',

    template: InfinniUI.Template["controls/dateTimePicker/template/select.time.tpl.html"],

    UI: {
        times: '.times',
        hours: '.hours',
        minutes: '.minutes',
        seconds: '.seconds'
    },

    renderComponents: function () {
        var model = this.model;
        var value = InfinniUI.DateUtils.createDate(model.get('value'));
        var today = InfinniUI.DateUtils.createDate(model.get('today'));
        var timeZone = model.get('timeZone');
        var m = moment(value);

        if (m.isValid()) {
            value = m.toDate();
        } else {
            value = null;
        }

        value = InfinniUI.DateUtils.changeTimezoneOffset(value, timeZone);
        //if (value === null || typeof value === 'undefined') {
        //    value = today;
        //}

        var options = {
            value: value,
            today: today,
            //date: date,
            max: model.get('maxValue'),
            min: model.get('minValue')
        };

        options.el = this.ui.times;
        var time = new SelectTimes(options);

        options.el = this.ui.hours;
        var hours = new SelectHours(options);

        options.el = this.ui.minutes;
        var minutes = new SelectMinutes(options);

        options.el = this.ui.seconds;
        var seconds = new SelectSeconds(options);

        this.workflow(time, hours, minutes, seconds)(value);
    },

    useTime: function (date) {
        var model = this.model;
        var timeZone = model.get('timeZone');

        var min = model.get('minValue'),
            max = model.get('maxValue');

        if (!InfinniUI.DateUtils.checkRangeDate(date, min, max)) {
            date = InfinniUI.DateUtils.getNearestDate(date, min, max);
        }

        this.trigger('date', InfinniUI.DateUtils.restoreTimezoneOffset(date, timeZone));
        return date;
    },

    workflow: function (time, hours, minutes, seconds) {
        var useTime = this.useTime.bind(this);
        var components = Array.prototype.slice.call(arguments);

        this.listenTo(time, 'hour', function (date) {
            showHours(date);
        })
            .listenTo(time, 'minute', function (date) {
                showMinutes(date);
            })
            .listenTo(time, 'second', function (date) {
                showSeconds(date);
            })
            .listenTo(time, 'date', function (date) {
                useTime(date);
            })
            .listenTo(hours, 'hour', function (date) {
                var value = useTime(date);
                showTime(value);
            })
            .listenTo(minutes, 'minute', function (date) {
                var value = useTime(date);
                showTime(value);
            })
            .listenTo(seconds, 'second', function (date) {
                var value = useTime(date);
                showTime(value);
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

        function showSeconds(date) {
            seconds.setDate(date);
            switchComponent(seconds);
        }

        function showTime(date) {
            time.setDate(date);
            switchComponent(time);
        }

    }

});
//####app/controls/datePicker/datePickerControl.js
function DatePickerControl(parent) {
    _.superClass(DatePickerControl, this, parent);
}

_.inherit(DatePickerControl, DateTimePickerControl);

_.extend(DatePickerControl.prototype, {

    createControlModel: function () {
        return new DatePickerModel();
    },

    createControlView: function (model) {
        return new DatePickerView({model: model});
    }
});


//####app/controls/datePicker/datePickerModel.js
var DatePickerModel = DateTimePickerModel.extend({

    initialize: function () {
        DateTimePickerModel.prototype.initialize.apply(this, arguments);


    }

});
//####app/controls/datePicker/datePickerView.js
var DatePickerView = DateTimePickerView .extend({
    
});
//####app/controls/datePicker/dateTimePickerMode.datePicker.js
console.assert(dateTimePickerModeDate, "dateTimePickerModeDate is undefined");

var dateTimePickerModeDatePicker = _.extend({}, dateTimePickerModeDate, {

    convertValue: function (value) {
        var _value = null;
        if (value && value.constructor === Date) {
            _value = InfinniUI.DateUtils.dateToTimestamp(value);
        }

        return _value;
    }
});

dateTimePickerStrategy['DatePicker'] = dateTimePickerModeDatePicker;

//####app/controls/timePicker/dateTimePickerMode.timePicker.js
console.assert(dateTimePickerModeTime, "dateTimePickerModeTime is undefined");

var dateTimePickerModeTimePicker = _.extend({}, dateTimePickerModeTime, {

    convertValue: function (value) {
        var _value = null;
        if (value && value.constructor === Date) {
            _value = InfinniUI.DateUtils.dateToTimestampTime(value);
        }

        return _value;
    }

});

dateTimePickerStrategy['TimePicker'] = dateTimePickerModeTimePicker;
//####app/controls/timePicker/timePickerControl.js
function TimePickerControl(parent) {
    _.superClass(TimePickerControl, this, parent);
}

_.inherit(TimePickerControl, DateTimePickerControl);

_.extend(TimePickerControl.prototype, {

    createControlModel: function () {
        return new TimePickerModel();
    },

    createControlView: function (model) {
        return new TimePickerView({model: model});
    }
});


//####app/controls/timePicker/timePickerModel.js
var TimePickerModel = DateTimePickerModel.extend({

    initialize: function () {
        DateTimePickerModel.prototype.initialize.apply(this, arguments);
        var date = new Date();
        date.setFullYear(1970, 0, 1);
        this.set('today', date);
    }

});
//####app/controls/timePicker/timePickerView.js
var TimePickerView = DateTimePickerView .extend({

    className: "pl-datepicker pl-timepicker form-group"

});
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
//####app/controls/application/statusBar/authentication/SignInSuccessView.js
jQuery(document).ready(function () {
    if( InfinniUI.config.disableGetCurrentUser !== false ) {
            InfinniUI.user = {
            onReadyDeferred: $.Deferred(),
            onReady: function(handler){
                this.onReadyDeferred.done(handler);
            }
        };

        refreshUserInfo();
    }
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
            InfinniUI.user.onReadyDeferred.resolve(result);
        },
        function (error) {
            InfinniUI.user .onReadyDeferred.resolve(null);
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
    if( InfinniUI.config.disableSignInExternalForm !== false ) {
        getSignInExternalForm();
    }
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
        this.sendPostRequestForServiceResult('/Auth/GetCurrentUser', {}, resultCallback, errorCallback);
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

        this.sendPostRequestForServiceResult('/Auth/ChangePassword', changePasswordForm, resultCallback, errorCallback);
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

        this.sendPostRequestForServiceResult('/Auth/ChangeProfile', changeProfileForm, resultCallback, errorCallback);
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

        this.sendPostRequestForServiceResult('/Auth/ChangeActiveRole', changeActiveRoleForm, function(){
            var args = _.toArray(arguments);
            args.push(activeRole);
            if(resultCallback){
                resultCallback.apply(this, args);
            }

            this.handlers.onActiveRoleChanged.fire.apply(this.handlers.onActiveRoleChanged, args);
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

        this.sendPostRequestForServiceResult('/Auth/SignInInternal', signInInternalForm, resultCallback, errorCallback);
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

        this.sendPostRequestForServiceResult('/Auth/SignOut', null, function(){
            InfinniUI.user.onReadyDeferred = $.Deferred();
            InfinniUI.user.onReadyDeferred.resolve(null);

            var args = _.toArray(arguments);
            if(resultCallback){
                resultCallback.apply(this, args);
            }

            this.handlers.onSignOut.fire.apply(this.handlers.onSignOut, args);

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
        var that = this;

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
                if(error.status != 200) {
                    if(errorCallback) {
                        errorCallback(error.responseJSON);
                    }
                } else {
                    that.onSuccessRequest(resultCallback).apply(that, arguments);
                }
            })
        });
    },

    sendPostRequestForServiceResult: function (requestUri, requestData, successCallback, errorCallback) {
        var resultCallback = function(){
            var args = _.toArray(arguments),
                serviceResult = args[0];

            if(serviceResult['Success']){
                args[0] = serviceResult['Result'];

                if( _.isFunction(successCallback) ){
                    successCallback.apply(this, args);
                }
            } else {
                args[0] = serviceResult['Error'];

                if( _.isFunction(errorCallback) ){
                    errorCallback.apply(this, args);
                }
            }
        };

        this.sendPostRequest(requestUri, requestData, resultCallback, errorCallback);
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
//####app/controls/button/commonView/buttonView.js
/**
 * @class ButtonView
 * @augments ControlView
 */
var CommonButtonView = ControlView.extend({

    className: 'pl-button',

    template: InfinniUI.Template["controls/button/commonView/template/button.tpl.html"],

    UI: {
        button: 'button'
    },

    events: {
        'click button': 'onClickHandler'
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this, arguments);
        this.initHighlightMixin();
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);

        this.updateContent();
        this.updateType();
    },

    updateType: function() {
        var type = this.model.get('type');
        this.getButtonElement().attr('type', type);
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

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (!focusable) {
            this.getButtonElement().attr('tabindex', -1);
        } else {
            this.getButtonElement().removeAttr('tabindex');
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
            this.getButtonElement()
                .removeClass(this.valueToBackgroundClassName(this.currentBackground));
        }

        if (customStyle) {
            this.getButtonElement()
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    getButtonElement: function(){
        return this.ui.button;
    },

    setFocus: function () {
        this.getButtonElement().focus();
    }



});

_.extend(CommonButtonView.prototype, highlightMixin.controlView);


InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.Button.common', CommonButtonView);

//####app/controls/button/linkView/buttonView.js
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

    getButtonElement: function(){
        return this.$el;
    }

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.Button.link', LinkButtonView);

//####app/controls/button/buttonControl.js
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

_.extend(
    ButtonControl.prototype,
    highlightMixin.control, {

        createControlModel: function () {
            return new ButtonModel();
        },

        createControlView: function (model, viewMode) {
            if (!viewMode || !viewMode in window.InfinniUI.viewModes.Button) {
                viewMode = 'common';
            }

            var ViewClass = window.InfinniUI.viewModes.Button[viewMode];

            return new ViewClass({model: model});
        },

        setType: function(type) {
            this.controlModel.set('type', type);
        },

        getType: function() {
            return this.controlModel.get('type');
        }

    }, buttonControlMixin);


//####app/controls/button/buttonModel.js
/**
 * @class
 * @augments ControlModel
 */
var ButtonModel = ControlModel.extend({

    defaults: _.defaults({
        content: null,
        contentTemplate: null,
        horizontalAlignment: 'Left',
        type: 'button'
    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
    }

});

//####app/controls/button/menuItemView/buttonView.js
/**
 * @class ButtonView
 * @augments ControlView
 */
var MenuItemButtonView = LinkButtonView.extend({

    updateHorizontalAlignment: function(){
        var horizontalAlignment = this.model.get('horizontalAlignment');
        var that = this;
        var $el;

        domHelper.whenReady(
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

    }

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.Button.menuItem', MenuItemButtonView);
//####app/controls/buttonEdit/buttonEditControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextBoxControl
 */
function ButtonEditControl(parent) {
    _.superClass(ButtonEditControl, this, parent);
}

_.inherit(ButtonEditControl, TextBoxControl);

_.extend(ButtonEditControl.prototype, {

    createControlModel: function () {
        return new ButtonEditModel();
    },

    createControlView: function (model) {
        return new ButtonEditView({model: model});
    },

    onButtonClick: function (handler) {
        this.controlView.on('buttonClick', handler);
    }
});


//####app/controls/buttonEdit/buttonEditModel.js
var ButtonEditModel = TextBoxModel.extend({

    defaults: _.defaults({
        showClear: true,
        readOnly: true
    }, TextBoxModel.prototype.defaults),

    initialize: function () {
        TextBoxModel.prototype.initialize.apply(this, arguments);
    },

    clearValue: function () {
        var enabled = this.get('enabled');

        if (enabled) {
            this.set('value', null);
        }
    }

});
//####app/controls/buttonEdit/buttonEditView.js
var ButtonEditView = TextBoxView.extend(/** @lends ButtonEditView.prototype */{

    template: {
        oneline: InfinniUI.Template["controls/buttonEdit/template/textBoxInput.tpl.html"],
        multiline: InfinniUI.Template["controls/buttonEdit/template/textBoxArea.tpl.html"]
    },

    className: 'pl-button-edit form-group',

    UI: _.extend({}, TextBoxView.prototype.UI, {
        iconAction: '.pl-button-edit-button__icon_action',
        buttonClear: '.pl-button-edit-button_clear',
        buttons: '.pl-button-edit-button'
    }),

    events: _.extend({}, TextBoxView.prototype.events, {
        'click .pl-button-edit-button_action': 'onClickButtonHandler',
        'click .pl-button-edit-button_clear': 'onClickClearHandler'
    }),

    initHandlersForProperties: function () {
        TextBoxView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:icon', this.updateIcon);
        this.listenTo(this.model, 'change:showClear', this.updateShowClear);
        this.listenTo(this.model, 'change:readOnly', this.updateReadOnly);
    },

    updateProperties: function () {
        TextBoxView.prototype.updateProperties.call(this);
        this.updateIcon();
        this.updateShowClear();
        this.updateReadOnly();
    },

    updateIcon: function () {
        var icon = this.model.get('icon');
        this.switchClass('fa', icon, this.ui.iconAction);
    },

    updateShowClear: function () {
        var showClear = this.model.get('showClear');
        var value = this.model.get('value');

        this.ui.buttonClear.toggleClass('hidden',  !showClear || _.isEmpty(value));
    },

    updateReadOnly: function () {
        var readOnly = this.model.get('readOnly');

        this.ui.control.prop('readonly', readOnly);
    },

    updateEnabled: function () {
        var enabled = this.model.get('enabled');
        TextBoxView.prototype.updateEnabled.call(this);

        //@TODO Update button states
        this.ui.buttons.toggleClass('pl-button-edit-button_disabled', !enabled);
    },

    updateValue: function () {
        TextBoxView.prototype.updateValue.call(this);
        this.updateShowClear();
    },

    onClickButtonHandler: function (event) {
        var enabled = this.model.get('enabled');

        if (enabled) {
            this.trigger('buttonClick', event);
        }
    },

    onClickClearHandler: function (event) {
        this.model.clearValue();
    }

});
//####app/controls/comboBox/dropdown/comboBoxDropdownView.js
var ComboBoxDropdownView = Backbone.View.extend({

    className: "pl-dropdown-container",
    events: {
        'click .backdrop': 'onClickBackdropHandler',
        'keyup .pl-combobox-filter-text': 'onKeyUpHandler',
        'keydown .pl-combobox-filter-text': 'onFilterKeyDownHandler'
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
        this.listenTo(this.model, 'change:autocompleteValue', this.onChangeSearchHandler);
        this.listenTo(this.model, 'change:autocomplete', this.updateAutocomplete);
        this.listenTo(this.model, 'change:selectedItem', this.onChangeSelectedItem);
        this.listenTo(this.strategy, 'click', this.onClickItemHandler);
        this.listenTo(this.strategy, 'mouseenter', this.onMouseEnterItemHandler);
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this.$el;
    },

    renderItems: function () {
        this.$el.hide();
        var $items = this.strategy.renderItems();
        this.$items = $items;
        var items = this.model.get('items');

        var noItems = (items && items.length == 0);
        this.ui.noItems.toggleClass('hidden', !noItems);

        this.markSelectedItems();
        this.markCheckedItems();

        this.trigger('itemsRendered2');
        this.$el.show();
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

    markSelectedItems: function () {
        var model = this.model;
        if (!Array.isArray(this.$items)) {
            return;
        }

        var $container = this.ui.items;
        var $items = this.$items;
        var selectedItem = model.getSelectedItem();

        $items.forEach(function ($item) {
            var selected = selectedItem === $item.data('pl-data-item');
            $item.toggleClass('pl-combobox-selected', selected);
        });

        this.ensureVisibleSelectedItem();

    },

    ensureVisibleSelectedItem: function () {
        var model = this.model;
        if (!Array.isArray(this.$items)) {
            return;
        }

        var $container = this.ui.items;
        var $items = this.$items;
        var selectedItem = model.getSelectedItem();

        $items.some(function ($item) {
            var selected = selectedItem === $item.data('pl-data-item');
            if (selected) {
                ensureItem($container, $item);
            }
            return selected;
        });

        function ensureItem($container, $item) {
            var newScrollTop;

            var scrollTop = $container.scrollTop();
            var itemTop = $item.position().top;
            var itemHeight = $item.outerHeight();
            var viewHeight = $container.innerHeight();
            if (itemTop + itemHeight > viewHeight) {
                newScrollTop = scrollTop + itemTop + itemHeight - viewHeight;
            } else if (itemTop < 0) {
                newScrollTop = scrollTop + itemTop;
            }

            if (typeof newScrollTop !== 'undefined') {
                $container.scrollTop(newScrollTop);
            }
        }
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
            $item.toggleClass('pl-combobox-checked', selected);
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

    onMouseEnterItemHandler: function (item) {
        this.model.setSelectedItem(item);
    },

    onClickItemHandler: function (item) {
        var isEnabled = !this.model.isDisabledItem(item);
        if(isEnabled) {
            this.model.toggleItem(item);
            this.close();
        }
    },

    onKeyUpHandler: function (event) {
        //@TODO grow input
        var text = this.ui.text.val();
        this.trigger('search', text);
    },

    onKeyDownHandler: function (event) {
        var model = this.model;
        event.preventDefault();
        this.onFilterKeyDownHandler(event);
    },

    onFilterKeyDownHandler: function (event) {
        var model = this.model;
        switch (event.which) {
            case 36://Home;
                model.selectFirstItem();
                break;
            case 35: //End
                model.selectLastItem();
                break;
            case 38: //Up
                model.selectPrevItem();
                break;
            case 40: //Down
                model.selectNextItem();
                break;
            case 13:
                this.onClickItemHandler(model.getSelectedItem());
                break;
            case 9:
                this.close();
                break;
            case 27://Escape
                this.close();
                event.stopPropagation();
                break;
        }
    },

    onChangeSearchHandler: function (model, value) {
        this.ui.search.text(value);
    },

    onChangeSelectedItem: function (model, value) {
        this.markSelectedItems();
    },

    updatePosition: function (parentDOMElement) {
        var direction = this.getDropdownDirection(parentDOMElement);
        this.setPositionFor(parentDOMElement, direction );
    },

    setPositionFor: function (parentDOMElement, direction) {
        clearInterval(this._intervalId);

        this.applyStyle(parentDOMElement, direction);
        this._intervalId = setInterval(this.applyStyle.bind(this, parentDOMElement, direction), 100);
    },

    remove: function () {
        clearInterval(this._intervalId);
        return Backbone.View.prototype.remove.apply(this, arguments);
    },

    getDropdownDirection: function (parentDOMElement) {

        var windowHeight = $(window).height();
        var rect = parentDOMElement.getBoundingClientRect();
        var height = this.$el.height();

        var direction = 'bottom';
        if (rect.bottom + height + 30 > windowHeight && rect.bottom > windowHeight / 2) {
            direction = 'top';
        }

        return direction;
    },

    applyStyle: function (parentDOMElement, direction) {
        var rect = parentDOMElement.getBoundingClientRect();

        var style = {
            left: window.pageXOffset + rect.left,
            width: Math.round(rect.width) - 1
        };

        if (direction === 'bottom') {
            style.top = window.pageYOffset + rect.bottom;
        } else {
            style.top = window.pageYOffset + rect.top - this.$el.height();
        }

        this.$el.css(style);
    }

});

_.extend(ComboBoxDropdownView.prototype, bindUIElementsMixin);

//####app/controls/comboBox/dropdown/viewBaseStrategy.js
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

ComboBoxBaseViewStrategy.prototype.isEnabledItem = function (item) {
    return !this.dropdownView.model.isDisabledItem(item);
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
        var itemEl = itemTemplate(undefined, {
            value: item,
            index: collection.indexOf(item)
        });
        var $item = itemEl.render();

        if (typeof item !== 'undefined') {
            $item.data('pl-data-item', item);
        }

        this.addOnClickEventListener($item, item);
        this.addOnHoverEventListener($item, item);

        itemEl.setEnabled( this.isEnabledItem(item) );

        return $item;
    }, this);

    return $items;
};

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


ComboBoxBaseViewStrategy.prototype.addOnHoverEventListener = function ($el) {
    var el = $el[0];
    var params = Array.prototype.slice.call(arguments, 1);
    var handler = this.trigger.bind(this, 'mouseenter');
    $el.on('mouseenter', function () {
        handler.apply(this, params);
    });
};

_.extend(ComboBoxBaseViewStrategy.prototype, Backbone.Events);
//####app/controls/comboBox/dropdown/viewGroupStrategy.js
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

ComboBoxGroupViewStrategy.prototype.template = InfinniUI.Template["controls/comboBox/dropdown/template/group/template.tpl.html"];

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


//####app/controls/comboBox/dropdown/viewPlainStrategy.js
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

ComboBoxPlainViewStrategy.prototype.template = InfinniUI.Template["controls/comboBox/dropdown/template/plain/template.tpl.html"];

ComboBoxPlainViewStrategy.prototype.getTemplate = function () {
    return this.template;
};

//####app/controls/comboBox/dropdown/group/groupView.js
var ComboBoxGroupView = Backbone.View.extend({

    template: InfinniUI.Template["controls/comboBox/dropdown/group/template/template.tpl.html"],

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

        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop

        return this.$el;
    }

});

_.extend(ComboBoxGroupView.prototype, bindUIElementsMixin);

//####app/controls/comboBox/values/comboBoxValue.js
var ComboBoxValueModel = Backbone.Model.extend({

});

var ComboBoxValue = Backbone.View.extend({

    template: InfinniUI.Template["controls/comboBox/values/template/value.tpl.html"],

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
//####app/controls/comboBox/values/comboBoxValues.js
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

    template: InfinniUI.Template["controls/comboBox/values/template/values.tpl.html"],

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
//####app/controls/dataGrid/dataGridControl.js
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
    },

    onCheckAllChanged: function (handler) {
        this.controlModel.onCheckAllChanged(handler);
    },

    setEnabled: function(value) {
        this.controlModel.set('enabled', value);
    },

    onRowClick: function(callback) {
        this.controlView.$el.on('click', '.pl-datagrid__body .pl-datagrid-row', callback);
    },

    onRowDoubleClick: function(callback) {
        this.controlView.$el.on('dblclick', '.pl-datagrid__body .pl-datagrid-row', callback);
    }
});


//####app/controls/dataGrid/dataGridModel.js
/**
 * @constructor
 * @augments ListEditorBaseModel
 */
var DataGridModel = ListEditorBaseModel.extend({
    defaults: _.defaults({
        showSelectors: true,
        checkAllVisible: false,
        checkAll: false,
        focusable: false,
        sortedColumn: null
    }, ListEditorBaseModel.prototype.defaults),

    initialize: function () {
        ListEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        this.initColumns();
    },

    toggleCheckAll: function () {
        this.set('checkAll', !this.get('checkAll'));
    },

    onCheckAllChanged: function (handler) {
        this.on('change:checkAll', function (model, checkAll) {
            handler.call(null, {value: checkAll});
        });
    },

    /**
     * @protected
     */
    initColumns: function () {
        this.set('columns', new Collection());
    }
});

//####app/controls/dataGrid/dataGridView.js
/**
 * @constructor
 * @augments ListEditorBaseView
 */
var DataGridView = ListEditorBaseView.extend({

    template: {
        "grid": InfinniUI.Template["controls/dataGrid/template/dataGrid.tpl.html"],
        "gridStretched": InfinniUI.Template["controls/dataGrid/template/dataGridStretched.tpl.html"],
        "headerCell": InfinniUI.Template["controls/dataGrid/template/headerCell.tpl.html"],
        "sizeCell": InfinniUI.Template["controls/dataGrid/template/sizeCell.tpl.html"]
    },

    className: 'pl-datagrid',

    events: _.extend({},
        ListEditorBaseView.prototype.events,
        {
            "click .pl-datagrid-toggle_all": "onClickCheckAllHandler",
            'click thead .pl-datagrid-row__cell': 'onClickToHeaderCellHandler'
        }
    ),

    UI: _.defaults({
        body: ".pl-datagrid__body",
        head: ".pl-datagrid__head",
        headContainer: ".pl-datagrid-container_head",

        header: '.pl-datagrid-row_header',
        firstRows: '.pl-datagrid-row_first',
        toggleCell: ".pl-toggle-cell",
        checkAll: ".pl-datagrid-toggle__button",
        items: 'tbody'
    }, ListEditorBaseView.prototype.UI),

    initialize: function (options) {
        ListEditorBaseView.prototype.initialize.call(this, options);
        this.rowElements = new HashMap();
    },

    initHandlersForProperties: function(){
        ListEditorBaseView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:showSelectors', this.updateShowSelectors);
        this.listenTo(this.model, 'change:checkAllVisible', this.updateCheckAllVisible);
        this.listenTo(this.model, 'change:checkAll', this.updateCheckAll);

        /** Update hash item => element when item changed **/
        var rowElements = this.rowElements;
        var model = this.model;
        this.model.get('items').onChange(function(event){
            if (event.action === 'replace') {
                event.oldItems.forEach(function (oldItem, index) {
                    rowElements.add(event.newItems[index], rowElements.get(oldItem));
                    rowElements.remove(oldItem);
                });
            }
        });
    },

    updateProperties: function () {
        ListEditorBaseView.prototype.updateProperties.call(this);
        this.updateShowSelectors();
        this.updateCheckAllVisible();
        this.updateCheckAll();
        this.updateDisabledItem();
    },

    updateShowSelectors: function () {
        var showSelectors = this.model.get('showSelectors');
        this.$el.toggleClass('pl-datagrid_selectors_show', showSelectors);
        this.$el.toggleClass('pl-datagrid_selectors_hide', !showSelectors);
    },

    updateGrouping: function () {

    },

    updateVerticalAlignment: function () {
        ListEditorBaseView.prototype.updateVerticalAlignment.call(this);
        this.switchClass('verticalAlignment', this.model.get('verticalAlignment'), this.ui.body, false);
    },

    updateCheckAll: function () {
        var checkAll = this.model.get('checkAll');
        this.ui.checkAll.prop('checked', checkAll);
    },

    getHorizontalScrollBarWidth: function () {

        if (typeof DataGridView.scrollbarWidth === 'undefined') {
            var scrollDiv = document.createElement('div');
            var body = document.body;

            scrollDiv.className = 'modal-scrollbar-measure';
            var style = {
                position: "absolute",
                top: "-9999px",
                width: "50px",
                height: "50px",
                overflow: "scroll"
            };

            for(var name in style) {
                scrollDiv.style[name] = style[name]
            }

            body.appendChild(scrollDiv);
            DataGridView.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            body.removeChild(scrollDiv);
        }

        return DataGridView.scrollbarWidth;
    },

    updateCheckAllVisible: function () {
        var checkAllVisible = this.model.get('checkAllVisible');
        this.ui.checkAll.toggleClass('hidden', !checkAllVisible);
    },

    updateMultiSelect: function () {
        ListEditorBaseView.prototype.updateMultiSelect.call(this);

        var multiSelect = this.model.get('multiSelect');
        this.$el.toggleClass('pl-datagrid_select_multi', multiSelect === true);
        this.$el.toggleClass('pl-datagrid_select_single', multiSelect !== true);
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

        this.rowElements.forEach(function (rowElement, item) {
            var index = items.indexOf(item);
            var toggle = indices.indexOf(index) !== -1;
            rowElement.toggle(toggle);
        });

    },

    updateSelectedItem: function () {
        var model = this.model,
            selectedItem = model.get('selectedItem');

        this.rowElements.forEach(function (rowElement, item) {
            rowElement.setSelected(item === selectedItem);
        });
    },

    updateDisabledItem: function () {
        var model = this.model,
            disabledItemCondition = model.get('disabledItemCondition'),
            isEnabled;

        if( disabledItemCondition != null ) {
            this.rowElements.forEach(function (rowElement, item) {
                isEnabled = !disabledItemCondition( undefined, {value: item} );
                if( rowElement.getSelected() === item && isEnabled === false ) {
                    model.set('selectedItem', null);
                }
                rowElement.setEnabled(isEnabled);
            });
        } else {
            this.rowElements.forEach(function (rowElement, item) {
                rowElement.setEnabled(true);
            });
        }
    },

    updateEnabled: function() {
        var isEnabled = this.model.get('enabled');
        if( isEnabled ) {
            this.updateDisabledItem();
        } else {
            this.disableDataGridItems();
        }
    },

    disableDataGridItems: function() {
        this.model.set('selectedItem', null);
        this.rowElements.forEach(function (rowElement, item) {
            rowElement.setEnabled(false);
        });
    },

    render: function () {
        var that = this;
        this.prerenderingActions();

        var verticalAlignment = this.model.get('verticalAlignment');
        var template = (verticalAlignment === 'Stretch') ? this.template.gridStretched : this.template.grid;
        this.$el.html(template());

        this.bindUIElements();

        this.renderHeaders();
        this.renderItems();

        this.trigger('render');

        this.applyColumnWidth();
        this.syncBodyAndHead();
        this.postrenderingActions();
        setTimeout(function() {
            that.updateProperties();
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: that});
            //devblockstop
        }, 0);
        return this;
    },

    applyColumnWidth: function () {
        var columns = this.model.get('columns');
        var fixedTableLayout = false;

        this.ui.firstRows.children().each(function (i, el) {
            var columnIndex = i % (columns.length + 1);

            if (columnIndex === 0) {
                //skip columns with checkbox/radiobutton
                return;
            }

            var column = columns.getByIndex(columnIndex - 1);
            var width = column && column.getWidth();

            if (width) {
                $(el).css('width', width);
                fixedTableLayout = true;
            }
        });

        this.$el.toggleClass('pl-datagrid_layout_fixed', fixedTableLayout);
    },

    syncBodyAndHead: function () {
        //var $body = this.ui.body;
        var $head = this.ui.head;

        $head.css('padding-right', this.getHorizontalScrollBarWidth() + "px");

        this.ui.body
            .off('scroll')
            .on('scroll', this.onScrollBodyHandler.bind(this));

    },

    onScrollBodyHandler: function () {
        this.ui.headContainer.scrollLeft(this.ui.body.scrollLeft());
    },

    renderHeaders: function () {
        var that = this;
        var columns = this.model.get('columns');
        var templateHeaderCell = this.template.headerCell;
        var sizeCells = [];
        var templateSizeCells = this.template.sizeCell;

        var $headers = columns.toArray().map(function (column) {

            sizeCells.push(templateSizeCells());
            var $th = $(templateHeaderCell());

            var headerTemplate = column.getHeaderTemplate();
            var header = column.getHeader();

            $th.data('pl-column', column);

            if( column.getSortable() ) {
                $th.addClass('sortable');

                if( column.getSortDirection()  ) {
                    setTimeout(function() {
                        that.setUpColumnSort(column, $th, column.getSortDirection(), false);
                    }, 0);
                }
            }

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
        this.ui.firstRows.append(sizeCells);
    },

    renderItems: function () {
        var
            model = this.model,
            valueSelector = model.get('valueSelector'),
            itemTemplate = model.get('itemTemplate'),
            items = model.get('items'),
            $items = this.ui.items,
            that = this;

        this.removeRowElements();

        items.forEach(function (item, index) {
            setTimeout(function() {
                var element = itemTemplate(undefined, {index: index, item: item});

                element.onBeforeClick(function() {
                    var items = model.get('items'),
                        item = items.getByIndex(index),
                        rowItem = that.rowElements.get(item);
                    if( rowItem.getEnabled() !== false ) {
                        model.set('selectedItem', item);
                    }
                });

                element.onToggle(function() {
                    var enabled = this.model.get('enabled');
                    var items = model.get('items');

                    if(enabled){
                        model.toggleValue(valueSelector(undefined, {value:items.getByIndex(index)}));
                    }
                });
                element.childElements = element.control.controlView.childElements;
                that.addRowElement(item, element);

                var $element = element.render();
                $items.append($element);
            }, 0);
        }, this);

    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        this.rowElements.values.forEach(function (element) {
            if (focusable) {
                element.control.controlView.$el.attr('tabindex', 0);
            } else {
                element.control.controlView.$el.removeAttr('tabindex');
            }
        })
    },

    addRowElement: function(item, element){
        this.addChildElement(element);
        this.rowElements.add(item, element);
    },

    removeRowElements: function () {
        this.removeChildElements();
        this.rowElements.clear();
    },

    onClickCheckAllHandler: function () {
        this.model.toggleCheckAll();
    },

    onClickToHeaderCellHandler: function (e) {
        var $th = $(e.currentTarget),
            column = $th.data('pl-column');

        if( column && column.isSortable() ){
            if(column.getSortDirection() === null) {
                this.resetSort();
                this.setUpColumnSort(column, $th, 'asc');
            } else if( column.getSortDirection() === 'asc' ) {
                this.resetSort('asc');
                this.setUpColumnSort(column, $th, 'desc');
            } else if( column.getSortDirection() === 'desc' ) {
                this.resetSort('desc');
                this.setUpColumnSort(column, $th, 'asc');
            }
        }
    },

    setUpColumnSort: function(column, $th, direction, triggerEvent) {
        column.setSortDirection(direction);
        this.model.set('sortedColumn', column);
        if( !column.getIsHeaderTemplateEmpty() ) {
            $th.addClass('sorted headerTemplate-sorted-' + direction);
        } else {
            $th.addClass('sorted sorted-' + direction);
        }
        if( triggerEvent !== false ) {
            column.trigger('onSort', {sortDirection: direction});
        }
    },

    resetSort: function(direction) {
        if( !direction ) {
            var $sortableCell = this.$el.find('.sorted');
            $sortableCell.removeClass('sorted headerTemplate-sorted-asc headerTemplate-sorted-desc sorted-asc sorted-desc');
            var  sortedCell = this.model.get('sortedColumn');
            if( sortedCell ) {
                sortedCell.setSortDirection(null);
            }
        } else {
            var $sortableCell = this.$el.find('.sorted');
            $sortableCell.removeClass('headerTemplate-sorted-' + direction + ' sorted-' + direction);
        }
    }


});



//####app/controls/dataGrid/dataGridRow/dataGridRowControl.js
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


//####app/controls/dataGrid/dataGridRow/dataGridRowModel.js
var DataGridRowModel = ControlModel.extend({

});
//####app/controls/dataGrid/dataGridRow/dataGridRowView.js
var DataGridRowView = ControlView.extend({

    className: 'pl-datagrid-row pl-datagrid-row_data',

    classNameSelected: 'info',

    tagName: 'tr',

    events: {},

    template: {
        singleSelect: InfinniUI.Template["controls/dataGrid/dataGridRow/template/singleSelect.tpl.html"],
        multiSelect: InfinniUI.Template["controls/dataGrid/dataGridRow/template/multiSelect.tpl.html"],
        dataCell: InfinniUI.Template["controls/dataGrid/dataGridRow/template/dataCell.tpl.html"]
    },

    UI: {
        toggleCell: '.pl-datagrid-row__cell_toggle',
        toggle: '.pl-datagrid-toggle',
        toggleControl: '.pl-datagrid-toggle input'
    },

    initialize: function () {
        ControlView.prototype.initialize.call(this);
        this.childElements = [];
        this.on('render', function () {
            this.ui.toggleCell.on('click', this.onToggleHandler.bind(this));
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

    updateVerticalAlignment: function () {
        //Use Vertical alignment for DataGrid
    },

    render: function () {
        this.prerenderingActions();
        var $el = this.$el;
        var row = this;

        var templateName = this.model.get('multiSelect') ? 'multiSelect' : 'singleSelect';
        var template = this.template[templateName];
        $el.html(template());
        this.bindUIElements();

        var templates = this.model.get('cellTemplates');
        var templateDataCell = this.template.dataCell;
        if (Array.isArray(templates)) {
            templates.forEach(function (template, index) {
                var $cell = $(templateDataCell());
                var cellElement = template();
                $cell.append(cellElement.render());
                $el.append($cell);
                row.addChildElement(cellElement);
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
        this.ui.toggleControl.prop('checked', !!toggle);
    },

    updateSelected: function () {
        var selected = this.model.get('selected');
        this.$el.toggleClass(this.classNameSelected, !!selected);
    },

    updateEnabled: function () {
        ControlView.prototype.updateEnabled.call(this);

        var enabled = this.model.get('enabled');
        this.ui.toggleControl.attr('disabled', enabled ? null : 'disabled');
    },

    onToggleHandler: function (event) {
        this.trigger('toggle');
    },

    addChildElement: function (element) {
        this.childElements.push(element);
    },

    removeChildElements: function () {
        this.childElements.forEach(function (element) {
            element.remove();
        });

        this.childElements.length = 0;
    },

    remove: function () {
        this.removeChildElements();
        ControlView.prototype.remove.call(this);
    }


});


//####app/controls/dataNavigation/buttons/dataNavigationBaseButton.js
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


//####app/controls/dataNavigation/buttons/dataNavigationNextButton.js
var DataNavigationNextButton = DataNavigationBaseButton.extend({

    template: InfinniUI.Template["controls/dataNavigation/buttons/template/next.tpl.html"],

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

//####app/controls/dataNavigation/buttons/dataNavigationPageButton.js
var DataNavigationPageButton = DataNavigationBaseButton.extend({
    template: InfinniUI.Template["controls/dataNavigation/buttons/template/page.tpl.html"],

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
//####app/controls/dataNavigation/buttons/dataNavigationPrevButton.js
var DataNavigationPrevButton = DataNavigationBaseButton.extend({

    template: InfinniUI.Template["controls/dataNavigation/buttons/template/prev.tpl.html"],

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

//####app/controls/dataNavigation/dataNavigationButtonFactory.js
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
//####app/controls/dataNavigation/dataNavigationControl.js
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
//####app/controls/dataNavigation/dataNavigationModel.js
var DataNavigationModel = ControlModel.extend({

    defaults: _.defaults({
            pageNumber: 0,
            pageStart: 0,
            _buttonsCount: 5,
            _buttonsTemplate: ['prev', 'page', 'next'],
            pageCount: null,
            isDataReady: false
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
//####app/controls/dataNavigation/dataNavigationView.js
var DataNavigationView = ControlView.extend({

    template: InfinniUI.Template["controls/dataNavigation/template/dataNavigation.tpl.html"],

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
        this.listenTo(this.model, 'change:pageCount', this.updateButtons);
        this.listenTo(this.model, 'change:isDataReady', this.updateButtons);
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

        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    renderPageSizes: function () {
        this.ui.sizes.append(this._pageSizes.render().$el);
    },

    renderButtons: function () {
        var
            template = this.model.get('_buttonsTemplate'),
            buttonsCount = this.model.get('_buttonsCount'),
            pageCount = this.model.get('pageCount'),
            pageNumber = this.model.get('pageNumber'),
            pageStart = this.model.get('pageStart'),
            isDataReady = this.model.get('isDataReady'),
            buttons,
            nowManyElementsRemove;

        this._removeChildViews();

        if(!isDataReady){
            return;
        }

        var
            buttonsFactory = this.buttonsFactory,
            model = this.model;

        buttons = template.reduce(function (buttons, buttonType) {
            if (buttonType === 'page') {
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

        if(typeof pageCount == 'number' && pageStart + buttonsCount >= pageCount){
            nowManyElementsRemove = pageStart + buttonsCount - pageCount + 1;

            if(pageCount == 0){
                nowManyElementsRemove += 1;
            }

            buttons.splice(buttons.length - nowManyElementsRemove, 100);
        }

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

//####app/controls/dataNavigation/pageSizes/dataNavigationPageSizes.js
var DataNavigationPageSizes = Backbone.View.extend({

    className: "btn-group",

    template: InfinniUI.Template["controls/dataNavigation/pageSizes/template/pageSizes.tpl.html"],

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

//####app/controls/label/commonView/labelView.js
/**
 * @class LabelView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var CommonLabelView = ControlView.extend(_.extend({}, editorBaseViewMixin, /** @lends LabelView.prototype */{
    className: 'pl-label',

    template: InfinniUI.Template["controls/label/commonView/template/label.tpl.html"],

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
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);

        this.updateDisplayFormat();
        this.updateTextWrapping();
        this.updateTextTrimming();
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (focusable) {
            this.ui.control.attr('tabindex', 0);
        } else {
            this.ui.control.removeAttr('tabindex');
        }
    },

    updateValue: function(){
        var escapeHtml = this.model.get('escapeHtml');
        var setContent = escapeHtml ? 'text' : 'html';
        var textForLabel = this.getLabelText();
        var $label = this.getLabelElement();

        $label[setContent](textForLabel);
        var title = String(textForLabel);
        $label.attr('title', title.replace(/<\/?[^>]+>/g, '')); //strip html tags
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
        this.prerenderingActions();
        this.renderTemplate(this.template);

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.Label.common', CommonLabelView);

//####app/controls/label/label.js
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
        if(!viewMode || ! (viewMode in window.InfinniUI.viewModes.Label)){
            viewMode = 'simple';
        }

        var ViewClass = window.InfinniUI.viewModes.Label[viewMode];

        return new ViewClass({model: model});
    },
    
    getDisplayValue: function () {
        return this.controlView.getLabelText();
    }

}, editorBaseControlMixin);

//####app/controls/label/labelModel.js
var LabelModel = ControlModel.extend(_.extend({

    defaults: _.defaults({
        horizontalTextAlignment: 'Left',
        verticalAlignment: 'Top',
        textWrapping: true,
        textTrimming: true,
        escapeHtml: true,
        focusable: false
    }, ControlModel.prototype.defaults),

    initialize: function(){
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }
}, editorBaseModelMixin));
//####app/controls/label/simpleView/labelView.js
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

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (focusable) {
            this.$el.attr('tabindex', 0);
        } else {
            this.$el.removeAttr('tabindex');
        }
    },

    getLabelElement: function(){
        return this.$el;
    }

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.Label.simple', SimpleLabelView);
//####app/controls/listBox/baseView/listBoxView.js
var BaseListBoxView = ListEditorBaseView.extend({

    template: {
        plain: InfinniUI.Template["controls/listBox/baseView/template/listBox.tpl.html"],
        grouped: InfinniUI.Template["controls/listBox/baseView/template/listBoxGrouped.tpl.html"]
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
            choosingItem, $choosingItem;

        if(!this.isMultiselect() && value !== undefined && value !== null){
            value = [value];
        }

        if($.isArray(value)){
            for(var i= 0, ii=value.length; i < ii; i++){
                choosingItem = this.model.itemByValue(value[i]);
                $choosingItem = this._getElementByItem(choosingItem);

                if($choosingItem){
                    $choosingItem.addClass('pl-listbox-i-chosen');
                    $choosingItem.find('.pl-listbox-input input').prop('checked', true);
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
            $selectedItem = this._getElementByItem(selectedItem);

        if( $selectedItem && !$selectedItem.hasClass('pl-disabled-list-item') ) {
            $selectedItem.addClass('pl-listbox-i-selected');
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

        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

    isFocusable: function () {
        return this.model.get('focusable');
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
    },

    updateDisabledItem: function(){
        var model = this.model,
            disabledItemCondition = model.get('disabledItemCondition');

        this.ui.items.removeClass('pl-disabled-list-item');
        this.ui.checkingInputs.attr('disabled', null);

        if( disabledItemCondition != null ){
            this.ui.items.each(function (i, el) {
                var $el = $(el),
                    item = $el.data('pl-data-item'),
                    isDisabled = disabledItemCondition( undefined, {value: item});

                if(isDisabled){
                    if( $el.hasClass('pl-listbox-i-selected') ) {
                        this.model.set('selectedItem', null);
                    }
                    $el.toggleClass('pl-disabled-list-item', true);
                    $el.find('input').attr('disabled', 'disabled');
                    $el.find('button').attr('disabled', 'disabled');
                }
            })
        }
    },

    disableAll: function() {
        this.ui.items.addClass('pl-disabled-list-item');
    },

    _getElementByItem: function(item){
        var element = _.find(this.ui.items, function(listboxItem){
            return $(listboxItem).data('pl-data-item') == item;
        });

        return $(element);
    }
});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.ListBox.base', BaseListBoxView);

//####app/controls/listBox/baseView/viewGroupStrategy.js
function ListBoxViewGroupStrategy(listbox) {
    this.listbox = listbox;
};

_.extend(ListBoxViewGroupStrategy.prototype, {

    prepareItemsForRendering: function(){
        var items = this.listbox.getItems(),
            inputName = 'listbox-' + guid(),
            result = {
                isMultiselect: this.listbox.isMultiselect(),
                focusable: this.listbox.isFocusable(),
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

            groups[groupKey].push({index: index, item: item});
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
            itemTemplate = this.listbox.getItemTemplate(),
            groupTitleTemplate = this.listbox.getGroupItemTemplate(),
            groups = preparedItems.groups,
            listbox = this.listbox,
            item, itemEl, titleEl, $el, group;

        $listbox.find('.pl-listbox-group-i').each(function(i, el){

            group = groups[i];
            titleEl = groupTitleTemplate(undefined, {index: group.items[0].index, item: group});
            listbox.addChildElement(titleEl);

            $el = $(el);
            $el.find(".pl-listbox-group-title").append(titleEl.render());

            $el.find(".pl-listbox-body").each(function(j, bodyEl){
                item = group.items[j].item;
                itemEl = itemTemplate(undefined, {index: group.items[j].index, item: item});

                listbox.addChildElement(itemEl);

                $(bodyEl).append(itemEl.render());
                $(bodyEl).parent()
                    .data('pl-data-item', item);
            });

        });
    }
});
//####app/controls/listBox/baseView/viewPlainStrategy.js
function ListBoxViewPlainStrategy(listbox) {
    this.listbox = listbox;
};

_.extend(ListBoxViewPlainStrategy.prototype, {

    prepareItemsForRendering: function(){
        var items = this.listbox.getItems(),
            inputName = 'listbox-' + guid(),
            result = {
                isMultiselect: this.listbox.isMultiselect(),
                focusable: this.listbox.isFocusable(),
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
//####app/controls/listBox/listBoxControl.js
function ListBoxControl(viewMode) {
    _.superClass(ListBoxControl, this, viewMode);
}

_.inherit(ListBoxControl, ListEditorBaseControl);

_.extend(ListBoxControl.prototype, {

    createControlModel: function () {
        return new ListBoxModel();
    },

    createControlView: function (model, viewMode) {
        if(!viewMode || ! viewMode in window.InfinniUI.viewModes.ListBox){
            viewMode = 'common';
        }

        var ViewClass = window.InfinniUI.viewModes.ListBox[viewMode];

        return new ViewClass({model: model});
    },

    updateDisabledItem: function() {
        this.controlView.updateDisabledItem();
    },

    disableAll: function() {
        this.controlView.disableAll();
    }

});


//####app/controls/listBox/listBoxModel.js
var ListBoxModel = ListEditorBaseModel.extend({
    initialize: function () {
        ListEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    }
});
//####app/controls/listBox/checkingView/listBoxView.js
var CheckingListBoxView = BaseListBoxView.extend({
    className: 'pl-listbox',

    template: {
        plain: InfinniUI.Template["controls/listBox/checkingView/template/listBox.tpl.html"],
        grouped: InfinniUI.Template["controls/listBox/checkingView/template/listBoxGrouped.tpl.html"]
    },

    events: _.extend( {

    }, BaseListBoxView.prototype.events),

    initialize: function (options) {
        BaseListBoxView.prototype.initialize.call(this, options);
        this.initDomHandlers();
    },

    updateEnabled: function () {
        ListEditorBaseView.prototype.updateEnabled.call(this);

        var enabled = this.model.get('enabled');

        this.ui.checkingInputs.attr('disabled', !enabled);
    },

    initDomHandlers: function(){
        var $listBox = this.$el,
            that = this;

        $listBox.get(0).addEventListener('click', function(e){
            e = $.event.fix(e);
            var $el = $(e.target),
                $currentListItem, item, isDisabledItem;

            if (!that.model.get('enabled')) {
                return;
            }

            while($el.get(0) != $listBox.get(0)){
                if($el.hasClass('pl-listbox-i')){
                    $currentListItem = $el;
                }

                $el = $el.parent();
            }

            if($currentListItem && $currentListItem.length > 0){
                item = $currentListItem.data('pl-data-item');
                isDisabledItem = that.model.isDisabledItem(item);

                if(!isDisabledItem) {
                    that.model.toggleValue(item);
                }

                that.model.set('selectedItem', item);
            }

        }, true);
    }
});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.ListBox.checking', CheckingListBoxView);
//####app/controls/listBox/commonView/listBoxView.js
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
                $currentListItem, item, isDisabledItem;

            while($el.get(0) != $listBox.get(0)){
                if($el.hasClass('pl-listbox-i')){
                    $currentListItem = $el;
                }

                $el = $el.parent();
            }

            if($currentListItem.length > 0){
                item = $currentListItem.data('pl-data-item');
                isDisabledItem = that.model.isDisabledItem(item);

                if(!isDisabledItem){
                    that.model.toggleValue(item);
                }

                that.model.set('selectedItem', item);
            }

        }, true);
    }
});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.ListBox.common', CommonListBoxView);
//####app/controls/popupButton/commonView/popupButtonView.js
var CommonPopupButtonView = ContainerView.extend({

    className: 'pl-popup-button',

    template: InfinniUI.Template["controls/popupButton/commonView/template/popupButton.tpl.html"],
    dropdownTemplate: InfinniUI.Template["controls/popupButton/commonView/template/popupButton.dropdown.tpl.html"],

    events: {
        'click': 'onClickHandler'
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

        this.$dropdown.on('click', this.close.bind(this));

        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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
    },

    close: function(){
        this.$dropdown.removeClass('open');
        this.$dropdown.detach();
    },

    alignDropdown: function(){
        var offset = this.$el.offset(),
            $elHeight = this.$el.height(),
            $elWidth = this.$el.width(),
            dropdownList = this.$dropdown.find('.pl-popup-button__items')[0],
            $dropdownHeight = dropdownList.offsetHeight,
            $dropdownWidth = dropdownList.offsetWidth,
            left = offset.left,
            top = offset.top + $elHeight;

        if( (offset.left + $dropdownWidth) >= window.innerWidth ) {
            left += ($elWidth - $dropdownWidth);
        }

        if( (top + $dropdownHeight) >= window.innerHeight ) {
            top -= ($elHeight + $dropdownHeight + 2);
        }

        this.$dropdown.offset({
            top: top,
            left: left
        });
    },

    toggle: function(){
        if(!this.$dropdown.hasClass('open')){
            this.open();
        }else{
            this.close();
        }
    },

    onClickHandler: function(){
        this.toggle();
    },

    updateGrouping: function(){}

});

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.PopupButton.common', CommonPopupButtonView);

//####app/controls/popupButton/popupButtonControl.js
function PopupButtonControl(viewMode) {
    _.superClass(PopupButtonControl, this, viewMode);
}

_.inherit(PopupButtonControl, ContainerControl);

_.extend(PopupButtonControl.prototype, /** @lends PopupButtonControl.prototype */ {

    createControlModel: function () {
        return new PopupButtonModel();
    },

    createControlView: function (model, viewMode) {
        if(!viewMode || ! viewMode in window.InfinniUI.viewModes.PopupButton){
            viewMode = 'common';
        }

        var ViewClass = window.InfinniUI.viewModes.PopupButton[viewMode];

        return new ViewClass({model: model});
    }

}, buttonControlMixin);


//####app/controls/popupButton/popupButtonModel.js
var PopupButtonModel = ContainerModel.extend({

});
//####app/controls/popupButton/forMenuView/popupButtonView.js
var ForMenuPopupButtonView = CommonPopupButtonView.extend({

    tagName: 'a',
    className: 'pl-popup-button',
    attributes: {
        href: 'javascript:;'
    },

    template: InfinniUI.Template["controls/popupButton/forMenuView/template/popupButton.tpl.html"],
    dropdownTemplate: InfinniUI.Template["controls/popupButton/commonView/template/popupButton.dropdown.tpl.html"],

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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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
        this.toggle();
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

InfinniUI.ObjectUtils.setPropertyValueDirect(window.InfinniUI, 'viewModes.PopupButton.forMenu', ForMenuPopupButtonView);

//####app/controls/stackPanel/stackPanelControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments ContainerControl
 */
function StackPanelControl(viewMode) {
    _.superClass(StackPanelControl, this, viewMode);
}

_.inherit(StackPanelControl, ContainerControl);

_.extend(StackPanelControl.prototype,
    /** @lends StackPanelControl.prototype */
    {
        createControlModel: function () {
            return new StackPanelModel();
        },

        createControlView: function (model, viewMode) {
            var view = new StackPanelView({model: model});

            view.viewMode = viewMode;

            return view;
        }
    }
);


//####app/controls/stackPanel/stackPanelModel.js
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
//####app/controls/stackPanel/baseView/stackPanelView.js
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
            plain: InfinniUI.Template["controls/stackPanel/baseView/template/stackPanel.tpl.html"],
            grouped: InfinniUI.Template["controls/stackPanel/baseView/template/stackPanelGrouped.tpl.html"]
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
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: this});
            //devblockstop
            return this;
        },

        initOrientation: function () {
            this.listenTo(this.model, 'change:orientation', this.updateOrientation);
            this.updateOrientation();
        },

        updateOrientation: function () {
            var orientation = this.model.get('orientation');
            this.$el.toggleClass('horizontal-orientation', orientation == 'Horizontal');
            this.$el.toggleClass('pl-stack-panel_horizontal', orientation == 'Horizontal');
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

//####app/controls/stackPanel/baseView/viewGroupStrategy.js
function StackPanelViewGroupStrategy(stackPanel) {
    this.stackPanel = stackPanel;
}

_.extend(StackPanelViewGroupStrategy.prototype, {

    groupTemplate: InfinniUI.Template["controls/stackPanel/baseView/template/stackPanelGroup.tpl.html"],

    prepareItemsForRendering: function(){
        var items = this.stackPanel.getItems(),
            inputName = 'listbox-' + guid(),
            result = {
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
            if (!groups.hasOwnProperty(k)) {
                continue;
            }
            result.groups.push({
                items: groups[k],
                indices: groups[k].map(function (item) {
                    return items.indexOf(item);
                })
            });
        }

        return result;
    },

    getTemplate: function(){
        return this.stackPanel.template.grouped;
    },

    /**
     *
     * @param {Object} preparedItems
     * @param {Array} preparedItems.groups
     */
    appendItemsContent: function (preparedItems) {
        var
            stackPanel = this.stackPanel,
            $stackPanel = stackPanel.$el,
            groupTemplate = this.groupTemplate,
            groupHeaderTemplate = this.stackPanel.getGroupItemTemplate(),
            itemTemplate = this.stackPanel.getItemTemplate(),
            $groups,
            groups = preparedItems.groups;

        $groups = groups.map(function (group, groupIndex) {

            var $items,
                items = group.items || [],
                indices = group.indices || [],
                $group = $(groupTemplate({items: items})),
                groupHeader = groupHeaderTemplate(null, {
                    index: indices[0],  //Индекс любого элемента в этой группе
                    item: group
                });

            stackPanel.addChildElement(groupHeader);

            $items = items.map(function (item, itemIndex) {
                var element = itemTemplate(null, {index: indices[itemIndex], item: item});
                stackPanel.addChildElement(element);
                return element.render();
            });

            $('.pl-stack-panel-group__header', $group).append(groupHeader.render());

            $('.pl-stack-panel-list__item', $group).each(function (i, el) {
                $(el).append($items[i]);
            });

            return $group;

        });

        $stackPanel.append($groups);
    }
});
//####app/controls/stackPanel/baseView/viewPlainStrategy.js
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

    appendItemsContent: function(preparedItems, childElementsClass){
        var $stackPanel = this.stackPanel.$el,
            itemTemplate = this.stackPanel.getItemTemplate(),
            items = preparedItems.items,
            stackPanel = this.stackPanel,
            itemEl, $el;

        childElementsClass = childElementsClass || '.pl-stack-panel-i';

        $stackPanel.find(childElementsClass).each(function(i, el){
            $el = $(el);
            itemEl = itemTemplate(undefined, {index: i, item: items[i]});
            stackPanel.addChildElement(itemEl);
            $el.append(itemEl.render());

            $el.parent().data('pl-data-item', items[i]);
        });
    }
});

//####app/controls/tablePanel/tablePanelControl.js
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


//####app/controls/tablePanel/tablePanelModel.js
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
//####app/controls/tablePanel/tablePanelView.js
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
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: this});
            //devblockstop
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

//####app/controls/tablePanel/cell/cellControl.js
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


//####app/controls/tablePanel/cell/cellModel.js
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
//####app/controls/tablePanel/cell/cellView.js
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
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: this});
            //devblockstop
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

//####app/controls/tablePanel/row/rowControl.js
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


//####app/controls/tablePanel/row/rowModel.js
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
//####app/controls/tablePanel/row/rowView.js
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
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: this});
            //devblockstop
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

//####app/controls/tabPanel/tabPanelControl.js
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


//####app/controls/tabPanel/tabPanelModel.js
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
            headerLocation: InfinniUI.TabHeaderLocation.top,
            headerOrientation: InfinniUI.TabHeaderOrientation.horizontal
        },
        ContainerModel.prototype.defaults
    )

});
//####app/controls/tabPanel/tabPanelView.js
/**
 * @class
 * @augments ControlView
 */
var TabPanelView = ContainerView.extend(/** @lends TabPanelView.prototype */ {

    className: 'pl-tabpanel',

    template: {
        top: InfinniUI.Template["controls/tabPanel/template/tabPanel.top.tpl.html"],
        right: InfinniUI.Template["controls/tabPanel/template/tabPanel.right.tpl.html"],
        bottom: InfinniUI.Template["controls/tabPanel/template/tabPanel.bottom.tpl.html"],
        left: InfinniUI.Template["controls/tabPanel/template/tabPanel.left.tpl.html"],
        none: InfinniUI.Template["controls/tabPanel/template/tabPanel.none.tpl.html"]
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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
            case InfinniUI.TabHeaderLocation.top:
                template = this.template.top;
                break;
            case InfinniUI.TabHeaderLocation.right:
                template = this.template.right;
                break;
            case InfinniUI.TabHeaderLocation.bottom:
                template = this.template.bottom;
                break;
            case InfinniUI.TabHeaderLocation.left:
                template = this.template.left;
                break;
            case InfinniUI.TabHeaderLocation.none:
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

//####app/controls/tabPanel/tabHeader/tabHeaderView.js
var TabHeaderModel = Backbone.Model.extend({

    defaults: {
        text: '',
        canClose: false
    }
});

var TabHeaderView = Backbone.View.extend({

    className: "pl-tabheader",

    tagName: "li",

    template: InfinniUI.Template["controls/tabPanel/tabHeader/template/tabHeader.tpl.html"],

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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

//####app/controls/tabPanel/tabPage/tabPageControl.js
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


//####app/controls/tabPanel/tabPage/tabPageModel.js
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
//####app/controls/tabPanel/tabPage/tabPageView.js
/**
 * @class
 * @augments ControlView
 */
var TabPageView = ContainerView.extend(/** @lends TabPageView.prototype */ {

    className: 'pl-tabpage hidden',

    template: InfinniUI.Template["controls/tabPanel/tabPage/template/tabPage.tpl.html"],

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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

//####app/controls/treeView/treeViewControl.js
function TreeViewControl() {
    _.superClass(TreeViewControl, this);
}

_.inherit(TreeViewControl, ListEditorBaseControl);

_.extend(TreeViewControl.prototype, {

    createControlModel: function () {
        return new TreeViewModel();
    },

    createControlView: function (model) {
        return new TreeViewView({model: model});
    }
});


//####app/controls/treeView/treeViewModel.js
var TreeViewModel = ListEditorBaseModel.extend({

    initialize: function () {
        ListEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    toggleItem: function (item, toggle) {
        var value = this.valueByItem(item);
        this.toggleValue(value, toggle);
        this.trigger('toggle');
    }
});
//####app/controls/treeView/treeViewView.js
var TreeViewView = ListEditorBaseView.extend({

    className: 'pl-treeview',
    classNameMultiSelect: 'pl-treeview_multi-select',
    classNameSingleSelect: 'pl-treeview_single-select',

    template: InfinniUI.Template["controls/treeView/template/treeview.tpl.html"],

    events: {},

    UI: _.defaults({}, ListEditorBaseView.prototype.UI),

    initialize: function (options) {
        ListEditorBaseView.prototype.initialize.call(this, options);
        this.ItemsMap = new HashMap();

    },

    render: function () {
        this.prerenderingActions();

        this.renderTemplate(this.getTemplate());

        this.renderItems();
        this.updateProperties();

        this.trigger('render');

        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    renderItems: function (parentId) {
        var
            view = this,
            $nodes,
            model = this.model,
            collection = model.get('items'),
            parentSelector = model.get('parentSelector'),
            keySelector = model.get('keySelector'),
            nodeConstructor = this.getNodeConstructor(),
            itemTemplate = model.get('itemTemplate'),
            itemsMap = this.ItemsMap;

        itemsMap.clear();

        $nodes = renderNodes();
        this.$el.append($nodes);

        function renderNodes (parentId) {
            return collection.toArray()
                .filter(function (item) {
                    var parent = parentSelector(null, {value: item});
                    return isEmpty(parentId) ? isEmpty(parent) : parent === parentId;
                })
                .map(function (item) {
                    var node = new nodeConstructor().render();
                    var $node = node.$el;
                    var $item = itemTemplate(null, {
                        value: item,
                        index: collection.indexOf(item)
                    }).render();

                    $node.data('pl-data-item', item);

                    node.listenTo(model, 'change:selectedItem', function (model, selectedItem) {
                        node.setSelected(selectedItem === item);
                    });

                    node.listenTo(model, 'change:value', function (model, value) {
                        var multiSelect = model.get('multiSelect');

                        var checked;
                        if (!multiSelect) {
                            checked = isValueForItem(value);
                        } else if (Array.isArray(value)) {
                            checked = value.some(isValueForItem)
                        } else {
                            checked = false;
                        }
                        node.setChecked(checked);
                    });

                    view.listenTo(node, 'select', view.onSelectNodeHandler.bind(view, item, node));
                    view.listenTo(node, 'check', view.onCheckNodeHandler.bind(view, item, node));

                    node.setItemContent($item);
                    var key = keySelector(null, {value: item}),
                        $subitems = renderNodes(key);
                    node.setItemsContent($subitems);

                    itemsMap.add(key, item);

                    return $node;

                    function isValueForItem(value) {
                        return model.itemByValue(value) === item;
                    }
                });
        }

        function isEmpty(value) {
            return value === null || typeof value === 'undefined';
        }
    },

    getNodeConstructor: function () {
        var multiSelect = this.model.get('multiSelect');

        return (multiSelect === true) ? TreeViewNodeCheckbox : TreeViewNodeRadio;
    },

    onSelectNodeHandler: function(item , index) {
        var model = this.model;

        var multiSelect = model.get('multiSelect');

        model.set('selectedItem', item);
        if (!multiSelect) {
            //Клик по элементу одновременно переключает значение и делает элемент выделенным
            this.tryToggleValue(item);
        }
    },

    onCheckNodeHandler: function (item, index) {
        var model = this.model;

        var multiSelect = model.get('multiSelect');

        this.tryToggleValue(item);

        if (!multiSelect) {
            //Клик по элементу одновременно переключает значение и делает элемент выделенным
            model.set('selectedItem', item);
        }
    },

    tryToggleValue: function(item){
        var model = this.model;
        var isDisabledItem = this.isDisabledItem(item);

        if(!isDisabledItem){
            var value = model.valueByItem(item);
            model.toggleValue(value);
        }
    },

    isDisabledItem: function(item){
        if(item == null){
            return false;
        }

       return this.model.isDisabledItem(item) || this.isDisabledItem(this.getParent(item));
    },

    getParent: function(item){
        var parentSelector = this.model.get('parentSelector'),
            parentId = parentSelector(null, {value: item});

        return parentId && this.ItemsMap.get(parentId);
    },

    getTemplate: function () {
        return this.template;
    },

    updateProperties: function () {
        ListEditorBaseView.prototype.updateProperties.call(this);
        this.updateMultiSelect();
    },

    updateMultiSelect: function () {
        var multiSelect = this.model.get('multiSelect');
        this.$el.toggleClass(this.classNameMultiSelect, !!multiSelect);
        this.$el.toggleClass(this.classNameSingleSelect, !multiSelect);
    },

    updateEnabled: function () {
        ListEditorBaseView.prototype.updateEnabled.call(this);

        var enabled = this.model.get('enabled');

    },

    updateValue: function () {

    },

    updateSelectedItem: function () {

    },

    updateGrouping: function () {
    },

    updateDisabledItem: function() {
        var model = this.model;
        var disabledItemCondition = model.get('disabledItemCondition');
        var nodes = this.$el.find('.pl-treeview-node');

        nodes.removeClass('pl-disabled-list-item');

        if( disabledItemCondition != null){
            nodes.each(function(i, el){
                var $el = $(el),
                    item = $el.data('pl-data-item');

                if(model.isDisabledItem(item)){
                    $el.addClass('pl-disabled-list-item');
                }
            });
        }
    },

    rerender: function () {

    }


});

//####app/controls/treeView/node/treeViewNodeBase.js
var TreeViewNodeBase = Backbone.View.extend({

    className: 'pl-treeview-node',

    classNameCheckerChecked: 'pl-treeview-item__checker_checked',
    classNameContentSelected: 'pl-treeview-item__content_selected',
    classNameItemsExpanded: 'pl-treeview-node__items_expanded',
    classNameItemsCollapsed: 'pl-treeview-node__items_collapsed',
    classNameButtonCollapse: 'pl-treeview-node__button_collapse',
    classNameButtonExpand: 'pl-treeview-node__button_expand',

    UI: {
        checker: '.pl-treeview-item__checker',
        content: '.pl-treeview-item__content',
        items: '.pl-treeview-node__items',
        button: '.pl-treeview-node__button'
    },

    initialize: function () {
        var model = new Backbone.Model({collapsed: true});
        this.model = model;
        this.listenTo(model, 'change:selected', this.updateSelected);
        this.listenTo(model, 'change:checked', this.updateChecked);
        this.listenTo(model, 'change:collapsed', this.updateCollapsed);
    },

    updateChecked: function () {
        var checked = this.model.get('checked');
        this.ui.checker.toggleClass(this.classNameCheckerChecked, checked === true);
    },

    updateSelected: function () {
        var selected = this.model.get('selected');
        this.ui.content.toggleClass(this.classNameContentSelected, selected === true);
    },

    updateCollapsed: function () {
        var collapsed = !!this.model.get('collapsed');
        this.ui.items.toggleClass(this.classNameItemsExpanded, !collapsed);
        this.ui.items.toggleClass(this.classNameItemsCollapsed, collapsed);
        this.ui.button.toggleClass(this.classNameButtonCollapse, !collapsed);
        this.ui.button.toggleClass(this.classNameButtonExpand, collapsed);
    },

    updateState: function () {
        this.updateCollapsed();
        this.updateSelected();
        this.updateChecked();
    },

    render: function () {
        this.$el.html(this.template);
        this.bindUIElements();
        this.updateState();
        this.initDomEventsHandlers();
        return this;
    },

    initDomEventsHandlers: function () {
        this.ui.button.on('click', this.onClickEventHandler.bind(this));
        this.ui.content[0].addEventListener('click', this.onClickItemHandler.bind(this), true);
        this.ui.checker[0].addEventListener('click', this.onClickCheckHandler.bind(this), true);
    },

    onClickItemHandler: function (event) {
        this.trigger('select');
    },

    onClickCheckHandler: function (event) {
        this.trigger('check');
    },

    toggle: function () {
        var model = this.model;
        var collapsed = model.get('collapsed');

        this.model.set('collapsed', !collapsed);
    },

    setItemContent: function ($itemContent) {
        this.ui.content.empty();
        this.ui.content.append($itemContent);
    },

    setItemsContent: function ($itemsContent) {
        this.ui.items.empty();
        this.ui.items.append($itemsContent);
    },

    onClickEventHandler: function (event) {
        this.toggle();
    },

    setSelected: function (selected) {
        this.model.set('selected', selected);
    },

    setChecked: function (checked) {
        this.model.set('checked', checked);
    }
});

_.extend(TreeViewNodeBase.prototype, bindUIElementsMixin);
//####app/controls/treeView/node/treeViewNodeCheckbox.js
var TreeViewNodeCheckbox = TreeViewNodeBase.extend({

    template: InfinniUI.Template["controls/treeView/template/node-checkbox.tpl.html"]

});
//####app/controls/treeView/node/treeViewNodeRadio.js
var TreeViewNodeRadio = TreeViewNodeBase.extend({

    template: InfinniUI.Template["controls/treeView/template/node-radio.tpl.html"]

});

//####app/controls/checkBox/checkBoxControl.js
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


//####app/controls/checkBox/checkBoxModel.js
var CheckBoxModel = ControlModel.extend( _.extend({

    defaults: _.defaults({
        value: false
    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }

}, editorBaseModelMixin));
//####app/controls/checkBox/checkBoxView.js
/**
 * @class CheckBoxView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var CheckBoxView = ControlView.extend(/** @lends CheckBoxView.prototype */ _.extend({}, editorBaseViewMixin, {

    template: InfinniUI.Template["controls/checkBox/template/checkBox.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        text: '.checkbox-label',
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

        if (!focusable) {
            this.ui.input.attr('tabindex', -1);
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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
    },

    setFocus: function () {
        this.ui.input.focus();
    }
}));

//####app/controls/comboBox/comboBoxControl.js
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


//####app/controls/comboBox/comboBoxModel.js
var ComboBoxModel = ListEditorBaseModel.extend({

    defaults: _.defaults({
        showClear: true,
        autocomplete: false,
        autocompleteValue: '',
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
        this.on('change:value', this.syncSelectedItem);
    },

    setSelectedItemToValue: function () {
        var autocomplete = this.get('autocomplete');
        var multiSelect = this.get('multiSelect');

        if (autocomplete || multiSelect) {
            return;
        }

        var selectedItem = this.getSelectedItem();
        var value = this.valueByItem(selectedItem);
        this.set('value', value);

    },

    syncSelectedItem: function (model, value) {
        //var value = this.getValue();
        var selectedItem = this.itemByValue(value);
        this.setSelectedItem(selectedItem);
    },

    getSelectedItem: function () {
        var selectedItem = this.get('selectedItem');

        return selectedItem;
    },

    setSelectedItem: function (item) {
        this.set('selectedItem', item);
    },

    selectNextItem: function () {
        var items = this.get('items');
        var selectedItem = this.getSelectedItem();

        if (items.length > 0) {
            var itemIndex = 0;
            if (selectedItem) {
                itemIndex = items.indexOf(selectedItem);
                if (itemIndex === -1) {
                    itemIndex = 0;
                } else {
                    itemIndex = Math.min(items.length - 1, itemIndex + 1);
                }
            }
            selectedItem = items.getByIndex(itemIndex);
        } else {
            selectedItem = null;
        }
        this.setSelectedItem(selectedItem);
        this.setSelectedItemToValue();
    },

    selectPrevItem: function () {
        var items = this.get('items');
        var selectedItem = this.getSelectedItem();

        if (items.length > 0) {
            var itemIndex = 0;
            if (selectedItem) {
                itemIndex = items.indexOf(selectedItem);
                if (itemIndex === -1) {
                    itemIndex = 0;
                } else {
                    itemIndex = Math.max(0, itemIndex - 1);
                }
            }
            selectedItem = items.getByIndex(itemIndex);
        }
        this.setSelectedItem(selectedItem);
        this.setSelectedItemToValue();
    },

    selectFirstItem: function () {
        var items = this.get('items');
        var selectedItem = null;

        if (items.length > 0) {
            selectedItem = items.getByIndex(0);
        }
        this.setSelectedItem(selectedItem);
        this.setSelectedItemToValue();
    },

    selectLastItem: function () {
        var items = this.get('items');
        var selectedItem = null;

        if (items.length > 0) {
            selectedItem = items.getByIndex(items.length - 1);
        }
        this.setSelectedItem(selectedItem);
        this.setSelectedItemToValue();
    },

    toggleItem: function (item, toggle) {
        var value = this.valueByItem(item);
        this.toggleValue(value, toggle);
        this.trigger('toggle');
    }
});
//####app/controls/comboBox/comboBoxView.js
var ComboBoxView = ListEditorBaseView.extend({

    className: 'pl-combobox form-group',

    template: InfinniUI.Template["controls/comboBox/template/combobox.tpl.html"],

    events: {
        'click .pl-combobox__grip': 'onClickGripHandler',
        'click .pl-combobox__value': 'onClickValueHandler',
        'click .pl-combobox__clear': 'onClickClearHandler',
        'click .pl-control': 'onClickValueHandler',
        'keydown .pl-control': 'onKeyDownControlHandler'
    },

    UI: _.defaults({
        control: '.pl-control',
        label: '.pl-control-label',
        value: '.pl-combobox__value',
        clear: '.pl-combobox__clear'
    }, ListEditorBaseView.prototype.UI),

    isControlElement: function (el) {
        var res = ListEditorBaseView.prototype.isControlElement.call(this, el);

        if (res) {
            return res;
        }

        if (!this.dropDownView) {
            return false;
        }

        return $.contains(this.dropDownView.el, el);
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');
        var enabled = this.model.get('enabled');

        if (focusable && enabled) {
            this.ui.control.attr('tabindex', 0);
        } else {
            this.ui.control.removeAttr('tabindex');
        }
    },

    initialize: function (options) {
        ListEditorBaseView.prototype.initialize.call(this, options);
        var model = this.model,
            view = this;

        //this.on('beforeClick', this.activateControl);

        this.on('render', function () {
            view.renderValue();

            model.on('change:dropdown', function (model, dropdown) {
                if (dropdown) {
                    model.set('autocompleteValue', '');//Сброс фильтра
                    model.set('focused', true);
                    if (view.dropDownView) {
                        view.dropDownView.remove();
                    }
                    var dropdownView = new ComboBoxDropdownView({
                        model: model
                    });
                    view.dropDownView = dropdownView;

                    this.listenTo(dropdownView, 'search', _.debounce(view.onSearchValueHandler.bind(view), 300));

                    var $dropdown = dropdownView.render();
                    $('body').append($dropdown);
                    
                    dropdownView.updatePosition(view.el);
                    view.dropDownView.on('itemsRendered2', function(){
                        dropdownView.updatePosition(view.el);
                    });

                    if (model.get('autocomplete')) {
                        dropdownView.setSearchFocus();
                    } else {
                        view.ui.control.focus();
                    }
                    setTimeout(dropdownView.ensureVisibleSelectedItem.bind(dropdownView), 0);
                } else {
                    view.ui.control.focus();
                }
            });
            model.onValueChanged(this.onChangeValueHandler.bind(this));

        }, this);
    },

    initHandlersForProperties: function(){
        ListEditorBaseView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:showClear', this.updateShowClear);
        this.listenTo(this.model, 'change:labelText', this.updateLabelText);
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    getTemplate: function () {
        return this.template;
    },

    onKeyDownControlHandler: function (event) {
        var enabled = this.model.get('enabled');

        if (!enabled) {
            event.preventDefault();
            return;
        }

        if (event.ctrlKey || event.altKey) {
            return;
        }

        if (this.isDropdown()) {
            return this.dropDownView.onKeyDownHandler.call(this.dropDownView, event);
        }
        switch (event.which) {
            case 40:    //Down Arrow
            case 13:    //Ennter
                event.preventDefault();
                this.toggleDropdown();
                break;
        }
    },

    onClickClearHandler: function () {
        var enabled = this.model.get('enabled');
        if (enabled) {
            this.model.set('value', null);
            this.ui.control.focus();
        }
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
            this.ui.label.toggleClass('hidden', false);
        } else {
            this.ui.label.toggleClass('hidden', true);
        }

        this.ui.label.text(labelText);
    },

    updateEnabled: function () {
        ListEditorBaseView.prototype.updateEnabled.call(this);

        var enabled = this.model.get('enabled');

        if (!enabled) {
            //Prevent got focus
            this.ui.control.removeAttr('tabindex');
        } else {
            this.updateFocusable();
        }

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

    updateDisabledItem: function () {
        this.toggleDropdown(false);
    },

    isDropdown: function () {
        var model = this.model;
        return !!model.get('dropdown');
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
        this.model.set('autocompleteValue', text);
    },

    onClickValueHandler: function (event) {
        var enabled = this.model.get('enabled');

        if (enabled) {
            this.toggleDropdown(true);
        }
    }

});

//####app/controls/contextMenu/contextMenuControl.js
function ContextMenuControl() {
    _.superClass(ContextMenuControl, this);
}

_.inherit(ContextMenuControl, ContainerControl);

_.extend(ContextMenuControl.prototype, /** @lends ContextMenuControl.prototype */ {

    createControlModel: function () {
        return new ContextMenuModel();
    },

    createControlView: function (model) {
        return new ContextMenuView({model: model});
    }

});


//####app/controls/contextMenu/contextMenuModel.js
var ContextMenuModel = ContainerModel.extend({

});

//####app/controls/contextMenu/contextMenuView.js
var ContextMenuView = ContainerView.extend({

	contextMenuTemplate: InfinniUI.Template["controls/contextMenu/template/contextMenu.tpl.html"],

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
		var exchange = window.InfinniUI.global.messageBus,
				that = this;

		this.prerenderingActions();

		this.removeChildElements();

		this.$el = this.renderDropdown();

		this.bindUIElements();

		this.updateProperties();

		this.trigger('render');

		this.postrenderingActions();

		exchange.subscribe(messageTypes.onOpenContextMenu.name, function (context, args) {
			that.open(args.value);
		});

		//devblockstart
    window.InfinniUI.global.messageBus.send('render', {element: this});
    //devblockstop

		return this;
	},

	renderDropdown: function(){
		var template = this.contextMenuTemplate;
		var items = this.model.get('items').toArray();
		var $result = $(template({items: items}));

		this.appendItemsContent($result, items);
		$result.on('click', function () {
			this.close();
		}.bind(this));
		$result.on('contextmenu', function (event) {
			event.preventDefault();
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

	open: function(rightclickCoords){
		var that = this;

		$('body').append(this.$el);

		var $parent = this.$el.parent();

		this.$el.addClass('open');
		$parent.addClass('open');

		this.alignDropdown(rightclickCoords);

		var $ignoredElements = this.$el;
		new ActionOnLoseFocus($ignoredElements, function(){
			that.close();
		});
	},

	close: function(){
		this.$el.removeClass('open');
		this.$el.parent().removeClass('open');
		this.$el.detach();
	},

	alignDropdown: function(rightclickCoords){
		var horizontalAlignment = this.model.get('horizontalAlignment'),
				$parent = this.$el.parent(),
				parentDimentions = {width: $parent.width(), height: $parent.height()},
				elDimentions = {width: this.$el[0].children[0].clientWidth, height: this.$el[0].children[0].clientHeight};

		if(rightclickCoords.x + elDimentions.width > parentDimentions.width){
			rightclickCoords.x -= elDimentions.width;
		}
		if(rightclickCoords.y + elDimentions.height > parentDimentions.height){
			rightclickCoords.y -= elDimentions.height;
		}

		this.$el.offset({
			top: rightclickCoords.y,
			left: rightclickCoords.x
		});
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

//####app/controls/divider/dividerControl.js
/**
 *
 * @param parent
 * @constructor
 * @arguments Control
 */
function DividerControl(parent) {
	_.superClass(DividerControl, this, parent);
}

_.inherit(DividerControl, Control);

_.extend(DividerControl.prototype, {

	createControlModel: function () {
		return new DividerModel();
	},

	createControlView: function (model) {
		return new DividerView({model: model});
	}
});


//####app/controls/divider/dividerModel.js
/**
 * @class
 * @arguments ControlModel
 */
var DividerModel = ControlModel.extend(/** @lends DividerModel.prototype */{

	initialize: function () {
		ControlModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
	}

});

//####app/controls/divider/dividerView.js
/**
 * @class
 * @arguments ControlView
 */
var DividerView = ControlView.extend(
	/** @lends DividerView.prototype */
	{
		tagName: 'hr',

		className: 'pl-divider',

		initialize: function (options) {
			ControlView.prototype.initialize.call(this, options);
		},

		render: function () {
			this.prerenderingActions();

			this.updateProperties();
			this.trigger('render');

			this.postrenderingActions();
			//devblockstart
      window.InfinniUI.global.messageBus.send('render', {element: this});
      //devblockstop
			return this;
		}

	}
);

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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    updateGrouping: function(){

    },

    initExtensionObject: function () {
        var extensionName = this.model.get('extensionName'),
            context = this.model.get('context'),
            itemTemplate = this.model.get('itemTemplate'),
            parameters = this.model.get('parameters'),
            items = this.model.get('items'),
            builder = this.model.get('builder');

        this.extensionObject = new window[extensionName](context, {$el: this.$el, parameters: parameters, itemTemplate: itemTemplate, items: items, builder: builder});
    }
});

//####app/controls/fileBox/fileBoxControl.js
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


//####app/controls/fileBox/fileBoxModel.js
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
        this.on('change:value', function (model, value) {
            if (value instanceof File) {
                model.set('fileName', value.name);
            }
        });

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

            if (acceptTypes.length) {
                var acceptType = acceptTypes.contains(file.type);
                var fileName = file.name.toLowerCase();
                if (!acceptType) {
                    var len = fileName.length;
                    var acceptType = acceptTypes.some(function(name) {
                        return fileName.lastIndexOf(name.toLowerCase()) === len - name.length;
                    });
                }

                if (!acceptType) {
                    return 'Загрузка данного типа файла не разрешена';
                }

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
        model.set('value', file);
        //model.set('value', null);
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
//####app/controls/fileBox/fileBoxView.js
/**
 * @augments ControlView
 * @mixes editorBaseViewMixin
 * @constructor
 */
var FileBoxView = ControlView.extend(/** @lends FileBoxView.prototype */ _.extend({}, editorBaseViewMixin, {

    template: InfinniUI.Template["controls/fileBox/template/template.tpl.html"],

    className: 'pl-file-box',

    UI: _.extend({}, editorBaseViewMixin.UI, {
        label: '.pl-control-label',
        btnRemove: '.pl-filebox-btn-remove',
        btnPick: '.pl-filebox-btn-pick',
        fileEmpty: '.pl-filebox-file-empty',
        fileUpload: '.pl-filebox-file-upload',
        fileDownload: '.pl-filebox-file-download',
        fileDownloadUrl: '.pl-filebox-file-download-url',
        edit: '.pl-filebox-edit',
        control: '.form-control',

        input: 'input'
    }),

    events: {
        'change input': 'onChangeFileHandler',
        'click .pl-filebox-btn-remove': 'onClickRemoveImageHandler'
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:labelText', this.updateLabelText);
        this.listenTo(this.model, 'change:fileName', this.updateFileName);
        this.listenTo(this.model, 'change:fileSize', this.updateFileSize);
        this.listenTo(this.model, 'change:fileTime', this.updateFileTime);
        this.listenTo(this.model, 'change:fileType', this.updateFileType);
        this.listenTo(this.model, 'change:value', this.updateValue);

        this.listenTo(this.model, 'change:hintText', this.updateHintText);
        this.listenTo(this.model, 'change:errorText', this.updateErrorText);
        this.listenTo(this.model, 'change:warningText', this.updateWarningText);

        this.listenTo(this.model, 'invalid', this.onInvalidHandler);

        var acceptTypes = this.model.get('acceptTypes');
        acceptTypes.onChange(this.updateAcceptTypes.bind(this));
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);

        this.updateLabelText();
        this.updateFileName();
        this.updateFileSize();
        this.updateFileType();
        this.updateFileTime();
        this.updateAcceptTypes();
        this.updateValue();

        this.updateHintText();
        this.updateErrorText();
        this.updateWarningText();
    },

    updateLabelText: function () {
        var labelText = this.model.get('labelText');

        if(labelText != '') {
            this.ui.label
                .css({display: 'inline-block'})
                .text(labelText);
        } else {
            this.ui.label.css({display: 'none'});
        }
    },

    updateAcceptTypes: function () {
        var acceptTypes = this.model.get('acceptTypes');
        if (acceptTypes.length === 0) {
            this.ui.input.removeAttr('accept');
        } else {
            var accept = acceptTypes.toArray().join(',');
            this.ui.input.attr('accept', accept);
        }
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (focusable) {
            this.ui.control.attr('tabindex', 0);
        } else {
            this.ui.control.removeAttr('tabindex');
        }
    },

    updateText: function () {
        var text = this.model.get('text');
        this.ui.btnPick.attr('title', text);
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

        this.ui.input.prop('disabled', !isEnabled);
        this.ui.btnRemove.prop('disabled', !isEnabled);
        this.ui.btnPick.toggleClass('disabled', !isEnabled);

    },

    updateFileName: function () {
        var fileName = this.model.get('fileName');
        this.ui.fileUpload.text(fileName);
        this.ui.fileDownloadUrl.text(fileName);
    },

    updateFileSize: function () {
        //var fileSize = this.model.get('fileSize');
        //
        //var text = '';
        //if (typeof fileSize !== 'undefined' && fileSize !== null) {
        //    text = InfinniUI.format.humanFileSize(fileSize);
        //}
        //this.ui.fileSize.text(text);
    },

    updateFileInfo: function() {
        return;
        var model = this.model;
        var
            value = model.get('value'),
            fileName = model.get('fileName');

        if (!value || value.length === 0) {
            this.ui.info.toggleClass('hidden', true);
            this.ui.empty.toggleClass('hidden', false);
        } else {
            if (!fileName || fileName.length === 0) {
                fileName = 'Скачать файл';
            }
            this.ui.download.text(fileName);
            this.ui.info.toggleClass('hidden', false);
            this.ui.empty.toggleClass('hidden', true);
        }
    },

    updateFileTime: function () {
        var time = this.model.get('fileTime');

        //@TODO Update file's datetime on view
    },

    updateFileType: function () {
        var fileType = this.model.get('fileType');

        //@TODO Update file's mime type on view
    },

    updateValue: function () {
        var model = this.model;
        var value = model.get('value');

        var fileEmpty = false,
            fileUpload = false,
            fileDownload = false;

        if (value === null || typeof value === 'undefined') {
            //No file
            fileEmpty = value === null || typeof value === 'undefined';
            this.ui.input.val(null);
            this.updateUrl(null);
        } else if (value && typeof value === 'object') {
            //File instance
            fileUpload = value && typeof value === 'object';
            this.updateUrl(null);
        } else {
            //Url
            fileDownload = true;
            this.updateUrl(value);
        }

        this.ui.fileEmpty.toggleClass('hidden', !fileEmpty);
        this.ui.fileUpload.toggleClass('hidden', !fileUpload);
        this.ui.fileDownload.toggleClass('hidden', !fileDownload);

        this.ui.btnRemove.toggleClass('hidden', fileEmpty);
        this.ui.btnPick.toggleClass('hidden', !fileEmpty);
    },

    updateUrl: function (url) {
        this.ui.fileDownloadUrl.attr('href', url);
        var none = url === null || typeof url === 'undefined';
        this.$el.toggleClass('pl-empty', none);
        this.updateFileInfo();
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

        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop

        return this;
    },

    onInvalidHandler: function () {
        this.ui.input.val(null);
    }

}));

//####app/controls/form/formControl.js
function FormControl(parent) {
	_.superClass(FormControl, this, parent);
}

_.inherit(FormControl, StackPanelControl);

_.extend(FormControl.prototype, {

	createControlModel: function () {
		return new FormModel();
	},

	createControlView: function (model) {
		return new FormView({model: model});
	},

	onSubmit: function (callback) {
		this.controlView.$el.on('submit', callback);
	},

	setSubmitFunction: function(func) {
		this.controlModel.set('submitFunction', func);
	},

	getSubmitFunction: function() {
		return this.controlModel.get('submitFunction');
	},

	setMethod: function(method) {
		this.controlModel.set('method', method);
	},

	getMethod: function() {
		 return this.controlModel.get('method');
	},

	setAction: function(action) {
		this.controlModel.set('action', action);
	},

	getAction: function() {
		 return this.controlModel.get('action');
	}

});

//####app/controls/form/formModel.js
var FormModel = StackPanelModel.extend({

	defaults: _.defaults({
		submitFunction: null,
		method: '',
		action: ''
	}, StackPanelModel.prototype.defaults)

});

//####app/controls/form/formView.js
/**
 * @class FormView
 * @augments StackPanelView
 */
var FormView = StackPanelView.extend({

	className: 'pl-form',

	tagName: 'form',

	template: {
		plain: InfinniUI.Template["controls/form/template/form.tpl.html"]
	},

	events: {
		'submit': 'onSubmit'
	},

	onSubmit: function (e) {
		e.preventDefault();
	},

	initialize: function (options) {
		StackPanelView.prototype.initialize.call(this, options);

		this.listenTo(this.model, 'change:method', this.updateMethod);
		this.listenTo(this.model, 'change:action', this.updateAction);
	},

	updateGrouping: function(){
		this.strategy = new StackPanelViewPlainStrategy(this);
	},

	render: function () {
		this.prerenderingActions();

		this.removeChildElements();

		var preparedItems = this.strategy.prepareItemsForRendering();
		var template = this.strategy.getTemplate();

		this.$el.html(template(preparedItems));

		this.strategy.appendItemsContent(preparedItems, '.pl-form-i');

		this.bindUIElements();
		this.updateProperties();
		this.trigger('render');

		this.postrenderingActions();

		//devblockstart
    window.InfinniUI.global.messageBus.send('render', {element: this});
    //devblockstop
    
		return this;
	},

	updateProperties: function() {
		StackPanelView.prototype.updateProperties.call(this);

		this.updateMethod();
		this.updateAction();
	},

	updateMethod: function() {
		var method = this.model.get('method');

		this.$el.attr('method', method);
	},

	updateAction: function() {
		var action = this.model.get('action');

		this.$el.attr('action', action);
	}

});

//####app/controls/frame/frameControl.js
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
//####app/controls/frame/frameModel.js
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
//####app/controls/frame/frameView.js
/**
 * @class FrameView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var FrameView = ControlView.extend(_.extend({}, editorBaseViewMixin, /** @lends FrameView.prototype */{

    className: 'pl-frame',

    template: InfinniUI.Template["controls/frame/template/frame.tpl.html"],

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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    }

}));

//####app/controls/gridPanel/gridPanelControl.js
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


//####app/controls/gridPanel/gridPanelModel.js
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
//####app/controls/gridPanel/gridPanelView.js
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
            row: InfinniUI.Template["controls/gridPanel/template/row.tpl.html"]
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
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: this});
            //devblockstop
            return this;
        },

        renderItemsContents: function(){
            var items = this.model.get('items'),
                itemTemplate = this.model.get('itemTemplate'),
                view = this,
                row = [],
                rowSize = 0,
                element, item;

            //this.$el.hide();
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
            //this.$el.show();
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

//####app/controls/icon/iconControl.js
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
//####app/controls/icon/iconModel.js
/**
 * @class
 * @augments ControlModel
 */
var IconModel = ControlModel.extend({

    defaults: _.defaults({
        value: null,
        focusable: false

    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
    }

});
//####app/controls/icon/iconView.js
/**
 * @class IconView
 * @arguments ControlView
 */
var IconView = ControlView.extend({

    className: 'pl-icon fa',

    tagName: 'i',

    render: function(){
        this.prerenderingActions();
        this.updateProperties();
        this.trigger('render');
        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    renderIcon: function () {
        var value = this.model.get('value');
        this.switchClass('fa', value);
    },

    initHandlersForProperties: function () {
        ControlView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:value', this.updateValue);
    },

    updateProperties: function () {
        ControlView.prototype.updateProperties.call(this);
        this.updateValue();
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (focusable) {
            this.$el.attr('tabindex', 0);
        } else {
            this.$el.removeAttr('tabindex');
        }
    },

    updateValue: function () {
        this.renderIcon();
    }

});

//####app/controls/imageBox/imageBoxControl.js
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


//####app/controls/imageBox/imageBoxModel.js
/**
 * @constructor
 * @augments ControlModel
 * @mixes editorBaseModelMixin
 */
var ImageBoxModel = ControlModel.extend( _.extend({

    defaults: _.defaults({
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
        //this.stopLoadingFile();
        //if (file) {
        //    var fileLoader = this.loadPreview(file);
        //
        //    this.fileLoader = fileLoader;
        //
        //    fileLoader.then(function (file, content) {
        //        model.set('value', content);
        //    }, function (err) {
        //        console.log(err);
        //    });
        //} else {
        //    model.set('value', null);
        //}
    },

    //stopLoadingFile: function () {
    //    var fileLoader = this.fileLoader;
    //    if (fileLoader && fileLoader.state() === 'pending') {
    //        fileLoader.reject();
    //    }
    //},
    //
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
//####app/controls/imageBox/imageBoxView.js
/**
 * @augments ControlView
 * @mixes editorBaseViewMixin
 * @constructor
 */
var ImageBoxView = ControlView.extend(/** @lends ImageBoxView.prototype */ _.extend({}, editorBaseViewMixin, {

    className: 'pl-imagebox',

    template: InfinniUI.Template["controls/imageBox/template/imageBox.tpl.html"],

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

        this.listenTo(this.model, 'change:value', this.updateValue);
        this.listenTo(this.model, 'change:hintText', this.updateHintText);
        this.listenTo(this.model, 'change:errorText', this.updateErrorText);
        this.listenTo(this.model, 'change:warningText', this.updateWarningText);
    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);

        this.updateValue();
        this.updateHintText();
        this.updateErrorText();
        this.updateWarningText();
    },

    updateFocusable: function () {
        var focusable = this.model.get('focusable');

        if (focusable) {
            this.ui.file.attr('tabindex', 0);
        } else {
            this.ui.file.removeAttr('tabindex');
        }
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

    updateValue: function () {
        var model = this.model;
        var value = model.get('value');

        if (value && typeof value === 'object') {
            //Native FileAPI File instance, start loading preview
            this.stopLoadingFile();
            var fileLoader = this.loadPreview(value);

            this.fileLoader = fileLoader;

            fileLoader.then(function (file, content) {
                this.updateUrl(content);
            }.bind(this), function (err) {
                console.log(err);
            });
        } else {
            this.updateUrl(value);
        }
    },

    updateUrl: function (url) {
        this.ui.img.attr('src', url);
        var none = url === null || typeof url === 'undefined';
        this.$el.toggleClass('pl-empty', none);
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    }

}));

//####app/controls/indeterminateCheckBox/indeterminateCheckBoxControl.js
function IndeterminateCheckBoxControl(parent) {
	_.superClass(IndeterminateCheckBoxControl, this, parent);
	this.initialize_editorBaseControl();
}

_.inherit(IndeterminateCheckBoxControl, CheckBoxControl);

_.extend(IndeterminateCheckBoxControl.prototype, {

	createControlModel: function () {
		return new IndeterminateCheckBoxModel();
	},

	createControlView: function (model) {
		return new IndeterminateCheckBoxView({model: model});
	}

}, editorBaseControlMixin);


//####app/controls/indeterminateCheckBox/indeterminateCheckBoxModel.js
var IndeterminateCheckBoxModel = CheckBoxModel.extend({

	defaults: _.defaults({
		value: 'unchecked'
	}, CheckBoxModel.prototype.defaults)

});

//####app/controls/indeterminateCheckBox/indeterminateCheckBoxView.js
/**
 * @class IndeterminateCheckBoxView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var IndeterminateCheckBoxView = CheckBoxView.extend({

	className: 'pl-indeterminate-checkbox',

	onClickHandler: function () {
		var model = this.model;

		var enabled = model.get('enabled');
		if (enabled) {
			var newValue = model.get('value');
			newValue = newValue === 'indeterminate' ? 'unchecked' : newValue === 'unchecked' ? 'checked' : 'unchecked';
			model.set('value', newValue);
		}
	},

	updateValue: function () {
		var value = this.model.get('value');
		if( value === 'checked' ) {
			this.ui.input.prop('indeterminate', false);
			this.ui.input.prop('checked', true);
		} else if( value === 'unchecked' ) {
			this.ui.input.prop('indeterminate', false);
			this.ui.input.prop('checked', false);
		} else if( value === 'indeterminate' ) {
			this.ui.input.prop('checked', false);
			this.ui.input.prop('indeterminate', true);
		}

	}
});

//####app/controls/link/linkElementControl.js
/**
 *
 * @param parent
 * @constructor
 * @augments Control
 */
function LinkElementControl() {
    _.superClass(LinkElementControl, this);
}

_.inherit(LinkElementControl, ButtonControl);

_.extend(
    LinkElementControl.prototype, {

        createControlModel: function () {
            return new LinkElementModel();
        },

        createControlView: function (model) {
            return new LinkElementView({model: model});
        }

    });

//####app/controls/link/linkElementModel.js
/**
 * @class
 * @augments ButtonModel
 */
var LinkElementModel = ButtonModel.extend({

    defaults: _.defaults({
        href: "javascript:;",
        target: "self"
    }, ButtonModel.prototype.defaults),

    initialize: function () {
        ButtonModel.prototype.initialize.apply(this, arguments);
    }

});

//####app/controls/link/linkElementView.js
/**
 * @class LinkElementView
 * @augments CommonButtonView
 */
var LinkElementView = CommonButtonView.extend({

    tagName: 'a',

    className: 'pl-link',

    events: {
        'click': 'onClickHandler'
    },

    template: function(){return '';},

    updateProperties: function(){
        CommonButtonView.prototype.updateProperties.call(this);

        this.updateHref();
        this.updateTarget();
    },

    getButtonElement: function(){
        return this.$el;
    },

    initHandlersForProperties: function(){
        CommonButtonView.prototype.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:href', this.updateHref);
        this.listenTo(this.model, 'change:target', this.updateTarget);
    },

    updateHref: function() {
        var newHref = this.model.get('href'),
            $link = this.getButtonElement();

        $link.attr('href', newHref);
    },

    updateTarget: function() {
        var newTarget = this.model.get('target'),
            $link = this.getButtonElement();

        $link.attr('target', '_' + newTarget);
    },

    onClickHandler: function(e) {
        var href = this.model.get('href');
        if( href.indexOf('http://') === -1 ) {
            InfinniUI.AppRouter.navigate(href, {trigger: true});
            if( e.which !== 2 ) {
                e.preventDefault();
            }
        }
    }

});

//####app/controls/loaderIndicator/loaderIndicator.js
(function () {
    var template = InfinniUI.Template["controls/loaderIndicator/template.tpl.html"];

    InfinniUI.loaderIndicator = {
        show: function(){
            $.blockUI({
                message: $(template()),
                ignoreIfBlocked: true,
                baseZ: 99999
            });
        },
        hide: function(){
            $.unblockUI();
        }
    };

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
//####app/controls/menuBar/menuBarControl.js
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


//####app/controls/menuBar/menuBarModel.js
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
//####app/controls/menuBar/menuBarView.js
/**
 * @class
 * @augments ControlView
 */
var MenuBarView = ContainerView.extend(
    /** @lends MenuBarView.prototype */
    {
        tagName: 'nav',
        className: 'pl-menu-bar navbar navbar-default',

        template: InfinniUI.Template["controls/menuBar/template/menuBar.tpl.html"],

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
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: this});
            //devblockstop
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

//####app/controls/numericBox/numericBoxControl.js
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


//####app/controls/numericBox/numericBoxModel.js
/**
 * @class
 * @augments TextEditorBaseModel
 */
var NumericBoxModel = TextEditorBaseModel.extend(/** @lends TextBoxModel.prototype */{
    defaults: _.defaults(
        {
            increment: 1,
            inputType: 'number'
        },
        TextEditorBaseModel.prototype.defaults
    ),

    incValue: function () {
        var delta = this.get('increment');
        this.addToValue(delta);
    },

    decValue: function () {
        var delta = this.get('increment');
        this.addToValue(-delta);
    },

    addToValue: function (delta) {

        var value = this.get('value');
        var startValue = this.get('startValue');
        var minValue = this.get('minValue');
        var maxValue = this.get('maxValue');

        var newValue = _.isNumber(value) ? value : +value;

        if (this.isSetValue(value) && _.isNumber(value)) {
            newValue += delta;
        } else {
            newValue = (_.isNumber(startValue)) ? startValue : 0;
        }

        if (_.isNumber(minValue) && newValue < minValue) {
            newValue = minValue;
        } else if (_.isNumber(maxValue) && newValue > maxValue) {
            newValue = maxValue;
        }

        this.set('value', newValue);
    },

    initialize: function () {
        TextEditorBaseModel.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
    },

    validateValue: function (value, callback) {

        var
            isValid = true,
            min = this.get('minValue'),
            max = this.get('maxValue');

        if (!this.isSetValue(value)) {
            return true;
        }

        if (_.isNumber(min) && _.isNumber(max)) {
            if (value < min || value > max) {
                isValid = false
            }
        } else if (_.isNumber(min) && value < min) {
            isValid = false;
        } else if (_.isNumber(max) && value > max) {
            isValid = false;
        }

        return isValid;
    }


});
//####app/controls/numericBox/numericBoxView.js
/**
 * @class
 * @augments TextEditorBaseView
 */
var NumericBoxView = TextEditorBaseView.extend(/** @lends TextBoxView.prototype */{

    className: "pl-numericbox form-group",

    template: InfinniUI.Template["controls/numericBox/template/numericBox.tpl.html"],

    UI: _.extend({}, TextEditorBaseView.prototype.UI, {
        min: '.pl-numeric-box-min',
        max: '.pl-numeric-box-max'
    }),

    events: _.extend({}, TextEditorBaseView.prototype.events, {
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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
        this.renderControlEditor();
    },

    onChangeEnabledHandler: function (model, value) {
        this.ui.control.prop('disabled', !value);
        this.ui.min.prop('disabled', !value);
        this.ui.max.prop('disabled', !value);
    },

    onClickMinControlHandler: function () {
        if (this.canChangeValue()) {
            this.model.decValue();
        }
    },

    onClickMaxControlHandler: function () {
        if (this.canChangeValue()) {
            this.model.incValue();
        }
    },

    onMousedownMinControlHandler: function (event) {
        if (this.canChangeValue()) {
            this.repeatUpdateValue(this.model.decValue.bind(this.model));
        }
    },

    onMousedownMaxControlHandler: function (event) {
        if (this.canChangeValue()) {
            this.repeatUpdateValue(this.model.incValue.bind(this.model));
        }
    },

    repeatUpdateValue: function (cb) {
        var intervalId;

        window.document.addEventListener('mouseup', stopRepeat);

        intervalId = setInterval(cb, 200);

        function stopRepeat() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            window.document.removeEventListener('mouseup', stopRepeat);
        }

    },

    canChangeValue: function () {
        var model = this.model,
            enabled = model.get('enabled');

        return enabled === true;
    }

});

//####app/controls/panel/panelControl.js
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


//####app/controls/panel/panelModel.js
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
        collapsed: false,
        collapsibleArea: ''
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

//####app/controls/panel/panelView.js
/**
 * @class
 * @augments ControlView
 */
var PanelView = ContainerView.extend(/** @lends PanelView.prototype */ {

    className: 'pl-panel panel panel-default',

    template: InfinniUI.Template["controls/panel/template/panel.tpl.html"],

    UI: {
        header: '.pl-panel-header',
        items: '.panel-items'
    },

    events: {
        'click >.pl-panel-header': 'onClickHeaderHandler'
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

        this.trigger('render');
        this.updateProperties();

        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

    onEventCallback: function () {
        var collapsible = this.model.get('collapsible');
        if (collapsible) {
            var collapsed = this.model.get('collapsed');
            this.model.set('collapsed', !collapsed);
            this.updateLayout();
        }
    },

    onClickHeaderHandler: function (event) {
        var collapsibleArea = this.model.get('collapsibleArea');
        if( collapsibleArea !== '' ) {
            if( $(event.target).closest('[data-pl-name=' + collapsibleArea + ']').length ) {
                this.onEventCallback();
            }
        } else {
            this.onEventCallback();
        }
    }

});

//####app/controls/passwordBox/passwordBoxControl.js
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
//####app/controls/passwordBox/passwordBoxModel.js
/**
 * @constructor
 * @augments ControlModel
 * @mixes editorBaseModelMixin
 */
var PasswordBoxModel = ControlModel.extend(_.extend({

    defaults: _.defaults(
        {
            autocomplete: true
        },
        editorBaseModelMixin.defaults_editorBaseModel,
        ControlModel.prototype.defaults
    ),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this, arguments);
        this.initialize_editorBaseModel();
    }

}, editorBaseModelMixin));
//####app/controls/passwordBox/passwordBoxView.js
/**
 * @class PasswordBoxView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var PasswordBoxView = ControlView.extend(_.extend({}, editorBaseViewMixin, {

    className: 'pl-password-box form-group',

    template: {
        "autocomplete": InfinniUI.Template["controls/passwordBox/template/passwordBox.on.tpl.html"],
        "noautocomplete": InfinniUI.Template["controls/passwordBox/template/passwordBox.off.tpl.html"]
    },

    UI: _.extend({}, editorBaseViewMixin.UI, {
        label: '.pl-control-label',
        input: '.pl-control'
    }),

    events: {
        'blur .pl-control': 'onBlurHandler',
        'input .pl-control': 'onInputHandler',
        'change .pl-control': 'onChangeHandler'
    },

    initialize: function () {
        ControlView.prototype.initialize.apply(this);
    },

    initHandlersForProperties: function(){
        ControlView.prototype.initHandlersForProperties.call(this);
        editorBaseViewMixin.initHandlersForProperties.call(this);

        this.listenTo(this.model, 'change:labelText', this.updateLabelText);
        this.listenTo(this.model, 'change:labelFloating', this.updateLabelFloating);
        this.listenTo(this.model, 'change:autocomplete', this.updateAutocomplete);

    },

    updateProperties: function(){
        ControlView.prototype.updateProperties.call(this);
        editorBaseViewMixin.updateProperties.call(this);
        this.updateLabelText();
    },

    updateLabelText: function () {
        var labelText = this.model.get('labelText');
        this.ui.label.text(labelText);
    },

    updateAutocomplete: function () {
        this.rerender();
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
        this.renderTemplate(this.getTemplate());

        this.updateProperties();

        this.trigger('render');
        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    remove: function () {
        ControlView.prototype.remove.call(this);
    },

    getTemplate: function () {
        var model = this.model;

        return model.get('autocomplete') ? this.template.autocomplete : this.template.noautocomplete;
    },

    updateModelValue: function () {
        var value = this.ui.input.val();
        var model = this.model;
        model.set('value', value);
        model.set('rawValue', value);
    },

    onBlurHandler: function () {
        this.updateModelValue();
    },

    onChangeHandler: function () {
        this.updateModelValue();
    },

    onInputHandler: function () {
        this.updateModelValue();
    }

}));

//####app/controls/scrollPanel/scrollPanelControl.js
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


//####app/controls/scrollPanel/scrollPanelModel.js
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
            horizontalScroll: InfinniUI.ScrollVisibility.auto,
            verticalScroll: InfinniUI.ScrollVisibility.auto
        },
        ContainerModel.prototype.defaults
    )

});
//####app/controls/scrollPanel/scrollPanelView.js
/**
 * @class
 * @augments ControlView
 */
var ScrollPanelView = ContainerView.extend(/** @lends ScrollPanelView.prototype */ {

    className: 'pl-scrollpanel panel panel-default',

    template: InfinniUI.Template["controls/scrollPanel/template/scrollPanel.tpl.html"],

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

        (function ($el) {
            //Firefox сохраняет позицию прокрутки. Принудительно крутим в начало.
            setTimeout(function () {
                $el.scrollTop(0);
            }, 0);
        })(this.$el);
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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
            case InfinniUI.ScrollVisibility.visible:
                name = 'visible';
                break;
            case InfinniUI.ScrollVisibility.hidden:
                name = 'hidden';
                break;
            case InfinniUI.ScrollVisibility.auto:
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
            case InfinniUI.ScrollVisibility.visible:
                name = 'visible';
                break;
            case InfinniUI.ScrollVisibility.hidden:
                name = 'hidden';
                break;
            case InfinniUI.ScrollVisibility.auto:
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

//####app/controls/toggleButton/toggleButtonControl.js
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


//####app/controls/toggleButton/toggleButtonModel.js
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
//####app/controls/toggleButton/toggleButtonView.js
/**
 * @class ToggleButtonView
 * @augments ControlView
 * @mixes editorBaseViewMixin
 */
var ToggleButtonView = ControlView.extend(/** @lends ToggleButtonView.prototype */ _.extend({}, editorBaseViewMixin, {

    template: InfinniUI.Template["controls/toggleButton/template/toggleButton.tpl.html"],

    UI: _.extend({}, editorBaseViewMixin.UI, {
        textOn: '.togglebutton-handle-on',
        textOff: '.togglebutton-handle-off',
        container: '.togglebutton-container'
    }),

    events: {
        'click .togglebutton-box': 'onClickHandler'
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

//####app/controls/toolBar/toolBarControl.js
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


//####app/controls/toolBar/toolBarModel.js
/**
 * @constructor
 * @aurments ContainerModel
 */
var ToolBarModel = ContainerModel.extend({

});

//####app/controls/toolBar/toolBarView.js
/**
 * @constructor
 * @augments ContainerView
 */
var ToolBarView = ContainerView.extend({

    className: 'pl-tool-bar',

    template: InfinniUI.Template["controls/toolBar/template/toolBar.tpl.html"],

    itemTemplate: InfinniUI.Template["controls/toolBar/template/toolBarItem.tpl.html"],

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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
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

//####app/controls/view/viewControl.js
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


//####app/controls/view/viewModel.js
var DialogResult = {
    none: 0,
    accepted: 1,
    canceled: 2
};

window.InfinniUI.DialogResult = DialogResult;

var ViewModel = ContainerModel.extend({

    defaults: _.defaults({
        dialogResult: DialogResult.none,
        isApplication: false,
        closeButtonVisibility: true
    }, ContainerModel.prototype.defaults),

    initialize: function () {
        ContainerModel.prototype.initialize.apply(this);

        this.set('scripts', new Collection([], 'name'));
        this.set('parameters', new Collection([], 'name'));
        this.set('dataSources', new Collection([], 'name'));
    }
});

//####app/controls/view/viewView.js
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
            //devblockstart
            window.InfinniUI.global.messageBus.send('render', {element: this});
            //devblockstop
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
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    }
});

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
    },

    /**
     * @param context
     * @param args
     */
    notifyOnValidationError: function (context, args) {
        var result = args.value;

        if (typeof result === 'undefined' || result === null || result['IsValid'] || !Array.isArray(result['Items'])) {
            return;
        }

        result['Items'].forEach(function (item) {
            var exchange = window.InfinniUI.global.messageBus;
            exchange.send(messageTypes.onNotifyUser, {item: item, messageText: item.Message, messageType: 'error'});
        });
    }
};
//####app/data/dataSource/baseDataSource.js
/**
 * @constructor
 * @augments Backbone.Model
 * @mixes dataSourceFindItemMixin
 */
var BaseDataSource = Backbone.Model.extend({
    defaults: {
        name: null,
        idProperty: '_id',
        identifyingMode: 'byId', // byId, byLink. detect automatically

        view: null,

        isDataReady: false,

        dataProvider: null,

        /*
         * TreeModel for handling
         * model.items
         * model.selectedItem
         * */
        model: null,

        modifiedItems: {},
        itemsById: {},

        fillCreatedItem: true,

        suspendingList: null, // []

        waitingOnUpdateItemsHandlers: null, //[]

        errorValidator: null,

        isRequestInProcess: false,

        isLazy: true,

        isWaiting: false,

        resolvePriority: 0,

        newItemsHandler: null,

        isNumRegEx: /^\d/

    },

    initialize: function () {
        var view = this.get('view');
        var modelStartTree = {
            items: null,
            selectedItem: null
        };

        this.initDataProvider();
        if (!view) {
            throw 'BaseDataSource.initialize: При создании объекта не была задана view.'
        }
        this.set('suspendingList', []);
        this.set('waitingOnUpdateItemsHandlers', []);
        this.set('model', new TreeModel(view.getContext(), this, modelStartTree));

        _.extend( this, BaseDataSource.identifyingStrategy.byId);
    },

    initDataProvider: function () {
        throw 'BaseDataSource.initDataProvider В потомке BaseDataSource не задан провайдер данных.'
    },

    onPropertyChanged: function (property, handler, owner) {

        if (typeof property == 'function') {
            owner = handler;
            handler = property;
            property = '*';
        }

        if(property.charAt(0) == '.'){
            property = property.substr(1);
        }else{
            if(property == ''){
                property = 'items';
            }else{
                property = 'items.' + property;
            }

        }

        this.get('model').onPropertyChanged(property, function(context, args){
            var property = args.property;

            if(property.substr(0,6) == 'items.'){
                property = property.substr(6);
            }else if(property == 'items'){
                property = '';
            } else{
                property = '.' + property;
            }

            args.property = property;

            handler(context, args);
        }, owner);
    },

    onSelectedItemChanged: function (handler, owner) {
        var that = this;

        this.get('model').onPropertyChanged('selectedItem', function(context, args){
            var argument = that._getArgumentTemplate();
            argument.value = args.newValue;

            handler(context, argument);
        }, owner);
    },

    onErrorValidator: function (handler) {
        this.on('onErrorValidator', handler);
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

    onItemsUpdatedOnce: function (handler) {
        this.once('onItemsUpdated', handler);
    },

    onItemDeleted: function (handler) {
        this.on('onItemDeleted', handler);
    },

    onProviderError: function (handler) {
        this.on('onProviderError', handler);
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

    getProperty: function (property) {
        var firstChar = property.charAt(0);
        var indexOfSelectedItem;

        if( this.get('isNumRegEx').test(firstChar) ){
            property = 'items.' + property;

        }else if(firstChar == ''){
            property = 'items';

        }else if(firstChar == '$'){
            indexOfSelectedItem = this._indexOfSelectedItem();
            if(indexOfSelectedItem == -1){
                return undefined;
            }
            property = 'items.' + indexOfSelectedItem + property.substr(1);

        }else if(firstChar == '.'){
            property = property.substr(1);
        }else{
            indexOfSelectedItem = this._indexOfSelectedItem();
            if(indexOfSelectedItem == -1){
                return undefined;
            }
            property = 'items.' + indexOfSelectedItem + '.' + property;
        }

        return this.get('model').getProperty(property);
    },

    setProperty: function (property, value) {
        var propertyPaths = property.split('.');
        var firstChar;
        var indexOfSelectedItem;
        var index;
        var resultOfSet;

        if(propertyPaths[0] == '$'){
            indexOfSelectedItem = this._indexOfSelectedItem();
            if(indexOfSelectedItem == -1){
                return;
            }

            property = indexOfSelectedItem + property.substr(1);
            propertyPaths[0] = indexOfSelectedItem.toString();
        }

        firstChar = property.charAt(0);

        if(propertyPaths.length == 1){

            if(propertyPaths[0] == ''){
                this._setItems(value);

            }else if( this.get('isNumRegEx').test(propertyPaths[0]) ){
                this._changeItem(propertyPaths[0], value);

            }else{
                indexOfSelectedItem = this._indexOfSelectedItem();
                if(indexOfSelectedItem == -1){
                    return;
                }
                property = 'items.' + indexOfSelectedItem + '.' + property;
                resultOfSet = this.get('model').setProperty(property, value);

                if(resultOfSet){
                    this._includeItemToModifiedSetByIndex(indexOfSelectedItem);
                }
            }

        }else{
            if(firstChar == '.'){
                property = property.substr(1);
                this.get('model').setProperty(property, value);

            }else if(this.get('isNumRegEx').test(firstChar)){
                property = 'items.' + property;
                resultOfSet = this.get('model').setProperty(property, value);

                if(resultOfSet){
                    this._includeItemToModifiedSetByIndex( parseInt(propertyPaths[0]));
                }
            }else{
                indexOfSelectedItem = this._indexOfSelectedItem();
                if(indexOfSelectedItem == -1){
                    return;
                }
                property = 'items.' + indexOfSelectedItem + '.' + property;
                resultOfSet = this.get('model').setProperty(property, value);

                if(resultOfSet){
                    this._includeItemToModifiedSetByIndex(indexOfSelectedItem);
                }
            }
        }
    },

    _setItems: function (items) {
        this._detectIdentifyingMode(items);

        var indexOfItemsById;

        this.set('isDataReady', true);
        this.get('model').setProperty('items', items);
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
    },

    _restoreSelectedItem: function(){
        // override by strategy
        var logger = window.InfinniUI.global.logger;
        logger.warn({
            message: 'BaseDataSource._restoreSelectedItem: not overrided by strategy',
            source: this
        });
    },

    getSelectedItem: function () {
        return this.get('model').getProperty('selectedItem');
    },

    setSelectedItem: function (item, success, error) {
        // override by strategy
        var logger = window.InfinniUI.global.logger;
        logger.warn({
            message: 'BaseDataSource.setSelectedItem: not overrided by strategy',
            source: this
        });
    },

    _notifyAboutSelectedItem: function (item, successHandler) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.value = item;

        if (successHandler) {
            successHandler(context, argument);
        }
    },

    _tuneMirroringOfModel: function(index){
        if(index != -1){
            this.get('model').setMirroring('items.$', 'items.'+index);
        }else{
            this.get('model').setMirroring(null, null);
        }
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

    suspendUpdate: function (name) {
        var reason = name || 'default';

        var suspended = this.get('suspendingList');
        if (suspended.indexOf(reason) === -1) {
            suspended = suspended.slice(0);
            suspended.push(reason);
            this.set('suspendingList', suspended);
        }
    },

    resumeUpdate: function (name) {
        var reason = name || 'default';

        var suspended = this.get('suspendingList');
        var index = suspended.indexOf(reason);

        if (index !== -1) {
            suspended = suspended.slice(0);
            suspended.splice(index, 1);
            this.set('suspendingList', suspended);

            // если источник полностью разморожен, а до этого вызывались updateItems, не выполненные из-за заморозки, нужно вызвать updateItems
            if(!this.isUpdateSuspended() && this.get('waitingOnUpdateItemsHandlers').length > 0){
                this.updateItems();
            }
        }
    },

    isUpdateSuspended: function () {
        var suspended = this.get('suspendingList');
        return suspended.length > 0;
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

    _includeItemToModifiedSetByIndex: function (index) {
        var item;

        item = this.getItems()[index];
        this._includeItemToModifiedSet(item);
    },

    _includeItemToModifiedSet: function (item) {
        // override by strategy
        var logger = window.InfinniUI.global.logger;
        logger.warn({
            message: 'BaseDataSource._includeItemToModifiedSet: not overrided by strategy',
            source: this
        });
    },

    _excludeItemFromModifiedSet: function (item) {
        // override by strategy
        var logger = window.InfinniUI.global.logger;
        logger.warn({
            message: 'BaseDataSource._excludeItemFromModifiedSet: not overrided by strategy',
            source: this
        });
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

    _changeItem: function(index, value){
        var item = this.get('model').getProperty('items.'+index),
            isSelectedItem = (item == this.getSelectedItem()),
            idProperty = this.get('idProperty'),
            indexedItemsById = this.get('itemsById');

        if(value == item){
            return;
        }

        this._excludeItemFromModifiedSet(item);
        delete indexedItemsById[item[idProperty]];

        this.get('model').setProperty('items.'+index, value);

        this._includeItemToModifiedSet(value);
        indexedItemsById[value[idProperty]] = value;
        this.set('itemsById', indexedItemsById);

        if(isSelectedItem) {
            this.get('model').setProperty('selectedItem', value);
        }
    },

    tryInitData: function(){
        if (!this.get('isDataReady') && !this.get('isRequestInProcess')){
            this.updateItems();
        }
    },

    saveItem: function (item, success, error) {
        var dataProvider = this.get('dataProvider'),
            ds = this,
            logger = window.InfinniUI.global.logger,
            that = this,
            validateResult,
            errorInProvider = this._compensateOnErrorOfProviderHandler(error);

        if (!this.isModified(item)) {
            this._notifyAboutItemSaved({item: item, result: null}, 'notModified');
            that._executeCallback(success, {item: item, result: {IsValid: true}});
            return;
        }

        validateResult = this.validateOnErrors(item);
        if (!validateResult.IsValid) {
            this._executeCallback(error, {item: item, result: validateResult});
            return;
        }

        dataProvider.saveItem(item, function(data){
            if( !('IsValid' in data) || data.IsValid === true ){
                that._excludeItemFromModifiedSet(item);
                that._notifyAboutItemSaved({item: item, result: data.data}, 'modified');
                that._executeCallback(success, {item: item, result: that._getValidationResult(data)});
            }else{
                var result = that._getValidationResult(data);
                that._notifyAboutValidation(result, 'error');
                that._executeCallback(error, {item: item, result: result});
            }
        }, function(data) {
            var result = that._getValidationResult(data);
            that._notifyAboutValidation(result, 'error');
            that._executeCallback(errorInProvider, {item: item, result: result});
        });
    },

    _getValidationResult: function(data){
        if(data.data && data.data.responseJSON && data.data.responseJSON['Result']){
            return data.data.responseJSON['Result']['ValidationResult'];
        }
        
        return data.data && data.data['Result'] && data.data['Result']['ValidationResult'];
    },

    _executeCallback: function(callback, args){
        if(callback){
            callback(this.getContext(), args);
        }
    },

    _notifyAboutItemSaved: function (data, result) {
        var context = this.getContext(),
            argument = this._getArgumentTemplate();

        argument.value = data;
        argument.result = result;

        this.trigger('onItemSaved', context, argument);
    },

    deleteItem: function (item, success, error) {
        var dataProvider = this.get('dataProvider'),
            that = this,
            itemId = this.idOfItem(item),
            isItemInSet = this.get('itemsById')[itemId] !== undefined,
            errorInProvider = this._compensateOnErrorOfProviderHandler(error);

        if ( item == null || ( itemId !== undefined && !isItemInSet ) ) {
            this._notifyAboutMissingDeletedItem(item, error);
            return;
        }

        this.beforeDeleteItem(item);

        dataProvider.deleteItem(item, function (data) {
            if (!('IsValid' in data) || data['IsValid'] === true) {
                that._handleDeletedItem(item, success);
            } else {
                var result = that._getValidationResult(data);
                that._notifyAboutValidation(result, 'error');
                that._executeCallback(error, {item: item, result: result});
            }
        }, function(data) {
            var result = that._getValidationResult(data);
            that._notifyAboutValidation(result, 'error');
            that._executeCallback(errorInProvider, {item: item, result: result});
        });
    },

    beforeDeleteItem: function(item){},

    _handleDeletedItem: function (item, successHandler) {
        // override by strategy
        var logger = window.InfinniUI.global.logger;
        logger.warn({
            message: 'BaseDataSource._handleDeletedItem: not overrided by strategy',
            source: this
        });
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

        return this.get('model').getProperty('items');
    },

    updateItems: function (onSuccess, onError) {
        if (!this.isUpdateSuspended()) {
            var dataProvider = this.get('dataProvider'),
                that = this;


            onError = this._compensateOnErrorOfProviderHandler(onError);


            this.set('isRequestInProcess', true);
            dataProvider.getItems(
                function (data) {
                    that._handleSuccessUpdateItemsInProvider(data, onSuccess, onError);
                },
                onError
            );

        }else{
            var handlers = this.get('waitingOnUpdateItemsHandlers');
            handlers.push({
                onSuccess: onSuccess,
                onError: onError
            });
        }
        //devblockstart
        window.InfinniUI.global.messageBus.send('updateItems', {dataSource: this});
        //devblockstop
    },


    _compensateOnErrorOfProviderHandler: function(onError){
        var that = this;

        return function(){
            if(typeof onError == 'function'){
                onError.apply(undefined, arguments);
            }else{
                that.trigger('onProviderError', arguments);
            }
        };

    },

    _handleSuccessUpdateItemsInProvider: function(data, onSuccess, onError){
        var that = this,
            isWaiting =  that.get('isWaiting'),
            finishUpdating = function(){
                that.set('isRequestInProcess', false);
                that._handleUpdatedItemsData(data.data, onSuccess, onError);
            };

        if(isWaiting){
            that.once('change:isWaiting', function () {
                finishUpdating();
            });
        } else {
            finishUpdating();
        }
    },

    _onErrorProviderUpdateItemsHandle: function(){

    },

    setIsWaiting: function(value){
        this.set('isWaiting', value);
    },

    _handleUpdatedItemsData: function (itemsData, successHandler, errorHandler) {
        if(this.get('newItemsHandler')){
            itemsData = this.get('newItemsHandler')(itemsData);
        }

        this.setProperty('', itemsData);
        this._notifyAboutItemsUpdated(itemsData, successHandler, errorHandler);
    },

    _notifyAboutItemsUpdated: function (itemsData, successHandler, errorHandler) {
        var context = this.getContext();
        var argument = {
            value: itemsData,
            source: this
        };

        // вызываем обработчики которые были переданы на отложенных updateItems (из за замороженного источника)
        var handlers = this.get('waitingOnUpdateItemsHandlers');
        for(var i = 0, ii = handlers.length; i < ii; i++){
            if(handlers[i].onSuccess){
                handlers[i].onSuccess(context, argument);
            }
        }

        this.set('waitingOnUpdateItemsHandlers', []);

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
        var items = this.getItems();

        if(items) {
            items = items.slice();
            items.push(itemData);
        }else{
            items = [itemData];
        }

        this.setProperty('', items);
        this._includeItemToModifiedSet(itemData);
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
    },

    setFilter: function (value, onSuccess, onError) {
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

    setNewItemsHandler: function(handler){
        this.set('newItemsHandler', handler);
    },

    getErrorValidator: function () {
        return this.get('errorValidator');
    },

    setErrorValidator: function (validatingFunction) {
        this.set('errorValidator', validatingFunction);
    },

    validateOnErrors: function (item, callback) {
        var validatingFunction = this.get('errorValidator'),
            result = {
                IsValid: true,
                Items: []
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
                    if (!subResult.IsValid) {
                        this._addIndexToPropertiesOfValidationMessage(subResult.Items, i);
                        result.IsValid = false;
                        result.Items = _.union(result.Items, subResult.Items);
                    }

                }

            }
        }

        this._notifyAboutValidation(result, 'error');
        this._executeCallback(callback, {item: item, result: result});

        return result;
    },

    setFileProvider: function (fileProvider) {
        this.set('fileProvider', fileProvider);
    },

    getFileProvider: function () {
        return this.get('fileProvider');
    },

    _addIndexToPropertiesOfValidationMessage: function (validationMessages, index) {
        for (var i = 0, ii = validationMessages.length; i < ii; i++) {
            validationMessages[i].property = index + '.' + validationMessages[i].property;
        }
    },

    _notifyAboutValidation: function (validationResult, validationType) {
        if(!validationResult) {
            return;
        }

        var context = this.getContext(),
            argument = {
                value: validationResult
            };

        this.trigger('onErrorValidator', context, argument);
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

    _indexOfItem: function(item){
        var items = this.getItems();
        if(!items){
            return -1;
        }
        return items.indexOf(item);
    },

    _indexOfSelectedItem: function(){
        var selectedItem = this.getSelectedItem();

        return this._indexOfItem(selectedItem);
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
            this.onItemsUpdatedOnce(function(){
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

    getNearestRequestPromise: function(){
        var promise = $.Deferred();

        this.onItemsUpdatedOnce( function(){
            if(this.isDataReady()){
                promise.resolve();
            }else{
                logger.warn({
                    message: 'BaseDataSource: strange, expected other dataReady status',
                    source: this
                });
            }
        });

        return promise;
    },

    //setBindingBuilder: function(bindingBuilder){
    //    this.set('bindingBuilder', bindingBuilder);
    //},

    setIsLazy: function(isLazy){
        this.set('isLazy', isLazy);
    },

    isLazy: function(){
        return this.get('isLazy');
    },

    setResolvePriority: function(priority){
        this.set('resolvePriority', priority);
    },

    getResolvePriority: function(){
        return this.get('resolvePriority');
    },

    _copyObject: function (currentObject) {
        return JSON.parse(JSON.stringify(currentObject));
    },

    _getArgumentTemplate: function () {
        return {
            source: this
        };
    },

    _detectIdentifyingMode: function(items){
        if( $.isArray(items) && items.length > 0){
            if( !$.isPlainObject(items[0]) || this.getIdProperty() in items[0] ){
                this.set('identifyingMode', 'byId');
                _.extend( this, BaseDataSource.identifyingStrategy.byId);
            }else{
                this.set('identifyingMode', 'byLink');
                _.extend( this, BaseDataSource.identifyingStrategy.byLink);
            }
        }else{
            this.set('identifyingMode', 'byId');
            _.extend( this, BaseDataSource.identifyingStrategy.byId);
        }
    },

    _getIdentifyingMode: function(){
        return this.get('identifyingMode');
    }

});


BaseDataSource.identifyingStrategy = {

    byId: {
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

        setSelectedItem: function (item, success, error) {
            var currentSelectedItem = this.getSelectedItem(),
                items = this.get('itemsById'),
                itemId = this.idOfItem(item),
                index;


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

            this.get('model').setProperty('selectedItem', item);

            index = this._indexOfItem(items[itemId]);
            this._tuneMirroringOfModel(index);

            this._notifyAboutSelectedItem(item, success);
        },

        _includeItemToModifiedSet: function (item) {
            var itemId = this.idOfItem(item);
            this.get('modifiedItems')[itemId] = item;
        },

        _excludeItemFromModifiedSet: function (item) {
            var itemId = this.idOfItem(item);
            delete this.get('modifiedItems')[itemId];
        },

        _handleDeletedItem: function (item, successHandler) {
            var items = this.getItems(),
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
        }
    },

    byLink: {
        _restoreSelectedItem: function(){

            var selectedItem = this.getSelectedItem();
            var items = this.getItems();

            if( items.indexOf(selectedItem) == -1 ){
                return false;
            }else{
                return true;
            }
        },

        setSelectedItem: function (item, success, error) {
            var currentSelectedItem = this.getSelectedItem(),
                items = this.getItems(),
                index = this._indexOfItem(item);


            if (typeof item == 'undefined') {
                item = null;
            }

            if (item == currentSelectedItem) {
                return;
            }

            if (item !== null) {
                if (index == -1) {
                    if (!error) {
                        throw 'BaseDataSource.setSelectedItem() Попытка выбрать элемент в источнике, которого нет среди элементов этого источника.';
                    } else {
                        error(this.getContext(), {error: 'BaseDataSource.setSelectedItem() Попытка выбрать элемент в источнике, которого нет среди элементов этого источника.'});
                        return;
                    }
                }
            }

            this.get('model').setProperty('selectedItem', item);

            this._tuneMirroringOfModel(index);

            this._notifyAboutSelectedItem(item, success);
        },

        _includeItemToModifiedSet: function (item) {
            this.get('modifiedItems')['-'] = item;
        },

        _excludeItemFromModifiedSet: function (item) {
            delete this.get('modifiedItems')['-'];
        },

        _handleDeletedItem: function (item, successHandler) {
            var items = this.getItems(),
                selectedItem = this.getSelectedItem(),
                index = items.indexOf(item);

            if(index >= 0){
                items.splice(index, 1);
                this._excludeItemFromModifiedSet(item);

                if (selectedItem && selectedItem == item) {
                    this.setSelectedItem(null);
                }
            }

            this._notifyAboutItemDeleted(item, successHandler);
        }
    }
};

window.InfinniUI.BaseDataSource = BaseDataSource;

//####app/data/dataSource/restDataSource.js
var RestDataSource = BaseDataSource.extend({

    defaults: _.defaults({
        updatingItemsConverter: null

    }, BaseDataSource.prototype.defaults),

    initialize: function(){
        BaseDataSource.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

        var model = this.get('model');
        model.urlParams = {
            get: {
                method: 'get',
                origin: null,
                path: '',
                data: {},
                params: {}
            },

            set: {
                method: 'post',
                origin: null,
                path: '',
                data: {},
                params: {}
            },

            delete: {
                method: 'delete',
                origin: null,
                path: '',
                data: {},
                params: {}
            }
        };

        this.initUrlParamsHandlers();
    },

    initDataProvider: function(){
        var dataProvider = window.InfinniUI.providerRegister.build('RestDataSource');
        this.set('dataProvider', dataProvider);
    },

    initUrlParamsHandlers: function(){
        var that = this;

        this.get('model').onPropertyChanged('urlParams.get.*', function(context, args){
            var dataProvider = that.get('dataProvider');
            var urlParams = that.getGettingUrlParams();
            var templated;

            dataProvider.setOrigin('get', urlParams.origin);
            templated = that._templateParamsInStr(urlParams.path, urlParams.params);
            dataProvider.setPath('get', templated);
            templated = that._templateParamsInObject(urlParams.data, urlParams.params);
            dataProvider.setData('get', templated);


            if( that.get('isDataReady') || that.get('isRequestInProcess') || that.get('waitingOnUpdateItemsHandlers').length > 0 ){ // ds was resolved or waiting resolving
                that.updateItems();
            }
        });

        this.get('model').onPropertyChanged('urlParams.set.*', function(context, args){
            var dataProvider = that.get('dataProvider');
            var urlParams = that.getSettingUrlParams();
            var templated;

            dataProvider.setOrigin('set', urlParams.origin);
            templated = that._templateParamsInStr(urlParams.path, urlParams.params);
            dataProvider.setPath('set', templated);
            templated = that._templateParamsInObject(urlParams.data, urlParams.params);
            dataProvider.setData('set', templated);
        });

        this.get('model').onPropertyChanged('urlParams.delete.*', function(context, args){
            var dataProvider = that.get('dataProvider');
            var urlParams = that.getDeletingUrlParams();
            var templated;

            dataProvider.setOrigin('delete', urlParams.origin);
            templated = that._templateParamsInStr(urlParams.path, urlParams.params);
            dataProvider.setPath('delete', templated);
            templated = that._templateParamsInObject(urlParams.data, urlParams.params);
            dataProvider.setData('delete', templated);
        });
    },

    updateItems: function(){

        if(this._checkGettingUrlParamsReady()){
            BaseDataSource.prototype.updateItems.apply(this, Array.prototype.slice.call(arguments));
            this.resumeUpdate('urlGettingParamsNotReady');

        }else{
            this.suspendUpdate('urlGettingParamsNotReady');
            BaseDataSource.prototype.updateItems.apply(this, Array.prototype.slice.call(arguments));
        }

    },

    getGettingUrlParams: function(propertyName){
        if(arguments.length == 0){
            propertyName = 'urlParams.get';

        }else{
            if(propertyName == ''){
                propertyName = 'urlParams.get';
            }else{
                propertyName = 'urlParams.get.' + propertyName;
            }
        }
        return this.get('model').getProperty(propertyName);
    },

    setGettingUrlParams: function(propertyName, value){
        if(arguments.length == 1){
            value = propertyName;
            propertyName = 'urlParams.get';

        }else{
            if(propertyName == ''){
                propertyName = 'urlParams.get';
            }else{
                propertyName = 'urlParams.get.' + propertyName;
            }
        }

        this.get('model').setProperty(propertyName, value);
    },

    getSettingUrlParams: function(propertyName){
        if(arguments.length == 0){
            propertyName = 'urlParams.set';

        }else{
            if(propertyName == ''){
                propertyName = 'urlParams.set';
            }else{
                propertyName = 'urlParams.set.' + propertyName;
            }
        }
        return this.get('model').getProperty(propertyName);
    },

    setSettingUrlParams: function(propertyName, value){
        if(arguments.length == 1){
            value = propertyName;
            propertyName = 'urlParams.set';

        }else{
            if(propertyName == ''){
                propertyName = 'urlParams.set';
            }else{
                propertyName = 'urlParams.set.' + propertyName;
            }
        }

        this.get('model').setProperty(propertyName, value);
    },

    getDeletingUrlParams: function(propertyName){
        if(arguments.length == 0){
            propertyName = 'urlParams.delete';

        }else{
            if(propertyName == ''){
                propertyName = 'urlParams.delete';
            }else{
                propertyName = 'urlParams.delete.' + propertyName;
            }
        }
        return this.get('model').getProperty(propertyName);
    },

    setDeletingUrlParams: function(propertyName, value){
        if(arguments.length == 1){
            value = propertyName;
            propertyName = 'urlParams.delete';

        }else{
            if(propertyName == ''){
                propertyName = 'urlParams.delete';
            }else{
                propertyName = 'urlParams.delete.' + propertyName;
            }
        }

        this.get('model').setProperty(propertyName, value);
    },

    _checkGettingUrlParamsReady: function(){
        var allParams = [];
        var strWithParams;
        var params;
        var data;
        var definedParams;
        var param;

        if(!this._checkUrlParamsReady(this.getGettingUrlParams())){
            return false;
        }

        strWithParams = this.getGettingUrlParams('path');
        params = this._findSubstitutionParams(strWithParams);
        allParams = allParams.concat(params);

        data = this.getGettingUrlParams('data');
        strWithParams = JSON.stringify(data);
        params = this._findSubstitutionParams(strWithParams);
        allParams = allParams.concat(params);

        definedParams = this.getGettingUrlParams('params');
        for(var i = 0, ii = allParams.length; i<ii; i++){
            param = allParams[i];
            if(definedParams[param] === undefined){
                return false;
            }
        }

        return true;
    },

    _checkUrlParamsReady: function(params){
        return params && typeof params.origin == 'string'// && params.origin.lentgh > 0
                && typeof params.path == 'string'
                && typeof params.data == 'object'
                && typeof params.params == 'object';
    },

    _findSubstitutionParams: function(str){
        if(!str){
            return [];
        }

        var result = [];
        str.replace(/<%([\s\S]+?)%>/g, function(p1, p2){
            result.push(p2);
            return p1;
        });

        return result;
    },

    _templateParamsInStr: function(str, params){
        if(!str || !params){
            return str;
        }

        return str.replace(/<%([\s\S]+?)%>/g, function(p1, p2){
            return params[p2];
        });
    },

    _templateParamsInObject: function(obj, params){
        if(!obj || !params){
            return obj;
        }

        var str = JSON.stringify(obj);
        var tmpTemplated = this._templateParamsInStr(str, params);
        return JSON.parse(tmpTemplated);
    },

    getUpdatingItemsConverter: function(){
        return this.get('updatingItemsConverter');
    },

    setUpdatingItemsConverter: function(converter){
        this.set('updatingItemsConverter', converter);
    },

    _handleUpdatedItemsData: function (itemsData, successHandler, errorHandler) {
        var converter = this.getUpdatingItemsConverter();
        var items;

        if(converter){
            items = converter(itemsData);
        }else{
            items = itemsData;
        }

        BaseDataSource.prototype._handleUpdatedItemsData.call(this, items, successHandler, errorHandler);
    }

});

window.InfinniUI.RestDataSource = RestDataSource;

//####app/data/dataSource/documentDataSource.js
var DocumentDataSource = RestDataSource.extend({
    defaults: _.defaults({
        documentId: null

    }, RestDataSource.prototype.defaults),

    initialize: function () {
        RestDataSource.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

        var model = this.get('model');
        model.setProperty('pageNumber', 0);
        model.setProperty('pageSize', 15);
        model.setProperty('filterParams', {});
        this.setUpdatingItemsConverter(function(data){
            model.setProperty('totalCount', data['Result']['Count']);
            return data['Result']['Items'];
        });

        this.initHandlers();
    },

    initHandlers: function(){
        var model = this.get('model');
        var that = this;
        var updateGettingUrlParams = _.bind(this.updateGettingUrlParams, this);

        model.onPropertyChanged('documentId', function(){
            that.updateGettingUrlParams();
            that.updateSettingUrlParams();
            that.updateDeletingUrlParams();
        });
        model.onPropertyChanged('filter', updateGettingUrlParams);
        model.onPropertyChanged('filterParams.*', updateGettingUrlParams);
        model.onPropertyChanged('pageNumber', updateGettingUrlParams);
        model.onPropertyChanged('pageSize', updateGettingUrlParams);
        model.onPropertyChanged('search', updateGettingUrlParams);
        model.onPropertyChanged('select', updateGettingUrlParams);
        model.onPropertyChanged('order', updateGettingUrlParams);
        model.onPropertyChanged('needTotalCount', updateGettingUrlParams);

        this.updateGettingUrlParams();
        this.updateSettingUrlParams();
        this.updateDeletingUrlParams();
    },

    updateGettingUrlParams: function(){
        var model = this.get('model'),
            params = {
                type: 'get',
                origin: InfinniUI.config.serverUrl,
                path: '/documents/' + this.get('model').getProperty('documentId'),
                data: {},
                params: {}
            },
            filter = model.getProperty('filter'),
            filterParams = model.getProperty('filterParams'),
            pageNumber = model.getProperty('pageNumber'),
            pageSize = model.getProperty('pageSize'),
            searchStr = model.getProperty('search'),
            select = model.getProperty('select'),
            order = model.getProperty('order'),
            needTotalCount = model.getProperty('needTotalCount');

        if(filter){
            params.data.filter = filter;
            if(filterParams){
                _.extend(params.params, filterParams);
            }
        }

        if(pageSize){
            pageNumber = pageNumber || 0;
            params.data.skip = pageNumber*pageSize;
            params.data.take = pageSize;
        }

        if(searchStr){
            params.data.search = searchStr;
        }

        if(select){
            params.data.select = select;
        }

        if(order){
            params.data.order = order;
        }

        if(needTotalCount){
            params.data.count = needTotalCount;
        }

        this.setGettingUrlParams(params);
    },

    updateSettingUrlParams: function(){
        var model = this.get('model'),
            params = {
                type: 'post',
                origin: InfinniUI.config.serverUrl,
                path: '/documents/' + this.get('model').getProperty('documentId'),
                data: {},
                params: {}
            };

        this.setSettingUrlParams(params);
    },

    updateDeletingUrlParams: function(){
        var model = this.get('model'),
            params = {
                type: 'delete',
                origin: InfinniUI.config.serverUrl,
                path: '/documents/' + this.get('model').getProperty('documentId') + '/<%id%>',
                data: {},
                params: {}
            };

        this.setDeletingUrlParams(params);
    },

    initDataProvider: function(){
        var dataProvider = window.InfinniUI.providerRegister.build('DocumentDataSource');

        this.set('dataProvider', dataProvider);
    },

    getDocumentId: function(){
        return this.get('model').getProperty('documentId');
    },

    setDocumentId: function(documentId){
        this.get('model').setProperty('documentId', documentId);
    },

    getFilter: function(){
        return this.get('model').getProperty('filter');
    },

    setFilter: function(filter){
        this.get('model').setProperty('filter', filter);
    },

    getFilterParams: function(propertyName){
        if(arguments.length == 0){
            propertyName = 'filterParams';

        }else{
            if(propertyName == ''){
                propertyName = 'filterParams';
            }else{
                propertyName = 'filterParams.' + propertyName;
            }
        }

        return this.get('model').getProperty(propertyName);
    },

    setFilterParams: function(propertyName, value){
        if(arguments.length == 1){
            value = propertyName;
            propertyName = 'filterParams';

        }else{
            if(propertyName == ''){
                propertyName = 'filterParams';
            }else{
                propertyName = 'filterParams.' + propertyName;
            }
        }

        this.get('model').setProperty(propertyName, value);
    },

    setIdFilter: function (itemId) {
        this.setFilter('eq(' + this.getIdProperty() + ','+ this.quoteValue(itemId) + ')');
    },

    getPageNumber: function(){
        return this.get('model').getProperty('pageNumber');
    },

    setPageNumber: function(pageNumber){
        this.get('model').setProperty('pageNumber', pageNumber);
    },

    getPageSize: function(){
        return this.get('model').getProperty('pageSize');
    },

    setPageSize: function(pageSize){
        this.get('model').setProperty('pageSize', pageSize);
    },

    getSearch: function(){
        return this.get('model').getProperty('search');
    },

    setSearch: function(searchStr){
        this.get('model').setProperty('search', searchStr);
    },

    getSelect: function(){
        return this.get('model').getProperty('select');
    },

    setSelect: function(selectStr){
        this.get('model').setProperty('select', selectStr);
    },

    getOrder: function(){
        return this.get('model').getProperty('order');
    },

    setOrder: function(orderConditionStr){
        this.get('model').setProperty('order', orderConditionStr);
    },

    getTotalCount: function(){
        return this.get('model').getProperty('totalCount');
    },

    getNeedTotalCount: function(){
        return this.get('model').getProperty('needTotalCount');
    },

    setNeedTotalCount: function(needTotalCount){
        this.get('model').setProperty('needTotalCount', needTotalCount);
    },

    beforeDeleteItem: function(item){
        var itemId = this.idOfItem(item);
        if(itemId !== undefined){
            this.setDeletingUrlParams('params.id', itemId);
        }
    },

    quoteValue: function (value) {
        var VALUE_QUOTE_CHAR = '\'';

        if (_.isString(value)) {
            return VALUE_QUOTE_CHAR + value + VALUE_QUOTE_CHAR;
        } else {
            return value
        }
    }

});

window.InfinniUI.DocumentDataSource = DocumentDataSource;

//####app/data/dataSource/baseDataSourceBuilder.js
/**
 * @constructor
 * @mixes DataSourceValidationNotifierMixin
 */
var BaseDataSourceBuilder = function() {
}

_.extend(BaseDataSourceBuilder.prototype, /** @lends BaseDataSourceBuilder.prototype */ {
    build: function (context, args) {
        var dataSource = this.createDataSource(args.parentView);
        dataSource.suspendUpdate('tuningInSourceBuilder');

        this.applyMetadata(args.builder, args.parentView, args.metadata, dataSource);

        this.applySuspended(dataSource, args.suspended);

        dataSource.resumeUpdate('tuningInSourceBuilder');

        return dataSource;
    },

    applySuspended: function (dataSource, suspended) {
        if (!suspended) {
            return;
        }

        for (var name in suspended) {
            if (!suspended.hasOwnProperty(name) || dataSource.getName() !== name) {
                continue;
            }

            dataSource.suspendUpdate(suspended[name]);
        }

    },

    applyMetadata: function (builder, parentView, metadata, dataSource) {
        var idProperty = metadata.IdProperty;
        if (idProperty) {
            dataSource.setIdProperty(idProperty);
        }

        dataSource.setName(metadata.Name);
        dataSource.setFillCreatedItem(metadata.FillCreatedItem);
        //dataSource.setPageSize(metadata.PageSize || 15);
        //dataSource.setPageNumber(metadata.PageNumber || 0);
        //
        //if('Sorting' in metadata){
        //    dataSource.setSorting(metadata['Sorting']);
        //}
        //
        //var queryMetadata;
        //if('Query' in metadata){
        //    dataSource.setFilter(metadata['Query']);
        //}

        if('IsLazy' in metadata){
            dataSource.setIsLazy(metadata['IsLazy']);
        }

        if('ResolvePriority' in metadata){
            dataSource.setResolvePriority(metadata['ResolvePriority']);
        }

        if( _.isObject(metadata.CustomProperties) ) {
            this.initCustomProperties(dataSource, metadata.CustomProperties);
        }

        this.initValidation(parentView, dataSource, metadata);
        this.initNotifyValidation(dataSource);
        this.initScriptsHandlers(parentView, metadata, dataSource);

        this.initFileProvider(dataSource);
    },

    createDataSource: function (parent) {
        throw 'BaseDataSourceBuilder.createDataSource В потомке BaseDataSourceBuilder не переопределен метод createDataSource.';
    },

    initCustomProperties: function(dataSource, customProperties){
        _.each(customProperties, function(value, key){
            dataSource.setProperty('.' + key, value);
        });
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
    },

    //Скриптовые обработчики на события
    initScriptsHandlers: function (parentView, metadata, dataSource) {

        if( !parentView ){
            return;
        }

        if (metadata.OnSelectedItemChanged) {
            dataSource.onSelectedItemChanged(function (context, args) {
                new ScriptExecutor(parentView).executeScript(metadata.OnSelectedItemChanged.Name || metadata.OnSelectedItemChanged, args);
            });
        }

        if (metadata.OnItemsUpdated) {
            dataSource.onItemsUpdated(function (context, args) {
                new ScriptExecutor(parentView).executeScript(metadata.OnItemsUpdated.Name || metadata.OnItemsUpdated, args);
            });
        }

        if (metadata.OnPropertyChanged) {
            dataSource.onPropertyChanged(function (context, args) {
                new ScriptExecutor(parentView).executeScript(metadata.OnPropertyChanged.Name || metadata.OnPropertyChanged, args);
            });
        }

        if (metadata.OnItemDeleted) {
            dataSource.onItemDeleted(function () {
                new ScriptExecutor(parentView).executeScript(metadata.OnItemDeleted.Name || metadata.OnItemDeleted);
            });
        }

        if (metadata.OnErrorValidator) {
            dataSource.onErrorValidator(function () {
                new ScriptExecutor(parentView).executeScript(metadata.OnErrorValidator.Name || metadata.OnErrorValidator);
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

     initFileProvider: function (dataSource) {

             var host = InfinniUI.config.serverUrl;

             var fileUrlConstructor = new DocumentUploadQueryConstructor(host);

             var fileProvider = new DocumentFileProvider(fileUrlConstructor);

             dataSource.setFileProvider(fileProvider);
     }


});


_.extend(BaseDataSourceBuilder.prototype, DataSourceValidationNotifierMixin);

window.InfinniUI.BaseDataSourceBuilder = BaseDataSourceBuilder;

//####app/data/dataSource/restDataSourceBuilder.js
var RestDataSourceBuilder = function() {
    _.superClass(RestDataSourceBuilder, this);
}

_.inherit(RestDataSourceBuilder, BaseDataSourceBuilder);

_.extend(RestDataSourceBuilder.prototype, {
    createDataSource: function(parent){
        return new RestDataSource({
            view: parent
        });
    },

    applyMetadata: function(builder, parent, metadata, dataSource){
        BaseDataSourceBuilder.prototype.applyMetadata.call(this, builder, parent, metadata, dataSource);

        var tmpParams;

        this.initProviderErrorHandling(dataSource);

        if('GettingParams' in metadata){
            tmpParams = this.extractUrlParams(metadata['GettingParams'], '.urlParams.get.params');
            dataSource.setGettingUrlParams(tmpParams);
            this.bindParams(metadata['GettingParams'], dataSource, parent, '.urlParams.get.params', builder);
        }

        if('SettingParams' in metadata){
            tmpParams = this.extractUrlParams(metadata['SettingParams'], '.urlParams.set.params');
            dataSource.setSettingUrlParams(tmpParams);
            this.bindParams(metadata['SettingParams'], dataSource, parent, '.urlParams.set.params', builder);
        }

        if('DeletingParams' in metadata){
            tmpParams = this.extractUrlParams(metadata['DeletingParams'], '.urlParams.delet.params');
            dataSource.setDeletingUrlParams(tmpParams);
            this.bindParams(metadata['DeletingParams'], dataSource, parent, '.urlParams.delet.params', builder);
        }

        if('UpdatingItemsConverter' in metadata){
            dataSource.setUpdatingItemsConverter(function (items) {
                return new ScriptExecutor(parent).executeScript(metadata['UpdatingItemsConverter'].Name || metadata['UpdatingItemsConverter'], { value: items,  source: dataSource });
            });
        }

    },

    extractUrlParams: function(urlParamsMetadata, pathForBinding){
        var result = {};

        if('Origin' in urlParamsMetadata){
            result.origin = urlParamsMetadata['Origin'];
        }else{
            result.origin = InfinniUI.config.serverUrl;
        }

        if('Path' in urlParamsMetadata){
            result.path = urlParamsMetadata['Path'];
        }

        if('Data' in urlParamsMetadata){
            result.data = urlParamsMetadata['Data'];
        }

        if('Method' in urlParamsMetadata){
            result.method = urlParamsMetadata['Method'];
        }

        result.params = {};

        return result;
    },

    bindParams: function(methodMetadata, dataSource, parentView, pathForBinding, builder){
        if('Params' in methodMetadata){
            var params = methodMetadata['Params'];
            for(var k in params){
                this.initBindingToProperty(params[k], dataSource, parentView, pathForBinding + '.' + k, builder);
            }
        }
    },

    initBindingToProperty: function (valueMetadata, dataSource, parentView, pathForBinding, builder) {
        if (typeof valueMetadata != 'object') {
            if (valueMetadata !== undefined) {
                dataSource.setProperty(pathForBinding, valueMetadata);
            }

        } else {
            var args = {
                parent: parentView,
                parentView: parentView
            };

            var dataBinding = builder.buildBinding(valueMetadata, args);

            dataBinding.setMode(InfinniUI.BindingModes.toElement);

            dataBinding.bindElement(dataSource, pathForBinding);
        }
    },

    initProviderErrorHandling: function(dataSource){
        dataSource.onProviderError(function(){
            var exchange = window.InfinniUI.global.messageBus;
            exchange.send(messageTypes.onNotifyUser, {messageText: 'Ошибка на сервере', messageType: "error"});

        });
    }
});

window.InfinniUI.RestDataSourceBuilder = RestDataSourceBuilder;

//####app/data/dataSource/documentDataSourceBuilder.js
var DocumentDataSourceBuilder = function() {
    _.superClass(DocumentDataSourceBuilder, this);
}

_.inherit(DocumentDataSourceBuilder, BaseDataSourceBuilder);

_.extend(DocumentDataSourceBuilder.prototype, {
    applyMetadata: function(builder, parent, metadata, dataSource){
        BaseDataSourceBuilder.prototype.applyMetadata.call(this, builder, parent, metadata, dataSource);

        dataSource.setDocumentId(metadata['DocumentId']);

        if('PageNumber' in metadata){ dataSource.setPageNumber(metadata['PageNumber']); }
        if('PageSize' in metadata){ dataSource.setPageSize(metadata['PageSize']); }

        if('Filter' in metadata){ dataSource.setFilter(metadata['Filter']); }
        if('FilterParams' in metadata){
            var params = metadata['FilterParams'];
            for(var k in params){
                this.initBindingToProperty(params[k], dataSource, parent, '.filterParams.' + k, builder);
            }
        }

        if('Search' in metadata){ dataSource.setSearch(metadata['Search']); }
        if('Select' in metadata){ dataSource.setSelect(metadata['Select']); }
        if('Order' in metadata){ dataSource.setOrder(metadata['Order']); }
        if('NeedTotalCount' in metadata){ dataSource.setNeedTotalCount(metadata['NeedTotalCount']); }

        if (Array.isArray(metadata.DefaultItems)) {
            dataSource.setProperty('', metadata.DefaultItems);
        }
    },

    createDataSource: function(parent){
        return new DocumentDataSource({
            view: parent
        });
    },

    initBindingToProperty: RestDataSourceBuilder.prototype.initBindingToProperty
});

window.InfinniUI.DocumentDataSourceBuilder = DocumentDataSourceBuilder;

//####app/elements/_base/element/element.js
var Element = function (parent, viewMode) {
    this.parent = parent;
    this.control = this.createControl(viewMode);
    this.state = {
        Enabled: true
    };

    this.childElements = [];
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
            if (this.parent && this.parent.isView) {
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
        if(this.getName()){
            throw 'name already exists';
        }

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
                        property: propertyName,
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
        if (InfinniUI.Metadata.isValidValue(value, InfinniUI.TextHorizontalAlignment)) {
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
        if (_.isBoolean(value)) {
            this.control.set('focusable', value);
        }
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

    setContextMenu: function(items) {
        this.control.set('contextMenu', items);
    },

    getContextMenu: function(items) {
        return this.control.get('contextMenu');
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

    onMouseWheel: function (handler) {
        var that = this,
            callback = function (nativeEventData) {
                var eventData = that._getHandlingMouseEventData(nativeEventData);
                handler(eventData);
            };
        return this.control.onMouseWheel(callback);
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
        var parentView = element.getView();
        additionParams = additionParams || {};

        if (parentView) {
            context = parentView.context;
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
    },

    setFocus: function () {
        this.control.setFocus();
    },

    renderTree: function(textIndent) {
        var textIndent = textIndent || '';
        console.log( textIndent + 'Name: ' + this.getName(), this );
        if( this.childElements !== undefined ) {
            if( textIndent !== '' ) {
                textIndent += '_____';
            } else {
                textIndent += '_____';
            }
            for( var i = 0, ii = this.childElements.length; i < ii; i += 1 ) {
                this.renderTree.call(this.childElements[i], textIndent);
            }
        }
    },

    renderFullTree: function() {
        var parent = this.parent;
        while( parent.parent && parent.parent.parent !== undefined ) {
            parent = parent.parent;
        }
        this.renderTree.call(parent);
    }
});

window.InfinniUI.Element = Element;

//####app/elements/_base/element/elementBuilder.js
/**
 *
 * @constructor
 */
var ElementBuilder = function () {
};

_.extend(ElementBuilder.prototype, /** @lends ElementBuilder.prototype */ {

	build: function (context, args) {
		args = args || {};
		var element = this.createElement(args),
				params = _.extend(args, { element: element });

		this.applyMetadata(params);

		if (args.parentView && args.parentView.registerElement) {
			args.parentView.registerElement(element);
		}

		if (args.parent && args.parent.addChild) {
			args.parent.addChild(element);
		}

//devblockstart
		element.onMouseDown( function(eventData) {
			if( eventData.ctrlKey ){
				args.metadata.isSelectedElement = true;
				args.parentView.showSelectedElementMetadata();
				eventData.nativeEventData.stopPropagation();
			}
		});
//devblockstop

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
		this.initBindingToProperty(params, 'Style');
		this.initBindingToProperty(params, 'Tag');
		this.initBindingToProperty(params, 'Focusable', true);

		if( metadata.ToolTip ) {
			this.initToolTip(params);
		}
		if( metadata.ContextMenu ) {
			this.initContextMenu(params);
		}

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

		if (metadata.OnMouseEnter) {
			element.onMouseEnter(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnMouseEnter.Name || metadata.OnMouseEnter, args);
			});
		}

		if (metadata.OnMouseLeave) {
			element.onMouseLeave(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnMouseLeave.Name || metadata.OnMouseLeave, args);
			});
		}

		if (metadata.OnMouseMove) {
			element.onMouseMove(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnMouseMove.Name || metadata.OnMouseMove, args);
			});
		}

		if (metadata.OnKeyDown) {
			element.onKeyDown(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnKeyDown.Name || metadata.OnKeyDown, args);
			});
		}

		if (metadata.OnKeyUp) {
			element.onKeyUp(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnKeyUp.Name || metadata.OnKeyUp, args);
			});
		}

		if (metadata.OnMouseDown) {
			element.onMouseDown(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnMouseDown.Name || metadata.OnMouseDown, args);
			});
		}

		if (metadata.OnMouseUp) {
			element.onMouseUp(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnMouseUp.Name || metadata.OnMouseUp, args);
			});
		}

		if (metadata.OnMouseWheel) {
			element.onMouseWheel(function (args) {
				new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnMouseWheel.Name || metadata.OnMouseWheel, args);
			});
		}
	},

	initBindingToProperty: function (params, propertyName, isBooleanBinding) {
		var metadata = params.metadata,
				propertyMetadata = metadata[propertyName],
				element = params.element,
				lowerCasePropertyName = this.lowerFirstSymbol(propertyName),
				converter;

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
				dataBinding.setMode(InfinniUI.BindingModes.toElement);

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
		var exchange = window.InfinniUI.global.messageBus,
				builder = params.builder,
				element = params.element,
				metadata = params.metadata,
				tooltip;

		var argumentForBuilder = {
			parent: element,
			parentView: params.parentView,
			basePathOfProperty: params.basePathOfProperty
		};

		if (typeof metadata.ToolTip === 'string') {
			tooltip = builder.buildType("Label", {
				"Text": metadata.ToolTip
			}, argumentForBuilder);
		} else {
			tooltip = builder.build(metadata.ToolTip, argumentForBuilder);
		}

		element.setToolTip(tooltip);
		exchange.send(messageTypes.onToolTip.name, { source: element, content: tooltip.render() });
	},

	initContextMenu: function(params) {
		var exchange = window.InfinniUI.global.messageBus,
				builder = params.builder,
				element = params.element,
				metadata = params.metadata,
				contextMenu;

		var argumentForBuilder = {
			parent: element,
			parentView: params.parentView,
			basePathOfProperty: params.basePathOfProperty
		};

		contextMenu = builder.buildType('ContextMenu', {
			"Items": metadata.ContextMenu.Items
		}, argumentForBuilder);

		element.setContextMenu(contextMenu);
		exchange.send(messageTypes.onContextMenu.name, { source: element, content: contextMenu.render() });
	},

	lowerFirstSymbol: function(s){
		return s[0].toLowerCase() + s.substr(1);
	}

});

window.InfinniUI.ElementBuilder = ElementBuilder;

//####app/elements/_base/_mixins/builderValuePropertyMixin.js
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
//####app/elements/_base/_mixins/buttonBuilderMixin.js
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
//####app/elements/_base/_mixins/buttonMixin.js
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
//####app/elements/_base/_mixins/displayFormatBuilderMixin.js
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
        var formatOptions = params.formatOptions;
        var builder = params.builder;
        var formatter, format = defaultFormat;
        if (typeof displayFormat === 'string') {
            formatter = builder.buildType('ObjectFormat', {Format: displayFormat});
            format = function (context, args){
                args = args || {};
                return formatter.format(args.value);
            }
        } else if (displayFormat && typeof displayFormat === 'object') {
            formatter = builder.build(displayFormat);

            format = function (context, args){
                args = args || {};
                return formatter.format(args.value);
            }
        }

        if (formatter) {
            formatter.setOptions(formatOptions);
        }

        return format;

        function defaultFormat(context, args) {
            args = args || {};
            return args.value;
        }
    }
};

//####app/elements/_base/_mixins/labelTextElementMixin.js
var labelTextElementMixin = {
    getLabelText: function () {
        return this.control.get('labelText');
    },
    setLabelText: function (value) {
        this.control.set('labelText', value);
    }
};
//####app/elements/_base/_mixins/routerServiceMixin.js
var routerServiceMixin = {

	replaceParamsInHref: function(oldHref, param, newValue, hrefPattern) {
		if( hrefPattern ) {
			var newHref = hrefPattern.split('?')[0],
					query = hrefPattern.split('?')[1],
					tmpArr = newHref.split('/'),
					index = tmpArr.indexOf(':' + param);

			if( index === -1 ) {
				throw new Error('Different param names in metadata and InfinniUI.config.Routes');
			}
			tmpArr = oldHref.split('/');
			tmpArr[index] = newValue;
			tmpArr = tmpArr.join('/');
			if( query ) {
				tmpArr += '?' + query;
			}
			return tmpArr;
		} else {
			return oldHref.replace(':' + param, newValue);
		}
	},

	replaceParamsInQuery: function(oldHref, queryParam, newValue, queryPattern) {
		if( queryPattern ) {
			var newHref = oldHref.split('?')[0],
					query = oldHref.split('?')[1],
					queryTmp = queryPattern.split('?')[1],
					tmpArr = queryTmp.split('&'),
					index = -1;

			for(var i = 0, ii = tmpArr.length; i < ii; i += 1) {
				if( tmpArr[i].indexOf(':' + queryParam) !== -1 ) {
					index = i;
				}
			}

			if( index === -1 ) {
				throw new Error('Different query names in metadata and InfinniUI.config.Routes');
			}
			tmpArr = query.split('&');
			var tmpValue =  tmpArr[index].split('=');
			tmpValue[1] = newValue;
			tmpArr[index] = tmpValue.join('=');
			var finalString = newHref + '?' + tmpArr.join('&');
			return finalString;
		} else {
			return oldHref.replace(':' + queryParam, newValue);
		}
	},

	bindParams: function(params, paramName, paramValue, hrefPattern) {
		var element = params.element,
				builder = params.builder,
				that = this,
				args = {
					parent: params.parent,
					parentView: params.parentView,
					basePathOfProperty: params.basePathOfProperty
				};

			var dataBinding = params.builder.buildBinding(paramValue, args);

			dataBinding.bindElement({
				onPropertyChanged: function() {},
				setProperty: function(elementProperty, newValue) {
					var oldHref = element.getHref(),
							newHref = that.replaceParamsInHref(oldHref, paramName, newValue, hrefPattern);
					element.setHref(newHref);
				},
				getProperty: function() {}
			}, '');
	},

	bindQuery: function(params, queryName, queryValue, queryPattern) {
		var element = params.element,
				builder = params.builder,
				that = this,
				args = {
					parent: params.parent,
					parentView: params.parentView,
					basePathOfProperty: params.basePathOfProperty
				};

			var dataBinding = params.builder.buildBinding(queryValue, args);

			dataBinding.bindElement({
				onPropertyChanged: function() {},
				setProperty: function(elementProperty, newValue) {
					var oldHref = element.getHref(),
							newHref = that.replaceParamsInQuery(oldHref, queryName, newValue, queryPattern);
					element.setHref(newHref);
				},
				getProperty: function() {}
			}, '');
	}
};

//####app/elements/_base/_mixins/valuePropertyMixin.js
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
//####app/elements/_base/_mixins/veiwBuilderHeaderTemplateMixin.js
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

//####app/elements/_base/container/container.js
/**
 * @param parent
 * @constructor
 * @augments Element
 */
function Container(parent, viewMode) {
    _.superClass(Container, this, parent, viewMode);
}

window.InfinniUI.Container = Container;

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


//####app/elements/_base/container/containerBuilder.js
function ContainerBuilder() {
    _.superClass(ContainerBuilder, this);
}

window.InfinniUI.ContainerBuilder = ContainerBuilder;

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

        binding.setMode(InfinniUI.BindingModes.toElement);

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
            var binding = new DataBinding();

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
            var binding = new DataBinding();

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
            var binding = new DataBinding();
            binding.setMode(InfinniUI.BindingModes.toElement);

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
                return scriptExecutor.executeScript(metadata.ItemComparator.Name || metadata.ItemComparator, {item1: item1, item2: item2});
            };
        }

        var source = binding.getSource();
        source.onPropertyChanged('*', function (context, args) {
            var items = element.getItems();
            //При замене целого элемента списка, заменить элемент в коллекции
            if (args.property && args.property.match(/^\d+$/)) {
                items.replace(args.oldValue, args.newValue);
            }
        });

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


//####app/elements/_base/editorBase/editorBaseBuilderMixin.js
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
            if (InfinniUI.Metadata.isBindingMetadata(metadata.Value)) {
                var buildParams = {
                    parentView: params.parentView,
                    basePathOfProperty: params.basePathOfProperty
                };

                var dataBinding = params.builder.buildBinding(metadata.Value, buildParams);
                var mergedConverter = mergeConverters(dataBinding.getConverter(), bindingOptions.converter);

                if (mergedConverter) {
                    dataBinding.setConverter(mergedConverter);
                }
                if (bindingOptions.mode) {
                    dataBinding.setMode(bindingOptions.mode);
                }
                dataBinding.bindElement(params.element, bindingOptions.valueProperty);

                this.initValidationResultText(element, dataBinding);

            } else {
                params.element.setValue(metadata.Value);
            }
        }

        function mergeConverters(topPriority, nonPriority) {
            topPriority = topPriority || {};
            nonPriority = nonPriority || {};

            if(!topPriority.toElement && nonPriority.toElement) {
                topPriority.toElement = nonPriority.toElement;
            }

            if(!topPriority.toSource && nonPriority.toSource) {
                topPriority.toSource = nonPriority.toSource;
            }

            return !_.isEmpty(topPriority) ? topPriority : null;
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

        if (typeof source.onErrorValidator == 'function') {
            source.onErrorValidator(function (context, args) {
                var result = args.value,
                    text = '';

                if (!result.isValid && Array.isArray(result.items)) {
                    text = getTextForItems(result.items);
                }
                element.setErrorText(text);
            });
        }

        if (typeof source.onWarningValidator == 'function') {
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
    },


};

//####app/elements/_base/editorBase/editorBaseMixin.js
/**
 *
 * @mixin editorBaseMixin
 */
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


    validateValue: function (value) {

    },

    convertValue: function (value) {
        return value;
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
//####app/elements/_base/listEditorBase/listEditorBase.js
function ListEditorBase(parent, viewMode) {
    _.superClass(ListEditorBase, this, parent, viewMode);

    this.initialize_editorBase();
}

window.InfinniUI.ListEditorBase = ListEditorBase;

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

    getDisabledItemCondition: function () {
        return this.control.get('disabledItemCondition');
    },

    setDisabledItemCondition: function (value) {
        this.control.set('disabledItemCondition', value);
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
    }

    // UNUSED ?
    //getValueComparator: function () {
    //    return this.control.get('valueComparator');
    //}

}, editorBaseMixin);

//####app/elements/_base/listEditorBase/listEditorBaseBuilder.js
function ListEditorBaseBuilder() {
    _.superClass(ListEditorBaseBuilder, this);

    this.initialize_editorBaseBuilder();
}

window.InfinniUI.ListEditorBaseBuilder = ListEditorBaseBuilder;

_.inherit(ListEditorBaseBuilder, ContainerBuilder);


_.extend(ListEditorBaseBuilder.prototype, {

    applyMetadata: function (params) {

        var applyingMetadataResult = ContainerBuilder.prototype.applyMetadata.call(this, params),
            itemsBinding = applyingMetadataResult.itemsBinding,
            applyingMetadataResult2;

        this.initSelecting(params, itemsBinding);
        this.initDisabledItemCondition(params);

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
    },

    initDisabledItemCondition: function (params) {
        var metadata = params.metadata,
            element = params.element,
            disabledItemCondition;

        if (metadata.DisabledItemCondition) {
            disabledItemCondition = function (context, args) {
                var scriptExecutor = new ScriptExecutor(element.getScriptsStorage());
                return scriptExecutor.executeScript(metadata.DisabledItemCondition.Name || metadata.DisabledItemCondition, args)
            };
        }

        element.setDisabledItemCondition(disabledItemCondition);
    }
}, editorBaseBuilderMixin);

//####app/elements/_base/textEditorBase/textEditorBase.js
/**
 *
 * @param parent
 * @constructor
 * @augments Element
 * @mixes editorBaseMixin
 * @mixes labelTextElementMixin
 */
function TextEditorBase(parent) {
    _.superClass(TextEditorBase, this, parent);
    this.initialize_editorBase();
}

window.InfinniUI.TextEditorBase = TextEditorBase;

_.inherit(TextEditorBase, Element);

_.extend(TextEditorBase.prototype, {

    setEditor: function (editor) {
        this.control.set('editor', editor);
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
    },

    /**
     * @description Возвращает значение, которое введено в поле редактирования в данный момент
     * @returns {*}
     */
    getRawValue: function () {
        var value = this.control.get('editor').getValue(),
            editMask = this.getEditMask();

        if (editMask) {
            var val = editMask.getValue();
            var txt = editMask.getText();

            if (isNotEmpty(val)) {
                value = val;
            } else if (isNotEmpty(txt)) {
                value = txt;
            }
        }

        return value;

        function isNotEmpty(val) {
            return val !== null && typeof val !== 'undefined';
        }
    },

    getInputType: function () {
        return this.control.get('inputType');
    },

    setInputType: function (inputType) {
        if (inputType) {
            this.control.set('inputType', inputType);
        }
    }

}, editorBaseMixin, labelTextElementMixin);

//####app/elements/_base/textEditorBase/textEditorBaseBuilder.js
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

window.InfinniUI.TextEditorBaseBuilder = TextEditorBaseBuilder;

_.inherit(TextEditorBaseBuilder, ElementBuilder);

_.extend(TextEditorBaseBuilder.prototype, {

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);
        this.applyMetadata_editorBaseBuilder(params);

        var metadata = params.metadata;
        var element = params.element;

        this.initBindingToProperty(params, 'LabelText');

        element.setInputType(this.getCompatibleInputType(params));
        this
            .initDisplayFormat(params)
            .initEditMask(params)
            .initEditor(params);
    },

    getCompatibleInputType: function (params) {
        var inputType = params.metadata.Type,
            editMask = params.metadata.EditMask;

        if (typeof inputType === 'undefined') {
            inputType = params.element.getInputType();
        }

        if (editMask) {
            //Маска редактирования задается только для input[type=text]
            inputType = 'text'
        }
        return inputType;
    },

    initEditor: function (params) {
        var element = params.element;
        var editor = new TextEditor();
        editor
            .setDisplayFormat(element.getDisplayFormat())
            .setEditMask(element.getEditMask())
            .setValueConverter(function () {
                return element.convertValue.bind(element)
            })
            .setValidatorValue(element.validateValue.bind(element));

        element.setEditor(editor);

        editor.onValueChanged(function (value) {
            //element.setValue(element.convertValue(value));
            element.setValue(value);
        });

        element.onValueChanged(function (context, args) {
            editor.setValue(args.newValue);
        });

        editor.setValue(element.getValue());

        return this;
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
            editMask = builder.build(metadata.EditMask, {
                parentView: params.parentView,
                formatOptions: params.formatOptions
            });
        }
        params.element.setEditMask(editMask);
        return this;
    }
}, editorBaseBuilderMixin, displayFormatBuilderMixin);




//####app/elements/_base/textEditor/textEditor.js
/**
 * @constructor
 */

var TextEditor = function () {
    var model = new TextEditorModel();
    
    model.on('invalid', function (model, error) {
        console.log('error', error);
    });

    //@TODO Handle Enabled state

    this._model = model;

};

window.InfinniUI.TextEditor = TextEditor;

TextEditor.prototype.setDisplayFormat = function (displayFormat) {
    this._model.set('displayFormat', displayFormat);
    return this;
};

TextEditor.prototype.setEditMask = function (editMask) {
    this._model.set('editMask', editMask);
    return this;
};

TextEditor.prototype.setValidatorValue = function (validatorValue) {
    this._model.set('validateValue', validatorValue);
    return this;
};

TextEditor.prototype.setValueConverter = function (converter) {
    this._model.set('valueConverter', converter);
    return this;
};

TextEditor.prototype.getValue = function() {
    return this._model.getValue();
};

/**
 *
 * @param {HTMLInputElement} inputElement
 * @returns {*}
 */
TextEditor.prototype.render = function (inputElement) {

    this._view = new TextEditorView({
        model: this._model,
        el: inputElement
    });

    //return this._view.render();
};

TextEditor.prototype.setValue = function (value) {
    this._model.set('originalValue', value, {originalValue: true});
    return this;
};

TextEditor.prototype.onValueChanged = function (handler) {
    this._model.on('change:originalValue', function (model, value, options) {
        if (options.originalValue === true) {
            return;
        }

        handler.call(null, value);
    });
};

//####app/elements/listBox/listBox.js
function ListBox(parent, viewMode) {
	_.superClass(ListBox, this, parent, viewMode);
}

window.InfinniUI.ListBox = ListBox;

_.inherit(ListBox, ListEditorBase);

ListBox.prototype.createControl = function (viewMode) {
	return new ListBoxControl(viewMode);
};

ListBox.prototype.setEnabled = function (value) {
	if( _.isBoolean(value) ) {
		ListEditorBase.prototype.setEnabled.call(this, value);
		if( value ) {
			this.control.updateDisabledItem();
		} else {
			this.control.disableAll();
		}
	}
};

//####app/elements/listBox/listBoxBuilder.js
function ListBoxBuilder() {
    _.superClass(ListBoxBuilder, this);
}

window.InfinniUI.ListBoxBuilder = ListBoxBuilder;

_.inherit(ListBoxBuilder, ListEditorBaseBuilder);

_.extend(ListBoxBuilder.prototype, /** @lends ListBoxBuilder.prototype */{

    createElement: function (params) {
        return new ListBox(params.parent, params.metadata['ViewMode']);
    },

    applyMetadata: function (params) {
        ListEditorBaseBuilder.prototype.applyMetadata.call(this, params);
    }

});

//####app/elements/textBox/textBox.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBase
 */
function TextBox(parent) {
    _.superClass(TextBox, this, parent);
}

window.InfinniUI.TextBox = TextBox;

_.inherit(TextBox, TextEditorBase);

_.extend(TextBox.prototype, {
    createControl: function (parent) {
        return new TextBoxControl(parent);
    },

    getMultiline: function () {
        return this.control.get('multiline');
    },

    setMultiline: function (value) {
        this.control.set('multiline', value);
    },

    getLineCount: function () {
        return this.control.get('lineCount');
    },

    setLineCount: function (value) {
        this.control.set('lineCount', value);
    }

});



//####app/elements/textBox/textBoxBuilder.js
/**
 *
 * @constructor
 * @augments TextEditorBaseBuilder
 */
function TextBoxBuilder() {
    _.superClass(TextBoxBuilder, this);
}

window.InfinniUI.TextBoxBuilder = TextBoxBuilder;

_.inherit(TextBoxBuilder, TextEditorBaseBuilder);

TextBoxBuilder.prototype.createElement = function (params) {
    return new TextBox(params.parent);
};

TextBoxBuilder.prototype.applyMetadata = function (params) {
    TextEditorBaseBuilder.prototype.applyMetadata.call(this, params);

    var element = params.element;
    var metadata = params.metadata;
    var lineCount = metadata.LineCount;
    element.setMultiline(metadata.Multiline);
    if (metadata.Multiline && lineCount === null || typeof lineCount === 'undefined') {
        lineCount = 2;
    }
    element.setLineCount(lineCount);
};

//####app/elements/dateTimePicker/dateTimePicker.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBase
 */
function DateTimePicker(parent) {
    _.superClass(DateTimePicker, this, parent);
}

window.InfinniUI.DateTimePicker = DateTimePicker;

_.inherit(DateTimePicker, TextEditorBase);

DateTimePicker.prototype.createControl = function (parent) {
    return new DateTimePickerControl(parent);
};

DateTimePicker.prototype.getMinValue = function () {
    return this.control.get('minValue');
};

DateTimePicker.prototype.setMinValue = function (value) {
    this.control.set('minValue', value);
};

DateTimePicker.prototype.getMaxValue = function () {
    return this.control.get('maxValue');
};

DateTimePicker.prototype.setMaxValue = function (value) {
    this.control.set('maxValue', value);
};

DateTimePicker.prototype.getMode = function () {
    return this.control.get('mode');
};

DateTimePicker.prototype.setMode = function (value) {
    this.control.set('mode', value);
};

DateTimePicker.prototype.getTimeZone = function () {
    return this.control.get('timeZone');
};

DateTimePicker.prototype.setTimeZone = function (value) {
    if (_.isNumber(value)) {
        this.control.set('timeZone', value);
    }
};

DateTimePicker.prototype.setDateFormat = function (value) {
    this.control.set('format', value);
};

DateTimePicker.prototype.validateValue = function (value) {
    if (value === null || value === '' || typeof value === 'undefined') {
        return;
    }

    var minValue = InfinniUI.DateUtils.restoreTimezoneOffset(this.getMinValue(), this.getTimeZone());
    var maxValue = InfinniUI.DateUtils.restoreTimezoneOffset(this.getMaxValue(), this.getTimeZone());

    var isValid = InfinniUI.DateUtils.checkRangeDate(value, minValue, maxValue);

    if (!isValid) {
        return "Неверное значение";
    }
};



//####app/elements/dateTimePicker/dateTimePickerBuilder.js
/**
 *
 * @constructor
 * @augments TextEditorBaseBuilder
 */
function DateTimePickerBuilder() {
    _.superClass(DateTimePickerBuilder, this);
}

window.InfinniUI.DateTimePickerBuilder = DateTimePickerBuilder;

_.inherit(DateTimePickerBuilder, TextEditorBaseBuilder);

DateTimePickerBuilder.prototype.createElement = function (params) {
    return new DateTimePicker(params.parent);
};

DateTimePickerBuilder.prototype.applyMetadata = function (params) {
    var element = params.element;

    this.applyDefaultMetadata(params);
    var metadata = params.metadata;

    TextEditorBaseBuilder.prototype.applyMetadata.call(this, params);

    element.setTimeZone(metadata.TimeZone);
    element.setMode(metadata.Mode);

    this.applyMinValue(element, metadata.MinValue);
    this.applyMaxValue(element, metadata.MaxValue);

    //var format = params.builder.buildType(params.parent, 'DateFormat', {}, null);
    //element.setDateFormat(format);
};

DateTimePickerBuilder.prototype.applyMinValue = function (element, minValue) {
    element.setMinValue(InfinniUI.DateUtils.parseISO8601toDate(minValue));
};

DateTimePickerBuilder.prototype.applyMaxValue = function (element, maxValue) {
    element.setMaxValue(InfinniUI.DateUtils.parseISO8601toDate(maxValue));
};

DateTimePickerBuilder.prototype.applyDefaultMetadata = function (params) {
    var metadata = params.metadata;
    var defaultFormat = {
            Date: '{:d}',
            DateTime: '{:g}',
            Time: '{:T}'
        },
        defaultEditMask = {
            Date: {DateTimeEditMask: {Mask: 'd'}},
            DateTime: {DateTimeEditMask: {Mask: 'g'}},
            Time: {DateTimeEditMask: {Mask: 'T'}}
        };

    params.metadata = _.extend({}, metadata);

    _.defaults(params.metadata, {Mode: 'Date'});
    _.defaults(params.metadata, {
        DisplayFormat: defaultFormat[params.metadata.Mode],
        EditMask: defaultEditMask[params.metadata.Mode]
    });
};

DateTimePickerBuilder.prototype.initDisplayFormat = function (params) {
    return TextEditorBaseBuilder.prototype.initDisplayFormat.call(this, this.applyTimeZone(params));
};

DateTimePickerBuilder.prototype.initEditMask = function (params) {
    return TextEditorBaseBuilder.prototype.initEditMask.call(this, this.applyTimeZone(params));
};

DateTimePickerBuilder.prototype.applyTimeZone = function (params) {
    var metadata = params.metadata;
    var _params = {};
    var formatOptions = {};

    if (typeof metadata.TimeZone !== 'undefined' && metadata.TimeZone !== null ) {
        formatOptions.TimeZone = metadata.TimeZone;
    }

    _.defaults(_params, params, {formatOptions: formatOptions});
    return _params;
};

//####app/elements/datePicker/datePicker.js
function DatePicker(parent) {
    _.superClass(DatePicker, this, parent);

    this.setMode('DatePicker');
    this.setTimeZone();
}

window.InfinniUI.DatePicker = DatePicker;

_.inherit(DatePicker, DateTimePicker);

DatePicker.prototype.setTimeZone = function () {
    DateTimePicker.prototype.setTimeZone.call(this, 0);
};

DatePicker.prototype.createControl = function (parent) {
    return new DatePickerControl(parent);
};

DatePicker.prototype.convertValue = function (value) {
    var _value = null;

    if(typeof value === 'undefined' || value === null || !value.toString().length) {
        _value = null;
    } else {
        _value = InfinniUI.DateUtils.dateToTimestamp(value);
    }

    return _value;
};

//####app/elements/datePicker/datePickerBuilder.js
function DatePickerBuilder() {
    _.superClass(DatePickerBuilder, this);
}

window.InfinniUI.DatePickerBuilder = DatePickerBuilder;

_.inherit(DatePickerBuilder, DateTimePickerBuilder);

DatePickerBuilder.prototype.createElement = function (params) {
    return new DatePicker(params.parent);
};


DatePickerBuilder.prototype.applyDefaultMetadata = function (params) {

    params.metadata = _.extend({}, params.metadata, {
        Mode: 'DatePicker',
        TimeZone: 0
    });

    _.defaults(params.metadata, {
        DisplayFormat: '{:d}',
        EditMask: {DateTimeEditMask: {Mask: 'd'}}
    });
};

//####app/elements/timePicker/timePicker.js
function TimePicker(parent) {
    _.superClass(TimePicker, this, parent);

    this.setMode('TimePicker');
    this.setTimeZone();
}

window.InfinniUI.TimePicker = TimePicker;

_.inherit(TimePicker, DateTimePicker);


TimePicker.prototype.createControl = function (parent) {
    return new TimePickerControl(parent);
};

TimePicker.prototype.setTimeZone = function () {
    DateTimePicker.prototype.setTimeZone.call(this, 0);
};

TimePicker.prototype.convertValue = function (value) {
    var _value = null;

    if(typeof value === 'undefined' || value === null || !value.toString().length) {
        _value = null;
    } else {
        _value = InfinniUI.DateUtils.dateToTimestampTime(value);
    }

    return _value;
};

//####app/elements/timePicker/timePickerBuilder.js
function TimePickerBuilder() {
    _.superClass(TimePickerBuilder, this);
}

window.InfinniUI.TimePickerBuilder = TimePickerBuilder;

_.inherit(TimePickerBuilder, DateTimePickerBuilder);

TimePickerBuilder.prototype.createElement = function (params) {
    return new TimePicker(params.parent);
};

TimePickerBuilder.prototype.applyDefaultMetadata = function (params) {

    params.metadata = _.extend({}, params.metadata, {
        Mode: 'TimePicker',
        TimeZone: 0
    });

    _.defaults(params.metadata, {
        DisplayFormat: '{:T}',
        EditMask: {
            DateTimeEditMask: {
                Mask: 'T'
            }
        }
    });

};

TimePickerBuilder.prototype.applyMinValue = function (element, minValue) {
    var date = InfinniUI.DateUtils.parseTimeISO8601toDate(minValue, 0);

    if (typeof date !== 'undefined') {
        element.setMinValue(date);
    }
};

TimePickerBuilder.prototype.applyMaxValue = function (element, maxValue) {
    var date = InfinniUI.DateUtils.parseTimeISO8601toDate(maxValue, 0);

    if (typeof date !== 'undefined') {
        element.setMaxValue(date);
    }
};

//####app/elements/stackPanel/stackPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function StackPanel(parent, viewMode) {
    _.superClass(StackPanel, this, parent, viewMode);
}

window.InfinniUI.StackPanel = StackPanel;

_.inherit(StackPanel, Container);

StackPanel.prototype.getOrientation = function () {
    return this.control.get('orientation');
};

StackPanel.prototype.setOrientation = function (value) {
    if (InfinniUI.Metadata.isValidValue(value, InfinniUI.StackPanelOrientation)) {
        this.control.set('orientation', value)
    }
};

StackPanel.prototype.createControl = function (viewMode) {
    return new StackPanelControl(viewMode);
};

//####app/elements/stackPanel/stackPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function StackPanelBuilder() {
    _.superClass(StackPanelBuilder, this);
}

window.InfinniUI.StackPanelBuilder = StackPanelBuilder;

_.inherit(StackPanelBuilder, ContainerBuilder);

_.extend(StackPanelBuilder.prototype,
    /** @lends StackPanelBuilder.prototype*/
    {
        createElement: function (params) {
            return new StackPanel(params.parent, params.metadata['ViewMode']);
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

            var result = ContainerBuilder.prototype.applyMetadata.call(this, params);
            element.setOrientation(metadata.Orientation);

            return result;
        }

    });

//####app/elements/button/button.js
/**
 * @param parent
 * @augments Element
 * @constructor
 */
function Button(parent, viewMode) {
	_.superClass(Button, this, parent, viewMode);
	this.buttonInit();
}

window.InfinniUI.Button = Button;

_.inherit(Button, Element);

_.extend(Button.prototype, {

	createControl: function (viewMode) {
		return new ButtonControl(viewMode);
	},

	setType: function(type) {
		this.control.setType(type);
	},

	getType: function() {
		return this.control.getType();
	}

}, buttonMixin);

//####app/elements/button/buttonBuilder.js
function ButtonBuilder() {
    _.superClass(ButtonBuilder, this);
}

window.InfinniUI.ButtonBuilder = ButtonBuilder;

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

        if( params.metadata.Type ) {
            params.element.setType(params.metadata.Type);
        }
    }

}, buttonBuilderMixin);

//####app/elements/buttonEdit/buttonEdit.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextBox
 */
function ButtonEdit(parent) {
    _.superClass(ButtonEdit, this, parent);
}

window.InfinniUI.ButtonEdit = ButtonEdit;

_.inherit(ButtonEdit, TextBox);

ButtonEdit.prototype.createControl = function (parent) {
    return new ButtonEditControl(parent);
};

/**
 * @public
 * @param {String} icon
 */
ButtonEdit.prototype.setIcon = function (icon) {
    if (icon && icon.toLowerCase) {
        icon = icon.toLowerCase();
    }
    this.control.set('icon', icon);
};

/**
 * @public
 * @returns {String}
 */
ButtonEdit.prototype.getIcon = function () {
    return this.control.get('icon');
};

/**
 * @public
 * @param {boolean} readOnly
 */
ButtonEdit.prototype.setReadOnly = function (readOnly) {
    if (typeof  readOnly !== 'undefined' && readOnly !== null) {
        this.control.set('readOnly', !!readOnly);
    }
};

/**
 * @public
 * @returns {boolean}
 */
ButtonEdit.prototype.getReadOnly = function () {
    return this.control.get('readOnly');
};

/**
 * @public
 * @param {boolean} showClear
 */
ButtonEdit.prototype.setShowClear = function (showClear) {
    if (typeof showClear !== 'undefined' && showClear !== null) {
        this.control.set('showClear', !!showClear);
    }
};

/**
 * @public
 * @returns {boolean}
 */
ButtonEdit.prototype.getShowClear = function () {
    return this.control.get('showClear');
};


ButtonEdit.prototype.onButtonClick = function (handler) {
    var element = this;
    var callback = function (nativeEventData) {
        var eventData = element._getHandlingMouseEventData(nativeEventData);
        handler(eventData);
    };
    return this.control.onButtonClick(callback);
};

//####app/elements/buttonEdit/buttonEditBuilder.js
/**
 *
 * @constructor
 * @augments TextBoxBuilder
 */
function ButtonEditBuilder() {
    _.superClass(ButtonEditBuilder, this);
}

window.InfinniUI.ButtonEditBuilder = ButtonEditBuilder;

_.inherit(ButtonEditBuilder, TextBoxBuilder);

ButtonEditBuilder.prototype.createElement = function (params) {
    return new ButtonEdit(params.parent);
};

ButtonEditBuilder.prototype.applyMetadata = function (params) {
    TextBoxBuilder.prototype.applyMetadata.call(this, params);

    this.initBindingToProperty(params, 'Icon');
    this.initBindingToProperty(params, 'ReadOnly', true);
    this.initBindingToProperty(params, 'ShowClear', true);

    this.buildOnButtonClick(params);
    this.buildButtonAction(params);
};


/**
 * @protected
 * @param params
 */
ButtonEditBuilder.prototype.buildButtonAction = function (params) {
    /** @type {ButtonEdit} **/
    var element = params.element;
    var metadata = params.metadata;
    var builder = params.builder;

    if (!metadata.Action) {
        return;
    }

    var args = {
        parentView: params.parentView,
        parent: element,
        basePathOfProperty: params.basePathOfProperty
    };
    var action = builder.build(metadata.Action, args);
    element.onButtonClick(function(){
        action.execute();
    });
};

/**
 * @protected
 * @param params
 */
ButtonEditBuilder.prototype.buildOnButtonClick = function (params) {
    /** @type {ButtonEdit} **/
    var element = params.element;
    var metadata = params.metadata;

    var onButtonClick = metadata.OnButtonClick;
    if (!onButtonClick) {
        return;
    }

    element.onButtonClick(function (args) {
        new ScriptExecutor(element.getScriptsStorage()).executeScript(onButtonClick.Name || onButtonClick, args);
    });

};



//####app/elements/checkBox/checkBox.js
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

window.InfinniUI.CheckBox = CheckBox;

_.inherit(CheckBox, Element);


_.extend(CheckBox.prototype, {

    createControl: function (parent) {
        return new CheckBoxControl(parent);
    }

}, editorBaseMixin);

//####app/elements/checkBox/checkBoxBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 */
function CheckBoxBuilder() {
    _.superClass(CheckBoxBuilder, this);
    this.initialize_editorBaseBuilder();
}

window.InfinniUI.CheckBoxBuilder = CheckBoxBuilder;

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


//####app/elements/comboBox/comboBox.js
/**
 * @augments ListEditorBase
 * @param parent
 * @constructor
 * @mixes labelTextElementMixin
 */
function ComboBox(parent) {
    _.superClass(ComboBox, this, parent);
}

window.InfinniUI.ComboBox = ComboBox;

_.inherit(ComboBox, ListEditorBase);

_.extend(ComboBox.prototype, labelTextElementMixin);

ComboBox.prototype.createControl = function () {
    return new ComboBoxControl();
};

ComboBox.prototype.setValueTemplate = function (value) {
    this.control.set('valueTemplate', value);
};

ComboBox.prototype.getValueTemplate = function () {
    return this.control.get('valueTemplate');
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

ComboBox.prototype.getAutocompleteValue = function () {
    return this.control.get('autocompleteValue');
};

ComboBox.prototype.setAutocompleteValue = function (value) {
    this.control.set('autocompleteValue', value);
};


//####app/elements/comboBox/comboBoxBuilder.js
/**
 * @augments ListEditorBaseBuilder
 * @constructor
 */
function ComboBoxBuilder() {
    _.superClass(ComboBoxBuilder, this);
}

window.InfinniUI.ComboBoxBuilder = ComboBoxBuilder;

_.inherit(ComboBoxBuilder, ListEditorBaseBuilder);

_.extend(ComboBoxBuilder.prototype, /** @lends ComboBoxBuilder.prototype */{

    createElement: function (params) {
        return new ComboBox(params.parent);
    },

    applyMetadata: function (params) {
        var element = params.element;
        var that = this;

        var data = ListEditorBaseBuilder.prototype.applyMetadata.call(this, params);
        this.initValueTemplate(data.valueBinding, params);
        this.initBindingToProperty(params, 'LabelText');
        element.setAutocomplete(params.metadata.Autocomplete);
        element.setShowClear(params.metadata.ShowClear);

        if(params.metadata.Autocomplete){
            var name = element.getName();

            if(!name){
                name = that.generateName();
                element.setName(name);
            }
        }

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
            label.setValue(value);
            return label;
        };
    },

    buildValueTemplateByDefault: function (binding, params) {

        return function (context, args) {
            var index = args.index;
            var value = args.value;

            var label = new Label(this);
            label.setHorizontalAlignment('Left');
            label.setValue(value);

            return label;
        };
    },

    generateName: function(){
        return 'combobox-' + guid();
    }
});

//####app/elements/contextMenu/contextMenu.js
/**
 * @class
 * @constructor
 * @arguments Container
 */
function ContextMenu(parent) {
    _.superClass(ContextMenu, this, parent);
}

window.InfinniUI.ContextMenu = ContextMenu;

_.inherit(ContextMenu, Container);

_.extend(ContextMenu.prototype, {

    createControl: function () {
        return new ContextMenuControl();
    }

});

//####app/elements/contextMenu/contextMenuBuilder.js
/**
 * @constructor
 * @arguments ContainerBuilder
 */
function ContextMenuBuilder() {
	_.superClass(ContextMenuBuilder, this);
}

window.InfinniUI.ContextMenuBuilder = ContextMenuBuilder;

_.inherit(ContextMenuBuilder, ContainerBuilder);

_.extend(ContextMenuBuilder.prototype, /** @lends ContextMenuBuilder.prototype */{

	createElement: function (params) {
		return new ContextMenu(params.parent);
	},

	applyMetadata: function (params) {
		ContainerBuilder.prototype.applyMetadata.call(this, params);
	}

});

//####app/elements/dataGrid/dataGrid.js
function DataGrid(parent) {
    _.superClass(DataGrid, this, parent);
}

window.InfinniUI.DataGrid = DataGrid;

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

DataGrid.prototype.setEnabled = function (value) {
    if( _.isBoolean(value) ) {
        this.control.setEnabled(value);
    }
};

/**
 * @description Устанавливает значение, определяющее виден ли элемент "Выбрать все" в шапке таблицы.
 * @param {boolean} value
 */
DataGrid.prototype.setCheckAllVisible = function (value) {
    if (_.isBoolean(value)) {
        this.control.set('checkAllVisible', value);
    }
};

/**
 * @description Возвращает значение, определяющее виден ли элемент "Выбрать все" в шапке таблицы.
 * @returns {boolean}
 */
DataGrid.prototype.getCheckAllVisible = function () {
    return this.control.get('checkAllVisible');
};

/**
 * @description Возвращает состояние элемента "Выбрать все" из шапки таблицы
 * @returns {boolean}
 */
DataGrid.prototype.getCheckAll = function () {
    return this.control.get('checkAll');
};

/**
 * @description Устанавливает обработчик события о том, что изменилось состояние элемента "Выбрать все" в шапке таблицы
 * @param {function} handler
 */
DataGrid.prototype.onCheckAllChanged = function (handler) {
    this.control.onCheckAllChanged(this.createControlEventHandler(this, handler));
};

DataGrid.prototype.createControl = function () {
    return new DataGridControl();
};


DataGrid.prototype.onRowClick = function (handler) {
    var that = this,
    callback = function (nativeEventData) {
        var eventData = that._getHandlingMouseEventData(nativeEventData);
        handler(eventData);
    };
    return this.control.onRowClick(callback);
};

DataGrid.prototype.onRowDoubleClick = function (handler) {
    var that = this,
        callback = function (nativeEventData) {
            var eventData = that._getHandlingMouseEventData(nativeEventData);
            handler(eventData);
        };
    return this.control.onRowDoubleClick(callback);
};

//####app/elements/dataGrid/dataGridBuilder.js
function DataGridBuilder() {
    _.superClass(DataGridBuilder, this);
    this.columnBuilder = new DataGridColumnBuilder();
}

window.InfinniUI.DataGridBuilder = DataGridBuilder;

_.inherit(DataGridBuilder, ListEditorBaseBuilder);

_.extend(DataGridBuilder.prototype, /** @lends DataGridBuilder.prototype */{

    createElement: function (params) {
        return new DataGrid(params.parent);
    },

    applyMetadata: function (params) {
        ListEditorBaseBuilder.prototype.applyMetadata.call(this, params);

        var metadata = params.metadata;
        /** @type DataGrid **/
        var element = params.element;
        element.setShowSelectors(metadata.ShowSelectors);
        element.setCheckAllVisible(metadata.CheckAllVisible);

        if(metadata.OnCheckAllChanged){
            element.onCheckAllChanged(function(context, args) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnCheckAllChanged.Name || metadata.OnCheckAllChanged, args);
            });
        }

        if( metadata.OnRowClick ) {
            element.onRowClick(function (args) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnRowClick.Name || metadata.OnRowClick, args);
            });
        }

        if( metadata.OnRowDoubleClick ) {
            element.onRowDoubleClick(function (args) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnRowDoubleClick.Name || metadata.OnRowDoubleClick, args);
            });
        }

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
        var builder = this;

        return function (context, args) {
            var row = dataGrid.createRow();
            row.setGrid(dataGrid);

            ['RowStyle', 'RowBackground', 'RowForeground', 'RowTextStyle']
                .forEach(initBindingToRowProperty.bind(null, row, args.index));

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

        function initBindingToRowProperty(row, index, propertyName) {
            var basePathOfProperty = params.basePathOfProperty || new BasePathOfProperty('');
            var argumentForBuilder = {
                element: row,
                parent: dataGrid,
                builder: params.builder,
                metadata: params.metadata,
                parentView: params.parentView
            };
            argumentForBuilder.basePathOfProperty = basePathOfProperty.buildChild('', index);

            builder.initBindingToProperty(argumentForBuilder, propertyName);
        }
    }

});

//####app/elements/dataGrid/dataGridColumn.js
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

DataGridColumn.prototype.setWidth = function (value) {
    this.setProperty('width', value);
};

DataGridColumn.prototype.getWidth = function (value) {
    return this.getProperty('width');
};

DataGridColumn.prototype.setSortable = function (value) {
    this.setProperty('sortable', value);
};

DataGridColumn.prototype.getSortable = function () {
    return this.getProperty('sortable');
};

DataGridColumn.prototype.isSortable = function () {
    return this.getSortable();
};

DataGridColumn.prototype.setSortDirection = function (value) {
    this.setProperty('sortDirection', value);
};

DataGridColumn.prototype.getSortDirection = function () {
    return this.getProperty('sortDirection');
};

DataGridColumn.prototype.setSortFunction = function (handler) {
    this.setProperty('sortFunction', handler);
};

DataGridColumn.prototype.getSortFunction = function () {
    return this.getProperty('sortFunction');
};

DataGridColumn.prototype.setIsHeaderTemplateEmpty = function (value) {
    this.setProperty('isHeaderTemplateEmpty', value);
};

DataGridColumn.prototype.getIsHeaderTemplateEmpty = function () {
    return this.getProperty('isHeaderTemplateEmpty');
};

DataGridColumn.prototype.onSort = function (handler) {
    var that = this,
        callback = function (nativeEventData) {
            handler(nativeEventData);
        };
    this.on('onSort', callback);
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

//####app/elements/dataGrid/dataGridColumnBuilder.js
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
        .buildCellTemplate(column, metadata, params)
        .buildWidth(column, metadata);

    if( metadata.Sortable ) {
        column.setSortable(true);
        column.setSortDirection( null );
        if( metadata.SortedDefault && ( metadata.SortedDefault === 'asc' || metadata.SortedDefault === 'desc' ) ) {
            column.setSortDirection( metadata.SortedDefault );
        }

        if (metadata.SortFunction) {
            column.onSort(function (args) {
                new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.SortFunction.Name || metadata.SortFunction, args);
            });
        }
    }

    return column;
};

DataGridColumnBuilder.prototype.buildWidth = function (column, metadata) {
    var width = metadata.Width;

    if (width !== null && typeof width !== 'undefined') {
        column.setWidth(width);
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
            var binding = new DataBinding();

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
            var binding = new DataBinding();

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
        column.setIsHeaderTemplateEmpty(true);
    } else {
        headerTemplate = this.buildHeaderTemplateByMetadata(headerTemplateMetadata, params);
        column.setIsHeaderTemplateEmpty(false);
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

//####app/elements/dataNavigation/dataNavigation.js
function DataNavigation (parent) {
    _.superClass(DataNavigation, this, parent);
}

window.InfinniUI.DataNavigation = DataNavigation;

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
    },

    getPageCount: function () {
        return this.control.get('pageCount');
    },

    setPageCount: function (value) {
        this.control.set('pageCount', value)
    },

    getIsDataReady: function () {
        return this.control.get('isDataReady');
    },

    setIsDataReady: function (value) {
        this.control.set('isDataReady', value)
    }

});

//####app/elements/dataNavigation/dataNavigationBuilder.js
function DataNavigationBuilder () {
    _.superClass(DataNavigationBuilder, this);
}

window.InfinniUI.DataNavigationBuilder = DataNavigationBuilder;

_.inherit(DataNavigationBuilder, ElementBuilder);

_.extend(DataNavigationBuilder.prototype, {

    createElement: function (params) {
        return new DataNavigation(params.parent);
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var element = params.element;
        var metadata = params.metadata;
        var pageSize;
        var that = this;

        if (Array.isArray(metadata.AvailablePageSizes)) {
            element.getAvailablePageSizes().reset(metadata.AvailablePageSizes);
        }

        var ds = this.findDataSource(params);
        if (ds) {
            pageSize = ds.getProperty('.pageSize');

            element.setDataSource(ds);
            element.setPageSize(pageSize);

            ds.onItemsUpdated(function(){
                that.onDataUpdated(element, ds);
            });

            if(ds.isDataReady()){
                this.onDataUpdated(element, ds);
            }

            element.onPageNumberChanged(function (context, message) {
                ds.setProperty('.pageNumber', message.value);
            });

            element.onPageSizeChanged(function (context, message) {
                ds.setProperty('.pageSize', message.value);
            });
        } else {
            console.error('DataSource not found');
        }

    },

    onDataUpdated: function(element, dataSource){
        var dsTotalCount = dataSource.getProperty('.totalCount'),
            pageSize = dataSource.getProperty('.pageSize'),
            pageNumber = dataSource.getProperty('.pageNumber'),
            pageCount;

        if(typeof dsTotalCount == 'number'){
            pageCount = Math.ceil(dsTotalCount/pageSize);
            element.setPageCount(pageCount);
        }

        element.setPageNumber(pageNumber);
        element.setIsDataReady(true);
    },

    findDataSource: function (params) {
        var
            name = params.metadata.DataSource,
            view = params.parentView,
            context,
            dataSource;
        
        if (name && view) {
            context = view.getContext();
            dataSource = context.dataSources[name];
        }

        return dataSource;
    }

});

//####app/elements/divider/divider.js
/**
 *
 * @param parent
 * @constructor
 * @argument Element
 */
function Divider(parent) {
	_.superClass(Divider, this, parent);
}

window.InfinniUI.Divider = Divider;

_.inherit(Divider, Element);

Divider.prototype.createControl = function (parent) {
	return new DividerControl(parent);
}

//####app/elements/divider/dividerBuilder.js
/**
 *
 * @constructor
 * @arguments DividerBuilder
 */
function DividerBuilder() {
	_.superClass(DividerBuilder, this);
}

window.InfinniUI.DividerBuilder = DividerBuilder;

_.inherit(DividerBuilder, ElementBuilder);

DividerBuilder.prototype.createElement = function (params) {
	return new Divider(params.parent);
};

DividerBuilder.prototype.applyMetadata = function (params) {
	ElementBuilder.prototype.applyMetadata.call(this, params);
};


//####app/elements/extensionPanel/extensionPanel.js
function ExtensionPanel(parent) {
    _.superClass(ExtensionPanel, this, parent);
}

window.InfinniUI.ExtensionPanel = ExtensionPanel;

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

    getParameters: function () {
        return this.control.get('parameters');
    },

    setContext: function (context) {
        this.control.set('context', context);
    },

    setBuilder: function (builder) {
        this.control.set('builder', builder);
    }
});

//####app/elements/extensionPanel/extensionPanelBuilder.js
function ExtensionPanelBuilder() {}

window.InfinniUI.ExtensionPanelBuilder = ExtensionPanelBuilder;

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
        element.setBuilder(builder);
    },

    createElement: function (params) {
        var element = new ExtensionPanel(params.parent);

        return element;
    }
});

//####app/elements/fileBox/fileBox.js
/**
 *
 * @param parent
 * @augments Element
 * @mixes editorBaseMixin
 * @mixes labelTextElementMixin
 * @constructor
 */
function FileBox(parent) {
    _.superClass(FileBox, this, parent);

    this.initialize_editorBase();
}

window.InfinniUI.FileBox = FileBox;

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
    setFile: function (value) {
        this.control.set('file', value);
    },

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

},
    editorBaseMixin,
    labelTextElementMixin
);

//####app/elements/fileBox/fileBoxBuilder.js
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

window.InfinniUI.FileBoxBuilder = FileBoxBuilder;

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

        this.initBindingToProperty(params, 'LabelText');

        // Привязка данных односторонняя т.к.:
        // 1. по значению из источника данных - сформировать URL изображения.
        // 2. при выборе в элементе файла на загрузку - добавить выбранный файл в очередь на загрузку

        var converter = new FileBoxValueConverter(element);

        var data = this.applyMetadata_editorBaseBuilder(params, {
            mode: InfinniUI.BindingModes.toElement,
            converter: converter
        });

        var binding = data.valueBinding;

        if (binding) {
            var ds = binding.getSource();

            params.element.onPropertyChanged('file', function (context, args) {
                var file = args.newValue;

                if (file === null) {
                    ds.setProperty(binding.getSourceProperty(), null)
                } else if (file instanceof File) {
                    ds.setProperty(binding.getSourceProperty(), args.newValue)
                }
            })
        }

    }

    }, editorBaseBuilderMixin);

//####app/elements/fileBox/fileBoxValueConverter.js
function FileBoxValueConverter (element) {
    this._element = element;
}

FileBoxValueConverter.prototype.toElement = function (context, args) {
    var value = args.value;
    var binding = args.binding;
    var ds = binding.getSource();
    var fileProvider = ds.getFileProvider();
    var url = null;
    //Формируем ссылку для получения файла

    if (value) {
        if (fileProvider && InfinniUI.BlobUtils.isFileInfo(value)) {
            url = fileProvider.getFileUrl(null, null, InfinniUI.BlobUtils.getContentId(value));
            this._element
                .setFileName(InfinniUI.BlobUtils.getName(value))
                .setFileSize(InfinniUI.BlobUtils.getSize(value))
                .setFileTime(InfinniUI.BlobUtils.getTime(value))
                .setFileType(InfinniUI.BlobUtils.getType(value));

        } else if (typeof value === 'string') {
            //@TODO Добавить проверку на валидность URI
            url = value;
        } else {
            //Native File instance from FileAPI
            url = value;
        }

    }

    return url;
};
//####app/elements/form/form.js
/**
 *
 * @param parent
 * @constructor
 * @augment StackPanel
 */
function Form(parent) {
	_.superClass(Form, this, parent);
}

window.InfinniUI.Form = Form;

_.inherit(Form, StackPanel);

Form.prototype.createControl = function (parent) {
	return new FormControl(parent);
};

Form.prototype.onSubmit = function (handler) {
	var that = this,
			callback = function (nativeEventData) {
				handler(nativeEventData);
			};
	return this.control.onSubmit(callback);
};

Form.prototype.setSubmitFunction = function(func) {
	this.control.setSubmitFunction(func);
};

Form.prototype.getSubmitFunction = function() {
	return this.control.getSubmitFunction();
};

Form.prototype.setMethod = function(method) {
	this.control.setMethod(method);
};

Form.prototype.getMethod = function() {
	return this.control.getMethod();
};

Form.prototype.setAction = function(action) {
	this.control.setAction(action);
};

Form.prototype.getAction = function() {
	return this.control.getAction();
};

//####app/elements/form/formBuilder.js
/**
 *
 * @constructor
 * @augments StackPanelBuilder
 */
function FormBuilder() {
	_.superClass(FormBuilder, this);
}

window.InfinniUI.FormBuilder = FormBuilder;

_.inherit(FormBuilder, StackPanelBuilder);

_.extend(FormBuilder.prototype, {

	createElement: function (params) {
		return new Form(params.parent);
	},

	applyMetadata: function(params) {
		var element = params.element,
				metadata = params.metadata;
		StackPanelBuilder.prototype.applyMetadata.call(this, params);

		if( metadata.OnSubmit ) {
			element.onSubmit(function() {
				return new ScriptExecutor(element.getScriptsStorage()).executeScript(metadata.OnSubmit.Name || metadata.OnSubmit);
			});
		}

		if( metadata.Method ) {
			element.setMethod(metadata.Method);
		}

		if( metadata.Action ) {
			element.setAction(metadata.Action);
		}
	}
});

//####app/elements/frame/frame.js
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

window.InfinniUI.Frame = Frame;

_.inherit(Frame, Element);

_.extend(Frame.prototype, {

        createControl: function () {
            return new FrameControl();
        }

    },
    editorBaseMixin
);

//####app/elements/frame/frameBuilder.js
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

window.InfinniUI.FrameBuilder = FrameBuilder;

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

//####app/elements/gridPanel/gridPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function GridPanel(parent) {
    _.superClass(GridPanel, this, parent);
}

window.InfinniUI.GridPanel = GridPanel;

_.inherit(GridPanel, Container);

_.extend(GridPanel.prototype, {
    createControl: function () {
        return new GridPanelControl();
    }
});

//####app/elements/gridPanel/gridPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function GridPanelBuilder() {
    _.superClass(GridPanelBuilder, this);
}

window.InfinniUI.GridPanelBuilder = GridPanelBuilder;

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

//####app/elements/icon/icon.js
function Icon(parent) {
    _.superClass(Icon, this, parent);
}

window.InfinniUI.Icon = Icon;

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

//####app/elements/icon/iconBuilder.js
function IconBuilder() {
    _.superClass(ButtonBuilder, this);
}

window.InfinniUI.IconBuilder = IconBuilder;

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

//####app/elements/imageBox/imageBox.js
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

window.InfinniUI.ImageBox = ImageBox;

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

//####app/elements/imageBox/imageBoxBuilder.js
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

window.InfinniUI.ImageBoxBuilder = ImageBoxBuilder;

_.inherit(ImageBoxBuilder, ElementBuilder);

_.extend(ImageBoxBuilder.prototype, {

    createElement: function (params) {
        return new ImageBox(params.parent);
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

        var converter = new ImageBoxValueConverter(element);

        var data = this.applyMetadata_editorBaseBuilder(params, {
            mode: InfinniUI.BindingModes.toElement,
            converter: converter
        });

        var binding = data.valueBinding;
        if (binding) {
            var ds = binding.getSource();

            params.element.onPropertyChanged('file', function (context, args) {
                var file = args.newValue;

                if (file instanceof File || file === null) {
                    ds.setProperty(binding.getSourceProperty(), args.newValue)
                }
            });
        }

    }

}, editorBaseBuilderMixin);

//####app/elements/imageBox/imageBoxValueConverter.js
function ImageBoxValueConverter (element) {
    this._element = element;
}

ImageBoxValueConverter.prototype.toElement = function (context, args) {
    var value = args.value;
    var binding = args.binding;
    var ds = binding.getSource();
    var fileProvider = ds.getFileProvider();
    var url = null;
    //Формируем URL изображения

    if (value) {
        if (fileProvider && InfinniUI.BlobUtils.isFileInfo(value)) {
            url = fileProvider.getFileUrl(null, null, InfinniUI.BlobUtils.getContentId(value));
        } else if (typeof value === 'string') {
            //@TODO Добавить проверку на валидность URI
            url = value;
        } else {
            //Native File instance from FileAPI
            url = value;
        }
    }
    return url;
};
//####app/elements/indeterminateCheckBox/indeterminateCheckBox.js
/**
 *
 * @param parent
 * @constructor
 * @augment Element
 */
function IndeterminateCheckBox(parent) {
	_.superClass(IndeterminateCheckBox, this, parent);
	this.initialize_editorBase();
}

window.InfinniUI.IndeterminateCheckBox = IndeterminateCheckBox;

_.inherit(IndeterminateCheckBox, CheckBox);


_.extend(IndeterminateCheckBox.prototype, {

	createControl: function (parent) {
		return new IndeterminateCheckBoxControl(parent);
	}

}, editorBaseMixin);

//####app/elements/indeterminateCheckBox/indeterminateCheckBoxBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 */
function IndeterminateCheckBoxBuilder() {
	_.superClass(IndeterminateCheckBoxBuilder, this);
	this.initialize_editorBaseBuilder();
}

window.InfinniUI.IndeterminateCheckBoxBuilder = IndeterminateCheckBoxBuilder;

_.inherit(IndeterminateCheckBoxBuilder, CheckBoxBuilder);


_.extend(IndeterminateCheckBoxBuilder.prototype, {
	createElement: function (params) {
		return new IndeterminateCheckBox(params.parent);
	}
});


//####app/elements/label/label.js
function Label(parent, viewMode) {
    _.superClass(Label, this, parent, viewMode);
    this.initialize_editorBase();
}

window.InfinniUI.Label = Label;

_.inherit(Label, Element);


_.extend(Label.prototype, {

        createControl: function () {
            return new LabelControl();
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
        },

        /**
         * @description Возвращает режим отображения HTML разметки
         * @returns {Boolean}
         */
        getEscapeHtml: function () {
            return this.control.get('escapeHtml');
        },

        /**
         * @description Устанавливает режим отображения HTML разметки
         * @param {Boolean} value
         */
        setEscapeHtml: function (value) {
            if (_.isBoolean(value)) {
                this.control.set('escapeHtml', value);
            }
        }
    }

    ,
    editorBaseMixin
    //formatPropertyMixin,
    //elementHorizontalTextAlignmentMixin,
    //@TODO TextTrimming
    //elementBackgroundMixin,
    //elementForegroundMixin,
    //elementTextStyleMixin
);

//####app/elements/label/labelBuilder.js
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

window.InfinniUI.LabelBuilder = LabelBuilder;

_.inherit(LabelBuilder, ElementBuilder);
_.extend(LabelBuilder.prototype, {
    applyMetadata: function(params){
        /** @type Label **/
        var element = params.element;
        ElementBuilder.prototype.applyMetadata.call(this, params);
        this.applyMetadata_editorBaseBuilder(params);

        element.setTextWrapping(params.metadata.TextWrapping);
        element.setTextTrimming(params.metadata.TextTrimming);
        element.setEscapeHtml(params.metadata.EscapeHtml);
        
        this.initDisplayFormat(params);
        this.initScriptsHandlers(params);

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
);

//####app/elements/link/link.js
/**
 * @param parent
 * @augments Button
 * @constructor
 */
function Link(parent) {
    _.superClass(Link, this, parent);
}

window.InfinniUI.Link = Link;

_.inherit(Link, Button);

Link.prototype.createControl = function () {
    return new LinkElementControl();
};

Link.prototype.setHref = function (value) {
    this.control.set('href', value);
};

Link.prototype.getHref = function () {
    return this.control.get('href');
};

Link.prototype.setTarget = function (value) {
    this.control.set('target', value);
};

Link.prototype.getTarget = function () {
    return this.control.get('target');
};

//####app/elements/link/linkBuilder.js
function LinkBuilder() {
	_.superClass(LinkBuilder, this);
}

window.InfinniUI.LinkBuilder = LinkBuilder;

_.inherit(LinkBuilder, ButtonBuilder);

_.extend(LinkBuilder.prototype, routerServiceMixin, {

	createElement: function (params) {
		return new Link(params.parent);
	},

	applyMetadata: function (params) {
		ButtonBuilder.prototype.applyMetadata.call(this, params);

		var metadata = params.metadata,
				element = params.element;

		if( metadata.Href && typeof metadata.Href === 'string' ) {
			element.setHref(metadata.Href);
		} else if( metadata.Href ) {
			var pathName = metadata.Href.Name,
					hrefParams = metadata.Href.Params,
					query = metadata.Href.Query,
					href = routerService.getLinkByName(pathName, 'no'),
					newHref = href;

			element.setHref(newHref);
			if( hrefParams ) {
				for( var i = 0, ii = hrefParams.length; i < ii; i += 1 ) {
					if( typeof hrefParams[i].Value === 'string' ) {
						if( element.getHref() !== newHref ) {
							newHref = element.getHref();
						}
						newHref = this.replaceParamsInHref(newHref, hrefParams[i].Name, hrefParams[i].Value);
						element.setHref(newHref);
					} else {
						this.bindParams(params, hrefParams[i].Name, hrefParams[i].Value, newHref);
					}
				}
			}
			if( query ) {
				for( var i = 0, ii = query.length; i < ii; i += 1 ) {
					if( typeof query[i].Value === 'string' ) {
						if( element.getHref() !== newHref ) {
							newHref = element.getHref();
						}
						newHref = this.replaceParamsInQuery(newHref, query[i].Name, query[i].Value);
						element.setHref(newHref);
					} else {
						this.bindQuery(params, query[i].Name, query[i].Value, newHref);
					}
				}
			}
		}

		if( metadata.Target ) { 
			element.setTarget(metadata.Target);
		}
	}

});

//####app/elements/menuBar/menuBar.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function MenuBar(parent) {
    _.superClass(MenuBar, this, parent);
}

window.InfinniUI.MenuBar = MenuBar;

_.inherit(MenuBar, Container);

_.extend(MenuBar.prototype, {
    createControl: function (viewMode) {
        return new MenuBarControl(viewMode);
    },

    /**
     * @description Устанавливает/снимает выделение элемента меню с заданным именем
     * @param {String|*} name Имя выделяемого элемента меню
     */
    highlightItem: function (name) {
        (function highlight(element) {
            var childElements = element.getChildElements();
            childElements.forEach(function (childElement) {
                var highlight = _.isString(name) && childElement.getName() === name;
                var control = childElement.control;

                if (control) {
                    control.setHighlight(highlight);
                }
            });
        })(this);
    }

});

//####app/elements/menuBar/menuBarBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function MenuBarBuilder() {
    _.superClass(MenuBarBuilder, this);
}

window.InfinniUI.MenuBarBuilder = MenuBarBuilder;

_.inherit(MenuBarBuilder, ContainerBuilder);

_.extend(MenuBarBuilder.prototype,
    /** @lends MenuBarBuilder.prototype*/
    {
        createElement: function (params) {
            return new MenuBar(params.parent);
        }

    });

//####app/elements/numericBox/numericBox.js
/**
 *
 * @param parent
 * @constructor
 * @augments TextEditorBase
 */
function NumericBox(parent) {
    _.superClass(NumericBox, this, parent);
}

window.InfinniUI.NumericBox = NumericBox;

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

/**
 * @public
 * @description Устанваливает начальное значение
 * @param {Number} value
 */
NumericBox.prototype.setStartValue = function (value) {
    this.control.set('startValue', value);
};

NumericBox.prototype.validateValue = function (value) {
    var error,
        min = this.getMinValue(),
        max = this.getMaxValue();

    value = this.convertValue(value);

    if (value === null || typeof value === 'undefined') {
        return error;
    }

    if (!_.isNumber(value)) {
        error = 'Значение должно быть числом';
    } else  if (_.isNumber(min)) {
        if (_.isNumber(max)) {
            if (value < min || value > max) {
                error = 'Значение должно быть от ' + min + ' до ' + max;
            }
        } else {
            if (value < min) {
                error = 'Значение должно быть больше ' + min;
            }
        }
    } else {
        if (_.isNumber(max)) {
            if (value > max) {
                error = 'Значение должно быть меьше ' + max;
            }
        }
    }

    return error;
};

NumericBox.prototype.convertValue = function (value) {
    var val = (value === null || value === '' || typeof value === 'undefined') ? null : +value;

    return _.isNumber(val) ? val : null;
};

/**
 * @public
 * @description Возвращает начальное значение
 * @returns {Number}
 */
NumericBox.prototype.getStartValue = function () {
    return this.control.get('startValue');
};

//####app/elements/numericBox/numericBoxBuilder.js
/**
 *
 * @constructor
 * @augments TextEditorBaseBuilder
 */
function NumericBoxBuilder() {
    _.superClass(NumericBoxBuilder, this);
}

window.InfinniUI.NumericBoxBuilder = NumericBoxBuilder;

_.inherit(NumericBoxBuilder, TextEditorBaseBuilder);

NumericBoxBuilder.prototype.createElement = function (params) {
    return new NumericBox(params.parent);
};

NumericBoxBuilder.prototype.applyMetadata = function (params) {
    TextEditorBaseBuilder.prototype.applyMetadata.call(this, params);

    /** @type NumericBox **/
    var element = params.element;
    var metadata = params.metadata;

    element.setMinValue(metadata.MinValue);
    element.setMaxValue(metadata.MaxValue);
    element.setIncrement(metadata.Increment);
    element.setStartValue(metadata.StartValue);
};


//####app/elements/panel/panel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function Panel(parent) {
    _.superClass(Panel, this, parent);
}

window.InfinniUI.Panel = Panel;

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
 * @description Возвращает элемент для открытия панели
 * @returns {string}
 */
Panel.prototype.getCollapsibleArea = function () {
    return this.control.get('collapsibleArea');
};

/**
 * @description Устанавливает элемент при клике на который раскрывается панель
 * @param {string} value
 */
Panel.prototype.setCollapsibleArea = function (value) {
    this.control.set('collapsibleArea', value);
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

//####app/elements/panel/panelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function PanelBuilder() {
    _.superClass(PanelBuilder, this);
}

window.InfinniUI.PanelBuilder = PanelBuilder;

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
        element.setCollapsibleArea(metadata.CollapsibleArea);

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
                    .executeScript(metadata.OnExpanding.Name || metadata.OnExpanding, args);
            });
        }
        if (metadata.OnExpanded) {
            element.onExpanded(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnExpanded.Name || metadata.OnExpanded, args);
            });
        }
        if (metadata.OnCollapsing) {
            element.onCollapsing(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnCollapsing.Name || metadata.OnCollapsing, args);
            });
        }
        if (metadata.OnCollapsed) {
            element.onCollapsed(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnCollapsed.Name || metadata.OnCollapsed, args);
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

//####app/elements/passwordBox/passwordBox.js
/**
 *
 * @constructor
 * @augments Element
 * @mixes editorBaseMixin
 * @mixes labelTextElementMixin
 */
function PasswordBox(parent) {
    _.superClass(PasswordBox, this, parent);
    this.initialize_editorBase();
}

window.InfinniUI.PasswordBox = PasswordBox;

_.inherit(PasswordBox, Element);

_.extend(PasswordBox.prototype, /* @lends PasswordBox.prototype */ {

        setAutocomplete: function (value) {
            if (typeof value === 'undefined' || value === null) {
                return;
            }
            this.control.set('autocomplete', !!value);
        },

        getAutocomplete: function () {
            return this.control.get('autocomplete');
        },

        createControl: function () {
            return new PasswordBoxControl();
        },

        getRawValue: function () {
            return this.control.get('rawValue');
        }

    },
    editorBaseMixin,
    labelTextElementMixin
);

//####app/elements/passwordBox/passwordBoxBuilder.js
/**
 * @constructor
 * @augments ElementBuilder
 * @mixes editorBaseBuilderMixin
 */
function PasswordBoxBuilder() {
    _.superClass(PasswordBoxBuilder, this);
    this.initialize_editorBaseBuilder();
}

window.InfinniUI.PasswordBoxBuilder = PasswordBoxBuilder;

_.inherit(PasswordBoxBuilder, ElementBuilder);

_.extend(PasswordBoxBuilder.prototype, /** @lends PasswordBoxBuilder.prototype */ {

        applyMetadata: function (params) {
            ElementBuilder.prototype.applyMetadata.call(this, params);
            this.applyMetadata_editorBaseBuilder(params);

            var metadata = params.metadata,
                element = params.element;

            this.initBindingToProperty(params, 'LabelText');
            element.setAutocomplete(metadata.Autocomplete);
        },

        createElement: function (params) {
            var element = new PasswordBox(params.parent);
            return element;
        }

    },
    editorBaseBuilderMixin
);

//####app/elements/popupButton/popupButton.js
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

window.InfinniUI.PopupButton = PopupButton;

_.inherit(PopupButton, Container);

_.extend(PopupButton.prototype, {

    createControl: function (viewMode) {
        return new PopupButtonControl(viewMode);
    }

}, buttonMixin);

//####app/elements/popupButton/popupButtonBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function PopupButtonBuilder() {
    _.superClass(PopupButtonBuilder, this);
}

window.InfinniUI.PopupButtonBuilder = PopupButtonBuilder;

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

//####app/elements/radioGroup/radioGroupBuilder.js
function RadioGroupBuilder() {
    _.superClass(RadioGroupBuilder, this);
}

window.InfinniUI.RadioGroupBuilder = RadioGroupBuilder;

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

//####app/elements/scrollPanel/scrollPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function ScrollPanel(parent) {
    _.superClass(ScrollPanel, this, parent);
}

window.InfinniUI.ScrollPanel = ScrollPanel;

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
    if (InfinniUI.Metadata.isValidValue(value, InfinniUI.ScrollVisibility)) {
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
    if (InfinniUI.Metadata.isValidValue(value, InfinniUI.ScrollVisibility)) {
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

//####app/elements/scrollPanel/scrollPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function ScrollPanelBuilder() {
    _.superClass(ScrollPanelBuilder, this);
}

window.InfinniUI.ScrollPanelBuilder = ScrollPanelBuilder;

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

//####app/elements/tabPanel/tabPanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function TabPanel(parent) {
    _.superClass(TabPanel, this, parent);
}

window.InfinniUI.TabPanel = TabPanel;

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
    if (InfinniUI.Metadata.isValidValue(value, InfinniUI.TabHeaderLocation)) {
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
    if (InfinniUI.Metadata.isValidValue(value, InfinniUI.TabHeaderOrientation)) {
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

//####app/elements/tabPanel/tabPanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function TabPanelBuilder() {
    _.superClass(TabPanelBuilder, this);
}

window.InfinniUI.TabPanelBuilder = TabPanelBuilder;

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
                    .executeScript(metadata.OnSelectedItemChanged.Name || metadata.OnSelectedItemChanged, args);
            });
        }
    }


});

//####app/elements/tablePanel/tablePanel.js
/**
 * @param parent
 * @constructor
 * @augments Container
 */
function TablePanel(parent) {
    _.superClass(TablePanel, this, parent);
}

window.InfinniUI.TablePanel = TablePanel;

_.inherit(TablePanel, Container);

_.extend(TablePanel.prototype, {
    createControl: function () {
        return new TablePanelControl();
    }
});

//####app/elements/tablePanel/tablePanelBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function TablePanelBuilder() {
    _.superClass(TablePanelBuilder, this);
}

window.InfinniUI.TablePanelBuilder = TablePanelBuilder;

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

//####app/elements/toggleButton/toggleButton.js
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

window.InfinniUI.ToggleButton = ToggleButton;

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

//####app/elements/toggleButton/toggleButtonBuilder.js
/**
 *
 * @constructor
 * @augments ElementBuilder
 */
function ToggleButtonBuilder() {
    _.superClass(ToggleButtonBuilder, this);
    this.initialize_editorBaseBuilder();
}

window.InfinniUI.ToggleButtonBuilder = ToggleButtonBuilder;

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

//####app/elements/toolBar/toolBar.js
/**
 *
 * @param parent
 * @constructor
 * @augments Container
 */
var ToolBar = function (parent) {
    _.superClass(ToolBar, this, parent);
};

window.InfinniUI.ToolBar = ToolBar;

_.inherit(ToolBar, Container);

ToolBar.prototype.createControl = function () {
    return new ToolBarControl();
};

//####app/elements/toolBar/toolBarBuilder.js
/**
 *
 * @constructor
 * @augments ContainerBuilder
 */
function ToolBarBuilder() {
    _.superClass(ToolBarBuilder, this);
}

window.InfinniUI.ToolBarBuilder = ToolBarBuilder;

_.inherit(ToolBarBuilder, ContainerBuilder);

_.extend(ToolBarBuilder.prototype, /** @lends ToolBarBuilder.prototype */{

    createElement: function (params) {
        return new ToolBar(params.parent);
    }

});

//####app/elements/treeView/treeView.js
/**
 * @param parent
 * @constructor
 */
function TreeView(parent) {
    _.superClass(TreeView, this, parent);
}

window.InfinniUI.TreeView = TreeView;

_.inherit(TreeView, ListEditorBase);

TreeView.prototype.createControl = function () {
    return new TreeViewControl();
};

/**
 *
 * @returns Function}
 */
TreeView.prototype.getKeySelector = function () {
    return this.control.get('keySelector');
};

/**
 *
 * @param {Function} value
 */
TreeView.prototype.setKeySelector = function (value) {
    this.control.set('keySelector', value);
};

/**
 *
 * @returns {Function}
 */
TreeView.prototype.getParentSelector = function () {
    return this.control.get('parentSelector');
};

/**
 *
 * @param {Function} value
 */
TreeView.prototype.setParentSelector = function (value) {
    this.control.set('parentSelector', value);
};

//####app/elements/treeView/treeViewBuilder.js
function TreeViewBuilder() {
    _.superClass(TreeViewBuilder, this);
}

window.InfinniUI.TreeViewBuilder = TreeViewBuilder;

_.inherit(TreeViewBuilder, ListEditorBaseBuilder);

_.extend(TreeViewBuilder.prototype, /** @lends TreeViewBuilder.prototype */{

    createElement: function (params) {
        return new TreeView(params.parent);
    },

    applyMetadata: function (params) {
        var data = ListEditorBaseBuilder.prototype.applyMetadata.call(this, params);

        this._initKeySelector(params);
        this._initParentSelector(params);
    },

    _initKeySelector: function (params) {
        var element = params.element;
        var metadata = params.metadata;
        var keySelector;

        if (metadata.KeySelector) {
            keySelector = function (context, args) {
                var scriptExecutor = new ScriptExecutor(element.getScriptsStorage());
                return scriptExecutor.executeScript(metadata.KeySelector.Name || metadata.KeySelector, args)
            }
        } else if (metadata.KeyProperty) {
            keySelector = function (context, args) {
                return InfinniUI.ObjectUtils.getPropertyValue(args.value, metadata.KeyProperty);
            }
        } else {
            keySelector = function (context, args) {
                return args.value;
            }
        }
        element.setKeySelector(keySelector);
    },

    _initParentSelector: function (params) {
        var element = params.element;
        var metadata = params.metadata;
        var parentSelector;

        if (metadata.ParentSelector) {
            parentSelector = function (context, args) {
                var scriptExecutor = new ScriptExecutor(element.getScriptsStorage());
                return scriptExecutor.executeScript(metadata.ParentSelector.Name || metadata.ParentSelector, args)
            }
        } else if (metadata.ParentProperty) {
            parentSelector = function (context, args) {
                return InfinniUI.ObjectUtils.getPropertyValue(args.value, metadata.ParentProperty);
            }
        } else {
            parentSelector = function (context, args) {
                return args.value;
            }
        }
        element.setParentSelector(parentSelector);
    }
});

//####app/elements/view/view.js
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
        onLoaded: $.Deferred(),
        onSelectedElementChange: null
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

window.InfinniUI.View = View;

_.inherit(View, Container);

_.extend(View.prototype,
    {

        isView: true,

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
        setCloseButtonVisibility: function (value) {
            if (typeof value === 'boolean') {
                this.control.set('closeButtonVisibility', value);
            }
        },

        /**
         * @description Возвращает флаг видимости кнопки закрытия
         * @returns {boolean}
         */
        getCloseButtonVisibility: function () {
            return this.control.get('closeButtonVisibility');
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
        },

        /**
         *
         * @param {string} value
         */
        setFocusOnControl: function (value) {
            this.control.set('focusOnControl', value);
        },

        /**
         *
         * @returns {string}
         */
        getFocusOnControl: function () {
            return this.control.get('focusOnControl');
        }

//devblockstart
        ,showSelectedElementMetadata: function(){
            if(this.handlers.onSelectedElementChange){
                this.handlers.onSelectedElementChange();
            }
        }

        ,onSelectedElementChange: function(handler) {
            this.handlers.onSelectedElementChange = handler;
        }
//devblockstop
    }
);

//####app/elements/view/viewBuilder.js
/**
 * @constructor
 * @augments ContainerBuilder
 */
function ViewBuilder() {
    _.superClass(ViewBuilder, this);
}

window.InfinniUI.ViewBuilder = ViewBuilder;

_.inherit(ViewBuilder, ContainerBuilder);

_.extend(ViewBuilder.prototype, {
    createElement: function (params) {
        return new View(params.parent);
    },

//devblockstart
    _getSelectedElementPath: function(metadata) {
        var result;

        if( _.isArray(metadata) ){
            for (var i = 0, ii =  metadata.length; i<ii; i++){
                result = this._getSelectedElementPath(metadata[i]);
                if(result !== false){
                    return '['+ i + ']' + result;
                }
            }
        } else if( _.isObject(metadata) ){
            if('isSelectedElement' in metadata) {
                delete metadata.isSelectedElement;
                return '';
            } else {
                for (var key in metadata){
                    result = this._getSelectedElementPath(metadata[key]);
                    if(result !== false){
                        return '.' + key + result;
                    }
                }
            }
        }

        return false;
    },
//devblockstop

    applyMetadata: function (params) {

        var parentView = params.parentView;

        // новые params, где parentView будет уже текущая вьюха
        params = _.extend({}, params);
        params.parentView = params.element;

        var that = this,
            metadata = params.metadata,
            element = params.element,
            builder = params.builder;

//devblockstart
        element.onSelectedElementChange(function() {
            var path = that._getSelectedElementPath(params.metadata);

            InfinniUI.JsonEditor.setMetadata(params.metadata).always(function () {
                InfinniUI.JsonEditor.setPath(path);
            });
        });
//devblockstop

        var scripts = element.getScripts();
        var parameters = element.getParameters();

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

        this.triggerStartCreatingEvent(params);

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

        if (metadata.DataSources && metadata.DataSources.length) {
            var dataSources = builder.buildMany(metadata.DataSources, {parentView: element, suspended: params.suspended});

            element.getDataSources()
                .set(dataSources);

            this.changeDataSourcesReadinessByPriority(dataSources);

            for(var i = 0, ii = dataSources.length; i < ii; i++){
                if(!dataSources[i].isLazy()){
                    dataSources[i].tryInitData();
                }
            }
        }else{
            element.noDataSourceOnView();
        }

        if( metadata.NotificationSubsriptions ) {
            var subscriptor = InfinniUI.global.notificationSubsription;
            for( var key in metadata.NotificationSubsriptions ) {
                (function() {
                    var script = metadata.NotificationSubsriptions[key];
                    subscriptor.subscribe(key, function(context, args) {
                        new ScriptExecutor(element).executeScript(script, {context: context, message: args.message});
                    }, this);
                })();
            }

            element.onClosing(function() {
                for( var key2 in metadata.NotificationSubsriptions ) {
                    subscriptor.unsubscribe(key2, this);
                }
            });
        }

        this.initBindingToProperty(params, 'CloseButtonVisibility', true);

        element.setHeaderTemplate(this.buildHeaderTemplate(element, params));

        if(metadata.OnOpening){
            element.onOpening(function() {
                return new ScriptExecutor(element).executeScript(metadata.OnOpening.Name || metadata.OnOpening);
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

        element.setFocusOnControl(metadata.FocusOnControl);
    },

    triggerStartCreatingEvent: function (params) {
        var
            element = params.element,
            metadata = params.metadata,
            onStartCreating = metadata.OnStartCreating;

        if (onStartCreating) {
            new ScriptExecutor(element).executeScript(onStartCreating.Name || onStartCreating, {});
        }
    },

    changeDataSourcesReadinessByPriority: function(dataSources) {
        var dataSourcesByPriority = _.groupBy(dataSources, function(ds) {return ds.getResolvePriority();});

        var updateTopPriorityDataSources = function(priorityGroups){
            if(_.keys(priorityGroups).length){
                var maxPriority = _.chain(priorityGroups).keys().max().value(),
                    topPriorityDataSources = priorityGroups[maxPriority],
                    topPriorityDataSourcesCount = topPriorityDataSources.length,
                    nonPriorityDataSourceGroups = _.omit(priorityGroups, maxPriority),
                    count = 0;

                _.each(topPriorityDataSources, function(ds){
                    ds.onItemsUpdatedOnce(function(context, args){
                        if(++count == topPriorityDataSourcesCount){
                            setTimeout( function() {
                                updateTopPriorityDataSources(nonPriorityDataSourceGroups)
                            }, 0);
                        }
                    });

                    ds.setIsWaiting(false);
                });
            }
        };

        if(_.keys(dataSourcesByPriority).length > 1) {
            _.each(dataSources, function(ds){
                ds.setIsWaiting(true);
            });

            updateTopPriorityDataSources(dataSourcesByPriority);
        }
    }
},
    viewBuilderHeaderTemplateMixin
);

//####app/elements/viewPanel/viewPanel.js
function ViewPanel(parent) {
    _.superClass(ViewPanel, this, parent);
}

window.InfinniUI.ViewPanel = ViewPanel;

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

//####app/elements/viewPanel/viewPanelBuilder.js
function ViewPanelBuilder() {}

window.InfinniUI.ViewPanelBuilder = ViewPanelBuilder;

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
}
);


InfinniUI.global.containers = {};

//####app/elements/dataGrid/dataGridRow/dataGridRow.js
function DataGridRow() {
    _.superClass(DataGridRow, this);

    this._transformRowProperties({
        rowBackground: 'background',
        rowForeground: 'foreground',
        rowTextStyle: 'textStyle',
        rowStyle: 'style'
    });
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

    getSelected: function () {
        this.control.get('selected');
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
    },

    /** RowBackground **/
    setRowBackground: function (value) {
        this.control.set('rowBackground', value);
    },

    getRowBackground: function () {
        return this.control.get('rowBackground');
    },

    /** RowForeground **/
    setRowForeground: function (value) {
        this.control.set('rowForeground', value);
    },

    getRowForeground: function () {
        return this.control.get('rowForeground');
    },

    /** RowTextStyle */
    setRowTextStyle: function (value) {
        this.control.set('rowTextStyle', value);
    },

    getRowTextStyle: function () {
        return this.control.get('rowTextStyle');
    },

    /** RowStyle */
    setRowStyle: function (value) {
        this.control.set('rowStyle', value);
    },

    getRowStyle: function () {
        return this.control.get('rowStyle');
    },

    setGrid: function (grid) {
        this.control.set('grid', grid);
    },

    _transformRowProperties: function (properties) {

        for(var name in properties) {
            if (!properties.hasOwnProperty(name)) {
                continue;
            }

            this.setProperty(properties[name], this.getProperty(name));

            this.onPropertyChanged(name, (function (row, prop) {
                return function (context, args) {
                    row.setProperty(prop, args.newValue);
                }
            })(this, properties[name]));
        }

    }

});


//####app/elements/tabPanel/tabPage/tabPage.js
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


//####app/elements/tabPanel/tabPage/tabPageBuilder.js
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

//####app/elements/tablePanel/cell/cell.js
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
//####app/elements/tablePanel/cell/cellBuilder.js
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

//####app/elements/tablePanel/row/row.js
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
//####app/elements/tablePanel/row/rowBuilder.js
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

//####app/actions/_base/baseAction/baseAction.js
function BaseAction(parentView){
    this.parentView = parentView;
    this._properties = Object.create(null);
    _.defaults(this._properties, this.defaults);
    this.initDefaultValues();
}

window.InfinniUI.BaseAction = BaseAction;

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

    },

    onExecutedHandler: function(args) {
        var onExecutedHandler = this.getProperty('onExecutedHandler');

        if(_.isFunction(onExecutedHandler)) {
            onExecutedHandler(args);
        }
    }

}, Backbone.Events);

InfinniUI.global.executeAction = function (context, executeActionMetadata, resultCallback) {
    var builder = new ApplicationBuilder();

    var action = builder.build( executeActionMetadata, {parentView: context.view});

    action.execute(resultCallback);
};

//####app/actions/_base/baseAction/baseActionBuilderMixin.js
var BaseActionBuilderMixin = {
    applyBaseActionMetadata: function(action, params) {
        var metadata = params.metadata;

        if('OnExecuted' in metadata) {
            action.setProperty('onExecutedHandler', function(args) {
                new ScriptExecutor(action.parentView).executeScript(metadata.OnExecuted.Name || metadata.OnExecuted, args);
            });
        }
    }
};
//####app/actions/_base/baseEditAction/baseEditAction.js
function BaseEditAction(parentView){
    _.superClass(BaseEditAction, this, parentView);
}

window.InfinniUI.BaseEditAction = BaseEditAction;

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

        var isSuccessfulPreset = this.setSelectedItem();

        if( isSuccessfulPreset ) {
            editView.open();

            editView.onClosed(function(){
                var dialogResult = editView.getDialogResult();

                if (dialogResult == DialogResult.accepted) {
                    that.handleClosingView();
                }
            });
        } else {
            editView.close();
        }
    },

    handleClosingView: function(){
        var callback = this.getProperty('callback');

        this.save();

        this.onExecutedHandler();

        if (_.isFunction(callback)) {
            callback();
        }
    },

    _isObjectDataSource: function( source ) {
        return 'setItems' in source;
    }
});

//####app/actions/_base/baseEditAction/baseEditActionBuilderMixin.js
var BaseEditActionBuilderMixin = {
    applyBaseEditActionMetadata: function(action, args) {
        var metadata = args.metadata,
            parentView = args.parentView,
            builder = args.builder;

        var suspended = {};
        suspended[metadata.SourceValue.Source] = 'BaseEditAction';

        var linkView = builder.build(metadata['LinkView'], {
            parent: args.parent,
            parentView: parentView,
            basePathOfProperty: args.basePathOfProperty,
            suspended: suspended
        });

        action.setProperty('linkView', linkView);
        action.setProperty('sourceSource', metadata.SourceValue.Source);
        action.setProperty('destinationSource', metadata.DestinationValue.Source);

        var destinationProperty = (args.basePathOfProperty != null) ?
            args.basePathOfProperty.resolveProperty( metadata.DestinationValue.Property ) :
            metadata.DestinationValue.Property;

        action.setProperty('destinationProperty', destinationProperty);
    }
};
//####app/actions/_base/baseFallibleAction/baseFallibleActionBuilderMixin.js
var BaseFallibleActionBuilderMixin = {
    applyBaseFallibleActionMetadata: function(action, params) {
        var metadata = params.metadata;

        if('OnSuccess' in metadata) {
            action.setProperty('onSuccessHandler', function(args) {
                new ScriptExecutor(action.parentView).executeScript(metadata.OnSuccess.Name || metadata.OnSuccess, args);
            });
        }

        if('OnError' in metadata) {
            action.setProperty('onErrorHandler', function(args) {
                new ScriptExecutor(action.parentView).executeScript(metadata.OnError.Name || metadata.OnError, args);
            });
        }
    }
};
//####app/actions/_base/baseFallibleAction/baseFallibleActionMixin.js
var BaseFallibleActionMixin = {
    onSuccessHandler: function(args) {
        var onSuccessHandler = this.getProperty('onSuccessHandler');

        if(_.isFunction(onSuccessHandler)) {
            onSuccessHandler(args);
        }
    },
    onErrorHandler: function(args) {
        var onErrorHandler = this.getProperty('onErrorHandler');

        if(_.isFunction(onErrorHandler)) {
            onErrorHandler(args);
        }
    }
};
//####app/actions/acceptAction/acceptAction.js
function AcceptAction(parentView){
    _.superClass(AcceptAction, this, parentView);
}

_.inherit(AcceptAction, BaseAction);


_.extend(AcceptAction.prototype, {
    execute: function(callback){
        var that = this;

        this.parentView.onClosed(function () {
            that.onExecutedHandler();

            if (callback) {
                callback();
            }
        });

        this.parentView.setDialogResult(DialogResult.accepted);
        this.parentView.close();
    }
});

window.InfinniUI.AcceptAction = AcceptAction;

//####app/actions/acceptAction/acceptActionBuilder.js
function AcceptActionBuilder() {
}

_.extend(AcceptActionBuilder.prototype,
    BaseActionBuilderMixin,
    {
        build: function (context, args) {
            var action = new AcceptAction(args.parentView);

            this.applyBaseActionMetadata(action, args);

            return action;
        }
    }
);

window.InfinniUI.AcceptActionBuilder = AcceptActionBuilder;

//####app/actions/addAction/addAction.js
function AddAction(parentView){
    _.superClass(AddAction, this, parentView);
}

_.inherit(AddAction, BaseEditAction);


_.extend(AddAction.prototype, {
    setSelectedItem: function(){
        var editDataSource = this.getProperty('editDataSource'),
            editView = editDataSource.getView();

        editView.onBeforeLoaded(function() {
            editDataSource.createItem();
        });

        return true;
    },

    save: function(){
        var editDataSource = this.getProperty('editDataSource'),
            destinationDataSource = this.getProperty('destinationDataSource'),
            destinationProperty = this.getProperty('destinationProperty')  || "";

        if( this._isObjectDataSource(editDataSource) ) {
            var items = destinationDataSource.getProperty(destinationProperty) || [],
                newItem = editDataSource.getSelectedItem();

            items = _.clone(items);
            items.push(newItem);

            destinationDataSource.setProperty(destinationProperty, items);
        } else {
            destinationDataSource.updateItems();
        }
    }
});

window.InfinniUI.AddAction = AddAction;

//####app/actions/addAction/addActionBuilder.js
function AddActionBuilder(){}

_.extend(AddActionBuilder.prototype,
    BaseActionBuilderMixin,
    BaseEditActionBuilderMixin,
    {
        build: function(context, args){
            var action = new AddAction(args.parentView);

            this.applyBaseActionMetadata(action, args);
            this.applyBaseEditActionMetadata(action, args);

            return action;
        }
    }
);

window.InfinniUI.AddActionBuilder = AddActionBuilder;

//####app/actions/cancelAction/cancelAction.js
function CancelAction(parentView){
    _.superClass(CancelAction, this, parentView);
}

_.inherit(CancelAction, BaseAction);


_.extend(CancelAction.prototype, {
    execute: function(callback){
        var that = this;

        this.parentView.onClosed(function () {
            that.onExecutedHandler();

            if (callback) {
                callback();
            }
        });

        this.parentView.setDialogResult(DialogResult.canceled);
        this.parentView.close();
    }
});

window.InfinniUI.CancelAction = CancelAction;

//####app/actions/cancelAction/cancelActionBuilder.js
function CancelActionBuilder() {}

_.extend(CancelActionBuilder.prototype,
    BaseActionBuilderMixin,
    {
        build: function (context, args) {
            var action = new CancelAction(args.parentView);

            this.applyBaseActionMetadata(action, args);

            return action;
        }
    }
);

window.InfinniUI.CancelActionBuilder = CancelActionBuilder;

//####app/actions/deleteAction/deleteAction.js
function DeleteAction(parentView){
    _.superClass(DeleteAction, this, parentView);
}

_.inherit(DeleteAction, BaseAction);


_.extend(DeleteAction.prototype,
    BaseFallibleActionMixin,
    {
        execute: function(callback){
            var accept = this.getProperty('accept'),
                that = this,
                dataSource = this.getProperty('destinationSource'),
                property = this.getProperty('destinationProperty');

            if( dataSource.getProperty(property) ) {
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
            } else {
                new MessageBox({
                    text: 'Вы не выбрали элемент который необходимо удалить',
                    buttons: [
                        {
                            name: 'Закрыть'
                        }
                    ]
                });
            }
        },

        remove: function (callback) {
            var dataSource = this.getProperty('destinationSource'),
                property = this.getProperty('destinationProperty');

            if( this._isDocument(property) ) {
                this._deleteDocument(dataSource, property, callback);
            } else {
                this._deleteItem(dataSource, property, callback);
            }
        },

        _deleteDocument: function(dataSource, property, callback){
            var that = this,
                onSuccessDelete = function (context, args) {
                    dataSource.updateItems();

                    that.onExecutedHandler(args);
                    that.onSuccessHandler(args);

                    if (_.isFunction(callback)) {
                        callback();
                    }
                },
                onErrorDelete = function(context, args){
                    that.onExecutedHandler(args);
                    that.onErrorHandler(args);

                    if (_.isFunction(callback)) {
                        callback();
                    }
                };

            var selectedItem = dataSource.getProperty(property);
            dataSource.deleteItem(selectedItem, onSuccessDelete, onErrorDelete);
        },

        _deleteItem: function(dataSource, property, callback){
            var propertyPathList = property.split("."),
                index = propertyPathList.pop(),
                parentProperty = propertyPathList.join("."),
                items = dataSource.getProperty(parentProperty);

            items = _.clone( items );
            items.splice(index, 1);
            dataSource.setProperty(parentProperty, items);

            this.onExecutedHandler();
            this.onSuccessHandler();

            if (_.isFunction(callback)) {
                callback();
            }
        },

        _isDocument: function(propertyName){
            return propertyName == '$' || _.isFinite(propertyName);
        }
    }
);

window.InfinniUI.DeleteAction = DeleteAction;

//####app/actions/deleteAction/deleteActionBuilder.js
function DeleteActionBuilder(){}

_.extend(DeleteActionBuilder.prototype,
    BaseActionBuilderMixin,
    BaseFallibleActionBuilderMixin,
    {
        build: function(context, args){
            var metadata = args.metadata,
                parentView = args.parentView,
                sourceName = metadata.DestinationValue.Source,
                propertyName = metadata.DestinationValue.Property || '$';

            var action = new DeleteAction(parentView);

            this.applyBaseActionMetadata(action, args);
            this.applyBaseFallibleActionMetadata(action, args);

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
);

window.InfinniUI.DeleteActionBuilder = DeleteActionBuilder;

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

        if( selectedItem == null ){

            // if selectedItem is empty and it is must be document
            // return error
            if( this._isDocumentPath(destinationProperty) ){
                var logger = window.InfinniUI.global.logger;
                var message = stringUtils.format('EditAction: edit item has not been found. {0} does not have item by path "{1}"', [destinationDataSource.getName(), destinationProperty]);
                logger.error(message);

                return false;
            }

            // but if selectedItem is property of document
            // it will be created
            selectedItem = selectedItem || {};
        }

        if( this._isObjectDataSource(editDataSource) ) {
            this._setItem(editDataSource, selectedItem);
        } else {
            this._setDocument(editDataSource, selectedItem);
        }

        return true;
    },

    _resumeUpdateEditDataSource: function () {
        var editDataSource = this.getProperty('editDataSource');
        editDataSource.resumeUpdate('BaseEditAction');
    },

    _setDocument: function (editDataSource, selectedItem){
        var selectedItemId = editDataSource.idOfItem( selectedItem );
        editDataSource.setIdFilter(selectedItemId);
        editDataSource.tryInitData();
        this._resumeUpdateEditDataSource();
    },

    _setItem: function(editDataSource, selectedItem){
        var item = _.clone( selectedItem );

        if(item === undefined || item === null){
            item = {};
        }
        this._resumeUpdateEditDataSource();
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
    },

    _isDocumentPath: function(path){
        return !path.includes('.');
    }
});

window.InfinniUI.EditAction = EditAction;

//####app/actions/editAction/editActionBuilder.js
function EditActionBuilder(){}

_.extend(EditActionBuilder.prototype,
    BaseActionBuilderMixin,
    BaseEditActionBuilderMixin,
    {
        build: function(context, args){
            var action = new EditAction(args.parentView);

            this.applyBaseActionMetadata(action, args);
            this.applyBaseEditActionMetadata(action, args);

            return action;
        }
    }
);

window.InfinniUI.EditActionBuilder = EditActionBuilder;

//####app/actions/openAction/openAction.js
function OpenAction(parentView){
    _.superClass(OpenAction, this, parentView);
}

_.inherit(OpenAction, BaseAction);


_.extend(OpenAction.prototype, {
    execute: function(callback){
        var linkView = this.getProperty('linkView'),
            that = this;

        linkView.createView(function (view) {

            view.onLoaded(function () {
                that.onExecutedHandler();

                if (callback) {
                    callback(view);
                }
            });

            view.open();
        });
    }
});

window.InfinniUI.OpenAction = OpenAction;

//####app/actions/openAction/openActionBuilder.js
function OpenActionBuilder(){
}


_.extend(OpenActionBuilder.prototype,
    BaseActionBuilderMixin,
    {
        build: function(context, args){
            var action = new OpenAction(args.parentView);

            this.applyBaseActionMetadata(action, args);

            var linkView = args.builder.build(args.metadata.LinkView, {parent: args.parent, parentView: args.parentView, basePathOfProperty: args.basePathOfProperty});
            action.setProperty('linkView', linkView);

            return action;
        }
    }
);

window.InfinniUI.OpenActionBuilder = OpenActionBuilder;

//####app/actions/routeToAction/routeToAction.js
function RouteToAction(){
    _.superClass(RouteToAction, this);
    this.href = '';
}

_.inherit(RouteToAction, BaseAction);


_.extend(RouteToAction.prototype, {

    execute: function(callback){
        var router = InfinniUI.AppRouter,
            href = this.getHref();

        router.navigate(href, {trigger: true});
    },

    getHref: function() {
        return this.href;
    },

    setHref: function(href) {
        this.href = href;
    }

});

window.InfinniUI.RouteToAction = RouteToAction;

//####app/actions/routeToAction/routeToActionBuilder.js
function RouteToActionBuilder() {}

_.extend(RouteToActionBuilder.prototype, BaseActionBuilderMixin, routerServiceMixin, {

	build: function (context, args) {
		var action = new RouteToAction(),
				newHref = routerService.getLinkByName(args.metadata.Name, 'no'),
				hrefParams = args.metadata.Params,
				query = args.metadata.Query;

		action.setHref(newHref);
		args.element = action;

		if( hrefParams ) {
			for( var i = 0, ii = hrefParams.length; i < ii; i += 1 ) {
				if( typeof hrefParams[i].Value === 'string' ) {
					if( action.getHref() !== newHref ) {
						newHref = action.getHref();
					}
					newHref = this.replaceParamsInHref(newHref, hrefParams[i].Name, hrefParams[i].Value);
					action.setHref(newHref);
				} else {
					this.bindParams(args, hrefParams[i].Name, hrefParams[i].Value, newHref);
				}
			}
		}

		if( query ) {
			for( var i = 0, ii = query.length; i < ii; i += 1 ) {
				if( typeof query[i].Value === 'string' ) {
					if( action.getHref() !== newHref ) {
						newHref = action.getHref();
					}
					newHref = this.replaceParamsInQuery(newHref, query[i].Name, query[i].Value);
					action.setHref(newHref);
				} else {
					this.bindQuery(args, query[i].Name, query[i].Value, newHref);
				}
			}
		}
		return action;
	}

});

window.InfinniUI.RouteToActionBuilder = RouteToActionBuilder;

//####app/actions/saveAction/saveAction.js
function SaveAction(parentView){
    _.superClass(SaveAction, this, parentView);
}

_.inherit(SaveAction, BaseAction);


_.extend(SaveAction.prototype,
    BaseFallibleActionMixin,
    {
        execute: function(callback){
            var parentView = this.parentView,
                dataSource = this.getProperty('dataSource'),
                canClose = this.getProperty('canClose'),
                that = this;

            var onSuccessSave = function(context, args){
                    if(canClose !== false){
                        parentView.setDialogResult(DialogResult.accepted);
                        parentView.close();
                    }

                    that.onExecutedHandler(args);
                    that.onSuccessHandler(args);

                    if(_.isFunction(callback)){
                        callback(context, args);
                    }
                },
                onErrorSave = function(context, args){
                    that.onExecutedHandler(args);
                    that.onErrorHandler(args);

                    if (_.isFunction(callback)) {
                        callback(context, args);
                    }
                };

            var selectedItem = dataSource.getSelectedItem();
            dataSource.saveItem(selectedItem, onSuccessSave, onErrorSave);
        }
    }
);

window.InfinniUI.SaveAction = SaveAction;

//####app/actions/saveAction/saveActionBuilder.js
function SaveActionBuilder() {}

_.extend(SaveActionBuilder.prototype,
    BaseActionBuilderMixin,
    BaseFallibleActionBuilderMixin,
    {
        build: function (context, args) {
            var parentView = args.parentView;
            var dataSource = parentView.getContext().dataSources[args.metadata.DestinationValue.Source];

            var action = new SaveAction(parentView);

            this.applyBaseActionMetadata(action, args);
            this.applyBaseFallibleActionMetadata(action, args);

            action.setProperty('dataSource', dataSource);
            action.setProperty('canClose', args.metadata.CanClose);

            return action;
        }
    }
);

window.InfinniUI.SaveActionBuilder = SaveActionBuilder;

//####app/actions/selectAction/selectAction.js
function SelectAction(parentView){
    _.superClass(SelectAction, this, parentView);
}

_.inherit(SelectAction, BaseAction);


_.extend(SelectAction.prototype, {
    execute: function(callback){
        var parentView = this.parentView,
            linkView = this.getProperty('linkView'),
            that = this;

        var srcDataSourceName = this.getProperty('sourceSource'),
            srcPropertyName = this.getProperty('sourceProperty');

        var dstDataSourceName = this.getProperty('destinationSource'),
            dstPropertyName = this.getProperty('destinationProperty');

        linkView.createView(function(createdView){

            createdView.onClosed(function (context, args) {
                var dialogResult = createdView.getDialogResult();

                if (dialogResult == DialogResult.accepted) {
                    var srcDataSource = createdView.getContext().dataSources[srcDataSourceName];
                    var dstDataSource = parentView.getContext().dataSources[dstDataSourceName];

                    var value = srcDataSource.getProperty(srcPropertyName);
                    dstDataSource.setProperty(dstPropertyName, value);
                }

                that.onExecutedHandler(args);

                if (callback) {
                    callback(context, args);
                }
            });

            createdView.open();
        });
    }
});

window.InfinniUI.SelectAction = SelectAction;

//####app/actions/selectAction/selectActionBuilder.js
function SelectActionBuilder() {}

_.extend(SelectActionBuilder.prototype,
    BaseActionBuilderMixin,
    {
        build: function (context, args) {
            var builder = args.builder,
                metadata = args.metadata,
                parentView = args.parentView;

            var action = new SelectAction(parentView);

            this.applyBaseActionMetadata(action, args);

            var linkView = builder.build(metadata['LinkView'], {parentView: parentView});

            action.setProperty('linkView', linkView);
            action.setProperty('sourceSource', metadata.SourceValue.Source);
            action.setProperty('sourceProperty', metadata.SourceValue.Property);
            action.setProperty('destinationSource', metadata.DestinationValue.Source);
            action.setProperty('destinationProperty', metadata.DestinationValue.Property);

            return action;
        }
    }
);

window.InfinniUI.SelectActionBuilder = SelectActionBuilder;

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

window.InfinniUI.DownloadExecutor = DownloadExecutor;

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

    this.provider = window.InfinniUI.providerRegister.build('ServerActionProvider');

    this.updateContentTypeStrategy();
    this.on('change:contentType', this.updateContentTypeStrategy);
}

_.inherit(ServerAction, BaseAction);

_.extend(ServerAction.prototype,
    BaseFallibleActionMixin,
    {
        defaults: {
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            method: 'GET',
            data: {}
        },

        updateContentTypeStrategy: function () {
            var contentType = this.getProperty('contentType');

            if( _.isString(contentType) && contentType.includes('multipart') ){
                this.contentTypeStrategy = serverActionContentTypeStrategy['File'];
            } else {
                this.contentTypeStrategy = serverActionContentTypeStrategy['Object'];
            }
        },

        execute: function (callback) {
            var that = this,
                onExecuted = function(args){
                    that.onExecutedHandler(args);

                    if (_.isFunction(callback)) {
                        callback(args);
                    }
                },
                onSuccess = function(args) {
                    that.onSuccessHandler(args);
                },
                onError = function(args) {
                    that.onErrorHandler(args);
                };

            this.contentTypeStrategy.run(this.provider, this._getRequestData(), onExecuted, onSuccess, onError);
        },

        setParam: function(name, value) {
            this.setProperty('params.' + name, value);
        },

        getParam: function(name) {
            return this.getProperty('params.' + name);
        },

        _getRequestData: function () {
            var origin = this._replaceParamsInStr( this.getProperty('origin') );
            var path = this._replaceParamsInStr( this.getProperty('path') );
            var method = this.getProperty('method').toUpperCase();
            var contentType = this.getProperty('contentType');
            var data = this._replaceParamsInObject( this.getProperty('data') );

            var result = {};
            result.requestUrl = origin + path;
            result.method = method;
            result.contentType = contentType;

            if( !_.isEmpty(data) ){
                if( method == 'GET') {
                    result.requestUrl = result.requestUrl + '?' + stringUtils.joinDataForQuery(data);
                } else {
                    result.args = ( _.isString(contentType) && contentType.includes('application/json')) ? JSON.stringify(data) : data;
                }
            }

            return result;
        },

        _replaceParamsInStr: function(str){
            if(!str){
                return str;
            }

            var that = this;

            return str.replace(/<%([\s\S]+?)%>/g, function(p1, p2){
                return that.getParam(p2);
            });
        },

        _replaceParamsInObject: function(obj){
            if(_.isEmpty(obj) ){
                return obj;
            }

            var str = JSON.stringify(obj);
            var replacedStr = this._replaceParamsInStr(str);
            return JSON.parse(replacedStr);
        }
    }
);

window.InfinniUI.ServerAction = ServerAction;

//####app/actions/serverAction/serverActionBuilder.js
function ServerActionBuilder() {}

_.extend(ServerActionBuilder.prototype,
    BaseActionBuilderMixin,
    BaseFallibleActionBuilderMixin,
    {
        build: function (context, args) {
            var builder = args.builder,
                metadata = args.metadata,
                parentView = args.parentView;

            var action = new ServerAction(parentView);

            this.applyBaseActionMetadata(action, args);
            this.applyBaseFallibleActionMetadata(action, args);

            action.setProperty('origin', metadata.Origin);
            action.setProperty('path', metadata.Path);

            if (metadata.Data) {
                action.setProperty('data', metadata.Data);
            }

            if (metadata.Method) {
                action.setProperty('method', metadata.Method);
            }

            if (metadata.ContentType || metadata.ContentType === false) {
                action.setProperty('contentType', metadata.ContentType);
            }

            if(metadata.Params){
                for(var name in metadata.Params) {

                    var value = metadata.Params[name];

                    if (typeof value != 'object') {
                        if (value !== undefined) {
                            action.setParam(name, value);
                        }
                    } else {
                        this._initBinding(name, value, action, parentView, builder);
                    }
                }
            }

            return action;
        },

        _initBinding: function (paramName, paramValue, action, parentView, builder) {
            var args = {
                parent: parentView,
                parentView: parentView
            };

            var dataBinding = builder.buildBinding(paramValue, args);

            dataBinding.setMode(InfinniUI.BindingModes.toElement);

            dataBinding.bindElement({
                setProperty: function (name, value) {
                    action.setParam(name, value);
                },

                onPropertyChanged: function () {
                }

            }, paramName);
        }
    }
);

window.InfinniUI.ServerActionBuilder = ServerActionBuilder;

//####app/actions/serverAction/serverActionContentTypeStrategy.js
var serverActionContentTypeStrategy = {
    "File": {
        run: function (provider, params, callback, onSuccess, onError) {
            provider.download(params, callback, onSuccess, onError);
        }
    },
    "Object": {
        run: function (provider, params, callback, onSuccess, onError) {
            provider.request(params, callback, onSuccess, onError);
        }
    }
};
//####app/actions/updateAction/updateAction.js
function UpdateAction(parentView){
    _.superClass(UpdateAction, this, parentView);
}

_.inherit(UpdateAction, BaseAction);

_.extend(UpdateAction.prototype,
    BaseFallibleActionMixin,
    {
        execute: function(callback){

            var dataSource = this.getProperty('dataSource');

            var that = this,
                onSuccessUpdate = function (context, args) {
                    that.onExecutedHandler(args);
                    that.onSuccessHandler(args);

                    if (_.isFunction(callback)) {
                        callback(context, args);
                    }
                },
                onErrorUpdate = function (context, args) {
                    that.onExecutedHandler(args);
                    that.onErrorHandler(args);

                    if (_.isFunction(callback)) {
                        callback(context, args);
                    }
                };

            dataSource.updateItems(onSuccessUpdate, onErrorUpdate);
        }
    }
);

window.InfinniUI.UpdateAction = UpdateAction;

//####app/actions/updateAction/updateActionBuilder.js
function UpdateActionBuilder() {}

_.extend(UpdateActionBuilder.prototype,
    BaseActionBuilderMixin,
    BaseFallibleActionBuilderMixin,
    {
        build: function (context, args) {

            var dataSource = args.parentView.getContext().dataSources[args.metadata.DestinationValue.Source];

            var action = new UpdateAction(args.parentView);

            this.applyBaseActionMetadata(action, args);
            this.applyBaseFallibleActionMetadata(action, args);

            action.setProperty('dataSource', dataSource);

            return action;
        }
    }
);

window.InfinniUI.UpdateActionBuilder = UpdateActionBuilder;

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
        builder.register('AutoView', new MetadataViewBuilder());

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
        builder.register('IndeterminateCheckBox', new IndeterminateCheckBoxBuilder());
        builder.register('ImageBox', new ImageBoxBuilder());
        builder.register('FileBox', new FileBoxBuilder());
        builder.register('Label', new LabelBuilder());
        builder.register('Link', new LinkBuilder());
        builder.register('Form', new FormBuilder());
        builder.register('Icon', new IconBuilder());
        builder.register('DateTimePicker', new DateTimePickerBuilder());
        builder.register('DatePicker', new DatePickerBuilder());
        builder.register('TimePicker', new TimePickerBuilder());
        builder.register('ToggleButton', new ToggleButtonBuilder());
        builder.register('NumericBox', new NumericBoxBuilder());
        builder.register('Button', new ButtonBuilder());
        builder.register('ToolBar', new ToolBarBuilder());
        builder.register('ToolBarButton', new ButtonBuilder());
        builder.register('ComboBox', new ComboBoxBuilder());
        builder.register('RadioGroup', new RadioGroupBuilder());
        builder.register('ExtensionPanel', new ExtensionPanelBuilder());
        builder.register('PopupButton', new PopupButtonBuilder());
        builder.register('DataNavigation', new DataNavigationBuilder());
        builder.register('TreeView', new TreeViewBuilder());
        builder.register('Frame', new FrameBuilder());
        builder.register('ButtonEdit', new ButtonEditBuilder());


        builder.register('RestDataSource', new RestDataSourceBuilder());
        builder.register('DocumentDataSource', new DocumentDataSourceBuilder());
        builder.register('PropertyBinding', new DataBindingBuilder());
        builder.register('ObjectDataSource', new ObjectDataSourceBuilder());
        builder.register('Parameter', new ParameterBuilder());


        builder.register('AcceptAction', new AcceptActionBuilder());
        builder.register('AddAction', new AddActionBuilder());
        builder.register('CancelAction', new CancelActionBuilder());
        builder.register('DeleteAction', new DeleteActionBuilder());
        builder.register('EditAction', new EditActionBuilder());
        builder.register('OpenAction', new OpenActionBuilder());
        builder.register('SaveAction', new SaveActionBuilder());
        builder.register('SelectAction', new SelectActionBuilder());
        builder.register('UpdateAction', new UpdateActionBuilder());
        builder.register('ServerAction', new ServerActionBuilder());

        builder.register('RouteToAction', new RouteToActionBuilder());


        builder.register('BooleanFormat', new BooleanFormatBuilder());
        builder.register('DateTimeFormat', new DateTimeFormatBuilder());
        builder.register('NumberFormat', new NumberFormatBuilder());
        builder.register('ObjectFormat', new ObjectFormatBuilder());

        builder.register('DateTimeEditMask', new DateTimeEditMaskBuilder());
        builder.register('NumberEditMask', new NumberEditMaskBuilder());
        builder.register('TemplateEditMask', new TemplateEditMaskBuilder());
        builder.register('RegexEditMask', new RegexEditMaskBuilder());

        builder.register('Script', new ScriptBuilder());

        builder.register('Divider', new DividerBuilder());
        builder.register('ContextMenu', new ContextMenuBuilder());


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

window.InfinniUI.ApplicationBuilder = ApplicationBuilder;

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

window.InfinniUI.Builder = Builder;

//####app/data/dataBinding/dataBinding.js
InfinniUI.BindingModes = {
    twoWay: 'TwoWay',
    toSource: 'ToSource',
    toElement: 'ToElement'
};


var DataBinding = Backbone.Model.extend({
    defaults: {
        mode: InfinniUI.BindingModes.twoWay,
        converter: null,
        source: null,
        sourceProperty: null,
        element: null,
        elementProperty: null,
        defaultValue: null
    },

    getDefaultValue: function(){
        return this.get('defaultValue');
    },

    setDefaultValue: function(value){
        this.set('defaultValue', value);
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
            var message = stringUtils.format('DataBinding. bindSource: повторная инициализация. {0} заменен на {1}', [this.get('source').getName(), source.getName()]);
            logger.warn(message);
        }

        this.set('source', source);
        this.set('sourceProperty', property);

        var that = this;

        if(element){
            this._initPropertyOnElement();
        }

        source.onPropertyChanged(property, function(context, argument){
            that._onSourcePropertyChangedHandler(context, argument);
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
                that._onSourcePropertyChangedHandler(context, args);
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

        element.onPropertyChanged(property, function(context, argument){
            that._onElementPropertyChangedHandler(context, argument);
        });

        this._initPropertyOnElement();
    },

    _initPropertyOnElement: function(){
        var sourceProperty = this.get('sourceProperty');
        var source = this.get('source');
        var value;

        if(this._shouldRefreshElement() && source){
            if(typeof source.isDataReady == 'function' && !source.isDataReady()){
                if(typeof source.tryInitData == 'function'){
                    if(this.getDefaultValue() !== null){
                        this._setValueToElement(this.getDefaultValue(), true);
                    }
                    source.tryInitData();
                }
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
    _onElementPropertyChangedHandler: function (context, argument) {
        if(this._shouldRefreshSource()){
            this._setValueToSource(argument.newValue, context);
        }
    },

    _setValueToSource: function(value, context){
        var element = this.get('element');
        var source = this.get('source');
        var sourceProperty = this.get('sourceProperty');
        var converter = this.get('converter');

        if(converter != null
            && converter.hasOwnProperty('toSource') //Mozilla's Object.prototype has method "toSource"!!
        ){
            value = converter.toSource(context, {value: value, binding: this, source: element});
        }

        source.setProperty(sourceProperty, value);
    },



    /**
     * @description Обработчик события изменения значения источника
     */
    _onSourcePropertyChangedHandler: function (context, argument) {
        if(this._shouldRefreshElement()){
            this._setValueToElement(argument.newValue);
        }
    },

    _setValueToElement: function(value, notConverting){
        var source = this.get('source');
        var element = this.get('element');
        var elementProperty = this.get('elementProperty');
        var converter = this.get('converter');
        var context = this._getContext();

        if(converter != null && converter.toElement != null && !notConverting){
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

    _shouldRefreshSource: function(){
        var mode = this.get('mode');
        return mode == InfinniUI.BindingModes.twoWay || mode == InfinniUI.BindingModes.toSource;
    },

    _shouldRefreshElement: function(){
        var mode = this.get('mode');
        return mode == InfinniUI.BindingModes.twoWay || mode == InfinniUI.BindingModes.toElement;
    }
});

window.InfinniUI.DataBinding = DataBinding;

//####app/data/dataBinding/dataBindingBuilder.js
var DataBindingBuilder = function () {};

window.InfinniUI.DataBindingBuilder = DataBindingBuilder;

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

    if('DefaultValue' in metadata){
        result.setDefaultValue(metadata['DefaultValue']);
    }

    var sourceDeferred = args.parentView.getDeferredOfMember(metadata.Source);
    sourceDeferred.done(function(source){
        var metadataProperty = typeof metadata.Property === 'undefined' || metadata.Property === null ? "" : metadata.Property;

        if(args.basePathOfProperty){
            property = args.basePathOfProperty.resolveProperty(metadataProperty);
        }else{
            property = metadataProperty;
        }

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

        result.bindSource(source, property);
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

//####app/data/dataProviders/REST/metadataProviderREST.js
function MetadataProviderREST(metadataUrlConstructor, successCallback, failCallback) {

    this.getMetadata = function (resultCallback) {
        var data = metadataUrlConstructor.constructMetadataRequest();
        new RequestExecutor(resultCallback,successCallback,failCallback, this.cache).makeRequest(data);
    };
}

window.InfinniUI.Providers.MetadataProviderREST = MetadataProviderREST;
//####app/data/dataProviders/REST/queryConstructorMetadata.js
function QueryConstructorMetadata(host, metadata) {

    this.constructMetadataRequest = function () {
        return {
            "requestUrl": host + '/' + metadata.Path,
            "method": "GET"
        };
    };
}

window.InfinniUI.Providers.QueryConstructorMetadata = QueryConstructorMetadata;
//####app/data/dataProviders/REST/requestExecutor.js
var RequestExecutorDataStrategy = function (type) {
    if (typeof this.strategies[type] === 'undefined') {
        this.strategy = this.strategies.json
    } else {
        this.strategy = this.strategies[type];
    }
};

window.InfinniUI.RequestExecutorDataStrategy = RequestExecutorDataStrategy;

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
            error: function (err) {
                if (err.status === 200) {
                    //@TODO Убрать этот костыль. Нужен т.к. запрос на загрузку файла возвращает 200 и пустой ответ!
                    this.onSuccessRequest(onSuccess)();
                } else {
                    this.onErrorRequest(onFail)(err);
                }
            }.bind(this),
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
            error: function (err) {
                if (err.status === 200) {
                    //@TODO Убрать этот костыль. Нужен т.к. запрос на загрузку файла возвращает 200 и пустой ответ!
                    this.onSuccessRequest(onSuccess)();
                } else {
                    this.onErrorRequest(onFail)(err);
                }
            }.bind(this),
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


window.InfinniUI.providerRegister = new DataProviderRegister();

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

window.InfinniUI.Providers.DocumentFileProvider = DocumentFileProvider;

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
 * @constructor
 */
var DocumentUploadQueryConstructor = function (host) {
    this.host = host;
};

window.InfinniUI.DocumentUploadQueryConstructor = DocumentUploadQueryConstructor;

/**
 * @public
 * @description Возвращает ссылку на загруженный ранее файл
 * @param fieldName
 * @param instanceId
 * @param contentId
 * @returns {String}
 */
DocumentUploadQueryConstructor.prototype.getFileUrl = function (fieldName, instanceId, contentId) {
    return stringUtils.format('{0}/blob/{1}', [this.host, contentId]);
};


//####app/data/dataProviders/objectDataProvider.js
var ObjectDataProvider = function (items, idProperty) {
    this.items = items || [];
    this.idProperty = idProperty || '_id';
};

_.extend(ObjectDataProvider.prototype, {

    setItems: function (items) {
        this.items = items;
    },

    getItems: function (resultCallback, criteriaList, pageNumber, pageSize, sorting) {
        //var filter = new FilterCriteriaType();
        //var callback = filter.getFilterCallback(criteriaList);
        resultCallback({data: this.items.slice()});
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
            "Property": "_id",
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

window.InfinniUI.Providers.ObjectDataProvider = ObjectDataProvider;
//####app/data/dataProviders/restDataProvider.js
var RestDataProvider = function(){

    this.requestParams = {
        'get': {
            method: 'get',
            origin: null, // http://abs.com
            path: '',
            data: {}
        },

        'set':{
            method: 'post',
            origin: null,
            path: '',
            data: {}
        },

        'delete':{
            method: 'delete',
            origin: null,
            path: '',
            data: {}
        }
    };

};

_.extend(RestDataProvider.prototype, {

    getOrigin: function(type){
        return this.requestParams[type].origin;
    },

    setOrigin: function(type, newOrigin){
        this.requestParams[type].origin = newOrigin;
    },

    getPath: function(type){
        return this.requestParams[type].path;
    },

    setPath: function(type, path){
        this.requestParams[type].path = path;
    },

    getData: function(type){
        return this.requestParams[type].data;
    },

    setData: function(type, data){
        this.requestParams[type].data = data;
    },

    getMethod: function(type){
        return this.requestParams[type].method;
    },

    setMethod: function(type, queryMethod){
        this.requestParams[type].method = queryMethod;
    },

    send: function(type, successHandler, errorHandler){
        var params = this.requestParams[type];

        var urlString = params.origin + params.path;
        var queryString;
        var requestId = Math.round((Math.random() * 100000));
        var requestParams;

        var filesInData = this.extractFilesFromData(params.data);

        if( _.size(filesInData.files) == 0){

            requestParams = {
                type: params.method,
                xhrFields: {
                    withCredentials: true
                },
                url: urlString,
                success: function(data){
                    successHandler({
                        requestId: requestId,
                        data: data
                    });
                },
                error: function(data){
                    if (typeof errorHandler !== 'function') {
                        //Unhandled error
                        InfinniUI.global.logger.error(data);
                        return;
                    }
                    errorHandler({
                        requestId: requestId,
                        data: data
                    });
                }
            };

            if(params.method.toLowerCase() != 'get'){
                requestParams.contentType = 'application/json';
                requestParams.data = JSON.stringify( params.data );
            }else{
                if(_.size(params.data) > 0){
                    requestParams.url = requestParams.url + '?' + stringUtils.joinDataForQuery(params.data);
                }
            }

        }else{

            var formData = new FormData();
            formData.append('document', JSON.stringify( filesInData.dataWithoutFiles ));

            for(var k in filesInData.files){
                formData.append(k, filesInData.files[k]);
            }


            requestParams = {
                type: params.method,
                url: urlString,
                xhrFields: {
                    withCredentials: true
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data){
                    successHandler({
                        requestId: requestId,
                        data: data
                    });
                },
                error: function(data){
                    errorHandler({
                        requestId: requestId,
                        data: data
                    });
                }
            };
        }

        $.ajax(requestParams);

        return requestId;
    },

    getItems: function(successHandler, errorHandler){
        return this.send('get', successHandler, errorHandler);
    },

    saveItem: function(item, successHandler, errorHandler){
        this.requestParams['set'].data = item;
        return this.send('set', successHandler, errorHandler);
    },

    deleteItem: function(item, successHandler, errorHandler){
        return this.send('delete', successHandler, errorHandler);
    },

    createItem: function (resultCallback, idProperty) {
       var that = this;
        setTimeout( function(){
            resultCallback(that.createLocalItem(idProperty));
        }, 10);
    },

    createLocalItem: function (idProperty) {
        var result = {};

        result[idProperty] = this._generateLocalId();

        return result;
    },

    _generateLocalId: function(){
        return guid();
    },

    extractFilesFromData: function (data) {

        var files = Object.create(null);
        var dataWithoutFiles = extractFilesFromNode(data, []);


        return {
            dataWithoutFiles: dataWithoutFiles,
            files: files
        };

        function extractFilesFromNode (node, path) {
            var value, result = Array.isArray(node) ? [] : {}, currentPath;
            for (var i in node) {
                if (!node.hasOwnProperty(i)) {
                    continue;
                }

                currentPath = path.slice();
                currentPath.push(i);
                value = node[i];
                if (value !== null && typeof (value) === 'object') {
                    if (value.constructor === Date) {
                        result[i] = value
                    } else if (value.constructor === Object || value.constructor === Array)  {
                        //Plain object
                        result[i] = extractFilesFromNode(value, currentPath);
                    } else {
                        //Object instance
                        result[i] = null;
                        files[currentPath.join('.')] = value;
                        continue;
                    }
                } else {
                    result[i] = value;
                }

            }

            return result;
        }
    }


});

window.InfinniUI.Providers.RestDataProvider = RestDataProvider;
//####app/data/dataProviders/serverAction/serverActionProvider.js
var ServerActionProvider = function () {
};

ServerActionProvider.prototype.request = function (requestData, resultCallback, onSuccess, onError) {
    var that = this;
    var requestId = Math.round((Math.random() * 100000));

    $.ajax({
        type: requestData.method,
        url: requestData.requestUrl,
        xhrFields: {
            withCredentials: true
        },
        data: requestData.args,
        contentType: requestData.contentType,
        success: function(data){
            var args = {
                requestId: requestId,
                data: data
            };

            if( _.isFunction(resultCallback) ){
                resultCallback(args);
            }

            if( _.isFunction(onSuccess) ){
                onSuccess(args);
            }
        },
        error: function (data) {
            var args = {
                requestId: requestId,
                data: data
            };

            if( _.isFunction(resultCallback) ){
                resultCallback(args);
            }

            if( _.isFunction(onError) ){
                onError(args);
            }
        }
    });

    return requestId;
};

ServerActionProvider.prototype.download = function (requestData, resultCallback, onSuccess, onError) {
    new DownloadExecutor(resultCallback, onSuccess, onError)
        .run(requestData);
};

window.InfinniUI.Providers.ServerActionProvider = ServerActionProvider;
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


window.InfinniUI.Providers.DataProviderReplaceItemQueue = DataProviderReplaceItemQueue;

//####app/data/dataSource/objectDataSource.js
var ObjectDataSource = BaseDataSource.extend({

    initDataProvider: function(){
        var dataProvider = window.InfinniUI.providerRegister.build('ObjectDataSource');
        this.set('dataProvider', dataProvider);
    },

    setItems: function(items){
        this.get('dataProvider').setItems(items);
        this.updateItems();
    }

});

window.InfinniUI.ObjectDataSource = ObjectDataSource;

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

        if(!'IsLazy' in metadata){
            dataSource.setIsLazy(false);
        }

        if(metadata.Items){
            if($.isArray(metadata.Items)){
                dataSource.setItems(metadata.Items);
            }

            if($.isPlainObject(metadata.Items)){
                var binding = builder.buildBinding(metadata.Items, {
                    parentView: parent
                });

                binding.setMode(InfinniUI.BindingModes.toElement);

                binding.bindElement(dataSource, '');
            }

        }

    }
});

window.InfinniUI.ObjectDataSourceBuilder = ObjectDataSourceBuilder;

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

window.InfinniUI.Parameter = Parameter;


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

            if(InfinniUI.Metadata.isBindingMetadata(metadata['Value'])){
                var dataBinding = builder.buildBinding(metadata['Value'], {parentView: parentView, basePathOfProperty: basePathOfProperty});
                dataBinding.bindElement(parameter, '');
            }else{
                parameter.setValue(metadata['Value']);
            }

            if (metadata.OnPropertyChanged) {
                parameter.onPropertyChanged('', function (context, args) {
                    var scriptExecutor = new ScriptExecutor(parentView);
                    return scriptExecutor.executeScript(metadata.OnPropertyChanged.Name || metadata.OnPropertyChanged, args);
                });
            }
        }



        return parameter;
    };
}

window.InfinniUI.ParameterBuilder = ParameterBuilder;

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

    setOptions: function (options) {
        this.options = _.extend({}, this.options || {}, options);
    },

    getOptions: function () {
        return this.options || {};
    },

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

window.InfinniUI.FormatMixin = formatMixin;

//####app/formats/displayFormat/boolean/booleanFormat.js
/**
 * @description Формат отображения логического значения.
 * @class BooleanFormat
 * @mixes formatMixin
 */
var BooleanFormat = function () {};

window.InfinniUI.BooleanFormat = BooleanFormat;

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

window.InfinniUI.BooleanFormatBuilder = BooleanFormatBuilder;

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

window.InfinniUI.DateTimeFormat = DateTimeFormat;


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

        var date = this.createDate(originalDate);

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

    createDate: function (originalDate) {
        var date;
        var options = this.getOptions();

        date = InfinniUI.DateUtils.createDate(originalDate);

        return InfinniUI.DateUtils.changeTimezoneOffset(date, options.TimeZone);//apply timezoneOffset
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

        if (_.isNumber(args.metadata.TimeZone)) {
            format.setOptions({ TimeZone: args.metadata.TimeZone });
        }

        return format;
    }

}

window.InfinniUI.DateTimeFormatBuilder = DateTimeFormatBuilder;

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

window.InfinniUI.NumberFormat = NumberFormat;


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

//####app/formats/displayFormat/number/numberFormatBuilder.js
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

window.InfinniUI.NumberFormatBuilder = NumberFormatBuilder;

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

window.InfinniUI.ObjectFormat = ObjectFormat;


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

        culture = culture || new Culture(InfinniUI.config.lang);
        format = format || this.getFormat();

        var regexp = /{[^}]*}/g;
        var trim = /^{|}$/g;
        var value = '';

        value = format.replace(regexp, this.formatIterator.bind(this, originalValue, culture));
        
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
                formatter.setOptions(this.getOptions());

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

window.InfinniUI.ObjectFormatBuilder = ObjectFormatBuilder;

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
     * @oaram {Number} len
     * @returns {boolean|number}
     */
    deleteSelectedText: function(position, len){
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
        var text;

        if (this.value !== null && typeof this.value !== 'undefined') {
            text = String(this.value);
        }

        return text;
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

window.InfinniUI.EditMaskMixin = editMaskMixin;

//####app/formats/editMask/dateTime/_base/dateTimeMaskPart.js
var DateTimeMaskPartStrategy = (function () {
    var regExpDay = /^(?:3[0-1]|[012]?[0-9]?)$/;
    var regExpMonth = /^(?:1[0-2]|0?[1-9]?)$/;
    var regExpFullYear = /^\d{1,4}$/;
    var regExpYear = /^\d{1,2}$/;
    var regExpHour24 = /^(?:[2][0-3]|[01]?[0-9]?)$/;
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

window.InfinniUI.DateTimeEditMask = DateTimeEditMask;


_.extend(DateTimeEditMask.prototype, editMaskMixin);

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
     * @param {Number} position
     * @param {Number} selectionLength
     * @param {String} char
     * @returns {Number}
     */
    deleteSelectedText: function (position, selectionLength, char) {

        var data;
        var from;
        var text;
        var mask;
        var prevPos, pos = position, len = selectionLength;
        char = char || '';
        var newPos = position + char.length - 1;


        while(data = this.getItemTemplate(pos)) {
            prevPos = pos;
            from = pos - data.left;
            text = data.item.text;
            mask = this.masks[data.item.mask];

            text = text.substring(0, from) + char + text.substring(from + len);
            if (!text.length || mask.match(text)) {
                data.item.text = text;
            }

            pos = this.getNextItemMask(pos);
            if (prevPos === pos) {
                break;
            }
            len = selectionLength - (pos - position);
            char = '';
        }

        return this.moveToNextChar(newPos);
    },

    /**
     * Удалить символ слева от курсора
     * @param position
     * @param {Number|undefined} selectionLength
     */
    deleteCharLeft: function (position, selectionLength) {
        var data = this.getItemTemplate(position);
        var item, text;

        if (selectionLength) {
            position = this.deleteSelectedText(position, selectionLength);
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
     * @param {Number|undefined} selectionLength
     */
    deleteCharRight: function (position, selectionLength) {
        var data = this.getItemTemplate(position);
        var item, text;

        if (selectionLength) {
            position = this.deleteSelectedText(position, selectionLength);
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

        if (typeof  template === 'undefined') {
            this.reset();
            template = this.template;
        }

        if (!Array.isArray(template)) {
            return null;
        }
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
        var last = left;

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
     * @returns {string|*}
     */
    getText: function () {
        var template = this.template;
        var item;
        var result = [];
        var placeholder;

        if (!Array.isArray(template)) {
            return;
        }

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

        return this.template = template;
    },

    /**
     * Вернуть введеный результат
     * @returns {*}
     */
    getValue: function () {
        var formatOptions = this.format.getOptions();
        var template = this.template;
        var item;
        var mask;
        var value =  InfinniUI.DateUtils.changeTimezoneOffset(this.value, formatOptions.TimeZone );
        var done = true;

        if (!Array.isArray(template)) {
            return;
        }

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

        if (done && value instanceof Date) {
            //value.setHours(0, 0, 0, 0);
            value =  InfinniUI.DateUtils.restoreTimezoneOffset(value, formatOptions.TimeZone);
        }

        return done ? value : null;
    },

    /**
     * Вернуть результат в используемумом формате данных: строка в формате ISO8601
     * @returns {String}
     */
    getData: function () {
        var formatOptions = this.format.getOptions();

        return InfinniUI.DateUtils.toISO8601(this.getValue(), {timezoneOffset: formatOptions.TimeZone});
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
                date = InfinniUI.DateUtils.createDate(value);
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

        var formatOptions = args.formatOptions;

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
        editMask.format.setOptions(formatOptions);
        return editMask;
    }
}

window.InfinniUI.DateTimeEditMaskBuilder = DateTimeEditMaskBuilder;

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

window.InfinniUI.TemplateEditMask = TemplateEditMask;


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
     * @returns {string|*}
     */
    getValue: function () {
        var template = this.template;
        var result = [];
        var text;

        if (!Array.isArray(template)) {
            return;
        }
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

        if (typeof  template === 'undefined') {
            this.reset();
            template = this.template;
        }

        if (!Array.isArray(template)) {
            return null;
        }

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

    deleteCharRight: function (position, len) {
        var template;
        var i, ln;
        var left;

        if (len > 0) {
            return this.deleteSelectedText(position, len);
        }

        for (i = 0, ln = this.template.length; i < ln; i = i + 1) {
            template = this.template[i];

            if (typeof template === 'string' || template.position < position) {
                continue;
            }
            position = template.position + 1; // Перенос каретки на 1 символ вправо для корректной работы DEL
            template.text = '';
            break;
        }

        return position;
    },

    deleteCharLeft: function (position, len) {
        var template;
        var i, ln;
        var left;

        if (len > 0) {
            return this.deleteSelectedText(position, len);
        }

        for (i = this.template.length - 1; i >= 0; i = i - 1) {
            template = this.template[i];

            if (typeof template === 'string' || template.position >= position) {
                continue;
            }
            position = template.position;
            template.text = '';
            break;
        }

        return position;
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
        var itemTemplate = this.template;
        //var itemTemplate = this.getItemTemplate(position);
        var mask;
        var text;

        if (typeof len === 'undefined') {
            len = 0;
        }

        if (len > 0) {
            this.clearText(position, len);
        }

        for (var i = 0, ln = itemTemplate.length; i < ln; i = i + 1) {
            var template = itemTemplate[i];
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

        return startFrom;
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

window.InfinniUI.TemplateEditMaskBuilder = TemplateEditMaskBuilder;

//####app/formats/editMask/number/numberEditMask.js
function NumberEditMask () {
    this.mask = null;
    this.format = null;
    //@TODO Получать культуру из контекста!
    this.culture = new Culture(InfinniUI.config.lang);
}

window.InfinniUI.NumberEditMask = NumberEditMask;


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

        return this.template = template;
    },

    getText: function () {
        var result = [];
        var item;

        if (!Array.isArray(this.template)) {
            return;
        }

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

        this.reset(res);

        return res ? position : 0;
    },

    /**
     * Удаление символов справа от позиции курсора
     * @param position
     * @param len
     * @returns {*}
     */
    deleteCharRight: function (position, len) {

        if (len > 0) {
            return this.deleteSelectedText(position, len);
        }
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
        
        item.value = this.parseText(text.slice(0, i) + text.slice(i + 1), item.value);
        item.text = this.formatMask(item.value, item.mask);

        position = fractional ? position - 1 : position + item.text.length - text.length;

        if (item.value === 0 && position <= 1) {
            item.value = null;
            item.text = this.formatMask(item.value, item.mask);
            position = left;
        }

        return position;
    },

    getValue: function () {
        var value;
        var itemTemplate = this.getItemTemplate();

        if (itemTemplate) {
            value = itemTemplate.item.value;
        }
        return value;
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

        if (typeof  template === 'undefined') {
            this.reset();
            template = this.template;
        }

        if (!Array.isArray(template)) {
            return null;
        }
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

window.InfinniUI.NumberEditMaskBuilder = NumberEditMaskBuilder;

//####app/formats/editMask/regex/regexEditMask.js
function RegexEditMask () {
    this.mask = null;
}

window.InfinniUI.RegexEditMask = RegexEditMask;


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

window.InfinniUI.RegexEditMaskBuilder = RegexEditMaskBuilder;

//####app/linkView/openMode/strategy/_mixins/openModeAutoFocusMixin.js
var openModeAutoFocusMixin = {

    applyAutoFocus: function () {
        var view = this.view;
        var focusOnControl = view && view.getFocusOnControl();

        if (!focusOnControl) {
            return;
        }

        var focusInterval = setInterval(function () {
            var elements = view.findAllChildrenByName(focusOnControl);
            if (Array.isArray(elements) && elements.length > 0) {
                var element = elements[0];
                if (!jQuery.contains(document, element.control.controlView.el)) {
                    return;
                }

                element.setFocus && element.setFocus();
                clearFocusInterval();
            }
        }, 1000 / 3);

        setTimeout(clearFocusInterval, 3000);

        function clearFocusInterval() {
            clearInterval(focusInterval);
        }

    }

};
//####app/linkView/inlineViewBuilder.js
function InlineViewBuilder() {
    this.build = function (context, args){
        var that = this,
            metadata = args.metadata;

        var parentView = this.getParentViewByOpenMode(args, metadata.OpenMode);

        var linkView = new LinkView(parentView);

        linkView.setViewTemplate(function(onViewReadyHandler){

            that.buildViewByMetadata(args, args.metadata['View'], parentView, function (view) {
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



    this.buildViewByMetadata = function(params, viewMetadata, parentView, onViewReadyHandler){
        var builder = params.builder;
        var parameters = this.buildParameters(params);

        if (viewMetadata != null) {

            var view = builder.buildType("View", viewMetadata, {
                parentView: parentView,
                parent: parentView,
                params: parameters,
                suspended: params.suspended
            });

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
                    parameter = builder.buildType('Parameter', parametersMetadata[i], {parentView: parentView, basePathOfProperty: params.basePathOfProperty});
                    result[parameter.getName()] = parameter;
                }
            }
        }
        return result;
   };

    this.getParentViewByOpenMode = function(params, mode) {
        if( mode == null || mode == "Default" ) {
            return params.parentView.getApplicationView();
        }

        return params.parentView;
    };
}

window.InfinniUI.InlineViewBuilder = InlineViewBuilder;

//####app/linkView/linkView.js
function LinkView(parent) {
    this.openMode = 'Default';
    this.parent = parent;

    this.viewTemplate = function(){return '';};

    this.dialogWidth;
}

window.InfinniUI.LinkView = LinkView;


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

        window.InfinniUI.global.messageBus.send('onViewCreated', {openMode: openMode, view: view});

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
function MetadataViewBuilder() {}

window.InfinniUI.MetadataViewBuilder = MetadataViewBuilder;

_.extend(MetadataViewBuilder.prototype, {

    build: function (context, args) {
        var metadata = args.metadata;
        var parentView = this.getParentViewByOpenMode(args, metadata.OpenMode);

        var viewTemplate = this.buildViewTemplate(args, parentView);
        var linkView = new LinkView(parentView);

        linkView.setViewTemplate(viewTemplate);

        if ('OpenMode' in metadata) {
            linkView.setOpenMode(metadata.OpenMode);
        }

        if ('Container' in metadata) {
            linkView.setContainer(metadata.Container);
        }

        if ('DialogWidth' in metadata) {
            linkView.setDialogWidth(metadata.DialogWidth);
        }

        return linkView;
    },

    buildViewTemplate: function (params, parentView) {
        var metadata = params.metadata;
        var that = this;

        return function (onViewReadyHandler) {
            var metadataProvider = window.InfinniUI.providerRegister.build('MetadataDataSource', metadata);

            metadataProvider.getMetadata(function (viewMetadata) {

                if (viewMetadata == null) {
                    InfinniUI.global.logger.error('view metadata not found');
                    InfinniUI.global.messageBus.send(messageTypes.onViewBuildError, {error: 'metadata not found', metadata: metadata});
                    return;
                }

                var onReady = function() {
                    var args = Array.prototype.slice.call(arguments);
                    onViewReadyHandler.apply(null, args);
                };

                that.buildViewByMetadata(params, viewMetadata, parentView, onReady);
            });
        };
    },

    buildViewByMetadata: function (params, viewMetadata, parentView, onViewReadyHandler) {
        var builder = params.builder;
        var parameters = this.buildParameters(params);

        var view = builder.buildType("View", viewMetadata, {
            parentView: parentView,
            parent: parentView,
            params: parameters,
            suspended: params.suspended
        });

        onViewReadyHandler(view);
    },

    buildParameters: function (params) {
        var parametersMetadata = params.metadata['Parameters'];
        var builder = params.builder;
        var parentView = params.parentView;
        var result = {};
        var parameter;

        if (typeof parametersMetadata !== 'undefined' && parametersMetadata !== null) {
            for (var i = 0; i < parametersMetadata.length; i++) {
                if (parametersMetadata[i].Value !== undefined) {
                    parameter = builder.buildType('Parameter', parametersMetadata[i], {
                        parentView: parentView,
                        basePathOfProperty: params.basePathOfProperty
                    });
                    result[parameter.getName()] = parameter;
                }
            }
        }
        return result;
    },

    getParentViewByOpenMode: function(params, mode) {
        if( mode == null || mode == "Default" ) {
            return params.parentView.getApplicationView();
        }

        if( mode == "Container" ) {
            var containerName = params.metadata.Container;
            var container = InfinniUI.global.containers[containerName];

            if(container){
                return container.getView();
            }else{
                return params.parentView;
            }
        }

        return params.parentView;
    }
});

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

        this.applyAutoFocus();
    },

    close: function () {
        this.view.remove();
    }

}, openModeAutoFocusMixin);

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
        // чтобы пользователь случайно не обратился к элементу в фокусе,
        // пока диалоговое окно создается и ещё не перехватило фокус,
        // необходимо старую фокусировку снять
        $(document.activeElement).blur();

        var modalParams = {dialogWidth: this.dialogWidth};
        var $template = $(this.template(modalParams));
        var $closeButton = $('button', $template);
        var $header =  $('h4', $template);
        var view = this.view;

        var $modal = $template.appendTo($('body'));

        this.$modal = $modal;

        $modal.on('shown.bs.modal', function (e) {
            $(e.target).find('.first-focus-element-in-modal').focus();
        });

        $modal.on('hidden.bs.modal', this.cleanup.bind(this));

        var $modalBody = $modal.find('.modal-body');

        $modalBody.append(this.view.render());

        $modal.modal({
            show: true,
            backdrop: 'static',
            modalOverflow: true,
            keyboard: view.getCloseButtonVisibility(),
            focus: this
        });

        this._initBehaviorFocusingInModal($modal, $modalBody);

        var updateCloseButtonVisibility = function() {
            $closeButton.toggleClass('hidden', !view.getCloseButtonVisibility());
        };

        updateCloseButtonVisibility();

        view.control.controlView.listenTo(view.control.controlModel, 'change:closeButtonVisibility', updateCloseButtonVisibility);


        var headerTemplate = view.getHeaderTemplate();

        $header.append(headerTemplate().render());

        $modal.find('.pl-close-modal').on('click', function(){
            view.close();
        });

        InfinniUI.ModalWindowService.modalWasOpened({
            modal: this.$modal,
            background: $('.modal-backdrop').last()
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
        if (this.$modal) {
            this.$modal.modal('hide');
        }
    },

    cleanup: function () {
        this.view.remove();
        this.$modal.remove();
        InfinniUI.ModalWindowService.modalWasClosed(this.$modal);
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
window.InfinniUI.Culture = Culture;

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
    T: 'HH:mm:ss',

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
function ScriptBuilder() {}

window.InfinniUI.ScriptBuilder = ScriptBuilder;


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

window.InfinniUI.ScriptExecutor = ScriptExecutor;


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

//####app/services/modalWindowService.js
InfinniUI.ModalWindowService = (function () {
    var modalQueue = [];

    return {
        modalWasOpened: function (obj) {
            if (modalQueue.length != 0) {
                var previous = modalQueue[modalQueue.length - 1];

                previous.modal.hide();
                previous.background.hide();
            }

            modalQueue.push(obj);
        },

        modalWasClosed: function (modal) {
            for (var i = 0, length = modalQueue.length; i < length; i++) {
                if (modalQueue[i].modal == modal) {
                    // Если последний
                    if (i == length - 1 && i != 0) {
                        var previous = modalQueue[i - 1];

                        previous.modal.show();
                        previous.background.show();
                        notifyLayoutChange();
                    }

                    modalQueue.splice(i, 1);
                    break;
                }
            }

        }
    };

    function notifyLayoutChange () {
        var exchange = window.InfinniUI.global.messageBus;
        exchange.send('OnChangeLayout', {});
    }
})();

//####app/services/notificationSubsription.js
var notificationSubsription = (function() {
	var subscription = {},
			hubProxy,
			connection,
			onSuccessCb,
			onErrorCb,
			isConnected = false;

	var setUpConnection = function(hubName, onSuccess, onError) {
		onSuccessCb = onSuccess;
		onErrorCb = onError;
		connection = $.hubConnection(window.InfinniUI.config.serverUrl);
		hubProxy = connection.createHubProxy(hubName);

		if( _.size(subscription) > 0 ) {
			eventSwitcher('on');
			startConnection();
		}
	};

	var subscribe = function(routingKey, callback, context) {
		if( !subscription[routingKey] ) {
			subscription[routingKey] = [];
			if( hubProxy ) {
				hubProxy.on(routingKey, onReceived(routingKey));
			}
		}
		subscription[routingKey].push({context: context, callback: callback});

		if( !isConnected && hubProxy ) {
			startConnection();
		}
	};

	var eventSwitcher = function(state) {
		for( var routingKey in subscription ) {
			if( state === 'on' ) {
				hubProxy.on(routingKey, onReceived(routingKey));
			} else {
				hubProxy.off(routingKey);
			}
		}
	};

	var unsubscribe = function(routingKey, context) {
		if( context ) {
			var routingKeyArr = subscription[routingKey];
			for( var i = 0, ii = routingKeyArr.lenght; i < ii; i += 1 ) {
				if( routingKeyArr[i].context == context ) {
					routingKeyArr.splice(i, 1);
				}
			}
			if( routingKeyArr.length !== 0 ) {
				return;
			}
		}
		
		if( subscription[routingKey] ) {
			delete subscription[routingKey];
			if( hubProxy ) {
				hubProxy.off(routingKey);
			}
		}
		checkHandlers();
	};

	var onReceived = function(routingKey) {
		return function(message) {
			var routingKeyArr = subscription[routingKey];
			if( routingKeyArr ) {
				for( var i = 0, ii = routingKeyArr.length; i < ii; i += 1 ) {
					routingKeyArr[i].callback(routingKeyArr[i].context, {message: message});
				}
			}
		};
	};

	var startConnection = function() {
		isConnected = true;

		connection.start()
			.done(function() {
				console.log( 'signalR: connection is started' );
				if( typeof onSuccessCb === 'function' ) {
					onSuccessCb();
				}
			})
			.fail(function() {
				console.log( 'signalR: connection fail' );
				isConnected = false;
				if( typeof onErrorCb === 'function' ) {
					onErrorCb();
				}
			});
	};

	var stopConnection = function() {
		isConnected = false;

		eventSwitcher('off');
		hubProxy = null;
		connection.stop();
	};

	var checkHandlers = function() {
		if( _.size(subscription) === 0 ) {
			stopConnection();
		}
	};

	return {
		startConnection: setUpConnection,
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		stopConnection: stopConnection
	};
})();

InfinniUI.global.notificationSubsription = notificationSubsription;

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
//####app/services/contextMenuService/contextMenuService.js
InfinniUI.ContextMenuService = (function () {

	var exchange = window.InfinniUI.global.messageBus;

	exchange.subscribe(messageTypes.onContextMenu.name, function (context, args) {
		var message = args.value;
		initContextMenu(getSourceElement(message.source), message.content);
	});

	function getSourceElement(source) {
		return source.control.controlView.$el
	}

	function initContextMenu($element, content) {
		$element.on('contextmenu', function(event) {
			event.preventDefault();

			exchange.send(messageTypes.onOpenContextMenu.name, { x: event.pageX, y: event.pageY });
		});
	}
})();

//####app/services/messageBox/messageBox.js
/**
 * @constructor
 * @mixes bindUIElementsMixin
 */
var MessageBox = Backbone.View.extend({

    tagName: 'div',

    className: 'modal fade messagebox',

    UI: {
        firstfocuselementinmodal: '.firstfocuselementinmodal',
        lastfocuselementinmodal: '.lastfocuselementinmodal'
    },

    events: {
        'click .btn': 'onClickButtonHandler',
        'focusin .lastfocuselementinmodal': 'onFocusinLastElement',
        'keydown': 'onKeydownHandler'
    },

    template: InfinniUI.Template["services/messageBox/template/default.tpl.html"],

    initialize: function (options) {

        this.setOptions(options);

        // чтобы пользователь случайно не обратился к элементу в фокусе,
        // пока диалоговое окно создается и ещё не перехватило фокус,
        // необходимо старую фокусировку снять
        $(document.activeElement).blur();
        this.render();
        this.bindUIElements();
        this.$el
            .modal({show: true});
    },

    setOptions: function (config) {
        this.options = this.applyDefaultOptions(config);
    },

    onFocusinLastElement: function () {
        this.ui.firstfocuselementinmodal.focus();
    },

    onKeydownHandler: function (event) {
        if(document.activeElement === this.ui.lastfocuselementinmodal[0] && (event.which || event.keyCode) == 9) {
            event.preventDefault();
            this.ui.firstfocuselementinmodal.focus();
        }

        if(document.activeElement === this.ui.firstfocuselementinmodal[0] && (event.which || event.keyCode) == 9 && event.shiftKey){
            event.preventDefault();
            this.ui.lastfocuselementinmodal.focus();
        }
    },

    render: function () {
        var $parent = this.options.$parent || $('body');

        var html = this.template(this.options);
        this.$el.html(html);

        this.subscribeToDialog();
        $parent.append(this.$el);

        return this;
    },

    subscribeToDialog: function (){
        var view = this;
        this.$el.on('shown.bs.modal', function (e) {
            view.ui.firstfocuselementinmodal.focus();
        });

        this.$el.on('hidden.bs.modal', function () {
            view.remove();
        });
    },

    onClickButtonHandler: function (event) {
        event.preventDefault();

        var $el = $(event.target),
            i = parseInt( $el.data('index'), 10),
            handler = this.options.buttons[i].onClick;

        if(handler){
            handler.apply(null);
        }

        this.close();
    },

    close: function () {
        if (typeof this.options.onClose === 'function') {
            this.options.onClose.call(null);
        }

        this.$el.modal('hide');
    },

    applyDefaultOptions: function (config) {
        var options = _.defaults({}, config, {
            type: 'default',
            buttons: []
        });
        this.applyDefaultButtonsOptions(options);

        return options;
    },

    applyDefaultButtonsOptions: function (options) {
        options.buttons
            .filter(function (button) {
                return typeof button.type === 'undefined';
            })
            .forEach(function (button) {
                button.type = 'default';
            });

        return options;
    }
});

_.extend(MessageBox.prototype, bindUIElementsMixin);

InfinniUI.MessageBox = MessageBox;

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
//####app/services/router/routerService.js
var routerService = (function(myRoutes) {
	if( !myRoutes ) {
		return null;
	}

	var parseRouteForBackbone = function(myRoutes) {
		var routerObj = {};
		routerObj.routes = {};
		for( var i = 0, ii = myRoutes.length; i < ii; i += 1 ) {
			myRoutes[i].originalPath = myRoutes[i].Path;
			if( myRoutes[i].Path.search('<%') !== -1 ) {
				var tmpArr,
						tmpParam,
						re = /\<\%[\sa-zA-Z0-9]+\%\>/g;
				while( tmpArr = re.exec(myRoutes[i].Path) ) {
					tmpParam = tmpArr[0].replace(/\s+/g, '').slice(2, -2);
					myRoutes[i].Path = myRoutes[i].Path.slice(0, tmpArr.index) + ':' + tmpParam + myRoutes[i].Path.slice(tmpArr.index + tmpArr[0].length);
					re.lastIndex = tmpArr.index + tmpParam.length;
				}
			}
			routerObj.routes[myRoutes[i].Path.slice(1)] = myRoutes[i].Name; // remove first slash from myRoutes[i].Path for backbone
			routerObj[myRoutes[i].Name] = myFunc(myRoutes[i].Name, myRoutes[i].Action);
		}
		return routerObj;
	};

	var getLinkByName = function(name, originalPath) {
		var original = originalPath || 'yes';
		for( var i = 0, ii = myRoutes.length; i < ii; i += 1 )  {
			if( myRoutes[i].Name === name ) {
				if( original === 'yes' ) {
					return myRoutes[i].originalPath;
				} else {
					return myRoutes[i].Path;
				}
			}
		}
	};

	var myFunc = function(name, callback) {
		return function() {
			var params = Array.prototype.slice.call(arguments);
			new ScriptExecutor({getContext: function() {return 'No context';}}).executeScript(callback, { name: name, params: params });
		};
	};

	var routerObj = parseRouteForBackbone(myRoutes);

	var startRouter = function() {
		var Router = Backbone.Router.extend(routerObj);
		InfinniUI.AppRouter = new Router();

		Backbone.history = Backbone.history || new Backbone.History({});
		Backbone.history.start(InfinniUI.config.HistoryAPI);
	};

	return {
		getLinkByName: getLinkByName,
		startRouter: startRouter
	};
})(InfinniUI.config.Routes);

window.InfinniUI.RouterService = routerService;

//####app/services/toolTipService/toolTipService.js
InfinniUI.ToolTipService = (function () {

	var exchange = window.InfinniUI.global.messageBus;

	exchange.subscribe(messageTypes.onToolTip.name, function (context, args) {
		var message = args.value;
		showToolTip(getSourceElement(message.source), message.content);
	});

	function getSourceElement(source) {
		return source.control.controlView.$el
	}
	function showToolTip($element, content) {
		$element
			.tooltip({
				html: true,
				title:content,
				placement: 'auto top',
				container: 'body'

			})
			.tooltip('show');
	}
})();
})();