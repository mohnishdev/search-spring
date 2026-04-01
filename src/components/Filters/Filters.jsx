import { useMemo, useState } from 'react';
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
  showSort = true,
  sortOptions = SORT_OPTIONS,
  priceRange = 0,
  maxPrice = 0,
  onPriceChange,
  brandOptions = [],
  selectedBrands = [],
  onBrandToggle,
  colorOptions = [],
  selectedColors = [],
  onColorToggle,
  onClearFilters,
  sortBy = 'relevance',
  onSortByChange,
}) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [colorSearch, setColorSearch] = useState('');
  const [showAllColors, setShowAllColors] = useState(false);

  const effectiveMaxPrice = Math.max(maxPrice, 0);
  const sliderValue = Math.min(priceRange, effectiveMaxPrice || priceRange || 0);
  const sliderWidth =
    effectiveMaxPrice > 0 ? `${(sliderValue / effectiveMaxPrice) * 100}%` : '0%';

  const filteredBrandOptions = useMemo(() => {
    const term = brandSearch.trim().toLowerCase();
    if (!term) return brandOptions;

    return brandOptions.filter((option) =>
      option.label.toLowerCase().includes(term)
    );
  }, [brandOptions, brandSearch]);

  const visibleBrandOptions = showAllBrands
    ? filteredBrandOptions
    : filteredBrandOptions.slice(0, 5);

  const hasMoreBrands = filteredBrandOptions.length > 5;

  const filteredColorOptions = useMemo(() => {
    const term = colorSearch.trim().toLowerCase();
    if (!term) return colorOptions;

    return colorOptions.filter((option) =>
      option.label.toLowerCase().includes(term)
    );
  }, [colorOptions, colorSearch]);

  const visibleColorOptions = showAllColors
    ? filteredColorOptions
    : filteredColorOptions.slice(0, 5);

  const hasMoreColors = filteredColorOptions.length > 5;

  return (
    <div className="filters">
      <div className="filters__content">
        {showSort && (
          <section className="filters__section">
            <h3 className="filters__heading">Sort By</h3>
            <div className="filters__sort">
              <span className="filters__select-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
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
        )}

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

        <section className="filters__section filters__section--bordered">
          <h3 className="filters__heading">Brand</h3>
          <input
            type="search"
            className="filters__search"
            placeholder="Search brand"
            value={brandSearch}
            onChange={(event) => {
              setBrandSearch(event.target.value);
              setShowAllBrands(false);
            }}
          />
          <div
            className={`filters__category-list ${showAllBrands ? 'filters__category-list--scrollable' : ''}`}
          >
            {visibleBrandOptions.map((option) => {
              const checked = selectedBrands.includes(option.value);
              return (
                <label key={option.value} className="filters__label">
                  <input
                    type="checkbox"
                    className="filters__checkbox-input"
                    checked={checked}
                    onChange={() => onBrandToggle?.(option.value)}
                  />
                  <span
                    className={`filters__checkbox ${checked ? 'filters__checkbox--checked' : ''}`}
                    aria-hidden="true"
                  >
                    {checked && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="filters__label-text">{option.label}</span>
                </label>
              );
            })}
          </div>
          {hasMoreBrands && (
            <button
              type="button"
              className="filters__more-btn"
              onClick={() => setShowAllBrands((value) => !value)}
            >
              {showAllBrands ? 'Show less' : `Show more (${filteredBrandOptions.length - 5})`}
            </button>
          )}
        </section>

        <section className="filters__section filters__section--bordered">
          <h3 className="filters__heading">Color</h3>
          <input
            type="search"
            className="filters__search"
            placeholder="Search color"
            value={colorSearch}
            onChange={(event) => {
              setColorSearch(event.target.value);
              setShowAllColors(false);
            }}
          />
          <div
            className={`filters__category-list ${showAllColors ? 'filters__category-list--scrollable' : ''}`}
          >
            {visibleColorOptions.map((option) => {
              const checked = selectedColors.includes(option.value);
              return (
                <label key={option.value} className="filters__label">
                  <input
                    type="checkbox"
                    className="filters__checkbox-input"
                    checked={checked}
                    onChange={() => onColorToggle?.(option.value)}
                  />
                  <span
                    className={`filters__checkbox ${checked ? 'filters__checkbox--checked' : ''}`}
                    aria-hidden="true"
                  >
                    {checked && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="filters__label-text">{option.label}</span>
                </label>
              );
            })}
          </div>
          {hasMoreColors && (
            <button
              type="button"
              className="filters__more-btn"
              onClick={() => setShowAllColors((value) => !value)}
            >
              {showAllColors ? 'Show less' : `Show more (${filteredColorOptions.length - 5})`}
            </button>
          )}
        </section>
      </div>

      <section className="filters__section filters__section--footer">
        <button
          type="button"
          className="filters__clear-btn"
          onClick={() => onClearFilters?.()}
        >
          Clear Filters
        </button>
      </section>
    </div>
  );
};

export default Filters;
