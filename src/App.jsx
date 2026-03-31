import { useEffect, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Filters from './components/Filters/Filters'
import searchspring from '@api/searchspring'
import ProductGrid from './components/ProductGrid/ProductsGrid'
import Pagination from './components/Pagination/Pagination'
import './App.scss'

function App() {
  const [searchText, setSearchText] = useState('')
  const [query, setQuery] = useState('a')
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

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
      })
      .then(({ data, pagination: pageData }) => {
        if (!isActive) return
        setResults(data ?? [])
        setPagination(pageData ?? null)
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
  }, [query, page])

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
    setQuery(nextQuery)
    setPage(1)
  }

  const handlePage = (newPage) => {
    if (!pagination) return
    if (newPage < 1 || newPage > pagination.totalPages) return
    setIsLoading(true)
    setResults([])
    setPage(newPage)
  }

  return (
    <div className="app">
      <Navbar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchSubmit={handleSearch}
      />

      <main className="app__shell">
        <aside className="app__sidebar-desktop">
          <Sidebar />
        </aside>

        <section className="search-page">
          <div className="search-panel">
            {error && <div className="search-error">{error}</div>}

            <div className="mobile-filters-trigger">
              <button
                type="button"
                className="mobile-filters-trigger__btn"
                onClick={() => setIsMobileFiltersOpen(true)}
                aria-label="Open filters"
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </button>
            </div>

            <ProductGrid
              products={results}
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
            <Filters />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
