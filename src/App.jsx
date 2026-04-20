import React, { useState, useEffect } from 'react';

// --- 1. MOCK DATABASE ---
const vendors = [
  {
      id: 1, name: "Barnawa Grills", category: "Nigerian • Grilled", time: "20-30 min", deliveryFee: "₦500",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      menu: [
          { id: 101, name: "Whole Grilled Catfish", price: 4500, desc: "Spicy fire-grilled catfish with a side of plantain." },
          { id: 102, name: "Chicken Suya Portion", price: 2500, desc: "Tender chicken breasts grilled with authentic Yaji spices." }
      ]
  },
  {
      id: 2, name: "Campus Shawarma HQ", category: "Fast Food • Snacks", time: "15-25 min", deliveryFee: "₦300",
      img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      menu: [
          { id: 201, name: "Double Sausage Shawarma", price: 2500, desc: "Chicken shawarma loaded with two juicy sausages." },
          { id: 202, name: "Beef Shawarma", price: 2800, desc: "Rich, spicy beef chunks wrapped with fresh veggies." }
      ]
  },
  {
      id: 3, name: "Mama T's Bukka", category: "Local Dishes", time: "30-45 min", deliveryFee: "₦400",
      img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      menu: [
          { id: 301, name: "Pounded Yam & Egusi", price: 3000, desc: "Two wraps of freshly pounded yam with rich Egusi soup." },
          { id: 302, name: "Amala & Ewedu", price: 2800, desc: "Hot Amala served with Gbegiri, Ewedu, and assorted meat." }
      ]
  },
  {
      id: 4, name: "KD Pizza Hub", category: "Pizza • Continental", time: "40-50 min", deliveryFee: "Free",
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      menu: [
          { id: 401, name: "Large Pepperoni Pizza", price: 6000, desc: "Classic pepperoni with extra mozzarella cheese." },
          { id: 402, name: "BBQ Chicken Pizza", price: 6500, desc: "Sweet and smoky BBQ base loaded with grilled chicken." }
      ]
  }
];

// --- 2. MAIN APP COMPONENT ---
export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [toast, setToast] = useState(null);

  // Initialize Theme from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('kdchow-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark'); // Tailwind uses 'dark' class on html/body
    }
  }, []);

  // Toggle Theme Handler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kdchow-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kdchow-theme', 'light');
    }
  };

  // Cart Handlers
  const addToCart = (vendor, item) => {
    const newItem = {
      cartId: Date.now(),
      vendorName: vendor.name,
      itemName: item.name,
      price: item.price
    };
    setCart([...cart, newItem]);
    showToast(`Added ${item.name} to cart! 😋`);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Toast Handler
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Filter Logic
  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Outer wrapper handles the global text and background colors
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <a href="#" className="text-2xl font-bold text-orange-500 tracking-tight" onClick={() => setSelectedVendor(null)}>
          KD Chow 🍔
        </a>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-500 transition-colors text-lg" 
            onClick={toggleTheme}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:border-orange-500 hover:text-orange-500 transition-colors" 
            onClick={() => setIsCartOpen(true)}
          >
            🛒 Cart <span className="px-2 py-0.5 text-xs font-bold text-white bg-orange-500 rounded-full">{cart.length}</span>
          </button>
        </div>
      </header>

      {/* CART OVERLAY */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* CART SIDEBAR */}
      <div className={`fixed top-0 right-0 z-50 flex flex-col h-full w-full max-w-[420px] bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">Your Order</h2>
          <button 
            className="flex items-center justify-center w-10 h-10 text-xl rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" 
            onClick={() => setIsCartOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 mt-8">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-semibold">{item.itemName}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.vendorName}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <button 
                  className="px-3 py-1 text-xs font-medium text-red-500 border border-red-200 dark:border-red-900/50 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" 
                  onClick={() => removeFromCart(item.cartId)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between mb-6 text-xl font-bold">
            <span>Total</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          <button 
            className="w-full py-4 font-semibold text-white bg-orange-500 rounded-full shadow-md hover:bg-orange-600 hover:-translate-y-0.5 transition-all" 
            onClick={() => alert('Proceeding to Paystack...')}
          >
            Checkout securely
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section className="flex flex-col items-center px-6 py-20 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-900">
          <div className="w-full max-w-2xl">
            <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight">
              {selectedVendor ? selectedVendor.name : "Hungry in Kaduna?"}
            </h1>
            <p className="mb-8 text-lg text-slate-500 dark:text-slate-400">
              {selectedVendor 
                ? `${selectedVendor.category} • ${selectedVendor.time} • Delivery: ${selectedVendor.deliveryFee}`
                : "Campus spots and city favorites, delivered to your door."}
            </p>
            
            {!selectedVendor && (
              <div className="flex items-center w-full max-w-lg mx-auto px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                <span className="text-slate-400 mr-2">🔍</span> 
                <input 
                  type="text" 
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100"
                  placeholder="Search for restaurants..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
        </section>

        {/* DYNAMIC GRID (Restaurants OR Menu) */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold">
              {selectedVendor ? "Menu Options" : "Popular Near You"}
            </h2>
            {selectedVendor && (
              <button 
                className="px-4 py-2 font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" 
                onClick={() => setSelectedVendor(null)}
              >
                &larr; Back to Restaurants
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {selectedVendor ? (
              // RENDER MENU ITEMS
              selectedVendor.menu.map(item => (
                <div key={item.id} className="flex flex-col p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <h3 className="mb-2 text-lg font-semibold">{item.name}</h3>
                    <p className="mb-6 text-sm text-slate-500 dark:text-slate-400 flex-grow">{item.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-orange-500">₦{item.price.toLocaleString()}</span>
                      <button 
                        className="px-4 py-2 font-semibold border border-slate-200 dark:border-slate-700 rounded-full hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors" 
                        onClick={() => addToCart(selectedVendor, item)}
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // RENDER RESTAURANTS
              filteredVendors.length > 0 ? (
                filteredVendors.map(vendor => (
                  <div 
                    key={vendor.id} 
                    className="flex flex-col overflow-hidden cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" 
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <img src={vendor.img} alt={vendor.name} className="w-full h-48 object-cover bg-slate-200 dark:bg-slate-700" loading="lazy" />
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="mb-2 text-xl font-semibold">{vendor.name}</h3>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                        <span>{vendor.category} • {vendor.time}</span>
                        <span className="px-2.5 py-1 font-medium text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 rounded-full">
                          {vendor.deliveryFee === 'Free' ? 'Free Delivery' : vendor.deliveryFee}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-10">
                  No restaurants found.
                </p>
              )
            )}
          </div>
        </section>
      </main>

      {/* TOAST NOTIFICATION */}
      <div className="fixed bottom-6 right-6 z-[2000] pointer-events-none">
        {toast && (
          <div className="flex items-center gap-3 px-5 py-3 text-sm font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 opacity-100">
            <span className="text-green-400 dark:text-green-500">✅</span> {toast}
          </div>
        )}
      </div>

      <footer className="py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <p>&copy; 2026 KD Chow. Fresh and Fast.</p>
      </footer>
    </div>
  );
}