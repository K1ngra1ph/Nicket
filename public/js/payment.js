async function startPayment(data) {
    try {
        const response = await fetch("https://nicketvip.onrender.com/api/payments/initiate-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.checkoutUrl) {
            window.location.href = result.checkoutUrl;
        } else {
            alert(result.message || "Payment failed to start.");
        }
    } catch (err) {
        alert("Network error, try again.");
        console.error(err);
    }
}

function showPaymentStatus() {
    const url = new URL(window.location.href);
    const status = url.searchParams.get("status");

    if (status === "success") {
        alert("Payment Successful! 🎉");
    } else if (status === "failed") {
        alert("Payment Failed ❌ Try again.");
    }
}
