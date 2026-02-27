import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <h1 className="font-display text-xl font-bold uppercase tracking-widest text-foreground">Shipping Information</h1>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="glass rounded-3xl p-8 border-glow space-y-6 text-muted-foreground leading-relaxed">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4 uppercase">Pan-India Delivery</h2>
                    <p>
                        At ZARRKS, we are committed to delivering your premium saloncapes and aprons as quickly as possible. We currently offer shipping across all states and union territories in India.
                    </p>

                    <h3 className="font-display text-lg font-bold text-foreground uppercase mt-8 border-b border-border/50 pb-2">Processing Time</h3>
                    <p>
                        All retail orders are processed within 1-2 business days. Wholesale and bulk orders above 50 pieces may require 3-5 business days for processing depending on customization and stock availability. Orders are not shipped or delivered on Sundays or public holidays.
                    </p>

                    <h3 className="font-display text-lg font-bold text-foreground uppercase mt-8 border-b border-border/50 pb-2">Shipping Rates & Estimates</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Standard Shipping:</strong> ₹99 flat rate. Delivery typically takes 4-7 business days.</li>
                        <li><strong>Free Shipping:</strong> Available on all retail orders over ₹999.</li>
                        <li><strong>Wholesale Shipping:</strong> Calculated based on order weight and destination. Please contact us via WhatsApp for a precise bulk shipping quote.</li>
                    </ul>

                    <h3 className="font-display text-lg font-bold text-foreground uppercase mt-8 border-b border-border/50 pb-2">Order Tracking</h3>
                    <p>
                        Once your order has shipped, you will receive an email confirmation with your tracking number. The tracking link will become active within 24 hours.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Shipping;
