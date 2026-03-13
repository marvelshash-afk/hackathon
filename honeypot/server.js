import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let logs = [];

// For browser check
app.get("/", (req, res) => {
  res.send("🛡 Threat Zero Honeypot running");
});

// Honeypot trap endpoint
app.post("/login", (req, res) => {

  const attackerIP = req.ip;
  const payload = req.body;

  const log = {
    id: Date.now(),
    ip: attackerIP,
    payload,
    time: new Date().toISOString()
  };

  logs.push(log);

  console.log("🚨 Attacker trapped:", log);

  res.json({
    status: "success",
    message: "Fake login accepted"
  });
});

// Logs endpoint
app.get("/logs", (req, res) => {
  res.json(logs);
});

app.listen(5001, () => {
  console.log("🛡 Honeypot running on http://localhost:5001");
});