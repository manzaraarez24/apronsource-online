import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export interface ProductSize {
  label: string;
  length: string;
  breadth: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image?: string; // Keeps for backward compatibility/primary image
  images: string[]; // Changed to required array
  videos?: string[];
  category: string;
  material: string;
  color: string;
  sizes?: ProductSize[];
  rating: number;
  reviews: number;
  inStock: boolean;
  salesType: "Wholesale" | "Retail";
  badge?: string;
  description: string;
  status: "active" | "draft" | "deleted";
  createdAt?: number;
  updatedAt?: number;
  applicable?: string; // Maps to categories requested like: Salon & spa, Hospital, etc.
  closureType?: string; // Adjustable neck, Velcro, etc.
  gsm?: string | number;
  weight?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Black Waterproof Cape",
    price: 299,
    originalPrice: 499,
    images: [product1],
    category: "Salon & Spa",
    material: "Polyester",
    color: "Black",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    salesType: "Retail",
    badge: "Bestseller",
    description: "Premium waterproof hair cutting cape, perfect for salons and barbershops. Durable polyester with snap closure.",
    status: "active",
  },
  {
    id: 2,
    name: "Striped Barber Cape",
    price: 349,
    originalPrice: 549,
    images: [product2],
    category: "Salon & Spa",
    material: "Cotton",
    color: "Black",
    rating: 4.3,
    reviews: 86,
    inStock: true,
    salesType: "Retail",
    description: "Classic striped barber cape with vintage appeal. Comfortable cotton blend fabric.",
    status: "active",
  },
  {
    id: 3,
    name: "Kitchen Waterproof Apron",
    price: 199,
    originalPrice: 349,
    images: [product3],
    category: "Kitchen & Restaurant",
    material: "PVC",
    color: "White",
    rating: 4.0,
    reviews: 64,
    inStock: true,
    salesType: "Retail",
    badge: "New",
    description: "Waterproof PVC apron ideal for kitchen and restaurant use. Easy to clean and durable.",
    status: "active",
  },
  {
    id: 4,
    name: "Premium Cotton Bath Towel",
    price: 249,
    originalPrice: 399,
    images: [product4],
    category: "Home Essentials",
    material: "Cotton",
    color: "Blue",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    salesType: "Retail",
    badge: "Popular",
    description: "Soft and absorbent 100% cotton bath towel. Perfect for home, hotels, and spas. Available in multiple colors.",
    status: "active",
  },
  {
    id: 5,
    name: "Heavy Duty Industrial Apron",
    price: 599,
    originalPrice: 899,
    images: [product5],
    category: "Industrial",
    material: "Canvas",
    color: "Black",
    rating: 4.8,
    reviews: 45,
    inStock: true,
    salesType: "Wholesale",
    badge: "Premium",
    description: "Heavy-duty canvas industrial apron for workshops, factories, and industrial use. Built to withstand tough conditions.",
    status: "active",
  },
  {
    id: 6,
    name: "Chef Apron with Pockets",
    price: 279,
    originalPrice: 449,
    images: [product6],
    category: "Kitchen & Restaurant",
    material: "Nylon",
    color: "Blue",
    rating: 4.2,
    reviews: 97,
    inStock: true,
    salesType: "Wholesale",
    description: "Professional chef apron with multiple pockets. Waterproof and stain-resistant, perfect for kitchens.",
    status: "active",
  },
  {
    id: 7,
    name: "Industrial Safety Apron",
    price: 399,
    originalPrice: 599,
    images: [product7],
    category: "Industrial",
    material: "Rayon",
    color: "Red",
    rating: 4.4,
    reviews: 72,
    inStock: false,
    salesType: "Wholesale",
    description: "Safety-grade industrial apron with heat and chemical resistance. Essential for factory and workshop use.",
    status: "active",
  },
  {
    id: 8,
    name: "Grey Economy Cape Pack",
    price: 149,
    originalPrice: 249,
    images: [product8],
    category: "Economy",
    material: "Polyester",
    color: "Black",
    rating: 3.9,
    reviews: 156,
    inStock: true,
    salesType: "Wholesale",
    badge: "Value",
    description: "Affordable grey cape pack for high-volume salons. Lightweight and easy to wash.",
    status: "active",
  },
  {
    id: 9,
    name: "Unisex Round Neck T-Shirt",
    price: 349,
    originalPrice: 499,
    images: [product1],
    category: "T-Shirts",
    material: "Polycotton",
    color: "Black",
    rating: 4.6,
    reviews: 21,
    inStock: true,
    salesType: "Retail",
    badge: "New",
    description: "Comfortable unisex round neck t-shirt in premium polycotton. Perfect for staff uniforms and casual wear.",
    status: "active",
  },
  {
    id: 10,
    name: "Salon Styling Cape - Premium",
    price: 299,
    originalPrice: 450,
    images: [product2],
    category: "Salon & Spa",
    material: "Polyester",
    color: "Blue",
    rating: 4.2,
    reviews: 112,
    inStock: true,
    salesType: "Retail",
    description: "Premium salon styling cape with modern design and snap closure.",
    status: "active",
  },
  {
    id: 11,
    name: "Basic White Cape Pack",
    price: 199,
    originalPrice: 300,
    images: [product3],
    category: "Economy",
    material: "Cotton",
    color: "White",
    rating: 3.8,
    reviews: 400,
    inStock: true,
    salesType: "Wholesale",
    badge: "Value",
    description: "High volume economy white capes for everyday use.",
    status: "active",
  },
  {
    id: 12,
    name: "Restaurant Uniform Apron Pack",
    price: 249,
    originalPrice: 350,
    images: [product4],
    category: "Kitchen & Restaurant",
    material: "PVC",
    color: "White",
    rating: 4.5,
    reviews: 80,
    inStock: true,
    salesType: "Wholesale",
    description: "Bulk restaurant apron pack. Waterproof and easy to clean, ideal for food service.",
    status: "active",
  }
];

export const retailCategories = ["All", "Salon & Spa", "Kitchen & Restaurant", "Home Essentials", "Industrial", "T-Shirts", "Medical & Healthcare", "Leather & Rexine", "Custom"];
export const wholesaleCategories = ["All", "Salon & Spa", "Kitchen & Restaurant", "Home Essentials", "Industrial", "T-Shirts", "Medical & Healthcare", "Leather & Rexine", "Economy", "Custom"];
export const salesTypes = ["All", "Retail", "Wholesale"];
export const materials = ["All", "Polyester", "Cotton", "Polycotton", "Canvas", "PVC", "Rubber coated", "Nylon", "Rayon", "Leather", "Rexine", "Custom"];
export const colors = ["All", "Black", "White", "Blue", "Red", "Yellow", "Green", "Custom"];

export const applicableOptions = ["Salon & spa", "Beauty & care", "Hotel", "Hospital", "School", "Custom"];
export const closureTypeOptions = ["Adjustable neck", "Drawstring", "Velcro", "Snap hook closure", "Custom"];


// Preset Sizes
export const presetSizes: ProductSize[] = [
  { label: "Full size", length: "120cm", breadth: "80cm" },
  { label: "Small", length: "90cm", breadth: "60cm" },
  { label: "Standard", length: "100cm", breadth: "70cm" },
];

export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];
