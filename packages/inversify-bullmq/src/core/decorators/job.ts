import { MetadataRuntime } from '../metadata'

export function job(jobName: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        MetadataRuntime.addProperty(target.constructor, propertyKey, jobName)
    }
}
