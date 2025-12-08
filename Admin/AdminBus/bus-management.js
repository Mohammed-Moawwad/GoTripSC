// Bus Management JavaScript for GoTrip
// This file contains all interactive functionality for the bus management page

class BusManagement {
  constructor() {
    this.buses = [
      {
        id: "BUS001",
        route: "Cairo – Alexandria",
        departure: "11/1/2025, 8:00:00 AM",
        arrival: "11/1/2025, 11:00:00 AM",
        price: "$120.00",
        seats: 45,
        status: "Active",
      },
      {
        id: "BUS002",
        route: "Cairo – Hurghada",
        departure: "11/1/2025, 2:00:00 PM",
        arrival: "11/1/2025, 8:00:00 PM",
        price: "$250.00",
        seats: 38,
        status: "Active",
      },
      {
        id: "BUS003",
        route: "Alexandria – Marsa Matrouh",
        departure: "11/2/2025, 9:00:00 AM",
        arrival: "11/2/2025, 1:00:00 PM",
        price: "$180.00",
        seats: 42,
        status: "Active",
      },
      {
        id: "BUS004",
        route: "Cairo – Sharm El Sheikh",
        departure: "11/2/2025, 7:00:00 AM",
        arrival: "11/2/2025, 1:00:00 PM",
        price: "$300.00",
        seats: 40,
        status: "Canceled",
      },
    ];

    this.init();
  }

  init() {
    this.renderBusTable();
    this.bindEvents();
    console.log("Bus Management initialized");
  }

  renderBusTable() {
    const tableBody = document.getElementById("bus-table-body");

    if (!tableBody) {
      console.error("Bus table body not found");
      return;
    }

    tableBody.innerHTML = "";

    this.buses.forEach((bus) => {
      const row = document.createElement("tr");
      const statusClass =
        bus.status === "Active" ? "status-active" : "status-canceled";

      row.innerHTML = `
                <td>${bus.id}</td>
                <td>${bus.route}</td>
                <td>${bus.departure}</td>
                <td>${bus.arrival}</td>
                <td>${bus.price}</td>
                <td>${bus.seats}</td>
                <td><span class="${statusClass}">${bus.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${bus.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${bus.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

      tableBody.appendChild(row);
    });

    // Update last updated meta if present
    const meta = document.getElementById("last-updated");
    if (meta) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      meta.textContent = `Updated at ${hh}:${mm}`;
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

    // Add New Bus button
    const addBusBtn = document.querySelector(".add-bus-btn");
    if (addBusBtn) {
      addBusBtn.addEventListener("click", () => {
        this.handleAddBus();
      });
    }

    // Edit and Delete buttons (using event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".edit-btn")) {
        const busId = e.target.closest(".edit-btn").getAttribute("data-id");
        this.handleEditBus(busId);
      }

      if (e.target.closest(".delete-btn")) {
        const busId = e.target.closest(".delete-btn").getAttribute("data-id");
        this.handleDeleteBus(busId);
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

    // Date filter: clear button visibility and actions
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
          // Format YYYY-MM-DD for input[type=date]
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

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Sticky header shadow on scroll
    const container = document.getElementById("bus-table-container");
    if (container) {
      const onScroll = () => {
        if (container.scrollTop > 0) {
          container.classList.add("scrolled");
        } else {
          container.classList.remove("scrolled");
        }
      };
      container.addEventListener("scroll", onScroll);
      onScroll();
    }
  }

  handleSearch(searchTerm) {
    const rows = document.querySelectorAll("#bus-table-body tr");
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

  handleAddBus() {
    // Clear form and set mode to "add"
    document.getElementById("modalTitle").textContent = "Add New Bus";
    document.getElementById("busForm").reset();
    document.getElementById("busModal").setAttribute("data-mode", "add");
    document.getElementById("busModal").removeAttribute("data-bus-id");

    // Show modal
    document.getElementById("busModal").style.display = "flex";
  }

  handleEditBus(busId) {
    const bus = this.buses.find((b) => b.id === busId);
    if (bus) {
      this.showNotification(`Editing bus: ${busId} - ${bus.route}`, "info");

      // In a real application, you would open a modal with the bus data
      // For demo, we'll simulate editing by changing the status
      setTimeout(() => {
        bus.status = bus.status === "Active" ? "Canceled" : "Active";
        this.renderBusTable();
        this.showNotification(`Bus ${busId} updated successfully!`, "success");
      }, 1000);
    }
  }

  handleDeleteBus(busId) {
    const bus = this.buses.find((b) => b.id === busId);
    if (bus) {
      if (confirm(`Are you sure you want to delete ${busId} - ${bus.route}?`)) {
        this.showNotification(`Deleting bus: ${busId}...`, "info");

        // In a real application, you would make an API call to delete the bus
        setTimeout(() => {
          this.buses = this.buses.filter((b) => b.id !== busId);
          this.renderBusTable();
          this.showNotification(
            `Bus ${busId} deleted successfully!`,
            "success"
          );
        }, 1000);
      }
    }
  }

  handleLogout() {
    showLogoutModal("../../HomePage/HomePage.html");
  }

  showAdminProfile() {
    this.showNotification("Opening admin profile settings...", "info");

    // In a real application, this would open a profile modal
    setTimeout(() => {
      alert(
        "Admin Profile:\nName: Admin User\nRole: Administrator\nPermissions: Full Access"
      );
    }, 500);
  }

  handleFooterLink(linkText) {
    this.showNotification(`Navigating to ${linkText}...`, "info");

    // In a real application, you would navigate to the appropriate page
    // window.location.href = `/${linkText.toLowerCase().replace(' ', '-')}`;
  }

  handleKeyboardShortcuts(e) {
    // Add keyboard shortcuts for better UX
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "n":
          e.preventDefault();
          document.querySelector(".add-bus-btn").click();
          break;
        case "f":
          e.preventDefault();
          document.querySelector(".search-input").focus();
          break;
        case "l":
          e.preventDefault();
          this.handleLogout();
          break;
      }
    }
  }

  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span class="notification-icon">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add styles for notification if not already added
    if (!document.querySelector("#notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid #1A73E8;
                }
                .notification-success { border-left-color: #28a745; }
                .notification-error { border-left-color: #dc3545; }
                .notification-warning { border-left-color: #ffc107; }
                .notification-info { border-left-color: #17a2b8; }
                .notification-icon { font-size: 18px; }
                .notification-success .notification-icon { color: #28a745; }
                .notification-error .notification-icon { color: #dc3545; }
                .notification-warning .notification-icon { color: #ffc107; }
                .notification-info .notification-icon { color: #17a2b8; }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    margin-left: auto;
                    color: #666;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Add close button functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }
}

// Modal Functions for Bus Form
function closeBusModal() {
  document.getElementById("busModal").style.display = "none";
}

// Handle bus form submission
document.addEventListener("DOMContentLoaded", () => {
  const busForm = document.getElementById("busForm");
  if (busForm) {
    busForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const busNo = document.getElementById("busNo").value;
      const operatorName = document.getElementById("operatorName").value;
      const from = document.getElementById("from").value;
      const to = document.getElementById("to").value;
      const departure = new Date(document.getElementById("departure").value).toLocaleString();
      const arrival = new Date(document.getElementById("arrival").value).toLocaleString();
      const price = "$" + parseFloat(document.getElementById("price").value).toFixed(2);
      const availableSeats = parseInt(document.getElementById("availableSeats").value);
      const status = document.getElementById("status").value;

      const newBus = {
        id: busNo,
        operatorName: operatorName,
        from: from,
        to: to,
        departure: departure,
        arrival: arrival,
        price: price,
        seats: availableSeats,
        status: status,
      };

      // Add to buses array
      window.busManagement.buses.push(newBus);
      window.busManagement.renderBusTable();
      window.busManagement.showNotification(
        `Bus ${busNo} added successfully!`,
        "success"
      );

      // Close modal and reset form
      closeBusModal();
      busForm.reset();
    });
  }

  window.busManagement = new BusManagement();
});

// Export for Node.js environment if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = BusManagement;
}

