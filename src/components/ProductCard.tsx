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

  const images = (product.images || []).filter(img => img && img.length > 0);
  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f5f5f5' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' text-anchor='middle' x='200' y='200'%3ENo Image%3C/text%3E%3C/svg%3E";
  const currentImage = images.length > 0 ? images[currentImageIndex] : PLACEHOLDER;

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

  if (viewMode === "list") {
    return (
      <div
        className="group flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden hover-lift cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        {/* Image */}
        <div className="relative overflow-hidden flex-shrink-0 w-32 h-32 lg:w-48 lg:h-48 bg-gray-50">
          <img
            src={currentImage}
            alt={product.name}
            className="h-full w-full object-contain img-zoom"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 badge-sale">Save {discount}%</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-grow p-4 sm:p-6">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-lg font-bold text-foreground">₹{product.price}</span>
            <span className="text-sm price-original">₹{product.originalPrice}</span>
            {discount > 0 && (
              <span className="text-xs text-save">Save {discount}%</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover-lift cursor-pointer flex flex-col"
      onClick={() => onViewDetails(product)}
    >
      {/* Image with Slideshow */}
      <div className="relative overflow-hidden bg-gray-50 w-full aspect-square">
        <img
          src={currentImage}
          alt={product.name}
          className="h-full w-full object-contain img-zoom"
          loading="lazy"
        />

        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
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
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-foreground w-4"
                      : "bg-foreground/30 w-1.5 hover:bg-foreground/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 badge-sale">Save {discount}%</span>
        )}
        {product.badge && (
          <span className="absolute top-3 right-3 rounded-full bg-foreground text-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-muted-foreground transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        {/* Wholesale Quantity Selector */}
        {product.salesType === "Wholesale" && (
          <div className="mb-3 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Bulk Qty (Min 50)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[50, 100, 200].map((preset) => (
                <button
                  key={preset}
                  onClick={(e) => { e.stopPropagation(); setQty(preset); }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all duration-200 ${
                    qty === preset
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white text-foreground border-gray-200 hover:bg-gray-50 hover:border-gray-300"
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
                className={`w-16 px-2 py-1 text-xs font-semibold rounded-md border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all ${
                  ![50, 100, 200].includes(qty) && qty >= 50 ? "border-foreground bg-gray-50" : "border-gray-200"
                }`}
              />
            </div>
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">₹{product.price}</span>
              <span className="text-xs price-original">₹{product.originalPrice}</span>
            </div>
            {discount > 0 && (
              <span className="text-xs text-save">Save {discount}%</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock) onAddToCart(product, qty);
            }}
            disabled={!product.inStock}
            className="rounded-full bg-foreground p-2.5 text-background shadow-sm hover:bg-foreground/80 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
