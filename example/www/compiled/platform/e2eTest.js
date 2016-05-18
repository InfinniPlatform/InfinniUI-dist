describe('DocumentDataSource with REST dataProvider operations', function () {

    var builder = new ApplicationBuilder(),
        metadata = {
            Name: 'PatientDataSource',
            ConfigId: 'Demography',
            DocumentId: 'Patient',
            IdProperty: 'Id',
            CreateAction: 'CreateDocument',
            GetAction: 'GetDocument',
            UpdateAction: 'SetDocument',
            DeleteAction: 'DeleteDocument',
            FillCreatedItem: true
        },
        parentView = {
            getContext: function () {
                return {};
            }
        };

    var errorCallback = function (err) {
        assert.fail(err);
        done();
    };

    it('should read list of documents', function (done) {


        window.providerRegister.register('DocumentDataSource', function (metadataValue) {
            return new DataProviderREST(metadataValue, new QueryConstructorStandard('http://ic:9900', metadataValue), null, errorCallback);
        });

        var dataSource = builder.buildType(parentView, 'DocumentDataSource', metadata);

        dataSource.setListMode();

        dataSource.getItems(function (data) {
            assert.ok(data);
            done();
        });
    });

    it('should create document', function (done) {

        window.providerRegister.register('DocumentDataSource', function (metadataValue) {
            return new DataProviderREST(metadataValue, new QueryConstructorStandard('http://ic:9900', metadataValue), null, errorCallback);
        });

        var dataSource = builder.buildType(parentView, 'DocumentDataSource', metadata);

        dataSource.setListMode();

        dataSource.onItemCreated(function (data) {
            assert.ok(data);
            done();
        });

        dataSource.createItem();
    });

    it('should update document', function (done) {


        window.providerRegister.register('DocumentDataSource', function (metadataValue) {
            return new DataProviderREST(metadataValue, new QueryConstructorStandard('http://ic:9900', metadataValue), null, errorCallback);
        });

        var dataSource = builder.buildType(parentView, 'DocumentDataSource', metadata);

        dataSource.setListMode();

        var item = {
            "FirstName": "TestFirstName",
            "LastName": "TestLastName"
        };

        dataSource.onItemSaved = function (data) {
            assert.ok(data);
            done();
        };

        dataSource.saveItem(item);
    });

    it('should delete document', function (done) {

        window.providerRegister.register('DocumentDataSource', function (metadataValue) {
            return new DataProviderREST(metadataValue, new QueryConstructorStandard('http://ic:9900', metadataValue), null, errorCallback);
        });

        var dataSource = builder.buildType(parentView, 'DocumentDataSource', metadata);

        dataSource.setListMode();

        dataSource.onItemDeleted = function (data) {
            assert.ok(data);
            done();
        };

        dataSource.deleteItem("1");
    });

});

describe('DataProviderREST', function () {

    this.timeout(10000);

    var host = 'http://localhost:9000';

    var metadata = {
        Name: 'PatientDataSource',
        ConfigId: 'Demography',
        DocumentId: 'Patient',
        IdProperty: 'Id',
        CreateAction: 'CreateDocument',
        GetAction: 'GetDocument',
        UpdateAction: 'SetDocument',
        DeleteAction: 'DeleteDocument',
        FillCreatedItem: true
    };

    var dataProviderREST = new DataProviderREST(metadata, new QueryConstructorStandard(host, metadata));

    it('DataProviderREST should CreateDocument', function () {

        dataProviderREST.getItems(null, function () {

            assert.include(this.url, 'http://localhost:9000/RestfulApi/StandardApi/configuration/GetDocument');
        });
    });
    it('DataProviderREST should GetDocument', function () {

        dataProviderREST.createItem(null, function () {

            assert.include(this.url, 'http://localhost:9000/RestfulApi/StandardApi/configuration/CreateDocument');

        });
    });
    it('DataProviderREST should UpdateDocument', function () {

        dataProviderREST.replaceItem({}, null, function () {

            assert.include(this.url, 'http://localhost:9000/RestfulApi/StandardApi/configuration/SetDocument');
        });
    });
    it('DataProviderREST should DeleteDocument', function () {

        dataProviderREST.deleteItem(1, null, function () {

            assert.include(this.url, 'http://localhost:9000/RestfulApi/StandardApi/configuration/DeleteDocument');
        });
    });

});

describe('MetadataProviderREST', function () {

    var host = 'http://ic:9900';

    window.providerRegister.register('MetadataDataSource', function (metadataValue) {
        return new MetadataProviderREST(new QueryConstructorMetadata(host, metadataValue));
    });

    var metadataView = {
        Name: 'HomePageView',
        ConfigId: 'Structure',
        DocumentId: 'Common',
        ViewType: 'HomePage'
    };

    var metadataMenu = {
        MetadataName: "MainMenu",
        ConfigId: "VeteransHospital"
    };

    it('should MetadataProviderREST get view metadata', function (done) {
        window.providerRegister.build('MetadataDataSource', metadataView).getViewMetadata(function (data) {
            assert.ok(data);
            done();
        });

    });
    it('should MetadataProviderREST get menu metadata', function (done) {
        
        window.providerRegister.build('MetadataDataSource', metadataMenu).getMenuMetadata(function (data) {
            assert.ok(data);
            done();
        } );
    });


});