import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Product, products as initialProducts } from "../data/products";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = () => { };

        // We add a short timeout to prevent flickering if Firestore loads very quickly or fails instantly
        const timer = setTimeout(() => {
            try {
                const productsRef = collection(db, "products");

                unsubscribe = onSnapshot(
                    productsRef,
                    (snapshot) => {
                        if (!snapshot.empty) {
                            const fetchedProducts = snapshot.docs.map(doc => {
                                const data = doc.data();

                                // Handle both old single image format and new multiple images format
                                let finalImages = data.images || [];
                                if (!Array.isArray(finalImages)) {
                                    // If it's a single image (old format), convert to array
                                    finalImages = data.image ? [data.image] : [];
                                }

                                // Fix image paths: If the seeded image is not an absolute URL (like firebasestorage),
                                // it's likely a local Vite asset path string that broke.
                                // We find the original imported asset from initialProducts.
                                if (finalImages.length === 0) {
                                    const localMatch = initialProducts.find(p => p.id === Number(doc.id) || p.name === data.name);
                                    if (localMatch) {
                                        finalImages = localMatch.images || [];
                                    }
                                }

                                return {
                                    ...data,
                                    images: finalImages,
                                    videos: data.videos || [],
                                    sizes: data.sizes || [],
                                    status: data.status || "active",
                                    id: isNaN(Number(doc.id)) ? doc.id : Number(doc.id),
                                } as Product;
                            });
                            
                            // Filter out deleted products for regular users
                            const activeProducts = fetchedProducts.filter(p => p.status !== "deleted");
                            setProducts(activeProducts);
                        } else {
                            // Fallback to local products if collection is empty
                            // This allows the UI to stay beautiful before user seeds the database
                            setProducts(initialProducts);
                        }
                        setLoading(false);
                    },
                    (error) => {
                        console.warn("Firestore listen error (maybe config is missing), using local products:", error);
                        setProducts(initialProducts);
                        setLoading(false);
                    }
                );
            } catch (error) {
                console.warn("Firestore initialization error, using local products:", error);
                setProducts(initialProducts);
                setLoading(false);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    return { products, loading };
};
