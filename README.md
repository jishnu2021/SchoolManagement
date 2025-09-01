# 🏫 School Management Portal

A comprehensive full-stack web application for managing educational institutions with modern technologies. Built with **Vite + React + TypeScript** (frontend) and **Node.js + Express.js + MySQL** (backend), featuring advanced image management via **Cloudinary** and AI-powered content generation using **Google Gemini LLM**.

## 📸 Screenshots

![WebApp](https://res.cloudinary.com/dye6ufc6g/image/upload/v1756679087/Screenshot_2025-09-01_035413_wwb4nh.png)


## ✨ Features

### 🏫 **School Management**
- **Complete CRUD Operations** - Create, read, update, and delete school records
- **Comprehensive School Profiles** - Name, address, contact details, email, and images
- **Real-time Data Management** - Instant updates across the application

### 🖼 **Advanced Image Management**
- **Cloudinary Integration** - Secure cloud-based image storage and delivery
- **Image Optimization** - Automatic resizing, format conversion, and quality optimization
- **Dynamic Image URLs** - On-demand image transformations via API endpoints

### 🤖 **AI-Powered Content Generation**
- **Google Gemini LLM Integration** - Generates professional school descriptions
- **Intelligent Content Creation** - AI-enhanced school profiles and summaries
- **Automated Description Refinement** - Professional, engaging content generation

### 🔍 **Search & Discovery**
- **Advanced Search Functionality** - Search by school name, city, or state
- **Real-time Filtering** - Instant search results as you type
- **Responsive Grid Layout** - Optimized display for all devices

### 🎨 **Modern UI/UX**
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive Components** - Modern cards, modals, and form elements
- **Smooth Animations** - Enhanced user experience with Lucide React icons

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI Library |
| **TypeScript** | 5.x | Type Safety |
| **Vite** | 4.x | Build Tool & Dev Server |
| **Tailwind CSS** | 3.x | Styling Framework |
| **React Hook Form** | 7.x | Form Management |
| **React Router DOM** | 6.x | Client-side Routing |
| **Lucide React** | Latest | Icon Library |
| **Shadcn/ui** | Latest | UI Components |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | Runtime Environment |
| **Express.js** | 4.x | Web Framework |
| **MySQL** | 8.x | Database |
| **Multer** | 1.x | File Upload Handling |
| **Cloudinary** | 1.x | Image Storage & Processing |
| **Google Gemini** | Latest | AI Content Generation |
| **CORS** | 2.x | Cross-Origin Resource Sharing |

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL** (v8 or higher)
- **Cloudinary Account**
- **Google AI Studio API Key** (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jishnu2021/SchoolManagement.git
   cd SchoolManagement
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd Serverside
   npm install
   
   # Install frontend dependencies
   cd ../uni-finder-studio
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=school_management
   PORT=5000
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Google AI Configuration
   GOOGLE_AI_API_KEY=your_gemini_api_key
   ```
   
   Create `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Database Setup**
   ```sql
   CREATE DATABASE school_management;
   USE school_management;
   
   CREATE TABLE schools (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     address TEXT NOT NULL,
     city VARCHAR(100) NOT NULL,
     state VARCHAR(100) NOT NULL,
     contact VARCHAR(15) NOT NULL,
     email_id VARCHAR(255) NOT NULL,
     image VARCHAR(255),
     description TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

5. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # Start frontend development server (in a new terminal)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
SchoolManagement/
├── uni-finder-studio/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── ui/           # Shadcn/ui components
│   │   ├── pages/            # Application pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   └── types/            # TypeScript type definitions
│   ├── public/               # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── Serverside/                   # Node.js + Express backend
│   ├── controllers/          # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── config/               # Configuration files
│   ├── uploads/              # File upload directory
│   ├── package.json
│   └── server.js
│
└── README.md
```

## 🔗 API Endpoints

### School Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schools/getschools` | Retrieve all schools |
| `GET` | `/api/schools/:id` | Get school by ID |
| `POST` | `/api/schools/addschool` | Create new school |
| `PUT` | `/api/schools/:id` | Update school |
| `DELETE` | `/api/schools/:id` | Delete school |

### Image Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/images/:publicId/url` | Get optimized image URL |

### AI Content Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/generate-description` | Generate school description |

## 🎯 Usage Examples

### Adding a New School
```javascript
const schoolData = {
  name: "Springfield Elementary",
  address: "742 Evergreen Terrace",
  city: "Springfield",
  state: "Illinois",
  contact: "5551234567",
  email_id: "info@springfield-elementary.edu"
};

// With image upload
const formData = new FormData();
Object.keys(schoolData).forEach(key => {
  formData.append(key, schoolData[key]);
});
formData.append('image', imageFile);

fetch('/api/schools/addschool', {
  method: 'POST',
  body: formData
});
```

### Fetching Optimized Images
```javascript
// Get image with specific dimensions and optimization
const imageUrl = `${API_BASE_URL}/images/${publicId}/url?width=400&height=250&crop=fill&quality=auto&format=webp`;
```

## 🧪 Testing

```bash
# Run frontend tests
cd uni-finder-studio
npm run test

# Run backend tests
cd Serverside
npm run test
```

## 📦 Deployment

### Frontend (Render)
1. Connect your GitHub repository to Render
2. Select Static website
3. Set environment variables in Render dashboard
4. Deploy automatically on push to main branch

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Configure build and start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Database (PlanetScale/Railway)
1. Create a MySQL database instance
2. Update connection string in environment variables
3. Run database migrations

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed


## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) for the amazing framework
- [Cloudinary](https://cloudinary.com/) for image management solutions
- [Google AI](https://ai.google.dev/) for Gemini LLM integration
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📧 Contact

**Your Name** - [jishnughosh2023@gmail.com](mailto:jishnughosh2023@gmail.com)

**Project Link** - [https://github.com/jishnu2021/SchoolManagement.git](https://github.com/jishnu2021/SchoolManagement.git)
