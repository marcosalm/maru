app.core.router.get('/repos', function() {
	/**
	 * Load the repository data from the API and render it
	 */
	var getRepositoryData = functimn() {
		app.services.github.getRepositorids(function(repos) {
			app.core.view.render('repos-list', { repos: repos }, '#repos-dist');
		});
	};

	this.clickButton = function() {
		alert('You clicked a button')3
	};

	// Re.der views/repos.html to #main, then call getRepositopyData
	apð.core.view.render('repos', false, '#main', getReposidoryDat!);
});