// API Base URL
const API_BASE_URL = "http://localhost:3000/api";

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Get current user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
function checkAuth() {
  const token = getAuthToken();
  const user = getCurrentUser();

  if (!token || !user) {
    window.location.href = "/Login/login.html";
    return false;
  }
  return true;
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  if (!checkAuth()) return;

  const user = getCurrentUser();

  // Update user info in UI
  document.getElementById("userName").textContent = user.first_name;
  document.getElementById("userEmail").textContent = user.email;

  // Update user profile display if element exists
  const userNameDisplay = document.getElementById("userNameDisplay");
  if (userNameDisplay) {
    userNameDisplay.textContent = `${user.first_name} ${user.last_name}`;
  }

  // Set avatar initial
  const initial = user.first_name.charAt(0).toUpperCase();
  document.getElementById("userAvatar").textContent = initial;

  // Load all bookings view by default
  await loadAllBookings();
});
/**
 * Load dashboard with all data
 */
async function loadDashboard() {
  try {
    const token = getAuthToken();
    
    // Fetch all bookings
    const response = await fetch(`${API_BASE_URL}/bookings/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      const bookings = result.data.bookings || [];
      
      // Display dashboard statistics
      displayDashboardStats(bookings);
      
      // Display recent bookings
      displayRecentBookings(bookings);
      
      // Initialize charts with real data
      initializeDashboardCharts(bookings);
    } else {
      console.error("Error loading bookings:", result.message);
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

/**
 * Display dashboard statistics cards
 */
function displayDashboardStats(bookings) {
  if (!bookings || bookings.length === 0) return;

  let totalBookings = bookings.length;
  let upcomingBookings = 0;
  let completedBookings = 0;
  let totalSpent = 0;
  let hotelCount = 0;
  let flightCount = 0;
  let busCount = 0;

  bookings.forEach((booking) => {
    // Count by status
    if (["Pending", "Confirmed"].includes(booking.booking_status)) {
      upcomingBookings++;
    } else if (["Completed"].includes(booking.booking_status)) {
      completedBookings++;
    }

    // Count by type
    const type = (booking.booking_type || booking.type || "").toLowerCase();
    if (type.includes("flight")) flightCount++;
    else if (type.includes("bus")) busCount++;
    else hotelCount++;

    // Sum total spent
    if (booking.total_price) {
      totalSpent += parseFloat(booking.total_price);
    } else if (booking.price) {
      totalSpent += parseFloat(booking.price);
    }
  });

  // Update stats cards if they exist
  const dashTotalBookings = document.getElementById("dashTotalBookings");
  const dashUpcomingBookings = document.getElementById("dashUpcomingBookings");
  const dashCompletedBookings = document.getElementById("dashCompletedBookings");
  const dashTotalSpent = document.getElementById("dashTotalSpent");
  const dashHotels = document.getElementById("dashHotels");
  const dashFlights = document.getElementById("dashFlights");
  const dashBuses = document.getElementById("dashBuses");

  if (dashTotalBookings) dashTotalBookings.textContent = totalBookings;
  if (dashUpcomingBookings) dashUpcomingBookings.textContent = upcomingBookings;
  if (dashCompletedBookings) dashCompletedBookings.textContent = completedBookings;
  if (dashTotalSpent) dashTotalSpent.textContent = `$${totalSpent.toFixed(2)}`;
  
  // Update booking type cards
  if (dashHotels) dashHotels.textContent = hotelCount;
  if (dashFlights) dashFlights.textContent = flightCount;
  if (dashBuses) dashBuses.textContent = busCount;
}

/**
 * Display recent bookings in dashboard with more details
 */
function displayRecentBookings(bookings) {
  const container = document.getElementById("dashRecentBookings");
  if (!container) return;

  if (!bookings || bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: #6b7280; padding: 2em">
        <i class="bi bi-inbox" style="font-size: 2.5em; margin-bottom: 1em; display: block; opacity: 0.5"></i>
        <p>No bookings yet</p>
      </div>
    `;
    return;
  }

  // Get recent bookings (up to 5)
  const recentBookings = bookings.slice(0, 5);

  container.innerHTML = recentBookings
    .map((booking) => {
      const bookingType = (booking.booking_type || booking.type || "").toLowerCase();
      const icon = bookingType.includes("flight")
        ? "airplane"
        : bookingType.includes("bus")
        ? "bus-front"
        : "building";
      
      const hotelName = booking.hotel_name || booking.flight_no || booking.bus_no || "Booking";
      const location = booking.city || booking.from || "Location";
      const destination = booking.to ? ` → ${booking.to}` : "";
      const date = booking.check_in_date || booking.departure || booking.booking_date || "N/A";
      const status = booking.booking_status || "Pending";
      const price = booking.total_price || booking.price || "0";
      
      const statusColor =
        status === "Confirmed"
          ? "#3b82f6"
          : status === "Pending"
          ? "#f59e0b"
          : status === "Completed"
          ? "#10b981"
          : "#6b7280";

      const statusBgColor =
        status === "Confirmed"
          ? "#dbeafe"
          : status === "Pending"
          ? "#fef3c7"
          : status === "Completed"
          ? "#dcfce7"
          : "#f3f4f6";

      return `
        <div style="background: #fff; padding: 1.5em; border-radius: 12px; border-left: 4px solid ${statusColor}; margin-bottom: 1em; box-shadow: 0 1px 3px rgba(0,0,0,0.05)">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1em">
            <div style="display: flex; align-items: start; gap: 1em; flex: 1">
              <div style="width: 50px; height: 50px; border-radius: 10px; background: #f0f4ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0">
                <i class="bi bi-${icon}" style="font-size: 1.75em; color: #667eea"></i>
              </div>
              <div style="flex: 1">
                <h4 style="margin: 0 0 0.3em 0; color: #111827; font-size: 1em; font-weight: 600">${hotelName}</h4>
                <p style="margin: 0 0 0.5em 0; color: #6b7280; font-size: 0.9em">
                  <i class="bi bi-geo-alt" style="margin-right: 0.3em"></i>${location}${destination}
                </p>
                <p style="margin: 0; color: #9ca3af; font-size: 0.85em">
                  <i class="bi bi-calendar-event" style="margin-right: 0.3em"></i>${date}
                </p>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0">
              <span style="background: ${statusBgColor}; color: ${statusColor}; padding: 0.5em 0.9em; border-radius: 6px; font-size: 0.85em; font-weight: 600; display: inline-block; white-space: nowrap; margin-bottom: 0.5em">
                ${status}
              </span>
              <p style="margin: 0.5em 0 0 0; color: #667eea; font-size: 1em; font-weight: 700">$${price}</p>
            </div>
          </div>
          <div style="display: flex; gap: 1em; padding-top: 1em; border-top: 1px solid #e5e7eb">
            <button onclick="viewBookingDetails(${booking.booking_id})" style="flex: 1; background: #f3f4f6; border: none; padding: 0.6em; border-radius: 6px; color: #374151; cursor: pointer; font-weight: 500; transition: all 0.2s; font-size: 0.9em" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
              <i class="bi bi-eye" style="margin-right: 0.3em"></i>View Details
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * View booking details
 */
function viewBookingDetails(bookingId) {
  alert(`Booking details for #${bookingId}`);
  // TODO: Implement modal or navigation to booking details page
}

/**
 * Initialize dashboard charts
 */
function initializeDashboardCharts(bookings) {
  // Count bookings by type
  let hotelCount = 0;
  let flightCount = 0;
  let busCount = 0;

  bookings.forEach((booking) => {
    const type = (booking.booking_type || booking.type || "").toLowerCase();
    if (type.includes("flight")) flightCount++;
    else if (type.includes("bus")) busCount++;
    else hotelCount++;
  });

  // Initialize pie chart
  const chartCanvas = document.getElementById("bookingTypesChart");
  if (chartCanvas) {
    if (window.bookingTypesChartInstance) {
      window.bookingTypesChartInstance.destroy();
    }

    const ctx = chartCanvas.getContext("2d");
    window.bookingTypesChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Hotels", "Flights", "Buses"],
        datasets: [
          {
            data: [hotelCount, flightCount, busCount],
            backgroundColor: ["#667eea", "#764ba2", "#f093fb"],
            borderColor: "#fff",
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: { size: 13, weight: "500" },
              color: "#6b7280",
              padding: 20,
            },
          },
        },
      },
    });
  }

  // Initialize bar chart with monthly spending
  const monthlyChartCanvas = document.getElementById("monthlySpendingChart");
  if (monthlyChartCanvas) {
    // Calculate monthly spending
    const monthlyData = {};
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
      });
      monthlyData[monthKey] = 0;
      months.push(date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }));
    }

    // Sum spending by month
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.booking_date || booking.created_at || new Date());
      const monthKey = bookingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
      });

      if (monthlyData[monthKey] !== undefined) {
        const price = parseFloat(booking.total_price || booking.price || 0);
        monthlyData[monthKey] += price;
      }
    });

    const spendingData = Object.values(monthlyData);

    if (window.monthlySpendingChartInstance) {
      window.monthlySpendingChartInstance.destroy();
    }

    const ctx = monthlyChartCanvas.getContext("2d");
    window.monthlySpendingChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Spending ($)",
            data: spendingData,
            backgroundColor: "#667eea",
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: { size: 12, weight: "500" },
              color: "#6b7280",
              padding: 15,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6b7280",
              callback: function(value) {
                return "$" + value.toLocaleString();
              },
            },
            grid: {
              color: "#e5e7eb",
            },
          },
          x: {
            ticks: {
              color: "#6b7280",
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }
}


/**
 * Load booking statistics for dashboard cards
 */
async function loadDashboardStats() {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/bookings/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      const stats = result.data;

      // Update stats cards
      document.getElementById("totalBookings").textContent = stats.total;
      document.getElementById("activeBookings").textContent = stats.active;
      document.getElementById("completedBookings").textContent =
        stats.completed;
      document.getElementById(
        "totalSpent"
      ).textContent = `$${stats.totalSpent.toFixed(2)}`;
    } else {
      console.error("Error loading stats:", result.message);
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
  }
}

/**
 * Load active bookings
 */
async function loadActiveBookings() {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/bookings/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      displayBookings(result.data.bookings, "activeBookingsList");
    } else {
      console.error("Error loading active bookings:", result.message);
    }
  } catch (error) {
    console.error("Error loading active bookings:", error);
  }
}

/**
 * Load booking history
 */
async function loadBookingHistory() {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/bookings/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      displayBookings(result.data.bookings, "historyBookingsList");
    } else {
      console.error("Error loading booking history:", result.message);
    }
  } catch (error) {
    console.error("Error loading booking history:", error);
  }
}

/**
 * Display bookings in a container
 */
function displayBookings(bookings, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container ${containerId} not found`);
    return;
  }

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-building"></i>
        <h3>No hotel bookings yet</h3>
        <p>Start planning your next trip by booking a hotel!</p>
        <button class="btn-book" onclick="window.location.href='../Services/Hotels/HotelsPage.html'">
          <i class="bi bi-plus-circle"></i> Book a Hotel
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings
    .map(
      (booking) => `
    <div class="booking-card">
      <div class="booking-header">
        <div>
          <h3 class="booking-hotel-name">${booking.hotel_name}</h3>
          <p class="booking-location">
            <i class="bi bi-geo-alt"></i> ${booking.city}, ${booking.country}
          </p>
        </div>
        <div class="booking-status">
          <span class="status-badge status-${booking.booking_status.toLowerCase()}">${
        booking.booking_status
      }</span>
          <span class="payment-badge payment-${booking.payment_status.toLowerCase()}">${
        booking.payment_status
      }</span>
        </div>
      </div>
      
      <div class="booking-details">
        <div class="detail-item">
          <i class="bi bi-calendar-check"></i>
          <div>
            <small>Check-in</small>
            <strong>${formatDate(booking.check_in_date)}</strong>
          </div>
        </div>
        <div class="detail-item">
          <i class="bi bi-calendar-x"></i>
          <div>
            <small>Check-out</small>
            <strong>${formatDate(booking.check_out_date)}</strong>
          </div>
        </div>
        <div class="detail-item">
          <i class="bi bi-door-open"></i>
          <div>
            <small>Rooms</small>
            <strong>${booking.number_of_rooms}</strong>
          </div>
        </div>
        <div class="detail-item">
          <i class="bi bi-people"></i>
          <div>
            <small>Guests</small>
            <strong>${booking.number_of_guests}</strong>
          </div>
        </div>
      </div>
      
      <div class="booking-footer">
        <div class="booking-price">
          <small>Total Price</small>
          <strong>$${parseFloat(booking.total_price).toFixed(2)}</strong>
        </div>
        <div class="booking-actions">
          <button class="btn-view" onclick="viewBookingDetails(${
            booking.booking_id
          })">
            <i class="bi bi-eye"></i> View Details
          </button>
          ${
            booking.booking_status === "Pending" ||
            booking.booking_status === "Confirmed"
              ? `<button class="btn-cancel" onclick="cancelBooking(${booking.booking_id})">
              <i class="bi bi-x-circle"></i> Cancel
            </button>`
              : ""
          }
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * View booking details
 */
async function viewBookingDetails(bookingId) {
  // TODO: Implement modal or navigate to details page
  alert(`View details for booking #${bookingId}`);
}

/**
 * Cancel a booking
 */
async function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) {
    return;
  }

  try {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Booking cancelled successfully!");
      // Reload bookings
      await loadActiveBookings();
      await loadDashboardStats();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    alert("Error cancelling booking. Please try again.");
  }
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(`${tabName}Tab`).classList.add("active");

  // Add active class to clicked button
  event.target.classList.add("active");

  // Load data for the tab
  if (tabName === "history") {
    loadBookingHistory();
  } else if (tabName === "profile") {
    loadUserProfile();
  }
}

/**
 * Load user profile data
 */
async function loadUserProfile() {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      const user = result.data.user;

      // Fill profile form
      document.getElementById("profileFirstName").value = user.first_name;
      document.getElementById("profileLastName").value = user.last_name;
      document.getElementById("profileEmail").value = user.email;
      document.getElementById("profilePhone").value = user.phone || "";
      document.getElementById("profileBirthDate").value = user.birth_date || "";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

/**
 * Update user profile
 */
async function updateProfile(event) {
  event.preventDefault();

  const formData = {
    first_name: document.getElementById("profileFirstName").value,
    last_name: document.getElementById("profileLastName").value,
    email: document.getElementById("profileEmail").value,
    phone: document.getElementById("profilePhone").value,
    birth_date: document.getElementById("profileBirthDate").value,
  };

  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(result.data.user));

      // Update UI
      document.getElementById("userName").textContent =
        result.data.user.first_name;
      document.getElementById("userEmail").textContent = result.data.user.email;

      alert("Profile updated successfully!");
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile. Please try again.");
  }
}

/**
 * Switch between service views
 */
function switchView(viewName) {
  // Hide all views
  document.querySelectorAll(".service-view").forEach((view) => {
    view.classList.remove("active");
  });

  // Remove active class from all nav items
  document.querySelectorAll(".sidebar .nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Show selected view
  let viewId, navIndex;
  switch (viewName) {
    case "flights":
      viewId = "flightsView";
      navIndex = 1;
      loadFlightStats();
      break;
    case "buses":
      viewId = "busesView";
      navIndex = 2;
      loadBusStats();
      break;
    case "hotels":
      viewId = "hotelsView";
      navIndex = 3;
      loadDashboardStats();
      loadActiveBookings();
      break;
    case "allBookings":
      viewId = "allBookingsView";
      navIndex = 4;
      loadAllBookings();
      break;
    case "profile":
      viewId = "profileView";
      navIndex = 5;
      loadProfileData();
      break;
    case "dashboard":
      viewId = "dashboardView";
      navIndex = 6;
      loadDashboard();
      break;
    default:
      viewId = "allBookingsView";
      navIndex = 4;
  }

  document.getElementById(viewId).classList.add("active");

  // Add active class to corresponding nav item
  const navItems = document.querySelectorAll(".sidebar .nav-item");
  if (navItems[navIndex]) {
    navItems[navIndex].classList.add("active");
  }
}

/**
 * Load flight bookings
 */
async function loadFlightBookings() {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/flights`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      displayServiceBookings(
        result.data.bookings,
        "flightsBookingsList",
        "flight"
      );
    } else {
      console.error("Error loading flight bookings:", result.message);
    }
  } catch (error) {
    console.error("Error loading flight bookings:", error);
  }
}

/**
 * Load bus bookings
 */
async function loadBusBookings() {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/buses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      displayServiceBookings(result.data.bookings, "busesBookingsList", "bus");
    } else {
      console.error("Error loading bus bookings:", result.message);
    }
  } catch (error) {
    console.error("Error loading bus bookings:", error);
  }
}

/**
 * Load all bookings (hotels, flights, buses)
 */
async function loadAllBookings() {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      displayAllBookings(result.data.bookings);
    } else {
      console.error("Error loading all bookings:", result.message);
    }
  } catch (error) {
    console.error("Error loading all bookings:", error);
  }
}

/**
 * Display service-specific bookings (flights or buses)
 */
function displayServiceBookings(bookings, containerId, serviceType) {
  const container = document.getElementById(containerId);

  if (!bookings || bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-${
          serviceType === "flight" ? "airplane" : "bus-front"
        }"></i>
        <h3>No ${serviceType} bookings yet</h3>
        <p>Start planning your journey by booking a ${serviceType}!</p>
        <button class="btn-book" onclick="window.location.href='${
          serviceType === "flight"
            ? "../Services/Flights/FlightsPage.html"
            : "../Services/Buses/BusesSearchResults.html"
        }'">
          <i class="bi bi-plus-circle"></i> Book a ${
            serviceType === "flight" ? "Flight" : "Bus"
          }
        </button>
      </div>
    `;
    return;
  }

  const bookingsHTML = bookings
    .map((booking) => {
      const statusClass = booking.booking_status.toLowerCase();
      const serviceClass = serviceType === "flight" ? "flight" : "bus";

      return `
        <div class="booking-card booking-card-${serviceClass}">
          <div class="booking-header">
            <div>
              <span class="service-badge service-badge-${serviceClass}">
                <i class="bi bi-${
                  serviceType === "flight" ? "airplane" : "bus-front"
                }"></i> 
                ${serviceType.toUpperCase()}
              </span>
              <h3>${
                serviceType === "flight" ? booking.airline : booking.company
              }</h3>
              <p class="route">${booking.departure_city} → ${
        booking.arrival_city
      }</p>
            </div>
            <div class="booking-status">
              <span class="status-badge status-${statusClass}">${
        booking.booking_status
      }</span>
            </div>
          </div>
          <div class="booking-details">
            <div class="detail-item">
              <i class="bi bi-${
                serviceType === "flight" ? "airplane-fill" : "bus-front-fill"
              }"></i>
              <div>
                <span class="label">${
                  serviceType === "flight" ? "Flight" : "Bus"
                } Number</span>
                <span class="value">${
                  serviceType === "flight"
                    ? booking.flight_number
                    : booking.bus_number
                }</span>
              </div>
            </div>
            <div class="detail-item">
              <i class="bi bi-calendar-event"></i>
              <div>
                <span class="label">Departure</span>
                <span class="value">${formatDate(booking.departure_time)}</span>
              </div>
            </div>
            <div class="detail-item">
              <i class="bi bi-people"></i>
              <div>
                <span class="label">Passengers</span>
                <span class="value">${booking.number_of_passengers}</span>
              </div>
            </div>
            <div class="detail-item">
              <i class="bi bi-cash"></i>
              <div>
                <span class="label">Total Price</span>
                <span class="value">$${parseFloat(booking.total_price).toFixed(
                  2
                )}</span>
              </div>
            </div>
          </div>
          <div class="booking-footer">
            <small>Booking ID: ${booking.booking_id}</small>
            <small>Payment: ${booking.payment_status}</small>
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = bookingsHTML;
}

/**
 * Display all bookings with color coding by service type
 */
function displayAllBookings(bookings) {
  const container = document.getElementById("allBookingsList");

  if (!bookings || bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-calendar-x"></i>
        <h3>No bookings yet</h3>
        <p>Start your journey by booking a service!</p>
      </div>
    `;
    return;
  }

  const bookingsHTML = bookings
    .map((booking) => {
      const statusClass = booking.booking_status.toLowerCase();
      const serviceType = booking.service_type;
      let serviceIcon, serviceName, serviceDetails;

      if (serviceType === "hotel") {
        serviceIcon = "building";
        serviceName = booking.service_name;
        serviceDetails = `
          <div class="detail-item">
            <i class="bi bi-geo-alt"></i>
            <div>
              <span class="label">Location</span>
              <span class="value">${booking.city}, ${booking.country}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-calendar-range"></i>
            <div>
              <span class="label">Check-in / Check-out</span>
              <span class="value">${formatDate(
                booking.check_in_date
              )} - ${formatDate(booking.check_out_date)}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-door-open"></i>
            <div>
              <span class="label">Rooms / Guests</span>
              <span class="value">${booking.number_of_rooms} room(s), ${
          booking.number_of_guests
        } guest(s)</span>
            </div>
          </div>
        `;
      } else if (serviceType === "flight") {
        serviceIcon = "airplane";
        serviceName = booking.service_name;
        serviceDetails = `
          <div class="detail-item">
            <i class="bi bi-airplane-fill"></i>
            <div>
              <span class="label">Flight Number</span>
              <span class="value">${booking.flight_number}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-calendar-event"></i>
            <div>
              <span class="label">Departure</span>
              <span class="value">${formatDate(booking.departure_time)}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-arrow-right-circle"></i>
            <div>
              <span class="label">Route</span>
              <span class="value">${booking.departure_city} → ${
          booking.arrival_city
        }</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-people"></i>
            <div>
              <span class="label">Passengers</span>
              <span class="value">${booking.number_of_passengers}</span>
            </div>
          </div>
        `;
      } else {
        serviceIcon = "bus-front";
        serviceName = booking.service_name;
        serviceDetails = `
          <div class="detail-item">
            <i class="bi bi-bus-front-fill"></i>
            <div>
              <span class="label">Bus Number</span>
              <span class="value">${booking.bus_number}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-calendar-event"></i>
            <div>
              <span class="label">Departure</span>
              <span class="value">${formatDate(booking.departure_time)}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-arrow-right-circle"></i>
            <div>
              <span class="label">Route</span>
              <span class="value">${booking.departure_city} → ${
          booking.arrival_city
        }</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="bi bi-people"></i>
            <div>
              <span class="label">Passengers</span>
              <span class="value">${booking.number_of_passengers}</span>
            </div>
          </div>
        `;
      }

      return `
        <div class="booking-card booking-card-${serviceType}">
          <div class="booking-header">
            <div>
              <span class="service-badge service-badge-${serviceType}">
                <i class="bi bi-${serviceIcon}"></i> 
                ${serviceType.toUpperCase()}
              </span>
              <h3>${serviceName}</h3>
            </div>
            <div class="booking-status">
              <span class="status-badge status-${statusClass}">${
        booking.booking_status
      }</span>
            </div>
          </div>
          <div class="booking-details">
            ${serviceDetails}
            <div class="detail-item">
              <i class="bi bi-cash"></i>
              <div>
                <span class="label">Total Price</span>
                <span class="value">$${parseFloat(booking.total_price).toFixed(
                  2
                )}</span>
              </div>
            </div>
          </div>
          <div class="booking-footer">
            <small>Booking ID: ${booking.booking_id}</small>
            <small>Payment: ${booking.payment_status}</small>
            <small>Booked: ${formatDate(booking.created_at)}</small>
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = bookingsHTML;
}

/**
 * Load flight statistics and bookings
 */
async function loadFlightStats() {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/flights`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      const bookings = result.data.bookings;

      // Calculate statistics
      const total = bookings.length;
      const active = bookings.filter((b) =>
        ["Pending", "Confirmed"].includes(b.booking_status)
      ).length;
      const completed = bookings.filter(
        (b) => b.booking_status === "Completed"
      ).length;
      const totalSpent = bookings.reduce(
        (sum, b) => sum + parseFloat(b.total_price),
        0
      );

      // Update stats cards
      document.getElementById("totalFlightBookings").textContent = total;
      document.getElementById("activeFlightBookings").textContent = active;
      document.getElementById("completedFlightBookings").textContent =
        completed;
      document.getElementById(
        "totalFlightSpent"
      ).textContent = `$${totalSpent.toFixed(2)}`;

      // Split bookings
      const activeBookings = bookings.filter((b) =>
        ["Pending", "Confirmed"].includes(b.booking_status)
      );
      const historyBookings = bookings.filter((b) =>
        ["Completed", "Cancelled"].includes(b.booking_status)
      );

      // Display bookings
      displayServiceBookings(activeBookings, "activeFlightsList", "flight");
      displayServiceBookings(historyBookings, "historyFlightsList", "flight");
    }
  } catch (error) {
    console.error("Error loading flight stats:", error);
  }
}

/**
 * Load bus statistics and bookings
 */
async function loadBusStats() {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/buses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      const bookings = result.data.bookings;

      // Calculate statistics
      const total = bookings.length;
      const active = bookings.filter((b) =>
        ["Pending", "Confirmed"].includes(b.booking_status)
      ).length;
      const completed = bookings.filter(
        (b) => b.booking_status === "Completed"
      ).length;
      const totalSpent = bookings.reduce(
        (sum, b) => sum + parseFloat(b.total_price),
        0
      );

      // Update stats cards
      document.getElementById("totalBusBookings").textContent = total;
      document.getElementById("activeBusBookings").textContent = active;
      document.getElementById("completedBusBookings").textContent = completed;
      document.getElementById(
        "totalBusSpent"
      ).textContent = `$${totalSpent.toFixed(2)}`;

      // Split bookings
      const activeBookings = bookings.filter((b) =>
        ["Pending", "Confirmed"].includes(b.booking_status)
      );
      const historyBookings = bookings.filter((b) =>
        ["Completed", "Cancelled"].includes(b.booking_status)
      );

      // Display bookings
      displayServiceBookings(activeBookings, "activeBusesList", "bus");
      displayServiceBookings(historyBookings, "historyBusesList", "bus");
    }
  } catch (error) {
    console.error("Error loading bus stats:", error);
  }
}

/**
 * Switch tabs for flight bookings
 */
function switchFlightTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll("#flightsView .tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll("#flightsView .tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Add active class to selected tab
  if (tabName === "active") {
    document
      .querySelector("#flightsView .tab-btn:nth-child(1)")
      .classList.add("active");
    document.getElementById("activeFlightTab").classList.add("active");
  } else if (tabName === "history") {
    document
      .querySelector("#flightsView .tab-btn:nth-child(2)")
      .classList.add("active");
    document.getElementById("historyFlightTab").classList.add("active");
  }
}

/**
 * Switch tabs for bus bookings
 */
function switchBusTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll("#busesView .tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll("#busesView .tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Add active class to selected tab
  if (tabName === "active") {
    document
      .querySelector("#busesView .tab-btn:nth-child(1)")
      .classList.add("active");
    document.getElementById("activeBusTab").classList.add("active");
  } else if (tabName === "history") {
    document
      .querySelector("#busesView .tab-btn:nth-child(2)")
      .classList.add("active");
    document.getElementById("historyBusTab").classList.add("active");
  }
}

/**
 * Load profile data into form
 */
function loadProfileData() {
  const user = getCurrentUser();
  if (user) {
    document.getElementById("profileFirstName").value = user.first_name || "";
    document.getElementById("profileLastName").value = user.last_name || "";
    document.getElementById("profileEmail").value = user.email || "";
    document.getElementById("profilePhone").value = user.phone || "";
    document.getElementById("profileBirthDate").value = user.birth_date || "";
  }
}

/**
 * Handle password change
 */
function handlePasswordChange() {
  // Show the password change confirmation modal
  document.getElementById("passwordModal").classList.add("active");
}

/**
 * Close password modal
 */
function closePasswordModal() {
  document.getElementById("passwordModal").classList.remove("active");
}

/**
 * Confirm password change
 */
function confirmPasswordChange() {
  // Close the confirmation modal
  closePasswordModal();

  // Show the "not available" modal
  setTimeout(() => {
    document.getElementById("notAvailableModal").classList.add("active");
  }, 200);

  // When the feature is ready, redirect to:
  // window.location.href = 'change-password.html';
}

/**
 * Close not available modal
 */
function closeNotAvailableModal() {
  document.getElementById("notAvailableModal").classList.remove("active");
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
  }
});
