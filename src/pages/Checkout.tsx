import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft, MapPin, Plus, Check, Edit2, Trash2, Package, Truck,
    ShoppingBag, Loader2, CreditCard, ChevronDown, Home, Briefcase, Building2
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useAddresses, INDIAN_STATES, type Address } from "@/hooks/useAddresses";

// Label icon map
const labelIcons: Record<string, any> = {
    Home: Home,
    Office: Briefcase,
    Warehouse: Building2,
};

const emptyForm = {
    label: "Home",
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    saveForLater: true,
};

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [placing, setPlacing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const hasWholesale = cart.some((item) => item.product.salesType === "Wholesale");
    const shippingCost = cartTotal >= 999 ? 0 : 99;
    const grandTotal = cartTotal + shippingCost;

    // Auto-select default/first address on mount
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const def = addresses.find((a) => a.isDefault) || addresses[0];
            setSelectedAddressId(def.id);
        }
    }, [addresses, selectedAddressId]);

    // If no addresses exist, auto-show the form
    useEffect(() => {
        if (addresses.length === 0) {
            setShowAddressForm(true);
        }
    }, [addresses]);

    // Redirect if cart is empty (and not showing success)
    useEffect(() => {
        if (cart.length === 0 && !orderSuccess) {
            navigate("/");
        }
    }, [cart, orderSuccess, navigate]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingAddressId(null);
        setShowAddressForm(false);
    };

    const handleSaveAddress = () => {
        // Validate required fields
        if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.pincode) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (form.phone.length < 10) {
            toast.error("Please enter a valid phone number.");
            return;
        }
        if (form.pincode.length !== 6) {
            toast.error("Please enter a valid 6-digit pincode.");
            return;
        }

        const addressData: Omit<Address, "id"> = {
            label: form.label,
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            isDefault: addresses.length === 0,
        };

        if (editingAddressId) {
            updateAddress(editingAddressId, addressData);
            setSelectedAddressId(editingAddressId);
            toast.success("Address updated!");
        } else {
            if (form.saveForLater) {
                const newId = addAddress(addressData);
                setSelectedAddressId(newId);
                toast.success("Address saved!");
            } else {
                // Use as temporary (not saved) — create a temporary id
                const tempId = `temp_${Date.now()}`;
                setSelectedAddressId(tempId);
                // Store temporarily in a ref-like approach via state
                (window as any).__tempCheckoutAddress = { ...addressData, id: tempId };
                toast.success("Address set for this order.");
            }
        }
        resetForm();
    };

    const handleEditAddress = (addr: Address) => {
        setForm({
            label: addr.label,
            fullName: addr.fullName,
            phone: addr.phone,
            email: addr.email,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            saveForLater: true,
        });
        setEditingAddressId(addr.id);
        setShowAddressForm(true);
    };

    const getSelectedAddress = (): Address | undefined => {
        if (selectedAddressId?.startsWith("temp_")) {
            return (window as any).__tempCheckoutAddress;
        }
        return addresses.find((a) => a.id === selectedAddressId);
    };

    const handlePlaceOrder = async () => {
        const address = getSelectedAddress();
        if (!address) {
            toast.error("Please select or add a shipping address.");
            return;
        }

        // For wholesale items, redirect to WhatsApp
        if (hasWholesale) {
            const message =
                "Hello! I would like to place a bulk order:%0A" +
                cart
                    .filter((i) => i.product.salesType === "Wholesale")
                    .map((i) => `- ${i.quantity}x ${i.product.name} (${i.product.category})`)
                    .join("%0A") +
                "%0A%0AShipping to: " +
                `${address.fullName}, ${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}` +
                `%0APhone: ${address.phone}`;
            window.open(`https://wa.me/919990197268?text=${message}`, "_blank");
            return;
        }

        setPlacing(true);
        try {
            const orderData = {
                items: cart.map((item) => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image,
                })),
                totalAmount: grandTotal,
                subtotal: cartTotal,
                shippingCost,
                status: "pending",
                paymentMethod: "COD",
                createdAt: serverTimestamp(),
                shippingAddress: {
                    fullName: address.fullName,
                    phone: address.phone,
                    email: address.email,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                },
            };

            await addDoc(collection(db, "orders"), orderData);
            setOrderSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setPlacing(false);
        }
    };

    // ── Success Screen ──────────────────────────────────────
    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-md w-full text-center border-glow">
                    <div className="mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 p-4 w-fit">
                        <Check className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3 uppercase tracking-wider">
                        Order Placed!
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Your order has been placed successfully. We'll notify you when it's shipped.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 glow-blue"
                    >
                        <ShoppingBag className="h-4 w-4" /> Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // ── Main Checkout Layout ────────────────────────────────
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <button onClick={() => navigate("/")} className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <h1 className="font-display text-xl font-bold uppercase tracking-widest text-foreground">Checkout</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── LEFT: Shipping Address ──────────────── */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass rounded-2xl p-6 border-glow">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" /> Shipping Address
                                </h2>
                                {addresses.length > 0 && !showAddressForm && (
                                    <button
                                        onClick={() => { setForm(emptyForm); setEditingAddressId(null); setShowAddressForm(true); }}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add New
                                    </button>
                                )}
                            </div>

                            {/* Saved Addresses */}
                            {addresses.length > 0 && !showAddressForm && (
                                <div className="space-y-3">
                                    {addresses.map((addr) => {
                                        const IconComp = labelIcons[addr.label] || MapPin;
                                        const isSelected = selectedAddressId === addr.id;
                                        return (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 border ${isSelected
                                                        ? "border-primary bg-primary/5 glow-blue"
                                                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Radio */}
                                                    <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "border-primary" : "border-muted-foreground/40"
                                                        }`}>
                                                        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <IconComp className="h-3.5 w-3.5 text-primary" />
                                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">{addr.label}</span>
                                                            {addr.isDefault && (
                                                                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-semibold text-foreground">{addr.fullName}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                                                        <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} — {addr.pincode}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">📞 {addr.phone}{addr.email && ` · ${addr.email}`}</p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteAddress(addr.id);
                                                                if (selectedAddressId === addr.id) setSelectedAddressId(null);
                                                            }}
                                                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Address Form */}
                            {showAddressForm && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    {/* Label selector */}
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Address Type</label>
                                        <div className="flex gap-2">
                                            {["Home", "Office", "Warehouse"].map((label) => {
                                                const Ic = labelIcons[label] || MapPin;
                                                return (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => setForm({ ...form, label })}
                                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${form.label === label
                                                                ? "border-primary bg-primary/10 text-primary"
                                                                : "border-border text-muted-foreground hover:border-primary/30"
                                                            }`}
                                                    >
                                                        <Ic className="h-3.5 w-3.5" /> {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Full Name *" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} placeholder="John Doe" />
                                        <InputField label="Phone Number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="9876543210" type="tel" maxLength={10} />
                                        <InputField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="email@example.com" type="email" />
                                        <InputField label="Pincode *" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} placeholder="110001" maxLength={6} />
                                    </div>
                                    <InputField label="Address Line 1 *" value={form.addressLine1} onChange={(v) => setForm({ ...form, addressLine1: v })} placeholder="House/Flat No., Street, Landmark" />
                                    <InputField label="Address Line 2" value={form.addressLine2} onChange={(v) => setForm({ ...form, addressLine2: v })} placeholder="Colony, Area (Optional)" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="New Delhi" />
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">State *</label>
                                            <div className="relative">
                                                <select
                                                    value={form.state}
                                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                                    className="w-full bg-background/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 appearance-none"
                                                >
                                                    <option value="">Select State</option>
                                                    {INDIAN_STATES.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save for later checkbox */}
                                    {!editingAddressId && (
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div
                                                onClick={() => setForm({ ...form, saveForLater: !form.saveForLater })}
                                                className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${form.saveForLater ? "bg-primary border-primary" : "border-muted-foreground/40 group-hover:border-primary/50"
                                                    }`}
                                            >
                                                {form.saveForLater && <Check className="h-3 w-3 text-primary-foreground" />}
                                            </div>
                                            <span className="text-sm text-muted-foreground">Save this address for future orders</span>
                                        </label>
                                    )}

                                    {/* Form Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleSaveAddress}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all"
                                        >
                                            <Check className="h-4 w-4" />
                                            {editingAddressId ? "Update Address" : "Use This Address"}
                                        </button>
                                        {addresses.length > 0 && (
                                            <button
                                                onClick={resetForm}
                                                className="px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-muted/30 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="glass rounded-2xl p-6 border-glow">
                            <h2 className="font-display text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
                                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                            </h2>
                            <div className="rounded-xl border border-primary bg-primary/5 p-4 flex items-center gap-3 glow-blue">
                                <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Cash on Delivery</p>
                                    <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 italic">
                                More payment options (Razorpay) coming soon.
                            </p>
                        </div>
                    </div>

                    {/* ── RIGHT: Order Summary ──────────────── */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-2xl border-glow sticky top-24">
                            <div className="p-6 border-b border-border">
                                <h2 className="font-display text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" /> Order Summary
                                </h2>
                            </div>

                            {/* Items */}
                            <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-primary mt-0.5">
                                                ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="p-6 border-t border-border space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                    <span className="font-medium text-foreground">₹{cartTotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Truck className="h-3.5 w-3.5" /> Shipping
                                    </span>
                                    <span className={`font-medium ${shippingCost === 0 ? "text-emerald-400" : "text-foreground"}`}>
                                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                                    </span>
                                </div>
                                {shippingCost > 0 && (
                                    <p className="text-[11px] text-muted-foreground/70 italic">Free shipping on orders above ₹999</p>
                                )}
                                <div className="border-t border-border pt-3 flex justify-between">
                                    <span className="font-display text-base font-bold text-foreground uppercase tracking-wide">Total</span>
                                    <span className="font-display text-xl font-bold text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <div className="p-6 pt-0">
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placing || (!selectedAddressId && !showAddressForm)}
                                    className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-blue"
                                >
                                    {placing ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : hasWholesale ? (
                                        <>Order via WhatsApp</>
                                    ) : (
                                        <>
                                            <ShoppingBag className="h-4 w-4" /> Place Order — ₹{grandTotal.toLocaleString("en-IN")}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

// ── Reusable Input Field ──────────────────────────────────
const InputField = ({
    label, value, onChange, placeholder, type = "text", maxLength,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    type?: string;
    maxLength?: number;
}) => (
    <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full bg-background/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all"
        />
    </div>
);

export default Checkout;
