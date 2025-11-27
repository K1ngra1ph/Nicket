function $(id) {
  return document.getElementById(id);
}

/* ========================= MODALS ========================= */
const resultModal = $("paymentResultModal");
const resultTitle = $("paymentResultTitle");
const resultMsg = $("paymentResultMessage");
const resultButtons = $("paymentResultButtons");
const resultIcon = $("paymentIcon");

/* ========================= SHOW RESULT ========================= */
function showPaymentResult(success, message) {
  if (!resultModal) return;

  resultTitle.textContent = success ? "Payment Successful!" : "Payment Failed!";
  resultMsg.textContent = message || "";
  resultIcon.innerHTML = success ? "✅" : "❌";
  resultIcon.style.color = success ? "#28a745" : "#dc3545";

  resultButtons.innerHTML = "";

  if (success) {
    const ok = document.createElement("button");
    ok.textContent = "OK";
    ok.onclick = () => (window.location.href = "index.html");
    resultButtons.appendChild(ok);
  } else {
    const retry = document.createElement("button");
    retry.textContent = "Try Again";
    retry.onclick = () => window.location.reload();

    const home = document.createElement("button");
    home.textContent = "Home";
    home.onclick = () => (window.location.href = "index.html");

    resultButtons.appendChild(retry);
    resultButtons.appendChild(home);
  }

  resultModal.style.display = "flex";
}

/* ========================= VERIFY PAYMENT ========================= */
async function verifyPayment(reference) {
  try {
    const res = await fetch(
      `https://nicket-backend.onrender.com/api/payments/verify-payment?reference=${encodeURIComponent(reference)}`
    );

    if (!res.ok) {
      showPaymentResult(false, "Verification error.");
      return;
    }

    const data = await res.json();

    if (data.success) {
      showPaymentResult(true, "Payment confirmed successfully.");
    } else {
      showPaymentResult(false, "Payment failed or not found.");
    }
  } catch {
    showPaymentResult(false, "Unable to verify payment at this time.");
  }
}

/* ========================= CHECK ON PAGE LOAD ========================= */
(function () {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("paymentReference");

  if (ref) verifyPayment(ref);
})();
