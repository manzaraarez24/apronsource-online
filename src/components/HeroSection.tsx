import heroBanner from "@/assets/hero-banner.jpg";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Hair cutting aprons and salon capes" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,25%,6%)] via-[hsl(220,25%,8%,0.92)] to-[hsl(215,40%,12%,0.85)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,8%)] via-transparent to-transparent" />
      </div>

      {/* Subtle animated accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-44">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-semibold tracking-widest text-primary backdrop-blur-md mb-8 glow-blue uppercase">
            ✂️ Trusted by 500+ Salons Across India
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-metallic">
            Professional Salon Capes & Aprons
          </h1>

          <p className="text-lg text-foreground/60 mb-10 max-w-lg leading-relaxed">
            Premium quality hair cutting aprons for salons, barbershops, and home use. Waterproof, durable, and built to last.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="inline-flex items-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 glow-blue"
            >
              Shop Now
            </a>
            <a
              href="https://wa.me/919990197268?text=Hello,%20I'm%20interested%20in%20placing%20a%20bulk%20order%20for%20salon%20aprons."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-8 py-3.5 text-sm font-semibold text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Bulk Orders on WhatsApp
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-border/50">
            {[
              { value: "500+", label: "Salons Served" },
              { value: "4 Lakhs+", label: "Aprons Sold" },
              { value: "4.8★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating logo on the right (desktop only) */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
          <div className="animate-float">
            <img src={logo} alt="ZARRKS" className="w-72 opacity-20 drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
