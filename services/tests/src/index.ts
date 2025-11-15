import { RedisClient, MysqlClient } from '@packages/database'
const a = new RedisClient({
    port: 6379,
    host: 'localhost',
    db: 1
})

const b = new MysqlClient({
    user: 'root',
    password: '124638feq.',
    database: 'vpn_service'
})

async function Test() {
    // const res = await a.set('test3', '2')
    // console.log(res)
    const res = await b.execute(
        'UPDATE users SET username = ? WHERE uid = ?',
        'default21',
        1
    )
    console.log(res)
}

Test()

// import { InversifyFastifyServer } from '@packages/inversify-fastify'
// import { Container } from 'inversify'

// const container = new Container()
// const app = new InversifyFastifyServer(container)
