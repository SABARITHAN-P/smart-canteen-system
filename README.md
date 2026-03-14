# 🍽️ Smart Canteen Management System

A **full-stack web application** designed to modernize campus canteen operations by enabling digital food ordering and efficient shop management.
The system allows users to browse canteen shops, view menus, place orders, and track order status in real time.

The platform includes **role-based dashboards** for Users, Shop Admins, and the Main Admin to manage different aspects of the system.

---

# ⭐ Key Highlights

- Full-stack application with React frontend and Java Servlets backend
- Role-based dashboards (User, Shop Admin, Main Admin)
- REST API based communication between frontend and backend
- Structured relational database with foreign key relationships
- Modular backend architecture using DAO and model layers

--- 

# 🚀 Features

## 👤 User

* Browse available canteen shops
* View menu items and prices
* Place food orders
* Track order status
* View order history
* Update profile and password
* Report issues or feedback

## 🏪 Shop Admin

* Manage shop menu (add, update, delete items)
* View and manage incoming orders
* Toggle shop availability (Open / Closed)
* View dashboard statistics
* Manage shop profile

## 🛠️ Main Admin

* Manage all shops
* Manage shop admins
* Manage system users
* View all orders
* Monitor system reports

---

# 🏗️ System Architecture

Frontend and backend are separated to maintain a **scalable full-stack architecture**.

```
React Frontend
      │
      │ REST API
      ▼
Java Servlets Backend
      │
      │ JDBC
      ▼
MySQL Database
```

---

# 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Framer Motion
* React Icons

### Backend

* Java Servlets
* REST APIs
* JDBC

### Database

* MySQL

### Tools

* Postman (API testing)
* Git & GitHub (version control)

---

# 🗄️ Database Design

The system uses a **relational database design** with the following core tables:

* `users`
* `shops`
* `menu`
* `orders`
* `order_items`
* `payments`
* `reports`
* `password_resets`

Relationships are maintained using **foreign keys and constraints** to ensure data integrity.

---

# 📂 Project Structure

```
smart-canteen-system
│
├── frontend/
│   └── smartcanteen-ui/       # React application
│
├── backend/
│   └── smartcanteen/          # Java Servlets + REST APIs
│
├── database/
│   └── schema.sql             # MySQL schema
│
├── screenshots/               # UI screenshots
│
└── README.md
```
---

# ⚙️ Setup Instructions

## 1️⃣ Clone the Repository

```
git clone https://github.com/YOUR_USERNAME/smart-canteen-system.git
```

---

## 2️⃣ Setup Database

Create a MySQL database and import the schema.

```
source database/schema.sql;
```

---

## 3️⃣ Run Backend

Deploy the Java backend on a servlet container such as **Apache Tomcat**.

---

## 4️⃣ Run Frontend

Navigate to the frontend folder and install dependencies:

```
npm install
npm start
```

The React application will start on:

```
http://localhost:3000
```

---

# 📸 Screenshots

Add application screenshots here to demonstrate the UI.

Example:

* User Dashboard
* Shop Admin Dashboard
* Main Admin Dashboard
* Menu Management
* Order Tracking

---

# 🎯 Project Goals

* Simplify campus food ordering
* Reduce waiting time in canteens
* Improve shop management efficiency
* Provide a structured admin control system

---
# 👨‍💻 Author

**Sabarithan P**

Computer Science Engineering Undergraduate  
Full Stack Development Enthusiast
