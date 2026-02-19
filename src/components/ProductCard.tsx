import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onViewDetails }: ProductCardProps) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div
      className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
            <span className="rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">₹{product.price}</span>
            <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            <span className="text-xs font-semibold text-green-600">{discount}% off</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock) onAddToCart(product);
            }}
            disabled={!product.inStock}
            className="rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
