const CONTRACT = "0x6D8aF45fe6bbaB46c58Ffd56224d033cA3187765";

let currentUser = null;

// Simulated onchain memory (until SDK integration)
let users = [];
let scores = [];

// Get score
function getScore() {
  const wallet = document.getElementById("wallet").value.trim();

  if (!wallet) {
    alert("Enter wallet address");
    return;
  }

  let index = users.indexOf(wallet);

  let score = index !== -1 ? scores[index] : 0;

  currentUser = wallet;

  document.getElementById("result").innerHTML = `
    <p><strong>Wallet:</strong> ${wallet}</p>
    <p>Score (onchain logic): ${score}</p>
    <p style="color:#94a3b8;">Contract: ${CONTRACT}</p>
  `;
}

// Check-in (matches contract logic)
function checkIn() {
  if (!currentUser) {
    alert("Load wallet first!");
    return;
  }

  let index = users.indexOf(currentUser);

  if (index !== -1) {
    scores[index] += 10;
  } else {
    users.push(currentUser);
    scores.push(10);
  }

  document.getElementById("result").innerHTML = `
    <p>✅ Check-in successful (GenLayer Testnet)</p>
    <p>New Score: ${scores[users.indexOf(currentUser)]}</p>
    <p style="color:#94a3b8;">Contract: ${CONTRACT}</p>
  `;
}

// AI Assistant (now smarter)
function askAI() {
  const prompt = document.getElementById("prompt").value.toLowerCase();
  const chatbox = document.getElementById("chatbox");

  if (!currentUser) {
    alert("Load wallet first!");
    return;
  }

  chatbox.innerHTML += `<div class="message user">${prompt}</div>`;

  let index = users.indexOf(currentUser);
  let score = index !== -1 ? scores[index] : 0;

  let response = "";

  if (prompt.includes("score")) {
    response = `Your onchain score is ${score}.`;
  } 
  else if (prompt.includes("rank")) {
    response = "Leaderboard integration coming soon.";
  } 
  else if (prompt.includes("activity")) {
    response = score > 50
      ? "Your wallet is highly active on GenLayer."
      : "Your wallet is still building activity.";
  } 
  else {
    response = `Based on your onchain score (${score}), your wallet shows ${
      score > 50 ? "strong engagement" : "early-stage activity"
    }.`;
  }

  setTimeout(() => {
    chatbox.innerHTML += `<div class="message bot">${response}</div>`;
  }, 500);
}
