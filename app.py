#!/usr/bin/env python3
"""
Data Source Search Engine
A simple search engine for aggregated multi-information platform data sources.
"""

import json
import os
from typing import List, Dict, Any
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
DATA_SOURCES_FILE = 'data_sources.json'

class DataSourceManager:
    def __init__(self, data_file: str):
        self.data_file = data_file
        self.data_sources = self._load_data_sources()
    
    def _load_data_sources(self) -> List[Dict[str, Any]]:
        """Load data sources from JSON file."""
        if not os.path.exists(self.data_file):
            return []
        
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    
    def search(self, query: str = '', category: str = '', tags: List[str] = None) -> List[Dict[str, Any]]:
        """Search data sources based on query, category, and tags."""
        if not query and not category and not tags:
            return self.data_sources
        
        results = []
        query_lower = query.lower() if query else ''
        tags = tags or []
        
        for source in self.data_sources:
            # Check if source matches the search criteria
            matches = True
            
            # Text search in name, description, and keywords
            if query:
                text_fields = [
                    source.get('name', '').lower(),
                    source.get('description', '').lower(),
                    ' '.join(source.get('keywords', [])).lower()
                ]
                if not any(query_lower in field for field in text_fields):
                    matches = False
            
            # Category filter
            if category and source.get('category', '').lower() != category.lower():
                matches = False
            
            # Tags filter
            if tags:
                source_tags = [tag.lower() for tag in source.get('tags', [])]
                if not any(tag.lower() in source_tags for tag in tags):
                    matches = False
            
            if matches:
                results.append(source)
        
        return results
    
    def get_categories(self) -> List[str]:
        """Get all available categories."""
        categories = set()
        for source in self.data_sources:
            if source.get('category'):
                categories.add(source['category'])
        return sorted(list(categories))
    
    def get_all_tags(self) -> List[str]:
        """Get all available tags."""
        tags = set()
        for source in self.data_sources:
            for tag in source.get('tags', []):
                tags.add(tag)
        return sorted(list(tags))

# Initialize data source manager
ds_manager = DataSourceManager(DATA_SOURCES_FILE)

@app.route('/')
def index():
    """Serve the main search interface."""
    return render_template('index.html')

@app.route('/api/search')
def api_search():
    """API endpoint for searching data sources."""
    query = request.args.get('q', '')
    category = request.args.get('category', '')
    tags = request.args.getlist('tags')
    
    results = ds_manager.search(query=query, category=category, tags=tags)
    
    return jsonify({
        'query': query,
        'category': category,
        'tags': tags,
        'results': results,
        'total': len(results)
    })

@app.route('/api/categories')
def api_categories():
    """API endpoint to get all categories."""
    return jsonify({
        'categories': ds_manager.get_categories()
    })

@app.route('/api/tags')
def api_tags():
    """API endpoint to get all tags."""
    return jsonify({
        'tags': ds_manager.get_all_tags()
    })

@app.route('/api/stats')
def api_stats():
    """API endpoint to get statistics."""
    return jsonify({
        'total_sources': len(ds_manager.data_sources),
        'categories': len(ds_manager.get_categories()),
        'tags': len(ds_manager.get_all_tags())
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)