import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer id="contact" className="bg-[hsl(220,25%,5%)] text-foreground border-top-glow">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="ZARRKS logo" className="h-9 w-auto" />
            <span className="font-display text-lg font-bold text-metallic tracking-wider">ZARRKS</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium quality hair cutting aprons and salon capes. Trusted by professionals across India.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#products" className="hover:text-primary transition-colors">Products</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Bulk Orders</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-foreground">Customer Service</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-foreground">Contact Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a href="tel:+919990197268" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" /> +91 99901 97268
              </a>
            </li>
            <li>
              <a href="mailto:zarrksenterprises@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" /> zarrksenterprises@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5" /> Ghaziabad, India
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/30 mt-12 pt-8 text-center text-xs text-muted-foreground/60">
        © 2026 ZARRKS. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
