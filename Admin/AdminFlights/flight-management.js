// Flight Management JavaScript for GoTrip
// This file contains all interactive functionality for the flight management page

class FlightManagement {
  constructor() {
    this.flights = [
      {
        flightNo: "GT101",
        from: "Cairo, Egypt",
        to: "Dubai, UAE",
        departure: "11/1/2025, 08:30 AM",
        arrival: "11/1/2025, 12:30 PM",
        price: "$450.00",
        availableSeats: 120,
        gate: "A1",
        status: "On Time",
      },
      {
        flightNo: "GT102",
        from: "Alexandria, Egypt",
        to: "Istanbul, Turkey",
        departure: "11/1/2025, 10:00 AM",
        arrival: "11/1/2025, 01:30 PM",
        price: "$380.00",
        availableSeats: 85,
        gate: "B3",
        status: "Boarding",
      },
      {
        flightNo: "GT103",
        from: "Cairo, Egypt",
        to: "Paris, France",
        departure: "11/1/2025, 02:15 PM",
        arrival: "11/1/2025, 07:45 PM",
        price: "$680.00",
        availableSeats: 150,
        gate: "C2",
        status: "Delayed",
      },
      {
        flightNo: "GT104",
        from: "Hurghada, Egypt",
        to: "London, UK",
        departure: "11/1/2025, 11:45 PM",
        arrival: "11/2/2025, 04:15 AM",
        price: "$750.00",
        availableSeats: 0,
        gate: "D4",
        status: "Cancelled",
      },
    ];

    this.init();
  }

  init() {
    this.renderFlightTable();
    this.bindEvents();
    console.log("Flight Management initialized");
  }

  renderFlightTable() {
    const tableBody = document.getElementById("flight-table-body");

    if (!tableBody) {
      console.error("Flight table body not found");
      return;
    }

    tableBody.innerHTML = "";

    this.flights.forEach((flight) => {
      const row = document.createElement("tr");
      const statusClass = this.getStatusClass(flight.status);

      row.innerHTML = `
                <td>${flight.flightNo}</td>
                <td>${flight.from}</td>
                <td>${flight.to}</td>
                <td>${flight.departure}</td>
                <td>${flight.arrival}</td>
                <td>${flight.price}</td>
                <td>${flight.availableSeats}</td>
                <td>${flight.gate}</td>
                <td><span class="status-badge ${statusClass}">
                    ${this.getStatusIcon(flight.status)} ${flight.status}
                </span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${
                          flight.flightNo
                        }" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${
                          flight.flightNo
                        }" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

      tableBody.appendChild(row);
    });
  }

  getStatusClass(status) {
    switch (status.toLowerCase()) {
      case "on time":
        return "status-on-time";
      case "delayed":
        return "status-delayed";
      case "cancelled":
        return "status-cancelled";
      case "boarding":
        return "status-boarding";
      default:
        return "";
    }
  }

  getStatusIcon(status) {
    switch (status.toLowerCase()) {
      case "on time":
        return '<i class="fas fa-check-circle"></i>';
      case "delayed":
        return '<i class="fas fa-clock"></i>';
      case "cancelled":
        return '<i class="fas fa-times-circle"></i>';
      case "boarding":
        return '<i class="fas fa-plane-departure"></i>';
      default:
        return "";
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

    // Add New Flight button
    const addFlightBtn = document.querySelector(".add-flight-btn");
    if (addFlightBtn) {
      addFlightBtn.addEventListener("click", () => {
        this.handleAddFlight();
      });
    }

    // Edit and Delete buttons (using event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".edit-btn")) {
        const flightNo = e.target.closest(".edit-btn").getAttribute("data-id");
        this.handleEditFlight(flightNo);
      }

      if (e.target.closest(".delete-btn")) {
        const flightNo = e.target
          .closest(".delete-btn")
          .getAttribute("data-id");
        this.handleDeleteFlight(flightNo);
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
    const container = document.getElementById("flight-table-container");
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
    const rows = document.querySelectorAll("#flight-table-body tr");
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

  handleAddFlight() {
    this.showNotification("Opening form to add a new flight...", "info");

    // In a real application, you would open a modal or redirect to a form page
    // For demo purposes, we'll simulate adding a flight
    setTimeout(() => {
      const newFlight = {
        flightNo: "GT" + (this.flights.length + 101),
        from: "New Origin",
        to: "New Destination",
        departure: new Date().toLocaleString(),
        arrival: new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleString(),
        price: "$500.00",
        availableSeats: 150,
        gate: "A" + Math.floor(Math.random() * 10 + 1),
        status: "On Time",
      };

      this.flights.push(newFlight);
      this.renderFlightTable();
      this.updateLastUpdated();
      this.showNotification(
        `Flight ${newFlight.flightNo} added successfully!`,
        "success"
      );
    }, 1000);
  }

  handleEditFlight(flightNo) {
    const flight = this.flights.find((f) => f.flightNo === flightNo);
    if (flight) {
      this.showNotification(`Editing flight: ${flightNo}`, "info");

      // In a real application, you would open a modal with the flight data
      // For demo, we'll simulate editing by cycling through statuses
      setTimeout(() => {
        const statuses = ["On Time", "Delayed", "Boarding", "Cancelled"];
        const currentIndex = statuses.indexOf(flight.status);
        flight.status = statuses[(currentIndex + 1) % statuses.length];
        this.renderFlightTable();
        this.showNotification(
          `Flight ${flightNo} updated successfully!`,
          "success"
        );
      }, 1000);
    }
  }

  handleDeleteFlight(flightNo) {
    if (confirm(`Are you sure you want to delete flight ${flightNo}?`)) {
      const index = this.flights.findIndex((f) => f.flightNo === flightNo);
      if (index !== -1) {
        this.flights.splice(index, 1);
        this.renderFlightTable();
        this.showNotification(
          `Flight ${flightNo} deleted successfully!`,
          "success"
        );
      }
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
    // Ctrl/Cmd + A to add new flight
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      this.handleAddFlight();
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

// Initialize the flight management system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.flightManagement = new FlightManagement();
});
