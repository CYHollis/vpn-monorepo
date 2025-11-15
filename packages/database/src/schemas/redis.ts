import { z } from 'zod'
import { BaseConfigSchema } from './base.js'

export const RedisConfigSchema = BaseConfigSchema.extend({
    maxRetriesPerRequest: z.number().min(1).optional().nullable(),
    db: z.number().min(0).optional(),
    port: z.number().min(1).max(65535).optional()
})

export type RedisConfig = z.infer<typeof RedisConfigSchema>
