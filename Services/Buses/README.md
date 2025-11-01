# GoTrip Buses Search & Results Page

## Overview

A complete buses search and booking results page for the GoTrip travel platform. Features client-side filtering, sorting, pagination, deep linking, and a complete booking flow.

## Files Included

```
Services/Buses/
├── BusesSearchResults.html    # Main search results page
├── BusesSearchResults.css     # Styling for results page
├── BusesSearchResults.js      # JavaScript functionality
├── Booking.html               # Booking confirmation page
├── mock_buses.json            # Mock data (15 bus trips)
└── README.md                  # This file
```

## Features

### ✅ Search & Results
- **Pre-filled search form** from URL parameters or sessionStorage
- **Real-time filtering** by route, date, class, stops, operator, price, and departure time
- **Client-side search** using mock JSON data (no backend required)
- **Sorting options**: Recommended, Cheapest, Fastest
- **Smart tags**: "Recommended", "Cheapest", "Fastest" badges on relevant results
- **Pagination**: 6 results per page with page numbers and navigation

### ✅ Filters (Left Sidebar)
- Stops: Nonstop / 1 stop / 2+ stops
- Price range: Min/max inputs + range slider
- Operator: Dynamic checkboxes based on available operators
- Departure time: Morning / Afternoon / Night
- Apply & Reset buttons

### ✅ Result Cards
- Operator logo and name
- Departure/arrival times and cities
- Duration badge and stops info
- Bus class (Economy/Premium/VIP)
- Feature badges (wifi, AC, recliner, USB, sleeper, snack)
- Price with currency
- "Select" button to continue booking
- Seats warning when <= 5 seats left

### ✅ Deep Linking & URL State
- All search parameters, filters, sort, and page number are reflected in URL
- Bookmarkable and shareable URLs
- Back button works correctly

### ✅ Booking Flow
- Clicking "Select" checks login status (localStorage.isLoggedIn)
- If not logged in: redirects to login page with return URL
- If logged in: navigates to Booking.html with trip ID
- Booking page displays full trip details

### ✅ Responsive Design
- Desktop: Filters sidebar + results (2-column layout)
- Tablet: Filters collapse, single column
- Mobile: Fully responsive cards and controls

### ✅ Accessibility
- Semantic HTML5 elements
- ARIA labels on interactive controls
- Keyboard navigation support
- Alt text on images
- Focus styles

## Setup & Testing

### Local Development Server

You need a local web server to run this (fetch API requires HTTP protocol).

**Option 1: Python HTTP Server**
```powershell
# Navigate to project root (GoTripSC folder)
cd c:\Users\abdlu\Documents\GoTripSC

# Start Python server (Python 3)
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js HTTP Server**
```powershell
# Install http-server globally (one time)
npm install -g http-server

# Navigate to project root
cd c:\Users\abdlu\Documents\GoTripSC

# Start server
http-server -p 8000
```

**Option 3: VS Code Live Server Extension**
1. Install "Live Server" extension in VS Code
2. Right-click `BusesSearchResults.html`
3. Select "Open with Live Server"

### Test URLs

Once server is running, test these URLs:

**Basic search (Riyadh to Jeddah, Nov 10)**
```
http://localhost:8000/Services/Buses/BusesSearchResults.html?from=Riyadh&to=Jeddah&depart=2025-11-10&passengers=1
```

**Search with filters (nonstop only)**
```
http://localhost:8000/Services/Buses/BusesSearchResults.html?from=Riyadh&to=Jeddah&depart=2025-11-10&stops=0
```

**Price filtered (30-80 SAR)**
```
http://localhost:8000/Services/Buses/BusesSearchResults.html?from=Riyadh&to=Jeddah&depart=2025-11-10&min=30&max=80
```

**Cheapest sort**
```
http://localhost:8000/Services/Buses/BusesSearchResults.html?from=Riyadh&to=Jeddah&depart=2025-11-10&sort=cheapest
```

**Multiple filters combined**
```
http://localhost:8000/Services/Buses/BusesSearchResults.html?from=Riyadh&to=Jeddah&depart=2025-11-10&stops=0,1&min=50&max=100&operator=SAPTCO&time=morning&sort=fastest&page=1
```

**Dammam route**
```
http://localhost:8000/Services/Buses/BusesSearchResults.html?from=Riyadh&to=Dammam&depart=2025-11-10
```

**Return trip (Jeddah to Riyadh)**
```
http://localhost:8000/Services/Buses/BusesSearchResults.html?from=Jeddah&to=Riyadh&depart=2025-11-10
```

## Usage Guide

### 1. Search for Buses
- Fill in the search form (From, To, Departure date, etc.)
- Click "Search" button
- Results appear with matching trips

### 2. Apply Filters
- Use left sidebar to filter results:
  - Check/uncheck stop options
  - Set price range
  - Select operators
  - Choose departure time windows
- Click "Apply Filters"
- Results update automatically

### 3. Sort Results
- Click sorting tabs: **Recommended** | **Cheapest** | **Fastest**
- Results re-order instantly
- Best option gets a colored tag badge

### 4. Navigate Pages
- Use "Previous" / "Next" buttons
- Or click page numbers directly
- Shows 6 results per page

### 5. Select a Trip
- Click "Select" button on any result card
- If not logged in: redirects to login page
- If logged in: goes to booking page

### 6. Simulate Login
Open browser console and run:
```javascript
localStorage.setItem('isLoggedIn', 'true');
```
Now clicking "Select" will go directly to booking page.

To logout:
```javascript
localStorage.removeItem('isLoggedIn');
```

### 7. Complete Booking
- Review trip details on booking page
- Click "Confirm Booking"
- (Demo: shows alert, in production would process payment)

## Mock Data Details

**15 bus trips** in `mock_buses.json`:
- **Routes**: Riyadh ↔ Jeddah, Riyadh ↔ Dammam, Makkah → Madinah
- **Operators**: SAPTCO, AlmosaferBus, BusBuddy
- **Classes**: Economy, Premium, VIP
- **Stops**: 0 (nonstop), 1, 2+
- **Prices**: SAR 45 - 99
- **Times**: 06:00 - 22:00 (various departure times)
- **Features**: wifi, AC, recliner, USB, sleeper, snack

## Key Implementation Details

### URL Query Parameters
- `from`: Origin city
- `to`: Destination city
- `depart`: Departure date (YYYY-MM-DD)
- `return`: Return date (optional)
- `passengers`: Number of passengers (1-6+)
- `class`: Bus class (Economy/Premium/VIP)
- `directOnly`: Boolean (true/false)
- `stops`: Comma-separated (0,1,2)
- `min`: Minimum price
- `max`: Maximum price
- `operator`: Comma-separated operators
- `time`: Comma-separated time windows (morning,afternoon,night)
- `sort`: Sort type (recommended/cheapest/fastest)
- `page`: Current page number

### JavaScript Architecture
- **loadMockData()**: Fetches mock_buses.json
- **searchTrips(params)**: Filters buses by search criteria
- **sortResults(results, sortType)**: Sorts results
- **renderResults(results)**: Generates HTML for result cards
- **applyFiltersFromUI()**: Reads filter values and updates URL
- **performSearch()**: Main search execution function
- **updateUrlParams(params)**: Updates URL without page reload
- **syncFormFromUrl()**: Pre-fills form from URL parameters

### CSS Design Tokens
Matches existing GoTrip theme:
- `--primary`: #007bff (blue)
- `--success`: #28a745 (green)
- `--warning`: #ffc107 (yellow)
- `--danger`: #dc3545 (red)
- `--ink`: #0f1a2b (dark text)
- `--muted`: #7f8aa3 (secondary text)

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## Integration with GoTrip Site

### Header Navigation
- Reuses existing site header from `HomePage/HomePageBuses.html`
- Links to Flights, Hotels, Buses pages
- Language selector, cart, sign in/login buttons
- Mobile menu toggle

### Footer
- Consistent footer across all pages
- Links to About, Contact, Privacy, Terms
- Copyright notice

### Login Integration
- Links to `../../Login/login.html`
- Passes return URL: `?next=/Services/Buses/Booking.html?trip=B001`
- Checks `localStorage.isLoggedIn` for auth status

### Styling Consistency
- Reuses `HomePage/HomePageBuses.css` for base styles
- Extends with `BusesSearchResults.css` for results-specific styles
- Same fonts, colors, spacing, shadows as rest of site

## Future Enhancements

- [ ] Real backend API integration
- [ ] Payment processing
- [ ] User authentication system
- [ ] Booking history
- [ ] Email confirmations
- [ ] Multi-language support (full i18n)
- [ ] Advanced filters (amenities, ratings, etc.)
- [ ] Map view of routes
- [ ] Real-time seat availability
- [ ] Reviews and ratings system

## Browser Compatibility

Tested on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

**Issue**: Mock data not loading
- **Solution**: Make sure you're using a web server (not file:// protocol)

**Issue**: Filters not working
- **Solution**: Check browser console for JavaScript errors

**Issue**: Page looks broken
- **Solution**: Ensure `HomePage/HomePageBuses.css` exists and is loaded

**Issue**: Booking page shows "Trip not found"
- **Solution**: Make sure the trip ID in URL exists in mock_buses.json

## Developer Notes

- All code is vanilla JavaScript (no frameworks)
- Modular functions with clear responsibilities
- Extensive comments for maintainability
- Debounced inputs for performance
- URL state enables deep linking and bookmarking
- sessionStorage can store last search (optional enhancement)
- RTL support ready (use `dir="rtl"` on html tag)

## Contact

For questions or issues with this implementation, refer to the GoTrip development team.

---

**Version**: 1.0  
**Created**: November 2025  
**Last Updated**: November 2025
