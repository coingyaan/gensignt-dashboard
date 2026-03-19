const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let scores = [];
let logs = [];

// Check-in
app.post("/checkin", (req, res) => {
  const { wallet } = req.body;

  let index = users.indexOf(wallet);

  if (index !== -1) {
    scores[index] += 10;
  } else {
    users.push(wallet);
    scores.push(10);
  }

  logs.push({
    wallet,
    action: "check-in"
  });

  res.json({ score: scores[users.indexOf(wallet)] });
});

// Score
app.get("/score/:wallet", (req, res) => {
  const wallet = req.params.wallet;

  let index = users.indexOf(wallet);
  let score = index !== -1 ? scores[index] : 0;

  res.json({ score });
});

// Leaderboard
app.get("/leaderboard", (req, res) => {
  let board = users.map((u,i) => ({
    wallet: u,
    score: scores[i]
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
