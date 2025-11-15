import { BaseConfig } from '../schemas/base.js'

import { ConnectionError } from '../errors/connection.js'
import { QueryError } from '../errors/query.js'

export abstract class BaseClient<TConfig extends BaseConfig = BaseConfig> {
    protected config: TConfig
    protected isConnected: boolean = false

    constructor(config: TConfig) {
        this.config = config
    }

    abstract disconnect(): Promise<void>
    abstract query<T = any>(command: string, ...args: any[]): Promise<T[]>
    abstract execute<T = any>(command: string, ...args: any[]): Promise<T[]>

    protected validateConnection() {
        if (!this.isConnected) {
            throw new ConnectionError('Database is not connected')
        }
    }

    protected handleError(error: Error) {
        if (error instanceof QueryError) {
            throw new QueryError(`Database query faild: ${error.message}`)
        }
        throw error
    }

    protected getConfig() {
        return {
            ...this.config
        }
    }

    protected getSafeConfig() {
        if ('password' in this.config) {
            return {
                ...this.config,
                password: '***'
            }
        }
        return {
            ...this.config
        }
    }
}
