const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("tymur_website backend is running!");
});

app.post("/api/feedback", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await pool.query(
            "INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );

        res.status(201).json({ message: "Feedback saved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
