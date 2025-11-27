function $id(id) {
  return document.getElementById(id);
}

async function payment_verify(reference) {
  if (!reference) throw new Error("Missing reference");
  const url = `https://nicket-backend.onrender.com/api/payments/verify-payment?reference=${encodeURIComponent(reference)}`;
  const res = await fetch(url);
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

/* ========================= SUCCESS MODAL (index.html) ========================= */
function payment_showSuccess(message = "Your payment was confirmed successfully 🎉") {
  const modal = $id("successPaymentModal");
  const msgEl = $id("paymentSuccessMessage");
  const closeBtn = $id("closePaymentSuccess");
  const okBtn = $id("paymentSuccessOk");

  if (!modal) return;

  if (msgEl) msgEl.textContent = message;
  modal.classList.add("show");
  modal.style.display = "flex";

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove("show");
      modal.style.display = "none";
    };
  }
  if (okBtn) {
    okBtn.onclick = () => {
      modal.classList.remove("show");
      modal.style.display = "none";
    };
  }
}

/* ========================= FAILURE MODAL (game.html) ========================= */
function payment_showFailure(message = "Payment failed or could not be verified.") {
  const modal = $id("paymentResultModal");
  const title = $id("paymentResultTitle");
  const msgEl = $id("paymentResultMessage");
  const buttons = $id("paymentResultButtons");
  const icon = $id("paymentIcon");

  if (!modal) {
    alert(message);
    return;
  }

  if (title) title.textContent = "Payment Failed!";
  if (msgEl) msgEl.textContent = message;
  if (icon) {
    icon.innerHTML = "❌";
    icon.style.color = "#ef4444";
  }

  if (buttons) {
    buttons.innerHTML = "";

    const tryBtn = document.createElement("button");
    tryBtn.type = "button";
    tryBtn.className = "accent";
    tryBtn.textContent = "Try Again";
    tryBtn.onclick = () => {
      modal.style.display = "none";
      const submitBtn = $id("submitBtn");
      if (submitBtn) submitBtn.click();
      else window.location.reload();
    };

    const homeBtn = document.createElement("button");
    homeBtn.type = "button";
    homeBtn.className = "danger";
    homeBtn.textContent = "Home";
    homeBtn.onclick = () => (window.location.href = "/");

    buttons.appendChild(tryBtn);
    buttons.appendChild(homeBtn);
  }

  modal.style.display = "flex";
}
