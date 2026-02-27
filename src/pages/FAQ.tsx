import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
    const navigate = useNavigate();

    const faqs = [
        {
            q: "Do you supply customized salon capes?",
            a: "Yes! We specialize in custom branding for salons and academies. This service is available only on wholesale orders (minimum 50 pieces). Please contact us via WhatsApp for details and mockups.",
        },
        {
            q: "What is your minimum quantity for wholesale?",
            a: "Our minimum order quantity (MOQ) for wholesale pricing is 50 pieces. We offer tiered discounts for larger corporate or distributor orders.",
        },
        {
            q: "Are the capes completely waterproof?",
            a: "Most of our professional capes feature a high-quality water-resistant or fully waterproof coating to protect clients from chemicals and water. Check individual product descriptions for specific fabric properties.",
        },
        {
            q: "How long does delivery take?",
            a: "Standard retail orders are typically delivered within 4-7 business days across India. Wholesale orders may vary based on quantity and branding requirements.",
        },
        {
            q: "Do you offer Cash on Delivery (COD)?",
            a: "Yes, we currently offer Cash on Delivery (COD) as our primary checkout payment method.",
        },
        {
            q: "How do I return a defective item?",
            a: "If you receive a damaged or incorrect product, please reach out to us within 48 hours of delivery at zarrksenterprises@gmail.com with your Order ID and pictures of the product.",
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <button onClick={() => navigate("/")} className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <h1 className="font-display text-xl font-bold uppercase tracking-widest text-foreground">FAQ</h1>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="text-center mb-10">
                    <h2 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">Everything you need to know about ZARRKS products and services.</p>
                </div>

                <div className="glass rounded-3xl p-6 sm:p-10 border-glow">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 bg-background/30 rounded-lg px-4">
                                <AccordionTrigger className="text-sm font-semibold hover:no-underline hover:text-primary transition-colors text-left">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FAQ;
