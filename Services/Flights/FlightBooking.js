// Global variables
let currentStep = 1;
let flightData = {};
let bookingData = {
  passengers: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Flight Booking Page Initialized');
  
  // Get flight data from URL parameters
  parseFlightData();
  
  // Setup user menu
  setupUserMenu();
  
  // Display flight information
  displayFlightInfo();
  
  // Initialize payment card
  initializePaymentCard();
  
  // Generate expiry year options
  generateYearOptions();
  
  // Update summary
  updateSummary();
});

// Parse flight data from URL parameters
function parseFlightData() {
  const urlParams = new URLSearchParams(window.location.search);
  
  flightData = {
    id: urlParams.get('flight_id') || '',
    airline: urlParams.get('airline') || 'Unknown Airline',
    flightNumber: urlParams.get('flight_number') || 'N/A',
    from: urlParams.get('from') || '',
    to: urlParams.get('to') || '',
    departureTime: urlParams.get('departure_time') || '',
    arrivalTime: urlParams.get('arrival_time') || '',
    departureDate: urlParams.get('departure_date') || new Date().toISOString().split('T')[0],
    duration: urlParams.get('duration') || '',
    stops: urlParams.get('stops') || '0',
    price: parseFloat(urlParams.get('price')) || 0,
    classType: urlParams.get('class') || 'Economy'
  };
  
  console.log('Flight Data:', flightData);
}

// Display flight information
function displayFlightInfo() {
  // Set airline info
  document.getElementById('airlineName').textContent = flightData.airline;
  document.getElementById('flightNumber').textContent = flightData.flightNumber;
  document.getElementById('classType').textContent = flightData.classType;
  
  // Set airline logo (you can add more logos as needed)
  const airlineLogo = document.getElementById('airlineLogo');
  const airlineLogos = {
    'Saudia': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Logo_of_Saudia.svg/1002px-Logo_of_Saudia.svg.png',
    'Flynas': 'https://logowik.com/content/uploads/images/nas-air-flynas8667.jpg',
    'Flyadeal': 'https://iconlogovector.com/uploads/images/2025/02/sm-67a940062feee-Flyadeal.webp',
    'flyadeal': 'https://iconlogovector.com/uploads/images/2025/02/sm-67a940062feee-Flyadeal.webp',
    'BlueJet': 'https://logos-world.net/wp-content/uploads/2023/02/JetBlue-Emblem.png',
    'Emirates': 'https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo.png',
    'Etihad': 'https://logos-world.net/wp-content/uploads/2023/01/Etihad-Airways-Logo.png',
    'Qatar Airways': 'https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo.png'
  };
  
  // Set logo with fallback
  const logoUrl = airlineLogos[flightData.airline];
  if (logoUrl) {
    airlineLogo.src = logoUrl;
    airlineLogo.style.display = 'block';
  } else {
    // Create text-based logo if no image available
    airlineLogo.style.display = 'none';
  }
  
  airlineLogo.onerror = function() {
    // If image fails to load, use airplane icon placeholder
    this.src = 'https://via.placeholder.com/80x80?text=✈';
  };
  
  // Set route info
  document.getElementById('departureTime').textContent = flightData.departureTime;
  document.getElementById('departureAirport').textContent = flightData.from;
  document.getElementById('departureDate').textContent = formatDate(flightData.departureDate);
  
  document.getElementById('arrivalTime').textContent = flightData.arrivalTime;
  document.getElementById('arrivalAirport').textContent = flightData.to;
  document.getElementById('arrivalDate').textContent = formatDate(flightData.departureDate);
  
  document.getElementById('flightDuration').textContent = flightData.duration;
  
  const stopsText = flightData.stops === '0' || flightData.stops === 0 ? 'Direct' : `${flightData.stops} Stop${flightData.stops > 1 ? 's' : ''}`;
  document.getElementById('flightStops').textContent = stopsText;
}

// Format date
function formatDate(dateString) {
  if (!dateString || dateString === 'Any date') {
    const today = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  }
  const date = new Date(dateString);
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Passenger counter functions
function incrementPassengers() {
  const input = document.getElementById('passengerCount');
  let value = parseInt(input.value);
  if (value < 9) {
    input.value = value + 1;
    updateSummary();
  }
}

function decrementPassengers() {
  const input = document.getElementById('passengerCount');
  let value = parseInt(input.value);
  if (value > 1) {
    input.value = value - 1;
    updateSummary();
  }
}

// Step navigation
function goToStep(step) {
  if (step === 2) {
    generatePassengerForms();
  }
  
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.progress-steps .step').forEach(s => s.classList.remove('active'));
  
  // Show current step
  document.getElementById('step' + step).classList.add('active');
  
  // Update progress
  for (let i = 1; i <= step; i++) {
    document.querySelector(`.progress-steps .step[data-step="${i}"]`).classList.add('active');
  }
  
  currentStep = step;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Generate passenger forms
function generatePassengerForms() {
  const passengerCount = parseInt(document.getElementById('passengerCount').value);
  const container = document.getElementById('passengerForms');
  container.innerHTML = '';
  
  for (let i = 1; i <= passengerCount; i++) {
    const formHTML = `
      <div class="passenger-card">
        <h4><i class="fas fa-user"></i> Passenger ${i}</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="firstName${i}">First Name *</label>
            <input type="text" id="firstName${i}" placeholder="John" required>
          </div>
          <div class="form-group">
            <label for="lastName${i}">Last Name *</label>
            <input type="text" id="lastName${i}" placeholder="Doe" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="email${i}">Email *</label>
            <input type="email" id="email${i}" placeholder="john.doe@example.com" required>
          </div>
          <div class="form-group">
            <label for="phone${i}">Phone Number *</label>
            <input type="tel" id="phone${i}" placeholder="+966 5X XXX XXXX" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="passport${i}">Passport Number *</label>
            <input type="text" id="passport${i}" placeholder="A12345678" required>
          </div>
          <div class="form-group">
            <label for="nationality${i}">Nationality *</label>
            <input type="text" id="nationality${i}" placeholder="Saudi Arabia" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="dob${i}">Date of Birth *</label>
            <input type="date" id="dob${i}" required>
          </div>
          <div class="form-group">
            <label for="gender${i}">Gender *</label>
            <select id="gender${i}" required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += formHTML;
  }
}

// Validate passenger forms
function validateAndGoToStep(step) {
  if (currentStep === 2) {
    const passengerCount = parseInt(document.getElementById('passengerCount').value);
    let isValid = true;
    bookingData.passengers = [];
    
    for (let i = 1; i <= passengerCount; i++) {
      const firstName = document.getElementById(`firstName${i}`).value.trim();
      const lastName = document.getElementById(`lastName${i}`).value.trim();
      const email = document.getElementById(`email${i}`).value.trim();
      const phone = document.getElementById(`phone${i}`).value.trim();
      const passport = document.getElementById(`passport${i}`).value.trim();
      const nationality = document.getElementById(`nationality${i}`).value.trim();
      const dob = document.getElementById(`dob${i}`).value;
      const gender = document.getElementById(`gender${i}`).value;
      
      if (!firstName || !lastName || !email || !phone || !passport || !nationality || !dob || !gender) {
        alert(`Please fill in all required fields for Passenger ${i}`);
        isValid = false;
        break;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert(`Please enter a valid email for Passenger ${i}`);
        isValid = false;
        break;
      }
      
      bookingData.passengers.push({
        firstName,
        lastName,
        email,
        phone,
        passport,
        nationality,
        dateOfBirth: dob,
        gender
      });
    }
    
    if (isValid) {
      goToStep(step);
    }
  } else {
    goToStep(step);
  }
}

// Card type detection and logos
const cardLogos = {
  visa: `<svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" opacity="0.9"/>
    <text x="24" y="20" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#1434CB" text-anchor="middle">VISA</text>
  </svg>`,
  
  mastercard: `<svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" opacity="0.9"/>
    <circle cx="18" cy="16" r="7" fill="#EB001B"/>
    <circle cx="30" cy="16" r="7" fill="#F79E1B"/>
    <path d="M 24 10 A 7 7 0 0 1 24 22 A 7 7 0 0 1 24 10" fill="#FF5F00"/>
  </svg>`,
  
  amex: `<svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" opacity="0.9"/>
    <rect x="4" y="10" width="40" height="12" fill="#006FCF"/>
    <text x="24" y="18.5" font-family="Arial,sans-serif" font-size="7" font-weight="bold" fill="white" text-anchor="middle">AMEX</text>
  </svg>`,
  
  discover: `<svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" opacity="0.9"/>
    <circle cx="38" cy="16" r="10" fill="#FF6000"/>
    <text x="16" y="19" font-family="Arial,sans-serif" font-size="8" font-weight="bold" fill="#FF6000" text-anchor="middle">DISCOVER</text>
  </svg>`
};

function detectCardType(number) {
  const cleaned = number.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2(2[2-9]|[3-6]|7[0-1]|720)/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6011|^64[4-9]|^65/.test(cleaned)) return 'discover';
  
  return null;
}

// Payment card initialization
function initializePaymentCard() {
  const cardNumber = document.getElementById('cardNumber3d');
  const cardName = document.getElementById('cardName3d');
  const expMonth = document.getElementById('expMonth3d');
  const expYear = document.getElementById('expYear3d');
  const cardCvv = document.getElementById('cardCvv3d');
  const card3d = document.getElementById('card3d');
  
  // Card number formatting and display
  cardNumber.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
    
    const displayValue = formattedValue || '#### #### #### ####';
    document.getElementById('cardNumberDisplay3d').textContent = displayValue;
    
    // Detect and display card type logo
    const cardLogo = document.getElementById('cardLogo3d');
    const cardType = detectCardType(value);
    if (cardType && cardLogos[cardType]) {
      cardLogo.innerHTML = cardLogos[cardType];
    } else {
      cardLogo.innerHTML = '';
    }
  });
  
  // Cardholder name
  cardName.addEventListener('input', function(e) {
    const name = e.target.value.toUpperCase() || 'FULL NAME';
    document.getElementById('cardHolderDisplay3d').textContent = name;
  });
  
  // Expiry date
  function updateExpiry() {
    const month = expMonth.value || '01';
    const year = expYear.value ? expYear.value.slice(-2) : '25';
    document.getElementById('cardExpiryDisplay3d').textContent = `${month} / ${year}`;
  }
  
  expMonth.addEventListener('change', updateExpiry);
  expYear.addEventListener('change', updateExpiry);
  
  // CVV - flip card on focus
  cardCvv.addEventListener('focus', function() {
    card3d.style.transform = 'rotateY(180deg)';
  });
  
  cardCvv.addEventListener('blur', function() {
    card3d.style.transform = 'rotateY(0deg)';
  });
  
  cardCvv.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    e.target.value = value;
    
    const displayValue = value || '';
    document.getElementById('cardCvvDisplay3d').textContent = displayValue;
  });
}

// Generate year options
function generateYearOptions() {
  const yearSelect = document.getElementById('expYear3d');
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < 15; i++) {
    const year = currentYear + i;
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// Process payment (Fake payment like Buses)
function processPayment() {
  console.log('🔄 processPayment called');
  
  // Validate payment form
  const cardNumber = document.getElementById('cardNumber3d').value.replace(/\s/g, '');
  const cardName = document.getElementById('cardName3d').value.trim();
  const expMonth = document.getElementById('expMonth3d').value;
  const expYear = document.getElementById('expYear3d').value;
  const cardCvv = document.getElementById('cardCvv3d').value;
  
  console.log('Card validation:', {
    cardNumberLength: cardNumber.length,
    hasCardName: !!cardName,
    hasMonth: !!expMonth,
    hasYear: !!expYear,
    cvvLength: cardCvv.length
  });
  
  if (!cardNumber || cardNumber.length < 13) {
    alert('⚠️ Please enter a valid card number (at least 13 digits)');
    return;
  }
  
  if (!cardName) {
    alert('⚠️ Please enter the cardholder name');
    return;
  }
  
  if (!expMonth || expMonth === '') {
    alert('⚠️ Please select expiration month');
    return;
  }
  
  if (!expYear || expYear === '') {
    alert('⚠️ Please select expiration year');
    return;
  }
  
  // Validate expiry date is not in the past
  const expiryDate = new Date(expYear, parseInt(expMonth) - 1);
  const now = new Date();
  if (expiryDate < now) {
    alert('⚠️ Card has expired. Please use a valid card');
    return;
  }
  
  if (!cardCvv || cardCvv.length < 3) {
    alert('⚠️ Please enter a valid CVV (3 or 4 digits)');
    return;
  }
  
  console.log('✅ All card validations passed');
  
  // Show processing
  const payBtn = document.querySelector('.btn-pay');
  const originalText = payBtn.innerHTML;
  payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  payBtn.disabled = true;
  payBtn.style.opacity = '0.6';
  payBtn.style.cursor = 'not-allowed';
  
  // Simulate payment processing
  setTimeout(() => {
    try {
      console.log('💰 Payment processing completed');
      
      // Generate booking reference
      const bookingRef = 'GT-FLT-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
      document.getElementById('bookingReference').textContent = bookingRef;
      console.log('📝 Booking reference:', bookingRef);
      
      // Save booking to localStorage
      console.log('💾 Saving booking...');
      saveBookingToLocalStorage(bookingRef);
      console.log('✅ Booking saved');
      
      // Display confirmation details
      console.log('📋 Displaying confirmation...');
      displayConfirmationDetails();
      console.log('✅ Confirmation displayed');
      
      // Go to confirmation step
      console.log('➡️ Moving to step 4...');
      goToStep(4);
      
      // Reset button
      payBtn.innerHTML = originalText;
      payBtn.disabled = false;
      payBtn.style.opacity = '1';
      payBtn.style.cursor = 'pointer';
      
      console.log('✅ Payment processed successfully!');
      console.log('🎉 Booking Reference:', bookingRef);
      
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      alert('⚠️ Error processing payment: ' + error.message + '\n\nPlease try again.');
      
      // Reset button
      payBtn.innerHTML = originalText;
      payBtn.disabled = false;
      payBtn.style.opacity = '1';
      payBtn.style.cursor = 'pointer';
    }
  }, 2500); // 2.5 seconds for realistic payment processing
}

// Save booking to localStorage (fake save like Buses)
function saveBookingToLocalStorage(bookingRef) {
  const passengerCount = parseInt(document.getElementById('passengerCount').value);
  const totalPrice = flightData.price * passengerCount;
  
  const booking = {
    bookingReference: bookingRef,
    bookingDate: new Date().toISOString(),
    flight: {
      airline: flightData.airline,
      flightNumber: flightData.flightNumber,
      from: flightData.from,
      to: flightData.to,
      departureDate: flightData.departureDate,
      departureTime: flightData.departureTime,
      arrivalTime: flightData.arrivalTime,
      classType: flightData.classType
    },
    passengers: bookingData.passengers,
    passengerCount: passengerCount,
    totalPrice: totalPrice,
    status: 'confirmed'
  };
  
  // Get existing bookings or initialize empty array
  let bookings = JSON.parse(localStorage.getItem('flightBookings') || '[]');
  
  // Add new booking
  bookings.push(booking);
  
  // Save to localStorage
  localStorage.setItem('flightBookings', JSON.stringify(bookings));
  
  console.log('Booking saved to localStorage:', booking);
}

// Generate booking reference
function generateBookingReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GT-FLT-${timestamp}-${random}`;
}

// Display confirmation details
function displayConfirmationDetails() {
  const passengerCount = parseInt(document.getElementById('passengerCount').value);
  const totalPrice = flightData.price * passengerCount;
  
  const detailsHTML = `
    <div class="confirmation-flight">
      <h3><i class="fas fa-plane"></i> Flight Details</h3>
      <div class="detail-row">
        <span class="detail-label">Airline:</span>
        <span class="detail-value">${flightData.airline} (${flightData.flightNumber})</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Route:</span>
        <span class="detail-value">${flightData.from} → ${flightData.to}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${formatDate(flightData.departureDate)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Departure:</span>
        <span class="detail-value">${flightData.departureTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Arrival:</span>
        <span class="detail-value">${flightData.arrivalTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Passengers:</span>
        <span class="detail-value">${passengerCount}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Class:</span>
        <span class="detail-value">${flightData.classType}</span>
      </div>
      <div class="detail-row total-row">
        <span class="detail-label">Total Paid:</span>
        <span class="detail-value">SAR ${totalPrice.toFixed(2)}</span>
      </div>
    </div>
    
    <div class="confirmation-passengers">
      <h3><i class="fas fa-users"></i> Passengers</h3>
      ${bookingData.passengers.map((p, i) => `
        <div class="passenger-info">
          <strong>Passenger ${i + 1}:</strong> ${p.firstName} ${p.lastName}<br>
          <small>Passport: ${p.passport} | Email: ${p.email}</small>
        </div>
      `).join('')}
    </div>
  `;
  
  document.getElementById('confirmationDetails').innerHTML = detailsHTML;
}

// Download ticket
function downloadTicket() {
  alert('Ticket download functionality will be implemented soon!');
  // TODO: Implement PDF generation
}

// Update summary sidebar
function updateSummary() {
  const passengerCount = parseInt(document.getElementById('passengerCount')?.value || 1);
  const baseFare = flightData.price;
  const taxesPerPerson = baseFare * 0.15; // 15% taxes
  const totalPrice = (baseFare + taxesPerPerson) * passengerCount;
  
  document.getElementById('summaryRoute').textContent = `${flightData.from} → ${flightData.to}`;
  document.getElementById('summaryDate').textContent = formatDate(flightData.departureDate);
  document.getElementById('summaryPassengers').textContent = passengerCount;
  document.getElementById('summaryClass').textContent = flightData.classType;
  
  document.getElementById('baseFare').textContent = `SAR ${(baseFare * passengerCount).toFixed(2)}`;
  document.getElementById('taxesFees').textContent = `SAR ${(taxesPerPerson * passengerCount).toFixed(2)}`;
  document.getElementById('totalPrice').textContent = `SAR ${totalPrice.toFixed(2)}`;
}

// User menu functions
function setupUserMenu() {
  const userBtn = document.getElementById('userBtn');
  const userDropdown = document.getElementById('userDropdown');
  
  // Get user name from localStorage
  const userName = localStorage.getItem('userName') || 'Account';
  document.getElementById('userName').textContent = userName;
  
  // Toggle dropdown
  userBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
      userDropdown.classList.remove('show');
    }
  });
}

function goToProfile() {
  window.location.href = '../../User/dashboard.html';
}

function goToBookings() {
  window.location.href = '../../User/dashboard.html';
}

function goToSettings() {
  window.location.href = '../../User/dashboard.html';
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
  window.location.href = '../../Login/login.html';
}
