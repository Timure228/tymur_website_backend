const feedbackRepository = require("../repositories/repository.js");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createFeedback({ name, email, message }) {
    if (typeof name != "string" || typeof email != "string" || typeof message != "string") {
        const err = new Error("name, email and message should be of type string!");
        err.status = 400;
        throw err;
    }

    if (!name || !email || !message) {
        const err = new Error("name, email and message are required");
        err.status = 400;
        throw err;
    }
    
    if (!EMAIL_REGEX.test(email)) {
        const err = new Error("Invalid email address");
        err.status = 400;
        throw err;
    }

    return feedbackRepository.create({ name, email, message });
}

module.exports = { createFeedback };