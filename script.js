// ================================================
// NeoClouds - Premium Tech Store JavaScript
// ================================================

// ================================================
// State Management
// ================================================
const state = {
  cart: JSON.parse(localStorage.getItem('neoclouds_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('neoclouds_wishlist')) || [],
  compareList: JSON.parse(localStorage.getItem('neoclouds_compare')) || [],
  products: [],
  filteredProducts: [],
  currentFilter: 'all',
  currentSort: 'default',
  darkMode: localStorage.getItem('neoclouds_darkmode') === 'true',
  productsPerPage: 12,
  currentPage: 1,
  searchTimeout: null
};

// ================================================
// DOM Elements
// ================================================
const elements = {
  // Loading
  loadingScreen: document.getElementById('loading-screen'),
  
  // Header
  header: document.getElementById('header'),
  hamburger: document.getElementById('hamburger'),
  navMenu: document.getElementById('nav-menu'),
  searchInput: document.getElementById('search-input'),
  searchResults: document.getElementById('search-results'),
  searchBtn: document.getElementById('search-btn'),
  
  // Counts
  cartCount: document.getElementById('cart-count'),
  wishlistCount: document.getElementById('wishlist-count'),
  compareCount: document.getElementById('compare-count'),
  
  // Buttons
  cartBtn: document.getElementById('cart-btn'),
  wishlistBtn: document.getElementById('wishlist-btn'),
  compareBtn: document.getElementById('compare-btn'),
  darkModeToggle: document.getElementById('dark-mode-toggle'),
  scrollTop: document.getElementById('scroll-top'),
  
  // Sidebars
  cartSidebar: document.getElementById('cart-sidebar'),
  cartOverlay: document.getElementById('cart-overlay'),
  cartClose: document.getElementById('cart-close'),
  cartItems: document.getElementById('cart-items'),
  cartEmpty: document.getElementById('cart-empty'),
  cartTotalPrice: document.getElementById('cart-total-price'),
  clearCartBtn: document.getElementById('clear-cart-btn'),
  checkoutBtn: document.getElementById('checkout-btn'),
  
  wishlistSidebar: document.getElementById('wishlist-sidebar'),
  wishlistOverlay: document.getElementById('wishlist-overlay'),
  wishlistClose: document.getElementById('wishlist-close'),
  wishlistItems: document.getElementById('wishlist-items'),
  wishlistEmpty: document.getElementById('wishlist-empty'),
  
  // Modals
  compareModal: document.getElementById('compare-modal'),
  compareClose: document.getElementById('compare-close'),
  compareProducts: document.getElementById('compare-products'),
  compareEmpty: document.getElementById('compare-empty'),
  
  quickViewModal: document.getElementById('quick-view-modal'),
  quickViewClose: document.getElementById('quick-view-close'),
  quickViewBody: document.getElementById('quick-view-body'),
  
  // Products
  productsGrid: document.getElementById('products-grid'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  sortSelect: document.getElementById('sort-select'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  flashProducts: document.getElementById('flash-products'),
  recommendationsGrid: document.getElementById('recommendations-grid'),
  
  // Category Cards
  categoryCards: document.querySelectorAll('.category-card'),
  navLinks: document.querySelectorAll('.nav-link'),
  
  // Newsletter
  newsletterForm: document.getElementById('newsletter-form'),
  
  // Order Tracking
  trackingForm: document.getElementById('tracking-form'),
  trackingResult: document.getElementById('tracking-result'),
  
  // Chat Widget
  chatWidget: document.getElementById('chat-widget'),
  chatToggle: document.getElementById('chat-toggle'),
  chatBox: document.getElementById('chat-box'),
  chatClose: document.getElementById('chat-close'),
  chatMessages: document.getElementById('chat-messages'),
  chatForm: document.getElementById('chat-form'),
  
  // Toast
  toastContainer: document.getElementById('toast-container'),
  
  // Countdown
  countdownHours: document.getElementById('hours'),
  countdownMinutes: document.getElementById('minutes'),
  countdownSeconds: document.getElementById('seconds'),
  
  // Hero Stats
  heroStats: document.querySelectorAll('.stat-number')
};

// ================================================
// Initialize Application
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Initialize products
  state.products = storage.getAll();
  state.filteredProducts = [...state.products];
  
  // Apply dark mode if enabled
  if (state.darkMode) {
    document.body.setAttribute('data-theme', 'dark');
  }
  
  // Hide loading screen
  setTimeout(() => {
    elements.loadingScreen.classList.add('hidden');
  }, 1500);
  
  // Initialize all features
  initCountdown();
  initHeroStats();
  initProducts();
  initFlashSale();
  initRecommendations();
  initEventListeners();
  updateCounts();
  
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Create particles
  createParticles();
}

// ================================================
// Countdown Timer
// ================================================
function initCountdown() {
  // Set end time to 24 hours from now
  const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endTime - now;
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    if (elements.countdownHours) {
      elements.countdownHours.textContent = String(hours).padStart(2, '0');
      elements.countdownMinutes.textContent = String(minutes).padStart(2, '0');
      elements.countdownSeconds.textContent = String(seconds).padStart(2, '0');
    }
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ================================================
// Hero Stats Counter Animation
// ================================================
function initHeroStats() {
  const stats = elements.heroStats;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.dataset.count);
        animateCounter(target, count);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const duration = 2000;
  const stepTime = duration / 50;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString() + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString() + '+';
    }
  }, stepTime);
}

// ================================================
// Products Management
// ================================================
function initProducts() {
  renderProducts();
  setupFilters();
}

function renderProducts() {
  const products = getFilteredAndSortedProducts();
  const startIndex = 0;
  const endIndex = state.currentPage * state.productsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);
  
  if (productsToShow.length === 0) {
    elements.productsGrid.innerHTML = `
      <div class="no-products">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
    return;
  }
  
  elements.productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
  
  // Hide load more if all products shown
  if (endIndex >= products.length) {
    elements.loadMoreBtn.style.display = 'none';
  } else {
    elements.loadMoreBtn.style.display = 'block';
  }
}

function getFilteredAndSortedProducts() {
  let products = [...state.filteredProducts];
  
  // Apply filter
  if (state.currentFilter !== 'all') {
    products = products.filter(p => {
      if (state.currentFilter === 'new') return p.isNew;
      if (state.currentFilter === 'sale') return p.isFlashSale;
      if (state.currentFilter === 'trending') return p.reviews > 1000;
      return true;
    });
  }
  
  // Apply sort
  switch (state.currentSort) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
  }
  
  return products;
}

function createProductCard(product) {
  const isInCart = state.cart.some(item => item.id === product.id);
  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const isInCompare = state.compareList.some(item => item.id === product.id);
  
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  
  let badges = '';
  if (product.isNew) badges += '<span class="product-badge new">NEW</span>';
  if (product.isFlashSale) badges += '<span class="product-badge sale">SALE</span>';
  
  return `
    <div class="product-card" data-id="${product.id}">
      ${badges ? `<div class="product-badges">${badges}</div>` : ''}
      <div class="product-actions">
        <button class="product-action-btn wishlist-btn ${isInWishlist ? 'wishlist-active' : ''}" data-id="${product.id}" title="Add to Wishlist">
          <i class="fas fa-heart"></i>
        </button>
        <button class="product-action-btn compare-btn ${isInCompare ? 'compare-active' : ''}" data-id="${product.id}" title="Add to Compare">
          <i class="fas fa-balance-scale"></i>
        </button>
        <button class="product-action-btn quick-view-btn" data-id="${product.id}" title="Quick View">
          <i class="fas fa-eye"></i>
        </button>
      </div>
      <div class="product-image">
        <img src="${product.imageSrc}" alt="${product.name}" onerror="this.src='IMG/photo 4.jpg'">
        <button class="product-360-btn" data-id="${product.id}">
          <i class="fas fa-sync-alt"></i> 360° View
        </button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${getStarRating(product.rating)}</span>
          <span class="reviews">(${product.reviews.toLocaleString()} reviews)</span>
        </div>
        <div class="product-price">
          <span class="current-price">$${product.price.toLocaleString()}</span>
          ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>` : ''}
          ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
        </div>
        <div class="product-buttons">
          <button class="product-btn add-cart ${isInCart ? 'in-cart' : ''}" data-id="${product.id}">
            <i class="fas fa-${isInCart ? 'check' : 'shopping-cart'}"></i>
            ${isInCart ? 'Added' : 'Add to Cart'}
          </button>
          <button class="product-btn view-detail" data-id="${product.id}">
            <i class="fas fa-info-circle"></i> Details
          </button>
        </div>
      </div>
    </div>
  `;
}

function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
  if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
  
  return stars;
}

// ================================================
// Flash Sale Products
// ================================================
function initFlashSale() {
  const flashProducts = storage.getFlashSaleItems();
  elements.flashProducts.innerHTML = flashProducts.map(product => createProductCard(product)).join('');
}

// ================================================
// AI Recommendations
// ================================================
function initRecommendations() {
  // Simulate AI recommendations based on random selection
  const recommended = storage.getTrendingProducts(4);
  elements.recommendationsGrid.innerHTML = recommended.map(product => createProductCard(product)).join('');
}

// ================================================
// Filters & Sorting
// ================================================
function setupFilters() {
  // Filter buttons
  elements.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      state.currentPage = 1;
      renderProducts();
    });
  });
  
  // Sort select
  elements.sortSelect.addEventListener('change', (e) => {
    state.currentSort = e.target.value;
    renderProducts();
  });
  
  // Load more
  elements.loadMoreBtn.addEventListener('click', () => {
    state.currentPage++;
    renderProducts();
  });
}

// ================================================
// Event Listeners
// ================================================
function initEventListeners() {
  // Header scroll effect
  window.addEventListener('scroll', handleScroll);
  
  // Mobile menu
  elements.hamburger.addEventListener('click', toggleMobileMenu);
  
  // Search
  elements.searchInput.addEventListener('input', handleSearch);
  elements.searchBtn.addEventListener('click', () => {
    handleSearch({ target: elements.searchInput });
  });
  
  // Cart
  elements.cartBtn.addEventListener('click', openCart);
  elements.cartClose.addEventListener('click', closeCart);
  elements.cartOverlay.addEventListener('click', closeCart);
  elements.clearCartBtn.addEventListener('click', clearCart);
  elements.checkoutBtn.addEventListener('click', proceedToCheckout);
  
  // Wishlist
  elements.wishlistBtn.addEventListener('click', openWishlist);
  elements.wishlistClose.addEventListener('click', closeWishlist);
  elements.wishlistOverlay.addEventListener('click', closeWishlist);
  
  // Compare
  elements.compareBtn.addEventListener('click', openCompare);
  elements.compareClose.addEventListener('click', closeCompare);
  
  // Quick View
  elements.quickViewClose.addEventListener('click', closeQuickView);
  
  // Dark Mode
  elements.darkModeToggle.addEventListener('click', toggleDarkMode);
  
  // Scroll to top
  elements.scrollTop.addEventListener('click', scrollToTop);
  
  // Category cards
  elements.categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      filterByCategory(category);
    });
  });
  
  // Nav links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.dataset.category;
      filterByCategory(category);
    });
  });
  
  // Newsletter
  elements.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  
  // Order Tracking
  elements.trackingForm.addEventListener('submit', handleOrderTracking);
  
  // Chat Widget
  elements.chatToggle.addEventListener('click', toggleChat);
  elements.chatClose.addEventListener('click', toggleChat);
  elements.chatForm.addEventListener('submit', handleChatSubmit);
  
  // Product delegation
  elements.productsGrid.addEventListener('click', handleProductAction);
  elements.flashProducts.addEventListener('click', handleProductAction);
  elements.recommendationsGrid.addEventListener('click', handleProductAction);
  
  // Close modals on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeWishlist();
      closeCompare();
      closeQuickView();
    }
  });
}

// ================================================
// Scroll Handler
// ================================================
function handleScroll() {
  const scrolled = window.scrollY > 100;
  
  if (elements.header) {
    elements.header.classList.toggle('scrolled', scrolled);
  }
  
  if (elements.scrollTop) {
    elements.scrollTop.classList.toggle('visible', scrolled);
  }
}

// ================================================
// Mobile Menu
// ================================================
function toggleMobileMenu() {
  elements.hamburger.classList.toggle('active');
  elements.navMenu.classList.toggle('active');
}

// ================================================
// Search Functionality
// ================================================
function handleSearch(e) {
  const query = e.target.value.trim();
  
  clearTimeout(state.searchTimeout);
  
  if (query.length < 2) {
    elements.searchResults.classList.remove('active');
    return;
  }
  
  state.searchTimeout = setTimeout(() => {
    const results = storage.searchProducts(query);
    renderSearchResults(results);
  }, 300);
}

function renderSearchResults(results) {
  if (results.length === 0) {
    elements.searchResults.innerHTML = `
      <div class="search-result-item">
        <p>No products found</p>
      </div>
    `;
  } else {
    elements.searchResults.innerHTML = results.slice(0, 6).map(product => `
      <div class="search-result-item" data-id="${product.id}">
        <img src="${product.imageSrc}" alt="${product.name}" onerror="this.src='IMG/photo 4.jpg'">
        <div class="search-result-info">
          <h4>${product.name}</h4>
          <p>$${product.price.toLocaleString()} - ${product.category}</p>
        </div>
      </div>
    `).join('');
    
    // Add click handlers
    elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.id);
        openQuickView(id);
        elements.searchResults.classList.remove('active');
        elements.searchInput.value = '';
      });
    });
  }
  
  elements.searchResults.classList.add('active');
}

// ================================================
// Category Filter
// ================================================
function filterByCategory(category) {
  state.filteredProducts = category === 'all' 
    ? [...state.products] 
    : state.products.filter(p => p.category === category);
  
  state.currentPage = 1;
  renderProducts();
  
  // Update active nav link
  elements.navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.category === category);
  });
  
  // Scroll to products
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ================================================
// Product Actions
// ================================================
function handleProductAction(e) {
  const target = e.target;
  const card = target.closest('.product-card');
  if (!card) return;
  
  const productId = parseInt(card.dataset.id);
  
  if (target.closest('.add-cart')) {
    addToCart(productId);
  } else if (target.closest('.wishlist-btn')) {
    toggleWishlist(productId);
  } else if (target.closest('.compare-btn')) {
    toggleCompare(productId);
  } else if (target.closest('.quick-view-btn') || target.closest('.view-detail') || target.closest('.product-360-btn')) {
    openQuickView(productId);
  }
}

// ================================================
// Cart Management
// ================================================
function addToCart(productId) {
  const product = storage.getById(productId);
  if (!product) return;
  
  const existingItem = state.cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  
  saveCart();
  updateCounts();
  renderCartItems();
  showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  updateCounts();
  renderCartItems();
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += delta;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCounts();
    renderCartItems();
  }
}

function clearCart() {
  state.cart = [];
  saveCart();
  updateCounts();
  renderCartItems();
  showToast('Cart cleared!', 'info');
}

function saveCart() {
  localStorage.setItem('neoclouds_cart', JSON.stringify(state.cart));
}

function renderCartItems() {
  if (state.cart.length === 0) {
    elements.cartItems.innerHTML = '';
    elements.cartEmpty.style.display = 'block';
    elements.cartTotalPrice.textContent = '$0.00';
    return;
  }
  
  elements.cartEmpty.style.display = 'none';
  elements.cartItems.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.imageSrc}" alt="${item.name}" onerror="this.src='IMG/photo 4.jpg'">
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="price">$${item.price.toLocaleString()}</span>
        <div class="cart-item-quantity">
          <button onclick="updateCartQuantity(${item.id}, -1)"><i class="fas fa-minus"></i></button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQuantity(${item.id}, 1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <span class="cart-item-remove" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </span>
    </div>
  `).join('');
  
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  elements.cartTotalPrice.textContent = '$' + total.toLocaleString() + '.00';
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Cart Sidebar
function openCart() {
  renderCartItems();
  elements.cartSidebar.classList.add('active');
  elements.cartOverlay.classList.add('active');
}

function closeCart() {
  elements.cartSidebar.classList.remove('active');
  elements.cartOverlay.classList.remove('active');
}

function proceedToCheckout() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }
  
  showToast(`Proceeding to checkout - Total: $${getCartTotal().toLocaleString()}`, 'success');
  // In a real app, redirect to checkout page
}

// ================================================
// Wishlist Management
// ================================================
function toggleWishlist(productId) {
  const product = storage.getById(productId);
  if (!product) return;
  
  const index = state.wishlist.findIndex(item => item.id === productId);
  
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`${product.name} removed from wishlist`, 'info');
  } else {
    state.wishlist.push(product);
    showToast(`${product.name} added to wishlist!`, 'success');
  }
  
  localStorage.setItem('neoclouds_wishlist', JSON.stringify(state.wishlist));
  updateCounts();
  renderWishlistItems();
  renderProducts(); // Re-render to update heart icons
}

function renderWishlistItems() {
  if (state.wishlist.length === 0) {
    elements.wishlistItems.innerHTML = '';
    elements.wishlistEmpty.style.display = 'block';
    return;
  }
  
  elements.wishlistEmpty.style.display = 'none';
  elements.wishlistItems.innerHTML = state.wishlist.map(item => `
    <div class="wishlist-item">
      <div class="wishlist-item-image">
        <img src="${item.imageSrc}" alt="${item.name}" onerror="this.src='IMG/photo 4.jpg'">
      </div>
      <div class="wishlist-item-info">
        <h4>${item.name}</h4>
        <span class="price">$${item.price.toLocaleString()}</span>
        <div class="wishlist-item-actions">
          <button class="add-cart" onclick="addToCart(${item.id})">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
      <span class="wishlist-item-remove" onclick="toggleWishlist(${item.id})">
        <i class="fas fa-trash"></i>
      </span>
    </div>
  `).join('');
}

function openWishlist() {
  renderWishlistItems();
  elements.wishlistSidebar.classList.add('active');
  elements.wishlistOverlay.classList.add('active');
}

function closeWishlist() {
  elements.wishlistSidebar.classList.remove('active');
  elements.wishlistOverlay.classList.remove('active');
}

// ================================================
// Compare Management
// ================================================
function toggleCompare(productId) {
  const product = storage.getById(productId);
  if (!product) return;
  
  const index = state.compareList.findIndex(item => item.id === productId);
  
  if (index > -1) {
    state.compareList.splice(index, 1);
    showToast(`${product.name} removed from compare`, 'info');
  } else {
    if (state.compareList.length >= 3) {
      showToast('Maximum 3 products can be compared', 'warning');
      return;
    }
    state.compareList.push(product);
    showToast(`${product.name} added to compare!`, 'success');
  }
  
  localStorage.setItem('neoclouds_compare', JSON.stringify(state.compareList));
  updateCounts();
  renderProducts(); // Re-render to update compare icons
}

function renderCompareProducts() {
  if (state.compareList.length === 0) {
    elements.compareProducts.innerHTML = '';
    elements.compareEmpty.style.display = 'block';
    return;
  }
  
  elements.compareEmpty.style.display = 'none';
  elements.compareProducts.innerHTML = state.compareList.map(product => `
    <div class="compare-product">
      <span class="compare-product-remove" onclick="toggleCompare(${product.id})">
        <i class="fas fa-times"></i>
      </span>
      <img src="${product.imageSrc}" alt="${product.name}" onerror="this.src='IMG/photo 4.jpg'">
      <h4>${product.name}</h4>
      <span class="price">$${product.price.toLocaleString()}</span>
      <div class="compare-specs">
        <p><span>Category</span><span>${product.category}</span></p>
        <p><span>Rating</span><span>${product.rating}/5</span></p>
        <p><span>Reviews</span><span>${product.reviews.toLocaleString()}</span></p>
        <p><span>New</span><span>${product.isNew ? 'Yes' : 'No'}</span></p>
        <p><span>Sale</span><span>${product.isFlashSale ? 'Yes' : 'No'}</span></p>
      </div>
    </div>
  `).join('');
}

function openCompare() {
  renderCompareProducts();
  elements.compareModal.classList.add('active');
}

function closeCompare() {
  elements.compareModal.classList.remove('active');
}

// ================================================
// Quick View Modal
// ================================================
function openQuickView(productId) {
  const product = storage.getById(productId);
  if (!product) return;
  
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  
  elements.quickViewBody.innerHTML = `
    <div class="quick-view-image">
      <img src="${product.imageSrc}" alt="${product.name}" onerror="this.src='IMG/photo 4.jpg'">
    </div>
    <div class="quick-view-info">
      <span class="product-category">${product.category}</span>
      <h2>${product.name}</h2>
      <div class="product-rating">
        <span class="stars">${getStarRating(product.rating)}</span>
        <span class="reviews">(${product.reviews.toLocaleString()} reviews)</span>
      </div>
      <div class="price">
        <span class="current-price">$${product.price.toLocaleString()}</span>
        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>` : ''}
        ${discount > 0 ? `<span class="discount">-${discount}% OFF</span>` : ''}
      </div>
      <p class="description">${product.description}</p>
      <div class="quick-view-quantity">
        <label>Quantity:</label>
        <input type="number" id="quick-view-qty" value="1" min="1" max="10">
      </div>
      <div class="quick-view-buttons">
        <button class="btn btn-primary" onclick="addToCart(${product.id})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
        <button class="btn btn-secondary" onclick="toggleWishlist(${product.id})">
          <i class="fas fa-heart"></i> Wishlist
        </button>
      </div>
    </div>
  `;
  
  elements.quickViewModal.classList.add('active');
}

function closeQuickView() {
  elements.quickViewModal.classList.remove('active');
}

// ================================================
// Dark Mode
// ================================================
function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.body.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  localStorage.setItem('neoclouds_darkmode', state.darkMode);
  
  const icon = elements.darkModeToggle.querySelector('i');
  icon.className = state.darkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// ================================================
// Update Counts
// ================================================
function updateCounts() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  elements.cartCount.textContent = cartCount;
  elements.wishlistCount.textContent = state.wishlist.length;
  elements.compareCount.textContent = state.compareList.length;
}

// ================================================
// Newsletter
// ================================================
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  
  // Show confetti
  triggerConfetti();
  
  showToast(`Thank you for subscribing! 10% off code: NEOCLOUDS10`, 'success');
  e.target.reset();
}

// ================================================
// Order Tracking
// ================================================
function handleOrderTracking(e) {
  e.preventDefault();
  const orderNumber = e.target.querySelector('input').value;
  
  // Simulate tracking
  elements.trackingResult.innerHTML = `
    <div class="tracking-steps">
      <div class="tracking-step completed">
        <div class="tracking-step-icon"><i class="fas fa-check"></i></div>
        <h4>Order Placed</h4>
        <p>Confirmed</p>
      </div>
      <div class="tracking-step completed">
        <div class="tracking-step-icon"><i class="fas fa-box"></i></div>
        <h4>Processing</h4>
        <p>In Progress</p>
      </div>
      <div class="tracking-step active">
        <div class="tracking-step-icon"><i class="fas fa-truck"></i></div>
        <h4>Shipped</h4>
        <p>On the way</p>
      </div>
      <div class="tracking-step">
        <div class="tracking-step-icon"><i class="fas fa-home"></i></div>
        <h4>Delivered</h4>
        <p>Expected soon</p>
      </div>
    </div>
  `;
  elements.trackingResult.classList.add('active');
  showToast(`Tracking order: ${orderNumber}`, 'info');
}

// ================================================
// Chat Widget
// ================================================
function toggleChat() {
  elements.chatBox.classList.toggle('active');
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message
  addChatMessage(message, 'user');
  input.value = '';
  
  // Simulate bot response
  setTimeout(() => {
    const responses = [
      "I'd be happy to help you with that!",
      "Let me check that for you...",
      "Great question! Here's what I found:",
      "Is there anything else you'd like to know?",
      "Our team is here to assist you 24/7!"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addChatMessage(randomResponse, 'bot');
  }, 1000);
}

function addChatMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${type}`;
  messageDiv.innerHTML = `<p>${message}</p>`;
  elements.chatMessages.appendChild(messageDiv);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// ================================================
// Toast Notifications
// ================================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type]}"></i>
    <span>${message}</span>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ================================================
// Utilities
// ================================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 5 + 2}px;
      height: ${Math.random() * 5 + 2}px;
      background: rgba(0, 113, 227, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 5}s linear infinite;
    `;
    particlesContainer.appendChild(particle);
  }
}

// ================================================
// Confetti Effect
// ================================================
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const confetti = [];
  const colors = ['#0071e3', '#ff9500', '#34c759', '#ff3b30', '#ffcc00'];
  
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.2 - 0.1
    });
  }
  
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let stillFalling = false;
    
    confetti.forEach(c => {
      if (c.y < canvas.height) {
        stillFalling = true;
        c.y += c.speed;
        c.angle += c.spin;
        c.x += Math.sin(c.angle) * 2;
        
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    });
    
    if (stillFalling) {
      requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  animateConfetti();
}

// Make functions globally available
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.toggleCompare = toggleCompare;

