let userWallet = null;
let userScore = 0;

// Connect wallet
async function connectWallet() {
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
}

// Get score
async function getScore() {
  if (!userWallet) return;

  const res = await fetch(`http://localhost:3000/score/${userWallet}`);
  const data = await res.json();

  userScore = data.score;

  document.getElementById("result").innerText =
    "Score: " + userScore;
}

// Check-in
async function checkIn() {
  if (!userWallet) return;

  const res = await fetch("http://localhost:3000/checkin", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ wallet: userWallet })
  });

  const data = await res.json();
  userScore = data.score;

  document.getElementById("result").innerText =
    "Score: " + userScore;
}

// Load logs
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

// AI Assistant (INTELLIGENCE LAYER)
function askAI() {
  const prompt = document.getElementById("prompt").value.toLowerCase();
  const chat = document.getElementById("chatbox");

  chat.innerHTML += `<p><b>You:</b> ${prompt}</p>`;

  let response = "";

  // 🧠 Intelligence logic

  if (!userWallet) {
    response = "Connect your wallet first so I can analyze your activity.";
  }

  else if (prompt.includes("score")) {
    response = `Your current onchain score is ${userScore}.`;
  }

  else if (prompt.includes("activity")) {
    if (userScore === 0) {
      response = "Your wallet has no activity yet. Start with a check-in.";
    } 
    else if (userScore < 30) {
      response = "Your activity is low. You are just getting started.";
    } 
    else if (userScore < 80) {
      response = "You have moderate activity. Keep interacting to grow.";
    } 
    else {
      response = "You are a highly active user on GenSignt.";
    }
  }

  else if (prompt.includes("improve")) {
    response = "To improve your score, perform daily check-ins and stay active.";
  }

  else if (prompt.includes("rank")) {
    if (userScore > 80) {
      response = "You are likely among top users on the leaderboard.";
    } else {
      response = "Increase your score to climb the leaderboard.";
    }
  }

  else if (prompt.includes("insight")) {
    response = generateInsight();
  }

  else {
    response = generateInsight();
  }

  chat.innerHTML += `<p><b>AI:</b> ${response}</p>`;
}

// 🧠 Dynamic insight generator
function generateInsight() {
  if (userScore === 0) {
    return "No activity detected. Your wallet is inactive.";
  }

  if (userScore < 30) {
    return "Early-stage wallet. Growth potential is high.";
  }

  if (userScore < 80) {
    return "Consistent user. You are building solid engagement.";
  }

  return "Power user detected. Strong engagement and high activity.";
}
