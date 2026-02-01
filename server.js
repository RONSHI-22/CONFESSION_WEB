require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve static files from public

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Schema
const confessionSchema = new mongoose.Schema({
    name: String,
    gender: String,
    confess: String,
    date: { type: Date, default: Date.now }
});

const Confession = mongoose.model("Confession", confessionSchema);

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Submit confession
app.post("/confess", async (req, res) => {
    try {
        await Confession.create({
            name: req.body.Name,
            gender: req.body.Gender,
            confess: req.body.Confess
        });
        res.redirect("/"); // redirect to homepage after submit
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Fetch confessions
app.get("/confessions", async (req, res) => {
    try {
        const confessions = await Confession.find()
            .sort({ date: -1 })
            .limit(20);
        res.json(confessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch confessions" });
    }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
