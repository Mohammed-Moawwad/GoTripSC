// ===== Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
menuToggle?.addEventListener('click', () => {
  const open = !mobilePanel.hasAttribute('hidden');
  open ? mobilePanel.setAttribute('hidden', '') : mobilePanel.removeAttribute('hidden');
  menuToggle.setAttribute('aria-expanded', String(!open));
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

// ===== Hotel form validations
const form = document.getElementById('hotelForm');
const inEl = document.getElementById('checkin');
const outEl = document.getElementById('checkout');
const today = new Date().toISOString().split('T')[0];
inEl.min = today; outEl.min = today;

inEl.addEventListener('change', ()=>{
  outEl.min = inEl.value || today;
  if(outEl.value && outEl.value < outEl.min){ outEl.value = outEl.min; }
});

form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!inEl.value || !outEl.value || outEl.value <= inEl.value){
    alert('Please select a valid check-in and check-out.');
    return;
  }
  alert('Searching hotels… (demo)');
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
