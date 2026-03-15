import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { auth, db, storage } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { seedProductsToFirestore } from "../data/seedFirestore";
import { Shield, Package, ShoppingCart, LogOut, Loader2, Database, Plus, Image as ImageIcon, Users, X, Edit, Trash2, RefreshCw, Video, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { retailCategories, wholesaleCategories, materials, colors, presetSizes, type Product, type ProductSize } from "../data/products";

// Helper: timeout wrapper
const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s.`)), ms)
        ),
    ]);
};

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

// Add/Edit Product Component
const AddProductForm = ({ onProductAdded, initialData }: { onProductAdded: () => void, initialData?: any }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        customCategory: "",
        material: "",
        customMaterial: "",
        color: "",
        customColor: "",
        salesType: "Retail",
        description: "",
        badge: "",
        status: "active" as "active" | "draft" | "deleted"
    });
    const [mediaItems, setMediaItems] = useState<{ id: string, url: string, type: 'image' | 'video', file?: File }[]>([]);
    const [sizes, setSizes] = useState<ProductSize[]>([]);
    const [newSize, setNewSize] = useState({ label: "Standard", customLabel: "", length: "", breadth: "" });

    const activeCategories = formData.salesType === "Retail" ? retailCategories : wholesaleCategories;

    // Populate form if initialData is provided
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                price: initialData.price?.toString() || "",
                originalPrice: initialData.originalPrice?.toString() || "",
                category: activeCategories.includes(initialData.category) ? initialData.category : "Custom",
                customCategory: activeCategories.includes(initialData.category) ? "" : initialData.category,
                material: materials.includes(initialData.material) ? initialData.material : "Custom",
                customMaterial: materials.includes(initialData.material) ? "" : initialData.material,
                color: colors.includes(initialData.color) ? initialData.color : "Custom",
                customColor: colors.includes(initialData.color) ? "" : initialData.color,
                salesType: initialData.salesType || "Retail",
                description: initialData.description || "",
                badge: initialData.badge || "",
                status: initialData.status || "active"
            });
            setSizes(initialData.sizes || []);
            
            const imagItems = (initialData.images || []).map((url: string) => ({ id: url, url, type: 'image' as const }));
            const vidItems = (initialData.videos || []).map((url: string) => ({ id: url, url, type: 'video' as const }));
            setMediaItems([...imagItems, ...vidItems]);
        } else {
            setFormData({
                name: "", price: "", originalPrice: "", 
                category: activeCategories[1] || activeCategories[0], customCategory: "",
                material: materials[1], customMaterial: "",
                color: colors[1], customColor: "",
                salesType: "Retail",
                description: "", badge: "",
                status: "active"
            });
            setMediaItems([]);
            setSizes([]);
        }
    }, [initialData, activeCategories]);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newItems = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
                file: file
            }));
            setMediaItems(prev => [...prev, ...newItems]);
        }
    };
 
    const removeMedia = (id: string) => {
        setMediaItems(prev => prev.filter(item => item.id !== id));
    };

    const addSize = () => {
        const label = newSize.label === "Custom" ? newSize.customLabel : newSize.label;
        if (!label || !newSize.length || !newSize.breadth) {
            toast.error("Please fill all size fields");
            return;
        }
        setSizes(prev => [...prev, { label, length: newSize.length, breadth: newSize.breadth }]);
        setNewSize({ label: "Standard", customLabel: "", length: "", breadth: "" });
    };

    const removeSize = (index: number) => {
        setSizes(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        console.group("🚀 Product Upload Diagnostics");
        console.log("1. Current Auth State:", { 
            loggedIn: !!auth.currentUser, 
            uid: auth.currentUser?.uid,
            email: auth.currentUser?.email 
        });
 
        const filesToUpload = mediaItems.filter(item => item.file).map(item => item.file as File);
        const existingImages = mediaItems.filter(item => !item.file && item.type === 'image').map(item => item.url);
        const existingVideos = mediaItems.filter(item => !item.file && item.type === 'video').map(item => item.url);
 
        console.log("2. Form Data Summary:", { 
            name: formData.name, 
            newFiles: filesToUpload.length, 
            existingMedia: existingImages.length + existingVideos.length 
        });
        
        try {
            // Pre-flight check
            console.log("3. Starting Storage Upload Phase...");
            const uploadPromises = filesToUpload.map(async (file) => {
                const storagePath = `products/${Date.now()}_${file.name}`;
                console.log(`   - Uploading ${file.name} to ${storagePath}...`);
                const storageRef = ref(storage, storagePath);
                
                const snapshot = await withTimeout(uploadBytes(storageRef, file), 120000, `Upload ${file.name}`);
                console.log(`   - ✅ Uploaded ${file.name}, fetching URL...`);
                return await withTimeout(getDownloadURL(snapshot.ref), 20000, `Get URL ${file.name}`);
            });
 
            const newUrls = await Promise.all(uploadPromises);
            console.log("4. Storage Phase Complete.", { newUrls });
            
            const newImageUrls = newUrls.filter((_, i) => filesToUpload[i].type.startsWith('image/'));
            const newVideoUrls = newUrls.filter((_, i) => filesToUpload[i].type.startsWith('video/'));
 
            const finalCategory = formData.category === "Custom" ? formData.customCategory : formData.category;
            const finalMaterial = formData.material === "Custom" ? formData.customMaterial : formData.material;
            const finalColor = formData.color === "Custom" ? formData.customColor : formData.color;
 
            const productData: any = {
                id: initialData?.id || Date.now(),
                name: formData.name,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                category: finalCategory,
                material: finalMaterial,
                color: finalColor,
                salesType: formData.salesType,
                description: formData.description,
                badge: formData.badge,
                status: formData.status,
                rating: initialData?.rating || 0,
                reviews: initialData?.reviews || 0,
                inStock: initialData?.inStock ?? true,
                sizes: sizes,
                updatedAt: Date.now(),
                images: [...existingImages, ...newImageUrls],
                videos: [...existingVideos, ...newVideoUrls],
            };
            productData.image = productData.images[0] || initialData?.image || "";
 
            if (!initialData) {
                productData.createdAt = Date.now();
            }
 
            console.log("5. Firestore Save Phase. Data payload:");
            console.table(productData);
 
            if (initialData?.docId) {
                console.log(`   - Updating document: ${initialData.docId}`);
                await withTimeout(updateDoc(doc(db, "products", initialData.docId), productData), 30000, "Update Firestore");
                toast.success("Product updated successfully!");
            } else {
                console.log("   - Adding new document to 'products' collection...");
                await withTimeout(addDoc(collection(db, "products"), productData), 30000, "Add to Firestore");
                toast.success("Product added successfully!");
            }
 
            console.log("6. ✅ ALL PHASES SUCCESSFUL.");
            console.groupEnd();
            onProductAdded();
        } catch (error: any) {
            console.group("❌ UPLOAD FAILED");
            console.error("Error Detail:", error);
            console.log("Firebase Code:", error.code);
            console.log("Full Message:", error.message);
            console.groupEnd();
            console.groupEnd(); // End main group
            
            toast.error(
                <div>
                    <p className="font-bold">Save Failed!</p>
                    <p className="text-xs opacity-80">{error.code || "unknown_error"}: {error.message}</p>
                    <p className="mt-1 text-[10px] underline">Check F12 console for details</p>
                </div>
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="glass p-6 rounded-2xl border-glow space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    {initialData ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                    <h3 className="font-display font-bold text-lg uppercase tracking-wider">{initialData ? "Edit Product" : "Add New Product"}</h3>
                </div>
                {initialData && (
                    <button type="button" onClick={onProductAdded} className="text-xs text-muted-foreground hover:text-foreground underline">
                        Cancel Edit
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Media Upload Area */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Product Media (Images & Videos) *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                        {mediaItems.map((item, index) => (
                            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted/20 group">
                                {item.type === 'image' ? (
                                    <img src={item.url} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <video src={item.url} className="h-full w-full object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(item.id)}
                                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        <div className="relative border-2 border-dashed border-border rounded-xl aspect-square flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer overflow-hidden group">
                            <input type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="text-center p-2">
                                <Plus className="h-6 w-6 text-muted-foreground mx-auto mb-1 group-hover:text-primary transition-colors" />
                                <p className="text-[10px] font-medium">Add Media</p>
                            </div>
                        </div>
                    </div>
                </div>

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
                        <select value={formData.salesType} onChange={e => setFormData({ ...formData, salesType: e.target.value as any })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                            <option value="Retail">Retail</option>
                            <option value="Wholesale">Wholesale</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Category *</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary mb-2">
                            {activeCategories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {formData.category === "Custom" && (
                            <input type="text" placeholder="Type Category" required value={formData.customCategory} onChange={e => setFormData({ ...formData, customCategory: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Material *</label>
                            <select value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary mb-2">
                                {materials.filter(m => m !== "All").map(mat => <option key={mat} value={mat}>{mat}</option>)}
                            </select>
                            {formData.material === "Custom" && (
                                <input type="text" placeholder="Type Material" required value={formData.customMaterial} onChange={e => setFormData({ ...formData, customMaterial: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Color *</label>
                            <select value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary mb-2">
                                {colors.filter(c => c !== "All").map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                            {formData.color === "Custom" && (
                                <input type="text" placeholder="Type Color" required value={formData.customColor} onChange={e => setFormData({ ...formData, customColor: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Size Manager Section */}
                <div className="col-span-1 md:col-span-2 border-t border-border pt-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Size Management (Size Chart)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4 items-end">
                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Label</label>
                            <select value={newSize.label} onChange={e => setNewSize({...newSize, label: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm">
                                <option value="Full size">Full size</option>
                                <option value="Small">Small</option>
                                <option value="Standard">Standard</option>
                                <option value="Custom">Custom</option>
                            </select>
                            {newSize.label === "Custom" && (
                                <input type="text" placeholder="Label" value={newSize.customLabel} onChange={e => setNewSize({...newSize, customLabel: e.target.value})} className="w-full mt-2 bg-background/50 border border-border rounded-lg px-3 py-2 text-sm" />
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Length</label>
                            <input type="text" placeholder="e.g. 30cm" value={newSize.length} onChange={e => setNewSize({...newSize, length: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Breadth</label>
                            <input type="text" placeholder="e.g. 20cm" value={newSize.breadth} onChange={e => setNewSize({...newSize, breadth: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <button type="button" onClick={addSize} className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" /> Add Size
                        </button>
                    </div>

                    {sizes.length > 0 && (
                        <div className="bg-muted/30 rounded-xl p-4 border border-border">
                            <div className="grid grid-cols-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">
                                <div>Label</div>
                                <div>Length</div>
                                <div>Breadth</div>
                                <div className="text-right">Action</div>
                            </div>
                            <div className="space-y-2">
                                {sizes.map((s, idx) => (
                                    <div key={idx} className="grid grid-cols-4 items-center bg-background/40 p-2 rounded-lg text-sm">
                                        <div className="font-medium">{s.label}</div>
                                        <div className="text-muted-foreground">{s.length}</div>
                                        <div className="text-muted-foreground">{s.breadth}</div>
                                        <div className="text-right">
                                            <button type="button" onClick={() => removeSize(idx)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Description *</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary resize-none" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Badge (Optional)</label>
                    <input type="text" value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Status</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold rounded-lg py-3 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{initialData ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {initialData ? "Update Product" : "Upload Product"}</>}
            </button>
        </form>
    );
};

// Product List Component
const ProductList = ({ onEdit }: { onEdit: (product: any) => void }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"active" | "draft" | "deleted" | "all">("active");

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("updatedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const toggleStatus = async (product: any, newStatus: string) => {
        try {
            const docRef = doc(db, "products", product.docId);
            await updateDoc(docRef, { status: newStatus, updatedAt: Date.now() });
            toast.success(`Product status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const filteredProducts = products.filter(p => filter === "all" || p.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-muted/20 p-4 rounded-2xl border border-border flex-wrap gap-4">
                <div className="flex gap-2">
                    {["all", "active", "draft", "deleted"].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s as any)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? "bg-primary text-primary-foreground shadow-lg" : "bg-background border border-border text-muted-foreground"}`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredProducts.length === 0 ? (
                <div className="glass p-12 text-center rounded-2xl border-dashed border-2 border-border">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground font-medium">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.docId} className="glass rounded-2xl border-glow overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                            <div className="aspect-square relative flex items-center justify-center bg-muted/10 p-4">
                                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button onClick={() => onEdit(product)} title="Edit" className="bg-white text-black p-3 rounded-full hover:bg-primary hover:text-white transition-colors">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    {product.status !== "deleted" ? (
                                        <button onClick={() => toggleStatus(product, "deleted")} title="Move to Bin" className="bg-destructive text-white p-3 rounded-full hover:bg-destructive/80 transition-colors">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    ) : (
                                        <button onClick={() => toggleStatus(product, "active")} title="Restore" className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors">
                                            <RotateCcw className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                {product.badge && (
                                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                                        {product.badge}
                                    </div>
                                )}
                                <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${product.status === "active" ? "bg-emerald-500/20 text-emerald-400" : product.status === "draft" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                                    {product.status}
                                </div>
                            </div>
                            <div className="p-4 border-t border-border/50">
                                <div className="text-[10px] font-bold text-primary uppercase mb-1 tracking-widest">{product.category}</div>
                                <h4 className="font-bold text-foreground mb-1 truncate text-sm">{product.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary text-sm">₹{product.price}</span>
                                    <span className="text-[10px] text-muted-foreground line-through">₹{product.originalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Dashboard Component
const AdminDashboard = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [activeTab, setActiveTab] = useState<"orders" | "customers" | "products">("orders");
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

    const customers = orders.reduce((acc: any[], order) => {
        const details = order.customerDetails;
        if (!details || !details.email) return acc;

        const existing = acc.find(c => c.email === details.email);
        if (existing) {
            existing.totalSpent += Number(order.totalAmount || 0);
            existing.orderCount += 1;
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
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AddProductForm 
                            onProductAdded={() => { setEditingProduct(null); }} 
                            initialData={editingProduct}
                        />
                        <div className="border-t border-border pt-12">
                            <ProductList onEdit={handleEditProduct} />
                        </div>
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
                                                    <td className="px-6 py-4 text-sm">{customer.email}</td>
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
