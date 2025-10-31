// Hotel Management JavaScript for GoTrip
// This file contains all interactive functionality for the hotel management page

class HotelManagement {
  constructor() {
    this.hotels = [
      {
        id: "HTL001",
        name: "Nile View Hotel",
        location: "Cairo, Egypt",
        rooms: 120,
        pricePerNight: "$150.00",
        rating: "4.5",
        status: "Active",
      },
      {
        id: "HTL002",
        name: "Alexandria Beach Resort",
        location: "Alexandria, Egypt",
        rooms: 85,
        pricePerNight: "$200.00",
        rating: "4.8",
        status: "Active",
      },
      {
        id: "HTL003",
        name: "Red Sea Paradise",
        location: "Hurghada, Egypt",
        rooms: 150,
        pricePerNight: "$180.00",
        rating: "4.3",
        status: "Active",
      },
      {
        id: "HTL004",
        name: "Pyramids View Inn",
        location: "Giza, Egypt",
        rooms: 60,
        pricePerNight: "$220.00",
        rating: "4.6",
        status: "Maintenance",
      },
    ];

    this.init();
  }

  init() {
    this.renderHotelTable();
    this.bindEvents();
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

    // Edit and Delete buttons (using event delegation)
    document.addEventListener("click", (e) => {
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

  handleAddHotel() {
    this.showNotification("Opening form to add a new hotel...", "info");

    // In a real application, you would open a modal or redirect to a form page
    // For demo purposes, we'll simulate adding a hotel
    setTimeout(() => {
      const newHotel = {
        id: "HTL00" + (this.hotels.length + 1),
        name: "New Hotel",
        location: "New Location, Egypt",
        rooms: 100,
        pricePerNight: "$180.00",
        rating: "4.0",
        status: "Active",
      };

      this.hotels.push(newHotel);
      this.renderHotelTable();
      this.updateLastUpdated();
      this.showNotification(
        `Hotel ${newHotel.id} added successfully!`,
        "success"
      );
    }, 1000);
  }

  handleEditHotel(hotelId) {
    const hotel = this.hotels.find((h) => h.id === hotelId);
    if (hotel) {
      this.showNotification(
        `Editing hotel: ${hotelId} - ${hotel.name}`,
        "info"
      );

      // In a real application, you would open a modal with the hotel data
      // For demo, we'll simulate editing by changing the status
      setTimeout(() => {
        hotel.status = hotel.status === "Active" ? "Maintenance" : "Active";
        this.renderHotelTable();
        this.showNotification(
          `Hotel ${hotelId} updated successfully!`,
          "success"
        );
      }, 1000);
    }
  }

  handleDeleteHotel(hotelId) {
    if (confirm(`Are you sure you want to delete hotel ${hotelId}?`)) {
      const index = this.hotels.findIndex((h) => h.id === hotelId);
      if (index !== -1) {
        this.hotels.splice(index, 1);
        this.renderHotelTable();
        this.showNotification(
          `Hotel ${hotelId} deleted successfully!`,
          "success"
        );
      }
    }
  }

  handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      this.showNotification("Logging out...", "info");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
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
