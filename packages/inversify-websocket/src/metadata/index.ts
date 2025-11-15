export interface Metadata {
    [constructorName: string]: {
        target: Function | null
        properties: {
            [propertyKey: string]: {
                target: Function | null
                parameters: string[]
                ev: string
            }
        }
    }
}

function createProxy<T extends object>(target: T) {
    return new Proxy(target, {
        set(target, p, newValue) {
            target[p as keyof T] = newValue
            return true
        }
    })
}

export class MetadataRuntime {
    public static metadata: Metadata = {}

    public static addConstructor(constructor: Function) {
        // 只有不存在这个类才添加新的类
        if (!this.metadata[constructor.name]) {
            this.metadata[constructor.name] = {
                target: constructor,
                properties: {}
            }
        }
    }

    public static addProperty(
        constructor: Function,
        propertyKey: string,
        ev: string
    ) {
        // 如果不存在这个类, 先添加类
        if (!this.metadata[constructor.name]) {
            this.addConstructor(constructor)
        }
        const properties = createProxy(
            this.metadata[constructor.name].properties
        )
        // 如果不存在这个方法, 添加方法
        if (!properties[propertyKey]) {
            properties[propertyKey] = {
                target: null,
                parameters: [],
                ev
            }
            return
        }
        // 如果这个方法存在, 修改ev值
        properties[propertyKey].ev = ev
    }

    public static addParameter(
        constructor: Function,
        propertyKey: string,
        parameter: string,
        parameterIndex: number
    ) {
        // 如果不存在这个类, 先添加类
        if (!this.metadata[constructor.name]) {
            this.addConstructor(constructor)
        }
        // 如果不存在这个方法, 先添加方法
        const property = createProxy(this.metadata[constructor.name].properties)
        if (!property[propertyKey]) {
            this.addProperty(constructor, propertyKey, '')
        }
        // 只有不存在这个参数才添加新的参数
        const parameters = createProxy(property[propertyKey].parameters)
        if (!parameters[parameterIndex]) {
            parameters[parameterIndex] = parameter
        }
    }
}
