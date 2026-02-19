import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Hair cutting aprons and salon capes" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-foreground backdrop-blur-sm mb-6">
            ✂️ Trusted by 500+ Salons
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            Professional Salon Capes & Aprons
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
            Premium quality hair cutting aprons for salons, barbershops, and home use. Waterproof, durable, and stylish.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Shop Now
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-full glass px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-background/20 transition-colors"
            >
              Bulk Orders
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
