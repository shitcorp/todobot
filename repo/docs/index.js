const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
const polka = require('polka');
const sirv = require('sirv');
const PORT = 3004;

polka()
	.use(sirv(swaggerUiAssetPath))
	.listen(PORT, err => {
		if (err) throw err;
		console.log('> Server listening at http://127.0.0.1:' + PORT);
	});
