function $id(id) {
  return document.getElementById(id);
}

/* ========================= VERIFY PAYMENT (Backend) ========================= */
async function payment_verify(paymentReference) {
  if (!paymentReference) throw new Error("Missing paymentReference");
  console.log("🔍 [DEBUG] Calling backend verify for:", paymentReference);

  const url = `https://nicket-backend.onrender.com/api/payments/verify/${encodeURIComponent(paymentReference)}`;

  try {
    const res = await fetch(url);
    const data = await res.json().catch(() => null);

    console.log("🔍 [DEBUG] Backend verify response:", data);

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error("❌ [DEBUG] Error fetching payment verification:", err);
    return { ok: false, status: 500, data: null };
  }
}

/* ========================= SUCCESS MODAL ========================= */
function payment_showSuccess(message = "Your payment was confirmed successfully 🎉") {
  console.log("✅ [DEBUG] Showing success modal:", message);
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

/* ========================= FAILURE MODAL ========================= */
function payment_showFailure(message = "Payment failed or could not be verified.") {
  console.log("❌ [DEBUG] Showing failure modal:", message);
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

/* ========================= BRIDGE VERIFICATION WITH RETRY ========================= */
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const failedFlag = params.get("failed");
  let paymentReference = params.get("paymentReference");
  const transactionReference = params.get("transactionReference");

  if (failedFlag === "true") {
    payment_showFailure("Payment failed or incomplete.");
    return;
  }
  if (!paymentReference && transactionReference) {
    try {
      console.log("🔍 [DEBUG] Resolving paymentReference from transactionReference:", transactionReference);
      const res = await fetch(`https://nicket-backend.onrender.com/api/payments/get-payment-reference?transactionReference=${encodeURIComponent(transactionReference)}`);
      const data = await res.json();
      console.log("🔍 [DEBUG] get-payment-reference response:", data);

      if (res.ok && data && data.paymentReference) {
        paymentReference = data.paymentReference;
        window.history.replaceState({}, "", `${window.location.pathname}?paymentReference=${encodeURIComponent(paymentReference)}`);
      } else {
        payment_showFailure("Unable to resolve payment reference.");
        return;
      }
    } catch (err) {
      console.error("❌ [DEBUG] Network error while resolving paymentReference:", err);
      payment_showFailure("Network error while resolving payment reference.");
      return;
    }
  }

  if (!paymentReference) {
    payment_showFailure("Payment reference is missing.");
    return;
  }

  let attempts = 0;
  const maxAttempts = 10;
  const delay = 1500;

  while (attempts < maxAttempts) {
    try {
      console.log(`🔄 [DEBUG] Attempt ${attempts + 1} verifying payment...`);
      const verify = await payment_verify(paymentReference);

      if (verify.ok && verify.data && verify.data.success === true) {
        const status = verify.data.paymentStatus?.toUpperCase();
        console.log("🔍 [DEBUG] Current payment status:", status, verify.data.amountPaid);

        if (status === "PAID" || status === "SUCCESSFUL") {
          payment_showSuccess(`Payment verified successfully! 🎉 Amount: ₦${verify.data.amountPaid}`);
          return;
        } else if (status === "FAILED") {
          payment_showFailure(`Payment failed. Amount: ₦${verify.data.amountPaid}`);
          return;
        }
      } else {
        console.warn("⚠️ [DEBUG] Backend verification not ready yet or invalid:", verify);
      }
    } catch (err) {
      console.error("❌ [DEBUG] Error during payment verification:", err);
    }

    attempts++;
    await new Promise(r => setTimeout(r, delay));
  }

  payment_showFailure("Payment could not be verified. Try again later.");
});
