import { X, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

const ProductDetailModal = ({ product, onClose, onAddToCart }: ProductDetailModalProps) => {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-muted p-2 hover:bg-accent transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-muted rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{product.category}</span>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">{product.name}</h2>

            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Material</span><span className="font-medium text-foreground">{product.material}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Color</span><span className="font-medium text-foreground">{product.color}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Availability</span><span className={`font-medium ${product.inStock ? "text-green-600" : "text-destructive"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span></div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-700">{discount}% off</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted rounded-l-full transition-colors"><Minus className="h-4 w-4" /></button>
                <span className="px-4 text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-muted rounded-r-full transition-colors"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={() => { onAddToCart(product, qty); onClose(); }}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
