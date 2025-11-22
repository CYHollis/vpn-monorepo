import { BaseClient } from './base.js'
import { RedisConfig } from '../schemas/redis.js'

import { ConnectionError } from '../errors/connection.js'
import { QueryError } from '../errors/query.js'

import { Redis } from 'ioredis'

export class RedisClient extends BaseClient<RedisConfig> {
    private client: Redis | null
    constructor(config?: RedisConfig) {
        const redisConfig = config
            ? {
                  port: config.port || 6379,
                  host: config.host || 'localhost',
                  db: config.db || 0,
                  maxRetriesPerRequest: config.maxRetriesPerRequest || null
              }
            : {
                  port: 6379,
                  host: 'localhost',
                  db: 0,
                  maxRetriesPerRequest: null
              }
        super(redisConfig)
        try {
            this.client = new Redis(redisConfig)
            this.isConnected = true
        } catch (error) {
            throw new ConnectionError('Database connect failed')
        }
    }
    async disconnect() {
        this.validateConnection()
        try {
            this.client?.quit()
            this.client = null
            this.isConnected = false
        } catch (error) {
            throw new ConnectionError('Database disconnect failed')
        }
    }
    async query<T = any>(command: string, ...args: any[]): Promise<T[]> {
        this.validateConnection()
        try {
            const result = (await this.client?.call(command, ...args)) as T[]
            return result
        } catch (error: any) {
            throw new QueryError(error.message)
        }
    }
    async execute<T = any>(command: string, ...args: any[]): Promise<T> {
        this.validateConnection()
        try {
            const result = (await this.client?.call(command, ...args)) as T
            return result
        } catch (error: any) {
            throw new QueryError(error.message)
        }
    }

    // 获取连接对象
    getConnection() {
        this.validateConnection()
        return this.client as Redis
    }

    // Redis 特定方法
    async get<T = string>(key: string): Promise<T | null> {
        this.validateConnection()
        return this.execute('GET', [key])
    }

    async set(
        key: string,
        value: string,
        options: {
            EX?: number
            PX?: number
            NX?: boolean
            XX?: boolean
        } = {}
    ): Promise<void> {
        this.validateConnection()
        const args = [key, value]
        if (options.EX) args.push('EX', options.EX.toString())
        if (options.PX) args.push('PX', options.PX.toString())
        if (options.NX) args.push('NX')
        if (options.XX) args.push('XX')

        await this.execute('SET', args)
    }

    async hset(key: string, field: string, value: string): Promise<void> {
        this.validateConnection()
        await this.execute('HSET', [key, field, value])
    }

    async hget<T = string>(key: string, field: string): Promise<T | null> {
        this.validateConnection()
        return this.execute('HGET', [key, field])
    }

    async hgetall<T = object>(key: string): Promise<T> {
        this.validateConnection()
        return this.client?.hgetall(key) as T
    }
}
