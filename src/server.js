const express = require("express");
const cors = require("cors");
const feedbackRoutes = require("./routes/router.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});