import { MetadataRuntime } from '../../metadata/index.js'

export function Post(path: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        MetadataRuntime.addProperty(
            target.constructor,
            propertyKey,
            path,
            'post'
        )
    }
}
