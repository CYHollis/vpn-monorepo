import { MetadataRuntime } from '../../metadata/index.js'

export function Param(paramName: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        MetadataRuntime.addParameter(
            target.constructor,
            propertyKey,
            parameterIndex,
            paramName,
            'params'
        )
    }
}
