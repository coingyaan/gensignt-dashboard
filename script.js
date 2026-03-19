let userWallet = null;

const GENLAYER = {
  chainId: "0x107D"
};

// Utility: set loading
function setLoading(button, state) {
  if (state) {
    button.disabled = true;
    button.innerText = "Loading...";
  } else {
    button.disabled = false;
  }
}

// Connect wallet
async function connectWallet() {
  const btn = event.target;
  setLoading(btn, true);

  try {
    if (!window.ethereum) {
      alert("Install wallet");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    userWallet = accounts[0];

    document.getElementById("walletAddress").innerText =
      "Connected: " + userWallet;

  } catch (err) {
    alert("Connection failed");
  }

  setLoading(btn, false);
  btn.innerText = "Connect Wallet";
}

// Check-in
async function checkIn() {
  const btn = event.target;
  setLoading(btn, true);

  if (!userWallet) {
    alert("Connect wallet first");
    setLoading(btn, false);
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

  setLoading(btn, false);
  btn.innerText = "Check-in";
}

// Get score
async function getScore() {
  const btn = event.target;
  setLoading(btn, true);

  if (!userWallet) {
    alert("Connect wallet first");
    setLoading(btn, false);
    return;
  }

  const res = await fetch(`http://localhost:3000/score/${userWallet}`);
  const data = await res.json();

  document.getElementById("result").innerText =
    "Score: " + data.score;

  setLoading(btn, false);
  btn.innerText = "Get Score";
}

// Leaderboard
async function loadLeaderboard() {
  const btn = event.target;
  setLoading(btn, true);

  const res = await fetch("http://localhost:3000/leaderboard");
  const data = await res.json();

  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.innerText = `${u.wallet} — ${u.score}`;
    list.appendChild(li);
  });

  setLoading(btn, false);
  btn.innerText = "Load";
}

// Logs
async function loadLogs() {
  const btn = event.target;
  setLoading(btn, true);

  const res = await fetch("http://localhost:3000/logs");
  const data = await res.json();

  const list = document.getElementById("logs");
  list.innerHTML = "";

  data.forEach(l => {
    const li = document.createElement("li");
    li.innerText = `${l.wallet} → ${l.action}`;
    list.appendChild(li);
  });

  setLoading(btn, false);
  btn.innerText = "Load";
}

// AI
function askAI() {
  const chat = document.getElementById("chatbox");
  const prompt = document.getElementById("prompt").value;

  chat.innerHTML += `<p>You: ${prompt}</p>`;
  chat.innerHTML += `<p>AI: Processing your request...</p>`;
}
