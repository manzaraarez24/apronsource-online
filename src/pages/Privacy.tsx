import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <button onClick={() => navigate("/")} className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <h1 className="font-display text-xl font-bold uppercase tracking-widest text-foreground">Privacy Policy</h1>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="glass rounded-3xl p-8 md:p-12 border-glow space-y-6 text-sm text-muted-foreground leading-relaxed">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4 uppercase tracking-wider">Privacy & Data Policy</h2>
                    <p>
                        ZARRKS ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights.
                    </p>

                    <h3 className="font-display text-lg font-bold text-foreground uppercase mt-8 border-b border-border/50 pb-2">Information We Collect</h3>
                    <p>
                        When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, phone number, and email address.
                        When you browse our store, we also automatically receive your computer's internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
                    </p>

                    <h3 className="font-display text-lg font-bold text-foreground uppercase mt-8 border-b border-border/50 pb-2">Consent</h3>
                    <p>
                        <strong>How do you get my consent?</strong><br />
                        When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
                        If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.
                    </p>

                    <h3 className="font-display text-lg font-bold text-foreground uppercase mt-8 border-b border-border/50 pb-2">Disclosure</h3>
                    <p>
                        We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service. We do not sell or share your data with third parties for their marketing purposes.
                    </p>

                    <h3 className="font-display text-lg font-bold text-foreground uppercase mt-8 border-b border-border/50 pb-2">Contact Us</h3>
                    <p>
                        If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information, contact our team at zarrksenterprises@gmail.com
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;
