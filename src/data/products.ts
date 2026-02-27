import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  material: string;
  color: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  salesType: "Wholesale" | "Retail";
  badge?: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Black Waterproof Cape",
    price: 299,
    originalPrice: 499,
    image: product1,
    category: "Professional",
    material: "Polyester",
    color: "Black",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    salesType: "Retail",
    badge: "Bestseller",
    description: "Premium waterproof hair cutting cape, perfect for salons and barbershops. Durable polyester with snap closure.",
  },
  {
    id: 2,
    name: "Striped Barber Cape",
    price: 349,
    originalPrice: 549,
    image: product2,
    category: "Professional",
    material: "Cotton Blend",
    color: "Black & White",
    rating: 4.3,
    reviews: 86,
    inStock: true,
    salesType: "Retail",
    description: "Classic striped barber cape with vintage appeal. Comfortable cotton blend fabric.",
  },
  {
    id: 3,
    name: "Transparent PVC Cape",
    price: 199,
    originalPrice: 349,
    image: product3,
    category: "Salon",
    material: "PVC",
    color: "Clear",
    rating: 4.0,
    reviews: 64,
    inStock: true,
    salesType: "Retail",
    badge: "New",
    description: "See-through PVC cape ideal for color treatments. Easy to clean and waterproof.",
  },
  {
    id: 4,
    name: "Kids Cartoon Print Cape",
    price: 249,
    originalPrice: 399,
    image: product4,
    category: "Kids",
    material: "Polyester",
    color: "Multicolor",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    salesType: "Retail",
    badge: "Popular",
    description: "Fun cartoon-printed cape that keeps kids happy during haircuts. Lightweight and comfortable.",
  },
  {
    id: 5,
    name: "Premium Leather-Look Cape",
    price: 599,
    originalPrice: 899,
    image: product5,
    category: "Premium",
    material: "Faux Leather",
    color: "Brown",
    rating: 4.8,
    reviews: 45,
    inStock: true,
    salesType: "Wholesale",
    badge: "Premium",
    description: "Luxurious faux leather barber cape for upscale salons. Sophisticated look with easy maintenance.",
  },
  {
    id: 6,
    name: "Blue Waterproof Salon Cape",
    price: 279,
    originalPrice: 449,
    image: product6,
    category: "Salon",
    material: "Nylon",
    color: "Blue",
    rating: 4.2,
    reviews: 97,
    inStock: true,
    salesType: "Wholesale",
    description: "Bright blue nylon cape with button closure. Waterproof and stain-resistant.",
  },
  {
    id: 7,
    name: "Red Satin Styling Cape",
    price: 399,
    originalPrice: 599,
    image: product7,
    category: "Premium",
    material: "Satin",
    color: "Red",
    rating: 4.4,
    reviews: 72,
    inStock: false,
    salesType: "Wholesale",
    description: "Elegant red satin cape for styling sessions. Smooth fabric prevents hair from sticking.",
  },
  {
    id: 8,
    name: "Grey Economy Cape Pack",
    price: 149,
    originalPrice: 249,
    image: product8,
    category: "Economy",
    material: "Polyester",
    color: "Grey",
    rating: 3.9,
    reviews: 156,
    inStock: true,
    salesType: "Wholesale",
    badge: "Value",
    description: "Affordable grey cape pack for high-volume salons. Lightweight and easy to wash.",
  },
  {
    id: 9,
    name: "Golden Trim Salon Cape",
    price: 349,
    originalPrice: 499,
    image: product1,
    category: "Premium",
    material: "Satin",
    color: "Black & White",
    rating: 4.6,
    reviews: 21,
    inStock: true,
    salesType: "Retail",
    badge: "New",
    description: "Retail premium black cape with golden trim.",
  },
  {
    id: 10,
    name: "Barber Tool Print Cape",
    price: 299,
    originalPrice: 450,
    image: product2,
    category: "Professional",
    material: "Polyester",
    color: "Multicolor",
    rating: 4.2,
    reviews: 112,
    inStock: true,
    salesType: "Retail",
    description: "Features a modern barber tool graphic print.",
  },
  {
    id: 11,
    name: "Basic White Cape Pack",
    price: 199,
    originalPrice: 300,
    image: product3,
    category: "Economy",
    material: "Polyester",
    color: "Clear",
    rating: 3.8,
    reviews: 400,
    inStock: true,
    salesType: "Wholesale",
    badge: "Value",
    description: "High volume economy white capes for everyday use.",
  },
  {
    id: 12,
    name: "Stylist Transparent Pack",
    price: 249,
    originalPrice: 350,
    image: product4,
    category: "Salon",
    material: "PVC",
    color: "Clear",
    rating: 4.5,
    reviews: 80,
    inStock: true,
    salesType: "Wholesale",
    description: "Bulk transparent capes, perfect for coloring stations.",
  }
];

export const retailCategories = ["All", "Professional", "Kids", "Premium"];
export const wholesaleCategories = ["All", "Salon", "Economy", "Premium", "Professional"];
export const salesTypes = ["All", "Retail", "Wholesale"];
export const materials = ["All", "Polyester", "Cotton Blend", "PVC", "Faux Leather", "Nylon", "Satin"];
export const colors = ["All", "Black", "Black & White", "Clear", "Multicolor", "Brown", "Blue", "Red", "Grey"];
export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];
