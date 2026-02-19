import { useState } from "react";
import { ShoppingCart, Search, Menu, X, Scissors } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar = ({ cartCount, onCartClick, searchQuery, onSearchChange }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">ApronCraft</span>
          </div>

          {/* Search */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search capes, aprons..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full border border-border bg-background/60 py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#products" className="hover:text-foreground transition-colors">Products</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          {/* Cart & Mobile */}
          <div className="flex items-center gap-3">
            <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-accent transition-colors">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search capes, aprons..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-border bg-background/60 py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-3 flex flex-col gap-3 text-sm font-medium text-muted-foreground">
            <a href="#products" className="hover:text-foreground transition-colors">Products</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
