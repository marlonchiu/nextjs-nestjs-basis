import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { usersTable } from './schema'
import * as z from 'zod'

export const insertUserSchema = createInsertSchema(usersTable, {
  email: () => z.email()
})

export const updateUserSchema = insertUserSchema.pick({ email: true })

export const queryUserSchema = createSelectSchema(usersTable)
