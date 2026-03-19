let userWallet = null;
let userScore = 0;
let userStreak = 0;
let nextCheckinTime = null;

// Connect wallet
async function connectWallet() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  userWallet = accounts[0];

  document.getElementById("walletAddress").innerText =
    "Connected: " + userWallet;
}

// Check-in (with signature)
async function checkIn() {
  if (!userWallet) {
    alert("Connect wallet first");
    return;
  }

  try {
    const message = "GenSignt Check-in";

    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, userWallet]
    });

    const res = await fetch("http://localhost:3000/checkin", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        wallet: userWallet,
        signature
      })
    });

    const data = await res.json();

    if (data.error) {
      if (data.nextCheckin) {
        nextCheckinTime = data.nextCheckin;
        startTimer();
      }
      alert(data.error);
      return;
    }

    userScore = data.score;
    userStreak = data.streak;

    document.getElementById("result").innerText =
      `Score: ${userScore} | Streak: ${userStreak}`;

  } catch {
    alert("Signature rejected");
  }
}

// Get score
async function getScore() {
  const res = await fetch(`http://localhost:3000/score/${userWallet}`);
  const data = await res.json();

  userScore = data.score;
  userStreak = data.streak;
  nextCheckinTime = data.lastCheckin
    ? data.lastCheckin + 86400000
    : null;

  document.getElementById("result").innerText =
    `Score: ${userScore} | Streak: ${userStreak}`;

  startTimer();
}

// Timer
function startTimer() {
  if (!nextCheckinTime) return;

  const timer = document.getElementById("timer");

  setInterval(() => {
    const now = Date.now();
    const diff = nextCheckinTime - now;

    if (diff <= 0) {
      timer.innerText = "You can check-in now";
      return;
    }

    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    timer.innerText = `Next check-in in ${hours}h ${mins}m`;
  }, 1000);
}

// Leaderboard
async function loadLeaderboard() {
  const res = await fetch("http://localhost:3000/leaderboard");
  const data = await res.json();

  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.innerText = `${u.wallet} — ${u.score} (🔥 ${u.streak})`;
    list.appendChild(li);
  });
}

// AI Intelligence
function askAI() {
  const prompt = document.getElementById("prompt").value.toLowerCase();
  const chat = document.getElementById("chatbox");

  chat.innerHTML += `<p>You: ${prompt}</p>`;

  let response = "";

  if (userScore === 0) {
    response = "You are inactive. Start building your streak.";
  }
  else if (userStreak >= 5) {
    response = "Strong consistency. Your streak shows commitment.";
  }
  else if (userScore > 50) {
    response = "You are progressing well. Keep consistency.";
  }
  else {
    response = "Early-stage user. Stay active daily.";
  }

  chat.innerHTML += `<p>AI: ${response}</p>`;
}
