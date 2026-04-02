/**
 * main.js — Fast Casual Kitchen
 * ITEC 3230 Group Project
 *
 * Handles:
 *  1. Menu page — category filter
 *  2. Customize page — spice warning modal, qty stepper, live price
 */

'use strict';

/* ============================================================
   1. MENU PAGE — Category Filter
============================================================ */
(function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.menu-grid [data-cat]');
  const noResults  = document.getElementById('no-results');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.cat === 'all') {
        // All: clear everything, show all cards
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cards.forEach(card => card.classList.remove('hidden'));
        if (noResults) noResults.style.display = 'none';
        return;
      }

      // Toggle this filter
      btn.classList.toggle('active');

      // Deactivate "All" whenever a specific filter is active
      document.querySelector('.filter-btn[data-cat="all"]').classList.remove('active');

      // Collect all active category filters
      const activeCats = [...document.querySelectorAll('.filter-btn.active')].map(b => b.dataset.cat);

      // If nothing selected, revert to All
      if (activeCats.length === 0) {
        document.querySelector('.filter-btn[data-cat="all"]').classList.add('active');
        cards.forEach(card => card.classList.remove('hidden'));
        if (noResults) noResults.style.display = 'none';
        return;
      }

      let visible = 0;
      cards.forEach(card => {
        const show = activeCats.includes(card.dataset.cat);
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });

      if (noResults) {
        noResults.style.display = visible === 0 ? 'block' : 'none';
      }
    });
  });
})();


/* ============================================================
   2. CUSTOMIZE PAGE
============================================================ */
(function initCustomize() {
  // Item data — maps URL ?item= param to display info
  const ITEMS = {
    'buffalo-chicken-wrap': { name: 'Buffalo Chicken Wrap', badge: 'Wraps',  price: 12.99, desc: 'Crispy buffalo-tossed chicken, crunchy lettuce, and creamy ranch.', allergens: 'Gluten, Dairy, Soy' },
    'chicken-shawarma':     { name: 'Chicken Shawarma',     badge: 'Wraps',  price: 12.99, desc: 'Roasted spiced chicken with pickled turnips and garlic tahini.', allergens: 'Gluten, Sesame' },
    'grain-bowl':           { name: 'Grain Bowl',           badge: 'Bowls',  price: 15.00, desc: 'Quinoa, roasted veggies, and chickpeas with lemon vinaigrette.', allergens: 'Vegan & Gluten-Friendly' },
    'burrito-bowl':         { name: 'Burrito Bowl',         badge: 'Bowls',  price: 17.99, desc: 'Zesty rice, black beans, corn salsa, and fresh avocado.', allergens: 'None (Vegan)' },
    'spicy-tuna-wrap':      { name: 'Spicy Tuna Wrap',      badge: 'Wraps',  price: 13.99, desc: 'Seared spicy tuna, avocado, cucumber, and sriracha mayo in a whole wheat wrap.', allergens: 'Gluten, Fish, Sesame' },
    'caesar-wrap':          { name: 'Caesar Wrap',          badge: 'Wraps',  price: 11.99, desc: 'Grilled chicken, romaine, parmesan, and house Caesar dressing in a spinach tortilla.', allergens: 'Gluten, Dairy, Egg' },
    'protein-bowl':         { name: 'Protein Bowl',         badge: 'Bowls',  price: 16.99, desc: 'Double protein on brown rice with edamame, shredded carrots, and sesame ginger dressing.', allergens: 'Sesame, Soy' },
    'side-salad':           { name: 'Side Salad',           badge: 'Side',   price: 5.99,  desc: 'Mixed greens, cherry tomatoes, cucumber, and red onion with choice of dressing.', allergens: 'None' },
    'loaded-fries':         { name: 'Loaded Fries',         badge: 'Side',   price: 6.99,  desc: 'Crispy seasoned fries with melted cheddar, jalapeños, sour cream, and chipotle sauce.', allergens: 'Dairy, Gluten' },
    'garlic-bread':         { name: 'Garlic Bread',         badge: 'Side',   price: 3.99,  desc: 'Toasted flatbread with herb butter and roasted garlic, served with marinara.', allergens: 'Gluten, Dairy' },
  };

  // Elements
  const itemNameEl  = document.getElementById('item-name');
  const itemBadgeEl = document.getElementById('item-badge');
  const itemPriceEl = document.getElementById('item-price');
  let ctaPriceEl    = document.getElementById('cta-price');
  const qtyDisplay  = document.getElementById('qty-display');
  const qtyMinus    = document.getElementById('qty-minus');
  const qtyPlus     = document.getElementById('qty-plus');
  const addCartBtn  = document.getElementById('add-to-cart-btn');
  const spiceBtns   = document.querySelectorAll('.spice-btn');
  const spiceModal  = document.getElementById('spice-modal');
  const spiceCancel = document.getElementById('spice-cancel');
  const spiceConfirm = document.getElementById('spice-confirm');

  if (!itemNameEl) return; // Not on customize page

  // ── Pre-fill item from URL param ──
  const params   = new URLSearchParams(window.location.search);
  const itemKey  = params.get('item') || 'burrito-bowl';
  const itemData = ITEMS[itemKey] || ITEMS['burrito-bowl'];

  let basePrice = itemData.price;
  let qty = 1;
  let pendingSpiceLevel = null;

  if (itemNameEl)  itemNameEl.textContent  = itemData.name;
  if (itemBadgeEl) itemBadgeEl.textContent = itemData.badge;
  if (itemPriceEl) itemPriceEl.textContent = '$' + basePrice.toFixed(2);
  if (ctaPriceEl)  ctaPriceEl.textContent  = '$' + (basePrice * qty).toFixed(2);

  // ── Quantity stepper ──
  function updateCTAPrice() {
    if (ctaPriceEl) {
      ctaPriceEl.textContent = '$' + (basePrice * qty).toFixed(2);
    }
    if (qtyDisplay) qtyDisplay.textContent = qty;
  }

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (qty > 1) { qty--; updateCTAPrice(); }
    });
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (qty < 20) { qty++; updateCTAPrice(); }
    });
  }

  // ── Spice level buttons ──
  // Clicking "Hot" or "Extra Hot" triggers the warning modal (as shown in Figma)
  spiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.level;

      if ((level === 'hot' || level === 'extra-hot') && spiceModal) {
        // Show warning modal — don't apply yet
        pendingSpiceLevel = btn;
        bootstrap.Modal.getOrCreateInstance(spiceModal).show();
      } else {
        // Apply immediately
        spiceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Modal: Cancel — don't change spice
  if (spiceCancel) {
    spiceCancel.addEventListener('click', () => {
      bootstrap.Modal.getOrCreateInstance(spiceModal).hide();
      pendingSpiceLevel = null;
    });
  }

  // Modal: Confirm — apply the high spice selection
  if (spiceConfirm) {
    spiceConfirm.addEventListener('click', () => {
      if (pendingSpiceLevel) {
        spiceBtns.forEach(b => b.classList.remove('active'));
        pendingSpiceLevel.classList.add('active');
        pendingSpiceLevel = null;
      }
      bootstrap.Modal.getOrCreateInstance(spiceModal).hide();
    });
  }

  // Reset pending level if modal is dismissed via backdrop/keyboard
  if (spiceModal) {
    spiceModal.addEventListener('hidden.bs.modal', () => {
      pendingSpiceLevel = null;
    });
  }

  // ── Add to Cart button ──
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      // Gather selections
      const size    = document.querySelector('input[name="size"]:checked')?.value || 'medium';
      const protein = document.querySelector('input[name="protein"]:checked')?.value || 'chicken';
      const toppings = [...document.querySelectorAll('input[name="toppings"]:checked')].map(c => c.value);
      const sauces   = [...document.querySelectorAll('input[name="sauces"]:checked')].map(c => c.value);
      const spice    = document.querySelector('.spice-btn.active')?.dataset.level || 'no-spice';

      const order = { item: itemData.name, size, protein, toppings, sauces, spice, qty, price: basePrice * qty };
      console.log('Order added to cart:', order);

      // Visual feedback
      addCartBtn.textContent = '✓ Added to Cart!';
      addCartBtn.style.backgroundColor = '#2a9d1a';
      setTimeout(() => {
        addCartBtn.innerHTML = 'Add to Cart - <span id="cta-price">$' + (basePrice * qty).toFixed(2) + '</span>';
        addCartBtn.style.backgroundColor = '';
        ctaPriceEl = document.getElementById('cta-price');
      }, 1800);
    });
  }

})();
