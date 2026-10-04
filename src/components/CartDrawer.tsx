import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product, products as initialProducts } from "@/data/products";

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

// Helper to fix stringified local Vite paths
const resolveImage = (product: Product) => {
  let img = product.image;
  if (img && !img.startsWith('http') && !img.startsWith('data:')) {
    const localMatch = initialProducts.find(p => p.id === product.id || p.name === product.name);
    if (localMatch) img = localMatch.image;
  }
  return img;
};

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
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your Cart
          </h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
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
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <img src={resolveImage(item.product)} alt={item.product.name} className="h-20 w-20 rounded-lg object-contain bg-white flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                    <p className="text-sm font-bold text-foreground mt-1">₹{item.product.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-full border border-gray-200 bg-white">
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 rounded-l-full transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 rounded-r-full transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => onRemove(item.product.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
