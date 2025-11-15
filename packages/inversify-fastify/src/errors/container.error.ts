import { FrameworkError } from './framework.error.js'

export class ContainerError extends FrameworkError {
    constructor(message: string) {
        super(message)
        this.name = 'ContainerError'
    }
}
