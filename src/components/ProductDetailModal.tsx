import { X, Star, ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Ruler, Play } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Product } from "@/data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number, size?: string) => void;
}

const ProductDetailModal = ({ product, onClose, onAddToCart }: ProductDetailModalProps) => {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Combined Media (Images and Videos) — filter out empty strings
  const allMedia = [
    ...(product?.images || []),
    ...(product?.videos || [])
  ].filter((v, i, a) => v && v.length > 0 && a.indexOf(v) === i); // Remove empty + deduplicate

  // Reset qty when a new product is opened (50 for wholesale, 1 for retail)
  useEffect(() => {
    if (product) {
      setQty(product.salesType === "Wholesale" ? 50 : 1);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0].label);
      } else {
        setSelectedSize(null);
      }
    }
  }, [product]);

  // Close on Escape and stop the page behind the modal from scrolling
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (showVideoModal) setShowVideoModal(false);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [product, onClose, showVideoModal]);

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-fade-in">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-20 rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative aspect-square bg-gray-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden group">
            <div className="h-full w-full overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {allMedia.length > 0 ? allMedia.map((media, index) => (
                  <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full flex items-center justify-center bg-gray-50">
                    {media.includes('/videos/') || media.includes('.mp4') ? (
                      <div className="relative h-full w-full">
                         <video src={media} className="h-full w-full object-contain" />
                         <button 
                            onClick={() => handleVideoClick(media)}
                            className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
                         >
                            <Play className="h-12 w-12 text-white fill-white opacity-80" />
                         </button>
                      </div>
                    ) : (
                      <img src={media} alt={`${product.name} ${index + 1}`} className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                )) : (
                    <div className="relative flex-[0_0_100%] min-w-0 h-full flex items-center justify-center bg-gray-50 p-8">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                          <span className="mt-2 text-sm">No Image Available</span>
                        </div>
                      )}
                    </div>
                )}
              </div>
            </div>
            
            {allMedia.length > 1 && (
              <>
                <button 
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                  disabled={!canScrollPrev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                  disabled={!canScrollNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {allMedia.map((_, i) => (
                    <div key={i} className="h-1.5 w-6 rounded-full bg-foreground/20 overflow-hidden" />
                  ))}
                </div>
              </>
            )}

            {/* Sale Badge */}
            {discount > 0 && (
              <span className="absolute top-4 left-4 badge-sale z-10">Save {discount}%</span>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              {product.category}
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            {/* Specifications */}
            <div className="space-y-0 mb-6 text-sm bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              <div className="flex justify-between py-2.5 px-4 border-b border-gray-100"><span className="text-muted-foreground">Material</span><span className="font-medium text-foreground text-right">{product.material}</span></div>
              <div className="flex justify-between py-2.5 px-4 border-b border-gray-100"><span className="text-muted-foreground">Color</span><span className="font-medium text-foreground text-right">{product.color}</span></div>
              
              {product.applicable && (
                <div className="flex justify-between py-2.5 px-4 border-b border-gray-100"><span className="text-muted-foreground">Applicable For</span><span className="font-medium text-foreground text-right">{product.applicable}</span></div>
              )}
              {product.closureType && (
                <div className="flex justify-between py-2.5 px-4 border-b border-gray-100"><span className="text-muted-foreground">Closure</span><span className="font-medium text-foreground text-right">{product.closureType}</span></div>
              )}
              {product.gsm && (
                <div className="flex justify-between py-2.5 px-4 border-b border-gray-100"><span className="text-muted-foreground">GSM</span><span className="font-medium text-foreground text-right">{product.gsm}</span></div>
              )}
              {product.weight && (
                <div className="flex justify-between py-2.5 px-4 border-b border-gray-100"><span className="text-muted-foreground">Weight</span><span className="font-medium text-foreground text-right">{product.weight}</span></div>
              )}

              <div className="flex justify-between py-2.5 px-4 border-b border-gray-100"><span className="text-muted-foreground">Sales Type</span><span className="font-medium text-foreground text-right">{product.salesType}</span></div>
              <div className="flex justify-between py-2.5 px-4"><span className="text-muted-foreground">Availability</span><span className={`font-medium text-right ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span></div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-lg price-original">₹{product.originalPrice}</span>
              {discount > 0 && (
                <span className="rounded-full bg-red-50 border border-red-100 px-3 py-0.5 text-xs font-bold text-red-500">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Size Selection & Chart */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Ruler className="h-3 w-3" /> Select Size
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                        selectedSize === size.label 
                        ? "bg-foreground text-background border-foreground" 
                        : "bg-white border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                
                {/* Size Table */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-gray-200">
                        <th className="text-left pb-2 font-semibold">Size</th>
                        <th className="text-center pb-2 font-semibold">Length</th>
                        <th className="text-center pb-2 font-semibold">Breadth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-foreground">
                      {product.sizes.map((size) => (
                        <tr key={size.label} className={selectedSize === size.label ? "bg-foreground/5 font-semibold" : ""}>
                          <td className="py-2.5 font-bold uppercase">{size.label}</td>
                          <td className="py-2.5 text-center">{size.length}</td>
                          <td className="py-2.5 text-center">{size.breadth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.salesType === "Wholesale" ? (
              <div className="mb-6 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Select Bulk Quantity (Min 50)</p>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setQty(preset)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${qty === preset
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white text-foreground border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                    >
                      {preset}
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      value={![50, 100, 200].includes(qty) || qty === 0 ? (qty === 0 ? "" : qty) : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setQty(0);
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num)) setQty(num);
                        }
                      }}
                      onBlur={() => {
                        if (qty < 50) setQty(50);
                      }}
                      placeholder="Custom"
                      className={`w-28 px-4 py-2 text-sm font-semibold rounded-lg border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all ${![50, 100, 200].includes(qty) && qty >= 50 ? "border-foreground bg-gray-50" : "border-gray-200"
                        }`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center rounded-full border border-gray-200 bg-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-gray-50 rounded-l-full transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="px-4 text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-2.5 hover:bg-gray-50 rounded-r-full transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={() => { onAddToCart(product, Math.max(product.salesType === "Wholesale" ? 50 : 1, qty), selectedSize || undefined); onClose(); }}
              disabled={!product.inStock}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-foreground/30"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart {product.salesType === "Wholesale" && <span className="text-background/70 font-normal">({Math.max(50, qty)} pieces)</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowVideoModal(false)} />
          <div className="relative max-w-5xl w-full aspect-video">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailModal;
