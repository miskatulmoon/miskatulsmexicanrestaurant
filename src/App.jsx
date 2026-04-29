import { useEffect, useMemo, useState } from 'react';
import { featuredItems, menuCategories, menuItems, navItems, storyBlocks } from './data.js';

const CART_KEY = 'miskatul_cart';

function normalizePath(pathname) {
  if (pathname === '/index.html') return '/';
  if (pathname === '/menu.html') return '/menu';
  if (pathname === '/about.html') return '/about';
  if (pathname === '/book_table.html') return '/book-table';
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
}

function getInitialCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [cart, setCart] = useState(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const titles = {
      '/': "Miskatul's Mexican Restaurant | Home",
      '/menu': "Miskatul's Mexican Restaurant | Menu",
      '/about': "Miskatul's Mexican Restaurant | About",
      '/book-table': "Miskatul's Mexican Restaurant | Book a Table",
    };
    document.title = titles[path] || titles['/'];
  }, [path]);

  const navigate = (nextPath) => {
    const normalized = normalizePath(nextPath);
    window.history.pushState({}, '', normalized);
    setPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.name === item.name);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
    setToast(`${item.name} added to cart`);
  };

  const changeQuantity = (name, amount) => {
    setCart((current) =>
      current
        .map((item) => (item.name === name ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (name) => {
    setCart((current) => current.filter((item) => item.name !== name));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Clear all items from your cart?')) {
      setCart([]);
    }
  };

  const checkout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total === 0) return;
    window.alert(
      `Thanks for your order!\n\nTotal: $${total.toFixed(2)}\n\nYour food will be prepared fresh and ready when you arrive. Please book a table or visit us at 695 Park Ave, NY.`,
    );
    setCart([]);
    setIsCartOpen(false);
  };

  const page = {
    '/': <HomePage navigate={navigate} />,
    '/menu': <MenuPage addToCart={addToCart} />,
    '/about': <AboutPage />,
    '/book-table': <BookTablePage />,
  }[path] || <HomePage navigate={navigate} />;

  return (
    <div className="min-h-screen bg-white">
      <Header
        cart={cart}
        navigate={navigate}
        onCartOpen={() => setIsCartOpen(true)}
      />
      <main>{page}</main>
      <Footer navigate={navigate} />
      <CartPanel
        cart={cart}
        isOpen={isCartOpen}
        navigate={navigate}
        onClose={() => setIsCartOpen(false)}
        onClear={clearCart}
        onCheckout={checkout}
        onQuantityChange={changeQuantity}
        onRemove={removeItem}
      />
      <div className={`cart-notification ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <i className="fa-solid fa-circle-check" aria-hidden="true" /> {toast}
          </>
        )}
      </div>
    </div>
  );
}

function Header({ cart, navigate, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header>
      <div className="header">
        <div className={`headerbar ${menuOpen ? 'mobile-menu-open' : ''}`}>
          <button className="icon-button close-mobile" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
          <AccountControls
            count={count}
            searchOpen={mobileSearchOpen}
            onSearchOpen={() => setMobileSearchOpen(true)}
            onSearchClose={() => setMobileSearchOpen(false)}
            onCartOpen={() => {
              setMenuOpen(false);
              onCartOpen();
            }}
            variant="mobile"
          />
          <NavList navigate={go} />
        </div>

        <button className="logo" onClick={() => go('/')} aria-label="Go to home page">
          <img src="/images/360_F_284888199_HnuXdDdbLgpQJkvpADTNMmCeV4E4uDP2.jpg" alt="Restaurant logo" />
        </button>

        <button className="bar" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <i className="fa-solid fa-bars" aria-hidden="true" />
        </button>

        <nav className="desktop-nav">
          <NavList navigate={go} />
        </nav>

        <AccountControls
          count={count}
          searchOpen={desktopSearchOpen}
          onSearchOpen={() => setDesktopSearchOpen(true)}
          onSearchClose={() => setDesktopSearchOpen(false)}
          onCartOpen={onCartOpen}
          variant="desktop"
        />
      </div>
    </header>
  );
}

function NavList({ navigate }) {
  return (
    <ul className="nav-list">
      {navItems.map((item) => (
        <li key={item.path}>
          <button onClick={() => navigate(item.path)}>{item.label}</button>
        </li>
      ))}
    </ul>
  );
}

function AccountControls({ count, searchOpen, onSearchOpen, onSearchClose, onCartOpen, variant }) {
  return (
    <div className={`account ${variant === 'desktop' ? 'desktop-account' : ''}`}>
      <ul>
        <li>
          <button className="icon-button" aria-label="Account">
            <i className="fa-solid fa-user" aria-hidden="true" />
          </button>
        </li>
        <li>
          <button className="icon-button cart-icon-button" onClick={onCartOpen} aria-label="Open cart">
            <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
            <span className={`cart-badge ${count > 0 ? 'visible' : ''}`}>{count}</span>
          </button>
        </li>
        <li>
          {!searchOpen && (
            <button className="icon-button" onClick={onSearchOpen} aria-label="Open search">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            </button>
          )}
        </li>
        {searchOpen && (
          <li className="search">
            <input type="search" placeholder="Search..." />
            <button className="srchicon" onClick={onSearchClose} aria-label="Close search">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

function Footer({ navigate }) {
  return (
    <footer>
      <p>© 2026 Miskatul's Mexican Restaurant. All rights reserved.</p>
      <div className="footer-links">
        {navItems.map((item) => (
          <button key={item.path} onClick={() => navigate(item.path)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="footer-social">
        <a href="https://www.instagram.com/" aria-label="Instagram">
          <i className="fa-brands fa-instagram" aria-hidden="true" />
        </a>
        <a href="https://www.facebook.com/" aria-label="Facebook">
          <i className="fa-brands fa-facebook" aria-hidden="true" />
        </a>
        <a href="https://www.tiktok.com/en/" aria-label="TikTok">
          <i className="fa-brands fa-tiktok" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

function Button({ children, variant = 'red', className = '', onClick, type = 'button', disabled }) {
  return (
    <button
      type={type}
      className={`${variant === 'white' ? 'white_btn' : 'red_btn'} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function HomePage({ navigate }) {
  return (
    <div className="home">
      <section className="main_slide">
        <div className="hero-copy">
          <h1>
            Best <span>Mexican Food</span> in New York City
          </h1>
          <p>
            Miskatul's Mexican Restaurant reimagines Mexican cuisine by blending bold, traditional flavors with
            contemporary culinary techniques. Enjoy slow-cooked carnitas, savory moles, and fresh corn tortillas made
            daily, all served with warm, heartfelt hospitality. Come savor the authentic tastes of Mexico!
          </p>
          <Button onClick={() => navigate('/book-table')}>
            Visit Now <i className="fa-solid fa-arrow-right-long" aria-hidden="true" />
          </Button>
        </div>
        <div className="hero-image">
          <img src="/images/mexican-food-interior-fajitas (1).jpg" alt="Mexican fajitas platter" />
        </div>
      </section>

      <section className="food-items">
        {featuredItems.map((item) => (
          <article className="item" key={item.title}>
            <div>
              <img src={item.image} alt={item.title} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Button variant={item.buttonStyle} onClick={() => navigate('/menu')}>
              See Menu
            </Button>
          </article>
        ))}
      </section>
    </div>
  );
}

function PageHero({ title, highlight, children }) {
  return (
    <section className="about-hero">
      <h1>
        {title} {highlight && <span>{highlight}</span>}
      </h1>
      <p>{children}</p>
    </section>
  );
}

function MenuPage({ addToCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedName, setAddedName] = useState('');
  const visibleItems = useMemo(
    () => menuItems.filter((item) => activeCategory === 'all' || item.category === activeCategory),
    [activeCategory],
  );

  const addItem = (item) => {
    addToCart(item);
    setAddedName(item.name);
    window.setTimeout(() => setAddedName(''), 900);
  };

  return (
    <>
      <PageHero title="Our" highlight="Menu">
        Dive into our delicious and authentic meals. Made fresh daily from 11am to 11pm.
      </PageHero>
      <div className="menu-tabs">
        {menuCategories.map((category) => (
          <button
            className={`tab-btn ${activeCategory === category.value ? 'active' : ''}`}
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <section className="menu-grid">
        {visibleItems.map((item) => (
          <article className="menu-card" key={item.name}>
            <img src={item.image} alt={item.name} />
            <div className="menu-card-body">
              <h3>{item.name}</h3>
              <p className="price">${item.price}</p>
              <Button
                variant="white"
                className="add-to-cart-btn"
                disabled={addedName === item.name}
                onClick={() => addItem(item)}
              >
                <i className={`fa-solid ${addedName === item.name ? 'fa-check' : 'fa-plus'}`} aria-hidden="true" />
                {addedName === item.name ? ' Added' : ' Add to Cart'}
              </Button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero title="The Story of" highlight="Miskatul's Mexican Restaurant">
        Here's how we became the most beloved Mexican Restaurant in New York City
      </PageHero>
      <section className="story-section">
        {storyBlocks.map((block) => (
          <article className={`story-block ${block.reverse ? 'reverse' : ''}`} key={block.label}>
            <div className="story-img">
              <img src={block.image} alt={block.alt} />
            </div>
            <div className="story-text">
              <p className="story-label">{block.label}</p>
              <h2>
                {block.title} <span>{block.highlight}</span>
              </h2>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function BookTablePage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const submitForm = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      window.alert('Please fill in all fields before submitting.');
      return;
    }
    setSuccess(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <PageHero title="Book a Table">
        Send us a message and we'll confirm your reservation within 24 hours.
      </PageHero>
      <section className="contact-section">
        <div className="map-column">
          <div className="map-container">
            <iframe
              title="Miskatul's Mexican Restaurant location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215151615934!2d-73.9599!3d40.7678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ead4e7f7b1%3A0x7a1d9b2d1f4c3e5a!2s695+Park+Ave%2C+New+York%2C+NY+10065!5e0!3m2!1sen!2sus!4v1700000000000"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="map-info">
            <p>
              <i className="fa-solid fa-location-dot" aria-hidden="true" /> 695 Park Ave, New York, NY 10065
            </p>
            <p>
              <i className="fa-solid fa-clock" aria-hidden="true" /> Open daily · 11:00 AM - 11:00 PM
            </p>
            <p>
              <i className="fa-solid fa-phone" aria-hidden="true" /> (127) 127-1271
            </p>
            <p>
              <i className="fa-solid fa-envelope" aria-hidden="true" /> miskatulmoon@gmail.com
            </p>
          </div>
        </div>

        <form className="form-container" onSubmit={submitForm}>
          <h2>Make a Reservation</h2>
          <p className="form-sub">
            Fill in your details below and let us know when you'd like to visit. We'll get back to you shortly to
            confirm.
          </p>

          <label className="form-group">
            <span>Full Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Steven Palermo"
            />
          </label>

          <label className="form-group">
            <span>Email Address</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="e.g. steven@gmail.com"
            />
          </label>

          <label className="form-group">
            <span>Your Message</span>
            <textarea
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="Let us know your preferred date, time, and number of guests..."
            />
          </label>

          <Button type="submit" className="w-full text-base">
            Send Message <i className="fa-solid fa-arrow-right-long" aria-hidden="true" />
          </Button>

          {success && (
            <div className="success-msg">
              <i className="fa-solid fa-circle-check" aria-hidden="true" /> Message sent! We'll confirm your
              reservation soon.
            </div>
          )}
        </form>
      </section>
    </>
  );
}

function CartPanel({
  cart,
  isOpen,
  navigate,
  onClose,
  onClear,
  onCheckout,
  onQuantityChange,
  onRemove,
}) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <button className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} aria-label="Close cart" />
      <aside className={`cart-panel ${isOpen ? 'open' : ''}`} aria-label="Shopping cart">
        <div className="cart-header">
          <h2>
            <i className="fa-solid fa-bag-shopping" aria-hidden="true" /> Your Cart
          </h2>
          <button id="cartCloseBtn" onClick={onClose} aria-label="Close cart">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
              <p>Your cart is empty</p>
              <Button
                onClick={() => {
                  onClose();
                  navigate('/menu');
                }}
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.name}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    <div className="cart-item-controls">
                      <button onClick={() => onQuantityChange(item.name, -1)} aria-label={`Decrease ${item.name}`}>
                        -
                      </button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button onClick={() => onQuantityChange(item.name, 1)} aria-label={`Increase ${item.name}`}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                    <button className="cart-item-remove" onClick={() => onRemove(item.name)} aria-label="Remove">
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cart-footer-buttons">
              <Button variant="white" className="cart-clear-btn" onClick={onClear}>
                <i className="fa-solid fa-trash" aria-hidden="true" /> Clear
              </Button>
              <Button className="cart-checkout-btn" onClick={onCheckout}>
                Checkout <i className="fa-solid fa-arrow-right-long" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default App;
