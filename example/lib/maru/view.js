app.core.view = function() {
	'use strict';
	
	var viewCache = {};
	var self = this;
	
	// Default settings
	if (!app.config.viewEngine) app.config.viewEngine = {};
	if (!app.config.viewEngine.defaultSelector) app.config.viewEngine.defaultSelector = '#main';
	if (!app.config.viewEngine.fileExtension) app.config.viewEngine.fileExtension = 'html';

	/**
	 * Load the required partials
	 * @param Array partials
	 * @param Function callback
	 */
	var loadPartials = function(partials, callback) {
		if (!partials) {
			return callback();
		}
	
		var loadFunctions = [];
	
		for (var i in partials) {
			loadFunctions.push(function(parallelCallback) {
				// Is the view cached?
				if (viewCache[partials[i]]) {
					app.core.log.debug('Parcial registrada do cache [' + i + ' => ' + partials[i] + ']', 'Maru/View');
					Handlebars.registerPartial(i, viewCache[partials[i]]);
		
					return parallelCallback();
				}
		
				// Load the view file
				$.get(app.config.path + '/app/views/' + partials[i] + '.html', function(source) {
					app.core.log.debug('Parcial registrada [' + i + ' => ' + partials[i] + ']', 'Maru/View');
					viewCache[partials[i]] = Handlebars.compile(source);
					Handlebars.registerPartial(i, viewCache[partials[i]]);
					parallelCallback();
				});
			});
		};
	
		// Load the above functions in parallel
		async.parallelLimit(loadFunctions, app.config.viewEngine.parallelLimit, callback);
	};
	
	/**
	 * Compile and output or pass along the template to the callback
	 * @param String source
	 * @param Array data
	 * @param Mixed callback CSS selector or callback
	 * @param Function thenCallback
	 */
	var compileView = function(file, source, data, selector, thenCallback) {
		if (typeof source === 'string') {
			app.core.log.debug('View Compilada [' + file + ']', 'Maru/View');
			viewCache[file] = Handlebars.compile(source);
		}

		if (!data) var data = { partials: false };
	
		loadPartials(data.partials, function() {
			// Remove the partial options before passing the data to the view
			delete data.partials;
	
			var template = viewCache[file](data);
	
			if (typeof selector === 'string') {
				$(selector).html(template);
				app.core.router.assignEvents(selector);
				if (thenCallback) thenCallback(selector);
			} else {
				selector(template);
			}
		});
	};
	
	/**
	 * Render a view template
	 * @param String file
	 * @param Array data
	 * @param Function callback
	 * @param Function thenCallback
	 */
	this.render = function(file, data, selector, thenCallback) {
		if (!selector) var selector = app.config.viewEngine.defaultSelector;
		
		if (viewCache[file]) {
			app.core.log.debug('Loaded view [' + file + '] from cache', 'Maru/View');
			compileView(file, viewCache[file], data, selector, thenCallback);
		} else {
			$.get(app.config.path + '/app/views/' + file + '.' + app.config.viewEngine.fileExtension, function(source) {
				app.core.log.debug('View carregada [' + file + ']', 'Maru/View');
				compileView(file, source, data, selector, thenCallback);
			});
		}
	};

	/**
	 * Preload and cache compiled view files
	 */
	app.core.hooks.on('preloadAtivos', function(data, next) {
		var preloadFunctions = [];
	
		// Loop through all requested files
		app.config.preloadViews.forEach(function(file) {
			// Add a loading function to the preloadFunctions array
			preloadFunctions.push(function(callback) {
				// Load the view html file
				$.get(app.config.path + '/app/views/' + file + '.' + app.config.viewEngine.fileExtension, function(source) {
					app.core.log.debug('View pré-carregada[' + file + ']', 'Maru/View');
	
					// Compile and cache the view
					viewCache[file] = Handlebars.compile(source);
					
					callback();
				});
			});
		});
	
		for (var i in app.config.preloadViewPartials) {
			(function() {
				var key = i;
	
				preloadFunctions.push(function(callback) {
					$.get(app.config.path + '/app/views/' + app.config.preloadViewPartials[key] + '.' + app.config.viewEngine.fileExtension, function(source) {
						app.core.log.debug('Parcial registrada [' + key + ' => ' + app.config.preloadViewPartials[key] + ']', 'Maru/View');
						Handlebars.registerPartial(key, Handlebars.compile(source));
						callback();
					});
				});
			}());
		};

		// Load the above functions in parallel
		async.parallelLimit(preloadFunctions, app.config.viewEngine.parallelLimit, next);
	});
};