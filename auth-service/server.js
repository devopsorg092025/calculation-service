const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "your_jwt_secret"; // change in production

const db = mysql.createPool({
  host: "host.docker.internal",
  user: "calcuser",
  password: "CalcPass123!",
  database: "calc_users"
});

// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "User already exists or DB error" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

  if (rows.length === 0) return res.status(400).json({ error: "User not found" });

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Verify
app.get("/auth/verify", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

app.listen(5000, () => console.log("Auth service running on port 5000"));

app.get("/", (req, res) => {
  res.send("✅ Auth service is running");
});
