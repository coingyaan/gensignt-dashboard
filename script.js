let userWallet = null;
let userScore = 0;

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
    // 🔥 Wallet signature popup
    await window.ethereum.request({
      method: "personal_sign",
      params: ["GenSignt Check-in", userWallet]
    });

    const res = await fetch("http://localhost:3000/checkin", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ wallet: userWallet })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    userScore = data.score;

    document.getElementById("result").innerText =
      "✅ Check-in successful | Score: " + userScore;

  } catch (err) {
    alert("Signature rejected");
  }
}

// Get score
async function getScore() {
  const res = await fetch(`http://localhost:3000/score/${userWallet}`);
  const data = await res.json();

  userScore = data.score;

  document.getElementById("result").innerText =
    "Score: " + userScore;
}

// AI
function askAI() {
  const prompt = document.getElementById("prompt").value.toLowerCase();
  const chat = document.getElementById("chatbox");

  chat.innerHTML += `<p>You: ${prompt}</p>`;

  let response = "";

  if (userScore === 0) {
    response = "No activity yet. Start by checking in.";
  } else if (userScore < 50) {
    response = "You are growing steadily.";
  } else {
    response = "Strong activity detected.";
  }

  chat.innerHTML += `<p>AI: ${response}</p>`;
}
