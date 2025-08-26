import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dataSourcesAPI, type DataSource, type DataSourceCreate } from '@/services/api'

export const useDataSourcesStore = defineStore('dataSources', () => {
  // State
  const dataSources = ref<DataSource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedCategory = ref('')

  // Getters
  const filteredDataSources = computed(() => {
    return dataSources.value.filter(ds => {
      const matchesQuery = searchQuery.value === '' || 
        ds.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        ds.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        ds.tags?.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
      
      const matchesCategory = selectedCategory.value === '' || ds.category === selectedCategory.value
      
      return matchesQuery && matchesCategory
    })
  })

  const categories = computed(() => {
    const uniqueCategories = new Set(
      dataSources.value
        .map(ds => ds.category)
        .filter(cat => cat && cat.trim() !== '')
    )
    return Array.from(uniqueCategories).sort()
  })

  // Actions
  const fetchDataSources = async () => {
    loading.value = true
    error.value = null
    try {
      dataSources.value = await dataSourcesAPI.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch data sources'
      console.error('Error fetching data sources:', err)
    } finally {
      loading.value = false
    }
  }

  const searchDataSources = async (query: string, category?: string) => {
    if (!query.trim()) {
      await fetchDataSources()
      return
    }

    loading.value = true
    error.value = null
    try {
      dataSources.value = await dataSourcesAPI.search(query, category)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search data sources'
      console.error('Error searching data sources:', err)
    } finally {
      loading.value = false
    }
  }

  const createDataSource = async (dataSource: DataSourceCreate) => {
    loading.value = true
    error.value = null
    try {
      const newDataSource = await dataSourcesAPI.create(dataSource)
      dataSources.value.push(newDataSource)
      return newDataSource
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create data source'
      console.error('Error creating data source:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDataSource = async (id: number, dataSource: Partial<DataSourceCreate>) => {
    loading.value = true
    error.value = null
    try {
      const updatedDataSource = await dataSourcesAPI.update(id, dataSource)
      const index = dataSources.value.findIndex(ds => ds.id === id)
      if (index !== -1) {
        dataSources.value[index] = updatedDataSource
      }
      return updatedDataSource
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update data source'
      console.error('Error updating data source:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDataSource = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await dataSourcesAPI.delete(id)
      dataSources.value = dataSources.value.filter(ds => ds.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete data source'
      console.error('Error deleting data source:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedCategory = (category: string) => {
    selectedCategory.value = category
  }

  return {
    // State
    dataSources,
    loading,
    error,
    searchQuery,
    selectedCategory,
    // Getters
    filteredDataSources,
    categories,
    // Actions
    fetchDataSources,
    searchDataSources,
    createDataSource,
    updateDataSource,
    deleteDataSource,
    clearError,
    setSearchQuery,
    setSelectedCategory,
  }
})