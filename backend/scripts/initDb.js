import 'dotenv/config'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DB_NAME = process.env.DB_NAME || 'dpe_engine_solutions'

async function initDb() {
  // Step 1: Create database if it doesn't exist
  const adminPool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  })

  try {
    const { rows } = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    )
    if (rows.length === 0) {
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`)
      console.log(`Created database: ${DB_NAME}`)
    } else {
      console.log(`Database ${DB_NAME} already exists`)
    }
  } catch (err) {
    console.error('Failed to create database:', err.message)
    process.exit(1)
  } finally {
    await adminPool.end()
  }

  // Step 2: Run schema
  const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: DB_NAME,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  })

  try {
    const sql = readFileSync(join(__dirname, '..', 'src', 'config', 'schema.sql'), 'utf8')
    await pool.query(sql)
    console.log('Schema applied successfully')
  } catch (err) {
    console.error('Failed to apply schema:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }

  console.log('Database initialization complete!')
}

initDb()
