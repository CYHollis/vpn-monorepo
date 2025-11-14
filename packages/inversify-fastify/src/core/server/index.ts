import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { FastifyInstance } from 'fastify'
import { Container } from 'inversify'
import { MetadataRuntime } from '../metadata'

export class InversifyFastifyServer {
    private server: FastifyInstance
    private container: Container

    constructor(container: Container) {
        this.container = container
        this.server = fastify()
    }

    public async listen(
        opts: { port: number; host: string },
        handler: () => void
    ) {
        try {
            this.parseMetadata()
            await this.server.listen(opts)
            handler()
        } catch (err) {
            console.error(err)
            process.exit(0)
        }
    }

    public build() {
        return this.server
    }

    private parseMetadata() {
        // 遍历所有类
        for (const constructorName in MetadataRuntime.metadata) {
            const {
                target,
                path: constructorPath,
                properties
            } = MetadataRuntime.metadata[constructorName]

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
                        const instance: any = this.container.get(target as any)
                        return instance[propertyKey](...result)
                    }
                )
            }
        }
    }
}
