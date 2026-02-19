import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
}

const CartDrawer = ({ open, onClose, items, onUpdateQty, onRemove }: CartDrawerProps) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
          </h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 glass rounded-xl p-3">
                  <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                    <p className="text-sm font-bold text-foreground mt-1">₹{item.product.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="p-1 hover:bg-muted rounded-l-full"><Minus className="h-3 w-3" /></button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="p-1 hover:bg-muted rounded-r-full"><Plus className="h-3 w-3" /></button>
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
              <span className="font-bold text-foreground">₹{total}</span>
            </div>
            <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
