# Admin Panel Frontend Spec Delta

## ADDED Requirements

### Requirement: Admin panel replaces placeholder

The system SHALL replace the current `/admin` placeholder with a functional admin panel MVP.

#### Scenario: Admin opens admin route

Given an authenticated user with role `ADMIN`  
When the user opens `/admin`  
Then the system redirects to `/admin/dashboard`  
And displays the admin dashboard.

#### Scenario: Admin dashboard loads

Given an authenticated admin  
When the admin opens `/admin/dashboard`  
Then the system displays operational summary cards and quick actions.

---

### Requirement: Admin routes are protected

The system SHALL protect all admin frontend routes using admin role validation.

#### Scenario: Anonymous visitor opens admin route

Given no authenticated user  
When the visitor opens `/admin/dashboard`  
Then the system redirects to login or blocks access.

#### Scenario: Common user opens admin route

Given an authenticated user with role `USER`  
When the user opens `/admin/dashboard`  
Then the system blocks access.

#### Scenario: Admin opens admin route

Given an authenticated user with role `ADMIN`  
When the user opens `/admin/dashboard`  
Then the system allows access.

---

### Requirement: Admin can manage products from frontend

The system SHALL allow admins to view, create, edit, activate/deactivate and update stock/price for products using frontend screens.

#### Scenario: Admin views products

Given products exist in the database  
When the admin opens `/admin/productos`  
Then the system displays products from the admin products API.

#### Scenario: Admin creates product

Given an admin submits valid product data  
When the form is submitted  
Then the product is created  
And the admin is returned to the product list or sees success feedback.

#### Scenario: Admin edits product

Given an existing product  
When the admin updates valid product data  
Then the product is updated.

#### Scenario: Admin toggles product active state

Given an existing product  
When the admin activates or deactivates the product  
Then the product state is updated using soft delete behavior.

#### Scenario: Admin updates stock quickly

Given an existing product  
When the admin changes stock from the list  
Then the product stock is updated.

#### Scenario: Admin updates price quickly

Given an existing product  
When the admin changes price from the list  
Then the product price is updated.

---

### Requirement: Admin can manage categories from frontend

The system SHALL allow admins to view, create, edit and activate/deactivate categories using frontend screens.

#### Scenario: Admin views categories

Given categories exist in the database  
When the admin opens `/admin/categorias`  
Then the system displays categories from the admin categories API.

#### Scenario: Admin creates category

Given an admin submits valid category data  
When the form is submitted  
Then the category is created.

#### Scenario: Admin edits category

Given an existing category  
When the admin updates valid category data  
Then the category is updated.

#### Scenario: Admin toggles category active state

Given an existing category  
When the admin activates or deactivates the category  
Then the category state is updated.

---

### Requirement: Admin can view and update orders from frontend

The system SHALL allow admins to list orders, view order details and update basic order status.

#### Scenario: Admin lists orders

Given orders exist  
When the admin opens `/admin/pedidos`  
Then the system displays order number, tracking code, customer, total, status, payment status and delivery method.

#### Scenario: Admin views order detail

Given an order exists  
When the admin opens `/admin/pedidos/:id`  
Then the system displays customer, items, totals, delivery data, payment status and tracking code.

#### Scenario: Admin updates order status

Given an order exists  
When the admin changes its status  
Then the order status is updated.

---

### Requirement: Admin can manage stock requests from frontend

The system SHALL allow admins to view and update stock request statuses.

#### Scenario: Admin views stock requests

Given stock requests exist  
When the admin opens `/admin/solicitudes-stock`  
Then the system displays product, customer/contact data, status and date.

#### Scenario: Admin updates stock request status

Given a stock request exists  
When the admin changes its status  
Then the request status is updated.

---

### Requirement: Admin views handle UI states

The system SHALL display loading, error and empty states in admin views.

#### Scenario: Admin view is loading

Given data is being fetched  
When an admin page renders  
Then a loading state is displayed.

#### Scenario: Admin view fails to load

Given the API returns an error  
When an admin page renders  
Then an error state is displayed.

#### Scenario: Admin view has no data

Given the API returns an empty list  
When an admin page renders  
Then an empty state is displayed.