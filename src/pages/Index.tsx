import { useState, useMemo } from "react";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import ProductDetailModal from "@/components/ProductDetailModal";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { products, sortOptions, type Product } from "@/data/products";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
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
  }, [searchQuery, selectedCategory, selectedMaterial, selectedColor, priceRange, sortBy]);

  const addToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
  };

  const updateCartQty = (productId: number, qty: number) => {
    if (qty <= 0) { setCart((prev) => prev.filter((i) => i.product.id !== productId)); return; }
    setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (productId: number) => setCart((prev) => prev.filter((i) => i.product.id !== productId));
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

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
      <section id="products" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Our Collection</h2>
          <p className="text-muted-foreground">Browse our range of professional salon capes and aprons</p>
        </div>

        <div className="flex gap-8">
          <FilterSidebar
            selectedCategory={selectedCategory} selectedMaterial={selectedMaterial} selectedColor={selectedColor} priceRange={priceRange}
            onCategoryChange={setSelectedCategory} onMaterialChange={setSelectedMaterial} onColorChange={setSelectedColor} onPriceRangeChange={setPriceRange}
            onClearFilters={clearFilters} mobileOpen={mobileFilterOpen} onMobileClose={() => setMobileFilterOpen(false)}
          />

          <div className="flex-1">
            {/* Toolbar */}
            <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors">
                  <SlidersHorizontal className="h-3 w-3" /> Filters
                </button>
                <span className="text-sm text-muted-foreground">{filteredProducts.length} products</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="hidden sm:flex rounded-full border border-border overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="mt-4 text-sm font-medium text-primary hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={(p) => addToCart(p)} onViewDetails={setSelectedProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Why Choose ZARRKS?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            We've been supplying premium salon capes and aprons for over a decade. Now available online for the first time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Premium Quality", desc: "Waterproof, durable fabrics built to last" },
              { title: "Bulk Discounts", desc: "Special pricing for salons and distributors" },
              { title: "Pan-India Delivery", desc: "Fast shipping across all states" },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQty={updateCartQty} onRemove={removeFromCart} />
    </div>
  );
};

export default Index;
