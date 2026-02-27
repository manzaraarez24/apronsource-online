import { db } from "../lib/firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { products as localProducts } from "./products";

export const seedProductsToFirestore = async () => {
    try {
        const productsRef = collection(db, "products");

        // Check if products already exist
        const snapshot = await getDocs(productsRef);
        if (!snapshot.empty) {
            console.log("Products already exist in Firestore, skipping seed.");
            return { success: true, message: "Products already seeded" };
        }

        let count = 0;
        for (const product of localProducts) {
            // Create a document with the product ID as the document ID
            const docRef = doc(db, "products", product.id.toString());

            // Save product to Firestore. image is converted to string just in case it's an object from Vite.
            await setDoc(docRef, {
                ...product,
                image: String(product.image)
            });
            count++;
        }

        console.log(`Successfully seeded ${count} products to Firestore.`);
        return { success: true, message: `Seeded ${count} products` };
    } catch (error) {
        console.error("Error seeding products:", error);
        return { success: false, message: "Failed to seed products", error };
    }
};
