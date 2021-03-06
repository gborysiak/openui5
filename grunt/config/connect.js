var fs = require('fs');

module.exports = function(grunt, config) {

	// set default port
	if (typeof grunt.option('port') !== 'number') {
		grunt.option('port', 8080);
	}

	return {

		options: {

			port: '<%= grunt.option("port") %>',
			hostname: '*'

		},

		src: {

			options: {

				livereload: grunt.option('watch') || false,

				// hacky solution to replace the "version" placeholder in sap/ui/Global.js to enable version comparison
				// the file won't be cached
				middleware: function(connect, options, middlewares) {
					// make sure to put the middleware after "cors"
					middlewares.splice(3, 0, [ '/testsuite/resources/sap/ui/Global.js', function(req, res, next) {
						fs.readFile('src/sap.ui.core/src/sap/ui/Global.js', { encoding: 'utf-8' } , function(err, data) {
							if (err) {
								res.writeHead(404);
								res.end();
							} else {
								res.writeHead(200, { 'Content-Type': 'application/javascript' });
								res.write(data.replace(/(?:\$\{version\}|@version@)/g, grunt.config("package.version")));
								res.end();
							}
						});
					} ]);
					return middlewares;
				}

			}

		},

		target: {
			// no special options here
		}

	};

};
