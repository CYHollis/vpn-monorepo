import { z } from 'zod'

export const BaseConfigSchema = z.object({
    host: z.string().min(1).optional()
})

export type BaseConfig = z.infer<typeof BaseConfigSchema>
