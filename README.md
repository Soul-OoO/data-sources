# 数据源搜索引擎 (Data Source Search Engine)

一个为聚合多信息平台设计的数据源搜索引擎 / A data source search engine for aggregated multi-information platforms.

## 功能特点 (Features)

- **多语言支持** / Multi-language support (中文/English)
- **智能搜索** / Intelligent search functionality
- **分类筛选** / Category filtering
- **标签系统** / Tag-based filtering
- **响应式界面** / Responsive web interface
- **RESTful API** / REST API endpoints

## 快速开始 (Quick Start)

### 安装依赖 (Installation)

```bash
pip install -r requirements.txt
```

### 运行应用 (Run Application)

```bash
python app.py
```

访问 http://localhost:5000 开始使用 / Visit http://localhost:5000 to start using

## API 接口 (API Endpoints)

### 搜索数据源 (Search Data Sources)
```
GET /api/search?q={query}&category={category}&tags={tag1,tag2}
```

### 获取分类列表 (Get Categories)
```
GET /api/categories
```

### 获取标签列表 (Get Tags)
```
GET /api/tags
```

### 获取统计信息 (Get Statistics)
```
GET /api/stats
```

## 数据源格式 (Data Source Format)

数据源定义在 `data_sources.json` 文件中，格式如下 / Data sources are defined in `data_sources.json`:

```json
{
  "id": "unique-id",
  "name": "数据源名称",
  "description": "详细描述",
  "url": "https://example.com",
  "category": "分类",
  "tags": ["标签1", "标签2"],
  "keywords": ["关键词1", "关键词2"],
  "language": "zh-CN",
  "access_type": "访问方式",
  "data_format": ["JSON", "CSV"],
  "last_updated": "2024-01-01"
}
```

## 支持的数据源类型 (Supported Data Source Types)

- 政府数据 / Government Data
- 机器学习 / Machine Learning
- 经济金融 / Economic & Financial
- 开发者工具 / Developer Tools
- 气象环境 / Weather & Environment
- 社交媒体 / Social Media
- 学术研究 / Academic Research
- 电子商务 / E-commerce
- 新闻媒体 / News & Media

## 技术栈 (Technology Stack)

- **后端 Backend**: Python Flask
- **前端 Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **数据存储 Data**: JSON files
- **样式框架 CSS**: Custom responsive design

## 项目结构 (Project Structure)

```
data-sources/
├── app.py                 # Flask 应用主文件
├── data_sources.json      # 数据源配置文件
├── requirements.txt       # Python 依赖
├── templates/
│   └── index.html        # 主页模板
├── static/
│   ├── css/
│   │   └── style.css     # 样式文件
│   └── js/
│       └── app.js        # 前端 JavaScript
└── README.md             # 项目文档
```

## 开发说明 (Development)

### 添加新数据源 (Adding New Data Sources)

编辑 `data_sources.json` 文件，添加新的数据源对象 / Edit `data_sources.json` to add new data source objects.

### 自定义样式 (Custom Styling)

修改 `static/css/style.css` 来自定义界面样式 / Modify `static/css/style.css` to customize the interface.

### 扩展功能 (Extending Features)

- 在 `app.py` 中添加新的 API 端点 / Add new API endpoints in `app.py`
- 在 `static/js/app.js` 中扩展前端功能 / Extend frontend functionality in `static/js/app.js`

## 许可证 (License)

MIT License

## 贡献 (Contributing)

欢迎提交 Pull Request 和 Issue / Pull requests and issues are welcome!
