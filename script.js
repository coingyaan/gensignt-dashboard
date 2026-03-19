let userWallet = null;

// GenLayer network config
const GENLAYER = {
  chainId: "0x107D", // 4221
  chainName: "GenLayer Testnet",
  nativeCurrency: {
    name: "GEN",
    symbol: "GEN",
    decimals: 18
  },
  rpcUrls: ["https://genlayer-testnet.rpc.caldera.xyz/http"],
  blockExplorerUrls: []
};

// Connect wallet + switch network
async function connectWallet() {
  if (!window.ethereum) {
    alert("Install any EVM wallet (MetaMask, Rabby, OKX)");
    return;
  }

  try {
    // Request accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    userWallet = accounts[0];

    // Check network
    const chainId = await window.ethereum.request({
      method: "eth_chainId"
    });

    if (chainId !== GENLAYER.chainId) {
      await switchToGenLayer();
    }

    document.getElementById("walletAddress").innerText =
      "Connected: " + userWallet;

  } catch (err) {
    console.log(err);
    alert("Wallet connection failed");
  }
}

// Switch network
async function switchToGenLayer() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GENLAYER.chainId }]
    });
  } catch (switchError) {
    // If network not added
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [GENLAYER]
      });
    } else {
      alert("Failed to switch network");
    }
  }
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
  if (!userWallet) {
    alert("Connect wallet first");
    return;
  }

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

// AI Assistant
function askAI() {
  const prompt = document.getElementById("prompt").value.toLowerCase();
  const chat = document.getElementById("chatbox");

  chat.innerHTML += `<p>You: ${prompt}</p>`;

  let response = "Your wallet is active on GenLayer Testnet.";

  if (prompt.includes("score")) {
    response = "Use Get Score to fetch your real data.";
  }

  chat.innerHTML += `<p>AI: ${response}</p>`;
}
