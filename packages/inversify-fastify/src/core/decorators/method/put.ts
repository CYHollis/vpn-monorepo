import { MetadataRuntime } from '../../metadata'

export function Put(path: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        MetadataRuntime.addProperty(
            target.constructor,
            propertyKey,
            path,
            'put'
        )
    }
}
