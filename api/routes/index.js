/**
 * ROUTES
 */

module.exports = (function (node, out, app, router) {

	out.info('Listening on routes...');

	require('./user')(node, out, app, router);

});