'use strict';
describe('AcceptAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();

        // When
        var acceptAction = builder.build({ AcceptAction: {} }, {parentView: view});

        // Then
        assert.isNotNull( acceptAction );
        assert.isNotNull( acceptAction.execute, 'action should have execute' );
    });

    it('set accept as DialogResult for parentView', function () {
        // Given
        var view = new View();
        var builder = new AcceptActionBuilder();
        var acceptAction = builder.build(null, {parentView: view, metadata: {}});

        assert.equal(view.getDialogResult(), DialogResult.none);

        // When
        acceptAction.execute();

        // Then
        assert.equal(view.getDialogResult(), DialogResult.accepted, 'DialogResult should be accepted');
    });
});
describe('AddAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();
        var dataSource = new ObjectDataSource({ name: 'SomeDS', view: view });

        view.getDataSources().push(dataSource);

        var metadata = {
            AddAction: {
                LinkView: {
                    InlineView: {

                    }
                },
                DestinationValue: {
                    Source: 'SomeDS'
                },
                SourceValue: {
                    Source: 'EditDS'
                }
            }
        };

        // When
        var addAction = builder.build(metadata, {parentView: view});

        // Then
        assert.isNotNull( addAction );
        assert.isNotNull( addAction.execute, 'action should have execute' );
    });

    it('should add item to ObjectDataSource', function (done) {
        // Given
        var metadata = {
            "Text": 'Parent View',
            "DataSources": [
                {
                    "ObjectDataSource": {
                        "Name": "ObjectDataSource",
                        "IsLazy": false,
                        "Items": []
                    }
                }
            ],
            "Items": [{
                "Button": {
                    "Name": "AddButton",
                    "Action": {
                        "AddAction": {
                            "DestinationValue": {
                                "Source": "ObjectDataSource",
                                "Property": ""
                            },
                            "SourceValue": {
                                "Source": "MainDataSource"
                            },
                            "LinkView": {
                                "InlineView": {
                                    "OpenMode": "Dialog",
                                    "View": {
                                        "Text": "Add",
                                        "Name": "AddView",
                                        "DataSources": [
                                            {
                                                "ObjectDataSource": {
                                                    "Name": "MainDataSource"
                                                }
                                            }
                                        ],
                                        "Items": [
                                            {
                                                "Button": {
                                                    "Name": "AcceptBtn",
                                                    "Action": {
                                                        "AcceptAction": {
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(metadata, function(view){
            var addBtn = view.context.controls['AddButton'];
            var destinationDS = view.context.dataSources['ObjectDataSource'];

            assert.equal(destinationDS.getItems().length, 0);

            // When
            addBtn.click();

            var childView = view.context.controls['AddView'];
            var sourceDS = childView.context.dataSources['MainDataSource'];
            var acceptBtn = childView.context.controls['AcceptBtn'];

            sourceDS.setSelectedItem({name: "New"});

            acceptBtn.click();

            // Then
            var destinationItems = destinationDS.getItems();
            assert.equal(destinationItems.length, 1);
            assert.include(destinationItems, {name: "New"});

            done();
        });
    });

    it('should add item to DocumentDataSource', function (done) {
        // Given
        window.providerRegister.register('DocumentDataSource', StaticFakeDataProvider);

        var metadata = {
            "Text": 'Parent View',
            "DataSources": [
                {
                    "DocumentDataSource": {
                        "Name": "DocumentDataSource",
                        "IsLazy": false
                    }
                }
            ],
            "Items": [{
                "Button": {
                    "Name": "AddButton",
                    "Action": {
                        "AddAction": {
                            "DestinationValue": {
                                "Source": "DocumentDataSource"
                            },
                            "SourceValue": {
                                "Source": "MainDataSource"
                            },
                            "LinkView": {
                                "InlineView": {
                                    "OpenMode": "Dialog",
                                    "View": {
                                        "Text": "Add",
                                        "Name": "AddView",
                                        "DataSources": [
                                            {
                                                "DocumentDataSource": {
                                                    "Name": "MainDataSource"
                                                }
                                            }
                                        ],
                                        "Items": [
                                            {
                                                "Button": {
                                                    "Name": "SaveBtn",
                                                    "Action": {
                                                        "SaveAction": {
                                                            "DestinationValue": {
                                                                "Source": "MainDataSource"
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(metadata, function(view){
            view.context.dataSources.DocumentDataSource.updateItems(
                function(){
                    var addBtn = view.context.controls['AddButton'];
                    var destinationDS = view.context.dataSources.DocumentDataSource;
                    var initCount = destinationDS.getItems().length;

                    // When
                    addBtn.click();

                    var childView = view.context.controls['AddView'];
                    var sourceDS = childView.context.dataSources['MainDataSource'];
                    var saveBtn = childView.context.controls['SaveBtn'];

                    var newItem = sourceDS.getSelectedItem();

                    assert.notInclude(destinationDS.getItems(), newItem);

                    newItem = _.extend( newItem,
                                        { FirstName: "Test", LastName: "Test" });
                    sourceDS.setSelectedItem( newItem );

                    saveBtn.click();

                    // Then
                    view.context.dataSources.DocumentDataSource.updateItems( function() {
                        var destinationItems = destinationDS.getItems();
                        assert.equal(destinationItems.length, initCount + 1);
                        assert.include(destinationItems, newItem);
                        done();
                    });
                }
            );
        });
    });
});
describe('CancelAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();

        // When
        var cancelAction = builder.build({ CancelAction: {} }, {parentView: view});

        // Then
        assert.isNotNull( cancelAction );
        assert.isNotNull( cancelAction.execute, 'action should have execute' );
    });

    it('set cancel as DialogResult for parentView', function () {
        // Given
        var view = new View();
        var builder = new CancelActionBuilder();
        var cancelAction = builder.build(null, {parentView: view, metadata: {}});

        assert.equal(view.getDialogResult(), DialogResult.none);

        // When
        cancelAction.execute();

        // Then
        assert.equal(view.getDialogResult(), DialogResult.canceled, 'DialogResult should be canceled');
    });
});
describe('DeleteAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();
        var dataSource = new ObjectDataSource({ name: 'SomeDS', view: view });

        view.getDataSources().push(dataSource);

        var metadata = {
            DeleteAction: {
                Accept: false,
                DestinationValue: {
                    Source: 'SomeDS'
                }
            }
        };

        // When
        var deleteAction = builder.build(metadata, {parentView: view});

        // Then
        assert.isNotNull( deleteAction );
        assert.isNotNull( deleteAction.execute, 'action should have execute' );
    });

    it('should delete selected item from ObjectDataSource', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();
        var dataSource = new ObjectDataSource({ name: 'SomeDS', view: view });

        var items = [
            {
                Name: 'First'
            },
            {
                Name: 'Second'
            },
            {
                Name: 'Third'
            }
        ];
        var index = 1;

        dataSource.setItems(_.clone(items));

        view.getDataSources().push(dataSource);

        var metadata = {
            DeleteAction: {
                Accept: false,
                DestinationValue: {
                    Source: 'SomeDS',
                    Property: index.toString()
                }
            }
        };

        var deleteAction = builder.build(metadata, {parentView: view});

        assert.equal(dataSource.getItems().length, 3);

        // When
        deleteAction.execute();

        // Then
        assert.equal(dataSource.getItems().length, 2);
        assert.notInclude(dataSource.getItems(), items[index]);
    });

    it('should delete selected item from DocumentDataSource', function (done) {
        // Given
        window.providerRegister.register('DocumentDataSource', FakeDataProvider);

        var view = new View();
        var builder = new ApplicationBuilder();
        var dataSource = builder.buildType('DocumentDataSource', {}, {parent: view, parentView: view, builder: builder});

        view.getContext().dataSources['DocumentDataSource'] = dataSource;

        var metadata = {
            DeleteAction: {
                Accept: false,
                DestinationValue: {
                    Source: 'DocumentDataSource',
                    Property: '$'
                }
            }
        };

        var deleteAction = builder.build(metadata, {parentView: view});

        dataSource.updateItems(
            function(){
                var initCount = dataSource.getItems().length;
                var initSelectedItem = dataSource.getSelectedItem();

                // When
                deleteAction.execute();

                // Then
                assert.equal(dataSource.getItems().length, (initCount - 1) );
                assert.notInclude(dataSource.getItems(), initSelectedItem);
                done();
            }
        );
    });
});
describe('EditAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();
        var dataSource = new ObjectDataSource({ name: 'SomeDS', view: view });

        view.getDataSources().push(dataSource);

        var metadata = {
            EditAction: {
                LinkView: {
                    InlineView: {

                    }
                },
                DestinationValue: {
                    Source: 'SomeDS'
                },
                SourceValue: {
                    Source: 'EditDS'
                }
            }
        };

        // When
        var editAction = builder.build(metadata, {parentView: view});

        // Then
        assert.isNotNull( editAction );
        assert.isNotNull( editAction.execute, 'action should have execute' );
    });

    it('should edit item from ObjectDataSource', function (done) {
        // Given
        var metadata = {
            "Text": 'Parent View',
            "DataSources": [
                {
                    "ObjectDataSource": {
                        "Name": "ObjectDataSource",
                        "IsLazy": false,
                        "Items": [
                            {
                                "Name": "OldValue"
                            }
                        ]
                    }
                }
            ],
            "Items": [{
                "Button": {
                    "Name": "EditButton",
                    "Action": {
                        "EditAction": {
                            "DestinationValue": {
                                "Source": "ObjectDataSource",
                                "Property": "0"
                            },
                            "SourceValue": {
                                "Source": "MainDataSource"
                            },
                            "LinkView": {
                                "InlineView": {
                                    "OpenMode": "Dialog",
                                    "View": {
                                        "Text": "Edit",
                                        "Name": "EditView",
                                        "DataSources": [
                                            {
                                                "ObjectDataSource": {
                                                    "Name": "MainDataSource"
                                                }
                                            }
                                        ],
                                        "Items": [
                                            {
                                                "Button": {
                                                    "Name": "AcceptBtn",
                                                    "Action": {
                                                        "AcceptAction": {
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(metadata, function(view){
            var edtBtn = view.context.controls['EditButton'];
            var destinationDS = view.context.dataSources['ObjectDataSource'];

            assert.equal(destinationDS.getItems()[0].Name, "OldValue");

            // When
            edtBtn.click();

            var childView = view.context.controls['EditView'];
            var sourceDS = childView.context.dataSources['MainDataSource'];
            var acceptBtn = childView.context.controls['AcceptBtn'];

            var selectedItem = sourceDS.getSelectedItem();
            selectedItem.Name = "NewValue";
            sourceDS.setSelectedItem(selectedItem);

            acceptBtn.click();

            // Then
            assert.equal(destinationDS.getItems()[0].Name, "NewValue");

            done();
        });
    });

    it('should edit item from DocumentDataSource', function (done) {
        // Given
        window.providerRegister.register('DocumentDataSource', StaticFakeDataProvider);

        var metadata = {
            "Text": 'Parent View',
            "DataSources": [
                {
                    "DocumentDataSource": {
                        "Name": "DocumentDataSource",
                        "IsLazy": false
                    }
                }
            ],
            "Items": [{
                "Button": {
                    "Name": "EditButton",
                    "Action": {
                        "EditAction": {
                            "DestinationValue": {
                                "Source": "DocumentDataSource",
                                "Property": "0"
                            },
                            "SourceValue": {
                                "Source": "MainDataSource"
                            },
                            "LinkView": {
                                "InlineView": {
                                    "OpenMode": "Dialog",
                                    "View": {
                                        "Text": "Edit",
                                        "Name": "EditView",
                                        "DataSources": [
                                            {
                                                "DocumentDataSource": {
                                                    "Name": "MainDataSource"
                                                }
                                            }
                                        ],
                                        "Items": [
                                            {
                                                "Button": {
                                                    "Name": "SaveBtn",
                                                    "Action": {
                                                        "SaveAction": {
                                                            "DestinationValue": {
                                                                "Source": "MainDataSource"
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(metadata, function(view){
            view.context.dataSources.DocumentDataSource.updateItems(
                function(){
                    var edtBtn = view.context.controls['EditButton'];
                    var destinationDS = view.context.dataSources.DocumentDataSource;

                    assert.isUndefined(destinationDS.getSelectedItem().isNewValueForTest);

                    // When
                    edtBtn.click();

                    var childView = view.context.controls['EditView'];
                    var sourceDS = childView.context.dataSources['MainDataSource'];
                    var saveBtn = childView.context.controls['SaveBtn'];

                    // что если setSelectedItem сработает раньше? мб лучше setTimeout?
                    sourceDS.onSelectedItemChanged( function() {
                        var editItem = sourceDS.getSelectedItem();
                        editItem.isNewValueForTest = true;
                        sourceDS.setSelectedItem( editItem );

                        saveBtn.click();

                        // Then
                        setTimeout(function(){
                            assert.isTrue(destinationDS.getSelectedItem().isNewValueForTest);
                            done();
                        }, 250);
                    });
                }
            );
        });
    });

    it('should not open edit view if edit item is null', function (done) {
        // Given
        var metadata = {
            "Text": 'Parent View',
            "DataSources": [
                {
                    "ObjectDataSource": {
                        "Name": "ObjectDataSource",
                        "IsLazy": false,
                        "Items": [
                        ]
                    }
                }
            ],
            "Items": [{
                "Button": {
                    "Name": "EditButton",
                    "Action": {
                        "EditAction": {
                            "DestinationValue": {
                                "Source": "ObjectDataSource",
                                "Property": "$"
                            },
                            "SourceValue": {
                                "Source": "MainDataSource"
                            },
                            "LinkView": {
                                "InlineView": {
                                    "OpenMode": "Dialog",
                                    "View": {
                                        "Text": "Edit",
                                        "Name": "EditView",
                                        "DataSources": [
                                            {
                                                "ObjectDataSource": {
                                                    "Name": "MainDataSource"
                                                }
                                            }
                                        ],
                                        "Items": [
                                            {
                                                "Button": {
                                                    "Name": "AcceptBtn",
                                                    "Action": {
                                                        "AcceptAction": {
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(metadata, function(view){
            var edtBtn = view.context.controls['EditButton'];

            // When
            edtBtn.click();

            var childView = view.context.controls['EditView'];

            // Then
            assert.isTrue( childView.isRemoved );

            done();
        });
    });

});
describe('OpenAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();
        var metadata = {
            OpenAction: {
                LinkView: {
                    InlineView: {

                    }
                }
            }
        };

        // When
        var openAction = builder.build(metadata, {parentView: view});

        // Then
        assert.isNotNull( openAction );
        assert.isNotNull( openAction.execute, 'action should have execute' );
    });

    it('open view', function (done) {
        // Given
        var metadata = {
            "Text": 'Parent View',
            "Items": [{

                "Button": {
                    "Name": "OpenViewButton",
                    "Action": {
                        "OpenAction": {
                            "LinkView": {
                                "InlineView": {
                                    "View": {
                                        "Text": "Child View",
                                        "Name": "ChildView"
                                    },
                                    "OpenMode": "Dialog"
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(metadata, function(view){
            var btn = view.context.controls['OpenViewButton'];

            // When
            btn.click();

            // Then
            var childView = view.context.controls['ChildView'];
            var viewIsOpened = childView.isLoaded();

            assert.isTrue(viewIsOpened);
            childView.close();
            done();
        });
    });

});
/*describe('PrintReportAction', function () {
    it('should be render', function () {
        var view = new View();
        var metadata = {
            Button: {
                Action: {
                    PrintReportAction: {
                        Configuration: "EmergencyRoom",
                        Template: "MedicalHistoryReport",
                        Parameters: [
                            {
                                Name: "HospitalizationId",
                                Value: "4427715e-1f73-4077-a58b-9be70c502287"
                            }
                        ],
                        FileFormat: 0
                    }
                }
            }
        };
        var printBuilder = new ApplicationBuilder();
        var el = printBuilder.build(view, metadata);
        var action = el.getAction();

        assert.isNotNull(el);
        assert.isNotNull(el.execute);
        assert.equal('BaseAction', action.constructor.name);
    });
});*/
describe('SaveAction', function () {
    function createViewWithDataSource(dataSourceName){
        var view = new View();
        var dataSource = new ObjectDataSource({ name: dataSourceName, view: view });

        view.getDataSources().push(dataSource);

        return view;
    }

    it('successful build', function () {
        // Given
        var view = createViewWithDataSource('MainDS');
        var builder = new ApplicationBuilder();
        var metadata = {
            SaveAction: {
                DestinationValue: {
                    Source: 'MainDS'
                }
            }
        };

        // When
        var saveAction = builder.build(metadata, {parentView: view});

        // Then
        assert.isNotNull( saveAction );
        assert.isNotNull( saveAction.execute, 'action should have execute' );
    });

    it('should close view and set DialogResult', function (done) {
        // Given
        var view = createViewWithDataSource('MainDS');
        var builder = new SaveActionBuilder();

        view.onClosed(function(){
            //Then
            assert.equal(view.getDialogResult(), DialogResult.accepted, 'should set DialogResult');
            done();
        });

        var metadata = {
            DestinationValue: {
                Source: 'MainDS'
            }
        };

        var saveAction = builder.build(null, {parentView: view, metadata: metadata});

        // When
        saveAction.execute();
    });

    it('should not close view when CanClose is false', function () {
        // Given
        var view = createViewWithDataSource('MainDS');
        var builder = new SaveActionBuilder();

        view.onClosed(function(){
            assert.notOk('view was close');
        });

        var metadata = {
            DestinationValue: {
                Source: 'MainDS'
            },
            CanClose: false
        };

        var saveAction = builder.build(null, {parentView: view, metadata: metadata});

        // When
        saveAction.execute();

        // Then
        assert.equal(view.getDialogResult(), DialogResult.none, 'should not set DialogResult');
    });
});
describe('SelectAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();

        var metadata = {
            SelectAction: {
                LinkView: {
                    ExistsView: {
                    }
                },
                SourceValue: {
                    Source: 'FirstDS',
                    Property: 'Name'
                },
                DestinationValue: {
                    Source: 'SecondDS',
                    Property: 'Name'
                }
            }
        };

        // When
        var selectAction = builder.build(metadata, {parentView: view});

        // Then
        assert.isNotNull( selectAction );
        assert.isNotNull( selectAction.execute, 'action should have execute' );
    });

    it('should set selected item if dialog result is accepted', function (done) {
        // Given
        var viewMetadata = {
            "Text": 'Parent View',
            "DataSources": [
                {
                    "ObjectDataSource": {
                        "Name": "ObjectDataSource",
                        "IsLazy": false,
                        "Items": [
                            {
                                SelectedObject: "empty"
                            }
                        ]
                    }
                }
            ],
            "Items": [{
                "Button": {
                    "Name": "SelectButton",
                    "Action": {
                        "SelectAction": {
                            "DestinationValue": {
                                "Source": "ObjectDataSource",
                                "Property": "$.SelectedObject"
                            },
                            "SourceValue": {
                                "Source": "MainDataSource",
                                "Property": "$"
                            },
                            "LinkView": {
                                "InlineView": {
                                    "OpenMode": "Dialog",
                                    "View": {
                                        "Name": "SelectView",
                                        "DataSources": [
                                            {
                                                "ObjectDataSource": {
                                                    "Name": "MainDataSource",
                                                    "IsLazy": false,
                                                    "Items": [
                                                        {
                                                            "Name": "first"
                                                        },
                                                        {
                                                            "Name": "second"
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        "Items": [
                                            {
                                                "Button": {
                                                    "Name": "AcceptBtn",
                                                    "Action": {
                                                        "AcceptAction": {
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(viewMetadata, function(view){
            var selectBtn = view.context.controls['SelectButton'];
            var destinationDS = view.context.dataSources['ObjectDataSource'];

            assert.equal(destinationDS.getSelectedItem().SelectedObject, "empty");

            // When
            selectBtn.click();

            var childView = view.context.controls['SelectView'];
            var sourceDS = childView.context.dataSources['MainDataSource'];
            var acceptBtn = childView.context.controls['AcceptBtn'];

            var selectedValue = sourceDS.getItems()[1];
            sourceDS.setSelectedItem(selectedValue);

            acceptBtn.click();

            // Then
            assert.deepEqual(destinationDS.getSelectedItem().SelectedObject, selectedValue);

            done();
        });
    });

    it('should not set selected item if dialog result is cancel', function (done) {
        // Given
        // todo: выяснить почему, если вынести viewMetadata из этого и предыдущего тестов, то они работают с одной и той же view
        var viewMetadata = {
            "Text": 'Parent View',
            "DataSources": [
                {
                    "ObjectDataSource": {
                        "Name": "ObjectDataSource",
                        "IsLazy": false,
                        "Items": [
                            {
                                SelectedObject: "empty"
                            }
                        ]
                    }
                }
            ],
            "Items": [{
                "Button": {
                    "Name": "SelectButton",
                    "Action": {
                        "SelectAction": {
                            "DestinationValue": {
                                "Source": "ObjectDataSource",
                                "Property": "$.SelectedObject"
                            },
                            "SourceValue": {
                                "Source": "MainDataSource",
                                "Property": "$"
                            },
                            "LinkView": {
                                "InlineView": {
                                    "OpenMode": "Dialog",
                                    "View": {
                                        "Name": "SelectView",
                                        "DataSources": [
                                            {
                                                "ObjectDataSource": {
                                                    "Name": "MainDataSource",
                                                    "IsLazy": false,
                                                    "Items": [
                                                        {
                                                            "Name": "first"
                                                        },
                                                        {
                                                            "Name": "second"
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        "Items": [
                                            {
                                                "Button": {
                                                    "Name": "AcceptBtn",
                                                    "Action": {
                                                        "AcceptAction": {
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        };

        testHelper.applyViewMetadata(viewMetadata, function(view){
            var selectBtn = view.context.controls['SelectButton'];
            var destinationDS = view.context.dataSources['ObjectDataSource'];

            assert.equal(destinationDS.getSelectedItem().SelectedObject, "empty");

            // When
            selectBtn.click();

            var childView = view.context.controls['SelectView'];
            var sourceDS = childView.context.dataSources['MainDataSource'];
            var acceptBtn = childView.context.controls['AcceptBtn'];

            var selectedValue = sourceDS.getItems()[1];
            sourceDS.setSelectedItem(selectedValue);

            childView.close();

            // Then
            assert.equal(destinationDS.getSelectedItem().SelectedObject, "empty");

            done();
        });
    });
});
describe('UpdateAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var dataSource = new ObjectDataSource({ name: 'MainDS', view: view });
        var builder = new ApplicationBuilder();

        view.getDataSources().push(dataSource);

        var metadata = {
            UpdateAction: {
                DestinationValue: {
                    Source: 'MainDS'
                }
            }
        };

        // When
        var updateAction = builder.build(metadata, {parentView: view});

        // Then
        assert.isNotNull( updateAction );
        assert.isNotNull( updateAction.execute, 'action should have execute' );
    });

    it('should update DataSource', function () {
        // Given
        var view = new View();
        var dataSource = new ObjectDataSource({ name: 'MainDS', view: view });
        var builder = new UpdateActionBuilder();

        window.dsWasUpdated = false;

        view.getDataSources().push(dataSource);
        dataSource.onItemsUpdated(function(){
            window.dsWasUpdated = true;
        });

        var metadata = {
            DestinationValue: {
                Source: 'MainDS'
            }
        };

        var updateAction = builder.build(null, {parentView: view, metadata: metadata});

        assert.isFalse(window.dsWasUpdated, 'initial data is invalid');

        // When
        updateAction.execute();

        // Then
        assert.isTrue(window.dsWasUpdated, 'ds should be update');
    });
});
describe('Builder', function () {
    var builder;

    beforeEach(function () {
        builder = new Builder();
    });

    describe('build', function () {
        it('should return null if no builder found', function () {
            var view = builder.buildType('IncorrectType', null, {parentView: fakeView()});

            assert.isNull(view);
        });

        it('should find builder by metadataValue if no metadataType passed', function () {
            var viewFactory = function () {
                return 42;
            };

            builder.register('TextBox', { build: viewFactory});
            assert.equal(builder.build({ TextBox: {} }), 42);
        });

        it('should pick concrete value from metadata if no metadataType passed', function () {
            var viewBuilder = {
                build: function (context, args) {
                    assert.isNotNull(args.metadata.Name);
                    assert.isNotNull(args.metadata.Multiline);

                    assert.equal(args.metadata.Name, 'TextBox');
                    assert.isTrue(args.metadata.Multiline);
                }
            };

            builder.register('TextBox', viewBuilder);
            builder.build(null, { metadata: { TextBox: { Name: 'TextBox', Multiline: true } } });
        });
    });

    describe('register', function () {
        it('should have builder after register', function () {
            var viewFactory = function () {
                return 42;
            };
            builder.register('TextBox', { build: viewFactory});

            assert.equal(builder.buildType('TextBox', null, { parentView: fakeView() }), 42);
        });
    });
});
describe('ButtonControl', function () {
    describe('render', function () {
        var builder = new ApplicationBuilder()
            , button;

        beforeEach(function () {
            button = builder.buildType('Button', {});
        });

        it('should render button with correct class', function () {
            //Given
            button.setText('Click me!');

            //When
            var $el = button.render();

            //Then
            assert.isTrue($el.hasClass('pl-button'));
            assert.equal($.trim($el.text()), 'Click me!');
        });
    });
});
describe('CheckBox', function () {
    var checkbox;

    beforeEach(function () {
        checkbox = new CheckBox();
    });

    describe('Render', function () {

        describe('Setting the properties', function () {

            it('Setting property: visible', function () {
                //Given
                var $el = checkbox.render();
                assert.isFalse($el.hasClass('hidden'));

                //When
                checkbox.setVisible(false);

                //Then
                assert.isTrue($el.hasClass('hidden'));
            });

            it('Setting property: text', function () {
                //Given
                checkbox.setText('Text 1');

                var $el = checkbox.render(),
                    $label = $('.checkbox-label', $el);

                assert.equal($label.html(), 'Text 1');

                //When
                checkbox.setText('Text 2');

                //Then
                assert.equal($label.html(), 'Text 2');
            });

            it('Setting property: Enabled', function () {
                //Given
                var $el = checkbox.render(),
                    $input = $('input', $el);

                assert.equal($input.prop('disabled'), false, 'Enabled by default');

                //When
                checkbox.setEnabled(false);

                //Then
                assert.equal($input.prop('disabled'), true, 'Disable element');
            });

        });

        describe('events', function () {
            it('Change value on click', function () {
                //Given
                var $el = checkbox.render(),
                    $input = $('input', $el);

                checkbox.setValue(false);

                //When
                $input.click();

                //Then
                assert.equal(checkbox.getValue(), true, 'value changed');
                assert.equal($input.prop('checked'), true, 'checkbox checked');
            });
        });

    });

});

describe('ComboBox', function () {

    describe('render', function () {

        it('ValueSelector', function () {
            // Given
            var metadata = {
                "Text": 'Пациенты',
                "Scripts": [
                    {
                        "Name": "ValueSelector1",
                        "Body": "return {Id: args.value.Id, DisplayName: args.value.Display};"
                    }
                ],
                "DataSources": [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE", "State": "New"},
                                {"Id": 2, "Display": "2G", "State": "Deprecated"},
                                {"Id": 3, "Display": "3G", "State": "Deprecated"}
                            ]
                        }
                    }, {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                {"Value": {"Id": 2, "DisplayName": "2G"}}
                            ]
                        }
                    }
                ],
                "Items": [{

                    ComboBox: {
                        "LabelText": "Combobox Label",
                        "ItemTemplate": {
                            "Label": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "#.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "ValueSelector": "ValueSelector1",
                        "ValueFormat": "{Id} - {DisplayName}",
                        "MultiSelect": false,
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "Value"
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var $label = $layout.find('.pl-combobox > .pl-control-label'),
                    $value = $layout.find('.pl-combobox__value');


                assert.equal($label.text(), 'Combobox Label');
                assert.equal($value.length, 1);
                assert.equal($value.find('.pl-label').text(), '2 - 2G');
            }
        });

        it('ValueSelector multiselect', function () {
            // Given
            var metadata = {
                "Text": 'Пациенты',
                "Scripts": [
                    {
                        "Name": "ValueSelector1",
                        "Body": "return {Id: args.value.Id, DisplayName: args.value.Display};"
                    }
                ],
                "DataSources": [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE", "State": "New"},
                                {"Id": 2, "Display": "2G", "State": "Deprecated"},
                                {"Id": 3, "Display": "3G", "State": "Deprecated"}
                            ]
                        }
                    }, {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                {"Value": [
                                    {"Id": 2, "DisplayName": "2G"},
                                    {"Id": 3, "DisplayName": "3G"}
                                ]}
                            ]
                        }
                    }
                ],
                "Items": [{

                    ComboBox: {
                        "LabelText": "Combobox Label",
                        "ItemTemplate": {
                            "Label": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "#.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "ValueSelector": "ValueSelector1",
                        "ValueFormat": "{Id} - {DisplayName}",
                        "MultiSelect": true,
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "Value"
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var $label = $layout.find('.pl-combobox > .pl-control-label'),
                    $value = $layout.find('.pl-combobox__value');

                assert.equal($label.text(), 'Combobox Label');
                assert.equal($value.find('.pl-label').text(), '2 - 2G3 - 3G');
            }
        });

        it('ValueTemplate', function () {
            // Given
            var metadata = {
                "Text": 'Пациенты',
                "DataSources": [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE", "State": "New"},
                                {"Id": 2, "Display": "2G", "State": "Deprecated"},
                                {"Id": 3, "Display": "3G", "State": "Deprecated"}
                            ]
                        }
                    }, {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                {"Value": {"Id": 2, "Display": "2G","State": "Deprecated"}}
                            ]
                        }
                    }
                ],
                "Items": [{

                    ComboBox: {
                        "LabelText": "Combobox Label",
                        "ItemTemplate": {
                            "Label": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "#.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "ValueTemplate": {
                            "StackPanel": {
                                "Orientation": "Horizontal",
                                "Items": [
                                    {
                                        "Label": {
                                            "HorizontalAlignment": "Left",
                                            "Value": {
                                                "Source": "ObjectDataSource2",
                                                "Property": "$.Value.Display"
                                            }
                                        }
                                    },
                                    {
                                        "Label": {
                                            "HorizontalAlignment": "Left",
                                            "Value": {
                                                "Source": "ObjectDataSource2",
                                                "Property": "$.Value.Id"
                                            }
                                        }
                                    }
                                ]
                            }

                        },
                        "MultiSelect": false,
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var $label = $layout.find('.pl-combobox > .pl-control-label'),
                    $value = $layout.find('.pl-combobox__value');

                assert.equal($label.text(), 'Combobox Label');
                assert.equal($value.find('.pl-label').text(), '2G2');
            }
        });

        it('ValueTemplate multiselect', function () {
            // Given
            var metadata = {
                "Text": 'Пациенты',
                "DataSources": [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE", "State": "New"},
                                {"Id": 2, "Display": "2G", "State": "Deprecated"},
                                {"Id": 3, "Display": "3G", "State": "Deprecated"}
                            ]
                        }
                    }, {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                {"Value": [
                                    {"Id": 2, "Display": "2G","State": "Deprecated"},
                                    {"Id": 3, "Display": "3G", "State": "Deprecated"}
                                ]}
                            ]
                        }
                    }
                ],
                "Items": [{

                    ComboBox: {
                        "LabelText": "Combobox Label",
                        "ItemTemplate": {
                            "Label": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "#.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "ValueTemplate": {
                            "StackPanel": {
                                "Orientation": "Horizontal",
                                "Items": [
                                    {
                                        "Label": {
                                            "HorizontalAlignment": "Left",
                                            "Value": {
                                                "Source": "ObjectDataSource2",
                                                "Property": "Value.#.Display"
                                            }
                                        }
                                    },
                                    {
                                        "Label": {
                                            "HorizontalAlignment": "Left",
                                            "Value": {
                                                "Source": "ObjectDataSource2",
                                                "Property": "Value.#.Id"
                                            }
                                        }
                                    }
                                ]
                            }

                        },
                        "MultiSelect": true,
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var $label = $layout.find('.pl-combobox > .pl-control-label'),
                    $value = $layout.find('.pl-combobox__value');

                assert.equal($label.text(), 'Combobox Label');
                assert.equal($value.find('.pl-label').text(), '2G23G3');
            }
        });

        //it('debug', function () {
        //    // Given
        //    var metadata = {
        //        "Text": 'Пациенты',
        //        "Scripts": [
        //            {
        //                "Name": "ValueSelector1",
        //                "Body": "return typeof args.value === 'undefined' ? null : {Id: args.value.Id, DisplayName: args.value.Display};"
        //            }
        //        ],
        //        "DataSources": [
        //            {
        //                ObjectDataSource: {
        //                    "Name": "ObjectDataSource1",
        //                    "Items": [
        //                        {"Id": 1, "Display": "LTE", "State": "New"},
        //                        {"Id": 2, "Display": "2G", "State": "Deprecated"},
        //                        {"Id": 3, "Display": "3G", "State": "Deprecated"}
        //                    ]
        //                }
        //            }, {
        //                ObjectDataSource: {
        //                    "Name": "ObjectDataSource2",
        //                    "~Items": [
        //                        {"Value": [{"Id": 2, "DisplayName": "2G"}]}
        //                    ],
        //                    "Items": [
        //                        {"Value": {"Id": 2, "DisplayName": "2G"}}
        //                    ]
        //                }
        //            }
        //        ],
        //        "Items": [{
        //
        //            ComboBox: {
        //                "~LabelText": "Combobox Label",
        //                "ItemTemplate": {
        //                    "Label": {
        //                        "Name": "TextBox1",
        //                        "Value": {
        //                            "PropertyBinding": {
        //                                "Source": "ObjectDataSource1",
        //                                "Property": "$.Display"
        //                            }
        //                        }
        //                    }
        //                },
        //                "GroupItemTemplate": {
        //                    "Label": {
        //                        "Value": {
        //                            "PropertyBinding": {
        //                                "Source": "ObjectDataSource1",
        //                                "Property": "$.State"
        //                            }
        //                        }
        //                    }
        //                },
        //                "~GroupValueProperty": "State",
        //                "Items": {
        //                    "PropertyBinding": {
        //                        "Source": "ObjectDataSource1",
        //                        "Property": ""
        //                    }
        //                },
        //                "ValueSelector": "ValueSelector1",
        //                "~ValueProperty": "DisplayName",
        //                "ValueFormat": "{Id} - {DisplayName}",
        //                "~ValueTemplate": {
        //                    "StackPanel": {
        //                        "Orientation": "Horizontal",
        //                        "Items": [
        //                            {
        //                                "Label": {
        //                                    "HorizontalAlignment": "Left",
        //                                    "Value": {
        //                                        "PropertyBinding": {
        //                                            "Source": "ObjectDataSource2",
        //                                            "Property": "Value.$.Display"
        //                                        }
        //                                    }
        //                                }
        //                            },
        //                            {
        //                                "Label": {
        //                                    "HorizontalAlignment": "Left",
        //                                    "Value": {
        //                                        "PropertyBinding": {
        //                                            "Source": "ObjectDataSource2",
        //                                            "Property": "Value.$.Id"
        //                                        }
        //                                    }
        //                                }
        //                            }
        //                        ]
        //                    }
        //
        //                },
        //                "MultiSelect": false,
        //                "Value": {
        //                    "PropertyBinding": {
        //                        "Source": "ObjectDataSource2",
        //                        "Property": "$.Value"
        //                    }
        //                }
        //            }
        //        }]
        //    };
        //
        //
        //    // When
        //    applyViewMetadata(metadata, onViewReady);
        //
        //    // Then
        //    function onViewReady(view, $layout) {
        //        //$layout.detach();
        //
        //        //var $items = $layout.find('.pl-listbox-i'),
        //        //    $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');
        //
        //        //assert.lengthOf($chosen, 1, 'length of chosen item is right');
        //        //assert.equal($items.index($chosen), 1, 'index of chosen item is right');
        //    }
        //});

    });

});
describe('Container (Control)', function () {

    describe('StackPanel as exemplar of Container', function () {

        it('should render stackPanel with templating items', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                { "Id": 1, "Display": "LTE" },
                                { "Id": 2, "Display": "3G" },
                                { "Id": 3, "Display": "2G" }
                            ]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "#.Display"
                                }
                            }
                        },
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        }
                    }
                }]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($layout.find('.pl-text-box-input'), 3, 'length of rendered textbox');
                assert.equal($layout.find('.pl-text-box-input:first').val(), 'LTE', 'binding in itemTemplate is right');
            }
        });


        it('should render stackPanel with not templating items', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                { "Id": 1, "Display": "LTE" },
                                { "Id": 2, "Display": "3G" },
                                { "Id": 3, "Display": "2G" }
                            ]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "Items" : [
                            {
                                "TextBox": {
                                    "Name": "TextBox1",
                                    "Value": {
                                        "Source": "ObjectDataSource1",
                                        "Property": "Display"
                                    }
                                }
                            },{
                                "TextBox": {
                                    "Name": "TextBox2",
                                    "Value": {
                                        "Source": "ObjectDataSource1",
                                        "Property": "Id"
                                    }
                                }
                            }
                        ]
                    }
                }]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-stack-panel-i'), 2, 'length of rendered stackPanel');
                assert.lengthOf($layout.find('.pl-text-box-input'), 2, 'length of rendered textbox');
                assert.equal($layout.find('.pl-text-box-input:first').val(), 'LTE', 'binding in itemTemplate is right');
            }
        });


        it('should render stackPanel with simple items', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                "LTE",
                                "3G",
                                "2G"
                            ]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        }
                    }
                }]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($layout.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($layout.find('.pl-label').first().text(), 'LTE', 'content of first element is right');
            }
        });


        it('should render stackPanel with property items', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {
                                    Name: {Temp: "LTE"}
                                },
                                {
                                    Name: {Temp: "3G"}
                                },
                                {
                                    Name: {Temp: "2G"}
                                }
                            ]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "ItemProperty": "Name.Temp",
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($layout.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($layout.find('.pl-label').first().text(), 'LTE', 'content of first element is right');
            }
        });



        it('should render stackPanel with formatting items', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {
                                    Name: {Temp: "LTE"}
                                },
                                {
                                    Name: {Temp: "3G"}
                                },
                                {
                                    Name: {Temp: "2G"}
                                }
                            ]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "ItemFormat": "Connect: {Name.Temp}",
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        }
                    }
                }]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($layout.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($layout.find('.pl-label').first().text(), 'Connect: LTE', 'content of first element is right');
            }
        });


        it('should render stackPanel with selector items', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {
                                    Name: {Temp: "LTE"}
                                },
                                {
                                    Name: {Temp: "3G"}
                                },
                                {
                                    Name: {Temp: "2G"}
                                }
                            ]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "ItemSelector":{
                            Name: 'GetTitle'
                        },
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        }
                    }
                }],

                Scripts: [
                    {
                        Name: 'GetTitle',
                        Body: "return '!! ' + args.value.Name.Temp;"
                    }
                ]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($layout.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($layout.find('.pl-label').first().text(), '!! LTE', 'content of first element is right');
            }
        });


        it('should stackPanel has child and parent (templating items)', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                { "Id": 1, "Display": "LTE" },
                                { "Id": 2, "Display": "3G" },
                                { "Id": 3, "Display": "2G" }
                            ]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "#.Display"
                                }
                            }
                        },
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        }
                    }
                }]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                var stackPanel = view.getContext().controls['MainViewPanel'];

                assert.instanceOf(stackPanel.getParent(), View, 'stackPanel parent is View');
                assert.lengthOf(stackPanel.getChildElements(), 3, 'length of stackPanel children is right');
                assert.equal(stackPanel.getChildElements()[0].getParent(), stackPanel, 'child of stackPanel has parent - stackPanel');

                // When
                var ds = view.getContext().dataSources['ObjectDataSource1'],
                    items = ds.getItems();

                items.reverse();

                ds.setItems(items);
                ds.updateItems();

                // Then
                assert.lengthOf(stackPanel.getChildElements(), 3, 'length of stackPanel children is right (after updating items)');
            }
        });

        it('should stackPanel working with relative binding', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [{
                                "It": [{ "Id": 1, "Display": "LTE" },
                                    { "Id": 2, "Display": "3G" },
                                    { "Id": 3, "Display": "2G" }
                                ]
                            }]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "@.#.Display"
                                }
                            }
                        },
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": "$.It"
                        }
                    }
                }]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-text-box-input'), 3, 'count of textboxes is right');
                assert.equal($layout.find('.pl-text-box-input:first').val(), 'LTE', 'value in first textbox is right');
                assert.equal($layout.find('.pl-text-box-input:last').val(), '2G', 'value in last textbox is right');
            }
        });

        it('should stackPanel working with deep relative binding', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [{
                                "It": [{
                                        id: 1,
                                        subIt: [{ "Id": 1, "Display": "LTE" },
                                            { "Id": 2, "Display": "3G" },
                                            { "Id": 3, "Display": "2G" }]
                                    },{
                                        id: 2,
                                        subIt: [{ "Id": 1, "Display": "LTE-2" },
                                            { "Id": 2, "Display": "3G-2" },
                                            { "Id": 3, "Display": "2G-2" }]
                                    }
                                ]
                            }]
                        }
                    }
                ],
                Items: [{

                    StackPanel: {
                        Name: 'MainViewPanel',
                        "ItemTemplate": {
                            "StackPanel": {
                                "Items" : [
                                    {
                                        "Label":{
                                            "Value":{
                                                "Source": "ObjectDataSource1",
                                                "Property": "@.#.id"
                                            }
                                        }
                                    },
                                    {
                                        "StackPanel": {
                                            "Items" : {
                                                "Source": "ObjectDataSource1",
                                                "Property": "@.#.subIt"
                                            },
                                            "ItemTemplate":{
                                                "TextBox": {
                                                    "Name": "TextBox1",
                                                    "Value": {
                                                        "Source": "ObjectDataSource1",
                                                        "Property": "@.#.Display"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }

                        },
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": "$.It"
                        }
                    }
                }]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                //$layout.detach();

                assert.lengthOf($layout.find('.pl-text-box-input'), 6, 'count of textboxes is right');
                assert.equal($layout.find('.pl-text-box-input:first').val(), 'LTE', 'value in first textbox is right');
                assert.equal($layout.find('.pl-text-box-input:last').val(), '2G-2', 'value in last textbox is right');
            }
        });
    });



    describe('ListBox as exemplar of Container', function (){

        it('should render listBox without grouping', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                { "Id": 1, "Display": "LTE" },
                                { "Id": 2, "Display": "2G" },
                                { "Id": 3, "Display": "2G" }
                            ]
                        }
                    }
                ],
                Items: [{

                    ListBox: {
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "#.Display"
                                }
                            }
                        },
                        "Items" : {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                assert.lengthOf($layout.find('.pl-listbox-body'), 3, 'length of rendered listbox');
                assert.equal($layout.find('.pl-text-box-input').first().val(), 'LTE', 'value in template is right');
            }
        });

    });

    it('should render listBox with grouping (with template group title)', function () {
        // Given
        var metadata = {
            Text: 'Пациенты',
            DataSources : [
                {
                    ObjectDataSource: {
                        "Name": "ObjectDataSource1",
                        "Items": [
                            { "Id": 1, "Display": "LTE" },
                            { "Id": 2, "Display": "2G" },
                            { "Id": 3, "Display": "2G" }
                        ]
                    }
                }
            ],
            Items: [{

                StackPanel: {
                    Name: 'MainViewPanel',
                    "Items" : [
                        {
                            ListBox: {
                                "ItemTemplate": {
                                    "TextBox": {
                                        "Name": "TextBox1",
                                        "Value": {
                                            "Source": "ObjectDataSource1",
                                            "Property": "#.Display"
                                        }
                                    }
                                },
                                "GroupItemTemplate": {
                                    "Label": {
                                        "Value": {
                                            "Source": "ObjectDataSource1",
                                            "Property": "#.Display"
                                        }
                                    }
                                },
                                "GroupValueProperty": "Display",
                                "Items" : {
                                    "Source": "ObjectDataSource1",
                                    "Property": ""
                                }
                            }
                        }
                    ]
                }
            }]
        };


        // When
        testHelper.applyViewMetadata(metadata, onViewReady);

        // Then
        function onViewReady(view, $layout){
            $layout.detach();

            assert.lengthOf($layout.find('.pl-listbox-body'), 3, 'length of rendered listbox is right');
            assert.lengthOf($layout.find('.pl-listbox-group-i'), 2, 'length of rendered group is right');
            assert.equal($layout.find('.pl-text-box-input').first().val(), 'LTE', 'value in template is right');
            assert.equal($.trim( $layout.find('.pl-listbox-group-title').last().text() ), '2G', 'group value in template is right');
        }
    });


    it('should render listBox with grouping (with format group title)', function () {
        // Given
        var metadata = {
            Text: 'Пациенты',
            DataSources : [
                {
                    ObjectDataSource: {
                        "Name": "ObjectDataSource1",
                        "Items": [
                            { "Id": 1, "Display": "LTE" },
                            { "Id": 2, "Display": "2G" },
                            { "Id": 3, "Display": "2G" }
                        ]
                    }
                }
            ],
            Items: [{

                StackPanel: {
                    Name: 'MainViewPanel',
                    "Items" : [
                        {
                            ListBox: {
                                "ItemTemplate": {
                                    "TextBox": {
                                        "Name": "TextBox1",
                                        "Value": {
                                            "Source": "ObjectDataSource1",
                                            "Property": "#.Display"
                                        }
                                    }
                                },
                                "GroupItemFormat": "Connect: {Display}",
                                "GroupValueProperty": "Display",
                                "Items" : {
                                    "Source": "ObjectDataSource1",
                                    "Property": ""
                                }
                            }
                        }
                    ]
                }
            }]
        };


        // When
        testHelper.applyViewMetadata(metadata, onViewReady);

        // Then
        function onViewReady(view, $layout){
            $layout.detach();

            assert.lengthOf($layout.find('.pl-listbox-body'), 3, 'length of rendered listbox is right');
            assert.lengthOf($layout.find('.pl-listbox-group-i'), 2, 'length of rendered group is right');
            assert.equal($layout.find('.pl-text-box-input').first().val(), 'LTE', 'value in template is right');
            assert.equal($.trim( $layout.find('.pl-listbox-group-title').last().text() ), 'Connect: 2G', 'group value in template is right');
        }
    });

    it('should render listBox with sorting items', function () {
        // Given
        var metadata = {
            Text: 'Пациенты',
            DataSources : [
                {
                    ObjectDataSource: {
                        "Name": "ObjectDataSource1",
                        "Items": [
                            { "Id": 2, "Display": "LTE" },
                            { "Id": 1, "Display": "2G" },
                            { "Id": 3, "Display": "2G" }
                        ]
                    }
                }
            ],
            Items: [{

                ListBox: {
                    "ItemTemplate": {
                        "TextBox": {
                            "Name": "TextBox1",
                            "Value": {
                                "Source": "ObjectDataSource1",
                                "Property": "#.Display"
                            }
                        }
                    },
                    "Items" : {
                        "Source": "ObjectDataSource1",
                        "Property": ""
                    },

                    "ItemComparator": {
                        "Name": "IdComparator"
                    }
                }
            }],

            "Scripts":[
                {
                    Name: 'IdComparator',
                    Body: "return args.item2.Id - args.item1.Id;"
                }
            ]
        };


        // When
        testHelper.applyViewMetadata(metadata, onViewReady);

        // Then
        function onViewReady(view, $layout){
            $layout.detach();

            assert.lengthOf($layout.find('.pl-listbox-body'), 3, 'length of rendered listbox');
            assert.equal($layout.find('.pl-text-box-input').eq(0).val(), '2G', 'value in template is right');
            assert.equal($layout.find('.pl-text-box-input').eq(1).val(), 'LTE', 'value in template is right');
            assert.equal($layout.find('.pl-text-box-input').eq(2).val(), '2G', 'value in template is right');
        }
    });
});
/*describe('DataGrid', function () {
    describe('render', function () {

        it('Setting the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given
            var grid = new DataGrid(),$el, $control;

            $el = grid.render();
            $control = $el.find('table');

            assert.lengthOf($control, 1);
            assert.isUndefined($el.attr('data-pl-name'));
            assert.isFalse($el.hasClass('pull-left'));
            assert.isFalse($el.hasClass('pull-right'));
            assert.isFalse($el.hasClass('center-block'));

            // When
            grid.setHorizontalAlignment('Right');

            //Then
            assert.isTrue($el.hasClass('pull-right'));
        });

        it('Setting Columns', function () {
            // Given
            var metadata = {
                "Name": "DataGrid1",
                "Columns": [
                    {
                        "Name": "Column1",
                        "Text": "Фамилия",
                        "DisplayProperty": "LastName"
                    },
                    {
                        "Name": "Column2",
                        "Text": "Имя",
                        "DisplayProperty": "FirstName"
                    },
                    {
                        "Name": "Column3",
                        "Text": "Отчество",
                        "DisplayProperty": "MiddleName",
                        "Visible": false
                    }
                ]
            };
            var builder = new DataGridBuilder();
            var grid = builder.build(new ApplicationBuilder(), null, metadata);

            var el = grid.render();
            var th = el.find('th');

            assert.lengthOf(th, 3);
            assert.equal(th[0].innerText, 'Фамилия');
            assert.equal(th[1].innerText, 'Имя');
            assert.equal(th[2].innerText, 'Отчество');

            assert.notEqual(th[0].style.display.toLowerCase(), 'none');
            assert.notEqual(th[1].style.display.toLowerCase(), 'none');
            assert.isTrue(th[2].classList.contains('hidden'));


            //When
            grid.getColumns()[2].setVisible(true);
            grid.getColumns()[1].setText('Name');

            //Then
            assert.equal(th[0].innerText, 'Фамилия');
            assert.equal(th[1].innerText, 'Name');
            assert.equal(th[2].innerText, 'Отчество');
            assert.notEqual(th[0].style.display.toLowerCase(), 'none');
            assert.notEqual(th[1].style.display.toLowerCase(), 'none');
            assert.notEqual(th[2].style.display.toLowerCase(), 'none');

        });

    });


    describe('DataGrid data binding', function () {
        it('should set DataGrid.items from property binding', function () {
            //Given
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });


            var metadata = {
                Text: 'Пациенты',
                DataSources: [
                    {
                        DocumentDataSource: {
                            Name : "PatientDataSource",
                            ConfigId: 'Demography',
                            DocumentId: 'Patient',
                            IdProperty: 'Id',
                            CreateAction: 'CreateDocument',
                            GetAction: 'GetDocument',
                            UpdateAction: 'SetDocument',
                            DeleteAction: 'DeleteDocument',
                            FillCreatedItem: true
                        }
                    }
                ],
                LayoutPanel: {
                    StackPanel: {
                        Name: 'MainViewPanel',
                        Items: [
                            {
                                DataGrid: {
                                    "Name": "DataGrid1",
                                    "Columns": [
                                        {
                                            "Name": "Column1",
                                            "Text": "Фамилия",
                                            "DisplayProperty": "LastName"
                                        },
                                        {
                                            "Name": "Column2",
                                            "Text": "Имя",
                                            "DisplayProperty": "FirstName"
                                        },
                                        {
                                            "Name": "Column3",
                                            "Text": "Отчество",
                                            "DisplayProperty": "MiddleName",
                                            "Visible": false
                                        }
                                    ],
                                    "Items": {
                                        "PropertyBinding": {
                                            "DataSource": "PatientsDataSource"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            };

            var $target = $('<div>');

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType(fakeView(), 'View', metadata);
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            linkView.createView(function(view){
                view.open();

                var itemToSelect = null,
                    dataSource = view.getDataSource('PatientDataSource');

                assert.isNotNull($target.find('table'));

                dataSource.getItems(function(data){
                    assert.notEqual($target.find('table>tbody').html(), '');
                });

            });
        });
    });

});*/
/*describe('DataGridBuilder', function () {
    describe('build', function () {
        it('successful build', function () {
            // Given

            var metadata = {
                "Name": "DataGrid1",
                "Columns": [
                    {
                        "Name": "Column1",
                        "Text": "Фамилия",
                        "DisplayProperty": "LastName"
                    },
                    {
                        "Name": "Column2",
                        "Text": "Имя",
                        "DisplayProperty": "FirstName"
                    },
                    {
                        "Name": "Column3",
                        "Text": "Отчество",
                        "DisplayProperty": "MiddleName",
                        "Visible": false
                    }
                ]
            };

            // When
            var builder = new DataGridBuilder();
            var grid = builder.build(new ApplicationBuilder(), null, metadata);
            grid.render();

            // Then
            assert.isNotNull(grid);
            assert.lengthOf(grid.getColumns(), 3);
            assert.equal(grid.getName(), 'DataGrid1');
            assert.isTrue(grid.getColumns()[0].getVisible());
            assert.isTrue(grid.getColumns()[1].getVisible());
            assert.isFalse(grid.getColumns()[2].getVisible());
            assert.equal(grid.getColumns()[0].getName(), 'Column1');
            assert.equal(grid.getColumns()[1].getName(), 'Column2');
            assert.equal(grid.getColumns()[2].getName(), 'Column3');
            assert.equal(grid.getColumns()[0].getText(), 'Фамилия');
            assert.equal(grid.getColumns()[1].getText(), 'Имя');
            assert.equal(grid.getColumns()[2].getText(), 'Отчество');

        });
    });
});*/
describe('DataNavigationControl', function () {
    describe('render', function () {
        var builder = new ApplicationBuilder()
            , button;

        beforeEach(function () {
            button = builder.buildType('DataNavigation', {});
        });

        it('should render dataNavigation with correct class', function () {
            //Given

            //When
            var $el = button.render();

            //Then
            assert.isTrue($el.hasClass('pl-data-navigation'));
        });
    });
});
describe('DateTimePickerControl', function () {
    var builder = new ApplicationBuilder();

    describe('render', function () {
        it('should update date when change value', function () {
            //Given
            var dateTimePicker = builder.buildType('DateTimePicker', {});
            var oldDate = new Date(2012, 10, 2);
            var newDate = new Date(2014, 7, 28);
            var $el = dateTimePicker.render().find('.pl-datepicker-input');
            dateTimePicker.setValue(InfinniUI.DateUtils.toISO8601(oldDate));

            //When
            dateTimePicker.setValue(InfinniUI.DateUtils.toISO8601(newDate));

            //Then
            assert.equal($el.val(), '28.08.2014');
        });

        it('should clear date when value is null', function () {
            //Given
            var dateTimePicker = new DateTimePickerControl();
            var value = InfinniUI.DateUtils.toISO8601(new Date(2012, 10, 2));

            dateTimePicker.setValue(value);
            assert.equal( dateTimePicker.getValue(), value);

            //When
            dateTimePicker.setValue(null);

            //Then
            assert.isNull(dateTimePicker.getValue());
        });

        it('should set minDate and maxDate', function () {
            //Given
            var dateTimePicker = builder.buildType('DateTimePicker', {});
            var minDate = InfinniUI.DateUtils.toISO8601(new Date(2010, 0, 1));
            var maxDate = InfinniUI.DateUtils.toISO8601(new Date(2014, 11, 31));

            //When
            dateTimePicker.setMinValue(minDate);
            dateTimePicker.setMaxValue(maxDate);

            //Then
            assert.equal(dateTimePicker.getMinValue(), minDate);
            assert.equal(dateTimePicker.getMaxValue(), maxDate);
        });

        it('should set Enabled', function () {
            //Given
            var dateTimePicker = builder.buildType('DateTimePicker', {});
            dateTimePicker.setEnabled(false);

            var $el = dateTimePicker.render().find('.pl-datepicker-input, .pl-datepicker-calendar');
            assert.equal($el.length, 2);
            $el.each(function (i, el) {
                var $el = $(el);
                assert.isTrue($el.prop('disabled'));
            });

            //When
            dateTimePicker.setEnabled(true);

            //Then
            $el.each(function (i, el) {
                var $el = $(el);
                assert.isFalse($el.prop('disabled'));
            });

        });

    });
});
describe('Frame', function () {
    var frame;

    beforeEach(function () {
        frame = new Frame();
    });

    describe('Render', function () {

        describe('Setting the properties', function () {

            it('Setting property: value', function () {
                //Given
                var $el = frame.render();

                //When
                frame.setValue('http://docs.infinnity.ru/');

                //Then
                assert.equal($el.find('iframe').attr('src'), 'http://docs.infinnity.ru/');
            });


        });

    });

});

describe('Label', function () {
    var label;

    beforeEach(function () {
        label = new Label();
    });

    describe('Render', function () {

        describe('Setting the properties', function () {

            it('Setting property: name', function () {
                //Given
                var $el = label.render();
                assert.isUndefined($el.attr('pl-data-pl-name'));

                //When
                label.setName('NewLabel');

                //Then
                assert.equal($el.attr('data-pl-name'), 'NewLabel');
            });

            it('Setting property: visible', function () {
                //Given
                var $el = label.render();
                assert.isFalse($el.hasClass('hidden'));

                //When
                label.setVisible(false);

                //Then
                assert.isTrue($el.hasClass('hidden'));
            });
            //
            //it('Setting property: horizontalAlignment', function () {
            //    //Given
            //    var $el = label.render();
            //    assert.isTrue($el.hasClass('horizontalTextAlignment-Left'));
            //    assert.isFalse($el.hasClass('horizontalTextAlignment-Right'));
            //    assert.isFalse($el.hasClass('horizontalTextAlignment-Center'));
            //    assert.isFalse($el.hasClass('horizontalTextAlignment-Justify'));
            //
            //    //When
            //    label.setHorizontalTextAlignment('Right');
            //
            //    //Then
            //    assert.isTrue($el.hasClass('horizontalTextAlignment-Right'));
            //    assert.isFalse($el.hasClass('horizontalTextAlignment-Left'));
            //    assert.isFalse($el.hasClass('horizontalTextAlignment-Center'));
            //    assert.isFalse($el.hasClass('horizontalTextAlignment-Justify'));
            //});

            it('Setting property: text', function () {
                //Given
                label.setText('Default Label');

                var $label = label.render();

                assert.equal($label.html(), 'Default Label');

                //When
                label.setText('New Label');

                //Then
                assert.equal($label.html(), 'New Label');
            });

            it('Setting property: textWrapping', function () {
                //Given
                var $label = label.render();

                assert.isTrue($label.hasClass('pl-text-wrapping'), 'default value must be true');

                //When
                label.setTextWrapping(false);

                //Then
                assert.isFalse($label.hasClass('pl-text-wrapping'), 'should not wrap if value false');
            });

            it('Setting property: textTrimming', function () {
                //Given
                var $label = label.render();

                assert.isTrue($label.hasClass('pl-text-trimming'), 'default value must be true');

                //When
                label.setTextTrimming(false);

                //Then
                assert.isFalse($label.hasClass('pl-text-trimming'), 'should not trim if value false');
            });
        });

    });

    /*describe('Data binding', function () {
        it('should set Label from property binding', function () {

            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            //$('body').append($('<div>').attr('id', 'page-content'));

            var metadata = {
                Text: 'Пациенты',
                DataSources: [
                    {
                        DocumentDataSource: {
                            Name : "PatientDataSource",
                            ConfigId: 'Demography',
                            DocumentId: 'Patient',
                            IdProperty: 'Id',
                            CreateAction: 'CreateDocument',
                            GetAction: 'GetDocument',
                            UpdateAction: 'SetDocument',
                            DeleteAction: 'DeleteDocument',
                            FillCreatedItem: true
                        }
                    }
                ],
                LayoutPanel: {
                    StackPanel: {
                        Name: 'MainViewPanel',
                        Items: [
                            {
                                Label: {
                                    Name: 'Label1',
                                    Value : {
                                        PropertyBinding : {
                                            DataSource : 'PatientDataSource',
                                            Property : '$.LastName'
                                        }
                                    },
                                    Text: 'Text Label'
                                }
                            }
                        ]
                    }
                }
            };

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType(fakeView(), 'View', metadata);
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function(view){
                view.open();

                var itemToSelect = null;

                view.getDataSource('PatientDataSource').getItems(
                    function(data){
                        itemToSelect = data[0];
                        view.getDataSource('PatientDataSource').setSelectedItem(itemToSelect);
//                        console.log(itemToSelect);
//                        console.log($('#page-content').find('label').html());
                        assert.equal($('#sandbox').find('label').html(), itemToSelect.LastName);

                        //$('#page-content').remove();
                    }
                );
            });
        });
    });*/
});

describe('ListEditorBase (Control)', function () {

    describe('ListBox as exemplar of ListEditorBase', function (){

        it('should apply value to control (single selecting mode)', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE"},
                                {"Id": 2, "Display": "2G"},
                                {"Id": 3, "Display": "2G"}
                            ]
                        }
                    },{
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                { "Value": { "Id": 2, "Display": "2G" }}
                            ]
                        }
                    }
                ],
                Items: [{

                    ListBox: {
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "$.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                var $items = $layout.find('.pl-listbox-i'),
                    $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');

                assert.lengthOf($chosen, 1, 'length of chosen item is right');
                assert.equal($items.index($chosen), 1, 'index of chosen item is right');
            }
        });


        it('should apply value to control (multiply selecting mode)', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE"},
                                {"Id": 2, "Display": "2G"},
                                {"Id": 3, "Display": "2G"}
                            ]
                        }
                    },{
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                { "Value": [
                                    { "Id": 2, "Display": "2G" },
                                    { "Id": 3, "Display": "2G" }
                                ]}
                            ]
                        }
                    }
                ],
                Items: [{

                    ListBox: {
                        "MultiSelect": true,
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "$.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        }
                    }
                }]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                var $items = $layout.find('.pl-listbox-i'),
                    $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');

                assert.lengthOf($chosen, 2, 'length of chosen item is right');
                assert.equal($items.index($chosen.eq(0)), 1, 'index of first chosen item is right');
                assert.equal($items.index($chosen.eq(1)), 2, 'index of second chosen item is right');
            }
        });

        it('should apply value from control (single selecting)', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE"},
                                {"Id": 2, "Display": "2G"},
                                {"Id": 3, "Display": "2G"}
                            ]
                        }
                    },{
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                { "Value": null}
                            ]
                        }
                    }
                ],
                Items: [{

                    ListBox: {
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "$.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        }
                    }
                }]
            };



            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            function onViewReady(view, $layout){
                $layout.detach();


                var $items = $layout.find('.pl-listbox-i'),
                    $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');

                // Then
                assert.lengthOf($chosen, 0, 'length of chosen item is right');

                // When
                $items.first().find('.pl-listbox-input input').prop('checked', true).change();
                $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');

                // Then
                assert.lengthOf($chosen, 1, 'length of chosen item is right');
                assert.equal($items.index($chosen.eq(0)), 0, 'index of first chosen item is right');
            }
        });

        it('should apply value from control (multiply selecting)', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE"},
                                {"Id": 2, "Display": "2G"},
                                {"Id": 3, "Display": "2G"}
                            ]
                        }
                    },{
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                { "Value": [{"Id": 2, "Display": "2G"}]}
                            ]
                        }
                    }
                ],
                Items: [{

                    ListBox: {
                        "MultiSelect": true,
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "$.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        }
                    }
                }]
            };



            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            function onViewReady(view, $layout){
                $layout.detach();

                var $items = $layout.find('.pl-listbox-i'),
                    $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen'),
                    value = view.getContext().dataSources['ObjectDataSource2'].getSelectedItem().Value;

                // Then
                assert.lengthOf($chosen, 1, 'length of chosen item is right');
                assert.equal($items.index($chosen.eq(0)), 1, 'index of chosen item is right');
                assert.lengthOf(value, 1, 'length value in DS is right');
                assert.equal(value[0].Id, 2, 'value in DS is right');

                // When
                $items.first().find('.pl-listbox-input input').prop('checked', true).change();
                $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');
                value = view.getContext().dataSources['ObjectDataSource2'].getSelectedItem().Value;

                assert.lengthOf($chosen, 2, 'length of chosen item is right');
                assert.equal($items.index($chosen.eq(0)), 0, 'index of first chosen item is right');
                assert.equal($items.index($chosen.eq(1)), 1, 'index of second chosen item is right');

                assert.lengthOf(value, 2, 'length value in DS is right');
                assert.equal(value[0].Id, 1, 'first value in DS is right');
                assert.equal(value[1].Id, 2, 'second value in DS is right');
            }
        });

        it('should bind selectedItem and value', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE"},
                                {"Id": 2, "Display": "2G"},
                                {"Id": 3, "Display": "2G"}
                            ]
                        }
                    },{
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                { "Value": {"Id": 2, "Display": "2G"}}
                            ]
                        }
                    }
                ],
                Items: [{

                    ListBox: {
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "$.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        }
                    }
                }]
            };



            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            function onViewReady(view, $layout){
                //$layout.detach();

                var $items = $layout.find('.pl-listbox-i'),
                    $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen'),
                    $selected = $layout.find('.pl-listbox-i.pl-listbox-i-selected'),
                    ds = view.getContext().dataSources['ObjectDataSource1'],
                    ds2 = view.getContext().dataSources['ObjectDataSource2'],
                    selectedItem = ds.getSelectedItem(),
                    items = ds.getItems();

                // Then
                assert.lengthOf($chosen, 1, 'length of chosen item is right');
                assert.lengthOf($selected, 0, 'length of selected item is right');
                assert.isNull(selectedItem, 'value in DS is right');
                assert.equal(ds2.getProperty('Value.Id'), 2, 'selected item in DS is right');

                // When
                $items.last().find('.pl-listbox-input input').prop('checked', true).change();
                $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');
                $selected = $layout.find('.pl-listbox-i.pl-listbox-i-selected');
                selectedItem = ds.getSelectedItem();

                // Then
                assert.lengthOf($chosen, 1, 'length of chosen item is right (after changing)');
                assert.lengthOf($selected, 0, 'length of selected item is right (after changing)');
                assert.equal(ds2.getProperty('Value.Id'), 3, 'selected item in DS is right (after changing)');

                // When
                ds.setSelectedItem(items[0]);
                $chosen = $layout.find('.pl-listbox-i.pl-listbox-i-chosen');
                $selected = $layout.find('.pl-listbox-i.pl-listbox-i-selected');
                selectedItem = ds.getSelectedItem();

                // Then
                assert.lengthOf($chosen, 1, 'length of chosen item is right (after 2 changing)');
                assert.lengthOf($selected, 1, 'length of selected item is right (after 2 changing)');
                assert.equal(selectedItem.Id, 1, 'value in DS is right (after 2 changing)');
                assert.equal(ds2.getProperty('Value.Id'), 3, 'selected item in DS is right (after 2 changing)');
            }
        });

        it('should set value by passed items', function () {
            // Given
            var metadata = {
                Text: 'Пациенты',
                DataSources : [
                    {
                        ObjectDataSource: {
                            "Name": "ObjectDataSource1",
                            "Items": [
                                {"Id": 1, "Display": "LTE"},
                                {"Id": 2, "Display": "2G"},
                                {"Id": 3, "Display": "2G"}
                            ]
                        }
                    },{
                        ObjectDataSource: {
                            "Name": "ObjectDataSource2",
                            "Items": [
                                { "Value": 2 }
                            ]
                        }
                    }
                ],
                Items: [{

                    ListBox: {
                        "Name": "LB",
                        "ItemTemplate": {
                            "TextBox": {
                                "Name": "TextBox1",
                                "Value": {
                                    "Source": "ObjectDataSource1",
                                    "Property": "$.Display"
                                }
                            }
                        },
                        "Items": {
                            "Source": "ObjectDataSource1",
                            "Property": ""
                        },
                        "Value": {
                            "Source": "ObjectDataSource2",
                            "Property": "$.Value"
                        },
                        "ValueProperty": "Id"
                    }
                }]
            };



            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            function onViewReady(view, $layout){

                var listBox = view.getContext().controls['LB'];
                var firstItem = listBox.getItems().getByIndex(0);
                var value = listBox.getValue();
                assert.equal(value, 2, 'first value in listbox is right');

                // When
                listBox.setValueItem(firstItem);

                // Then
                var value = listBox.getValue();
                assert.equal(value, 1, 'setValueItem set value right');
            }
        });
    });


});
describe('PanelControl', function () {

    describe('render', function () {
        it('Should render StackPanel with 4 Panel as ItemTemplate', function () {
            // Given
            var metadata = {
                "DataSources": [
                    {
                        "ObjectDataSource": {
                            "Name": "BloodGroupDataSource",
                            "Items": [
                                {
                                    "Id": 1,
                                    "DisplayName": "I",
                                    "SomeField": ""
                                },
                                {
                                    "Id": 2,
                                    "DisplayName": "II",
                                    "SomeField": "val"
                                },
                                {
                                    "Id": 3,
                                    "DisplayName": "III",
                                    "SomeField": 3
                                },
                                {
                                    "Id": 4,
                                    "DisplayName": "IV",
                                    "SomeField": null
                                }
                            ]
                        }
                    }
                ],
                "Items": [
                    {
                        "TablePanel": {
                            "Name": "",
                            "Items": [
                                {
                                    "Row": {
                                        "Items": [
                                            {
                                                "Cell": {
                                                    "ColumnSpan": 3,
                                                    "Items": [
                                                        {
                                                            "StackPanel": {
                                                                "Name": "StackPanel_1",
                                                                "Items": {
                                                                    "Source": "BloodGroupDataSource",
                                                                    "Property": ""
                                                                },
                                                                "ItemTemplate": {
                                                                    "Panel": {
                                                                        "Collapsible": true,
                                                                        "Header": {
                                                                            "Source": "BloodGroupDataSource",
                                                                            "Property": "#.DisplayName"
                                                                        },
                                                                        "Items": [
                                                                            {
                                                                                "Label": {
                                                                                    "Text": {
                                                                                        "Source": "BloodGroupDataSource",
                                                                                        "Property": "#.Id"
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
                "Scripts": [
                    {
                        "Name": "OnExpanded",
                        "Body": "console.log('OnExpanded');"
                    },
                    {
                        "Name": "OnCollapsed",
                        "Body": "console.log('OnCollapsed');"
                    },
                    {
                        "Name": "OnExpanding",
                        "Body": "console.log('OnExpanding');"
                    },
                    {
                        "Name": "OnCollapsing",
                        "Body": "console.log('OnCollapsing');"
                    }
                ]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var $panels = $layout.find('.pl-panel');


                assert.equal($panels.length, 4);

                $panels.each(function (index, el) {
                    var $el = $(el),
                        $header = $el.find('.pl-panel-header'),
                        $body = $el.find('.pl-panel-body'),
                        header = $header.find('.pl-label').text(),
                        body = $body.find('.pl-label').text();

                    assert.isTrue($header.hasClass('pl-collapsible'));
                    assert.isFalse($header.hasClass('pl-collapsed'));
                    switch (index) {
                        case 0:
                            assert.equal(header, 'I');
                            assert.equal(body, '1');
                            break;
                        case 1:
                            assert.equal(header, 'II');
                            assert.equal(body, '2');
                            break;
                        case 2:
                            assert.equal(header, 'III');
                            assert.equal(body, '3');
                            break;
                        case 3:
                            assert.equal(header, 'IV');
                            assert.equal(body, '4');
                            $header.click();
                            assert.isTrue($header.hasClass('pl-collapsed'), 'collapse on click');
                            break;
                    }

                });

            }
        });

        it('Should render Panel with 3 items(as label)', function () {
            // Given
            var metadata = {
                "DataSources": [
                    {
                        "ObjectDataSource": {
                            "Name": "BloodGroupDataSource",
                            "Items": [
                                {
                                    "Id": 1,
                                    "DisplayName": "I",
                                    "SomeField": ""
                                },
                                {
                                    "Id": 2,
                                    "DisplayName": "II",
                                    "SomeField": "val"
                                },
                                {
                                    "Id": 3,
                                    "DisplayName": "III",
                                    "SomeField": 3
                                },
                                {
                                    "Id": 4,
                                    "DisplayName": "IV",
                                    "SomeField": null
                                }
                            ]
                        }
                    }
                ],
                "Items": [
                    {
                        "TablePanel": {
                            "Name": "",
                            "Items": [
                                {
                                    "Row": {
                                        "Items": [
                                            {
                                                "Cell": {
                                                    "ColumnSpan": 3,
                                                    "Items": [
                                                        {
                                                            "Panel": {
                                                                "Collapsible": true,
                                                                "Collapsed": true,
                                                                "Header": "Header",
                                                                "Items": [
                                                                    {
                                                                        "Label": {
                                                                            "Text": "One"
                                                                        }
                                                                    },
                                                                    {
                                                                        "Label": {
                                                                            "Text": "Two"
                                                                        }
                                                                    },
                                                                    {
                                                                        "Label": {
                                                                            "Text": "Three"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
                "Scripts": [
                    {
                        "Name": "OnExpanded",
                        "Body": "console.log('OnExpanded');"
                    },
                    {
                        "Name": "OnCollapsed",
                        "Body": "console.log('OnCollapsed');"
                    },
                    {
                        "Name": "OnExpanding",
                        "Body": "console.log('OnExpanding');"
                    },
                    {
                        "Name": "OnCollapsing",
                        "Body": "console.log('OnCollapsing');"
                    }
                ]
            };

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var $panel = $layout.find('.pl-panel'),
                    $header = $panel.find('.pl-panel-header'),
                    $body = $panel.find('.pl-panel-body'),
                    header = $header.find('.pl-label').text(),
                    $items = $body.find('.pl-panel-i');


                assert.equal($items.length, 3);
                assert.isTrue($header.hasClass('pl-collapsible'));
                assert.isTrue($header.hasClass('pl-collapsed'));
                $items.each(function (index, el) {
                    var text = $('.pl-label', el).text();

                    switch(index) {
                        case 0:
                            assert.equal(text, 'One');
                            break;
                        case 1:
                            assert.equal(text, 'Two');
                            break;
                        case 2:
                            assert.equal(text, 'Three');
                            break;
                    }
                });

            }
        });
    });
});
describe('PasswordBox', function () {

    var element;

    beforeEach(function () {
        element = new PasswordBox();
    });

    describe('Render', function () {

        describe('Setting the properties', function () {

            it('Setting property: name', function () {
                //Given
                var $el = element.render();
                assert.isUndefined($el.attr('pl-data-pl-name'));

                //When
                element.setName('UserPassword');

                //Then
                assert.equal($el.attr('data-pl-name'), 'UserPassword');
            });

            it('Setting property: visible', function () {
                //Given
                var $el = element.render();
                assert.isFalse($el.hasClass('hidden'));

                //When
                element.setVisible(false);

                //Then
                assert.isTrue($el.hasClass('hidden'));
            });

            it('Setting property: labelText', function () {
                //Given
                var
                    label = "User's password",
                    $el = element.render(),
                    $label = $('label', $el);

                //When
                element.setLabelText(label);

                //Then
                assert.equal($label.html(), label);
            });

            it('Setting property: hintText', function () {
                //Given
                var
                    hint = "my hint",
                    $el = element.render(),
                    $hint = $('.pl-control-hint-text ', $el);

                //When
                element.setHintText(hint);

                //Then
                assert.equal($hint.html(), hint);
                assert.isFalse($hint.hasClass('hidden'));
            });

            it('Setting property: errorText', function () {
                //Given
                var
                    text = "error",
                    $el = element.render(),
                    $text = $('.pl-control-error-text ', $el);

                //When
                element.setErrorText(text);

                //Then
                assert.equal($text.html(), text);
                assert.isFalse($text.hasClass('hidden'));
            });

            it('Setting property: warningText', function () {
                //Given
                var
                    text = "warning",
                    $el = element.render(),
                    $text = $('.pl-control-warning-text ', $el);

                //When
                element.setWarningText(text);

                //Then
                assert.equal($text.html(), text);
                assert.isFalse($text.hasClass('hidden'));
            });

            it('Setting property: enabled', function () {
                //Given
                var
                    $el = element.render(),
                    $input = $('input', $el);

                //When
                element.setEnabled(false);

                //Then
                assert.isTrue($input.prop('disabled'));
                assert.isTrue($el.hasClass('pl-disabled'));
            });

        });

    });

});

describe('PopupButtonControl', function () {
    describe('render', function () {
        var builder = new ApplicationBuilder()
            , button;

        beforeEach(function () {
            button = builder.buildType('PopupButton', {
                Items: [
                    {
                        "Button": {
                            "Name": "AddButton",
                            "Text": "Add"
                        }
                    },
                    {
                        "Button": {
                            "Name": "DropButton",
                            "Text": "Drop"
                        }
                    },
                    {
                        "Button": {
                            "Name": "BackButton",
                            "Text": "Back"
                        }
                    }
                ]
            });
        });


        it('should render button with correct class', function () {
            //Given
            button.setText('Click me!');
            //When
            var $el = button.render();
            //Then
            var $button = $el.find('.pl-popup-button__button');
            assert.isTrue($el.hasClass('pl-popup-button'), 'control class');
            assert.equal($button.length, 1, 'button render');
            assert.equal($button.text(), 'Click me!', 'button text');
        });

        it('should handle onClick', function () {
            //Given
            var click = 0;
            button.setText('Click me!');
            button.onClick(function () {
                click++;
            });
            //When
            var $el = button.render();
            button.click();
            //Then
            assert.isTrue(click === 1);
        });

    });
});
describe('ScrollPanelControl', function () {

    describe('render', function () {
        it('Should render ScrollPanel', function () {

            // Given
            var metadata = {
                "DataSources": [
                    {
                        "ObjectDataSource": {
                            "Name": "BloodGroupDataSource",
                            "Items": [
                                {
                                    "Id": 1,
                                    "DisplayName": "I",
                                    "SomeField": ""
                                },
                                {
                                    "Id": 2,
                                    "DisplayName": "II",
                                    "SomeField": "val"
                                },
                                {
                                    "Id": 3,
                                    "DisplayName": "III",
                                    "SomeField": 3
                                },
                                {
                                    "Id": 4,
                                    "DisplayName": "IV",
                                    "SomeField": null
                                }
                            ]
                        }
                    }
                ],
                "Items": [
                    {
                        "TablePanel": {
                            "Name": "",
                            "Items": [
                                {
                                    "Row": {
                                        "Items": [
                                            {
                                                "Cell": {
                                                    "ColumnSpan": 3,
                                                    "Items": [
                                                        {
                                                            "ScrollPanel": {
                                                                "Name":"ScrollPanel_1",
                                                                "Items": [{
                                                                    "Label": {
                                                                        "Text": "Label 1"
                                                                    }
                                                                },
                                                                    {
                                                                        "Label": {
                                                                            "Text": "Label 2"
                                                                        }
                                                                    },
                                                                    {
                                                                        "Label": {
                                                                            "Text": "Label 3"
                                                                        }
                                                                    },
                                                                    {
                                                                        "Label": {
                                                                            "Text": "Label 4"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var
                    $panel = $layout.find('.pl-scrollpanel'),
                    $body = $panel.find('.pl-scrollpanel-body'),
                    $content = $body.find('.pl-scrollpanel-i');

                assert.equal($panel.length, 1, 'container');
                assert.equal($body.length, 1, 'body');
                assert.equal($content.length, 4, 'items');

                assert.isTrue($panel.hasClass('pl-horizontal-scroll-auto'));
                assert.isTrue($panel.hasClass('pl-vertical-scroll-auto'));
            }
        });
    });
});
describe('TabPanelControl', function () {

    describe('render', function () {
        it('Should render TabPanel with 3 TabPages', function () {

            // Given
            var metadata = {
                "DataSources": [
                    {
                        "ObjectDataSource": {
                            "Name": "BloodGroupDataSource",
                            "Items": [
                                {
                                    "Id": 1,
                                    "DisplayName": "I",
                                    "SomeField": ""
                                },
                                {
                                    "Id": 2,
                                    "DisplayName": "II",
                                    "SomeField": "val"
                                },
                                {
                                    "Id": 3,
                                    "DisplayName": "III",
                                    "SomeField": 3
                                },
                                {
                                    "Id": 4,
                                    "DisplayName": "IV",
                                    "SomeField": null
                                }
                            ]
                        }
                    }
                ],
                "Items": [
                    {
                        "TabPanel": {
                            "OnSelectedItemChanged": {
                                "Name": "OnSelectedItemChanged"
                            },
                            "HeaderLocation": "Left",
                            "Items": [
                                {
                                    "TabPage": {
                                        "Text": "Header of Page1",
                                        "Items": [
                                            {
                                                "Label": {
                                                    "Text": "Content of Page1"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "TabPage": {
                                        "Text": "Header of Page2",
                                        "CanClose": true,
                                        "OnClosing": {
                                            "Name": "OnClosing"
                                        },
                                        "OnClosed": {
                                            "Name": "OnClosed2"
                                        },
                                        "Items": [
                                            {
                                                "Label": {
                                                    "Text": "Content of Page2"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "TabPage": {
                                        "Text": "Header of Page3",
                                        "CanClose": true,
                                        "Items": [
                                            {
                                                "Label": {
                                                    "Text": "Content of Page3"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
                "Scripts": [
                    {
                        "Name": "OnClosing",
                        "Body": "var defer = $.Deferred(); setTimeout(function () {defer.resolve('ok');}, 3000); return defer.promise();"
                    },
                    {
                        "Name": "OnClosed2",
                        "Body": "console.log('OnClosed2');"
                    },
                    {
                        "Name": "OnSelectedItemChanged",
                        "Body": "console.log('OnSelectedItemChanged');"
                    }
                ]
            };


            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout) {
                $layout.detach();
                var
                    $panel = $layout.find('.pl-tabpanel'),
                    $header = $layout.find('.pl-tabpanel-header'),
                    $content = $layout.find('.pl-tabpanel-content'),

                    $headers = $header.find('.pl-tabheader'),
                    $pages = $content.find('.pl-tabpage');

                assert.equal($panel.length, 1, 'container');
                assert.equal($header.length, 1, 'header');
                assert.equal($content.length, 1, 'content');
                assert.equal($headers.length, 3, 'headers');
                assert.equal($pages.length, 3, 'pages');
            }
        });
    });
});
describe('TextBoxControl', function () {
    var builder = new ApplicationBuilder();


    describe('render', function () {
        it('Setting the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given
            var element = builder.buildType('TextBox', {});
            var
                $el = element.render(),
                $control = $el.find('input');

            assert.equal($control.val(), '');
            assert.isUndefined($el.attr('data-pl-name'));
            assert.isFalse($control.prop('disabled'));
            assert.isFalse($el.hasClass('hidden'));
            assert.isFalse($el.hasClass('pl-horizontal-Left'));

            // When
            element.setValue('new');
            element.setName('newName');
            element.setEnabled(false);
            element.setVisible(false);
            element.setHorizontalAlignment('Left');

            // Then
            assert.equal($control.val(), 'new');
            assert.equal($el.attr('data-pl-name'), 'newName');
            assert.isTrue($control.prop('disabled'));
            assert.isTrue($el.hasClass('hidden'));
            assert.isTrue($el.hasClass('pl-horizontal-Left'));
        });


        describe('Multiline TextBox', function () {
            it('textarea html input', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: true,
                    Enabled: false
                });

                // When
                var $el = element.render(),
                    $input = $el.find('.pl-text-area-input');

                // Then
                assert.equal($input.length, 1, 'textarea control');
                assert.equal($input.prop('disabled'), true);
            });

            it('Setting LineCount', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: true,
                    LineCount: 4
                });

                // When
                var $el = element.render(),
                    $input = $el.find('.pl-text-area-input');

                // Then
                assert.equal($input.prop('rows'), 4, 'row count');
            });

            it('Setting LabelText', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: true,
                    LabelText: "MyLabel"
                });

                // When
                var $el = element.render(),
                    $label = $el.find('.pl-control-label');

                // Then
                assert.equal($label.length, 1, 'render Label');
                assert.equal($label.text(), 'MyLabel', 'setting label');
            });

            it('Setting DisplayFormat', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: true,
                    LineCount: 4,

                    DisplayFormat: "{title}"
                });

                // When
                element.setValue({title: "Value"});
                var $el = element.render(),
                    $input = $el.find('.pl-text-area-input');

                // Then
                assert.equal($input.val(), 'Value');
            });

            it('Setting HintText, ErrorText, WarningText', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: true,
                    LineCount: 4,
                    HintText: 'Default hint',
                    ErrorText: 'Default error',
                    WarningText: 'Default warning'
                });

                var $el = element.render(),
                    $hint = $el.find('.pl-control-hint-text'),
                    $error = $el.find('.pl-control-error-text'),
                    $warning = $el.find('.pl-control-warning-text');

                assert.equal($hint.text(), 'Default hint');
                assert.equal($error.text(), 'Default error');
                assert.equal($warning.text(), 'Default warning');

                // When
                element.setHintText('Hint');
                element.setErrorText('Error');
                element.setWarningText('Warning');

                // Then
                assert.equal($hint.text(), 'Hint');
                assert.equal($error.text(), 'Error');
                assert.equal($warning.text(), 'Warning');
            });

        });

        describe('Not multiline TextBox', function () {
            it('html input', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: false,
                    Enabled: false
                });

                // When
                var $el = element.render(),
                    $input = $el.find('input.pl-text-box-input');

                // Then
                assert.equal($input.length, 1, 'input control');
                assert.equal($input.prop('disabled'), true);
            });

            it('Setting LabelText', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: false,
                    LabelText: "MyLabel"
                });

                // When
                var $el = element.render(),
                    $label = $el.find('.pl-control-label');

                // Then
                assert.equal($label.length, 1, 'render Label');
                assert.equal($label.text(), 'MyLabel', 'setting label');
            });

            it('Setting DisplayFormat', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    Multiline: false,
                    DisplayFormat: "{title}"
                });

                // When
                element.setValue({title: "Value"});
                var $el = element.render(),
                    $input = $el.find('input.pl-text-box-input');

                // Then
                assert.equal($input.val(), 'Value');
            });

            it('Setting HintText, ErrorText, WarningText', function () {
                // Given
                var element = builder.buildType('TextBox', {
                    HintText: 'Default hint',
                    ErrorText: 'Default error',
                    WarningText: 'Default warning'
                });

                var $el = element.render(),
                    $hint = $el.find('.pl-control-hint-text'),
                    $error = $el.find('.pl-control-error-text'),
                    $warning = $el.find('.pl-control-warning-text');

                assert.equal($hint.text(), 'Default hint');
                assert.equal($error.text(), 'Default error');
                assert.equal($warning.text(), 'Default warning');

                // When
                element.setHintText('Hint');
                element.setErrorText('Error');
                element.setWarningText('Warning');

                // Then
                assert.equal($hint.text(), 'Hint');
                assert.equal($error.text(), 'Error');
                assert.equal($warning.text(), 'Warning');
            });
        });

        it('Setting element\'s property', function () {
            // Given
            var element = builder.buildType('TextBox', {
                Name: 'TextBox1',
                Enabled: false,
                Visible: false,
                HorizontalAlignment: 'Stretch',
                VerticalAlignment: 'Bottom'
            });

            // When
            var $el = element.render();

            //Then
            assert.equal($el.attr('data-pl-name'), 'TextBox1', 'Name');
            assert.isTrue($el.hasClass('pl-disabled'), 'Enabled');
            assert.isTrue($el.hasClass('hidden'), 'Visible');
            assert.isTrue($el.hasClass('pl-horizontal-Stretch'), 'HorizontalAlignment');
            assert.isTrue($el.hasClass('verticalAlignmentBottom'), 'VerticalAlignment');
        });

    })
});

describe('TextEditorBase (Control)', function () {
    describe('Textbox as exemplar of TextEditorBase', function () {
        var metadata_1 = {
            Text: '��������',
            DataSources : [
                {
                    ObjectDataSource: {
                        "Name": "ObjectDataSource1",
                        "Items": [
                            { "Id": 1, "Display": "2.2222" },
                            { "Id": 2, "Display": "3.2222" },
                            { "Id": 3, "Display": "4.2222" }
                        ]
                    }
                }
            ],
            Items: [{

                "TextBox": {
                    "Name": "TextBox1",
                    "Value": {
                        "Source": "ObjectDataSource1",
                        "Property": "$.Display"
                    },
                    "DisplayFormat": "{:n2}",

                    "EditMask": {
                        "NumberEditMask": {
                            "Mask": "n3"
                        }
                    }
                }
            }]
        };

        it('metadata', function () {
            // Given
            var metadata = metadata_1;

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){

                var $input = $layout.find('.pl-text-box-input'),
                    $inputMask = $layout.find('input.pl-control-editor');

                assert.equal($input.val(), '2,22', 'binding and formatting is right');

                $input.focus(); // ��� ���������� �������� � �����
                assert.equal($inputMask.val(), '2,222', 'mask is right');

                $layout.detach();
            }
        });

    });

});
describe('ToolBarControl', function () {
    describe('render', function () {
        var builder = new ApplicationBuilder()
            , toolbar;

        beforeEach(function () {
            toolbar = builder.buildType('ToolBar', {
                Items: [
                    {
                        Button: {
                            Text: 'Button 1'
                        }
                    },
                    {
                        Label: {
                            Text: 'Button 2'
                        }
                    }
                ]
            });
        });

        it('should render button with correct class', function () {
            //Given


            //When
            var $el = toolbar.render();
            $('#sandbox').append($el);
            //Then
            assert.isTrue($el.hasClass('pl-tool-bar'));
        });
    });
});
describe('TreeView', function () {

    var builder = new ApplicationBuilder();

    describe('render', function () {
        it('should apply value to control (single selecting mode)', function () {
            // Given
            var metadata = {
                "DataSources": [
                    {
                        "ObjectDataSource": {
                            "Name": "Geo",
                            "Items": [
                                {
                                    "Id": 1,
                                    "ParentId": null,
                                    "Name": "Челябинск"
                                },
                                {
                                    "Id": 2,
                                    "ParentId": 1,
                                    "Name": "Чичерина"
                                },
                                {
                                    "Id": 3,
                                    "ParentId": 1,
                                    "Name": "Комарова"
                                },
                                {
                                    "Id": 4,
                                    "ParentId": null,
                                    "Name": "Копейск"
                                },
                                {
                                    "Id": 5,
                                    "ParentId": 4,
                                    "Name": "Победы"
                                },
                                {
                                    "Id": 6,
                                    "ParentId": 5,
                                    "Name": "33/1"
                                }
                            ]
                        }
                    }
                ],
                "Items": [
                    {
                        "TreeView": {
                            "KeyProperty": "Id",
                            "ParentProperty": "ParentId",
                            "ItemProperty": "Name",
                            "ValueProperty": "Name",
                            "MultiSelect": true,
                            "Items": {
                                "Source": "Geo"
                            }
                        }
                    }
                ]
            };


            // When
            var linkView = (new InlineViewBuilder()).build(null, {builder: builder, metadata: {View: metadata}, parentView: fakeApplicationView()});


            var view = linkView.createView(function (view) {
                view.open();

                var $view = view.control.controlView.$el;
                var $treeView = $view.find('.pl-treeview');
                var $treeViewNodes = $treeView.find('.pl-treeview-node');
                //Then
                assert.equal($treeView.length, 1, 'TreeView rendered in View');
                assert.equal($treeViewNodes.length, 6, 'TreeViewNodes rendered');
            });

        });
    });

});
describe('criteriaType', function () {
    it('IsEqual', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isTrue(CriteriaType.IsEquals(target, 'DisplayName', "Lorem Ipsum"));
        assert.isFalse(CriteriaType.IsEquals(target, 'DisplayName', 1));
    });

    it('IsNotEquals', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isFalse(CriteriaType.IsNotEquals(target, 'DisplayName', "Lorem Ipsum"));
        assert.isTrue(CriteriaType.IsNotEquals(target, 'DisplayName', 1));
    });

    it('IsMoreThan', function () {
        var target = {
            weight: 66
        };
        assert.isTrue(CriteriaType.IsMoreThan(target, 'weight', 65));
        assert.isFalse(CriteriaType.IsMoreThan(target, 'weight', 66));
        assert.isFalse(CriteriaType.IsMoreThan(target, 'weight', 67));
    });

    it('IsLessThan', function () {
        var target = {
            weight: 66
        };
        assert.isTrue(CriteriaType.IsLessThan(target, 'weight', 67));
        assert.isFalse(CriteriaType.IsLessThan(target, 'weight', 66));
        assert.isFalse(CriteriaType.IsLessThan(target, 'weight', 65));
    });

    it('IsMoreThanOrEquals', function () {
        var target = {
            weight: 66
        };
        assert.isTrue(CriteriaType.IsMoreThanOrEquals(target, 'weight', 65));
        assert.isTrue(CriteriaType.IsMoreThanOrEquals(target, 'weight', 66));
        assert.isFalse(CriteriaType.IsMoreThanOrEquals(target, 'weight', 67));
    });

    it('IsLessThanOrEquals', function () {
        var target = {
            weight: 66
        };
        assert.isTrue(CriteriaType.IsLessThanOrEquals(target, 'weight', 67));
        assert.isTrue(CriteriaType.IsLessThanOrEquals(target, 'weight', 66));
        assert.isFalse(CriteriaType.IsLessThanOrEquals(target, 'weight', 65));
    });

    it('IsContains', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isTrue(CriteriaType.IsContains(target, 'DisplayName', "Lor"));
        assert.isTrue(CriteriaType.IsContains(target, 'DisplayName', "em"));
        assert.isTrue(CriteriaType.IsContains(target, 'DisplayName', "sum"));
        assert.isTrue(CriteriaType.IsContains(target, 'DisplayName', "Lorem Ipsum"));
        assert.isFalse(CriteriaType.IsContains(target, 'DisplayName', "ololo"));
    });

    it('IsNotContains', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isFalse(CriteriaType.IsNotContains(target, 'DisplayName', "Lor"));
        assert.isFalse(CriteriaType.IsNotContains(target, 'DisplayName', "em"));
        assert.isFalse(CriteriaType.IsNotContains(target, 'DisplayName', "sum"));
        assert.isFalse(CriteriaType.IsNotContains(target, 'DisplayName', "Lorem Ipsum"));
        assert.isTrue(CriteriaType.IsNotContains(target, 'DisplayName', "ololo"));
    });

    it('IsEmpty', function () {
        var target = {
            DisplayName: "Lorem Ipsum",
            Description: "",
            Data: {},
            Items: []
        };
        assert.isTrue(CriteriaType.IsEmpty(target, 'Id'));
        assert.isTrue(CriteriaType.IsEmpty(target, 'Description'));
        assert.isTrue(CriteriaType.IsEmpty(target, 'Data'));
        assert.isTrue(CriteriaType.IsEmpty(target, 'Items'));
        assert.isFalse(CriteriaType.IsEmpty(target, 'DisplayName'));
    });


    it('IsNotEmpty', function () {
        var target = {
            DisplayName: "Lorem Ipsum",
            Description: "",
            Data: {},
            Items: []
        };
        assert.isFalse(CriteriaType.IsNotEmpty(target, 'Id'));
        assert.isFalse(CriteriaType.IsNotEmpty(target, 'Description'));
        assert.isFalse(CriteriaType.IsNotEmpty(target, 'Data'));
        assert.isFalse(CriteriaType.IsNotEmpty(target, 'Items'));
        assert.isTrue(CriteriaType.IsNotEmpty(target, 'DisplayName'));
    });


    it('IsStartsWith', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isTrue(CriteriaType.IsStartsWith(target, 'DisplayName', "Lor"));
        assert.isFalse(CriteriaType.IsStartsWith(target, 'DisplayName', "em"));
        assert.isTrue(CriteriaType.IsStartsWith(target, 'DisplayName', "Lorem Ipsum"));
        assert.isFalse(CriteriaType.IsStartsWith(target, 'DisplayName', "ololo"));
    });


    it('IsNotStartsWith', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isFalse(CriteriaType.IsNotStartsWith(target, 'DisplayName', "Lor"));
        assert.isTrue(CriteriaType.IsNotStartsWith(target, 'DisplayName', "em"));
        assert.isFalse(CriteriaType.IsNotStartsWith(target, 'DisplayName', "Lorem Ipsum"));
        assert.isTrue(CriteriaType.IsNotStartsWith(target, 'DisplayName', "ololo"));
    });


    it('IsEndsWith', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isFalse(CriteriaType.IsEndsWith(target, 'DisplayName', "Lor"));
        assert.isFalse(CriteriaType.IsEndsWith(target, 'DisplayName', "em"));
        assert.isTrue(CriteriaType.IsEndsWith(target, 'DisplayName', "Lorem Ipsum"));
        assert.isTrue(CriteriaType.IsEndsWith(target, 'DisplayName', "sum"));
        assert.isFalse(CriteriaType.IsEndsWith(target, 'DisplayName', "ololo"));
    });


    it('IsNotEndsWith', function () {
        var target = {
            DisplayName: "Lorem Ipsum"
        };
        assert.isTrue(CriteriaType.IsNotEndsWith(target, 'DisplayName', "Lor"));
        assert.isTrue(CriteriaType.IsNotEndsWith(target, 'DisplayName', "em"));
        assert.isFalse(CriteriaType.IsNotEndsWith(target, 'DisplayName', "Lorem Ipsum"));
        assert.isFalse(CriteriaType.IsNotEndsWith(target, 'DisplayName', "sum"));
        assert.isTrue(CriteriaType.IsNotEndsWith(target, 'DisplayName', "ololo"));
    });


    it('IsIn', function () {
        var target = {
            DisplayName: "Lorem Ipsum",
            Weight: 33
        };
        assert.isTrue(CriteriaType.IsIn(target, 'DisplayName', ["Lorem Ipsum"]), 'Text');
        assert.isFalse(CriteriaType.IsIn(target, 'DisplayName', [""]), 'Empty text');
        assert.isTrue(CriteriaType.IsIn(target, 'Weight', [31, 32, 33]), 'Number');
        assert.isFalse(CriteriaType.IsIn(target, 'Weight', [31, 32, "none"]), 'Number');
    });


    it('isNotIn', function () {
        var target = {
            DisplayName: "Lorem Ipsum",
            Weight: 33
        };
        assert.isFalse(CriteriaType.isNotIn(target, 'DisplayName', ["Lorem Ipsum"]), 'Text');
        assert.isTrue(CriteriaType.isNotIn(target, 'DisplayName', [""]), 'Empty text');
        assert.isFalse(CriteriaType.isNotIn(target, 'Weight', [31, 32, 33]), 'Number');
        assert.isTrue(CriteriaType.isNotIn(target, 'Weight', [31, 32, "none"]), 'Number');
    });


});

describe('FilterCriteriaType', function () {

    it('Empty filter', function () {
        var filterCriteriaType = new FilterCriteriaType();

        var item = {
            Id: 11,
            DisplayName: "*11*"
        };

        var filter = [];

        var callback = filterCriteriaType.getFilterCallback(filter);

        assert.isTrue(callback(item));
    });

    it('Simple filter', function () {
        var filterCriteriaType = new FilterCriteriaType();

        var item = {
            Id: 11,
            DisplayName: "*11*"
        };

        var filter = [
            {
                criteriaType: filterCriteriaType.CriteriaTypeCode.IsEquals,
                property: "Id",
                value: 11
            }
        ];

        var callback = filterCriteriaType.getFilterCallback(filter);

        assert.isTrue(callback(item));
    });

    it('Complex filter', function () {
        var filterCriteriaType = new FilterCriteriaType();

        var item = {
            Id: 11,
            DisplayName: "*11*"
        };

        var filter = [
            {
                criteriaType: filterCriteriaType.CriteriaTypeCode.IsEquals,
                property: "Id",
                value: 11
            },
            {
                criteriaType: filterCriteriaType.CriteriaTypeCode.IsContains,
                property: "DisplayName",
                value: "*"
            }
        ];

        var callback = filterCriteriaType.getFilterCallback(filter);

        assert.isTrue(callback(item));
    });

    it('Complex filter: no matches', function () {
        var filterCriteriaType = new FilterCriteriaType();

        var item = {
            Id: 11,
            DisplayName: "*11*"
        };

        var filter = [
            {
                CriteriaType: filterCriteriaType.CriteriaTypeCode.IsEquals,
                Property: "Id",
                Value: 11
            },
            {
                CriteriaType: filterCriteriaType.CriteriaTypeCode.IsContains,
                Property: "DisplayName",
                Value: "**"
            }
        ];

        var callback = filterCriteriaType.getFilterCallback(filter);

        assert.isFalse(callback(item));
    });

});
describe('Parameters', function () {

    it('Parameter base API', function () {

        // Given When
        var view = fakeView();
        var parameter = new Parameter({view: view, name: 'name'});

        // Then
        assert.equal(parameter.getView(), view, 'view is right');
        assert.equal(parameter.getName(), 'name', 'name is right');
    });

    it('Parameter value and property', function () {

        // Given
        var parameter = new Parameter({view: fakeView(), name: 'name'}),
            val = {
                f1:{
                    value: 5
                },
                f2: 3
            };

        assert.isUndefined(parameter.getValue(), 'start value is undefined');
        assert.isUndefined(parameter.getProperty(''), 'start property is undefined');
        assert.isUndefined(parameter.getProperty('f1'), 'start property is undefined 2');
        assert.isUndefined(parameter.getProperty('f1.value'), 'start property is undefined 3');

        //When
        parameter.setValue(val);

        // Then
        assert.equal(parameter.getValue(), val, 'value after setting is right');
        assert.equal(parameter.getProperty(''), val, 'property after setting is right');
        assert.equal(parameter.getProperty('f1'), val.f1, 'property after setting is right 2');
        assert.equal(parameter.getProperty('f1.value'), val.f1.value, 'property after setting is right 3');
    });

    it('Parameter handling property changed', function () {

        // Given
        var parameter = new Parameter({view: fakeView(), name: 'name'}),
            handlerWasCalled = false,
            val = {
                f1:{
                    value: 5
                },
                f2: 3
            };

        parameter.setValue(10);

        parameter.onPropertyChanged(onPropertyChangedHandler);

        //When
        parameter.setValue(val);

        // Then
        function onPropertyChangedHandler(context, args){
            assert.equal(args.newValue, val, 'new value is right');
            assert.equal(args.oldValue, 10, 'old value is right');

            handlerWasCalled = true;
        }

        assert.isTrue(handlerWasCalled, 'handler was called');
    });

});
describe('DataBinding', function () {
    it('should bind source', function () {
        // Given
        var dataBinding = new DataBinding();

        assert.isNull(dataBinding.getSource());
        assert.isNull(dataBinding.getSourceProperty());

        // When
        dataBinding.bindSource(new FakeElement(), 'property');

        // Then
        assert.isNotNull(dataBinding.getSource());
        assert.isNotNull(dataBinding.getSourceProperty());
    });

    it('should bind element', function () {
        // Given
        var dataBinding = new DataBinding();

        assert.isNull(dataBinding.getElement());
        assert.isNull(dataBinding.getElementProperty());

        // When
        dataBinding.bindElement(new FakeElement(), 'property');

        // Then
        assert.isNotNull(dataBinding.getElement());
        assert.isNotNull(dataBinding.getElementProperty());
    });

    it('default mode should be twoWay', function () {
        // Given
        var dataBinding = new DataBinding();

        // Then
        assert.equal(dataBinding.getMode(), InfinniUI.BindingModes.twoWay, 'default mode must be twoWay');
    });

    it('should refresh source on element change if mode is twoWay', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode(InfinniUI.BindingModes.twoWay);

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        element.setProperty(elementProperty, 'element property new value' );

        // Then
        assert.equal(dataBinding.getSource().getProperty(sourceProperty), 'element property new value');
    });

    it('should refresh element on source change if mode is twoWay', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode(InfinniUI.BindingModes.twoWay);

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        source.setProperty(sourceProperty, 'source property new value' );

        // Then
        assert.equal(dataBinding.getElement().getProperty(elementProperty), 'source property new value');
    });

    it('should not refresh source on element change if mode is toElement', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode(InfinniUI.BindingModes.toElement);

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        element.setProperty(elementProperty, 'element property new value' );

        // Then
        assert.equal(dataBinding.getSource().getProperty(sourceProperty), 'source property start value');
    });

    it('should refresh element on source change if mode is toElement', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode(InfinniUI.BindingModes.toElement);

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        source.setProperty(sourceProperty, 'source property new value' );

        // Then
        assert.equal(dataBinding.getElement().getProperty(elementProperty), 'source property new value');
    });

    it('should refresh source on element change if mode is toSource', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode(InfinniUI.BindingModes.toSource);

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        element.setProperty(elementProperty, 'element property new value' );

        // Then
        assert.equal(dataBinding.getSource().getProperty(sourceProperty), 'element property new value');
    });

    it('should not refresh element on source change if mode is toSource', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode(InfinniUI.BindingModes.toSource);

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        source.setProperty(sourceProperty, 'source property new value' );

        // Then
        assert.equal(dataBinding.getElement().getProperty(elementProperty), 'element property start value');
    });

    it('should not refresh element if mode is wrong', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode('gubbish');

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        source.setProperty(sourceProperty, 'source property new value' );

        // Then
        assert.equal(dataBinding.getElement().getProperty(elementProperty), 'element property start value');
    });

    it('should not refresh source if mode is wrong', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode('gubbish');

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';
        source.setProperty(sourceProperty, 'source property start value');

        var element = new FakeElement();
        var elementProperty = 'elementProperty';
        element.setProperty(elementProperty, 'element property start value');

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        element.setProperty(elementProperty, 'element property new value' );

        // Then
        assert.equal(dataBinding.getSource().getProperty(sourceProperty), 'source property start value');
    });

    it('should convert value if have converter', function () {
        // Given
        var dataBinding = new DataBinding();
        dataBinding.setMode(InfinniUI.BindingModes.twoWay);
        dataBinding.setConverter({
            toSource: function(context, argument) {
                return argument.value ? 5 : 3; // string to integer
            },
            toElement: function(context, argument) {
                return argument.value > 4; // integer to string
            }
        });

        var source = new FakeElement();
        var sourceProperty = 'sourceProperty';

        var element = new FakeElement();
        var elementProperty = 'elementProperty';

        dataBinding.bindSource(source, sourceProperty);
        dataBinding.bindElement(element, elementProperty);

        // When
        source.setProperty(sourceProperty, 5);

        // Then
        assert.equal(dataBinding.getElement().getProperty(elementProperty), true, 'Ignored toElement converter');

        // When
        element.setProperty(elementProperty, false);

        // Then
        assert.equal(dataBinding.getSource().getProperty(sourceProperty), 3, 'Ignored toSource converter');
    });
});
describe('DataBindingBuilder', function () {

/*    it('should build DataBinding', function () {
        // Given
        var dataBindingBuilder = new DataBindingBuilder();
        var view = {
            getContext: function(){
                return {
                    dataSources: {
                        My_Source: {
                            onPropertyChanged: function(){}
                        }
                    },
                    parameters: {
                    },
                    controls: {
                    }
                };
            },

            getDeferredOfMember: function(){
                return {
                    done: function(handler){
                        handler({});
                    }
                };
            }
        };
        var metadata = {
            Source: 'My_Source',
            Property: '',
            Mode: 'ToSource',
            Converter: {
                toSource: function(){},
                toElement: function(){}
            }
        };

        // When
        var dataBinding = dataBindingBuilder.build(null, {parentView: view, metadata: metadata});

        // Then
        assert.equal(dataBinding.getMode(), InfinniUI.BindingModes.toSource);
        assert.isNotNull(dataBinding.getConverter());
        assert.isNotNull(dataBinding.getSource());
        assert.isNotNull(dataBinding.getSourceProperty());
    });

    it('should bind all type of source', function () {
        // Given
        var dataBindingBuilder = new DataBindingBuilder();
        var view = {
            getContext: function(){
                return {
                    dataSources: {
                        My_DataSource: {
                            onPropertyChanged: function(){}
                        }
                    },
                    parameters: {
                        My_Parameter: {
                            onPropertyChanged: function(){}
                        }
                    },
                    controls: {
                        My_Button: {
                            onPropertyChanged: function(){}
                        }
                    }
                };
            }
        };

        // Then
        dataBindingBuilder.build(null, { parentView: view, metadata: { Source: 'My_DataSource'} });
        dataBindingBuilder.build(null, { parentView: view,  metadata: { Source: 'My_Parameter'} });
        dataBindingBuilder.build(null, { parentView: view,  metadata: { Source: 'My_Button'} });
    });
*/
    it('should toElement converter work in inline style', function () {
        // Given
        var metadata = {
            Text: '��������',
            DataSources : [
                {
                    ObjectDataSource: {
                        "Name": "ObjectDataSource1",
                        "Items": [
                            { "Id": 1, "Display": "LTE" },
                            { "Id": 2, "Display": "3G" },
                            { "Id": 3, "Display": "2G" }
                        ]
                    }
                }
            ],
            Items: [{

                StackPanel: {
                    Name: 'MainViewPanel',
                    "ItemTemplate": {
                        "TextBox": {
                            "Name": "TextBox1",
                            "Value": {
                                "Source": "ObjectDataSource1",
                                "Property": "#.Display",
                                "Converter": {
                                    "ToElement": "{return args.value + '!';}"
                                },
                                "Mode": "ToElement"
                            }
                        }
                    },
                    "Items" : {
                        "Source": "ObjectDataSource1",
                        "Property": ""
                    }
                }
            }]
        };

        // When
        testHelper.applyViewMetadata(metadata, onViewReady);

        // Then
        function onViewReady(view, $layout){
            $layout.detach();

            assert.equal($layout.find('.pl-text-box-input:first').val(), 'LTE!', 'binding in itemTemplate is right');
        }
    });
});

var FakeElement = Backbone.Model.extend({
    onPropertyChanged: function(prop, callback){
        this.set('callback', callback);
    },

    setName: function(name){
        this.set('name', name);
    },

    getName: function(){
        return this.get('name');
    },

    setProperty: function(property, newValue){
        var oldValue = this.get(property);

        if(oldValue != newValue){
            this.set(property, newValue);
            var callback = this.get('callback');
            if(callback){
                callback({}, {property: property, newValue: newValue});
            }
        }
    },

    getProperty: function(property){
        return this.get(property);
    }
});
describe('DataSourceBuilder', function () {
    var builder = new ApplicationBuilder(),
        metadata = {
            Name: 'PatientDataSource',
            ConfigId: 'Demography',
            DocumentId: 'Patient',
            CreateAction: 'CreateDocument',
            GetAction: 'GetDocument',
            UpdateAction: 'SetDocument',
            DeleteAction: 'DeleteDocument',
            FillCreatedItem: true,
            PageNumber: 1,
            PageSize: 5,

            OnSelectedItemModified: {
                Name: 'OnSelectedItemModified'
            }
        };

    window.providerRegister.register('DocumentDataSource', FakeDataProvider);

    describe('build DocumentDataSource', function () {
        it('should build documentDataSource', function () {
            // Given When
            var view = new View(),
                createdDataSource = builder.buildType('DocumentDataSource', metadata, {parentView: view});

            // Then
            assert.equal(createdDataSource.getConfigId(), 'Demography');
            assert.equal(createdDataSource.getDocumentId(), 'Patient');
            assert.equal(createdDataSource.getIdProperty(), 'Id');
            assert.equal(createdDataSource.getCreateAction(), 'CreateDocument');
            assert.equal(createdDataSource.getUpdateAction(), 'SetDocument');
            assert.equal(createdDataSource.getDeleteAction(), 'DeleteDocument');
            assert.equal(createdDataSource.getPageSize(), 5, 'PageSize');
            assert.equal(createdDataSource.getPageNumber(), 1, 'PageNumber');
            assert.isTrue(createdDataSource.getFillCreatedItem(), 'Value of FillCreatedItem');
        });

        it('should subscribe documentDataSource on changeProperty', function (done) {
            // Given
            var view = new View(),
                createdDataSource = builder.buildType('DocumentDataSource', metadata, {parentView: view}),
                scriptMetadata = {
                    Name:"OnSelectedItemModified",
                    Body: 'window.documentDataSourceTest = 1;'
                };

            view.getScripts().add({
                name: 'OnSelectedItemModified',
                func: builder.buildType('Script', scriptMetadata, {parentView: view})
            });

            createdDataSource.updateItems(onItemUpdates);

            // When
            function onItemUpdates(context, args){
                createdDataSource.setProperty('FirstName', 'Иванидзе');
            }

            // Then
            setTimeout(function(){
                assert.equal(window.documentDataSourceTest, 1, 'Event onSelectedItemModified is called');
                done();
            }, 200);
        });


    });

});
describe('DocumentDataSource', function () {

    describe('DocumentDataSource base api', function () {
        it('should get list of data', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            assert.isFalse(dataSource.isDataReady(), 'dataReady status is right (false)');
            assert.isFalse(dataSource.get('isRequestInProcess'), 'is request not in process');

            //When
            dataSource.updateItems(
                function(context, args){

                    // Then
                    assert.isTrue(args.value.length > 0, 'data provider returns items');
                    assert.isTrue(dataSource.getItems().length > 0, 'data source have items');
                    assert.isTrue(dataSource.isDataReady(), 'dataReady status is right (true)');
                    done();

                }
            );
        });


        it('should get editing record', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var builder = new ApplicationBuilder();
            var view = fakeView();
            var dataSource = builder.buildType('DocumentDataSource', {}, {parent: view, parentView: view, builder: builder});

            //When
            dataSource.suspendUpdate();
            dataSource.setIdFilter('1');
            dataSource.resumeUpdate();



            var items = dataSource.updateItems(
                function (context, args) {

                    // Then
                    assert.lengthOf(args.value, 1, 'length of filtered items set');
                    assert.equal(args.value[0].Id, '1', 'value of filtered items set');

                    done();
                }
            );
        });


        it('should update document', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.suspendUpdate();
            dataSource.setPageSize(5);
            dataSource.resumeUpdate();

            //When
            dataSource.updateItems(
                function(context, args){

                    assert.lengthOf(dataSource.getItems(), 5, 'data provider returns 5 items');

                    dataSource.suspendUpdate();
                    dataSource.setPageNumber(1);
                    dataSource.resumeUpdate();
                    dataSource.updateItems(
                        function(data){

                            // Then
                            assert.lengthOf(dataSource.getItems(), 2, 'data provider returns 2 items');
                            done();

                        }
                    );

                }
            );
        });

        it('should restore selected item after updating', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.updateItems(
                function(){
                    var items = dataSource.getItems();
                    var selectedItem = items[3];
                    dataSource.setSelectedItem(selectedItem);

                    //When
                    dataSource.updateItems(
                        function(context, args){
                            //Then
                            assert.equal(dataSource.getSelectedItem(), selectedItem);
                            done();
                        }
                    );
                }
            );
        });

        it('should create document', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            //When
            dataSource.createItem(
                function(context, argument){

                    // Then
                    var newItem = argument.value;
                    assert.ok(newItem, 'new item is ready');
                    assert.equal(newItem.prefilledField, 1, 'prefilled field is right');
                    assert.equal(newItem.__Id, newItem.Id, 'special Id is right');

                    var items = dataSource.getItems();
                    assert.lengthOf(items, 1, 'one element (when was created) in items');
                    assert.equal(items[0].prefilledField, 1, 'is right element in items after creating');
                    done();
                }
            );
        });

        it('should get document property', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            //When
            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){
                // Then
                assert.equal(dataSource.getProperty('FirstName'), 'Иван', 'return property value by simple property');
                assert.equal(dataSource.getProperty('$.FirstName'), 'Иван', 'return property value by relative property');
                assert.equal(dataSource.getProperty('$').FirstName, 'Иван', 'return property - full item by $ selector');
                assert.equal(dataSource.getProperty('2.FirstName'), 'Иван1', 'return property - full item by index selector');
                done();
            }
        });

        it('should select item', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){
                var items = dataSource.getItems();
                assert.equal(dataSource.getProperty('FirstName'), 'Иван', 'return property value by simple property');

                //When
                dataSource.setSelectedItem(items[1]);

                // Then
                assert.equal(dataSource.getProperty('FirstName'), 'Петр', 'return property value by simple property after change selected item');
                done();
            }
        });

        it('should change document property', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });


            dataSource.updateItems(handleItemsReady);


            function handleItemsReady(){
                assert.equal(dataSource.getProperty('FirstName'),'Иван', 'return property value by property');

                //When
                dataSource.setProperty('FirstName', 'Иванидзе');
                dataSource.setProperty('2.FirstName', 'Иванидзе-дзе');

                // Then
                assert.equal(dataSource.getProperty('$').FirstName, 'Иванидзе', 'return property value by property after change property');
                assert.equal(dataSource.getProperty('2').FirstName, 'Иванидзе-дзе', 'return property value by property after change property by id');
                done();
            }
        });

        it('should change document property (full item change)', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){
                assert.equal(dataSource.getProperty('FirstName'), 'Иван', 'return property value by property');

                //When
                var newItemData = {
                    "Id": '1',
                    "FirstName": "Ивано",
                    "LastName": "Иванович"
                };
                dataSource.setProperty('$', newItemData);

                // Then
                assert.equal(dataSource.getProperty('$').FirstName, 'Ивано', 'return property value by property after change property');
                done();
            }
        });

        it('should validate item', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.setErrorValidator(validator);
            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){

                //When
                var items = dataSource.getItems(),
                    validateResult1 = dataSource.validateOnErrors(items[0]),
                    validateResult2 = dataSource.validateOnErrors(items[1]),
                    validateResult3 = dataSource.validateOnErrors();

                // Then
                assert.isTrue(validateResult1.isValid, 'successfully validation');

                assert.isFalse(validateResult2.isValid, 'fail validation');
                assert.lengthOf(validateResult2.items, 1, 'fail validation results');
                assert.equal(validateResult2.items[0].property, 'FirstName', 'fail validation property result');

                assert.isFalse(validateResult3.isValid, 'full validation');
                assert.lengthOf(validateResult3.items, 6, 'full validation results');
                assert.equal(validateResult3.items[3].property, '4.FirstName', 'full validation property result');
                done();
            }

            function validator(context, argument){
                var result = {
                    isValid: true
                };

                if(argument.FirstName != 'Иван'){
                    result.isValid = false;
                    result.items = [{
                        property: 'FirstName',
                        message: 'Почему не Иван?!'
                    }];
                }

                return result;
            }
        });

        it('should save item', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.updateItems(handleItemsReady1);

            function handleItemsReady1(){

                //When
                var item = dataSource.getSelectedItem();

                dataSource.setProperty('FirstName', 'Иванидзе');
                dataSource.saveItem(item);

                dataSource.updateItems(handleItemsReady2);
            }

            function handleItemsReady2(){
                // Then
                assert.equal(dataSource.getProperty('FirstName'), 'Иванидзе', 'item is saved');
                done();
            }
        });

        it('should delete item', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.updateItems(handleItemsReady1);

            function handleItemsReady1(){

                //When
                var items = dataSource.getItems(),
                    itemsCount = items.length;

                dataSource.deleteItem(items[0], function(context, argument){
                    // Then
                    items = dataSource.getItems();
                    assert.lengthOf(items, itemsCount-1, 'items length is decrease');
                    assert.equal(dataSource.getSelectedItem(), null, 'deleted item exclude from selected item');
                    done();
                });
            }
        });

        it('should add items', function (done) {
            // Given
            window.providerRegister.register('DocumentDataSource', FakeDataProvider);

            var dataSource = new DocumentDataSource({
                view: fakeView()
            });

            dataSource.suspendUpdate();
            dataSource.setPageSize(5);
            dataSource.resumeUpdate();


            dataSource.updateItems(
                function(context, args){

                    assert.lengthOf(dataSource.getItems(), 5, 'datasource have 5 items');
                    assert.equal(dataSource.getPageNumber(), 0, 'datasource at first page');

                    //When
                    dataSource.addNextItems(
                        function(data){

                            // Then
                            assert.lengthOf(dataSource.getItems(), 7, 'after adding datasource have 7 items');
                            assert.equal(dataSource.getPageSize(), 5, 'after adding datasource still have page size equal 5');
                            assert.equal(dataSource.getPageNumber(), 1, 'after adding datasource at second page');
                            done();

                        }
                    );

                }
            );
        });
    });
});
/*function FakeDataProvider(mode) {

    var items = [
        {
            "Id": '1',
            "FirstName": "Иван",
            "LastName": "Иванов"
        },
        {
            "Id": '2',
            "FirstName": "Петр",
            "LastName": "Петров"
        },
        {
            "Id": '10',
            "FirstName": "Анна",
            "LastName": "Сергеева"

        }
    ];

    var itemsUpdated = [
        {
            "Id": '4',
            "FirstName": "Федор",
            "LastName": "Федоров"
        },
        {
            "Id": '5',
            "FirstName": "Сидор",
            "LastName": "Сидоров"
        }
    ];

    this.getItems = function (criteriaList, pageNumber, pageSize, sorting, resultCallback) {
        if (mode === undefined || mode() === 'Created') {

            var result = [];
            var allItems = items;
            for (var i = 0; i < pageSize; i++) {
                var itemIndex = i + (pageNumber * pageSize);
                if (itemIndex < allItems.length) {
                    result.push(items[itemIndex]);
                }
                else {
                    break;
                }
            }
            resultCallback(result);
        }
        else {
            resultCallback(itemsUpdated);
        }
    };

    this.createItem = function (resultCallback) {
        resultCallback({});
    };

    this.replaceItem = function (value, warnings, resultCallback) {

        var itemIndex = -1;

        for (var i = 0; i < items.length; i++) {
            if (items[i].Id === value.Id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex !== -1) {
            items[itemIndex] = value;
        }
        else {
            items.push(value);
        }

        resultCallback(items);
    };

    this.deleteItem = function (value, resultCallback) {
        var itemIndex = items.indexOf(value);
        items.splice(itemIndex, 1);
        resultCallback(items);
    };

    this.getItem = function (itemId, resultCallback) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].Id === itemId) {
                resultCallback([items[i]]);
                return;
            }
        }
        resultCallback(null);
    };

}*/

function FakeMetadataProvider() {

    this.getViewMetadata = function (resultCallback) {

        return  {
            ConfigId: 'Structure',
            DocumentId: 'Common',
            ViewType: 'HomePage'
        };
    };


    this.getMenuMetadata = function (resultCallback) {

        throw 'not implemented getMenuMetadata FakeMetadataProvider';

    };


}
describe('ObjectDataSource', function () {
    var items = [
        {
            "Id": '1',
            "FirstName": "Иван",
            "LastName": "Иванов"
        },
        {
            "Id": '2',
            "FirstName": "Петр",
            "LastName": "Петров"
        },
        {
            "Id": '3',
            "FirstName": "Иван1",
            "LastName": "Иванов1"
        },
        {
            "Id": '4',
            "FirstName": "Петр2",
            "LastName": "Петров2"
        },
        {
            "Id": '5',
            "FirstName": "Иван3",
            "LastName": "Иванов3"
        },
        {
            "Id": '6',
            "FirstName": "Петр4",
            "LastName": "Петров5"
        },
        {
            "Id": '10',
            "FirstName": "Анна",
            "LastName": "Сергеева"

        }
    ];

    window.providerRegister.register('ObjectDataSource', ObjectDataProvider);

    function createObjectDataSource(){

        var builder = new ApplicationBuilder();
        var view = fakeView();
        var dataSource = builder.buildType('ObjectDataSource', {}, {parent: view, parentView: view, builder: builder}),
            initItems = JSON.parse(JSON.stringify(items));

        dataSource.setItems(initItems);

        return dataSource;
    }

    describe('ObjectDataSource base api', function () {
        it('should get list of data', function () {
            // Given //When
            var dataSource = createObjectDataSource(),
                items = dataSource.getItems();

            // Then
            assert.isTrue(dataSource.isDataReady(), 'dataReady status is right');
            assert.isTrue(items.length > 0, 'data provider returns items');
        });

        it('should create document', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            //When
            dataSource.createItem(
                function(context, argument){

                    // Then
                    var newItem = argument.value;
                    assert.ok(newItem, 'new item is ready');
                    assert.ok(newItem.Id, 'new item has Id');
                    done();
                }
            );
        });

        it('should get document property', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            //When
            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){
                // Then
                assert.equal(dataSource.getProperty('FirstName'), 'Иван', 'return property value by simple property');
                assert.equal(dataSource.getProperty('$.FirstName'), 'Иван', 'return property value by relative property');
                assert.equal(dataSource.getProperty('$').FirstName, 'Иван', 'return property - full item by $ selector');
                done();
            }
        });

        it('should select item', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){
                var items = dataSource.getItems();
                assert.equal(dataSource.getProperty('FirstName'), 'Иван', 'return property value by simple property');

                //When
                dataSource.setSelectedItem(items[1]);

                // Then
                assert.equal(dataSource.getProperty('FirstName'), 'Петр', 'return property value by simple property after change selected item');
                done();
            }
        });

        it('should change document property', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){
                assert.equal(dataSource.getProperty('FirstName'),'Иван', 'return property value by property');

                //When
                dataSource.setProperty('FirstName', 'Иванидзе');

                // Then
                assert.equal(dataSource.getProperty('$').FirstName, 'Иванидзе', 'return property value by property after change property');
                done();
            }
        });

        it('should change document property (full item change)', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){
                assert.equal(dataSource.getProperty('FirstName'), 'Иван', 'return property value by property');

                //When
                var newItemData = {
                    "Id": '1',
                    "FirstName": "Ивано",
                    "LastName": "Иванович"
                };
                dataSource.setProperty('$', newItemData);

                // Then
                assert.equal(dataSource.getProperty('$').FirstName, 'Ивано', 'return property value by property after change property');
                done();
            }
        });

        it('should validate item', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            dataSource.setErrorValidator(validator);
            dataSource.updateItems(handleItemsReady);

            function handleItemsReady(){

                //When
                var items = dataSource.getItems(),
                    validateResult1 = dataSource.validateOnErrors(items[0]),
                    validateResult2 = dataSource.validateOnErrors(items[1]),
                    validateResult3 = dataSource.validateOnErrors();

                // Then
                assert.isTrue(validateResult1.isValid, 'successfully validation');

                assert.isFalse(validateResult2.isValid, 'fail validation');
                assert.lengthOf(validateResult2.items, 1, 'fail validation results');
                assert.equal(validateResult2.items[0].property, 'FirstName', 'fail validation property result');

                assert.isFalse(validateResult3.isValid, 'full validation');
                assert.lengthOf(validateResult3.items, 6, 'full validation results');
                assert.equal(validateResult3.items[3].property, '4.FirstName', 'full validation property result');
                done();
            }

            function validator(context, argument){
                var result = {
                    isValid: true
                };

                if(argument.FirstName != 'Иван'){
                    result.isValid = false;
                    result.items = [{
                        property: 'FirstName',
                        message: 'Почему не Иван?!'
                    }];
                }

                return result;
            }
        });

        it('should save item', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            dataSource.updateItems(handleItemsReady1);

            function handleItemsReady1(){

                //When
                var item = dataSource.getSelectedItem();

                dataSource.setProperty('FirstName', 'Иванидзе');
                dataSource.saveItem(item);

                dataSource.updateItems(handleItemsReady2);
            }

            function handleItemsReady2(){
                // Then
                assert.equal(dataSource.getProperty('FirstName'), 'Иванидзе', 'item is saved');
                done();
            }
        });

        it('should delete item', function (done) {
            // Given
            var dataSource = createObjectDataSource();

            dataSource.updateItems(handleItemsReady1);

            function handleItemsReady1(){

                //When
                var items = dataSource.getItems(),
                    itemsCount = items.length;

                dataSource.deleteItem(items[0], function(context, argument){
                    // Then
                    items = dataSource.getItems();
                    assert.lengthOf(items, itemsCount-1, 'items length is decrease');
                    assert.equal(dataSource.getSelectedItem(), null, 'deleted item exclude from selected item');
                    done();
                });
            }
        });
    });

    describe('ObjectDataSource filter', function () {
        it('should get filtered list of data', function () {
            // Given //When
            var ds = createObjectDataSource(),
                items;

            //When
            ds.setFilter([
                {
                    CriteriaType: 64,
                    Property: "FirstName",
                    Value: "Иван"
                }
            ]);

            // Then
            items = ds.getItems();
            assert.isTrue(ds.isDataReady(), 'dataReady status is right');
            assert.lengthOf(items, 3, 'data provider returns items');
        });

        it('should reset filter', function () {
            // Given //When
            var ds = createObjectDataSource(),
                items;

            //When
            ds.setFilter([
                {
                    CriteriaType: 64,
                    Property: "FirstName",
                    Value: "Иван"
                }
            ]);
            assert.lengthOf(ds.getItems(), 3, 'Apply filter');

            ds.setFilter([]);

            // Then
            items = ds.getItems();
            assert.isTrue(ds.isDataReady(), 'dataReady status is right');
            assert.lengthOf(items, 7, 'clear filter');
        });

    });
});
describe('FileProvider', function () {

    function delay(min, max) {
        if (typeof min === 'undefined') {
            min = 100;
        }
        if (typeof  max === 'undefined') {
            max = 200;
        }

        return Math.ceil(Math.random() * (max - min) + min);
    }

    describe('DocumentUploadQueryConstructor', function () {
        var urlConstructor = new DocumentUploadQueryConstructor('http://127.0.0.1', {configId: 'config', documentId: 'document'});

        it('construct upload url', function () {
            var url = urlConstructor.getUploadUrl('photo', '11');

            assert.equal(url,
                'http://127.0.0.1/'
                + 'RestfulApi/Upload/configuration/uploadbinarycontent/?linkedData='
                +  '{"Configuration":"config","Metadata":"document","DocumentId":"11","FieldName":"photo"}');
        });

        it('construct download url', function () {
            var url = urlConstructor.getFileUrl('photo', '11');

            assert.equal(url,
                'http://127.0.0.1/'
                + 'RestfulApi/UrlEncodedData/configuration/downloadbinarycontent/?Form='
                +  '{"Configuration":"config","Metadata":"document","DocumentId":"11","FieldName":"photo"}');
        });

    });

    describe('DocumentFileProvider', function () {

        beforeEach(function () {
            //register fake upload provider
            window.providerRegister.register('DocumentFileProvider', function (/*metadata*/) {
                return {
                    uploadFile: function () {
                        var deferred = $.Deferred();
                        setTimeout(function () {
                            deferred.resolve();
                        }, delay());

                        return deferred.promise();
                    },
                    getFileUrl: function () {
                        return 'fake.html';
                    }
                };
            });

            //register fake DocumentDataSource provider
            window.providerRegister.register('DocumentDataSource', function (metadataValue) {
                return {
                    getItems: function (criteriaList, pageNumber, pageSize, sorting, resultCallback) {
                        resultCallback();
                    },
                    createItem: function (resultCallback, idProperty) {
                        var response = {
                            'DisplayName': 'display name'
                        };
                        setTimeout(function () {
                            resultCallback(response);
                        }, delay());
                    },

                    saveItem: function (value, resultCallback, warnings, idProperty) {
                        var response = [{
                            InstanceId: "42"
                        }];

                        setTimeout(function () {
                            resultCallback(response);
                        }, delay());
                    },
                    setCreateAction: function () {},
                    setReadAction: function () {},
                    setUpdateAction: function () {},
                    setDeleteAction: function () {},
                    setConfigId: function () {},
                    getConfigId: function () {},
                    setDocumentId: function () {},
                    getDocumentId: function () {},
                    createLocalItem: function (idProperty) {
                        var result = {};

                        result[idProperty] = guid();
                        result['__Id'] = result[idProperty];

                        return result;
                    }
                };

            });
        });


        it('DocumentDataSource.saveItem without files', function (done) {
            var builder = new ApplicationBuilder();
            var view = new View;
            var ds = builder.buildType('DocumentDataSource', {}, {parent: view, parentView: view, builder: builder});

            ds.createItem(function (context, args) {
                var item = args.value;
                ds.setProperty('title', 'some title');
                ds.saveItem(item, function (context, args) {
                    var value = args.value;
                    assert.equal(item, value);
                    done();
                }, function (args) {
                    done('Fail on saveItem');
                });

            });
        });
/*
        it('DocumentDataSource.saveItem with 1 file', function (done) {
            var builder = new ApplicationBuilder();
            var view = new View;
            var ds = builder.buildType('DocumentDataSource', {}, {parent: view, parentView: view, builder: builder});
            var uploadedFiles = [];

            ds.on('onFileUploaded', function (context, args) {
                uploadedFiles.push(args.value);
            });

            ds.createItem(function (context, args) {
                var item = args.value;
                ds.setProperty('title', 'some title');
                var content = '<html><head></head><body>html content</body></html>';
                ds.setFile(content, 'photo');
                ds.saveItem(item, function (context, args) {
                    var value = args.value;
                    assert.equal(item, value);
                    assert.lengthOf(uploadedFiles, 1, 'One file uploaded');
                    assert.equal(uploadedFiles[0], content);
                    done();
                }, function (args) {
                    done('Fail on saveItem');
                });
            });
        });

        it('DocumentDataSource.saveItem with files', function (done) {
            var builder = new ApplicationBuilder();
            var view = new View;
            var ds = builder.buildType('DocumentDataSource', {}, {parent: view, parentView: view, builder: builder});
            var uploadedFiles = [];
            var files = '1234567890'.split('')
                .map(function (num) {
                    return {
                        property: 'protperty_' + num,
                        content: '<html><head></head><body>html content #'+ num + '</body></html>'
                    };
                });


            ds.on('onFileUploaded', function (context, args) {
                uploadedFiles.push(args.value);
            });

            ds.createItem(function (context, args) {
                var item = args.value;
                ds.setProperty('title', 'some title');
                var content = '<html><head></head><body>html content</body></html>';
                files.forEach(function (file) {
                    ds.setFile(file.content, file.property);
                });

                ds.saveItem(item, function (context, args) {
                    var value = args.value;
                    var amount = files.filter(function(file) {
                        return uploadedFiles.indexOf(file.content !== -1);
                    }).length;
                    assert.equal(item, value);
                    assert.lengthOf(uploadedFiles, files.length, 'All files uploaded');
                    assert.equal(amount, files.length, 'specified files uploaded');
                    done();
                }, function (args) {
                    done('Fail on saveItem');
                });
            });
        });
*/
    });

});
describe('QueryConstructorStandard', function () {

    it('Default values', function () {

        // given
        // when
        var instance = new QueryConstructorStandard('http://localhost', {});

        // then
        assert.equal(instance.getCreateAction(), 'CreateDocument');
        assert.equal(instance.getReadAction(), 'GetDocument');
        assert.equal(instance.getUpdateAction(), 'SetDocument');
        assert.equal(instance.getDeleteAction(), 'DeleteDocument');
    });

    describe('Construct request url and params', function () {

        it('constructCreateDocumentRequest', function () {

            // given
            // when
            var instance = new QueryConstructorStandard('http://localhost');

            instance.setConfigId('myConfig');
            instance.setDocumentId('myDocument');

            // then
            var data = instance.constructCreateDocumentRequest();
            assert.equal(data.requestUrl, 'http://localhost/RestfulApi/StandardApi/configuration/CreateDocument');
            assert.deepEqual(data.args, {
                id: null,
                changesObject: {
                    Configuration: 'myConfig',
                    Metadata: 'myDocument'
                },
                replace: false
            });
        });

        it('constructReadDocumentRequest', function () {

            // given
            // when
            var instance = new QueryConstructorStandard('http://localhost');

            instance.setConfigId('myConfig');
            instance.setDocumentId('myDocument');

            // then
            var data = instance.constructReadDocumentRequest([], 1, 10, 'ASC');
            assert.equal(data.requestUrl, 'http://localhost/RestfulApi/StandardApi/configuration/GetDocument');
            assert.deepEqual(data.args, {
                id: null,
                changesObject: {
                    Configuration: 'myConfig',
                    Metadata: 'myDocument',
                    Filter: [],
                    PageNumber: 1,
                    PageSize: 10,
                    Sorting: 'ASC'
                },
                replace: false
            });
        });

        it('constructUpdateDocumentRequest', function () {

            // given
            // when
            var instance = new QueryConstructorStandard('http://localhost');

            instance.setConfigId('myConfig');
            instance.setDocumentId('myDocument');

            // then
            var data = instance.constructUpdateDocumentRequest({title: "My title"}, false);
            assert.equal(data.requestUrl, 'http://localhost/RestfulApi/StandardApi/configuration/SetDocument');
            assert.deepEqual(data.args, {
                id: null,
                changesObject: {
                    Configuration: 'myConfig',
                    Metadata: 'myDocument',
                    Document: {title: "My title"},
                    IgnoreWarnings: false
                },
                replace: false
            });
        });

        it('constructDeleteDocumentRequest', function () {

            // given
            // when
            var instance = new QueryConstructorStandard('http://localhost');

            instance.setConfigId('myConfig');
            instance.setDocumentId('myDocument');

            // then
            var data = instance.constructDeleteDocumentRequest('myDocumentId');
            assert.equal(data.requestUrl, 'http://localhost/RestfulApi/StandardApi/configuration/DeleteDocument');
            assert.deepEqual(data.args, {
                id: null,
                changesObject: {
                    Configuration: 'myConfig',
                    Metadata: 'myDocument',
                    Id: 'myDocumentId'
                },
                replace: false
            });
        });
    });


});
describe("AndValidator", function () {

    var falseValidator = new FalseValidator();

    var trueValidator = new TrueValidator();

    var failureTestCase =
        [
            [ falseValidator ],
            [ falseValidator, falseValidator ],
            [ falseValidator, trueValidator ],
            [ trueValidator, falseValidator ],
            [ falseValidator, falseValidator, falseValidator ],
            [ falseValidator, falseValidator, trueValidator ],
            [ falseValidator, trueValidator, falseValidator ],
            [ falseValidator, trueValidator, trueValidator ],
            [ trueValidator, falseValidator, falseValidator ],
            [ trueValidator, falseValidator, trueValidator ],
            [ trueValidator, trueValidator, falseValidator ]
        ];

    var successTestCase =
        [
            [],
            [ trueValidator ],
            [ trueValidator, trueValidator ],
            [ trueValidator, trueValidator, trueValidator ]
        ];

    var propertyTestCase =
        [
            { parent: null, property: null, expected: "" },
            { parent: null, property: "", expected: "" },
            { parent: "", property: null, expected: "" },
            { parent: "", property: "", expected: "" },
            { parent: "Parent", property: null, expected: "Parent" },
            { parent: "Parent", property: "", expected: "Parent" },
            { parent: null, property: "Property", expected: "Property" },
            { parent: "", property: "Property", expected: "Property" },
            { parent: "Parent", property: "Property", expected: "Parent.Property" }
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {

            // Given

            var validator = new AndValidator();
            validator.operators = failureTestCase[c];

            var falseOperatorCount = failureTestCase[c].filter(function (i) {
                return i === falseValidator
            }).length;

            // When
            var result = { };
            var isValid = validator.validate("", { }, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isNotNull(result.Items);
            assert.isDefined(result.Items);
            assert.equal(result.Items.length, falseOperatorCount);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {

            // Given

            var validator = new AndValidator();
            validator.operators = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", { }, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });

    it("should build validation result", function () {
        for (var c = 0; c < propertyTestCase.length; ++c) {

            // Given
            var validator = new AndValidator();
            validator.property = propertyTestCase[c].property;
            validator.operators = [ falseValidator ];

            // When
            var result = { };
            var isValid = validator.validate(propertyTestCase[c].parent, { }, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isNotNull(result.Items);
            assert.isDefined(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Property, propertyTestCase[c].expected);
        }
    });
});
describe("AndValidatorBuilder", function () {
    it("should build", function () {
        // Given

        var factory = new createValidationBuilderFactory();

        var meta = {
            And: {
                Property: "Property1",
                Operators: [
                    {
                        IsMoreThan: {
                            Message: "Message1",
                            Value: 0
                        }
                    },
                    {
                        IsLessThan: {
                            Message: "Message2",
                            Value: 3
                        }
                    }
                ]
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.isDefined(validator);
        assert.isNotNull(validator);
        assert.equal(validator.property, meta.And.Property);
        assert.equal(validator.operators.length, 2);
        assert.equal(validator.operators[0].message, meta.And.Operators[0].IsMoreThan.Message);
        assert.equal(validator.operators[1].message, meta.And.Operators[1].IsLessThan.Message);
    });
});
describe("NotValidator", function () {
    it("should validate when failure", function () {
        // Given
        var validator = new NotValidator();
        validator.operator = new TrueValidator();
        validator.message = "Error";

        // When
        var result = { };
        var isValid = validator.validate("", { }, result);

        // Then
        assert.isFalse(isValid);
        assert.isFalse(result.IsValid);
        assert.isTrue(result.Items !== null && result.Items !== undefined && result.Items.length === 1);
        assert.equal(validator.message, result.Items[0].Message);
    });

    it("should validate when success", function () {
        // Given
        var validator = new NotValidator();
        validator.operator = new FalseValidator();
        validator.message = "Error";

        // When
        var result = { };
        var isValid = validator.validate("", { }, result);

        // Then
        assert.isTrue(isValid);
        assert.isTrue(result.IsValid);
        assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
    });
});
describe("NotValidatorBuilder", function () {
    it("should build", function () {
        // Given

        var factory = new createValidationBuilderFactory();

        var meta = {
            Not: {
                Message: "Значение не может быть равно 1234",
                Property: "NotProperty1",
                Operator: {
                    IsEqual: {
                        Message: "IsEqual1",
                        Property: "IsEqualProperty1",
                        Value: 1234
                    }
                }
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.isDefined(validator);
        assert.isNotNull(validator);
        assert.equal(validator.message, meta.Not.Message);
        assert.equal(validator.property, meta.Not.Property);
        assert.equal(validator.operator.value, meta.Not.Operator.IsEqual.Value);
    });
});
describe("OrValidator", function () {

    var falseValidator = new FalseValidator();

    var trueValidator = new TrueValidator();

    var failureTestCase =
        [
            [ ],
            [ falseValidator ],
            [ falseValidator, falseValidator ],
            [ falseValidator, falseValidator, falseValidator ]
        ];

    var successTestCase =
        [
            [ trueValidator ],
            [ falseValidator, trueValidator ],
            [ trueValidator, falseValidator ],
            [ trueValidator, trueValidator ],
            [ falseValidator, falseValidator, trueValidator ],
            [ falseValidator, trueValidator, falseValidator ],
            [ falseValidator, trueValidator, trueValidator ],
            [ trueValidator, falseValidator, falseValidator ],
            [ trueValidator, falseValidator, trueValidator ],
            [ trueValidator, trueValidator, falseValidator ],
            [ trueValidator, trueValidator, trueValidator ]
        ];

    var propertyTestCase =
        [
            { parent: null, property: null, expected: "" },
            { parent: null, property: "", expected: "" },
            { parent: "", property: null, expected: "" },
            { parent: "", property: "", expected: "" },
            { parent: "Parent", property: null, expected: "Parent" },
            { parent: "Parent", property: "", expected: "Parent" },
            { parent: null, property: "Property", expected: "Property" },
            { parent: "", property: "Property", expected: "Property" },
            { parent: "Parent", property: "Property", expected: "Parent.Property" }
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {

            // Given

            var validator = new OrValidator();
            validator.operators = failureTestCase[c];

            var falseOperatorCount = failureTestCase[c].filter(function (i) {
                return i === falseValidator
            }).length;

            // When
            var result = { };
            var isValid = validator.validate("", { }, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isNotNull(result.Items);
            assert.isDefined(result.Items);
            assert.equal(result.Items.length, falseOperatorCount);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {

            // Given

            var validator = new OrValidator();
            validator.operators = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", { }, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });

    it("should build validation result", function () {
        for (var c = 0; c < propertyTestCase.length; ++c) {

            // Given
            var validator = new OrValidator();
            validator.property = propertyTestCase[c].property;
            validator.operators = [ falseValidator ];

            // When
            var result = { };
            var isValid = validator.validate(propertyTestCase[c].parent, { }, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isNotNull(result.Items);
            assert.isDefined(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Property, propertyTestCase[c].expected);
        }
    });
});
describe("OrValidatorBuilder", function () {
    it("should build", function () {
        // Given

        var factory = new createValidationBuilderFactory();

        var meta = {
            Or: {
                Property: "Property1",
                Operators: [
                    {
                        IsLessThan: {
                            Message: "Значение должно быть меньше 0",
                            Value: 0
                        }
                    },
                    {
                        IsMoreThan: {
                            Message: "Значение должно быть больше 3",
                            Value: 3
                        }
                    }
                ]
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.isDefined(validator);
        assert.isNotNull(validator);
        assert.equal(validator.property, meta.Or.Property);
        assert.equal(validator.operators.length, 2);
        assert(validator.operators[0].message, meta.Or.Operators[0].IsLessThan.Message);
        assert(validator.operators[1].message, meta.Or.Operators[1].IsMoreThan.Message);
    });
});
describe("AllValidator", function () {

    var testPredicate = function (i) {
        return i === 3;
    };

    var testValidator = new PredicateValidator();
    testValidator.message = "Error";
    testValidator.predicate = testPredicate;

    var failureTestCase =
        [
            [ 1 ],
            [ 1, 2 ],
            [ 1, 2, 3 ]
        ];

    var successTestCase =
        [
            [ ],
            [ 3 ],
            [ 3, 3 ],
            [ 3, 3, 3 ]
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {

            // Given

            var target = failureTestCase[c];

            var validator = new AllValidator();
            validator.operator = testValidator;

            var falseItemCount = target.filter(function (i) {
                return !testPredicate(i);
            }).length;

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, falseItemCount);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {

            // Given

            var target = successTestCase[c];

            var validator = new AllValidator();
            validator.operator = testValidator;

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });

    it("should build validation result", function () {
        // Given
        var validator = new AllValidator();
        validator.operator = testValidator;

        // When
        var result = { };
        var isValid = validator.validate("Collection1", [ 1, 2 ], result);

        // Then
        assert.isFalse(isValid);
        assert.isFalse(result.IsValid);
        assert.isDefined(result.Items);
        assert.isNotNull(result.Items);
        assert.equal(result.Items.length, 2);
        assert.equal(result.Items[0].Property, "Collection1.0");
        assert.equal(result.Items[1].Property, "Collection1.1");
        assert.equal(result.Items[0].Message, testValidator.message);
        assert.equal(result.Items[1].Message, testValidator.message);
    });
});
describe("AllValidatorBuilder", function () {
    it("should build", function () {
        // Given

        var factory = new createValidationBuilderFactory();

        var meta = {
            All: {
                Operator: {
                    IsLessThan: {
                        Property: "LessThanProperty1",
                        Message: "LessThanMessage1",
                        Value: 3
                    }
                }
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.isDefined(validator);
        assert.isNotNull(validator);
        assert.equal(validator.operator.value, 3);
        assert.equal(validator.operator.property, meta.All.Operator.IsLessThan.Property);
        assert.equal(validator.operator.message, meta.All.Operator.IsLessThan.Message);
    });
});
describe("AnyValidator", function () {

    var testPredicate = function (i) {
        return i === 3;
    };

    var testValidator = new PredicateValidator();
    testValidator.message = "Error";
    testValidator.predicate = testPredicate;

    var failureTestCase =
        [
            [ ],
            [ 1 ],
            [ 1, 2 ]
        ];

    var successTestCase =
        [
            [ 1, 2, 3 ]
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {

            // Given

            var target = failureTestCase[c];

            var validator = new AnyValidator();
            validator.operator = testValidator;

            var falseItemCount = target.filter(function (i) {
                return !testPredicate(i);
            }).length;

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, falseItemCount);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {

            // Given

            var target = successTestCase[c];

            var validator = new AnyValidator();
            validator.operator = testValidator;

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });

    it("should build validation result", function () {
        // Given
        var validator = new AnyValidator();
        validator.operator = testValidator;

        // When
        var result = { };
        var isValid = validator.validate("Collection1", [ 1, 2 ], result);

        // Then
        assert.isFalse(isValid);
        assert.isFalse(result.IsValid);
        assert.isDefined(result.Items);
        assert.isNotNull(result.Items);
        assert.equal(result.Items.length, 2);
        assert.equal(result.Items[0].Property, "Collection1.0");
        assert.equal(result.Items[1].Property, "Collection1.1");
        assert.equal(result.Items[0].Message, testValidator.message);
        assert.equal(result.Items[1].Message, testValidator.message);
    });
});
describe("AnyValidatorBuilder", function () {
    it("should build", function () {
        // Given

        var factory = new createValidationBuilderFactory();

        var meta = {
            Any: {
                Operator: {
                    IsLessThan: {
                        Property: "LessThanProperty1",
                        Message: "LessThanMessage1",
                        Value: 3
                    }
                }
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.isDefined(validator);
        assert.isNotNull(validator);
        assert.equal(validator.operator.value, 3);
        assert.equal(validator.operator.property, meta.Any.Operator.IsLessThan.Property);
        assert.equal(validator.operator.message, meta.Any.Operator.IsLessThan.Message);
    });
});
describe("IsContainsCollectionValidator", function () {

    var validator = new IsContainsCollectionValidator();
    validator.message = "Error";
    validator.value = 3;

    var failureTestCase =
        [
            null,
            [],
            [ 1, 2 ]
        ];

    var successTestCase =
        [
            [ 1, 2, 3 ]
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {

            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {

            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsContainsCollectionValidatorBuilder", function () {
    it("should build", function () {
        // Given

        var factory = new createValidationBuilderFactory();

        var meta = {
            IsContainsCollection: {
                Message: "Message1",
                Value: 1234
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.isDefined(validator);
        assert.isNotNull(validator);
        assert.equal(validator.value, meta.IsContainsCollection.Value);
        assert.equal(validator.message, meta.IsContainsCollection.Message);
    });
});	
describe("IsNullOrEmptyCollectionValidator", function () {

    var validator = new IsNullOrEmptyCollectionValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            [ 1, 2, 3 ]
        ];

    var successTestCase =
        [
            null,
            []
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {

            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {

            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsNullOrEmptyCollectionValidatorBuilder", function () {
    it("should build", function () {
        // Given

        var factory = new createValidationBuilderFactory();

        var meta = {
            IsNullOrEmptyCollection: {
                Message: "Message1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.isDefined(validator);
        assert.isNotNull(validator);
        assert.equal(validator.message, meta.IsNullOrEmptyCollection.Message);
    });
});	
describe("IsAbsoluteUriValidator", function () {

    var validator = new IsAbsoluteUriValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            null,
            undefined,
            "",
            "/display/MC/IsRelativeUri",
            123
        ];

    var successTestCase =
        [
            "http://wiki.infinnity.lan:8081/display/MC/IsAbsoluteUri",
            "https://wiki.infinnity.lan:8081/display/MC/IsAbsoluteUri"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsAbsoluteUriBuilder", function(){
    it("should return true when collection exist value", function(){
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsAbsoluteUri:{
                Property: "Property1",
                Message: "Message1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsAbsoluteUri.Message);
        assert.equal(validator.property, meta.IsAbsoluteUri.Property);
    });
});
describe("IsContainsValidator", function () {

    var validator = new IsContainsValidator();
    validator.message = "Error";
    validator.value = "Abc";

    var failureTestCase =
        [
            null,
            "",
            "Xyz"
        ];

    var successTestCase =
        [
            "Abc",
            "abc",
            "AbcXyz",
            "abcXyz",
            "XyAbcz",
            "Xyabcz",
            "XyzAbc",
            "Xyzabc"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsContainsBuilder", function() {
    it("should return true if target exist value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsContains:{
                Message: "Message1",
                Value: "Abc"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsContains.Message);
        assert.equal(validator.value, meta.IsContains.Value);
    });
});
describe("IsDefaultValueValidator", function () {

    var validator = new IsDefaultValueValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            123,
            1.23,
            "abc",
            { },
            [ ]
        ];

    var successTestCase =
        [
            null,
            undefined,
            false,
            0,
            0.0
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsDefaultValueBuilder", function () {
    it("should return true when target is default", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsDefaultValue:{
                Message: "Message1",
                Property: "Property1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsDefaultValue.Message);
        assert.equal(validator.property, meta.IsDefaultValue.Property);
    });
});
describe("IsEndsWithValidator", function () {

    var validator = new IsEndsWithValidator();
    validator.message = "Error";
    validator.value = "Abc";

    var failureTestCase =
        [
            null,
            "",
            "Xyz",
            "AbcXyz",
            "abcXyz",
            "AbcXyz",
            "abcXyz"
        ];

    var successTestCase =
        [
            "Abc",
            "abc",
            "XyzAbc",
            "Xyzabc"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsEndsWithBuilder", function() {
    it("should return true if target ends with value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsEndsWith:{
                Message: "Message1",
                Value: "Abc"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsEndsWith.Message);
        assert.equal(validator.value, meta.IsEndsWith.Value);
    });
});
describe("IsEqualValidator", function () {

    var failureTestCase =
        [
            { target: "", value: "Abc" },
            { target: "Abc", value: "" },
            { target: null, value: 123 },
            { target: 123, value: null },
            { target: null, value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 1), value: null },
            { target: null, value: "2014-01-01" }
        ];

    var successTestCase =
        [
            { target: null, value: null },
            { target: "", value: "" },
            { target: "Abc", value: "Abc" },
            { target: 123, value: 123 },
            // Todo: { target: new Date(2014, 0, 1), value: new Date(2014, 0, 1) },
            // Todo: { target: new Date(2014, 0, 1), value: "2014-01-01" }
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var testCase = failureTestCase[c];
            var validator = new IsEqualValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var testCase = successTestCase[c];
            var validator = new IsEqualValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsEqualBuilder", function () {
    it("should return true when target is equal value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsEqual:{
                Message: "Message1",
                Value: 1234
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsEqual.Message);
        assert.equal(validator.value, meta.IsEqual.Value);
    });
});
describe("IsGuidValidator", function () {

    var validator = new IsGuidValidator();
    validator.message = "Error";
    validator.value = "Abc";

    var failureTestCase =
        [
            null,
            "",
            "NotGuid"
        ];

    var successTestCase =
        [
            "436CAC70-4BD9-4476-B513-A13D7A6F197F",
            "{436CAC70-4BD9-4476-B513-A13D7A6F197F}"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsGuidBuilder", function(){
   it("should return true if target is GUID", function(){
       // Given
       var factory = new createValidationBuilderFactory();

       var meta = {
           IsGuid:{
               Property: "Property1",
               Message: "Message1"
           }
       };

       // When
       var validator = factory.build(meta);

       // Then
       assert.equal(validator.message, meta.IsGuid.Message);
       assert.equal(validator.value, meta.IsGuid.Value);
    });
});
describe("IsInValidator", function () {

    var validator = new IsInValidator();
    validator.message = "Error";
    validator.items = [ 1, 2, 3 ];

    var failureTestCase =
        [
            null,
            0,
            4
        ];

    var successTestCase =
        [
            1,
            2,
            3
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsInBuilder", function () {
    it("should return true if Items exist target", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsIn:{
                Message: "Message1",
                Property: "Property1",
                Items: [ 1, 2, 3 ]
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.items.length, 3);
        assert.equal(validator.message, meta.IsIn.Message);
        assert.equal(validator.property, meta.IsIn.Property);
    });
});
describe("IsLessThanOrEqualValidator", function () {

    var failureTestCase =
        [
            { target: null, value: 123 },
            { target: 1234, value: 123 },
            { target: null, value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 2), value: new Date(2014, 0, 1) },
            { target: null, value: "2014-01-01" },
            { target: new Date(2014, 0, 2), value: "2014-01-01" }
        ];

    var successTestCase =
        [
            { target: 123, value: 123 },
            { target: 123, value: 1234 },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 2) }
            // Todo: { target: new Date(2014, 0, 1), value: "2014-01-01" },
            // Todo: { target: new Date(2014, 0, 1), value: "2014-01-02" }
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var testCase = failureTestCase[c];
            var validator = new IsLessThanOrEqualValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var testCase = successTestCase[c];
            var validator = new IsLessThanOrEqualValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsLessThanOrEqualBuilder", function () {
    it("should return true if target <= value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsLessThanOrEqual:{
                Message: "Message1",
                Value: 1234
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsLessThanOrEqual.Message);
        assert.equal(validator.value, meta.IsLessThanOrEqual.Value);
    });
});
describe("IsLessThanValidator", function () {

    var failureTestCase =
        [
            { target: null, value: 123 },
            { target: 123, value: 123 },
            { target: 124, value: 123 },
            { target: null, value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 2), value: new Date(2014, 0, 1) },
            { target: null, value: "2014-01-01" },
            { target: new Date(2014, 0, 1), value: "2014-01-01" },
            { target: new Date(2014, 0, 2), value: "2014-01-01" }
        ];

    var successTestCase =
        [
            { target: 123, value: 1234 },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 2) }
            // Todo: { target: new Date(2014, 0, 1), value: "2014-01-02" }
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var testCase = failureTestCase[c];
            var validator = new IsLessThanValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var testCase = successTestCase[c];
            var validator = new IsLessThanValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsLessThanBuilder", function () {
    it("should return true if target < value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsLessThan:{
                Message: "Message1",
                Value: 1234
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsLessThan.Message);
        assert.equal(validator.value, meta.IsLessThan.Value);
    });
});

describe("IsMoreThanOrEqualValidator", function () {

    var failureTestCase =
        [
            { target: null, value: 123 },
            { target: 123, value: 1234 },
            { target: null, value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 2) },
            { target: null, value: "2014-01-01" },
            { target: new Date(2014, 0, 1), value: "2014-01-02" }
        ];

    var successTestCase =
        [
            { target: 123, value: 123 },
            { target: 1234, value: 1234 },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 2), value: new Date(2014, 0, 1) }
            // Todo: { target: new Date(2014, 0, 1), value: "2014-01-01" },
            // Todo: { target: new Date(2014, 0, 2), value: "2014-01-01" }
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var testCase = failureTestCase[c];
            var validator = new IsMoreThanOrEqualValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var testCase = successTestCase[c];
            var validator = new IsMoreThanOrEqualValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsMoreThanOrEqualBuilder", function () {
    it("should return true if target >= value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsMoreThanOrEqual:{
                Message: "Message1",
                Value: 1234
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsMoreThanOrEqual.Message);
        assert.equal(validator.value, meta.IsMoreThanOrEqual.Value);
    });
});

describe("IsMoreThanValidator", function () {

    var failureTestCase =
        [
            { target: null, value: 123 },
            { target: 123, value: 123 },
            { target: 123, value: 1234 },
            { target: null, value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 1) },
            { target: new Date(2014, 0, 1), value: new Date(2014, 0, 2) },
            { target: null, value: "2014-01-01" },
            { target: new Date(2014, 0, 1), value: "2014-01-01" },
            { target: new Date(2014, 0, 1), value: "2014-01-02" }
        ];

    var successTestCase =
        [
            { target: 1234, value: 123 },
            { target: new Date(2014, 0, 2), value: new Date(2014, 0, 1) }
            // Todo: { target: new Date(2014, 0, 2), value: "2014-01-01" }
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var testCase = failureTestCase[c];
            var validator = new IsMoreThanValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var testCase = successTestCase[c];
            var validator = new IsMoreThanValidator();
            validator.message = "Error";
            validator.value = testCase.value;

            // When
            var result = { };
            var isValid = validator.validate("", testCase.target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsMoreThanBuilder", function () {
    it("should return true if target > value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsMoreThan:{
                Message: "Message1",
                Value: 1234
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsMoreThan.Message);
        assert.equal(validator.value, meta.IsMoreThan.Value);
    });
});

describe("IsNullOrEmptyValidator", function () {

    var validator = new IsNullOrEmptyValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            " ",
            "Xyz"
        ];

    var successTestCase =
        [
            null,
            undefined,
            ""
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsNullOrEmptyBuilder", function(){
    it("should return true if target is Null or Empty", function(){
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsNullOrEmpty:{
                Message: "Message1",
                Property: "Property1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsNullOrEmpty.Message);
        assert.equal(validator.property, meta.IsNullOrEmpty.Property);
    });
});
describe("IsNullOrWhiteSpaceValidator", function () {

    var validator = new IsNullOrWhiteSpaceValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            "Xyz",
            "Xyz ",
            " Xyz"
        ];

    var successTestCase =
        [
            null,
            undefined,
            "",
            " ",
            "  "
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsNullOrWhiteSpaceBuilder", function(){
    it("should return true if target is Null or Empty or WhiteSpace", function(){
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsNullOrWhiteSpace:{
                Message: "Message1",
                Property: "Property1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsNullOrWhiteSpace.Message);
        assert.equal(validator.property, meta.IsNullOrWhiteSpace.Property);
    });
});
describe("IsNullValidator", function () {

    var validator = new IsNullValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            "",
            "Xyz",
            { },
            [ ],
            123
        ];

    var successTestCase =
        [
            null,
            undefined
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsNullBuilder", function () {
    it("should return true when target is null", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsNull:{
                Message: "Message1",
                Property: "Property1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsNull.Message);
        assert.equal(validator.property, meta.IsNull.Property);
    });
});
describe("IsRegexValidator", function () {

    var validator = new IsRegexValidator();
    validator.message = "Error";
    validator.pattern = "[0-9]+";

    var failureTestCase =
        [
            null,
            undefined,
            "",
            "Xyz",
            123
        ];

    var successTestCase =
        [
            "123"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsRegexBuilder", function() {
    it("should return true if target ends with value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsRegex:{
                Message: "Message1",
                Pattern: "[0-9]+"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsRegex.Message);
        assert.equal(validator.pattern, meta.IsRegex.Pattern);
    });
});

describe("IsRelativeUriValidator", function () {

    var validator = new IsRelativeUriValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            null,
            undefined,
            "",
            123
        ];

    var successTestCase =
        [
            "http://wiki.infinnity.lan:8081/display/MC/IsAbsoluteUri",
            "/display/MC/IsRelativeUri"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsRelativeUriBuilder", function(){
    it("should return true if target is RelativeUri", function(){
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsRelativeUri:{
                Message: "Message1",
                Property: "Property1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsRelativeUri.Message);
        assert.equal(validator.property, meta.IsRelativeUri.Property);
    });
});
describe("IsStartsWithValidator", function () {

    var validator = new IsStartsWithValidator();
    validator.message = "Error";
    validator.value = "Abc";

    var failureTestCase =
        [
            null,
            undefined,
            "",
            "Xyz",
            "XyAbcz",
            "Xyabcz",
            "XyzAbc",
            "Xyzabc"
        ];

    var successTestCase =
        [
            "Abc",
            "abc",
            "AbcXyz",
            "abcXyz"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsStartsWithBuilder", function() {
    it("should return true if target begin with value", function () {
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsStartsWith:{
                Message: "Message1",
                Value: "Abc"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsStartsWith.Message);
        assert.equal(validator.value, meta.IsStartsWith.Value);
    });
});
describe("IsUriValidator", function () {

    var validator = new IsUriValidator();
    validator.message = "Error";

    var failureTestCase =
        [
            null,
            undefined,
            "",
            123
        ];

    var successTestCase =
        [
            "http://wiki.infinnity.lan:8081/display/MC/IsAbsoluteUri",
            "/display/MC/IsRelativeUri"
        ];

    it("should validate when failure", function () {
        for (var c = 0; c < failureTestCase.length; ++c) {
            // Given
            var target = failureTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isFalse(isValid);
            assert.isFalse(result.IsValid);
            assert.isDefined(result.Items);
            assert.isNotNull(result.Items);
            assert.equal(result.Items.length, 1);
            assert.equal(result.Items[0].Message, validator.message);
        }
    });

    it("should validate when success", function () {
        for (var c = 0; c < successTestCase.length; ++c) {
            // Given
            var target = successTestCase[c];

            // When
            var result = { };
            var isValid = validator.validate("", target, result);

            // Then
            assert.isTrue(isValid);
            assert.isTrue(result.IsValid);
            assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
        }
    });
});
describe("IsUriBuilder", function(){
    it("should return true if target is Uri", function(){
        // Given
        var factory = new createValidationBuilderFactory();

        var meta = {
            IsUri:{
                Message: "Message1",
                Property: "Property1"
            }
        };

        // When
        var validator = factory.build(meta);

        // Then
        assert.equal(validator.message, meta.IsUri.Message);
        assert.equal(validator.property, meta.IsUri.Property);
    });
});
describe("validationMethods", function () {
    describe("generalValidate", function () {

        var propertyTestCase =
            [
                { parent: null, property: null, expected: "" },
                { parent: null, property: "", expected: "" },
                { parent: "", property: null, expected: "" },
                { parent: "", property: "", expected: "" },
                { parent: "Parent", property: null, expected: "Parent" },
                { parent: "Parent", property: "", expected: "Parent" },
                { parent: null, property: "Property", expected: "Property" },
                { parent: "", property: "Property", expected: "Property" },
                { parent: "Parent", property: "Property", expected: "Parent.Property" }
            ];

        it("should build validation result when fail", function () {
            for (var c = 0; c < propertyTestCase.length; ++c) {
                // Given
                var validator = new FalseValidator();
                validator.property = propertyTestCase[c].property;
                validator.message = "Error";

                // When
                var result = { };
                var isValid = validator.validate(propertyTestCase[c].parent, { }, result);

                // Then
                assert.isFalse(isValid);
                assert.isFalse(result.IsValid);
                assert.isNotNull(result.Items);
                assert.isDefined(result.Items);
                assert.equal(result.Items.length, 1);
                assert.equal(result.Items[0].Property, propertyTestCase[c].expected);
            }
        });

        it("should build validation result when success", function () {
            for (var c = 0; c < propertyTestCase.length; ++c) {
                // Given
                var validator = new TrueValidator();
                validator.property = propertyTestCase[c].property;
                validator.message = "Error";

                // When
                var result = { };
                var isValid = validator.validate(propertyTestCase[c].parent, { }, result);

                // Then
                assert.isTrue(isValid);
                assert.isTrue(result.IsValid);
                assert.isTrue(result.Items === null || result.Items === undefined || result.Items.length === 0);
            }
        });
    });

    describe("combinePropertyPath", function () {
        it("should build property path", function () {
            assert.equal(combinePropertyPath(null, null), "");
            assert.equal(combinePropertyPath(null, ""), "");
            assert.equal(combinePropertyPath("", null), "");
            assert.equal(combinePropertyPath("", ""), "");
            assert.equal(combinePropertyPath("Parent", null), "Parent");
            assert.equal(combinePropertyPath("Parent", ""), "Parent");
            assert.equal(combinePropertyPath(null, "Property"), "Property");
            assert.equal(combinePropertyPath("", "Property"), "Property");
            assert.equal(combinePropertyPath("Parent", "Property"), "Parent.Property");

            assert.equal(combinePropertyPath(null, 9), "9");
            assert.equal(combinePropertyPath("", 9), "9");
            assert.equal(combinePropertyPath("Parent", 9), "Parent.9");
            assert.equal(combinePropertyPath(9, null), "9");
            assert.equal(combinePropertyPath(9, ""), "9");
            assert.equal(combinePropertyPath(9, "Property"), "9.Property");
        });
    });
});
describe('DateTimeEditMask', function () {
    describe('format', function () {

        it('successful build template', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "%dd MM yyyy г.";
            //When
            var template = editMask.buildTemplate();
            //Then
            assert.isArray(template);
            assert.lengthOf(template, 6);
        });

        it('successful format value', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "%dd MM yyyy г.";
            editMask.format = new DateTimeFormat();
            editMask.format.setFormat(editMask.mask);
            //When
            editMask.reset('2014-09-26T15:15');
            var text = editMask.getText();
            //Then
            assert.equal(text, '26 09 2014 г.');
        });

        it('successful input value', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "dd MM yyyy г.";
            editMask.format = new DateTimeFormat();
            editMask.format.setFormat(editMask.mask);
            //var template = editMask.buildTemplate();
            editMask.reset(null);
            //When
            var position = 0;
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('9', position);
            position = editMask.setCharAt('0', position);
            position = editMask.setCharAt('7', position);
            position = editMask.setCharAt('2', position);
            position = editMask.setCharAt('0', position);
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('4', position);
            var text = editMask.getText();
            //Then
            assert.equal(text, '19 07 2014 г.');
            assert.equal(position, 10)
        });

        it('successful navigation', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "dd MM yyyy г.";
            editMask.format = new DateTimeFormat();
            editMask.format.setFormat(editMask.mask);
            var date = new Date();
            editMask.reset(date);
            //When
            var position = 0;
            var start = editMask.moveToPrevChar(position);
            position = editMask.moveToNextChar(99);
            position = editMask.setNextValue(position);
            //Then
            var value = editMask.getValue();
            var text = editMask.getText();
            assert.equal(position, text.length - 3);
            assert.equal(date.getFullYear() + 1, (new Date(value)).getFullYear());
        });

        it('successful delete char (right)', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "dd MM yyyy г.";
            editMask.format = new DateTimeFormat();
            editMask.format.setFormat(editMask.mask);

            var date = new Date(2014, 9, 6, 9, 30, 50, 0);  //06-10-2014 09:30:50
            editMask.reset(date);
            //When
            var position = 0;
            var start = editMask.moveToPrevChar(position);

            position = editMask.deleteCharRight(position);//"6_ 10 2014 г."
            position = editMask.deleteCharRight(position);//"__ 10 2014 г."

            //Then
            var text = editMask.getText();
            assert.equal(position, 3);
            assert.equal(text, "__ 10 2014 г.");
        });

        it('successful delete char (left)', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "dd MM yyyy г.";
            editMask.format = new DateTimeFormat();
            editMask.format.setFormat(editMask.mask);

            var date = new Date(2014, 9, 6, 9, 30, 50, 0);  //06-10-2014 09:30:50
            editMask.reset(date);
            //When
            var position = 8;
            var start = editMask.moveToPrevChar(position);

            position = editMask.deleteCharLeft(position);//"06 10 214_ г."
            position = editMask.deleteCharLeft(position);//"06 10 14__ г."

            //Then
            var text = editMask.getText();
            assert.equal(position, 6);
            assert.equal(text, "06 10 14__ г.");
        });

        it('successful set char', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "dd MM yyyy г.";
            editMask.format = new DateTimeFormat();
            editMask.format.setFormat(editMask.mask);

            editMask.reset(null);
            //When
            var position = 9;
            var start = editMask.moveToPrevChar(position); //"__ __ ____ г."

            position = editMask.setCharAt('2', position);
            position = editMask.setCharAt('0', position);
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('4', position);

            //Then
            var text = editMask.getText();
            assert.equal(start, 8);
            assert.equal(position, 10);
            assert.equal(text, "__ __ 2014 г.");
        });


        it('successful delete value', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "dd MM yyyy г.";
            editMask.format = new DateTimeFormat();
            editMask.format.setFormat(editMask.mask);
            //var template = editMask.buildTemplate();
            editMask.reset(null);
            //When
            var position = 0;
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('9', position);
            position = editMask.setCharAt('0', position);
            position = editMask.setCharAt('7', position);
            position = editMask.setCharAt('2', position);
            position = editMask.setCharAt('0', position);
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('4', position);

            position = editMask.deleteCharLeft(position);// 4
            position = editMask.deleteCharLeft(position);// 1
            position = editMask.deleteCharLeft(position);// 0
            position = editMask.deleteCharLeft(position);// 2
            position = editMask.deleteCharLeft(position);// .
            position = editMask.deleteCharLeft(position);// 7
            position = editMask.deleteCharLeft(position);// 0
            position = editMask.deleteCharLeft(position);// .
            position = editMask.deleteCharLeft(position);// 9
            position = editMask.deleteCharLeft(position);// 1
            var text = editMask.getText();
            //Then
            assert.equal(text, '__ __ ____ г.');
            assert.equal(position, 0);
        });

    });


});
describe('NumberEditMask', function () {
    describe('format', function () {

        it('successful build template', function () {
            //Given
            var editMask = new DateTimeEditMask();
            editMask.mask = "%d MM yyyy г.";
            //When
            var template = editMask.buildTemplate();
            //Then
            assert.isArray(template);
            assert.lengthOf(template, 6);
        });

        it('successful format value', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена n3 руб. за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);
            //When
            editMask.reset('50');
            var text = editMask.getText();
            //Then
            assert.equal(text, 'Цена 50,000 руб. за 1 кг');
        });

        it('successful setCharAt', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена n3 руб. за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);

            //When
            editMask.reset('50');
            var position = 5;
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('2', position);
            position = editMask.setCharAt('3', position);
            position = editMask.setCharAt('4', position);
            position = editMask.setCharAt(',', position);
            position = editMask.setCharAt('9', position);
            var text = editMask.getText();

            //Then
            assert.equal(text, 'Цена 123 450,900 руб. за 1 кг');
            assert.equal(position, 14);

        });

        it('successful setNextValue/setPrevValue', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена n3 руб. за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);

            //When
            editMask.reset('50');
            var position = 5;
            position = editMask.setNextValue(position);
            position = editMask.setNextValue(position);
            position = editMask.setCharAt(',', position);
            position = editMask.setPrevValue(position);
            position = editMask.setPrevValue(position);
            var text = editMask.getText();

            //Then
            assert.equal(text, 'Цена 50,000 руб. за 1 кг');
            assert.equal(position, 8);

        });

        it('successful delete chars', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена n3 руб. за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);

            //When
            editMask.reset(123456789.876);
            var position = 20;
            position = editMask.deleteCharLeft(position);   //"Цена 123 456 789,870 руб. за 1 кг"
            position = editMask.deleteCharLeft(position);   //"Цена 123 456 789,800 руб. за 1 кг"
            position = editMask.deleteCharLeft(position);   //"Цена 123 456 789,000 руб. за 1 кг"
            position = editMask.deleteCharLeft(position);   //"Цена 12 345 678,000 руб. за 1 кг"
            position = editMask.deleteCharLeft(position);   //"Цена 1 234 567,000 руб. за 1 кг"
            position = editMask.deleteCharLeft(position);   //"Цена 123 456,000 руб. за 1 кг"
            position = editMask.deleteCharLeft(position);   //"Цена 12 345,000 руб. за 1 кг"
            position = editMask.moveToPrevChar(position);
            position = editMask.moveToPrevChar(position);
            position = editMask.moveToPrevChar(position);
            position = editMask.moveToPrevChar(position);
            position = editMask.deleteCharRight(position);   //"Цена 1 245,000 руб. за 1 кг"
            position = editMask.deleteCharRight(position);   //"Цена 125,000 руб. за 1 кг"
            var text = editMask.getText();

            //Then
            assert.equal(text, 'Цена 125,000 руб. за 1 кг');
            assert.equal(position, 7);

        });

        it('successful movePrevChar', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена n3 руб. за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);

            //When
            editMask.reset(1234.567);   //"Цена 1 234,567 руб. за 1 кг"
            var position = 14;
            position = editMask.moveToPrevChar(position);
            position = editMask.moveToPrevChar(position);
            position = editMask.moveToPrevChar(position);

            //Then
            assert.equal(position, 11);

        });

        it('successful decimalSeparator for currency', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена c3 за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);

            //When
            editMask.reset(null);   //"Цена _,___ руб. за 1 кг"
            var position = 5;
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt(',', position);

            //Then
            assert.equal(position, 7);
            assert.equal(editMask.getText(), 'Цена 1,000р. за 1 кг');
        });

        it('successful decimal part for currency', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена c2 за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);

            //When
            editMask.reset(null);   //"Цена _,___ руб. за 1 кг"
            var position = 5;
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt(',', position);
            position = editMask.setCharAt('2', position);
            position = editMask.setCharAt('3', position);
            position = editMask.setCharAt('4', position);

            //Then
            assert.equal(position, 9);
            assert.equal(editMask.getText(), 'Цена 1,23р. за 1 кг');

        });

        it('successful move to start', function () {
            //Given
            var editMask = new NumberEditMask();
            editMask.mask = "Цена c2 за 1 кг";
            editMask.format = new NumberFormat();
            editMask.format.setFormat(editMask.mask);

            //When
            editMask.reset(null);
            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(position, 5);
            assert.equal(editMask.getText(), 'Цена _,__р. за 1 кг');

        });

    });




});
describe('RegexEditMask', function () {
    describe('format', function () {

        it('successful test mask', function () {
            //Given
            var editMask = new RegexEditMask();
            editMask.mask = '^[0-9]{4}$';

            //When
            editMask.reset('1234');

            //Then
            assert.equal(editMask.getValue(), '1234');
            assert.isTrue(editMask.getIsComplete('1234'));
            assert.isFalse(editMask.getIsComplete('123'));
        });

    });

});
describe('TemplateEditMask', function () {
    describe('format', function () {

        it('successful build mask', function () {
            //Given
            var editMask = new TemplateEditMask();

            //When

            //Then
            assert.isDefined(editMask);
        });

        it('successful build template', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+\\9(999)000-00-00';

            //When
            var template = editMask.buildTemplate();
            //Then
            assert.lengthOf(template, 16);
            assert.equal(template[0], '+');
            assert.equal(template[1], '9');
            assert.equal(template[2], '(');
            assert.isObject(template[3]);
            assert.isObject(template[4]);
            assert.isObject(template[5]);
            assert.equal(template[6], ')');
            assert.isObject(template[7]);
            assert.isObject(template[8]);
            assert.isObject(template[9]);
            assert.equal(template[10], '-');
            assert.isObject(template[11]);
            assert.isObject(template[12]);
            assert.equal(template[13], '-');
            assert.isObject(template[14]);
            assert.isObject(template[15]);
            assert.equal(editMask.getText(), '+9(___)___-__-__');
            assert.equal(editMask.getValue(), '+9()--')
        });

        it('successful move at start', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7(999)000-00-00';

            //When
            editMask.reset();
            //Then
            var position = editMask.moveToPrevChar(0);
            assert.equal(position, 3);
        });

        it('successful to last', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7(999)000-00-00';

            //When
            editMask.reset();
            //Then
            var position = editMask.moveToNextChar(editMask.mask.length);
            assert.equal(position, 16);
        });

        it('successful to set char', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7 (999)000-00-00';

            //When
            editMask.reset();
            var position = editMask.moveToPrevChar(0);
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('2', position);
            position = editMask.setCharAt('3', position);

            position = editMask.setCharAt('4', position);
            position = editMask.setCharAt('5', position);
            position = editMask.setCharAt('6', position);

            position = editMask.setCharAt('7', position);
            position = editMask.setCharAt('8', position);

            position = editMask.setCharAt('9', position);
            position = editMask.setCharAt('0', position);

            //Then
            assert.equal(position, 17);
            assert.equal(editMask.getValue(), '+7 (123)456-78-90');
        });

        it('successful to set char without MaskSaveLiteral', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7 (999)000-00-00';
            editMask.maskSaveLiteral = false;

            //When
            editMask.reset();
            var position = editMask.moveToPrevChar(0);
            position = editMask.setCharAt('1', position);
            position = editMask.setCharAt('2', position);
            position = editMask.setCharAt('3', position);

            position = editMask.setCharAt('4', position);
            position = editMask.setCharAt('5', position);
            position = editMask.setCharAt('6', position);

            position = editMask.setCharAt('7', position);
            position = editMask.setCharAt('8', position);

            position = editMask.setCharAt('9', position);
            position = editMask.setCharAt('0', position);

            //Then
            assert.equal(position, 17);
            assert.equal(editMask.getValue(), '1234567890');
        });

        it('successful getRegExpForMask with maskSaveLiteral', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7 (999)000-00-00';
            editMask.maskSaveLiteral = true;

            //When
            var regexp = editMask.getRegExpForMask();

            //Then
            assert.isTrue(regexp.test('+7 (123)456-78-91'));
            assert.isTrue(regexp.test('+7 ()456-78-91'));
            assert.isTrue(regexp.test('+7 (1)456-78-91'));
            assert.isFalse(regexp.test('+7 (123)456-78-9'));
        });


        it('successful getRegExpForMask without maskSaveLiteral', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7 (999)000-00-00';
            editMask.maskSaveLiteral = false;

            //When
            var regexp = editMask.getRegExpForMask();

            //Then
            assert.isTrue(regexp.test('1234567891'));
            assert.isTrue(regexp.test('1234567'));
            assert.isFalse(regexp.test('123456'));
        });

        it('successful set value without maskSaveLiteral', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7 (999)000-00-00';
            editMask.maskSaveLiteral = false;

            //When
            editMask.reset('1234567890');

            //Then
            assert.equal(editMask.getValue(), '1234567890');
            assert.equal(editMask.getText(), '+7 (123)456-78-90');
        });

        it('successful set value with maskSaveLiteral', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '+7 (999)000-00-00';
            editMask.maskSaveLiteral = true;

            //When
            editMask.reset('+7 (123)456-78-90');

            //Then
            assert.equal(editMask.getValue(), '+7 (123)456-78-90');
            assert.equal(editMask.getText(), '+7 (123)456-78-90');
        });

        it('successful format special chars', function () {
            //Given
            var editMask = new TemplateEditMask();
            editMask.mask = '00/00/0000 \\at 99:99 99% (99$)';

            //When
            editMask.reset();

            //Then
            assert.equal(editMask.getText(), '__.__.____ at __:__ __% (__р.)');
        });

    });

    describe('template mask', function () {
        var editMask;
        var chars;
        var char;
        var position;


        beforeEach(function () {
            chars = '@@55ЦЦ+-'.split('');
            editMask = new TemplateEditMask();
            editMask.maskSaveLiteral = false;
            position = 0;
        });

        it('successful input mask "c"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('c');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '@@55ЦЦ+-');
        });

        it('successful input mask "C"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('C');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '@@55ЦЦ+-');
        });

        it('successful input mask "l"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('l');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), 'ЦЦ');
        });

        it('successful input mask "L"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('l');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), 'ЦЦ');
        });

        it('successful input mask "a"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('a');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '55ЦЦ');//@@55ЦЦ+-
        });

        it('successful input mask "A"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('A');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '55ЦЦ');//@@55ЦЦ+-
        });

        it('successful input mask "#"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('#');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '+-');//@@55ЦЦ+-
        });

        it('successful input mask "#"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('#');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '+-');//@@55ЦЦ+-
        });

        it('successful input mask "9"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('9');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '55');//@@55ЦЦ+-
        });

        it('successful input mask "0"', function () {
            //Given
            editMask.mask = Array(chars.length + 1).join('0');
            editMask.reset();

            //When
            position = editMask.moveToPrevChar(0);
            do {
                char = chars.shift();
                position = editMask.setCharAt(char, position);
            } while (chars.length > 0);

            var position = editMask.moveToPrevChar(0);

            //Then
            assert.equal(editMask.getValue(), '55');//@@55ЦЦ+-
        });
    });



});
describe('Button', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('Button', {});

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });

        it('should set getContent', function () {

            var element = new Button();
            assert.isNull(element.getContent());

            // when
            element.setContent(content);

            // then
            assert.isTrue(element.getContent() === content);

            function content(context, args) {
                return 'button content';
            }
        });

    });


    describe('render', function () {
        var button;

        beforeEach(function () {
            button = builder.buildType('Button', {});
        });

        it('should create', function () {
            // Given
            //var button = new Button();

            // When
            var $el = button.render();

            // Then
            assert.equal($el.find('button').length, 1);
        });

        it('should set enabled', function () {
            // Given
            //var button = new Button();
            button.setText('button');
            var $el = button.render();

            assert.equal(button.getEnabled(), true);
            // When
            button.setEnabled(false);

            // Then
            assert.equal(button.getEnabled(), false);
        });

        it('should set text', function () {
            // Given
            //var button = new Button();
            button.setText('button');
            var $el = button.render();

            // When
            button.setText('other button');

            // Then
            assert.equal($el.find('.btntext').text(), 'other button');
        });


        it('should execute action on click', function () {
            // Given
            var
                //button = new Button(),
                onLastActionExecute = 0,
                onNewActionExecute = 0;

            button.setAction(new function(){
                this.execute = function () {
                    onLastActionExecute++;
                };
            });

            button.setAction(new function(){
                this.execute = function () {
                    onNewActionExecute++;
                };
            });

            assert.equal(onLastActionExecute, 0);
            assert.equal(onNewActionExecute, 0);

            // When
            button.render();
            button.click();

            // Then
            assert.equal(onLastActionExecute, 0);
            assert.equal(onNewActionExecute, 1);
        });

        it('event onClick', function () {
            // Given
            var
                //button = new Button(),
                onClickFlag = 0;

            button.onClick(function(){
                    onClickFlag++;
            });

            assert.equal(onClickFlag, 0);

            // When
            button.render();
            button.click();

            // Then
            assert.equal(onClickFlag, 1);
        });

        it('should be true if scriptsHandlers call', function () {
            //Given
            var view = new View();
            var scripts = view.getScripts();
            scripts.add({
                name: 'OnClick',
                func: function (context, args) {
                    window.Test.button = 5;
                }
            });

            scripts.add({
                name: 'OnLoaded',
                func: function (context, args) {
                    window.Test.buttonLoaded = true;
                }
            });

            var buttonBuilder = new ButtonBuilder();
            var metadata = {
                OnClick:{
                    Name: 'OnClick'
                },
                OnLoaded:{
                    Name: 'OnLoaded'
                }
            };
            window.Test = {button:1, buttonLoaded: false};

            //When
            var button = buttonBuilder.build(null, {builder: builder, parent: view, parentView: view, metadata: metadata});
            button.render();
            //var $button = $(button.render());
            //$button.find('button').click();
            button.click();

            // Then
            assert.equal(window.Test.button, 5);
            assert.isTrue(window.Test.buttonLoaded);
        });
    });
});

describe('ButtonBuilder', function () {
    describe('build', function () {
        it('successful build', function () {
            // Given

            var metadata = {
                Text: "Click me",
                Visible: false,
                HorizontalAlignment: 'Right',
                Action: {
                    OpenAction: {
                        View: {
                            InlineView: {
                                "ConfigId": "Structure",
                                "DocumentId": "Department",
                                "ViewType": "EditView"
                            }
                        }
                    }
                }
            };

            // When
            var builder = new ButtonBuilder();
            var button = builder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});

            // Then
            assert.isNotNull(button);
            assert.equal(button.getText(), 'Click me');
            assert.isFalse(button.getVisible());
            assert.equal(button.getHorizontalAlignment(), 'Right');
            assert.isNotNull(button.getAction());
        });

    });
});

describe('PopupButtonElement', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('PopupButton', {
            Items: []
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });

        describe('Implementing Container Methods', function () {
            testHelper.checkContainerMethods(element);
        });


    });

    describe('Checking methods', function () {
        var button;

        beforeEach(function () {
            button =  builder.buildType('PopupButton', {
                Items: []
            });
        });

        it('should create', function () {
            // Given


            // When
            var $el = button.render();

            // Then
            assert.equal($el.find('.pl-popup-button__button').length, 1);
        });

        it('should set text', function () {
            // Given
            button.setText('button');
            var $el = button.render();

            // When
            button.setText('other button');

            // Then
            assert.equal($el.find('.pl-popup-button__button').text(), 'other button');
            //window.
        });


        it('should execute action on click', function (done) {
            // Given
            var button = new PopupButton(),
                onLastActionExecute = 0,
                onNewActionExecute = 0;

            button.setAction(new function(){
                this.execute = function () {
                    onLastActionExecute++;
                };
            });

            button.setAction(new function(){
                this.execute = function () {
                    onNewActionExecute++;
                    assert.equal(onLastActionExecute, 0);
                    assert.equal(onNewActionExecute, 1);
                    done();
                };
            });

            assert.equal(onLastActionExecute, 0);
            assert.equal(onNewActionExecute, 0);

            // When
            button.render();
            button.click();

            // Then

        });

        it('event onClick', function () {
            // Given
            var button = new PopupButton(),
                onClickFlag = 0;

            button.onClick(function(){
                    onClickFlag++;
            });

            assert.equal(onClickFlag, 0);

            // When
            button.render();
            button.click();

            // Then
            assert.equal(onClickFlag, 1);
        });

        it('should save click handler after set new action', function () {
            // Given
            var button = new PopupButton(),
                onClickFlag = 0;

            button.onClick(function(){
                onClickFlag++;
            });

            assert.equal(onClickFlag, 0);

            // When
            button.render();
            button.click();

            var action = new BaseAction();
            var execActionFlag=0;
            action.execute = function(){
                execActionFlag++;
            };

            button.setAction(action);

            button.click();
            // Then
            assert.equal(execActionFlag, 1);
            assert.equal(onClickFlag, 2);

        });

        it('should add items', function () {
            // Given
            //var button = new PopupButton();

            // When
            var items = button.getItems();
            items.add(builder.buildType('Button', {}));
            items.add(builder.buildType('Button', {}));

            // Then
            assert.equal(2,button.getItems().length);
        });

        it('should remove item', function () {
            // Given
            var button = new PopupButton();
            var b1 = builder.buildType('Button', {});
            var b2 = builder.buildType('Button', {});
            var items = button.getItems();
            items.add(b1);
            items.add(b2);

            // When
            items.remove(b1);

            // Then
            assert.equal(1,button.getItems().length);
        });


//        it('should be true if scriptsHandlers call', function () {
//            //Given
//            var popupButton = new PopupButtonBuilder();
//            var view = new View();
//            var metadata = {
//                OnClick:{
//                    Name: 'OnClick'
//                }
//            };
//            window.Test = {popupButton:1};
//            view.setScripts([{Name:"OnClick", Body:"window.Test.popupButton = 5"}]);
//
//            //When
//            var build = popupButton.build(popupButton, view, metadata);
//            $(build.render()).find('.pl-popup-btn-main').trigger('click');
//
//            // Then
//            assert.equal(window.Test.popupButton, 5);
//        });
    });
});

describe('PopupButtonBuilder', function () {
    describe('build', function () {
        it('successful build', function () {
            // Given

            var metadata = {
                Text: "Click me",
                Action: {
                    OpenAction: {
                        View: {
                            InlineView: {
                                "ConfigId": "Structure",
                                "DocumentId": "Department",
                                "ViewType": "EditView"
                            }
                        }
                    }
                },
                OnClick:{
                    Name:"A"
                },
                Items: [
                    {
                        Button: {
                            Text: "Click me",
                            Visible: true,
                            HorizontalAlignment: 'Left',
                            Action: {

                            }
                        }
                    },
                    {
                        Button: {
                            Text: "Административная информация",
                            Visible: true,
                            Action: {

                            }
                        }
                    }
                ]

            };

            // When
            var builder = new PopupButtonBuilder();
            var button = builder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});
            // Then
            assert.isNotNull(button);
            assert.equal(button.getText(), 'Click me');
            assert.isNotNull(button.getAction());
            assert.equal(2,button.getItems().length);

        });
    });
});

describe('ListEditorBase (Control)', function () {


});
describe('ComboBox', function () {
    describe('render', function () {

        it('Setting the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given
            var comboBox = new ComboBox(), $el, $control;

            $el = comboBox.render();

            assert.isUndefined($el.attr('data-pl-name'));
            assert.isFalse($el.hasClass('hidden'), 'hidden');
            assert.isFalse($el.hasClass('pull-left'), 'pull-left');

            // When
            comboBox.setName('newName');
            comboBox.setEnabled(false);
            comboBox.setVisible(false);
            
            // Then

            assert.equal($el.attr('data-pl-name'), 'newName');

            assert.isTrue($el.hasClass('hidden'));
            assert.isFalse($el.hasClass('pull-left'));
        });

        it('Events onLoad, onValueChanged', function () {
            // Given
            var comboBox = new ComboBox(),
                onLoadFlag = 0,
                onValueChanged = 0;

            comboBox.onLoaded(function(){
                onLoadFlag++;
            });
            comboBox.onValueChanged(function(){
                onValueChanged++;
            });

            assert.equal(onLoadFlag, 0);
            assert.equal(onValueChanged, 0);

            // When
            comboBox.render();
            comboBox.setValue('new');

            // Then
            assert.equal(onLoadFlag, 1);
            assert.equal(onValueChanged, 1);
        });
    });


});

describe('DataGrid', function () {

    var metadata = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        { "Id": 1, "Display": "LTE" },
                        { "Id": 2, "Display": "3G" },
                        { "Id": 3, "Display": "2G" }
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "Items" : [
                    {
                        "DataGrid": {
                            "Items": {
                                "Source": "ObjectDataSource1",
                                "Property": ""
                            },
                            "Columns": [
                                {
                                    "Header": "Id",
                                    "CellProperty": "Id"
                                },
                                {
                                    "Header": "Display",
                                    "CellProperty": "Display"
                                }
                            ]
                        }
                    }
                ]
            }
        }]
    };

    describe('render', function () {
        it('should render DataGrid', function () {
            // Given When
            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $stackPanel = $('#sandbox').children();
                $stackPanel.detach();

                onListboxReady($stackPanel);
            });

            // Then
            function onListboxReady($grid){
                console.log($grid);
                assert.isObject($grid);

            }
        });
    });




});
/*describe('DataNavigation', function () {
    it('should pass test default property', function () {
        // Given
        var dataNavigationBuilder = new DataNavigationBuilder();
        var view = new View();
        view.setGuid(guid());
        var metadata = {
            Enabled: true,
            PageNumber: 5,
            PageSize: 10,

            Name: "DataNavigation1",
            AvailablePageSizes: [ 20, 50, 100 ],
            DataSource: "PatientDataSource"
        };
        var dataNavigation = dataNavigationBuilder.build(null, {builder: dataNavigationBuilder, view: view, metadata: metadata});

        //When
        dataNavigation.setName('NewDataNavigation');

        //Then
        assert.equal(dataNavigation.getName(), 'NewDataNavigation');
        assert.isTrue(dataNavigation.getEnabled());
        assert.isTrue(dataNavigation.getVisible());
        assert.equal(dataNavigation.getHorizontalAlignment(), 'Stretch');
        assert.equal(dataNavigation.getPageNumber(), metadata.PageNumber);
        assert.equal(dataNavigation.getPageSize(), metadata.PageSize);
        assert.equal(dataNavigation.getDataSource(), metadata.DataSource);
    });

    it('should handlers messageBus, onSetPageSize, onSetPageNumber', function () {
        // Given
        var dataNavigationBuilder = new DataNavigationBuilder();
        var view = new View();
        view.setGuid(guid());
        var metadata = {
            PageNumber: 5,
            PageSize: 10,

            Name: "DataNavigation1",
            //AvailablePageSizes: [ 20, 50, 100 ],
            DataSource: "PatientDataSource"
        };


        var exchange = view.getExchange();
        var dataNavigation = dataNavigationBuilder.build(null, {builder: dataNavigationBuilder, view: view, metadata: metadata});

        //Then
        exchange.subscribe(messageTypes.onSetPageSize, function (messageBody) {
            assert.equal(messageBody.value, 123);
            assert.equal(messageBody.dataSource, metadata.DataSource);
        });

        exchange.subscribe(messageTypes.onSetPageNumber, function (messageBody) {
            assert.equal(messageBody.value, 10);
            assert.equal(messageBody.dataSource, metadata.DataSource);
        });

        // When
        dataNavigation.setPageSize(123);
        dataNavigation.setPageNumber(10);
    });

    it('should be true if scriptsHandlers call', function () {
        //Given
        var dataNavigationBuilder = new DataNavigationBuilder();
        var view = new View();
        view.setGuid(guid());
        var metadata = {
            OnSetPageSize:{
                Name: 'OnSetPageSize'
            },
            OnSetPageNumber:{
                Name: 'OnSetPageNumber'
            },
            OnLoaded:{
                Name: 'OnLoaded'
            }
        };
        window.Test = {dataNavigation:{ps: 1, pn: 1, loaded: false}};
        view.setScripts([{Name:"OnSetPageSize", Body:"window.Test.dataNavigation.ps = 50"},{Name:"OnSetPageNumber", Body:"window.Test.dataNavigation.pn = 3"}, {Name:"OnLoaded", Body:"window.Test.dataNavigation.loaded = true"}]);

        //When
        var build = dataNavigationBuilder.build(null, {builder: dataNavigationBuilder, view: view, metadata: metadata});
        build.setPageSize(1);
        build.setPageNumber(1);
        $(build.render());

        // Then
        assert.equal(window.Test.dataNavigation.ps, 50);
        assert.equal(window.Test.dataNavigation.pn, 3);
        assert.isTrue(window.Test.dataNavigation.loaded);
    });
});*/
describe('DateTimePicker', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('DateTimePicker', {});

        describe('Implementing DateTimePicker Methods', function () {
            ['getMinValue', 'setMinValue', 'getMaxValue', 'setMaxValue', 'getMode', 'setMode']
                .forEach(function (methodName) {
                    it(methodName, function() {
                        assert.isFunction(element[methodName], methodName);
                    });

                });
        });

        describe('Implementing TextEditorBase Methods', function () {
            testHelper.checkTextEditorBaseMethods(element);
        });

        describe('Implementing EditorBase Methods', function () {
            testHelper.checkEditorBaseMethods(element);
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });

        //@TODO Add Checking Events
    });

    describe('Metadata', function () {

        it('Using default value', function () {
            var metadata = {
                "DateTimePicker": {}
            };

            var element = builder.build(metadata, {});

            assert.equal(element.getMode(), 'Date', 'Mode');
            //assert.equal(element.getFocusable(), true, 'Focusable');
            assert.equal(element.getEnabled(), true, 'Enabled');
            assert.equal(element.getVisible(), true, 'Visible');
            assert.equal(element.getLabelFloating(), false, 'LabelFloating');
            assert.equal(element.getVerticalAlignment(), 'Top', 'VerticalAlignment');
            assert.equal(element.getHorizontalAlignment(), 'Stretch', 'HorizontalAlignment');
            //assert.equal(element.getTextHorizontalAlignment(), 'Left', 'TextHorizontalAlignment');
            //assert.equal(element.getTextVerticalAlignment(), 'Center', 'TextVerticalAlignment');
        });

        it('Apply metadata', function () {
            var metadata = {
                "DateTimePicker": {
                    "Name": "DatePicker1",
                    "MinValue": "2015-09-01T15:26:42.0060+05:00",
                    "MaxValue": "2015-09-18T15:26:42.0060+05:00",
                    "Mode": "DateTime",

                    "LabelText": "Datepicker's label",
                    "LabelFloating": true,
                    "DisplayFormat": "{:d}",
                    "EditMask": {
                        "DateTimeEditMask": {
                            "Mask": "d"
                        }
                    },
                    "HintText": "Hint",
                    "ErrorText": "Error",
                    "WarningText": "Warning",
                    "Enabled": false,
                    "Visible": false,
                    "VerticalAlignment": "Bottom",
                    "HorizontalAlignment": "Right",
                    "TextStyle": "Display4",
                    "Foreground": "Primary1",
                    "Background": "Accent1"

                }
            };

            var element = builder.build(metadata, {});
            assert.equal(String(element.getMinValue()), String(new Date("2015-09-01T15:26:42.0060+05:00")), 'MinValue');
            assert.equal(String(element.getMaxValue()), String(new Date("2015-09-18T15:26:42.0060+05:00")), 'MaxValue');
            assert.equal(element.getMode(), 'DateTime', 'DateTime');

            assert.equal(element.getLabelText(), "Datepicker's label", 'LabelText');
            assert.equal(element.getLabelFloating(), true, 'LabelFloating');
            assert.isFunction(element.getDisplayFormat(), 'DateTimeFormat');
            assert.instanceOf(element.getEditMask(), DateTimeEditMask, 'EditMask');

            assert.equal(element.getHintText(), "Hint", 'HintText');
            assert.equal(element.getErrorText(), "Error", 'ErrorText');
            assert.equal(element.getWarningText(), "Warning", 'WarningText');

            assert.equal(element.getName(), "DatePicker1", 'Name');
            assert.equal(element.getEnabled(), false, 'Enabled');
            assert.equal(element.getVisible(), false, 'Visible');
            assert.equal(element.getVerticalAlignment(), 'Bottom', 'VerticalAlignment');
            //assert.equal(element.getTextStyle(), 'Display4', 'TextStyle');
            //assert.equal(element.getForeground(), 'Primary1', 'Foreground');
            //assert.equal(element.getBackground(), 'Accent1', 'Background');

        });

        it('correct convert from string to date and from date to string', function () {
            // Given
            var dateTimePicker = new DateTimePicker();

            dateTimePicker.render();

            // When
            dateTimePicker.setValue('2014-07-29');

            // Then
            assert.equal(dateTimePicker.getValue().substr(0, 10), '2014-07-29');
        });

        it('event OnValueChanged', function () {
            // Given
            var dateTimePicker = new DateTimePicker(),
                onValueChangedFlag = 0;

            dateTimePicker.render();

            dateTimePicker.onValueChanged(function () {
                console.log(arguments);
                onValueChangedFlag++;
            });

            assert.equal(onValueChangedFlag, 0);

            // When
            dateTimePicker.setValue('2014-07-29');
            dateTimePicker.setValue('2014-07-30');

            // Then
            assert.equal(onValueChangedFlag, 2);
        });

    });
});


describe('DateTimePickerBuilder', function () {
    describe('build', function () {
        it('successful build DateTimePicker', function () {
            // Given

            var dateTimePickerMetadata = {};

            // When
            var builder = new DateTimePickerBuilder();
            var dateTimePicker = builder.build(null, {builder: new ApplicationBuilder(), view: new View(), metadata: dateTimePickerMetadata});

            // Then
            assert.isNotNull(dateTimePicker);
            assert.isObject(dateTimePicker);

        });
    });
});

describe('DocumentViewer', function () {
    it('should pass test default property', function () {
        // Given
        var documentViewerBuilder = new DocumentViewerBuilder();
        var view = new View();
        var metadata = {
            PrintViewId: "PrintView",
            Source: {
                Source: "MainDataSource"
            }
        };
        var documentViewer = documentViewerBuilder.build(null, {builder: documentViewerBuilder, view: view, metadata: metadata});

        //When
        documentViewer.setName('DocumentViewer');

        //Then
        assert.equal(documentViewer.getName(), 'DocumentViewer');
        assert.equal(documentViewer.getPrintViewId(), 'PrintView');
        assert.equal(documentViewer.getSource(), 'MainDataSource');
        assert.isTrue(documentViewer.getEnabled());
        assert.isTrue(documentViewer.getVisible());
        assert.equal(documentViewer.getHorizontalAlignment(), 'Stretch');
    });
    
    //it('should be true on load', function () {
    //    // Given
    //    var documentViewer = new DocumentViewer(),
    //        onLoadFlag = 0;
    //
    //    documentViewer.onLoaded(function(){
    //        onLoadFlag++;
    //        console.log(onLoadFlag);
    //    });
    //
    //    assert.equal(onLoadFlag, 0);
    //
    //    // When
    //    documentViewer.render();
    //
    //    // Then
    //    assert.equal(onLoadFlag, 1);
    //});
});
describe('EditorBase', function () {
    describe('Textbox as exemplar of EditorBase', function () {

        it('Base functional', function () {
            // Given
            var textBox = new TextBox();

            assert.isNull(textBox.getValue(), 'default value is null');
            assert.isNull(textBox.getHintText(), 'default hint text is null');
            assert.isNull(textBox.getErrorText(), 'default error text is null');
            assert.isNull(textBox.getWarningText(), 'default warning text is null');


            // When
            textBox.setValue('value');
            textBox.setHintText('hint text');
            textBox.setErrorText('error text');
            textBox.setWarningText('warning text');


            // Then
            assert.equal(textBox.getValue(), 'value', 'new value is right');
            assert.equal(textBox.getHintText(), 'hint text', 'new hint text is right');
            assert.equal(textBox.getErrorText(), 'error text', 'new error text is right');
            assert.equal(textBox.getWarningText(), 'warning text', 'new warning text is right');
        });

        it('Base events functional', function () {
            // Given
            var textBox = new TextBox(),
                handling = 0;

            textBox.onValueChanging(onValueChangingHandler);
            textBox.onValueChanged(onValueChangedHandler);

            // When
            textBox.setValue('new');

            // Then
            function onValueChangingHandler(context, args){
                assert.equal(handling, 0, 'right order: changing handler is first');
                assert.isNull(args.oldValue, 'old value is null');
                assert.equal(args.newValue, 'new', 'new value is "new"');
                assert.equal(args.source, textBox, 'right source');

                handling++;
            }

            function onValueChangedHandler(context, args){
                assert.equal(handling, 1, 'right order: changing handler is second');
                assert.isNull(args.oldValue, 'old value is null');
                assert.equal(args.newValue, 'new', 'new value is "new"');
                assert.equal(args.source, textBox, 'right source');
            }
        });

        it('cancelling changing event', function () {
            // Given
            var textBox = new TextBox(),
                handling = 0;

            textBox.onValueChanging(onValueChangingHandler1);
            textBox.onValueChanging(onValueChangingHandler2);

            // When
            textBox.setValue('new');

            // Then
            function onValueChangingHandler1(context, args){
                assert.equal(handling, 0, 'right order: changing handler is first');
                assert.equal(args.newValue, 'new', 'new value is "new"');

                handling++;

                return false
            }

            function onValueChangingHandler2(context, args){
                assert.equal(handling, 1, 'right order: this changing handler is second');
                assert.equal(args.newValue, 'new', 'new value is "new"');

                handling++;
            }

            assert.equal(handling, 2, 'right order');
            assert.isNull(textBox.getValue(), 'value should not be changed');
        });
    });

});
describe('Element', function () {
    describe('Element as path of TextBox', function () {

        it('Setting and getting the properties', function () {
            // Given
            var textBox = new TextBox(),
                textBox2 = new TextBox();

            // When
            textBox.setValue('test');
            textBox2.setProperty('value', 'test2');

            // Then
            assert.equal(textBox.getProperty('value'), 'test');
            assert.equal(textBox2.getValue(), 'test2');
        });

        it('Handling change properties', function (done) {
            // Given
            var textBox = new TextBox(),
                step = 1;
            textBox.onPropertyChanged('value', onValueChanged);
            textBox.onPropertyChanged('visible', onVisibleChanged);

            // When
            textBox.setValue('test');
            textBox.setProperty('visible', false);

            // Then
            function onValueChanged() {
                assert.equal(textBox.getProperty('value'), 'test');
                assert.equal(step, 1);
                step++;
            }

            function onVisibleChanged() {
                assert.equal(textBox.getProperty('visible'), false);
                assert.equal(step, 2);
                done();
            }

        });

        it('Handling DOM event', function (done) {
            // Given
            var textBox = new TextBox();
            textBox.onDoubleClick(onMouseDoubleClickHandler);

            // When
            var $el = textBox.render();
            $el.trigger('dblclick');

            // Then
            function onMouseDoubleClickHandler(eventData) {
                assert.equal(eventData.source, textBox, 'eventData has right source');
                done();
            }

        });

        it('Click event', function (done) {
            // Given
            var textBox = new TextBox();
            textBox.onClick(onMouseClickHandler);
            
            // When
            var $el = textBox.render();
            $el.trigger('click');
            
            //Then
            function onMouseClickHandler(eventData) {
                assert.equal(eventData.source, textBox, 'eventData has right source');
                done();
            }
        });
    });
});
describe('Label', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('Label', {});

        describe('Implementing Label Methods', function () {
            ['getDisplayFormat', 'setDisplayFormat', 'getTextTrimming', 'setTextTrimming',
                'getTextWrapping', 'setTextWrapping', 'getLineCount', 'setLineCount']
                .forEach(function (methodName) {
                    it(methodName, function () {
                        testHelper.checkMethod(element, methodName);
                    });

                });
        });

        describe('Implementing EditorBase Methods', function () {
            testHelper.checkEditorBaseMethods(element);
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });
    });

    describe('Metadata', function () {

        it('Using default value', function () {
            var metadata = {
                "Label": {}
            };

            var element = builder.build(metadata, {});

            //assert.equal(element.getTextTrimming(), true, 'TextTrimming');
            assert.equal(element.getTextWrapping(), true, 'TextWrapping');

            assert.equal(element.getVisible(), true, 'Visible');
            assert.equal(element.getVerticalAlignment(), 'Top', 'VerticalAlignment');
            assert.equal(element.getHorizontalAlignment(), 'Stretch', 'HorizontalAlignment');
            var displayFormat = element.getDisplayFormat();
            var value = {};
            assert.isTrue(displayFormat(null, {value: value}) === value, 'DisplayFormat');
        });

        it('Apply metadata', function () {
            var metadata = {
                "Label": {
                    "TextWrapping": false,
                    "LineCount": 3,

                    "Text": "Label",
                    "LabelFloating": true,
                    "DisplayFormat": "d",
                    "HintText": "Hint",
                    "ErrorText": "Error",
                    "WarningText": "Warning",

                    "Name": "Label1",
                    "Enabled": false,
                    "Visible": false,
                    "VerticalAlignment": "Bottom",
                    "HorizontalAlignment": "Right",
                    "TextStyle": "Display4",
                    "Foreground": "Primary1",
                    "Background": "Accent1"
                }
            };

            var element = builder.build(metadata, {});

            assert.equal(element.getTextWrapping(), false, 'TextWrapping');
            assert.equal(element.getLineCount(), 3, 'LineCount');
            assert.isFunction(element.getDisplayFormat(), 'DisplayFormat');

            assert.equal(element.getHintText(), "Hint", 'HintText');
            assert.equal(element.getErrorText(), "Error", 'ErrorText');
            assert.equal(element.getWarningText(), "Warning", 'WarningText');

            assert.equal(element.getName(), "Label1", 'Name');
            assert.equal(element.getText(), "Label", 'LabelText');
            assert.equal(element.getEnabled(), false, 'Enabled');
            assert.equal(element.getVisible(), false, 'Visible');
            assert.equal(element.getVerticalAlignment(), 'Bottom', 'VerticalAlignment');
            //assert.equal(element.getTextStyle(), 'Display4', 'TextStyle');
            //assert.equal(element.getForeground(), 'Primary1', 'Foreground');
            //assert.equal(element.getBackground(), 'Accent1', 'Background');

        });

        it('event OnValueChanged', function () {
            // Given
            var label = new Label(),
                onValueChangedFlag = 0;

            label.render();

            label.onValueChanged(function () {
                console.log(arguments);
                onValueChangedFlag++;
            });

            assert.equal(onValueChangedFlag, 0);

            // When
            label.setValue('2014-07-29');
            label.setValue('2014-07-30');

            // Then
            assert.equal(onValueChangedFlag, 2);
        });

    });
});

describe('LabelBuilder', function () {
    describe('build', function () {
        it('successful build Label', function () {
            // Given

            var metadata = {};

            // When
            var builder = new LabelBuilder();
            var element = builder.build(null, {builder: new ApplicationBuilder(), view: new View(), metadata: metadata});

            // Then
            assert.isNotNull(element);
            assert.isObject(element);
        });
    });
});

describe('ListBox', function () {

    var metadata2 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        { "Id": 1, "Display": "LTE" },
                        { "Id": 2, "Display": "3G" },
                        { "Id": 3, "Display": "2G" }
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "ItemTemplate": {
                    "TextBox": {
                        "Name": "TextBox1",
                        "Value": {
                            "Source": "ObjectDataSource1",
                            "Property": "$.Display"
                        }
                    }
                },
                "Items" : {
                    "Source": "ObjectDataSource1",
                    "Property": ""
                }
            }
        }]
    };

    describe('render', function () {
        it('should render stackPanel', function () {
            // Given When
            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata2, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $stackPanel = $('#sandbox').children();
                $stackPanel.detach();

                onListboxReady($stackPanel);
            });

            // Then
            function onListboxReady($stackPanel){
                assert.lengthOf($stackPanel.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($stackPanel.find('.pl-text-box-input'), 3, 'length of rendered textbox');
                assert.equal($stackPanel.find('.pl-text-box-input:first').val(), 'LTE', 'binding in itemTemplate is right');
            }
        });
    });


    var metadata3 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        { "Id": 1, "Display": "LTE" },
                        { "Id": 2, "Display": "3G" },
                        { "Id": 3, "Display": "2G" }
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "Items" : [
                    {
                        "TextBox": {
                            "Name": "TextBox1",
                            "Value": {
                                "Source": "ObjectDataSource1",
                                "Property": "Display"
                            }
                        }
                    },{
                        "TextBox": {
                            "Name": "TextBox2",
                            "Value": {
                                "Source": "ObjectDataSource1",
                                "Property": "Id"
                            }
                        }
                    }
                ]
            }
        }]
    };

    describe('render2', function () {
        it('should render stackPanel', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata3, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $stackPanel = $('#sandbox').children();
                $stackPanel.detach();

                onListboxReady($stackPanel);
            });

            // Then
            function onListboxReady($stackPanel){
                assert.lengthOf($stackPanel.find('.pl-stack-panel-i'), 2, 'length of rendered stackPanel');
                assert.lengthOf($stackPanel.find('.pl-text-box-input'), 2, 'length of rendered textbox');
                assert.equal($stackPanel.find('.pl-text-box-input:first').val(), 'LTE', 'binding in itemTemplate is right');
            }
        });
    });


    var metadata = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        { "Id": 1, "Display": "LTE" },
                        { "Id": 2, "Display": "2G" },
                        { "Id": 3, "Display": "2G" }
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "Items" : [
                    {
                        ListBox: {
                            "ItemTemplate": {
                                "TextBox": {
                                    "Name": "TextBox1",
                                    "Value": {
                                        "Source": "ObjectDataSource1",
                                        "Property": "$.Display"
                                    }
                                }
                            },
                            "GroupItemTemplate": {
                                "TextBox": {
                                    "Value": {
                                        "Source": "ObjectDataSource1",
                                        "Property": "$.Display"
                                    }
                                }
                            },
                            "GroupValueProperty": "Display",
                            "Items" : {
                                "Source": "ObjectDataSource1",
                                "Property": ""
                            }
                        }
                    }
                ]
            }
        }]
    };

    describe('render lb', function () {
        it('should render listBox', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $listbox = $('#sandbox').children();
                $listbox.detach();

                onListboxReady($listbox);
            });

            // Then
            function onListboxReady($listbox){
                assert.lengthOf($listbox.find('.pl-listbox-body'), 3, 'length of rendered listbox');
            }
        });
    });


    var metadata4 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        { "Id": 1, "Display": "LTE" },
                        { "Id": 2, "Display": "2G" },
                        { "Id": 3, "Display": "2G" }
                    ]
                }
            }
        ],
        Items: [{

            ListBox: {
                "ItemTemplate": {
                    "TextBox": {
                        "Name": "TextBox1",
                        "Value": {
                            "Source": "ObjectDataSource1",
                            "Property": "$.Display"
                        }
                    }
                },
                "Items" : {
                    "Source": "ObjectDataSource1",
                    "Property": ""
                }
            }
        }]
    };

    describe('render lb2', function () {
        it('should render listBox without grouping', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata4, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $listbox = $('#sandbox').children();
                $listbox.detach();

                onListboxReady($listbox);
            });

            // Then
            function onListboxReady($listbox){
                assert.lengthOf($listbox.find('.pl-listbox-body'), 3, 'length of rendered listbox');
            }
        });
    });



    var metadata5 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        { "Id": 1, "Display": "LTE" },
                        { "Id": 2, "Display": "2G" },
                        { "Id": 3, "Display": "2G" }
                    ]
                }
            }
        ],
        Items: [{

            ListBox: {
                "ItemTemplate": {
                    "Label": {
                        "Value": {
                            "Source": "ObjectDataSource1",
                            "Property": "$.Display"
                        }
                    }
                },
                "Items" : {
                    "Source": "ObjectDataSource1",
                    "Property": ""
                }
            }
        }]
    };

    describe('render lb3', function () {
        it('should render listBox without grouping', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata5, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $listbox = $('#sandbox').children();
                $listbox.detach();

                onListboxReady($listbox);
            });

            // Then
            function onListboxReady($listbox){
                assert.lengthOf($listbox.find('.pl-listbox-body'), 3, 'length of rendered listbox');
            }
        });
    });

    var metadata6 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        "LTE",
                        "3G",
                        "2G"
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "Items" : {
                    "Source": "ObjectDataSource1",
                    "Property": ""
                }
            }
        }]
    };

    describe('render simple list templating', function () {
        it('should render stackPanel with simple items', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata6, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $stackPanel = $('#sandbox').children();
                $stackPanel.detach();

                onStackPanelReady($stackPanel);
            });

            // Then
            function onStackPanelReady($stackPanel){
                assert.lengthOf($stackPanel.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($stackPanel.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($stackPanel.find('.pl-label').first().text(), 'LTE', 'content of first element is right');
            }
        });
    });


    var metadata7 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        {
                            Name: {Temp: "LTE"}
                        },
                        {
                            Name: {Temp: "3G"}
                        },
                        {
                            Name: {Temp: "2G"}
                        }
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "ItemProperty": "Name.Temp",
                "Items" : {
                    "Source": "ObjectDataSource1",
                    "Property": ""
                }
            }
        }]
    };

    describe('render property list templating ', function () {
        it('should render stackPanel with property items', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata7, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $stackPanel = $('#sandbox').children();
                $stackPanel.detach();

                onStackPanelReady($stackPanel);
            });

            // Then
            function onStackPanelReady($stackPanel){
                assert.lengthOf($stackPanel.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($stackPanel.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($stackPanel.find('.pl-label').first().text(), 'LTE', 'content of first element is right');
            }
        });
    });

    var metadata8 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        {
                            Name: {Temp: "LTE"}
                        },
                        {
                            Name: {Temp: "3G"}
                        },
                        {
                            Name: {Temp: "2G"}
                        }
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "ItemFormat": "Connect: {Name.Temp}",
                "Items" : {
                    "Source": "ObjectDataSource1",
                    "Property": ""
                }
            }
        }]
    };

    describe('render property list formatting ', function () {
        it('should render stackPanel with formatting items', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata8, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $stackPanel = $('#sandbox').children();
                $stackPanel.detach();

                onStackPanelReady($stackPanel);
            });

            // Then
            function onStackPanelReady($stackPanel){
                assert.lengthOf($stackPanel.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($stackPanel.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($stackPanel.find('.pl-label').first().text(), 'Connect: LTE', 'content of first element is right');
            }
        });
    });

    var metadata9 = {
        Text: 'Пациенты',
        DataSources : [
            {
                ObjectDataSource: {
                    "Name": "ObjectDataSource1",
                    "Items": [
                        {
                            Name: {Temp: "LTE"}
                        },
                        {
                            Name: {Temp: "3G"}
                        },
                        {
                            Name: {Temp: "2G"}
                        }
                    ]
                }
            }
        ],
        Items: [{

            StackPanel: {
                Name: 'MainViewPanel',
                "ItemSelector":{
                    Name: 'GetTitle'
                },
                "Items" : {
                    "Source": "ObjectDataSource1",
                    "Property": ""
                }
            }
        }],

        Scripts: [
            {
                Name: 'GetTitle',
                Body: "return '!! ' + args.value.Name.Temp;"
            }
        ]
    };

    describe('render property list formatting ', function () {
        it('should render stackPanel with formatting items', function () {
            // Given When
            window.providerRegister.register('DocumentDataSource', function () {
                return new FakeDataProvider();
            });

            var linkView = new LinkView(null, function (resultCallback) {
                var builder = new ApplicationBuilder();
                var view = builder.buildType('View', metadata9, {parentView: fakeView()});
                resultCallback(view);
            });
            linkView.setOpenMode('Application');

            var view = linkView.createView(function (view) {
                view.open();

                var $stackPanel = $('#sandbox').children();
                $stackPanel.detach();

                onStackPanelReady($stackPanel);
            });

            // Then
            function onStackPanelReady($stackPanel){
                assert.lengthOf($stackPanel.find('.pl-stack-panel-i'), 3, 'length of rendered stackPanel');
                assert.lengthOf($stackPanel.find('.pl-label').not(':empty'), 3, 'length of rendered stackPanel');
                assert.equal($stackPanel.find('.pl-label').first().text(), '!! LTE', 'content of first element is right');
            }
        });
    });

});
describe('NumericBox', function () {
    describe('render', function () {
        it('Setting the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given
            var numericBox = new NumericBox(),
                $el, $control;

            // When
            $el = numericBox.render();
            $control = $el.find('input');

            // Then
            assert.equal($control.val(), 0);
            assert.isUndefined($el.attr('data-pl-name'));
            assert.isFalse($control.prop('disabled'));
            assert.isFalse($el.hasClass('hidden'));
            assert.isFalse($el.hasClass('pl-horizontal-Left'));
            assert.isFalse($el.hasClass('center-block'));
        });

        it('Change the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given
            var numericBox = new NumericBox(),
                $el, $control;
            var numericBox1 = new NumericBox(),
                $el1, $control1;
            var numericBox2 = new NumericBox(),
                $el2, $control2;

            // When
            $el = numericBox.render();
            $control = $el.find('input');
            numericBox1.render();
            numericBox2.render();

            numericBox.setValue(15);
            numericBox.setMinValue(10);
            numericBox.setMaxValue(50);
            numericBox.setIncrement(5);
            numericBox.setName('newName');
            numericBox.setEnabled(false);
            numericBox.setVisible(false);
            numericBox.setHorizontalAlignment('Center');

            numericBox1.setMaxValue(20);
            numericBox1.setValue(50);
            numericBox2.setMinValue(20);
            numericBox2.setValue(5);

            // Then
            assert.equal(numericBox1.getValue(), 50);
            assert.equal(numericBox2.getValue(), 5);

            assert.equal(numericBox.getValue(), 15);
            assert.equal(numericBox.getMinValue(), 10);
            assert.equal(numericBox.getMaxValue(), 50);
            assert.equal(numericBox.getIncrement(), 5);
            assert.equal($el.attr('data-pl-name'), 'newName');
            assert.isTrue($control.prop('disabled'));
            assert.isTrue($el.hasClass('hidden'));
            assert.isFalse($el.hasClass('pl-horizontal-Left'));
            assert.isTrue($el.hasClass('pl-horizontal-Center'));
        });

        it('Events onLoad, onValueChanged', function () {
            // Given
            var numericBox = new NumericBox(),
                onLoadFlag = 0,
                onValueChanged = 0;

            numericBox.onLoaded(function () {
                onLoadFlag++;
            });
            numericBox.onValueChanged(function () {
                onValueChanged++;
            });

            assert.equal(onLoadFlag, 0);
            assert.equal(onValueChanged, 0);

            // When
            numericBox.render();
            numericBox.setValue(1);

            // Then
            assert.equal(onLoadFlag, 1);
            assert.equal(onValueChanged, 1);
        });

        it('should be triggered events: OnValueChanged, OnLoaded', function () {
            //Given
            var builder = new ApplicationBuilder();
            var view = new View();
            var metadata = {
                "NumericBox": {
                    OnValueChanged:{
                        Name: 'OnValueChanged'
                    },
                    OnLoaded:{
                        Name: 'OnLoaded'
                    }
                }
            };
            var scripts = view.getScripts();
            var events = {
                OnValueChanged: 0,
                OnLoaded: 0
            };

            scripts.add({
                name: "OnValueChanged",
                func: function () {
                    events.OnValueChanged++;
                }
            });

            scripts.add({
                name: "OnLoaded",
                func: function () {
                    events.OnLoaded++;
                }
            });

            //When
            var element = builder.build(metadata, {parentView: view, parent: view, builder: builder});
            element.setValue(true);
            element.render();

            // Then
            assert.equal(events.OnValueChanged, 1, 'OnValueChanged');
            assert.equal(events.OnLoaded, 1, 'OnLoaded');
        });
    });
});
describe('PasswordBox', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('PasswordBox', {});

        describe('Implementing PasswordBox Methods', function () {
            [
                'getLabelText',
                'setLabelText',
                'getLabelFloating',
                'setLabelFloating',
                'getPasswordChar',
                'setPasswordChar'
            ].forEach(function (methodName) {
                it(methodName, function () {
                    testHelper.checkMethod(element, methodName);
                });

            });
        });

        describe('Implementing EditorBase Methods', function () {
            testHelper.checkEditorBaseMethods(element);
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });
    });

    describe('Metadata', function () {

        it('Using default value', function () {
            var metadata = {
                "PasswordBox": {}
            };

            var element = builder.build(metadata, {});
            assert.equal(element.getLabelFloating(), false, 'LabelFloating');
        });

        it('Apply metadata', function () {
            var metadata = {
                "PasswordBox": {
                    "LabelText": "Label",
                    "LabelFloating": true,
                    "PasswordChar": "?"
                }
            };

            var element = builder.build(metadata, {});

            assert.equal(element.getLabelText(), "Label", 'LabelText');
            assert.equal(element.getLabelFloating(), true, 'LabelFloating');
            assert.equal(element.getPasswordChar(), "?", 'PasswordChar');
        });

        it('event OnValueChanged', function () {
            // Given
            var element = new PasswordBox(),
                onValueChangedFlag = 0;

            element.render();

            element.onValueChanged(function () {
                onValueChangedFlag++;
            });

            assert.equal(onValueChangedFlag, 0);

            // When
            element.setValue('P@$$w0rd');
            element.setValue('password');

            // Then
            assert.equal(onValueChangedFlag, 2);
        });

        it('event OnGotFocus/OnLostFocus', function () {
            // Given
            var element = new PasswordBox(),
                onFocusedFlag = 0;

            element.render();

            element.onGotFocus(function () {
                onFocusedFlag++;
            });

            element.onLostFocus(function () {
                onFocusedFlag--;
            });

            assert.equal(onFocusedFlag, 0);

            // When
            element.setFocused(true);
            // Then
            assert.isTrue(element.getFocused());
            assert.equal(onFocusedFlag, 1);
            element.setFocused(false);
            assert.isFalse(element.getFocused());
            assert.equal(onFocusedFlag, 0);
        });

    });
});

describe('PasswordBoxBuilder', function () {
    describe('build', function () {
        it('successful build PasswordBox', function () {
            // Given

            var metadata = {};

            // When
            var builder = new LabelBuilder();
            var element = builder.build(null, {builder: new ApplicationBuilder(), view: new View(), metadata: metadata});

            // Then
            assert.isNotNull(element);
            assert.isObject(element);
        });
    });
});

//describe('SearchPanel', function () {
//    it('Setting the default properties', function () {
//        // Given
//        var searchPanelBuilder = new SearchPanelBuilder();
//        var builder = new Builder();
//        var view = new View();
//        var metadata = {
//            Name: "SearchPanel1",
//            DataSource: "PatientsDataSource"
//        };
//        var searchPanel = searchPanelBuilder.build(null, {builder: builder, view: view, metadata: metadata});
//
//        //When
//        searchPanel.setName('NewSearchPanel');
//        searchPanel.setText('NewText');
//
//        //Then
//        assert.equal(searchPanel.getName(), 'NewSearchPanel');
//        assert.isTrue(searchPanel.getEnabled());
//        assert.equal(searchPanel.getHorizontalAlignment(), 'Stretch');
//        assert.isTrue(searchPanel.getVisible());
//        assert.equal(searchPanel.getText(), 'NewText');
//    });
//
//    it('Events setValue, exchange event', function (done) {
//        // Given
//        var searchPanelBuilder = new SearchPanelBuilder();
//        var builder = new Builder();
//        var view = new View();
//        view.setGuid(guid());
//        var metadata = {
//            Name: "SearchPanel1",
//            DataSource: "PatientsDataSource"
//        };
//        var exchange = view.getExchange();
//
//        var searchPanel = searchPanelBuilder.build(null, {builder: builder, view: view, metadata: metadata});
//        var $searchPanel = searchPanel.render();
//        exchange.subscribe(messageTypes.onSetTextFilter, onSetTextFilterHandler);
//
//        // When
//        searchPanel.setValue(123);
//        // ������ ��������� ������ ������, ��������� ���, ��������� ����� ����� ���������� ��������, ����.
//        searchPanel.control.controlView.submitFormHandler({
//            preventDefault: $.noop
//        });
//
//        // Then
//        function onSetTextFilterHandler(messageBody){
//            assert.equal(messageBody.value, 123);
//            assert.equal(messageBody.dataSource, 'PatientsDataSource');
//            done();
//        }
//    });
//
//    it('should be true if scriptsHandlers call', function () {
//        //Given
//        var searchPanelBuilder = new SearchPanelBuilder();
//        var view = new View();
//        view.setGuid(guid());
//        var metadata = {
//            OnValueChanged:{
//                Name: 'OnValueChanged'
//            },
//            OnLoaded:{
//                Name: 'OnLoaded'
//            }
//        };
//        window.Test2 = {searchPanel:1, searchPanelLoaded: false};
//        view.setScripts([{Name:"OnValueChanged", Body:"window.Test2.searchPanel = 5"}, {Name:"OnLoaded", Body:"window.Test2.searchPanelLoaded = true"}]);
//        var searchPanel = searchPanelBuilder.build(null, {builder: searchPanelBuilder, view: view, metadata: metadata});
//
//        //When
//        searchPanel.render();
//        // ������ ��������� ������ ������, ��������� ���, ��������� ����� ����� ���������� ��������, ����.
//        searchPanel.control.controlView.submitFormHandler({
//            preventDefault: $.noop
//        });
//
//        // Then
//        assert.equal(window.Test2.searchPanel, 5);
//        assert.isTrue(window.Test2.searchPanelLoaded);
//    });
//});
describe('TextBox', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('TextBox', {});

        describe('Implementing TextBox Methods', function () {
            ['getMultiline', 'setMultiline', 'getLineCount', 'setLineCount']
                .forEach(function (methodName) {
                    it(methodName, function() {
                        testHelper.checkMethod(element, methodName);
                    });

                });
        });

        describe('Implementing TextEditorBase Methods', function () {
            testHelper.checkTextEditorBaseMethods(element);
        });

        describe('Implementing EditorBase Methods', function () {
            testHelper.checkEditorBaseMethods(element);
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });

        it('Events onLoad, onValueChanged', function () {
            // Given
            var textBox = new TextBox(),
                onLoadFlag = 0,
                onValueChanged = 0;

            textBox.onLoaded(function(){
                onLoadFlag++;
            });
            textBox.onValueChanged(function(){
                onValueChanged++;
            });

            assert.equal(onLoadFlag, 0);
            assert.equal(onValueChanged, 0);

            // When
            textBox.render();
            textBox.setValue('new');

            // Then
            assert.equal(onLoadFlag, 1);
            assert.equal(onValueChanged, 1);
        });

        it('should be true if scriptsHandlers call', function () {
            //Given
            var builder = new ApplicationBuilder();
            var view = new View();
            var metadata = {
                "TextBox": {
                    OnValueChanged:{
                        Name: 'OnValueChanged'
                    },
                    OnLoaded:{
                        Name: 'OnLoaded'
                    }
                }
            };
            var events = {
                OnValueChanged: 0,
                OnLoaded: 0
            };
            var scripts = view.getScripts();
            scripts.add({
                name: 'OnValueChanged',
                func: function () {
                    events.OnValueChanged++;
                }
            });
            scripts.add({
                name: 'OnLoaded',
                func: function () {
                    events.OnLoaded++;
                }
            });

            //When
            var element = builder.build(metadata, {parentView: view, parent: view, builder: builder});
            element.setValue(true);
            element.render();

            // Then
            assert.equal(events.OnLoaded, 1);
            assert.equal(events.OnValueChanged, 1);
        });
        //@TODO Add Checking Events
    });

    describe('render', function () {

        var element = builder.buildType('TextBox', {});

        it('Setting the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given

            // When
            var $el = element.render();

            // Then
            assert.equal($el.length, 1)
        });

    });
});
describe('TextBoxBuilder', function () {
    describe('build', function () {
        it('successful build TextBox', function () {
            // Given

            var metadata = {};

            // When
            var builder = new TextBoxBuilder();
            var element = builder.build(null, {builder: new ApplicationBuilder(), view: new View(), metadata: metadata});

            // Then
            assert.isNotNull(element);
            assert.isObject(element);
        });
    });
});

describe('TextEditorBase (Element)', function () {
    describe('Textbox as exemplar of TextEditorBase', function () {
        var metadata_1 = {
            Text: '��������',
            DataSources : [
                {
                    ObjectDataSource: {
                        "Name": "ObjectDataSource1",
                        "Items": [
                            { "Id": 1, "Display": "2.2222" },
                            { "Id": 2, "Display": "3.2222" },
                            { "Id": 3, "Display": "4.2222" }
                        ]
                    }
                }
            ],
            Items: [{

                "TextBox": {
                    "Name": "TextBox1",
                    "Value": {
                        "Source": "ObjectDataSource1",
                        "Property": "$.Display"
                    },
                    "DisplayFormat": "{:n2}",

                    "EditMask": {
                        "NumberEditMask": {
                            "Mask": "n3"
                        }
                    }
                }
            }]
        };

        it('Base functional', function () {
            // Given
            var textBox = new TextBox();
            var format = function (context, args) {
                var format = new ObjectFormat();
                return format.format(args.value);
            };
            var mask = new DateTimeEditMask();

            assert.isNull(textBox.getLabelText(), 'default label text is null');
            assert.isFalse(textBox.getLabelFloating(), 'default label floating is false');
            assert.isNull(textBox.getDisplayFormat(), 'default display format is null');
            assert.isNull(textBox.getEditMask(), 'default edit mask is null');


            // When
            textBox.setLabelText('label');
            textBox.setLabelFloating(true);
            textBox.setDisplayFormat(format);
            textBox.setEditMask(mask);


            // Then
            assert.equal(textBox.getLabelText(), 'label', 'new label text is right');
            assert.isTrue(textBox.getLabelFloating(), 'new label floating is true');
            assert.equal(textBox.getDisplayFormat(), format, 'new display format is right');
            assert.equal(textBox.getEditMask(), mask, 'new edit mask is right');
        });

        
        it('Building TextEditorBase (Textbox) by Metadata', function () {
            // Given
            var metadata = metadata_1;

            // When
            testHelper.applyViewMetadata(metadata, onViewReady);

            // Then
            function onViewReady(view, $layout){
                $layout.detach();

                var textbox = view.getContext().controls['TextBox1'];
                var formatter = textbox.getDisplayFormat();
                var mask = textbox.getEditMask();

                assert.equal(formatter(null, {value: 2.22222}), '2,22', 'applied format is right (n2)');
                assert.equal(mask.mask, 'n3', 'applied mask is right (n3)');
            }
        });

    });

});
describe('ToggleButton', function () {
    describe('render', function () {
        it('Setting the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given
            var toggleButton = new ToggleButton(),
                $el;

            // When
            $el = toggleButton.render();

            // Then
            assert.isTrue($el.hasClass('toggle-off'));
            assert.isUndefined($el.attr('data-pl-name'), 'data-pl-name');
            assert.isFalse($el.hasClass('pl-disabled'));
            assert.isFalse($el.hasClass('hidden'), 'hidden');
            assert.isTrue($el.hasClass('pl-horizontal-Left'), 'pl-horizontal-Left');
            assert.isFalse($el.hasClass('pl-horizontal-Center'), 'pl-horizontal-Center');
        });

        it('Change the properties: value, name, enabled, visible, horizontalAlignment', function () {
            // Given
            var toggleButton = new ToggleButton(),
                $el;

            // When
            $el = toggleButton.render();
            toggleButton.setValue(false);
            toggleButton.setTextOn('on');
            toggleButton.setTextOff('off');

            toggleButton.setName('newName');
            toggleButton.setEnabled(false);
            toggleButton.setVisible(false);
            toggleButton.setHorizontalAlignment('Center');

            // Then
            assert.isTrue($el.hasClass('toggle-off'));
            assert.equal($el.attr('data-pl-name'), 'newName');
            assert.isTrue($el.hasClass('pl-disabled'));
            assert.isTrue($el.hasClass('hidden'));
            assert.isFalse($el.hasClass('pl-horizontal-Left'));
            assert.isTrue($el.hasClass('pl-horizontal-Center'));
        });

        it('Events onLoad, onValueChanged', function () {
            // Given
            var toggleButton = new ToggleButton(),
                onLoadFlag = 0,
                onValueChanged = 0;

            toggleButton.onLoaded(function(){
                onLoadFlag++;
            });
            toggleButton.onValueChanged(function(){
                onValueChanged++;
            });

            assert.equal(onLoadFlag, 0);
            assert.equal(onValueChanged, 0);

            // When
            toggleButton.render();
            toggleButton.setValue('true');

            // Then
            assert.equal(onLoadFlag, 1);
            assert.equal(onValueChanged, 1);
        });

        it('should be true if scriptsHandlers call', function () {
            //Given
            var toggleButton = new ToggleButtonBuilder();
            var view = new View();
            var metadata = {
                OnValueChanged:{
                    Name: 'OnValueChanged'
                },
                OnLoaded:{
                    Name: 'OnLoaded'
                }
            };

            var events = {
                OnValueChanged: 0,
                OnLoaded: 0
            };
            var scripts = view.getScripts();
            scripts.add({
                name: 'OnValueChanged',
                func: function () {
                    events.OnValueChanged++;
                }
            });
            scripts.add({
                name: 'OnLoaded',
                func: function () {
                    events.OnLoaded++;
                }
            });


            //When
            var element = toggleButton.build(null, {builder: toggleButton, parentView: view, parent: view, metadata: metadata});
            element.setValue(true);
            element.render();

            // Then
            assert.equal(events.OnLoaded, 1, 'OnLoaded');
            assert.equal(events.OnValueChanged, 1, 'OnValueChanged');
        });
    });
});
describe('UploadFileBox', function () {

    describe('debug', function () {

        it('render', function () {
            var builder = new ApplicationBuilder();
            var view = new View();
            var metadata = {
                MaxSize: 0,
                AcceptTypes: [
                    'image/png'
                ]
            };

            var element = builder.buildType("FileBox", metadata, {parent: view, parentView: view, builder: builder});

            var $el = element.render();
            $('body').append($el);
        });


    });

    //describe('UploadFileBox', function () {
    //
    //    var element;
    //
    //    beforeEach (function () {
    //        element = new UploadFileBox();
    //    });
    //
    //    it('Default property value', function () {
    //        // Given
    //
    //        //$('body').append(element.render());
    //        assert.strictEqual(element.getReadOnly(), false);
    //        assert.strictEqual(element.getMaxSize(), 0);
    //
    //    });
    //
    //    it('Setting properties', function () {
    //
    //        // Given
    //        element.setReadOnly(true);
    //        element.setAcceptTypes(['video/*']);
    //        element.setMaxSize(50000);
    //        element.setValue({Info: {}});
    //
    //        assert.equal(element.getReadOnly(), true);
    //        assert.deepEqual(element.getAcceptTypes(), ['video/*']);
    //        assert.deepEqual(element.getValue(), {Info: {}});
    //        assert.equal(element.getMaxSize(), 50000);
    //    });
    //
    //});


//    describe('UploadFileBox data binding', function () {
//        it('should set UploadFileBox.value from property binding', function () {
//
//            //это говнокод
//            $('#page-content').empty();
//
//            window.providerRegister.register('UploadDocumentDataSource', function (metadataValue) {
//                return new DataProviderUpload(new QueryConstructorUpload('http://127.0.0.1:8888', metadataValue));
//            });
//
//            window.providerRegister.register('DocumentDataSource', function () {
//                return new FakeDataProvider();
//            });
//
//            $('body').append($('<div>').attr('id', 'page-content'));
//
//            var metadata = {
//                Text: 'Пациенты',
//                DataSources: [
//                    {
//                        DocumentDataSource: {
//                            Name : "PatientDataSource",
//                            ConfigId: 'Demography',
//                            DocumentId: 'Patient',
//                            IdProperty: 'Id',
//                            CreateAction: 'CreateDocument',
//                            GetAction: 'GetDocument',
//                            UpdateAction: 'SetDocument',
//                            DeleteAction: 'DeleteDocument',
//                            FillCreatedItem: true
//                        }
//                    }
//                ],
//                LayoutPanel: {
//                    StackPanel: {
//                        Name: 'MainViewPanel',
//                        Items: [
//                            {
//                                UploadFileBox: {
//                                    Name: 'UploadFileBox1',
//                                    AcceptTypes: ['image/*', 'video/*'],
//                                    MaxSize: 100000,
//                                    Value : {
//                                        FileBinding : {
//                                            DataSource : 'PatientDataSource',
//                                            Property : '$.file'
//                                        }
//                                    }
//                                }
//                            }
//                        ]
//                    }
//                }
//            };
//
//            var linkView = new LinkView(null, function (resultCallback) {
//                var builder = new ApplicationBuilder();
//                var view = builder.buildType(fakeView(), 'View', metadata);
//                resultCallback(view);
//            });
//            linkView.setOpenMode('Application');
//
//            linkView.createView(function(view){
//                view.open();
//
//                var itemToSelect = null;
//                view.getDataSource('PatientDataSource').getItems(function(data){
//                    itemToSelect = data[1];
//                });
//
//                view.getDataSource('PatientDataSource').setSelectedItem(itemToSelect);
//
//
//                //window.maindatasource = view.getDataSource('PatientDataSource');
//
//                //check text
//                // assert.equal($('#page-content').find('input:text').val(), itemToSelect.LastName);
//                // $('#page-content').remove();
//            });
//        });
//    });


});
describe('Frame', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('Frame', {});

        describe('Implementing EditorBase Methods', function () {
            testHelper.checkEditorBaseMethods(element);
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });
    });

});

describe('FrameBuilder', function () {
    describe('build', function () {
        it('successful build Frame', function () {
            // Given

            var metadata = {};

            // When
            var builder = new FrameBuilder();
            var element = builder.build(null, {builder: new ApplicationBuilder(), view: new View(), metadata: metadata});

            // Then
            assert.isNotNull(element);
            assert.isObject(element);
        });
    });
});

describe('ImageBox', function () {

    function delay(min, max) {
        if (typeof min === 'undefined') {
            min = 100;
        }
        if (typeof  max === 'undefined') {
            max = 200;
        }

        return Math.ceil(Math.random() * (max - min) + min);
    }

    describe('API', function () {
        var builder = new ApplicationBuilder();
        var element = builder.buildType('ImageBox', {});

        describe('Implementing ImageBox Methods', function () {
            ['getMaxSize', 'setMaxSize', 'getAcceptTypes']
                .forEach(function (methodName) {
                    it(methodName, function () {
                        testHelper.checkMethod(element, methodName);
                    });

                });
        });

        describe('Implementing EditorBase Methods', function () {
            testHelper.checkEditorBaseMethods(element);
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element);
        });
    });

    describe('debug', function () {

        it('render', function () {
            var builder = new ApplicationBuilder();
            var view = new View();
            var metadata = {
                MaxSize: 0,
                AcceptTypes: [
                    'image/png'
                ]
            };

            var element = builder.buildType("ImageBox", metadata, {parent: view, parentView: view, builder: builder});

            var $el = element.render();
            //$('body').append($el);
        });


    });

    describe('Upload new file', function () {

        beforeEach(function () {
            //register fake upload provider
            window.providerRegister.register('DocumentFileProvider', function (metadata) {
                return {
                    uploadFile: function () {
                        var deferred = $.Deferred();
                        setTimeout(function () {
                            deferred.resolve();
                        }, delay());

                        return deferred.promise();
                    },
                    getFileUrl: function (fieldName, instanceId) {
                        return [fieldName, instanceId, 'fake.html'].join('.');
                    }
                };
            });

            //register fake DocumentDataSource provider
            window.providerRegister.register('DocumentDataSource', function (metadataValue) {
                return {
                    getItems: function (criteriaList, pageNumber, pageSize, sorting, resultCallback) {
                        var items = [{
                            "Id": "1",
                            photo: {
                                Info: {
                                    ContentId: 'somePhotoId'
                                }
                            }
                        }];
                        setTimeout(function () {
                            resultCallback(items);
                        }, delay());
                    },
                    createItem: function (resultCallback, idProperty) {
                        var response = {
                            'DisplayName': 'display name'
                        };
                        setTimeout(function () {
                            resultCallback(response);
                        }, delay());
                    },

                    saveItem: function (value, resultCallback, warnings, idProperty) {
                        var response = [{
                            InstanceId: "42"
                        }];

                        setTimeout(function () {
                            resultCallback(response);
                        }, delay());
                    },
                    setCreateAction: function () {},
                    setReadAction: function () {},
                    setUpdateAction: function () {},
                    setDeleteAction: function () {},
                    setConfigId: function () {},
                    getConfigId: function () {},
                    setDocumentId: function () {},
                    getDocumentId: function () {},
                    createLocalItem: function (idProperty) {
                        var result = {};

                        result[idProperty] = guid();
                        result['__Id'] = result[idProperty];

                        return result;
                    }
                };

            });
        });

        //
        //it('Should set image url', function (done) {
        //    var builder = new ApplicationBuilder();
        //
        //    //Build view
        //    var view = new View();
        //
        //    //Build DataSource
        //    var dataSources = view.getDataSources();
        //    var dsMetadata = {
        //        Name: 'MyDataSource',
        //        ConfigId: 'MyConfig',
        //        DocumentId: 'MyDocument'
        //    };
        //    var ds = builder.buildType('DocumentDataSource', dsMetadata, {parentView: view});
        //    dataSources.add(ds);
        //
        //    var PROPERTY_NAME = 'photo';
        //
        //    //build ImageBox
        //    var imageBoxMetadata = {
        //        Value: {
        //            Source: 'MyDataSource',
        //            Property: PROPERTY_NAME
        //        }
        //    };
        //    var imageBox = builder.buildType('ImageBox', imageBoxMetadata, {parent: view, parentView: view});
        //
        //    imageBox.render();
        //
        //    ds.onItemsUpdated(function () {
        //        var items = ds.getItems();
        //        ds.setSelectedItem(items[0]);
        //        assert.equal(imageBox.getValue(), [PROPERTY_NAME, '1', 'fake.html'].join('.'), 'Image URL for existing item');
        //
        //        ds.createItem(function (context, args) {
        //            imageBox.onPropertyChanged('value', function (context, args) {
        //                var url = [PROPERTY_NAME, 'MyPhotoId', 'fake.html'].join('.');
        //                assert.equal(imageBox.getValue(), url, 'image URL for new item');
        //                done();
        //            });
        //
        //            ds.setProperty(PROPERTY_NAME, {ContentId: 'MyPhotoId2'});
        //        });
        //    });
        //
        //});

    });

    describe('Render', function () {
        var element;

        beforeEach(function () {
            element = new ImageBox();
        });

        it('Setting properties', function () {

            // Given
            element.setEnabled(true);
            element.setAcceptTypes(['video/*']);
            element.setMaxSize(50000);
            //element.setValue({Info: {}});

            assert.equal(element.getEnabled(), true);
            assert.deepEqual(element.getAcceptTypes().toArray(), ['video/*']);
            //assert.deepEqual(element.getValue(), {Info: {}});
            assert.equal(element.getMaxSize(), 50000);
        });

    });


//    describe('ImageBox data binding', function () {
//        it('should set ImageBox.value from property binding', function () {
//
//            //это говнокод
//            $('#page-content').empty();
//
//            window.providerRegister.register('UploadDocumentDataSource', function (metadataValue) {
//                return new DataProviderUpload(new QueryConstructorUpload('http://127.0.0.1:8888', metadataValue));
//            });
//
//            window.providerRegister.register('DocumentDataSource', function () {
//                return new FakeDataProvider();
//            });
//
//            $('body').append($('<div>').attr('id', 'page-content'));
//
//            var metadata = {
//                Text: 'Пациенты',
//                DataSources: [
//                    {
//                        DocumentDataSource: {
//                            Name : "PatientDataSource",
//                            ConfigId: 'Demography',
//                            DocumentId: 'Patient',
//                            IdProperty: 'Id',
//                            CreateAction: 'CreateDocument',
//                            GetAction: 'GetDocument',
//                            UpdateAction: 'SetDocument',
//                            DeleteAction: 'DeleteDocument',
//                            FillCreatedItem: true
//                        }
//                    }
//                ],
//                LayoutPanel: {
//                    StackPanel: {
//                        Name: 'MainViewPanel',
//                        Items: [
//                            {
//                                ImageBox: {
//                                    Name: 'ImageBox1',
//                                    Value : {
//                                        FileBinding : {
//                                            DataSource : 'PatientDataSource',
//                                            Property : '$.photo'
//                                        }
//                                    }
//                                }
//                            }
//                        ]
//                    }
//                }
//            };
//
//            var linkView = new LinkView(null, function (resultCallback) {
//                var builder = new ApplicationBuilder();
//                var view = builder.buildType(fakeView(), 'View', metadata);
//                resultCallback(view);
//            });
//            linkView.setOpenMode('Application');
//
//            linkView.createView(function(view){
//                view.open();
//
//                var itemToSelect = null;
//                view.getDataSource('PatientDataSource').getItems(function(data){
//                    itemToSelect = data[1];
//                });
//
//                view.getDataSource('PatientDataSource').setSelectedItem(itemToSelect);
//
//
//                window.maindatasource = view.getDataSource('PatientDataSource');
//
//                //check text
//               // assert.equal($('#page-content').find('input:text').val(), itemToSelect.LastName);
//               // $('#page-content').remove();
//            });
//        });
//    });


});
//describe('Extension Panel', function () {
//    it('should be true if scriptsHandlers call', function () {
//        //Given
//        var extensionPanel = new ApplicationBuilder();
//        var view = new View();
//        var metadata = {
//            ExtensionPanel: {
//                ExtensionName: 'Banner',
//                OnLoaded: {
//                    Name: 'OnLoaded'
//                }
//            }
//        };
//        window.Test = {extensionPanelLoaded:false};
//        view.setScripts([{Name:"OnLoaded", Body:"window.Test.extensionPanelLoaded = true"}]);
//
//        //When
//        var build = extensionPanel.build(view, metadata);
//        var el = build.render();
//
//        // Then
////        assert.isTrue(window.Test.extensionPanelLoaded);
//    });
//});
describe('PanelElement', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('Panel', {});

        describe('Implementing Panel API', function () {
            it('Implement methods', function () {
                testHelper.checkMethod(element, 'getCollapsible');
                testHelper.checkMethod(element, 'setCollapsible');
                testHelper.checkMethod(element, 'getCollapsed');
                testHelper.checkMethod(element, 'setCollapsed');
                testHelper.checkMethod(element, 'getHeaderTemplate');
                testHelper.checkMethod(element, 'setHeaderTemplate');
                testHelper.checkMethod(element, 'getHeader');
                testHelper.checkMethod(element, 'setHeader');
            });

            it('Implement events subscriber', function () {
                testHelper.checkMethod(element, 'onExpanding');
                testHelper.checkMethod(element, 'onExpanded');
                testHelper.checkMethod(element, 'onCollapsing');
                testHelper.checkMethod(element, 'onCollapsed');
            });

        });

        describe('Implementing Container Methods', function () {
            testHelper.checkContainerMethods(element)
        });

        describe('Implementing Element Methods', function () {
            testHelper.checkElementMethods(element)
        });

        it('Default values', function () {
            var element = builder.buildType('Panel', {});

            assert.equal(element.getCollapsible(), false, 'Collapsible');
            assert.equal(element.getCollapsed(), false, 'Collapsed');
            assert.isFunction(element.getHeaderTemplate, 'HeaderTemplate by default');
        });

    });


    describe('Panel events handler', function () {

        function bindEvents(element) {
            var events = [];
            element.onCollapsed(function () {
                events.push('onCollapsed');
            });

            element.onCollapsing(function () {
                events.push('onCollapsing');
            });

            element.onExpanded(function () {
                events.push('onExpanded');
            });

            element.onExpanding(function () {
                events.push('onExpanding');
            });

            return events;
        }

        function createPanel() {
            return builder.buildType('Panel', {});
        }

        it('Should fire onCollapsing on setCollapsed(true)', function () {
            //Given
            var element = createPanel();
            var events = bindEvents(element);
            //When
            element.setCollapsed(true);

            //Then
            assert.lengthOf(events, 2);
            assert.equal(events[0], 'onCollapsing', 'onCollapsing');
            assert.equal(events[1], 'onCollapsed', 'onCollapsed');
            assert.equal(element.getCollapsed(), true);
        });

        it('Should fire onExpanding on setCollapsed(false)', function () {
            //Given
            var element = createPanel();
            element.setCollapsed(true);
            var events = bindEvents(element);
            //When
            element.setCollapsed(false);

            //Then
            assert.lengthOf(events, 2);
            assert.equal(events[0], 'onExpanding', 'onExpanding');
            assert.equal(events[1], 'onExpanded', 'onExpanded');
            assert.equal(element.getCollapsed(), false);
        });

        it('Should cancel setCollapsed(true) when one of onCollapsing returns false', function () {
            //Given
            var element = createPanel();
            var events = bindEvents(element);
            element.onCollapsing(function () {
                events.push('onCollapsing');
                return false;
            });

            //When
            element.setCollapsed(true);

            //Then
            assert.lengthOf(events, 2);
            assert.equal(events[0], 'onCollapsing', 'onCollapsing');
            assert.equal(events[1], 'onCollapsing', 'onCollapsing');
            assert.equal(element.getCollapsed(), false);
        });

        it('Should cancel setCollapsed(false) when one of onExpanding returns false', function () {
            //Given
            var element = createPanel();
            element.setCollapsed(true);
            var events = bindEvents(element);

            element.onExpanding(function () {
                events.push('onExpanding');
                return false;
            });

            //When
            element.setCollapsed(false);

            //Then
            assert.lengthOf(events, 2);
            assert.equal(events[0], 'onExpanding', 'onExpanding');
            assert.equal(events[1], 'onExpanding', 'onExpanding');
            assert.equal(element.getCollapsed(), true);
        });


    });

});
describe('PanelBuilder', function () {
    it('should build', function () {

        //Given
        var metadata = {
            Panel: {
                Text: 'panel',
                Items: [
                    {
                        TextBox: {
                            Name: 'text'
                        }
                    }
                ]
            }
        };

        var builder = new ApplicationBuilder();
        var panel = builder.build(metadata, {parentView: fakeView()});

        //When
        assert.equal(panel.getText(), 'panel');
    });

});
describe('ScrollPanelElement', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {

        it('implements API methods', function () {
            var element = builder.buildType('ScrollPanel', {});

            assert.isFunction(element.getHorizontalScroll, 'getHorizontalScroll');
            assert.isFunction(element.setHorizontalScroll, 'setHorizontalScroll');
            assert.isFunction(element.getVerticalScroll, 'getVerticalScroll');
            assert.isFunction(element.setVerticalScroll, 'setVerticalScroll');
        });


        it('Default values', function () {
            var element = builder.buildType('ScrollPanel', {});

            assert.equal(element.getHorizontalScroll(), ScrollVisibility.auto, 'getHorizontalScroll');
            assert.equal(element.getVerticalScroll(), ScrollVisibility.auto, 'getVerticalScroll');
        });


    });


});
describe('ScrollPanelBuilder', function () {
    it('should build', function () {

        //Given
        var metadata = {
            ScrollPanel: {
                Items: []
            }
        };

        var applicationBuilder = new ApplicationBuilder();

        //When
        var scrollPanel = applicationBuilder.build(metadata, {});

        //Then
        assert.isObject(scrollPanel, 'scrollPanel');
    });

});
describe('TabPanelElement', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {

        it('Default values', function () {
            var element = builder.buildType('TabPanel', {});

            assert.equal(element.getHeaderLocation(), TabHeaderLocation.top, 'HeaderLocation');
            assert.equal(element.getHeaderOrientation(), TabHeaderOrientation.horizontal, 'HeaderOrientation');
        });


    });


});
describe('TabPanelBuilder', function () {
    it('should build', function () {

        //Given
        var metadata = {
            TabPanel: {
                Items: []
            }
        };

        var applicationBuilder = new ApplicationBuilder();

        //When
        var element = applicationBuilder.build(metadata, {});

        //Then
        assert.isObject(element, 'TabPanel');
    });

});
describe('ToolBarElement', function () {
    var builder = new ApplicationBuilder();

    describe('API', function () {
        var element = builder.buildType('ToolBar', {Items: []});


        describe('Implementing Container Methods', function () {
            testHelper.checkContainerMethods(element);
        });

    });

    describe('render', function () {

        var element = builder.buildType('ToolBar', {
            Items: [
                {
                    Button: {
                        Text: "Button 1"
                    }
                },
                {
                    Button: {
                        Text: "Button 2"
                    }

                }
            ]
        });

        it('render element', function () {
            // Given

            // When
            var $el = element.render();

            // Then
            assert.equal($el.length, 1)
        });

        it('contains items', function () {
            var items = element.getItems();

            assert.equal(items.length, 2);
        })

    });
});
describe('ToolBarBuilder', function () {
    var builder = new ApplicationBuilder();


    it('Build ToolBar instance', function () {
        var element = builder.buildType('ToolBar', {Items: []});

        assert.isTrue(typeof element !== 'undefined' && element !== null);
        assert.isTrue(element instanceof ToolBar);
    });

});
describe('View', function () {

    it('should get scripts', function () {
        //Given
        var view = new View();

        //When
        var scripts = view.getScripts();

        //Then
        assert.isDefined(scripts);
        assert.instanceOf(scripts, Collection);

        //When
        scripts.add('script');

        //Then
        assert.equal(view.getScripts().length, 1, 'getScripts should not override scripts');
    });

    it('should get parameters', function () {
        //Given
        var view = new View();

        //When
        var parameters = view.getParameters();

        //Then
        assert.isDefined(parameters);
        assert.instanceOf(parameters, Collection);

        //When
        parameters.add('parameter');

        //Then
        assert.equal(view.getParameters().length, 1, 'getParameters should not override parameters');
    });

    it('should get dataSources', function () {
        //Given
        var view = new View(),
            dataSource = new DocumentDataSource({view: view});

        //When
        var dataSources = view.getDataSources();

        //Then
        assert.isDefined(dataSources);
        assert.instanceOf(dataSources, Collection);

        //When
        dataSources.add(dataSource);

        //Then
        assert.equal(view.getDataSources().length, 1, 'getDataSources should not override dataSource');
    });

    it('should set icon', function () {
        //Given
        var view = new View();

        assert.isUndefined(view.getIcon());

        //When
        view.setIcon('icon1');

        //Then
        assert.equal(view.getIcon(), 'icon1');
    });

    it('should set dialogResult', function () {
        //Given
        var view = new View();

        assert.equal(view.getDialogResult(), DialogResult.none);

        //When
        view.setDialogResult(DialogResult.accepted);

        //Then
        assert.equal(view.getDialogResult(), DialogResult.accepted);
    });

    describe('Context', function () {
        it('should get context', function () {
            //Given
            var view = new View();

            //When
            var context = view.getContext();

            //Then
            assert.isNotNull(context);
            assert.isDefined(context);
        });

        it('should refresh context on registerElement', function () {
            //Given
            var view = new View();

            //When
            view.registerElement({name: 'element'});
            var context = view.getContext();

            //Then
            assert.isDefined(context.controls['element']);
        });


        it('should refresh context on add script', function () {
            //Given
            var view = new View();
            var scripts = view.getScripts();

            //When
            scripts.add({ name: 'script', func: {} });
            var context = view.getContext();

            //Then
            assert.isDefined(context.scripts['script']);
        });

        it('should refresh context on replace script', function () {
            //Given
            var view = new View();
            var scripts = view.getScripts();
            var oldScript = { name: 'oldScript', func: {} };
            var newScript = { name: 'newScript', func: {} };

            scripts.add(oldScript);

            //When
            scripts.replace(oldScript, newScript);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.scripts['oldScript']);
            assert.isDefined(context.scripts['newScript']);
        });

        it('should refresh context on remove script', function () {
            //Given
            var view = new View();
            var scripts = view.getScripts();
            var removedScript = { name: 'removedScript', func: {} };

            scripts.add(removedScript);
            assert.isDefined(view.getContext().scripts['removedScript']);

            //When
            scripts.remove(removedScript);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.scripts['removedScript']);
        });

        it('should refresh context on reset script', function () {
            //Given
            var view = new View();
            var scripts = view.getScripts();
            var oldScript = { name: 'oldScript', func: {} };
            var newScript = { name: 'newScript', func: {} };

            scripts.add(oldScript);

            //When
            scripts.reset([newScript]);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.scripts['oldScript']);
            assert.isDefined(context.scripts['newScript']);
        });


        it('should refresh context on add parameter', function () {
            //Given
            var view = new View();
            var parameters = view.getParameters();

            //When
            parameters.add({name: 'param'});
            var context = view.getContext();

            //Then
            assert.isDefined(context.parameters['param']);
        });

        it('should refresh context on replace parameter', function () {
            //Given
            var view = new View();
            var parameters = view.getParameters();
            var oldParameter = { name: 'oldParameter' };
            var newParameter = { name: 'newParameter' };

            parameters.add(oldParameter);

            //When
            parameters.replace(oldParameter, newParameter);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.parameters['oldParameter']);
            assert.isDefined(context.parameters['newParameter']);
        });

        it('should refresh context on remove parameter', function () {
            //Given
            var view = new View();
            var parameters = view.getParameters();
            var removedParameter = { name: 'removedParameter' };

            parameters.add(removedParameter);
            assert.isDefined(view.getContext().parameters['removedParameter']);

            //When
            parameters.remove(removedParameter);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.parameters['removedParameter']);
        });

        it('should refresh context on reset parameter', function () {
            //Given
            var view = new View();
            var parameters = view.getParameters();
            var oldParameter = { name: 'oldParameter' };
            var newParameter = { name: 'newParameter' };

            parameters.add(oldParameter);

            //When
            parameters.reset([newParameter]);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.parameters['oldParameter']);
            assert.isDefined(context.parameters['newParameter']);
        });


        it('should refresh context on add dataSource', function () {
            //Given
            var view = new View();
            var dataSource = new DocumentDataSource({view: view, name: 'dataSource'});
            var dataSources = view.getDataSources();

            //When
            dataSources.add(dataSource);
            var context = view.getContext();

            //Then
            assert.isDefined(context.dataSources['dataSource']);
        });

        it('should refresh context on replace dataSource', function () {
            //Given
            var view = new View();
            var dataSources = view.getDataSources();
            var oldDataSource = new DocumentDataSource({view: view, name: 'oldDataSource'});
            var newDataSource = new DocumentDataSource({view: view, name: 'newDataSource'});

            dataSources.add(oldDataSource);

            //When
            dataSources.replace(oldDataSource, newDataSource);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.dataSources['oldDataSource']);
            assert.isDefined(context.dataSources['newDataSource']);
        });

        it('should refresh context on remove dataSource', function () {
            //Given
            var view = new View();
            var dataSources = view.getDataSources();
            var removedDataSource = new DocumentDataSource({view: view, name: 'removedDataSource'});

            dataSources.add(removedDataSource);
            assert.isDefined(view.getContext().dataSources['removedDataSource']);

            //When
            dataSources.remove(removedDataSource);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.dataSources['removedDataSource']);
        });

        it('should refresh context on reset dataSource', function () {
            //Given
            var view = new View();
            var dataSources = view.getDataSources();
            var oldDataSource = new DocumentDataSource({view: view});
            var newDataSource = new DocumentDataSource({view: view});
            oldDataSource.setName('oldDataSource');
            newDataSource.setName('newDataSource');

            dataSources.add(oldDataSource);

            //When
            dataSources.reset([newDataSource]);
            var context = view.getContext();

            //Then
            assert.isUndefined(context.dataSources['oldDataSource']);
            assert.isDefined(context.dataSources['newDataSource']);
        });
    });

    describe('Open', function () {
        it('should call event onOpening', function () {
            //Given
            var view = new View();
            window.EventOnOpeningWasCall = false;

            view.onOpening(function () {
                window.EventOnOpeningWasCall = true;
            });

            //When
            view.open();

            //Then
            assert.isTrue(window.EventOnOpeningWasCall, 'onOpening was not call');
        });

        it('should call event onOpened when onOpening passed', function () {
            //Given
            var view = new View();
            window.EventOnOpenedWasCall = false;

            view.onOpened(function () {
                window.EventOnOpenedWasCall = true;
            });

            //When
            view.open();

            //Then
            assert.isTrue(window.EventOnOpenedWasCall, 'onOpened was not call');
        });

        it('should not call event onOpened when onOpening failed', function () {
            //Given
            var view = new View();
            window.EventOnOpenedWasCall = false;

            view.onOpening(
                function () {
                    return false; // onOpening failed
                });

            view.onOpened(function () {
                window.EventOnOpenedWasCall = true;
            });

            //When
            view.open();

            //Then
            assert.isFalse(window.EventOnOpenedWasCall);
        });

        it('should select correct callback when onOpening passed', function () {
            //Given
            var view = new View();
            window.SuccessWasCall = false;
            window.ErrorWasCall = false;

            //When
            view.open(
                function () {
                    window.SuccessWasCall = true;
                },
                function () {
                    window.ErrorWasCall = true;
                }
            );

            //Then
            assert.isTrue(window.SuccessWasCall, 'success was not call');
            assert.isFalse(window.ErrorWasCall, 'error was call');
        });

        it('should select correct callback when onOpening failed', function () {
            //Given
            var view = new View();
            window.SuccessWasCall = false;
            window.ErrorWasCall = false;

            view.onOpening(
                function () {
                    return false; // onOpening failed
                });

            //When
            view.open(
                function () {
                    window.SuccessWasCall = true;
                },
                function () {
                    window.ErrorWasCall = true;
                }
            );

            //Then
            assert.isFalse(window.SuccessWasCall, 'success was call');
            assert.isTrue(window.ErrorWasCall, 'error was not call');
        });
    });

    describe('Close', function () {
        it('should call event onClosing', function () {
            //Given
            var view = new View();
            window.EventOnClosingWasCall = false;

            view.onClosing(function () {
                window.EventOnClosingWasCall = true;
            });

            //When
            view.close();

            //Then
            assert.isTrue(window.EventOnClosingWasCall, 'OnClosing was not call');
        });

        it('should call event onClosed when onClosing passed', function () {
            //Given
            var view = new View();
            window.EventOnClosedWasCall = false;

            view.onClosed(function () {
                window.EventOnClosedWasCall = true;
            });

            //When
            view.close();

            //Then
            assert.isTrue(window.EventOnClosedWasCall, 'OnClosed was not call');
        });

        it('should not call event onClosed when onClosing failed', function () {
            //Given
            var view = new View();
            window.EventOnClosedWasCall = false;

            view.onClosing(
                function () {
                    return false; // onClosing failed
                });

            view.onClosed(function () {
                window.EventOnClosedWasCall = true;
            });

            //When
            view.close();

            //Then
            assert.isFalse(window.EventOnClosedWasCall);
        });

        it('should select correct callback when onClosing passed', function () {
            //Given
            var view = new View();
            window.SuccessWasCall = false;
            window.ErrorWasCall = false;

            //When
            view.close(
                function () {
                    window.SuccessWasCall = true;
                },
                function () {
                    window.ErrorWasCall = true;
                }
            );

            //Then
            assert.isTrue(window.SuccessWasCall, 'success was not call');
            assert.isFalse(window.ErrorWasCall, 'error was call');
        });

        it('should select correct callback when onClosing failed', function () {
            //Given
            var view = new View();
            window.SuccessWasCall = false;
            window.ErrorWasCall = false;

            view.onClosing(
                function () {
                    return false; // onClosing failed
                });

            //When
            view.close(
                function () {
                    window.SuccessWasCall = true;
                },
                function () {
                    window.ErrorWasCall = true;
                }
            );

            //Then
            assert.isFalse(window.SuccessWasCall, 'success was call');
            assert.isTrue(window.ErrorWasCall, 'error was not call');
        });
    });

});
describe('ViewBuilder', function () {
    var viewMetadata = {
        Text: 'TestView',
        Icon: 'Icon',
        DataSources: [
            {
                DocumentDataSource: {
                    Name: 'documentDataSource1',
                    ConfigId: 'configuration',
                    DocumentId: 'document'
                }
            },
            {
                ObjectDataSource: {
                    Name: 'objectDataSource1',
                    Items: [
                        { Id: 1, Display: 'first' },
                        { Id: 2, Display: 'second' }
                    ]
                }
            }
        ],

        Items: [{
            "TextBox": {
                "Name": "TextBox1",
                "Value": {
                    "Source": "objectDataSource1",
                    "Property": "$.Display"
                }
            }
        }],

        Parameters: [
            {
                Name: 'param1',
                OnPropertyChanged: 'OnParameterChanged'
            }
        ],

        Scripts: [
            {
                Name: 'script1',
                Body: ''
            },
            {
                Name: 'script2',
                Body: ''
            }
        ]
    };

    it('should build Container and Element metadata', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = {
            Name: 'my_view',
            Items: [
                {
                    StackPanel: {
                        GridPanel: {
                            Rows: []
                        }
                    }
                }
            ]
        };

        // When
        var view = viewBuilder.build(null, {metadata: metadata});

        // Then
        assert.equal(view.getName(), 'my_view');
        assert.instanceOf(view.getItems(), Collection);
    });

    it('should build Icon', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var builder = new ApplicationBuilder();
        var metadata = viewMetadata;

        // When
        var view = viewBuilder.build(null, {metadata: metadata, builder: builder});

        // Then
        assert.equal(view.getIcon(), 'Icon');
    });


    it('should build Scripts', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = viewMetadata;

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});

        // Then
        assert.equal(view.getScripts().length, 2);

        var script = view.getScripts().pop();
        assert.property(script, 'name');
        assert.property(script, 'func');
        assert.instanceOf(script.func, Function);
    });

    it('should build Parameters', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = viewMetadata;
        var param = new Parameter({name: 'param1'});

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata, params: {param1: param}});

        // Then
        assert.equal(view.getParameters().length, 1);
        assert.instanceOf(view.getParameters().pop(), Parameter);
    });

    it('should build DataSources', function () {
        // Given
        window.providerRegister.register('DocumentDataSource', FakeDataProvider);
        window.providerRegister.register('ObjectDataSource', ObjectDataProvider);

        var viewBuilder = new ViewBuilder();
        var metadata = viewMetadata;

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});
        var dataSources = view.getDataSources();

        // Then
        assert.equal(dataSources.length, 2);
        assert.instanceOf(dataSources.find(function(item){ return item.getName() == 'documentDataSource1'; }), DocumentDataSource, 'wrong build for DocumentDataSource');
        assert.instanceOf(dataSources.find(function(item){ return item.getName() == 'objectDataSource1'; }), ObjectDataSource, 'wrong build for ObjectDataSource');
    });


    it('should build OnOpening', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = _.extend({}, viewMetadata, {
            Scripts: [
                {
                    Name: 'onOpening',
                    Body: 'window.EventOnOpeningWasCall = true;'
                }
            ],
            OnOpening: 'onOpening'
        });

        window.EventOnOpeningWasCall = false;

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});
        view.open();

        // Then
        assert.isTrue(window.EventOnOpeningWasCall);

        // cleaning
        view.close();
    });

    it('should build OnOpened', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = _.extend({}, viewMetadata, {
            Scripts: [
                {
                    Name: 'onOpened',
                    Body: 'window.EventOnOpenedWasCall = true;'
                }
            ],
            OnOpened: 'onOpened'
        });

        window.EventOnOpenedWasCall = false;

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});
        view.open();

        // Then
        assert.isTrue(window.EventOnOpenedWasCall);

        // cleaning
        view.close();
    });

    it('should build OnClosing', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = _.extend({}, viewMetadata, {
            Scripts: [
                {
                    Name: 'onClosing',
                    Body: 'window.EventOnClosingWasCall = true;'
                }
            ],
            OnClosing: 'onClosing'
        });

        window.EventOnClosingWasCall = false;

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});
        view.close();

        // Then
        assert.isTrue(window.EventOnClosingWasCall);
    });

    it('should build OnClosed', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = _.extend({}, viewMetadata, {
            Scripts: [
                {
                    Name: 'onClosed',
                    Body: 'window.EventOnClosedWasCall = true;'
                }
            ],
            OnClosed: 'onClosed'
        });

        window.EventOnClosedWasCall = false;

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});
        view.close();

        // Then
        assert.isTrue(window.EventOnClosedWasCall);
    });

    it('should build CloseButtonVisibility', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var builder = new ApplicationBuilder();
        var metadata = _.extend({}, viewMetadata, {
            CloseButtonVisibility: false
        });

        // When
        var view = viewBuilder.build(null, {metadata: metadata, builder: builder});

        // Then
        assert.isFalse(view.getCloseButtonVisibility());
    });

    it('should build HeaderTemplate', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var metadata = _.extend({}, viewMetadata, {
            HeaderTemplate: {
                Icon: {
                }
            }
        });

        // When
        var view = viewBuilder.build(null, {builder: new ApplicationBuilder(), metadata: metadata});

        // Then
        var headerTemplate = view.getHeaderTemplate();
        var header = headerTemplate();

        assert.instanceOf(header, Icon);
    });

    it('should build default value', function () {
        // Given
        var viewBuilder = new ViewBuilder();
        var builder = new ApplicationBuilder();
        var metadata = viewMetadata;

        // When
        var view = viewBuilder.build(null, {metadata: metadata, builder: builder});

        // Then
        var headerTemplate = view.getHeaderTemplate();
        var header = headerTemplate();

        // Header
        assert.instanceOf(header, Label);
        assert.equal(header.getValue(), 'TestView');

        // CloseButtonVisibility
        assert.isTrue(view.getCloseButtonVisibility());
    });
});
function FakeDataProvider(mode) {

    var items = [
        {
            "Id": '1',
            "FirstName": "Иван",
            "LastName": "Иванов"
        },
        {
            "Id": '2',
            "FirstName": "Петр",
            "LastName": "Петров"
        },
        {
            "Id": '3',
            "FirstName": "Иван1",
            "LastName": "Иванов1"
        },
        {
            "Id": '4',
            "FirstName": "Петр2",
            "LastName": "Петров2"
        },
        {
            "Id": '5',
            "FirstName": "Иван3",
            "LastName": "Иванов3"
        },
        {
            "Id": '6',
            "FirstName": "Петр4",
            "LastName": "Петров5"
        },
        {
            "Id": '10',
            "FirstName": "Анна",
            "LastName": "Сергеева"

        }
    ];

    var itemsUpdated = [
        {
            "Id": '4',
            "FirstName": "Федор",
            "LastName": "Федоров"
        },
        {
            "Id": '5',
            "FirstName": "Сидор",
            "LastName": "Сидоров"
        }
    ];

    this.getItems = function (criteriaList, pageNumber, pageSize, sorting, resultCallback) {
        if (mode === undefined || mode() === 'Created') {

            var result = [];
            var allItems = items;

            for (var i = 0; i < pageSize; i++) {
                var itemIndex = i + (pageNumber * pageSize);
                if (itemIndex < allItems.length) {
                    result.push(items[itemIndex]);
                }
                else {
                    break;
                }
            }

            if(criteriaList && criteriaList.length == 1 && criteriaList[0].CriteriaType == 1){
                result = _.filter(result, function(item){
                    return item.Id == criteriaList[0].Value;
                });
            }

            setTimeout(function(){
                resultCallback(result);
            }, 100);

        }
        else {
            setTimeout(function(){
                resultCallback(itemsUpdated);
            }, 100);
        }
    };

    this.createItem = function (resultCallback) {
        setTimeout(function(){
            resultCallback({prefilledField: 1, Id:1, __Id:1});
        },100);

    };

    this.saveItem = function (value, resultCallback, warnings) {

        var itemIndex = -1;

        if(value['__Id']){
            delete value['__Id'];
        }

        for (var i = 0; i < items.length; i++) {
            if (items[i].Id === value.Id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex !== -1) {
            items[itemIndex] = value;
        }
        else {
            items.push(value);
        }

        setTimeout(function(){
            resultCallback(items);
        },90);
    };

    this.deleteItem = function (value, resultCallback) {
        var itemIndex = items.indexOf(value);
        items.splice(itemIndex, 1);
        resultCallback(items);
    };

    this.getItem = function (itemId, resultCallback) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].Id === itemId) {
                resultCallback([items[i]]);
                return;
            }
        }
        resultCallback(null);
    };

    this.createIdFilter = function(id){
        return [{
            "Property": "Id",
            "Value": id,
            "CriteriaType": 1
        }];
    };

    this.setCreateAction = function(){};
    this.setUpdateAction = function(){};
    this.setReadAction = function(){};
    this.setDeleteAction = function(){};
    this.setConfigId = function(){};
    this.setDocumentId = function(){};
}

describe('BooleanFormat', function () {
    describe('format', function () {

        it('successful build', function () {
            //Given
            var metadata = {TrueText: "+", FalseText: "-"};
            var builder = new BooleanFormatBuilder();
            //When
            var format = builder.build(null, {metadata: metadata} );
            //Then
            assert.isFunction(format.format);
            assert.isFunction(format.getTrueText);
            assert.isFunction(format.getFalseText);
            assert.isFunction(format.setFalseText);
            assert.isFunction(format.setTrueText);
            assert.equal(format.format(true), '+');
            assert.equal(format.format(false), '-');
        });

        it('should have default value', function () {
            //Given
            var format = new BooleanFormat();
            //When
            var value = true;
            //Then
            assert.equal(format.getFalseText(), 'False');
            assert.equal(format.getTrueText(), 'True');
            assert.equal(format.format(value), 'True');
        });

        it('should format boolean', function () {
            //Given
            var format = new BooleanFormat();
            //When
            var value_1 = false;
            var value_2 = true;
            format.setFalseText('Нет');
            format.setTrueText('Да');
            //Then
            assert.equal(format.format(value_1), 'Нет');
            assert.equal(format.format(value_2), 'Да');
        });

        it('should format collection', function () {
            //Given
            var format = new BooleanFormat();
            //When
            var value = [true, true, false, true];
            format.setFalseText('Нет');
            format.setTrueText('Да');
            //Then
            assert.equal(format.format(value), 'Да, Да, Нет, Да');
        });

    });


});
describe('DateTimeFormat', function () {

    describe('format', function () {
        it('successful build', function () {
            //Given
            var builder = new DateTimeFormatBuilder();
            //When
            var format = builder.build(null, {metadata: {}});
            //Then
            assert.isFunction(format.format);
            assert.equal(format.getFormat(), 'G');
        });

        it('should format year', function () {
            //Given
            var formattingFull = new DateTimeFormat('yyyy');
            var formattingShort = new DateTimeFormat('yy');
            var formattingTooShort = new DateTimeFormat('%y');

            //When
            var date = new Date("21 May 1908 10:12");

            //Then
            assert.equal(formattingFull.format(date), '1908');
            assert.equal(formattingShort.format(date), '08');
            assert.equal(formattingTooShort.format(date), '8');
        });

        it('should format month', function () {
            //Given
            var formattingFull = new DateTimeFormat('MMMM'),
                formattingAbbr = new DateTimeFormat('MMM'),
                formattingIndex = new DateTimeFormat('MM'),
                formattingShortIndex = new DateTimeFormat('%M'),
                enCulture = new Culture('en-US');

            //When
            var date = new Date("21 January 1908 10:12");

            //Then
            assert.equal(formattingFull.format(date), 'Январь');
            assert.equal(formattingAbbr.format(date), 'янв');
            assert.equal(formattingIndex.format(date), '01');
            assert.equal(formattingShortIndex.format(date), '1');

            assert.equal(formattingFull.format(date, enCulture), 'January');
        });

        it('should format day', function () {
            //Given
            var formattingFull = new DateTimeFormat('dddd'),
                formattingAbbr = new DateTimeFormat('ddd'),
                formattingIndex = new DateTimeFormat('dd'),
                formattingShortIndex = new DateTimeFormat('%d'),
                enCulture = new Culture('en-US');

            //When
            var date = new Date("2 January 1908 10:12");

            //Then
            assert.equal(formattingFull.format(date), 'среда');
            assert.equal(formattingAbbr.format(date), 'Ср');
            assert.equal(formattingIndex.format(date), '02');
            assert.equal(formattingShortIndex.format(date), '2');

            assert.equal(formattingFull.format(date, enCulture), 'Wednesday');
        });

        it('should format day', function () {
            //Given
            var formattingFull = new DateTimeFormat('HH'),
                formattingAbbr = new DateTimeFormat('%H'),
                formattingIndex = new DateTimeFormat('hh'),
                formattingShortIndex = new DateTimeFormat('%h');

            //When
            var date = new Date("2 January 1908 13:12");

            //Then
            assert.equal(formattingFull.format(date), '13');
            assert.equal(formattingAbbr.format(date), '13');
            assert.equal(formattingIndex.format(date), '01');
            assert.equal(formattingShortIndex.format(date), '1');
        });

        it('should format minutes', function () {
            //Given
            var formatting = new DateTimeFormat('mm'),
                formattingShort = new DateTimeFormat('%m');

            //When
            var date = new Date("2 January 1908 13:02");

            //Then
            assert.equal(formatting.format(date), '02');
            assert.equal(formattingShort.format(date), '2');
        });

        it('should format seconds', function () {
            //Given
            var formatting = new DateTimeFormat('ss'),
                formattingShort = new DateTimeFormat('%s');

            //When
            var date = new Date("2 January 1908 13:02:02");

            //Then
            assert.equal(formatting.format(date), '02');
            assert.equal(formattingShort.format(date), '2');
        });

        it('should format pm/am designator', function () {
            //Given
            var formatting = new DateTimeFormat('tt'),
                formattingShort = new DateTimeFormat('%t'),
                enCulture = new Culture('en-US');

            //When
            var datePM = new Date("2 January 1908 13:02");
            var dateAM = new Date("2 January 1908 11:02");

            //Then
            assert.equal(formatting.format(datePM, enCulture), 'PM');
            assert.equal(formatting.format(dateAM, enCulture), 'AM');
            assert.equal(formattingShort.format(dateAM, enCulture), 'A');
            assert.equal(formattingShort.format(dateAM), '');
        });

        it('should format pm/am designator', function () {
            //Given
            var formatting = new DateTimeFormat('zzz');

            //When
            var date = new Date("2 January 1908 13:02:00");

            //Then
            assert.equal(formatting.format(date), extractTimezoneOffset(date));
        });

        it('should format date and time separators', function () {
            //Given
            var formattingTime = new DateTimeFormat('12:23'),
                formattingDate = new DateTimeFormat('12/23'),
                enCulture = new Culture('en-US');

            //When
            var date = new Date("2 January 1908 13:02:00");

            //Then
            assert.equal(formattingTime.format(date), '12:23');
            assert.equal(formattingDate.format(date), '12.23');
            assert.equal(formattingDate.format(date, enCulture), '12/23');
        });

        it('escaping strings', function () {
            //Given
            var formatting1 = new DateTimeFormat('"HH"'),
                formatting2 = new DateTimeFormat("'HH'"),
                formatting3 = new DateTimeFormat('HH "HH"');

            //When
            var date = new Date("2 January 1908 13:12");

            //Then
            assert.equal(formatting1.format(date), 'HH');
            assert.equal(formatting2.format(date), 'HH');
            assert.equal(formatting3.format(date), '13 HH');
        });


        it('format by pattern f', function () {
            //Given
            var formatting = new DateTimeFormat('f'),
                enCulture = new Culture('en-US');

            //When
            var date = new Date("4 January 1908 13:12");

            //Then
            assert.equal(formatting.format(date), '04 Январь 1908 г. 13:12');
            assert.equal(formatting.format(date, enCulture), 'Friday, January 04, 1908 1:12 PM');
        });

        it('format by pattern g', function () {
            //Given
            var formatting = new DateTimeFormat('g'),
                enCulture = new Culture('en-US');

            //When
            var date = new Date("4 January 1908 13:12");

            //Then
            assert.equal(formatting.format(date), '04.01.1908 13:12');
            assert.equal(formatting.format(date, enCulture), '1/4/1908 1:12 PM');
        });

        it('format by pattern s', function () {
            //Given
            var formatting = new DateTimeFormat('s');

            //When
            var date = new Date("4 January 1908 13:12:01");

            //Then
            assert.equal(formatting.format(date), '1908-01-04T13:12:01');
        });

        it('format by pattern T', function () {
            //Given
            var formatting = new DateTimeFormat('T');

            //When
            var date = new Date("4 January 1908 13:12:01");

            //Then
            assert.equal(formatting.format(date), '13:12:01');
        });

        it('format by pattern H', function () {
            //Given
            var formatting = new DateTimeFormat('H');

            //When
            var date = new Date("4 January 1908 13:12:01");

            //Then
            assert.equal(formatting.format(date), '13');
        });

        it('format collection', function () {
            //Given
            var formatting = new DateTimeFormat('s');

            //When
            var date = [new Date("4 January 1908 13:12:1"), new Date("5 January 1908 13:12:1"), new Date("6 January 1908 13:12:1")];

            //Then
            assert.equal(formatting.format(date), '1908-01-04T13:12:01, 1908-01-05T13:12:01, 1908-01-06T13:12:01');
        });

        it('format collection t', function () {
            //Given
            var formatting = new DateTimeFormat('t');

            //When
            var date = [new Date("4 January 1908 13:12:1"), new Date("5 January 1908 13:02:1"), new Date("6 January 1908 13:12:1")];

            //Then
            assert.equal(formatting.format(date), '13:12, 13:02, 13:12');
        });

        function extractTimezoneOffset(date){
            var offset;
            date.toString().replace(/GMT([\s\S]{5})/, function(s, inner){
                offset = inner;
                return '';
            });
            offset = offset.split('');
            offset.splice(3, 0, ':');
            offset = offset.join('');
            return offset;
        }
    });
});
describe('NumberFormatting', function () {
    describe('format', function () {
        it('successful build', function () {
            //Given
            var builder = new NumberFormatBuilder();
            //When
            var format = builder.build(null, { metadata: {} });
            //Then
            assert.isFunction(format.format);
            assert.equal(format.getFormat(), 'n');
        });

        it('should format percent', function () {
            //Given
            var formatting_p = new NumberFormat('p');
            var formatting_p0 = new NumberFormat('p0');
            var formatting_p1 = new NumberFormat('p1');
            var enCulture = new Culture('en-US');

            //When
            var val = 123.4567;

            //Then
            assert.equal(formatting_p.format(val), '12 345,67%');
            assert.equal(formatting_p0.format(val), '12 346%');
            assert.equal(formatting_p1.format(val), '12 345,7%');

            assert.equal(formatting_p1.format(val, enCulture), '12,345.7 %');
        });

        it('should format number', function () {
            //Given
            var formatting_n = new NumberFormat('n');
            var formatting_n0 = new NumberFormat('n0');
            var formatting_n1 = new NumberFormat('n1');
            var enCulture = new Culture('en-US');

            //When
            var val = 1234.5678;

            //Then
            assert.equal(formatting_n.format(val), '1 234,57');
            assert.equal(formatting_n0.format(val), '1 235');
            assert.equal(formatting_n1.format(val), '1 234,6');

            assert.equal(formatting_n1.format(val, enCulture), '1,234.6');
        });

        it('should format currency', function () {
            //Given
            var formatting_c = new NumberFormat('c');
            var formatting_c0 = new NumberFormat('c0');
            var formatting_c1 = new NumberFormat('c1');
            var enCulture = new Culture('en-US');

            //When
            var val = 1234.5678;

            //Then
            assert.equal(formatting_c.format(val), '1 234,57р.');
            assert.equal(formatting_c0.format(val), '1 235р.');
            assert.equal(formatting_c1.format(val), '1 234,6р.');

            assert.equal(formatting_c1.format(val, enCulture), '$1,234.6');
        });

        it('should format collections', function () {
            //Given
            var formatting_c = new NumberFormat('c');
            var formatting_c0 = new NumberFormat('c0');
            var formatting_c1 = new NumberFormat('c1');
            var enCulture = new Culture('en-US');

            //When
            var val = [1234.5678, 2901.2345, 2678.9012];

            //Then
            assert.equal(formatting_c.format(val), '1 234,57р., 2 901,23р., 2 678,90р.');
            assert.equal(formatting_c0.format(val), '1 235р., 2 901р., 2 679р.');
            assert.equal(formatting_c1.format(val), '1 234,6р., 2 901,2р., 2 678,9р.');

            assert.equal(formatting_c1.format(val, enCulture), '$1,234.6, $2,901.2, $2,678.9');
        });

    });

});
describe('ObjectFormat', function () {
    describe('format', function () {

        it('successful build', function () {
            //Given
            var metadata = {Format: '{}'};
            var builder = new ObjectFormatBuilder();
            //When
            var format = builder.build(null, { metadata: metadata } );
            //Then
            assert.isFunction(format.format);
            assert.equal(format.getFormat(), '{}');
        });

        it('should format simple data type ', function () {
            //Given
            var formatter_1 = new ObjectFormat("Hello, {}!");
            var formatter_2 = new ObjectFormat("Birth date: {:d}");
            var formatter_3 = new ObjectFormat("Birth time: {:T}");
            var formatter_4 = new ObjectFormat("Weight: {:n2} kg");
            var enCulture = new Culture('en-US');

            //When
            var value_1 = 'Ivan';
            var value_2 = new Date("4 January 1908 12:34:56");
            var value_3 = new Date("4 January 1908 12:34:56");
            var value_4 = 123.456;

            //Then
            assert.equal(formatter_1.format(value_1, enCulture), 'Hello, Ivan!');
            assert.equal(formatter_2.format(value_2, enCulture), 'Birth date: 1/4/1908');
            assert.equal(formatter_3.format(value_3, enCulture), 'Birth time: 12:34:56 PM');
            assert.equal(formatter_4.format(value_4, enCulture), 'Weight: 123.46 kg');
            assert.equal(formatter_4.format(value_4), 'Weight: 123,46 kg');
        });

        it('should format complex data type ', function () {
            //Given
            var formatter_1 = new ObjectFormat("Hello, {FirstName} {MiddleName}!");
            var formatter_2 = new ObjectFormat("Birth date: {BirthDate:d}");
            var formatter_3 = new ObjectFormat("Birth time: {BirthDate:T}");
            var formatter_4 = new ObjectFormat("Weight: {Weight:n2} kg");
            var enCulture = new Culture('en-US');

            //When
            var value_1 = { FirstName: "Ivan", MiddleName: "Ivanovich" };
            var value_2 = { BirthDate: new Date("4 January 1908 12:34:56") };
            var value_3 = { BirthDate: new Date("4 January 1908 12:34:56") };
            var value_4 = { Weight: 123.456 };

            //Then
            assert.equal(formatter_1.format(value_1, enCulture), "Hello, Ivan Ivanovich!");
            assert.equal(formatter_2.format(value_2, enCulture), "Birth date: 1/4/1908");
            assert.equal(formatter_3.format(value_3, enCulture), "Birth time: 12:34:56 PM");
            assert.equal(formatter_4.format(value_4, enCulture), "Weight: 123.46 kg" );
        });

        it('should format collection ', function () {
            //Given
            var formatter_1 = new ObjectFormat("Hello, {FirstName} {MiddleName}!");
            var formatter_2 = new ObjectFormat("Birth date: {BirthDate:d}");
            var formatter_3 = new ObjectFormat("Birth time: {BirthDate:T}");
            var formatter_4 = new ObjectFormat("Weight: {Weight:n2} kg");
            var enCulture = new Culture('en-US');

            //When
            var value_1 = [{ FirstName: "Ivan", MiddleName: "Ivanovich" }, { FirstName: "Petr", MiddleName: "Petrov" }];
            var value_2 = { BirthDate: new Date("4 January 1908 12:34:56") };
            var value_3 = { BirthDate: new Date("4 January 1908 12:34:56") };
            var value_4 = [{ Weight: 123.456 }, { Weight: 789.012 }];

            //Then
            assert.equal(formatter_1.format(value_1, enCulture), "Hello, Ivan Ivanovich!, Hello, Petr Petrov!");
            assert.equal(formatter_2.format(value_2, enCulture), "Birth date: 1/4/1908");
            assert.equal(formatter_3.format(value_3, enCulture), "Birth time: 12:34:56 PM");
            assert.equal(formatter_4.format(value_4, enCulture), "Weight: 123.46 kg, Weight: 789.01 kg" );
        });

        it('should format when value is undefined', function () {
            //Given
            var formatter = new ObjectFormat("Hello, {FirstName} {MiddleName}!");
            //When
            //Then
            assert.equal(formatter.format(), "Hello,  !");
        });

        it('should format when value is null', function () {
            //Given
            var formatter = new ObjectFormat("Hello, {FirstName} {MiddleName}!");
            //When
            //Then
            assert.equal(formatter.format(null), "Hello,  !");
        });
    });

});
describe('LinkView', function () {

    describe('setOpenMode', function () {
        it('should set openMode', function () {
            //Given
            var view = new LinkView();

            //When
            view.setOpenMode('Dialog');

            //Then
            assert.equal(view.getOpenMode(), 'Dialog');
        });

        it('should set openMode Default by default', function () {
            //Given
            var view = new LinkView();

            //Then
            assert.equal(view.getOpenMode(), 'Default');
        });

        it('should set openMode Default if no mode passed', function () {
            //Given
            var view = new LinkView();

            //When
            view.setOpenMode(null);

            //Then
            assert.equal(view.getOpenMode(), 'Default');
        });
    });
});
describe('MetadataViewBuilder', function () {

    /*var builder = new ApplicationBuilder();

    window.providerRegister.register('MetadataDataSource', function (metadataValue) {
        return {
            "getViewMetadata": function () {
                return metadata;
            }
        };
    });

    var metadata = {
            "DataSources": [

                {
                    "DocumentDataSource": {
                        "Name": 'PatientDataSource',
                        "ConfigId": 'ReceivingRoom',
                        "DocumentId": 'HospitalizationRefusal'
                    }
                }
            ],
            "OpenMode": "Application",
            "ConfigId": 'ReceivingRoom',
            "DocumentId": 'HospitalizationRefusal',
            "ViewType": 'ListView',
            "MetadataName": 'HospitalizationRefusalListView',
            //"Parameters": [
            //    {
            //        "Name" : 'Param1',
            //        "Value" : {
            //            "PropertyBinding": {
            //                "DataSource": 'PatientDataSource',
            //                "Property": 'LastName'
            //            }
            //        }
            //    }
            //],
            "LayoutPanel" : {

            }
    };

    it('should build exists view', function () {

        var applicationBuilder = new ApplicationBuilder();
        var builder = new MetadataViewBuilder();
        var view = builder.build(null, {builder: applicationBuilder, view: {}, metadata: metadata});

        applicationBuilder.appView = view;
        applicationBuilder.appView.createView(function(view){
            //assert.isNotNull(view.getParameter('Param1'));
            assert.isNotNull(view.getDataSource('PatientDataSource'));
        });
    });*/
});


describe('MessageBus', function () {
    var messageBus;

    beforeEach(function () {
        messageBus = new MessageBus();
    });

    describe('send', function () {
        it('should send', function () {
            var flag = 0;

            messageBus.subscribe(messageTypes.onViewOpened.name, function (context, obj) {
                flag += obj.value;
            });
            messageBus.subscribe(messageTypes.onViewOpened.name, function (context, obj) {
                flag += obj.value;
            });
            messageBus.subscribe(messageTypes.onViewOpened.name, function (context, obj) {
                flag += obj.value;
            });

            messageBus.send(messageTypes.onViewOpened.name, 2);

            assert.equal(flag, 6);
        });

        it('should deliver message to valid subscribers', function () {
            var flag1 = 0,
                flag2 = 0;

            messageBus.subscribe(messageTypes.onViewOpened.name, function (context, obj) {
                flag1 += obj.value;
            });
            messageBus.subscribe(messageTypes.onViewOpened.name, function (context, obj) {
                flag1 += obj.value;
            });
            messageBus.subscribe(messageTypes.onViewClosed.name, function (context, obj) {
                flag2 += obj.value;
            });
            messageBus.subscribe(messageTypes.onViewClosed.name, function (context, obj) {
                flag2 += obj.value;
            });

            messageBus.send(messageTypes.onViewOpened.name, 1);
            messageBus.send(messageTypes.onViewClosed.name, 2);

            assert.equal(flag1, 2, 'first handler flag is right');
            assert.equal(flag2, 4, 'second handler flag is right');
        });
    });
});
describe('ScriptExecutor', function () {
    var builder;
    beforeEach(function () {
        builder = new ScriptBuilder();
    });

    it('should build script handler', function () {

        var metadata = {
            Name: "Name",
            Body: "return 5;"
        };

        var func = builder.build(null, {metadata: metadata});

        assert.equal(func.call(), 5);
    });

    it('should pass arguments to handler', function () {

        var metadata = {
            Name: "Name",
            Body: "return [context,args].join(':');"
        };

        var func = builder.build(null, {metadata: metadata});

        assert.equal(func.call(undefined, "Context", "Args"), "Context:Args");
    });
});
describe('ScriptExecutor', function () {

    var builder = new ApplicationBuilder();

    window.providerRegister.register('MetadataDataSource', function (metadataValue) {
        return {
            "getViewMetadata": function () {
                return metadata;
            }
        };
    });

    var metadata = {
        "Scripts" :[
            {
                "Name" : "OpenViewScript",
                "Body" : "context.Controls['TextBox1'].setText('Hello world from script!');"
            },
            {
                "Name" : "TestRunScript",
                "Body" : "context.TestValue = args['test'];"
            }
        ],
        "DataSources": [

            {
                "DocumentDataSource": {
                    "Name": 'PatientDataSource',
                    "ConfigId": 'ReceivingRoom',
                    "DocumentId": 'HospitalizationRefusal'
                }
            },
            {
                "DocumentDataSource" : {
                    "Name" : 'ClassifierDataSource',
                    "ConfigId" : 'ClassifierStorage',
                    "DocumentId" : 'SomeClassifier'
                }
            }
        ],
        "OpenMode": "Application",
        "ConfigId": 'ReceivingRoom',
        "DocumentId": 'HospitalizationRefusal',
        "ViewType": 'ListView',
        "MetadataName": 'HospitalizationRefusalListView',
        //"Parameters": [
        //    {
        //        "Name" : 'Param1'
        //    }
        //],
        "LayoutPanel" : {
            "StackPanel": {
                "Name": "MainViewPanel",
                "Items": [
                    {
                        "TextBox": {
                            "Name": "TextBox1",
                            "Multiline": true
                        }
                    },
                    {
                        "TextBox": {
                            "Name": "TextBox2"
                        }
                    },
                    {
                        "ComboBox": {
                            "Name": "ComboBox1",
                            "DisplayProperty": "",
                            "ValueProperty": "",
                            "MultiSelect": true,
                            "ShowClear": true,
                            "Value" : {
                                "DataSource" : "PatientDataSource",
                                "Property" : "LastName"
                            }
                        }
                    }
                ]
            }
        }
    };

//    it('should create script context for opened view', function (done) {
//
//        var linkView = new LinkView(null, function (resultCallback) {
//            var builder = new ApplicationBuilder();
//            var view = builder.buildType(fakeView(), 'View', metadata);
//            resultCallback(view);
//        });
//        linkView.setOpenMode('Application');
//
//        linkView.createView(function(view){
//
//            assert.isNotNull(view.getContext());
//            assert.isNotNull(view.getContext().DataSources['PatientDataSource']);
//            assert.isNotNull(view.getContext().DataSources['ClassifierDataSource']);
//            //assert.isNotNull(view.getContext().Parameters['Param1']);
//            //assert.equal(view.getContext().Parameters['Param1'].getValue(),'1');
//            assert.isNotNull(view.getContext().Controls['TextBox1']);
//            assert.isNotNull(view.getContext().Controls['TextBox2']);
//            assert.isNotNull(view.getContext().Controls['ComboBox1']);
//
//            var textBox1 = view.getContext().Controls['TextBox1'];
//
//            textBox1.setText('Hello world!');
//            assert.equal(textBox1.getText(),'Hello world!');
//
//            var dataSource = view.getContext().DataSources["PatientDataSource"];
//            assert.equal(dataSource.getName(),"PatientDataSource");
//
//            done();
//        });
//    });
//
//    it('should invoke script from ScriptExecutor', function(done){
//
//        var linkView = new LinkView(null, function (resultCallback) {
//            var builder = new ApplicationBuilder();
//            var view = builder.buildType(fakeView(), 'View', metadata);
//            resultCallback(view);
//        });
//        linkView.setOpenMode('Application');
//
//        linkView.createView(function(view){
//
//            var scriptExecutor = new ScriptExecutor(view);
//            scriptExecutor.executeScript('OpenViewScript');
//
//            var textBox1 = view.getContext().Controls["TextBox1"];
//            assert.equal(textBox1.getText(),'Hello world from script!');
//
//            var args = {
//                "test" : 1
//            };
//
//            var context = view.getContext();
//            context.Scripts["TestRunScript"].Run(context,args);
//
//            assert.equal(context.TestValue,1);
//
//            done();
//
//        });
//
//    });


});
function StaticFakeDataProvider() {}


_.extend(StaticFakeDataProvider.prototype, {
    items: [
        {
            "Id": '1',
            "FirstName": "Иван",
            "LastName": "Иванов"
        },
        {
            "Id": '2',
            "FirstName": "Петр",
            "LastName": "Петров"
        },
        {
            "Id": '3',
            "FirstName": "Иван1",
            "LastName": "Иванов1"
        },
        {
            "Id": '4',
            "FirstName": "Петр2",
            "LastName": "Петров2"
        },
        {
            "Id": '5',
            "FirstName": "Иван3",
            "LastName": "Иванов3"
        },
        {
            "Id": '6',
            "FirstName": "Петр4",
            "LastName": "Петров5"
        },
        {
            "Id": '10',
            "FirstName": "Анна",
            "LastName": "Сергеева"

        }
    ],

    getItems: function(criteriaList, pageNumber, pageSize, sorting, resultCallback){
        var result = _.clone(this.items);
        setTimeout(function(){
            resultCallback(result);
        },100);
    },

    createLocalItem: function () {
        var maxId = _.chain(this.items)
            .map(function(item){ return parseInt(item.Id); })
            .max()
            .value();

        return {
            "Id": maxId + 1
        };
    },

    saveItem: function (value, resultCallback, warnings) {

        var itemIndex = _.findIndex(this.items, function(item) {
            return item.Id === value.Id;
        });

        if (itemIndex !== -1) {
            this.items[itemIndex] = value;
        }
        else {
            this.items.push(value);
        }

        var result = _.clone(this.items);
        setTimeout(function(){
            resultCallback(result);
        },90);
    },

    setCreateAction: function(){},
    setUpdateAction: function(){},
    setReadAction: function(){},
    setDeleteAction: function(){},
    setConfigId: function(){},
    setDocumentId: function(){}
});
describe("Collection", function () {

    var items;
    var objects;
    var itemsCollections;
    var objectsCollections;
    var idProperty = 'id';



    function bindAllEvents(collection) {
        var events = 'onAdd,onReplace,onRemove,onMove,onReset,onChange'.split(',');
        var handlers = [];

        events.forEach(function (event) {

            collection[event](function (context, argument) {
                handlers.push(event);
            });
        });

        return {
            checkEvent: function (event, count) {
                if (typeof count === 'undefined') {
                    count = 1;
                }
                return handlers.filter(function (name) {
                    return name === event;
                }).length === count;
            },
            reset: function () {
                handlers = [];
            }
        }
    }

    function getArray(length, value) {
        value = value || null;

        switch (length) {
            case 0:
                return [];
            case 1:
                return [null];
            default:
                return Array(length).join(',').split(',').map(function () {
                    return value;
                });
        }
    }


    beforeEach(function () {
        var COUNT = 5;

        items = [];
        for (var i = 0; i < COUNT; i = i + 1) {
            items.push(getArray(i).map(function (itm, idx) {
                return 'Item ' + idx;
            }));
        }
        itemsCollections = items.map(function (items) {
            return new Collection(items);
        });
    });

    beforeEach(function () {
        var COUNT = 5;

        objects = [];
        for (var i = 0; i < COUNT; i = i + 1) {
            objects.push(getArray(i).map(function (itm, idx) {
                return {id: idx + 1, title: idx};
            }));
        }
        objectsCollections = objects.map(function (objects) {
            return new Collection(objects, idProperty);
        });
    });

    describe("length", function () {

        it("should return 0", function () {
            // When
            var collection = new Collection();
            // Then
            assert.strictEqual(collection.length, 0);
        });

        it("should return length items collection", function () {
            // When
            // Then
            for (var i = 0; i < itemsCollections.length; i++) {
                assert.strictEqual(itemsCollections[i].length, items[i].length);
            }
        });

        it("should return length objects collection", function () {
            // When
            // Then
            for (var i = 0; i < objectsCollections.length; i++) {
                assert.strictEqual(objectsCollections[i].length, objects[i].length);
            }
        });

    });

    describe("idProperty", function () {
        it("should return undefined", function () {
            // When
            var collection = new Collection();
            // Then
            assert.isUndefined(collection.idProperty);
        });

        it("should return idProperty", function () {
            // When
            var collection = new Collection([], idProperty);
            // Then
            assert.equal(collection.idProperty, idProperty);
        });

    });


    describe("comparator", function () {
        it("should has comparator", function () {
            var
                comparator = function (a, b) {
                    return a - b
                },
                collection = new Collection([], null, comparator);

            assert.isFunction(collection.comparator);
            assert.equal(collection.comparator, comparator);
        });
    });

    describe("size()", function () {
        it("should return size items collection", function () {
            // When
            // Then
            for (var i = 0; i < itemsCollections.length; i++) {
                assert.strictEqual(itemsCollections[i].size(), items[i].length);
            }
        });

        it("should return size objects collection", function () {
            // When
            // Then
            for (var i = 0; i < objectsCollections.length; i++) {
                assert.strictEqual(objectsCollections[i].size(), objects[i].length);
            }
        });
    });


    describe("push()", function () {
        it("should add item", function () {
            //When
            var
                changed,
                collection = new Collection(),
                handlers = bindAllEvents(collection);

            changed = collection.push('A');
            assert.isTrue(changed);
            assert.equal(String(collection), '"A"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.push('B');
            assert.isTrue(changed);
            assert.equal(String(collection), '"A","B"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.push('C');
            assert.isTrue(changed);
            assert.equal(String(collection), '"A","B","C"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));
        });

        it("should add objects", function () {
            //When
            var
                objects = [
                    {id: 1, title: 'One'},
                    {id: 2, title: 'Two'},
                    {id: 3, title: 'Three'}
                ],
                changed,
                collection = new Collection([], idProperty),
                handlers = bindAllEvents(collection);

            changed = collection.push(objects[0]);
            assert.isTrue(changed, 'One changed');
            assert.equal(String(collection), '{"id":1,"title":"One"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.push(objects[1]);
            assert.isTrue(changed, 'Two changed');
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.push(objects[2]);
            assert.isTrue(changed, 'Three changed');
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"},{"id":3,"title":"Three"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));
        });

    });

    describe("add()", function () {
        it("should add item", function () {
            //When
            var
                changed,
                collection = new Collection(),
                handlers = bindAllEvents(collection);

            changed = collection.add('A');
            assert.isTrue(changed);
            assert.equal(String(collection), '"A"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.add('B');
            assert.isTrue(changed);
            assert.equal(String(collection), '"A","B"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.add('C');
            assert.isTrue(changed);
            assert.equal(String(collection), '"A","B","C"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));
        });

        it("should add objects", function () {
            //When
            var
                objects = [
                    {id: 1, title: 'One'},
                    {id: 2, title: 'Two'},
                    {id: 3, title: 'Three'}
                ],
                changed,
                collection = new Collection([], idProperty),
                handlers = bindAllEvents(collection);

            changed = collection.add(objects[0]);
            assert.isTrue(changed, 'One changed');
            assert.equal(String(collection), '{"id":1,"title":"One"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.add(objects[1]);
            assert.isTrue(changed, 'Two changed');
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.add(objects[2]);
            assert.isTrue(changed, 'Three changed');
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"},{"id":3,"title":"Three"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));
        });
    });

    describe("addAll()", function () {
        it("should add all item", function () {
            //When
            var
                changed,
                collection = new Collection(),
                handlers = bindAllEvents(collection);

            changed = collection.addAll(['A', 'B']);
            assert.isTrue(changed);
            assert.equal(String(collection), '"A","B"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.addAll(['C', 'D']);
            assert.isTrue(changed);
            assert.equal(String(collection), '"A","B","C","D"');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));
        });

        it("should add all objects", function () {
            //When
            var
                changed,
                collection = new Collection([], 'id'),
                handlers = bindAllEvents(collection);

            changed = collection.addAll([{id: 1, title: 'One'}, {id: 2, title: 'Two'}]);
            assert.isTrue(changed);
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));

            handlers.reset();
            changed = collection.addAll([{id: 3, title: 'Three'}, {id: 4, title: 'Four'}]);
            assert.isTrue(changed);
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"},{"id":3,"title":"Three"},{"id":4,"title":"Four"}');
            assert.isTrue(handlers.checkEvent('onAdd'));
            assert.isTrue(handlers.checkEvent('onChange'));
        });
    });

    describe("insert()", function () {
        it("should insert item", function () {
            //When
            var
                changed,
                collection = new Collection(),
                handlers = bindAllEvents(collection);

            changed = collection.insert(0, 'A');
            assert.isTrue(changed, 'Changed on insert "A"');
            assert.equal(String(collection), '"A"');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.insert(0, 'B');
            assert.isTrue(changed, 'Changed on insert "B"');
            assert.equal(String(collection), '"B","A"');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.insert(0, 'C');
            assert.isTrue(changed, 'Changed on insert "C"');
            assert.equal(String(collection), '"C","B","A"');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

        it("should insert objects", function () {
            //When
            var
                changed,
                collection = new Collection([], idProperty),
                handlers = bindAllEvents(collection);

            changed = collection.insert(0, {id: 1, title: 'One'});
            assert.isTrue(changed, 'One changed');
            assert.equal(String(collection), '{"id":1,"title":"One"}');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.insert(0, {id: 2, title: 'Two'});
            assert.isTrue(changed, 'Two changed');
            assert.equal(String(collection), '{"id":2,"title":"Two"},{"id":1,"title":"One"}');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.insert(0, {id: 3, title: 'Three'});
            assert.isTrue(changed, 'Three changed');
            assert.equal(String(collection), '{"id":3,"title":"Three"},{"id":2,"title":"Two"},{"id":1,"title":"One"}');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });
    });

    describe("insertAll()", function () {

        it("should insert all item", function () {
            //When
            var
                changed,
                collection = new Collection(),
                handlers = bindAllEvents(collection);

            changed = collection.insertAll(0, ['A', 'B']);
            assert.isTrue(changed, 'Changed on insert ["A", "B"]');
            assert.equal(String(collection), '"A","B"');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.insertAll(0, ['C', 'D']);
            assert.isTrue(changed, 'Changed on insert ["C", "D"');
            assert.equal(String(collection), '"C","D","A","B"');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

        it("should insert all objects", function () {
            //When
            var
                changed,
                collection = new Collection([], 'id'),
                handlers = bindAllEvents(collection);

            changed = collection.insertAll(0, [{id: 1, title: 'One'}, {id: 2, title: 'Two'}]);
            assert.isTrue(changed, 'Changed step 1');
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"}');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.insertAll(0, [{id: 3, title: 'Three'}, {id: 4, title: 'Four'}]);
            assert.isTrue(changed, 'Changed step 2');
            assert.equal(String(collection), '{"id":3,"title":"Three"},{"id":4,"title":"Four"},{"id":1,"title":"One"},{"id":2,"title":"Two"}');
            assert.isTrue(handlers.checkEvent('onAdd'), 'onAdd event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });
    });

    describe("reset()", function () {

        it("should reset item", function () {
            //When
            var
                changed,
                collection = new Collection(),
                handlers = bindAllEvents(collection);

            changed = collection.reset(['A', 'B']);
            assert.isTrue(changed, 'Changed on step 1');
            assert.equal(String(collection), '"A","B"');
            assert.isTrue(handlers.checkEvent('onReset'), 'onReset event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.reset(['C', 'D']);
            assert.isTrue(changed, 'Changed on step 2');
            assert.equal(String(collection), '"C","D"');
            assert.isTrue(handlers.checkEvent('onReset'), 'onReset event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.reset(['C', 'D']);
            assert.isFalse(changed, 'Not changed on step 3');
            assert.equal(String(collection), '"C","D"');
            assert.isFalse(handlers.checkEvent('onReset'), 'onReset event');
            assert.isFalse(handlers.checkEvent('onChange'), 'onChange event');
        });

        it("should reset objects", function () {
            //When
            var
                changed,
                collection = new Collection([], 'id'),
                handlers = bindAllEvents(collection);

            changed = collection.reset([{id: 1, title: 'One'}, {id: 2, title: 'Two'}]);
            assert.isTrue(changed, 'Changed step 1');
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":2,"title":"Two"}');
            assert.isTrue(handlers.checkEvent('onReset'), 'onReset event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.reset([{id: 3, title: 'Three'}, {id: 4, title: 'Four'}]);
            assert.isTrue(changed, 'Changed step 2');
            assert.equal(String(collection), '{"id":3,"title":"Three"},{"id":4,"title":"Four"}');
            assert.isTrue(handlers.checkEvent('onReset'), 'onReset event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

    });

    describe("set()", function () {
        it("should set items", function () {
            var collection = new Collection(['Apple', 'Banana', 'Pineapple']),
                handlers = bindAllEvents(collection);

            assert.deepEqual(collection.toArray(), ['Apple', 'Banana', 'Pineapple']);

            collection.set(['Apple', 'Melon']);

            assert.deepEqual(collection.toArray(), ['Apple', 'Melon']);
            assert.isTrue(handlers.checkEvent('onReset'), 'onReset event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

        it("should set objects", function () {
            var collection = new Collection([
                {key: 1, value: 'Apple'},
                {key: 2, value: 'Banana'},
                {key: 3, value: 'Pineapple'}
            ], 'key'),
                handlers = bindAllEvents(collection);

            assert.deepEqual(collection.toArray().map(function (item) {
                return item.value;
            }), ['Apple', 'Banana', 'Pineapple']);

            collection.set([
                {key: 1, value: 'Apple'},
                {key: 2, value: 'Melon'}
            ]);

            assert.deepEqual(collection.toArray().map(function (item) {
                return item.value;
            }), ['Apple', 'Melon']);
            assert.isTrue(handlers.checkEvent('onReset'), 'onReset event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

    });

    describe("replace()", function () {
        it("should replace item", function () {
            //When
            var collection = new Collection(['A', 'B', 'C']);
            var handlers = bindAllEvents(collection);

            var changed = collection.replace('C', 'D');
            //Then
            assert.isTrue(changed);
            assert.equal(String(collection), '"A","B","D"');
            assert.isTrue(handlers.checkEvent('onReplace'), 'onReplace event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

        it("should replace object", function () {
            //When
            var collection = new Collection([{id: 1, title: "A"}, {id: 2, title: "B"}], 'id');
            var handlers = bindAllEvents(collection);
            var changed = collection.replace({id: 2, title: "B"}, {id: 3, title: "C"});

            assert.isTrue(changed);
            assert.equal(String(collection), '{"id":1,"title":"A"},{"id":3,"title":"C"}');
            assert.isTrue(handlers.checkEvent('onReplace'), 'onReplace event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        })
    });

    describe("pop()", function () {

        it("should pop item", function () {
            //When
            var items = ['A', 'B', 'C'],
                collection = new Collection(['A', 'B', 'C']),
                handlers = bindAllEvents(collection);

            var item2 = collection.pop(); // 'C'
            var item1 = collection.pop(); // 'B'
            var item0 = collection.pop(); // 'A

            //Then
            assert.equal(item2, items[2]);
            assert.equal(item1, items[1]);
            assert.equal(item0, items[0]);
            assert.isTrue(handlers.checkEvent('onRemove', 3), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 3), 'onChange event');
        });

        it("should pop object", function () {
            //When
            var objects = [
                    {id: 1, title: 'One'},
                    {id: 2, title: 'Two'},
                    {id: 3, title: 'Three'}
                ],
                collection = new Collection(objects, 'id');

            //Then
            while (collection.length > 0) {
                assert.equal(collection.pop(), objects.pop());
            }
        });

    });

    describe("remove()", function () {

        it("should remove item", function () {
            var
                collection = new Collection(['A', 'B', 'C']),
                handlers = bindAllEvents(collection),
                change;

            change = collection.remove('B'); // [ 'A', 'C' ]
            assert.equal('"A","C"', String(collection));
            assert.isTrue(change);

            change = collection.remove('A'); // [ 'C' ]
            assert.equal('"C"', String(collection));
            assert.isTrue(change);

            change = collection.remove('C'); // [ ]
            assert.equal(collection.length, 0);
            assert.isTrue(change);

            assert.isTrue(handlers.checkEvent('onRemove', 3), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 3), 'onChange event');
        });

        it("should remove object", function () {
            var collection = new Collection([
                {id: 1, title: "One"},
                {id: 2, title: "Two"},
                {id: 3, title: "Three"}
            ], 'id'), change,
                handlers = bindAllEvents(collection);

            change = collection.remove({id: 2, title: "Two"});
            assert.isTrue(change);
            assert.equal(String(collection), '{"id":1,"title":"One"},{"id":3,"title":"Three"}');

            change = collection.remove({id: 1, title: "One"});
            assert.isTrue(change);
            assert.equal(String(collection), '{"id":3,"title":"Three"}');

            change = collection.remove({id: 3, title: "Three"});
            assert.isTrue(change);
            assert.equal(collection.length, 0);

            assert.isTrue(handlers.checkEvent('onRemove', 3), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 3), 'onChange event');
        });

    });

    describe("removeById()", function () {

        it("should remove object by id", function () {
            var collection = new Collection([
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'}
            ], 'key'),
                handlers = bindAllEvents(collection),
                changed;

            changed = collection.removeById(2);
            assert.equal(String(collection), '{"key":1,"value":"A"},{"key":3,"value":"C"}');
            assert.isTrue(changed, 'deleted 2');

            changed = collection.removeById(1);
            assert.equal(String(collection), '{"key":3,"value":"C"}');
            assert.isTrue(changed, 'deleted 1');

            changed = collection.removeById(3);
            assert.equal(collection.length, 0);
            assert.isTrue(changed, 'deleted 3');

            assert.isTrue(handlers.checkEvent('onRemove', 3), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 3), 'onChange event');
        });

    });

    describe("removeAt()", function () {

        it("should remove item by index", function () {
            var collection = new Collection(['A', 'B', 'C']),
                handlers = bindAllEvents(collection);

            assert.isTrue(collection.removeAt(1));
            assert.deepEqual(collection.toArray(), ['A', 'C']);

            assert.isTrue(collection.removeAt(0));
            assert.deepEqual(collection.toArray(), ['C']);

            assert.isTrue(collection.removeAt(0));
            assert.deepEqual(collection.toArray(), []);

            assert.isTrue(handlers.checkEvent('onRemove', 3), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 3), 'onChange event');
        });

        it("should remove object by index", function () {
            var collection = new Collection([
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'}
            ], 'key'),
                handlers = bindAllEvents(collection),
                changed;

            assert.isTrue(collection.removeAt(1));
            assert.deepEqual(collection.toArray(), [
                {key: 1, value: 'A'},
                {key: 3, value: 'C'}
            ]);

            assert.isTrue(collection.removeAt(0));
            assert.deepEqual(collection.toArray(), [
                {key: 3, value: 'C'}
            ]);

            assert.isTrue(collection.removeAt(0));
            assert.deepEqual(collection.toArray(), []);

            assert.isTrue(handlers.checkEvent('onRemove', 3), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 3), 'onChange event');
        });

    });

    describe("removeAll()", function () {
        it("should remove all item", function () {
            var collection = new Collection(['A', 'B', 'C', 'D']),
                handlers = bindAllEvents(collection);

            assert.isTrue(collection.removeAll(['A', 'C']));
            assert.deepEqual(collection.toArray(), ['B', 'D']);

            assert.isTrue(collection.removeAll(['B', 'D']));
            assert.deepEqual(collection.toArray(), []);

            assert.isTrue(handlers.checkEvent('onRemove', 2), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 2), 'onChange event');
        });

        it("should remove all objects", function () {
            var collection = new Collection([
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'},
                {key: 4, value: 'D'}
            ], 'key'),
                handlers = bindAllEvents(collection);

            assert.isTrue(collection.removeAll([
                {key: 1, value: 'A'},
                {key: 3, value: 'C'}]));

            assert.deepEqual(collection.toArray(), [
                {key: 2, value: 'B'},
                {key: 4, value: 'D'}]);

            assert.isTrue(collection.removeAll([
                {key: 2, value: 'B'},
                {key: 4, value: 'D'}]));
            assert.deepEqual(collection.toArray(), []);

            assert.isTrue(handlers.checkEvent('onRemove', 2), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 2), 'onChange event');
        });
    });

    describe("removeRange", function () {

        it("should remove range items", function () {
            var collection = new Collection(['A', 'B', 'C', 'D']),
                handlers = bindAllEvents(collection);

            assert.isTrue(collection.removeRange(1, 2));
            assert.deepEqual(collection.toArray(), ['A', 'D']);

            assert.isTrue(collection.removeRange(0));
            assert.deepEqual(collection.toArray(), []);

            assert.isTrue(handlers.checkEvent('onRemove', 2), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 2), 'onChange event');
        });

        it("should remove range items", function () {
            var collection = new Collection([
                null,
                null,
                {key: 1, value: 'A'}, {key: 2, value: 'B'}
            ], 'key'),
                handlers = bindAllEvents(collection);

            assert.isTrue(collection.removeRange(1, 2));
            assert.deepEqual(collection.toArray(), [null, {key: 2, value: 'B'}]);

            assert.isTrue(collection.removeRange(0));
            assert.deepEqual(collection.toArray(), []);

            assert.isTrue(handlers.checkEvent('onRemove', 2), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange', 2), 'onChange event');
        });

    });

    describe("removeEvery()", function () {

        it("should remove every item", function () {
            var
                changed,
                collection = new Collection([1, 10, 2, 20, 3, 30]),
                handlers = bindAllEvents(collection);

            changed = collection.removeEvery(function (item, index, collection) {
                return item >= 10;
            });
            assert.isTrue(changed);
            assert.deepEqual(collection.toArray(), [1, 2, 3]);
            assert.isTrue(handlers.checkEvent('onRemove'), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

        it("should remove every object", function () {
            var changed,
                collection = new Collection([
                    null,
                    null,
                    {key: 1, value: 'A'},
                    {key: 2, value: 'B'},
                    {key: 3, value: 'A'}
                ], 'key'),
                handlers = bindAllEvents(collection);

            changed = collection.removeEvery(function (item, index, collection) {
                return item && item.key % 2 === 1;
            });

            assert.isTrue(changed);
            assert.deepEqual(collection.toArray(), [
                null,
                null,
                {key: 2, value: 'B'}
            ]);
            assert.isTrue(handlers.checkEvent('onRemove'), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            changed = collection.removeEvery(function (item, index, collection) {
                return item === null;
            });

            assert.isTrue(changed);
            assert.deepEqual(collection.toArray(), [
                {key: 2, value: 'B'}
            ]);
            assert.isTrue(handlers.checkEvent('onRemove'), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });
    });

    describe("clear()", function () {
        it("should clear collection", function () {
            var collection = new Collection(['A', 'B', 'C']),
                handlers = bindAllEvents(collection);

            assert.isTrue(collection.clear());
            assert.equal(collection.length, 0);
            assert.isTrue(handlers.checkEvent('onRemove'), 'onRemove event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });
    });

    describe("getById()", function () {

        it("should get object by id", function () {
            var objects = [
                    {key: 1, value: 'A'},
                    {key: 2, value: 'B'},
                    {key: 3, value: 'C'}
                ],
                collection = new Collection(objects, 'key');

            assert.equal(collection.getById(1), objects[0]);
            assert.equal(collection.getById(2), objects[1]);
            assert.equal(collection.getById(3), objects[2]);
        });

        it("should return undefined on missing id", function () {
            var objects = [
                    {key: 1, value: 'A'},
                    {key: 2, value: 'B'},
                    {key: 3, value: 'C'}
                ],
                collection = new Collection(objects, 'key');

            assert.isTrue(typeof collection.getById(4) === 'undefined');
        });
    });

    describe("getByIndex()", function () {
        it("should return item by index", function () {
            var collection = new Collection(['A', 'B', 'C']);

            assert.equal(collection.getByIndex(0), 'A');
            assert.equal(collection.getByIndex(1), 'B');
            assert.equal(collection.getByIndex(2), 'C');
        });
    });

    describe("find()", function () {

        it("should return item", function () {
            //When
            var collection = new Collection([1, 3, 5, 6, 7, 9, 11, 12]);
            //Then
            var item = collection.find(function (item, index, collection) {
                return item % 2 === 0;
            });
            assert.equal(item, 6);
        });

        it("should return object", function () {
            //When
            var objects = [
                    {key: 1, value: 'A'},
                    {key: 3, value: 'B'},
                    {key: 5, value: 'C'},
                    {key: 6, value: 'A'},
                    {key: 7, value: 'B'},
                    {key: 9, value: 'C'},
                    {key: 11, value: 'B'},
                    {key: 12, value: 'C'}
                ],
                collection = new Collection(objects, 'key');
            //Then
            var item = collection.find(function (item, index, collection) {
                return item.key % 2 === 0;
            });
            assert.equal(item, objects[3]);
        });

    });

    describe("indexOf()", function () {

        it("should return index of item", function () {
            //When
            var collection = new Collection(['A', 'B', 'C', 'A', 'B', 'C']);
            //Then
            assert.equal(collection.indexOf('C'), 2);
            assert.equal(collection.indexOf('C', 3), 5);
            assert.equal(collection.indexOf('D'), -1);
        });

        it("should return index of object", function () {
            //When
            var collection = new Collection([
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'},
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'}
            ], 'key');

            //Then
            assert.equal(collection.indexOf({key: 3, value: 'C'}), 2);
            assert.equal(collection.indexOf({key: 3, value: 'C'}, 3), 5);
            assert.equal(collection.indexOf({key: 4, value: 'D'}), -1);
        })

    });

    describe("lastIndexOf()", function () {

        it("should return last index of item", function () {
            //When
            var collection = new Collection(['A', 'B', 'C', 'A', 'B', 'C']);
            //Then
            assert.equal(collection.lastIndexOf('C'), 5);
            assert.equal(collection.lastIndexOf('C', 4), 2);
            assert.equal(collection.lastIndexOf('D'), -1);
        });

        it("should return last index of object", function () {
            //When
            var collection = new Collection([
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'},
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'}
            ], 'key');
            //Then
            assert.equal(collection.lastIndexOf({key: 3, value: 'C'}), 5);
            assert.equal(collection.lastIndexOf({key: 3, value: 'C'}, 4), 2);
            assert.equal(collection.lastIndexOf({key: 4, value: 'D'}), -1);
        });
    });

    describe("findIndex()", function () {

        it("should return index of item", function () {
            //When
            var collection = new Collection([1, 3, 5, 6, 7, 9, 11, 12]);
            //Then
            var index = collection.findIndex(function (item, index, collection) {
                return item % 2 === 0;
            });
            assert.equal(index, 3);
        });

        it("should return index of object", function () {
            //When
            var collection = new Collection([
                {key: 1, value: 'A'},
                {key: 3, value: 'B'},
                {key: 5, value: 'C'},
                {key: 6, value: 'A'},
                {key: 7, value: 'B'},
                {key: 9, value: 'C'},
                {key: 11, value: 'B'},
                {key: 12, value: 'C'}
            ], 'key');
            //Then
            var index = collection.findIndex(function (item, index, collection) {
                return item.key % 2 === 0;
            });
            assert.equal(index, 3);
        });

    });

    describe("contains()", function () {

        it("should check item in collection", function () {
            //When
            var collection = new Collection(['A', 'B', 'C']);
            //Then
            assert.isTrue(collection.contains('A'), 'A');
            assert.isTrue(collection.contains('B'), 'B');
            assert.isTrue(collection.contains('C'), 'C');
            assert.isFalse(collection.contains('A', 1), 'A');
            assert.isFalse(collection.contains('B', 2), 'B');
            assert.isFalse(collection.contains('C', 3), 'C');
        });

        it("should check object in collection", function () {
            //When
            var collection = new Collection([
                {key: 1, value: 'A'},
                {key: 2, value: 'B'},
                {key: 3, value: 'C'}
            ], 'key');
            //Then
            assert.isTrue(collection.contains({key: 1, value: 'A'}), 'contains A');
            assert.isTrue(collection.contains({key: 2, value: 'B'}), 'contains B');
            assert.isTrue(collection.contains({key: 3, value: 'C'}), 'contains C');
            assert.isFalse(collection.contains({key: 1, value: 'A'}, 1), '!contains A');
            assert.isFalse(collection.contains({key: 2, value: 'B'}, 2), '!contains B');
            assert.isFalse(collection.contains({key: 3, value: 'C'}, 3), '!contains C');
        });
    });

    describe("every()", function () {

        it("should check every item", function () {
            var isBigEnough = function (item, index, collection) {
                return item >= 10;
            };

            assert.isFalse(new Collection([12, 5, 8, 130, 44]).every(isBigEnough));
            assert.isTrue(new Collection([12, 54, 18, 130, 44]).every(isBigEnough));
        });

        it("should check every object", function () {
            var isBigEnough = function (item, index, collection) {
                return item.value >= 10;
            };

            assert.isFalse(new Collection([
                {id: 1, value: 12},
                {id: 2, value: 5},
                {id: 3, value: 8},
                {id: 4, value: 130},
                {id: 5, value: 44}]).every(isBigEnough));

            assert.isTrue(new Collection([
                {id: 1, value: 12},
                {id: 2, value: 54},
                {id: 3, value: 18},
                {id: 4, value: 130},
                {id: 5, value: 44}]).every(isBigEnough));
        });
    });

    describe("some()", function () {

        it("should check some item", function () {
            function isBiggerThan10(item, index, collection) {
                return item > 10;
            }

            assert.isFalse(new Collection([2, 5, 8, 1, 4]).some(isBiggerThan10));
            assert.isTrue(new Collection([12, 5, 8, 1, 4]).some(isBiggerThan10));
        });

        it("should check some object", function () {
            function isBiggerThan10(item, index, collection) {
                return item.value > 10;
            }

            assert.isFalse(new Collection([
                {id: 1, value: 2},
                {id: 2, value: 5},
                {id: 3, value: 8},
                {id: 4, value: 1},
                {id: 5, value: 4}]).some(isBiggerThan10));
            assert.isTrue(new Collection([
                {id: 1, value: 12},
                {id: 2, value: 5},
                {id: 3, value: 8},
                {id: 4, value: 1},
                {id: 5, value: 4}]).some(isBiggerThan10));
        });

    });

    describe("forEach()", function () {

        it("should call for each item", function () {
            //When
            var objects = ['A', 'B', 'C'];
            var collection = new Collection(objects);
            var result = [];
            collection.forEach(function (item, index, collection) {
                result.push(item);
            });
            //Then
            assert.deepEqual(result, objects);
        });

    });

    describe("filter()", function () {

        it("should filter items", function () {
            //When
            var isBigEnough = function (item, index, collection) {
                return item >= 10;
            };
            var collection = new Collection([12, 5, 8, 130, 44]);
            //Then
            assert.deepEqual(collection.filter(isBigEnough), [12, 130, 44]);
        });

    });

    describe("take()", function () {
        it("should return items", function () {
            //When
            var collection = new Collection(['A', 'B', 'C', 'D']);
            //Then
            assert.deepEqual(collection.take(1, 2), ['B', 'C']);
            assert.deepEqual(collection.take(2), ['C', 'D']);
        });
    });

    describe("toArray()", function () {

        it("should return items", function () {
            var collection = new Collection(['A', 'B', 'C']);
            var array = collection.toArray();

            collection.push('X');
            array.push('Y');

            var items = [];
            collection.forEach(function (item) {
                items.push(item);
            });
            assert.deepEqual(items, ['A', 'B', 'C', 'X']);
            assert.deepEqual(array, ['A', 'B', 'C', 'Y']);
        });
    });

    describe("move()", function () {

        it("should move items", function () {
            var collection = new Collection(['A', 'B', 'C']),
                handlers = bindAllEvents(collection);

            collection.move(2, 0);
            assert.deepEqual(collection.toArray(), ['C', 'A', 'B']);
            assert.isTrue(handlers.checkEvent('onMove'), 'onMove event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');

            handlers.reset();
            collection.move(2, 1);
            assert.deepEqual(collection.toArray(), ['C', 'B', 'A']);
            assert.isTrue(handlers.checkEvent('onMove'), 'onMove event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });
    });

    describe("sort()", function () {

        it("should sort items", function () {
            var collection = new Collection([3, 30, 2, 20, 1, 10]),
                handlers = bindAllEvents(collection),
                comparator = function (a, b) {
                    return a - b
                };

            var changed = collection.sort(comparator);

            assert.isTrue(changed);
            assert.deepEqual(collection.toArray(), [1, 2, 3, 10, 20, 30]);
            assert.isTrue(handlers.checkEvent('onReset'), 'onReset event');
            assert.isTrue(handlers.checkEvent('onChange'), 'onChange event');
        });

        it("should sort items", function () {
            var collection = new Collection([
                    {value: 3, title: "3"},
                    {value: 30, title: "30"},
                    {value: 2, title: "2"},
                    {value: 20, title: "20"},
                    {value: 1, title: "1"},
                    {value: 10, title: "10"}], 'value'),
                comparator = function (a, b) {
                    return a.value - b.value;
                };

            var changed = collection.sort(comparator);

            assert.isTrue(changed);
            assert.deepEqual(collection.toArray(), [
                {value: 1, title: "1"},
                {value: 2, title: "2"},
                {value: 3, title: "3"},
                {value: 10, title: "10"},
                {value: 20, title: "20"},
                {value: 30, title: "30"}]);
        });

    });

    describe("clone()", function () {

        it("should clone collection", function () {
            var collection1 = new Collection(['A', 'B', 'C']);
            var collection2 = collection1.clone();

            collection1.add('X');
            collection2.add('Y');

            assert.deepEqual(collection1.toArray(), ['A', 'B', 'C', 'X']);
            assert.deepEqual(collection2.toArray(), ['A', 'B', 'C', 'Y']);
        });
    });

    describe('Custom properties', function () {

        it ('should set property', function () {
            // Given
            var collection = new Collection([3,2,1]);
            collection
                .setProperty(0, 'name', 'three')
                .setProperty(1, 'name', 'two')
                .setProperty(2, 'name', 'one');

            // When
            collection.sort();

            // Then
            assert.deepEqual(collection.toArray(), [1, 2, 3]);
            assert.equal(collection.getProperty(0, 'name'), 'one');
            assert.equal(collection.getProperty(1, 'name'), 'two');
            assert.equal(collection.getProperty(2, 'name'), 'three');
        });

    });

    describe("Events", function () {
        var
            collection,
            events = 'onAdd,onReplace,onRemove,onMove,onReset,onChange'.split(','),
            handlers,
            bindEvents = function () {
                handlers = [];

                events.forEach(function (event) {

                    collection[event](function (context, argument) {
                        handlers.push(event);
                    });
                });
            }


        describe("Collection.onAdd", function () {
            it("should raise onAdd & onChange event", function () {
                //when
                collection = new Collection();
                bindEvents();
                collection.add('A');
                //then
                assert.equal("onAdd,onChange", handlers.join(','));
            });
        });

        describe("Collection.onReplace", function () {
            it("should raise onReplace & onChange event", function () {
                //when
                collection = new Collection(['A']);
                bindEvents();
                collection.replace('A', 'B');
                //then
                assert.equal("onReplace,onChange", handlers.join(','));
                assert.deepEqual(collection.toArray(), ['B']);
            });
        });

        describe("Collection.onRemove", function () {
            it("should raise onRemove & onChange event", function () {
                //when
                collection = new Collection(['A']);
                bindEvents();
                collection.remove('A');
                //then
                assert.equal("onRemove,onChange", handlers.join(','));
                assert.deepEqual(collection.toArray(), []);
            });
        });

        describe("Collection.onMove", function () {
            it("should raise onMove & onChange event", function () {
                //when
                collection = new Collection(['A', 'B']);
                bindEvents();
                collection.move(1, 0);
                //then
                assert.equal("onMove,onChange", handlers.join(','));
                assert.deepEqual(collection.toArray(), ['B', 'A']);
            });
        });

        describe("Collection.onReset", function () {
            it("should raise onReset & onChange event", function () {
                //when
                collection = new Collection();
                bindEvents();
                collection.reset(['A', 'B']);
                //then
                assert.equal("onReset,onChange", handlers.join(','));
                assert.deepEqual(collection.toArray(), ['A', 'B']);
            });
        });

        describe("Collection.onChange", function () {
            it("should raise onChange event on setElements", function () {
                //when
                collection = new Collection();
                bindEvents();
                collection.set(['A', 'B']);
                //then
                assert.equal("onReset,onChange", handlers.join(','));
                assert.deepEqual(collection.toArray(), ['A', 'B']);
            });
        });
    })


});




describe("dateUtils", function () {

    describe("toISO8601", function () {
        //Format DateTime: "YYYY-MM-DDTHH:MM:SS.SSSS+hh:mm
        var date, timezoneOffset;


        it("should return date for current timezone offset", function () {
            //Given
            date = new Date(2016, 2, 18, 15, 58, 30);
            timezoneOffset = date.getTimezoneOffset();

            // When
            var strDate = InfinniUI.DateUtils.toISO8601(date);
            // Then
            var dtPart = getDateTimePart(strDate);
            var tzPart = getTimeZoneOffset(strDate);

            assert.equal(dtPart, "2016-03-18T15:58:30.0000", 'Check DateTime part');
            assert.equal(tzPart, timezoneOffset, 'Check TimeZoneOffset part');
        });

        it("should return date for given timezone offset", function () {
            //Given
            var tzOffset = 0 - 60*3;     //UTC + 3
            date = new Date('2016-03-18T10:58:30Z');
            timezoneOffset = date.getTimezoneOffset();

            // When
            var strDate = InfinniUI.DateUtils.toISO8601(date, {
                timezoneOffset: tzOffset
            });
            //Then
            var dtPart = getDateTimePart(strDate);
            var tzPart = getTimeZoneOffset(strDate);

            assert.equal(dtPart, "2016-03-18T13:58:30.0000", 'Check DateTime part');
            assert.equal(tzPart, tzOffset, 'Check TimeZoneOffset part');
        });

        function getDateTimePart(strDate) {
            return strDate.substr(0, 'yyyy-mm-ddThh:mm:ss.SSSS'.length);
        }

        function getTimeZoneOffset(strDate) {
            return 60 * strDate.substr(0 - '+HH:MM'.length)
                .split(':')
                .map(function (val) {
                    return parseInt(val, 10);
                })
                .reduce(function (sum, val) {
                    return sum - val;
                }, 0);
        }

    });
});
describe("ObjectUtils", function () {
    describe("getPropertyValue", function () {
        it("should return null when target is null or undefined", function () {
            // When
            var result1 = InfinniUI.ObjectUtils.getPropertyValue(null, "Property1");
            var result2 = InfinniUI.ObjectUtils.getPropertyValue(undefined, "Property1");

            // Then
            assert.isNull(result1);
            assert.isNull(result2);
        });

        it("should return null when property is not exists", function () {
            // Given
            var target = { };

            // When
            var result = InfinniUI.ObjectUtils.getPropertyValue(target, "NotExistsProperty");

            // Then
            assert.isNull(result);
        });

        it("should return collection item when target is collection", function () {
            // Given
            var target = [ 11, 22, 33 ];

            // When
            var item0 = InfinniUI.ObjectUtils.getPropertyValue(target, "0");
            var item1 = InfinniUI.ObjectUtils.getPropertyValue(target, "1");
            var item2 = InfinniUI.ObjectUtils.getPropertyValue(target, "2");
            var item3 = InfinniUI.ObjectUtils.getPropertyValue(target, "3");

            // Then
            assert.equal(item0, 11);
            assert.equal(item1, 22);
            assert.equal(item2, 33);
            assert.isNull(item3);
        });

        it("should return property value", function () {
            // Given
            var value = { };
            var target = { Property1: value };

            // When
            var result = InfinniUI.ObjectUtils.getPropertyValue(target, "Property1");

            // Then
            assert.equal(result, value);
        });

        it("should return nested property value", function () {
            // Given
            var value = { };
            var target = { Property1: { Property2: value } };

            // When
            var result = InfinniUI.ObjectUtils.getPropertyValue(target, "Property1.Property2");

            // Then
            assert.equal(result, value);
        });

        it("should return property value of specified collection item", function () {
            // Given
            var target = {
                Collection1: [
                    { Property1: 11 },
                    { Property1: 22 },
                    { Property1: 33 }
                ]
            };

            // When
            var item0 = InfinniUI.ObjectUtils.getPropertyValue(target, "Collection1.0.Property1");
            var item1 = InfinniUI.ObjectUtils.getPropertyValue(target, "Collection1.1.Property1");
            var item2 = InfinniUI.ObjectUtils.getPropertyValue(target, "Collection1.2.Property1");
            var item3 = InfinniUI.ObjectUtils.getPropertyValue(target, "Collection1.3.Property1");

            // Then
            assert.equal(item0, 11);
            assert.equal(item1, 22);
            assert.equal(item2, 33);
            assert.isNull(item3);
        });
    });

    describe("setPropertyValue", function () {
        it("should not throw exception when target is null or undefined", function () {
            InfinniUI.ObjectUtils.setPropertyValue(null, "property1", { });
            InfinniUI.ObjectUtils.setPropertyValue(undefined, "property1", { });
        });

        it("should set property value", function () {
            // Given
            var target = { property1: 123 };
            var propertyValue = 321;

            // When
            InfinniUI.ObjectUtils.setPropertyValue(target, "property1", propertyValue);

            // Then
            assert.equal(target.property1, propertyValue);
        });

        it("should set nested property value", function () {
            // Given
            var target = { property1: { property2: 123 } };
            var propertyValue = 321;

            // When
            InfinniUI.ObjectUtils.setPropertyValue(target, "property1.property2", propertyValue);

            // Then
            assert.equal(target.property1.property2, propertyValue);
        });

        it("should create all not exists properties in path", function () {
            // Given
            var target = { };
            var propertyValue = { };

            // When
            InfinniUI.ObjectUtils.setPropertyValue(target, "property1.property2.property3", propertyValue);

            // Then
            assert.isObject(target.property1.property2.property3);
            assert.isObject(propertyValue);
            assert.equal(_.isEmpty(target.property1.property2.property3), _.isEmpty(propertyValue));
        });

        it("should replace collection item when target is collection", function () {
            // Given
            var target = [ 11, 0, 33 ];

            // When
            InfinniUI.ObjectUtils.setPropertyValue(target, "1", 22);

            // Then
            assert.equal(target.length, 3);
            assert.equal(target[0], 11);
            assert.equal(target[1], 22);
            assert.equal(target[2], 33);
        });

        it("should set property of specified collection item", function () {
            // Given
            var target = { collection1: [ { property1: 11 }, { property1: 0 }, { property1: 33 } ] };

            // When
            InfinniUI.ObjectUtils.setPropertyValue(target, "collection1.1.property1", 22);

            // Then
            assert.equal(target.collection1.length, 3);
            assert.equal(target.collection1[0].property1, 11);
            assert.equal(target.collection1[1].property1, 22);
            assert.equal(target.collection1[2].property1, 33);
        });
    });
});