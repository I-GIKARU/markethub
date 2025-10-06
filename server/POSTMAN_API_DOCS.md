# markethub API Documentation

## Base URL
```
http://127.0.0.1:5000
```

## Authentication
Most endpoints require JWT authentication. After login, the access token is automatically stored in cookies.

---

## 📋 Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Profile & Dashboard](#user-profile--dashboard)
3. [Public Project Endpoints](#public-project-endpoints)
4. [Student Project Endpoints](#student-project-endpoints)
5. [Project Interaction Endpoints](#project-interaction-endpoints)
6. [Admin Project Management](#admin-project-management)
7. [User-Project Interactions](#user-project-interactions)
8. [Project Reviews & Hiring](#project-reviews--hiring)
9. [Merchandise Endpoints](#merchandise-endpoints)
10. [Sales & Orders](#sales--orders)
11. [Contributions](#contributions)
12. [AI Agent Endpoints](#ai-agent-endpoints)
13. [M-Pesa Payment](#m-pesa-payment)
14. [Admin Management](#admin-management)
15. [Category Endpoints](#category-endpoints)
16. [Database Migration](#database-migration)

---

## 🔐 Authentication Endpoints

### Register Student
**POST** `/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john.doe@student.moringaschool.com",
  "password": "Password123",
  "role": "student"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful",
  "user": {
    "email": "john.doe@student.moringaschool.com",
    "id": 5,
    "role": "student"
  }
}
```

### Register Client
**POST** `/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "client@company.com",
  "password": "Password123",
  "role": "client"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful",
  "user": {
    "email": "client@company.com",
    "id": 6,
    "role": "client"
  }
}
```

### Register Admin
**POST** `/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@company.com",
  "password": "AdminPass123",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful",
  "user": {
    "email": "admin@company.com",
    "id": 4,
    "role": "admin"
  }
}
```

### Login
**POST** `/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john.doe@student.moringaschool.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "user": {
    "email": "john.doe@student.moringaschool.com",
    "id": 5,
    "role": "student"
  }
}
```

### Google Login (Firebase)
**POST** `/api/auth/google`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "idToken": "firebase_id_token_here"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 5,
    "email": "user@gmail.com",
    "role": "student",
    "auth_provider": "firebase"
  }
}
```

### Get Current User
**GET** `/api/auth/me`

**Authentication:** Required

**Response (200):**
```json
{
  "user": {
    "id": 5,
    "email": "john.doe@student.moringaschool.com",
    "role": "student",
    "auth_provider": "email"
  }
}
```

### Logout
**POST** `/api/auth/logout`

**Authentication:** Required

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 👤 User Profile & Dashboard

### Get User Profile
**GET** `/api/auth/profile`

**Authentication:** Required

**Response (200):**
```json
{
  "user": {
    "id": 5,
    "email": "john.doe@student.moringaschool.com",
    "role": "student",
    "phone": "+254712345678",
    "bio": "Full-stack developer passionate about AI",
    "socials": "github.com/johndoe",
    "past_projects": "E-commerce platform, Mobile app",
    "cv_url": "https://storage.url/cv.pdf",
    "cv_summary": "Experienced developer with 3 years...",
    "cv_uploaded_at": "2025-10-03T07:31:37.774315"
  }
}
```

### Update User Profile
**PUT** `/api/auth/profile`

**Authentication:** Required

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "phone": "+254712345678",
  "bio": "Updated bio description",
  "socials": "github.com/johndoe, linkedin.com/in/johndoe",
  "past_projects": "Updated project list"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 5,
    "email": "john.doe@student.moringaschool.com",
    "phone": "+254712345678",
    "bio": "Updated bio description"
  }
}
```

### Student Dashboard
**GET** `/api/dashboard/student`

**Authentication:** Required (Student role)

**Response (200):**
```json
{
  "user": {
    "id": 5,
    "email": "john.doe@student.moringaschool.com",
    "role": "student"
  },
  "projects": [
    {
      "id": 12,
      "title": "E-Commerce Platform",
      "status": "approved"
    }
  ],
  "client_interests": [
    {
      "id": 1,
      "user_id": 6,
      "project_id": 12,
      "interested_in": "hire",
      "message": "Interested in hiring your team"
    }
  ],
  "project_contributions": [
    {
      "id": 1,
      "amount": 100.0,
      "comment": "Great project!",
      "date": "2025-10-03"
    }
  ]
}
```

### Client Dashboard
**GET** `/api/dashboard/client`

**Authentication:** Required (Client role)

**Response (200):**
```json
{
  "user": {
    "id": 6,
    "email": "client@company.com",
    "role": "client"
  },
  "expressed_interests": [
    {
      "id": 1,
      "project_id": 12,
      "interested_in": "hire",
      "message": "Interested in hiring"
    }
  ],
  "orders": [
    {
      "id": 1,
      "amount": 299.99,
      "status": "completed",
      "date": "2025-10-03"
    }
  ],
  "contributions": [
    {
      "id": 1,
      "amount": 100.0,
      "comment": "Supporting this project"
    }
  ],
  "stats": {
    "totalOrders": 5,
    "completedOrders": 4,
    "pendingOrders": 1,
    "cancelledOrders": 0,
    "totalSpent": 1299.95,
    "totalContributed": 500.0,
    "contributionCount": 3
  }
}
```

### Admin Dashboard
**GET** `/api/dashboard/admin`

**Authentication:** Required (Admin role)

**Response (200):**
```json
{
  "stats": {
    "total_users": 150,
    "total_students": 120,
    "total_clients": 25,
    "total_merchandise": 15,
    "total_projects": 45,
    "approved_projects": 35,
    "pending_projects": 8,
    "total_orders": 200,
    "completed_orders": 180,
    "total_contributions": 50,
    "total_contribution_amount": 5000.0
  },
  "recent_projects": [
    {
      "id": 12,
      "title": "E-Commerce Platform",
      "status": "pending"
    }
  ],
  "recent_contributions": [
    {
      "id": 1,
      "amount": 100.0,
      "comment": "Great work!"
    }
  ]
}
```

---

## 🌐 Public Project Endpoints

### Get All Projects
**GET** `/api/projects`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `status`: Filter by status (pending, approved, rejected) - Admin only
- `category_id`: Filter by category ID
- `featured`: Filter featured projects (true/false)
- `search`: Search in title, description, tech_stack

**Example URLs:**
```
GET /api/projects
GET /api/projects?page=1&per_page=5
GET /api/projects?category_id=1
GET /api/projects?status=approved
GET /api/projects?featured=true
GET /api/projects?search=react
```

**Response (200):**
```json
{
  "projects": [
    {
      "id": 12,
      "category_id": 1,
      "title": "E-Commerce Platform with AI Recommendations",
      "description": "A full-stack e-commerce platform...",
      "tech_stack": "React, Node.js, Express, MongoDB, Python, TensorFlow",
      "github_link": "https://github.com/student/ecommerce-ai-platform",
      "demo_link": "https://ecommerce-ai-demo.herokuapp.com",
      "is_for_sale": true,
      "status": "approved",
      "featured": false,
      "technical_mentor": "Dr. Jane Smith - AI/ML Expert",
      "views": 15,
      "clicks": 5,
      "downloads": 2,
      "rejection_reason": null,
      "created_at": "2025-10-03T07:31:37.774315",
      "project_summary": "AI-powered e-commerce solution...",
      "zip_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
      "pdf_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
      "video_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
      "thumbnail_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
      "category": {
        "description": "Full-stack web applications and websites",
        "name": "Web Development",
        "id": 1
      },
      "external_collaborators": [
        {
          "name": "Alice Johnson",
          "github": "alicej",
          "email": "alice@example.com"
        }
      ],
      "reviews": []
    }
  ],
  "total": 12,
  "pages": 2,
  "current_page": 1,
  "per_page": 10,
  "status_counts": {
    "pending": 3,
    "approved": 8,
    "rejected": 1
  }
}
```

### Get Project Details
**GET** `/api/projects/{id}`

**Example:** `GET /api/projects/12`

**Response (200):**
```json
{
  "project": {
    "id": 12,
    "category_id": 1,
    "title": "E-Commerce Platform with AI Recommendations",
    "description": "A full-stack e-commerce platform...",
    "tech_stack": "React, Node.js, Express, MongoDB, Python, TensorFlow",
    "github_link": "https://github.com/student/ecommerce-ai-platform",
    "demo_link": "https://ecommerce-ai-demo.herokuapp.com",
    "is_for_sale": true,
    "status": "approved",
    "featured": false,
    "technical_mentor": "Dr. Jane Smith - AI/ML Expert",
    "views": 16,
    "rejection_reason": null,
    "created_at": "2025-10-03T07:31:37.774315",
    "project_summary": "AI-powered e-commerce solution...",
    "zip_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "pdf_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "video_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "thumbnail_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "category": {
      "description": "Full-stack web applications and websites",
      "name": "Web Development",
      "id": 1
    },
    "external_collaborators": [
      {
        "name": "Alice Johnson",
        "github": "alicej",
        "email": "alice@example.com"
      }
    ],
    "reviews": []
  }
}
```

**Error Response (403):**
```json
{
  "error": "This project is not approved and you do not have permission to view it"
}
```

**Error Response (404):**
```json
{
  "error": "Project not found"
}
```

### Get Featured Projects
**GET** `/api/projects/featured`

**Query Parameters:**
- `limit`: Number of projects to return (default: 6)

**Response (200):**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "AI-Powered Task Manager",
      "featured": true,
      "status": "approved"
    }
  ],
  "count": 1
}
```

### Get Approved Projects
**GET** `/api/projects/approved`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `search`: Search term
- `category_id`: Filter by category ID

**Response (200):**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "AI-Powered Task Manager",
      "status": "approved"
    }
  ],
  "total": 8,
  "pages": 1,
  "current_page": 1,
  "per_page": 10
}
```

### Get Projects by Category
**GET** `/api/projects/category/{category_id}`

**Example:** `GET /api/projects/category/1`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)

**Response (200):**
```json
{
  "category": {
    "id": 1,
    "name": "Web Development",
    "description": "Full-stack web applications and websites"
  },
  "projects": [
    {
      "id": 12,
      "category_id": 1,
      "title": "E-Commerce Platform with AI Recommendations"
    }
  ],
  "total": 5,
  "pages": 1,
  "current_page": 1,
  "per_page": 10
}
```

---

## 👨‍🎓 Student Project Endpoints

### Get My Projects
**GET** `/api/projects/my`

**Authentication:** Required (Student role)

**Response (200):**
```json
{
  "projects": [
    {
      "id": 12,
      "title": "E-Commerce Platform with AI Recommendations",
      "status": "pending",
      "user_projects": [
        {
          "id": 5,
          "user_id": 5,
          "project_id": 12,
          "interested_in": "contributor",
          "date": "2025-10-03",
          "message": null,
          "user": {
            "id": 5,
            "email": "test.student@student.moringaschool.com",
            "role": "student"
          },
          "contributions": []
        }
      ]
    }
  ],
  "count": 1,
  "status_counts": {
    "pending": 1,
    "approved": 0,
    "rejected": 0
  }
}
```

**Error Response (401):**
```json
{
  "msg": "Missing JWT in cookies or headers"
}
```

### Create Project
**POST** `/api/projects/create`

**Authentication:** Required (Student role)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | text | ✅ | Project title |
| `description` | text | ✅ | Project description |
| `category_id` | text | ✅ | Category ID (1-5) |
| `tech_stack` | text | ❌ | Technologies used |
| `github_link` | text | ❌ | GitHub repository URL |
| `demo_link` | text | ❌ | Live demo URL |
| `is_for_sale` | text | ❌ | "true" or "false" |
| `technical_mentor` | text | ❌ | Mentor information |
| `collaborators` | text | ❌ | JSON string of external collaborators |
| `thumbnail` | file | ❌ | Image file for thumbnail |
| `videos` | file | ❌ | Video files (can select multiple) |
| `pdfs` | file | ❌ | PDF files (can select multiple) |
| `zip_files` | file | ❌ | ZIP files (can select multiple) |

**Example Form Data:**
```
title: E-Commerce Platform with AI Recommendations
description: A full-stack e-commerce platform featuring AI-powered product recommendations, real-time inventory management, secure payment processing, and advanced analytics dashboard. Built with modern technologies and scalable architecture.
category_id: 1
tech_stack: React, Node.js, Express, MongoDB, Python, TensorFlow, Stripe API, Socket.io, Docker, AWS
github_link: https://github.com/student/ecommerce-ai-platform
demo_link: https://ecommerce-ai-demo.herokuapp.com
is_for_sale: true
technical_mentor: Dr. Jane Smith - AI/ML Expert
collaborators: [{"name":"Alice Johnson","github":"alicej","email":"alice@example.com"},{"name":"Bob Chen","github":"bobchen","email":"bob@example.com"}]
thumbnail: [Select file: thumbnail.png]
videos: [Select file: demo_video.mp4]
pdfs: [Select file: documentation.pdf]
zip_files: [Select file: source_code.zip]
```

**Response (201):**
```json
{
  "message": "Project created successfully and submitted for review",
  "project": {
    "id": 12,
    "category_id": 1,
    "title": "E-Commerce Platform with AI Recommendations",
    "description": "A full-stack e-commerce platform...",
    "tech_stack": "React, Node.js, Express, MongoDB, Python, TensorFlow",
    "github_link": "https://github.com/student/ecommerce-ai-platform",
    "demo_link": "https://ecommerce-ai-demo.herokuapp.com",
    "is_for_sale": true,
    "status": "pending",
    "featured": false,
    "technical_mentor": "Dr. Jane Smith - AI/ML Expert",
    "views": 0,
    "rejection_reason": null,
    "created_at": "2025-10-03T07:31:37.774315",
    "project_summary": null,
    "zip_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "pdf_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "video_urls": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "thumbnail_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
    "category": {
      "description": "Full-stack web applications and websites",
      "name": "Web Development",
      "id": 1
    },
    "external_collaborators": [
      {
        "name": "Alice Johnson",
        "github": "alicej",
        "email": "alice@example.com"
      }
    ],
    "reviews": []
  },
  "uploaded_files": {
    "thumbnail": {
      "url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
      "path": "projects/e-commerce-platform-with-ai-recommendations-12/thumbnail_*.png",
      "filename": "thumbnail_3e5b2447-417b-42e8-b0ac-09be9ca9f53c.png",
      "original_filename": "thumbnail.png",
      "file_type": "image",
      "size": 0,
      "bucket": "innovation-marketplace"
    },
    "videos": [
      {
        "url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
        "original_filename": "demo_video.mp4",
        "file_type": "video"
      }
    ],
    "pdfs": [
      {
        "url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
        "original_filename": "documentation.pdf",
        "file_type": "document"
      }
    ],
    "zip_files": [
      {
        "url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/...",
        "original_filename": "source_code.zip",
        "file_type": "document"
      }
    ]
  }
}
```

**Error Responses:**
```json
// Missing required field
{
  "error": "title is required"
}

// Invalid category
{
  "error": "Category not found"
}

// Unauthorized
{
  "error": "Access denied. student role required"
}
```

---

## 🔗 Project Interaction Endpoints

### Record Project Click
**POST** `/api/projects/{id}/click`

**Example:** `POST /api/projects/12/click`

**Response (200):**
```json
{
  "message": "Click recorded"
}
```

**Error Response (404):**
```json
{
  "error": "Project not found"
}
```

### Record Project Download
**POST** `/api/projects/{id}/download`

**Example:** `POST /api/projects/12/download`

**Response (200):**
```json
{
  "message": "Download recorded"
}
```

**Error Response (404):**
```json
{
  "error": "Project not found"
}
```

---

## 🛍️ Merchandise Endpoints

### Get All Merchandise
**GET** `/api/merchandise`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `in_stock`: Filter by stock status ("true"/"false")

**Example URLs:**
```
GET /api/merchandise
GET /api/merchandise?page=1&per_page=5
GET /api/merchandise?in_stock=true
```

**Response (200):**
```json
{
  "merchandise": [
    {
      "id": 6,
      "name": "Test T-Shirt",
      "description": "A comfortable test t-shirt",
      "price": 25.99,
      "quantity": 10,
      "image_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/6/image_*.png",
      "image_urls": null,
      "thumbnail_url": null
    }
  ],
  "pagination": {
    "total": 1,
    "pages": 1,
    "current_page": 1,
    "per_page": 10
  }
}
```

### Get Merchandise Details
**GET** `/api/merchandise/{id}`

**Example:** `GET /api/merchandise/6`

**Response (200):**
```json
{
  "id": 6,
  "name": "Test T-Shirt",
  "description": "A comfortable test t-shirt",
  "price": 25.99,
  "quantity": 10,
  "image_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/6/image_*.png",
  "image_urls": null,
  "thumbnail_url": null
}
```

**Error Response (404):**
```json
{
  "error": "Merchandise not found"
}
```

### Create Merchandise
**POST** `/api/merchandise`

**Authentication:** Required (Admin role)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | text | ✅ | Merchandise name |
| `price` | text | ✅ | Price (decimal) |
| `description` | text | ❌ | Product description |
| `quantity` | text | ❌ | Stock quantity (default: 0) |
| `image_url` | text | ❌ | Direct image URL |
| `image` | file | ❌ | Image file upload |
| `thumbnail` | file | ❌ | Thumbnail file upload |

**Example Form Data:**
```
name: markethub T-Shirt
description: Official markethub branded t-shirt
price: 29.99
quantity: 50
image: [Select file: tshirt_image.png]
```

**Response (201):**
```json
{
  "message": "Merchandise created successfully",
  "merchandise": {
    "id": 7,
    "name": "markethub T-Shirt",
    "description": "Official markethub branded t-shirt",
    "price": 29.99,
    "quantity": 50,
    "image_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/7/image_*.png",
    "image_urls": null,
    "thumbnail_url": null
  },
  "uploaded_files": {
    "image": {
      "url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/7/image_*.png",
      "original_filename": "tshirt_image.png",
      "file_type": "image"
    }
  }
}
```

**Error Responses:**
```json
// Missing required field
{
  "error": "name is required"
}

// Unauthorized
{
  "error": "Access denied. admin role required"
}
```

---

## 📂 Category Endpoints

### Get All Categories
**GET** `/api/categories`

**Response (200):**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Web Development",
      "description": "Full-stack web applications and websites"
    },
    {
      "id": 2,
      "name": "Mobile Apps",
      "description": "iOS and Android mobile applications"
    },
    {
      "id": 3,
      "name": "AI/ML",
      "description": "Artificial Intelligence and Machine Learning projects"
    },
    {
      "id": 4,
      "name": "IoT",
      "description": "Internet of Things and hardware projects"
    },
    {
      "id": 5,
      "name": "Data Science",
      "description": "Data analysis and visualization projects"
    }
  ]
}
```

---

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "msg": "Missing JWT in cookies or headers"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied. admin role required"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

---

## 📝 Postman Setup Instructions

### 1. Import Environment
Create a new environment in Postman with:
```
base_url: http://127.0.0.1:5000
```

### 2. Authentication Flow
1. **Register/Login** using the auth endpoints
2. **Access token** is automatically stored in cookies
3. **Subsequent requests** will use the stored authentication

### 3. File Upload Setup
For endpoints with file uploads:
1. Select **Body** tab
2. Choose **form-data**
3. Add text fields as **Text**
4. Add file fields as **File** and select your files

### 4. Testing Workflow
1. **Start** with authentication (register/login)
2. **Test public endpoints** (no auth needed)
3. **Test authenticated endpoints** (student/admin)
4. **Verify responses** match the documented format

---

## 📋 Notes

### Email Format Requirements
- **Students**: `firstname.lastname@student.moringaschool.com`
- **Clients**: Any valid email format
- **Admins**: Any valid email format

### File Upload Guidelines
- **Supported formats**: Images (PNG, JPG), Videos (MP4), Documents (PDF), Archives (ZIP)
- **Storage**: DigitalOcean Spaces with organized folder structure
- **Access**: Public URLs for direct file access

### Project Status Flow
- **Created**: `pending` (awaiting admin approval)
- **Admin Action**: `approved` or `rejected`
- **Visibility**: Only approved projects visible to public

### Authentication
- **JWT tokens** stored in cookies automatically
- **No manual header management** needed in Postman
- **Login once** per session

---

## 👨🎓 Student Project Endpoints (Extended)

### Update Project
**PUT** `/api/projects/{id}`

**Authentication:** Required (Student owner or Admin)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Updated Project Title",
  "description": "Updated description",
  "tech_stack": "Updated tech stack",
  "github_link": "https://github.com/updated-link",
  "demo_link": "https://updated-demo.com",
  "is_for_sale": true,
  "category_id": 2,
  "technical_mentor": "Updated mentor info"
}
```

**Admin-only fields:**
```json
{
  "status": "approved",
  "featured": true,
  "rejection_reason": "Reason for rejection if status is rejected"
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 12,
    "title": "Updated Project Title",
    "status": "approved"
  }
}
```

### Delete Project
**DELETE** `/api/projects/{id}`

**Authentication:** Required (Student owner or Admin)

**Response (200):**
```json
{
  "message": "Project and associated media deleted successfully",
  "media_deleted": 5
}
```

---

## 🔧 Admin Project Management

### Admin Project Actions
All admin actions use the same endpoints as regular users but with admin privileges.

**Admin can:**
- View all projects regardless of status
- Update project status (`pending`, `approved`, `rejected`)
- Set projects as featured
- Add rejection reasons
- Delete any project

**Example Admin Project Update:**
**PUT** `/api/projects/12`

```json
{
  "status": "approved",
  "featured": true
}
```

**Example Admin Project Rejection:**
**PUT** `/api/projects/12`

```json
{
  "status": "rejected",
  "rejection_reason": "Project does not meet quality standards. Please improve documentation and add proper error handling."
}
```

---

## 👥 User-Project Interactions

### Express Interest in Project
**POST** `/api/user-projects`

**Authentication:** Required (Student or Client)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "project_id": 12,
  "interested_in": "collaboration",
  "message": "I would like to collaborate on this project. I have experience with React and Node.js."
}
```

**Valid `interested_in` values:**
- **Students:** `collaboration`, `contributor`
- **Clients:** `hire`, `purchase`, `inquiry`

**Response (201):**
```json
{
  "message": "User-project interaction created successfully",
  "user_project": {
    "id": 1,
    "user_id": 5,
    "project_id": 12,
    "interested_in": "collaboration",
    "message": "I would like to collaborate on this project...",
    "date": "2025-10-03"
  }
}
```

### Get User-Project Interactions
**GET** `/api/user-projects`

**Authentication:** Required (Student or Admin)

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)

**Response (200):**
```json
{
  "user_projects": [
    {
      "id": 1,
      "user_id": 6,
      "project_id": 12,
      "interested_in": "hire",
      "message": "Interested in hiring your team for a similar project",
      "date": "2025-10-03",
      "user": {
        "id": 6,
        "email": "client@company.com",
        "role": "client"
      },
      "project": {
        "id": 12,
        "title": "E-Commerce Platform"
      }
    }
  ],
  "total": 5,
  "pages": 1,
  "current_page": 1
}
```

### Get User-Project Interaction Details
**GET** `/api/user-projects/{id}`

**Authentication:** Required (Student or Admin)

**Response (200):**
```json
{
  "user_project": {
    "id": 1,
    "user_id": 6,
    "project_id": 12,
    "interested_in": "hire",
    "message": "Interested in hiring your team",
    "date": "2025-10-03",
    "user": {
      "id": 6,
      "email": "client@company.com",
      "role": "client"
    },
    "project": {
      "id": 12,
      "title": "E-Commerce Platform"
    }
  }
}
```

---

## ⭐ Project Reviews & Hiring

### Create Project Review
**POST** `/api/projects/{project_id}/reviews`

**Authentication:** Required

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "rating": 5,
  "comment": "Excellent project! Great implementation and documentation."
}
```

**Response (201):**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": 1,
    "project_id": 12,
    "user_id": 6,
    "rating": 5,
    "comment": "Excellent project! Great implementation and documentation.",
    "date": "2025-10-03",
    "user": {
      "id": 6,
      "email": "client@company.com"
    }
  }
}
```

### Get Project Reviews
**GET** `/api/projects/{id}/reviews`

**Response (200):**
```json
{
  "reviews": [
    {
      "id": 1,
      "project_id": 12,
      "user_id": 6,
      "rating": 5,
      "comment": "Excellent project!",
      "date": "2025-10-03",
      "user": {
        "id": 6,
        "email": "client@company.com"
      }
    }
  ]
}
```

### Send Hire Request
**POST** `/api/projects/{project_id}/hire`

**Authentication:** Required (Client or Admin)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "message": "I'm interested in hiring your team for a similar e-commerce project. We have a budget of $10,000 and need it completed in 3 months."
}
```

**Response (201):**
```json
{
  "message": "Hire request sent successfully! The team will be notified.",
  "hire_request_id": 15
}
```

---

## 🛍️ Merchandise Endpoints (Extended)

### Get All Merchandise
**GET** `/api/merchandise`

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `in_stock`: Filter by stock status ("true"/"false")

**Example URLs:**
```
GET /api/merchandise
GET /api/merchandise?page=1&per_page=5
GET /api/merchandise?in_stock=true
```

**Response (200):**
```json
{
  "merchandise": [
    {
      "id": 6,
      "name": "markethub T-Shirt",
      "description": "Official branded t-shirt",
      "price": 25.99,
      "quantity": 10,
      "image_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/6/image_*.png",
      "image_urls": null,
      "thumbnail_url": null
    }
  ],
  "total": 1,
  "pages": 1,
  "current_page": 1,
  "per_page": 10
}
```

### Get Merchandise Details
**GET** `/api/merchandise/{id}`

**Example:** `GET /api/merchandise/6`

**Response (200):**
```json
{
  "id": 6,
  "name": "markethub T-Shirt",
  "description": "Official branded t-shirt",
  "price": 25.99,
  "quantity": 10,
  "image_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/6/image_*.png",
  "image_urls": null,
  "thumbnail_url": null
}
```

### Create Merchandise
**POST** `/api/merchandise`

**Authentication:** Required (Admin role)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | text | ✅ | Merchandise name |
| `price` | text | ✅ | Price (decimal) |
| `description` | text | ❌ | Product description |
| `quantity` | text | ❌ | Stock quantity (default: 0) |
| `image_url` | text | ❌ | Direct image URL |
| `image` | file | ❌ | Image file upload |
| `thumbnail` | file | ❌ | Thumbnail file upload |

**Response (201):**
```json
{
  "message": "Merchandise created successfully",
  "merchandise": {
    "id": 7,
    "name": "markethub T-Shirt",
    "description": "Official branded t-shirt",
    "price": 29.99,
    "quantity": 50,
    "image_url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/7/image_*.png"
  },
  "uploaded_files": {
    "image": {
      "url": "https://innovation-marketplace.sfo3.digitaloceanspaces.com/merchandise/7/image_*.png",
      "original_filename": "tshirt_image.png",
      "file_type": "image"
    }
  }
}
```

---

## 🛒 Sales & Orders

### Purchase Merchandise
**POST** `/api/buy`

**Authentication:** Required

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "items": [
    {
      "merchandise_id": 6,
      "quantity": 2
    },
    {
      "merchandise_id": 7,
      "quantity": 1
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Order placed successfully! You will receive a confirmation email shortly.",
  "sale_id": 15,
  "amount": 81.97,
  "status": "completed",
  "email_sent": "Confirmation email has been sent to your email address"
}
```

### Get My Orders
**GET** `/api/orders`

**Authentication:** Required

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)

**Response (200):**
```json
{
  "orders": [
    {
      "id": 15,
      "user_id": 5,
      "email": "john.doe@student.moringaschool.com",
      "amount": 81.97,
      "status": "completed",
      "date": "2025-10-03T08:01:06.666Z",
      "items": [
        {
          "id": 25,
          "sales_id": 15,
          "merchandise_id": 6,
          "quantity": 2,
          "price": 25.99,
          "merchandise": {
            "id": 6,
            "name": "markethub T-Shirt"
          }
        }
      ]
    }
  ],
  "total": 5,
  "pages": 1,
  "current_page": 1
}
```

### Get Order Details
**GET** `/api/orders/{id}`

**Authentication:** Required

**Response (200):**
```json
{
  "order": {
    "id": 15,
    "user_id": 5,
    "email": "john.doe@student.moringaschool.com",
    "amount": 81.97,
    "status": "completed",
    "date": "2025-10-03T08:01:06.666Z",
    "items": [
      {
        "id": 25,
        "sales_id": 15,
        "merchandise_id": 6,
        "quantity": 2,
        "price": 25.99,
        "merchandise": {
          "id": 6,
          "name": "markethub T-Shirt",
          "description": "Official branded t-shirt"
        }
      }
    ]
  }
}
```

### Cancel Order
**POST** `/api/orders/{id}/cancel`

**Authentication:** Required

**Response (200):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "id": 15,
    "status": "cancelled"
  }
}
```

### Admin: Get All Sales
**GET** `/api/admin/sales`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20)
- `status`: Filter by status

**Response (200):**
```json
{
  "sales": [
    {
      "id": 15,
      "user_id": 5,
      "email": "john.doe@student.moringaschool.com",
      "amount": 81.97,
      "status": "completed",
      "date": "2025-10-03T08:01:06.666Z"
    }
  ],
  "total": 50,
  "pages": 3,
  "current_page": 1
}
```

### Admin: Update Sale Status
**PUT** `/api/admin/sales/{id}`

**Authentication:** Required (Admin role)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "completed"
}
```

**Valid statuses:** `paid`, `completed`, `cancelled`

**Response (200):**
```json
{
  "message": "Sale status updated to completed",
  "sale": {
    "id": 15,
    "status": "completed"
  }
}
```

### Admin: Cancel Sale
**POST** `/api/admin/sales/{id}/cancel`

**Authentication:** Required (Admin role)

**Response (200):**
```json
{
  "message": "Sale cancelled successfully by admin",
  "sale": {
    "id": 15,
    "status": "cancelled"
  }
}
```

---

## 💰 Contributions

### Create Contribution
**POST** `/api/contributions`

**Authentication:** Required (Student, Client, or Admin)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "project_id": 12,
  "amount": 100.0,
  "comment": "Great project! Keep up the excellent work."
}
```

**Alternative (using existing user-project relationship):**
```json
{
  "users_projects_id": 5,
  "amount": 50.0,
  "comment": "Supporting this innovative solution."
}
```

**Response (201):**
```json
{
  "message": "Contribution created successfully",
  "contribution": {
    "id": 1,
    "users_projects_id": 5,
    "amount": 100.0,
    "comment": "Great project! Keep up the excellent work.",
    "date": "2025-10-03",
    "user_project": {
      "id": 5,
      "user_id": 6,
      "project_id": 12,
      "interested_in": "supporter"
    }
  }
}
```

### Get My Contributions
**GET** `/api/contributions`

**Authentication:** Required

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)

**Response (200):**
```json
{
  "contributions": [
    {
      "id": 1,
      "users_projects_id": 5,
      "amount": 100.0,
      "comment": "Great project!",
      "date": "2025-10-03",
      "user_project": {
        "id": 5,
        "project": {
          "id": 12,
          "title": "E-Commerce Platform"
        }
      }
    }
  ],
  "total": 3,
  "pages": 1,
  "current_page": 1
}
```

### Get Contribution Details
**GET** `/api/contributions/{id}`

**Authentication:** Required

**Response (200):**
```json
{
  "contribution": {
    "id": 1,
    "users_projects_id": 5,
    "amount": 100.0,
    "comment": "Great project!",
    "date": "2025-10-03",
    "user_project": {
      "id": 5,
      "user": {
        "id": 6,
        "email": "client@company.com"
      },
      "project": {
        "id": 12,
        "title": "E-Commerce Platform"
      }
    }
  }
}
```

### Get Project Contributions
**GET** `/api/projects/{id}/contributions`

**Authentication:** Required (Student project owner or Admin)

**Response (200):**
```json
{
  "project": {
    "id": 12,
    "title": "E-Commerce Platform"
  },
  "contributions": [
    {
      "id": 1,
      "amount": 100.0,
      "comment": "Great work!",
      "date": "2025-10-03",
      "user_project": {
        "user": {
          "id": 6,
          "email": "client@company.com"
        }
      }
    }
  ],
  "statistics": {
    "total_amount": 250.0,
    "contribution_count": 3,
    "total_contributions": 3
  }
}
```

### Admin: Update Contribution
**PUT** `/api/contributions/{id}`

**Authentication:** Required (Admin role)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "amount": 150.0,
  "comment": "Updated contribution amount"
}
```

**Response (200):**
```json
{
  "message": "Contribution updated successfully",
  "contribution": {
    "id": 1,
    "amount": 150.0,
    "comment": "Updated contribution amount"
  }
}
```

---

## 🤖 AI Agent Endpoints

### Upload CV
**POST** `/api/ai/cv/upload`

**Authentication:** Required (Student role)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: PDF file (CV/Resume)

**Response (201):**
```json
{
  "message": "CV uploaded successfully",
  "file_id": "cv_12345_abcdef",
  "summary": "Experienced full-stack developer with 3 years of experience in React, Node.js, and Python. Strong background in AI/ML projects and e-commerce platforms.",
  "url": "https://firebasestorage.googleapis.com/v0/b/project/o/cvs%2Fcv_12345_abcdef.pdf"
}
```

### Delete CV
**DELETE** `/api/ai/cv/delete`

**Authentication:** Required (Student role)

**Response (200):**
```json
{
  "message": "CV deleted successfully"
}
```

### Ask Question About CV
**POST** `/api/ai/cv/{user_id}/question`

**Authentication:** Required (Admin role)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "question": "What programming languages does this candidate know?"
}
```

**Response (200):**
```json
{
  "answer": "Based on the CV, the candidate is proficient in JavaScript, Python, Java, and TypeScript. They have extensive experience with React, Node.js, Express, and have worked on machine learning projects using Python libraries like TensorFlow and scikit-learn."
}
```

### Ask Question About Project
**POST** `/api/ai/project/{project_id}/question`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "question": "What technologies were used in this project and how do they work together?"
}
```

**Response (200):**
```json
{
  "answer": "This e-commerce platform uses a modern tech stack with React for the frontend, Node.js and Express for the backend API, MongoDB for data storage, and Python with TensorFlow for the AI recommendation engine. The frontend communicates with the backend through RESTful APIs, while the recommendation system processes user behavior data to provide personalized product suggestions."
}
```

### Get Project AI Summary
**GET** `/api/ai/project/{project_id}/summary`

**Response (200):**
```json
{
  "project_id": 12,
  "title": "E-Commerce Platform with AI Recommendations",
  "summary": "This project is a comprehensive e-commerce solution that combines modern web technologies with artificial intelligence. The platform features a React-based frontend, Node.js backend, and integrates machine learning algorithms for personalized product recommendations. Key features include real-time inventory management, secure payment processing, and advanced analytics dashboard.",
  "has_documentation": true,
  "has_project_pdfs": true
}
```

### Admin: Get All CVs
**GET** `/api/ai/admin/cvs`

**Authentication:** Required (Admin role)

**Response (200):**
```json
{
  "total_cvs": 15,
  "cvs": [
    {
      "user_id": 5,
      "email": "john.doe@student.moringaschool.com",
      "cv_url": "https://firebasestorage.googleapis.com/v0/b/project/o/cvs%2Fcv_12345.pdf",
      "cv_summary": "Experienced full-stack developer...",
      "cv_uploaded_at": "2025-10-03T07:31:37.774315",
      "bio": "Passionate about AI and web development",
      "socials": "github.com/johndoe",
      "phone": "+254712345678"
    }
  ]
}
```

---

## 💳 M-Pesa Payment

### Initiate STK Push
**POST** `/api/mpesa/stk-push`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "phone_number": "254712345678",
  "amount": 100,
  "account_reference": "ORDER-12345",
  "transaction_desc": "Payment for merchandise"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "STK push sent successfully. Please complete payment on your phone.",
  "checkout_request_id": "ws_CO_12345678901234567890",
  "phone_number": "254712345678",
  "amount": 100
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

### Test M-Pesa Configuration
**GET** `/api/mpesa/test-config`

**Response (200):**
```json
{
  "success": true,
  "message": "M-Pesa configuration is valid and credentials work",
  "environment": "sandbox",
  "base_url": "https://sandbox.safaricom.co.ke",
  "business_short_code": "174379",
  "callback_url": "https://your-domain.com/api/mpesa/callback",
  "has_consumer_key": true,
  "has_consumer_secret": true,
  "has_passkey": true
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Missing M-Pesa configuration: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET"
}
```

---

## 🔧 Admin Management

### Get Admin Statistics
**GET** `/api/admin/stats`

**Authentication:** Required (Admin role)

**Response (200):**
```json
{
  "user_stats": {
    "total": 150,
    "students": 120
  },
  "project_stats": {
    "total": 45,
    "approved": 35,
    "pending": 8,
    "featured": 5
  },
  "sales_stats": {
    "total": 200,
    "completed": 180
  },
  "top_projects": [
    {
      "id": 12,
      "title": "E-Commerce Platform",
      "views": 150,
      "status": "approved"
    }
  ]
}
```

### Create Category
**POST** `/api/admin/categories`

**Authentication:** Required (Admin role)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Blockchain",
  "description": "Blockchain and cryptocurrency projects"
}
```

**Response (201):**
```json
{
  "message": "Category created successfully",
  "category": {
    "id": 6,
    "name": "Blockchain",
    "description": "Blockchain and cryptocurrency projects"
  }
}
```

### Update Category
**PUT** `/api/admin/categories/{id}`

**Authentication:** Required (Admin role)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Blockchain & Web3",
  "description": "Blockchain, cryptocurrency, and Web3 projects"
}
```

**Response (200):**
```json
{
  "message": "Category updated successfully",
  "category": {
    "id": 6,
    "name": "Blockchain & Web3",
    "description": "Blockchain, cryptocurrency, and Web3 projects"
  }
}
```

### Delete Category
**DELETE** `/api/admin/categories/{id}`

**Authentication:** Required (Admin role)

**Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

---

## 📂 Category Endpoints

### Get All Categories
**GET** `/api/categories`

**Response (200):**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Web Development",
      "description": "Full-stack web applications and websites"
    },
    {
      "id": 2,
      "name": "Mobile Apps",
      "description": "iOS and Android mobile applications"
    },
    {
      "id": 3,
      "name": "AI/ML",
      "description": "Artificial Intelligence and Machine Learning projects"
    },
    {
      "id": 4,
      "name": "IoT",
      "description": "Internet of Things and hardware projects"
    },
    {
      "id": 5,
      "name": "Data Science",
      "description": "Data analysis and visualization projects"
    }
  ]
}
```

---

## 🗄️ Database Migration

### Run Migrations
**POST** `/api/migrate`

**Response (200):**
```json
{
  "success": true,
  "message": "Database migrations completed successfully"
}
```

### Check Migration Status
**GET** `/api/migrate`

**Response (200):**
```json
{
  "success": true,
  "message": "Migration endpoint is available",
  "database_url": "sqlite:///instance/moringa_marketplace.db",
  "environment": "development"
}
```

---

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "msg": "Missing JWT in cookies or headers"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied. admin role required"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

---

## 📝 Postman Setup Instructions

### 1. Import Environment
Create a new environment in Postman with:
```
base_url: http://127.0.0.1:5000
```

### 2. Authentication Flow
1. **Register/Login** using the auth endpoints
2. **Access token** is automatically stored in cookies
3. **Subsequent requests** will use the stored authentication

### 3. File Upload Setup
For endpoints with file uploads:
1. Select **Body** tab
2. Choose **form-data**
3. Add text fields as **Text**
4. Add file fields as **File** and select your files

### 4. Testing Workflow
1. **Start** with authentication (register/login)
2. **Test public endpoints** (no auth needed)
3. **Test authenticated endpoints** (student/admin/client)
4. **Verify responses** match the documented format

---

## 📋 Notes

### Email Format Requirements
- **Students**: `firstname.lastname@student.moringaschool.com`
- **Clients**: Any valid email format
- **Admins**: Any valid email format

### File Upload Guidelines
- **Supported formats**: Images (PNG, JPG), Videos (MP4), Documents (PDF), Archives (ZIP)
- **Storage**: DigitalOcean Spaces with organized folder structure
- **Access**: Public URLs for direct file access

### Project Status Flow
- **Created**: `pending` (awaiting admin approval)
- **Admin Action**: `approved` or `rejected`
- **Visibility**: Only approved projects visible to public

### Authentication
- **JWT tokens** stored in cookies automatically
- **No manual header management** needed in Postman
- **Login once** per session

### Role-Based Access
- **Students**: Can create/manage projects, collaborate, contribute
- **Clients**: Can hire teams, purchase merchandise, contribute to projects
- **Admins**: Full access to all endpoints and management functions

### AI Features
- **CV Analysis**: Upload and analyze student CVs with AI
- **Project Q&A**: Ask questions about project documentation
- **Smart Summaries**: Auto-generated project summaries

### Payment Integration
- **M-Pesa**: Mobile money integration for Kenyan users
- **Order Management**: Complete order lifecycle management
- **Email Notifications**: Automatic order confirmations

### Contribution System
- **Project Support**: Users can financially support projects
- **Flexible Contributions**: Support via direct project or user-project relationships
- **Tracking**: Complete contribution history and statistics
