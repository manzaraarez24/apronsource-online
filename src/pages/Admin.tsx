import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { auth, db, storage } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { seedProductsToFirestore } from "../data/seedFirestore";
import { Shield, Package, ShoppingCart, LogOut, Loader2, Database, Plus, Image as ImageIcon, Users } from "lucide-react";
import { toast } from "sonner";
import { retailCategories, wholesaleCategories, materials, colors, salesTypes } from "../data/products";

// Login Component
const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Successfully logged in");
        } catch (err: any) {
            toast.error(err.message || "Failed to login. Please check credentials or Firebase setup.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md glass p-8 rounded-3xl border-glow">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-primary/10 p-4 border border-primary/20">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl font-display font-bold text-center text-foreground mb-6 uppercase tracking-wider">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-3 mt-4 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Add Product Component
const AddProductForm = ({ onProductAdded }: { onProductAdded: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        originalPrice: "",
        category: retailCategories[1],
        material: materials[1],
        color: colors[1],
        salesType: "Retail",
        description: "",
        badge: "",
    });

    const activeCategories = formData.salesType === "Retail" ? retailCategories : wholesaleCategories;

    // Reset category if it doesn't exist in the newly selected list
    useEffect(() => {
        if (!activeCategories.includes(formData.category)) {
            setFormData(prev => ({ ...prev, category: activeCategories[1] || activeCategories[0] }));
        }
    }, [formData.salesType, activeCategories, formData.category]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please select a product image first.");
            return;
        }

        setLoading(true);
        try {
            console.log("Starting product upload...");
            console.log("Image file:", imageFile.name, "Size:", imageFile.size, "bytes");

            // Helper: timeout wrapper to prevent infinite loading
            const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
                return Promise.race([
                    promise,
                    new Promise<T>((_, reject) =>
                        setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s. Check your Firebase Storage configuration and internet connection.`)), ms)
                    ),
                ]);
            };

            // 1. Upload Image to Storage
            console.log("Uploading image to Firebase Storage...");
            const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            const snapshot = await withTimeout(uploadBytes(storageRef, imageFile), 30000, "Image upload");
            console.log("Image uploaded, getting download URL...");
            const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 10000, "Get download URL");
            console.log("Download URL obtained:", downloadURL);

            // 2. Save Product to Firestore
            console.log("Saving product to Firestore...");
            const productData = {
                id: Date.now(),
                name: formData.name,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                image: downloadURL,
                category: formData.category,
                material: formData.material,
                color: formData.color,
                salesType: formData.salesType,
                description: formData.description,
                badge: formData.badge,
                rating: 0,
                reviews: 0,
                inStock: true,
            };

            await withTimeout(addDoc(collection(db, "products"), productData), 10000, "Firestore save");
            console.log("Product saved successfully!");
            toast.success("Product added successfully!");

            // Reset Form
            setFormData({
                name: "", price: "", originalPrice: "", category: activeCategories[1] || activeCategories[0],
                material: materials[1], color: colors[1], salesType: "Retail",
                description: "", badge: ""
            });
            setImageFile(null);
            setPreviewUrl(null);
            onProductAdded();

        } catch (error: any) {
            console.error("Error adding product:", error);
            let msg = error.message || "Failed to add product.";
            if (error.code === "storage/unauthorized") {
                msg = "Storage permission denied. Check your Firebase Storage rules.";
            } else if (error.code === "storage/canceled") {
                msg = "Upload was canceled.";
            } else if (error.code === "storage/unknown") {
                msg = "Unknown storage error. Check your Firebase Storage configuration and CORS settings.";
            }
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="glass p-6 rounded-2xl border-glow space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <Plus className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-lg uppercase tracking-wider">Add New Product</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload Area */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Product Image *</label>
                    <div className="relative border-2 border-dashed border-border rounded-xl aspect-video md:aspect-[21/9] flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer overflow-hidden group">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" required />
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                        ) : (
                            <div className="text-center p-6">
                                <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                                <p className="text-sm font-medium">Click or drag image to upload</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Product Name *</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Selling Price (₹) *</label>
                            <input type="number" required min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Original Price (₹) *</label>
                            <input type="number" required min="0" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Sales Type *</label>
                        <select value={formData.salesType} onChange={e => setFormData({ ...formData, salesType: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                            {salesTypes.filter(t => t !== "All").map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Category *</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                            {activeCategories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Material *</label>
                            <select value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                {materials.filter(m => m !== "All").map(mat => <option key={mat} value={mat}>{mat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Color *</label>
                            <select value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                {colors.filter(c => c !== "All").map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Badge (Optional)</label>
                        <input type="text" placeholder="e.g. Bestseller, New" value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Description *</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary resize-none" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold rounded-lg py-3 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Plus className="h-5 w-5" /> Upload Product</>}
            </button>
        </form>
    );
};

// Dashboard Component
const AdminDashboard = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [activeTab, setActiveTab] = useState<"orders" | "customers" | "products">("orders");

    useEffect(() => {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoadingOrders(false);
            }, (error) => {
                console.warn("Could not load orders. Missing Firebase config? Error:", error);
                setLoadingOrders(false);
            });
            return () => unsubscribe();
        } catch (error) {
            console.warn("Firestore error when getting orders:", error);
            setLoadingOrders(false);
        }
    }, []);

    // Aggregate unique customers from orders
    const customers = orders.reduce((acc: any[], order) => {
        const details = order.customerDetails;
        if (!details || !details.email) return acc;

        const existing = acc.find(c => c.email === details.email);
        if (existing) {
            existing.totalSpent += Number(order.totalAmount || 0);
            existing.orderCount += 1;
            // Update latest contact info if available
            if (details.phone) existing.phone = details.phone;
            if (details.name) existing.name = details.name;
        } else {
            acc.push({
                name: details.name || "Guest",
                email: details.email,
                phone: details.phone || "N/A",
                totalSpent: Number(order.totalAmount || 0),
                orderCount: 1
            });
        }
        return acc;
    }, []);

    const handleSeed = async () => {
        setSeeding(true);
        const result = await seedProductsToFirestore();
        if (result.success) toast.success(result.message);
        else toast.error(result.message);
        setSeeding(false);
    };

    const handleLogout = () => signOut(auth);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="font-display font-bold text-xl uppercase tracking-widest">Admin Dashboard</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "orders" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("customers")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "customers" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Customers
                        </button>
                        <button
                            onClick={() => setActiveTab("products")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "products" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Manage Products
                        </button>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Mobile Tab Select */}
                <div className="md:hidden">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as any)}
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground"
                    >
                        <option value="orders">Orders</option>
                        <option value="customers">Customers</option>
                        <option value="products">Products</option>
                    </select>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl border-glow flex items-start justify-between">
                        <div>
                            <p className="text-muted-foreground mb-1 flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Total Orders</p>
                            <h3 className="text-3xl font-display font-bold">{loadingOrders ? "..." : orders.length}</h3>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl border-glow flex items-start justify-between">
                        <div>
                            <p className="text-muted-foreground mb-1 flex items-center gap-2"><Users className="h-4 w-4" /> Total Customers</p>
                            <h3 className="text-3xl font-display font-bold">{loadingOrders ? "..." : customers.length}</h3>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl border-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground mb-1 flex items-center gap-2"><Database className="h-4 w-4" /> Maintenance</p>
                                <h3 className="text-lg font-display font-bold underline decoration-primary/30">Database</h3>
                            </div>
                            <button
                                onClick={handleSeed}
                                disabled={seeding}
                                className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                                title="Auto-Seed Default Products"
                            >
                                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </section>

                {activeTab === "products" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AddProductForm onProductAdded={() => { }} />
                    </div>
                )}

                {activeTab === "orders" && (
                    <section className="glass rounded-2xl border-glow overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
                            <h2 className="text-xl font-display font-bold uppercase tracking-wider flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-primary" /> Recent Orders
                            </h2>
                        </div>
                        <div className="p-0">
                            {loadingOrders ? (
                                <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                    <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No orders received yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-muted/30 border-b border-border text-sm text-muted-foreground">
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Order ID</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Items</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{order.id.slice(0, 8)}...</td>
                                                    <td className="px-6 py-4 text-sm">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium">{order.customerDetails?.name || 'Guest'}</div>
                                                        <div className="text-xs text-muted-foreground">{order.customerDetails?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                                        {order.items?.length || 0} items
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-right text-primary">₹{order.totalAmount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === "customers" && (
                    <section className="glass rounded-2xl border-glow overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
                            <h2 className="text-xl font-display font-bold uppercase tracking-wider flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" /> Customer List
                            </h2>
                        </div>
                        <div className="p-0">
                            {loadingOrders ? (
                                <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
                            ) : customers.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                    <Users className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No customer data found from orders.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-muted/30 border-b border-border text-sm text-muted-foreground">
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Orders</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Total Spent</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {customers.map((customer, idx) => (
                                                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold">{customer.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm">{customer.email}</div>
                                                        <div className="text-xs text-muted-foreground">{customer.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center font-medium">
                                                        {customer.orderCount}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-right text-primary">₹{customer.totalSpent}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

const Admin = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground font-medium">Loading admin panel...</p>
            </div>
        );
    }

    return user ? <AdminDashboard /> : <AdminLogin />;
};

export default Admin;
