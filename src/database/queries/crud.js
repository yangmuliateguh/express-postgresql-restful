const db = require('../../config/db')

/**
 * CREATE
 * @param {string} table - nama tabel
 * @param {object} data = key-value pair kolom dan nilai
*/
async function create(table, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, i) => `$${i+1}`).join(', ')

    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`
    const result = await db.query(query, values)
    return result.rows[0]
}

/**
 * GET ALL
 * @param {string} table - nama tabel
*/
async function getAll(table) {
    const query = `SELECT * FROM ${table}`
    const result = await db.query(query)
    return result.rows
}

/**
 * GET BY ID
 * @param {string} table - nama tabel
 * @param {string} idColumn - nama kolom ID
 * @param {any} idValue - nilai ID
*/
async function getById(table, idColumn, idValue) {
    const query = `SELECT * FROM ${table} WHERE ${idColumn} = $1`
    const result = await db.query(query, [idValue])
    return result.rows[0]
}

/**
 * UPDATE
 * @param {string} table - nama tabel
 * @param {string} idColumn - nama kolom ID
 * @param {any} idValue - nilai ID
 * @param {object} data - key-value pair kolom dan nilai baru
*/
async function update(table, idColumn, idValue, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')

    const query = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = $${keys.length + 1} RETURNING *`
    const result = await db.query(query, [...values, idValue])
    return result.rows[0]
}

/**
 * DELETE
 * @param {string} table - nama tabel
 * @param {string} idColumn - nama kolom ID
 * @param {any} idValue - nilai ID
*/
async function remove(table, idColumn, idValue) {
    const query = `DELETE FROM ${table} WHERE ${idColumn} = $1 RETURNING *`
    const result = await db.query(query, [idValue])
    return result.rows[0]
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
}