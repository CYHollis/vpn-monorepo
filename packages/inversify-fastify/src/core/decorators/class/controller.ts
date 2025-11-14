import { MetadataRuntime } from '../../metadata'

export function controller(path?: string) {
    return function (constructor: Function) {
        MetadataRuntime.addConstructor(constructor, path || '')
    }
}
