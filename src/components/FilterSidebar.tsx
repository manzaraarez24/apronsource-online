import { X } from "lucide-react";
import { categories, materials, colors } from "@/data/products";

interface FilterSidebarProps {
  selectedCategory: string;
  selectedMaterial: string;
  selectedColor: string;
  priceRange: [number, number];
  onCategoryChange: (v: string) => void;
  onMaterialChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onPriceRangeChange: (v: [number, number]) => void;
  onClearFilters: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const FilterSection = ({ title, options, selected, onChange }: {
  title: string; options: string[]; selected: string; onChange: (v: string) => void;
}) => (
  <div className="mb-6">
    <h4 className="text-sm font-semibold text-foreground mb-3">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === opt
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const FilterSidebar = ({
  selectedCategory, selectedMaterial, selectedColor, priceRange,
  onCategoryChange, onMaterialChange, onColorChange, onPriceRangeChange,
  onClearFilters, mobileOpen, onMobileClose,
}: FilterSidebarProps) => {
  const hasFilters = selectedCategory !== "All" || selectedMaterial !== "All" || selectedColor !== "All" || priceRange[0] > 0 || priceRange[1] < 1000;

  const content = (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Filters</h3>
        <div className="flex gap-2">
          {hasFilters && (
            <button onClick={onClearFilters} className="text-xs font-medium text-primary hover:underline">
              Clear all
            </button>
          )}
          <button onClick={onMobileClose} className="lg:hidden p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <FilterSection title="Category" options={categories} selected={selectedCategory} onChange={onCategoryChange} />
      <FilterSection title="Material" options={materials} selected={selectedMaterial} onChange={onMaterialChange} />
      <FilterSection title="Color" options={colors} selected={selectedColor} onChange={onColorChange} />

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Price Range</h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
            className="w-20 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            placeholder="Min"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-20 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="glass rounded-2xl sticky top-20">{content}</div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-card shadow-2xl overflow-y-auto">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
