/**
 * MODA RESALE — Modern Fashion Consignment & Resale Boutique
 * Interactive Logic, Toggles & UI Engine
 */

(function () {
  'use strict';

  // --- 1. THEME CONTROLLER ---
  const THEME_KEY = 'moda_theme_pref';

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    setTheme(theme);

    const toggles = document.querySelectorAll('[data-action="toggle-theme"]');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const iconSlots = document.querySelectorAll('.theme-icon-slot');
    iconSlots.forEach(slot => {
      if (theme === 'dark') {
        slot.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      } else {
        slot.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      }
    });
  }

  // --- 2. DIRECTION CONTROLLER (LTR / RTL) ---
  const DIR_KEY = 'moda_dir_pref';

  function initDirection() {
    const saved = localStorage.getItem(DIR_KEY) || 'ltr';
    setDirection(saved);

    const toggles = document.querySelectorAll('[data-action="toggle-dir"]');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        setDirection(next);
      });
    });
  }

  function setDirection(dir) {
    document.documentElement.classList.add('no-transitions');
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transitions');
      });
    });
  }

  // --- 3. MOBILE & TABLET DRAWER ---
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('menuToggle');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const closeBtn = document.getElementById('mobileDrawerClose');

    if (!drawer || !toggleBtn) return;

    function open() {
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
    }

    function close() {
      drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');

      // Reset all drawer sub-menus to closed state so next open is clean & collapsed
      document.querySelectorAll('.mobile-sub-menu').forEach(sub => {
        sub.classList.remove('is-open');
      });
      document.querySelectorAll('.mobile-dropdown-toggle svg').forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
      });
    }

    toggleBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });

    // Sub-menu Accordion inside Drawer
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    dropdownToggles.forEach(t => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        const sub = t.nextElementSibling;
        if (sub) {
          const isOpen = sub.classList.contains('is-open');
          sub.classList.toggle('is-open', !isOpen);
          const icon = t.querySelector('svg');
          if (icon) icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    });
  }

  // --- 4. ACTIVE NAVIGATION HIGHLIGHT ---
  function initActiveNav() {
    let page = window.location.pathname.split('/').pop().split('#')[0].split('?')[0];
    if (!page || page === '') page = 'index.html';

    const links = document.querySelectorAll('.nav-link, .dropdown-card-item, .mobile-nav-link, .mobile-sub-link');
    links.forEach(l => {
      const href = l.getAttribute('href');
      if (href && href !== '#') {
        const file = href.split('/').pop().split('#')[0].split('?')[0];
        if (file === page) {
          l.classList.add('active');
          
          // Desktop dropdown parent
          const parentDd = l.closest('.nav-dropdown');
          if (parentDd) {
            const toggle = parentDd.querySelector('.dropdown-toggle');
            if (toggle) toggle.classList.add('active');
          }

          // Mobile drawer parent item
          const mobileItem = l.closest('.mobile-nav-item');
          if (mobileItem) {
            const mobileToggle = mobileItem.querySelector('.mobile-dropdown-toggle');
            if (mobileToggle) mobileToggle.classList.add('active');
          }
        }
      }
    });

    // Explicit highlight for Home page
    if (page === 'index.html' || page === 'home-2.html') {
      document.querySelectorAll('.dropdown-toggle, .mobile-dropdown-toggle').forEach(btn => {
        if (btn.textContent.includes('Home')) {
          btn.classList.add('active');
        }
      });
    }
  }

  // --- 5. STICKY HEADER & SCROLL TO TOP ---
  function initScrollEffects() {
    const header = document.querySelector('.site-header');
    const scrollBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (header) {
        if (y > 20) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
      }
      if (scrollBtn) {
        if (y > 300) scrollBtn.classList.add('is-visible');
        else scrollBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // --- 6. WISHLIST & CART ENGINE ---
  const DEFAULT_CART = [
    {
      id: 'cart-1',
      name: 'Hermes Birkin 25 Gold Togo Leather',
      brand: 'Handbags · Hermes',
      price: 28500,
      image: 'assets/images/products/prod_hermes_birkin.jpg',
      condition: 'Condition: Pristine · 2023 Stamp B',
      quantity: 1
    },
    {
      id: 'cart-2',
      name: 'Chanel Medium Classic Double Flap',
      brand: 'Handbags · Chanel',
      price: 8900,
      image: 'assets/images/products/prod_chanel_flap.jpg',
      condition: 'Condition: Excellent · 24K Gold Hardware',
      quantity: 1
    },
    {
      id: 'cart-3',
      name: 'Cartier Love Bracelet Small Model',
      brand: 'Fine Jewelry · Cartier',
      price: 4650,
      image: 'assets/images/products/prod_cartier_love.jpg',
      condition: 'Condition: Pristine · Size 17 · 18K Yellow Gold',
      quantity: 1
    }
  ];

  const DEFAULT_WISHLIST = [
    {
      id: 'wish-1',
      name: 'Rolex Datejust 36 Palm Dial',
      brand: 'Watches · Rolex',
      price: 11800,
      image: 'assets/images/products/home2_prod_rolex.jpg',
      condition: 'Condition: Unworn · Complete Box & Papers 2024'
    },
    {
      id: 'wish-2',
      name: 'Burberry Heritage Kensington Gabardine Trench Coat',
      brand: 'Apparel · Burberry',
      price: 1450,
      image: 'assets/images/products/home2_prod_trench_coat.jpg',
      condition: 'Condition: Pristine · Size UK 8 / US 4'
    },
    {
      id: 'wish-3',
      name: 'Gucci Reversible Silk Twill Bomber Jacket',
      brand: 'Apparel · Gucci',
      price: 1650,
      image: 'assets/images/products/prod_gucci_jacket.jpg',
      condition: 'Condition: New with Tags · Size M / IT 48'
    }
  ];

  function getCart() {
    try {
      const stored = localStorage.getItem('moda_cart_items');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem('moda_cart_items', JSON.stringify(DEFAULT_CART));
    return DEFAULT_CART;
  }

  function saveCart(items) {
    try {
      localStorage.setItem('moda_cart_items', JSON.stringify(items));
    } catch (e) {}
    updateCounters();
  }

  function getWishlist() {
    try {
      const stored = localStorage.getItem('moda_wishlist_items');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem('moda_wishlist_items', JSON.stringify(DEFAULT_WISHLIST));
    return DEFAULT_WISHLIST;
  }

  function saveWishlist(items) {
    try {
      localStorage.setItem('moda_wishlist_items', JSON.stringify(items));
    } catch (e) {}
    updateCounters();
  }

  function updateCounters() {
    const cart = getCart();
    const wishlist = getWishlist();
    const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalWishCount = wishlist.length;

    const wBadges = document.querySelectorAll('.wishlist-count');
    wBadges.forEach(b => { b.textContent = totalWishCount; });
    const cBadges = document.querySelectorAll('.cart-count');
    cBadges.forEach(b => { b.textContent = totalCartCount; });
  }

  function initCommerceToggles() {
    updateCounters();

    // Wishlist Buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.wishlist-btn');
      if (btn) {
        e.preventDefault();
        const card = btn.closest('.product-card') || btn.closest('article');
        const name = btn.getAttribute('data-name') || (card ? card.querySelector('.product-name')?.textContent.trim() : 'Luxury Item') || 'Luxury Item';
        const brand = card ? (card.querySelector('.product-cat')?.textContent.trim() || 'Designer') : 'Designer';
        const priceText = card ? (card.querySelector('.product-price-box b, .product-price-box span')?.textContent.replace(/[^0-9]/g, '') || '1200') : '1200';
        const image = card ? (card.querySelector('img')?.getAttribute('src') || 'assets/images/products/prod_chanel_flap.jpg') : 'assets/images/products/prod_chanel_flap.jpg';
        const condition = card ? (card.querySelector('.product-condition')?.textContent.trim() || 'Condition: Pristine') : 'Condition: Pristine';

        let list = getWishlist();
        const existingIdx = list.findIndex(i => i.name === name);

        if (existingIdx > -1) {
          list.splice(existingIdx, 1);
          btn.setAttribute('data-saved', 'false');
          btn.innerHTML = '♡';
          btn.style.color = '';
          showToast(`Removed "${name}" from saved wishlist`);
        } else {
          list.push({
            id: 'wish-' + Date.now(),
            name,
            brand,
            price: parseInt(priceText, 10) || 1200,
            image,
            condition
          });
          btn.setAttribute('data-saved', 'true');
          btn.innerHTML = '♥';
          btn.style.color = '#E24B4B';
          showToast(`Saved "${name}" to your wishlist ♥`);
        }
        saveWishlist(list);
      }

      // Add to Bag Buttons
      const addBtn = e.target.closest('.add-cart-btn');
      if (addBtn) {
        e.preventDefault();
        const card = addBtn.closest('.product-card') || addBtn.closest('article');
        const name = addBtn.getAttribute('data-name') || (card ? card.querySelector('.product-name')?.textContent.trim() : 'Luxury Item') || 'Luxury Item';
        const brand = card ? (card.querySelector('.product-cat')?.textContent.trim() || 'Designer') : 'Designer';
        const priceText = card ? (card.querySelector('.product-price-box b, .product-price-box span')?.textContent.replace(/[^0-9]/g, '') || '1200') : '1200';
        const image = card ? (card.querySelector('img')?.getAttribute('src') || 'assets/images/products/prod_chanel_flap.jpg') : 'assets/images/products/prod_chanel_flap.jpg';
        const condition = card ? (card.querySelector('.product-condition')?.textContent.trim() || 'Condition: Pristine') : 'Condition: Pristine';

        let cart = getCart();
        const existing = cart.find(i => i.name === name);
        if (existing) {
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({
            id: 'cart-' + Date.now(),
            name,
            brand,
            price: parseInt(priceText, 10) || 1200,
            image,
            condition,
            quantity: 1
          });
        }
        saveCart(cart);
        showToast(`Added "${name}" to your shopping bag!`);
      }
    });
  }

  // --- 6.1 DEDICATED CART PAGE RENDERER ---
  function initCartPage() {
    const listEl = document.getElementById('cartItemsList');
    if (!listEl) return;

    const wrapper = document.getElementById('cartLayoutWrapper');
    const emptyEl = document.getElementById('cartEmptyState');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartGrandTotal');
    const discountRow = document.getElementById('discountRow');
    const discountAmountEl = document.getElementById('discountAmount');
    const promoInput = document.getElementById('promoInput');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const clearBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let discountPercent = 0;

    function render() {
      const items = getCart();
      if (!items || items.length === 0) {
        if (wrapper) wrapper.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (wrapper) wrapper.style.display = 'grid';
      if (emptyEl) emptyEl.style.display = 'none';

      listEl.innerHTML = '';
      let subtotal = 0;

      items.forEach((item, index) => {
        const qty = item.quantity || 1;
        const lineTotal = (item.price || 0) * qty;
        subtotal += lineTotal;

        const card = document.createElement('article');
        card.className = 'cart-item-card';
        card.innerHTML = `
          <div class="cart-item-top-row">
            <div class="cart-item-media">
              <img src="${item.image || 'assets/images/products/prod_chanel_flap.jpg'}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
              <span class="cart-item-brand">${item.brand || 'Luxury Designer'}</span>
              <h3 class="cart-item-title">${item.name}</h3>
              <span class="cart-item-condition">${item.condition || 'Condition: Pristine'}</span>
              <button type="button" class="cart-item-remove-btn" data-remove-index="${index}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Remove
              </button>
            </div>
          </div>
          <div class="cart-item-bottom-row">
            <div class="cart-qty-ctrl">
              <button type="button" class="cart-qty-btn" data-qty-action="dec" data-index="${index}" aria-label="Decrease quantity">−</button>
              <span class="cart-qty-val">${qty}</span>
              <button type="button" class="cart-qty-btn" data-qty-action="inc" data-index="${index}" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item-price-box">
              <span class="cart-item-price">$${lineTotal.toLocaleString()}</span>
              <small class="cart-item-unit-price" style="color:var(--text-muted); font-size:0.75rem;">$${(item.price || 0).toLocaleString()} each</small>
            </div>
          </div>
        `;
        listEl.appendChild(card);
      });

      // Update Summary Totals
      if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;

      let discount = 0;
      if (discountPercent > 0) {
        discount = Math.round(subtotal * (discountPercent / 100));
        if (discountRow) discountRow.style.display = 'flex';
        if (discountAmountEl) discountAmountEl.textContent = `-$${discount.toLocaleString()}`;
      } else {
        if (discountRow) discountRow.style.display = 'none';
      }

      const grandTotal = Math.max(0, subtotal - discount);
      if (totalEl) totalEl.textContent = `$${grandTotal.toLocaleString()}`;
    }

    // Event Delegations for Quantity and Remove
    listEl.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-index]');
      if (removeBtn) {
        const idx = parseInt(removeBtn.getAttribute('data-remove-index'), 10);
        let items = getCart();
        const removed = items.splice(idx, 1);
        saveCart(items);
        render();
        if (removed && removed[0]) {
          showToast(`Removed "${removed[0].name}" from bag`);
        }
        return;
      }

      const qtyBtn = e.target.closest('[data-qty-action]');
      if (qtyBtn) {
        const action = qtyBtn.getAttribute('data-qty-action');
        const idx = parseInt(qtyBtn.getAttribute('data-index'), 10);
        let items = getCart();
        if (items[idx]) {
          if (action === 'inc') {
            items[idx].quantity = (items[idx].quantity || 1) + 1;
          } else if (action === 'dec') {
            if ((items[idx].quantity || 1) > 1) {
              items[idx].quantity -= 1;
            } else {
              items.splice(idx, 1);
              showToast('Item removed from shopping bag');
            }
          }
          saveCart(items);
          render();
        }
      }
    });

    // Promo Code Application
    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'MODAVIP10') {
          discountPercent = 10;
          showToast('VIP Promo applied! 10% discount added.');
          render();
        } else if (code) {
          showToast('Invalid promo code. Please try MODAVIP10.');
        }
      });
    }

    // Clear Cart
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        saveCart([]);
        render();
        showToast('Your shopping bag has been cleared.');
      });
    }

    // Checkout
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        showToast('Connecting to secure encrypted checkout gateway...');
        setTimeout(() => {
          showToast('Order confirmed! Our salon concierge will contact you shortly.');
        }, 1500);
      });
    }

    render();
  }

  // --- 6.2 DEDICATED WISHLIST PAGE RENDERER ---
  function initWishlistPage() {
    const gridEl = document.getElementById('wishlistProductGrid');
    if (!gridEl) return;

    const countEl = document.getElementById('wishlistItemsCount');
    const emptyEl = document.getElementById('wishlistEmptyState');
    const barEl = document.getElementById('wishlistBar');
    const moveAllBtn = document.getElementById('moveAllToCartBtn');
    const clearWishlistBtn = document.getElementById('clearWishlistBtn');

    function render() {
      const items = getWishlist();
      if (countEl) countEl.textContent = items.length;

      if (!items || items.length === 0) {
        if (barEl) barEl.style.display = 'none';
        if (gridEl) gridEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (barEl) barEl.style.display = 'flex';
      if (gridEl) gridEl.style.display = 'grid';
      if (emptyEl) emptyEl.style.display = 'none';

      gridEl.innerHTML = '';
      items.forEach((item, index) => {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.innerHTML = `
          <div class="product-photo-wrap">
            <img src="${item.image || 'assets/images/products/prod_chanel_flap.jpg'}" alt="${item.name}">
            <span class="product-tag badge badge-coral">Reserved</span>
            <button type="button" class="wishlist-btn" data-saved="true" data-wish-index="${index}" style="color:#E24B4B;" aria-label="Remove from wishlist">♥</button>
          </div>
          <div class="product-info">
            <span class="product-cat">${item.brand || 'Luxury Designer'}</span>
            <h3 class="product-name">${item.name}</h3>
            <span class="product-condition">${item.condition || 'Condition: Pristine'}</span>
            <div class="product-bottom-row">
              <div class="product-price-box">
                <small>RESALE PRICE</small>
                <b>$${(item.price || 0).toLocaleString()}</b>
              </div>
              <button type="button" class="add-cart-btn" data-move-index="${index}">Add to Bag +</button>
            </div>
          </div>
        `;
        gridEl.appendChild(article);
      });
    }

    // Grid Actions: Move to Bag & Remove
    gridEl.addEventListener('click', (e) => {
      const moveBtn = e.target.closest('[data-move-index]');
      if (moveBtn) {
        e.preventDefault();
        const idx = parseInt(moveBtn.getAttribute('data-move-index'), 10);
        let wish = getWishlist();
        let cart = getCart();

        if (wish[idx]) {
          const item = wish[idx];
          const existing = cart.find(i => i.name === item.name);
          if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
          } else {
            cart.push({ ...item, quantity: 1, id: 'cart-' + Date.now() });
          }
          saveCart(cart);
          wish.splice(idx, 1);
          saveWishlist(wish);
          render();
          showToast(`Moved "${item.name}" to your shopping bag!`);
        }
        return;
      }

      const wishBtn = e.target.closest('[data-wish-index]');
      if (wishBtn) {
        e.preventDefault();
        const idx = parseInt(wishBtn.getAttribute('data-wish-index'), 10);
        let wish = getWishlist();
        if (wish[idx]) {
          const name = wish[idx].name;
          wish.splice(idx, 1);
          saveWishlist(wish);
          render();
          showToast(`Removed "${name}" from saved wishlist`);
        }
      }
    });

    // Move All to Bag
    if (moveAllBtn) {
      moveAllBtn.addEventListener('click', () => {
        let wish = getWishlist();
        if (wish.length === 0) return;
        let cart = getCart();

        wish.forEach(item => {
          const existing = cart.find(i => i.name === item.name);
          if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
          } else {
            cart.push({ ...item, quantity: 1, id: 'cart-' + Date.now() });
          }
        });

        saveCart(cart);
        saveWishlist([]);
        render();
        showToast('Moved all saved wishlist items to your shopping bag!');
      });
    }

    // Clear Wishlist
    if (clearWishlistBtn) {
      clearWishlistBtn.addEventListener('click', () => {
        saveWishlist([]);
        render();
        showToast('Your saved wishlist has been cleared.');
      });
    }

    render();
  }

  // --- 7. INTERACTIVE CONSIGNMENT ESTIMATOR LAB ---
  function initCurateLab() {
    const lab = document.querySelector('.curate-lab-shell');
    if (!lab) return;

    let baseValuation = 4500;
    let payoutRate = 0.85;

    const catButtons = lab.querySelectorAll('.cat-choice-btn');
    const condButtons = lab.querySelectorAll('.cond-choice-btn');
    const totalDisplay = lab.querySelector('.lab-calculated-total');

    function calculate() {
      const total = Math.round(baseValuation * payoutRate);
      if (totalDisplay) {
        totalDisplay.textContent = `$${total.toLocaleString()}`;
      }
    }

    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        baseValuation = parseFloat(btn.getAttribute('data-base') || 4500);
        calculate();
      });
    });

    condButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        condButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        payoutRate = parseFloat(btn.getAttribute('data-rate') || 0.85);
        calculate();
      });
    });

    calculate();
  }

  // --- 8. SHOP CATALOG FILTERS & SORT ENGINE ---
  function initShopCatalogFilters() {
    const filterGroup = document.getElementById('shopFilterGroup');
    const sortSelect = document.getElementById('shopSortSelect');
    const grid = document.getElementById('shopProductGrid');

    if (!filterGroup || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    let currentFilter = 'all';

    function applyFilterAndSort() {
      // 1. Filter
      let visibleCount = 0;
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const isMatch = (currentFilter === 'all' || cat === currentFilter);
        if (isMatch) {
          card.style.display = 'flex';
          card.style.animation = 'modaFadeIn 0.35s ease forwards';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // 2. Sort visible
      const sortMode = sortSelect ? sortSelect.value : 'curated';
      cards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price') || '0');
        const priceB = parseFloat(b.getAttribute('data-price') || '0');
        const idxA = parseInt(a.getAttribute('data-index') || '0', 10);
        const idxB = parseInt(b.getAttribute('data-index') || '0', 10);

        if (sortMode === 'price-asc') return priceA - priceB;
        if (sortMode === 'price-desc') return priceB - priceA;
        if (sortMode === 'newest') return idxB - idxA;
        return idxA - idxB; // curated default
      });

      // Re-append in sorted order
      cards.forEach(card => grid.appendChild(card));
    }

    // Filter Buttons Click
    const filterBtns = filterGroup.querySelectorAll('.choice-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        applyFilterAndSort();
      });
    });

    // Sort Select Change
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        applyFilterAndSort();
      });
    }
  }

  // --- 9. TOAST NOTIFICATION ---
  function showToast(msg) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon-wrap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <span class="toast-text">${msg}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-show'));
    setTimeout(() => {
      toast.classList.remove('is-show');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 350);
    }, 3200);
  }

  window.modaToast = showToast;

  // --- 10. EXCLUSIVE FAQ ACCORDION ENGINE ---
  function initAccordionFaq() {
    const detailsList = document.querySelectorAll('details.faq-details, .faq-accordion-group details');
    detailsList.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          const parentGroup = item.closest('.faq-accordion-group') || item.parentElement;
          if (parentGroup) {
            const siblings = parentGroup.querySelectorAll('details');
            siblings.forEach(sibling => {
              if (sibling !== item && sibling.open) {
                sibling.open = false;
              }
            });
          }
        }
      });
    });
  }

  // --- 11. PASSWORD VISIBILITY TOGGLE ---
  function initPasswordToggles() {
    const toggles = document.querySelectorAll('[data-action="toggle-password"]');
    toggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPass = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPass ? 'text' : 'password');
        if (isPass) {
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
        } else {
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        }
      });
    });
  }

  // --- 12. CUSTOM IN-DOM LUXURY DROPDOWN ENGINE ---
  function initCustomSelects() {
    const selects = document.querySelectorAll('select.form-control');
    selects.forEach(select => {
      if (select.getAttribute('data-customized') === 'true') return;
      select.setAttribute('data-customized', 'true');

      // Create outer wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-dropdown-wrap';
      select.parentNode.insertBefore(wrapper, select);

      // Hide native select accessibility-safely
      select.style.position = 'absolute';
      select.style.opacity = '0';
      select.style.pointerEvents = 'none';
      select.style.width = '0';
      select.style.height = '0';
      select.style.margin = '0';
      select.style.padding = '0';
      select.style.border = 'none';
      select.tabIndex = -1;

      wrapper.appendChild(select);

      // Create Custom Trigger Button
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-dropdown-trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');

      const triggerText = document.createElement('span');
      triggerText.className = 'custom-dropdown-text';
      const selectedOption = select.options[select.selectedIndex];
      triggerText.textContent = selectedOption ? selectedOption.text : 'Select...';

      const arrow = document.createElement('span');
      arrow.className = 'custom-dropdown-arrow';
      arrow.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

      trigger.appendChild(triggerText);
      trigger.appendChild(arrow);
      wrapper.appendChild(trigger);

      // Create Custom Menu Popup
      const menu = document.createElement('div');
      menu.className = 'custom-dropdown-menu';
      menu.setAttribute('role', 'listbox');

      function buildOptions() {
        menu.innerHTML = '';
        Array.from(select.options).forEach((opt, idx) => {
          const optEl = document.createElement('div');
          optEl.className = 'custom-dropdown-option' + (idx === select.selectedIndex ? ' is-selected' : '') + (opt.disabled ? ' is-disabled' : '');
          optEl.setAttribute('role', 'option');
          optEl.setAttribute('data-value', opt.value);
          optEl.textContent = opt.text;

          if (!opt.disabled) {
            optEl.addEventListener('click', (e) => {
              e.stopPropagation();
              select.selectedIndex = idx;
              triggerText.textContent = opt.text;

              // Fire native change event
              const evt = new Event('change', { bubbles: true });
              select.dispatchEvent(evt);

              // Update option styling
              menu.querySelectorAll('.custom-dropdown-option').forEach(o => o.classList.remove('is-selected'));
              optEl.classList.add('is-selected');

              closeDropdown();
            });
          }
          menu.appendChild(optEl);
        });
      }

      buildOptions();
      wrapper.appendChild(menu);

      function openDropdown() {
        // Close other open dropdowns first
        document.querySelectorAll('.custom-dropdown-wrap.is-open').forEach(w => {
          if (w !== wrapper) {
            w.classList.remove('is-open');
            const t = w.querySelector('.custom-dropdown-trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
        wrapper.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function closeDropdown() {
        wrapper.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (wrapper.classList.contains('is-open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      // Synchronize when select is programmatically changed
      select.addEventListener('change', () => {
        const curOpt = select.options[select.selectedIndex];
        if (curOpt) {
          triggerText.textContent = curOpt.text;
          menu.querySelectorAll('.custom-dropdown-option').forEach((o, i) => {
            o.classList.toggle('is-selected', i === select.selectedIndex);
          });
        }
      });
    });

    // Global outside click listener
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-dropdown-wrap')) {
        document.querySelectorAll('.custom-dropdown-wrap.is-open').forEach(w => {
          w.classList.remove('is-open');
          const t = w.querySelector('.custom-dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.custom-dropdown-wrap.is-open').forEach(w => {
          w.classList.remove('is-open');
          const t = w.querySelector('.custom-dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // --- 13. EXCLUSIVE LUXURY PRELOADER ---
  function initPreloader() {
    let loader = document.getElementById('pageLoader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'pageLoader';
      loader.className = 'page-loader';
      loader.setAttribute('aria-hidden', 'true');
      loader.innerHTML = `
        <div class="loader-inner">
          <div class="loader-emblem-wrap">
            <div class="loader-halo"></div>
            <div class="loader-spinner"></div>
            <div class="loader-emblem">
              <img src="assets/images/logo.svg" alt="Moda Resale" width="28" height="28">
            </div>
          </div>
          <div class="loader-brand">MODA<span>RESALE</span></div>
          <div class="loader-tagline">Curated Luxury Archive</div>
          <div class="loader-progress-track">
            <div class="loader-progress-fill" id="loaderProgressFill"></div>
          </div>
          <div class="loader-status-row">
            <span class="loader-status-text" id="loaderStatusText">Authenticating</span>
            <span class="loader-percent" id="loaderPercent">18%</span>
          </div>
        </div>
      `;
      if (document.body) {
        document.body.prepend(loader);
      } else {
        document.documentElement.appendChild(loader);
      }
    }

    const progressFill = document.getElementById('loaderProgressFill') || loader.querySelector('.loader-progress-fill');
    const percentLabel = document.getElementById('loaderPercent') || loader.querySelector('.loader-percent');
    const statusText = document.getElementById('loaderStatusText') || loader.querySelector('.loader-status-text');

    let currentPercent = 18;
    const interval = setInterval(() => {
      if (currentPercent < 90) {
        currentPercent += Math.floor(Math.random() * 14) + 6;
        if (currentPercent > 90) currentPercent = 90;
        if (progressFill) progressFill.style.width = currentPercent + '%';
        if (percentLabel) percentLabel.textContent = currentPercent + '%';
      }
    }, 40);

    function hideLoader() {
      clearInterval(interval);
      if (progressFill) progressFill.style.width = '100%';
      if (percentLabel) percentLabel.textContent = '100%';
      if (statusText) statusText.textContent = 'Ready';

      setTimeout(() => {
        if (loader) {
          loader.classList.add('is-loaded');
          setTimeout(() => {
            loader.style.display = 'none';
          }, 600);
        }
      }, 280);
    }

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
      setTimeout(hideLoader, 2500); // Fallback timeout
    }
  }

  // --- 14. HOMEPAGE 1 CURATED TABS ENGINE ---
  function initHome1Tabs() {
    const tabBtns = document.querySelectorAll('.home1-tab-btn');
    const cards = document.querySelectorAll('.home1-product-grid .product-card');
    if (!tabBtns.length || !cards.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        tabBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const filter = btn.getAttribute('data-filter') || 'all';

        cards.forEach(card => {
          const cat = card.getAttribute('data-category') || 'all';
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            card.style.animation = 'modaFadeIn 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 15. HOMEPAGE 2 VAULT COUNTDOWN & EXPRESS CONSIGN ---
  function initVaultFeatures() {
    const timerEls = document.querySelectorAll('.vault-countdown-timer');
    if (timerEls.length > 0) {
      let secondsRemaining = 3 * 3600 + 42 * 60 + 15;
      setInterval(() => {
        if (secondsRemaining > 0) {
          secondsRemaining--;
          const hrs = Math.floor(secondsRemaining / 3600).toString().padStart(2, '0');
          const mins = Math.floor((secondsRemaining % 3600) / 60).toString().padStart(2, '0');
          const secs = (secondsRemaining % 60).toString().padStart(2, '0');
          timerEls.forEach(el => {
            el.textContent = `${hrs}:${mins}:${secs}`;
          });
        }
      }, 1000);
    }

    const expressForm = document.getElementById('expressConsignForm');
    if (expressForm) {
      expressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Instant appraisal request received! Our senior authenticator will WhatsApp/email you in 15 minutes.');
        expressForm.reset();
      });
    }
  }

  // --- BOOTSTRAP ---
  initPreloader();

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDirection();
    initMobileDrawer();
    initActiveNav();
    initScrollEffects();
    initCommerceToggles();
    initCurateLab();
    initShopCatalogFilters();
    initAccordionFaq();
    initPasswordToggles();
    initCustomSelects();
    initCartPage();
    initWishlistPage();
    initHome1Tabs();
    initVaultFeatures();
  });
})();



