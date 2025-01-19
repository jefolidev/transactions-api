import 'dotenv/config'
import knex from 'knex'

export const config: knex.Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL!,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knexDb = knex(config)
