import { MetadataRuntime } from '../../metadata'

export function Delete(path: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        MetadataRuntime.addProperty(
            target.constructor,
            propertyKey,
            path,
            'delete'
        )
    }
}
