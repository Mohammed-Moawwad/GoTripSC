# GoTrip Website Workflow - Simple Guide (15 Minutes Read)

## 0. The Common Home Page - All Services in One Place

When users open the GoTrip website, they automatically go to the main Home Page. This page is the same for all services - Flights, Hotels, and Buses. At the top of the page, there are three tabs or buttons: "Flights," "Hotels," and "Buses." Users can click any tab to search for what they want. This design is helpful because users do not need to go to different pages. They stay on the same home page and just click to switch between services. The left menu still shows links to Dashboard, My Bookings, and Profile. This common home page makes GoTrip easy to use because everything is in one place.

---

## 1. Home Page - Main Travel Booking Area

The Home Page (`HomePage.html`) is where users go after they sign in. It shows a search tool for flights. Users type their start city, end city, travel dates, and how many people are traveling. The page has a menu on the left with links to Hotels, Buses, Dashboard, My Bookings, and Profile. The system gets flight information and shows it with airline names, times, and prices. Users can also see travel deals and popular destinations.

---

## 2. Hotel Search & Browsing - Find Hotels

On `HomePageHotels.html`, users search for hotels. They choose a city, check-in date, check-out date, number of rooms, and number of guests. The page shows hotel cards with the hotel name, city, star rating, price per night, available rooms, and extras (WiFi, pool, gym, etc.). The system gets hotel data using `GET /api/hotels`. Users can filter by price and rating, then pick a hotel to book.

---

## 3. Hotel Booking Process - Book a Hotel

When users click "Book Now" on a hotel, they go to the booking form (`Services/Hotels/HotelBooking.html`). They check the dates, number of rooms, and number of guests. The system shows the total price. When they confirm, the system sends `POST /api/bookings/hotels` to save the booking. The system checks if rooms are available, saves the booking in the database, and shows a confirmation page with the booking number, hotel name, dates, and total price.

---

## 4. Bus Search & Booking - Book a Bus

Users go to `HomePageBuses.html` to find a bus. They enter the start city, end city, date, and number of people. The page shows bus information with the company name, times, price, and available seats. When users pick a bus and click "Book," they fill in a form to choose seats and confirm details. The system sends `POST /api/bookings/buses` to save the booking. The system checks if seats are available, saves the booking, and shows a confirmation with the bus company, times, seats, and price.

---

## 5. Flight Booking Process - Book a Flight

Flight bookings start on the Home Page. Users enter their search information and see flights with airline names, plane type, times, and prices. When they click "Book Flight," they check passenger details and choose the ticket class (economy or business). The system sends `POST /api/bookings/flights` to save the booking. The system checks if seats are available, saves the booking in the database, and shows a confirmation with the booking number, ticket information, and total price.

---

## 6. User Dashboard & Statistics - View My Bookings

The Dashboard (`User/dashboard.html`) is where users see all their bookings and information. Users can click buttons to see different things: flights, buses, hotels, all bookings together, profile, and dashboard overview. The dashboard shows four cards with numbers: total bookings, future trips, past trips, and total money spent. The system gets all bookings using `GET /api/bookings`. It shows the most recent bookings with the hotel or service name, city, dates, and booking status.

---

## 7. Dashboard Analytics & Charts - See Charts

The dashboard has a section with charts. One chart is a circle that shows "Bookings by Type" - it shows how many hotel, flight, and bus bookings the user has. Each type has a different color. Another chart is a bar chart that shows "Monthly Spending" for the last 6 months. The bars show how much money the user spent each month. The system uses `renderBookingTypesChart()` and `renderMonthlySpendingChart()` functions to create the charts from real booking data.

---

## 8. User Profile Management - Edit My Information

The Profile page (`User/profile.html`) shows the user's information: first name, last name, email, phone, birthday, and photo. Users can click on any field to change it and click "Save" to send the changes to the system. For password changes, users enter their old password (to check it is them), then enter and confirm the new password. The system checks the old password and hashes the new password before saving it in the database.

---


---



---

## 11. Admin Dashboard & User Management - Manage Users

The Admin Dashboard (`Admin/admin-dashboard.html`) shows information about the website: total users, active users, inactive users, total bookings, and money earned. The User Management page (`Admin/AdminUser/user-management.html`) shows a list of all users. Each user row shows ID, names, email, phone, birthday, when they joined, last time they logged in, and their status. Admins can search for users. For each user, there is a blue "Edit" button to change user information and a red "Delete" button to remove a user.

---

## 12. Hotel, Flight, Bus & User Management (Admin) - Add & Manage Services

The Admin Management pages allow admins to manage all services and users on the platform. **Hotel Management** (`Admin/AdminHotels/`) displays all hotels with their details (ID, name, city, country, rating, price per night, rooms, amenities, status). When admins click "Add New Hotel," a form modal appears where they fill in hotel information (name, city, address, phone, email, description, price, room count, amenities). After saving, `POST /api/hotels` creates the new hotel. Similarly, **Flight Management** (`Admin/AdminFlights/`) shows all flights and when admins click "Add New Flight," a form modal displays fields for flight number, airline, aircraft type, departure/arrival cities and times, price, available seats, gate, and status. When saved, `POST /api/flights` creates the flight. **Bus Management** (`Admin/AdminBus/`) displays buses and shows a modal form for adding new buses with fields like bus number, operator name, cities, times, price, seats, and status. When admins submit, `POST /api/buses` creates the bus. **User Management** (`Admin/AdminUser/`) shows all users and provides a modal form for adding new users with fields for first name, last name, email, phone, birth date, password, and status. When saved, `POST /api/users` creates the new user account. All four management pages follow the same pattern: display data in a table, show a form modal when users click "Add New," collect information through the form, and save to the database using API calls.

---

## 15. Authentication & Login System - How to Sign In

When users first visit the website, they go to the login page (`Login/signin.html`). Users with an account enter their email and password and click "Login." The system checks the database to find the user and checks if the password is correct. If yes, the system creates a special token (JWT) that is good for 7 days. This token is saved in the browser so the user stays signed in. For new users, they click "Sign Up" and enter first name, last name, email, phone, birthday, and password. The system checks if the email is already used, hashes the password, and creates a new user account.

---

## 16. Database Architecture & Data Storage - How Data is Saved

All information in GoTrip is saved in a MySQL database. The database has several tables. The `users` table saves user information: ID, names, email, phone, birthday, hashed password, status, and dates. The `hotels` table saves hotel information: ID, name, city, country, star rating, price, number of rooms, extras, description, status, and dates. The `hotel_bookings` table saves bookings: ID, user ID, hotel ID, check-in date, check-out date, number of rooms, number of guests, price, booking status, payment status, and dates. Similar tables exist for flights and buses. These tables are connected so information is organized and correct.

---

## 17. API Communication & Request/Response Flow - How Systems Talk

The website (frontend) talks to the server (backend) using REST API. Every request from the website includes a token in the header to prove the user is signed in. The backend checks if the token is real. If yes, the backend does what is asked. If no, it sends an error message. For example, when a user books a hotel, the website sends `POST /api/bookings/hotels` with booking information. The backend checks if the hotel has rooms available, saves the booking, and sends back a confirmation. When the website asks for bookings using `GET /api/bookings`, the backend sends back a list of bookings as data (JSON).

---

## 18. Security & Data Protection - How Information is Protected

All passwords are hashed (changed into a special code) before they are saved. This means passwords are never saved as plain text. When a user signs in, the system checks if the password matches the saved code. Tokens work for 7 days and then stop working, so users must sign in again. Most API actions are protected - users must be signed in to use them. The system uses special code to stop attacks where someone tries to put bad code into the database. The website also controls which other websites can use the API to stop dangerous requests.

---

## 19. Booking Confirmation & Email Notifications - After You Book

After a user makes a booking, the website shows a confirmation page. This page has the booking number, service details (hotel name, flight number, or bus company), dates, price, and payment status (paid or waiting). This confirmation is like a receipt. In a real website, an email confirmation would be sent to the user's email address. Users can see their bookings anytime by clicking "My Bookings" or by looking at the dashboard. The booking number can be used to contact customer service if the user needs to change something.

---

## 20. System Logout & Session Management - How to Sign Out

When users are finished, they click the "Logout" button in the menu. The website deletes the saved token and user information from the browser. The user is sent back to the login page. Without the token, the user cannot use the website anymore and must sign in again. This is good for safety. If someone else uses the same computer, they cannot access the first user's information just by using the browser. The user's session (time using the website) is ended.

---

## Summary - Complete Workflow Overview

GoTrip starts at the login page where users sign in. Then they go to the home page to search and book travel (hotels, flights, or buses). After booking, users can see all their bookings and information in the dashboard. Admins have a separate area to manage users, hotels, flights, and buses. All information is kept safe in a MySQL database. The website sends requests to the server using REST API and the server sends back information. Passwords are protected with hashing and users are protected with special tokens. The design is simple for users and strong for protecting information.
