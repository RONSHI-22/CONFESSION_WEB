require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Schema
const confessionSchema = new mongoose.Schema({
    name: String,
    gender: String,
    confess: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Confession = mongoose.model("Confession", confessionSchema);

// routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// submit confession
app.post("/confess", async (req, res) => {
    await Confession.create({
        name: req.body.Name,
        gender: req.body.Gender,
        confess: req.body.Confess
    });

    res.redirect("/");
});

// fetch confessions
app.get("/confessions", async (req, res) => {
    const confessions = await Confession.find()
        .sort({ date: -1 })
        .limit(20);

    res.json(confessions);
});

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
