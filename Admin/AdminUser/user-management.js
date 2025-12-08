// User Management JavaScript for GoTrip
// This file contains all interactive functionality for the user management page

const API_BASE_URL = "http://localhost:3000/api";

class UserManagement {
  constructor() {
    this.users = [];
    this.init();
  }

  // ====================================
  // FETCH USERS FROM BACKEND
  // ====================================
  async fetchUsers() {
    try {
      console.log("🔍 Fetching users from backend...");
      console.log("📍 API URL:", `${API_BASE_URL}/auth/users`);

      const response = await fetch(`${API_BASE_URL}/auth/users`);

      console.log("📞 Response status:", response.status);
      console.log("📄 Response ok:", response.ok);

      const result = await response.json();

      console.log("📦 Response data:", result);
      console.log("📦 Result.success:", result.success);
      console.log("📦 Result.data:", result.data);

      if (result.success && result.data && result.data.users) {
        console.log("✅ Users array found, length:", result.data.users.length);

        // Transform backend data to match admin table format
        this.users = result.data.users.map((user) => ({
          id: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone || "N/A",
          birthDate: user.birth_date
            ? new Date(user.birth_date).toISOString().split("T")[0]
            : "N/A",
          password: "********",
          registered: user.registered_date
            ? new Date(user.registered_date).toISOString().split("T")[0]
            : "N/A",
          lastLogin: user.last_login
            ? new Date(user.last_login).toLocaleDateString("en-US")
            : "Never",
          status: user.status || "Active",
          _fullData: user,
        }));

        console.log(`✅ Loaded ${this.users.length} users from database`);
        this.renderUserTable();
        this.updateStats(result.data.statistics);
      } else {
        console.error("❌ Invalid response structure");
        console.error("Result success:", result.success);
        console.error("Result data exists:", !!result.data);
        console.error(
          "Users array exists:",
          result.data && !!result.data.users
        );
        this.showNotification("Invalid response from server", "error");
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      this.showNotification(
        "Error loading users from server: " + error.message,
        "error"
      );
    }
  }

  init() {
    this.fetchUsers();
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
                <td><span class="status-badge ${statusClass}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${user.id}" title="Edit User">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" data-id="${user.id}" title="Delete User">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            `;

      tableBody.appendChild(row);
    });
  }

  updateStats(statistics) {
    if (statistics) {
      // Update Total Users stat
      const totalUsersElement = document.querySelector(
        ".stat-card:nth-child(1) .stat-number"
      );
      if (totalUsersElement) {
        totalUsersElement.textContent = statistics.totalUsers;
      }

      // Update Active Users stat
      const activeUsersElement = document.querySelector(
        ".stat-card:nth-child(2) .stat-number"
      );
      if (activeUsersElement) {
        activeUsersElement.textContent = statistics.activeUsers;
      }

      // Update InActive Users stat
      const inactiveUsersElement = document.querySelector(
        ".stat-card:nth-child(3) .stat-number"
      );
      if (inactiveUsersElement) {
        inactiveUsersElement.textContent = statistics.inactiveUsers;
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

      dateInput.addEventListener("input", (e) => {
        toggleClear();
        this.handleDateFilter(e.target.value);
      });

      clearBtn.addEventListener("click", () => {
        dateInput.value = "";
        toggleClear();
        this.renderUserTable();
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
            // Trigger the date filter
            this.handleDateFilter(iso);
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
    const term = searchTerm.toLowerCase();

    if (!term) {
      // If search is empty, show all users
      this.renderUserTable();
      console.log("🔍 Search cleared, showing all users");
      return;
    }

    // Filter users based on search term
    const filtered = this.users.filter((user) => {
      const searchFields = [
        user.firstName.toLowerCase(),
        user.lastName.toLowerCase(),
        user.email.toLowerCase(),
        user.phone.toLowerCase(),
        user.id.toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(term));
    });

    console.log(`🔍 Search found ${filtered.length} users matching "${term}"`);

    // Render filtered results
    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return;

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 40px; color: #999;">
            <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.3;"></i>
            No users found matching "${term}"
          </td>
        </tr>
      `;
      return;
    }

    this.renderFilteredUsers(filtered);
  }

  handleFilter(status) {
    console.log(`📊 Filtering by status: ${status}`);

    if (status === "all") {
      // Show all users
      this.renderUserTable();
      return;
    }

    // Filter users based on status
    const filtered = this.users.filter(
      (user) => user.status.toLowerCase() === status.toLowerCase()
    );

    console.log(
      `📊 Filter found ${filtered.length} users with status "${status}"`
    );

    // Render filtered results
    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return;

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 40px; color: #999;">
            <i class="fas fa-filter" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.3;"></i>
            No users found with status "${status}"
          </td>
        </tr>
      `;
      return;
    }

    this.renderFilteredUsers(filtered);
  }

  renderFilteredUsers(filteredUsers) {
    const tableBody = document.getElementById("user-table-body");

    if (!tableBody) {
      console.error("User table body not found");
      return;
    }

    tableBody.innerHTML = "";

    filteredUsers.forEach((user) => {
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
                <td><span class="status-badge ${statusClass}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${user.id}" title="Edit User">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" data-id="${user.id}" title="Delete User">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            `;

      tableBody.appendChild(row);
    });
  }

  handleDateFilter(dateString) {
    if (!dateString) {
      // If no date selected, show all users
      this.renderUserTable();
      return;
    }

    console.log(`📅 Filtering by registration date: ${dateString}`);

    // Convert the input date to a Date object (start of day)
    const [year, month, day] = dateString.split("-");
    const selectedDate = new Date(year, parseInt(month) - 1, day);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Filter users registered on the selected date
    const filtered = this.users.filter((user) => {
      if (!user.registered) return false;

      const [userYear, userMonth, userDay] = user.registered.split("-");
      const userDate = new Date(userYear, parseInt(userMonth) - 1, userDay);
      userDate.setHours(0, 0, 0, 0);

      return userDate.getTime() === selectedDate.getTime();
    });

    console.log(
      `📅 Date filter found ${filtered.length} users registered on ${dateString}`
    );

    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return;

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 40px; color: #999;">
            <i class="fas fa-calendar" style="font-size: 48px; margin-bottom: 20px; display: block; opacity: 0.3;"></i>
            No users registered on ${dateString}
          </td>
        </tr>
      `;
      this.showNotification(`No users registered on ${dateString}`, "info");
      return;
    }

    this.renderFilteredUsers(filtered);
    this.showNotification(
      `Found ${filtered.length} user(s) registered on ${dateString}`,
      "info"
    );
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
    // Clear form and set mode to "add"
    document.getElementById("modalTitle").textContent = "Add New User";
    document.getElementById("userForm").reset();
    document.getElementById("userModal").setAttribute("data-mode", "add");
    document.getElementById("userModal").removeAttribute("data-user-id");

    // Show modal
    document.getElementById("userModal").style.display = "flex";
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
// Modal Functions for User Form
function closeUserModal() {
  document.getElementById("userModal").style.display = "none";
}

// Handle user form submission
document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  if (userForm) {
    userForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const birthDate = document.getElementById("birthDate").value;
      const status = document.getElementById("status").value;

      const newUser = {
        id: "USR00" + (window.userManagement.users.length + 1),
        username: (firstName + lastName).toLowerCase(),
        email: email,
        phone: phone,
        registered: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
        status: status,
        birthDate: birthDate,
        firstName: firstName,
        lastName: lastName,
      };

      // Add to users array
      window.userManagement.users.push(newUser);
      window.userManagement.renderUserTable();
      window.userManagement.updateLastUpdated();
      window.userManagement.showNotification(
        `User ${newUser.id} added successfully!`,
        "success"
      );

      // Close modal and reset form
      closeUserModal();
      userForm.reset();
    });
  }

  window.userManagement = new UserManagement();
});
