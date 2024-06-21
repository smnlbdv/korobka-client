import api from '../api/api'

export default async function fetchAllBox(limit = 12, page = 1, search = null, category = null, filter = null) {
    let params = { 
        _limit: limit, 
        _page: page,
        _search: search,
        _category: category,
        minPrice: filter ? filter.min : null, // Добавляем minPrice в объект params
        maxPrice: filter ? filter.max : null  // Добавляем maxPrice в объект params
    }
    
    const response = await api.get('/api/products/all', {params})
    return response
}