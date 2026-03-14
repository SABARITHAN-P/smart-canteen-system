# SmartCanteen Backend

## Overview

The **SmartCanteen Backend** provides the server-side functionality for the SmartCanteen system.
It exposes REST APIs that allow the frontend application to interact with the database for authentication, menu retrieval, cart management, order processing, and issue reporting.

The backend is responsible for:

- Processing requests sent by the frontend
- Validating user inputs
- Executing business logic
- Performing database operations
- Returning structured API responses

This backend acts as the **central layer connecting the React frontend and the MySQL database**.

---

## Technology Stack

The backend is implemented using the following technologies:

- **Java Servlets** – Handles HTTP requests and responses
- **JDBC (Java Database Connectivity)** – Communicates with the MySQL database
- **MySQL** – Stores application data such as users, menu items, and orders
- **Apache Tomcat** – Application server used to deploy and run the backend
- **REST APIs** – Enables communication between frontend and backend

---

## Backend Architecture

The backend follows a layered structure to separate responsibilities and improve maintainability.

```
backend/
│
├── controllers/
│   Handles HTTP requests and responses
│
├── services/
│   Contains business logic for application features
│
├── dao/
│   Handles database operations using JDBC
│
├── models/
│   Java classes representing database entities
│
├── utils/
│   Utility classes such as database connection setup
│
└── config/
    Configuration files if required
```

---

## Layer Responsibilities

### Controllers

Controllers receive HTTP requests from the frontend and route them to appropriate service methods.
They also prepare the response returned to the client.

Examples of controller responsibilities include:

- Handling authentication requests
- Retrieving menu data
- Processing order requests
- Managing issue reports

---

### Services

Service classes contain the **core business logic** of the application.

They act as an intermediate layer between controllers and the database layer.

Responsibilities include:

- Validating request data
- Managing cart operations
- Processing order workflows
- Handling issue reporting logic

---

### DAO (Data Access Objects)

DAO classes interact directly with the MySQL database using JDBC.

Responsibilities include:

- Executing SQL queries
- Fetching data from the database
- Updating records
- Mapping query results to Java objects

---

### Models

Model classes represent the entities stored in the database.

Examples include:

- `User`
- `MenuItem`
- `Order`
- `OrderItem`
- `Report`

These classes define the structure of data used throughout the application.

---

### Utilities

Utility classes provide reusable functionality used across the backend.

Example:

`DBConnection.java` is responsible for establishing and managing connections to the MySQL database.

---

## Database Setup

The database schema for SmartCanteen is included in the repository.

Location:

```
database/schema.sql
```

This file contains SQL statements required to create all necessary database tables.

### Steps to Initialize the Database

1. Open **MySQL Workbench** or another MySQL client.

2. Create the database:

```
CREATE DATABASE smartcanteen;
```

3. Import the schema file:

```
SOURCE database/schema.sql;
```

This will create all required tables for the application.

---

## Running the Backend

Follow these steps to run the backend server.

### 1. Import the Project

Open the backend folder in an IDE such as:

- Eclipse

---

### 2. Configure Database Credentials

Locate the database connection utility file:

```
utils/DBConnection.java
```

Update the database configuration if necessary.

Example configuration:

```
jdbc:mysql://localhost:3306/smartcanteen
username: root
password: your_password
```

---

### 3. Configure Apache Tomcat

Add **Apache Tomcat** as the application server in your IDE.

Deploy the backend project to the Tomcat server.

---

### 4. Start the Server

Run the project using Tomcat.

Once the server starts successfully, the backend APIs will be available at:

```
http://localhost:8080
```

The frontend application will communicate with these endpoints to perform operations such as retrieving menu items, placing orders, and submitting issue reports.

---

## Key Backend Features

The backend currently supports the following features:

- User authentication and account management
- Menu retrieval and categorization
- Cart management
- Order placement and tracking
- Issue reporting system
- Admin order management

These APIs allow the SmartCanteen system to provide a seamless food ordering experience.

---

## API Endpoints Overview

The backend exposes REST-style endpoints that allow the frontend to perform different operations.

### Authentication APIs

POST /login  
Authenticates a user and returns login status.

POST /register  
Registers a new user in the system.

---

### Menu APIs

GET /menu  
Retrieves all available menu items.

GET /menu/{shopId}  
Retrieves menu items for a specific shop.

---

### Cart APIs

POST /cart/add  
Adds an item to the user's cart.

POST /cart/remove  
Removes an item from the cart.

GET /cart  
Retrieves the current user's cart items.

---

### Order APIs

POST /order/place  
Places a new order.

GET /order/{userId}  
Retrieves order history for a user.

---

### Issue Reporting APIs

POST /report  
Allows users to submit issues related to orders or system problems.

GET /report/{id}  
Retrieves details of a submitted report.

---

## Application Architecture

The SmartCanteen system follows a simple client-server architecture.

```
React Frontend
        │
        │ HTTP Requests
        ▼
Java Backend (Servlet APIs)
        │
        │ JDBC Queries
        ▼
MySQL Database
```

The frontend sends requests to backend APIs.
The backend processes those requests, interacts with the database, and returns the response to the frontend.

---

## Notes

- Ensure MySQL is running before starting the backend server.
- Make sure the database schema has been imported successfully.
- The backend must be running before starting the frontend application.
