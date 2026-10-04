import { useState, useMemo } from "react";
import { SlidersHorizontal, Grid3X3, List, Shield, Truck, Award, Phone, SquareMenu, ArrowRight, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import ProductDetailModal from "@/components/ProductDetailModal";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { sortOptions, retailCategories, wholesaleCategories, type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";

// Category images
import imgSalonSpa from "@/assets/categories/salon-spa.png";
import imgKitchenRestaurant from "@/assets/categories/kitchen-restaurant.png";
import imgHomeEssentials from "@/assets/categories/home-essentials.png";
import imgIndustrial from "@/assets/categories/industrial.png";
import imgTshirts from "@/assets/categories/tshirts.png";

// Category definitions with imagery matching uniformer.in style
const CATEGORY_DEFS = [
  {
    name: "Salon & Spa",
    tagline: "Professional & Elegant",
    desc: "Versatile. Durable. Built for Salons & Spas.",
    anchor: "category-salon---spa",
    image: imgSalonSpa,
    focus: "50% 15%",
  },
  {
    name: "Kitchen & Restaurant",
    tagline: "Hospitality & Culinary",
    desc: "Versatile. Durable. Ready for Any Task.",
    anchor: "category-kitchen---restaurant",
    image: imgKitchenRestaurant,
    focus: "50% 12%",
  },
  {
    name: "Home Essentials",
    tagline: "Comfort & Luxury",
    desc: "Ultra-Soft. Absorbent. Premium Bath & Bedding.",
    anchor: "category-home-essentials",
    image: imgHomeEssentials,
    focus: "50% 65%",
  },
  {
    name: "Industrial",
    tagline: "Heavy-Duty & Protective",
    desc: "Tough. Flame & Water Resistant Workwear.",
    anchor: "category-industrial",
    image: imgIndustrial,
    focus: "50% 10%",
  },
  {
    name: "T-Shirts",
    tagline: "Custom Staff Uniforms",
    desc: "Comfortable. Breathable. Perfect for Teams.",
    anchor: "category-t-shirts",
    image: imgTshirts,
    focus: "50% 12%",
  },
];

const Index = () => {
  const { products, loading } = useProducts();
  const { cart, addToCart, updateCartQty, removeFromCart, clearCart, cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Retail" | "Wholesale">("Retail");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (p.status === "deleted" || p.status === "draft") return false;
      if (p.salesType !== activeTab) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedMaterial !== "All" && p.material !== selectedMaterial) return false;
      if (selectedColor !== "All" && p.color !== selectedColor) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [products, activeTab, searchQuery, selectedCategory, selectedMaterial, selectedColor, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedMaterial("All");
    setSelectedColor("All");
    setPriceRange([0, 5000]);
  };

  // Products grouped by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    for (const cat of CATEGORY_DEFS) {
      grouped[cat.name] = products.filter(
        (p) => p.category === cat.name && p.status !== "deleted" && p.status !== "draft"
      );
    }
    return grouped;
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection />

      {/* ═══════════════════════════════════════════════════════════════
          SHOP BY CATEGORY — Visual Image Cards Grid (uniformer.in style)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Shop by Category
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore our curated collections for every industry
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORY_DEFS.map((cat) => (
            <a
              key={cat.name}
              href={`#${cat.anchor}`}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-100 flex flex-col justify-end p-5"
            >
              {/* Background Photography */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: cat.focus }}
              />
              {/* Gradient Overlay for Text Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity" />

              {/* Card Content */}
              <div className="relative z-10 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-300 block mb-1">
                  {cat.tagline}
                </span>
                <h3 className="font-display text-lg font-bold mb-3 leading-tight">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-black text-xs font-bold px-4 py-1.5 group-hover:bg-gray-100 transition-colors shadow-md">
                  SHOP NOW <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DEDICATED CATEGORY SECTIONS — Banner + Horizontal Product Slider
          (Matching uniformer.in's Hospitality / Healthcare style)
          ═══════════════════════════════════════════════════════════════ */}
      {CATEGORY_DEFS.map((cat) => {
        const catProducts = productsByCategory[cat.name] || [];

        return (
          <section
            key={cat.name}
            id={cat.anchor}
            className="border-t border-gray-100 scroll-mt-32 py-10 sm:py-14"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Category Hero Banner (uniformer.in style) */}
              <div className="relative mb-10 rounded-3xl overflow-hidden bg-gray-900 min-h-[300px] md:min-h-[400px] flex items-center shadow-sm">
                {/* Photo — full-bleed on mobile, right-hand panel on desktop so the square shot isn't over-cropped */}
                <div className="absolute inset-y-0 right-0 w-full md:w-1/2 lg:w-[45%]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: cat.focus }}
                  />
                  <div className="hidden md:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-900 to-transparent" />
                </div>
                {/* Overlay for text contrast on mobile */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 md:hidden" />

                {/* Banner Content */}
                <div className="relative z-10 p-8 sm:p-12 max-w-xl text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">
                    {cat.tagline}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-200 mb-6 font-light leading-relaxed">
                    {cat.desc}
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab("Retail");
                      setSelectedCategory(cat.name);
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-white text-black text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3 hover:bg-gray-100 transition-all duration-300 shadow-md"
                  >
                    SHOP NOW <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Section Sub-header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Featured in {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Top picks designed for durability & style
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("Retail");
                    setSelectedCategory(cat.name);
                    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-foreground hover:text-muted-foreground transition-colors"
                >
                  View all products <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Horizontal Product Slider */}
              {catProducts.length > 0 ? (
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
                  {catProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={(p, qty) => addToCart(p, qty)}
                        onViewDetails={setSelectedProduct}
                        viewMode="grid"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-sm text-muted-foreground border border-gray-100">
                  Custom products available for {cat.name}. Contact us for bulk orders.
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════
          BULK ORDER CTA BANNER — like uniformer.in
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Need Bulk Orders for Your Business?
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Get custom uniforms, aprons, towels, and t-shirts in your style, color, and quantity with fast delivery and best factory prices.
          </p>
          <a
            href="https://wa.me/919990197268?text=Hello,%20I'm%20interested%20in%20placing%20a%20bulk%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-foreground px-8 py-3.5 text-sm font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Start Your Bulk Order <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ALL PRODUCTS — Full filterable grid (Retail / Wholesale)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="products" className="bg-gray-50 border-y border-gray-100 scroll-mt-32">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Section Header */}
          <div className="mb-8 flex flex-col items-center px-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 text-center">
              All Products
            </h2>

            {/* Wholesale / Retail Toggle Tabs */}
            <div className="inline-flex items-center justify-center p-1 bg-white rounded-full border border-gray-200 shadow-sm mb-4">
              <button
                onClick={() => {
                  setActiveTab("Retail");
                  setSelectedCategory("All");
                }}
                className={`px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${activeTab === "Retail"
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Retail Shop
              </button>
              <button
                onClick={() => {
                  setActiveTab("Wholesale");
                  setSelectedCategory("All");
                }}
                className={`px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${activeTab === "Wholesale"
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Bulk & Wholesale
              </button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-[280px] sm:max-w-none">
              {activeTab === "Retail"
                ? "Browse single pieces for professional or personal use."
                : "Bulk supplies for salons, restaurants, and distributors (Min. 50 pieces)."}
            </p>
          </div>

          <div className="flex gap-8">
            <FilterSidebar
              selectedCategory={selectedCategory} selectedMaterial={selectedMaterial} selectedColor={selectedColor} priceRange={priceRange}
              categories={activeTab === "Retail" ? retailCategories : wholesaleCategories}
              onCategoryChange={setSelectedCategory} onMaterialChange={setSelectedMaterial} onColorChange={setSelectedColor} onPriceRangeChange={setPriceRange}
              onClearFilters={clearFilters} mobileOpen={mobileFilterOpen} onMobileClose={() => setMobileFilterOpen(false)}
            />

            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-foreground hover:bg-gray-50 hover:border-gray-300 transition-colors">
                    <SlidersHorizontal className="h-3 w-3" /> Filters
                  </button>
                  <span className="text-sm text-muted-foreground">{filteredProducts.length} products</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="hidden sm:flex rounded-full border border-gray-200 overflow-hidden">
                    <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-gray-50"}`}>
                      <Grid3X3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "hover:bg-gray-50"}`}>
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {/* Mobile View Toggle */}
                  <div className="sm:hidden flex rounded-full border border-gray-200 overflow-hidden">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-gray-50"}`}>
                      <SquareMenu className="h-4 w-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "hover:bg-gray-50"}`}>
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-100 shadow-sm">
                  <p className="text-lg font-semibold text-foreground mb-2">No products found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                  <button onClick={clearFilters} className="mt-4 text-sm font-medium text-foreground hover:underline">Clear all filters</button>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={(p, qty) => addToCart(p, qty)} onViewDetails={setSelectedProduct} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY CHOOSE US
          ═══════════════════════════════════════════════════════════════ */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-14 sm:py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Why Choose ZARRKS?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            We've been supplying premium uniforms, aprons, and home textiles for over a decade. Now available online for the first time.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Premium Quality", desc: "Durable, professional-grade fabrics built to last through heavy use" },
            { icon: Award, title: "Bulk Discounts", desc: "Special pricing for businesses, distributors, and wholesale buyers" },
            { icon: Truck, title: "Pan-India Delivery", desc: "Fast, reliable shipping across all states with order tracking" },
          ].map((item) => (
            <div key={item.title} className="group text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center mb-5">
                <div className="rounded-full bg-foreground/5 p-4 group-hover:bg-foreground/10 transition-colors">
                  <item.icon className="h-7 w-7 text-foreground" />
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Have questions? Email us at{" "}
            <a href="mailto:zarrksenterprises@gmail.com" className="text-foreground font-medium hover:underline transition-colors">
              zarrksenterprises@gmail.com
            </a>
          </p>
        </div>
      </section>

      <Footer />

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQty={updateCartQty} onRemove={removeFromCart} onClearCart={clearCart} />

      {/* Floating Action Buttons */}
      {!cartOpen && (
        <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
          <div className="mx-auto max-w-7xl px-4 flex justify-between items-end">
            {/* Phone Floating Button (Left) */}
            <a
              href="tel:+919990197268"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 pointer-events-auto"
              aria-label="Call Us"
            >
              <Phone className="h-6 w-6 fill-current" />
            </a>

            {/* WhatsApp Floating Button (Right) */}
            <a
              href="https://wa.me/919990197268"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 pointer-events-auto"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp className="h-7 w-7 fill-current" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
