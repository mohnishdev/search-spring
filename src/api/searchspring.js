const SITE_ID = 'scmq7n'
const BASE_URL = `https://${SITE_ID}.a.searchspring.io/api/search/search.json`

const buildSearchUrl = ({ query = '', resultsFormat = 'native', page = '1' }) => {
  const params = new URLSearchParams({
    q: query.trim(),
    resultsFormat,
    page,
    siteId: SITE_ID,
  })

  return `${BASE_URL}?${params.toString()}`
}

const searchspring = {
  getSearch: async ({ query = '', resultsFormat = 'native', page = '1' }) => {
    const url = buildSearchUrl({ query, resultsFormat, page })
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Searchspring request failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.results ?? [],
      pagination: data.pagination ?? null,
    }
  },
}

export default searchspring
