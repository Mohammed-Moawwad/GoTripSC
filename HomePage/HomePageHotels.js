// ===== Mobile menu
const menuToggle = document.getElementById("menuToggle");
const mobilePanel = document.getElementById("mobilePanel");
menuToggle?.addEventListener("click", () => {
  const open = !mobilePanel.hasAttribute("hidden");
  open
    ? mobilePanel.setAttribute("hidden", "")
    : mobilePanel.removeAttribute("hidden");
  menuToggle.setAttribute("aria-expanded", String(!open));
});

// ===== Language dropdown
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langLabel = document.getElementById("langLabel");

function toggleLang(open) {
  if (!langMenu) return;
  if (open) {
    langMenu.style.display = "block";
    langBtn.setAttribute("aria-expanded", "true");
    langMenu.focus();
  } else {
    langMenu.style.display = "none";
    langBtn.setAttribute("aria-expanded", "false");
  }
}
langBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleLang(langMenu.style.display !== "block");
});
document.addEventListener("click", (e) => {
  if (langMenu && !langMenu.contains(e.target) && e.target !== langBtn)
    toggleLang(false);
});
langMenu?.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  langMenu
    .querySelectorAll("li")
    .forEach((x) => x.removeAttribute("aria-selected"));
  li.setAttribute("aria-selected", "true");
  langLabel.textContent = li.getAttribute("data-lang");
});

// ===== Cart badge demo
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
let count = 0;
cartBtn?.addEventListener("click", () => {
  count = (count + 1) % 10;
  cartCount.textContent = count;
});

// ===== Hotel form validations
const form = document.getElementById("hotelForm");
const inEl = document.getElementById("checkin");
const outEl = document.getElementById("checkout");
const today = new Date().toISOString().split("T")[0];
inEl.min = today;
outEl.min = today;

inEl.addEventListener("change", () => {
  outEl.min = inEl.value || today;
  if (outEl.value && outEl.value < outEl.min) {
    outEl.value = outEl.min;
  }
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inEl.value || !outEl.value || outEl.value <= inEl.value) {
    alert("Please select a valid check-in and check-out.");
    return;
  }

  // Get form values
  const destination = document.getElementById("dest").value;
  const checkin = inEl.value;
  const checkout = outEl.value;
  const guests = document.getElementById("guests").value;

  // Create URL with parameters
  const params = new URLSearchParams();
  params.set("destination", destination);
  params.set("checkin", checkin);
  params.set("checkout", checkout);
  params.set("guests", guests);

  // Navigate to HotelsPage
  window.location.href = `../Services/Hotels/HotelsPage.html?${params.toString()}`;
});

// ===== Trip ideas filter
const chips = document.getElementById("chips");
const grid = document.getElementById("ideasGrid");
const selected = new Set();

function applyFilter() {
  const cards = grid.querySelectorAll(".idea");
  if (selected.size === 0) {
    cards.forEach((c) => (c.style.display = ""));
    return;
  }
  cards.forEach((card) => {
    const tags = (card.dataset.tags || "").split(",").map((s) => s.trim());
    const ok = Array.from(selected).every((tag) => tags.includes(tag));
    card.style.display = ok ? "" : "none";
  });
}
chips?.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  const tag = btn.dataset.tag;
  btn.classList.toggle("active");
  btn.classList.contains("active") ? selected.add(tag) : selected.delete(tag);
  applyFilter();
});

// ===== Hotel Booking Function
function bookHotel(hotelName, location, price, rating, image) {
  console.log('Booking hotel:', hotelName);
  
  // Check if user is logged in
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Redirect to login
    sessionStorage.setItem('returnUrl', window.location.href);
    alert('Please log in to book a hotel');
    window.location.href = '../Login/login.html';
    return;
  }
  
  // Get check-in and check-out dates from form
  const checkIn = document.getElementById('checkin')?.value || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const checkOut = document.getElementById('checkout')?.value || new Date(Date.now() + 172800000).toISOString().split('T')[0];
  
  // Build booking URL with parameters
  const params = new URLSearchParams();
  params.set('hotel', Math.floor(Math.random() * 10000)); // Random ID
  params.set('name', hotelName);
  params.set('location', location);
  params.set('checkIn', checkIn);
  params.set('checkOut', checkOut);
  params.set('rooms', 1);
  params.set('guests', 2);
  params.set('price', price);
  params.set('rating', rating);
  params.set('image', image);
  params.set('amenities', 'Free WiFi,Pool,Restaurant,Gym');
  
  // Navigate to booking page
  window.location.href = `../Services/Hotels/HotelBooking.html?${params.toString()}`;
}

// Make bookHotel available globally
window.bookHotel = bookHotel;

