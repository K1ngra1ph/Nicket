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

/* ========================= SAFE ONCLICK BINDINGS ========================= */
closePaymentSuccess?.addEventListener("click", () => {
  successPaymentModal?.classList.remove("show");
});
paymentSuccessOk?.addEventListener("click", () => {
  successPaymentModal?.classList.remove("show");
});

modalCloseBtn?.addEventListener("click", () => {
  feedbackModal?.classList.remove("show");
  setTimeout(() => window.location.href = "game.html", 300);
});
closeModalBtn?.addEventListener("click", () => feedbackModal?.classList.remove("show"));

/* ========================= MODAL FUNCTIONS ========================= */
function showPaymentSuccess(msg = "Your payment was successful!") {
  if (!paymentSuccessMessage || !successPaymentModal) return;
  paymentSuccessMessage.textContent = msg;
  successPaymentModal.classList.add("show");
}

function showPaymentResult(success, message) {
  if (!paymentResultModal || !paymentResultTitle || !paymentResultMessage || !paymentResultButtons || !paymentIcon) return;

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
    tryBtn.onclick = () => { 
      paymentResultModal.style.display = "none"; 
      document.getElementById("submitBtn")?.click(); 
    };

    const homeBtn = document.createElement("button");
    homeBtn.textContent = "Home";
    homeBtn.className = "danger";
    homeBtn.onclick = () => window.location.href = "/";

    paymentResultButtons.appendChild(tryBtn);
    paymentResultButtons.appendChild(homeBtn);
  }

  paymentResultModal.style.display = "flex";
}

/* ========================= REGISTRATION MODAL ========================= */
function showModal(name, eventValue, email, phone, countryCode) {
  if (!modalTitle || !modalMessage || !feedbackModal) return;

  modalTitle.textContent = "Registration Successful 🎉";
  modalMessage.innerHTML = `
    <p style="font-size:16px; line-height:1.6;">
      Thank you, <strong>${name}</strong>! You’ve successfully registered for
      <strong>${eventValue}</strong>.
    </p>
  `;

  localStorage.setItem("userData", JSON.stringify({
    name: name.trim(),
    email: email.trim(),
    phone: `${countryCode}${phone.trim()}`,
    eventValue: eventValue.trim()
  }));

  feedbackModal.classList.add("show");
}

/* ========================= FORM SUBMISSION ========================= */
document.getElementById('submitBtn')?.addEventListener('click', e => {
  e.preventDefault();

  const name = document.getElementById('name')?.value.trim() || "";
  const email = document.getElementById('email')?.value.trim() || "";
  const phone = document.getElementById('phone')?.value.trim() || "";
  const countryCode = document.getElementById('countryCode')?.value.trim() || "";
  const eventValue = document.getElementById('event')?.value.trim() || "";

  if (!name || !email || !phone || !eventValue) {
    modalTitle.textContent = "Error";
    modalMessage.textContent = "Please fill in all required fields.";
    feedbackModal?.classList.add("show");
    return;
  }

  showModal(name, eventValue, email, phone, countryCode);
});

/* ========================= PAYMENT INITIATION ========================= */
document.getElementById("confirmPaymentBtn")?.addEventListener("click", async () => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const selectedNumbers = JSON.parse(localStorage.getItem("selectedNumbers") || "[]");

  if (!userData.name || selectedNumbers.length === 0) {
    showPaymentResult(false, "Please select numbers and register first.");
    return;
  }

  const totalAmount = selectedNumbers.length * 1000;

  try {
    const res = await fetch("https://nicket-backend.onrender.com/api/payments/initiate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, selectedNumbers, amount: totalAmount })
    });

    const data = await res.json();
    if (!res.ok || !data.checkoutUrl) throw new Error();

    window.location.href = data.checkoutUrl;
  } catch {
    showPaymentResult(false, "Unable to start payment.");
  }
});

/* ========================= PAYMENT VERIFICATION ========================= */
async function verifyPayment(reference) {
  try {
    const res = await fetch(`https://nicket-backend.onrender.com/api/payments/verify-payment?reference=${encodeURIComponent(reference)}`);
    const data = await res.json();

    if (data.success) {
      showPaymentSuccess("Your payment was confirmed successfully 🎉");
    } else {
      showPaymentResult(false, "Payment not found or failed.");
    }
  } catch {
    showPaymentResult(false, "Verification error.");
  }
}

/* ========================= CHECK PAYMENT ON LOAD ========================= */
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get("paymentReference") || urlParams.get("reference");
if (reference) verifyPayment(reference);
