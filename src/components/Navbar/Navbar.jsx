import './Navbar.scss';
import { Grid, Search, User, ShoppingBag, X } from 'lucide-react';

const Navbar = ({ searchText, onSearchTextChange, onSearchSubmit, onSearchClear }) => {
  return (
    <header className="navbar">
      <div className="navbar__inner">

        <a href="/" className="navbar__brand">
          <Grid className="navbar__brand-icon" />
          <span className="navbar__brand-name">SearchSpring</span>
        </a>

        <form className="navbar__search" onSubmit={onSearchSubmit}>
          <div className="navbar__search-wrap">
            {/* <Search className="navbar__search-icon" /> */}
            <input
              className="navbar__search-input"
              type="text"
              placeholder="Search premium essentials..."
              value={searchText}
              onChange={(event) => onSearchTextChange(event.target.value)}
            />
            {searchText && (
              <button
                type="button"
                className="navbar__search-clear"
                onClick={onSearchClear}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button type="submit" className="navbar__search-btn">
            <Search size={16} />
            <span>Search</span>
          </button>
        </form>

        <div className="navbar__actions">
          <button className="navbar__action-btn">
            <User />
            <span className="navbar__action-label">Account</span>
          </button>

          <div className="navbar__cart-wrap">
            <button className="navbar__action-btn navbar__action-btn--cart">
              <ShoppingBag />
              <span className="navbar__action-label">Cart</span>
            </button>
            <span className="navbar__cart-dot" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
