// ============================================================
// GITAM Food Hub Pro — Core Engine
// ============================================================

const FHP = {
  cart: JSON.parse(localStorage.getItem('fhp_cart')) || [],
  cartRestId: localStorage.getItem('fhp_cartRestId') || null,
  orders: JSON.parse(localStorage.getItem('fhp_orders')) || [],
  wishlist: JSON.parse(localStorage.getItem('fhp_wishlist')) || [],
  dietFilter: localStorage.getItem('fhp_dietFilter') || 'all',
  currentTheme: localStorage.getItem('theme') || 'light',
  currentView: 'home',
  viewHistory: [],  // 🆕 Back Navigation History
  
  // App Init
  init() {
    this.applyTheme(this.currentTheme);
    setTimeout(() => {
      document.getElementById('splash-screen').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        this.renderHome();
        this.updateCartBadge();
        this.checkAuthUI();
        this.startLiveTicker();
      }, 500);
    }, 1500);

    // Vanilla Tilt init
    if(typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 5, speed: 400, glare: true, "max-glare": 0.2
      });
    }

    // 🆕 Navbar search input listener
    const navSearch = document.getElementById('search-input');
    if(navSearch) {
      navSearch.addEventListener('input', () => {
        const val = navSearch.value.trim();
        if(val.length > 0) {
          this.navigate('search');
          const pageInput = document.getElementById('search-page-input');
          if(pageInput) { pageInput.value = val; this.pageSearch(val); }
        }
      });
    }
  },

  // ---- Navigation Engine ----
  navigate(viewId, payload = null) {
    // Track history for back navigation
    if (this.currentView !== viewId) {
      this.viewHistory.push(this.currentView);
    }
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(`view-${viewId}`);
    if (!targetView) { console.warn('View not found:', viewId); return; }
    targetView.classList.add('active');
    this.currentView = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if(viewId === 'home') this.renderHome();
    if(viewId === 'menu') this.renderMenuPage(payload);
    if(viewId === 'cart') this.renderCart();
    if(viewId === 'checkout') this.renderCheckout();
    if(viewId === 'search') {
      this.renderSearchPage();
      setTimeout(() => { const el = document.getElementById('search-page-input'); if(el) el.focus(); }, 100);
    }
    if(viewId === 'orders') this.renderOrders();
    if(viewId === 'wishlist') this.renderWishlist();
    if(viewId === 'profile') this.renderProfile();
  },

  // 🆕 Go Back in history
  goBack() {
    if (this.viewHistory.length > 0) {
      const prev = this.viewHistory.pop();
      // Navigate without adding to history again
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const t = document.getElementById(`view-${prev}`);
      if(t) t.classList.add('active');
      this.currentView = prev;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if(prev === 'home') this.renderHome();
      if(prev === 'search') this.renderSearchPage();
    } else {
      this.navigate('home');
    }
  },

  setMobNav(btn) {
    document.querySelectorAll('.mob-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  // ---- Real-time / Live Ticker ----
  startLiveTicker() {
    const msgs = [
      `🔥 ${Math.floor(Math.random()*15)+5} people are ordering Chicken Biryani right now!`,
      `⏳ Only 2 portions of Mutton Biryani left at Spice Garden!`,
      `🎁 Use code SAVE50 to get 50% OFF`,
      `🛒 A user just ordered a Margherita Pizza!`
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % msgs.length;
      const el = document.getElementById('live-msg');
      if(el) {
        el.style.opacity = '0';
        setTimeout(() => { el.innerText = msgs[i]; el.style.opacity = '1'; }, 300);
      }
    }, 4000);
  },

  // ---- Home Rendering ----
  renderHome() {
    // Categories
    const catRow = document.getElementById('category-row');
    catRow.innerHTML = APP_DATA.categories.map(c => `
      <div class="cat-item" onclick="FHP.navigate('search'); document.getElementById('search-page-input').value='${c.label}'; FHP.pageSearch('${c.label}')">
        <div class="cat-icon-wrap">${c.icon}</div>
        <span class="cat-label">${c.label}</span>
      </div>
    `).join('');

    // Offers
    const offRow = document.getElementById('offers-scroll');
    const gradients = ['linear-gradient(135deg, #ff416c, #ff4b2b)', 'linear-gradient(135deg, #11998e, #38ef7d)', 'linear-gradient(135deg, #8E2DE2, #4A00E0)', 'linear-gradient(135deg, #f12711, #f5af19)'];
    offRow.innerHTML = Object.keys(APP_DATA.coupons).map((k, i) => {
      const c = APP_DATA.coupons[k];
      return `
      <div class="offer-card" style="background:${gradients[i%4]}" onclick="FHP.copyCoupon('${k}')">
        <div class="offer-code">${k}</div>
        <div class="offer-desc">${c.desc}</div>
      </div>
    `}).join('');

    // Restaurants
    this.filterRestaurants('all');
    
    setTimeout(() => { document.getElementById('skeleton-grid').style.display='none'; document.getElementById('rest-grid').style.display='grid'; }, 500);

    // Personalization
    if(this.orders.length > 0) {
      document.getElementById('recommended-section').style.display = 'block';
      this.renderPersonalized();
    }
  },

  // 🆕 Render personalized items from past orders
  renderPersonalized() {
    const recRow = document.getElementById('recommended-row');
    if(!recRow) return;
    const orderedItemIds = this.orders.flatMap(o => o.items.map(i => i.baseId || i.id));
    const allItems = [];
    APP_DATA.restaurants.forEach(r => r.menu.forEach(m => allItems.push({ ...m, restId: r.id, restName: r.name })));
    const recs = allItems.filter(m => orderedItemIds.includes(m.id)).slice(0, 5);
    if(recs.length === 0) { document.getElementById('recommended-section').style.display = 'none'; return; }
    recRow.innerHTML = recs.map(m => `
      <div class="suggest-card" onclick="FHP.navigate('menu','${m.restId}')">
        <img src="${m.image}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;">
        <div style="padding:8px;font-size:0.85rem;font-weight:700;">${m.name}</div>
        <div style="padding:0 8px 8px;font-size:0.8rem;color:var(--text-secondary);">₹${m.price}</div>
      </div>
    `).join('');
  },

  filterRestaurants(filterType, btnNode = null) {
    if(btnNode) {
      document.querySelectorAll('.fchip').forEach(b => b.classList.remove('active'));
      btnNode.classList.add('active');
    }
    
    let list = APP_DATA.restaurants;
    if(filterType === 'veg') list = list.filter(r => r.isVegOnly);
    if(filterType === 'fast') list = list.sort((a,b) => a.deliveryTime - b.deliveryTime);
    if(filterType === 'rated') list = list.sort((a,b) => b.rating - a.rating);
    if(filterType === 'low') list = list.sort((a,b) => a.costForTwo - b.costForTwo);

    const grid = document.getElementById('rest-grid');
    grid.innerHTML = list.map(r => this.createRestCard(r)).join('');
  },

  createRestCard(r) {
    let tagsHTML = '';
    if(r.offer) tagsHTML += `<span class="rtag promo"><i class="fa-solid fa-tag"></i> ${r.offer}</span>`;
    if(r.tags.includes('Trending')) tagsHTML += `<span class="rtag">🔥 Trending</span>`;
    
    const isFav = this.wishlist.includes(r.id);
    const favClass = isFav ? 'saved' : '';
    const favIcon = isFav ? 'fa-solid' : 'fa-regular';

    return `
      <div class="rest-card" onclick="FHP.navigate('menu', '${r.id}')">
        <div class="rest-img-wrap">
          <img src="${r.image}" class="rest-img" alt="${r.name}" loading="lazy">
          <div class="rest-tags">${tagsHTML}</div>
          <div class="rest-fav ${favClass}" onclick="event.stopPropagation(); FHP.toggleFav('${r.id}', this)"><i class="${favIcon} fa-heart"></i></div>
        </div>
        <div class="rest-info">
          <div class="rest-name">${r.name}</div>
          <div class="rest-cuisines">${r.cuisines.join(', ')}</div>
          <div class="rest-meta">
            <span class="rest-rating"><i class="fa-solid fa-star"></i> ${r.rating}</span>
            <span class="rmeta-time"><i class="fa-solid fa-clock"></i> ${r.deliveryTime} mins</span>
            <span>₹${r.costForTwo} for two</span>
          </div>
        </div>
      </div>
    `;
  },

  toggleFav(id, btnNode) {
    const idx = this.wishlist.indexOf(id);
    if(idx === -1) {
      this.wishlist.push(id);
      btnNode.classList.add('saved');
      btnNode.innerHTML = '<i class="fa-solid fa-heart"></i>';
      this.showToast('Added to Wishlist ❤️');
    } else {
      this.wishlist.splice(idx, 1);
      btnNode.classList.remove('saved');
      btnNode.innerHTML = '<i class="fa-regular fa-heart"></i>';
      this.showToast('Removed from Wishlist 💔');
    }
    localStorage.setItem('fhp_wishlist', JSON.stringify(this.wishlist));
    if(this.currentView === 'wishlist') this.renderWishlist();
  },

  // ---- Menu Page & Filtering Engine ----
  activeRest: null,
  
  setDietFilter(type, btnNode) {
    this.dietFilter = type;
    localStorage.setItem('fhp_dietFilter', type);
    if(btnNode) {
      document.querySelectorAll('.diet-btn').forEach(b => b.classList.remove('active'));
      btnNode.classList.add('active');
    }
    this.renderMenu();
  },

  renderMenuPage(restId) {
    this.activeRest = APP_DATA.restaurants.find(r => r.id === restId);
    if(!this.activeRest) return;
    
    const r = this.activeRest;
    document.getElementById('rest-banner').style.backgroundImage = `url(${r.image})`;
    document.getElementById('rest-banner').innerHTML = `
      <div class="rest-banner-content">
        <div class="rb-name">${r.name}</div>
        <div class="rb-meta">
          <span><i class="fa-solid fa-star" style="color:var(--gold)"></i> ${r.rating} (${r.reviewCount})</span>
          <span><i class="fa-solid fa-clock"></i> ${r.deliveryTime} mins</span>
          <span><i class="fa-solid fa-location-dot"></i> ${r.distance} km</span>
        </div>
        ${r.offer ? `<div class="rb-offer">${r.offer} • Code: ${r.offerCode}</div>` : ''}
      </div>
    `;
    
    // reset filters except diet (which persists from storage)
    document.getElementById('sort-filter').value = 'none';
    if(document.getElementById('menu-search')) document.getElementById('menu-search').value = '';
    
    // Update active button to match state
    document.querySelectorAll('.diet-btn').forEach(btn => {
      btn.classList.remove('active');
      if(btn.dataset.type === this.dietFilter) btn.classList.add('active');
    });

    this.renderMenu();
  },

  renderMenu() {
    if(!this.activeRest) return;
    let list = [...this.activeRest.menu];
    
    // 1. Diet Filter
    if(this.dietFilter === 'veg') list = list.filter(m => m.isVeg);
    else if(this.dietFilter === 'nonveg') list = list.filter(m => !m.isVeg);

    // 2. Search Filter (Real-time)
    const searchVal = (document.getElementById('menu-search')?.value || '').toLowerCase();
    if(searchVal) {
      list = list.filter(m => m.name.toLowerCase().includes(searchVal) || m.description.toLowerCase().includes(searchVal));
    }
    
    // 3. Sort Filter
    const sort = document.getElementById('sort-filter').value;
    if(sort === 'low') list.sort((a,b) => a.price - b.price);
    if(sort === 'high') list.sort((a,b) => b.price - a.price);
    if(sort === 'rating') list.sort((a,b) => b.rating - a.rating);
    if(sort === 'popular') list.sort((a,b) => b.orderedCount - a.orderedCount);

    const grid = document.getElementById('menu-grid');
    const countText = document.getElementById('menu-count-text');

    // Handle Empty State
    if(list.length === 0) {
      if(countText) countText.innerText = `Showing 0 Items`;
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px; color: var(--text-secondary); background: var(--surface); border-radius: var(--radius-md); border: 1px dashed var(--border);">
          <i class="fa-solid fa-utensils" style="font-size:4rem; opacity:0.3; margin-bottom:16px;"></i>
          <h2 style="font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">❌ No matching items</h2>
          <p>Try changing your filter or search query</p>
          <button class="btn btn-outline mt-md" onclick="FHP.setDietFilter('all', document.querySelector('.diet-btn[data-type=all]')); document.getElementById('menu-search').value = ''; FHP.renderMenu();">Clear Filters</button>
        </div>
      `;
      return;
    }

    // Update Count DOM
    if(countText) {
      let fText = this.dietFilter === 'veg' ? 'Veg ' : (this.dietFilter === 'nonveg' ? 'Non-Veg ' : '');
      countText.innerText = `Showing ${list.length} ${fText}Items`;
    }

    grid.innerHTML = list.map(m => `
      <div class="menu-item">
        <div class="mi-info">
          <div class="mi-type ${m.isVeg ? '' : 'nv'}"></div>
          <div class="mi-name">${m.name}</div>
          <div class="mi-price">₹${m.price} ${m.mrp > m.price ? `<span class="mi-mrp">₹${m.mrp}</span>` : ''}</div>
          <div class="mi-rating"><i class="fa-solid fa-star"></i> ${m.rating} (${m.ratingCount})</div>
          <div class="mi-desc mt-sm">${m.description}</div>
        </div>
        <div class="mi-img-wrap">
          <img src="${m.image}" class="mi-img" loading="lazy">
          <button class="mi-add-btn" onclick="FHP.checkAdd('${m.id}')">ADD</button>
          ${m.customizations && m.customizations.length > 0 ? '<div class="mi-customizable">Customizable</div>' : ''}
        </div>
      </div>
    `).join('');
  },

  switchMenuTab(tabId, btnNode) {
    document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
    btnNode.classList.add('active');
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    if(tabId === 'reviews') this.renderReviews();
  },

  renderReviews() {
    const wrap = document.getElementById('reviews-wrap');
    const revs = APP_DATA.reviews[this.activeRest.id] || [];
    if(revs.length === 0) { wrap.innerHTML = '<p>No reviews yet.</p>'; return; }
    
    wrap.innerHTML = revs.map(r => `
      <div style="padding:16px; border:1px solid var(--border); border-radius:8px; margin-bottom:12px; background:var(--bg-color);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <div style="font-weight:700; display:flex; align-items:center; gap:8px;">${r.avatar} ${r.user}</div>
          <div style="background:var(--success); color:white; padding:2px 6px; border-radius:4px; font-size:0.8rem; font-weight:700;"><i class="fa-solid fa-star"></i> ${r.rating}</div>
        </div>
        <p style="color:var(--text-secondary); font-size:0.95rem;">${r.text}</p>
        <div style="font-size:0.8rem; color:var(--border); margin-top:8px; align-items:center; display:flex; justify-content:space-between; color:var(--text-secondary)">
          <span>${r.time}</span>
          <span><i class="fa-regular fa-thumbs-up"></i> ${r.likes}</span>
        </div>
      </div>
    `).join('');
  },

  // ---- Cart & Customization Logic ----
  checkAdd(itemId) {
    const item = this.activeRest.menu.find(m => m.id === itemId);
    
    // Check Multi-restaurant
    if(this.cart.length > 0 && this.cartRestId !== this.activeRest.id) {
      if(confirm('Your cart contains items from another restaurant. Clear cart and add?')) {
        this.cart = [];
        this.cartRestId = this.activeRest.id;
      } else return;
    }
    
    if(this.cart.length === 0) this.cartRestId = this.activeRest.id;

    if(item.customizations && item.customizations.length > 0) {
      this.openCustomizer(item);
    } else {
      this.addToCart({
        id: item.id + '_' + Date.now(), baseId: item.id, name: item.name,
        price: item.price, qty: 1, customText: '', image: item.image, isVeg: item.isVeg
      });
      this.showToast(`1x ${item.name} added to cart`);
    }
  },

  openCustomizer(item) {
    let html = `<div class="cust-header"><div class="mi-type ${item.isVeg ? '' : 'nv'}"></div><div class="cust-name">${item.name}</div><div class="cust-price">₹${item.price}</div></div><div class="cust-body">`;
    
    item.customizations.forEach(g => {
      html += `<div class="cust-group" data-req="${g.required}">
        <div class="cg-title">${g.group} ${g.required ? '<span class="cg-req">Required</span>' : ''}</div>`;
      g.options.forEach(o => {
        html += `<div class="cg-opt" onclick="FHP.toggleCustOpt(this, ${g.required})">
          <input type="${g.required ? 'radio' : 'checkbox'}" name="cust_${g.group.replace(/\s/g,'')}" value="${o.id}" data-price="${o.extraPrice}" data-label="${o.label}" style="display:none">
          <span>${o.label}</span>
          ${o.extraPrice !== 0 ? `<span>+₹${Math.abs(o.extraPrice)}</span>` : ''}
        </div>`;
      });
      html += `</div>`;
    });
    
    html += `</div><div class="cust-footer">
      <button class="btn btn-outline" style="flex:1" onclick="FHP.closeCustomizer()">Cancel</button>
      <button class="btn btn-primary" style="flex:2" onclick="FHP.addCustomized('${item.id}')">Add Item</button>
    </div>`;

    document.getElementById('customizer-inner').innerHTML = html;
    document.getElementById('customizer-overlay').classList.add('active');
    document.getElementById('customizer-modal').classList.add('active');
  },

  toggleCustOpt(div, isRadio) {
    if(isRadio) {
      const parent = div.parentElement;
      parent.querySelectorAll('.cg-opt').forEach(d => d.classList.remove('selected'));
      parent.querySelectorAll('input').forEach(i => i.checked = false);
    }
    div.classList.toggle('selected');
    div.querySelector('input').checked = div.classList.contains('selected');
  },

  addCustomized(itemId) {
    const item = this.activeRest.menu.find(m => m.id === itemId);
    let finalPrice = item.price;
    let custArr = [];
    
    // validate
    let valid = true;
    document.querySelectorAll('.cust-group').forEach(grp => {
      if(grp.dataset.req === 'true') {
        const checked = grp.querySelector('input:checked');
        if(!checked) valid = false;
      }
      grp.querySelectorAll('input:checked').forEach(inp => {
        finalPrice += parseFloat(inp.dataset.price);
        custArr.push(inp.dataset.label);
      });
    });

    if(!valid) return alert('Please select all required options');

    const customText = custArr.join(' | ');
    this.addToCart({
      id: item.id + '_' + Date.now(), baseId: item.id, name: item.name,
      price: finalPrice, qty: 1, customText: customText, image: item.image, isVeg: item.isVeg
    });
    
    this.closeCustomizer();
    this.showToast(`1x ${item.name} added to cart`);
  },

  closeCustomizer() {
    document.getElementById('customizer-overlay').classList.remove('active');
    document.getElementById('customizer-modal').classList.remove('active');
  },

  addToCart(cartItem) {
    const existing = this.cart.find(c => c.id === cartItem.id);
    if(existing) existing.qty++;
    else this.cart.push(cartItem);
    this.saveCart();
    this.updateCartBadge();
  },

  updateCartQty(id, delta) {
    const item = this.cart.find(c => c.id === id);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0) this.cart = this.cart.filter(c => c.id !== id);
    if(this.cart.length === 0) this.cartRestId = null;
    this.saveCart();
    this.updateCartBadge();
    if(this.currentView === 'cart') this.renderCart();
  },

  saveCart() {
    localStorage.setItem('fhp_cart', JSON.stringify(this.cart));
    localStorage.setItem('fhp_cartRestId', this.cartRestId);
  },

  updateCartBadge() {
    const count = this.cart.reduce((s,c) => s + c.qty, 0);
    const total = this.cart.reduce((s,c) => s + (c.price * c.qty), 0);
    document.getElementById('cart-badge').innerText = count;
    
    // Floating cart
    const fc = document.getElementById('float-cart');
    if(count > 0 && this.currentView !== 'cart' && this.currentView !== 'checkout') {
      const r = APP_DATA.restaurants.find(rest => rest.id === this.cartRestId);
      document.getElementById('fc-count').innerText = `${count} item${count>1?'s':''}`;
      document.getElementById('fc-total').innerText = `₹${total}`;
      document.getElementById('fc-rest-name').innerText = r ? `| ${r.name}` : '';
      fc.style.display = 'flex';
    } else {
      fc.style.display = 'none';
    }
  },

  // ---- Checkout & Payment ----
  currentCoupon: null,
  renderCart() {
    this.updateCartBadge();
    const wrap = document.getElementById('cart-items-wrap');
    if(this.cart.length === 0) {
      wrap.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fa-solid fa-cart-arrow-down" style="font-size:4rem; color:var(--border)"></i><h3 class="mt-md">Cart is empty</h3></div>`;
      document.getElementById('checkout-btn').style.display='none';
      document.getElementById('bill-rows').innerHTML = '';
      return;
    }
    document.getElementById('checkout-btn').style.display='block';

    wrap.innerHTML = this.cart.map(c => `
      <div class="cart-item">
        <img src="${c.image}" class="ci-img">
        <div class="ci-info">
          <div class="mi-type ${c.isVeg ? '' : 'nv'}"></div>
          <div class="ci-name">${c.name}</div>
          <div class="ci-cust">${c.customText}</div>
          <div class="ci-price">₹${c.price}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="FHP.updateCartQty('${c.id}', -1)">-</button>
          <div class="qty-val">${c.qty}</div>
          <button class="qty-btn" onclick="FHP.updateCartQty('${c.id}', 1)">+</button>
        </div>
      </div>
    `).join('');

    this.calcBill();
  },

  calcBill(isCheckout = false) {
    const subtotal = this.cart.reduce((s,c) => s + (c.price * c.qty), 0);
    const fee = subtotal > 0 ? 30 : 0;
    const taxes = subtotal * 0.05;
    let discount = 0;

    if(this.currentCoupon) {
      const c = APP_DATA.coupons[this.currentCoupon];
      if(subtotal >= c.minOrder) {
        if(c.type === 'flat') discount = c.discount;
        if(c.type === 'percent') discount = Math.min((subtotal * c.discount)/100, 100);
      } else {
        this.currentCoupon = null;
        document.getElementById('coupon-msg').innerText = '';
      }
    }

    const grand = Math.max(0, subtotal + fee + taxes - discount);

    let html = `
      <div class="brow"><span>Item Total</span><span>₹${subtotal.toFixed(2)}</span></div>
      <div class="brow"><span>Delivery Fee</span><span>₹${fee.toFixed(2)}</span></div>
      <div class="brow"><span>Govt Taxes (5%)</span><span>₹${taxes.toFixed(2)}</span></div>
    `;
    if(discount > 0) {
      html += `<div class="brow discount"><span>Discount (${this.currentCoupon})</span><span>-₹${discount.toFixed(2)}</span></div>`;
    }
    html += `<div class="brow total"><span>Grand Total</span><span>₹${grand.toFixed(2)}</span></div>`;

    document.getElementById(isCheckout ? 'co-bill-rows' : 'bill-rows').innerHTML = html;
    return grand;
  },

  applyCoupon() {
    const code = document.getElementById('coupon-input').value.toUpperCase();
    const subtotal = this.cart.reduce((s,c) => s + (c.price * c.qty), 0);
    const msg = document.getElementById('coupon-msg');
    
    if(APP_DATA.coupons[code]) {
      if(subtotal >= APP_DATA.coupons[code].minOrder) {
        this.currentCoupon = code;
        msg.innerText = `✅ Coupon ${code} applied!`;
        msg.style.color = 'var(--success)';
        this.calcBill();
      } else {
        msg.innerText = `❌ Min order ₹${APP_DATA.coupons[code].minOrder} for this code.`;
        msg.style.color = 'var(--danger)';
      }
    } else {
      msg.innerText = `❌ Invalid Coupon Code`;
      msg.style.color = 'var(--danger)';
    }
  },
  
  copyCoupon(code) {
    document.getElementById('coupon-input').value = code;
    this.applyCoupon();
  },

  renderCheckout() {
    if(!APP_DATA.currentUser) { window.location.href = 'login.html'; return; }
    
    // items list small
    document.getElementById('co-items-list').innerHTML = this.cart.map(c => `
      <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px;">
        <span>${c.qty}x ${c.name}</span><span>₹${c.price*c.qty}</span>
      </div>
    `).join('');
    
    this.calcBill(true);

    // Payment Listeners
    document.querySelectorAll('.pay-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        opt.querySelector('input').checked = true;
        
        document.getElementById('upi-subform').style.display = 'none';
        document.getElementById('card-subform').style.display = 'none';
        if(opt.dataset.method === 'upi') document.getElementById('upi-subform').style.display = 'block';
        if(opt.dataset.method === 'card') document.getElementById('card-subform').style.display = 'block';
      });
    });
  },

  placeOrder() {
    const grand = this.calcBill(true);
    const payMethod = document.querySelector('input[name="payment"]:checked').value;
    
    document.getElementById('splash-screen').style.display = 'flex';
    document.getElementById('splash-screen').style.opacity = '1';
    document.querySelector('.splash-sub').innerText = 'Processing Payment securely...';

    setTimeout(() => {
      // Create Order
      const newOrder = {
        id: 'ORD' + Math.floor(Math.random()*90000 + 10000),
        restId: this.cartRestId,
        items: [...this.cart],
        total: grand,
        date: new Date().toLocaleString(),
        status: 'Confirmed',
        agent: APP_DATA.agents[Math.floor(Math.random() * APP_DATA.agents.length)]
      };
      
      this.orders.unshift(newOrder); // unshift pushes to start
      localStorage.setItem('fhp_orders', JSON.stringify(this.orders));
      this.cart = [];
      this.cartRestId = null;
      this.currentCoupon = null;
      this.saveCart();

      // Show Tracking Page
      document.getElementById('splash-screen').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        this.navigate('tracking');
        this.startTracking(newOrder);
      }, 500);

    }, 3000); // 3 sec fake processing
  },

  // ---- Advanced Tracking Engine ----
  startTracking(order) {
    document.getElementById('tr-order-id').innerText = order.id;
    const etaMin = Math.floor(Math.random()*15 + 15);
    document.getElementById('tr-eta').innerText = etaMin + ' mins';
    
    // Reset steps
    document.querySelectorAll('.track-step').forEach(s => { s.classList.remove('done'); s.classList.remove('active'); });
    
    const steps = ['ts-confirmed', 'ts-preparing', 'ts-picked', 'ts-way', 'ts-delivered'];
    const msgs = ['Confirming with Restaurant...', 'Food is being cooked 🔥', 'Agent picked up your order 🎒', 'Agent is on the way 🚀', 'Delivered! Enjoy your food 🍔'];
    const anims = ['🍳', '🔥', '🎒', '🛵', '✅'];
    
    let currentStep = 0;
    
    // Set agent info
    document.getElementById('agent-card').style.display = 'none';
    document.getElementById('agent-name').innerText = order.agent.name;
    document.getElementById('agent-avatar').innerText = order.agent.avatar;
    document.getElementById('agent-rating').innerText = order.agent.rating;
    document.getElementById('agent-bike').innerText = order.agent.bike;

    const updateStep = () => {
      if(currentStep > 0) {
        document.getElementById(steps[currentStep-1]).classList.remove('active');
        document.getElementById(steps[currentStep-1]).classList.add('done');
      }
      if(currentStep < steps.length) {
        document.getElementById(steps[currentStep]).classList.add('active');
        document.getElementById('tr-status-text').innerText = msgs[currentStep];
        document.getElementById('status-anim').innerText = anims[currentStep];
      }

      // Show agent card after pickup
      if(currentStep === 2) document.getElementById('agent-card').style.display = 'flex';
      
      // Move Map Rider
      if(currentStep >= 3) {
        document.getElementById('map-rider').style.top = '70%'; 
        document.getElementById('map-rider').style.left = '70%'; 
      }

      currentStep++;
      if(currentStep <= steps.length) {
        // Random fake times (5-10 sec for fast demo)
        setTimeout(updateStep, Math.floor(Math.random()*5000 + 5000));
      }
    };
    
    updateStep(); // start
  },

  renderOrders() {
    const list = document.getElementById('orders-list');
    if(this.orders.length === 0) {
      list.innerHTML = `<div style="text-align:center; padding:50px;"><i class="fa-solid fa-receipt" style="font-size:3rem; color:var(--border)"></i><p class="mt-md">No orders yet.</p></div>`;
      return;
    }
    
    list.innerHTML = this.orders.map(o => {
      const r = APP_DATA.restaurants.find(rest => rest.id === o.restId);
      return `
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--border); padding-bottom:12px; margin-bottom:12px;">
          <div><h3 style="font-weight:800;">${r ? r.name : 'Restaurant'}</h3><span style="font-size:0.8rem; color:var(--text-secondary)">${o.date} | ${o.id}</span></div>
          <div style="text-align:right;"><span style="background:var(--success); color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:700;">${o.status}</span><div style="margin-top:6px; font-weight:800;">₹${o.total.toFixed(2)}</div></div>
        </div>
        <div style="font-size:0.9rem; color:var(--text-secondary)">
          ${o.items.map(i => `${i.qty} x ${i.name}`).join('<br>')}
        </div>
        <button class="btn btn-outline btn-sm mt-md" onclick="FHP.navigate('menu','${o.restId}')"><i class="fa-solid fa-rotate-right"></i> Reorder</button>
      </div>
    `}).join('');
  },

  // 🆕 Render Wishlist
  renderWishlist() {
    const wl = document.getElementById('wishlist-grid');
    if(!wl) return;
    const favRests = APP_DATA.restaurants.filter(r => this.wishlist.includes(r.id));
    if(favRests.length === 0) {
      wl.innerHTML = `<div style="text-align:center;padding:50px;"><i class="fa-solid fa-heart" style="font-size:3rem;color:var(--border);"></i><p class="mt-md">No saved restaurants yet.</p></div>`;
      return;
    }
    wl.innerHTML = favRests.map(r => this.createRestCard(r)).join('');
  },

  // 🆕 Search across all restaurants and menu items
  renderSearchPage() {
    const tChips = document.getElementById('trending-chips');
    if(tChips) {
      tChips.innerHTML = APP_DATA.trendingSearches.map(t =>
        `<span class="trend-chip" onclick="document.getElementById('search-page-input').value='${t}'; FHP.pageSearch('${t}')">${t}</span>`
      ).join('');
    }
    const catGrid = document.getElementById('search-cat-grid');
    if(catGrid) {
      catGrid.innerHTML = APP_DATA.categories.map(c =>
        `<div class="cat-item" onclick="document.getElementById('search-page-input').value='${c.label}'; FHP.pageSearch('${c.label}')">
          <div class="cat-icon-wrap">${c.icon}</div>
          <span class="cat-label">${c.label}</span>
        </div>`
      ).join('');
    }
  },

  pageSearch(query) {
    const q = (query || '').toLowerCase().trim();
    const trending = document.getElementById('search-trending');
    const results = document.getElementById('search-results-page');
    if(!q) {
      if(trending) trending.style.display = 'block';
      if(results) results.style.display = 'none';
      return;
    }
    if(trending) trending.style.display = 'none';
    if(results) results.style.display = 'block';

    // Search restaurants
    const matchedRests = APP_DATA.restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisines.some(c => c.toLowerCase().includes(q))
    );

    // Search menu items across all restaurants
    const matchedItems = [];
    APP_DATA.restaurants.forEach(r => {
      r.menu.forEach(m => {
        if(m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)) {
          matchedItems.push({ ...m, restId: r.id, restName: r.name });
        }
      });
    });

    let html = '';
    if(matchedRests.length > 0) {
      html += `<h3 class="mt-md" style="margin-bottom:12px;">🍽️ Restaurants (${matchedRests.length})</h3>`;
      html += matchedRests.map(r => this.createRestCard(r)).join('');
    }
    if(matchedItems.length > 0) {
      html += `<h3 class="mt-md" style="margin:20px 0 12px;">🍔 Items (${matchedItems.length})</h3>`;
      html += `<div class="menu-grid">`;
      html += matchedItems.map(m => `
        <div class="menu-item" onclick="FHP.navigate('menu','${m.restId}')" style="cursor:pointer;">
          <div class="mi-info">
            <div class="mi-type ${m.isVeg ? '' : 'nv'}"></div>
            <div class="mi-name">${m.name}</div>
            <div style="font-size:0.8rem;color:var(--accent);margin-bottom:4px;">from ${m.restName}</div>
            <div class="mi-price">₹${m.price}</div>
            <div class="mi-desc mt-sm">${m.description}</div>
          </div>
          <div class="mi-img-wrap">
            <img src="${m.image}" class="mi-img" loading="lazy">
          </div>
        </div>
      `).join('');
      html += `</div>`;
    }
    if(matchedRests.length === 0 && matchedItems.length === 0) {
      html = `<div style="text-align:center;padding:60px 20px;color:var(--text-secondary);"><div style="font-size:3rem;">🔍</div><h3 style="margin:12px 0;">No results for "${query}"</h3><p>Try another keyword or check spelling.</p></div>`;
    }
    if(results) results.innerHTML = html;
  },

  // ---- Auth Engine ----
  switchAuthTab(type) {
    document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
    document.getElementById(`atab-${type}`).classList.add('active');
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-form'));
    document.getElementById(`${type}-form`).classList.add('active-form');
  },
  
  // Legacy password login (now replaced with OTP, keep for fallback)
  login(e) {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    if(phone.length === 10) {
      APP_DATA.currentUser = { name: "User", phone: phone };
      localStorage.setItem('fhp_user', JSON.stringify(APP_DATA.currentUser));
      this.showToast('Login Successful ✅');
      this.checkAuthUI();
      this.navigate('home');
    }
  },

  // 🆕 Signup function
  signup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value?.trim();
    const phone = document.getElementById('signup-phone')?.value?.trim();
    if(!name || !phone || phone.length !== 10) {
      this.showToast('Please fill all fields correctly');
      return;
    }
    APP_DATA.currentUser = { name, phone };
    localStorage.setItem('fhp_user', JSON.stringify(APP_DATA.currentUser));
    this.showToast(`Welcome, ${name}! 🎉`);
    this.checkAuthUI();
    this.navigate('home');
  },

  checkAuthUI() {
    const area = document.getElementById('auth-nav-area');
    if(APP_DATA.currentUser) {
      const u = APP_DATA.currentUser;
      const initial = u.name ? u.name[0].toUpperCase() : 'U';
      const avatarHTML = u.avatar
        ? `<img src="${u.avatar}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);">`
        : `<div style="width:30px;height:30px;background:var(--accent);border-radius:50%;color:white;display:flex;align-items:center;justify-content:center;font-weight:800;">${initial}</div>`;
      area.innerHTML = `<button class="nav-btn-login" onclick="FHP.navigate('profile')">${avatarHTML}</button>`;
      const mnp = document.getElementById('mnav-profile');
      if(mnp) mnp.querySelector('span').innerText = u.name.split(' ')[0];
    } else {
      area.innerHTML = `<button class="nav-btn-login" onclick="window.location.href='login.html'"><i class="fa-solid fa-user"></i> Login</button>`;
    }
  },

  // Render Profile Page (Google avatar + stats)
  renderProfile() {
    const profileView = document.getElementById('view-profile');
    if(!profileView) return;
    if(!APP_DATA.currentUser) { window.location.href = 'login.html'; return; }
    const u = APP_DATA.currentUser;
    const initial = u.name ? u.name[0].toUpperCase() : 'U';
    const avatarHTML = u.avatar
      ? `<img src="${u.avatar}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);">`
      : `<div style="width:64px;height:64px;background:var(--accent);border-radius:50%;color:white;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;">${initial}</div>`;
    profileView.innerHTML = `
      <div style="padding:24px;max-width:480px;margin:0 auto;">
        <h2 style="font-weight:800;margin-bottom:24px;">👤 My Profile</h2>
        <div style="background:var(--surface);border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,.06);margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
            ${avatarHTML}
            <div>
              <div style="font-weight:800;font-size:1.1rem;">${u.name}</div>
              <div style="color:var(--text-secondary);font-size:.9rem;">${u.email || '+91 ' + (u.phone || '')}</div>
            </div>
          </div>
          <hr style="border:none;border-top:1px solid var(--border);margin-bottom:16px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div style="background:var(--bg-color);border-radius:10px;padding:16px;text-align:center;">
              <div style="font-size:1.6rem;font-weight:800;color:var(--accent);">${this.orders.length}</div>
              <div style="font-size:.8rem;color:var(--text-secondary);">Total Orders</div>
            </div>
            <div style="background:var(--bg-color);border-radius:10px;padding:16px;text-align:center;">
              <div style="font-size:1.6rem;font-weight:800;color:var(--success);">${this.wishlist.length}</div>
              <div style="font-size:.8rem;color:var(--text-secondary);">Favourites</div>
            </div>
          </div>
        </div>
        <button class="btn" style="width:100%;background:#fee2e2;color:#ef4444;font-weight:700;border-radius:50px;" onclick="FHP.logout()">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </button>
      </div>
    `;
  },

  // Logout
  logout() {
    APP_DATA.currentUser = null;
    localStorage.removeItem('fhp_user');
    this.checkAuthUI();
    this.showToast('Logged out successfully');
    this.navigate('home');
  },

  // ---- Utils ----
  showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  },

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
  },
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('theme-icon').className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  },

  togglePwd(id, icon) {
    const i = document.getElementById(id);
    if(i.type === 'password') { i.type = 'text'; icon.classList.replace('fa-eye', 'fa-eye-slash'); }
    else { i.type = 'password'; icon.classList.replace('fa-eye-slash', 'fa-eye'); }
  }
};

// Launch
window.onload = () => FHP.init();
