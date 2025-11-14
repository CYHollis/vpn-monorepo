import { MetadataRuntime } from '../metadata'

export function queue(queueName: string) {
    return function (constructor: Function) {
        MetadataRuntime.addConstructor(constructor, queueName)
    }
}
