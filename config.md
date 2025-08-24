# Data Source Search Engine Configuration

## Environment Variables
# You can set these environment variables to customize the application

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Data Configuration
DATA_SOURCES_FILE=data_sources.json

## Application Settings
# Default search parameters
DEFAULT_SEARCH_LIMIT=100
ENABLE_CORS=True

## Customization
# UI Language (zh-CN, en-US, auto)
DEFAULT_LANGUAGE=auto

# Feature flags
ENABLE_ANALYTICS=False
ENABLE_CACHING=False