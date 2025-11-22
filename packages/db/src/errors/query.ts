import { DatabaseError } from './database.js'

export class QueryError extends DatabaseError {
    constructor(message: string) {
        super(message)
        this.name = 'QueryError'
    }
}
