import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar = ({ cartCount, onCartClick, searchQuery, onSearchChange }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();

  // Small delay before closing so the menu doesn't vanish while the cursor moves onto it
  const openShop = () => {
    clearTimeout(closeTimer.current);
    setShopDropdownOpen(true);
  };
  const closeShopSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setShopDropdownOpen(false), 150);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Close menus after navigating
  useEffect(() => {
    setShopDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.key]);

  // Already on the home page: React Router won't scroll, so do it here
  const handleHomeClick = () => {
    if (location.pathname === "/" && !location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setShopDropdownOpen(false);
    if (shopDropdownOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [shopDropdownOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-foreground text-background text-xs py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="mx-8">✨ Free Shipping on Orders Above ₹999</span>
          <span className="mx-8">🎉 Trusted by 500+ Salons Across India</span>
          <span className="mx-8">📦 Pan-India Delivery in 3-5 Days</span>
          <span className="mx-8">💰 Best Factory Prices — No Middlemen</span>
          <span className="mx-8">✨ Free Shipping on Orders Above ₹999</span>
          <span className="mx-8">🎉 Trusted by 500+ Salons Across India</span>
          <span className="mx-8">📦 Pan-India Delivery in 3-5 Days</span>
          <span className="mx-8">💰 Best Factory Prices — No Middlemen</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Row: Logo, Search, Icons */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2.5 shrink-0">
              <img src={logo} alt="ZARRKS logo" className="h-9 w-auto object-contain" />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                ZARRKS
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center justify-center gap-8 pb-3 text-sm font-medium border-t border-gray-100 pt-3 -mx-4 px-4">
            <Link to="/" onClick={handleHomeClick} className="text-foreground hover:text-muted-foreground transition-colors">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={openShop}
              onMouseLeave={closeShopSoon}
            >
              <button
                type="button"
                onClick={() => setShopDropdownOpen((open) => !open)}
                aria-expanded={shopDropdownOpen}
                className="flex items-center gap-1 text-foreground hover:text-muted-foreground transition-colors">
                Shop <ChevronDown className={`h-3.5 w-3.5 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopDropdownOpen && (
                // pt-2 (not mt-2) keeps the hover area continuous between the button and the menu
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                  {[
                    { name: "Salon & Spa", icon: "💇" },
                    { name: "Kitchen & Restaurant", icon: "👨‍🍳" },
                    { name: "Home Essentials", icon: "🏠" },
                    { name: "Industrial", icon: "🏭" },
                    { name: "T-Shirts", icon: "👕" },
                    { name: "Medical & Healthcare", icon: "🩺" },
                    { name: "Leather & Rexine", icon: "👜" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={`/#category-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
                    >
                      <span>{item.icon}</span> {item.name}
                    </Link>
                  ))}
                </div>
                </div>
              )}
            </div>
            <a
              href="https://wa.me/919990197268?text=Hello,%20I'm%20interested%20in%20placing%20a%20bulk%20order%20for%20salon%20aprons."
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Bulk Order
            </a>
            <Link to="/#about" className="text-foreground hover:text-muted-foreground transition-colors">
              About
            </Link>
            <Link to="/faq" className="text-foreground hover:text-muted-foreground transition-colors">
              FAQ
            </Link>
            <Link to="/#contact" className="text-foreground hover:text-muted-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile Search Drawer */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-gray-100 animate-slide-up">
            <div className="relative mt-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-up">
            <div className="px-4 py-4 flex flex-col gap-1">
              <Link to="/" onClick={handleHomeClick} className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-gray-50 rounded-lg transition-colors">
                Home
              </Link>
              <Link to="/#products" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-gray-50 rounded-lg transition-colors">
                Shop All
              </Link>
              <a
                href="https://wa.me/919990197268?text=Hello,%20I'm%20interested%20in%20placing%20a%20bulk%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-gray-50 rounded-lg transition-colors"
              >
                Bulk Order
              </a>
              <Link to="/#about" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-gray-50 rounded-lg transition-colors">
                About
              </Link>
              <Link to="/faq" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-gray-50 rounded-lg transition-colors">
                FAQ
              </Link>
              <Link to="/#contact" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-gray-50 rounded-lg transition-colors">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
