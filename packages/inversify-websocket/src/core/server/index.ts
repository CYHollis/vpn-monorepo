import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'node:http'
import { MetadataRuntime } from '../metadata/index.js'
import { Container } from 'inversify'

export class InversifyWebSocketServer {
    private io: Server | null = null
    private container: Container

    constructor(container: Container) {
        this.container = container
    }

    public listen(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: '*'
            }
        })
        this.io.on('connection', (socket) => {
            this.parseMetadata(socket)
        })
    }

    private parseMetadata(socket: Socket) {
        // 遍历所有类
        for (const constructorName in MetadataRuntime.metadata) {
            const { properties, target } =
                MetadataRuntime.metadata[constructorName]

            // 遍历类中所有方法
            for (const propertyKey in properties) {
                const { ev, parameters } = properties[propertyKey]

                // 如果ev未空, 即未使用message装饰器, 直接退出
                if (!ev) {
                    continue
                }

                // 动态注册socket事件
                socket.on(ev, (...args: any[]) => {
                    // 收集方法执行需要的参数
                    const result: any[] = []
                    let argIndex = 0
                    for (const parameter of parameters) {
                        if (!parameter && argIndex < args.length) {
                            result.push(args[argIndex])
                            argIndex++
                        } else {
                            result.push(socket.handshake.auth[parameter])
                        }
                    }
                    while (argIndex < args.length) {
                        result.push(args[argIndex])
                        argIndex++
                    }

                    // 传入参数执行方法
                    const instance: any = this.container.get(target as Function)
                    instance[propertyKey](...result)
                })
            }
        }
    }
}
