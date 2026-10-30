const db = require("../db");

function create({ name, email, message }) {
    return db.prepare(`
        INSERT INTO feedback (name, email, message, created_at)
        VALUES (?, ?, ?, datetime('now'))
    `).run(name, email, message);
}

module.exports = { create };