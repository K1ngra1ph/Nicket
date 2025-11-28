function $id(id) {
  return document.getElementById(id);
}

/* ========================= VERIFY PAYMENT (Backend) ========================= */
async function payment_verify(reference) {
  if (!reference) throw new Error("Missing reference");

  const url = `https://nicket-backend.onrender.com/api/payments/verify-payment?reference=${encodeURIComponent(reference)}`;
  const res = await fetch(url);

  let data;
  try {
    data = await res.json();
  } catch (e) {
    return { ok: false, status: res.status, data: null };
  }

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

  const hide = () => {
    modal.classList.remove("show");
    modal.style.display = "none";
  };

  if (closeBtn) closeBtn.onclick = hide;
  if (okBtn) okBtn.onclick = hide;
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

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "accent";
    retry.textContent = "Try Again";
    retry.onclick = () => {
      modal.style.display = "none";
      const btn = $id("submitBtn");
      if (btn) btn.click();
      else window.location.reload();
    };

    const home = document.createElement("button");
    home.type = "button";
    home.className = "danger";
    home.textContent = "Home";
    home.onclick = () => (window.location.href = "/");

    buttons.appendChild(retry);
    buttons.appendChild(home);
  }

  modal.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);

  const paymentReference = params.get("paymentReference");
  const failedFlag = params.get("failed");

  if (!paymentReference) return;

  if (failedFlag === "true") {
    payment_showFailure("Payment failed or incomplete.");
    return;
  }

  const verify = await payment_verify(paymentReference);

  if (!verify.ok || !verify.data || verify.data.success !== true) {
    payment_showFailure("Payment could not be verified.");
    return;
  }

  payment_showSuccess("Payment verified successfully! 🎉");
});
