// ====================================
// Hotels Page - Search and Booking Functionality
// ====================================

const API_BASE_URL = "http://localhost:3000/api";

// ====================================
// Authentication Helper
// ====================================
function getAuthToken() {
  return localStorage.getItem("token");
}

function isLoggedIn() {
  const token = getAuthToken();
  return !!token;
}

// ====================================
// Hotel Search Functionality
// ====================================
async function searchHotels(event) {
  if (event) event.preventDefault();

  const form = document.getElementById("hotelSearchForm");
  const destination = document.getElementById("dest")?.value || "";
  const checkIn = document.getElementById("checkin")?.value || "";
  const checkOut = document.getElementById("checkout")?.value || "";
  const guestsSelect =
    document.getElementById("guests")?.value || "2 Adults in 1 Room";

  // Parse guests and rooms from select value (simplified)
  const guests = 2; // Default
  const rooms = 1; // Default

  // Get filter values
  const minPrice = document.getElementById("priceMin")?.value || 0;
  const maxPrice = document.getElementById("priceMax")?.value || 10000;
  const minRating = 0; // Will add filter later if needed

  // Build search URL
  let searchURL = `${API_BASE_URL}/hotels/search?query=${encodeURIComponent(
    destination
  )}`;
  searchURL += `&minPrice=${minPrice}&maxPrice=${maxPrice}&rating=${minRating}`;

  try {
    showLoadingState();

    console.log("Searching hotels with URL:", searchURL);
    const response = await fetch(searchURL);
    const result = await response.json();
    console.log("Search results:", result);

    if (result.success) {
      displayHotels(result.data, { checkIn, checkOut, guests, rooms });
    } else {
      showError(result.message || "Error searching hotels");
    }
  } catch (error) {
    console.error("Search Error:", error);
    showError("Failed to search hotels. Please try again.");
  } finally {
    hideLoadingState();
  }
}

// ====================================
// Display Hotels
// ====================================
function displayHotels(hotels, searchParams) {
  const container = document.getElementById("resultsList");

  console.log("Displaying hotels:", hotels.length, "hotels");
  console.log("Container element:", container);

  if (!container) {
    console.error("Hotels container (resultsList) not found");
    return;
  }

  // Update results count
  const resultsCount = document.getElementById("resultsCount");
  if (resultsCount) {
    resultsCount.textContent = `${hotels.length} ${
      hotels.length === 1 ? "result" : "results"
    }`;
  }

  // Clear existing content
  container.innerHTML = "";

  if (hotels.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No hotels found matching your search criteria.</p>
        <p>Try adjusting your filters or search for a different location.</p>
      </div>
    `;
    return;
  }

  // Display each hotel
  hotels.forEach((hotel) => {
    console.log("Creating card for hotel:", hotel.hotel_name);
    const hotelCard = createHotelCard(hotel, searchParams);
    container.appendChild(hotelCard);
  });

  console.log("Hotels displayed successfully");
}

// ====================================
// Create Hotel Card
// ====================================
function createHotelCard(hotel, searchParams) {
  const card = document.createElement("div");
  card.className = "hotel-card";

  const rating = hotel.rating || 0;
  const stars = "⭐".repeat(Math.floor(rating));

  card.innerHTML = `
    <div class="hotel-image">
      <img src="${hotel.image_url || "/images/hotel-placeholder.jpg"}" alt="${
    hotel.hotel_name
  }" onerror="this.src='/HomePage/Photos/logo.jpg'">
      ${
        hotel.available_rooms < 5
          ? '<span class="urgency-badge">Only ' +
            hotel.available_rooms +
            " rooms left!</span>"
          : ""
      }
    </div>
    <div class="hotel-details">
      <h3>${hotel.hotel_name}</h3>
      <p class="hotel-location">📍 ${hotel.location}, ${hotel.city}, ${
    hotel.country
  }</p>
      <p class="hotel-rating">${stars} ${rating.toFixed(1)} / 5.0</p>
      <p class="hotel-amenities">${hotel.amenities || "No amenities listed"}</p>
      <div class="hotel-footer">
        <div class="hotel-price">
          <span class="price-label">From</span>
          <span class="price-amount">$${hotel.price_per_night}</span>
          <span class="price-unit">/ night</span>
        </div>
        <button class="book-btn" data-hotel-id="${hotel.hotel_id}">
          Book Now
        </button>
      </div>
    </div>
  `;

  // Add click event to book button
  const bookBtn = card.querySelector(".book-btn");
  bookBtn.addEventListener("click", () => {
    initiateBooking(hotel.hotel_id, searchParams);
  });

  return card;
}

// ====================================
// Initiate Booking (Check Authentication)
// ====================================
function initiateBooking(hotelId, searchParams) {
  if (!isLoggedIn()) {
    showAuthRequiredModal();
    return;
  }

  // User is logged in, show booking confirmation modal
  showBookingConfirmationModal(hotelId, searchParams);
}

// ====================================
// Show Authentication Required Modal
// ====================================
function showAuthRequiredModal() {
  const modal = document.getElementById("authRequiredModal");
  if (!modal) {
    // Create modal if it doesn't exist
    createAuthRequiredModal();
  }
  document.getElementById("authRequiredModal").style.display = "flex";
}

function createAuthRequiredModal() {
  const modalHTML = `
    <div id="authRequiredModal" class="modal" style="display: none;">
      <div class="modal-content">
        <h2>🔐 Account Required</h2>
        <p>You must have an account to book a hotel.</p>
        <p>Please log in or create an account to continue.</p>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeAuthModal()">Not now</button>
          <button class="btn-primary" onclick="redirectToLogin()">Log in Now!</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function closeAuthModal() {
  document.getElementById("authRequiredModal").style.display = "none";
}

function redirectToLogin() {
  // Save current page URL to return after login
  sessionStorage.setItem("returnUrl", window.location.href);
  window.location.href = "../../Login/login.html";
}

// ====================================
// Show Booking Confirmation Modal
// ====================================
async function showBookingConfirmationModal(hotelId, searchParams) {
  try {
    // Fetch hotel details
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`);
    const result = await response.json();

    if (!result.success) {
      showError("Hotel not found");
      return;
    }

    const hotel = result.data;

    // Calculate total price
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.price_per_night * nights * searchParams.rooms;

    // Create/show confirmation modal
    const modal = document.getElementById("bookingConfirmModal");
    if (!modal) {
      createBookingConfirmModal();
    }

    // Populate modal with hotel details
    document.getElementById("confirmHotelName").textContent = hotel.hotel_name;
    document.getElementById(
      "confirmLocation"
    ).textContent = `${hotel.location}, ${hotel.city}`;
    document.getElementById("confirmCheckIn").textContent =
      searchParams.checkIn;
    document.getElementById("confirmCheckOut").textContent =
      searchParams.checkOut;
    document.getElementById("confirmNights").textContent = nights;
    document.getElementById("confirmRooms").textContent = searchParams.rooms;
    document.getElementById("confirmGuests").textContent = searchParams.guests;
    document.getElementById(
      "confirmPricePerNight"
    ).textContent = `$${hotel.price_per_night}`;
    document.getElementById("confirmTotalPrice").textContent = `$${totalPrice}`;

    // Store booking data for confirmation
    window.currentBookingData = {
      hotel_id: hotelId,
      check_in_date: searchParams.checkIn,
      check_out_date: searchParams.checkOut,
      number_of_rooms: searchParams.rooms,
      number_of_guests: searchParams.guests,
      total_price: totalPrice,
    };

    document.getElementById("bookingConfirmModal").style.display = "flex";
  } catch (error) {
    console.error("Error loading hotel details:", error);
    showError("Failed to load hotel details");
  }
}

function createBookingConfirmModal() {
  const modalHTML = `
    <div id="bookingConfirmModal" class="modal" style="display: none;">
      <div class="modal-content modal-large">
        <h2>📋 Confirm Your Booking</h2>
        <div class="booking-summary">
          <h3 id="confirmHotelName"></h3>
          <p id="confirmLocation"></p>
          <hr>
          <div class="booking-details-grid">
            <div>
              <strong>Check-in:</strong>
              <span id="confirmCheckIn"></span>
            </div>
            <div>
              <strong>Check-out:</strong>
              <span id="confirmCheckOut"></span>
            </div>
            <div>
              <strong>Nights:</strong>
              <span id="confirmNights"></span>
            </div>
            <div>
              <strong>Rooms:</strong>
              <span id="confirmRooms"></span>
            </div>
            <div>
              <strong>Guests:</strong>
              <span id="confirmGuests"></span>
            </div>
            <div>
              <strong>Price/Night:</strong>
              <span id="confirmPricePerNight"></span>
            </div>
          </div>
          <hr>
          <div class="total-price">
            <strong>Total Price:</strong>
            <span id="confirmTotalPrice" class="price-highlight"></span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-danger" onclick="closeBookingModal()">Close</button>
          <button class="btn-success" onclick="confirmBooking()">Book</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function closeBookingModal() {
  document.getElementById("bookingConfirmModal").style.display = "none";
}

// ====================================
// Confirm Booking
// ====================================
async function confirmBooking() {
  const bookingData = window.currentBookingData;

  if (!bookingData) {
    showError("Booking data not found");
    return;
  }

  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/bookings/hotels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (result.success) {
      closeBookingModal();
      showSuccessModal("Booking confirmed successfully!");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "../../User/dashboard.html";
      }, 2000);
    } else {
      showError(result.message || "Failed to create booking");
    }
  } catch (error) {
    console.error("Booking Error:", error);
    showError("Failed to create booking. Please try again.");
  }
}

// ====================================
// UI Helper Functions
// ====================================
function showLoadingState() {
  const container = document.getElementById("hotelsContainer");
  if (container) {
    container.innerHTML = '<div class="loading">🔄 Searching hotels...</div>';
  }
}

function hideLoadingState() {
  // Loading is replaced by actual content
}

function showError(message) {
  alert("Error: " + message);
}

function showSuccessModal(message) {
  alert(message);
}

// ====================================
// Initialize Page
// ====================================
document.addEventListener("DOMContentLoaded", function () {
  // Attach search form listener
  const searchForm = document.getElementById("hotelSearchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", searchHotels);
  }

  // Load initial hotels (all hotels)
  loadAllHotels();
});

async function loadAllHotels() {
  try {
    const response = await fetch(`${API_BASE_URL}/hotels`);
    const result = await response.json();

    if (result.success) {
      displayHotels(result.data, {
        checkIn: "",
        checkOut: "",
        guests: 1,
        rooms: 1,
      });
    }
  } catch (error) {
    console.error("Error loading hotels:", error);
  }
}
