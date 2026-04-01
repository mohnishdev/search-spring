const SITE_ID = 'scmq7n'
const BASE_URL = `https://${SITE_ID}.a.searchspring.io/api/search/search.json`

const buildSearchUrl = ({ query = '', resultsFormat = 'native', page = '1', filters = {} }) => {
  const params = new URLSearchParams({
    q: query.trim(),
    resultsFormat,
    page,
    siteId: SITE_ID,
  })

  if (filters.refineQuery?.trim()) {
    params.set('rq', filters.refineQuery.trim())
  }

  if (Array.isArray(filters.productTypes)) {
    filters.productTypes
      .map((value) => String(value).trim())
      .filter(Boolean)
      .forEach((value) => {
        params.append('filter.ss_product_type', value)
      })
  }

  if (filters.availability === 'in-stock') {
    params.set('filter.quantity_available.low', '1')
  }

  if (
    typeof filters.priceHigh === 'number' &&
    Number.isFinite(filters.priceHigh) &&
    filters.priceHigh > 0
  ) {
    params.set('filter.price.high', String(filters.priceHigh))
  }

  if (filters.sortField && filters.sortDirection) {
    params.set(`sort.${filters.sortField}`, filters.sortDirection)
  }

  return `${BASE_URL}?${params.toString()}`
}

const searchspring = {
  getSearch: async ({ query = '', resultsFormat = 'native', page = '1', filters = {} }) => {
    const url = buildSearchUrl({ query, resultsFormat, page, filters })
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Searchspring request failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.results ?? [],
      pagination: data.pagination ?? null,
      sorting: data.sorting?.options ?? [],
    }
  },
}

export default searchspring
