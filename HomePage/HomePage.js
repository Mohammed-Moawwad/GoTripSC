// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const mobilePanel = document.getElementById("mobilePanel");
menuToggle?.addEventListener("click", () => {
  const open = !mobilePanel.hasAttribute("hidden");
  open
    ? mobilePanel.setAttribute("hidden", "")
    : mobilePanel.removeAttribute("hidden");
  menuToggle.setAttribute("aria-expanded", String(!open));
});

// Language dropdown
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langLabel = document.getElementById("langLabel");
const langBtnMobile = document.getElementById("langBtnMobile");
const langLabelMobile = document.getElementById("langLabelMobile");

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
  const chosen = li.getAttribute("data-lang");
  langLabel.textContent = chosen;
  if (langLabelMobile) langLabelMobile.textContent = chosen;
});
langBtnMobile?.addEventListener("click", () => {
  const items = Array.from(langMenu.querySelectorAll("li"));
  const idx = items.findIndex(
    (li) => li.getAttribute("aria-selected") === "true"
  );
  items[(idx + 1) % items.length].click();
});

// Cart demo
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
let count = 0;
cartBtn?.addEventListener("click", () => {
  count = (count + 1) % 10;
  cartCount.textContent = count;
});

// Tabs
const tabRound = document.getElementById("tab-round");
const tabOne = document.getElementById("tab-one");
const tabMulti = document.getElementById("tab-multi");
const returnField = document.getElementById("returnField");

function setActiveTab(btn) {
  [tabRound, tabOne, tabMulti].forEach((b) => {
    b.classList.toggle("active", b === btn);
    b.setAttribute("aria-selected", b === btn ? "true" : "false");
  });
  if (btn === tabOne) {
    returnField.style.display = "none";
  } else {
    returnField.style.display = "";
  }
}
tabRound?.addEventListener("click", () => setActiveTab(tabRound));
tabOne?.addEventListener("click", () => setActiveTab(tabOne));
tabMulti?.addEventListener("click", () => setActiveTab(tabMulti));

// Trip Ideas filter
const chips = document.getElementById("chips");
const grid = document.getElementById("ideasGrid");
const selected = new Set();

function applyFilter() {
  const cards = grid.querySelectorAll(".idea-card");
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

// ===== Flight Location Autocomplete =====
// Saudi Arabia airports and major cities
const saudiLocations = [
  { code: 'RUH', city: 'Riyadh', name: 'King Khalid International Airport' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International Airport' },
  { code: 'DMM', city: 'Dammam', name: 'King Fahd International Airport' },
  { code: 'MED', city: 'Madinah', name: 'Prince Mohammad bin Abdulaziz Airport' },
  { code: 'TIF', city: 'Taif', name: 'Taif Regional Airport' },
  { code: 'AHB', city: 'Abha', name: 'Abha Regional Airport' },
  { code: 'GIZ', city: 'Jizan', name: 'Jizan Regional Airport' },
  { code: 'ELQ', city: 'Al Qassim', name: 'Gassim Regional Airport' },
  { code: 'TUU', city: 'Tabuk', name: 'Tabuk Regional Airport' },
  { code: 'AJF', city: 'Al Jouf', name: 'Al Jouf Domestic Airport' },
  { code: 'HOF', city: 'Al Ahsa', name: 'Al Ahsa Airport' },
  { code: 'URY', city: 'Gurayat', name: 'Gurayat Domestic Airport' },
  { code: 'RAH', city: 'Rafha', name: 'Rafha Domestic Airport' },
  { code: 'RAE', city: 'Arar', name: 'Arar Domestic Airport' },
  { code: 'AQI', city: 'Al Qaisumah', name: 'Al Qaisumah/Hafr Al Batin Airport' },
  { code: 'HAS', city: 'Hail', name: 'Hail Regional Airport' },
  { code: 'YNB', city: 'Yanbu', name: 'Yanbu Airport' },
  { code: 'WAE', city: 'Wadi Ad Dawasir', name: 'Wadi Al Dawasir Airport' },
  { code: 'EAM', city: 'Najran', name: 'Najran Domestic Airport' },
  { code: 'SHW', city: 'Sharurah', name: 'Sharurah Domestic Airport' },
  { code: 'ABT', city: 'Al Baha', name: 'Al Baha Domestic Airport' },
  { code: 'BHH', city: 'Bisha', name: 'Bisha Domestic Airport' },
  { code: 'DWD', city: 'Dawadmi', name: 'Dawadmi Domestic Airport' },
  { code: 'KMX', city: 'King Khalid Military City', name: 'King Khalid Military City Airport' }
];

// Flight Routes Database - Available routes in Saudi Arabia
const availableRoutes = [
  // From Riyadh (RUH)
  { from: 'RUH', to: 'JED', route: 'Riyadh → Jeddah' },
  { from: 'RUH', to: 'DMM', route: 'Riyadh → Dammam' },
  { from: 'RUH', to: 'AHB', route: 'Riyadh → Abha' },
  { from: 'RUH', to: 'GIZ', route: 'Riyadh → Jizan' },
  { from: 'RUH', to: 'TUU', route: 'Riyadh → Tabuk' },
  { from: 'RUH', to: 'HAS', route: 'Riyadh → Hail' },
  { from: 'RUH', to: 'EAM', route: 'Riyadh → Najran' },
  { from: 'RUH', to: 'ELQ', route: 'Riyadh → Al Qassim' },
  { from: 'RUH', to: 'AJF', route: 'Riyadh → Al Jouf' },
  { from: 'RUH', to: 'TIF', route: 'Riyadh → Taif' },
  
  // From Jeddah (JED)
  { from: 'JED', to: 'RUH', route: 'Jeddah → Riyadh' },
  { from: 'JED', to: 'DMM', route: 'Jeddah → Dammam' },
  { from: 'JED', to: 'MED', route: 'Jeddah → Madinah' },
  { from: 'JED', to: 'AHB', route: 'Jeddah → Abha' },
  { from: 'JED', to: 'GIZ', route: 'Jeddah → Jizan' },
  { from: 'JED', to: 'TUU', route: 'Jeddah → Tabuk' },
  { from: 'JED', to: 'EAM', route: 'Jeddah → Najran' },
  { from: 'JED', to: 'YNB', route: 'Jeddah → Yanbu' },
  { from: 'JED', to: 'TIF', route: 'Jeddah → Taif' },
  
  // From Dammam (DMM)
  { from: 'DMM', to: 'RUH', route: 'Dammam → Riyadh' },
  { from: 'DMM', to: 'JED', route: 'Dammam → Jeddah' },
  { from: 'DMM', to: 'MED', route: 'Dammam → Madinah' },
  { from: 'DMM', to: 'AHB', route: 'Dammam → Abha' },
  { from: 'DMM', to: 'GIZ', route: 'Dammam → Jizan' },
  { from: 'DMM', to: 'TUU', route: 'Dammam → Tabuk' },
  { from: 'DMM', to: 'HAS', route: 'Dammam → Hail' },
  
  // From Madinah (MED)
  { from: 'MED', to: 'RUH', route: 'Madinah → Riyadh' },
  { from: 'MED', to: 'JED', route: 'Madinah → Jeddah' },
  { from: 'MED', to: 'DMM', route: 'Madinah → Dammam' },
  { from: 'MED', to: 'AHB', route: 'Madinah → Abha' },
  { from: 'MED', to: 'GIZ', route: 'Madinah → Jizan' },
  { from: 'MED', to: 'TUU', route: 'Madinah → Tabuk' },
  
  // From Abha (AHB)
  { from: 'AHB', to: 'RUH', route: 'Abha → Riyadh' },
  { from: 'AHB', to: 'JED', route: 'Abha → Jeddah' },
  { from: 'AHB', to: 'DMM', route: 'Abha → Dammam' },
  { from: 'AHB', to: 'GIZ', route: 'Abha → Jizan' },
  { from: 'AHB', to: 'EAM', route: 'Abha → Najran' },
  
  // From Jizan (GIZ)
  { from: 'GIZ', to: 'RUH', route: 'Jizan → Riyadh' },
  { from: 'GIZ', to: 'JED', route: 'Jizan → Jeddah' },
  { from: 'GIZ', to: 'DMM', route: 'Jizan → Dammam' },
  { from: 'GIZ', to: 'AHB', route: 'Jizan → Abha' },
  { from: 'GIZ', to: 'EAM', route: 'Jizan → Najran' },
  
  // From Tabuk (TUU)
  { from: 'TUU', to: 'RUH', route: 'Tabuk → Riyadh' },
  { from: 'TUU', to: 'JED', route: 'Tabuk → Jeddah' },
  { from: 'TUU', to: 'DMM', route: 'Tabuk → Dammam' },
  { from: 'TUU', to: 'MED', route: 'Tabuk → Madinah' },
  
  // From Najran (EAM)
  { from: 'EAM', to: 'RUH', route: 'Najran → Riyadh' },
  { from: 'EAM', to: 'JED', route: 'Najran → Jeddah' },
  { from: 'EAM', to: 'AHB', route: 'Najran → Abha' },
  { from: 'EAM', to: 'GIZ', route: 'Najran → Jizan' },
  
  // From Hail (HAS)
  { from: 'HAS', to: 'RUH', route: 'Hail → Riyadh' },
  { from: 'HAS', to: 'JED', route: 'Hail → Jeddah' },
  { from: 'HAS', to: 'DMM', route: 'Hail → Dammam' },
  
  // From Al Qassim (ELQ)
  { from: 'ELQ', to: 'RUH', route: 'Al Qassim → Riyadh' },
  { from: 'ELQ', to: 'JED', route: 'Al Qassim → Jeddah' },
  { from: 'ELQ', to: 'DMM', route: 'Al Qassim → Dammam' },
  
  // From Taif (TIF)
  { from: 'TIF', to: 'RUH', route: 'Taif → Riyadh' },
  { from: 'TIF', to: 'JED', route: 'Taif → Jeddah' },
  { from: 'TIF', to: 'DMM', route: 'Taif → Dammam' },
  
  // From Al Jouf (AJF)
  { from: 'AJF', to: 'RUH', route: 'Al Jouf → Riyadh' },
  { from: 'AJF', to: 'JED', route: 'Al Jouf → Jeddah' },
  
  // From Yanbu (YNB)
  { from: 'YNB', to: 'RUH', route: 'Yanbu → Riyadh' },
  { from: 'YNB', to: 'JED', route: 'Yanbu → Jeddah' },
];

// Check if route exists
function isRouteAvailable(fromCode, toCode) {
  return availableRoutes.some(route => 
    route.from === fromCode && route.to === toCode
  );
}

// Create autocomplete functionality
function createAutocomplete(inputElement) {
  const container = inputElement.parentElement;
  const dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #dfe6f3;
    border-top: none;
    border-radius: 0 0 10px 10px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: none;
  `;
  
  container.style.position = 'relative';
  container.appendChild(dropdown);
  
  let selectedLocation = null;
  
  inputElement.addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase();
    selectedLocation = null;
    
    if (value.length < 1) {
      dropdown.style.display = 'none';
      return;
    }
    
    // Filter locations
    const matches = saudiLocations.filter(loc => 
      loc.city.toLowerCase().includes(value) || 
      loc.code.toLowerCase().includes(value) ||
      loc.name.toLowerCase().includes(value)
    );
    
    if (matches.length === 0) {
      dropdown.style.display = 'none';
      return;
    }
    
    // Display matches
    dropdown.innerHTML = matches.map(loc => `
      <div class="autocomplete-item" data-code="${loc.code}" data-city="${loc.city}" style="
        padding: 12px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background 0.2s;
      " onmouseover="this.style.background='#f5f8ff'" onmouseout="this.style.background='white'">
        <div style="font-weight: 600; color: #0f1a2b;">${loc.city} (${loc.code})</div>
        <div style="font-size: 0.85rem; color: #7f8aa3;">${loc.name}</div>
      </div>
    `).join('');
    
    dropdown.style.display = 'block';
    
    // Handle item click
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        const city = item.getAttribute('data-city');
        const code = item.getAttribute('data-code');
        selectedLocation = { city, code };
        inputElement.value = `${city} (${code})`;
        inputElement.setAttribute('data-location-code', code);
        inputElement.setAttribute('data-location-city', city);
        dropdown.style.display = 'none';
      });
    });
  });
  
  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
  
  // Validate on blur
  inputElement.addEventListener('blur', () => {
    setTimeout(() => {
      if (!selectedLocation && inputElement.value) {
        // Try to find exact match
        const exactMatch = saudiLocations.find(loc => 
          inputElement.value.toLowerCase() === loc.city.toLowerCase() ||
          inputElement.value.toLowerCase() === `${loc.city.toLowerCase()} (${loc.code.toLowerCase()})`
        );
        
        if (exactMatch) {
          selectedLocation = { city: exactMatch.city, code: exactMatch.code };
          inputElement.value = `${exactMatch.city} (${exactMatch.code})`;
          inputElement.setAttribute('data-location-code', exactMatch.code);
          inputElement.setAttribute('data-location-city', exactMatch.city);
        }
      }
    }, 200);
  });
  
  return dropdown;
}

// Initialize autocomplete for from and to fields
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');

if (fromInput) {
  createAutocomplete(fromInput);
  fromInput.placeholder = 'Search city or airport...';
}

if (toInput) {
  createAutocomplete(toInput);
  toInput.placeholder = 'Search city or airport...';
}

// Form validation with location and route check
const flightForm = document.getElementById('flightForm');
if (flightForm) {
  flightForm.addEventListener('submit', (e) => {
    const fromCode = fromInput.getAttribute('data-location-code');
    const toCode = toInput.getAttribute('data-location-code');
    
    if (!fromCode) {
      e.preventDefault();
      alert('⚠️ Please select your departure city from the list');
      fromInput.focus();
      return;
    }
    
    if (!toCode) {
      e.preventDefault();
      alert('⚠️ Please select your destination city from the list');
      toInput.focus();
      return;
    }
    
    if (fromCode === toCode) {
      e.preventDefault();
      alert('⚠️ Departure and destination must be different locations');
      toInput.focus();
      return;
    }
    
    // Check if route is available (allow submission but pass flag)
    const routeAvailable = isRouteAvailable(fromCode, toCode);
    
    // Update form values to use location data
    fromInput.value = fromInput.getAttribute('data-location-city');
    toInput.value = toInput.getAttribute('data-location-city');
    
    // Add route codes as hidden data for the search results page
    const fromCodeInput = document.createElement('input');
    fromCodeInput.type = 'hidden';
    fromCodeInput.name = 'fromCode';
    fromCodeInput.value = fromCode;
    flightForm.appendChild(fromCodeInput);
    
    const toCodeInput = document.createElement('input');
    toCodeInput.type = 'hidden';
    toCodeInput.name = 'toCode';
    toCodeInput.value = toCode;
    flightForm.appendChild(toCodeInput);
    
    // Add route availability flag
    const routeAvailableInput = document.createElement('input');
    routeAvailableInput.type = 'hidden';
    routeAvailableInput.name = 'routeAvailable';
    routeAvailableInput.value = routeAvailable ? 'true' : 'false';
    flightForm.appendChild(routeAvailableInput);
  });
}
