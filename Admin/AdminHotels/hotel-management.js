// Hotel Management JavaScript for GoTrip
// This file contains all interactive functionality for the hotel management page

// ====================================
// API Configuration
// ====================================
const API_BASE_URL = "http://localhost:3000/api";

class HotelManagement {
  constructor() {
    this.hotels = [];
    this.init();
  }

  // ====================================
  // FETCH HOTELS FROM BACKEND
  // ====================================
  async fetchHotels() {
    try {
      console.log("Fetching hotels from backend...");

      // Admin should see ALL hotels (Active and InActive)
      const response = await fetch(
        `${API_BASE_URL}/hotels?includeInactive=true`
      );
      const result = await response.json();

      if (result.success) {
        // Transform backend data to match admin table format
        this.hotels = result.data.map((hotel) => ({
          id: hotel.hotel_id,
          name: hotel.hotel_name,
          location: `${hotel.city}, ${hotel.country}`,
          rooms: hotel.total_rooms,
          pricePerNight: `$${hotel.price_per_night}`,
          rating: parseFloat(hotel.rating).toFixed(1),
          status: hotel.status,
          // Keep full data for editing
          _fullData: hotel,
        }));

        console.log(`Loaded ${this.hotels.length} hotels from database`);
        this.renderHotelTable();
        this.updateStats();
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      this.showNotification("Error loading hotels from server", "error");
    }
  }

  init() {
    this.bindEvents();
    this.fetchHotels(); // Fetch hotels from backend on initialization
    console.log("Hotel Management initialized");
  }

  renderHotelTable() {
    const tableBody = document.getElementById("hotel-table-body");

    if (!tableBody) {
      console.error("Hotel table body not found");
      return;
    }

    tableBody.innerHTML = "";

    this.hotels.forEach((hotel) => {
      const row = document.createElement("tr");
      const statusClass =
        hotel.status === "Active" ? "status-active" : "status-inactive";

      row.innerHTML = `
                <td>${hotel.id}</td>
                <td>${hotel.name}</td>
                <td>${hotel.location}</td>
                <td>${hotel.rooms}</td>
                <td>${hotel.pricePerNight}</td>
                <td>⭐ ${hotel.rating}</td>
                <td><span class="${statusClass}">${hotel.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" data-id="${hotel.id}" title="View Details" style="background: #3b82f6;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" data-id="${hotel.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${hotel.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

      tableBody.appendChild(row);
    });
  }

  updateStats() {
    // Update Total Hotels stat
    const totalHotelsElement = document.querySelector(
      ".stat-card:nth-child(1) .stat-number"
    );
    if (totalHotelsElement) {
      totalHotelsElement.textContent = this.hotels.length;
    }

    // Calculate Average Price
    if (this.hotels.length > 0) {
      const totalPrice = this.hotels.reduce((sum, hotel) => {
        const priceStr = hotel.pricePerNight.replace(/[$,]/g, "");
        return sum + parseFloat(priceStr);
      }, 0);
      const avgPrice = (totalPrice / this.hotels.length).toFixed(2);

      const avgPriceElement = document.querySelector(
        ".stat-card:nth-child(2) .stat-number"
      );
      if (avgPriceElement) {
        avgPriceElement.textContent = `$${avgPrice}`;
      }

      // Calculate Average Stars
      const totalRating = this.hotels.reduce((sum, hotel) => {
        return sum + parseFloat(hotel.rating);
      }, 0);
      const avgRating = (totalRating / this.hotels.length).toFixed(1);

      const avgStarsElement = document.querySelector(
        ".stat-card:nth-child(3) .stat-number"
      );
      if (avgStarsElement) {
        avgStarsElement.textContent = avgRating;
      }
    }
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Add New Hotel button
    const addHotelBtn = document.querySelector(".add-hotel-btn");
    if (addHotelBtn) {
      addHotelBtn.addEventListener("click", () => {
        this.handleAddHotel();
      });
    }

    // Status filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const status = e.currentTarget.getAttribute("data-status");
        this.handleStatusFilter(status);

        // Update active state
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
      });
    });

    // Edit, Delete, and View buttons (using event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".view-btn")) {
        const hotelId = e.target.closest(".view-btn").getAttribute("data-id");
        this.handleViewHotelDetails(hotelId);
      }

      if (e.target.closest(".edit-btn")) {
        const hotelId = e.target.closest(".edit-btn").getAttribute("data-id");
        this.handleEditHotel(hotelId);
      }

      if (e.target.closest(".delete-btn")) {
        const hotelId = e.target.closest(".delete-btn").getAttribute("data-id");
        this.handleDeleteHotel(hotelId);
      }
    });

    // Logout button
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this.handleLogout();
      });
    }

    // Admin profile
    const adminProfile = document.querySelector(".admin-profile");
    if (adminProfile) {
      adminProfile.addEventListener("click", () => {
        this.showAdminProfile();
      });
    }

    // Footer links
    document.querySelectorAll(".footer-links a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleFooterLink(e.target.textContent);
      });
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Sticky header shadow on scroll
    const container = document.getElementById("hotel-table-container");
    if (container) {
      const onScroll = () => {
        container.classList.toggle("scrolled", container.scrollTop > 0);
      };
      container.addEventListener("scroll", onScroll);
      onScroll();
    }

    // Last updated meta
    this.updateLastUpdated();
    // Date filter interactions (parity with bus page)
    const dateInput = document.getElementById("date-select");
    const clearBtn = document.querySelector(".clear-date-btn");
    const datePills = document.querySelectorAll(".date-pill");

    if (dateInput && clearBtn) {
      const toggleClear = () => {
        clearBtn.style.display = dateInput.value ? "inline-flex" : "none";
      };
      toggleClear();
      dateInput.addEventListener("input", toggleClear);
      clearBtn.addEventListener("click", () => {
        dateInput.value = "";
        toggleClear();
        this.showNotification("Date filter cleared", "info");
      });
    }

    if (datePills && datePills.length) {
      datePills.forEach((pill) => {
        pill.addEventListener("click", () => {
          datePills.forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          const preset = pill.getAttribute("data-preset");
          const today = new Date();
          let target = new Date(today);
          if (preset === "tomorrow") {
            target.setDate(today.getDate() + 1);
          }
          const yyyy = target.getFullYear();
          const mm = String(target.getMonth() + 1).padStart(2, "0");
          const dd = String(target.getDate()).padStart(2, "0");
          const iso = `${yyyy}-${mm}-${dd}`;
          if (dateInput) {
            dateInput.value = iso;
            if (clearBtn) clearBtn.style.display = "inline-flex";
          }
        });
      });
    }
  }

  updateLastUpdated() {
    const meta = document.getElementById("last-updated");
    if (meta) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      meta.textContent = `Updated at ${hh}:${mm}`;
    }
  }

  handleSearch(searchTerm) {
    const rows = document.querySelectorAll("#hotel-table-body tr");
    const term = searchTerm.toLowerCase();

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      if (text.includes(term)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  handleStatusFilter(status) {
    if (status === "all") {
      // Show all hotels
      this.renderHotelTable();
    } else if (status === "active") {
      // Show only active hotels
      const filtered = this.hotels.filter((hotel) => hotel.status === "Active");
      this.renderFilteredHotels(filtered);
    } else if (status === "inactive") {
      // Show only inactive hotels
      const filtered = this.hotels.filter(
        (hotel) => hotel.status === "InActive"
      );
      this.renderFilteredHotels(filtered);
    }
  }

  renderFilteredHotels(filteredHotels) {
    const tableBody = document.getElementById("hotel-table-body");

    if (!tableBody) {
      console.error("Hotel table body not found");
      return;
    }

    tableBody.innerHTML = "";

    filteredHotels.forEach((hotel) => {
      const row = document.createElement("tr");
      const statusClass =
        hotel.status === "Active" ? "status-active" : "status-inactive";

      row.innerHTML = `
                <td>${hotel.id}</td>
                <td>${hotel.name}</td>
                <td>${hotel.location}</td>
                <td>${hotel.rooms}</td>
                <td>${hotel.pricePerNight}</td>
                <td>⭐ ${hotel.rating}</td>
                <td><span class="${statusClass}">${hotel.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${hotel.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${hotel.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

      tableBody.appendChild(row);
    });

    // Update the displayed count
    const totalHotelsElement = document.querySelector(
      ".stat-card:nth-child(1) .stat-number"
    );
    if (totalHotelsElement) {
      totalHotelsElement.textContent = filteredHotels.length;
    }
  }

  // ====================================
  // VIEW HOTEL DETAILS
  // ====================================
  handleViewHotelDetails(hotelId) {
    const hotel = this.hotels.find((h) => h.id === hotelId);
    if (!hotel || !hotel._fullData) return;

    const data = hotel._fullData;

    // Create modal HTML
    const modalHTML = `
      <div id="detailsModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div style="background: white; border-radius: 12px; padding: 32px; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #1f2937; font-size: 24px;">
              <i class="fas fa-building" style="color: #3b82f6; margin-right: 8px;"></i>
              Hotel Details
            </h2>
            <button onclick="document.getElementById('detailsModal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">&times;</button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="grid-column: 1 / -1; padding: 20px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 8px; color: white;">
              <h3 style="margin: 0 0 8px; font-size: 22px;">${
                data.hotel_name
              }</h3>
              <p style="margin: 0; opacity: 0.9;">
                <i class="fas fa-map-marker-alt"></i> ${data.location}, ${
      data.city
    }, ${data.country}
              </p>
            </div>

            <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
              <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Hotel ID</div>
              <div style="font-weight: 600; color: #1f2937; font-size: 16px;">${
                data.hotel_id
              }</div>
            </div>

            <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
              <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Rating</div>
              <div style="font-weight: 600; color: #f59e0b; font-size: 16px;">
                <i class="fas fa-star"></i> ${data.rating} / 5.0
              </div>
            </div>

            <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
              <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Price Per Night</div>
              <div style="font-weight: 600; color: #10b981; font-size: 16px;">$${
                data.price_per_night
              }</div>
            </div>

            <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
              <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Status</div>
              <div style="font-weight: 600; color: ${
                data.status === "Active" ? "#10b981" : "#ef4444"
              }; font-size: 16px;">
                ${data.status}
              </div>
            </div>

            <div style="padding: 16px; background: #dbeafe; border-radius: 8px; border: 2px solid #3b82f6;">
              <div style="color: #1e40af; font-size: 13px; margin-bottom: 4px; font-weight: 600;">Total Rooms</div>
              <div style="font-weight: 700; color: #1e3a8a; font-size: 20px;">${
                data.total_rooms
              }</div>
            </div>

            <div style="padding: 16px; background: #dcfce7; border-radius: 8px; border: 2px solid #10b981;">
              <div style="color: #166534; font-size: 13px; margin-bottom: 4px; font-weight: 600;">Available Rooms</div>
              <div style="font-weight: 700; color: #166534; font-size: 20px;">${
                data.available_rooms
              }</div>
            </div>

            <div style="grid-column: 1 / -1; padding: 16px; background: #f3f4f6; border-radius: 8px;">
              <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Amenities</div>
              <div style="font-weight: 600; color: #1f2937; font-size: 14px; line-height: 1.6;">
                ${data.amenities || "N/A"}
              </div>
            </div>

            <div style="grid-column: 1 / -1; padding: 16px; background: #f3f4f6; border-radius: 8px;">
              <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Description</div>
              <div style="color: #374151; font-size: 14px; line-height: 1.6;">
                ${data.description || "No description available"}
              </div>
            </div>
          </div>

          <div style="margin-top: 24px; text-align: right;">
            <button onclick="document.getElementById('detailsModal').remove()" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // ====================================
  // ADD NEW HOTEL (CREATE)
  // ====================================
  handleAddHotel() {
    // Clear form and set mode to "add"
    document.getElementById("modalTitle").textContent = "Add New Hotel";
    document.getElementById("hotelForm").reset();
    document.getElementById("hotelModal").setAttribute("data-mode", "add");
    document.getElementById("hotelModal").removeAttribute("data-hotel-id");

    // Show modal
    document.getElementById("hotelModal").style.display = "flex";
  }

  // ====================================
  // EDIT HOTEL (UPDATE)
  // ====================================
  handleEditHotel(hotelId) {
    const hotel = this.hotels.find((h) => h.id === hotelId);
    if (!hotel || !hotel._fullData) {
      this.showNotification("Hotel not found", "error");
      return;
    }

    const fullData = hotel._fullData;

    // Set modal to edit mode
    document.getElementById("modalTitle").textContent = "Edit Hotel";
    document.getElementById("hotelModal").setAttribute("data-mode", "edit");
    document
      .getElementById("hotelModal")
      .setAttribute("data-hotel-id", hotelId);

    // Pre-fill form with hotel data
    document.getElementById("hotelName").value = fullData.hotel_name;
    document.getElementById("city").value = fullData.city;
    document.getElementById("country").value = fullData.country;
    document.getElementById("location").value = fullData.location;
    document.getElementById("pricePerNight").value = fullData.price_per_night;
    document.getElementById("totalRooms").value = fullData.total_rooms;
    document.getElementById("availableRooms").value = fullData.available_rooms;
    document.getElementById("rating").value = fullData.rating;
    document.getElementById("status").value = fullData.status;
    document.getElementById("description").value = fullData.description || "";

    // Pre-check amenities
    const amenitiesList = fullData.amenities
      ? fullData.amenities.split(", ")
      : [];
    document.querySelectorAll('input[name="amenity"]').forEach((checkbox) => {
      checkbox.checked = amenitiesList.includes(checkbox.value);
    });

    // Show modal
    document.getElementById("hotelModal").style.display = "flex";
  }

  // ====================================
  // DELETE HOTEL (PERMANENT DELETE)
  // ====================================
  async handleDeleteHotel(hotelId) {
    // Show custom confirmation modal
    this.showDeleteConfirmation(hotelId);
  }

  showDeleteConfirmation(hotelId) {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.className = "delete-confirmation-modal";
    modal.innerHTML = `
      <div class="delete-confirmation-content">
        <div class="delete-confirmation-header">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <h2>Delete Hotel Permanently?</h2>
        </div>
        <div class="delete-confirmation-body">
          <p>Are you sure you want to <strong>permanently delete</strong> hotel <strong>${hotelId}</strong>?</p>
          <p class="warning-text">⚠️ This action cannot be undone! The hotel will be removed from the database.</p>
        </div>
        <div class="delete-confirmation-actions">
          <button class="cancel-btn" id="cancelDeleteBtn">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="confirm-delete-btn" id="confirmDeleteBtn">
            <i class="fas fa-trash"></i> Yes, Delete Permanently
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
      modal.remove();
    });

    document
      .getElementById("confirmDeleteBtn")
      .addEventListener("click", async () => {
        modal.remove();
        await this.deleteHotelConfirmed(hotelId);
      });

    // Close on overlay click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  async deleteHotelConfirmed(hotelId) {
    try {
      console.log("🗑️ Attempting to delete hotel:", hotelId);
      console.log("📡 API URL:", `${API_BASE_URL}/hotels/${hotelId}`);

      this.showNotification("Deleting hotel...", "info");

      const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📥 Response status:", response.status);
      const result = await response.json();
      console.log("📦 Response result:", result);

      if (result.success) {
        this.showNotification(
          `Hotel ${hotelId} permanently deleted!`,
          "success"
        );
        this.fetchHotels(); // Refresh the table
      } else {
        console.error("❌ Delete failed:", result.message);
        this.showNotification(
          `Error: ${result.message || "Error deleting hotel"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("💥 Error deleting hotel:", error);
      this.showNotification("Error deleting hotel from database", "error");
    }
  }

  handleLogout() {
    showLogoutModal("../../HomePage/HomePage.html");
  }

  showAdminProfile() {
    this.showNotification("Opening admin profile...", "info");
  }

  handleFooterLink(linkText) {
    this.showNotification(`Navigating to ${linkText}...`, "info");
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + A to add new hotel
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      this.handleAddHotel();
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      document.querySelector(".search-input")?.focus();
    }
  }

  showNotification(message, type = "info") {
    // In a real application, you would implement a proper notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

// Initialize the hotel management system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.hotelManagement = new HotelManagement();
});

// ====================================
// MODAL FUNCTIONS
// ====================================
function closeHotelModal() {
  document.getElementById("hotelModal").style.display = "none";
  document.getElementById("hotelForm").reset();
}

async function saveHotel() {
  alert("Save Hotel button clicked!"); // Debug alert
  console.log("saveHotel function called");

  const form = document.getElementById("hotelForm");
  console.log("Form element:", form);

  // Validate form
  if (!form.checkValidity()) {
    console.log("Form validation failed");
    form.reportValidity();
    return;
  }
  console.log("Form validation passed");

  // Get form data
  const hotelName = document.getElementById("hotelName").value;
  const city = document.getElementById("city").value;
  const country = document.getElementById("country").value;
  const location = document.getElementById("location").value;
  const pricePerNight = document.getElementById("pricePerNight").value;
  const totalRooms = document.getElementById("totalRooms").value;
  const availableRooms = document.getElementById("availableRooms").value;
  const rating = document.getElementById("rating").value;
  const status = document.getElementById("status").value;
  const description = document.getElementById("description").value;

  // Get selected amenities
  const selectedAmenities = [];
  document
    .querySelectorAll('input[name="amenity"]:checked')
    .forEach((checkbox) => {
      selectedAmenities.push(checkbox.value);
    });
  const amenities = selectedAmenities.join(", ");

  // Check if at least one amenity is selected
  if (selectedAmenities.length === 0) {
    alert("Please select at least one amenity");
    return;
  }

  const modal = document.getElementById("hotelModal");
  const mode = modal.getAttribute("data-mode");
  const hotelId = modal.getAttribute("data-hotel-id");

  try {
    if (mode === "add") {
      // ADD NEW HOTEL
      console.log("Starting to add hotel...");
      window.hotelManagement.showNotification("Adding new hotel...", "info");

      // Don't send hotel_id - let backend generate it
      console.log("Sending data to API...");
      const response = await fetch(`${API_BASE_URL}/hotels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // hotel_id will be generated by backend
          hotel_name: hotelName,
          location: location,
          city: city,
          country: country,
          rating: parseFloat(rating),
          price_per_night: parseFloat(pricePerNight),
          total_rooms: parseInt(totalRooms),
          available_rooms: parseInt(availableRooms),
          amenities: amenities,
          description: description,
          status: status,
        }),
      });

      console.log("Response received, status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Result:", result);

      if (result.success) {
        const hotelId = result.data.hotel_id;
        alert(`✅ Hotel ${hotelId} added successfully!`);
        window.hotelManagement.showNotification(
          `Hotel ${hotelId} added successfully!`,
          "success"
        );
        closeHotelModal();
        await window.hotelManagement.fetchHotels(); // Refresh the table
      } else {
        alert(`❌ Error adding hotel: ${result.message || "Unknown error"}`);
        window.hotelManagement.showNotification("Error adding hotel", "error");
      }
    } else if (mode === "edit") {
      // UPDATE EXISTING HOTEL
      window.hotelManagement.showNotification("Updating hotel...", "info");

      const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotel_name: hotelName,
          location: location,
          city: city,
          country: country,
          rating: parseFloat(rating),
          price_per_night: parseFloat(pricePerNight),
          total_rooms: parseInt(totalRooms),
          available_rooms: parseInt(availableRooms),
          amenities: amenities,
          description: description,
          status: status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Hotel ${hotelId} updated successfully!`);
        window.hotelManagement.showNotification(
          `Hotel ${hotelId} updated successfully!`,
          "success"
        );
        closeHotelModal();
        window.hotelManagement.fetchHotels(); // Refresh the table
      } else {
        alert(`❌ Error updating hotel: ${result.message || "Unknown error"}`);
        window.hotelManagement.showNotification(
          "Error updating hotel",
          "error"
        );
      }
    }
  } catch (error) {
    console.error("Error saving hotel:", error);
    alert(`❌ Error saving hotel: ${error.message}`);
    window.hotelManagement.showNotification(
      "Error saving hotel to database",
      "error"
    );
  }
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modal = document.getElementById("hotelModal");
  if (e.target === modal) {
    closeHotelModal();
  }
});
