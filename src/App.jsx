import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Filters from './components/Filters/Filters'
import searchspring from '@api/searchspring'
import ProductGrid from './components/ProductGrid/ProductsGrid'
import Pagination from './components/Pagination/Pagination'
import './App.scss'

const DEFAULT_SORT_OPTIONS = [
  { value: 'relevance:desc', label: 'Best Match' },
  { value: 'sales_rank:desc', label: 'Best Sellers' },
  { value: 'price:desc', label: 'Price ($$$ - $)' },
  { value: 'days_since_published:desc', label: 'Recently Added' },
  { value: 'title:asc', label: 'Name (A - Z)' },
  { value: 'title:desc', label: 'Name (Z - A)' },
  { value: 'sale_price:desc', label: 'Highest Rated' },
  { value: 'price:asc', label: 'Price ($ - $$$)' },
]

const getProductPrice = (product) => {
  const numericPrice = parseFloat(product.ss_sale_price || product.price || 0)
  return Number.isFinite(numericPrice) ? numericPrice : 0
}

const normalizeSortingOptions = (options = []) =>
  [
    ...new Map(
      options
        .filter((option) => option?.field && option?.direction && option?.label)
        .map((option) => [
          `${option.field}:${option.direction}`,
          {
            value: `${option.field}:${option.direction}`,
            label: option.label,
          },
        ])
    ).values(),
  ]

function App() {
  const [searchText, setSearchText] = useState('')
  const [query, setQuery] = useState('a')
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState('relevance:desc')
  const [sortChangeSeq, setSortChangeSeq] = useState(0)
  const [sortOptions, setSortOptions] = useState(DEFAULT_SORT_OPTIONS)
  const [brandOptions, setBrandOptions] = useState([])
  const [colorOptions, setColorOptions] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [priceRange, setPriceRange] = useState(0)
  const [priceSliderMax, setPriceSliderMax] = useState(0)
  const [hasUserAdjustedPrice, setHasUserAdjustedPrice] = useState(false)

  const responseMaxPrice = useMemo(() => {
    const prices = results.map(getProductPrice)
    return prices.length ? Math.ceil(Math.max(...prices)) : 0
  }, [results])

  const filteredResults = useMemo(() => results, [results])
  const totalResultsCount = pagination?.totalResults ?? filteredResults.length

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setPagination(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let isActive = true
    setIsLoading(true)
    setError(null)

    searchspring
      .getSearch({
        query,
        resultsFormat: 'native',
        page: String(page),
        filters: {
          sortField: sortBy.split(':')[0] || 'relevance',
          sortDirection: sortBy.split(':')[1] || 'desc',
          brands: selectedBrands,
          colorFamilies: selectedColors,
          priceHigh:
            hasUserAdjustedPrice && priceSliderMax > 0 && priceRange < priceSliderMax
              ? priceRange
              : null,
        },
      })
      .then(({ data, pagination: pageData, sorting, facets }) => {
        if (!isActive) return
        setResults(data ?? [])
        setPagination(pageData ?? null)
        const nextSortOptions = normalizeSortingOptions(sorting)
        setSortOptions(nextSortOptions.length ? nextSortOptions : DEFAULT_SORT_OPTIONS)

        const brandFacet = facets?.find((facet) => facet.field === 'brand')
        const colorFacet = facets?.find((facet) => facet.field === 'color_family')

        setBrandOptions(
          (brandFacet?.values ?? [])
            .filter((value) => value?.value && value?.label)
            .map((value) => ({ value: value.value, label: value.label }))
        )
        setColorOptions(
          (colorFacet?.values ?? [])
            .filter((value) => value?.value && value?.label)
            .map((value) => ({ value: value.value, label: value.label }))
        )
      })
      .catch((err) => {
        console.error(err)
        if (!isActive) return
        setError('Unable to load search results.')
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [
    query,
    page,
    priceRange,
    hasUserAdjustedPrice,
    priceSliderMax,
    sortBy,
    sortChangeSeq,
    selectedBrands,
    selectedColors,
  ])

  useEffect(() => {
    if (responseMaxPrice <= 0) return

    if (!hasUserAdjustedPrice) {
      setPriceSliderMax(responseMaxPrice)
      setPriceRange(responseMaxPrice)
    }
  }, [responseMaxPrice, hasUserAdjustedPrice])

  useEffect(() => {
    setSelectedBrands((previous) => {
      const allowed = new Set(brandOptions.map((option) => option.value))
      const next = previous.filter((value) => allowed.has(value))
      if (next.length === previous.length && next.every((value, index) => value === previous[index])) {
        return previous
      }
      return next
    })
  }, [brandOptions])

  useEffect(() => {
    setSelectedColors((previous) => {
      const allowed = new Set(colorOptions.map((option) => option.value))
      const next = previous.filter((value) => allowed.has(value))
      if (next.length === previous.length && next.every((value, index) => value === previous[index])) {
        return previous
      }
      return next
    })
  }, [colorOptions])

  useEffect(() => {
    if (!isMobileFiltersOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileFiltersOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileFiltersOpen])

  const handleSearch = (event) => {
    event.preventDefault()
    const nextQuery = searchText.trim() || 'a'
    setIsLoading(true)
    setResults([])
    setPriceSliderMax(0)
    setHasUserAdjustedPrice(false)
    setQuery(nextQuery)
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchText('')
    setIsLoading(true)
    setResults([])
    setPriceSliderMax(0)
    setHasUserAdjustedPrice(false)
    setQuery('a')
    setPage(1)
  }

  const handlePage = (newPage) => {
    if (!pagination) return
    if (newPage < 1 || newPage > pagination.totalPages) return
    setIsLoading(true)
    setResults([])
    setPage(newPage)
  }

  const handleSortChange = (value) => {
    if (value === sortBy) return
    setIsLoading(true)
    setResults([])
    setPage(1)
    setSortBy(value)
    setSortChangeSeq((prev) => prev + 1)
  }

  const handlePriceChange = (value) => {
    if (value === priceRange && hasUserAdjustedPrice) return
    setIsLoading(true)
    setResults([])
    setPage(1)
    setHasUserAdjustedPrice(true)
    setPriceRange(value)
  }

  const handleClearFilters = () => {
    setIsLoading(true)
    setResults([])
    setPage(1)
    setSelectedBrands([])
    setSelectedColors([])
    setHasUserAdjustedPrice(false)
    setPriceRange(priceSliderMax || 0)
  }

  const handleBrandToggle = (value) => {
    setIsLoading(true)
    setResults([])
    setPage(1)
    setSelectedBrands((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    )
  }

  const handleColorToggle = (value) => {
    setIsLoading(true)
    setResults([])
    setPage(1)
    setSelectedColors((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    )
  }

  const filtersProps = {
    priceRange,
    maxPrice: priceSliderMax,
    onPriceChange: handlePriceChange,
    brandOptions,
    selectedBrands,
    onBrandToggle: handleBrandToggle,
    colorOptions,
    selectedColors,
    onColorToggle: handleColorToggle,
    sortBy,
    sortOptions,
    onSortByChange: handleSortChange,
    onClearFilters: handleClearFilters,
  }

  const mobileFiltersProps = {
    ...filtersProps,
    showSort: false,
    onPriceChange: (value) => {
      handlePriceChange(value)
      setIsMobileFiltersOpen(false)
    },
    onBrandToggle: (value) => {
      handleBrandToggle(value)
      setIsMobileFiltersOpen(false)
    },
    onColorToggle: (value) => {
      handleColorToggle(value)
      setIsMobileFiltersOpen(false)
    },
    onClearFilters: () => {
      handleClearFilters()
      setIsMobileFiltersOpen(false)
    },
  }

  return (
    <div className="app">
      <Navbar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchSubmit={handleSearch}
        onSearchClear={handleClearSearch}
      />

      <main className="app__shell">
        <aside className="app__sidebar-desktop">
          <Sidebar {...filtersProps} />
        </aside>

        <section className="search-page">
          <div className="search-panel">
            {error && <div className="search-error">{error}</div>}

            <div className="mobile-grid-toolbar">
              <span className="mobile-grid-toolbar__label">Products</span>

              <div className="mobile-grid-toolbar__meta">
                <span>{totalResultsCount} items</span>
                <label className="mobile-grid-toolbar__sort">
                  <span>Sort</span>
                  <select
                    value={sortBy}
                    onChange={(event) => handleSortChange(event.target.value)}
                    onInput={(event) => handleSortChange(event.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mobile-filters-trigger">
                <button
                  type="button"
                  className="mobile-filters-trigger__btn"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal size={16} />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            <ProductGrid
              products={filteredResults}
              searchTerm={query}
              isLoading={isLoading}
            />

            <div className="search-panel__pagination search-panel__pagination--bottom">
              <Pagination
                currentPage={page}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={handlePage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>
      </main>

      {isMobileFiltersOpen && (
        <div
          className="mobile-filters-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <button
            type="button"
            className="mobile-filters-modal__backdrop"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-label="Close filters"
          />

          <div className="mobile-filters-modal__panel">
            <div className="mobile-filters-modal__header">
              <h2>Filters</h2>
              <button
                type="button"
                className="mobile-filters-modal__close"
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <Filters {...mobileFiltersProps} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
