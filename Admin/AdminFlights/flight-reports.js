// Flight Monthly Reports JavaScript for GoTrip
// This file handles monthly reporting, data aggregation, and export features

class FlightReports {
  constructor() {
    // Mock data - replace with API calls in production
    this.monthlyReports = [
      {
        month: "2025-10",
        totalFlights: 386,
        passengersServed: 57820,
        revenue: 8673000.0,
        canceledFlights: 8,
        averageOccupancy: 87.5,
        peakDay: "Thursday",
        peakDayFlights: 62,
        routeBreakdown: [
          {
            route: "Cairo – Dubai",
            flights: 95,
            passengers: 14250,
            revenue: 2850000,
            occupancy: 89.2,
            canceled: 2,
          },
          {
            route: "Cairo – Jeddah",
            flights: 88,
            passengers: 13200,
            revenue: 2310000,
            occupancy: 88.0,
            canceled: 1,
          },
          {
            route: "Cairo – London",
            flights: 72,
            passengers: 10800,
            revenue: 1944000,
            occupancy: 85.7,
            canceled: 2,
          },
          {
            route: "Cairo – Istanbul",
            flights: 78,
            passengers: 11700,
            revenue: 1287000,
            occupancy: 87.5,
            canceled: 2,
          },
          {
            route: "Alexandria – Dubai",
            flights: 53,
            passengers: 7870,
            revenue: 1181000,
            occupancy: 86.0,
            canceled: 1,
          },
        ],
      },
      {
        month: "2025-09",
        totalFlights: 368,
        passengersServed: 54280,
        revenue: 8142000.0,
        canceledFlights: 6,
        averageOccupancy: 86.2,
        peakDay: "Friday",
        peakDayFlights: 58,
        routeBreakdown: [
          {
            route: "Cairo – Dubai",
            flights: 90,
            passengers: 13500,
            revenue: 2700000,
            occupancy: 88.2,
            canceled: 1,
          },
          {
            route: "Cairo – Jeddah",
            flights: 84,
            passengers: 12600,
            revenue: 2205000,
            occupancy: 87.0,
            canceled: 1,
          },
          {
            route: "Cairo – London",
            flights: 68,
            passengers: 10200,
            revenue: 1836000,
            occupancy: 85.0,
            canceled: 2,
          },
          {
            route: "Cairo – Istanbul",
            flights: 74,
            passengers: 11100,
            revenue: 1221000,
            occupancy: 86.0,
            canceled: 1,
          },
          {
            route: "Alexandria – Dubai",
            flights: 52,
            passengers: 7880,
            revenue: 1180000,
            occupancy: 87.5,
            canceled: 1,
          },
        ],
      },
      {
        month: "2025-08",
        totalFlights: 392,
        passengersServed: 58650,
        revenue: 8797500.0,
        canceledFlights: 7,
        averageOccupancy: 88.0,
        peakDay: "Wednesday",
        peakDayFlights: 64,
        routeBreakdown: [
          {
            route: "Cairo – Dubai",
            flights: 98,
            passengers: 14700,
            revenue: 2940000,
            occupancy: 89.5,
            canceled: 2,
          },
          {
            route: "Cairo – Jeddah",
            flights: 90,
            passengers: 13500,
            revenue: 2362500,
            occupancy: 88.5,
            canceled: 1,
          },
          {
            route: "Cairo – London",
            flights: 74,
            passengers: 11100,
            revenue: 1998000,
            occupancy: 86.0,
            canceled: 1,
          },
          {
            route: "Cairo – Istanbul",
            flights: 80,
            passengers: 12000,
            revenue: 1320000,
            occupancy: 88.0,
            canceled: 2,
          },
          {
            route: "Alexandria – Dubai",
            flights: 50,
            passengers: 7350,
            revenue: 1177000,
            occupancy: 85.0,
            canceled: 1,
          },
        ],
      },
      {
        month: "2025-07",
        totalFlights: 410,
        passengersServed: 61500,
        revenue: 9225000.0,
        canceledFlights: 9,
        averageOccupancy: 88.5,
        peakDay: "Thursday",
        peakDayFlights: 68,
        routeBreakdown: [
          {
            route: "Cairo – Dubai",
            flights: 102,
            passengers: 15300,
            revenue: 3060000,
            occupancy: 90.0,
            canceled: 2,
          },
          {
            route: "Cairo – Jeddah",
            flights: 94,
            passengers: 14100,
            revenue: 2467500,
            occupancy: 89.0,
            canceled: 2,
          },
          {
            route: "Cairo – London",
            flights: 76,
            passengers: 11400,
            revenue: 2052000,
            occupancy: 86.5,
            canceled: 2,
          },
          {
            route: "Cairo – Istanbul",
            flights: 84,
            passengers: 12600,
            revenue: 1386000,
            occupancy: 88.5,
            canceled: 2,
          },
          {
            route: "Alexandria – Dubai",
            flights: 54,
            passengers: 8100,
            revenue: 1259500,
            occupancy: 87.0,
            canceled: 1,
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
    this.animateValue("total-flights", 0, report.totalFlights, 800);
    this.animateValue("passengers-served", 0, report.passengersServed, 800);
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
      this.setTrend("flights-trend", 0);
      this.setTrend("passengers-trend", 0);
      this.setTrend("revenue-trend", 0);
      this.setTrend("occupancy-trend", 0);
      return;
    }

    const current = this.monthlyReports[currentIndex];
    const previous = this.monthlyReports[currentIndex + 1];

    const flightsTrend =
      ((current.totalFlights - previous.totalFlights) / previous.totalFlights) *
      100;
    const passengersTrend =
      ((current.passengersServed - previous.passengersServed) /
        previous.passengersServed) *
      100;
    const revenueTrend =
      ((current.revenue - previous.revenue) / previous.revenue) * 100;
    const occupancyTrend = current.averageOccupancy - previous.averageOccupancy;

    this.setTrend("flights-trend", flightsTrend);
    this.setTrend("passengers-trend", passengersTrend);
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
        <td>${route.flights}</td>
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
      report.canceledFlights;
    const cancelRate = (
      (report.canceledFlights / report.totalFlights) *
      100
    ).toFixed(1);
    document.getElementById(
      "cancel-rate"
    ).textContent = `${cancelRate}% of flights`;

    document.getElementById("peak-day").textContent = report.peakDay;
    document.getElementById(
      "peak-flights"
    ).textContent = `${report.peakDayFlights} flights`;
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

// Initialize the flight reports system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.flightReports = new FlightReports();
});
