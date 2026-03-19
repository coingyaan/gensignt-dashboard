let data = [
  {"address":"0x111","score":95,"rank":1,"streak":10},
  {"address":"0x222","score":80,"rank":2,"streak":7},
  {"address":"0x333","score":60,"rank":3,"streak":3}
];

let currentUser = null;

// Generate random user if not found
function generateUser(address) {
  return {
    address: address,
    score: Math.floor(Math.random() * 100),
    rank: Math.floor(Math.random() * 50) + 1,
    streak: Math.floor(Math.random() * 10)
  };
}

// Load wallet data
function loadData() {
  const wallet = document.getElementById("wallet").value.trim();

  if (!wallet) {
    alert("Enter wallet address");
    return;
  }

  let user = data.find(u => u.address === wallet);

  if (!user) {
    user = generateUser(wallet);
  }

  currentUser = user;

  document.getElementById("result").innerHTML = `
    <p><strong>Wallet:</strong> ${user.address}</p>
    <p>Score: ${user.score}</p>
    <p>Rank: ${user.rank}</p>
    <p>Streak: ${user.streak}</p>
  `;
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
  if (!currentUser) {
    alert("Check stats first!");
    return;
  }

  currentUser.streak += 1;
  currentUser.score += 10;

  document.getElementById("result").innerHTML = `
    <p>✅ Check-in successful!</p>
    <p>New Score: ${currentUser.score}</p>
    <p>Streak: ${currentUser.streak}</p>
  `;
}

// AI Assistant
function askAI() {
  const prompt = document.getElementById("prompt").value.toLowerCase();
  const chatbox = document.getElementById("chatbox");

  if (!currentUser) {
    alert("Load wallet first!");
    return;
  }

  chatbox.innerHTML += `<div class="message user">${prompt}</div>`;

  let response = "";

  if (prompt.includes("score")) {
    response = `Your wallet score is ${currentUser.score}.`;
  } 
  else if (prompt.includes("rank")) {
    response = `You are ranked #${currentUser.rank}.`;
  } 
  else if (prompt.includes("streak")) {
    response = `You have a ${currentUser.streak}-day activity streak.`;
  } 
  else if (prompt.includes("transactions")) {
    response = `You have approximately ${Math.floor(currentUser.score/2)} recent transactions.`;
  } 
  else if (prompt.includes("activity")) {
    response = currentUser.score > 70 
      ? "Your wallet is highly active." 
      : "Your wallet has moderate activity.";
  } 
  else {
    response = `Based on your activity score (${currentUser.score}), your wallet shows ${
      currentUser.score > 70 ? "strong engagement" : "growing usage"
    }.`;
  }

  setTimeout(() => {
    chatbox.innerHTML += `<div class="message bot">${response}</div>`;
  }, 500);
}
