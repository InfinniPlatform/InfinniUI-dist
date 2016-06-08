function CucumberHTMLListener($root, $info) {
    var formatter = new CucumberHTML.DOMFormatter($root);
    var testInfoHelper = new TestInfoHelper($info);

    formatter.uri('report.feature');

    var currentStep;

    var self = {
        hear: function hear(event, callback) {
            var eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    var feature = event.getPayloadItem('feature');
                    window.cucumberCurrentFeature = feature.getName();
                    var tag = feature.getTags()[0];
                    if(tag && tag.getName){
                        tag = tag.getName();
                    } else {
                        tag = undefined;
                    }
                    window.cucumberCurrentFeature = (tag ? tag + ' ' : '') + window.cucumberCurrentFeature;
                    formatter.feature({
                        keyword: feature.getKeyword(),
                        name: feature.getName(),
                        line: feature.getLine(),
                        description: feature.getDescription(),
                        tag: tag
                    });
                    tsm.suiteStarted(window.cucumberCurrentFeature);
                    break;

                case 'BeforeScenario':
                    var scenario = event.getPayloadItem('scenario');
                    window.cucumberCurrentScenario = scenario.getName();
                    window.cucumberIsIgnored = false;
                    window.cucumberIsFailed = false;
                    var tag = scenario.getTags()[0];
                    if(tag && tag.getName){
                        tag = tag.getName();
                    } else {
                        tag = undefined;
                    }
                    window.cucumberCurrentScenario = (tag ? tag + ' ' : '') + window.cucumberCurrentScenario;
                    formatter.scenario({
                        keyword: scenario.getKeyword(),
                        name: scenario.getName(),
                        line: scenario.getLine(),
                        description: scenario.getDescription(),
                        tag: tag
                    });
                    tsm.testStarted(window.cucumberCurrentScenario);
                    break;

                case 'BeforeStep':
                    var step = event.getPayloadItem('step');
                    self.handleAnyStep(step);
                    window.cucumberCurrentStep = (step.getKeyword() + step.getName())
                        .toString()
                        .replace(/'/g, "|'")
                        .replace(/\[/g, "|[")
                        .replace(/\]/g, "|]")
                        .replace(/:/g, "");
                    break;

                case 'StepResult':
                    var result;
                    var stepResult = event.getPayloadItem('stepResult');
                    if (stepResult.isSuccessful()) {
                        result = {status: 'passed'};
                    } else if (stepResult.isPending()) {
                        result = {status: 'pending'};
                    } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                        result = {status: 'skipped'};
                        if (!window.cucumberIsIgnored && !window.cucumberIsFailed) {
                            tsm.testIgnored(window.cucumberCurrentScenario);
                            testInfoHelper.incrementIgnored();
                            window.cucumberIsIgnored = true;
                        }
                    } else {
                        var error = stepResult.getFailureException();
                        var errorMessage = error.stack || error;
                        result = {status: 'failed', error_message: errorMessage};

                        errorMessage = errorMessage.toString()
                            .replace(/\n/g, "|n|r")
                            .replace(/'/g, "|'")
                            .replace(/\[/g, "|[")
                            .replace(/\]/g, "|]")
                            .replace(/:/g, "");

                        tsm.testFailed(window.cucumberCurrentScenario, window.cucumberCurrentStep, errorMessage);
                        testInfoHelper.incrementFailed();

                        window.cucumberIsFailed = true;
                    }
                    formatter.match({uri: 'report.feature', step: {line: currentStep.getLine()}});
                    formatter.result(result);
                    break;

                case 'AfterScenario':
                    tsm.testFinished(window.cucumberCurrentScenario);
                    if(!window.cucumberIsFailed) {
                        testInfoHelper.incrementPassed();
                    }
                    break;

                case 'AfterFeature':
                    tsm.suiteFinished(window.cucumberCurrentFeature);
                    break;
            }
            callback();
        },

        handleAnyStep: function handleAnyStep(step) {
            formatter.step({
                keyword: step.getKeyword(),
                name: step.getName(),
                line: step.getLine()
            });
            currentStep = step;
        }
    };
    return self;
}