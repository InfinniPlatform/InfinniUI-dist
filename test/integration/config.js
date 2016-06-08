window.IntegrationTestConfig = {
	host: window.location.origin,
	featurePath: 'out/feature.feature',
	stepDefinitionsPath: 'out/step_definitions.js',
	mongoDbService: {
		url: 'http://localhost:60520'
	}
};