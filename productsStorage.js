// Product Data Storage for NeoClouds Tech Store
class Product {
  constructor(id, name, category, imageSrc, description, price, originalPrice = null, rating = 0, reviews = 0, isNew = false, isFlashSale = false) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.imageSrc = imageSrc;
    this.description = description;
    this.price = price;
    this.originalPrice = originalPrice;
    this.rating = rating;
    this.reviews = reviews;
    this.isNew = isNew;
    this.isFlashSale = isFlashSale;
  }
}

const products = [
  // iPhones
  new Product(1, "iPhone 16 Pro Max", "phone", "IMG/iphone16.jpg", "The most powerful iPhone ever with A18 Pro chip, titanium design, and advanced camera system.", 1400, 1599, 4.9, 2340, true),
  new Product(2, "iPhone 16", "phone", "IMG/iphone15.jpg", "iPhone 16 features a sleek design with A18 chip and improved camera capabilities.", 1200, 1299, 4.8, 1856),
  new Product(3, "iPhone 15 Pro", "phone", "IMG/iphone15 .jpg", "Titanium design, A17 Pro chip, and pro camera system.", 1100, 1199, 4.7, 3210, false, true),
  new Product(4, "iPhone 14 Pro", "phone", "IMG/iphone14 .jpg", "Dynamic Island, 48MP camera, and A16 Bionic chip.", 999, 1099, 4.6, 4520),
  new Product(5, "iPhone 14", "phone", "IMG/iphone14.jpg", "Great iPhone with A15 Bionic and improved camera.", 799, 899, 4.5, 5670),
  new Product(6, "iPhone 13", "phone", "IMG/iphone13.jpg", "Classic iPhone with A15 Bionic chip.", 599, 699, 4.4, 8930),
  new Product(7, "iPhone 12", "phone", "IMG/iphone12 .jpg", "5G capable with A14 Bionic chip.", 449, 549, 4.3, 12340),
  new Product(8, "iPhone 11", "phone", "IMG/iphone11 .jpg", "Affordable iPhone with great camera.", 349, 449, 4.2, 15670),

  // MacBooks
  new Product(9, "MacBook Pro 16\"", "laptop", "IMG/macbook2.jpg", "M3 Max chip, up to 128GB RAM, perfect for professionals.", 3499, 3999, 4.9, 890, true),
  new Product(10, "MacBook Pro 14\"", "laptop", "IMG/macbook1.jpg", "M3 Pro chip, Liquid Retina XDR display.", 1999, 2299, 4.8, 1230),
  new Product(11, "MacBook Air 15\"", "laptop", "IMG/composition-with-laptop-notepad.jpg", "M3 chip, super fast and silent.", 1299, 1499, 4.7, 2340, true),
  new Product(12, "MacBook Air 13\"", "laptop", "IMG/desktop.jpg", "M2 chip, incredibly thin and light.", 999, 1199, 4.6, 3450),

  // Apple Watches
  new Product(13, "Apple Watch Ultra 2", "watch", "IMG/smart watch1.jpg", "The most rugged and capable Apple Watch.", 799, 899, 4.9, 670, true),
  new Product(14, "Apple Watch Series 9", "watch", "IMG/smart watch.jpg", "Advanced health features and stunning display.", 399, 449, 4.8, 2340),
  new Product(15, "Apple Watch SE", "watch", "IMG/photo 5.jpg", "Essential features at a great value.", 249, 299, 4.5, 4560),

  // AirPods
  new Product(16, "AirPods Pro 2nd Gen", "audio", "IMG/airpodpro.jpg", "Active Noise Cancellation, Adaptive Audio.", 249, 279, 4.9, 8920, true, true),
  new Product(17, "AirPods 3rd Gen", "audio", "IMG/airpod.jpg", "Spatial Audio, sweat and water resistant.", 169, 199, 4.7, 5670),
  new Product(18, "AirPods Max", "audio", "IMG/top-view-new-headphones.jpg", "High-fidelity audio with Active Noise Cancellation.", 549, 599, 4.8, 2340),

  // Accessories
  new Product(19, "Magic Keyboard", "accessories", "IMG/keyboard.jpg", "Wireless keyboard with Touch ID.", 199, 229, 4.6, 1230),
  new Product(20, "Magic Mouse", "accessories", "IMG/keyboard1.jpg", "Wireless mouse with Multi-Touch surface.", 99, 119, 4.4, 890),
  new Product(21, "USB-C Cable 2m", "accessories", "IMG/usb cable.jpg", "Fast charging and data sync.", 19, 25, 4.5, 5670),
  new Product(22, "MagSafe Charger", "accessories", "IMG/usb cable1.jpg", "Wireless charging for iPhone and AirPods.", 39, 49, 4.6, 3450),

  // VR & Drones
  new Product(23, "Vision Pro", "accessories", "IMG/virtual-reality-headset-desk.jpg", "Spatial computing device.", 3499, 3999, 4.9, 340, true),
  new Product(24, "VR Headset Pro", "accessories", "IMG/top-view-virtual-reality-simulator-with-laptop.jpg", "Immersive VR experience.", 799, 999, 4.7, 560),
  new Product(25, "Professional Drone 4K", "accessories", "IMG/flying-drone-silver-joystick-it.jpg", "4K camera with 30min flight time.", 1299, 1599, 4.6, 230),

  // Additional Products
  new Product(26, "iPad Pro 12.9\"", "tablet", "IMG/photo 3.avif", "M4 chip, Liquid Retina XDR display.", 1099, 1299, 4.9, 1780, true),
  new Product(27, "iPad Air", "tablet", "IMG/photo 4.jpg", "M2 chip, stunning display.", 599, 699, 4.7, 2340),
  new Product(28, "iPad mini", "tablet", "IMG/photo 2.jpg", "Compact and powerful.", 499, 549, 4.6, 1890),
  new Product(29, "HomePod", "accessories", "IMG/photo 9.jpg", "High-fidelity audio, Siri built-in.", 299, 349, 4.5, 1230),
  new Product(30, "Apple TV 4K", "accessories", "IMG/photo 11.jpg", "Cinematic entertainment in your home.", 179, 199, 4.7, 3450, false, true),
];

// Products Storage Class
class ProductsStorage {
  constructor() {
    this.products = products;
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    // Could load custom products from localStorage here
  }

  getAll() {
    return this.products;
  }

  getById(id) {
    return this.products.find(product => product.id === id);
  }

  getByCategory(category) {
    if (category === 'all') return this.products;
    return this.products.filter(product => product.category === category);
  }

  searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }

  getNewArrivals() {
    return this.products.filter(product => product.isNew);
  }

  getFlashSaleItems() {
    return this.products.filter(product => product.isFlashSale);
  }

  getRecommendedProducts(currentProductId, limit = 4) {
    const current = this.getById(currentProductId);
    if (!current) return this.products.slice(0, limit);
    
    return this.products
      .filter(p => p.id !== currentProductId && p.category === current.category)
      .slice(0, limit);
  }

  getTrendingProducts(limit = 8) {
    return [...this.products]
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, limit);
  }
}

// Initialize storage
const storage = new ProductsStorage();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Product, ProductsStorage, storage, products };
}

