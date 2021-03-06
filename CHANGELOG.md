Changelog
=========

## 3.0.18

* fixed: 'FileBox' bug with empty 'LabelText' property

## 3.0.17

* added: 'LabelTextTitle' property to ComboBox, FileBox, TextBox, PasswordBox, NumericBox, DataTimePicker, DataPicker, TimePicker metadata

## 3.0.16

* fixed: In 'EditAction' instead of simple clone used recursiveDeepCopy
* fixed: Validation of file extension in 'FileBox'

## 3.0.15

* fixed: TimePicker, DatePicker, DateTimePicker saves focus after closing dropdown menu and after choosing value
* added: NumericBox has auto value validation if 'MinValue' or(and) 'MaxValue' property were added to metadata

## 3.0.14

* fixed: NumericBox allows leave input field empty
* added: 'ExpandOnEnter' property to ComboBox, DataTimePicker, DataPicker, TimePicker metadata

## 3.0.13
* added: InfinniUI.config.signalROptions (hubConnection options [guide](https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-javascript-client#connequivalence))

## 3.0.12
* fixed: ComboBox's drop down container doesn't stretch to the width of the parent

## 3.0.11
* removed: memory leaks of container based elements

## 3.0.10
* fixed: sign out issue when InfinniUI.user not defined

## 3.0.9
* added: more sign in methods (support InfinniPlatform >= 2.4)

## 3.0.8
* fixed: toggling sign in NumberMask by pressing backspace and delete keys

## 3.0.7
* added 'signalRServerUrl' url to InfinniUI.config

## 3.0.6
* fixed: Rounding for NumberMask

## 3.0.5
* fixed: InfinniUI.VERSION template

## 3.0.4
* fixed: DatePicker make wrong timeZone correction

## 3.0.3
* fixed: choose date in DatePicker

## 3.0.2
* fixed: dataGridView scroll update

## 3.0.1
* fixed: ComboBox with label place dropdown menu relate to control, not label
* added: 'Scroll' property to DataGrid metadata
* fixed: 'Background' property of PopupButton work correctly for all PopupButton types
* fixed: Key events in TextBox
* added: Parameters make unsubscription correctly and remove from view after it closed

## 3.0
* renamed: InfinniUI.config.HistoryAPI, InfinniUI.config.Routes, InfinniUI.RouterService, InfinniUI.StringUtils to InfinniUI.config.historyApi, InfinniUI.config.routes, InfinniUI.routerService, InfinniUI.stringUtils
* added: InfinniUI.extensionPanels service, which help to register ExtensionPanels
* renamed: platform.js to infinni-ui.js (now templates.js is includeed into infinni-ui.js), main.css to infinni-ui.css
* removed: vendor.js and vendor.css, for correct work you need to set peerDependences
* fixed: 'Background' property in 'PopupButton' really change background now
* added: styles for error text(http://infinniui-en.readthedocs.io/en/latest/Elements/EditorBase/EditorBase.setErrorText.html)
* fixed: now 'DatePicker' element works correctly on mobile version.
* added: InfinniUI.config.cacheMetadata property, that allow to turn off cache of the requested pages by the browser
* added: 'CanExecute' property to Actions metadata
* changed: 'ComboBox' wait for the moment when DataSource get results before show the values
* added: new DataSource 'LocalStorageDataSource'. It can be used like 'ObjectDataSource'. It saves data to brawser LocalStorage.
* changed: 'Script' property can be string or action, syntax with object not supported.

Syntax like that is not correct now:

```javascript
    "Scripts": [{
        "Name": "alertAction",
        "Body": "alert(args.source.getName());"
    }]
```


* added: InfinniUI.ValidationResult
* added: new action 'CreateItemAction'
* added: 'Filter' and 'FilterParams' properties to 'ObjectDataSource' metadata
* changed: 'Action' can be set instead of 'Script'

```javascript
    {
        "Button": {
            "OnClick": {
                "OpenAction": {
                    "LinkView": {
                        "InlineView": {
                            // ...
                        }
                    }
                }
            }
        }
    }
```

* added: 'Localizations', you can extend it or/and add something new to it
* changed: display format syntax, use '${format}' instead of '{format}'
* added: ability to use expressions (http://infinniui-en.readthedocs.io/en/latest/Core/JSExpression/index.html)
* added: 'OnCheckAllChanged' property to 'DataGrid' metadata
* added: 'AcceptMessage', 'AcceptMessageType' properties to 'DeleteAction' metadata
* removed: 'disableAutoHeightService', 'disableGetCurrentUser', 'disableSignInExternalForm' from InfinniUI.config
* added: 'enableAutoHeightService' property to InfinniUI.config

## 2.2
* changed: 'ImageBox' rotate portrait images from mobile phones in right position
* changed: 'ImageBox' fit images in frame by smaller side automatically
* added: 'OnExpand' and 'OnCollapse' events to 'TreeView'
* changed: now converter of 'DataBinding' get correct context in case of 'ObjectDataSource Parameter' binding
* added: 'VerticalAlignment' property to 'DataGrid' metadata
* added: 'SuspendUpdate' property to DataSources metadata
* fixed tooltip: if you remove element, connected tooltip will be removed too
* fixed: 'ObjectDataSource' methods return correct 'ValidationResult' ('IsValid' instead of 'isValid', 'Items' instead of 'items')
* fixed: now you can use 'Routing' and 'DataNavigation' together
* added: 'expand', 'collapse', 'toggle' methods to 'TreeView'
* fixed: 'TreeView' doesn't add checker to nodes without childs
* changed: DataSources methods 'saveItem' and 'deleteItem' pass to callback standart params with such properties as 'item', 'validationResult' and 'originalResponse'
* added: 'Size' property to 'Icon' metadata
* fixed: 'SaveAction' update 'DestinationValue' even when property 'CanClose': false
* fixed: When click on any 'TextBox' point, cursor doesn't jump to the begin of the input field
* added: 'Replace' property to 'RouteToAction' metadata
* fixed: 'ListBox' correctly work when 'Enabled' property is set
* changed: 'ObjectDataSource', 'MetadataDataSource', 'DocumentDataSource', 'RestDataSource', 'ServerActionProvider' have default providers, you don't need register providers by yourself anymore, but you can override them with InfinniUI.providerRegister if needed
* changed: 'AddAction' can work without 'DestinationValue' property ('DestinationValue' is not required now)
* changed: 'PopupButton' default color is changed
* added: 'Enabled' property to 'TabPage' metadata
* added: 'CollapseChanger' property to 'Panel' metadata
* removed: 'CollapsibleArea' property from 'Panel' metadata
* changed: 'Parameter' can be DataBinding's source for 'ListEditorBase'
* added: 'AdditionalResult' property to 'DocumentDataSource'
* added: 'OnProviderError' property to DataSources metadata
* added: 'OnProviderError' method to DataSources
* fixed: 'setFocused' method of 'TextBox'
* changed: 'ServerAction' can work without 'Origin' property('Origin' is not required now)
* added: 'setContext', 'setParams', 'addParams' methods to InfinniUI.routerService
* renamed: 'LinkElement' to 'Link' (only for API, it was always called 'Link' in metadata)

