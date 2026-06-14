# Checkout Spec Delta

## ADDED Requirements

### Requirement: Guests can create checkout orders

The system SHALL allow guests to create an order from a valid cart without registering.

#### Scenario: Guest checkout with pickup

Given a guest has valid products in cart  
When the guest submits checkout with delivery method `PICKUP`  
Then the system creates an order with shipping cost 0  
And returns an order number and tracking code.

#### Scenario: Guest checkout with shipping

Given a guest has valid products in cart  
When the guest submits checkout with delivery method `SHIPPING` and valid address  
Then the system creates an order with shipping cost  
And returns subtotal, shipping cost and total.

---

### Requirement: Authenticated users can create checkout orders

The system SHALL allow authenticated users to create orders from their backend cart.

#### Scenario: User checkout with pickup

Given an authenticated user has products in cart  
When the user submits checkout with delivery method `PICKUP`  
Then the system creates an order linked to the user.

#### Scenario: User checkout with shipping

Given an authenticated user has products in cart  
When the user submits checkout with delivery method `SHIPPING`  
Then the system creates an order linked to the user  
And stores shipping address data.

---

### Requirement: Backend calculates totals

The system SHALL calculate subtotal, shipping cost and total in the backend.

#### Scenario: Checkout total is calculated

Given a cart contains products with current backend prices  
When checkout is submitted  
Then the backend calculates subtotal  
And calculates shipping cost  
And calculates final total.

---

### Requirement: Checkout validates stock

The system SHALL validate product stock before creating an order.

#### Scenario: Product has insufficient stock

Given a cart item quantity is greater than available stock  
When checkout is submitted  
Then the system rejects the checkout  
And does not create an order.

---

### Requirement: Checkout supports pickup and shipping

The system SHALL support pickup at branch and home delivery.

#### Scenario: Pickup checkout

Given the user chooses `PICKUP`  
When checkout is submitted  
Then shipping cost is 0  
And no shipping address is required.

#### Scenario: Shipping checkout

Given the user chooses `SHIPPING`  
When checkout is submitted  
Then shipping address is required  
And shipping cost is added to the total.