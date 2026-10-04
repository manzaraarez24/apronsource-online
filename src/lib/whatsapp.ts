import type { CartItem } from "@/hooks/useCart";

export const WHATSAPP_NUMBER = "919990197268";

interface ShippingDetails {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
}

/** Builds a wa.me link for an order. Text is URL-encoded so names like "Salon & Spa" don't cut the message off. */
export const buildWhatsAppOrderUrl = (items: CartItem[], address?: ShippingDetails) => {
    const lines = items.map((i) => {
        const size = i.size ? `, Size: ${i.size}` : "";
        const type = i.product.salesType === "Wholesale" ? "Bulk" : "Retail";
        return `- ${i.quantity}x ${i.product.name} (${i.product.category}${size}) [${type}] @ ₹${i.product.price}`;
    });
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    let message = `Hello! I would like to place an order:\n${lines.join("\n")}\n\nEstimated total: ₹${total.toLocaleString("en-IN")}`;
    if (address) {
        const street = [address.addressLine1, address.addressLine2].filter(Boolean).join(", ");
        message += `\n\nShip to: ${address.fullName}, ${street}, ${address.city}, ${address.state} - ${address.pincode}\nPhone: ${address.phone}`;
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
