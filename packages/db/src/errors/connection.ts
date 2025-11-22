import { DatabaseError } from './database.js'

export class ConnectionError extends DatabaseError {
    constructor(message: string) {
        super(message)
        this.name = 'ConnectionError'
    }
}
