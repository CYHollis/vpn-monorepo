import { BaseClient } from './base.js'
import { MysqlConfig } from '../schemas/mysql.js'

import { ConnectionError } from '../errors/connection.js'
import { QueryError } from '../errors/query.js'

import mysql from 'mysql2/promise'

export class MysqlClient extends BaseClient {
    private pool: mysql.Pool | null
    constructor(config: MysqlConfig) {
        super(config)
        try {
            this.pool = mysql.createPool({
                user: config.user,
                password: config.password,
                database: config.database,
                host: config.host || 'localhost',
                port: config.port || 3306
            })
            this.isConnected = true
        } catch (error) {
            throw new ConnectionError('Database connect faild')
        }
    }
    async disconnect() {
        this.validateConnection()
        try {
            this.pool?.end()
            this.isConnected = false
            this.pool = null
        } catch (error) {
            throw new ConnectionError('Database disconnect faild')
        }
    }
    async query<T = any>(command: string, ...args: any[]): Promise<T[]> {
        this.validateConnection()
        try {
            return ((await this.pool?.query(command, args)) as any)[0] as T[]
        } catch (error: any) {
            throw new QueryError(error.message)
        }
    }
    async execute<T = any>(command: string, ...args: any[]): Promise<T> {
        this.validateConnection()
        try {
            return ((await this.pool?.execute(command, args)) as any)[0] as T
        } catch (error: any) {
            throw new QueryError(error.message)
        }
    }
}
