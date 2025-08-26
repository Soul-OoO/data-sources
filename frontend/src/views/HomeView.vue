<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useDataSourcesStore } from '@/stores/dataSources'
import { ElMessage } from 'element-plus'
import type { DataSource } from '@/services/api'

const dataSourcesStore = useDataSourcesStore()
const searchInput = ref('')
const selectedCategory = ref('')
const showCreateDialog = ref(false)

// Form for creating new data source
const newDataSource = ref({
  name: '',
  description: '',
  url: '',
  category: '',
  tags: [] as string[],
})

const tagsInput = ref('')

onMounted(async () => {
  await dataSourcesStore.fetchDataSources()
})

// Watch for search input changes
watch(searchInput, async (newValue) => {
  dataSourcesStore.setSearchQuery(newValue)
  if (newValue.trim()) {
    await dataSourcesStore.searchDataSources(newValue, selectedCategory.value)
  } else {
    await dataSourcesStore.fetchDataSources()
  }
})

// Watch for category changes
watch(selectedCategory, async (newValue) => {
  dataSourcesStore.setSelectedCategory(newValue)
  if (searchInput.value.trim()) {
    await dataSourcesStore.searchDataSources(searchInput.value, newValue)
  } else {
    await dataSourcesStore.fetchDataSources()
  }
})

const handleSearch = async () => {
  if (searchInput.value.trim()) {
    await dataSourcesStore.searchDataSources(searchInput.value, selectedCategory.value)
  } else {
    await dataSourcesStore.fetchDataSources()
  }
}

const openUrl = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const handleCreateDataSource = async () => {
  try {
    // Parse tags from input
    const tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    await dataSourcesStore.createDataSource({
      ...newDataSource.value,
      tags,
    })

    ElMessage.success('Data source created successfully!')
    showCreateDialog.value = false
    
    // Reset form
    newDataSource.value = {
      name: '',
      description: '',
      url: '',
      category: '',
      tags: [],
    }
    tagsInput.value = ''
  } catch (error) {
    ElMessage.error('Failed to create data source')
  }
}

const handleDeleteDataSource = async (dataSource: DataSource) => {
  try {
    await dataSourcesStore.deleteDataSource(dataSource.id)
    ElMessage.success('Data source deleted successfully!')
  } catch (error) {
    ElMessage.error('Failed to delete data source')
  }
}
</script>

<template>
  <div class="data-sources-view">
    <!-- Header -->
    <div class="header">
      <h1>Data Sources Search</h1>
      <p class="subtitle">Discover and manage data sources for your projects</p>
    </div>

    <!-- Search and Filters -->
    <div class="search-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="searchInput"
            placeholder="Search data sources..."
            size="large"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="selectedCategory"
            placeholder="All categories"
            size="large"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="category in dataSourcesStore.categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="showCreateDialog = true"
          >
            <el-icon><Plus /></el-icon>
            Add New
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- Results -->
    <div class="results-section">
      <div v-if="dataSourcesStore.loading" class="loading">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="dataSourcesStore.error" class="error">
        <el-alert
          :title="dataSourcesStore.error"
          type="error"
          show-icon
          @close="dataSourcesStore.clearError"
        />
      </div>

      <div v-else-if="dataSourcesStore.filteredDataSources.length === 0" class="no-results">
        <el-empty description="No data sources found" />
      </div>

      <div v-else class="data-sources-grid">
        <el-card
          v-for="dataSource in dataSourcesStore.filteredDataSources"
          :key="dataSource.id"
          class="data-source-card"
          shadow="hover"
        >
          <template #header>
            <div class="card-header">
              <h3>{{ dataSource.name }}</h3>
              <div class="card-actions">
                <el-button
                  v-if="dataSource.url"
                  type="primary"
                  size="small"
                  @click="openUrl(dataSource.url)"
                >
                  <el-icon><Link /></el-icon>
                  Visit
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDeleteDataSource(dataSource)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </template>

          <div class="card-content">
            <p v-if="dataSource.description" class="description">
              {{ dataSource.description }}
            </p>
            
            <div v-if="dataSource.category" class="category">
              <el-tag type="info">{{ dataSource.category }}</el-tag>
            </div>

            <div v-if="dataSource.tags && dataSource.tags.length > 0" class="tags">
              <el-tag
                v-for="tag in dataSource.tags"
                :key="tag"
                size="small"
                type="success"
              >
                {{ tag }}
              </el-tag>
            </div>

            <div class="metadata">
              <small>Created: {{ formatDate(dataSource.created_at) }}</small>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Create Data Source Dialog -->
    <el-dialog
      v-model="showCreateDialog"
      title="Add New Data Source"
      width="600px"
    >
      <el-form :model="newDataSource" label-width="120px">
        <el-form-item label="Name" required>
          <el-input v-model="newDataSource.name" placeholder="Enter data source name" />
        </el-form-item>
        
        <el-form-item label="Description">
          <el-input
            v-model="newDataSource.description"
            type="textarea"
            placeholder="Enter description"
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="URL">
          <el-input v-model="newDataSource.url" placeholder="Enter URL" />
        </el-form-item>
        
        <el-form-item label="Category">
          <el-input v-model="newDataSource.category" placeholder="Enter category" />
        </el-form-item>
        
        <el-form-item label="Tags">
          <el-input
            v-model="tagsInput"
            placeholder="Enter tags separated by commas"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleCreateDataSource"
          :disabled="!newDataSource.name.trim()"
        >
          Create
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.data-sources-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 16px;
}

.search-section {
  margin-bottom: 30px;
}

.data-sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.data-source-card {
  transition: transform 0.2s;
}

.data-source-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-content .description {
  color: #5f6368;
  margin-bottom: 15px;
  line-height: 1.5;
}

.category {
  margin-bottom: 10px;
}

.tags {
  margin-bottom: 15px;
}

.tags .el-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}

.metadata {
  color: #909399;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
}

.loading, .error, .no-results {
  margin: 40px 0;
}
</style>
