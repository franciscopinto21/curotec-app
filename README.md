# Task Management System — Laravel + Vue

A full-stack task management application built with:

-   **Laravel 10**
-   **Vue 3** (Composition API)
-   **Inertia.js**
-   **Pinia**
-   **PostgreSQL 15**
-   **Pest** for testing

This project was developed as part of a technical assessment to demonstrate clean architecture, full-stack proficiency, and modern Laravel + Vue best practices.

## Features

-   Task creation, listing, updating, and deletion (CRUD)
-   Inertia-based navigation (no page reloads)
-   Pinia store for state management
-   Validations on both frontend and backend
-   Responsive UI using Vite and Vue 3
-   Organized commits and professional code structure

## Tech Stack

| Layer      | Technology         |
| ---------- | ------------------ |
| Backend    | Laravel 10         |
| Frontend   | Vue 3 + Inertia.js |
| State      | Pinia              |
| Database   | PostgreSQL 15      |
| Testing    | Pest               |
| Build Tool | Vite               |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/curotec-assessment.git
cd curotec-assessment

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Setup environment
cp .env.example .env
# configure DB credentials...

# Run migrations
php artisan migrate

# Start dev servers
php artisan serve
npm run dev
```
