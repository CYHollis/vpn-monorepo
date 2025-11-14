export interface Metadata {
    [constructorName: string]: {
        target: Function | null
        queueName: string
        properties: {
            [propertyKey: string]: {
                target: Function | null
                jobName: string
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
    }

    public static addProperty(
        constructor: Function,
        propertyKey: string,
        jobName: string
    ) {
        // 如果不存在这个类, 先添加类
        if (!this.metadata[constructor.name]) {
            this.addConstructor(constructor, '')
        }
        // 只有不存在这个方法时才添加新的方法
        if (!this.metadata[constructor.name].properties[propertyKey]) {
            this.metadata[constructor.name].properties[propertyKey] = {
                target: null,
                jobName
            }
        }
    }
}
