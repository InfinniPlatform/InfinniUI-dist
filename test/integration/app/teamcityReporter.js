var tsm = {
    suiteStarted: function (suiteName) {
        console.log("##teamcity[testSuiteStarted name='" + suiteName + "']");
    },

    suiteFinished: function (suiteName) {
        console.log("##teamcity[testSuiteFinished name='" + suiteName + "']");
    },

    testStarted: function (testName) {
        console.log("##teamcity[testStarted name='" + testName + "']");
    },

    testFinished: function (testName) {
        console.log("##teamcity[testFinished name='" + testName + "']");
    },

    testFailed: function (testName, errorMesage, stackTrace) {
        console.log("##teamcity[testFailed name='" + testName + "' message='" + errorMesage + "' details='" + stackTrace + "']");
    },

    testIgnored: function (testName) {
        console.log("##teamcity[testIgnored name='" + testName + "']");
    },

    forseIgnore: function (testName) {
        this.testStarted(testName);
        this.testIgnored(testName);
        this.testFinished(testName);
    }
};