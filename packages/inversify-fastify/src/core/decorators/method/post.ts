import { MetadataRuntime } from '../../metadata'

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
