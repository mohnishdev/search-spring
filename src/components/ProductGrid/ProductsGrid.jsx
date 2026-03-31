import { useState } from "react";
import "./ProductGrid.scss";

const ProductCard = ({ product }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const newArrivalBadge = product.badges?.find((b) => b.tag === "new");

  const price = parseFloat(product.ss_sale_price || product.price);
  const msrp = parseFloat(product.msrp);

  const colorVariant = Array.isArray(product.color)
    ? product.color.join(" / ")
    : product.color;

  return (
    <article className="product-card">
      <a href={product.url} className="product-card__image-wrap">
        <img
          src={imgError ? product.imageUrl : (product.thumbnailImageUrl || product.imageUrl)}
          alt={product.name}
          className="product-card__image"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {newArrivalBadge && (
          <span className="product-card__badge product-card__badge--new">
            {newArrivalBadge.value}
          </span>
        )}

        <button
          className={`product-card__wishlist${wishlisted ? " product-card__wishlist--active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((v) => !v);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </a>

      <div className="product-card__info">
        <a href={product.url} className="product-card__name">
          {product.name}
        </a>
        {colorVariant && (
          <span className="product-card__variant">{colorVariant}</span>
        )}
        <div className="product-card__pricing">
          <span className="product-card__price">${price.toFixed(2)}</span>
          {msrp > price && (
            <span className="product-card__msrp">${msrp.toFixed(2)}</span>
          )}
        </div>
      </div>
    </article>
  );
};

const SkeletonCard = () => (
  <article className="skeleton-card">
    <div className="skeleton-card__image" />
    <div className="skeleton-card__body">
      <div className="skeleton-card__line skeleton-card__line--title" />
      <div className="skeleton-card__line skeleton-card__line--subtitle" />
      <div className="skeleton-card__line skeleton-card__line--price" />
    </div>
  </article>
);

const ProductGrid = ({
  products = [],
  searchTerm = "",
  isLoading = false,
}) => {
  const showSkeleton = isLoading && products.length === 0;
  const showEmpty = !isLoading && products.length === 0;

  return (
    <section className="product-grid-section">
      {showEmpty ? (
        <div className="product-grid__empty">
          <p>No products found{searchTerm ? ` for "${searchTerm}"` : ""}.</p>
        </div>
      ) : (
        <div className="product-grid">
          {showSkeleton
            ? Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : products.map((product) => (
                <ProductCard key={product.id || product.uid} product={product} />
              ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
