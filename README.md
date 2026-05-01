# Online Food Ordering System

A premium, full-stack online food ordering application built with **Spring Boot** (Java 21) and **React** (TypeScript). This system features a modern, responsive UI, secure JWT authentication, and a complete order management workflow.

## 🚀 Features

- **User Authentication**: Secure Login and Registration with JWT.
- **Dynamic Menu**: Browse food items by categories.
- **Advanced Cart System**: Real-time cart management with backend synchronization.
- **Order Management**: 
    - Place orders from cart.
    - View order history.
    - Track order status.
- **Admin Dashboard**: 
    - Manage Food items (CRUD).
    - Manage Categories.
    - Monitor Orders (Optional/Future).
- **Responsive Design**: Premium UI/UX with smooth animations using Framer Motion.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 4.0 (Java 21)
- **Database**: MySQL (configured for localhost)
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Data Access**: Spring Data JPA
- **Utilities**: Lombok, Slf4j (Logging)

### Frontend
- **Library**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom design system)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API Client**: Axios

## 📦 Project Structure

```text
IJSE/
├── backend/          # Spring Boot application
│   ├── src/          # Source code
│   └── pom.xml       # Maven dependencies
├── frontend/         # React Vite application
│   ├── src/          # Components, Pages, Context, etc.
│   └── package.json  # NPM dependencies
└── README.md         # Project documentation
```

## ⚙️ Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Ensure you have a MySQL server running.
3. Update `src/main/resources/application.properties` with your MySQL credentials.
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🧪 API Testing
A Postman collection is included in the root directory: `FoodOrderingSystem.postman_collection.json`. Import it into Postman to test all available endpoints.

---
Developed as part of the IJSE Comprehensive Master Java Developer Coursework.
