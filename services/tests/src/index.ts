import { RedisClient, MysqlClient } from '@packages/database'
import {
    controller,
    Get,
    Header,
    InversifyFastifyServer
} from '@packages/inversify-fastify'
import {
    InversifyWebSocketServer,
    message,
    param,
    socket
} from '@packages/inversify-websocket'
import { InversifyBullmqTask, job, queue } from '@packages/inversify-bullmq'
import { Container } from 'inversify'

async function DataBaseTest() {
    const redis = new RedisClient({
        port: 6379,
        host: 'localhost',
        db: 1
    })
    const res1 = await redis.set('test3', '2')
    console.log('redis: ', res1)

    const mysql = new MysqlClient({
        user: 'root',
        password: '124638feq.',
        database: 'vpn_service'
    })
    const res2 = await mysql.execute(
        'UPDATE users SET username = ? WHERE uid = ?',
        'default21',
        1
    )
    console.log('mysql: ', res2)
}

DataBaseTest()

const container = new Container()

let fastifyApp: InversifyFastifyServer
async function InversifyFastifyTest() {
    fastifyApp = new InversifyFastifyServer(container)
    fastifyApp.listen({ port: 3000 }, () => {
        console.log('Fastify server is running')
    })
}

@controller('/test')
class TestController {
    @Get('/hello')
    public async hello(@Header('auth') type: string) {
        console.log(type)
        return 'hello'
    }
}
container.bind(TestController).toSelf().inRequestScope()

InversifyFastifyTest()

async function InversifyWebsocketTest() {
    const app = new InversifyWebSocketServer(container)
    app.listen(fastifyApp.build())
}

@socket()
class SocketController {
    @message('/hello')
    public async hello(uid: string) {
        console.log(uid)
    }
}
container.bind(SocketController).toSelf().inRequestScope()

InversifyWebsocketTest()

async function InversifyBullmqTest() {
    const app = new InversifyBullmqTask(container)
    app.listen(new RedisClient().getConnection())
}

@queue('wg')
class BullmqController {
    @job('collect', { repeat: { every: 5000 } })
    public async collect() {
        console.log('bullmq')
    }
}

container.bind(BullmqController).toSelf().inSingletonScope()

InversifyBullmqTest()
