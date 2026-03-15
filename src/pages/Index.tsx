import { useState, useMemo } from "react";
import { SlidersHorizontal, Grid3X3, List, Shield, Truck, Award, Phone, SquareMenu } from "lucide-react";
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

const Index = () => {
  const { products, loading } = useProducts();
  const { cart, addToCart, updateCartQty, removeFromCart, clearCart, cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Retail" | "Wholesale">("Retail");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (p.isRemoved) return false;
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
    setPriceRange([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection />

      {/* Products Section */}
      <section id="products" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section Header */}
        <div className="mb-6 flex flex-col items-center px-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 uppercase tracking-wider text-center">Our Collection</h2>

          {/* Wholesale / Retail Toggle Tabs */}
          <div className="inline-flex items-center justify-center p-1 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm mb-4">
            <button
              onClick={() => {
                setActiveTab("Retail");
                setSelectedCategory("All");
              }}
              className={`px-4 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "Retail"
                ? "bg-primary text-primary-foreground shadow-lg glow-blue"
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
              className={`px-4 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "Wholesale"
                ? "bg-primary text-primary-foreground shadow-lg glow-blue"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Bulk & Wholesale
            </button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-[280px] sm:max-w-none">
            {activeTab === "Retail"
              ? "Browse single pieces for professional or personal use."
              : "Bulk supplies for salons, academies, and distributors (Min. 50 pieces)."}
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
            <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border-glow">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-primary/10 hover:border-primary/20 transition-colors">
                  <SlidersHorizontal className="h-3 w-3" /> Filters
                </button>
                <span className="text-sm text-muted-foreground">{filteredProducts.length} products</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="hidden sm:flex rounded-full border border-border overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}>
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}>
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Mobile View Toggle */}
                <div className="sm:hidden flex rounded-full border border-border overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}>
                    <SquareMenu className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center border-glow">
                <p className="text-lg font-semibold text-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="mt-4 text-sm font-medium text-primary hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={(p, qty) => addToCart(p, qty)} onViewDetails={setSelectedProduct} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 md:p-12 text-center border-glow">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4 uppercase tracking-wider">Why Choose ZARRKS?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            We've been supplying premium salon capes and aprons for over a decade. Now available online for the first time.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-10">
            Have questions? Email us at <a href="mailto:zarrksenterprises@gmail.com" className="text-primary hover:underline transition-colors font-medium">zarrksenterprises@gmail.com</a>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Premium Quality", desc: "Waterproof, durable fabrics built to last through thousands of cuts" },
              { icon: Award, title: "Bulk Discounts", desc: "Special pricing for salons, distributors, and wholesale buyers" },
              { icon: Truck, title: "Pan-India Delivery", desc: "Fast, reliable shipping across all states with order tracking" },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6 group hover:glow-blue transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
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
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 pointer-events-auto border border-primary-foreground/20 shimmer"
              aria-label="Call Us"
            >
              <Phone className="h-6 w-6 fill-current" />
            </a>

            {/* WhatsApp Floating Button (Right) */}
            <a
              href="https://wa.me/919990197268"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 pointer-events-auto border border-white/20 shimmer"
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
