import { Scissors, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="bg-foreground text-primary-foreground">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">ApronCraft</span>
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Premium quality hair cutting aprons and salon capes. Trusted by professionals across India.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            <li><a href="#products" className="hover:text-primary transition-colors">Products</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Bulk Orders</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/60">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@aproncraft.in</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> Mumbai, Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-xs text-primary-foreground/40">
        © 2026 ApronCraft. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
