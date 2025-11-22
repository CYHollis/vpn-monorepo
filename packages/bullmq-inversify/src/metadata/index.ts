import { JobsOptions } from 'bullmq'

export interface Metadata {
    [constructorName: string]: {
        target: Function | null
        queueName: string
        properties: {
            [propertyKey: string]: {
                target: Function | null
                jobName: string
                jobOptions: JobsOptions
            }
        }
    }
}

export class MetadataRuntime {
    public static metadata: Metadata = {}

    public static addConstructor(constructor: Function, queueName: string) {
        // 只有不存在这个类时才添加新的类
        if (!this.metadata[constructor.name]) {
            this.metadata[constructor.name] = {
                target: constructor,
                queueName,
                properties: {}
            }
        }
        // 存在这个类, 更改队列名
        this.metadata[constructor.name].queueName = queueName
    }

    public static addProperty(
        constructor: Function,
        propertyKey: string,
        jobName: string,
        jobOptions: JobsOptions
    ) {
        // 如果不存在这个类, 先添加类
        if (!this.metadata[constructor.name]) {
            this.addConstructor(constructor, '')
        }
        // 只有不存在这个方法时才添加新的方法
        if (!this.metadata[constructor.name].properties[propertyKey]) {
            this.metadata[constructor.name].properties[propertyKey] = {
                target: null,
                jobName,
                jobOptions
            }
        }
    }
}
