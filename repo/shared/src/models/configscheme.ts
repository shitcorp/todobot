import { Schema } from 'mongoose';

export default new Schema({
	_id: String,
	prefix: String,
	color: String,
	todochannel: String,
	readonlychannel: String,
	blackboard: {
		channel: String,
		message: String,
	},
	userroles: Array,
	staffroles: Array,
	tags: Map,
	blacklist_channels: Array,
	blacklist_users: Array,
	vars: Map,
	lang: String,
	autopurge: Boolean,
	todomode: String,
});
