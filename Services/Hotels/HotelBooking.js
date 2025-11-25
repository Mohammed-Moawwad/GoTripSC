// ===== HotelBooking.js =====
// Handles hotel booking flow

// Global State
let currentStep = 1;
let hotelData = null;
let roomCount = 1;
let guestCount = 2;
let totalPrice = 0;
let bookingReference = '';
let numberOfNights = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  checkAuthentication();
  
  // Update header with user info
  updateHeader();
  
  // Load hotel data from URL parameters
  loadHotelData();
  
  // Initialize step 1
  updateSummary();
});

function updateHeader() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn && user.first_name) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = user.first_name;
    }
  }
  
  // Setup user menu dropdown
  const userBtn = document.getElementById('userBtn');
  const userMenu = document.getElementById('userMenu');
  
  if (userBtn && userMenu) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
      if (!userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
      }
    });
  }
}

function checkAuthentication() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    if (confirm('⚠️ You need to be logged in to make a booking.\n\nWould you like to go to the login page?')) {
      window.location.href = '/Login/signin.html';
    } else {
      window.location.href = '/HomePage/HomePageHotels.html';
    }
  }
}

function loadHotelData() {
  const params = new URLSearchParams(window.location.search);
  
  // Get parameters from URL
  const hotelId = params.get('hotel');
  const hotelName = params.get('name');
  const location = params.get('location');
  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  const rooms = params.get('rooms');
  const guests = params.get('guests');
  const pricePerNight = params.get('price');
  const rating = params.get('rating');
  const image = params.get('image');
  const amenities = params.get('amenities');
  
  if (!hotelId || !checkIn || !checkOut) {
    alert('⚠️ Missing booking information. Redirecting to hotels page...');
    window.location.href = '/HomePage/HomePageHotels.html';
    return;
  }
  
  // Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
  // Store hotel data
  hotelData = {
    hotelId,
    hotelName: decodeURIComponent(hotelName || 'Hotel'),
    location: decodeURIComponent(location || 'Location'),
    checkIn,
    checkOut,
    pricePerNight: parseFloat(pricePerNight) || 500,
    rating: parseFloat(rating) || 5.0,
    image: image || '../../HomePage/Photos/logo.jpg',
    amenities: amenities ? decodeURIComponent(amenities).split(',') : []
  };
  
  roomCount = parseInt(rooms) || 1;
  guestCount = parseInt(guests) || 2;
  
  // Update display
  displayHotelInfo();
  updateSummary();
}

function displayHotelInfo() {
  if (!hotelData) return;
  
  // Hotel details
  document.getElementById('hotelName').textContent = hotelData.hotelName;
  document.getElementById('hotelLocation').textContent = hotelData.location;
  document.getElementById('hotelRating').textContent = hotelData.rating.toFixed(1);
  document.getElementById('hotelImage').src = hotelData.image;
  document.getElementById('hotelImage').alt = hotelData.hotelName;
  
  // Dates
  const checkInDate = new Date(hotelData.checkIn);
  const checkOutDate = new Date(hotelData.checkOut);
  
  document.getElementById('checkInDate').textContent = checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('checkOutDate').textContent = checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('nightsCount').textContent = numberOfNights + ' night' + (numberOfNights > 1 ? 's' : '');
  
  // Counts
  document.getElementById('roomCount').textContent = roomCount;
  document.getElementById('guestCount').textContent = guestCount;
  document.getElementById('pricePerNight').textContent = hotelData.pricePerNight.toFixed(2) + ' SAR';
  
  document.getElementById('roomCountInput').value = roomCount;
  document.getElementById('guestCountInput').value = guestCount;
  
  // Amenities
  if (hotelData.amenities && hotelData.amenities.length > 0) {
    const amenitiesList = document.getElementById('amenitiesList');
    amenitiesList.innerHTML = '<div class="amenities-title">Amenities:</div>';
    hotelData.amenities.forEach(amenity => {
      const amenityItem = document.createElement('span');
      amenityItem.className = 'amenity-badge';
      amenityItem.innerHTML = `<i class="fas fa-check"></i> ${amenity.trim()}`;
      amenitiesList.appendChild(amenityItem);
    });
  }
}

function updateSummary() {
  if (!hotelData) return;
  
  // Summary info
  document.getElementById('summaryHotelName').textContent = hotelData.hotelName;
  document.getElementById('summaryHotelLocation').textContent = hotelData.location;
  
  const checkInDate = new Date(hotelData.checkIn);
  const checkOutDate = new Date(hotelData.checkOut);
  
  document.getElementById('summaryCheckIn').textContent = checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  document.getElementById('summaryCheckOut').textContent = checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  document.getElementById('summaryNights').textContent = numberOfNights;
  document.getElementById('summaryRooms').textContent = roomCount;
  document.getElementById('summaryGuests').textContent = guestCount;
  
  // Pricing
  const roomRate = hotelData.pricePerNight * numberOfNights * roomCount;
  const taxesFees = roomRate * 0.15; // 15% taxes and fees
  totalPrice = roomRate + taxesFees;
  
  document.getElementById('roomRate').textContent = roomRate.toFixed(2) + ' SAR';
  document.getElementById('taxesFees').textContent = taxesFees.toFixed(2) + ' SAR';
  document.getElementById('totalAmount').textContent = totalPrice.toFixed(2) + ' SAR';
}

// Room and guest counters
function incrementRooms() {
  if (roomCount < 10) {
    roomCount++;
    document.getElementById('roomCountInput').value = roomCount;
    document.getElementById('roomCount').textContent = roomCount;
    updateSummary();
  }
}

function decrementRooms() {
  if (roomCount > 1) {
    roomCount--;
    document.getElementById('roomCountInput').value = roomCount;
    document.getElementById('roomCount').textContent = roomCount;
    updateSummary();
  }
}

function incrementGuests() {
  if (guestCount < 20) {
    guestCount++;
    document.getElementById('guestCountInput').value = guestCount;
    document.getElementById('guestCount').textContent = guestCount;
    updateSummary();
  }
}

function decrementGuests() {
  if (guestCount > 1) {
    guestCount--;
    document.getElementById('guestCountInput').value = guestCount;
    document.getElementById('guestCount').textContent = guestCount;
    updateSummary();
  }
}

// Step navigation
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all progress steps
  document.querySelectorAll('.progress-steps .step').forEach(s => {
    s.classList.remove('active');
  });
  
  // Show target step
  document.getElementById(`step${step}`).classList.add('active');
  
  // Update progress indicator
  for (let i = 1; i <= step; i++) {
    document.querySelector(`.progress-steps .step[data-step="${i}"]`).classList.add('active');
  }
  
  currentStep = step;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateAndGoToStep(step) {
  if (step === 3) {
    // Validate guest information
    const firstName = document.getElementById('guestFirstName');
    const lastName = document.getElementById('guestLastName');
    const email = document.getElementById('guestEmail');
    const phone = document.getElementById('guestPhone');
    
    let isValid = true;
    let firstInvalidField = null;
    
    if (!firstName.value.trim()) {
      firstName.style.borderColor = '#dc3545';
      if (!firstInvalidField) firstInvalidField = firstName;
      isValid = false;
    } else {
      firstName.style.borderColor = '';
    }
    
    if (!lastName.value.trim()) {
      lastName.style.borderColor = '#dc3545';
      if (!firstInvalidField) firstInvalidField = lastName;
      isValid = false;
    } else {
      lastName.style.borderColor = '';
    }
    
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
  
  const paymentMethod = 'card';
  console.log('💳 Payment method:', paymentMethod);
  
  // Validate card payment
  console.log('✅ Validating card payment');
  
  const cardNumberInput = document.getElementById('cardNumber');
  const cardNameInput = document.getElementById('cardName');
  const expMonth = document.getElementById('expMonth');
  const expYear = document.getElementById('expYear');
  const cardCvvInput = document.getElementById('cardCvv');
  
  if (!cardNumberInput || !cardNameInput || !expMonth || !expYear || !cardCvvInput) {
    console.error('❌ Some card form fields are missing');
    alert('⚠️ Payment form error. Please refresh the page.');
    return;
  }
  
  const cardNumber = cardNumberInput.value.replace(/\s/g, '');
  const cardName = cardNameInput.value.trim();
  const cardCvv = cardCvvInput.value;
  
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
  
  if (!expMonth.value || expMonth.value === '') {
    alert('⚠️ Please select expiration month');
    expMonth.focus();
    return;
  }
  
  if (!expYear.value || expYear.value === '') {
    alert('⚠️ Please select expiration year');
    expYear.focus();
    return;
  }
  
  // Validate expiry date
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
  
  // Get the pay button
  const payButton = document.querySelector('.btn-pay');
  const originalText = payButton.innerHTML;
  
  // Show processing state
  payButton.disabled = true;
  payButton.innerHTML = '⏳ Processing Payment...';
  payButton.style.opacity = '0.6';
  payButton.style.cursor = 'not-allowed';
  
  // Simulate payment processing
  setTimeout(async () => {
    try {
      console.log('💰 Payment processing completed');
      
      // Generate unique booking reference
      bookingReference = 'GT-HTL-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
      console.log('📝 Booking reference:', bookingReference);
      
      // Save booking (now async)
      console.log('💾 Saving booking...');
      await saveBooking();
      console.log('✅ Booking saved');
      
      // Display confirmation
      console.log('📋 Displaying confirmation...');
      displayConfirmation();
      console.log('✅ Confirmation displayed');
      
      // Go to confirmation step
      console.log('➡️ Moving to step 4...');
      goToStep(4);
      
      // Reset button
      payButton.disabled = false;
      payButton.innerHTML = originalText;
      payButton.style.opacity = '1';
      payButton.style.cursor = 'pointer';
      
      console.log('✅ Payment processed successfully!');
      console.log('🎉 Booking Reference:', bookingReference);
      
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      alert('⚠️ Error processing payment: ' + error.message + '\n\nPlease try again.');
      
      payButton.disabled = false;
      payButton.innerHTML = originalText;
      payButton.style.opacity = '1';
      payButton.style.cursor = 'pointer';
    }
  }, 2500);
}

async function saveBooking() {
  const booking = {
    reference: bookingReference,
    type: 'hotel',
    hotel: hotelData,
    rooms: roomCount,
    guests: guestCount,
    nights: numberOfNights,
    checkIn: hotelData.checkIn,
    checkOut: hotelData.checkOut,
    guestInfo: {
      firstName: document.getElementById('guestFirstName').value,
      lastName: document.getElementById('guestLastName').value,
      email: document.getElementById('guestEmail').value,
      phone: document.getElementById('guestPhone').value,
      specialRequests: document.getElementById('specialRequests').value
    },
    totalPrice: totalPrice,
    paymentMethod: 'card',
    bookingDate: new Date().toISOString(),
    status: 'confirmed',
    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user_id : null
  };
  
  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('hotelBookings', JSON.stringify(bookings));
  localStorage.setItem('lastHotelBooking', JSON.stringify(booking));
  
  console.log('Booking saved to localStorage:', booking);
  
  // Save to backend database
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('💾 Saving booking to database...');
      
      const response = await fetch('http://localhost:3000/api/bookings/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hotel_id: hotelData.hotelId,
          check_in_date: hotelData.checkIn,
          check_out_date: hotelData.checkOut,
          number_of_rooms: roomCount,
          number_of_guests: guestCount,
          total_price: totalPrice
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Booking saved to database successfully:', result.data);
        // Store the database booking ID
        booking.databaseBookingId = result.data.booking.booking_id;
        localStorage.setItem('lastHotelBooking', JSON.stringify(booking));
      } else {
        console.error('⚠️ Failed to save to database:', result.message);
      }
    } else {
      console.log('⚠️ No auth token, skipping database save');
    }
  } catch (error) {
    console.error('❌ Error saving to database:', error);
  }
}

function displayConfirmation() {
  document.getElementById('bookingReference').textContent = bookingReference;
  
  const checkInDate = new Date(hotelData.checkIn);
  const checkOutDate = new Date(hotelData.checkOut);
  
  const confirmationHTML = `
    <div class="confirmation-hotel-card">
      <h3>${hotelData.hotelName}</h3>
      <p><i class="fas fa-map-marker-alt"></i> ${hotelData.location}</p>
      <div class="confirmation-dates">
        <div class="conf-date">
          <strong>Check-in:</strong> ${checkInDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <div class="conf-date">
          <strong>Check-out:</strong> ${checkOutDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
      <div class="confirmation-info">
        <p><strong>Rooms:</strong> ${roomCount}</p>
        <p><strong>Guests:</strong> ${guestCount}</p>
        <p><strong>Nights:</strong> ${numberOfNights}</p>
        <p><strong>Total Paid:</strong> ${totalPrice.toFixed(2)} SAR</p>
      </div>
    </div>
  `;
  
  document.getElementById('confirmationDetails').innerHTML = confirmationHTML;
}

function downloadConfirmation() {
  const booking = JSON.parse(localStorage.getItem('lastHotelBooking'));
  if (!booking) {
    alert('❌ Booking information not found');
    return;
  }
  
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  
  const confirmationText = `
═══════════════════════════════════════════════════════
              GOTRIP HOTEL BOOKING CONFIRMATION
═══════════════════════════════════════════════════════

Confirmation Number: ${booking.reference}
Booking Date: ${new Date(booking.bookingDate).toLocaleString()}

═══════════════════════════════════════════════════════
                      HOTEL DETAILS
═══════════════════════════════════════════════════════

Hotel: ${booking.hotel.hotelName}
Location: ${booking.hotel.location}
Rating: ${booking.hotel.rating} ⭐

Check-in: ${checkInDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
Check-out: ${checkOutDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}

Number of Nights: ${booking.nights}
Number of Rooms: ${booking.rooms}
Number of Guests: ${booking.guests}

═══════════════════════════════════════════════════════
                      GUEST INFORMATION
═══════════════════════════════════════════════════════

Name: ${booking.guestInfo.firstName} ${booking.guestInfo.lastName}
Email: ${booking.guestInfo.email}
Phone: ${booking.guestInfo.phone}
${booking.guestInfo.specialRequests ? 'Special Requests: ' + booking.guestInfo.specialRequests : ''}

═══════════════════════════════════════════════════════
                   PAYMENT INFORMATION
═══════════════════════════════════════════════════════

Total Amount Paid: ${booking.totalPrice.toFixed(2)} SAR
Payment Method: Credit Card
Payment Status: PAID ✓

═══════════════════════════════════════════════════════
                   IMPORTANT INFORMATION
═══════════════════════════════════════════════════════

✓ Check-in time: 3:00 PM
✓ Check-out time: 12:00 PM
✓ Please bring a valid ID and this confirmation
✓ Free cancellation up to 24 hours before check-in
✓ For support, contact: support@gotrip.com

═══════════════════════════════════════════════════════
          Thank you for choosing GoTrip!
═══════════════════════════════════════════════════════
  `;
  
  const blob = new Blob([confirmationText], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GoTrip_Hotel_Confirmation_${booking.reference}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  setTimeout(() => {
    alert('✅ Your confirmation has been downloaded!\n\nPlease check your Downloads folder.');
  }, 300);
}

// User navigation
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    window.location.href = '/Login/signin.html';
  }
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

// ===== 3D CARD INTERACTIVE PAYMENT =====
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
  
  cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
    
    if (formattedValue) {
      cardNumberDisplay.textContent = formattedValue;
    } else {
      cardNumberDisplay.textContent = '#### #### #### ####';
    }
    
    const cardType = detectCardType(value);
    if (cardType && cardLogos[cardType]) {
      cardLogo.innerHTML = cardLogos[cardType];
    } else {
      cardLogo.innerHTML = '';
    }
  });
  
  cardNameInput.addEventListener('input', function(e) {
    const value = e.target.value;
    if (value) {
      cardHolderDisplay.textContent = value.toUpperCase();
    } else {
      cardHolderDisplay.textContent = 'Full Name';
    }
  });
  
  function updateExpiry() {
    const month = expMonthSelect.value || '01';
    const year = expYearSelect.value || '25';
    cardExpiryDisplay.textContent = `${month} / ${year}`;
  }
  
  expMonthSelect.addEventListener('change', updateExpiry);
  expYearSelect.addEventListener('change', updateExpiry);
  
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
const originalGoToStep = goToStep;
window.goToStep = function(step) {
  originalGoToStep(step);
  if (step === 3) {
    setTimeout(init3DCard, 100);
  }
};

// Make functions global
window.incrementRooms = incrementRooms;
window.decrementRooms = decrementRooms;
window.incrementGuests = incrementGuests;
window.decrementGuests = decrementGuests;
window.validateAndGoToStep = validateAndGoToStep;
window.processPayment = processPayment;
window.downloadConfirmation = downloadConfirmation;
window.logout = logout;
window.goToProfile = goToProfile;
window.goToBookings = goToBookings;
window.goToSettings = goToSettings;
