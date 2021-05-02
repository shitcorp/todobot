import ecsFormat from '@elastic/ecs-pino-format'
import Agent from 'elastic-apm-node'
import pino from 'pino'

export default class Logger {
    private _apm: typeof Agent

    private _Log: pino.Logger

    constructor(apm: typeof Agent) {
        this._apm = apm
        this._Log = pino(ecsFormat({ convertReqRes: true }))
    }

    log = (args: any) => this._Log.info(args)

    warn = (args: any) => this._Log.warn(args)

    cmd = (args: any) => this._Log.child({ module: 'cmd' }).info(args)

    ready = (args: any) => this._Log.child({ module: 'ready' }).info(args)

    mongo = (args: any) => this._Log.child({ module: 'mongo' }).info(args)

    redis = (args: any) => this._Log.child({ module: 'redis' }).info(args)

    http = (args: any) => this._Log.child({ module: 'http' }).info(args)

    error = (err: any) => {
        this._apm.captureError(err)
        this._Log.error(err)
    }

    debug = (err: any) => {
        if (err.message === 'Unknown Message') return
        // eslint-disable-next-line no-console
        if (process.env.DEV === 'true') console.error(err)
        this.error(err)
    }
}
