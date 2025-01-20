import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import type { FastifyInstance } from 'fastify'
import { knexDb } from '../database'
import { z } from 'zod'

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const newTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = newTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // ! 7 Dias
      })
    }

    await knexDb('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, reply) => {
      const { sessionId } = req.cookies

      const transactions = await knexDb('transactions')
        .where('session_id', sessionId)
        .select()

      return {
        transactions,
      }
    }
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { sessionId } = req.cookies
      const { id } = getTransactionsParamsSchema.parse(req.params)

      // ? O ".first()" diz que só possui um resultado, então retorna somente o id
      const transaction = await knexDb('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return transaction
    }
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const summary = await knexDb('transactions')
        .where({ session_id: sessionId })
        .sum('amount', { as: 'totalAmount' })
        .first()

      return summary
    }
  )
}
