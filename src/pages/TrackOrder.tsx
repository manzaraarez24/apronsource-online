import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrackOrder = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <h1 className="font-display text-xl font-bold uppercase tracking-widest text-foreground">Track Order</h1>
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col justify-center items-center">
                <div className="glass-strong rounded-3xl p-8 md:p-12 w-full text-center border-glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <PackageSearch className="w-32 h-32" />
                    </div>

                    <h2 className="font-display text-2xl font-bold text-foreground mb-4 uppercase tracking-wider">Track Your Package</h2>
                    <p className="text-muted-foreground mb-8">
                        Enter your Order ID or tracking number to see your delivery status.
                    </p>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter Order ID (e.g. ZRK-12345)"
                                className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all text-center"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={() => alert("Tracking API integration coming soon. Please hold tight!")}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 glow-blue"
                        >
                            <PackageSearch className="h-4 w-4" /> Track Now
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground">
                        <p>If you haven't received a tracking number yet, your order is likely still processing.</p>
                        <p className="mt-2">Need help? WhatsApp us at <a href="https://wa.me/919990197268" className="text-primary hover:underline">99901 97268</a></p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TrackOrder;
