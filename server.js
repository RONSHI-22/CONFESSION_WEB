require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from project root
app.use(express.static(__dirname));

/* ======================
   MONGODB CONNECTION
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

/* ======================
   SCHEMA & MODEL
====================== */
const confessionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gender: { type: String, required: true },
  confess: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now }
});

const Confession = mongoose.model("Confession", confessionSchema);

/* ======================
   ROUTES
====================== */

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Submit confession
app.post("/confess", async (req, res) => {
  console.log("📥 Incoming POST data:", req.body); // logs form data

  try {
    const { name, gender, confess } = req.body;

    // Validate input
    if (!name || !gender || !confess) {
      console.warn("⚠️ Missing fields:", req.body);
      return res.status(400).send("All fields are required");
    }

    await Confession.create({ name, gender, confess });
    res.redirect("/");
  } catch (err) {
    console.error("❌ Error saving confession:", err);
    res.status(500).send("Internal Server Error");
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
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch confessions" });
  }
});

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
