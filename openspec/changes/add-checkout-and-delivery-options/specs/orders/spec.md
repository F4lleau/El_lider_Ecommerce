# Orders Spec Delta

## ADDED Requirements

### Requirement: Orders are created from checkout

The system SHALL create an order when checkout succeeds.

#### Scenario: Order is created

Given checkout data is valid  
When the backend processes checkout  
Then an order is created with status `PENDING_PAYMENT`  
And payment status `PENDING`.

---

### Requirement: Orders contain item snapshots

The system SHALL store product snapshot data in order items.

#### Scenario: Order item snapshot is stored

Given a product is purchased  
When the order item is created  
Then it stores product name, product slug, unit price, quantity and total.

---

### Requirement: Orders have tracking codes

The system SHALL generate a unique tracking code for each order.

#### Scenario: Tracking code is generated

Given a checkout succeeds  
When the order is created  
Then the order has a unique tracking code.

---

### Requirement: Guests can track orders publicly

The system SHALL allow guests to track orders using a tracking code.

#### Scenario: Guest tracks order

Given an order exists with a tracking code  
When the visitor requests the public tracking endpoint  
Then the system returns order status, payment status, delivery method, items and totals.

---

### Requirement: Users can see their own orders

The system SHALL allow authenticated users to view only their own orders.

#### Scenario: User views own orders

Given an authenticated user has orders  
When the user requests `/api/me/orders`  
Then the system returns that user's orders.

#### Scenario: User tries to view another user's order

Given an authenticated user requests an order owned by another user  
When the request is processed  
Then the system rejects the request.

---

### Requirement: Admins can view orders

The system SHALL allow admins to list and view orders.

#### Scenario: Admin lists orders

Given an authenticated admin  
When the admin requests admin orders  
Then the system returns orders with filters.

#### Scenario: Common user lists admin orders

Given an authenticated user with role `USER`  
When the user requests admin orders  
Then the system rejects the request.