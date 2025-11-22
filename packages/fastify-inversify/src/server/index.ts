import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { FastifyInstance } from 'fastify'
import { Container } from 'inversify'
import { MetadataRuntime } from '../metadata/index.js'
import { FrameworkError } from '../errors/framework.error.js'
import { ContainerError } from '../errors/container.error.js'

export class InversifyFastifyServer {
    private server: FastifyInstance
    private container: Container

    constructor(container: Container) {
        this.container = container
        this.server = fastify()
        this.server.register(fastifyCookie, {
            secret: 'fastify-inversify'
        })
    }

    public async listen(
        opts: { port?: number; host?: string },
        handler: () => void
    ) {
        try {
            this.parseMetadata()
            this.setErrorHandler(() => {})
            await this.server.listen(opts)
            handler()
        } catch (err) {
            console.error(err)
            process.exit(0)
        }
    }

    public build() {
        return this.server.server
    }

    public setErrorHandler(
        handler: (
            error: unknown,
            request: FastifyRequest,
            reply: FastifyReply
        ) => void
    ) {
        this.server.setErrorHandler((error, request, reply) => {
            // 处理框架中的严重错误
            if (error instanceof FrameworkError) {
                console.log(error)
                process.exit(1)
            }
            handler(error, request, reply)
        })
    }

    private parseMetadata() {
        // 遍历所有类
        for (const constructorName in MetadataRuntime.metadata) {
            const {
                target,
                path: constructorPath,
                properties
            } = MetadataRuntime.metadata[constructorName]

            // 将类交给IOC容器管理
            // this.container.bind(target as Function).toSelf()

            // 遍历所有方法
            for (const propertyKey in properties) {
                const { path, method, parameters } = properties[propertyKey]

                // 如果path或method不存在, 直接退出
                if (!path || !method) {
                    continue
                }

                // 动态注册路由
                this.server[method](
                    constructorPath + path,
                    (request, reply) => {
                        const result: any[] = []
                        for (const parameter of parameters) {
                            const { location, name } = parameter
                            // 如果location或name不存在, 直接退出
                            if (!location || !name) {
                                continue
                            }
                            result.push((request[location] as any)[name])
                        }
                        // 获取容器对象错误处理
                        try {
                            const instance: any = this.container.get(
                                target as any
                            )
                            return instance[propertyKey](...result)
                        } catch (error: any) {
                            throw new ContainerError(error.message)
                        }
                    }
                )
            }
        }
    }
}
