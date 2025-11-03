// Bus Monthly Reports JavaScript for GoTrip
// This file handles monthly reporting, data aggregation, and export features

class BusReports {
  constructor() {
    // Mock data - replace with API calls in production
    this.monthlyReports = [
      {
        month: "2025-10",
        totalTrips: 145,
        usersServed: 4832,
        revenue: 578400.0,
        canceledTrips: 12,
        averageOccupancy: 82.4,
        peakDay: "Friday",
        peakDayTrips: 28,
        routeBreakdown: [
          {
            route: "Cairo – Alexandria",
            trips: 45,
            passengers: 1520,
            revenue: 182400,
            occupancy: 85.3,
            canceled: 3,
          },
          {
            route: "Cairo – Hurghada",
            trips: 38,
            passengers: 1254,
            revenue: 313500,
            occupancy: 83.1,
            canceled: 2,
          },
          {
            route: "Alexandria – Marsa Matrouh",
            trips: 42,
            passengers: 1398,
            revenue: 251640,
            occupancy: 79.0,
            canceled: 5,
          },
          {
            route: "Cairo – Sharm El Sheikh",
            trips: 20,
            passengers: 660,
            revenue: 198000,
            occupancy: 82.5,
            canceled: 2,
          },
        ],
      },
      {
        month: "2025-09",
        totalTrips: 129,
        usersServed: 4324,
        revenue: 518880.0,
        canceledTrips: 8,
        averageOccupancy: 84.2,
        peakDay: "Saturday",
        peakDayTrips: 25,
        routeBreakdown: [
          {
            route: "Cairo – Alexandria",
            trips: 40,
            passengers: 1360,
            revenue: 163200,
            occupancy: 85.0,
            canceled: 2,
          },
          {
            route: "Cairo – Hurghada",
            trips: 35,
            passengers: 1155,
            revenue: 288750,
            occupancy: 82.5,
            canceled: 1,
          },
          {
            route: "Alexandria – Marsa Matrouh",
            trips: 38,
            passengers: 1254,
            revenue: 225720,
            occupancy: 82.6,
            canceled: 3,
          },
          {
            route: "Cairo – Sharm El Sheikh",
            trips: 16,
            passengers: 555,
            revenue: 166500,
            occupancy: 86.7,
            canceled: 2,
          },
        ],
      },
      {
        month: "2025-08",
        totalTrips: 138,
        usersServed: 4692,
        revenue: 563040.0,
        canceledTrips: 10,
        averageOccupancy: 85.0,
        peakDay: "Thursday",
        peakDayTrips: 26,
        routeBreakdown: [
          {
            route: "Cairo – Alexandria",
            trips: 43,
            passengers: 1462,
            revenue: 175440,
            occupancy: 85.0,
            canceled: 2,
          },
          {
            route: "Cairo – Hurghada",
            trips: 36,
            passengers: 1188,
            revenue: 297000,
            occupancy: 82.5,
            canceled: 3,
          },
          {
            route: "Alexandria – Marsa Matrouh",
            trips: 40,
            passengers: 1320,
            revenue: 237600,
            occupancy: 82.5,
            canceled: 3,
          },
          {
            route: "Cairo – Sharm El Sheikh",
            trips: 19,
            passengers: 722,
            revenue: 216600,
            occupancy: 95.0,
            canceled: 2,
          },
        ],
      },
      {
        month: "2025-07",
        totalTrips: 156,
        usersServed: 5304,
        revenue: 636480.0,
        canceledTrips: 9,
        averageOccupancy: 85.0,
        peakDay: "Friday",
        peakDayTrips: 30,
        routeBreakdown: [
          {
            route: "Cairo – Alexandria",
            trips: 48,
            passengers: 1632,
            revenue: 195840,
            occupancy: 85.0,
            canceled: 2,
          },
          {
            route: "Cairo – Hurghada",
            trips: 42,
            passengers: 1386,
            revenue: 346500,
            occupancy: 82.5,
            canceled: 2,
          },
          {
            route: "Alexandria – Marsa Matrouh",
            trips: 45,
            passengers: 1485,
            revenue: 267300,
            occupancy: 82.5,
            canceled: 3,
          },
          {
            route: "Cairo – Sharm El Sheikh",
            trips: 21,
            passengers: 801,
            revenue: 240300,
            occupancy: 95.4,
            canceled: 2,
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
    this.animateValue("total-trips", 0, report.totalTrips, 800);
    this.animateValue("users-served", 0, report.usersServed, 800);
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

    // Populate route breakdown table
    this.populateRouteBreakdown(report.routeBreakdown);

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
      this.setTrend("trips-trend", 0);
      this.setTrend("users-trend", 0);
      this.setTrend("revenue-trend", 0);
      this.setTrend("occupancy-trend", 0);
      return;
    }

    const current = this.monthlyReports[currentIndex];
    const previous = this.monthlyReports[currentIndex + 1];

    const tripsTrend =
      ((current.totalTrips - previous.totalTrips) / previous.totalTrips) * 100;
    const usersTrend =
      ((current.usersServed - previous.usersServed) / previous.usersServed) *
      100;
    const revenueTrend =
      ((current.revenue - previous.revenue) / previous.revenue) * 100;
    const occupancyTrend = current.averageOccupancy - previous.averageOccupancy;

    this.setTrend("trips-trend", tripsTrend);
    this.setTrend("users-trend", usersTrend);
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

  populateRouteBreakdown(routes) {
    const tbody = document.getElementById("route-breakdown-body");
    tbody.innerHTML = "";

    routes.forEach((route, index) => {
      const row = document.createElement("tr");
      row.style.animationDelay = `${index * 50}ms`;
      row.innerHTML = `
        <td><strong>${route.route}</strong></td>
        <td>${route.trips}</td>
        <td>${route.passengers.toLocaleString()}</td>
        <td>$${route.revenue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}</td>
        <td>${route.occupancy.toFixed(1)}%</td>
        <td><span class="canceled-badge">${route.canceled}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  updateAdditionalStats(report) {
    // Find top performing route by revenue
    const topRoute = report.routeBreakdown.reduce((max, route) =>
      route.revenue > max.revenue ? route : max
    );

    document.getElementById("top-route").textContent = topRoute.route;
    document.getElementById("top-route-revenue").textContent =
      "$" +
      topRoute.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 });

    document.getElementById("total-canceled").textContent =
      report.canceledTrips;
    const cancelRate = (
      (report.canceledTrips / report.totalTrips) *
      100
    ).toFixed(1);
    document.getElementById(
      "cancel-rate"
    ).textContent = `${cancelRate}% of trips`;

    document.getElementById("peak-day").textContent = report.peakDay;
    document.getElementById(
      "peak-trips"
    ).textContent = `${report.peakDayTrips} trips`;
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

// Initialize the bus reports system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.busReports = new BusReports();
});
