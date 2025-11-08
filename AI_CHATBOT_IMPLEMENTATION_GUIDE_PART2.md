# 🤖 AI-Powered Hotel Chatbot Implementation Guide - PART 2

**Frontend Implementation & Integration**

---

<a name="phase-5"></a>

## 🎨 PHASE 5: Frontend Chatbot UI

**Estimated Time:** 6-7 hours  
**Goal:** Create beautiful, interactive chatbot interface

### Step 5.1: Create Chatbot Directory Structure

```powershell
# Create directories
mkdir public\chatbot
```

Your structure:

```
public/
└── chatbot/
    ├── chatbot.html      # Main chatbot page
    ├── chatbot.css       # Styling
    └── chatbot.js        # Frontend logic
```

### Step 5.2: Create Chatbot HTML

Create: `public/chatbot/chatbot.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GoTrip AI Assistant</title>
    <link rel="stylesheet" href="chatbot.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Main Container -->
    <div class="chatbot-container">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="header-content">
          <div class="bot-avatar">🤖</div>
          <div class="header-text">
            <h2>GoTrip AI Assistant</h2>
            <p class="status online">
              <span class="status-dot"></span>
              Online
            </p>
          </div>
        </div>
        <button class="minimize-btn" id="minimizeBtn" title="Minimize">
          −
        </button>
      </div>

      <!-- Suggestions Pills (shown at start) -->
      <div class="suggestions-container" id="suggestionsContainer">
        <h3>Try asking me...</h3>
        <div class="suggestion-pills">
          <button
            class="suggestion-pill"
            data-query="Find hotels near Al-Haram under 600 SAR"
          >
            🕌 Hotels near Al-Haram
          </button>
          <button
            class="suggestion-pill"
            data-query="Show me luxury hotels in Dubai"
          >
            ✨ Luxury hotels in Dubai
          </button>
          <button
            class="suggestion-pill"
            data-query="Cheapest hotels in Riyadh with WiFi"
          >
            💰 Budget hotels in Riyadh
          </button>
          <button
            class="suggestion-pill"
            data-query="Best rated hotels in Jeddah"
          >
            ⭐ Top rated in Jeddah
          </button>
          <button
            class="suggestion-pill"
            data-query="Hotels in Makkah with pool and spa"
          >
            🏊 Hotels with pool & spa
          </button>
        </div>
      </div>

      <!-- Chat Messages Area -->
      <div class="chat-messages" id="chatMessages">
        <div class="welcome-message">
          <div class="bot-avatar-large">🤖</div>
          <h3>Welcome to GoTrip AI!</h3>
          <p>
            I can help you find the perfect hotel. Just tell me what you're
            looking for!
          </p>
          <p class="example-text">
            For example: "Find hotels near Al-Haram under 600 SAR"
          </p>
        </div>
      </div>

      <!-- Typing Indicator (hidden by default) -->
      <div class="typing-indicator" id="typingIndicator" style="display: none;">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="typing-text">AI is thinking...</span>
      </div>

      <!-- Input Area -->
      <div class="chat-input-container">
        <div class="input-wrapper">
          <textarea
            id="userInput"
            placeholder="Ask me anything about hotels..."
            rows="1"
            maxlength="500"
          ></textarea>
          <button class="send-btn" id="sendBtn" title="Send message">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <div class="input-footer">
          <span class="char-count" id="charCount">0/500</span>
          <span class="powered-by">Powered by GoTrip AI</span>
        </div>
      </div>
    </div>

    <!-- Scripts -->
    <script src="chatbot.js"></script>
  </body>
</html>
```

### Step 5.3: Create Chatbot CSS

Create: `public/chatbot/chatbot.css`

```css
/* ====================================
   GoTrip AI Chatbot Styles
   ==================================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* ====================================
   Main Container
   ==================================== */

.chatbot-container {
  width: 100%;
  max-width: 500px;
  height: 700px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====================================
   Header
   ==================================== */

.chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(10px);
}

.header-text h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.status {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.minimize-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* ====================================
   Suggestions
   ==================================== */

.suggestions-container {
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.suggestions-container h3 {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 500;
}

.suggestion-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-pill {
  background: white;
  border: 1.5px solid #e2e8f0;
  color: #334155;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.suggestion-pill:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* ====================================
   Chat Messages
   ==================================== */

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Welcome Message */
.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.bot-avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.welcome-message h3 {
  color: #1e293b;
  font-size: 22px;
  margin-bottom: 12px;
}

.welcome-message p {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.example-text {
  color: #94a3b8;
  font-size: 13px;
  font-style: italic;
}

/* Message Bubbles */
.message {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message.bot .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.bot .message-bubble {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
  padding: 0 16px;
}

/* Hotel Cards */
.hotel-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  width: 100%;
}

.hotel-card {
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hotel-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.hotel-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.hotel-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.hotel-card-location {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.hotel-card-rating {
  background: #fef3c7;
  color: #d97706;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.hotel-card-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 12px 0;
}

.hotel-detail-item {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.hotel-detail-item strong {
  color: #1e293b;
}

.hotel-card-amenities {
  font-size: 12px;
  color: #64748b;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.hotel-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.hotel-price {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.hotel-price-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
}

.view-details-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* ====================================
   Typing Indicator
   ==================================== */

.typing-indicator {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.typing-text {
  font-size: 13px;
  color: #64748b;
  font-style: italic;
}

/* ====================================
   Input Area
   ==================================== */

.chat-input-container {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #667eea;
  background: white;
}

#userInput {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  max-height: 100px;
  color: #1e293b;
}

#userInput::placeholder {
  color: #94a3b8;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 11px;
  color: #94a3b8;
}

.char-count {
  font-weight: 500;
}

.powered-by {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ====================================
   Responsive Design
   ==================================== */

@media (max-width: 600px) {
  body {
    padding: 0;
  }

  .chatbot-container {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .hotel-card-details {
    grid-template-columns: 1fr;
  }
}

/* ====================================
   Utility Classes
   ==================================== */

.hidden {
  display: none !important;
}

.fade-out {
  animation: fadeOut 0.3s ease-out forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

### Step 5.4: Create Chatbot JavaScript

Create: `public/chatbot/chatbot.js`

```javascript
// ====================================
// GoTrip AI Chatbot - Frontend Logic
// ====================================

// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const suggestionsContainer = document.getElementById("suggestionsContainer");
const charCount = document.getElementById("charCount");
const minimizeBtn = document.getElementById("minimizeBtn");

// Configuration
const API_BASE_URL = window.location.origin; // http://localhost:3000
const CHATBOT_API = `${API_BASE_URL}/api/chatbot`;

// State
let isProcessing = false;
let messageHistory = [];

// ====================================
// Initialization
// ====================================

document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  loadSuggestions();
  displayWelcomeMessage();
});

function initializeEventListeners() {
  // Send button click
  sendBtn.addEventListener("click", handleSendMessage);

  // Enter key to send (Shift+Enter for new line)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Character count
  userInput.addEventListener("input", () => {
    const length = userInput.value.length;
    charCount.textContent = `${length}/500`;

    // Auto-resize textarea
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
  });

  // Suggestion pills click
  document.querySelectorAll(".suggestion-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const query = pill.getAttribute("data-query");
      userInput.value = query;
      handleSendMessage();
    });
  });

  // Minimize button
  minimizeBtn.addEventListener("click", () => {
    window.close(); // If opened as popup
    // Or redirect to main page
    // window.location.href = '/';
  });
}

// ====================================
// Message Handling
// ====================================

async function handleSendMessage() {
  const message = userInput.value.trim();

  if (!message || isProcessing) {
    return;
  }

  // Hide suggestions after first message
  if (suggestionsContainer) {
    suggestionsContainer.classList.add("fade-out");
    setTimeout(() => {
      suggestionsContainer.remove();
    }, 300);
  }

  // Display user message
  displayUserMessage(message);

  // Clear input
  userInput.value = "";
  userInput.style.height = "auto";
  charCount.textContent = "0/500";

  // Show typing indicator
  showTypingIndicator();

  // Send to API
  isProcessing = true;
  sendBtn.disabled = true;

  try {
    const response = await fetch(`${CHATBOT_API}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Hide typing indicator
    hideTypingIndicator();

    if (data.success) {
      // Display bot response
      displayBotMessage(data.message);

      // Display hotel cards if any
      if (data.hotels && data.hotels.length > 0) {
        setTimeout(() => {
          displayHotelCards(data.hotels);
        }, 300);
      }

      // Store in history
      messageHistory.push({
        user: message,
        bot: data.message,
        hotels: data.hotels || [],
        timestamp: new Date(),
      });
    } else {
      displayBotMessage(
        "I'm sorry, I encountered an error. Please try again or rephrase your question."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    hideTypingIndicator();
    displayBotMessage(
      "Sorry, I had trouble connecting. Please check your internet and try again."
    );
  } finally {
    isProcessing = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// ====================================
// Display Functions
// ====================================

function displayUserMessage(message) {
  const messageEl = document.createElement("div");
  messageEl.className = "message user";

  messageEl.innerHTML = `
    <div class="message-avatar">👤</div>
    <div class="message-content">
      <div class="message-bubble">${escapeHtml(message)}</div>
      <div class="message-time">${getCurrentTime()}</div>
    </div>
  `;

  // Remove welcome message if exists
  const welcome = chatMessages.querySelector(".welcome-message");
  if (welcome) {
    welcome.remove();
  }

  chatMessages.appendChild(messageEl);
  scrollToBottom();
}

function displayBotMessage(message) {
  const messageEl = document.createElement("div");
  messageEl.className = "message bot";

  // Format message (preserve line breaks)
  const formattedMessage = message.replace(/\n/g, "<br>");

  messageEl.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <div class="message-bubble">${formattedMessage}</div>
      <div class="message-time">${getCurrentTime()}</div>
    </div>
  `;

  chatMessages.appendChild(messageEl);
  scrollToBottom();
}

function displayHotelCards(hotels) {
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "hotel-cards-container";

  hotels.forEach((hotel) => {
    const card = createHotelCard(hotel);
    cardsContainer.appendChild(card);
  });

  chatMessages.appendChild(cardsContainer);
  scrollToBottom();
}

function createHotelCard(hotel) {
  const card = document.createElement("div");
  card.className = "hotel-card";

  const amenitiesList = hotel.amenities
    ? hotel.amenities.split(",").slice(0, 4).join(" • ")
    : "No amenities listed";

  card.innerHTML = `
    <div class="hotel-card-header">
      <div>
        <div class="hotel-card-title">${escapeHtml(hotel.hotel_name)}</div>
        <div class="hotel-card-location">
          📍 ${escapeHtml(hotel.location)}, ${escapeHtml(hotel.city)}
        </div>
      </div>
      <div class="hotel-card-rating">
        ⭐ ${hotel.rating}
      </div>
    </div>

    <div class="hotel-card-details">
      ${
        hotel.distance_km
          ? `
        <div class="hotel-detail-item">
          📏 <strong>${hotel.distance_km} km</strong> away
        </div>
      `
          : ""
      }
      <div class="hotel-detail-item">
        🛏️ <strong>${hotel.available_rooms}</strong> rooms available
      </div>
    </div>

    <div class="hotel-card-amenities">
      ${amenitiesList}
    </div>

    <div class="hotel-card-footer">
      <div class="hotel-price">
        ${
          hotel.price_per_night
        } <span class="hotel-price-label">SAR/night</span>
      </div>
      <button class="view-details-btn" onclick="viewHotelDetails('${
        hotel.hotel_id
      }')">
        View Details
      </button>
    </div>
  `;

  return card;
}

function displayWelcomeMessage() {
  // Welcome message is already in HTML
  // This function can be used to show it again if needed
}

// ====================================
// Utility Functions
// ====================================

function showTypingIndicator() {
  typingIndicator.style.display = "flex";
  scrollToBottom();
}

function hideTypingIndicator() {
  typingIndicator.style.display = "none";
}

function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function loadSuggestions() {
  // Suggestions are hardcoded in HTML
  // Can fetch from API if needed
  try {
    const response = await fetch(`${CHATBOT_API}/suggestions`);
    const data = await response.json();

    if (data.success && data.suggestions) {
      // Update suggestion pills dynamically
      console.log("Loaded suggestions:", data.suggestions);
    }
  } catch (error) {
    console.log("Using default suggestions");
  }
}

function viewHotelDetails(hotelId) {
  // Open hotel details page (you need to create this)
  window.open(`/Services/Hotels/HotelsPage.html?hotel=${hotelId}`, "_blank");

  // Or show in modal
  // showHotelModal(hotelId);
}

async function showHotelModal(hotelId) {
  try {
    const response = await fetch(`${CHATBOT_API}/hotel/${hotelId}/reviews`);
    const data = await response.json();

    if (data.success) {
      // Display modal with hotel details and reviews
      console.log("Hotel details:", data);
      // Implement modal UI here
    }
  } catch (error) {
    console.error("Error loading hotel details:", error);
  }
}

// ====================================
// Export for testing
// ====================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    handleSendMessage,
    displayUserMessage,
    displayBotMessage,
  };
}
```

---

<a name="phase-6"></a>

## 🔗 PHASE 6: Integration & Testing

**Estimated Time:** 4-5 hours  
**Goal:** Integrate chatbot with main website and test

### Step 6.1: Add Chatbot Button to HomePage

Update: `HomePage/HomePage.html`

Add this before the closing `</body>` tag:

```html
<!-- Floating AI Chatbot Button -->
<button
  id="ai-chatbot-btn"
  class="floating-chat-btn"
  title="Chat with AI Assistant"
>
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
    ></path>
  </svg>
  <span class="chat-btn-text">AI Assistant</span>
</button>

<style>
  .floating-chat-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    animation: float 3s ease-in-out infinite;
  }

  .floating-chat-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .floating-chat-btn svg {
    stroke-width: 2.5;
  }

  @media (max-width: 768px) {
    .floating-chat-btn {
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      font-size: 14px;
    }

    .chat-btn-text {
      display: none;
    }

    .floating-chat-btn {
      width: 60px;
      height: 60px;
      padding: 0;
      justify-content: center;
      border-radius: 50%;
    }
  }
</style>

<script>
  document.getElementById("ai-chatbot-btn").addEventListener("click", () => {
    // Option 1: Open in new window (popup)
    window.open(
      "/chatbot/chatbot.html",
      "AI Assistant",
      "width=500,height=700,resizable=yes,scrollbars=no"
    );

    // Option 2: Open in same tab
    // window.location.href = '/chatbot/chatbot.html';

    // Option 3: Open in new tab
    // window.open('/chatbot/chatbot.html', '_blank');
  });
</script>
```

### Step 6.2: Test Complete Flow

**Test Checklist:**

```powershell
# 1. Start the server
npm start

# 2. Open browser
start http://localhost:3000

# 3. Test scenarios
```

**Test Cases:**

1. **Location Search**

   - "Find hotels in Riyadh"
   - "Hotels near Al-Haram"
   - "Show me hotels in Dubai"

2. **Price Filtering**

   - "Hotels under 600 SAR"
   - "Luxury hotels above 700 SAR"
   - "Hotels between 400 and 600 SAR"

3. **Amenities**

   - "Hotels with WiFi"
   - "Hotels with pool and spa"
   - "Hotels with gym"

4. **Combined Queries**

   - "Find hotels near Al-Haram under 600 SAR"
   - "Show me luxury hotels in Dubai with WiFi"
   - "Cheapest hotels in Riyadh with pool"

5. **Recommendations**
   - "Recommend hotels in Jeddah"
   - "Best hotels in Makkah"
   - "Top rated hotels"

### Step 6.3: Create Comprehensive Test Script

Create: `test-complete-chatbot.js`

```javascript
require("dotenv").config();

const testCases = [
  {
    name: "Location - Landmark",
    query: "Find hotels near Al-Haram under 600 SAR",
    expectedFilters: ["location", "priceRange"],
  },
  {
    name: "Location - City",
    query: "Show me luxury hotels in Dubai",
    expectedFilters: ["location", "intent"],
  },
  {
    name: "Price Only",
    query: "Hotels under 500 SAR",
    expectedFilters: ["priceRange"],
  },
  {
    name: "Amenities",
    query: "Hotels with WiFi and pool in Riyadh",
    expectedFilters: ["location", "amenities"],
  },
  {
    name: "Rating",
    query: "4-star hotels in Jeddah",
    expectedFilters: ["location", "rating"],
  },
  {
    name: "Combined",
    query: "Recommend hotels in Makkah under 700 SAR with spa",
    expectedFilters: ["location", "priceRange", "amenities", "intent"],
  },
];

async function runTests() {
  console.log("🧪 Running Comprehensive Chatbot Tests\n");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log(`Query: "${testCase.query}"`);

    try {
      const response = await fetch("http://localhost:3000/api/chatbot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testCase.query }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✅ Success: ${data.message.split("\n")[0]}`);
        console.log(`   Hotels found: ${data.totalResults}`);
        console.log(`   Understood:`, data.queryUnderstood);

        if (data.hotels && data.hotels.length > 0) {
          console.log(`   Top hotel: ${data.hotels[0].hotel_name}`);
        }

        passed++;
      } else {
        console.log(`❌ Failed: ${data.message}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      failed++;
    }

    console.log("-".repeat(60));
  }

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}/${testCases.length}`);
  console.log(`❌ Failed: ${failed}/${testCases.length}`);
  console.log(
    `Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`
  );
}

console.log("⚠️  Make sure the server is running: npm start\n");
setTimeout(runTests, 1000);
```

Run:

```powershell
node test-complete-chatbot.js
```

---

<a name="demo-scenarios"></a>

## 🎬 PHASE 7: Demo Scenarios for Presentation

**For Your AI Course Presentation**

### Scenario 1: Basic Search

```
User: "Find hotels in Riyadh"
AI: Shows all Riyadh hotels sorted by rating
Demo: Shows NLP extracted "Riyadh" as location
```

### Scenario 2: Landmark Proximity

```
User: "Hotels near Al-Haram under 600 SAR"
AI: Shows hotels in Makkah within 10km, filtered by price
Demo: Shows geolocation calculation (distance in km)
```

### Scenario 3: Fuzzy Matching

```
User: "Hotels in Jedah with pool" (typo: Jedah)
AI: Understands "Jeddah" and shows hotels with pool
Demo: Shows fuzzy matching score (Jedah → Jeddah)
```

### Scenario 4: Complex Query

```
User: "Recommend luxury 5-star hotels in Dubai with spa and WiFi"
AI: Shows Dubai hotels with rating ≥4.5, filtered by amenities, sorted by value
Demo: Shows all extracted filters (location, rating, amenities, intent)
```

### Scenario 5: Review Sentiment

```
User: Click "View Details" on any hotel
AI: Shows review summary with sentiment analysis
Demo: Positive/negative themes extracted from reviews
```

---

<a name="troubleshooting"></a>

## 🔧 Troubleshooting

### Common Issues

**1. "Cannot find module 'natural'"**

```powershell
npm install natural compromise sentiment fuzzball geolib stopword string-similarity
```

**2. "TypeError: db.query is not a function"**

- Check database.js exports pool with promise() wrapper
- Ensure you're using await with db.query()

**3. "CORS Error in Browser"**

- Verify server.js has CORS middleware
- Check API_BASE_URL in chatbot.js

**4. "Hotels not showing distance"**

- Run database update to add latitude/longitude
- Check LANDMARKS object has correct coordinates

**5. "Chatbot button not appearing"**

- Check if code is added before </body> tag
- Verify CSS z-index is high (1000+)

**6. "Typing indicator stays forever"**

- Check hideTypingIndicator() is called in catch block
- Verify API is responding within timeout

---

## 📚 Additional Features (Optional)

### Feature 1: Voice Input

```javascript
// Add to chatbot.js
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();

function startVoiceInput() {
  recognition.start();
}

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  userInput.value = transcript;
  handleSendMessage();
};
```

### Feature 2: Export Chat History

```javascript
function exportChatHistory() {
  const data = JSON.stringify(messageHistory, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-history-${Date.now()}.json`;
  a.click();
}
```

### Feature 3: Multi-language Support

```javascript
// Use Google Translate API or built-in translation
// Detect language and translate queries to English for processing
```

---

## 🎓 Presentation Tips

### For Your AI Course Demo:

1. **Introduction (2 min)**

   - Show GoTrip website
   - Click AI chatbot button
   - Explain: "We integrated AI to help users find hotels naturally"

2. **NLP Demo (3 min)**

   - Type: "Find hotels near Al-Haram under 600 SAR"
   - Show debug console with parsed query
   - Explain: "NLP extracts location, price, amenities"

3. **Fuzzy Matching (2 min)**

   - Type: "Hotels in Jedah" (typo)
   - Show it still finds Jeddah
   - Explain: "Handles typos and variations"

4. **Geolocation (3 min)**

   - Show hotels sorted by distance from landmark
   - Open console, show distance calculation
   - Explain: "Uses geolib to calculate actual distances"

5. **Sentiment Analysis (3 min)**

   - Click hotel, show review summary
   - Explain: "Analyzes reviews to find common themes"
   - Show positive vs negative sentiment scores

6. **Conclusion (2 min)**
   - Recap technologies used
   - Emphasize "AI simulation" vs real ML
   - Show it adds real value to users

**Total: 15 minutes perfect for presentation!**

---

## ✅ Final Checklist

Before submitting your project:

- [ ] Database has latitude/longitude for all hotels
- [ ] At least 15 sample reviews added
- [ ] All NPM packages installed
- [ ] Server starts without errors
- [ ] Chatbot UI loads correctly
- [ ] All test scenarios work
- [ ] Button appears on homepage
- [ ] Mobile responsive design works
- [ ] Code is commented and clean
- [ ] README.md updated with chatbot info
- [ ] Demo video recorded (optional)

---

## 🚀 Deployment (After Course Submission)

To deploy the full project:

1. **Frontend**: Vercel or Netlify
2. **Backend**: Railway (already using for DB)
3. **Database**: Already on Railway ✅

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check server terminal for errors
3. Review this guide's troubleshooting section
4. Test with provided test scripts

---

**Congratulations! You've built an AI-powered hotel chatbot! 🎉**

**Estimated Total Time:** 35-40 hours  
**Difficulty Level:** Intermediate  
**Technologies Mastered:** Node.js, NLP, Geolocation, Sentiment Analysis, Frontend/Backend Integration

---

**End of Part 2 - Frontend Implementation Guide**
