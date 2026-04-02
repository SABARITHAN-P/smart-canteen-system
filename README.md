# 🍽️ Smart Canteen Management System

A **full-stack web application** designed to modernize campus canteen operations by enabling digital food ordering and efficient shop management.

The platform allows students to browse canteen shops, explore menus, place food orders, and track order status in real time.
It also provides **dedicated management dashboards** for shop administrators and system administrators to manage menus, orders, and platform operations.

The system follows a **role-based architecture** with three primary roles:

* **Users (Students / Customers)** – place and manage food orders
* **Shop Admins** – manage shop menus and process orders
* **System Admin** – manage shops, users, and overall system operations

---

# ⭐ Key Highlights

* Full-stack web application using **React + Java Servlets**
* Role-based dashboards for **Users, Shop Admins, and System Admin**
* Secure authentication with **email-based password recovery (OTP)**
* REST API communication between frontend and backend
* Modular backend architecture using **DAO, Models, and Controllers**
* Structured relational database with **foreign key constraints**
* Issue reporting system for food or platform related problems

---

# 🚀 Features

## 👤 User (Students / Customers)

Users interact with the system to browse shops and place food orders.

### Account Management

* Register and login securely
* Reset password using OTP sent via email
* Update personal profile information
* Change account password
* Secure logout

### Shop & Menu Interaction

* Browse available canteen shops
* View shop menus and food items
* View item details and pricing

### Cart & Ordering

* Add items to cart
* Modify cart item quantities
* Remove items from cart
* Place food orders
* Complete payment

### Order Management

* Track real-time order status
* View past order history
* Cancel orders before preparation begins

### Issue Reporting

Users can report problems related to:

* Food quality
* Order issues
* System problems

---

## 🏪 Shop Admin

Each shop in the canteen has a **Shop Admin** responsible for managing shop operations.

### Menu Management

* Add new menu items
* Update menu items
* Remove menu items
* Toggle menu item availability

### Shop Management

* Enable or disable shop availability (Open / Closed)
* Update shop profile details

### Order Management

* View incoming orders
* Monitor order details
* Update order preparation status

### Account Management

* Change shop admin password

---

## 🛠️ System Admin

The **Main Admin** manages the entire SmartCanteen platform.

### Shop Management

* Create new shop owner accounts
* Register new shops
* Manage shop administrators

### User Management

* Block or unblock users
* Block or unblock shop owners

### Platform Monitoring

* View all platform orders
* Monitor system activity

### Report Management

* View user-submitted reports
* Investigate and manage complaints

---

# 🏗️ System Architecture

The SmartCanteen system follows a **separated full-stack architecture** where the frontend communicates with the backend through REST APIs.

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

This architecture ensures **scalability, modularity, and maintainability** of the system.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* Framer Motion
* React Icons
* Vite

## Backend

* Java Servlets
* REST APIs
* JDBC

## Database

* MySQL

## Tools

* Postman (API testing)
* Git & GitHub (version control)

---

# 🗄️ Database Design

The system uses a **relational database schema** with the following core tables:

* `users`
* `shops`
* `menu`
* `orders`
* `order_items`
* `payments`
* `reports`
* `password_resets`

Relationships between tables are maintained using **foreign keys and constraints** to ensure data integrity and consistent data management.

---

# 📂 Project Structure

```
smart-canteen-system
│
├── frontend/
│   └── smartcanteen-ui/        # React + Vite frontend
│
├── backend/
│   └── smartcanteen/           # Java Servlets backend
│
├── database/
│   └── schema.sql              # MySQL database schema
│
├── screenshots/
│   ├── user/
│   ├── shop-admin/
│   └── admin/
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

Create a MySQL database and import the schema:

```
source database/schema.sql;
```

---

## 3️⃣ Run Backend

Deploy the Java backend using a servlet container such as **Apache Tomcat**.

Ensure the database credentials are correctly configured before starting the server.

---

## 4️⃣ Run Frontend

Navigate to the frontend folder and install dependencies:

```
npm install
npm run dev
```

The application will start on:

```
http://localhost:5173
```

---

# 📸 Application Screenshots

The following screenshots demonstrate the key interfaces and workflows of the SmartCanteen system across different user roles.

---

## 👤 User Interface

Users can browse shops, view menus, manage cart items, and place orders.

![User Login](screenshots/user/1.Login.png)

![Shop Selection](screenshots/user/7.Shop_Selection.png)

![Menu Page](screenshots/user/8.Menu_Selection.png)

![Cart](screenshots/user/9.Cart.png)

![Order Status](screenshots/user/11.Orders.png)

---

## 🏪 Shop Admin Dashboard

Shop administrators manage menus and handle incoming customer orders.

![Shop Dashboard](screenshots/shop-admin/1/Dashboard.png)

![Add Menu Item](screenshots/shop-admin/2.Manage_Menu.png)

![Manage Orders](screenshots/shop-admin/3.Manage_Orders.png)

---

## ⚙️ System Admin Panel

The system administrator manages shops, users, and reports across the platform.

![Admin Dashboard](screenshots/admin/1.Dashboard.png)

![Manage Users](screenshots/admin/7.Manage-Users.png)

![View Reports](screenshots/admin/8.Manage-Reports.png)

---

# 🎯 Project Goals

* Simplify campus food ordering
* Reduce waiting time in canteens
* Improve shop management efficiency
* Provide centralized administrative control

---

# 👨‍💻 Author

**Sabarithan P**

Computer Science Engineering Undergraduate
Full-Stack Development Enthusiast
