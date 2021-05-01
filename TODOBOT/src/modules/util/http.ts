const request = require('@aero/centra')

const headers = {
    'User-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: null,
}
const setToken = (token) => {
    headers.Authorization = token
}

// eslint-disable-next-line consistent-return
const req = async (route, method, body?: any) => {
    // route = baseUrl + route;
    try {
        const fetch = request(route, method)
        fetch.reqHeaders = headers
        const res = await fetch.body(body).send()
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return res.json
            } catch (e) {
                return { status: res.statusCode }
            }
        } else if (res.statusCode >= 400 && res.statusCode < 500) {
            return res
        }
        // FIXME
        // else {
        // 	console.log(`reattempting, status code: ${res.statusCode}`);
        // 	return { status: res.statusCode };
        // }
    } catch (globalError) {
        // yeah this is akward but lets just do nothing with this error lol
    }
}

const get = async (route: string) => req(route, 'GET')
const post = async (route: string, body) => req(route, 'POST', body)
const put = async (route: string, body) => req(route, 'PUT', body)
const del = async (route: string) => req(route, 'DELETE')

export default {
    setToken,
    get,
    post,
    put,
    delete: del,
}
