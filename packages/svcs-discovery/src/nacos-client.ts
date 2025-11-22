import { NacosNamingClient } from 'nacos'

class NacosClient {
    private client: NacosNamingClient

    constructor() {
        this.client = new NacosNamingClient({
            username: 'nacos',
            password: 'nacos',
            serverList: '127.0.0.1:8848',
            namespace: 'public',
            logger: {
                debug() {},
                info() {},
                warn(msg: any) {
                    console.warn(msg)
                },
                error(msg: any) {
                    console.warn(msg)
                },
                assert() {},
                clear() {},
                count() {},
                countReset() {},
                dir() {},
                dirxml() {},
                group() {},
                groupCollapsed() {},
                groupEnd() {},
                log() {},
                table() {},
                time() {},
                timeEnd() {},
                timeLog() {},
                trace() {},
                profile() {},
                profileEnd() {},
                timeStamp() {},
                Console: console.Console
            }
        })
    }

    public async getClient() {
        return this.client
    }

    public async registerServer(serviceName: string, ip: string, port: number) {
        console.log(111)

        return this.client.registerInstance(serviceName, {
            ip,
            port,
            instanceId: `${ip}#${port}#${serviceName}`,
            healthy: true,
            enabled: true
        })
    }

    public async getServer(serviceName: string) {
        return (await this.client.getAllInstances(serviceName))[0]
    }
}

export const nacos = new NacosClient()
