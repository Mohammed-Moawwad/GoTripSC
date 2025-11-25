// ===== Booking.js =====
// Handles bus booking flow

// Global State
let currentStep = 1;
let tripData = null;
let passengerCount = 1;
let totalPrice = 0;
let bookingReference = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  checkAuthentication();
  
  // Update header with user info
  updateHeader();
  
  // Load trip data from localStorage
  loadTripData();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize step 1
  updateSummary();
});

function updateHeader() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn && user.first_name) {
    // Update user name in header
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = user.first_name;
    }
  }
  
  // Setup user menu dropdown
  const userBtn = document.getElementById('userBtn');
  const userMenu = document.getElementById('userMenu');
  const userDropdown = document.getElementById('userDropdown');
  
  if (userBtn && userMenu) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userMenu.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
      }
    });
    
    // Prevent dropdown from closing when clicking inside
    if (userDropdown) {
      userDropdown.addEventListener('click', function(e) {
        if (!e.target.closest('.logout-item')) {
          e.stopPropagation();
        }
      });
    }
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('selectedTrip');
    window.location.href = '../../Login/signin.html';
  }
  return false;
}

function checkAuthentication() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isLoggedIn || !user.email) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `../../Login/signin.html?next=${returnUrl}`;
    return;
  }
  
  // Pre-fill contact information
  document.getElementById('contactEmail').value = user.email || '';
}

function loadTripData() {
  // Get trip data from localStorage
  const savedTrip = localStorage.getItem('selectedTrip');
  
  if (savedTrip) {
    tripData = JSON.parse(savedTrip);
    console.log('Loaded trip data:', tripData);
  } else {
    // Fallback: parse from URL parameters
    const params = new URLSearchParams(window.location.search);
    tripData = {
      id: params.get('trip'),
      from: params.get('from') || 'Riyadh',
      to: params.get('to') || 'Jeddah',
      departAt: params.get('depart') || new Date().toISOString(),
      priceSar: parseFloat(params.get('price')) || 79.00,
      operator: params.get('operator') || 'SAPTCO',
      class: params.get('class') || 'Economy',
      durationMin: 90,
      stops: '0',
      amenities: ['WiFi', 'AC', 'USB Charging']
    };
    console.log('Created fallback trip data:', tripData);
  }
  
  // Display trip information
  displayTripInfo();
}

function displayTripInfo() {
  if (!tripData) return;
  
  // Operator info
  document.getElementById('operatorName').textContent = tripData.operator || 'Bus Operator';
  document.getElementById('busClass').textContent = tripData.class || 'Economy';
  
  // Route details
  const departTime = formatTime(tripData.departAt || tripData.departure || new Date().toISOString());
  const departDate = formatDate(tripData.departAt || tripData.departure || new Date().toISOString());
  
  document.getElementById('fromCity').textContent = tripData.from || 'Riyadh';
  document.getElementById('toCity').textContent = tripData.to || 'Jeddah';
  document.getElementById('departTime').textContent = departTime;
  document.getElementById('departDate').textContent = departDate;
  
  // Calculate arrival
  const departDateTime = new Date(tripData.departAt || tripData.departure || new Date());
  const duration = tripData.durationMin || tripData.duration || 90;
  const arriveDateTime = new Date(departDateTime.getTime() + duration * 60000);
  document.getElementById('arriveTime').textContent = formatTime(arriveDateTime.toISOString());
  document.getElementById('arriveDate').textContent = formatDate(arriveDateTime.toISOString());
  
  // Duration and stops
  document.getElementById('tripDuration').textContent = formatDuration(duration);
  const stops = typeof tripData.stops === 'string' ? parseInt(tripData.stops) : tripData.stops;
  document.getElementById('tripStops').textContent = stops === 0 || tripData.stops === '0' ? 'Nonstop' : `${stops} stop(s)`;
  
  // Amenities
  const amenitiesList = document.getElementById('amenitiesList');
  if (tripData.amenities && tripData.amenities.length > 0) {
    amenitiesList.innerHTML = '<h4>✨ Amenities & Features</h4>' +
      tripData.amenities.map(amenity => 
        `<span class="amenity-badge">${amenity}</span>`
      ).join('');
  }
  
  // Get price (handle both priceSar and price property names)
  const price = tripData.priceSar || tripData.price || 79;
  console.log('Trip price:', price);
  
  // Set base price and update summary
  document.getElementById('baseFare').textContent = price.toFixed(2) + ' SAR';
  
  // Update the summary with proper calculations
  updateSummary();
}

function setupEventListeners() {
  // Payment method selection
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      this.classList.add('active');
      this.querySelector('input[type="radio"]').checked = true;
    });
  });
  
  // Card number formatting
  const cardNumber = document.getElementById('cardNumber');
  if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }
  
  // Expiry date formatting
  const cardExpiry = document.getElementById('cardExpiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
  
  // CVV - numbers only
  const cardCvv = document.getElementById('cardCvv');
  if (cardCvv) {
    cardCvv.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }
}

// Passenger counter functions
function incrementPassengers() {
  if (passengerCount < 10) {
    passengerCount++;
    document.getElementById('passengerCount').value = passengerCount;
    updateSummary();
  }
}

function decrementPassengers() {
  if (passengerCount > 1) {
    passengerCount--;
    document.getElementById('passengerCount').value = passengerCount;
    updateSummary();
  }
}

function updateSummary() {
  // Get price from tripData (handle both priceSar and price)
  const basePrice = tripData ? (tripData.priceSar || tripData.price || 79) : 79;
  const taxes = basePrice * passengerCount * 0.15; // 15% tax
  const total = basePrice * passengerCount + taxes;
  
  console.log('Updating summary:', { basePrice, passengerCount, taxes, total });
  
  document.getElementById('baseFare').textContent = basePrice.toFixed(2) + ' SAR';
  document.getElementById('passengerCountDisplay').textContent = passengerCount;
  document.getElementById('taxesFees').textContent = taxes.toFixed(2) + ' SAR';
  document.getElementById('totalAmount').textContent = total.toFixed(2) + ' SAR';
  
  totalPrice = total;
}

function goToStep(step) {
  // Validate step number
  if (step < 1 || step > 4) return;
  
  // Hide all steps with fade out
  document.querySelectorAll('.step-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Show target step with fade in
  const targetStep = document.getElementById(`step${step}`);
  if (targetStep) {
    setTimeout(() => {
      targetStep.classList.add('active');
    }, 100);
  }
  
  // Update progress indicators
  document.querySelectorAll('.step').forEach(s => {
    const stepNum = parseInt(s.dataset.step);
    if (stepNum < step) {
      s.classList.add('completed');
      s.classList.remove('active');
    } else if (stepNum === step) {
      s.classList.add('active');
      s.classList.remove('completed');
    } else {
      s.classList.remove('active', 'completed');
    }
  });
  
  // Update step lines
  document.querySelectorAll('.step-line').forEach((line, index) => {
    if (index + 1 < step) {
      line.style.background = '#28a745';
    } else {
      line.style.background = '#e3e8f4';
    }
  });
  
  currentStep = step;
  
  // Special actions for each step
  if (step === 2) {
    generatePassengerForms();
  } else if (step === 4) {
    // Clear sensitive payment information
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardCvv').value = '';
    document.getElementById('cardExpiry').value = '';
    document.getElementById('cardName').value = '';
  }
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Log step change
  console.log(`📍 Moved to Step ${step}`);
}

function generatePassengerForms() {
  const container = document.getElementById('passengersContainer');
  container.innerHTML = '';
  
  for (let i = 1; i <= passengerCount; i++) {
    const form = document.createElement('div');
    form.className = 'passenger-form';
    form.innerHTML = `
      <h4>Passenger ${i}</h4>
      <div class="form-row">
        <div class="form-field">
          <label>First Name *</label>
          <input type="text" id="passenger${i}FirstName" required placeholder="John" />
        </div>
        <div class="form-field">
          <label>Last Name *</label>
          <input type="text" id="passenger${i}LastName" required placeholder="Doe" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>ID Number / Passport *</label>
          <input type="text" id="passenger${i}Id" required placeholder="1234567890" />
        </div>
        <div class="form-field">
          <label>Date of Birth *</label>
          <input type="date" id="passenger${i}Dob" required max="${new Date().toISOString().split('T')[0]}" />
        </div>
      </div>
    `;
    container.appendChild(form);
  }
}

function validateAndGoToStep(step) {
  if (currentStep === 2) {
    // Validate passenger information
    let isValid = true;
    let firstInvalidField = null;
    
    for (let i = 1; i <= passengerCount; i++) {
      const firstName = document.getElementById(`passenger${i}FirstName`);
      const lastName = document.getElementById(`passenger${i}LastName`);
      const id = document.getElementById(`passenger${i}Id`);
      const dob = document.getElementById(`passenger${i}Dob`);
      
      // Check first name
      if (!firstName.value.trim()) {
        firstName.style.borderColor = '#dc3545';
        if (!firstInvalidField) firstInvalidField = firstName;
        isValid = false;
      } else {
        firstName.style.borderColor = '';
      }
      
      // Check last name
      if (!lastName.value.trim()) {
        lastName.style.borderColor = '#dc3545';
        if (!firstInvalidField) firstInvalidField = lastName;
        isValid = false;
      } else {
        lastName.style.borderColor = '';
      }
      
      // Check ID
      if (!id.value.trim()) {
        id.style.borderColor = '#dc3545';
        if (!firstInvalidField) firstInvalidField = id;
        isValid = false;
      } else {
        id.style.borderColor = '';
      }
      
      // Check date of birth
      if (!dob.value) {
        dob.style.borderColor = '#dc3545';
        if (!firstInvalidField) firstInvalidField = dob;
        isValid = false;
      } else {
        dob.style.borderColor = '';
      }
    }
    
    // Validate contact information
    const email = document.getElementById('contactEmail');
    const phone = document.getElementById('contactPhone');
    
    if (!email.value.trim() || !email.value.includes('@')) {
      email.style.borderColor = '#dc3545';
      if (!firstInvalidField) firstInvalidField = email;
      alert('⚠️ Please enter a valid email address');
      isValid = false;
    } else {
      email.style.borderColor = '';
    }
    
    if (!phone.value.trim() || phone.value.length < 10) {
      phone.style.borderColor = '#dc3545';
      if (!firstInvalidField) firstInvalidField = phone;
      alert('⚠️ Please enter a valid phone number (at least 10 digits)');
      isValid = false;
    } else {
      phone.style.borderColor = '';
    }
    
    if (!isValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
  }
  
  goToStep(step);
}

function processPayment(event) {
  // Prevent any default behavior
  if (event) event.preventDefault();
  
  console.log('🔄 processPayment called');
  
  // Validate payment form
  const agreeTerms = document.getElementById('agreeTerms');
  if (!agreeTerms) {
    console.error('❌ agreeTerms checkbox not found');
    alert('⚠️ Payment form error. Please refresh the page.');
    return;
  }
  
  if (!agreeTerms.checked) {
    alert('⚠️ Please agree to the Terms & Conditions to continue');
    agreeTerms.focus();
    return;
  }
  
  // Check for payment method (default to card if not found, since we removed payment method selection)
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'card';
  
  console.log('💳 Payment method:', paymentMethod);
  
  // Validate based on payment method
  if (paymentMethod === 'card') {
    console.log('✅ Validating card payment');
    
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const expMonth = document.getElementById('expMonth');
    const expYear = document.getElementById('expYear');
    const cardCvvInput = document.getElementById('cardCvv');
    
    // Check if all fields exist
    if (!cardNumberInput || !cardNameInput || !expMonth || !expYear || !cardCvvInput) {
      console.error('❌ Some card form fields are missing:', {
        cardNumber: !!cardNumberInput,
        cardName: !!cardNameInput,
        expMonth: !!expMonth,
        expYear: !!expYear,
        cardCvv: !!cardCvvInput
      });
      alert('⚠️ Payment form error. Please refresh the page.');
      return;
    }
    
    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    const cardName = cardNameInput.value.trim();
    const cardCvv = cardCvvInput.value;
    
    console.log('Card validation:', {
      cardNumberLength: cardNumber.length,
      hasCardName: !!cardName,
      hasMonth: !!expMonth.value,
      hasYear: !!expYear.value,
      cvvLength: cardCvv.length
    });
    
    if (!cardNumber || cardNumber.length < 13) {
      alert('⚠️ Please enter a valid card number (at least 13 digits)');
      cardNumberInput.focus();
      return;
    }
    
    if (!cardName) {
      alert('⚠️ Please enter the cardholder name');
      cardNameInput.focus();
      return;
    }
    
    // Check if expiry month and year are selected
    if (!expMonth || !expMonth.value || expMonth.value === '') {
      alert('⚠️ Please select expiration month');
      expMonth.focus();
      return;
    }
    
    if (!expYear || !expYear.value || expYear.value === '') {
      alert('⚠️ Please select expiration year');
      expYear.focus();
      return;
    }
    
    // Validate expiry date is not in the past
    const month = expMonth.value;
    const year = expYear.value;
    const expiryDate = new Date(`20${year}`, parseInt(month) - 1);
    const now = new Date();
    if (expiryDate < now) {
      alert('⚠️ Card has expired. Please use a valid card');
      expMonth.focus();
      return;
    }
    
    if (!cardCvv || cardCvv.length < 3) {
      alert('⚠️ Please enter a valid CVV (3 digits)');
      cardCvvInput.focus();
      return;
    }
    
    console.log('✅ All card validations passed');
  }
  
  // Get the pay button
  const payButton = document.querySelector('.btn-pay');
  const originalText = payButton.innerHTML;
  
  // Show processing state
  payButton.disabled = true;
  payButton.innerHTML = '⏳ Processing Payment...';
  payButton.style.opacity = '0.6';
  payButton.style.cursor = 'not-allowed';
  
  // Simulate payment processing with realistic delay
  setTimeout(() => {
    try {
      console.log('💰 Payment processing completed');
      
      // Generate unique booking reference
      bookingReference = 'GT-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
      console.log('📝 Booking reference:', bookingReference);
      
      // Save booking to localStorage
      console.log('💾 Saving booking...');
      saveBooking();
      console.log('✅ Booking saved');
      
      // Display confirmation details
      console.log('📋 Displaying confirmation...');
      displayConfirmation();
      console.log('✅ Confirmation displayed');
      
      // Go to confirmation step
      console.log('➡️ Moving to step 4...');
      goToStep(4);
      
      // Reset button (even though user won't see it)
      payButton.disabled = false;
      payButton.innerHTML = originalText;
      payButton.style.opacity = '1';
      payButton.style.cursor = 'pointer';
      
      // Show success notification
      console.log('✅ Payment processed successfully!');
      console.log('🎉 Booking Reference:', bookingReference);
      
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      alert('⚠️ Error processing payment: ' + error.message + '\n\nPlease try again.');
      
      // Reset button
      payButton.disabled = false;
      payButton.innerHTML = originalText;
      payButton.style.opacity = '1';
      payButton.style.cursor = 'pointer';
    }
    
  }, 2500); // 2.5 seconds for realistic payment processing
}

function saveBooking() {
  // Collect passenger information
  const passengers = [];
  for (let i = 1; i <= passengerCount; i++) {
    passengers.push({
      firstName: document.getElementById(`passenger${i}FirstName`).value,
      lastName: document.getElementById(`passenger${i}LastName`).value,
      idNumber: document.getElementById(`passenger${i}Id`).value,
      dateOfBirth: document.getElementById(`passenger${i}Dob`).value
    });
  }
  
  // Get payment method (default to 'card' if not found since we removed payment method selection)
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'card';
  
  const booking = {
    reference: bookingReference,
    trip: tripData,
    passengers: passengers,
    passengerCount: passengerCount,
    totalPrice: totalPrice,
    contactEmail: document.getElementById('contactEmail').value,
    contactPhone: document.getElementById('contactPhone').value,
    paymentMethod: paymentMethod,
    bookingDate: new Date().toISOString(),
    status: 'confirmed',
    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null
  };
  
  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  localStorage.setItem('lastBooking', JSON.stringify(booking));
  
  console.log('📝 Booking saved:', booking);
}

function displayConfirmation() {
  document.getElementById('bookingReference').textContent = bookingReference;
}

function downloadTicket() {
  const booking = JSON.parse(localStorage.getItem('lastBooking'));
  if (!booking) {
    alert('Booking information not found!');
    return;
  }
  
  // Create a simple text ticket
  const ticketContent = `
═══════════════════════════════════════════════════════
                    🎫 GOTRIP BUS TICKET 🎫
═══════════════════════════════════════════════════════

Booking Reference: ${booking.reference}
Status: ${booking.status.toUpperCase()}
Booking Date: ${new Date(booking.bookingDate).toLocaleString()}

═══════════════════════════════════════════════════════
                     TRIP DETAILS
═══════════════════════════════════════════════════════

Operator: ${booking.trip.operator}
From: ${booking.trip.from}
To: ${booking.trip.to}
Departure: ${new Date(booking.trip.departure).toLocaleString()}
Class: ${booking.trip.class}
Duration: ${formatDuration(booking.trip.duration)}
Stops: ${booking.trip.stops === 0 ? 'Nonstop' : booking.trip.stops + ' stop(s)'}

═══════════════════════════════════════════════════════
                   PASSENGER DETAILS
═══════════════════════════════════════════════════════

${booking.passengers.map((p, i) => `
Passenger ${i + 1}:
  Name: ${p.firstName} ${p.lastName}
  ID: ${p.idNumber}
  DOB: ${p.dateOfBirth}
`).join('\n')}

═══════════════════════════════════════════════════════
                   CONTACT INFORMATION
═══════════════════════════════════════════════════════

Email: ${booking.contactEmail}
Phone: ${booking.contactPhone}

═══════════════════════════════════════════════════════
                   PAYMENT INFORMATION
═══════════════════════════════════════════════════════

Payment Method: ${booking.paymentMethod.toUpperCase()}
Total Amount: ${booking.totalPrice.toFixed(2)} SAR
Number of Passengers: ${booking.passengerCount}

═══════════════════════════════════════════════════════
                   IMPORTANT NOTES
═══════════════════════════════════════════════════════

✓ Please arrive at the bus station 30 minutes before departure
✓ Bring a valid ID that matches the passenger information
✓ This ticket is non-transferable
✓ Free cancellation up to 24 hours before departure
✓ For support, contact: support@gotrip.com

═══════════════════════════════════════════════════════
              Thank you for choosing GoTrip!
═══════════════════════════════════════════════════════
  `;
  
  // Create and download the ticket
  const blob = new Blob([ticketContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GoTrip_Ticket_${booking.reference}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  // Show confirmation
  setTimeout(() => {
    alert('✅ Your ticket has been downloaded successfully!\n\nPlease check your Downloads folder.');
  }, 300);
}

// Helper functions
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// User menu navigation functions
function goToProfile() {
  alert('🧑 My Profile page - Coming soon!\n\nYou can view and edit your profile information here.');
  // Future: window.location.href = '/profile.html';
}

function goToBookings() {
  // Check if user has any bookings
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (bookings.length === 0) {
    alert('📋 You have no bookings yet.\n\nComplete your first booking to see it here!');
  } else {
    // Show bookings summary
    const userBookings = bookings.filter(b => b.userId === user.id);
    alert(`📋 My Bookings\n\nYou have ${userBookings.length} booking(s).\n\nBookings page coming soon!`);
    // Future: window.location.href = '/my-bookings.html';
  }
}

function goToSettings() {
  alert('⚙️ Settings page - Coming soon!\n\nYou can manage your preferences and account settings here.');
  // Future: window.location.href = '/settings.html';
}

// Make functions global
window.goToStep = goToStep;
window.validateAndGoToStep = validateAndGoToStep;
window.processPayment = processPayment;
window.downloadTicket = downloadTicket;
window.incrementPassengers = incrementPassengers;
window.decrementPassengers = decrementPassengers;
window.logout = logout;
window.goToProfile = goToProfile;
window.goToBookings = goToBookings;
window.goToSettings = goToSettings;

// ===== 3D CARD INTERACTIVE PAYMENT =====

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

// Initialize 3D card functionality
function init3DCard() {
  const cardNumberInput = document.getElementById('cardNumber');
  const cardNameInput = document.getElementById('cardName');
  const expMonthSelect = document.getElementById('expMonth');
  const expYearSelect = document.getElementById('expYear');
  const cvvInput = document.getElementById('cardCvv');
  
  const cardNumberDisplay = document.getElementById('cardNumberDisplay3d');
  const cardHolderDisplay = document.getElementById('cardHolderDisplay3d');
  const cardExpiryDisplay = document.getElementById('cardExpiryDisplay3d');
  const cardCvvDisplay = document.getElementById('cardCvvDisplay3d');
  const cardLogo = document.getElementById('cardLogo3d');
  const card = document.getElementById('card3d');
  
  if (!cardNumberInput || !card) return;
  
  // Format and update card number
  cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
    
    if (formattedValue) {
      cardNumberDisplay.textContent = formattedValue;
    } else {
      cardNumberDisplay.textContent = '#### #### #### ####';
    }
    
    // Detect and display card type
    const cardType = detectCardType(value);
    if (cardType && cardLogos[cardType]) {
      cardLogo.innerHTML = cardLogos[cardType];
    } else {
      cardLogo.innerHTML = '';
    }
  });
  
  // Update card holder name
  cardNameInput.addEventListener('input', function(e) {
    const value = e.target.value;
    if (value) {
      cardHolderDisplay.textContent = value.toUpperCase();
    } else {
      cardHolderDisplay.textContent = 'Full Name';
    }
  });
  
  // Update expiry date
  function updateExpiry() {
    const month = expMonthSelect.value || '01';
    const year = expYearSelect.value || '25';
    cardExpiryDisplay.textContent = `${month} / ${year}`;
  }
  
  expMonthSelect.addEventListener('change', updateExpiry);
  expYearSelect.addEventListener('change', updateExpiry);
  
  // Update CVV and flip card
  cvvInput.addEventListener('input', function(e) {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    cardCvvDisplay.textContent = value;
  });
  
  cvvInput.addEventListener('focus', function() {
    card.classList.add('flipped');
  });
  
  cvvInput.addEventListener('blur', function() {
    card.classList.remove('flipped');
  });
}

// Initialize 3D card when step 3 is shown
const originalGoToStep = window.goToStep;
window.goToStep = function(step) {
  originalGoToStep(step);
  if (step === 3) {
    setTimeout(init3DCard, 100);
  }
};
