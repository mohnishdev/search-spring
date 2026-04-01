import './Filters.scss';

const SORT_OPTIONS = [
  { value: 'relevance:desc', label: 'Best Match' },
  { value: 'sales_rank:desc', label: 'Best Sellers' },
  { value: 'price:desc', label: 'Price ($$$ - $)' },
  { value: 'days_since_published:desc', label: 'Recently Added' },
  { value: 'title:asc', label: 'Name (A - Z)' },
  { value: 'title:desc', label: 'Name (Z - A)' },
  { value: 'sale_price:desc', label: 'Highest Rated' },
  { value: 'price:asc', label: 'Price ($ - $$$)' },
];

const Filters = ({
  sortOptions = SORT_OPTIONS,
  priceRange = 0,
  maxPrice = 0,
  onPriceChange,
  availability = 'all',
  onAvailabilityChange,
  sortBy = 'relevance',
  onSortByChange,
}) => {
  const effectiveMaxPrice = Math.max(maxPrice, 0);
  const sliderValue = Math.min(priceRange, effectiveMaxPrice || priceRange || 0);
  const sliderWidth =
    effectiveMaxPrice > 0 ? `${(sliderValue / effectiveMaxPrice) * 100}%` : '0%';

  return (
    <div className="filters">
      <section className="filters__section">
        <h3 className="filters__heading">Sort By</h3>
        <div className="filters__sort">
          <select
            className="filters__select"
            value={sortBy}
            onChange={(event) => onSortByChange?.(event.target.value)}
            onInput={(event) => onSortByChange?.(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Price Range */}
      <section className="filters__section filters__section--bordered">
        <h3 className="filters__heading">Price Range</h3>
        <div className="filters__price-container">
          <div className="filters__slider-track">
            <input
              type="range"
              min={0}
              max={effectiveMaxPrice || 0}
              value={sliderValue}
              onChange={(event) => onPriceChange?.(Number(event.target.value))}
              className="filters__slider"
              disabled={effectiveMaxPrice === 0}
            />
            <div
              className="filters__slider-fill"
              style={{ width: sliderWidth }}
            />
          </div>
          <div className="filters__price-labels">
            <span className="filters__price-label">$0</span>
            <span className="filters__price-label">
              ${sliderValue.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Availability */}
      <section className="filters__section filters__section--bordered">
        <h3 className="filters__heading">Availability</h3>
        <div className="filters__availability">
          <button
            className={`filters__pill ${availability === 'in-stock' ? 'filters__pill--active' : ''}`}
            onClick={() => onAvailabilityChange?.('in-stock')}
          >
            In Stock
          </button>
          <button
            className={`filters__pill ${availability === 'all' ? 'filters__pill--active' : ''}`}
            onClick={() => onAvailabilityChange?.('all')}
          >
            All
          </button>
          <button
            className={`filters__pill ${availability === 'pre-order' ? 'filters__pill--active' : ''}`}
            onClick={() => onAvailabilityChange?.('pre-order')}
          >
            Pre-order
          </button>
        </div>
      </section>
    </div>
  );
};

export default Filters;
