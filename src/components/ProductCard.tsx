import { useState } from "react";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, qty?: number) => void;
  onViewDetails: (product: Product) => void;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ product, onAddToCart, onViewDetails, viewMode = "grid" }: ProductCardProps) => {
  const [qty, setQty] = useState(product.salesType === "Wholesale" ? 50 : 1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const images = product.images || [];
  const currentImage = images.length > 0 ? images[currentImageIndex] : "";

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div
      className={`group glass rounded-2xl overflow-hidden transition-all duration-300 hover:glow-blue hover:-translate-y-1 cursor-pointer shimmer ${viewMode === "list" ? "flex items-center" : "flex flex-col"
        }`}
      onClick={() => onViewDetails(product)}
    >
      {/* Image with Slideshow */}
      <div className={`relative overflow-hidden bg-muted flex-shrink-0 ${viewMode === "list" ? "w-32 h-32 lg:w-48 lg:h-48" : "w-full aspect-square"
        }`}>
        <img
          src={currentImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-primary w-4" : "bg-white/50 w-1.5 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Dark gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,8%,0.6)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground glow-blue">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span className="rounded-full bg-card/90 border border-border px-4 py-2 text-sm font-semibold text-foreground">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`flex flex-col flex-grow ${viewMode === "list" ? "p-4 sm:p-6" : "p-4"}`}>
        <p className="text-xs font-medium text-primary uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        {/* Wholesale Quantity Selector */}
        {product.salesType === "Wholesale" && (
          <div className={`mb-4 space-y-2 ${viewMode === "list" ? "max-w-xs" : ""}`}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Bulk Qty (Min 50)</p>
            <div className="flex flex-wrap gap-1.5">
              {[50, 100, 200].map((preset) => (
                <button
                  key={preset}
                  onClick={(e) => { e.stopPropagation(); setQty(preset); }}
                  className={`px-2 py-1 text-xs font-semibold rounded border transition-all duration-200 ${qty === preset
                    ? "bg-primary text-primary-foreground border-primary glow-blue"
                    : "bg-muted/40 text-foreground border-border hover:bg-primary/10 hover:border-primary/30"
                    }`}
                >
                  {preset}
                </button>
              ))}
              <input
                type="number"
                min="50"
                value={![50, 100, 200].includes(qty) || qty === 0 ? (qty === 0 ? "" : qty) : ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setQty(0);
                  } else {
                    const num = parseInt(val);
                    if (!isNaN(num)) setQty(num);
                  }
                }}
                onBlur={() => { if (qty < 50) setQty(50); }}
                placeholder="Custom"
                className={`w-14 sm:w-16 px-1.5 py-1 text-sm font-semibold rounded border bg-muted/40 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all ${![50, 100, 200].includes(qty) && qty >= 50 ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
              />
            </div>
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">₹{product.price}</span>
            <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            <span className="text-xs font-semibold text-emerald-400">{discount}% off</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock) onAddToCart(product, qty);
            }}
            disabled={!product.inStock}
            className="rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:shadow-primary/40 hover:shadow-lg transition-all duration-200 disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
