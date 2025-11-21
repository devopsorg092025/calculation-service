const express = require("express");
const axios = require("axios");
const cors = require("cors");
 
const app = express();
app.use(express.json());
app.use(cors());
 
// Middleware: verify JWT using auth-service
async function authMiddleware(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "No token provided" });
 
    // Call auth-service to verify token
    const response = await axios.get("http://localhost:5000/auth/verify", {
      headers: { Authorization: token }
    });
 
    if (response.data.valid) {
      req.user = response.data.user; // store user info
      next();
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
 
// Routes
app.post("/calc/add", authMiddleware, (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a + b });
});
 
app.post("/calc/subtract", authMiddleware, (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a - b });
});
 
app.post("/calc/multiply", authMiddleware, (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a * b });
});
 
app.post("/calc/divide", authMiddleware, (req, res) => {
  const { a, b } = req.body;
  if (b === 0) return res.status(400).json({ error: "Cannot divide by zero" });
  res.json({ result: a / b });
});
 
app.listen(5001, () => console.log("Calc service running on port 5001"));

