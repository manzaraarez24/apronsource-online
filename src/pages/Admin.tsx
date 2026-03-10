import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { auth, db, storage } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, getDocs, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { seedProductsToFirestore } from "../data/seedFirestore";
import { Shield, Package, ShoppingCart, LogOut, Loader2, Database, Plus, Image as ImageIcon, Users, Edit2, Trash2, RotateCcw, X, Video } from "lucide-react";
import { toast } from "sonner";
import { retailCategories, wholesaleCategories, materials, colors, presetSizes, type Product, type Size } from "../data/products";

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
const AddProductForm = ({ onProductAdded, editingProduct }: { onProductAdded: () => void; editingProduct?: Product | null }) => {
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
    const [customSize, setCustomSize] = useState({ name: "", length: "", breadth: "" });
    const [customCategory, setCustomCategory] = useState("");
    const [customMaterial, setCustomMaterial] = useState("");
    const [customColor, setCustomColor] = useState("");
    
    const [formData, setFormData] = useState({
        name: editingProduct?.name || "",
        price: editingProduct?.price.toString() || "",
        originalPrice: editingProduct?.originalPrice.toString() || "",
        category: editingProduct?.category || retailCategories[1],
        material: editingProduct?.material || materials[1],
        color: editingProduct?.color || colors[1],
        salesType: editingProduct?.salesType || "Retail",
        description: editingProduct?.description || "",
        badge: editingProduct?.badge || "",
        status: editingProduct?.status || "active",
    });

    const activeCategories = formData.salesType === "Retail" ? retailCategories : wholesaleCategories;

    useEffect(() => {
        if (!activeCategories.includes(formData.category)) {
            setFormData(prev => ({ ...prev, category: activeCategories[1] || activeCategories[0] }));
        }
    }, [formData.salesType, activeCategories, formData.category]);

    useEffect(() => {
        if (editingProduct?.sizes) {
            setSelectedSizes(editingProduct.sizes);
        }
    }, [editingProduct]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...newFiles]);
            
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImagePreviews(prev => [...prev, event.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setVideoFiles(prev => [...prev, ...newFiles]);
            
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setVideoPreviews(prev => [...prev, event.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index: number) => {
        setVideoFiles(prev => prev.filter((_, i) => i !== index));
        setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const addSize = () => {
        if (customSize.name && customSize.length && customSize.breadth) {
            const newSize: Size = {
                id: `custom-${Date.now()}`,
                name: customSize.name,
                length: Number(customSize.length),
                breadth: Number(customSize.breadth),
            };
            setSelectedSizes(prev => [...prev, newSize]);
            setCustomSize({ name: "", length: "", breadth: "" });
        }
    };

    const removeSize = (id: string) => {
        setSelectedSizes(prev => prev.filter(s => s.id !== id));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (imagePreviews.length === 0 && !editingProduct) {
            toast.error("Please select at least one product image.");
            return;
        }

        setLoading(true);
        try {
            const uploadedImageUrls: string[] = [];
            const uploadedVideoUrls: string[] = [];

            // Upload new images
            for (const imageFile of imageFiles) {
                const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedImageUrls.push(downloadURL);
            }

            // Upload new videos
            for (const videoFile of videoFiles) {
                const storageRef = ref(storage, `products/videos/${Date.now()}_${videoFile.name}`);
                const snapshot = await uploadBytes(storageRef, videoFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedVideoUrls.push(downloadURL);
            }

            const finalCategory = customCategory || formData.category;
            const finalMaterial = customMaterial || formData.material;
            const finalColor = customColor || formData.color;

            const productData = {
                name: formData.name,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                images: editingProduct ? [...(editingProduct.images || []), ...uploadedImageUrls] : uploadedImageUrls,
                videos: editingProduct ? [...(editingProduct.videos || []), ...uploadedVideoUrls] : uploadedVideoUrls,
                category: finalCategory,
                material: finalMaterial,
                color: finalColor,
                sizes: selectedSizes,
                salesType: formData.salesType,
                description: formData.description,
                badge: formData.badge,
                status: formData.status,
                rating: editingProduct?.rating || 0,
                reviews: editingProduct?.reviews || 0,
                inStock: true,
                updatedAt: Date.now(),
            };

            if (editingProduct) {
                // Update existing product
                const productRef = doc(db, "products", editingProduct.id.toString());
                await updateDoc(productRef, productData);
                toast.success("Product updated successfully!");
            } else {
                // Add new product
                productData.id = Date.now();
                await addDoc(collection(db, "products"), productData);
                toast.success("Product added successfully!");
            }

            // Reset Form
            setFormData({
                name: "", price: "", originalPrice: "", category: activeCategories[1] || activeCategories[0],
                material: materials[1], color: colors[1], salesType: "Retail",
                description: "", badge: "", status: "active"
            });
            setImageFiles([]);
            setImagePreviews([]);
            setVideoFiles([]);
            setVideoPreviews([]);
            setSelectedSizes([]);
            setCustomCategory("");
            setCustomMaterial("");
            setCustomColor("");
            onProductAdded();

        } catch (error: any) {
            console.error("Error adding/updating product:", error);
            toast.error(error.message || "Failed to add/update product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="glass p-6 rounded-2xl border-glow space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                {editingProduct ? <Edit2 className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                <h3 className="font-display font-bold text-lg uppercase tracking-wider">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            </div>

            {/* Image Upload Area */}
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Product Images (Multiple) *</label>
                <div className="relative border-2 border-dashed border-border rounded-xl aspect-video md:aspect-[21/9] flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer overflow-hidden group">
                    <input type="file" accept="image/*" onChange={handleImageChange} multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {imagePreviews.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 p-4 w-full h-full overflow-auto">
                            {imagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative">
                                    <img src={preview} alt={`Preview ${idx}`} className="h-24 w-24 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                            <p className="text-sm font-medium">Click or drag images to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB each</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Upload Area */}
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Product Videos (Optional)</label>
                <div className="relative border-2 border-dashed border-border rounded-xl aspect-video md:aspect-[21/9] flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer overflow-hidden group">
                    <input type="file" accept="video/*" onChange={handleVideoChange} multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {videoPreviews.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 p-4 w-full h-full overflow-auto">
                            {videoPreviews.map((preview, idx) => (
                                <div key={idx} className="relative">
                                    <video src={preview} className="h-24 w-24 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); removeVideo(idx); }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <Video className="h-10 w-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                            <p className="text-sm font-medium">Click or drag videos to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">MP4, WebM up to 50MB each</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <option value="Retail">Retail</option>
                            <option value="Wholesale">Wholesale</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Category *</label>
                        <select value={formData.category} onChange={e => { setFormData({ ...formData, category: e.target.value }); setCustomCategory(""); }} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                            {activeCategories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {formData.category === "Custom" && (
                            <input type="text" placeholder="Enter custom category" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="w-full mt-2 bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Material *</label>
                        <select value={formData.material} onChange={e => { setFormData({ ...formData, material: e.target.value }); setCustomMaterial(""); }} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                            {materials.filter(m => m !== "All").map(mat => <option key={mat} value={mat}>{mat}</option>)}
                        </select>
                        {formData.material === "Custom" && (
                            <input type="text" placeholder="Enter custom material" value={customMaterial} onChange={e => setCustomMaterial(e.target.value)} className="w-full mt-2 bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Color *</label>
                        <select value={formData.color} onChange={e => { setFormData({ ...formData, color: e.target.value }); setCustomColor(""); }} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                            {colors.filter(c => c !== "All").map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                        {formData.color === "Custom" && (
                            <input type="text" placeholder="Enter custom color" value={customColor} onChange={e => setCustomColor(e.target.value)} className="w-full mt-2 bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                        )}
                    </div>
                </div>
            </div>

            {/* Sizes Section */}
            <div className="border-t border-border pt-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Product Sizes</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {presetSizes.map(size => (
                        <button
                            key={size.id}
                            type="button"
                            onClick={() => {
                                if (selectedSizes.find(s => s.id === size.id)) {
                                    removeSize(size.id);
                                } else {
                                    setSelectedSizes(prev => [...prev, size]);
                                }
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedSizes.find(s => s.id === size.id) ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border hover:bg-muted"}`}
                        >
                            {size.name}
                        </button>
                    ))}
                </div>

                {/* Custom Size Input */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" placeholder="Size name" value={customSize.name} onChange={e => setCustomSize({ ...customSize, name: e.target.value })} className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                    <input type="number" placeholder="Length (cm)" value={customSize.length} onChange={e => setCustomSize({ ...customSize, length: e.target.value })} className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                    <input type="number" placeholder="Breadth (cm)" value={customSize.breadth} onChange={e => setCustomSize({ ...customSize, breadth: e.target.value })} className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                </div>
                <button type="button" onClick={addSize} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors">
                    + Add Custom Size
                </button>

                {/* Selected Sizes Display */}
                {selectedSizes.length > 0 && (
                    <div className="mt-3 space-y-1">
                        {selectedSizes.map(size => (
                            <div key={size.id} className="flex justify-between items-center bg-muted/30 p-2 rounded text-xs">
                                <span>{size.name} - {size.length}cm x {size.breadth}cm</span>
                                <button type="button" onClick={() => removeSize(size.id)} className="text-red-500 hover:text-red-700">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Badge (Optional)</label>
                    <input type="text" placeholder="e.g. Bestseller, New" value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Status</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Description *</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary resize-none" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold rounded-lg py-3 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{editingProduct ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {editingProduct ? "Update Product" : "Upload Product"}</>}
            </button>
        </form>
    );
};

// Product Management Component
const ProductManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState<"active" | "draft" | "deleted" | "all">("active");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, "products"), orderBy("updatedAt", "desc"));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setProducts(allProducts);
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching products:", error);
                    setLoading(false);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => filter === "all" || p.status === filter);

    const handleDelete = async (productId: string) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { status: "deleted" });
            toast.success("Product moved to bin");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleRestore = async (productId: string) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { status: "active" });
            toast.success("Product restored");
        } catch (error) {
            toast.error("Failed to restore product");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
                {["all", "active", "draft", "deleted"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground hover:bg-muted"}`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)} ({filteredProducts.length})
                    </button>
                ))}
            </div>

            {editingProduct && (
                <div className="border-t border-border pt-6">
                    <button onClick={() => setEditingProduct(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4">← Back to list</button>
                    <AddProductForm onProductAdded={() => setEditingProduct(null)} editingProduct={editingProduct} />
                </div>
            )}

            {!editingProduct && (
                <div className="grid gap-4">
                    {loading ? (
                        <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No products found</div>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product.id} className="glass p-4 rounded-lg border-glow flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="h-16 w-16 object-cover rounded" />}
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground">₹{product.price} | {product.category} | {product.status}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {product.status !== "deleted" && (
                                        <button onClick={() => setEditingProduct(product)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                    )}
                                    {product.status !== "deleted" && (
                                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                    {product.status === "deleted" && (
                                        <button onClick={() => handleRestore(product.id)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20">
                                            <RotateCcw className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
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
                        <ProductManagement />
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
