const request = require('@aero/centra')
const headers = {
	'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
    Accept: 'application/json',
    'Content-Type': 'application/json'
	//'X-Auth-Token': ''
};
const setToken = (token) => {
	headers['Authorization'] = token;
};

const req = async (route, method, body) => {
	//route = baseUrl + route;
	try {
		const fetch = request(route, method);
		fetch.reqHeaders = headers;
		const res = await fetch.body(body).send();
		if (res.statusCode >= 200 && res.statusCode < 300) {
			try {
				return res.json;
			} catch (e) {
				return { status: res.statusCode };
			}
		} else if (res.statusCode >= 400 && res.statusCode < 500) {
			return res;
		} 
		// FIXME
		// else {
		// 	console.log(`reattempting, status code: ${res.statusCode}`);
		// 	return { status: res.statusCode };
		// }
	} catch (globalError) {
		// yeah this is akward but lets just do nothing with this error lol
	}
};

const get = async (route) => await req(route);
const post = async (route, body) => await req(route, 'POST', body);
const put = async (route, body) => await req(route, 'PUT', body);
const del = async (route) => await req(route, 'DELETE');

module.exports = {
	setToken,
	get,
	post,
	put,
	delete: del
};