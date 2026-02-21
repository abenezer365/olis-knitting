// components/Products/ProductFilters.js
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3x3, List } from "lucide-react";
import { Slider } from "@/components/ui/slider";

function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  currencies,
  selectedCurrency,
  onCurrencyChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  priceRange,
  onPriceRangeChange,
  totalProducts,
}) {
  return (
    <div className="space-y-6 mb-8">
      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Price Range</label>
          <span className="text-sm text-muted-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={onPriceRangeChange}
          max={1000}
          step={10}
          className="w-full"
        />
      </div>

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* View Mode & Sort */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="px-3"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {/* Items per Page */}
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(val) => onItemsPerPageChange(Number.parseInt(val))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Show 5</SelectItem>
              <SelectItem value="10">Show 10</SelectItem>
              <SelectItem value="20">Show 20</SelectItem>
              <SelectItem value="35">Show 35</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count and Currency */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {totalProducts} products
          </span>
          <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
