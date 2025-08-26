import axios from 'axios'

export interface DataSource {
  id: number
  name: string
  description?: string
  url?: string
  category?: string
  tags?: string[]
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface DataSourceCreate {
  name: string
  description?: string
  url?: string
  category?: string
  tags?: string[]
  is_active?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const dataSourcesAPI = {
  // Get all data sources
  getAll: async (skip: number = 0, limit: number = 100): Promise<DataSource[]> => {
    const response = await api.get(`/data-sources/?skip=${skip}&limit=${limit}`)
    return response.data
  },

  // Search data sources
  search: async (
    query: string,
    category?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<DataSource[]> => {
    const params = new URLSearchParams({
      q: query,
      skip: skip.toString(),
      limit: limit.toString(),
    })
    
    if (category) {
      params.append('category', category)
    }

    const response = await api.get(`/data-sources/search?${params}`)
    return response.data
  },

  // Get single data source
  getById: async (id: number): Promise<DataSource> => {
    const response = await api.get(`/data-sources/${id}`)
    return response.data
  },

  // Create new data source
  create: async (dataSource: DataSourceCreate): Promise<DataSource> => {
    const response = await api.post('/data-sources/', dataSource)
    return response.data
  },

  // Update data source
  update: async (id: number, dataSource: Partial<DataSourceCreate>): Promise<DataSource> => {
    const response = await api.put(`/data-sources/${id}`, dataSource)
    return response.data
  },

  // Delete data source
  delete: async (id: number): Promise<void> => {
    await api.delete(`/data-sources/${id}`)
  },
}

export default api