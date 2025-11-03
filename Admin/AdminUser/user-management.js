// User Management JavaScript for GoTrip
// This file contains all interactive functionality for the user management page

class UserManagement {
  constructor() {
    this.users = [
      {
        id: "USR001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        phone: "+966 55 123 4567",
        birthDate: "1990-05-15",
        password: "********",
        registered: "2024-01-15",
        lastLogin: "2025-11-01",
        status: "Active",
      },
      {
        id: "USR002",
        firstName: "Sarah",
        lastName: "Smith",
        email: "sarah.smith@email.com",
        phone: "+966 50 234 5678",
        birthDate: "1988-08-22",
        password: "********",
        registered: "2024-02-20",
        lastLogin: "2025-10-30",
        status: "Active",
      },
      {
        id: "USR003",
        firstName: "Ahmed",
        lastName: "Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+966 54 345 6789",
        birthDate: "1992-03-10",
        password: "********",
        registered: "2024-03-10",
        lastLogin: "2025-10-28",
        status: "Active",
      },
      {
        id: "USR004",
        firstName: "Fatima",
        lastName: "Ali",
        email: "fatima.ali@email.com",
        phone: "+966 56 456 7890",
        birthDate: "1995-11-30",
        password: "********",
        registered: "2024-04-05",
        lastLogin: "2025-10-15",
        status: "InActive",
      },
      {
        id: "USR005",
        firstName: "Mike",
        lastName: "Jones",
        email: "mike.jones@email.com",
        phone: "+966 53 567 8901",
        birthDate: "1987-07-18",
        password: "********",
        registered: "2024-05-12",
        lastLogin: "Never",
        status: "InActive",
      },
      {
        id: "USR006",
        firstName: "Nora",
        lastName: "Ahmed",
        email: "nora.ahmed@email.com",
        phone: "+966 55 678 9012",
        birthDate: "1993-12-05",
        password: "********",
        registered: "2024-06-18",
        lastLogin: "2025-11-02",
        status: "Active",
      },
      {
        id: "USR007",
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@email.com",
        phone: "+966 50 789 0123",
        birthDate: "1991-04-25",
        password: "********",
        registered: "2024-07-22",
        lastLogin: "2025-10-25",
        status: "Active",
      },
      {
        id: "USR008",
        firstName: "Layla",
        lastName: "Omar",
        email: "layla.omar@email.com",
        phone: "+966 54 890 1234",
        birthDate: "1994-09-14",
        password: "********",
        registered: "2024-08-30",
        lastLogin: "2025-09-10",
        status: "InActive",
      },
    ];

    this.init();
  }

  init() {
    this.renderUserTable();
    this.bindEvents();
    console.log("User Management initialized");
  }

  renderUserTable() {
    const tableBody = document.getElementById("user-table-body");

    if (!tableBody) {
      console.error("User table body not found");
      return;
    }

    tableBody.innerHTML = "";

    this.users.forEach((user) => {
      const row = document.createElement("tr");
      let statusClass = "";

      if (user.status === "Active") {
        statusClass = "status-active";
      } else if (user.status === "InActive") {
        statusClass = "status-inactive";
      }

      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.birthDate}</td>
                <td>${user.password}</td>
                <td>${user.registered}</td>
                <td>${user.lastLogin}</td>
                <td><span class="status-badge ${statusClass}">${
        user.status
      }</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${
                          user.id
                        }" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${
                          user.status === "Active"
                            ? `<button class="action-btn suspend-btn" data-id="${user.id}" title="Suspend User">
                            <i class="fas fa-ban"></i>
                        </button>`
                            : ""
                        }
                        <button class="action-btn delete-btn" data-id="${
                          user.id
                        }" title="Delete User">
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

    // Filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        e.target.closest(".filter-btn").classList.add("active");
        const status = e.target
          .closest(".filter-btn")
          .getAttribute("data-status");
        this.handleFilter(status);
      });
    });

    // Add New User button
    const addUserBtn = document.querySelector(".add-user-btn");
    if (addUserBtn) {
      addUserBtn.addEventListener("click", () => {
        this.handleAddUser();
      });
    }

    // Edit, Suspend, and Delete buttons (using event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".edit-btn")) {
        const userId = e.target.closest(".edit-btn").getAttribute("data-id");
        this.handleEditUser(userId);
      }

      if (e.target.closest(".suspend-btn")) {
        const userId = e.target.closest(".suspend-btn").getAttribute("data-id");
        this.handleSuspendUser(userId);
      }

      if (e.target.closest(".delete-btn")) {
        const userId = e.target.closest(".delete-btn").getAttribute("data-id");
        this.handleDeleteUser(userId);
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
    const container = document.getElementById("user-table-container");
    if (container) {
      const onScroll = () => {
        container.classList.toggle("scrolled", container.scrollTop > 0);
      };
      container.addEventListener("scroll", onScroll);
      onScroll();
    }

    // Last updated meta
    this.updateLastUpdated();

    // Date filter interactions
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

          if (preset === "week") {
            target.setDate(today.getDate() - 7);
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

    // Sortable columns
    const sortableHeaders = document.querySelectorAll(".sortable");
    sortableHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const sortBy = header.getAttribute("data-sort");
        this.handleSort(sortBy);
      });
    });
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
    const rows = document.querySelectorAll("#user-table-body tr");
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

  handleFilter(status) {
    const rows = document.querySelectorAll("#user-table-body tr");

    rows.forEach((row) => {
      if (status === "all") {
        row.style.display = "";
      } else {
        const statusBadge = row.querySelector(".status-badge");
        const userStatus = statusBadge.textContent.toLowerCase();
        if (userStatus === status) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      }
    });

    this.showNotification(`Filtered by: ${status}`, "info");
  }

  handleSort(sortBy) {
    const sortedUsers = [...this.users].sort((a, b) => {
      if (sortBy === "id" || sortBy === "username" || sortBy === "email") {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      return 0;
    });

    this.users = sortedUsers;
    this.renderUserTable();
    this.showNotification(`Sorted by: ${sortBy}`, "info");
  }

  handleAddUser() {
    this.showNotification("Opening form to add a new user...", "info");

    // In a real application, you would open a modal or redirect to a form page
    setTimeout(() => {
      const newUser = {
        id: "USR00" + (this.users.length + 1),
        username: "new_user",
        email: "newuser@email.com",
        phone: "+966 55 999 8888",
        registered: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
        status: "Pending",
      };

      this.users.push(newUser);
      this.renderUserTable();
      this.updateLastUpdated();
      this.showNotification(
        `User ${newUser.id} added successfully!`,
        "success"
      );
    }, 1000);
  }

  handleEditUser(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.showNotification(
        `Editing user: ${userId} - ${user.username}`,
        "info"
      );

      // In a real application, you would open a modal with the user data
      setTimeout(() => {
        this.showNotification(
          `User ${userId} updated successfully!`,
          "success"
        );
      }, 1000);
    }
  }

  handleSuspendUser(userId) {
    if (confirm(`Are you sure you want to suspend user ${userId}?`)) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.status = "Suspended";
        this.renderUserTable();
        this.updateLastUpdated();
        this.showNotification(
          `User ${userId} suspended successfully!`,
          "success"
        );
      }
    }
  }

  handleDeleteUser(userId) {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
      const index = this.users.findIndex((u) => u.id === userId);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.renderUserTable();
        this.updateLastUpdated();
        this.showNotification(
          `User ${userId} deleted successfully!`,
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
    // Ctrl/Cmd + A to add new user
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      this.handleAddUser();
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

// Initialize the user management system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.userManagement = new UserManagement();
});
