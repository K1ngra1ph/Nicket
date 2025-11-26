/* ========================= THEME TOGGLE ========================= */
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "🌙";
}
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* ========================= MODAL ELEMENTS ========================= */
const feedbackModal = document.getElementById('feedbackModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

const successPaymentModal = document.getElementById("successPaymentModal");
const paymentSuccessMessage = document.getElementById("paymentSuccessMessage");
const closePaymentSuccess = document.getElementById("closePaymentSuccess");
const paymentSuccessOk = document.getElementById("paymentSuccessOk");

const paymentResultModal = document.getElementById("paymentResultModal");
const paymentResultTitle = document.getElementById("paymentResultTitle");
const paymentResultMessage = document.getElementById("paymentResultMessage");
const paymentResultButtons = document.getElementById("paymentResultButtons");
const paymentIcon = document.getElementById("paymentIcon");

/* ========================= GAME LOGIC ========================= */
const grid = document.getElementById("numberGrid");
const selectedList = document.getElementById("selectedList");
const totalValueEl = document.getElementById("totalValue");
const numbers = Array.from({ length: 100 }, (_, i) => ({ number: i+1, globalCount: 0 }));
const selectedNumbers = [];

function renderGrid() {
  if (!grid) return;
  grid.innerHTML = "";
  numbers.forEach(item => {
    const box = document.createElement("div");
    box.className = "number-box";
    box.textContent = item.number;
    if (item.globalCount >= 10) box.classList.add("disabled");
    else box.addEventListener("click", () => selectNumber(item));
    grid.appendChild(box);
  });
}

function selectNumber(item) {
  if (item.globalCount >= 10) return;
  selectedNumbers.push(item.number);
  item.globalCount++;
  updateSelectedList();
  renderGrid();
}

function updateSelectedList() {
  if (!selectedList || !totalValueEl) return;
  selectedList.innerHTML = "";
  selectedNumbers.forEach(n => { 
    const span = document.createElement("span"); 
    span.textContent = n; 
    selectedList.appendChild(span); 
  });
  totalValueEl.textContent = `Total: ₦${(selectedNumbers.length * 1000).toLocaleString()}`;
}

if (document.getElementById("clearBtn")) {
  document.getElementById("clearBtn").addEventListener("click", () => {
    selectedNumbers.length = 0;
    numbers.forEach(n => n.globalCount = 0);
    updateSelectedList();
    renderGrid();
  });
}

/* ========================= MODAL FUNCTIONS ========================= */
function showPaymentSuccess(msg = "Your payment was successful!") {
  paymentSuccessMessage.textContent = msg;
  successPaymentModal.classList.add("show");
}

closePaymentSuccess.onclick = () => successPaymentModal.classList.remove("show");
paymentSuccessOk.onclick = () => successPaymentModal.classList.remove("show");

function showPaymentResult(success, message) {
  paymentResultTitle.textContent = success ? "Payment Successful!" : "Payment Failed!";
  paymentResultMessage.textContent = message || "";
  paymentIcon.innerHTML = success ? "✅" : "❌";
  paymentIcon.style.color = success ? "#22c55e" : "#ef4444";

  paymentResultButtons.innerHTML = "";
  if (success) {
    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.className = "success";
    okBtn.onclick = () => window.location.href = "/";
    paymentResultButtons.appendChild(okBtn);
  } else {
    const tryBtn = document.createElement("button");
    tryBtn.textContent = "Try Again";
    tryBtn.className = "accent";
    tryBtn.onclick = () => { paymentResultModal.style.display = "none"; document.getElementById("submitBtn")?.click(); };
    const homeBtn = document.createElement("button");
    homeBtn.textContent = "Home";
    homeBtn.className = "danger";
    homeBtn.onclick = () => window.location.href = "/";
    paymentResultButtons.appendChild(tryBtn);
    paymentResultButtons.appendChild(homeBtn);
  }

  paymentResultModal.style.display = "flex";
}

function showModal(name, eventValue, email, phone, countryCode) {
  modalTitle.textContent = "Registration Successful 🎉";
  modalMessage.innerHTML = `
    <p style="font-size:16px; line-height:1.6;">
      Thank you, <strong>${name}</strong>! You’ve successfully registered for
      <strong>${eventValue}</strong>.
    </p>
    <div style="background:#f1f5f9; padding:12px 15px; border-radius:8px; margin-top:15px; text-align:left;">
      <h4 style="margin:0 0 8px;">🎮 Game Rules:</h4>
      <ul style="margin:0; padding-left:20px; line-height:1.6;">
        <li>Pick your numbers carefully — once submitted, you can’t change them.</li>
        <li>Winners will be announced before the event day.</li>
        <li>Ensure your contact details are correct to receive your VIP/Backstage ticket.</li>
        <li>Incomplete or invalid registrations may be disqualified.</li>
      </ul>
    </div>
    <p style="margin-top:18px;">Click <strong>OK</strong> to continue to the game page.</p>
  `;

  localStorage.setItem("userData", JSON.stringify({
    name: name.trim(),
    email: email.trim(),
    phone: `${countryCode}${phone.trim()}`,
    eventValue: eventValue.trim()
  }));

  feedbackModal.classList.add("show");
}

modalCloseBtn.onclick = () => {
  feedbackModal.classList.remove("show");
  setTimeout(() => window.location.href = "game.html", 300);
};
closeModalBtn.onclick = () => feedbackModal.classList.remove("show");

/* ========================= FORM SUBMISSION ========================= */
document.getElementById('submitBtn')?.addEventListener('click', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const countryCode = document.getElementById('countryCode').value.trim();
  const eventValue = document.getElementById('event').value.trim();

  if (!name || !email || !phone || !eventValue) {
    modalTitle.textContent = "Error";
    modalTitle.style.color = "#dc2626";
    modalMessage.textContent = "Please fill in all required fields.";
    feedbackModal.classList.add("show");
    return;
  }

  showModal(name, eventValue, email, phone, countryCode);
});

/* ========================= PAYMENT INITIATION ========================= */
document.getElementById("confirmPaymentBtn")?.addEventListener("click", async () => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.name || selectedNumbers.length === 0) {
    showPaymentResult(false, "Please select numbers and register first.");
    return;
  }
  const totalAmount = selectedNumbers.length * 1000;

  try {
    const res = await fetch("https://nicket-backend.onrender.com/api/payments/initiate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        eventValue: userData.eventValue,
        selectedNumbers,
        amount: totalAmount
      })
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    if (!data.checkoutUrl) throw new Error("Missing checkout URL from backend");
    window.location.href = data.checkoutUrl;
  } catch (err) {
    console.error("Payment initiation error:", err);
    showPaymentResult(false, "Unable to start payment. Try again.");
  }
});

/* ========================= PAYMENT VERIFICATION ========================= */
async function verifyPayment(reference) {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const res = await fetch(`https://nicket-backend.onrender.com/api/payments/verify-payment?reference=${reference}`);
      const data = await res.json();

      if (data.success) {
        showPaymentSuccess("Your payment was confirmed successfully 🎉");
        return;
      }
      if (attempts < maxAttempts) await new Promise(r => setTimeout(r, 3000));
    } catch (err) {
      console.error("Verification error:", err);
      break;
    }
  }
  // If verification fails after retries → redirect to game page with fail modal
  window.location.href = `game.html?failed=true&reference=${reference}`;
}

/* ========================= CHECK PAYMENT ON PAGE LOAD ========================= */
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get("paymentReference") || urlParams.get("reference");
if (reference) verifyPayment(reference);

/* ========================= INITIALIZE GRID ========================= */
renderGrid();
updateSelectedList();
