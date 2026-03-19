const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let scores = [];
let lastCheckin = {};
let streaks = {};
let logs = [];

// Verify signature
function verifySignature(wallet, signature) {
  const message = "GenSignt Check-in";
  const recovered = ethers.verifyMessage(message, signature);
  return recovered.toLowerCase() === wallet.toLowerCase();
}

// Check-in
app.post("/checkin", (req, res) => {
  const { wallet, signature } = req.body;

  if (!verifySignature(wallet, signature)) {
    return res.json({ error: "Invalid signature" });
  }

  const now = Date.now();
  const last = lastCheckin[wallet];

  if (last && now - last < 86400000) {
    const next = last + 86400000;
    return res.json({
      error: "Already checked in",
      nextCheckin: next
    });
  }

  let index = users.indexOf(wallet);

  if (index !== -1) {
    scores[index] += 10;
  } else {
    users.push(wallet);
    scores.push(10);
  }

  // streak logic
  if (last && now - last < 172800000) {
    streaks[wallet] = (streaks[wallet] || 1) + 1;
  } else {
    streaks[wallet] = 1;
  }

  lastCheckin[wallet] = now;

  logs.push({
    wallet,
    action: "check-in",
    time: new Date().toISOString()
  });

  res.json({
    score: scores[users.indexOf(wallet)],
    streak: streaks[wallet]
  });
});

// Score
app.get("/score/:wallet", (req, res) => {
  const wallet = req.params.wallet;

  let index = users.indexOf(wallet);
  let score = index !== -1 ? scores[index] : 0;

  res.json({
    score,
    streak: streaks[wallet] || 0,
    lastCheckin: lastCheckin[wallet] || null
  });
});

// Leaderboard
app.get("/leaderboard", (req, res) => {
  let board = users.map((u,i) => ({
    wallet: u,
    score: scores[i],
    streak: streaks[u] || 0
  }));

  board.sort((a,b) => b.score - a.score);

  res.json(board);
});

// Logs
app.get("/logs", (req, res) => {
  res.json(logs);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
