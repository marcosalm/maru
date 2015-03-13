app.config = {

	// Log level, between 0-3 where 3 is all messages and 0 is none
	logLevel: 3,

	// Path without trailing slash
	path: 'http://localhost/maru',

	// API server URL (optional)
	API: 'https://api.github.com',

	autoLoad: {
		// Core => app.core.*
		core: [
			'lib/maru/hooks',
			'lib/maru/log',
			'lib/maru/view',
			'lib/maru/router',
			'lib/maru/api',
			'lib/maru/cache',
			'lib/maru/i18n'
		],
		
		// Libraries => app.lib.*
		lib: [
			'app/libraries/ui'
		],

		// Helpers => app.helpers.*
		helpers:  {
			initialize: false,
			files: [
				'app/helpers/timeAgo'
			]
		},

		// Services => app.services.*
		services: [
			'app/services/github'
		],

		// Controllers => app.core.router.get(...)
		controllers: {
			initialize: false,
			files: [
				'app/controllers/index',
				'app/controllers/list',
				'app/controllers/repos',
				'app/controllers/404',
				'app/controllers/maru'
    
			]
		},

		setup: {
			initialize: false,
			files: [
				'app/setup'
			]
		}
	},

	// Localization settings
	localization: {
		defaultLocale: 'en_GB',
		locales: {
			en_GB: 'English (UK)',
			en_US: {
				name: 'English (US)',
				extend: 'en_GB'
			},
			sv_SE: 'Svenska'
		},
		files: [
			'general',
			'github'
		],
		parallelLimit: 5,
	},

	// View engine settings
	viewEngine: {
		defaultSelector: '#main',
		fileExtension: 'html',
		parallelLimit: 5,
	},

	// Optionally preload common views
	preloadViews: [
		'index',
		'list'
	],

	// Optionally preload common partials
	preloadViewPartials: {
		// listItem: 'partials/list-item'
	}
};
