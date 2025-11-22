export type DataLocation = 'body' | 'params' | 'headers' | ''

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | ''

export interface Metadata {
    [constructorName: string]: {
        target: Function | null
        path: string
        properties: {
            [propertyKey: string]: {
                target: Function | null
                parameters: {
                    name: string
                    location: DataLocation
                }[]
                path: string
                method: HttpMethod
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

    public static addConstructor(constructor: Function, path: string) {
        // 只有不存在这个类才添加新的类
        if (!this.metadata[constructor.name]) {
            this.metadata[constructor.name] = {
                target: constructor,
                properties: {},
                path
            }
            return
        }
        // 如果存在, 修改path值
        this.metadata[constructor.name].path = path
    }

    public static addProperty(
        constructor: Function,
        propertyKey: string,
        path: string,
        method: HttpMethod
    ) {
        // 如果不存在这个类, 先添加类
        if (!this.metadata[constructor.name]) {
            this.addConstructor(constructor, '')
        }
        const properties = createProxy(
            this.metadata[constructor.name].properties
        )
        // 只有方法不存在, 才添加新方法
        if (!properties[propertyKey]) {
            properties[propertyKey] = {
                target: null,
                parameters: [],
                path,
                method
            }
            return
        }
        // 如果这个方法存在, 修改path和method的值
        properties[propertyKey].path = path
        properties[propertyKey].method = method
    }

    public static addParameter(
        constructor: Function,
        propertyKey: string,
        parameterIndex: number,
        name: string,
        location: DataLocation
    ) {
        // 如果不存在这个类, 先添加类
        if (!this.metadata[constructor.name]) {
            this.addConstructor(constructor, '')
        }
        // 如果不存在这个方法, 先添加方法
        const property = createProxy(this.metadata[constructor.name].properties)
        if (!property[propertyKey]) {
            this.addProperty(constructor, propertyKey, '', '')
        }
        // 只有不存在这个参数才添加新的参数
        const parameters = createProxy(property[propertyKey].parameters)
        if (!parameters[parameterIndex]) {
            parameters[parameterIndex] = {
                name,
                location
            }
        }
    }
}
