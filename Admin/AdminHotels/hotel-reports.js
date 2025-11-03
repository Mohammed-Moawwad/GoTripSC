// Hotel Monthly Reports JavaScript for GoTrip
// This file handles monthly reporting, data aggregation, and export features

class HotelReports {
  constructor() {
    // Mock data - replace with API calls in production
    this.monthlyReports = [
      {
        month: "2025-10",
        totalBookings: 542,
        guestsServed: 1358,
        revenue: 4335000.0,
        canceledBookings: 32,
        averageOccupancy: 78.5,
        averageStay: 3.2,
        propertyBreakdown: [
          {
            property: "Nile Ritz-Carlton Cairo",
            bookings: 156,
            guests: 390,
            revenue: 1425000,
            occupancy: 85.2,
            canceled: 8,
          },
          {
            property: "Four Seasons Alexandria",
            bookings: 128,
            guests: 320,
            revenue: 1024000,
            occupancy: 82.0,
            canceled: 6,
          },
          {
            property: "Steigenberger Hurghada",
            bookings: 142,
            guests: 355,
            revenue: 994000,
            occupancy: 76.5,
            canceled: 9,
          },
          {
            property: "Marriott Sharm El Sheikh",
            bookings: 116,
            guests: 293,
            revenue: 892000,
            occupancy: 72.0,
            canceled: 9,
          },
        ],
      },
      {
        month: "2025-09",
        totalBookings: 498,
        guestsServed: 1245,
        revenue: 3984000.0,
        canceledBookings: 28,
        averageOccupancy: 76.8,
        averageStay: 3.1,
        propertyBreakdown: [
          {
            property: "Nile Ritz-Carlton Cairo",
            bookings: 142,
            guests: 355,
            revenue: 1301500,
            occupancy: 84.0,
            canceled: 7,
          },
          {
            property: "Four Seasons Alexandria",
            bookings: 118,
            guests: 295,
            revenue: 944000,
            occupancy: 80.5,
            canceled: 5,
          },
          {
            property: "Steigenberger Hurghada",
            bookings: 132,
            guests: 330,
            revenue: 924000,
            occupancy: 75.0,
            canceled: 8,
          },
          {
            property: "Marriott Sharm El Sheikh",
            bookings: 106,
            guests: 265,
            revenue: 814500,
            occupancy: 70.5,
            canceled: 8,
          },
        ],
      },
      {
        month: "2025-08",
        totalBookings: 586,
        guestsServed: 1465,
        revenue: 4688000.0,
        canceledBookings: 35,
        averageOccupancy: 81.2,
        averageStay: 3.3,
        propertyBreakdown: [
          {
            property: "Nile Ritz-Carlton Cairo",
            bookings: 168,
            guests: 420,
            revenue: 1540000,
            occupancy: 87.0,
            canceled: 9,
          },
          {
            property: "Four Seasons Alexandria",
            bookings: 138,
            guests: 345,
            revenue: 1104000,
            occupancy: 84.0,
            canceled: 7,
          },
          {
            property: "Steigenberger Hurghada",
            bookings: 156,
            guests: 390,
            revenue: 1092000,
            occupancy: 79.0,
            canceled: 10,
          },
          {
            property: "Marriott Sharm El Sheikh",
            bookings: 124,
            guests: 310,
            revenue: 952000,
            occupancy: 74.5,
            canceled: 9,
          },
        ],
      },
      {
        month: "2025-07",
        totalBookings: 618,
        guestsServed: 1545,
        revenue: 4944000.0,
        canceledBookings: 37,
        averageOccupancy: 82.5,
        averageStay: 3.4,
        propertyBreakdown: [
          {
            property: "Nile Ritz-Carlton Cairo",
            bookings: 178,
            guests: 445,
            revenue: 1630000,
            occupancy: 88.0,
            canceled: 10,
          },
          {
            property: "Four Seasons Alexandria",
            bookings: 146,
            guests: 365,
            revenue: 1168000,
            occupancy: 85.0,
            canceled: 8,
          },
          {
            property: "Steigenberger Hurghada",
            bookings: 164,
            guests: 410,
            revenue: 1148000,
            occupancy: 80.5,
            canceled: 10,
          },
          {
            property: "Marriott Sharm El Sheikh",
            bookings: 130,
            guests: 325,
            revenue: 998000,
            occupancy: 76.0,
            canceled: 9,
          },
        ],
      },
    ];

    this.init();
  }

  init() {
    this.populateMonthSelector();
    this.bindEvents();
    // Load the most recent month by default
    const latestMonth = this.monthlyReports[0].month;
    this.loadReport(latestMonth);
  }

  populateMonthSelector() {
    const selector = document.getElementById("report-month");
    selector.innerHTML = "";

    this.monthlyReports.forEach((report) => {
      const option = document.createElement("option");
      const [year, month] = report.month.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      option.value = report.month;
      option.textContent = monthName;
      selector.appendChild(option);
    });

    // Select the first (latest) month
    selector.value = this.monthlyReports[0].month;
  }

  bindEvents() {
    document.getElementById("report-month").addEventListener("change", (e) => {
      this.loadReport(e.target.value);
    });

    document.querySelector(".export-pdf").addEventListener("click", () => {
      this.exportPDF();
    });

    document.querySelector(".export-excel").addEventListener("click", () => {
      this.exportExcel();
    });

    // Logout button
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        showLogoutModal("../../HomePage/HomePage.html");
      });
    }
  }

  loadReport(month) {
    const report = this.monthlyReports.find((r) => r.month === month);

    if (!report) {
      console.error("Report not found for month:", month);
      this.showNotification("Report not found for selected month", "error");
      return;
    }

    // Update summary cards with animation
    this.animateValue("total-bookings", 0, report.totalBookings, 800);
    this.animateValue("guests-served", 0, report.guestsServed, 800);
    this.animateValue("total-revenue", 0, report.revenue, 800, true);
    this.animateValue(
      "avg-occupancy",
      0,
      report.averageOccupancy,
      800,
      false,
      true
    );

    // Calculate and update trends
    this.updateTrends(month);

    // Populate property breakdown table
    this.populatePropertyBreakdown(report.propertyBreakdown);

    // Update additional stats
    this.updateAdditionalStats(report);

    this.showNotification(
      `Loaded report for ${this.formatMonthName(month)}`,
      "success"
    );
  }

  animateValue(
    elementId,
    start,
    end,
    duration,
    isCurrency = false,
    isPercentage = false
  ) {
    const element = document.getElementById(elementId);
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = start + (end - start) * this.easeOutQuad(progress);

      if (isCurrency) {
        element.textContent =
          "$" +
          Math.floor(current).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
      } else if (isPercentage) {
        element.textContent = current.toFixed(1) + "%";
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }

  easeOutQuad(t) {
    return t * (2 - t);
  }

  formatMonthName(month) {
    const [year, monthNum] = month.split("-");
    return new Date(year, monthNum - 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  updateTrends(currentMonth) {
    const currentIndex = this.monthlyReports.findIndex(
      (r) => r.month === currentMonth
    );
    if (
      currentIndex === -1 ||
      currentIndex === this.monthlyReports.length - 1
    ) {
      // No previous month to compare
      this.setTrend("bookings-trend", 0);
      this.setTrend("guests-trend", 0);
      this.setTrend("revenue-trend", 0);
      this.setTrend("occupancy-trend", 0);
      return;
    }

    const current = this.monthlyReports[currentIndex];
    const previous = this.monthlyReports[currentIndex + 1];

    const bookingsTrend =
      ((current.totalBookings - previous.totalBookings) /
        previous.totalBookings) *
      100;
    const guestsTrend =
      ((current.guestsServed - previous.guestsServed) / previous.guestsServed) *
      100;
    const revenueTrend =
      ((current.revenue - previous.revenue) / previous.revenue) * 100;
    const occupancyTrend = current.averageOccupancy - previous.averageOccupancy;

    this.setTrend("bookings-trend", bookingsTrend);
    this.setTrend("guests-trend", guestsTrend);
    this.setTrend("revenue-trend", revenueTrend);
    this.setTrend("occupancy-trend", occupancyTrend);
  }

  setTrend(elementId, value) {
    const element = document.getElementById(elementId);
    const sign = value > 0 ? "+" : "";
    element.textContent = `${sign}${value.toFixed(1)}% vs last month`;

    // Update trend class
    element.className = "trend";
    if (value > 0) {
      element.classList.add("positive");
    } else if (value < 0) {
      element.classList.add("negative");
    } else {
      element.classList.add("neutral");
    }
  }

  populatePropertyBreakdown(properties) {
    const tbody = document.getElementById("property-breakdown-body");
    tbody.innerHTML = "";

    properties.forEach((property, index) => {
      const row = document.createElement("tr");
      row.style.animationDelay = `${index * 50}ms`;
      row.innerHTML = `
        <td><strong>${property.property}</strong></td>
        <td>${property.bookings}</td>
        <td>${property.guests.toLocaleString()}</td>
        <td>$${property.revenue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}</td>
        <td>${property.occupancy.toFixed(1)}%</td>
        <td><span class="canceled-badge">${property.canceled}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  updateAdditionalStats(report) {
    // Find top performing property by revenue
    const topProperty = report.propertyBreakdown.reduce((max, property) =>
      property.revenue > max.revenue ? property : max
    );

    document.getElementById("top-property").textContent = topProperty.property;
    document.getElementById("top-property-revenue").textContent =
      "$" +
      topProperty.revenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      });

    document.getElementById("total-canceled").textContent =
      report.canceledBookings;
    const cancelRate = (
      (report.canceledBookings / report.totalBookings) *
      100
    ).toFixed(1);
    document.getElementById(
      "cancel-rate"
    ).textContent = `${cancelRate}% of bookings`;

    document.getElementById("avg-stay").textContent =
      report.averageStay.toFixed(1);
    document.getElementById("stay-info").textContent = "nights per booking";
  }

  exportPDF() {
    this.showNotification("Generating PDF report...", "info");

    // In production, integrate with jsPDF or call backend API
    setTimeout(() => {
      this.showNotification(
        "PDF export feature coming soon! Integrate with jsPDF library.",
        "info"
      );
      console.log(
        "Export PDF functionality - use jsPDF library or backend API"
      );
    }, 1000);
  }

  exportExcel() {
    this.showNotification("Generating Excel report...", "info");

    // In production, integrate with SheetJS (xlsx) or backend API
    setTimeout(() => {
      this.showNotification(
        "Excel export feature coming soon! Integrate with SheetJS library.",
        "info"
      );
      console.log(
        "Export Excel functionality - use SheetJS (xlsx) library or backend API"
      );
    }, 1000);
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

    // Add styles if not already added
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
          gap: 12px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-info { border-left: 4px solid #1a73e8; }
        .notification-success { border-left: 4px solid #1e8e3e; }
        .notification-error { border-left: 4px solid #d93025; }
        
        .notification-icon { font-size: 20px; }
        .notification-info .notification-icon { color: #1a73e8; }
        .notification-success .notification-icon { color: #1e8e3e; }
        .notification-error .notification-icon { color: #d93025; }
        
        .notification-message { flex: 1; color: #333; }
        
        .notification-close {
          background: none;
          border: none;
          color: #5f6368;
          cursor: pointer;
          padding: 4px;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "exclamation-circle";
      case "info":
      default:
        return "info-circle";
    }
  }
}

// Initialize the hotel reports system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.hotelReports = new HotelReports();
});
