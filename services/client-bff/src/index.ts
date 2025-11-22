import {
    controller,
    Get,
    InversifyFastifyServer
} from '@pkgs/fastify-inversify'
import { nacos } from '@pkgs/svcs-discovery'
import { Container } from 'inversify'

nacos.registerServer('client-bff', 'localhost', 3002)

@controller('/users')
class Controller {
    @Get('/lists')
    public lists() {
        console.log(222)

        return []
    }
}

const container = new Container()

container.bind(Controller).toSelf().inRequestScope()

const app = new InversifyFastifyServer(container)

app.listen({ port: 3002 }, () => {})
