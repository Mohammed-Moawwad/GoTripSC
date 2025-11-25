// Get all elements
const cardNumberInput = document.getElementById('card-number');
const cardHolderInput = document.getElementById('card-holder');
const expMonthSelect = document.getElementById('exp-month');
const expYearSelect = document.getElementById('exp-year');
const cvvInput = document.getElementById('cvv');

const cardNumberDisplay = document.getElementById('card-number-display');
const cardHolderDisplay = document.getElementById('card-holder-display');
const cardExpiryDisplay = document.getElementById('card-expiry-display');
const cardCvvDisplay = document.getElementById('card-cvv-display');
const cardLogo = document.getElementById('card-logo');

const card = document.getElementById('card');
const form = document.getElementById('payment-form');

// Function to detect card type
function detectCardType(number) {
    const cleaned = number.replace(/\s/g, '');
    
    // Visa: starts with 4
    if (/^4/.test(cleaned)) {
        return 'visa';
    }
    // Mastercard: starts with 51-55 or 2221-2720
    if (/^5[1-5]/.test(cleaned) || /^2(2[2-9]|[3-6]|7[0-1]|720)/.test(cleaned)) {
        return 'mastercard';
    }
    // American Express: starts with 34 or 37
    if (/^3[47]/.test(cleaned)) {
        return 'amex';
    }
    // Discover: starts with 6011, 622126-622925, 644-649, or 65
    if (/^6011|^64[4-9]|^65/.test(cleaned)) {
        return 'discover';
    }
    // Diners Club: starts with 36 or 38 or 300-305
    if (/^3[068]|^30[0-5]/.test(cleaned)) {
        return 'diners';
    }
    // JCB: starts with 35
    if (/^35/.test(cleaned)) {
        return 'jcb';
    }
    // UnionPay: starts with 62
    if (/^62/.test(cleaned)) {
        return 'unionpay';
    }
    
    return null;
}

// Card logos SVG
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
    </svg>`,
    
    diners: `<svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="white" opacity="0.9"/>
        <circle cx="16" cy="16" r="6" fill="none" stroke="#0079BE" stroke-width="2"/>
        <circle cx="32" cy="16" r="6" fill="none" stroke="#0079BE" stroke-width="2"/>
        <text x="24" y="26" font-family="Arial,sans-serif" font-size="5" font-weight="bold" fill="#0079BE" text-anchor="middle">DINERS</text>
    </svg>`,
    
    jcb: `<svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="white" opacity="0.9"/>
        <rect x="8" y="8" width="10" height="16" rx="2" fill="#0E4C96"/>
        <rect x="19" y="8" width="10" height="16" rx="2" fill="#CC0000"/>
        <rect x="30" y="8" width="10" height="16" rx="2" fill="#339900"/>
        <text x="24" y="28" font-family="Arial,sans-serif" font-size="5" font-weight="bold" fill="#0E4C96" text-anchor="middle">JCB</text>
    </svg>`,
    
    unionpay: `<svg viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="white" opacity="0.9"/>
        <rect x="8" y="10" width="32" height="12" fill="#E21836"/>
        <circle cx="20" cy="16" r="4" fill="#00447C"/>
        <circle cx="28" cy="16" r="4" fill="#007B84"/>
    </svg>`
};

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
cardHolderInput.addEventListener('input', function(e) {
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
    const year = expYearSelect.value || '21';
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

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cardNum = cardNumberInput.value.replace(/\s/g, '');
    const holder = cardHolderInput.value.trim();
    const month = expMonthSelect.value;
    const year = expYearSelect.value;
    const cvv = cvvInput.value;
    
    // Validation
    if (cardNum.length < 16) {
        alert('❌ Please enter a valid card number (16 digits)');
        cardNumberInput.focus();
        return;
    }
    
    if (!holder) {
        alert('❌ Please enter cardholder name');
        cardHolderInput.focus();
        return;
    }
    
    if (!month || month === '') {
        alert('❌ Please select expiry month');
        expMonthSelect.focus();
        return;
    }
    
    if (!year || year === '') {
        alert('❌ Please select expiry year');
        expYearSelect.focus();
        return;
    }
    
    if (cvv.length !== 3) {
        alert('❌ Please enter a valid CVV (3 digits)');
        cvvInput.focus();
        return;
    }
    
    // Success
    alert('✅ Payment submitted successfully!\n\nCard Number: ' + cardNumberInput.value + '\nCardholder: ' + holder);
});