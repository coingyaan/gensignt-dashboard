let userWallet = null;

// Connect wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  userWallet = accounts[0];

  document.getElementById("walletAddress").innerText =
    "Connected: " + userWallet;
}

// Check-in
async function checkIn() {
  if (!userWallet) {
    alert("Connect wallet first");
    return;
  }

  const res = await fetch("http://localhost:3000/checkin", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ wallet: userWallet })
  });

  const data = await res.json();

  document.getElementById("result").innerText =
    "Score: " + data.score;
}

// Get score
async function getScore() {
  if (!userWallet) return;

  const res = await fetch(`http://localhost:3000/score/${userWallet}`);
  const data = await res.json();

  document.getElementById("result").innerText =
    "Score: " + data.score;
}

// Leaderboard
async function loadLeaderboard() {
  const res = await fetch("http://localhost:3000/leaderboard");
  const data = await res.json();

  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.innerText = `${u.wallet} — ${u.score}`;
    list.appendChild(li);
  });
}

// Logs
async function loadLogs() {
  const res = await fetch("http://localhost:3000/logs");
  const data = await res.json();

  const list = document.getElementById("logs");
  list.innerHTML = "";

  data.forEach(l => {
    const li = document.createElement("li");
    li.innerText = `${l.wallet} → ${l.action}`;
    list.appendChild(li);
  });
}

// AI
function askAI() {
  const prompt = document.getElementById("prompt").value.toLowerCase();
  const chat = document.getElementById("chatbox");

  chat.innerHTML += `<p>You: ${prompt}</p>`;

  let response = "Wallet activity looks stable.";

  if (prompt.includes("score")) {
    response = "Use 'Get Score' to check real onchain score.";
  }

  chat.innerHTML += `<p>AI: ${response}</p>`;
}
