/**
 * ROUTES
 */

module.exports = (function (node, out, router) {

	out.info('Listening on routes...');

	require('./user')(node, out, router);

});