import { MetadataRuntime } from '../../metadata/index.js'

export function Header(paramName: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        MetadataRuntime.addParameter(
            target.constructor,
            propertyKey,
            parameterIndex,
            paramName,
            'headers'
        )
    }
}
