const API_BASE_URL = "http://localhost:3000/api";

// State
let allBookings = [];
let filteredBookings = [];
let currentFilter = "all";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadBookings();
  bindEvents();
});

// Load all hotel bookings
async function loadBookings() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/all`);
    const result = await response.json();

    if (result.success) {
      // Filter only hotel bookings
      allBookings = result.data.bookings.filter(
        (booking) => booking.service_type === "hotel"
      );
      filteredBookings = [...allBookings];

      renderBookingsTable();
      updateStatistics();
    } else {
      showError("Failed to load bookings");
    }
  } catch (error) {
    console.error("Error loading bookings:", error);
    showError("Error connecting to server");
  }
}

// Render bookings table
function renderBookingsTable() {
  const tbody = document.getElementById("bookings-table-body");

  if (filteredBookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11">
          <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>No bookings found</h3>
            <p>No hotel bookings match your current filters</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredBookings
    .map(
      (booking) => `
    <tr>
      <td><strong>${booking.booking_id}</strong></td>
      <td>
        <div>${booking.user_name || "N/A"}</div>
        <small style="color: #6b7280;">${booking.user_email || ""}</small>
      </td>
      <td>
        <div><strong>${booking.hotel_name}</strong></div>
        <small style="color: #6b7280;">${booking.city}, ${
        booking.country
      }</small>
      </td>
      <td>${formatDate(booking.check_in_date)}</td>
      <td>${formatDate(booking.check_out_date)}</td>
      <td>${booking.number_of_rooms}</td>
      <td>${booking.number_of_guests}</td>
      <td><strong>$${parseFloat(booking.total_price).toFixed(2)}</strong></td>
      <td><span class="status-badge status-${booking.booking_status.toLowerCase()}">${
        booking.booking_status
      }</span></td>
      <td><span class="payment-badge payment-${booking.payment_status.toLowerCase()}">${
        booking.payment_status
      }</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view-btn" onclick="viewBookingDetails('${
            booking.booking_id
          }')" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit-btn" onclick="updateBookingStatus('${
            booking.booking_id
          }')" title="Update Status">
            <i class="fas fa-edit"></i>
          </button>
          ${
            booking.booking_status === "Confirmed"
              ? `<button class="action-btn delete-btn" onclick="cancelBooking('${booking.booking_id}')" title="Cancel Booking">
            <i class="fas fa-times"></i>
          </button>`
              : ""
          }
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

// Update statistics
function updateStatistics() {
  const total = allBookings.length;
  const pending = allBookings.filter(
    (b) => b.booking_status === "Pending"
  ).length;
  const confirmed = allBookings.filter(
    (b) => b.booking_status === "Confirmed"
  ).length;
  const revenue = allBookings
    .filter((b) => b.payment_status === "Paid")
    .reduce((sum, b) => sum + parseFloat(b.total_price), 0);

  document.getElementById("totalBookings").textContent = total;
  document.getElementById("pendingBookings").textContent = pending;
  document.getElementById("confirmedBookings").textContent = confirmed;
  document.getElementById("totalRevenue").textContent = `$${revenue.toFixed(
    2
  )}`;
}

// Bind events
function bindEvents() {
  // Search
  const searchInput = document.querySelector(".search-input");
  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });

  // Status filters
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const status = e.currentTarget.getAttribute("data-status");
      handleStatusFilter(status);

      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });

  // Date filter
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  startDate.addEventListener("change", applyDateFilter);
  endDate.addEventListener("change", applyDateFilter);

  document.querySelector(".clear-date-btn").addEventListener("click", () => {
    startDate.value = "";
    endDate.value = "";
    applyDateFilter();
  });

  // Logout
  document.querySelector(".logout-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "../../LoginPage/login.html";
    }
  });
}

// Handle search
function handleSearch(query) {
  const lowerQuery = query.toLowerCase();

  filteredBookings = allBookings.filter((booking) => {
    const matchesStatus =
      currentFilter === "all" || booking.booking_status === currentFilter;
    const matchesSearch =
      booking.booking_id.toLowerCase().includes(lowerQuery) ||
      (booking.user_name &&
        booking.user_name.toLowerCase().includes(lowerQuery)) ||
      (booking.user_email &&
        booking.user_email.toLowerCase().includes(lowerQuery)) ||
      booking.hotel_name.toLowerCase().includes(lowerQuery) ||
      booking.city.toLowerCase().includes(lowerQuery);

    return matchesStatus && matchesSearch;
  });

  renderBookingsTable();
}

// Handle status filter
function handleStatusFilter(status) {
  currentFilter = status;

  if (status === "all") {
    filteredBookings = [...allBookings];
  } else {
    filteredBookings = allBookings.filter((b) => b.booking_status === status);
  }

  renderBookingsTable();
}

// Apply date filter
function applyDateFilter() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate && !endDate) {
    filteredBookings = [...allBookings];
  } else {
    filteredBookings = allBookings.filter((booking) => {
      const checkIn = new Date(booking.check_in_date);
      const start = startDate ? new Date(startDate) : new Date("1900-01-01");
      const end = endDate ? new Date(endDate) : new Date("2100-12-31");

      return checkIn >= start && checkIn <= end;
    });
  }

  renderBookingsTable();
}

// View booking details
function viewBookingDetails(bookingId) {
  const booking = allBookings.find((b) => b.booking_id === bookingId);
  if (!booking) return;

  const nights = calculateNights(booking.check_in_date, booking.check_out_date);
  const pricePerNight = booking.total_price / nights;

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div style="grid-column: 1 / -1; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px; color: white;">
        <h3 style="margin: 0 0 8px; font-size: 22px;">Booking #${
          booking.booking_id
        }</h3>
        <p style="margin: 0; opacity: 0.9;">Created: ${formatDateTime(
          booking.created_at
        )}</p>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Guest Name</div>
        <div style="font-weight: 600; color: #1f2937;">${
          booking.user_name || "N/A"
        }</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Email</div>
        <div style="font-weight: 600; color: #1f2937;">${
          booking.user_email || "N/A"
        }</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Hotel</div>
        <div style="font-weight: 600; color: #1f2937;">${
          booking.hotel_name
        }</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Location</div>
        <div style="font-weight: 600; color: #1f2937;">${booking.city}, ${
    booking.country
  }</div>
      </div>

      <div style="padding: 16px; background: #dbeafe; border-radius: 8px;">
        <div style="color: #1e40af; font-size: 13px; margin-bottom: 4px;">Check-in</div>
        <div style="font-weight: 700; color: #1e3a8a; font-size: 18px;">${formatDate(
          booking.check_in_date
        )}</div>
      </div>

      <div style="padding: 16px; background: #dbeafe; border-radius: 8px;">
        <div style="color: #1e40af; font-size: 13px; margin-bottom: 4px;">Check-out</div>
        <div style="font-weight: 700; color: #1e3a8a; font-size: 18px;">${formatDate(
          booking.check_out_date
        )}</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Number of Rooms</div>
        <div style="font-weight: 600; color: #1f2937; font-size: 18px;">${
          booking.number_of_rooms
        }</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Number of Guests</div>
        <div style="font-weight: 600; color: #1f2937; font-size: 18px;">${
          booking.number_of_guests
        }</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Nights</div>
        <div style="font-weight: 600; color: #1f2937; font-size: 18px;">${nights}</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Price per Night</div>
        <div style="font-weight: 600; color: #10b981; font-size: 18px;">$${pricePerNight.toFixed(
          2
        )}</div>
      </div>

      <div style="padding: 16px; background: #dcfce7; border-radius: 8px; border: 2px solid #10b981;">
        <div style="color: #166534; font-size: 13px; margin-bottom: 4px;">Total Price</div>
        <div style="font-weight: 700; color: #166534; font-size: 24px;">$${parseFloat(
          booking.total_price
        ).toFixed(2)}</div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Booking Status</div>
        <div><span class="status-badge status-${booking.booking_status.toLowerCase()}">${
    booking.booking_status
  }</span></div>
      </div>

      <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Payment Status</div>
        <div><span class="payment-badge payment-${booking.payment_status.toLowerCase()}">${
    booking.payment_status
  }</span></div>
      </div>
    </div>
  `;

  document.getElementById("bookingDetailsModal").style.display = "flex";
}

// Close details modal
function closeDetailsModal() {
  document.getElementById("bookingDetailsModal").style.display = "none";
}

// Update booking status
async function updateBookingStatus(bookingId) {
  const newStatus = prompt(
    "Enter new status (Pending/Confirmed/Cancelled/Completed):"
  );

  if (!newStatus) return;

  const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];
  if (!validStatuses.includes(newStatus)) {
    alert(
      "Invalid status. Please use: Pending, Confirmed, Cancelled, or Completed"
    );
    return;
  }

  try {
    // You'll need to create this endpoint in your backend
    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Booking status updated successfully!");
      loadBookings();
    } else {
      alert("Failed to update status: " + result.message);
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Error updating booking status");
  }
}

// Cancel booking
async function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingId}/cancel`,
      {
        method: "PUT",
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Booking cancelled successfully!");
      loadBookings();
    } else {
      alert("Failed to cancel booking: " + result.message);
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    alert("Error cancelling booking");
  }
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function showError(message) {
  const tbody = document.getElementById("bookings-table-body");
  tbody.innerHTML = `
    <tr>
      <td colspan="11">
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
          <h3>Error</h3>
          <p>${message}</p>
        </div>
      </td>
    </tr>
  `;
}
