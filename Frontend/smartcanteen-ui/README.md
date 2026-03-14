## System Features

The SmartCanteen platform supports multiple user roles with different capabilities.
The system is designed with a **role-based access model**, where each user type interacts with the platform according to their responsibilities and permissions.

This ensures efficient canteen management while providing a seamless ordering experience for students.

---

## General Features

These features are available across the entire SmartCanteen platform and support secure user interaction.

* User registration and account creation
* Secure login authentication
* Forgot password functionality
* OTP-based password reset via registered email
* Email-based verification for account recovery
* Secure session management
* Role-based access control for different user types

These foundational features ensure the system maintains **security, reliability, and proper access control**.

---

## User Features (Students / Customers)

Users of the SmartCanteen system can browse available food items, place orders, and manage their account through the following features:

### Account Management

* User registration and login
* Update personal profile information
* Change account password
* Secure logout functionality

### Shop and Menu Interaction

* Browse available canteen shops
* View menus for individual shops
* View detailed information about menu items
* Select food items from the menu

### Cart and Ordering

* Add menu items to cart
* Modify quantity of items in cart
* Remove items from cart
* Place food orders
* Complete order payment

### Order Management

* View current order status
* View past order history
* Cancel orders before preparation begins

### Issue Reporting

Users can submit reports for problems related to:

* Food quality
* Order-related issues
* System-related problems

These reports are sent to the system administrators for review and resolution.

---

## Shop Admin Features

Each shop registered in the SmartCanteen system has a dedicated shop administrator responsible for managing shop operations.

Shop administrators can perform the following actions:

### Menu Management

* Add new menu items
* Update existing menu items
* Enable or disable menu items (toggle availability)

### Shop Management

* Enable or disable the shop
* Update shop profile information
* Manage shop details and availability

### Order Management

* View incoming customer orders
* Monitor order details
* Update order status during preparation and completion

### Account Management

* Change shop administrator password
* Manage shop profile settings

These tools allow shop administrators to efficiently manage their menu and handle customer orders.

---

## System Admin Features

The system administrator has full control over the SmartCanteen platform and ensures the system operates smoothly.

Administrative capabilities include:

### Shop and Owner Management

* Create new shop owner accounts
* Register and configure new shops
* Manage shop owner access

### User Management

* Block or unblock users
* Block or unblock shop owners
* Monitor system activity

### Report Management

* View user-submitted reports
* Investigate reported issues
* Take administrative actions when necessary

### System Monitoring

* View all orders placed across shops
* Monitor platform activity
* Maintain overall system functionality

---

## Role-Based System Design

SmartCanteen implements a **role-based access control system** to manage permissions effectively.

```text
User (Student)
│
├─ Browse shops and menus
├─ Add items to cart
├─ Place and track orders
└─ Report issues

Shop Admin
│
├─ Manage shop menu
├─ Update shop details
└─ Process customer orders

System Admin
│
├─ Manage shops and shop owners
├─ Manage users
├─ View reports
└─ Monitor overall orders
```

This structure ensures that **each role has access only to the features required for their responsibilities**, improving both security and system organization.

---

## Summary

The SmartCanteen platform combines **secure authentication, role-based management, order processing, and issue reporting** into a unified system that improves the canteen ordering experience.

By separating responsibilities between **users, shop administrators, and system administrators**, the platform ensures efficient food ordering, shop management, and administrative oversight.
