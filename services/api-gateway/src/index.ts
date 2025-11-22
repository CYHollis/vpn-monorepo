import { nacos } from '@pkgs/svcs-discovery'

import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import axios from 'axios'
import { RedisClient } from '@pkgs/db'

import { RateLimiterRedis } from 'rate-limiter-flexible'
import CircuitBreaker from 'opossum'

const app = fastify()

const redis = new RedisClient({ db: 1 })

const rateLimiter = new RateLimiterRedis({
    storeClient: redis.getConnection(),
    points: 100,
    duration: 60
})

const breakerOptions: CircuitBreaker.Options = {
    timeout: 3000, // 超时时间3s
    errorThresholdPercentage: 50, //错误率超过50%开启熔断
    resetTimeout: 10000, // 10s后尝试半开
    rollingCountTimeout: 10000, // 统计最近十秒
    rollingCountBuckets: 10 // 10个统计桶(1秒1个)
}

const breaker = new CircuitBreaker(
    async (reqOptions: {
        url: string
        method: string
        body: any
        headers: any
    }) => {
        return axios({
            url: reqOptions.url,
            method: reqOptions.method,
            data: reqOptions.body,
            headers: reqOptions.headers
        })
    },
    breakerOptions
)

app.register(fastifyCookie, {
    secret: 'api-gateway'
})

// 网关限流
app.addHook('onRequest', async (request, reply) => {
    const { CLIENT_ID } = request.cookies
    try {
        // 初次访问, 生成clientID
        if (!CLIENT_ID) {
            const clientID = crypto.randomUUID()
            reply.setCookie('CLIENT_ID', clientID, {
                signed: true
            })
            return await rateLimiter.consume(clientID)
        }
        await rateLimiter.consume(CLIENT_ID)
    } catch {
        reply.status(429)
        reply.send({ message: 'Too many requests' })
    }
})

// 网关代理和熔断
app.all('/:platform/*', async (request, reply) => {
    const { platform } = request.params as { platform: 'client' | 'bms' }
    try {
        const server = await nacos.getServer(`${platform}-bff`)

        const targetURL = new URL(
            request.url.replace(`/${platform}`, ''),
            `http://${server.ip}:${server.port}`
        ).toString()

        const res = await breaker.fire({
            method: request.method,
            body: request.body,
            headers: request.headers,
            url: targetURL
        })
        return res.data
    } catch (err: any) {
        // 网关错误处理
        if (err.status === 404) {
            reply.status(404)
            return {
                status: 404,
                msg: err.response.data.message,
                data: null
            }
        }
        reply.status(502)
        return { message: 'Bad gateway' }
    }
})

app.listen({ port: 3000 }, () => {
    console.log('Api-gateway is running')
})
