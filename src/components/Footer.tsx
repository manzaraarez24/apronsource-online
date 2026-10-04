import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer id="contact" className="bg-gray-50 border-t border-gray-200">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src={logo} alt="ZARRKS logo" className="h-9 w-auto object-contain" />
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              ZARRKS
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Premium quality hair cutting aprons and salon capes. Trusted by professionals across India.
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919990197268"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-foreground hover:text-background transition-all duration-200"
              aria-label="WhatsApp"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href="mailto:zarrksenterprises@gmail.com"
              className="p-2 rounded-full bg-gray-100 hover:bg-foreground hover:text-background transition-all duration-200"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><a href="/#products" className="hover:text-foreground transition-colors">Products</a></li>
            <li><a href="/#about" className="hover:text-foreground transition-colors">About Us</a></li>
            <li><a href="/#contact" className="hover:text-foreground transition-colors">Bulk Orders</a></li>
            <li><Link to="/faq" className="hover:text-foreground transition-colors">Returns & FAQ</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Customer Service</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping Info</Link></li>
            <li><Link to="/track-order" className="hover:text-foreground transition-colors">Track Order</Link></li>
            <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Contact Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a href="tel:+919990197268" className="flex items-center gap-2.5 hover:text-foreground transition-colors">
                <Phone className="h-4 w-4 text-foreground/60" /> +91 99901 97268
              </a>
            </li>
            <li>
              <a href="mailto:zarrksenterprises@gmail.com" className="flex items-center gap-2.5 hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 text-foreground/60" /> zarrksenterprises@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-foreground/60 mt-0.5" /> Ghaziabad, India
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-5">
            <p className="text-xs text-muted-foreground mb-2">Subscribe for offers & updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 text-xs rounded-full border border-gray-200 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
              />
              <button className="rounded-full bg-foreground text-background px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 ZARRKS. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/shipping" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
          <Link to="/faq" className="hover:text-foreground transition-colors">Refund Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
