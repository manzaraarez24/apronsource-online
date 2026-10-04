import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product, products as initialProducts } from "@/data/products";
import { getCartKey, type CartItem } from "@/hooks/useCart";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (cartKey: string, qty: number) => void;
  onRemove: (cartKey: string) => void;
  onClearCart?: () => void;
}

// Helper to fix stringified local Vite paths
const resolveImage = (product: Product) => {
  let img = product.image || product.images?.[0];
  if (img && !img.startsWith('http') && !img.startsWith('data:')) {
    const localMatch = initialProducts.find(p => p.id === product.id || p.name === product.name);
    if (localMatch) img = localMatch.image || localMatch.images?.[0];
  }
  return img;
};

const CartDrawer = ({ open, onClose, items, onUpdateQty, onRemove }: CartDrawerProps) => {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasWholesale = items.some(item => item.product.salesType === "Wholesale");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleCheckout = () => {
    if (hasWholesale) {
      // Bulk orders are confirmed over WhatsApp. Send every item, not just the wholesale ones.
      window.open(buildWhatsAppOrderUrl(items), '_blank');
      return;
    }
    onClose();
    navigate("/checkout");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your Cart
          </h3>
          <button onClick={onClose} aria-label="Close cart" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const key = getCartKey(item);
                const isWholesale = item.product.salesType === "Wholesale";
                return (
                  <div key={key} className="flex gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <img src={resolveImage(item.product)} alt={item.product.name} className="h-20 w-20 rounded-lg object-contain bg-white flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.size && <>Size: {item.size} · </>}{isWholesale ? `Bulk (min 50)` : "Retail"}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">₹{item.product.price}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-full border border-gray-200 bg-white">
                          <button
                            onClick={() => onUpdateQty(key, item.quantity - (isWholesale ? 10 : 1))}
                            disabled={isWholesale ? item.quantity <= 50 : item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="p-1.5 hover:bg-gray-50 rounded-l-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(key, item.quantity + (isWholesale ? 10 : 1))}
                            aria-label="Increase quantity"
                            className="p-1.5 hover:bg-gray-50 rounded-r-full transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => onRemove(key)} aria-label="Remove item" className="p-1.5 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </div>
            {hasWholesale && (
              <p className="text-xs text-muted-foreground">Your cart has bulk items, so the whole order is confirmed with us on WhatsApp.</p>
            )}
            <button
              onClick={handleCheckout}
              className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold shadow-sm transition-all duration-300 ${
                hasWholesale
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {hasWholesale ? "Checkout via WhatsApp" : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
