let data = [
  {"address":"0x111","score":95,"rank":1,"streak":10},
  {"address":"0x222","score":80,"rank":2,"streak":7},
  {"address":"0x333","score":60,"rank":3,"streak":3}
];

// Load wallet data
function loadData() {
  const wallet = document.getElementById("wallet").value;
  const user = data.find(u => u.address === wallet);

  const result = document.getElementById("result");

  if (user) {
    result.innerHTML = `
      <p>Score: ${user.score}</p>
      <p>Rank: ${user.rank}</p>
      <p>Streak: ${user.streak}</p>
    `;
  } else {
    result.innerHTML = "Wallet not found";
  }
}

// Leaderboard
function loadLeaderboard() {
  const list = document.getElementById("leaderboard");

  data.forEach(user => {
    const li = document.createElement("li");
    li.innerText = `${user.address} — Score: ${user.score}`;
    list.appendChild(li);
  });
}

loadLeaderboard();

// Daily check-in
function checkIn() {
  document.getElementById("result").innerHTML =
    "✅ Daily check-in successful! +10 points";
}

// AI Assistant
function askAI() {
  const prompt = document.getElementById("prompt").value;
  const chatbox = document.getElementById("chatbox");

  chatbox.innerHTML += `<div class="message user">${prompt}</div>`;

  let p = prompt.toLowerCase();
  let response = "";

  if (p.includes("transactions")) {
    response = "You have 12 recent transactions. Most are contract interactions.";
  } else if (p.includes("activity")) {
    response = "Your wallet is moderately active with a strong engagement score.";
  } else if (p.includes("rank")) {
    response = "You are ranked in the top leaderboard on GenSignt.";
  } else if (p.includes("volume")) {
    response = "Your transaction volume is trending upward.";
  } else {
    response = "AI insight: Your wallet shows consistent and healthy activity.";
  }

  setTimeout(() => {
    chatbox.innerHTML += `<div class="message bot">${response}</div>`;
  }, 500);
}