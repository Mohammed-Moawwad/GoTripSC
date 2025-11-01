// Parse and display search parameters
const params = new URLSearchParams(location.search);
const destination = params.get("destination") || "Select destination";
const checkin = params.get("checkin") || "";
const checkout = params.get("checkout") || "";
const guests = params.get("guests") || "Guests";

// Format dates to be more user-friendly
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

// Calculate number of nights
function calculateNights(checkinStr, checkoutStr) {
  if (!checkinStr || !checkoutStr) return "";
  const checkinDate = new Date(checkinStr);
  const checkoutDate = new Date(checkoutStr);
  const nights = Math.round(
    (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
  );
  return nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "";
}

// Update header with search info
const destinationEl = document.getElementById("hotelDestination");
const datesEl = document.getElementById("hotelDates");
const metaEl = document.getElementById("hotelMeta");

if (destinationEl) {
  destinationEl.textContent = `Hotels in ${destination}`;
}

const formattedCheckin = formatDate(checkin);
const formattedCheckout = formatDate(checkout);
const nights = calculateNights(checkin, checkout);

if (datesEl && formattedCheckin && formattedCheckout) {
  datesEl.textContent = `${formattedCheckin} → ${formattedCheckout}${
    nights ? " • " + nights : ""
  } • ${guests}`;
}

if (metaEl) {
  metaEl.textContent = "Finding the best hotels for your stay";
}

// Language and currency selection (persisted)
function setPref(cls, val) {
  localStorage.setItem(cls, val);
  document.querySelectorAll("." + cls).forEach((el) => {
    el.classList.toggle("active", el.dataset.value === val);
  });
  // update visible currency button when currency changes
  const curBtn = document.querySelector(".cur-btn");
  if (curBtn && cls === "cur") {
    curBtn.textContent = val + " ▾";
  }
  // update visible language button when language changes
  const langBtn = document.querySelector(".lang-btn");
  if (langBtn && cls === "lang") {
    langBtn.textContent = val + " ▾";
  }
}

// init from storage (fallbacks)
setPref("lang", localStorage.getItem("lang") || "EN");
setPref("cur", localStorage.getItem("cur") || "SAR");

// language dropdown behavior (touch/click)
(function () {
  const dropdown = document.querySelector(".lang-dropdown");
  if (!dropdown) return;
  const btn = dropdown.querySelector(".lang-btn");
  const menu = dropdown.querySelector(".lang-menu");
  // toggle on button click (useful on touch)
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    dropdown.classList.toggle("open");
    btn.setAttribute("aria-expanded", dropdown.classList.contains("open"));
  });
  // select language from menu
  menu.querySelectorAll(".lang-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      const v = this.dataset.value;
      setPref("lang", v);
      // mark active in menu
      menu
        .querySelectorAll(".lang-item")
        .forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
  // close when clicking outside
  document.addEventListener("click", function (ev) {
    if (!dropdown.contains(ev.target)) {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
  // initialize active menu item
  const saved = localStorage.getItem("lang") || "EN";
  const activeItem = menu.querySelector(`.lang-item[data-value="${saved}"]`);
  if (activeItem) activeItem.classList.add("active");
})();

// currency dropdown behavior (touch/click)
(function () {
  const dropdown = document.querySelector(".cur-dropdown");
  if (!dropdown) return;
  const btn = dropdown.querySelector(".cur-btn");
  const menu = dropdown.querySelector(".cur-menu");
  // toggle on button click (useful on touch)
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    dropdown.classList.toggle("open");
    btn.setAttribute("aria-expanded", dropdown.classList.contains("open"));
  });
  // select currency from menu
  menu.querySelectorAll(".cur-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      const v = this.dataset.value;
      setPref("cur", v);
      // mark active in menu
      menu
        .querySelectorAll(".cur-item")
        .forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
  // close when clicking outside
  document.addEventListener("click", function (ev) {
    if (!dropdown.contains(ev.target)) {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
  // initialize active menu item
  const saved = localStorage.getItem("cur") || "SAR";
  const activeItem = menu.querySelector(`.cur-item[data-value="${saved}"]`);
  if (activeItem) activeItem.classList.add("active");
})();

// optional: simple handlers for support/my trips
document.getElementById("supportLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Open Support (implement link)");
});
document.getElementById("myTripsLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Open My Trips (implement link)");
});

// NAV selection: make nav-left items selectable and optionally navigate
document.querySelectorAll(".site-nav .nav-left a.nav-link").forEach((a) => {
  a.addEventListener("click", (e) => {
    // If clicking the already active link, do nothing
    if (a.classList.contains("active")) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    document
      .querySelectorAll(".site-nav .nav-left a.nav-link")
      .forEach((x) => x.classList.remove("active"));
    a.classList.add("active");
    const href = a.getAttribute("href");
    if (href) {
      // navigate to the link
      window.location.href = href;
    }
  });
});

// Fake hotel data for testing (Saudi Arabia hotels)
const hotelData = [
  {
    id: 1,
    name: "Fairmont Riyadh",
    stars: 5,
    location: "King Fahd Road, Riyadh • 2.5 km from center",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    price: 850,
    rating: 9.1,
    ratingText: "Excellent",
    reviews: 1580,
    amenities: ["Free WiFi", "Pool", "Restaurant", "Gym"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 2,
    name: "Al Murooj Rotana Riyadh",
    stars: 5,
    location: "Al Olaya, Riyadh • 1.8 km from center",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    price: 720,
    rating: 8.9,
    ratingText: "Very Good",
    reviews: 1240,
    amenities: ["Free WiFi", "Pool", "Free Parking", "Restaurant"],
    freeCancel: true,
    payAtProperty: false,
    available: true,
    instantBooking: true,
  },
  {
    id: 3,
    name: "Hilton Jeddah",
    stars: 5,
    location: "Corniche Road, Jeddah • 3.2 km from center",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
    price: 680,
    rating: 8.7,
    ratingText: "Very Good",
    reviews: 960,
    amenities: ["Free WiFi", "Pool", "Restaurant", "Gym"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 4,
    name: "Narcissus Hotel Riyadh",
    stars: 5,
    location: "Al Olaya District, Riyadh • 1.2 km from center",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    price: 950,
    rating: 9.3,
    ratingText: "Exceptional",
    reviews: 2350,
    amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Free Parking"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 5,
    name: "Crowne Plaza Riyadh",
    stars: 4,
    location: "King Abdullah Road, Riyadh • 4.5 km from center",
    image:
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=400&h=300&fit=crop",
    price: 520,
    rating: 8.4,
    ratingText: "Very Good",
    reviews: 780,
    amenities: ["Free WiFi", "Pool", "Free Parking", "Restaurant"],
    freeCancel: false,
    payAtProperty: true,
    available: true,
    instantBooking: false,
  },
  {
    id: 6,
    name: "Movenpick Hotel Jeddah",
    stars: 4,
    location: "Palestine Street, Jeddah • 2.8 km from center",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    price: 590,
    rating: 8.6,
    ratingText: "Very Good",
    reviews: 1120,
    amenities: ["Free WiFi", "Restaurant", "Gym", "Pool"],
    freeCancel: true,
    payAtProperty: false,
    available: true,
    instantBooking: true,
  },
  {
    id: 7,
    name: "Hyatt Regency Riyadh Olaya",
    stars: 5,
    location: "Olaya Street, Riyadh • 0.8 km from center",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    price: 780,
    rating: 9.0,
    ratingText: "Excellent",
    reviews: 1650,
    amenities: ["Free WiFi", "Pool", "Free Parking", "Restaurant", "Gym"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 8,
    name: "Centro Olaya Riyadh",
    stars: 3,
    location: "Olaya District, Riyadh • 1.5 km from center",
    image:
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=300&fit=crop",
    price: 380,
    rating: 8.2,
    ratingText: "Very Good",
    reviews: 540,
    amenities: ["Free WiFi", "Gym"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 9,
    name: "Radisson Blu Hotel Jeddah",
    stars: 5,
    location: "Al Hamra District, Jeddah • 5.0 km from center",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    price: 640,
    rating: 8.8,
    ratingText: "Very Good",
    reviews: 890,
    amenities: ["Free WiFi", "Pool", "Restaurant", "Free Parking"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: false,
  },
  {
    id: 10,
    name: "Sheraton Riyadh Hotel & Towers",
    stars: 4,
    location: "King Fahd Road, Riyadh • 3.0 km from center",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop",
    price: 620,
    rating: 8.5,
    ratingText: "Very Good",
    reviews: 1020,
    amenities: ["Free WiFi", "Pool", "Restaurant", "Gym"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 11,
    name: "Kempinski Al Othman Hotel Al Khobar",
    stars: 5,
    location: "Prince Turkey Street, Dammam • 1.8 km from center",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    price: 880,
    rating: 9.2,
    ratingText: "Excellent",
    reviews: 1340,
    amenities: ["Free WiFi", "Pool", "Restaurant", "Gym", "Free Parking"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 12,
    name: "Holiday Inn Dammam",
    stars: 4,
    location: "King Saud Road, Dammam • 2.5 km from center",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    price: 560,
    rating: 8.6,
    ratingText: "Very Good",
    reviews: 890,
    amenities: ["Free WiFi", "Pool", "Restaurant", "Free Parking"],
    freeCancel: true,
    payAtProperty: false,
    available: true,
    instantBooking: true,
  },
  {
    id: 13,
    name: "Braira Al Khobar",
    stars: 4,
    location: "Corniche Road, Dammam • 3.2 km from center",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    price: 490,
    rating: 8.4,
    ratingText: "Very Good",
    reviews: 720,
    amenities: ["Free WiFi", "Pool", "Gym"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: false,
  },
  {
    id: 14,
    name: "Crowne Plaza Dammam",
    stars: 5,
    location: "King Fahd Road, Dammam • 1.2 km from center",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    price: 720,
    rating: 8.9,
    ratingText: "Very Good",
    reviews: 1150,
    amenities: ["Free WiFi", "Pool", "Restaurant", "Gym"],
    freeCancel: true,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
  {
    id: 15,
    name: "Wyndham Garden Dammam",
    stars: 3,
    location: "Al Shatea District, Dammam • 4.0 km from center",
    image:
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=300&fit=crop",
    price: 420,
    rating: 8.1,
    ratingText: "Very Good",
    reviews: 560,
    amenities: ["Free WiFi", "Free Parking"],
    freeCancel: false,
    payAtProperty: true,
    available: true,
    instantBooking: true,
  },
];

// Function to create hotel card HTML
function createHotelCard(hotel) {
  const starsHTML = "★".repeat(hotel.stars);
  const amenitiesHTML = hotel.amenities
    .slice(0, 4)
    .map((amenity) => `<span class="amenity">${amenity}</span>`)
    .join("");

  return `
    <div class="hotel-card" data-id="${hotel.id}">
      <img src="${hotel.image}" alt="${hotel.name}" />
      <div class="hotel-card-content">
        <div class="hotel-card-header">
          <div>
            <h3 class="hotel-name">${hotel.name}</h3>
            <div class="hotel-stars">${starsHTML}</div>
            <div class="hotel-location">📍 ${hotel.location}</div>
          </div>
        </div>
        <div class="hotel-amenities">
          ${amenitiesHTML}
        </div>
        <div class="hotel-card-footer">
          <div class="hotel-rating">
            <span class="rating-score">${hotel.rating}</span>
            <span class="rating-text">${hotel.ratingText} • ${
    hotel.reviews
  } reviews</span>
          </div>
          <div class="hotel-price">
            <div class="price-amount">SAR ${hotel.price}</div>
            <div class="price-label">per night</div>
            ${
              hotel.freeCancel
                ? '<div class="cancellation-badge">Free cancellation</div>'
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to display hotels
function displayHotels(hotels) {
  const resultsList = document.getElementById("resultsList");
  const resultsCount = document.getElementById("resultsCount");

  if (resultsList) {
    if (hotels.length === 0) {
      resultsList.innerHTML =
        '<p style="text-align: center; padding: 40px; color: #5f6b7a;">No hotels found matching your filters.</p>';
    } else {
      resultsList.innerHTML = hotels.map(createHotelCard).join("");
    }
  }

  if (resultsCount) {
    resultsCount.textContent = `${hotels.length} result${
      hotels.length !== 1 ? "s" : ""
    }`;
  }
}

// Function to filter hotels by city
function filterHotelsByCity(cityName) {
  if (!cityName) return hotelData;

  const searchCity = cityName.toLowerCase().trim();
  return hotelData.filter((hotel) =>
    hotel.location.toLowerCase().includes(searchCity)
  );
}

// Initial display - filter by current destination
let filteredHotels = filterHotelsByCity(destination);
displayHotels(filteredHotels);

// Sorting functionality
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    // Update active tab
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Sort hotels
    const sortType = tab.dataset.sort;
    let sorted = [...filteredHotels];

    if (sortType === "price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    // 'recommended' keeps the original order

    displayHotels(sorted);
  });
});

// Filter functionality
function applyFilters() {
  const priceMin = parseInt(document.getElementById("priceMin").value) || 0;
  const priceMax =
    parseInt(document.getElementById("priceMax").value) || Infinity;

  const selectedStars = Array.from(
    document.querySelectorAll('input[data-filter="stars"]:checked')
  ).map((cb) => parseInt(cb.value));

  const freeWifi = document.getElementById("freeWifi").checked;
  const pool = document.getElementById("pool").checked;
  const parking = document.getElementById("parking").checked;
  const restaurant = document.getElementById("restaurant").checked;
  const gym = document.getElementById("gym").checked;

  const freeCancel = document.getElementById("freeCancel").checked;
  const payAtProperty = document.getElementById("payAtProperty").checked;
  const availableNow = document.getElementById("availableNow").checked;
  const instantBooking = document.getElementById("instantBooking").checked;

  // Get current city from search form
  const currentCity = document.getElementById("dest")
    ? document.getElementById("dest").value.trim()
    : destination;

  // Start with hotels filtered by city
  const cityFilteredHotels = filterHotelsByCity(currentCity);

  filteredHotels = cityFilteredHotels.filter((hotel) => {
    // Price filter
    if (hotel.price < priceMin || hotel.price > priceMax) return false;

    // Stars filter
    if (selectedStars.length > 0 && !selectedStars.includes(hotel.stars))
      return false;

    // Amenities filters
    if (freeWifi && !hotel.amenities.includes("Free WiFi")) return false;
    if (pool && !hotel.amenities.includes("Pool")) return false;
    if (parking && !hotel.amenities.includes("Free Parking")) return false;
    if (restaurant && !hotel.amenities.includes("Restaurant")) return false;
    if (gym && !hotel.amenities.includes("Gym")) return false;

    // Cancellation filters
    if (freeCancel && !hotel.freeCancel) return false;
    if (payAtProperty && !hotel.payAtProperty) return false;

    // Availability filters
    if (availableNow && !hotel.available) return false;
    if (instantBooking && !hotel.instantBooking) return false;

    return true;
  });

  // Re-apply current sort
  const activeTab = document.querySelector(".tab.active");
  const sortType = activeTab ? activeTab.dataset.sort : "recommended";

  let sorted = [...filteredHotels];
  if (sortType === "price") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortType === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  }

  displayHotels(sorted);
}

// Apply filters button
document
  .getElementById("applyFilters")
  ?.addEventListener("click", applyFilters);

// Reset filters button
document.getElementById("resetFilters")?.addEventListener("click", () => {
  // Reset all inputs
  document.getElementById("priceMin").value = "";
  document.getElementById("priceMax").value = "";
  document.getElementById("priceRange").value = 2000;

  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });

  // Show hotels filtered by current city only
  const currentCity = document.getElementById("dest")
    ? document.getElementById("dest").value.trim()
    : destination;
  filteredHotels = filterHotelsByCity(currentCity);
  displayHotels(filteredHotels);
});

// Update price range slider and apply filter automatically
document.getElementById("priceRange")?.addEventListener("input", (e) => {
  document.getElementById("priceMax").value = e.target.value;
  applyFilters();
});

// Auto-apply filters when price inputs change
document.getElementById("priceMin")?.addEventListener("input", () => {
  applyFilters();
});

document.getElementById("priceMax")?.addEventListener("input", () => {
  applyFilters();
});

// Auto-apply filters when star rating checkboxes change
document.querySelectorAll('input[data-filter="stars"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    applyFilters();
  });
});

// Auto-apply filters when amenities checkboxes change
document.getElementById("freeWifi")?.addEventListener("change", () => {
  applyFilters();
});

document.getElementById("pool")?.addEventListener("change", () => {
  applyFilters();
});

document.getElementById("parking")?.addEventListener("change", () => {
  applyFilters();
});

document.getElementById("restaurant")?.addEventListener("change", () => {
  applyFilters();
});

document.getElementById("gym")?.addEventListener("change", () => {
  applyFilters();
});

// Pre-fill the search form with current values and handle submission
const searchForm = document.getElementById("hotelSearchForm");
if (searchForm) {
  document.getElementById("dest").value = destination;
  document.getElementById("checkin").value = checkin;
  document.getElementById("checkout").value = checkout;
  document.getElementById("guests").value = guests;

  // Handle form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newDestination = document.getElementById("dest").value.trim();
    const newCheckin = document.getElementById("checkin").value;
    const newCheckout = document.getElementById("checkout").value;
    const newGuests = document.getElementById("guests").value;

    if (!newDestination) {
      alert("Please enter a destination");
      return;
    }

    // Validate dates
    if (
      newCheckin &&
      newCheckout &&
      new Date(newCheckin) >= new Date(newCheckout)
    ) {
      alert("Check-out date must be after check-in date");
      return;
    }

    // Update the displayed information without reloading
    if (destinationEl) {
      destinationEl.textContent = `Hotels in ${newDestination}`;
    }

    const newFormattedCheckin = formatDate(newCheckin);
    const newFormattedCheckout = formatDate(newCheckout);
    const newNights = calculateNights(newCheckin, newCheckout);

    if (datesEl && newFormattedCheckin && newFormattedCheckout) {
      datesEl.textContent = `${newFormattedCheckin} → ${newFormattedCheckout}${
        newNights ? " • " + newNights : ""
      } • ${newGuests}`;
    }

    // Update URL parameters without reloading
    const newParams = new URLSearchParams();
    newParams.set("destination", newDestination);
    newParams.set("checkin", newCheckin);
    newParams.set("checkout", newCheckout);
    newParams.set("guests", newGuests);

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${newParams.toString()}`
    );

    // Filter hotels by the new city and display them
    filteredHotels = filterHotelsByCity(newDestination);
    displayHotels(filteredHotels);
  });
}
