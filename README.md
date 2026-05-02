# Online Food Ordering System

A full-stack food ordering application built with **Spring Boot** and **React**.

## Features

- **User Authentication**: Secure Login and Registration.
- **Dynamic Menu**: Browse food items by categories.
- **Cart System**: Real-time cart management.
- **Order Management**: Place orders and view history.
- **Admin Dashboard**: Manage food items and categories.

## Tech Stack

### Backend
- **Framework**: Spring Boot (Java 21)
- **Database**: MySQL
- **Security**: Spring Security with JWT
- **Data Access**: Spring Data JPA

### Frontend
- **Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Update `src/main/resources/application.properties` with your MySQL credentials.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

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

---
Developed as part of the IJSE Comprehensive Master Java Developer Coursework.
