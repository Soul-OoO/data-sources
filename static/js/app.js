// Data Source Search Engine JavaScript

class DataSourceSearch {
    constructor() {
        this.currentResults = [];
        this.allTags = [];
        this.allCategories = [];
        this.selectedTags = new Set();
        
        this.initializeElements();
        this.loadInitialData();
        this.bindEvents();
    }
    
    initializeElements() {
        this.searchInput = document.getElementById('searchQuery');
        this.categorySelect = document.getElementById('categoryFilter');
        this.searchBtn = document.getElementById('searchBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.totalSourcesSpan = document.getElementById('totalSources');
        this.searchResultsSpan = document.getElementById('searchResults');
        this.tagsContainer = document.getElementById('tagsList');
    }
    
    async loadInitialData() {
        try {
            // Load stats
            const statsResponse = await fetch('/api/stats');
            const stats = await statsResponse.json();
            this.totalSourcesSpan.textContent = stats.total_sources;
            
            // Load categories
            const categoriesResponse = await fetch('/api/categories');
            const categoriesData = await categoriesResponse.json();
            this.allCategories = categoriesData.categories;
            this.populateCategories();
            
            // Load tags
            const tagsResponse = await fetch('/api/tags');
            const tagsData = await tagsResponse.json();
            this.allTags = tagsData.tags;
            this.populateTags();
            
            // Initial search (show all)
            this.performSearch();
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Failed to load initial data');
        }
    }
    
    populateCategories() {
        // Clear existing options except the first one
        while (this.categorySelect.children.length > 1) {
            this.categorySelect.removeChild(this.categorySelect.lastChild);
        }
        
        this.allCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.categorySelect.appendChild(option);
        });
    }
    
    populateTags() {
        this.tagsContainer.innerHTML = '';
        
        this.allTags.forEach(tag => {
            const tagItem = document.createElement('div');
            tagItem.className = 'tag-item';
            tagItem.innerHTML = `
                <input type="checkbox" id="tag-${tag}" value="${tag}">
                <label for="tag-${tag}">${tag}</label>
            `;
            
            const checkbox = tagItem.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedTags.add(tag);
                    tagItem.classList.add('active');
                } else {
                    this.selectedTags.delete(tag);
                    tagItem.classList.remove('active');
                }
                this.performSearch();
            });
            
            this.tagsContainer.appendChild(tagItem);
        });
    }
    
    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.clearBtn.addEventListener('click', () => this.clearSearch());
        
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        this.categorySelect.addEventListener('change', () => this.performSearch());
    }
    
    async performSearch() {
        const query = this.searchInput.value.trim();
        const category = this.categorySelect.value;
        const tags = Array.from(this.selectedTags);
        
        try {
            this.showLoading();
            
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (category) params.append('category', category);
            tags.forEach(tag => params.append('tags', tag));
            
            const response = await fetch(`/api/search?${params}`);
            const data = await response.json();
            
            this.currentResults = data.results;
            this.searchResultsSpan.textContent = data.total;
            this.displayResults(data.results);
            
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        }
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.categorySelect.value = '';
        this.selectedTags.clear();
        
        // Clear tag selections
        document.querySelectorAll('.tag-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove('active');
        });
        
        this.performSearch();
    }
    
    showLoading() {
        this.resultsContainer.innerHTML = '<div class="loading">正在搜索... (Searching...)</div>';
    }
    
    showError(message) {
        this.resultsContainer.innerHTML = `<div class="no-results">错误: ${message}</div>`;
    }
    
    displayResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<div class="no-results">未找到匹配的数据源 (No matching data sources found)</div>';
            return;
        }
        
        const resultsHTML = results.map(source => this.createSourceHTML(source)).join('');
        this.resultsContainer.innerHTML = resultsHTML;
    }
    
    createSourceHTML(source) {
        const accessTypeClass = this.getAccessTypeClass(source.access_type);
        const tags = source.tags || [];
        const formats = source.data_format || [];
        
        return `
            <div class="data-source-item">
                <div class="source-header">
                    <div>
                        <div class="source-title">${this.escapeHtml(source.name)}</div>
                        <a href="${source.url}" target="_blank" class="source-url">${source.url}</a>
                    </div>
                </div>
                
                <div class="source-description">
                    ${this.escapeHtml(source.description)}
                </div>
                
                <div class="source-meta">
                    <div class="meta-item">
                        <span class="category-badge">${this.escapeHtml(source.category)}</span>
                    </div>
                    
                    <div class="meta-item">
                        <strong>访问方式:</strong>
                        <span class="access-type ${accessTypeClass}">${this.escapeHtml(source.access_type)}</span>
                    </div>
                    
                    <div class="meta-item">
                        <strong>数据格式:</strong>
                        ${formats.map(format => `<span class="tag-badge">${format}</span>`).join(' ')}
                    </div>
                    
                    <div class="meta-item">
                        <strong>语言:</strong>
                        ${this.escapeHtml(source.language)}
                    </div>
                    
                    <div class="meta-item">
                        <strong>更新时间:</strong>
                        ${source.last_updated}
                    </div>
                </div>
                
                ${tags.length > 0 ? `
                    <div class="source-meta" style="margin-top: 10px;">
                        <div class="meta-item">
                            <strong>标签:</strong>
                            ${tags.map(tag => `<span class="tag-badge">${this.escapeHtml(tag)}</span>`).join(' ')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    getAccessTypeClass(accessType) {
        if (!accessType) return '';
        
        const type = accessType.toLowerCase();
        if (type.includes('公开') || type.includes('free') || type.includes('public')) {
            return 'public';
        } else if (type.includes('api') || type.includes('密钥') || type.includes('注册')) {
            return 'api';
        } else if (type.includes('付费') || type.includes('paid')) {
            return 'paid';
        }
        return '';
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DataSourceSearch();
});