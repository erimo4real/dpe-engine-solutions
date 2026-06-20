import pool from './pool.js'

function parseSelect(selectStr) {
  if (!selectStr || selectStr === '*') return { join: null }
  const match = selectStr.match(/(\w+)(?:!(\w+))?\(([^)]+)\)/)
  if (!match) return { join: null }
  const [, table, joinType = 'left', cols] = match
  return {
    join: {
      table,
      type: joinType === 'inner' ? 'INNER' : 'LEFT',
      columns: cols.split(',').map((c) => c.trim()),
    },
  }
}

function singularize(word) {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
  if (word.endsWith('ses') || word.endsWith('xes')) return word.slice(0, -2)
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

class QueryBuilder {
  constructor(table) {
    this._table = table
    this._filters = []
    this._orders = []
    this._selected = '*'
    this._single = false
    this._insertData = null
    this._updateData = null
    this._isDelete = false
    this._isInsert = false
    this._isUpdate = false
    this._returning = false
  }

  select(cols) {
    this._selected = cols || '*'
    return this
  }

  eq(field, value) {
    this._filters.push({ field, value, op: '=' })
    return this
  }

  ilike(field, pattern) {
    this._filters.push({ field, value: pattern, op: 'ILIKE' })
    return this
  }

  order(field, opts = {}) {
    this._orders.push({ field, dir: opts.ascending !== false ? 'ASC' : 'DESC' })
    return this
  }

  single() {
    this._single = true
    return this
  }

  insert(rows) {
    this._isInsert = true
    this._insertData = rows
    return this
  }

  update(values) {
    this._isUpdate = true
    this._updateData = values
    return this
  }

  delete() {
    this._isDelete = true
    return this
  }

  async _runSelect() {
    const parsed = parseSelect(this._selected)
    const mainAlias = 't'
    let selectCols = `${mainAlias}.*`
    let joins = ''
    const params = []
    let paramIdx = 1
    const whereClauses = []

    if (parsed.join) {
      const { table, type, columns } = parsed.join
      const fkCol = `${singularize(table)}_id`
      const pkCol = 'id'
      const joinCols = columns.map((c) => `'${c}', ${table}.${c}`).join(', ')
      selectCols = `${mainAlias}.*, jsonb_build_object(${joinCols}) as ${table}`
      joins = ` ${type} JOIN ${table} ON ${table}.${pkCol} = ${mainAlias}.${fkCol}`
    }

    for (const f of this._filters) {
      if (parsed.join && f.field.startsWith(`${parsed.join.table}.`)) {
        const col = f.field.split('.')[1]
        whereClauses.push(`${parsed.join.table}.${col} ${f.op} $${paramIdx++}`)
      } else {
        whereClauses.push(`${mainAlias}.${f.field} ${f.op} $${paramIdx++}`)
      }
      params.push(f.value)
    }

    let sql = `SELECT ${selectCols} FROM ${this._table} ${mainAlias}${joins}`
    if (whereClauses.length) sql += ` WHERE ${whereClauses.join(' AND ')}`
    if (this._orders.length) {
      const orderClauses = this._orders.map((o) => `${mainAlias}.${o.field} ${o.dir}`)
      sql += ` ORDER BY ${orderClauses.join(', ')}`
    }
    if (this._single) sql += ' LIMIT 1'

    try {
      const result = await pool.query(sql, params)
      const rows = result.rows.map((r) => {
        if (parsed.join && r[parsed.join.table] && typeof r[parsed.join.table] === 'object') {
          const cat = r[parsed.join.table]
          if (Object.values(cat).every((v) => v === null)) {
            delete r[parsed.join.table]
          }
        }
        return r
      })
      return { data: this._single ? rows[0] || null : rows, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async _runInsert() {
    if (!this._insertData || !this._insertData.length) {
      return { data: null, error: { message: 'No data to insert' } }
    }
    const row = this._insertData[0]
    const keys = Object.keys(row)
    const vals = keys.map((k) => (typeof row[k] === 'object' && row[k] !== null ? JSON.stringify(row[k]) : row[k]))
    const cols = keys.join(', ')
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const sql = `INSERT INTO ${this._table} (${cols}) VALUES (${placeholders}) RETURNING *`

    try {
      const result = await pool.query(sql, vals)
      return { data: this._single ? result.rows[0] : result.rows, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async _runUpdate() {
    if (!this._updateData) return { data: null, error: { message: 'No data to update' } }
    const keys = Object.keys(this._updateData)
    const vals = keys.map((k) => (typeof this._updateData[k] === 'object' && this._updateData[k] !== null ? JSON.stringify(this._updateData[k]) : this._updateData[k]))
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
    let paramIdx = keys.length + 1
    const whereClauses = []
    const whereVals = []

    for (const f of this._filters) {
      whereClauses.push(`${f.field} = $${paramIdx++}`)
      whereVals.push(f.value)
    }

    const sql = `UPDATE ${this._table} SET ${setClauses}${whereClauses.length ? ` WHERE ${whereClauses.join(' AND ')}` : ''} RETURNING *`

    try {
      const result = await pool.query(sql, [...vals, ...whereVals])
      return { data: this._single ? result.rows[0] : result.rows, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async _runDelete() {
    const params = []
    let paramIdx = 1
    const whereClauses = []
    for (const f of this._filters) {
      whereClauses.push(`${f.field} = $${paramIdx++}`)
      params.push(f.value)
    }
    const sql = `DELETE FROM ${this._table}${whereClauses.length ? ` WHERE ${whereClauses.join(' AND ')}` : ''}`

    try {
      await pool.query(sql, params)
      return { data: null, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async then(resolve, reject) {
    try {
      let result
      if (this._isInsert) result = await this._runInsert()
      else if (this._isUpdate) result = await this._runUpdate()
      else if (this._isDelete) result = await this._runDelete()
      else result = await this._runSelect()
      resolve(result)
    } catch (err) {
      reject(err)
    }
  }
}

const localSupabase = {
  from: (table) => new QueryBuilder(table),
}

export default localSupabase
