const feedbackService = require("../services/feedbackService");

function createFeedback(req, res) {
    try {
        feedbackService.createFeedback(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
}

module.exports = { createFeedback };