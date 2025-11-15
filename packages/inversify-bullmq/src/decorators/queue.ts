import { MetadataRuntime } from '../metadata/index.js'

export function queue(queueName: string) {
    return function (constructor: Function) {
        MetadataRuntime.addConstructor(constructor, queueName)
    }
}
