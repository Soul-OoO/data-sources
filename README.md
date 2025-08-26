# Data Sources Portal

A modern web application for discovering and managing data sources, built with **FastAPI** and **Vue3**.

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - Lightning-fast ASGI server

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation frontend tooling
- **Element Plus** - Vue 3 component library
- **Pinia** - State management for Vue
- **Axios** - HTTP client

## ✨ Features

- 🔍 **Full-text search** across data source names, descriptions, and tags
- 🏷️ **Category filtering** with dropdown selection
- ➕ **Add new data sources** with form validation
- 🗑️ **Delete data sources** with confirmation
- 🏷️ **Tag support** for better organization
- 📱 **Responsive design** for desktop and mobile
- 🎨 **Modern UI** with gradient design and animations
- ⚡ **Fast API** with automatic documentation
- 🐳 **Docker support** for easy deployment

## 📁 Project Structure

```
data-sources/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── crud/           # Database operations
│   │   ├── models/         # SQLAlchemy models
│   │   └── schemas/        # Pydantic schemas
│   ├── init_db.py          # Database initialization
│   ├── seed_db.py          # Sample data seeding
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker config
├── frontend/               # Vue3 frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── services/       # API services
│   │   ├── stores/         # Pinia stores
│   │   └── views/          # Page views
│   ├── package.json        # Node dependencies
│   └── Dockerfile          # Frontend Docker config
├── docker-compose.yml      # Docker Compose config
├── setup.sh               # Setup script
└── run-dev.sh             # Development runner
```

## 🛠️ Quick Start

### Option 1: Development Mode

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-sources
   ```

2. **Run setup script**
   ```bash
   ./setup.sh
   ```

3. **Start development servers**
   ```bash
   ./run-dev.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-sources
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📖 Manual Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database**
   ```bash
   python init_db.py
   python seed_db.py
   ```

5. **Start the server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔌 API Endpoints

### Data Sources
- `GET /api/v1/data-sources/` - List all data sources
- `GET /api/v1/data-sources/search?q={query}&category={category}` - Search data sources
- `GET /api/v1/data-sources/{id}` - Get specific data source
- `POST /api/v1/data-sources/` - Create new data source
- `PUT /api/v1/data-sources/{id}` - Update data source
- `DELETE /api/v1/data-sources/{id}` - Delete data source

### System
- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

## 📊 Database Schema

### DataSource Table
- `id` - Primary key
- `name` - Data source name (required)
- `description` - Description text
- `url` - Data source URL
- `category` - Category classification
- `tags` - JSON array of tags
- `is_active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🎨 UI Components

The frontend uses Element Plus components for a consistent, professional look:
- **Search bar** with real-time filtering
- **Category dropdown** for filtering
- **Data source cards** with hover effects
- **Modal dialogs** for creating new sources
- **Responsive grid** layout
- **Loading states** and error handling

## 🐳 Docker Configuration

### Backend Dockerfile
- Python 3.12 slim base image
- Automatic dependency installation
- Database initialization
- Production-ready ASGI server

### Frontend Dockerfile
- Multi-stage build for optimization
- Node.js for building
- Nginx for serving static files
- Gzip compression enabled

## 🔧 Development

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=sqlite:///./data_sources.db
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run type-check` - TypeScript checking
- `npm run lint` - ESLint checking

## 🚀 Deployment

### Production Environment
1. Set environment variables
2. Build frontend: `npm run build`
3. Start backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Serve frontend with nginx or similar

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Data source validation and health checks
- [ ] Advanced search with filters
- [ ] Data source ratings and reviews
- [ ] Export functionality
- [ ] API rate limiting
- [ ] Caching layer
- [ ] Monitoring and analytics
