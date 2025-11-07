// ===== BusesSearchResults.js =====
// Handles bus search results, filtering, sorting, and pagination

// ===== Global State =====
let allBuses = [];
let filteredBuses = [];
let currentSort = 'recommended';
let currentPage = 1;
const ITEMS_PER_PAGE = 6;
let allLocations = [];
let fromAutocompleteList = null;
let toAutocompleteList = null;

// ===== i18n Strings =====
const strings = {
  en: {
    searching: 'Searching...',
    results: 'Results',
    trips: 'trips',
    nonstop: 'Nonstop',
    stop: 'stop',
    stops: 'stops',
    onlySeats: 'Only',
    seatsLeft: 'seats left',
    perNight: 'Per trip',
    select: 'Select',
    noResults: 'No buses found',
    tryAdjusting: 'Try adjusting your search criteria or filters',
    resetFilters: 'Reset Filters'
  }
};

const lang = 'en'; // Can be dynamic based on user preference

// ===== Date Normalization Functions =====
// Convert Arabic-Indic digits to Western digits
function arabicIndicToWestern(s) {
  return String(s || '').replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632));
}

// Normalize many date formats to YYYY-MM-DD (returns null if fails)
function toYMD(input) {
  if (!input) return null;
  input = arabicIndicToWestern(String(input).trim());
  
  // ISO YYYY-MM-DD or YYYY/MM/DD
  let m = input.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  
  // DD/MM/YYYY or DD-MM-YYYY
  m = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  
  // Try Date parse (locale dependent)
  const dt = new Date(input);
  if (!isNaN(dt)) {
    const y = dt.getFullYear();
    const mo = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${mo}-${d}`;
  }
  return null;
}

// ===== Random Helpers for Fake Trip Generation =====
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTime() {
  const hour = randInt(4, 23);
  const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// ===== Generate Fake Trips for Arbitrary Date =====
function generateFakeTripsForDate({ dateYMD, from, to, N = 20, deterministic = false }) {
  const companies = [
    'SAPTCO', 'AlmosaferBus', 'NorthWest', 'Red Sea Transport', 'Arabian Lines',
    'Gulf Express', 'Desert Line', 'Najd Transport', 'Tabuk Express',
    'Eastern Province Lines', 'Hejaz Railway Bus', 'Southern Comfort',
    'Al Qassim Transit', 'Riyadh Express'
  ];
  
  const trips = [];
  let seed = 0;
  
  if (deterministic && dateYMD) {
    for (let i = 0; i < dateYMD.length; i++) {
      seed = (seed * 31 + dateYMD.charCodeAt(i)) % 100000;
    }
  }
  
  function rnd(min, max) {
    if (!deterministic) return randInt(min, max);
    seed = (seed * 9301 + 49297) % 233280;
    return min + Math.floor((seed / 233280) * (max - min + 1));
  }
  
  for (let i = 0; i < N; i++) {
    const time = randomTime();
    const hour = parseInt(time.split(':')[0]);
    const price = deterministic ? (50 + (i * 5) + rnd(0, 40)) : randInt(35, 200);
    const stops = deterministic ? rnd(0, 2) : randInt(0, 2);
    const companyIndex = deterministic ? (i + rnd(0, companies.length - 1)) % companies.length : randInt(0, companies.length - 1);
    const company = companies[companyIndex];
    const duration = randInt(60, 180);
    const seatsAvailable = randInt(5, 45);
    const rating = (4.0 + Math.random() * 1.0).toFixed(1);
    
    // Calculate arrival time
    const depDate = new Date(`${dateYMD}T${time}:00`);
    const arrDate = new Date(depDate.getTime() + duration * 60000);
    const arrTime = `${String(arrDate.getHours()).padStart(2, '0')}:${String(arrDate.getMinutes()).padStart(2, '0')}`;
    
    // Generate amenities
    const amenities = [];
    if (Math.random() > 0.3) amenities.push('WiFi');
    if (Math.random() > 0.2) amenities.push('AC');
    if (Math.random() > 0.4) amenities.push('USB Charging');
    if (Math.random() > 0.6) amenities.push('Snacks');
    if (stops === 0 && Math.random() > 0.7) amenities.push('Sleeper Seats');
    
    const classType = price > 120 ? 'VIP' : price > 80 ? 'Premium' : 'Economy';
    
    trips.push({
      id: `B${dateYMD.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
      operator: company,
      operatorLogo: `https://placehold.co/80x80/${['FF6B6B', '4ECDC4', 'FFE66D', '95E1D3', 'F38181', '6C5CE7', 'A8E6CF', 'FFD93D'][companyIndex % 8]}/white?text=${company.split(' ')[0]}`,
      from,
      to,
      departure: `${dateYMD}T${time}:00`,
      arrival: `${dateYMD}T${arrTime}:00`,
      duration,
      stops,
      price,
      class: classType,
      seatsAvailable,
      totalSeats: 50,
      amenities,
      rating: parseFloat(rating)
    });
  }
  
  return trips;
}

// ===== Utility Functions =====
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins > 0 ? mins + 'm' : ''}`.trim();
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTimeOfDay(isoString) {
  const hour = new Date(isoString).getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
}

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// ===== URL State Management =====
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    from: params.get('from') || '',
    to: params.get('to') || '',
    depart: params.get('depart') || '',
    return: params.get('return') || '',
    passengers: params.get('passengers') || '1',
    class: params.get('class') || '',
    directOnly: params.get('directOnly') === 'true',
    stops: params.get('stops') ? params.get('stops').split(',') : [],
    minPrice: params.get('min') || '',
    maxPrice: params.get('max') || '',
    operators: params.get('operator') ? params.get('operator').split(',') : [],
    times: params.get('time') ? params.get('time').split(',') : [],
    sort: params.get('sort') || 'recommended',
    page: parseInt(params.get('page')) || 1
  };
}

function updateUrlParams(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, '', url);
}

function syncFormFromUrl() {
  const params = getUrlParams();
  document.getElementById('fromInput').value = params.from;
  document.getElementById('toInput').value = params.to;
  document.getElementById('departInput').value = params.depart;
  document.getElementById('returnInput').value = params.return;
  document.getElementById('passengersInput').value = params.passengers;
  document.getElementById('classInput').value = params.class;
  document.getElementById('directOnlyInput').checked = params.directOnly;
  
  // Sync filters
  document.querySelectorAll('input[name="stops"]').forEach(cb => {
    cb.checked = params.stops.includes(cb.value);
  });
  
  document.getElementById('minPrice').value = params.minPrice;
  document.getElementById('maxPrice').value = params.maxPrice;
  
  document.querySelectorAll('input[name="time"]').forEach(cb => {
    cb.checked = params.times.includes(cb.value);
  });
  
  // Sync sort
  currentSort = params.sort;
  document.querySelectorAll('.sort-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.sort === currentSort);
  });
  
  currentPage = params.page;
}

// ===== Load Locations =====
async function loadLocations() {
  try {
    const response = await fetch('data/locations.json');
    if (!response.ok) {
      console.error('Failed to load locations');
      return [];
    }
    allLocations = await response.json();
    return allLocations;
  } catch (error) {
    console.error('Error loading locations:', error);
    return [];
  }
}

// ===== Autocomplete Functions =====
function initAutocomplete(inputElement, listElement) {
  let currentFocus = -1;
  let isValidCity = false;
  
  inputElement.addEventListener('input', function() {
    const val = this.value.trim();
    isValidCity = false;
    
    // Mark input as invalid if not empty and not matching
    if (val) {
      const exactMatch = allLocations.find(loc => 
        loc.nameEn.toLowerCase() === val.toLowerCase()
      );
      if (exactMatch) {
        isValidCity = true;
        inputElement.classList.remove('invalid-city');
      } else {
        inputElement.classList.add('invalid-city');
      }
    } else {
      inputElement.classList.remove('invalid-city');
    }
    
    closeAllLists();
    if (!val) return;
    currentFocus = -1;
    
    const matches = allLocations.filter(loc => 
      loc.nameEn.toLowerCase().startsWith(val.toLowerCase()) ||
      loc.nameEn.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 8); // Show max 8 suggestions
    
    if (matches.length === 0) return;
    
    listElement.innerHTML = '';
    listElement.style.display = 'block';
    
    matches.forEach((loc, index) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `<strong>${loc.nameEn}</strong>`;
      item.addEventListener('click', function() {
        inputElement.value = loc.nameEn;
        isValidCity = true;
        inputElement.classList.remove('invalid-city');
        closeAllLists();
      });
      listElement.appendChild(item);
    });
  });
  
  // Validate on blur
  inputElement.addEventListener('blur', function() {
    setTimeout(() => {
      const val = this.value.trim();
      if (val) {
        const exactMatch = allLocations.find(loc => 
          loc.nameEn.toLowerCase() === val.toLowerCase()
        );
        if (!exactMatch) {
          inputElement.classList.add('invalid-city');
          isValidCity = false;
        } else {
          inputElement.classList.remove('invalid-city');
          isValidCity = true;
        }
      }
    }, 200);
  });
  
  inputElement.addEventListener('keydown', function(e) {
    const items = listElement.querySelectorAll('.autocomplete-item');
    if (e.keyCode === 40) { // Down arrow
      currentFocus++;
      addActive(items);
      e.preventDefault();
    } else if (e.keyCode === 38) { // Up arrow
      currentFocus--;
      addActive(items);
      e.preventDefault();
    } else if (e.keyCode === 13) { // Enter
      e.preventDefault();
      if (currentFocus > -1 && items[currentFocus]) {
        items[currentFocus].click();
      }
    } else if (e.keyCode === 27) { // Escape
      closeAllLists();
    }
  });
  
  function addActive(items) {
    if (!items || items.length === 0) return;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add('autocomplete-active');
  }
  
  function removeActive(items) {
    items.forEach(item => item.classList.remove('autocomplete-active'));
  }
  
  function closeAllLists() {
    listElement.style.display = 'none';
    listElement.innerHTML = '';
    currentFocus = -1;
  }
  
  // Close on click outside
  document.addEventListener('click', function(e) {
    if (e.target !== inputElement) {
      closeAllLists();
    }
  });
  
  // Return validation function
  return () => isValidCity || inputElement.value.trim() === '';
}

// ===== Data Loading =====
async function loadMockData(searchParams = {}) {
  try {
    // If departure date is provided, generate trips for that date
    if (searchParams.depart) {
      const dateYMD = toYMD(searchParams.depart);
      if (dateYMD) {
        const from = searchParams.from || 'Jeddah';
        const to = searchParams.to || 'Makkah';
        allBuses = generateFakeTripsForDate({
          dateYMD,
          from,
          to,
          N: 20,
          deterministic: true // Same date = same trips
        });
        return allBuses;
      }
    }
    
    // Fallback: try to load from JSON file
    try {
      const response = await fetch('data/bus_trips.json');
      if (response.ok) {
        allBuses = await response.json();
        return allBuses;
      }
    } catch (e) {
      console.log('No data/bus_trips.json found, using generated data');
    }
    
    // If no date and no JSON file, generate for today
    const today = new Date().toISOString().split('T')[0];
    allBuses = generateFakeTripsForDate({
      dateYMD: today,
      from: 'Jeddah',
      to: 'Makkah',
      N: 20,
      deterministic: true
    });
    return allBuses;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
}

// ===== Search & Filter Functions =====
function searchTrips(searchParams) {
  let results = [...allBuses];
  
  // If departure date changed, regenerate trips
  if (searchParams.depart) {
    const dateYMD = toYMD(searchParams.depart);
    if (dateYMD) {
      const from = searchParams.from || 'Jeddah';
      const to = searchParams.to || 'Makkah';
      results = generateFakeTripsForDate({
        dateYMD,
        from,
        to,
        N: 20,
        deterministic: true
      });
      allBuses = results; // Update global state
    }
  }
  
  // Filter by route (only if provided)
  if (searchParams.from && searchParams.from.trim() !== '') {
    results = results.filter(bus => 
      bus.from.toLowerCase().includes(searchParams.from.toLowerCase())
    );
  }
  
  if (searchParams.to && searchParams.to.trim() !== '') {
    results = results.filter(bus => 
      bus.to.toLowerCase().includes(searchParams.to.toLowerCase())
    );
  }
  
  // Filter by date (only if provided)
  if (searchParams.depart && searchParams.depart.trim() !== '') {
    results = results.filter(bus => 
      bus.departure.startsWith(searchParams.depart)
    );
  }
  
  // Filter by class
  if (searchParams.class) {
    results = results.filter(bus => 
      bus.class === searchParams.class
    );
  }
  
  // Filter by direct only
  if (searchParams.directOnly) {
    results = results.filter(bus => bus.stops === 0);
  }
  
  // Filter by stops
  if (searchParams.stops && searchParams.stops.length > 0) {
    results = results.filter(bus => {
      if (searchParams.stops.includes('0') && bus.stops === 0) return true;
      if (searchParams.stops.includes('1') && bus.stops === 1) return true;
      if (searchParams.stops.includes('2') && bus.stops >= 2) return true;
      return false;
    });
  }
  
  // Filter by price range
  if (searchParams.minPrice) {
    results = results.filter(bus => bus.price >= parseFloat(searchParams.minPrice));
  }
  if (searchParams.maxPrice) {
    results = results.filter(bus => bus.price <= parseFloat(searchParams.maxPrice));
  }
  
  // Filter by operators
  if (searchParams.operators && searchParams.operators.length > 0) {
    results = results.filter(bus => searchParams.operators.includes(bus.operator));
  }
  
  // Filter by time of day
  if (searchParams.times && searchParams.times.length > 0) {
    results = results.filter(bus => 
      searchParams.times.includes(getTimeOfDay(bus.departure))
    );
  }
  
  return results;
}

function sortResults(results, sortType) {
  const sorted = [...results];
  
  switch(sortType) {
    case 'cheapest':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'fastest':
      sorted.sort((a, b) => {
        const durationA = a.duration || a.duration_minutes || 90;
        const durationB = b.duration || b.duration_minutes || 90;
        return durationA - durationB;
      });
      break;
    case 'recommended':
    default:
      // Recommended: balance of price, rating, and stops
      sorted.sort((a, b) => {
        const ratingA = a.rating || 4.0;
        const ratingB = b.rating || 4.0;
        const scoreA = (ratingA * 10) - (a.price / 10) - (a.stops * 5);
        const scoreB = (ratingB * 10) - (b.price / 10) - (b.stops * 5);
        return scoreB - scoreA;
      });
      break;
  }
  
  return sorted;
}

function getBestTags(results) {
  if (results.length === 0) return {};
  
  const cheapest = results.reduce((min, bus) => bus.price < min.price ? bus : min, results[0]);
  const fastest = results.reduce((min, bus) => {
    const minDuration = min.duration || min.duration_minutes || 90;
    const busDuration = bus.duration || bus.duration_minutes || 90;
    return busDuration < minDuration ? bus : min;
  }, results[0]);
  
  return {
    cheapest: cheapest.id,
    fastest: fastest.id,
    recommended: results[0]?.id // First in sorted recommended list
  };
}

// ===== Render Functions =====
function renderResults(results) {
  const listContainer = document.getElementById('resultsList');
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  
  // Hide loading
  loadingState.style.display = 'none';
  
  if (results.length === 0) {
    listContainer.style.display = 'none';
    emptyState.style.display = 'flex';
    document.getElementById('pagination').style.display = 'none';
    return;
  }
  
  emptyState.style.display = 'none';
  listContainer.style.display = 'flex';
  
  // Get tags for best options
  const tags = getBestTags(results);
  
  // Paginate
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageResults = results.slice(start, end);
  
  // Render cards
  listContainer.innerHTML = pageResults.map(bus => {
    const departTime = formatTime(bus.departure);
    const arriveTime = formatTime(bus.arrival);
    const duration = formatDuration(bus.duration || bus.duration_minutes || 90);
    const stopsText = bus.stops === 0 ? strings[lang].nonstop : 
                      bus.stops === 1 ? `1 ${strings[lang].stop}` : 
                      `${bus.stops} ${strings[lang].stops}`;
    
    let badgeHtml = '';
    if (currentSort === 'recommended' && bus.id === tags.recommended) {
      badgeHtml = '<span class="tag-badge tag-recommended">Recommended</span>';
    } else if (currentSort === 'cheapest' && bus.id === tags.cheapest) {
      badgeHtml = '<span class="tag-badge tag-cheapest">Cheapest</span>';
    } else if (currentSort === 'fastest' && bus.id === tags.fastest) {
      badgeHtml = '<span class="tag-badge tag-fastest">Fastest</span>';
    }
    
    const seatsLeft = bus.seatsAvailable || bus.seats_left || 20;
    const seatsWarning = seatsLeft <= 5 ? 
      `<span class="seats-warning">${strings[lang].onlySeats} ${seatsLeft} ${strings[lang].seatsLeft}</span>` : '';
    
    const featuresList = bus.amenities || bus.features || [];
    const features = featuresList.map(f => 
      `<span class="feature-badge">${f}</span>`
    ).join('');
    
    return `
      <article class="result-card" data-id="${bus.id}">
        <div class="operator-section">
          <img src="${bus.operatorLogo || bus.operator_logo}" alt="${bus.operator}" class="operator-logo" />
          <div class="operator-name">${bus.operator}</div>
        </div>
        
        <div class="trip-details">
          <div class="trip-time">
            <div class="time-large">${departTime}</div>
            <div class="time-station">${bus.from}</div>
          </div>
          
          <div class="trip-duration">
            <div class="duration-badge">${duration}</div>
            <div class="route-line">
              <span>${stopsText}</span>
            </div>
            <div class="stops-info">${bus.class}</div>
          </div>
          
          <div class="trip-time">
            <div class="time-large">${arriveTime}</div>
            <div class="time-station">${bus.to}</div>
          </div>
        </div>
        
        <div class="trip-meta">
          ${badgeHtml}
          ${features}
          ${seatsWarning}
        </div>
        
        <div class="price-section">
          <div class="price-amount">
            <div class="price-label">${strings[lang].perNight}</div>
            <div class="price-value">
              ${bus.price.toFixed(2)} <span class="price-currency">${bus.currency || 'SAR'}</span>
            </div>
          </div>
          <button class="select-btn" onclick="handleSelect('${bus.id}')">${strings[lang].select}</button>
        </div>
      </article>
    `;
  }).join('');
  
  // Render pagination
  renderPagination(results.length);
  
  // Update title
  const params = getUrlParams();
  const route = params.from && params.to ? `${params.from} → ${params.to}` : '';
  const date = params.depart ? formatDate(params.depart + 'T00:00:00') : '';
  const passengers = `${params.passengers} Adult${params.passengers !== '1' ? 's' : ''}`;
  document.getElementById('resultsTitle').textContent = 
    `${strings[lang].results}: ${results.length} ${strings[lang].trips}${route ? ' — ' + route : ''}${date ? ' — ' + date : ''}${passengers ? ', ' + passengers : ''}`;
}

function renderPagination(totalItems) {
  const paginationContainer = document.getElementById('pagination');
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageNumbers = document.getElementById('pageNumbers');
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  
  // Render page numbers
  let pages = [];
  if (totalPages <= 7) {
    pages = Array.from({length: totalPages}, (_, i) => i + 1);
  } else {
    if (currentPage <= 4) {
      pages = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (currentPage >= totalPages - 3) {
      pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }
  
  pageNumbers.innerHTML = pages.map(p => {
    if (p === '...') {
      return '<span class="page-num" style="border:none;cursor:default;">...</span>';
    }
    return `<button class="page-num ${p === currentPage ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>`;
  }).join('');
}

function populateOperatorFilters() {
  const operators = [...new Set(allBuses.map(b => b.operator))];
  const container = document.getElementById('operatorFilters');
  
  container.innerHTML = operators.map(op => `
    <label class="filter-checkbox">
      <input type="checkbox" name="operator" value="${op}" />
      <span>${op}</span>
    </label>
  `).join('');
  
  // Sync with URL
  const params = getUrlParams();
  document.querySelectorAll('input[name="operator"]').forEach(cb => {
    cb.checked = params.operators.includes(cb.value);
  });
}

// ===== Event Handlers =====
function handleSelect(busId) {
  const bus = allBuses.find(b => b.id === busId);
  if (!bus) return;
  
  // Show trip details modal
  showTripDetails(bus);
}

function showTripDetails(bus) {
  console.log('Showing trip details for:', bus);
  
  const departTime = formatTime(bus.departure);
  const arriveTime = formatTime(bus.arrival);
  const duration = formatDuration(bus.duration || bus.duration_minutes || 90);
  const departDate = formatDate(bus.departure);
  
  const stopsText = bus.stops === 0 ? 'Nonstop' : 
                    bus.stops === 1 ? '1 stop' : 
                    `${bus.stops} stops`;
  
  const amenitiesList = bus.amenities || bus.features || [];
  const features = amenitiesList.map(f => {
    const icons = {
      'WiFi': '📶',
      'AC': '❄️',
      'recliner': '🪑',
      'USB Charging': '🔌',
      'Snacks': '🍪',
      'Sleeper Seats': '🛏️'
    };
    return `<span class="feature-tag">${icons[f] || '✓'} ${f}</span>`;
  }).join('');
  
  const modalHtml = `
    <div class="trip-modal-overlay" id="tripModal" onclick="closeTripModal(event)">
      <div class="trip-modal-content" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeTripModal()">&times;</button>
        
        <div class="modal-header">
          <img src="${bus.operatorLogo || bus.operator_logo}" alt="${bus.operator}" class="modal-operator-logo" />
          <div>
            <h2>${bus.operator}</h2>
            <div class="modal-rating">★ ${bus.rating || 4.5} / 5.0</div>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="trip-route-section">
            <h3>Trip Details</h3>
            <div class="route-timeline">
              <div class="route-point">
                <div class="route-time">${departTime}</div>
                <div class="route-dot"></div>
                <div class="route-station">${bus.from}</div>
                <div class="route-date">${departDate}</div>
              </div>
              
              <div class="route-connector">
                <div class="connector-line"></div>
                <div class="connector-info">
                  <span class="duration-text">${duration}</span>
                  <span class="stops-text">${stopsText}</span>
                </div>
              </div>
              
              <div class="route-point">
                <div class="route-time">${arriveTime}</div>
                <div class="route-dot"></div>
                <div class="route-station">${bus.to}</div>
                <div class="route-date">${departDate}</div>
              </div>
            </div>
          </div>
          
          <div class="trip-info-section">
            <div class="info-row">
              <span class="info-label">Class:</span>
              <span class="info-value">${bus.class}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Seats Available:</span>
              <span class="info-value ${(bus.seatsAvailable || bus.seats_left) <= 5 ? 'text-danger' : 'text-success'}">
                ${bus.seatsAvailable || bus.seats_left} seats left
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Price:</span>
              <span class="info-value price-large">${bus.price.toFixed(2)} ${bus.currency || 'SAR'}</span>
            </div>
          </div>
          
          <div class="features-section">
            <h4>Amenities & Features</h4>
            <div class="features-grid">
              ${features}
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeTripModal()">Close</button>
          <button class="btn-primary" onclick="proceedToBooking('${bus.id}')">Proceed to Booking</button>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to page
  const existingModal = document.getElementById('tripModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeTripModal(event) {
  if (event && event.target.id !== 'tripModal' && !event.target.classList.contains('modal-close')) {
    return;
  }
  
  const modal = document.getElementById('tripModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = ''; // Restore scroll
  }
}

function proceedToBooking(busId) {
  console.log('Proceeding to booking for trip:', busId);
  
  // Find the trip data
  const trip = allBuses.find(b => b.id === busId);
  if (!trip) {
    console.error('Trip not found:', busId);
    alert('Error: Trip not found. Please try again.');
    return;
  }
  
  // Save trip data to localStorage for booking page
  localStorage.setItem('selectedTrip', JSON.stringify(trip));
  
  // Get search params
  const params = getUrlParams();
  
  // Build booking URL with all necessary data
  const bookingParams = new URLSearchParams({
    trip: busId,
    from: trip.from || params.from,
    to: trip.to || params.to,
    depart: trip.departure,
    passengers: params.passengers || '1 Adult',
    class: trip.class || 'Economy'
  });
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(`/Services/Buses/Booking.html?${bookingParams.toString()}`);
    window.location.href = `../../Login/signin.html?next=${returnUrl}`;
  } else {
    // Go to booking page
    window.location.href = `Booking.html?${bookingParams.toString()}`;
  }
}

window.handleSelect = handleSelect; // Make it globally accessible
window.closeTripModal = closeTripModal;
window.proceedToBooking = proceedToBooking;

function goToPage(page) {
  currentPage = page;
  const params = getUrlParams();
  params.page = page;
  updateUrlParams(params);
  renderResults(filteredBuses);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.goToPage = goToPage;

function applyFiltersFromUI() {
  const params = getUrlParams();
  
  // Get filter values
  const stops = Array.from(document.querySelectorAll('input[name="stops"]:checked')).map(cb => cb.value);
  const operators = Array.from(document.querySelectorAll('input[name="operator"]:checked')).map(cb => cb.value);
  const times = Array.from(document.querySelectorAll('input[name="time"]:checked')).map(cb => cb.value);
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;
  
  params.stops = stops;
  params.operators = operators;
  params.times = times;
  params.minPrice = minPrice;
  params.maxPrice = maxPrice;
  params.page = 1; // Reset to first page
  
  // Visual feedback - show filter is being applied
  const applyBtn = document.getElementById('applyFilters');
  if (applyBtn) {
    const originalText = applyBtn.textContent;
    applyBtn.textContent = 'Applying...';
    applyBtn.disabled = true;
    setTimeout(() => {
      applyBtn.textContent = originalText;
      applyBtn.disabled = false;
    }, 500);
  }
  
  updateUrlParams(params);
  performSearch();
}

function performSearch() {
  const params = getUrlParams();
  currentSort = params.sort;
  currentPage = params.page;
  
  // Show loading
  document.getElementById('loadingState').style.display = 'flex';
  document.getElementById('resultsList').style.display = 'none';
  document.getElementById('emptyState').style.display = 'none';
  
  // Simulate slight delay for UX
  setTimeout(() => {
    filteredBuses = searchTrips(params);
    filteredBuses = sortResults(filteredBuses, currentSort);
    renderResults(filteredBuses);
  }, 300);
}

// ===== Initialization =====
async function init() {
  // Load locations first
  await loadLocations();
  
  // Get URL params
  const params = getUrlParams();
  
  // Load mock data with search params (to generate trips for specific date)
  await loadMockData(params);
  
  // Sync form from URL
  syncFormFromUrl();
  
  // Initialize autocomplete after locations are loaded
  const fromInput = document.getElementById('fromInput');
  const toInput = document.getElementById('toInput');
  
  // Create autocomplete lists if they don't exist
  if (!document.getElementById('fromAutocomplete')) {
    const fromList = document.createElement('div');
    fromList.id = 'fromAutocomplete';
    fromList.className = 'autocomplete-list';
    fromInput.parentNode.appendChild(fromList);
    fromAutocompleteList = fromList;
  }
  
  if (!document.getElementById('toAutocomplete')) {
    const toList = document.createElement('div');
    toList.id = 'toAutocomplete';
    toList.className = 'autocomplete-list';
    toInput.parentNode.appendChild(toList);
    toAutocompleteList = toList;
  }
  
  // Initialize autocomplete for both fields
  initAutocomplete(fromInput, fromAutocompleteList);
  initAutocomplete(toInput, toAutocompleteList);
  
  // Populate operator filters
  populateOperatorFilters();
  
  // Set up date inputs
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('departInput').min = today;
  document.getElementById('returnInput').min = today;
  
  // Perform initial search
  performSearch();
  
  // Set up event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Search form
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fromInput = document.getElementById('fromInput');
    const toInput = document.getElementById('toInput');
    const fromValue = fromInput.value.trim();
    const toValue = toInput.value.trim();
    
    // Validate cities
    let isValid = true;
    
    if (fromValue) {
      const fromCity = allLocations.find(loc => 
        loc.nameEn.toLowerCase() === fromValue.toLowerCase()
      );
      if (!fromCity) {
        fromInput.classList.add('invalid-city');
        isValid = false;
      } else {
        fromInput.classList.remove('invalid-city');
      }
    }
    
    if (toValue) {
      const toCity = allLocations.find(loc => 
        loc.nameEn.toLowerCase() === toValue.toLowerCase()
      );
      if (!toCity) {
        toInput.classList.add('invalid-city');
        isValid = false;
      } else {
        toInput.classList.remove('invalid-city');
      }
    }
    
    if (!isValid) {
      alert('Please select valid cities from the dropdown list');
      return;
    }
    
    const params = {
      from: fromValue,
      to: toValue,
      depart: document.getElementById('departInput').value,
      return: document.getElementById('returnInput').value,
      passengers: document.getElementById('passengersInput').value,
      class: document.getElementById('classInput').value,
      directOnly: document.getElementById('directOnlyInput').checked,
      page: 1
    };
    updateUrlParams(params);
    performSearch();
  });
  
  // Sort tabs
  document.querySelectorAll('.sort-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentSort = tab.dataset.sort;
      document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const params = getUrlParams();
      params.sort = currentSort;
      params.page = 1;
      updateUrlParams(params);
      performSearch();
    });
  });
  
  // Apply filters button (keep for backward compatibility)
  const applyFiltersBtn = document.getElementById('applyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFiltersFromUI);
  }
  
  // Auto-apply filters on change (live filtering)
  document.querySelectorAll('input[name="stops"]').forEach(cb => {
    cb.addEventListener('change', debounce(applyFiltersFromUI, 300));
  });
  
  document.querySelectorAll('input[name="operator"]').forEach(cb => {
    cb.addEventListener('change', debounce(applyFiltersFromUI, 300));
  });
  
  document.querySelectorAll('input[name="time"]').forEach(cb => {
    cb.addEventListener('change', debounce(applyFiltersFromUI, 300));
  });
  
  // Reset filters
  document.getElementById('resetFilters').addEventListener('click', () => {
    document.querySelectorAll('input[name="stops"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="operator"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="time"]').forEach(cb => cb.checked = false);
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    const priceSlider = document.getElementById('priceSlider');
    if (priceSlider) {
      priceSlider.value = 200;
      document.getElementById('priceMax').textContent = '200';
    }
    applyFiltersFromUI();
  });
  
  // Price slider
  const priceSlider = document.getElementById('priceSlider');
  const maxPriceInput = document.getElementById('maxPrice');
  const minPriceInput = document.getElementById('minPrice');
  const priceMaxLabel = document.getElementById('priceMax');
  
  if (priceSlider && maxPriceInput && priceMaxLabel) {
    priceSlider.addEventListener('input', () => {
      maxPriceInput.value = priceSlider.value;
      priceMaxLabel.textContent = priceSlider.value;
    });
    
    // Auto-apply when slider changes
    priceSlider.addEventListener('change', debounce(applyFiltersFromUI, 500));
    
    // Price inputs update slider
    maxPriceInput.addEventListener('input', () => {
      priceSlider.value = maxPriceInput.value || 200;
      priceMaxLabel.textContent = priceSlider.value;
    });
    
    // Auto-apply when price inputs change
    maxPriceInput.addEventListener('change', debounce(applyFiltersFromUI, 500));
    if (minPriceInput) {
      minPriceInput.addEventListener('change', debounce(applyFiltersFromUI, 500));
    }
  }
  
  // Pagination buttons
  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  });
  
  document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredBuses.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) goToPage(currentPage + 1);
  });
  
  // Header navigation (from HomePageBuses.js)
  const menuToggle = document.getElementById('menuToggle');
  const mobilePanel = document.getElementById('mobilePanel');
  menuToggle?.addEventListener('click', () => {
    const open = !mobilePanel.hasAttribute('hidden');
    open ? mobilePanel.setAttribute('hidden', '') : mobilePanel.removeAttribute('hidden');
    menuToggle.setAttribute('aria-expanded', String(!open));
  });
  
  // Language dropdown
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const langLabel = document.getElementById('langLabel');
  
  function toggleLang(open) {
    if (!langMenu) return;
    if (open) {
      langMenu.style.display = 'block';
      langBtn.setAttribute('aria-expanded', 'true');
    } else {
      langMenu.style.display = 'none';
      langBtn.setAttribute('aria-expanded', 'false');
    }
  }
  
  langBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLang(langMenu.style.display !== 'block');
  });
  
  document.addEventListener('click', (e) => {
    if (langMenu && !langMenu.contains(e.target) && e.target !== langBtn) {
      toggleLang(false);
    }
  });
  
  langMenu?.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    langMenu.querySelectorAll('li').forEach(x => x.removeAttribute('aria-selected'));
    li.setAttribute('aria-selected', 'true');
    langLabel.textContent = li.getAttribute('data-lang');
    toggleLang(false);
  });
  
  // Cart demo
  const cartBtn = document.getElementById('cartBtn');
  const cartCount = document.getElementById('cartCount');
  let count = 0;
  cartBtn?.addEventListener('click', () => {
    count = (count + 1) % 10;
    cartCount.textContent = count;
  });

  // ===== Currency Selector =====
  const currencyBtn = document.getElementById('currencyBtn');
  
  currencyBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const currencies = ['SAR', 'USD', 'EUR', 'GBP', 'AED'];
    const currentCurrency = currencyBtn.textContent.trim().split('\n')[0].trim();
    const currentIndex = currencies.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    const nextCurrency = currencies[nextIndex];
    currencyBtn.childNodes[0].textContent = nextCurrency + ' ';
  });

  // ===== Support Link =====
  const supportLink = document.querySelector('.nav-support');
  
  supportLink?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('24/7 Customer Support\n\nContact us:\n📞 Phone: +966 11 123 4567\n📧 Email: support@gotrip.com\n💬 WhatsApp: +966 50 123 4567\n\nOur team is here to help you anytime!');
  });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
