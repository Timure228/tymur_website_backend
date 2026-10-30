const feedbackRepository = require("../repositories/repository.js");

function createFeedback({ name, email, message }) {
    if (!name || !email || !message) {
        const err = new Error("name, email and message are required");
        err.status = 400;
        throw err;
    }
    return feedbackRepository.create({ name, email, message });
}

module.exports = { createFeedback };