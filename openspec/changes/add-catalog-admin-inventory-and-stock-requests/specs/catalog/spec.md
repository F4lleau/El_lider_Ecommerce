# Catalog Spec Delta

## ADDED Requirements

### Requirement: Catalog uses database products

The system SHALL display public catalog products from the database.

#### Scenario: Visitor views catalog

Given active products exist in the database  
When a visitor opens the catalog  
Then the system displays products from the database.

---

### Requirement: Admin can manage products

The system SHALL allow admins to create, update, deactivate and delete products through protected API endpoints.

#### Scenario: Admin creates product

Given an authenticated admin  
When the admin submits valid product data  
Then the system creates the product  
And the product becomes available in public catalog if active.

#### Scenario: Common user creates product

Given an authenticated user with role `user`  
When the user tries to create a product  
Then the system rejects the request.

---

### Requirement: Admin can manage categories

The system SHALL allow admins to create, update, deactivate and delete categories through protected API endpoints.

#### Scenario: Admin creates category

Given an authenticated admin  
When the admin submits valid category data  
Then the system creates the category.

---

### Requirement: Offers use product price fields

The system SHALL display offers using `price`, `compareAtPrice` and `isOffer`.

#### Scenario: Product is on offer

Given a product has `isOffer` true  
And `compareAtPrice` is greater than `price`  
When the product is displayed  
Then the current price is shown  
And the compare at price is shown as previous price.

---

### Requirement: Best sellers are calculated from sales

The system SHALL calculate best selling products from real order item quantities.

#### Scenario: Products have completed orders

Given completed orders contain order items  
When the best sellers endpoint is requested  
Then the system returns products ordered by total quantity sold.