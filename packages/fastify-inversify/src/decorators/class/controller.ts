import { MetadataRuntime } from '../../metadata/index.js'

export function controller(path?: string) {
    return function (constructor: Function) {
        MetadataRuntime.addConstructor(constructor, path || '')
    }
}
