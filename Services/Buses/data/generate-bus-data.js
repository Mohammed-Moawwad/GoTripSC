// Generate realistic bus trip data based on locations.json
const fs = require('fs');
const path = require('path');

// Load locations
const locations = require('./locations.json');

// Bus operators
const operators = [
  { name: 'SAPTCO', rating: 4.6 },
  { name: 'Al Maha Transport', rating: 4.3 },
  { name: 'Riyadh Express', rating: 4.5 },
  { name: 'Gulf Lines', rating: 4.2 },
  { name: 'Arabian Transport', rating: 4.4 },
  { name: 'Desert Line', rating: 4.1 },
  { name: 'Najd Transport', rating: 4.3 },
  { name: 'Red Sea Transport', rating: 4.0 },
  { name: 'Eastern Express', rating: 4.2 }
];

// Bus classes with amenities
const busClasses = [
  {
    name: 'Economy',
    priceMultiplier: 1.0,
    amenities: ['AC']
  },
  {
    name: 'Economy',
    priceMultiplier: 1.1,
    amenities: ['AC', 'WiFi']
  },
  {
    name: 'Premium',
    priceMultiplier: 1.4,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Snacks']
  },
  {
    name: 'VIP',
    priceMultiplier: 1.8,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Recliner Seats', 'Snacks']
  }
];

// Popular routes with base prices and durations
const popularRoutes = [
  { from: 'Riyadh', to: 'Jeddah', basePrice: 75, baseDuration: 390 },
  { from: 'Riyadh', to: 'Dammam', basePrice: 60, baseDuration: 270 },
  { from: 'Riyadh', to: 'Makkah', basePrice: 85, baseDuration: 420 },
  { from: 'Riyadh', to: 'Madinah', basePrice: 90, baseDuration: 450 },
  { from: 'Jeddah', to: 'Makkah', basePrice: 30, baseDuration: 90 },
  { from: 'Jeddah', to: 'Madinah', basePrice: 70, baseDuration: 240 },
  { from: 'Jeddah', to: 'Taif', basePrice: 35, baseDuration: 120 },
  { from: 'Dammam', to: 'Al Khobar', basePrice: 15, baseDuration: 30 },
  { from: 'Dammam', to: 'Jubail', basePrice: 25, baseDuration: 60 },
  { from: 'Riyadh', to: 'Buraidah', basePrice: 50, baseDuration: 210 },
  { from: 'Riyadh', to: 'Al Kharj', basePrice: 35, baseDuration: 90 },
  { from: 'Abha', to: 'Khamis Mushait', basePrice: 20, baseDuration: 45 },
  { from: 'Tabuk', to: 'Al-Ula', basePrice: 40, baseDuration: 150 },
  { from: 'Najran', to: 'Abha', basePrice: 45, baseDuration: 180 },
  { from: 'Jizan', to: 'Abha', basePrice: 55, baseDuration: 210 }
];

// Time slots
const timeSlots = [
  { hour: 6, minute: 0, label: 'morning' },
  { hour: 8, minute: 30, label: 'morning' },
  { hour: 10, minute: 0, label: 'morning' },
  { hour: 12, minute: 0, label: 'afternoon' },
  { hour: 14, minute: 30, label: 'afternoon' },
  { hour: 16, minute: 0, label: 'afternoon' },
  { hour: 18, minute: 30, label: 'night' },
  { hour: 20, minute: 0, label: 'night' },
  { hour: 22, minute: 0, label: 'night' }
];

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addMinutes(dateStr, minutes) {
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

// Generate trips
function generateTrips() {
  const trips = [];
  let tripId = 1;
  
  // Generate for next 30 days
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    
    // For each popular route
    popularRoutes.forEach(route => {
      // Generate 3-5 trips per route per day
      const numTrips = randomInt(3, 5);
      
      for (let i = 0; i < numTrips; i++) {
        const operator = pick(operators);
        const busClass = pick(busClasses);
        const timeSlot = pick(timeSlots);
        
        // Determine stops
        const stops = i === 0 ? '0' : (Math.random() < 0.6 ? '1' : '2+');
        
        // Calculate duration with variation
        const durationVariation = randomInt(-15, 30);
        const totalDuration = route.baseDuration + durationVariation + (stops === '0' ? 0 : (stops === '1' ? 15 : 30));
        
        // Calculate price
        const priceVariation = randomInt(-5, 10);
        const price = Math.round((route.basePrice * busClass.priceMultiplier + priceVariation) * 100) / 100;
        
        // Create departure and arrival times
        const departureDateTime = new Date(`${dateStr}T${String(timeSlot.hour).padStart(2, '0')}:${String(timeSlot.minute).padStart(2, '0')}:00`);
        const arrivalDateTime = addMinutes(departureDateTime.toISOString(), totalDuration);
        
        // Generate trip
        const trip = {
          id: `B${String(tripId++).padStart(4, '0')}`,
          operator: operator.name,
          from: route.from,
          to: route.to,
          departAt: departureDateTime.toISOString(),
          arriveAt: arrivalDateTime,
          durationMin: totalDuration,
          stops: stops,
          class: busClass.name,
          priceSar: price,
          amenities: busClass.amenities,
          available: randomInt(3, 25),
          rating: operator.rating
        };
        
        trips.push(trip);
      }
      
      // Also generate reverse route (to -> from)
      const reverseNumTrips = randomInt(2, 4);
      for (let i = 0; i < reverseNumTrips; i++) {
        const operator = pick(operators);
        const busClass = pick(busClasses);
        const timeSlot = pick(timeSlots);
        
        const stops = i === 0 ? '0' : (Math.random() < 0.6 ? '1' : '2+');
        const durationVariation = randomInt(-15, 30);
        const totalDuration = route.baseDuration + durationVariation + (stops === '0' ? 0 : (stops === '1' ? 15 : 30));
        const priceVariation = randomInt(-5, 10);
        const price = Math.round((route.basePrice * busClass.priceMultiplier + priceVariation) * 100) / 100;
        
        const departureDateTime = new Date(`${dateStr}T${String(timeSlot.hour).padStart(2, '0')}:${String(timeSlot.minute).padStart(2, '0')}:00`);
        const arrivalDateTime = addMinutes(departureDateTime.toISOString(), totalDuration);
        
        const trip = {
          id: `B${String(tripId++).padStart(4, '0')}`,
          operator: operator.name,
          from: route.to,  // Reversed
          to: route.from,  // Reversed
          departAt: departureDateTime.toISOString(),
          arriveAt: arrivalDateTime,
          durationMin: totalDuration,
          stops: stops,
          class: busClass.name,
          priceSar: price,
          amenities: busClass.amenities,
          available: randomInt(3, 25),
          rating: operator.rating
        };
        
        trips.push(trip);
      }
    });
  }
  
  return trips;
}

// Generate and save
const trips = generateTrips();
console.log(JSON.stringify(trips, null, 2));
console.error(`Generated ${trips.length} bus trips`);
