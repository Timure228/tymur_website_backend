const db = require("../db");

function create({ name, email, message }) {
    return db.prepare(`
        INSERT INTO feedback (name, email, message, created_at)
        VALUES (?, ?, ?, datetime('now'))
    `).run(name, email, message);
}

function findAll() {
    return db.prepare(
        `
        SELECT id, name, email, message, created_at
        FROM feedback
        ORDER BY created_at DESC
    `).all()
}

module.exports = { create, findAll };