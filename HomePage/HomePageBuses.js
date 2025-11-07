// ===== Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
menuToggle?.addEventListener('click', () => {
  const open = !mobilePanel.hasAttribute('hidden');
  open ? mobilePanel.setAttribute('hidden', '') : mobilePanel.removeAttribute('hidden');
  menuToggle.setAttribute('aria-expanded', String(!open));
});

// ===== Load Locations and Initialize Autocomplete =====
let allLocations = [];

async function loadLocations() {
  try {
    const response = await fetch('../Services/Buses/data/locations.json');
    if (!response.ok) return [];
    allLocations = await response.json();
    return allLocations;
  } catch (error) {
    console.error('Error loading locations:', error);
    return [];
  }
}

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
    ).slice(0, 8);
    
    if (matches.length === 0) return;
    
    listElement.innerHTML = '';
    listElement.style.display = 'block';
    
    matches.forEach((loc) => {
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
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(items);
      e.preventDefault();
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(items);
      e.preventDefault();
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1 && items[currentFocus]) {
        items[currentFocus].click();
      }
    } else if (e.keyCode === 27) {
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
  
  document.addEventListener('click', function(e) {
    if (e.target !== inputElement) {
      closeAllLists();
    }
  });
  
  // Return validation function
  return () => isValidCity || inputElement.value.trim() === '';
}

// Initialize on page load
loadLocations().then(() => {
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  
  if (fromInput && toInput) {
    // Create autocomplete lists
    const fromList = document.createElement('div');
    fromList.id = 'fromAutocomplete';
    fromList.className = 'autocomplete-list';
    fromInput.parentNode.style.position = 'relative';
    fromInput.parentNode.appendChild(fromList);
    
    const toList = document.createElement('div');
    toList.id = 'toAutocomplete';
    toList.className = 'autocomplete-list';
    toInput.parentNode.style.position = 'relative';
    toInput.parentNode.appendChild(toList);
    
    // Initialize autocomplete
    initAutocomplete(fromInput, fromList);
    initAutocomplete(toInput, toList);
  }
});

// ===== Language dropdown
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
const langLabel = document.getElementById('langLabel');

function toggleLang(open){
  if(!langMenu) return;
  if(open){ langMenu.style.display='block'; langBtn.setAttribute('aria-expanded','true'); langMenu.focus(); }
  else{ langMenu.style.display='none'; langBtn.setAttribute('aria-expanded','false'); }
}
langBtn?.addEventListener('click', (e)=>{ e.stopPropagation(); toggleLang(langMenu.style.display!=='block'); });
document.addEventListener('click', (e)=>{ if (langMenu && !langMenu.contains(e.target) && e.target!==langBtn) toggleLang(false); });
langMenu?.addEventListener('click', (e)=>{
  const li = e.target.closest('li'); if(!li) return;
  langMenu.querySelectorAll('li').forEach(x=>x.removeAttribute('aria-selected'));
  li.setAttribute('aria-selected','true');
  langLabel.textContent = li.getAttribute('data-lang');
});

// ===== Cart badge demo
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
let count = 0;
cartBtn?.addEventListener('click', ()=>{ count=(count+1)%10; cartCount.textContent=count; });

// ===== Bus form validations
const form = document.getElementById('busForm');
const from = document.getElementById('from');
const to = document.getElementById('to');
const depart = document.getElementById('depart');
const ret = document.getElementById('ret');
const pax = document.getElementById('pax');
const cls = document.getElementById('cls');
const directOnly = document.getElementById('directOnly');
const today = new Date().toISOString().split('T')[0];
depart.min = today; ret.min = today;

// Set default date to today
depart.value = today;

// Add visual feedback for date selection
depart.addEventListener('change', ()=>{
  ret.min = depart.value || today;
  if(ret.value && ret.value < ret.min){ ret.value = ret.min; }
  
  // Add visual indicator
  if(depart.value){
    depart.style.borderColor = '#1E90FF';
    depart.style.fontWeight = '600';
  }
});

ret.addEventListener('change', ()=>{
  if(ret.value){
    ret.style.borderColor = '#1E90FF';
    ret.style.fontWeight = '600';
  }
});

form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!depart.value){ 
    alert('⚠️ Please select a departure date.'); 
    depart.focus();
    return; 
  }
  if(ret.value && ret.value <= depart.value){ 
    alert('⚠️ Return date must be after departure date.'); 
    ret.focus();
    return; 
  }
  
  // Validate from/to cities
  if(!from.value || !to.value){
    alert('⚠️ Please enter both departure and destination cities.');
    (!from.value ? from : to).focus();
    return;
  }
  
  // Validate cities exist in location list
  const fromValue = from.value.trim();
  const toValue = to.value.trim();
  
  const fromCity = allLocations.find(loc => 
    loc.nameEn.toLowerCase() === fromValue.toLowerCase()
  );
  const toCity = allLocations.find(loc => 
    loc.nameEn.toLowerCase() === toValue.toLowerCase()
  );
  
  if (!fromCity) {
    from.classList.add('invalid-city');
    alert('⚠️ Please select a valid departure city from the dropdown list.');
    from.focus();
    return;
  }
  
  if (!toCity) {
    to.classList.add('invalid-city');
    alert('⚠️ Please select a valid destination city from the dropdown list.');
    to.focus();
    return;
  }
  
  // Build search URL with parameters (matching BusesSearchResults parameter names)
  const params = new URLSearchParams();
  params.set('from', fromValue);
  params.set('to', toValue);
  params.set('depart', depart.value); // This is the key parameter for date-based generation
  if(ret.value) params.set('return', ret.value);
  
  // Extract passenger number from text like "1 Adult" or "2 Adults"
  const paxValue = pax.value.match(/\d+/)?.[0] || '1';
  params.set('passengers', paxValue);
  
  if(cls.value) params.set('class', cls.value);
  if(directOnly?.checked) params.set('directOnly', 'true');
  
  // Show loading feedback
  const submitBtn = form.querySelector('.search-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '🔍 Searching...';
  submitBtn.disabled = true;
  
  // Redirect to search results page
  setTimeout(() => {
    window.location.href = `../Services/Buses/BusesSearchResults.html?${params.toString()}`;
  }, 300);
});

// ===== Trip ideas filter
const chips = document.getElementById('chips');
const grid  = document.getElementById('ideasGrid');
const selected = new Set();

function applyFilter(){
  const cards = grid.querySelectorAll('.idea');
  if(selected.size === 0){ cards.forEach(c=>c.style.display=''); return; }
  cards.forEach(card=>{
    const tags = (card.dataset.tags || '').split(',').map(s=>s.trim());
    const ok = Array.from(selected).every(tag => tags.includes(tag));
    card.style.display = ok ? '' : 'none';
  });
}
chips?.addEventListener('click', (e)=>{
  const btn = e.target.closest('.chip'); if(!btn) return;
  const tag = btn.dataset.tag;
  btn.classList.toggle('active');
  btn.classList.contains('active') ? selected.add(tag) : selected.delete(tag);
  applyFilter();
});
