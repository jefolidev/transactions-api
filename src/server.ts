import fastify from 'fastify'
import { env } from '../env'
import { knexDb } from './database'

const app = fastify()

app.get('/hello', async () => {
  const tables = knexDb('sqlite_schema').select('*')

  return await tables
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('🔥 HTTP Server Running!'))
