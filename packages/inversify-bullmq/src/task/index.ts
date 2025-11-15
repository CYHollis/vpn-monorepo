import { Job, Queue, Worker } from 'bullmq'
import { MetadataRuntime } from '../metadata/index.js'
import { Redis } from 'ioredis'
import { Container } from 'inversify'

export class InversifyBullmqTask {
    private container: Container
    private queues: Queue[] = []
    private workers: Worker[] = []

    constructor(container: Container) {
        this.container = container
    }

    public listen(redisConnection: Redis) {
        this.parseMetadata(redisConnection)
    }

    private parseMetadata(redisConnection: Redis) {
        // 遍历所有类
        for (const constructorName in MetadataRuntime.metadata) {
            const { properties, queueName, target } =
                MetadataRuntime.metadata[constructorName]

            // 如果未提供队列名, 即未使用queue装饰器, 直接退出
            if (!queueName) {
                continue
            }

            // 动态创建队列
            const queue = new Queue(queueName, {
                connection: redisConnection
            })
            this.queues.push(queue)

            // 添加队列任务
            for (const propertyKey in properties) {
                const { jobOptions, jobName } = properties[propertyKey]
                queue.add(jobName, {}, jobOptions)
            }

            // 动态创建Worker
            const worker = new Worker(
                queueName,
                async (job: Job) => {
                    // 遍历所有方法查找任务处理函数
                    for (const propertyKey in properties) {
                        const { jobName } = properties[propertyKey]

                        // 执行任务
                        if (jobName === job.name) {
                            try {
                                const instance: any = this.container.get(
                                    target as Function
                                )
                                instance[propertyKey]()
                            } catch (error) {
                                console.log(error)
                                process.exit(1)
                            }
                        }
                    }
                },
                {
                    connection: redisConnection
                }
            )
            this.workers.push(worker)
        }
    }
}
