var editor = new JSONEditor($('#jsonEditor').get(0));
var onSaveMetadataHandler;

function setMetadata(stringMetadata) {
    editor.set(JSON.parse(stringMetadata));
}

function setPath(path) {
    var selectedNode = editor.node && editor.node.findNode(path);

    if (selectedNode != null) {
        _focusTo(selectedNode);
    }
}

function onSaveMetadata(handler) {
    onSaveMetadataHandler = handler;
}

function saveMetadata() {
    if (onSaveMetadataHandler) {
        onSaveMetadataHandler(editor.get());
    }
}

function _getRootParent(parentValues, childMargin) {
    var totalParent = parentValues
        .parent()
        .parent();
    var isExit = false;
    var rootParent;

    while (!isExit) {
        var previous = totalParent.prev();

        if (previous.hasClass('jsoneditor-expandable')) {
            var previousChild = previous.children().eq(2).children();
            var previousChildMargin = parseFloat(previousChild.css('margin-left'));

            if (previousChildMargin < childMargin && previousChildMargin != 0) {
                rootParent = previous;
                isExit = true;
            }

            if (previousChildMargin == 0) {
                isExit = true;
            }
        }

        totalParent = previous;
    }

    return rootParent;
}

function _focusToScripts(textContent) {
    editor.node.childs.forEach(function (item) {
        if (item.field === 'Scripts') {
            item.childs.forEach(function (obj) {
                obj.childs.forEach(function (field) {
                    if (field.previousField == 'Name' && field.previousValue == textContent) {
                        _focusTo(field);
                    }
                });
            });
        }
    });
}

function _focusTo(node) {
    node.scrollTo();

    setTimeout(function () {
        node.focus();
    }, 300);
}

function _getFocusable(fieldName, node) {
    node = node || editor.node;

    if ($.isArray(node.childs)) {
        for (var i = 0, ii = node.childs.length; i < ii; i++) {
            if (node.childs[i].previousField === 'Name' && node.childs[i].previousValue === fieldName) {
                return node.childs[i];
            } else {
                var result = _getFocusable(fieldName, node.childs[i]);

                if (result) {
                    return result;
                }
            }
        }
    } else {
        return undefined;
    }
}

$(document).on('click', function (event) {
    if (!event.ctrlKey) {
        return;
    }

    var selection = editor.getSelection().dom;
    var textContent = selection.textContent;
    var parent = $(selection).parent().parent();
    var child = parent.children().eq(1);

    switch (child.text()) {

        case 'Name':
            var parentValues = parent
                .parent()
                .parent();

            var childMargin = parseFloat(parentValues.css('margin-left'));

            if (childMargin) {
                var rootParent = _getRootParent(parentValues, childMargin);

                if (rootParent) {
                    var events = [
                        'OnLoaded',
                        'OnClosed',
                        'OnClick'
                    ];

                    if (events.indexOf(rootParent.find('.jsoneditor-field').text()) != -1) {
                        _focusToScripts(textContent);
                    }
                }
            }

            break;

        case 'Source':
            var node = _getFocusable(textContent);

            if (node) {
                _focusTo(node);
            }

            break;
    }
});
