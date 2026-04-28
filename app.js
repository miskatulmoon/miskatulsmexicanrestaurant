// ── Desktop search toggle ──────────────────────────────────────
const searchicon2 = document.querySelector('#searchicon2');
const search2     = document.querySelector('#searchinput2');

if (searchicon2 && search2) {
  searchicon2.addEventListener('click', function () {
    search2.style.display    = 'flex';
    searchicon2.style.display = 'none';
  });

  search2.querySelector('.srchicon').addEventListener('click', function () {
    search2.style.display    = 'none';
    searchicon2.style.display = 'block';
  });
}

// ── Mobile search toggle ────────────────────────────────────────
const searchicon1 = document.querySelector('#searchicon1');
const search1     = document.querySelector('#searchinput1');

if (searchicon1 && search1) {
  searchicon1.addEventListener('click', function () {
    search1.style.display     = 'flex';
    searchicon1.style.display = 'none';
  });

  search1.querySelector('.srchicon').addEventListener('click', function () {
    search1.style.display     = 'none';
    searchicon1.style.display = 'block';
  });
}

// ── Hamburger / close menu ──────────────────────────────────────
const bars      = document.querySelector('.fa-bars');
const cross     = document.querySelector('#hdcross');
const headerbar = document.querySelector('.headerbar');

if (bars && cross && headerbar) {
  bars.addEventListener('click', function () {
    headerbar.style.display = 'flex';
    setTimeout(() => {
      headerbar.style.right = '0%';
    }, 10);
    bars.style.display  = 'none';
    cross.style.display = 'block';
  });

  cross.addEventListener('click', function () {
    headerbar.style.right = '-100%';
    cross.style.display   = 'none';
    bars.style.display    = 'block';

    setTimeout(() => {
      headerbar.style.display = 'none';
    }, 500);
  });
}

// ════════════════════════════════════════════════════════════════
// SHOPPING CART
// ════════════════════════════════════════════════════════════════

const CART_KEY = 'miskatul_cart';

// ── Storage helpers (with private-mode fallback) ────────────────
let memoryCart = [];
let useStorage = true;
try {
  localStorage.setItem('__test__', '1');
  localStorage.removeItem('__test__');
} catch (e) {
  useStorage = false;
}

function getCart() {
  if (!useStorage) return memoryCart;
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  if (useStorage) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } else {
    memoryCart = cart;
  }
  updateCartBadge();
  renderCart();
}

// ── Cart actions ────────────────────────────────────────────────
function addToCart(name, price, image) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price: parseFloat(price), image, quantity: 1 });
  }
  saveCart(cart);
  showCartNotification(`${name} added to cart`);
}

function clearCart() {
  if (getCart().length === 0) return;
  if (confirm('Clear all items from your cart?')) {
    saveCart([]);
  }
}

function calculateTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function totalItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

// ── HTML escape (for safe innerHTML rendering) ──────────────────
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// ── Open / close ────────────────────────────────────────────────
function openCart() {
  closeMobileMenu();
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeMobileMenu() {
  const _cross = document.querySelector('#hdcross');
  const _bars = document.querySelector('.fa-bars');
  const _headerbar = document.querySelector('.headerbar');
  if (!_cross || !_headerbar) return;
  if (getComputedStyle(_cross).display !== 'none') {
    _headerbar.style.right = '-100%';
    _cross.style.display = 'none';
    if (_bars) _bars.style.display = 'block';
    setTimeout(() => { _headerbar.style.display = 'none'; }, 500);
  }
}

// ── Render cart ─────────────────────────────────────────────────
function renderCart() {
  const itemsContainer = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    itemsContainer.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'flex';

  itemsContainer.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" onerror="this.style.background='#eee'">
      <div class="cart-item-details">
        <h4>${escapeHtml(item.name)}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <div class="cart-item-controls">
          <button data-action="decrease" data-idx="${idx}" aria-label="Decrease">−</button>
          <span class="cart-qty">${item.quantity}</span>
          <button data-action="increase" data-idx="${idx}" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="cart-item-remove" data-action="remove" data-idx="${idx}" aria-label="Remove">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = `$${calculateTotal().toFixed(2)}`;
}

function updateCartBadge() {
  const count = totalItemCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── Notification ────────────────────────────────────────────────
let notifTimer = null;
function showCartNotification(msg) {
  const notif = document.getElementById('cartNotification');
  if (!notif) return;
  notif.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHtml(msg)}`;
  notif.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => notif.classList.remove('show'), 2200);
}

// ── Inject cart panel into the page ─────────────────────────────
function injectCartPanel() {
  if (document.getElementById('cartPanel')) return;
  const html = `
    <div id="cartOverlay" class="cart-overlay"></div>
    <aside id="cartPanel" class="cart-panel" aria-label="Shopping cart">
      <div class="cart-header">
        <h2><i class="fa-solid fa-bag-shopping"></i> Your Cart</h2>
        <button id="cartCloseBtn" aria-label="Close cart">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="cart-body">
        <div id="cartEmpty" class="cart-empty">
          <i class="fa-solid fa-cart-shopping"></i>
          <p>Your cart is empty</p>
          <a href="menu.html"><button class="red_btn">Browse Menu</button></a>
        </div>
        <div id="cartItems" class="cart-items"></div>
      </div>
      <div id="cartFooter" class="cart-footer">
        <div class="cart-total-row">
          <span>Total</span>
          <span id="cartTotal">$0.00</span>
        </div>
        <div class="cart-footer-buttons">
          <button class="white_btn cart-clear-btn" id="cartClearBtn">
            <i class="fa-solid fa-trash"></i> Clear
          </button>
          <button class="red_btn cart-checkout-btn" id="cartCheckoutBtn">
            Checkout <i class="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
    </aside>
    <div id="cartNotification" class="cart-notification" role="status" aria-live="polite"></div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

// ── Inject badges into all cart icons ───────────────────────────
function injectCartBadges() {
  document.querySelectorAll('.fa-cart-shopping').forEach(icon => {
    const li = icon.closest('li') || icon.parentElement;
    if (!li) return;
    if (li.querySelector('.cart-badge')) return;
    li.style.position = 'relative';
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = '0';
    badge.style.display = 'none';
    li.appendChild(badge);
  });
}

// ── Wire up handlers ────────────────────────────────────────────
function wireCartHandlers() {
  // Cart icon → open cart
  document.querySelectorAll('.fa-cart-shopping').forEach(icon => {
    const link = icon.closest('a');
    if (link && !link.dataset.cartWired) {
      link.dataset.cartWired = '1';
      link.addEventListener('click', e => {
        e.preventDefault();
        openCart();
      });
    }
  });

  // Close button + overlay
  const closeBtn = document.getElementById('cartCloseBtn');
  const overlay = document.getElementById('cartOverlay');
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  // ESC closes cart
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  // Clear button
  const clearBtn = document.getElementById('cartClearBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);

  // Checkout button
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const total = calculateTotal();
      if (total === 0) return;
      alert(
        `Thanks for your order!\n\n` +
        `Total: $${total.toFixed(2)}\n\n` +
        `Your food will be prepared fresh and ready when you arrive. ` +
        `Please book a table or visit us at 695 Park Ave, NY.`
      );
      saveCart([]);
      closeCart();
      // Optional: redirect to book table page
      // window.location.href = 'book_table.html';
    });
  }

  // Cart item +/- and remove (event delegation)
  const itemsContainer = document.getElementById('cartItems');
  if (itemsContainer) {
    itemsContainer.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      const cart = getCart();
      if (isNaN(idx) || !cart[idx]) return;

      if (btn.dataset.action === 'increase') {
        cart[idx].quantity++;
      } else if (btn.dataset.action === 'decrease') {
        cart[idx].quantity--;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      } else if (btn.dataset.action === 'remove') {
        cart.splice(idx, 1);
      }
      saveCart(cart);
    });
  }

  // Add to cart buttons (on menu page)
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    if (btn.dataset.cartWired) return;
    btn.dataset.cartWired = '1';
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card = btn.closest('.menu-card');
      if (!card) return;
      const name = (card.querySelector('h3')?.textContent || 'Item').trim();
      const priceText = (card.querySelector('.price')?.textContent || '$0').trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const image = card.querySelector('img')?.src || '';
      addToCart(name, price, image);

      // Tiny visual feedback on the button
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 900);
    });
  });
}

// ── Init ────────────────────────────────────────────────────────
function initCart() {
  injectCartPanel();
  injectCartBadges();
  wireCartHandlers();
  updateCartBadge();
  renderCart();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCart);
} else {
  initCart();
}