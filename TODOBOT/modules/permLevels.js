module.exports = [
	{
		level: 0,
		name: 'User',
		check: (_message) => true
	},
	{
		level: 1,
		name: 'LOW_STAFF',
		check: (message) => message.member.hasPermission('MANAGE_GUILD')
	},
	{
		level: 2,
		name: 'STAFF',
		// TODO check for staffroles
		check: (_message) => true
	},
	{
		level: 3,
		name: 'ADMIN',
		check: (message) => message.member.hasPermission('ADMINISTRATOR')
	},
	{
		level: 5,
		name: 'Server Owner',
		check: (message) => message.channel.type === 'text' && message.guild.ownerID === message.author.id
	},
	{
		level: 8,
		name: 'Bot Support',
		check: (message) => process.env.SUPPORT.split(' ').includes(message.author.id)
	},
	{
		level: 9,
		name: 'Bot Admin',
		check: (message) => process.env.ADMINS.split(' ').includes(message.author.id)
	},
	{
		level: 10,
		name: 'root',
		check: (message) => process.env.OWNER_ID === message.author.id
	}
];
