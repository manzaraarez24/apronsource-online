import { X, Star, ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

const ProductDetailModal = ({ product, onClose, onAddToCart }: ProductDetailModalProps) => {
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Reset qty when a new product is opened (50 for wholesale, 1 for retail)
  useEffect(() => {
    if (product) {
      setQty(product.salesType === "Wholesale" ? 50 : 1);
      setCurrentImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const images = product.images || [];
  const videos = product.videos || [];
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-strong rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-primary/10">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-muted p-2 hover:bg-primary/10 hover:text-primary transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Slideshow Section */}
          <div className="aspect-square bg-muted rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden relative group">
            {images.length > 0 ? (
              <>
                <img src={images[currentImageIndex]} alt={product.name} className="h-full w-full object-cover" />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-primary w-6" : "bg-white/50 w-2 hover:bg-white/70"}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{product.category}</span>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3 uppercase tracking-wide">{product.name}</h2>

            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/50"><span className="text-muted-foreground">Material</span><span className="font-medium text-foreground">{product.material}</span></div>
              <div className="flex justify-between py-1.5 border-b border-border/50"><span className="text-muted-foreground">Color</span><span className="font-medium text-foreground">{product.color}</span></div>
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Available Sizes</span>
                  <span className="font-medium text-foreground">{product.sizes.map(s => s.name).join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5"><span className="text-muted-foreground">Availability</span><span className={`font-medium ${product.inStock ? "text-emerald-400" : "text-destructive"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span></div>
            </div>

            {/* Size Chart */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Size Chart</h4>
                <div className="space-y-2">
                  {product.sizes.map((size, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="font-medium">{size.name}</span>
                      <span className="text-muted-foreground">{size.length}cm × {size.breadth}cm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Gallery */}
            {videos.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Product Videos</p>
                <div className="flex gap-2 flex-wrap">
                  {videos.map((video, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVideoClick(video)}
                      className="relative h-20 w-20 bg-muted rounded-lg overflow-hidden hover:opacity-80 transition-opacity group"
                    >
                      <video src={video} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400">{discount}% off</span>
            </div>

            {/* Quantity Selector Logic based on SalesType */}
            {product.salesType === "Wholesale" ? (
              <div className="mb-6 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Select Bulk Quantity (Min 50)</p>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setQty(preset)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${qty === preset
                        ? "bg-primary text-primary-foreground border-primary glow-blue"
                        : "bg-muted/40 text-foreground border-border hover:bg-primary/10 hover:border-primary/30"
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
                      className={`w-28 px-4 py-2 text-sm font-semibold rounded-lg border bg-muted/40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all ${![50, 100, 200].includes(qty) && qty >= 50 ? "border-primary bg-primary/10 text-primary" : "border-border"
                        }`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center rounded-full border border-border">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-primary/10 rounded-l-full transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="px-4 text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-primary/10 rounded-r-full transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            <button
              onClick={() => { onAddToCart(product, Math.max(product.salesType === "Wholesale" ? 50 : 1, qty)); onClose(); }}
              disabled={!product.inStock}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 disabled:opacity-40 glow-blue"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart {product.salesType === "Wholesale" && <span className="text-primary-foreground/80 font-normal">({Math.max(50, qty)} pieces)</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white p-2 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4 text-black" />
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailModal;
