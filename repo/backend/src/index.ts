/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as fastify from 'fastify';
import mongoose from 'mongoose';
import routes from './routes';
import { ConfigScheme, ReminderScheme, TodoScheme } from '@todobot/shared';
import { Options } from './config/swagger';
import { config } from './config';
import swagger from 'fastify-swagger';
import fastifyFormbody from 'fastify-formbody';
import fastifyCors from 'fastify-cors';
import fastifyMongooseAPI from 'fastify-mongoose-api';
const env = process.env.NODE_ENV;

// Configure App
const app = fastify.default({ logger: true });
// @ts-ignore
app.register(swagger, Options);
// @ts-ignore
app.register(fastifyFormbody);
// @ts-ignore
app.register(fastifyCors, instance => (req, callback) => {
	let corsOptions;
	// do not include CORS headers for requests from localhost
	if (req.headers.origin && /localhost/.test(req.headers.origin)) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: true };
	}
	callback(null, corsOptions); // callback expects two parameters: error and options
});

routes.forEach(route => {
	app.route(route);
});

const start = async (): Promise<void> => {
	try {
		await app.listen(config.app.port);
		// @ts-ignore
		app.swagger();
	} catch (err) {
		// @ts-ignore
		app.log.error(err);
		process.exit(1);
	}
};

export default app;

// Configure DB

const mongooseConnection = mongoose.createConnection(
	`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
);
mongooseConnection.model('reminders', ReminderScheme);
mongooseConnection.model('configs', ConfigScheme);
mongooseConnection.model('todos', TodoScheme);

app.register(fastifyMongooseAPI, {
	/// here we are registering our plugin
	models: mongooseConnection.models, /// Mongoose connection models
	prefix: '/mongo/', /// URL prefix. e.g. http://localhost/api/...
	setDefaults: true, /// you can specify your own api methods on models, our trust our default ones, check em [here](https://github.com/jeka-kiselyov/fastify-mongoose-api/blob/master/src/DefaultModelMethods.js)
	methods: ['list', 'get', 'post', 'patch', 'put', 'delete', 'options'], /// HTTP methods
});
console.log(mongooseConnection.models);
start();
