import { MetadataRuntime } from '../metadata/index.js'

export function param(paramName: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        MetadataRuntime.addParameter(
            target.constructor,
            propertyKey,
            paramName,
            parameterIndex
        )
    }
}
