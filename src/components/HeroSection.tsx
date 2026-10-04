import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import imgSalonSpa from "@/assets/categories/salon-spa.png";
import imgKitchenRestaurant from "@/assets/categories/kitchen-restaurant.png";
import imgHomeEssentials from "@/assets/categories/home-essentials.png";
import imgIndustrial from "@/assets/categories/industrial.png";
import imgTshirts from "@/assets/categories/tshirts.png";

const slides = [
  {
    category: "Salon & Spa",
    tagline: "PROFESSIONAL & ELEGANT",
    title: "Salon & Spa Apparel",
    subtitle: "Premium quality hair cutting capes, aprons, and styling wear trusted by 500+ salons across India.",
    cta: "Shop Salon & Spa",
    ctaLink: "#category-salon---spa",
    image: imgSalonSpa,
    focus: "50% 15%",
  },
  {
    category: "Kitchen & Restaurant",
    tagline: "HOSPITALITY & CULINARY",
    title: "Chef Coats & Restaurant Aprons",
    subtitle: "Stain-resistant, durable uniforms designed for professional chefs, servers, and modern kitchens.",
    cta: "Shop Kitchen & Restaurant",
    ctaLink: "#category-kitchen---restaurant",
    image: imgKitchenRestaurant,
    focus: "50% 12%",
  },
  {
    category: "Home Essentials",
    tagline: "LUXURY & COMFORT",
    title: "Bathrobes, Towels & Bedsheets",
    subtitle: "Ultra-soft hotel-quality cotton textiles crafted for premium homes, resorts, and hospitality.",
    cta: "Shop Home Essentials",
    ctaLink: "#category-home-essentials",
    image: imgHomeEssentials,
    focus: "50% 65%",
  },
  {
    category: "Industrial",
    tagline: "HEAVY-DUTY PROTECTION",
    title: "Industrial Workwear & Aprons",
    subtitle: "Tough, water & flame resistant canvas aprons engineered for demanding industrial tasks.",
    cta: "Shop Industrial",
    ctaLink: "#category-industrial",
    image: imgIndustrial,
    focus: "50% 10%",
  },
  {
    category: "T-Shirts",
    tagline: "CUSTOM STAFF UNIFORMS",
    title: "Premium Team T-Shirts",
    subtitle: "High-comfort, breathable crewneck t-shirts designed for staff uniforms, branding, and daily wear.",
    cta: "Shop T-Shirts",
    ctaLink: "#category-t-shirts",
    image: imgTshirts,
    focus: "50% 12%",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden bg-gray-900 text-white">
      {/* Hero Slideshow Container */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[620px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.category}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
              }`}
            >
              {/* Studio photo — full-bleed on mobile, right-hand panel on desktop so the square shot isn't over-cropped */}
              <div className="absolute inset-y-0 right-0 w-full md:w-1/2 lg:w-[48%]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: slide.focus }}
                />
                {/* Blend the photo's left edge into the dark panel */}
                <div className="hidden md:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-900 to-transparent" />
              </div>

              {/* Dark overlay for text contrast on mobile (photo sits behind text there) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 md:hidden" />

              {/* Slide Content */}
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="max-w-xl py-12 sm:py-16">
                  {/* Tagline */}
                  <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 mb-3 animate-fade-in">
                    {slide.tagline}
                  </span>

                  {/* Title */}
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-8 max-w-lg font-light leading-relaxed drop-shadow-sm">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <a
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:-translate-y-0.5"
                  >
                    {slide.cta} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators with Category Labels */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {slides.map((slide, index) => (
            <button
              key={slide.category}
              onClick={() => setCurrentSlide(index)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white text-black shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  index === currentSlide ? "bg-black" : "bg-gray-400"
                }`}
              />
              <span className="hidden md:inline">{slide.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="bg-gray-900 border-t border-gray-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { value: "500+", label: "Salons & Businesses", icon: "🏪" },
              { value: "4 Lakhs+", label: "Products Delivered", icon: "📦" },
              { value: "4.8★", label: "Customer Rating", icon: "⭐" },
              { value: "Pan-India", label: "Fast Shipping", icon: "🚚" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5">
                <span className="text-base">{stat.icon}</span>
                <p className="text-base sm:text-lg font-bold font-display tracking-tight text-white">
                  {stat.value}
                </p>
                <p className="text-[11px] text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
