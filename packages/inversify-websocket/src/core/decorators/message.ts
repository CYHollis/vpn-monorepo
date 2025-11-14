import { MetadataRuntime } from '../metadata/index.js'

export function message(ev: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        MetadataRuntime.addProperty(target.constructor, propertyKey, ev)
    }
}
