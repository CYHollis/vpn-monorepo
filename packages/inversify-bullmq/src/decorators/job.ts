import { JobsOptions } from 'bullmq'
import { MetadataRuntime } from '../metadata/index.js'

export function job(jobName: string, jobOptions?: JobsOptions) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        MetadataRuntime.addProperty(
            target.constructor,
            propertyKey,
            jobName,
            jobOptions || {}
        )
    }
}
