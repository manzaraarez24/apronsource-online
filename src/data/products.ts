import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export interface Size {
  id: string;
  name: string;
  length: number; // in cm
  breadth: number; // in cm
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  images: string[]; // Changed from single image to array
  videos?: string[]; // New field for videos
  category: string;
  material: string;
  color: string;
  sizes?: Size[]; // New field for sizes
  rating: number;
  reviews: number;
  inStock: boolean;
  salesType: "Wholesale" | "Retail";
  badge?: string;
  description: string;
  status: "active" | "draft" | "deleted"; // New field for product status
  createdAt?: number;
  updatedAt?: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Black Waterproof Cape",
    price: 299,
    originalPrice: 499,
    images: [product1],
    category: "Professional",
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
    category: "Professional",
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
    name: "Transparent PVC Cape",
    price: 199,
    originalPrice: 349,
    images: [product3],
    category: "Salon",
    material: "PVC",
    color: "White",
    rating: 4.0,
    reviews: 64,
    inStock: true,
    salesType: "Retail",
    badge: "New",
    description: "See-through PVC cape ideal for color treatments. Easy to clean and waterproof.",
    status: "active",
  },
  {
    id: 4,
    name: "Kids Cartoon Print Cape",
    price: 249,
    originalPrice: 399,
    images: [product4],
    category: "Kids",
    material: "Polyester",
    color: "Blue",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    salesType: "Retail",
    badge: "Popular",
    description: "Fun cartoon-printed cape that keeps kids happy during haircuts. Lightweight and comfortable.",
    status: "active",
  },
  {
    id: 5,
    name: "Premium Leather-Look Cape",
    price: 599,
    originalPrice: 899,
    images: [product5],
    category: "Premium",
    material: "Canvas",
    color: "Black",
    rating: 4.8,
    reviews: 45,
    inStock: true,
    salesType: "Wholesale",
    badge: "Premium",
    description: "Luxurious faux leather barber cape for upscale salons. Sophisticated look with easy maintenance.",
    status: "active",
  },
  {
    id: 6,
    name: "Blue Waterproof Salon Cape",
    price: 279,
    originalPrice: 449,
    images: [product6],
    category: "Salon",
    material: "Nylon",
    color: "Blue",
    rating: 4.2,
    reviews: 97,
    inStock: true,
    salesType: "Wholesale",
    description: "Bright blue nylon cape with button closure. Waterproof and stain-resistant.",
    status: "active",
  },
  {
    id: 7,
    name: "Red Satin Styling Cape",
    price: 399,
    originalPrice: 599,
    images: [product7],
    category: "Premium",
    material: "Rayon",
    color: "Red",
    rating: 4.4,
    reviews: 72,
    inStock: false,
    salesType: "Wholesale",
    description: "Elegant red satin cape for styling sessions. Smooth fabric prevents hair from sticking.",
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
    name: "Golden Trim Salon Cape",
    price: 349,
    originalPrice: 499,
    images: [product1],
    category: "Premium",
    material: "Polycotton",
    color: "Black",
    rating: 4.6,
    reviews: 21,
    inStock: true,
    salesType: "Retail",
    badge: "New",
    description: "Retail premium black cape with golden trim.",
    status: "active",
  },
  {
    id: 10,
    name: "Barber Tool Print Cape",
    price: 299,
    originalPrice: 450,
    images: [product2],
    category: "Professional",
    material: "Polyester",
    color: "Blue",
    rating: 4.2,
    reviews: 112,
    inStock: true,
    salesType: "Retail",
    description: "Features a modern barber tool graphic print.",
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
    name: "Stylist Transparent Pack",
    price: 249,
    originalPrice: 350,
    images: [product4],
    category: "Salon",
    material: "PVC",
    color: "White",
    rating: 4.5,
    reviews: 80,
    inStock: true,
    salesType: "Wholesale",
    description: "Bulk transparent capes, perfect for coloring stations.",
    status: "active",
  }
];

// Updated Categories
export const retailCategories = ["All", "Professional", "Kids", "Premium", "Men", "Women", "Unisex"];
export const wholesaleCategories = ["All", "Salon", "Economy", "Premium", "Professional", "Men", "Women", "Unisex"];
export const salesTypes = ["All", "Retail", "Wholesale"];

// Updated Materials with custom option
export const materials = ["All", "Polyester", "Cotton", "Polycotton", "Canvas", "PVC", "Rubber coated", "Nylon", "Rayon"];

// Updated Colors with custom option
export const colors = ["All", "Black", "White", "Blue", "Red", "Yellow", "Green"];

// Preset Sizes
export const presetSizes: Size[] = [
  { id: "full", name: "Full Size", length: 120, breadth: 80 },
  { id: "small", name: "Small", length: 90, breadth: 60 },
  { id: "standard", name: "Standard", length: 100, breadth: 70 },
];

export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];
