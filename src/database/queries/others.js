const db = require('../../config/db')

/**
 * EXISTS BY COLUMN
 * @param {string} table - nama tabel
 * @param {string} column - nama kolom
 * @param {any} value - nilai yang dicari
 * @returns {Promise<boolean>} true jika ditemukan, false jika tidak
 */
async function existsByColumn(table, column, value) {
  const query = `SELECT 1 FROM ${table} WHERE ${column} = $1 LIMIT 1`;
  const result = await db.query(query, [value]);
  return result.rows.length > 0;
}

/**
 * FIND BY COLUMN
 * @param {string} table - nama tabel
 * @param {string} column - nama kolom
 * @param {any} value - nilai yang dicari
 * @param {string[]} [selectFields=['*']] - field yang ingin di-select (opsional)
 * @returns {Promise<Object|null>} data record atau null jika tidak ditemukan
 */
async function findByColumn(table, column, value, selectFields = ['*']) {
  const fields = selectFields.join(', ');
  const query = `SELECT ${fields} FROM ${table} WHERE ${column} = $1 LIMIT 1`;
  const result = await db.query(query, [value]);
  return result.rows[0] || null;
}

module.exports = {
  existsByColumn,
  findByColumn
}