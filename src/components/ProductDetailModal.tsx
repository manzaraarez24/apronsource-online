import { X, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

const ProductDetailModal = ({ product, onClose, onAddToCart }: ProductDetailModalProps) => {
  const [qty, setQty] = useState(1);

  // Reset qty when a new product is opened (50 for wholesale, 1 for retail)
  useEffect(() => {
    if (product) {
      setQty(product.salesType === "Wholesale" ? 50 : 1);
    }
  }, [product]);

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-strong rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-primary/10">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-muted p-2 hover:bg-primary/10 hover:text-primary transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-muted rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{product.category}</span>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3 uppercase tracking-wide">{product.name}</h2>

            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/50"><span className="text-muted-foreground">Material</span><span className="font-medium text-foreground">{product.material}</span></div>
              <div className="flex justify-between py-1.5 border-b border-border/50"><span className="text-muted-foreground">Color</span><span className="font-medium text-foreground">{product.color}</span></div>
              <div className="flex justify-between py-1.5"><span className="text-muted-foreground">Availability</span><span className={`font-medium ${product.inStock ? "text-emerald-400" : "text-destructive"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span></div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400">{discount}% off</span>
            </div>

            {/* Quantity Selector Logic based on SalesType */}
            {product.salesType === "Wholesale" ? (
              <div className="mb-6 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Select Bulk Quantity (Min 50)</p>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setQty(preset)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${qty === preset
                        ? "bg-primary text-primary-foreground border-primary glow-blue"
                        : "bg-muted/40 text-foreground border-border hover:bg-primary/10 hover:border-primary/30"
                        }`}
                    >
                      {preset}
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      value={![50, 100, 200].includes(qty) || qty === 0 ? (qty === 0 ? "" : qty) : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setQty(0);
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num)) setQty(num);
                        }
                      }}
                      onBlur={() => {
                        if (qty < 50) setQty(50);
                      }}
                      placeholder="Custom"
                      className={`w-28 px-4 py-2 text-sm font-semibold rounded-lg border bg-muted/40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all ${![50, 100, 200].includes(qty) && qty >= 50 ? "border-primary bg-primary/10 text-primary" : "border-border"
                        }`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center rounded-full border border-border">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-primary/10 rounded-l-full transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="px-4 text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-primary/10 rounded-r-full transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            <button
              onClick={() => { onAddToCart(product, Math.max(product.salesType === "Wholesale" ? 50 : 1, qty)); onClose(); }}
              disabled={!product.inStock}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 disabled:opacity-40 glow-blue"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart {product.salesType === "Wholesale" && <span className="text-primary-foreground/80 font-normal">({Math.max(50, qty)} pieces)</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
