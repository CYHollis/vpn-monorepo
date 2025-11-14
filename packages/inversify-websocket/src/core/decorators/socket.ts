import { MetadataRuntime } from '../metadata/index.js'

export function socket() {
    return function (constructor: Function) {
        MetadataRuntime.addConstructor(constructor)
    }
}
