import { z } from 'zod'
import { BaseConfigSchema } from './base.js'

export const MysqlConfigSchema = BaseConfigSchema.extend({
    user: z.string().min(1),
    password: z.string().min(1),
    database: z.string().min(1),
    port: z.number().min(1).max(65535).optional()
})

export type MysqlConfig = z.infer<typeof MysqlConfigSchema>
