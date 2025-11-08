# 🤖 AI-Powered Hotel Chatbot - Team Implementation Guide

**GoTrip Project - AI Course Assignment**

**Team:** Mohammed, Rida, Khalid, Abdu (4 Members)  
**Duration:** 3-4 Weeks  
**Technology:** Node.js, PostgreSQL, AI/NLP, Google Maps API

---

## 📋 Table of Contents

1. [Project Overview & Objectives](#1-project-overview)
2. [Prerequisites & Installation](#2-prerequisites)
3. [Implementation Phases (Detailed Stages)](#3-implementation-phases)
4. [Team Work Distribution](#4-team-distribution)
5. [Required Changes to Website & Database](#5-required-changes)
6. [Time Estimates for Each Phase](#6-time-estimates)
7. [Key Features Implementation](#7-key-features)
   - [A. Natural Language Understanding](#7a-natural-language)
   - [B. User Location Access](#7b-location-access)
   - [C. Smart Hotel Recommendations](#7c-recommendations)
   - [D. Interactive Map Display](#7d-map-display)
   - [E. Google Maps Integration](#7e-google-maps)
8. [Testing Strategy](#8-testing)
9. [Deployment Checklist](#9-deployment)

---

<a name="1-project-overview"></a>

## 1️⃣ PROJECT OVERVIEW & OBJECTIVES

### 🎯 What We're Building

An **intelligent AI chatbot** integrated into the GoTrip website that helps users find and book hotels through natural conversation.

### 📌 Core Objectives

1. **Natural Language Understanding**

   - Users can type queries like "Find me cheap hotels near Al-Haram"
   - Chatbot understands intent, location, price range, and preferences
   - No need for rigid forms or dropdowns

2. **Location-Based Services**

   - Automatically detect user's current location
   - Find hotels within specified radius
   - Calculate distances from landmarks (e.g., Al-Haram, King Fahd Stadium)

3. **Smart Recommendations**

   - Analyze user preferences (budget, amenities, ratings)
   - Consider past booking history
   - Show hotels sorted by relevance

4. **Visual Map Integration**

   - Display hotels on interactive Google Map
   - Show pins with hotel names and prices
   - Allow users to click markers for details

5. **Seamless Booking Flow**
   - Users can book directly from chatbot
   - Integration with existing GoTrip booking system
   - Save conversation history for reference

### 🎓 Learning Outcomes

- **AI/Machine Learning**: NLP, intent recognition, sentiment analysis
- **APIs**: Google Maps, Geolocation, third-party integrations
- **Database**: Spatial queries, optimization for location-based searches
- **User Experience**: Conversational UI design
- **Team Collaboration**: Agile workflow, version control

---

<a name="2-prerequisites"></a>

## 2️⃣ PREREQUISITES & INSTALLATION

### 👥 Team Requirements

**Each team member must have:**

#### A. Development Environment

- Node.js (v16 or higher)
- Visual Studio Code (or any code editor)
- Git installed
- PostgreSQL (for local testing)
- Modern web browser (Chrome/Firefox)

#### B. Access & Accounts

- GitHub repository access (already have)
- Railway database credentials (already configured)
- Google Cloud Platform account (for Maps API)
- Team communication tool (WhatsApp/Discord/Slack)

### 📦 Software Installation Steps

#### Step 1: Verify Node.js Installation

Check if Node.js and npm are installed on your system. Should have Node.js v16 or higher.

If not installed, download from: https://nodejs.org/

#### Step 2: Clone Repository (If not done)

Clone the GoTripSC repository from GitHub to your local machine.

#### Step 3: Install Dependencies

Run npm install to install all existing project dependencies.

#### Step 4: Install AI/NLP Packages

**Command:** `npm install natural compromise sentiment fuzzball geolib axios`

**Package Purposes:**

- `natural` - Natural Language Processing (tokenization, stemming)
- `compromise` - Lightweight NLP for intent detection
- `sentiment` - Analyze review sentiment (positive/negative)
- `fuzzball` - Fuzzy string matching for flexible queries
- `geolib` - Calculate distances between coordinates
- `axios` - Make HTTP requests to Google Maps API

#### Step 5: Get Google Maps API Key

1. Go to: https://console.cloud.google.com/
2. Create new project: "GoTrip-Chatbot"
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials → API Key
5. Copy the API key (you'll need it later)

#### Step 6: Update .env File

Add these environment variables for chatbot configuration:

- GOOGLE_MAPS_API_KEY (your Google API key)
- CHATBOT_ENABLED (set to true)
- MAX_DISTANCE_KM (maximum search radius)
- DEFAULT_RADIUS_KM (default search radius)

---

<a name="3-implementation-phases"></a>

## 3️⃣ IMPLEMENTATION PHASES (Detailed Stages)

### 🗓️ Phase-by-Phase Breakdown

---

#### **PHASE 1: Database Enhancement** (Week 1)

**Goal:** Prepare database to support location-based searches and chatbot features

**Tasks:**

1. **Add Geolocation to Hotels Table**

   - Add columns: `latitude`, `longitude`, `google_place_id`
   - Create spatial indexes for faster queries
   - Verify data types are correct

2. **Populate Coordinates**

   - Research real hotel locations in Saudi cities
   - Use Google Maps to find exact coordinates
   - Update each hotel record with accurate lat/lng
   - Example: Al-Haram coordinates: (21.4225, 39.8262)

3. **Create Landmarks Table**

   - Store famous landmarks (Al-Haram, Al-Masjid An-Nabawi, etc.)
   - Include coordinates for distance calculations
   - Will be used for queries like "near Al-Haram"

4. **Add Chat History Table**

   - Store user conversations
   - Track query patterns for improvement
   - Link to user accounts

5. **Test Spatial Queries**
   - Write test queries to find hotels within radius
   - Verify distance calculations work correctly

**Deliverables:**

- Updated database schema
- SQL migration scripts
- Sample test queries
- Documentation of all changes

---

#### **PHASE 2: Backend AI Logic** (Week 1-2)

**Goal:** Build the "brain" of the chatbot - understand and process user queries

**Tasks:**

1. **Natural Language Processor Module**

   - Create `backend/utils/nlp.js`
   - Extract entities: location, price, amenities, dates
   - Identify intent: search, book, compare, get info
   - Handle variations: "cheap" vs "under 500 SAR"

2. **Location Handler**

   - Process location queries
   - Match user input to cities in database
   - Handle landmarks ("near Al-Haram")
   - Calculate distances from user's position

3. **Query Builder**

   - Convert natural language to database queries
   - Build dynamic WHERE clauses
   - Handle multiple filters (location + price + amenities)
   - Sort results by relevance

4. **Response Generator**

   - Format hotel results for chatbot display
   - Generate human-like responses
   - Handle edge cases (no results, ambiguous queries)
   - Include follow-up suggestions

5. **Context Manager**
   - Remember conversation history
   - Handle follow-up questions ("show me cheaper options")
   - Track user preferences across session

**Deliverables:**

- NLP utility module
- Chatbot controller (`backend/controllers/chatbotController.js`)
- API endpoint (`/api/chatbot/query`)
- Unit tests for NLP functions

---

#### **PHASE 3: Google Maps Integration** (Week 2)

**Goal:** Set up map display and geocoding services

**Tasks:**

1. **Geocoding Service**

   - Create service to convert addresses to coordinates
   - Reverse geocoding (coordinates to address)
   - Batch geocode existing hotels

2. **Map Display Component**

   - Initialize Google Map on page
   - Set default view to Saudi Arabia
   - Handle zoom and pan interactions

3. **Hotel Markers**

   - Create custom marker icons
   - Display hotel markers on map
   - Add info windows with hotel details
   - Cluster markers when zoomed out

4. **Distance Calculations**

   - Calculate driving distance (using Directions API)
   - Show "5 km from you" labels
   - Sort hotels by distance

5. **User Location Detection**
   - Request browser geolocation permission
   - Show user's current location on map
   - Draw radius circle around user
   - Handle location errors/denied permission

**Deliverables:**

- Google Maps utility module
- Map component (HTML/CSS/JS)
- Geocoding service
- Distance calculator

---

#### **PHASE 4: Frontend Chatbot UI** (Week 2-3)

**Goal:** Create beautiful, user-friendly chat interface

**Tasks:**

1. **Chat Window Design**

   - Floating chat bubble (bottom-right corner)
   - Expand/collapse animation
   - Modern, clean design matching GoTrip theme
   - Mobile responsive

2. **Message Components**

   - User message bubbles (right side)
   - Bot message bubbles (left side)
   - Typing indicator animation
   - Timestamp on messages

3. **Quick Reply Buttons**

   - Suggest common queries
   - Example: "Hotels near me", "Budget hotels", "Luxury stays"
   - One-click to send suggestion

4. **Hotel Result Cards**

   - Display hotel cards in chat
   - Show image, name, price, rating
   - "View on Map" button
   - "Book Now" button

5. **Input Handling**

   - Text input field
   - Send button and Enter key support
   - Voice input (optional advanced feature)
   - Character limit and validation

6. **Error States**
   - Loading indicators
   - Error messages
   - "No results found" state
   - Retry options

**Deliverables:**

- `public/chatbot/chatbot.html`
- `public/chatbot/chatbot.css`
- `public/chatbot/chatbot.js`
- Responsive design documentation

---

#### **PHASE 5: Integration & Communication** (Week 3)

**Goal:** Connect all pieces together

**Tasks:**

1. **API Integration**

   - Connect frontend to backend endpoints
   - Handle API responses and errors
   - Implement retry logic
   - Add loading states

2. **Map-Chat Synchronization**

   - When user clicks hotel in chat, highlight on map
   - When user clicks marker, show in chat
   - Keep map and chat results in sync

3. **Booking Integration**

   - Link to existing booking flow
   - Pre-fill booking form with selected hotel
   - Pass user preferences (dates, guests)

4. **User Authentication**

   - Show different features for logged-in vs guest users
   - Save chat history for registered users
   - Personalize recommendations based on history

5. **Performance Optimization**
   - Lazy load images
   - Debounce user typing
   - Cache common queries
   - Optimize database queries

**Deliverables:**

- Fully integrated system
- API documentation
- Integration test suite

---

#### **PHASE 6: Testing & Refinement** (Week 3-4)

**Goal:** Ensure everything works perfectly

**Tasks:**

1. **Functional Testing**

   - Test all query types
   - Verify search accuracy
   - Check map markers load correctly
   - Test booking flow end-to-end

2. **User Experience Testing**

   - Test with real users (friends/family)
   - Gather feedback on conversations
   - Identify confusing responses
   - Improve natural language understanding

3. **Performance Testing**

   - Test with 100+ hotels in database
   - Check response times
   - Monitor database query performance
   - Optimize slow queries

4. **Mobile Testing**

   - Test on different screen sizes
   - Check touch interactions
   - Verify geolocation works on mobile
   - Test map performance on phones

5. **Error Handling**
   - Test edge cases
   - Handle network failures gracefully
   - Test with location denied
   - Handle API rate limits

**Deliverables:**

- Test report
- Bug fixes
- Performance report
- User feedback summary

---

#### **PHASE 7: Documentation & Deployment** (Week 4)

**Goal:** Prepare for launch and handover

**Tasks:**

1. **Technical Documentation**

   - API documentation
   - Database schema
   - Code comments
   - Setup instructions

2. **User Guide**

   - How to use chatbot
   - Example queries
   - FAQ section

3. **Deployment**

   - Deploy to Railway (if needed)
   - Configure production environment
   - Set up monitoring
   - Create backup plan

4. **Team Presentation**
   - Prepare demo
   - Create presentation slides
   - Practice demonstration
   - Prepare for Q&A

**Deliverables:**

- Complete documentation
- Deployed application
- Presentation materials
- Demo video

<a name="4-team-distribution"></a>

## 4️⃣ TEAM WORK DISTRIBUTION

### 👥 Recommended Team Structure (4 Members)

---

#### **👨‍💻 Member 1: Database & Backend Lead (Mohammed)**

**Primary Responsibilities:**

- Database schema design and modifications
- Spatial queries and optimization
- Backend API endpoints
- Server configuration

**Specific Tasks:**

- PHASE 1: Complete database enhancement
- Create migration scripts
- Write SQL queries for location-based search
- Set up landmarks table
- Create chat history storage

**Skills Needed:**

- PostgreSQL/SQL
- Node.js
- Database optimization

**Time Commitment:** 15-20 hours

---

#### **👨‍💻 Member 2: AI/NLP Specialist (Rida)**

**Primary Responsibilities:**

- Natural Language Processing logic
- Intent recognition system
- Query understanding and parsing
- Smart recommendations algorithm

**Specific Tasks:**

- PHASE 2: Build NLP module
- Implement sentiment analysis
- Create fuzzy matching for hotel names
- Build context manager for conversations
- Train and test NLP accuracy

**Skills Needed:**

- JavaScript
- Basic AI/ML concepts
- Pattern matching
- Algorithm design

**Time Commitment:** 15-20 hours

---

#### **👨‍💻 Member 3: Frontend & UI/UX (Khalid)**

**Primary Responsibilities:**

- Chatbot user interface
- User experience design
- Responsive design
- Animation and interactions

**Specific Tasks:**

- PHASE 4: Create chatbot UI
- Design chat bubbles and layout
- Implement typing animations
- Build hotel result cards
- Mobile responsiveness
- Quick reply buttons

**Skills Needed:**

- HTML/CSS/JavaScript
- UI/UX principles
- Animation (CSS/JS)
- Responsive design

**Time Commitment:** 15-20 hours

---

#### **👨‍💻 Member 4: Google Maps Integration (Abdu)**

**Primary Responsibilities:**

- Google Maps API integration
- Geolocation services
- Map markers and info windows
- Distance calculations

**Specific Tasks:**

- PHASE 3: Set up Google Maps
- Implement geocoding service
- Create custom map markers
- Build location detection
- Integrate directions API
- Map-chat synchronization

**Skills Needed:**

- JavaScript
- Google Maps API
- Geolocation API
- API integration

**Time Commitment:** 15-20 hours

---

### 🤝 Shared Responsibilities

**All Team Members:**

- PHASE 5: Integration testing
- PHASE 6: Bug fixing
- PHASE 7: Documentation
- Code reviews for each other
- Daily standups (15 minutes)
- Weekly progress meetings

---

### 📅 Team Workflow

#### **Week 1: Foundation**

- **Monday:** Team meeting - assign tasks, set up environment
- **Tuesday-Thursday:** Individual work on Phase 1-2
- **Friday:** Code review and integration check

#### **Week 2: Core Development**

- **Monday:** Phase 1-2 completion check
- **Tuesday-Thursday:** Work on Phase 3-4
- **Friday:** Integration testing

#### **Week 3: Integration & Testing**

- **Monday:** Connect all components
- **Tuesday-Wednesday:** Testing and bug fixes
- **Thursday-Friday:** User testing and refinement

#### **Week 4: Polish & Presentation**

- **Monday-Tuesday:** Final touches and documentation
- **Wednesday:** Presentation preparation
- **Thursday:** Demo rehearsal
- **Friday:** Final presentation

---

### 🔄 Git Workflow (Recommended)

**Branch Strategy:**

- main (production)
- dev (development)
- feature/database-enhancement (Member 1)
- feature/nlp-logic (Member 2)
- feature/chatbot-ui (Member 3)
- feature/google-maps (Member 4)

**Daily Routine:**

1. Pull latest changes from `dev`
2. Work on your feature branch
3. Commit with clear messages
4. Push before end of day
5. Create Pull Request when feature is complete
6. Another member reviews and approves
7. Merge to `dev` branch

---

### 📊 Progress Tracking

**Use a simple checklist (Google Sheets or Trello):**

| Task                  | Assigned To | Status         | Deadline | Notes            |
| --------------------- | ----------- | -------------- | -------- | ---------------- |
| Add lat/lng to hotels | Member 1    | ✅ Done        | Week 1   | Completed        |
| Create NLP module     | Member 2    | 🔄 In Progress | Week 2   | 70% done         |
| Design chat UI        | Member 3    | ⏳ Not Started | Week 2   | Waiting for API  |
| Set up Google Maps    | Member 4    | ✅ Done        | Week 1   | API key obtained |

---

<a name="5-required-changes"></a>

## 5️⃣ REQUIRED CHANGES TO WEBSITE & DATABASE

### 🗄️ Database Changes

#### **A. Hotels Table Modifications**

**Add New Columns:**

- latitude (DECIMAL) - For distance calculations
- longitude (DECIMAL) - For distance calculations
- google_place_id (VARCHAR) - Link to Google Maps data
- address_full (TEXT) - Complete address for geocoding
- phone (VARCHAR) - Display in chat results
- website_url (VARCHAR) - Display in chat results

**Why These Columns?**

- Latitude/longitude enable location-based searches and distance calculations
- Google Place ID connects hotel data with Google Maps API
- Full address allows geocoding and display to users
- Phone and website provide complete hotel information in chat

**Create Spatial Index:** For fast location-based queries (PostgreSQL GIST index)

---

#### **B. Create Landmarks Table**

**Purpose:** Store famous locations for queries like "near Al-Haram"

**Table Columns:**

- id (Primary Key)
- name (English name)
- name_ar (Arabic name)
- city
- latitude/longitude (coordinates)
- category (religious, shopping, airport, etc.)
- created_at (timestamp)

**Sample Landmark Data:**

- Al-Haram Mosque (Makkah) - 21.4225, 39.8262
- Al-Masjid an-Nabawi (Madinah) - 24.4672, 39.6111
- King Abdulaziz International Airport (Jeddah)
- Kingdom Centre (Riyadh)
- Al Faisaliah Tower (Riyadh)

---

#### **C. Create Chat History Table**

**Purpose:** Store conversations for analytics and user history

**Table Columns:**

- id (Primary Key)
- user_id (Foreign Key to users)
- session_id (track conversation sessions)
- message_type ('user' or 'bot')
- message_text (actual message content)
- intent_detected (what the bot understood)
- hotels_suggested (JSON array of hotel IDs)
- created_at (timestamp)

**Why This Table?**

- Track which queries are most common
- Improve NLP by analyzing patterns
- Show user their search history
- Debug chatbot issues

---

#### **D. Update Amenities Storage**

**Current Problem:** Amenities might be stored as simple strings

**Solution:** Use proper JSON format for structured querying

**Example amenities format:**

- wifi: true/false
- pool: true/false
- spa: true/false
- gym: true/false
- parking: true/false
- restaurant: true/false
- breakfast: true/false
- ac: true/false

---

### 🌐 Website Changes

#### **A. Add Chatbot Widget to All Pages**

**Files to Modify:**

- `HomePage/HomePage.html`
- `User/dashboard.html`
- `Services/Hotels/hotels.html`
- All other user-facing pages

**What to Add:**
Add chatbot widget div and scripts before closing body tag to enable chatbot on all pages.

---

#### **B. Create New Chatbot Page**

**Create:** `public/chatbot/chatbot.html`

**Features:**

- Full-screen chat interface
- Map integration on the side
- Hotel results display
- Booking integration

---

#### **C. Modify Hotel Detail Pages**

**Add "Ask AI Assistant" Button**

**Functionality:**

- Opens chatbot when clicked
- Pre-fills with question about specific hotel
- Example: "Tell me more about Hilton Hotel amenities"

---

#### **D. Update Navigation Menu**

**Add Chatbot Link** to main navigation:

- Home
- Hotels
- Flights
- AI Assistant ← NEW
- My Account

---

### ⚙️ Backend Changes

#### **A. Create New Routes**

**File:** `backend/routes/chatbot.js`

**Endpoints Needed:**

- POST /api/chatbot/query - Process user message
- GET /api/chatbot/history/:userId - Get chat history
- POST /api/chatbot/feedback - User feedback on response
- GET /api/chatbot/suggestions - Get quick reply suggestions
- POST /api/chatbot/location - Process location-based query

---

#### **B. Create New Controllers**

**Files to Create:**

- chatbotController.js - Main chat logic
- geocodingController.js - Google Maps integration

---

#### **C. Create Utility Modules**

**Files to Create:**

- nlp.js - Natural language processing
- queryBuilder.js - Build database queries from NLP
- responseGenerator.js - Generate human-like responses
- distanceCalculator.js - Calculate distances

---

#### **D. Modify Existing Hotel Controller**

**File:** `backend/controllers/hotelController.js`

**Add New Methods:**

- searchByLocation(latitude, longitude, radius)
- searchByLandmark(landmarkName, radius)
- filterByAmenities(amenitiesList)
- sortByDistance(userLocation)
- getHotelsWithinBudget(maxPrice, minPrice)

---

### 📁 New File Structure

**After Implementation:**

**Backend Files (NEW):**

- backend/controllers/chatbotController.js
- backend/controllers/geocodingController.js
- backend/routes/chatbot.js
- backend/utils/nlp.js
- backend/utils/queryBuilder.js
- backend/utils/responseGenerator.js
- backend/utils/distanceCalculator.js
- backend/middleware/rateLimiter.js

**Backend Files (MODIFIED):**

- backend/controllers/hotelController.js
- backend/routes/hotels.js

**Frontend Files (NEW):**

- public/chatbot/chatbot.html
- public/chatbot/chatbot.css
- public/chatbot/chatbot.js
- public/chatbot/assets/bot-avatar.png
- public/chatbot/assets/marker-icon.png

**Database Files (NEW):**

- database/migrations/add_location_columns.sql
- database/migrations/create_landmarks.sql
- database/migrations/create_chat_history.sql
- database/seeds/populate_landmarks.sql

**Configuration (MODIFIED):**

- .env (add Google API key)

---

### 🔐 Environment Variables to Add

**Update `.env` file with these new variables:**

**Existing variables:**

- DATABASE_URL (already configured)
- PORT (already set to 3000)

**NEW - Add these for chatbot:**

- GOOGLE_MAPS_API_KEY (your Google API key)
- CHATBOT_ENABLED=true
- MAX_DISTANCE_KM=50
- DEFAULT_RADIUS_KM=10
- MAX_RESULTS=20
- ENABLE_VOICE_INPUT=false
- RATE_LIMIT_REQUESTS=100
- RATE_LIMIT_WINDOW_MS=900000

---

<a name="6-time-estimates"></a>

## 6️⃣ TIME ESTIMATES FOR EACH PHASE

### ⏰ Detailed Timeline (3-4 Weeks)

---

#### **PHASE 1: Database Enhancement** ⏱️ 8-12 hours

| Task                                    | Time      | Assigned To | Difficulty |
| --------------------------------------- | --------- | ----------- | ---------- |
| Add location columns to hotels table    | 1 hour    | Member 1    | Easy       |
| Research and populate hotel coordinates | 3-4 hours | Member 1    | Medium     |
| Create landmarks table                  | 1 hour    | Member 1    | Easy       |
| Populate landmarks data (research)      | 2-3 hours | Member 1    | Medium     |
| Create chat history table               | 1 hour    | Member 1    | Easy       |
| Write and test spatial queries          | 2-3 hours | Member 1    | Hard       |

**Week 1: Days 1-2**

---

#### **PHASE 2: Backend AI Logic** ⏱️ 15-20 hours

| Task                                             | Time      | Assigned To | Difficulty |
| ------------------------------------------------ | --------- | ----------- | ---------- |
| Set up NLP libraries                             | 1 hour    | Member 2    | Easy       |
| Build intent detection system                    | 4-5 hours | Member 2    | Hard       |
| Create entity extraction (location, price, etc.) | 3-4 hours | Member 2    | Hard       |
| Implement fuzzy matching for hotel/city names    | 2 hours   | Member 2    | Medium     |
| Build query builder module                       | 3-4 hours | Member 2    | Hard       |
| Create response generator                        | 2-3 hours | Member 2    | Medium     |
| Test with various queries                        | 2-3 hours | Member 2    | Medium     |

**Week 1-2: Days 3-7**

---

#### **PHASE 3: Google Maps Integration** ⏱️ 12-15 hours

| Task                          | Time      | Assigned To | Difficulty |
| ----------------------------- | --------- | ----------- | ---------- |
| Get Google Maps API key       | 30 min    | Member 4    | Easy       |
| Set up basic map display      | 2 hours   | Member 4    | Easy       |
| Implement geocoding service   | 3 hours   | Member 4    | Medium     |
| Create custom hotel markers   | 2 hours   | Member 4    | Medium     |
| Build user location detection | 2 hours   | Member 4    | Easy       |
| Implement distance calculator | 2-3 hours | Member 4    | Hard       |
| Add info windows for hotels   | 1-2 hours | Member 4    | Easy       |
| Test on mobile devices        | 1-2 hours | Member 4    | Medium     |

**Week 2: Days 6-10**

---

#### **PHASE 4: Frontend Chatbot UI** ⏱️ 12-16 hours

| Task                         | Time      | Assigned To | Difficulty |
| ---------------------------- | --------- | ----------- | ---------- |
| Design chat interface layout | 2-3 hours | Member 3    | Medium     |
| Create message bubbles (CSS) | 2 hours   | Member 3    | Easy       |
| Implement chat animations    | 2-3 hours | Member 3    | Medium     |
| Build hotel result cards     | 2-3 hours | Member 3    | Medium     |
| Create quick reply buttons   | 1 hour    | Member 3    | Easy       |
| Implement input handling     | 1-2 hours | Member 3    | Easy       |
| Mobile responsive design     | 2-3 hours | Member 3    | Medium     |

**Week 2-3: Days 8-13**

---

#### **PHASE 5: Integration & Communication** ⏱️ 10-12 hours

| Task                            | Time      | Assigned To | Difficulty |
| ------------------------------- | --------- | ----------- | ---------- |
| Connect frontend to backend API | 2-3 hours | All         | Medium     |
| Sync map with chat results      | 2-3 hours | Members 3&4 | Hard       |
| Integrate with booking system   | 2-3 hours | Member 1    | Medium     |
| Add user authentication check   | 1 hour    | Member 1    | Easy       |
| Implement error handling        | 2 hours   | All         | Medium     |
| Performance optimization        | 2-3 hours | All         | Medium     |

**Week 3: Days 14-16**

---

#### **PHASE 6: Testing & Refinement** ⏱️ 8-10 hours

| Task                              | Time      | Assigned To | Difficulty |
| --------------------------------- | --------- | ----------- | ---------- |
| Functional testing (all features) | 3 hours   | All         | Easy       |
| User testing with real people     | 2 hours   | All         | Easy       |
| Bug fixing                        | 2-3 hours | All         | Varies     |
| Performance testing               | 1 hour    | Member 1    | Medium     |
| Mobile testing                    | 1-2 hours | All         | Easy       |

**Week 3-4: Days 17-20**

---

#### **PHASE 7: Documentation & Deployment** ⏱️ 6-8 hours

| Task                          | Time      | Assigned To | Difficulty |
| ----------------------------- | --------- | ----------- | ---------- |
| Write technical documentation | 2 hours   | Member 1    | Easy       |
| Create user guide             | 1 hour    | Member 3    | Easy       |
| Prepare presentation slides   | 2-3 hours | All         | Easy       |
| Record demo video             | 1 hour    | All         | Easy       |
| Practice presentation         | 1-2 hours | All         | Easy       |

**Week 4: Days 21-25**

---

### 📊 Total Time Breakdown

| Phase                  | Hours           | % of Total |
| ---------------------- | --------------- | ---------- |
| Phase 1: Database      | 8-12            | 13%        |
| Phase 2: AI Logic      | 15-20           | 26%        |
| Phase 3: Google Maps   | 12-15           | 19%        |
| Phase 4: Frontend UI   | 12-16           | 19%        |
| Phase 5: Integration   | 10-12           | 15%        |
| Phase 6: Testing       | 8-10            | 11%        |
| Phase 7: Documentation | 6-8             | 10%        |
| **TOTAL**              | **71-93 hours** | **100%**   |

**Per Team Member:** ~18-23 hours over 3-4 weeks  
**Per Week:** ~6-8 hours/member

---

### 🗓️ Gantt Chart View

### 🗓️ Gantt Chart View

**Week 1:**

- Phase 1: Database (Days 1-2)
- Phase 2: AI Logic (Days 3-7)

**Week 2:**

- Phase 2: AI Logic continues (Days 1-2)
- Phase 3: Google Maps (Days 3-7)
- Phase 4: Frontend UI begins (Days 5-7)

**Week 3:**

- Phase 4: Frontend UI (Days 1-3)
- Phase 5: Integration (Days 4-7)
- Phase 6: Testing begins (Days 6-7)

**Week 4:**

- Phase 6: Testing (Days 1-3)
- Phase 7: Documentation (Days 4-7)

---

<a name="7-key-features"></a>

## 7️⃣ KEY FEATURES IMPLEMENTATION

---

<a name="7a-natural-language"></a>

### 🧠 **A. Natural Language Understanding**

#### **Goal:** Chatbot understands human speech and interacts successfully

---

#### **How It Works (Conceptually):**

**User Types:** "Find me cheap hotels near Al-Haram"

**Step 1: Tokenization** (Break into words)

- Result: ["Find", "me", "cheap", "hotels", "near", "Al-Haram"]

**Step 2: Intent Detection** (What does user want?)

- Intent: SEARCH_HOTELS
- Confidence: 95%

**Step 3: Entity Extraction** (What are the details?)

- Location: "Al-Haram" (Landmark)
- Price Range: "cheap" → 0-500 SAR
- Type: "hotels"

**Step 4: Query Generation**

- Build SQL query to find hotels near landmark
- Filter by price range
- Sort by distance
- Limit results

**Step 5: Response Generation**

- Format results in human-friendly text
- Example: "I found 8 budget-friendly hotels within 5km of Al-Haram Mosque. Here are the top options..."

---

#### **Implementation Strategy:**

**1. Use NLP Library: `compromise`**

**Key Concept:** Use NLP library to analyze user input and extract meaningful information.

**Process:**

- Create a document object from user text
- Extract price indicators (cheap, budget, expensive, luxury)
- Extract locations (place names, cities)
- Extract numbers (prices, distances)
- Return structured data with intent, location, price range, and amenities

**Key Method:** `detectIntent()`

- Looks for keywords: "find", "search", "show", "looking for"
- Returns: SEARCH, BOOK, INFO, COMPARE

**Key Method:** `extractPriceRange()`

- Maps words to prices:
  - "cheap/budget" → 0-500 SAR
  - "mid-range" → 500-1000 SAR
  - "luxury/expensive" → 1000+ SAR
- Handles specific numbers: "under 600 SAR"

**Key Method:** `extractLocation()`

- Matches against database cities
- Uses fuzzy matching for typos
- Recognizes landmarks from landmarks table

---

#### **2. Handle Conversation Context**

**Problem:** User asks follow-up questions

**Example:**

User asks: "Show me hotels in Riyadh"
Bot shows hotels
User then asks: "Cheaper ones" (This needs context from the previous query!)

**Solution: Context Manager**

**Concept:** Create a class that remembers:

- Last query details
- Last location searched
- Last results shown

**Functionality:**

- If new query doesn't have location, use last location
- If user says "cheaper", adjust price from last query
- Track user preferences across session

---

#### **3. Handle Variations in User Input**

**Challenge:** Users phrase things differently

**Examples of Same Intent:**

- "Find hotels near Al-Haram"
- "Hotels close to Makkah mosque"
- "Where to stay near the Kaaba"
- "Accommodation around Haram"

**Solution: Synonym Mapping**

**Create mappings for:**

- hotels → hotel, accommodation, stay, lodge, inn
- cheap → cheap, budget, affordable, inexpensive, economical
- near → near, close to, around, next to, by
- landmarks → Al-Haram = Haram, Kaaba, Makkah Mosque, Grand Mosque

---

#### **Team Task Breakdown:**

**Member 2 (AI Specialist):**

1. Research NLP libraries (1 hour)
2. Implement intent detection (4 hours)
3. Build entity extraction (4 hours)
4. Create synonym mappings (2 hours)
5. Implement context manager (3 hours)
6. Test with 50+ different phrasings (3 hours)

**Testing Checklist:**

- ✅ "Hotels in Riyadh"
- ✅ "Show me cheap accommodation in Makkah"
- ✅ "I want luxury hotels near the airport"
- ✅ "Find me a place to stay under 500 SAR"
- ✅ "Hotels with WiFi and pool"
- ✅ "What's the best rated hotel in Jeddah?"

---

<a name="7b-location-access"></a>

### 📍 **B. User Location Access & Nearest Hotels**

#### **Goal:** Detect user's location and suggest nearby hotels

---

#### **How It Works:**

**Step 1: Request Browser Geolocation**

- User visits chatbot
- Browser asks: "Allow GoTrip to access your location?"

**Step 2: Get Coordinates**

- User approves
- Receive coordinates: latitude and longitude

**Step 3: Calculate Distances**

- For each hotel in database, calculate distance from user
- Sort hotels by distance
- Return closest 10 hotels

**Step 4: Display Results**

- Show hotels with distance labels
- Example: "Hilton Hotel - 1.2 km away"

---

#### **Implementation Strategy:**

**1. Frontend: Get User Location**

**Key Method:** `getUserLocation()`

**How it works:**

- Check if browser supports geolocation
- Request user's current position
- Return latitude, longitude, and accuracy
- Handle errors (permission denied, timeout, not available)

**Configuration Options:**

- enableHighAccuracy: true (for GPS accuracy)
- timeout: 5000ms (5 seconds max wait)
- maximumAge: 0 (don't use cached location)

**Error Handling:**

- Permission denied → Ask user to enter city manually
- Timeout → Use IP-based location (less accurate)
- Not supported → Fall back to city selection dropdown

---

**2. Backend: Calculate Distance**

**Method 1: Haversine Formula** (Accurate for Earth's curved surface)

**Concept:**

- Takes two coordinates (lat1, lon1, lat2, lon2)
- Uses Earth's radius (6371 km)
- Converts degrees to radians
- Applies Haversine formula
- Returns distance in kilometers

**Method 2: Use Library `geolib`** (Recommended - easier)

**Concept:**

- Import geolib library
- Pass user coordinates and hotel coordinates
- Library returns distance in meters
- Convert to kilometers by dividing by 1000

**Why use geolib?**

- Already tested and accurate
- Handles edge cases
- Simpler code
- Well-maintained

---

**3. Filter Hotels Within Radius**

**Conceptual Database Query:**

- Calculate distance from user to each hotel
- Filter only hotels within specified radius
- Sort by distance (closest first)
- Limit results to prevent overwhelming user

**Parameters:**

- userLat, userLng (user's coordinates)
- radiusKm (search radius, default 10km)

---

#### **Team Task Breakdown:**

**Member 4 (Google Maps Lead):**

1. Implement browser geolocation request (2 hours)
2. Handle permission states (granted/denied/prompt) (1 hour)
3. Create distance calculator utility (2 hours)
4. Build "find nearby" API endpoint (2 hours)
5. Add visual radius circle on map (1 hour)
6. Test with various locations (2 hours)

**Member 1 (Database Lead):**

1. Ensure all hotels have accurate coordinates (3 hours)
2. Create database function for distance calculation (2 hours)
3. Optimize queries with spatial indexes (2 hours)

---

#### **User Experience Flow:**

**1. User opens chatbot**

**2. Chatbot prompts:** "📍 Allow location access for nearby hotels?"

**3a. If User clicks "Allow":**

- Show loading message: "Finding hotels..."
- Display map with user's current location
- Show hotels sorted by distance from user

**3b. If User clicks "Deny":**

- Show message: "Enter your city"
- Display city dropdown or search field
- Show hotels in selected city

---

#### **Advanced Feature: Distance from Landmarks**

**User Query:** "Hotels within 2km of Al-Haram"

**Implementation:**

1. Look up "Al-Haram" in landmarks table → Get coordinates
2. Calculate distance from landmark to each hotel
3. Filter hotels within 2km
4. Display with distance labels

**Conceptual Method:** findHotelsNearLandmark()

- Query landmarks table for landmark name
- Use fuzzy matching for flexible search
- Get landmark coordinates
- Reuse findHotelsNearUser() with landmark coordinates
- Return hotels sorted by distance

---

<a name="7c-recommendations"></a>

### 🎯 **C. Smart Hotel Recommendations**

#### **Goal:** Understand user needs and provide best-matched hotels

---

#### **How It Works:**

**User Query:** "I need a hotel in Riyadh with WiFi and pool, under 800 SAR"

**Chatbot Analysis:**

The chatbot should extract:

- Location: Riyadh
- Amenities: WiFi, Pool
- Max Price: 800 SAR
- Implicit preferences: Budget-conscious, values amenities

**Recommendation Algorithm:**

1. Filter by location (Riyadh)
2. Filter by amenities (WiFi AND Pool)
3. Filter by price (≤ 800 SAR)
4. Sort by relevance score:
   - Rating (40%)
   - Number of matching amenities (30%)
   - Price value (20%)
   - Review count (10%)

---

#### **Implementation Strategy:**

**1. Multi-Criteria Filtering**

**Concept:** Build flexible database query based on user's criteria

**Query Builder Process:**

- Start with base query selecting all hotels
- Add filters dynamically based on user input:
  - City/location filter
  - Price range (min and max)
  - Minimum rating
  - Amenities (multiple can be selected)
- Build WHERE clauses dynamically
- Return query string and parameters

**Why Dynamic?** Not all users specify all criteria, so query adapts to what they provide.

---

**2. Relevance Scoring**

**Calculate score for each hotel based on multiple factors:**

**Scoring Components:**

1. **Rating component (40% of score)**

   - Higher hotel rating = higher score
   - Scale: 0-40 points

2. **Amenity match component (30% of score)**

   - Count how many requested amenities hotel has
   - More matches = higher score
   - Scale: 0-30 points

3. **Price value component (20% of score)**

   - Lower price within budget = higher score
   - Rewards best value
   - Scale: 0-20 points

4. **Popularity component (10% of score)**
   - Based on number of reviews
   - More reviews = more trusted
   - Scale: 0-10 points

**Final Step:** Sort hotels by score (highest first)

---

**3. Personalized Recommendations (Advanced)**

**Use past booking history for better recommendations:**

**Process:**

1. Query user's last 5 bookings
2. Analyze patterns:
   - Average price range they book
   - Most frequently used amenities
   - Preferred star rating
3. Boost scores for hotels matching user's history
4. Example: If user always books hotels with pools, add 3 points to pool hotels

**Result:** Recommendations get smarter over time as user books more hotels.

---

**4. Explain Recommendations**

**Why this matters:** Users trust recommendations more when they understand them

**Generate explanation by checking:**

- Is hotel highly rated? (4.5+ stars) → Mention it
- Does it have amenities user wants? → List them
- Is price significantly lower than budget? → "Great value for money"
- Is it very close to user? → "Only X km away"

**Display Example:**

Hotel: Hilton Riyadh Hotel - 750 SAR/night
Rating: 4.6 stars (287 reviews)
Recommendation reason: Highly rated (4.6 stars) • Has WiFi, Pool • Great value for money

---

#### **Team Task Breakdown:**

**Member 2 (AI Specialist):**

1. Design relevance scoring algorithm (3 hours)
2. Implement multi-criteria filtering (3 hours)
3. Build amenity matching logic (2 hours)
4. Create recommendation explanation generator (2 hours)
5. Test with various user preferences (2 hours)

**Member 1 (Database Lead):**

1. Optimize queries for multiple filters (2 hours)
2. Add indexes for common filter fields (1 hour)
3. Create stored procedures for complex queries (2 hours)

---

<a name="7d-map-display"></a>

### 🗺️ **D. Interactive Map Display**

#### **Goal:** Show hotels on a map with markers users can interact with

---

#### **How It Works:**

1. Load Google Map centered on user's search area
2. Place markers for each hotel result
3. Clicking marker shows hotel info popup
4. Clicking hotel in chat highlights marker on map
5. Map and chat stay synchronized

---

#### **Implementation Strategy:**

**1. Initialize Google Map**

**Concept:** Create map instance and configure initial settings

**Configuration:**

- Center point: Default to Riyadh (24.7136, 46.6753)
- Zoom level: 12 (city level)
- Custom styling: Match GoTrip brand colors
- Hide unnecessary controls (street view, map type selector)

**Custom Styling Options:**

- Brand colors
- Hide unnecessary labels
- Emphasize hotels and landmarks
- Clean, modern look

---

**2. Add Hotel Markers**

**Process for each hotel:**

1. Create marker at hotel's coordinates
2. Set custom icon (hotel pin image)
3. Add drop animation when marker appears
4. Create info window with hotel details
5. Add click listener to show info window
6. Store marker reference for later interaction

**Marker Properties:**

- Position: hotel latitude/longitude
- Title: hotel name
- Icon: custom hotel marker image (40x40px)
- Animation: DROP effect

---

**3. Info Window Content**

**Display in popup:**

- Hotel image
- Hotel name
- Star rating
- Price per night
- Amenities icons (WiFi, Pool, Parking)
- "View Details" button
- "Book Now" button

**Interactive Elements:**

- Buttons trigger actions (view hotel page, start booking)
- Info window closes when clicking elsewhere
- Only one info window open at a time

---

**4. Map-Chat Synchronization**

**Scenario 1: User clicks hotel in chat**

- Highlight the corresponding marker on map
- Make marker bounce briefly (2 seconds)
- Pan map to center on that marker
- Zoom in closer (zoom level 15)
- Open info window for that hotel

**Scenario 2: User clicks marker on map**

- Scroll chat to show that hotel's card
- Highlight hotel card temporarily
- Smooth scrolling animation
- Remove highlight after 2 seconds

**Result:** Map and chat always stay in sync!

---

**5. Advanced Features**

**A. Marker Clustering** (when many hotels close together)

- Groups nearby markers into numbered clusters
- Clicking cluster zooms in to show individual hotels
- Prevents map overcrowding
- Improves performance with many hotels

**B. Draw Radius Circle**

- Show visual circle around search point
- Circle radius matches search radius (e.g., 10km)
- Semi-transparent fill
- Green color (#4CAF50)
- Automatically fit map bounds to show full circle

**C. User Location Marker** (different icon)

- Different icon from hotel markers
- Shows user's current position
- Blue color to distinguish from hotels
- Labeled "Your Location"

---

#### **Team Task Breakdown:**

**Member 4 (Google Maps Lead):**

1. Set up Google Maps API (1 hour)
2. Create custom map styles (2 hours)
3. Implement marker creation and placement (3 hours)
4. Build info windows (2 hours)
5. Add marker clustering (2 hours)
6. Implement map-chat sync (3 hours)
7. Add radius circles and user location (2 hours)
8. Mobile responsiveness for map (2 hours)

---

<a name="7e-google-maps"></a>

### 🌍 **E. Google Maps Integration & Hotel Data**

#### **Goal:** Use Google Maps API correctly and populate database with accurate hotel locations

---

#### **1. Getting Google Maps API Key**

**Step-by-Step Process:**

**A. Create Google Cloud Project**

1. Go to https://console.cloud.google.com/
2. Click "Create Project"
3. Name: "GoTrip-Chatbot-2025"
4. Click "Create"

**B. Enable Required APIs**

1. Go to "APIs & Services" → "Library"
2. Search and enable these APIs:
   - ✅ Maps JavaScript API (for displaying maps)
   - ✅ Geocoding API (convert addresses to coordinates)
   - ✅ Places API (get hotel details from Google)
   - ✅ Distance Matrix API (calculate travel distances)
   - ✅ Geolocation API (detect user location)

**C. Create API Key**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the key: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXX`

**D. Restrict API Key (Important for Security)**

1. Click "Edit API Key"
2. Under "API restrictions":
   - Select "Restrict key"
   - Check only the APIs you enabled
3. Under "Website restrictions":
   - Add your domain: `*.gotrip.com/*`
   - For testing: `http://localhost:3000/*`
4. Save

**E. Enable Billing**

- Google Maps requires billing info
- First $200/month is FREE
- Unlikely to exceed with normal usage
- Add a credit card

**Cost Estimates:**

- Maps JavaScript API: $7 per 1000 loads
- Geocoding API: $5 per 1000 requests
- Places API: $17 per 1000 requests
- **Monthly FREE credit: $200**
- **Expected usage: ~$10-20/month** (within free tier)

---

#### **2. Add API Key to Project**

**Update Configuration File:**
Add your Google Maps API key to environment variables: GOOGLE_MAPS_API_KEY

**Load in Frontend:**
Add Google Maps script tag to HTML with your API key and required libraries (places, geometry).

**Load in Backend:**
Use environment variables to access GOOGLE_API_KEY securely.

---

#### **3. Populating Hotel Location Data**

**Challenge:** You have 11 hotels, but they might not have coordinates

**Solution:** Use Google Places API or Geocoding API

---

**Method 1: Google Geocoding API** (Convert address to coordinates)

**Process:**

1. Create function: geocodeHotel(hotelName, city, country)
2. Build address string: "Hotel Name, City, Country"
3. Call Google Geocoding API
4. Extract latitude and longitude from response
5. Also get formatted address and place_id
6. Return coordinates object

**Usage Example:**

- Call geocodeHotel('Hilton Hotel', 'Riyadh')
- Returns: latitude, longitude, place_id
- Update database with these coordinates

---

**Method 2: Google Places API** (Search for hotel, get full details)

**Process:**

1. Search for hotel using "Find Place from Text" API
2. Get place_id from search results
3. Call "Place Details" API with place_id
4. Extract comprehensive information:
   - Coordinates
   - Google rating
   - Phone number
   - Website
   - Reviews
   - Photos
5. Update database with all details

**Advantage:** Gets more data than just coordinates!

---

**4. Batch Update All Hotels**

**Create Script:** `update-hotel-locations.js`

**Script Process:**

1. Query database for all hotels without coordinates
2. Loop through each hotel
3. Call geocoding function for each
4. Update database with returned coordinates
5. Wait 1 second between requests (avoid rate limits)
6. Log success/failure for each hotel

**Run Script:** Execute with Node.js to batch update all hotels

---

**5. Manual Data Entry (Backup Method)**

If API fails or you want specific locations:

**Find coordinates manually:**

1. Go to Google Maps
2. Search for hotel
3. Right-click on location
4. Click coordinates
5. Copy coordinates

**Update Database:**
Use SQL UPDATE statement to add latitude, longitude, and address to hotel record.

---

**6. Verify Location Data**

**Create Verification Script:** `verify-locations.js`

**Script checks:**

- Which hotels have coordinates
- Which hotels are missing coordinates
- If coordinates are within Saudi Arabia bounds
- Latitude should be between 16-33
- Longitude should be between 34-56

**Output:**

- Hotels with valid coordinates
- Hotels missing coordinates
- Hotels with suspicious coordinates

---

#### **7. Display Hotels on Map**

**Final Integration Process:**

1. Fetch hotels from your API endpoint
2. Initialize Google Map
3. Loop through hotels
4. Create marker for each hotel (if has coordinates)
5. Calculate bounds to fit all markers
6. Adjust map zoom/center to show all markers

**Result:** Beautiful map showing all your hotels with interactive markers!

---

#### **Team Task Breakdown:**

**Member 4 (Google Maps Lead):**

1. Create Google Cloud project and get API key (1 hour)
2. Enable required APIs (30 min)
3. Set up API key restrictions (30 min)
4. Create geocoding service (2 hours)
5. Write batch update script (2 hours)
6. Run and verify location data (2 hours)
7. Document API usage and costs (1 hour)

**Member 1 (Database Lead):**

1. Add location columns to hotels table (30 min)
2. Review and verify geocoded data (1 hour)
3. Create spatial indexes (1 hour)
4. Test distance queries (1 hour)

---

### 📊 Summary Checklist for Key Features

| Feature                        | Implementation | Status |
| ------------------------------ | -------------- | ------ |
| **A. Natural Language**        |
| - NLP library setup            | Member 2       | ⏳     |
| - Intent detection             | Member 2       | ⏳     |
| - Entity extraction            | Member 2       | ⏳     |
| - Context management           | Member 2       | ⏳     |
| **B. Location Access**         |
| - Browser geolocation          | Member 4       | ⏳     |
| - Distance calculator          | Member 4       | ⏳     |
| - Nearby hotels API            | Member 1       | ⏳     |
| **C. Recommendations**         |
| - Multi-criteria filter        | Member 2       | ⏳     |
| - Relevance scoring            | Member 2       | ⏳     |
| - Explanation generator        | Member 2       | ⏳     |
| **D. Map Display**             |
| - Map initialization           | Member 4       | ⏳     |
| - Hotel markers                | Member 4       | ⏳     |
| - Info windows                 | Member 4       | ⏳     |
| - Map-chat sync                | Members 3&4    | ⏳     |
| **E. Google Maps Integration** |
| - Get API key                  | Member 4       | ⏳     |
| - Geocode hotels               | Member 4       | ⏳     |
| - Verify data                  | Member 1       | ⏳     |

---

<a name="8-testing"></a>

## 8️⃣ TESTING STRATEGY

### 🧪 Comprehensive Testing Plan

---

#### **A. Unit Testing**

**What to Test:**

- NLP functions (intent detection, entity extraction)
- Distance calculations
- Query builders
- Response generators

**Example Test Cases:**

- Test intent detection: "Find hotels in Riyadh" should return 'SEARCH' intent
- Test price extraction: "under 500 SAR" should return {min: 0, max: 500}
- Test distance calculation: Verify Haversine formula accuracy

**Testing Framework:** Use Jest or Mocha for Node.js unit tests

---

#### **B. Integration Testing**

**Test Scenarios:**

1. **End-to-End Search Flow**

   - User types query → NLP processes → DB query → Results returned → Display on map

2. **Location-Based Search**

   - User allows location → Get coordinates → Find nearby hotels → Display results

3. **Booking Integration**
   - Select hotel from chat → Click "Book Now" → Redirect to booking page with pre-filled data

**Goal:** Ensure all components work together seamlessly

---

#### **C. User Acceptance Testing**

**Test with Real Users:**

**Participants:** 10-15 people (friends, family, classmates)

**Test Tasks:**

1. "Find a budget hotel in Makkah near Al-Haram"
2. "Show me luxury hotels in Riyadh with a pool"
3. "What's the closest hotel to my location?"
4. "I need a hotel under 600 SAR with WiFi"
5. "Compare these two hotels"

**Collect Feedback:**

- Was the chatbot easy to use?
- Did it understand your queries?
- Were the results relevant?
- Any confusing responses?
- Suggestions for improvement?

---

#### **D. Performance Testing**

**Metrics to Measure:**

- Response time (should be < 2 seconds)
- Database query time (should be < 500ms)
- Map loading time
- API call latency

**Tools:**

- Browser DevTools (Network tab)
- `console.time()` / `console.timeEnd()`
- Load testing (simulate 100 users)

---

#### **E. Mobile Testing**

**Test On:**

- iPhone (Safari)
- Android (Chrome)
- Different screen sizes

**Check:**

- Chatbot opens and closes smoothly
- Map is responsive
- Touch interactions work
- Geolocation permission works
- Text is readable

---

<a name="9-deployment"></a>

## 9️⃣ DEPLOYMENT CHECKLIST

### 🚀 Pre-Launch Checklist

---

#### **Code Quality**

- [ ] All features implemented
- [ ] No console errors
- [ ] Code is commented
- [ ] No hardcoded values (use .env)
- [ ] Git repository up to date

#### **Testing**

- [ ] All unit tests pass
- [ ] Integration tests complete
- [ ] User testing feedback addressed
- [ ] Mobile testing done
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

#### **Database**

- [ ] All hotels have coordinates
- [ ] Landmarks table populated
- [ ] Indexes created
- [ ] Backup created
- [ ] Migration scripts ready

#### **APIs**

- [ ] Google Maps API key configured
- [ ] API restrictions set
- [ ] Billing enabled
- [ ] Rate limits checked

#### **Documentation**

- [ ] Technical documentation complete
- [ ] User guide written
- [ ] API documentation ready
- [ ] README updated

#### **Security**

- [ ] API keys not exposed in frontend code
- [ ] Environment variables secured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented

#### **Performance**

- [ ] Images optimized
- [ ] Database queries optimized
- [ ] Caching implemented
- [ ] Load time < 3 seconds

---

### 📝 Final Demo Preparation

**Create Demo Script:**

1. Introduction (30 seconds)
2. Show simple query (1 minute)
3. Show location-based search (1 minute)
4. Show map integration (1 minute)
5. Show booking flow (1 minute)
6. Technical explanation (2 minutes)
7. Q&A

**Practice:**

- Rehearse 3-4 times
- Time yourselves
- Prepare for common questions
- Have backup plan if demo fails

---

## 🎉 CONCLUSION

You now have a complete roadmap to build an AI-powered chatbot for GoTrip!

**Key Takeaways:**

- Clear team roles and responsibilities
- Detailed implementation phases
- Realistic time estimates
- Focus on essential features
- Testing and quality assurance
- Ready for presentation

**Remember:**

- Communicate daily with your team
- Ask for help when stuck
- Test frequently
- Document as you go
- Have fun learning AI!

**Good luck with your project! 🚀**

---

**Questions or Issues?**

- Check Google/Stack Overflow first
- Ask your team members
- Consult your professor
- Debug systematically

**You've got this! 💪**

---

<a name="phase-2"></a>

## 📦 PHASE 2: Install Required NPM Packages

**Estimated Time:** 30 minutes  
**Goal:** Install AI and NLP libraries for Node.js

### Step 2.1: Install Natural Language Processing Libraries

**Install Command:**

Navigate to project directory and install NLP and AI libraries:

- natural
- compromise
- sentiment
- fuzzball
- geolib
- stopword
- string-similarity

### Step 2.2: Verify Installation

Check package.json should now include these dependencies with their version numbers.

### Step 2.3: What Each Library Does

| Library               | Purpose                                | Example                         |
| --------------------- | -------------------------------------- | ------------------------------- |
| **natural**           | Tokenization, stemming, classification | "running" → "run"               |
| **compromise**        | Advanced NLP, entity extraction        | Extract "Makkah" as location    |
| **sentiment**         | Sentiment analysis of text             | "Great hotel!" → positive score |
| **fuzzball**          | Fuzzy string matching                  | "Al Haram" matches "Al-Haram"   |
| **geolib**            | Distance calculations                  | Calculate km between hotels     |
| **stopword**          | Remove common words                    | "the", "a", "in" removal        |
| **string-similarity** | Text similarity scoring                | Compare hotel names             |

---

<a name="phase-3"></a>

## 🧠 PHASE 3: AI Logic Implementation

**Estimated Time:** 8-10 hours  
**Goal:** Create the AI brain of the chatbot

### Step 3.1: Create AI Module Directory Structure

**Create directories:**

- backend/ai
- backend/ai/processors
- backend/ai/utils

**Final structure:**

Files to create:

- backend/ai/chatbotEngine.js (Main chatbot coordinator)
- backend/ai/processors/nlpProcessor.js (Natural language processing)
- backend/ai/processors/locationMatcher.js (Location and proximity)
- backend/ai/processors/priceOptimizer.js (Price suggestions)
- backend/ai/processors/sentimentAnalyzer.js (Review analysis)
- backend/ai/utils/fuzzyMatcher.js (Fuzzy string matching)
- backend/ai/utils/responseGenerator.js (Human-like responses)

### Step 3.2: Natural Language Processor

Create: `backend/ai/processors/nlpProcessor.js`

**Purpose:** Extract intent and entities from user queries

**Main Function:** processUserQuery(userInput)

**What it does:**

- Returns query object with:
  - original user input
  - detected intent (search, recommend, compare, info)
  - extracted location (city or landmark)
  - price range (min/max)
  - amenities requested
  - rating requirement
  - keywords from the query

**Supporting Functions:**

**1. extractIntent(text):**

- Checks text against patterns for different intents
- Search patterns: "find", "show", "search", "i want"
- Recommend patterns: "recommend", "suggest", "best", "top"
- Compare patterns: "compare", "versus", "vs"
- Info patterns: "tell me", "what is", "details"
- Returns detected intent or "search" as default

**2. extractLocation(text):**

- Maintains list of Saudi cities (Riyadh, Jeddah, Makkah, etc.)
- Maintains list of UAE cities
- Has landmark mapping (Al-Haram → Makkah, Prophet's Mosque → Madinah)
- Checks landmarks first (more specific)
- Then checks cities with fuzzy matching (handles typos)
- Uses compromise library for entity extraction
- Returns location object with type (city/landmark) and value

**3. extractPriceRange(text):**

- Has regex patterns for different price expressions:
  - "under 500", "below 600" → maxPrice
  - "above 300", "at least 400" → minPrice
  - "between 300 and 500" → range
  - "500 SAR", "600 riyals" → direct price
- For direct prices, creates ±20% range around the number
- Returns object with min and max price

**4. extractAmenities(text):**

- Maps amenity keywords to standard names
- wifi: "wifi", "wi-fi", "internet", "wireless"
- pool: "pool", "swimming"
- spa: "spa", "massage", "wellness"
- gym: "gym", "fitness", "exercise"
- restaurant: "restaurant", "dining", "food"
- parking: "parking", "garage", "car park"
- beach access: "beach", "beachfront", "seaside"
- conference rooms: "conference", "meeting", "business center"
- Returns array of found amenities

**5. extractRating(text):**

- Looks for patterns like "4-star", "5 star", "rated 4.5", "rating of 4"
- Uses regex to extract numbers
- Returns rating as float

**6. extractKeywords(text):**

- Tokenizes text into words
- Removes stopwords ("the", "a", "in", etc.)
- Stems words (running → run, hotels → hotel)
- Removes duplicates
- Returns array of important keywords

---

### Step 3.3: Location Matcher

Create: `backend/ai/processors/locationMatcher.js`

**Purpose:** Handle proximity search and distance calculations

**Landmarks Database:**
Stores coordinates for:

- Makkah (Al-Haram): latitude 21.4225, longitude 39.8262
- Madinah (Prophet's Mosque): latitude 24.4672, longitude 39.6111
- Riyadh city center: latitude 24.7136, longitude 46.6753
- Jeddah city center: latitude 21.5169, longitude 39.2192
- Dubai (Burj Khalifa area): latitude 25.2048, longitude 55.2708

**Functions:**

**1. calculateDistance(point1, point2):**

- Uses geolib library to calculate distance between two coordinates
- Converts meters to kilometers
- Returns distance in km

**2. findNearbyHotels(hotels, locationName, maxDistanceKm):**

- Gets landmark coordinates for location name
- If landmark not found, filters by city name
- For each hotel with coordinates:
  - Calculates distance from landmark
  - Adds distance_km property to hotel
- Filters hotels within maxDistanceKm (default 50km)
- Sorts by distance (closest first)
- Returns sorted array

**3. getClosestHotel(hotels, locationName):**

- Calls findNearbyHotels with 100km radius
- Returns first result (closest hotel)

**4. enrichLocationData(locationQuery):**

- Takes location query object
- For landmarks: adds coordinates and 10km search radius
- For cities: adds coordinates (if available) and 50km search radius
- Returns enriched location object

---

### Step 3.4: Price Optimizer

Create: `backend/ai/processors/priceOptimizer.js`

**Purpose:** Find best value hotels and provide price recommendations

**Functions:**

**1. findBestValue(hotels, topN):**

- Calculates value score for each hotel
- Formula: (rating / price) × 1000
- Higher score = better value (good rating, lower price)
- Sorts hotels by value score (descending)
- Returns top N hotels (default 5)

**2. findCheapest(hotels, topN):**

- Sorts hotels by price_per_night (ascending)
- Returns top N cheapest hotels (default 5)

**3. findLuxury(hotels, topN):**

- Filters hotels with rating ≥ 4.5 stars
- Sorts by rating (descending)
- Returns top N luxury hotels (default 5)

**4. analyzePrices(hotels):**

- Extracts all prices from hotel array
- Calculates statistics:
  - Minimum price
  - Maximum price
  - Average price
  - Median price
- Returns price analysis object

**5. suggestPriceRange(city, hotels):**

- Filters hotels in specified city
- Analyzes prices for that city
- Returns three price ranges:
  - Budget: min to median
  - Mid-range: median to average
  - Luxury: average to max
- If city not found, returns default range (300-1000 SAR)

---

### Step 3.5: Sentiment Analyzer

Create: `backend/ai/processors/sentimentAnalyzer.js`

**Purpose:** Analyze hotel reviews for sentiment and extract insights
// ====================================
// Sentiment Analyzer
// Analyzes hotel reviews and generates summaries
// ====================================

const Sentiment = require("sentiment");
const db = require("../../config/database");

const sentiment = new Sentiment();

/\*\*

- Analyze reviews for a specific hotel
- @param {string} hotelId - Hotel ID
- @returns {object} Summary with sentiment scores and insights
  _/
  async function analyzeHotelReviews(hotelId) {
  try {
  // Fetch reviews from database
  const [reviews] = await db.query(
  "SELECT _ FROM hotel_reviews WHERE hotel_id = ? ORDER BY created_at DESC",
  [hotelId]
  );

      if (reviews.length === 0) {
        return {
          summary: "No reviews available yet.",
          totalReviews: 0,
          averageRating: 0,
          sentimentScore: 0,
        };
      }

      // Analyze each review
      const analyzed = reviews.map((review) => {
        const result = sentiment.analyze(review.review_text);
        return {
          ...review,
          sentiment_score: result.score,
          sentiment_comparative: result.comparative,
          positive_words: result.positive,
          negative_words: result.negative,
        };
      });

      // Calculate overall metrics
      const totalScore = analyzed.reduce((sum, r) => sum + r.sentiment_score, 0);
      const avgSentiment = totalScore / analyzed.length;
      const avgRating =
        analyzed.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
        analyzed.length;

      // Extract common themes
      const positiveThemes = extractThemes(
        analyzed.filter((r) => r.sentiment_score > 0)
      );
      const negativeThemes = extractThemes(
        analyzed.filter((r) => r.sentiment_score < 0)
      );

      // Generate human-readable summary
      const summary = generateSummary(
        analyzed.length,
        avgRating,
        avgSentiment,
        positiveThemes,
        negativeThemes
      );

      return {
        summary,
        totalReviews: analyzed.length,
        averageRating: parseFloat(avgRating.toFixed(1)),
        sentimentScore: parseFloat(avgSentiment.toFixed(2)),
        positiveThemes,
        negativeThemes,
        recentReviews: analyzed.slice(0, 3).map((r) => ({
          guest: r.guest_name,
          rating: r.rating,
          title: r.review_title,
          sentiment: r.sentiment_score > 0 ? "Positive" : "Negative",
        })),
      };

  } catch (error) {
  console.error("Error analyzing reviews:", error);
  return {
  summary: "Unable to analyze reviews at this time.",
  error: error.message,
  };
  }
  }

/\*\*

- Extract common themes from reviews
  \*/
  function extractThemes(reviews) {
  const wordFrequency = {};

// Common hotel-related keywords to look for
const themeKeywords = [
"clean",
"staff",
"location",
"room",
"service",
"breakfast",
"wifi",
"pool",
"spa",
"gym",
"restaurant",
"view",
"bed",
"bathroom",
"noise",
"price",
"value",
];

reviews.forEach((review) => {
const text = review.review_text.toLowerCase();
themeKeywords.forEach((keyword) => {
if (text.includes(keyword)) {
wordFrequency[keyword] = (wordFrequency[keyword] || 0) + 1;
}
});
});

// Get top 5 themes
return Object.entries(wordFrequency)
.sort((a, b) => b[1] - a[1])
.slice(0, 5)
.map(([word, count]) => ({ theme: word, mentions: count }));
}

/\*\*

- Generate human-readable summary
  \*/
  function generateSummary(
  reviewCount,
  avgRating,
  avgSentiment,
  positiveThemes,
  negativeThemes
  ) {
  let summary = `Based on ${reviewCount} review${
    reviewCount > 1 ? "s" : ""
  } (Average: ${avgRating.toFixed(1)}⭐):\n\n`;

// Overall sentiment
if (avgSentiment > 2) {
summary += "😊 Guests are very satisfied!\n";
} else if (avgSentiment > 0) {
summary += "🙂 Generally positive feedback.\n";
} else if (avgSentiment === 0) {
summary += "😐 Mixed reviews.\n";
} else {
summary += "😞 Some concerns raised by guests.\n";
}

// Positive highlights
if (positiveThemes.length > 0) {
const themes = positiveThemes.map((t) => t.theme).join(", ");
summary += `\n✅ Most praised: ${themes}\n`;
}

// Negative points
if (negativeThemes.length > 0) {
const themes = negativeThemes.map((t) => t.theme).join(", ");
summary += `⚠️ Common concerns: ${themes}\n`;
}

return summary;
}

/\*\*

- Compare sentiment between multiple hotels
  \*/
  async function compareHotels(hotelIds) {
  const results = await Promise.all(
  hotelIds.map((id) => analyzeHotelReviews(id))
  );

return results.sort((a, b) => b.sentimentScore - a.sentimentScore);
}

module.exports = {
analyzeHotelReviews,
compareHotels,
extractThemes,
generateSummary,
};

````

### Step 3.6: Response Generator

Create: `backend/ai/utils/responseGenerator.js`

```javascript
// ====================================
// Response Generator
// Creates human-like chatbot responses
// ====================================

/**
 * Generate conversational response based on context
 */
function generateResponse(context) {
  const { intent, results, query } = context;

  if (!results || results.length === 0) {
    return generateNoResultsResponse(query);
  }

  if (intent === "search") {
    return generateSearchResponse(results, query);
  }

  if (intent === "recommend") {
    return generateRecommendationResponse(results, query);
  }

  if (intent === "compare") {
    return generateComparisonResponse(results, query);
  }

  return generateGenericResponse(results, query);
}

/**
 * No results found response
 */
function generateNoResultsResponse(query) {
  const suggestions = [
    "I couldn't find any hotels matching those criteria. Try:",
    "• Increasing your budget range",
    "• Expanding the location area",
    "• Removing some amenity requirements",
    "",
    'Or ask me: "Show all available hotels"',
  ];

  return {
    message: suggestions.join("\n"),
    suggestions: [
      "Show all hotels in Riyadh",
      "Hotels under 1000 SAR",
      "Best rated hotels",
    ],
  };
}

/**
 * Search results response
 */
function generateSearchResponse(results, query) {
  const count = results.length;
  let message = `I found ${count} hotel${count > 1 ? "s" : ""} for you!\n\n`;

  // Add filters used
  const filters = [];
  if (query.location) {
    filters.push(`📍 Location: ${query.location.value}`);
  }
  if (query.priceRange) {
    filters.push(
      `💰 Price: ${query.priceRange.min} - ${query.priceRange.max} SAR`
    );
  }
  if (query.amenities) {
    filters.push(`🏊 Amenities: ${query.amenities.join(", ")}`);
  }
  if (query.rating) {
    filters.push(`⭐ Rating: ${query.rating}+ stars`);
  }

  if (filters.length > 0) {
    message += "Filters applied:\n" + filters.join("\n") + "\n\n";
  }

  message += "Here are my top recommendations:";

  return {
    message,
    suggestedFilters: generateFilterSuggestions(results),
  };
}

/**
 * Recommendation response
 */
function generateRecommendationResponse(results, query) {
  const greetings = [
    "Based on your preferences, I recommend:",
    "Here are my top picks for you:",
    "These hotels would be perfect:",
    "You'll love these options:",
  ];

  const message =
    greetings[Math.floor(Math.random() * greetings.length)] +
    "\n\n" +
    "Sorted by best value for money!";

  return {
    message,
    sortedBy: "value",
  };
}

/**
 * Generate filter suggestions
 */
function generateFilterSuggestions(results) {
  const prices = results.map((h) => parseFloat(h.price_per_night));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    priceRanges: [
      {
        label: "Budget",
        min: minPrice,
        max: Math.floor((minPrice + maxPrice) / 2),
      },
      {
        label: "Premium",
        min: Math.floor((minPrice + maxPrice) / 2),
        max: maxPrice,
      },
    ],
    ratings: ["4.0+", "4.5+", "4.8+"],
  };
}

/**
 * Generic response
 */
function generateGenericResponse(results, query) {
  return {
    message: `I found ${results.length} hotels matching your search.`,
  };
}

/**
 * Generate greeting message
 */
function generateGreeting() {
  const greetings = [
    "Hello! 👋 I'm your GoTrip AI assistant. How can I help you find the perfect hotel today?",
    "Hi there! 🌟 Looking for a hotel? Tell me what you need!",
    "Welcome to GoTrip! 🏨 I can help you find hotels. What are you looking for?",
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Format hotel card for display
 */
function formatHotelCard(hotel) {
  let card = `🏨 **${hotel.hotel_name}**\n`;
  card += `📍 ${hotel.location}, ${hotel.city}, ${hotel.country}\n`;
  card += `⭐ ${hotel.rating} stars | 💰 ${hotel.price_per_night} SAR/night\n`;

  if (hotel.distance_km) {
    card += `📏 ${hotel.distance_km} km away\n`;
  }

  if (hotel.amenities) {
    const amenitiesList = hotel.amenities
      .split(",")
      .slice(0, 3)
      .map((a) => a.trim())
      .join(", ");
    card += `🎯 ${amenitiesList}\n`;
  }

  if (hotel.available_rooms) {
    card += `🛏️ ${hotel.available_rooms} rooms available\n`;
  }

  return card;
}

module.exports = {
  generateResponse,
  generateGreeting,
  formatHotelCard,
  generateNoResultsResponse,
  generateSearchResponse,
  generateRecommendationResponse,
};
````

---

## ⏰ **CHECKPOINT:** You've completed Phase 3!

Test your AI modules before continuing:

Create: `test-ai-modules.js`

```javascript
const { processUserQuery } = require("./backend/ai/processors/nlpProcessor");

// Test queries
const testQueries = [
  "Find hotels near Al-Haram under 600 SAR",
  "Show me luxury hotels in Dubai with WiFi",
  "Cheapest hotels in Riyadh",
  "Hotels in Jeddah with pool and spa",
  "Recommend 4-star hotels in Makkah",
];

console.log("🧪 Testing NLP Processor\n");

testQueries.forEach((query) => {
  console.log(`Query: "${query}"`);
  const result = processUserQuery(query);
  console.log("Result:", JSON.stringify(result, null, 2));
  console.log("---\n");
});
```

Run: `node test-ai-modules.js`

Expected: Should parse location, price, amenities correctly!

---

<a name="phase-4"></a>

## 🌐 PHASE 4: Backend API Development

**Estimated Time:** 4-5 hours  
**Goal:** Create chatbot API endpoints

### Step 4.1: Create Chatbot Engine (Main Coordinator)

Create: `backend/ai/chatbotEngine.js`

```javascript
// ====================================
// Chatbot Engine - Main Coordinator
// Orchestrates all AI modules to process queries
// ====================================

const db = require("../config/database");
const { processUserQuery } = require("./processors/nlpProcessor");
const {
  findNearbyHotels,
  enrichLocationData,
} = require("./processors/locationMatcher");
const {
  findBestValue,
  findCheapest,
  analyzePrices,
} = require("./processors/priceOptimizer");
const { analyzeHotelReviews } = require("./processors/sentimentAnalyzer");
const {
  generateResponse,
  formatHotelCard,
} = require("./utils/responseGenerator");

/**
 * Main chatbot query handler
 * @param {string} userMessage - User's input message
 * @returns {object} Chatbot response with hotels and message
 */
async function handleChatbotQuery(userMessage) {
  try {
    console.log("🤖 Chatbot received:", userMessage);

    // Step 1: Parse user query using NLP
    const parsedQuery = processUserQuery(userMessage);

    // Step 2: Fetch hotels from database
    let hotels = await fetchHotelsFromDatabase();

    // Step 3: Apply filters based on parsed query
    hotels = applyFilters(hotels, parsedQuery);

    // Step 4: Sort and rank results
    hotels = rankHotels(hotels, parsedQuery);

    // Step 5: Generate response
    const response = generateResponse({
      intent: parsedQuery.intent,
      results: hotels,
      query: parsedQuery,
    });

    // Step 6: Format final output
    return {
      success: true,
      message: response.message,
      hotels: hotels.slice(0, 5), // Limit to top 5 results
      queryUnderstood: parsedQuery,
      totalResults: hotels.length,
      suggestions: response.suggestions || [],
    };
  } catch (error) {
    console.error("❌ Chatbot error:", error);
    return {
      success: false,
      message:
        "Sorry, I encountered an error. Please try again or rephrase your question.",
      error: error.message,
    };
  }
}

/**
 * Fetch active hotels from database
 */
async function fetchHotelsFromDatabase() {
  const [hotels] = await db.query(
    'SELECT * FROM hotels WHERE status = "Active" ORDER BY rating DESC'
  );
  return hotels;
}

/**
 * Apply filters to hotels based on query
 */
function applyFilters(hotels, query) {
  let filtered = [...hotels];

  // Filter by location
  if (query.location) {
    const locationData = enrichLocationData(query.location);

    if (locationData.type === "landmark" && locationData.coordinates) {
      // Proximity search for landmarks
      filtered = findNearbyHotels(
        filtered,
        locationData.value,
        locationData.searchRadius
      );
    } else if (locationData.type === "city") {
      // City name match
      filtered = filtered.filter(
        (h) => h.city.toLowerCase() === locationData.value.toLowerCase()
      );
    }
  }

  // Filter by price range
  if (query.priceRange) {
    filtered = filtered.filter((h) => {
      const price = parseFloat(h.price_per_night);
      return price >= query.priceRange.min && price <= query.priceRange.max;
    });
  }

  // Filter by rating
  if (query.rating) {
    filtered = filtered.filter((h) => parseFloat(h.rating) >= query.rating);
  }

  // Filter by amenities
  if (query.amenities && query.amenities.length > 0) {
    filtered = filtered.filter((h) => {
      const hotelAmenities = h.amenities ? h.amenities.toLowerCase() : "";
      return query.amenities.every((amenity) =>
        hotelAmenities.includes(amenity.toLowerCase())
      );
    });
  }

  return filtered;
}

/**
 * Rank and sort hotels based on intent
 */
function rankHotels(hotels, query) {
  const intent = query.intent;

  if (intent === "recommend" || query.original.toLowerCase().includes("best")) {
    // Sort by best value
    return findBestValue(hotels, hotels.length);
  }

  if (
    query.original.toLowerCase().includes("cheap") ||
    query.original.toLowerCase().includes("budget")
  ) {
    // Sort by price (cheapest first)
    return findCheapest(hotels, hotels.length);
  }

  if (query.location && query.location.type === "landmark") {
    // Already sorted by distance in findNearbyHotels
    return hotels;
  }

  // Default: sort by rating
  return hotels.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
}

/**
 * Get hotel details with review analysis
 */
async function getHotelWithReviews(hotelId) {
  try {
    // Get hotel details
    const [hotels] = await db.query("SELECT * FROM hotels WHERE hotel_id = ?", [
      hotelId,
    ]);

    if (hotels.length === 0) {
      return {
        success: false,
        message: "Hotel not found",
      };
    }

    const hotel = hotels[0];

    // Get review analysis
    const reviewAnalysis = await analyzeHotelReviews(hotelId);

    return {
      success: true,
      hotel,
      reviews: reviewAnalysis,
    };
  } catch (error) {
    console.error("Error getting hotel details:", error);
    return {
      success: false,
      message: "Error retrieving hotel information",
      error: error.message,
    };
  }
}

module.exports = {
  handleChatbotQuery,
  getHotelWithReviews,
};
```

### Step 4.2: Create Chatbot Controller

Create: `backend/controllers/chatbotController.js`

```javascript
// ====================================
// Chatbot Controller
// Handles HTTP requests for chatbot endpoints
// ====================================

const {
  handleChatbotQuery,
  getHotelWithReviews,
} = require("../ai/chatbotEngine");

/**
 * POST /api/chatbot/query
 * Process user message and return AI response
 */
const processChatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a message",
      });
    }

    // Process query with AI engine
    const result = await handleChatbotQuery(message);

    res.status(200).json(result);
  } catch (error) {
    console.error("Chatbot query error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET /api/chatbot/hotel/:id/reviews
 * Get hotel details with review analysis
 */
const getHotelReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getHotelWithReviews(id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error getting hotel reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET /api/chatbot/suggestions
 * Get suggested queries for users
 */
const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "Find hotels near Al-Haram under 600 SAR",
      "Show me luxury hotels in Dubai",
      "Cheapest hotels in Riyadh with WiFi",
      "Best rated hotels in Jeddah",
      "Hotels in Makkah with pool and spa",
      "Recommend 4-star hotels in Madinah",
      "Budget hotels near the beach",
      "Business hotels in Dubai with meeting rooms",
    ];

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting suggestions",
      error: error.message,
    });
  }
};

module.exports = {
  processChatbotQuery,
  getHotelReviews,
  getSuggestions,
};
```

### Step 4.3: Create Chatbot Routes

Create: `backend/routes/chatbotRoutes.js`

```javascript
// ====================================
// Chatbot Routes
// API endpoints for chatbot functionality
// ====================================

const express = require("express");
const router = express.Router();

const {
  processChatbotQuery,
  getHotelReviews,
  getSuggestions,
} = require("../controllers/chatbotController");

// POST /api/chatbot/query - Main chatbot endpoint
// Body: { "message": "Find hotels in Riyadh under 500 SAR" }
router.post("/query", processChatbotQuery);

// GET /api/chatbot/hotel/:id/reviews - Get hotel with review analysis
// Example: /api/chatbot/hotel/HTL001/reviews
router.get("/hotel/:id/reviews", getHotelReviews);

// GET /api/chatbot/suggestions - Get query suggestions
router.get("/suggestions", getSuggestions);

module.exports = router;
```

### Step 4.4: Register Routes in server.js

Update `server.js` to include chatbot routes:

```javascript
// Add this import at the top with other routes
const chatbotRoutes = require("./backend/routes/chatbotRoutes");

// Add this route registration with other API routes
app.use("/api/chatbot", chatbotRoutes);
```

Full location in server.js:

```javascript
// ====================================
// Routes
// ====================================

// Root route - serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "HomePage", "HomePage.html"));
});

// API Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "GoTrip API is running! 🚀",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chatbot", chatbotRoutes); // ← ADD THIS LINE
```

### Step 4.5: Test Backend APIs

Create: `test-chatbot-api.js`

```javascript
require("dotenv").config();

const testQueries = [
  "Find hotels near Al-Haram under 600 SAR",
  "Show me luxury hotels in Dubai",
  "Cheapest hotels in Riyadh",
  "Hotels in Jeddah with pool",
];

async function testChatbotAPI() {
  console.log("🧪 Testing Chatbot API\n");

  for (const query of testQueries) {
    console.log(`\n📝 Query: "${query}"`);

    try {
      const response = await fetch("http://localhost:3000/api/chatbot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      console.log("✅ Response:", data.message);
      console.log(`📊 Found ${data.totalResults} hotels`);
      console.log("🏨 Top result:", data.hotels[0]?.hotel_name);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  }
}

// Make sure server is running first!
testChatbotAPI();
```

Run tests:

```powershell
# Terminal 1: Start server
npm start

# Terminal 2: Test API
node test-chatbot-api.js
```

---

**Continue to Part 2 of this guide for Frontend Implementation...**

_(Due to length constraints, the guide continues in the next section)_

---

## 📌 Quick Reference Commands

```powershell
# Install dependencies
npm install natural compromise sentiment fuzzball geolib stopword string-similarity

# Run server
npm start

# Test modules
node test-ai-modules.js
node test-chatbot-api.js
node verify-database.js

# Check database
node check-hotel-data.js
```

---

## 🎓 For Your AI Course Presentation

### Key Points to Emphasize:

1. **Natural Language Processing (NLP)**

   - "We use the 'natural' library for tokenization and stemming"
   - "The 'compromise' library extracts entities like cities and landmarks"
   - Demo: Show how "hotels near Al Haram" → extracts "Makkah" as location

2. **Fuzzy Matching**

   - "Handles typos and variations: 'Al-Haram' = 'Al Haram' = 'Alharam'"
   - Demo: Show different spellings returning same results

3. **Geospatial Analysis**

   - "Calculate distance from landmarks using geolib library"
   - Demo: Show "near Al-Haram" returns hotels sorted by distance

4. **Sentiment Analysis**

   - "Analyze reviews to determine positive/negative sentiment"
   - Demo: Show review summary with most praised features

5. **Recommendation Algorithm**
   - "Ranks hotels by value score: (rating / price) × 1000"
   - Demo: Show "best value" vs "cheapest" vs "luxury" recommendations

---

**Next**: Part 2 - Frontend Implementation (Creating the chatbot UI)
