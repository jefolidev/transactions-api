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
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const transactions = await knexDb('transactions').select()

    return {
      transactions,
    }
  })

  app.get('/:id', async (req) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(req.params)

    // ? O ".first()" diz que só possui um resultado, então retorna somente o id
    const transaction = await knexDb('transactions').where('id', id).first()

    return transaction
  })

  app.get('/summary', async () => {
    const summary = await knexDb('transactions')
      .sum('amount', { as: 'totalAmount' })
      .first()

    return summary
  })
}
