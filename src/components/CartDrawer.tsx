import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: number | string, qty: number) => void;
  onRemove: (productId: number | string) => void;
  onClearCart?: () => void;
}

const CartDrawer = ({ open, onClose, items, onUpdateQty, onRemove, onClearCart }: CartDrawerProps) => {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasWholesale = items.some(item => item.product.salesType === "Wholesale");

  const handleCheckout = () => {
    if (hasWholesale) {
      // Wholesale-only quick checkout via WhatsApp
      const wholesaleItems = items.filter(i => i.product.salesType === "Wholesale");
      const message = "Hello! I would like to place a bulk order:%0A" +
        wholesaleItems.map(i => `- ${i.quantity}x ${i.product.name} (${i.product.category})`).join("%0A");
      window.open(`https://wa.me/919990197268?text=${message}`, '_blank');
      return;
    }
    // Navigate to the checkout page
    onClose();
    navigate("/checkout");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl flex flex-col border-l border-primary/10">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
          </h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-primary/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 glass rounded-xl p-3 border-glow">
                  <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                    <p className="text-sm font-bold text-primary mt-1">₹{item.product.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="p-1 hover:bg-primary/10 rounded-l-full"><Minus className="h-3 w-3" /></button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="p-1 hover:bg-primary/10 rounded-r-full"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => onRemove(item.product.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={handleCheckout}
              className={`w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-lg transition-all duration-300 ${hasWholesale
                ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-emerald-500/30 glow-blue"
                : "bg-primary text-primary-foreground hover:shadow-primary/30 hover:shadow-xl glow-blue"
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
