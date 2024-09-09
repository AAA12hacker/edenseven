const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const session = require("express-session");
const Script = require("./models/Script");
const User = require("./models/User");
const app = express();
require("dotenv").config();
// Connect Database
connectDB();

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "your_secret_key_here",
    resave: false,
    saveUninitialized: true,
  })
);

// Schedule another cron job to clean up old script recommendations
cron.schedule("0 0 * * *", async () => {
  // 2:40 AM UTC
  try {
    console.log("Cron job started to clean up old recommendations");

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago

    await Script.deleteMany({
      usageCount: { $lt: 5 }, // Remove recommendations with usage count < 5
      lastUsedAt: { $lt: threeDaysAgo }, // Remove if not used in the last 3 days
    });

    console.log("Old script recommendations cleaned up successfully.");
  } catch (error) {
    console.error("Error cleaning up recommendations:", error);
  }
});

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/music", require("./routes/music"));
app.use("/userstats", require("./routes/datarep"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/scripts", require("./routes/scripts"));
app.use("/api/recommendations", require("./routes/recommendations"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
