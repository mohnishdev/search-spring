import React, { useState } from 'react';
import './Filters.scss';

const CATEGORIES = [
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'tech-essentials', label: 'Tech Essentials' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'home-studio', label: 'Home Studio' },
];

const Filters = () => {
  const [checkedCategories, setCheckedCategories] = useState(['new-arrivals']);
  const [priceRange, setPriceRange] = useState(2500);
  const [availability, setAvailability] = useState('in-stock');

  const toggleCategory = (id) => {
    setCheckedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="filters">
      {/* Categories */}
      <section className="filters__section">
        <h3 className="filters__heading">Categories</h3>
        <div className="filters__category-list">
          {CATEGORIES.map((cat) => {
            const checked = checkedCategories.includes(cat.id);
            return (
              <label key={cat.id} className="filters__label">
                <span
                  className={`filters__checkbox ${checked ? 'filters__checkbox--checked' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === ' ' && toggleCategory(cat.id)}
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
                <span className="filters__label-text">{cat.label}</span>
              </label>
            );
          })}
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
              max={2500}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="filters__slider"
            />
            <div
              className="filters__slider-fill"
              style={{ width: `${(priceRange / 2500) * 100}%` }}
            />
          </div>
          <div className="filters__price-labels">
            <span className="filters__price-label">$0</span>
            <span className="filters__price-label">${priceRange.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Availability */}
      <section className="filters__section filters__section--bordered">
        <h3 className="filters__heading">Availability</h3>
        <div className="filters__availability">
          <button
            className={`filters__pill ${availability === 'in-stock' ? 'filters__pill--active' : ''}`}
            onClick={() => setAvailability('in-stock')}
          >
            In Stock
          </button>
          <button
            className={`filters__pill ${availability === 'pre-order' ? 'filters__pill--active' : ''}`}
            onClick={() => setAvailability('pre-order')}
          >
            Pre-order
          </button>
        </div>
      </section>
    </div>
  );
};

export default Filters;