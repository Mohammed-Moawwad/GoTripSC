// Mobile menu
<<<<<<< Updated upstream
const menuToggle = document.getElementById("menuToggle");
const mobilePanel = document.getElementById("mobilePanel");
menuToggle?.addEventListener("click", () => {
  const open = !mobilePanel.hasAttribute("hidden");
  open
    ? mobilePanel.setAttribute("hidden", "")
    : mobilePanel.removeAttribute("hidden");
  menuToggle.setAttribute("aria-expanded", String(!open));
});

// Language dropdown
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langLabel = document.getElementById("langLabel");
const langBtnMobile = document.getElementById("langBtnMobile");
const langLabelMobile = document.getElementById("langLabelMobile");

function toggleLang(open) {
  if (!langMenu) return;
  if (open) {
    langMenu.style.display = "block";
    langBtn.setAttribute("aria-expanded", "true");
    langMenu.focus();
  } else {
    langMenu.style.display = "none";
    langBtn.setAttribute("aria-expanded", "false");
  }
}
langBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleLang(langMenu.style.display !== "block");
});
document.addEventListener("click", (e) => {
  if (langMenu && !langMenu.contains(e.target) && e.target !== langBtn)
    toggleLang(false);
});
langMenu?.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  langMenu
    .querySelectorAll("li")
    .forEach((x) => x.removeAttribute("aria-selected"));
  li.setAttribute("aria-selected", "true");
  const chosen = li.getAttribute("data-lang");
  langLabel.textContent = chosen;
  if (langLabelMobile) langLabelMobile.textContent = chosen;
});
langBtnMobile?.addEventListener("click", () => {
  const items = Array.from(langMenu.querySelectorAll("li"));
  const idx = items.findIndex(
    (li) => li.getAttribute("aria-selected") === "true"
  );
  items[(idx + 1) % items.length].click();
});

// Cart demo
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
let count = 0;
cartBtn?.addEventListener("click", () => {
  count = (count + 1) % 10;
  cartCount.textContent = count;
});

// Tabs
const tabRound = document.getElementById("tab-round");
const tabOne = document.getElementById("tab-one");
const tabMulti = document.getElementById("tab-multi");
const returnField = document.getElementById("returnField");

function setActiveTab(btn) {
  [tabRound, tabOne, tabMulti].forEach((b) => {
    b.classList.toggle("active", b === btn);
    b.setAttribute("aria-selected", b === btn ? "true" : "false");
  });
  if (btn === tabOne) {
    returnField.style.display = "none";
  } else {
    returnField.style.display = "";
  }
}
tabRound?.addEventListener("click", () => setActiveTab(tabRound));
tabOne?.addEventListener("click", () => setActiveTab(tabOne));
tabMulti?.addEventListener("click", () => setActiveTab(tabMulti));

// Trip Ideas filter
const chips = document.getElementById("chips");
const grid = document.getElementById("ideasGrid");
const selected = new Set();

function applyFilter() {
  const cards = grid.querySelectorAll(".idea-card");
  if (selected.size === 0) {
    cards.forEach((c) => (c.style.display = ""));
    return;
  }
  cards.forEach((card) => {
    const tags = (card.dataset.tags || "").split(",").map((s) => s.trim());
    const ok = Array.from(selected).every((tag) => tags.includes(tag));
    card.style.display = ok ? "" : "none";
  });
}
chips?.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  const tag = btn.dataset.tag;
  btn.classList.toggle("active");
  btn.classList.contains("active") ? selected.add(tag) : selected.delete(tag);
  applyFilter();
});

// Search form will use native HTML5 validation and form action
// No JavaScript override needed - browser will show "Please fill out this field" messages
=======
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
menuToggle?.addEventListener('click', () => {
  const open = !mobilePanel.hasAttribute('hidden');
  open ? mobilePanel.setAttribute('hidden', '') : mobilePanel.removeAttribute('hidden');
  menuToggle.setAttribute('aria-expanded', String(!open));
});

// Language dropdown
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
const langLabel = document.getElementById('langLabel');
const langBtnMobile = document.getElementById('langBtnMobile');
const langLabelMobile = document.getElementById('langLabelMobile');

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
  const chosen = li.getAttribute('data-lang');
  langLabel.textContent = chosen;
  if (langLabelMobile) langLabelMobile.textContent = chosen;
});
langBtnMobile?.addEventListener('click', ()=>{
  const items = Array.from(langMenu.querySelectorAll('li'));
  const idx = items.findIndex(li=>li.getAttribute('aria-selected')==='true');
  items[(idx+1)%items.length].click();
});

// Cart demo
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
let count = 0;
cartBtn?.addEventListener('click', ()=>{ count=(count+1)%10; cartCount.textContent=count; });

// Tabs
const tabRound = document.getElementById('tab-round');
const tabOne   = document.getElementById('tab-one');
const tabMulti = document.getElementById('tab-multi');
const returnField = document.getElementById('returnField');

function setActiveTab(btn){
  [tabRound, tabOne, tabMulti].forEach(b=>{
    b.classList.toggle('active', b === btn);
    b.setAttribute('aria-selected', b===btn ? 'true' : 'false');
  });
  if(btn === tabOne){ returnField.style.display='none'; }
  else{ returnField.style.display=''; }
}
tabRound?.addEventListener('click', ()=>setActiveTab(tabRound));
tabOne  ?.addEventListener('click', ()=>setActiveTab(tabOne));
tabMulti?.addEventListener('click', ()=>setActiveTab(tabMulti));

// Trip Ideas filter
const chips = document.getElementById('chips');
const grid  = document.getElementById('ideasGrid');
const selected = new Set();

function applyFilter(){
  if(!grid) return;
  // fixed selector: articles use class "idea" in HTML (was ".idea-card")
  const cards = grid.querySelectorAll('.idea');
  if(cards.length === 0) return;
  if(selected.size === 0){
    cards.forEach(c=>c.style.display='');
    return;
  }
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

// Search form demo
document.getElementById('flightForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const form = e.target;
  // build query string from form fields (ensure your inputs have "name" attributes)
  const params = new URLSearchParams(new FormData(form));

  // include active trip type tab id (tab-round, tab-one, tab-multi)
  const activeTab = [tabRound, tabOne, tabMulti].find(b => b && b.classList.contains('active'));
  if (activeTab) params.set('tripType', activeTab.id);

  // navigate to results page (in the same folder)
  window.location.href = './flights-results.html?' + params.toString();
});

>>>>>>> Stashed changes
