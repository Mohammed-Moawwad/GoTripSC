// User Monthly Reports JavaScript for GoTrip
// This file handles monthly user reporting, analytics, and export features

class UserReports {
  constructor() {
    // Mock data - replace with API calls in production
    this.monthlyReports = [
      {
        month: "2025-10",
        newRegistrations: 156,
        activeUsers: 892,
        totalBookings: 1245,
        retentionRate: 87.5,
        avgSessionDuration: 12.5,
        suspendedAccounts: 5,
        segmentBreakdown: [
          {
            segment: "Frequent Travelers",
            totalUsers: 245,
            newThisMonth: 38,
            activeUsers: 220,
            bookingsMade: 485,
            avgSessions: 8.2,
          },
          {
            segment: "Business Travelers",
            totalUsers: 198,
            newThisMonth: 29,
            activeUsers: 178,
            bookingsMade: 356,
            avgSessions: 6.5,
          },
          {
            segment: "Leisure Travelers",
            totalUsers: 312,
            newThisMonth: 52,
            activeUsers: 285,
            bookingsMade: 298,
            avgSessions: 4.8,
          },
          {
            segment: "New Users",
            totalUsers: 137,
            newThisMonth: 37,
            activeUsers: 109,
            bookingsMade: 106,
            avgSessions: 2.1,
          },
        ],
        topLocations: [
          { location: "Saudi Arabia", users: 425 },
          { location: "United Arab Emirates", users: 198 },
          { location: "Egypt", users: 145 },
          { location: "United States", users: 76 },
          { location: "United Kingdom", users: 48 },
        ],
        deviceUsage: [
          { device: "Mobile", percentage: 62 },
          { device: "Desktop", percentage: 28 },
          { device: "Tablet", percentage: 10 },
        ],
        userRatings: [
          { stars: "5 Stars", count: 542 },
          { stars: "4 Stars", count: 256 },
          { stars: "3 Stars", count: 78 },
          { stars: "2 Stars", count: 12 },
          { stars: "1 Star", count: 4 },
        ],
      },
      {
        month: "2025-09",
        newRegistrations: 142,
        activeUsers: 845,
        totalBookings: 1178,
        retentionRate: 86.2,
        avgSessionDuration: 11.8,
        suspendedAccounts: 4,
        segmentBreakdown: [
          {
            segment: "Frequent Travelers",
            totalUsers: 232,
            newThisMonth: 35,
            activeUsers: 208,
            bookingsMade: 458,
            avgSessions: 7.9,
          },
          {
            segment: "Business Travelers",
            totalUsers: 186,
            newThisMonth: 26,
            activeUsers: 168,
            bookingsMade: 336,
            avgSessions: 6.2,
          },
          {
            segment: "Leisure Travelers",
            totalUsers: 295,
            newThisMonth: 48,
            activeUsers: 270,
            bookingsMade: 282,
            avgSessions: 4.5,
          },
          {
            segment: "New Users",
            totalUsers: 132,
            newThisMonth: 33,
            activeUsers: 99,
            bookingsMade: 102,
            avgSessions: 2.0,
          },
        ],
        topLocations: [
          { location: "Saudi Arabia", users: 402 },
          { location: "United Arab Emirates", users: 187 },
          { location: "Egypt", users: 138 },
          { location: "United States", users: 72 },
          { location: "United Kingdom", users: 46 },
        ],
        deviceUsage: [
          { device: "Mobile", percentage: 60 },
          { device: "Desktop", percentage: 30 },
          { device: "Tablet", percentage: 10 },
        ],
        userRatings: [
          { stars: "5 Stars", count: 512 },
          { stars: "4 Stars", count: 245 },
          { stars: "3 Stars", count: 72 },
          { stars: "2 Stars", count: 11 },
          { stars: "1 Star", count: 5 },
        ],
      },
      {
        month: "2025-08",
        newRegistrations: 168,
        activeUsers: 912,
        totalBookings: 1298,
        retentionRate: 88.1,
        avgSessionDuration: 13.2,
        suspendedAccounts: 6,
        segmentBreakdown: [
          {
            segment: "Frequent Travelers",
            totalUsers: 258,
            newThisMonth: 42,
            activeUsers: 232,
            bookingsMade: 512,
            avgSessions: 8.5,
          },
          {
            segment: "Business Travelers",
            totalUsers: 205,
            newThisMonth: 31,
            activeUsers: 185,
            bookingsMade: 368,
            avgSessions: 6.8,
          },
          {
            segment: "Leisure Travelers",
            totalUsers: 325,
            newThisMonth: 55,
            activeUsers: 296,
            bookingsMade: 312,
            avgSessions: 5.1,
          },
          {
            segment: "New Users",
            totalUsers: 124,
            newThisMonth: 40,
            activeUsers: 99,
            bookingsMade: 106,
            avgSessions: 2.3,
          },
        ],
        topLocations: [
          { location: "Saudi Arabia", users: 445 },
          { location: "United Arab Emirates", users: 205 },
          { location: "Egypt", users: 152 },
          { location: "United States", users: 78 },
          { location: "United Kingdom", users: 32 },
        ],
        deviceUsage: [
          { device: "Mobile", percentage: 64 },
          { device: "Desktop", percentage: 27 },
          { device: "Tablet", percentage: 9 },
        ],
        userRatings: [
          { stars: "5 Stars", count: 568 },
          { stars: "4 Stars", count: 268 },
          { stars: "3 Stars", count: 62 },
          { stars: "2 Stars", count: 10 },
          { stars: "1 Star", count: 4 },
        ],
      },
      {
        month: "2025-07",
        newRegistrations: 175,
        activeUsers: 935,
        totalBookings: 1356,
        retentionRate: 89.2,
        avgSessionDuration: 13.8,
        suspendedAccounts: 3,
        segmentBreakdown: [
          {
            segment: "Frequent Travelers",
            totalUsers: 265,
            newThisMonth: 45,
            activeUsers: 238,
            bookingsMade: 535,
            avgSessions: 8.8,
          },
          {
            segment: "Business Travelers",
            totalUsers: 212,
            newThisMonth: 33,
            activeUsers: 192,
            bookingsMade: 385,
            avgSessions: 7.1,
          },
          {
            segment: "Leisure Travelers",
            totalUsers: 335,
            newThisMonth: 58,
            activeUsers: 305,
            bookingsMade: 328,
            avgSessions: 5.3,
          },
          {
            segment: "New Users",
            totalUsers: 123,
            newThisMonth: 39,
            activeUsers: 100,
            bookingsMade: 108,
            avgSessions: 2.4,
          },
        ],
        topLocations: [
          { location: "Saudi Arabia", users: 458 },
          { location: "United Arab Emirates", users: 212 },
          { location: "Egypt", users: 158 },
          { location: "United States", users: 82 },
          { location: "United Kingdom", users: 25 },
        ],
        deviceUsage: [
          { device: "Mobile", percentage: 65 },
          { device: "Desktop", percentage: 26 },
          { device: "Tablet", percentage: 9 },
        ],
        userRatings: [
          { stars: "5 Stars", count: 589 },
          { stars: "4 Stars", count: 275 },
          { stars: "3 Stars", count: 58 },
          { stars: "2 Stars", count: 9 },
          { stars: "1 Star", count: 4 },
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
    this.animateValue("new-registrations", 0, report.newRegistrations, 800);
    this.animateValue("active-users", 0, report.activeUsers, 800);
    this.animateValue("total-bookings", 0, report.totalBookings, 800);
    this.animateValue(
      "retention-rate",
      0,
      report.retentionRate,
      800,
      true,
      "%"
    );

    // Update trends (mock comparison)
    this.updateTrend("registrations-trend", 12.5, true);
    this.updateTrend("active-trend", 5.6, true);
    this.updateTrend("bookings-trend", 8.2, true);
    this.updateTrend("retention-trend", 1.5, true);

    // Update additional stats
    document.getElementById("top-user").textContent = "john_doe";
    document.getElementById("top-user-bookings").textContent = "47 bookings";
    document.getElementById("total-suspended").textContent =
      report.suspendedAccounts;
    document.getElementById("suspend-rate").textContent =
      ((report.suspendedAccounts / report.activeUsers) * 100).toFixed(1) +
      "% of total users";
    document.getElementById("avg-session").textContent =
      report.avgSessionDuration.toFixed(1);
    document.getElementById("session-info").textContent = "minutes per session";

    // Update segment breakdown table
    this.updateSegmentBreakdown(report.segmentBreakdown);

    // Update demographics
    this.updateDemographics(report);

    this.showNotification("Report loaded successfully", "success");
  }

  animateValue(
    elementId,
    start,
    end,
    duration,
    isDecimal = false,
    suffix = ""
  ) {
    const element = document.getElementById(elementId);
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = this.easeOutQuad(progress);
      const current = start + (end - start) * easedProgress;

      if (isDecimal) {
        element.textContent = current.toFixed(1) + suffix;
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  easeOutQuad(t) {
    return t * (2 - t);
  }

  updateTrend(elementId, value, isPositive) {
    const element = document.getElementById(elementId);
    const sign = isPositive ? "+" : "";
    element.textContent = `${sign}${value.toFixed(1)}% vs last month`;
    element.className = "trend";
    if (isPositive) {
      element.classList.add("positive");
    } else if (value < 0) {
      element.classList.add("negative");
    } else {
      element.classList.add("neutral");
    }
  }

  updateSegmentBreakdown(segments) {
    const tbody = document.getElementById("segment-breakdown-body");
    tbody.innerHTML = "";

    segments.forEach((segment, index) => {
      const row = document.createElement("tr");
      row.style.animationDelay = `${index * 50}ms`;

      row.innerHTML = `
                <td>${segment.segment}</td>
                <td>${segment.totalUsers.toLocaleString()}</td>
                <td>${segment.newThisMonth.toLocaleString()}</td>
                <td>${segment.activeUsers.toLocaleString()}</td>
                <td>${segment.bookingsMade.toLocaleString()}</td>
                <td>${segment.avgSessions.toFixed(1)}</td>
            `;

      tbody.appendChild(row);
    });
  }

  updateDemographics(report) {
    // Top Locations
    const locationsList = document.getElementById("top-locations-list");
    locationsList.innerHTML = "";
    report.topLocations.forEach((loc) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <span class="label">${loc.location}</span>
                <span class="value">${loc.users} users</span>
            `;
      locationsList.appendChild(li);
    });

    // Device Usage
    const deviceList = document.getElementById("device-usage-list");
    deviceList.innerHTML = "";
    report.deviceUsage.forEach((device) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <span class="label">${device.device}</span>
                <span class="value">${device.percentage}%</span>
            `;
      deviceList.appendChild(li);
    });

    // User Ratings
    const ratingsList = document.getElementById("ratings-list");
    ratingsList.innerHTML = "";
    report.userRatings.forEach((rating) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <span class="label">${rating.stars}</span>
                <span class="value">${rating.count} reviews</span>
            `;
      ratingsList.appendChild(li);
    });
  }

  exportPDF() {
    this.showNotification("Exporting report as PDF...", "info");
    // In production, implement actual PDF generation
    setTimeout(() => {
      this.showNotification("PDF export completed!", "success");
    }, 1500);
  }

  exportExcel() {
    this.showNotification("Exporting report as Excel...", "info");
    // In production, implement actual Excel generation
    setTimeout(() => {
      this.showNotification("Excel export completed!", "success");
    }, 1500);
  }

  showNotification(message, type = "info") {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In production, implement actual notification UI
  }
}

// Initialize reports when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.userReports = new UserReports();
});
