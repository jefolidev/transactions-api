import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knexDb } from '../database'

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const newTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = newTransactionBodySchema.parse(req.body)

    await knexDb('transactions').insert({
      id: crypto.randomUUID(),
      amount: type === 'credit' ? amount : amount * -1,
      type,
      created_at: new Date(),
    })

    return reply.status(201).send()
  })
}
