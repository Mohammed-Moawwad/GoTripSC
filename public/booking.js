document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const results = document.getElementById("results");

  function clearResults() {
    results.innerHTML =
      '<p class="muted">No results yet — use the form above to start a search.</p>';
  }

  function showError(msg) {
    results.innerHTML = `<p style="color:#b00020;font-weight:600">${msg}</p>`;
  }

  function renderResults(data) {
    if (!data || data.length === 0) {
      results.innerHTML = '<p class="muted">No results found.</p>';
      return;
    }
    const list = document.createElement("div");
    data.forEach((item) => {
      const el = document.createElement("div");
      el.className = "card";
      el.style.marginBottom = "0.8rem";
      el.innerHTML = `
        <strong>${item.title}</strong>
        <div class="muted">${item.sub}</div>
        <div style="margin-top:.5rem"><button class="btn-primary" data-id="${item.id}">Book</button></div>
      `;
      list.appendChild(el);
    });
    results.innerHTML = "";
    results.appendChild(list);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dest = form.destination.value.trim();
    const checkin = form.checkin.value;
    const checkout = form.checkout.value;
    const guests = Number(form.guests.value) || 1;
    if (!dest) {
      showError("Please enter a destination.");
      return;
    }
    if (!checkin || !checkout) {
      showError("Please enter both check-in and check-out dates.");
      return;
    }
    if (new Date(checkout) <= new Date(checkin)) {
      showError("Check-out must be after check-in.");
      return;
    }

    // Fake search results (demo)
    const nights = Math.round(
      (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
    );
    const resultsData = [
      {
        id: "a1",
        title: `${dest} — Cozy Hotel`,
        sub: `${nights} night(s) · ${guests} guest(s) · $${(
          60 * nights
        ).toFixed(2)}`,
      },
      {
        id: "b2",
        title: `${dest} — Budget Stay`,
        sub: `${nights} night(s) · ${guests} guest(s) · $${(
          40 * nights
        ).toFixed(2)}`,
      },
      {
        id: "c3",
        title: `${dest} — Premium Inn`,
        sub: `${nights} night(s) · ${guests} guest(s) · $${(
          120 * nights
        ).toFixed(2)}`,
      },
    ];

    renderResults(resultsData);
  });

  // Delegate book button clicks inside results
  results.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    alert(
      "Booking demo: " +
        id +
        "\nThis is a demo. Integrate with backend to complete booking."
    );
  });

  clearResults();
});
