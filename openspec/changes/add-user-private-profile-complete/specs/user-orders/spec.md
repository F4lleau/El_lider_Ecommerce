# User Orders Spec Delta

## ADDED Requirements

### Requirement: Users can list their own orders

The system SHALL allow authenticated users to view only their own orders.

#### Scenario: User opens order history

Given a user is authenticated  
When the user opens `/mi-cuenta/pedidos`  
Then the system displays only orders belonging to that user.

#### Scenario: User has no orders

Given a user is authenticated  
And the user has no orders  
When the user opens `/mi-cuenta/pedidos`  
Then the system displays an empty state.

---

### Requirement: Users can view their own order detail

The system SHALL allow authenticated users to view details of their own orders.

#### Scenario: User opens own order detail

Given a user is authenticated  
And the order belongs to that user  
When the user opens `/mi-cuenta/pedidos/:id`  
Then the system displays the order detail.

#### Scenario: User opens another user's order

Given a user is authenticated  
And the order belongs to another user  
When the user attempts to open that order  
Then the system rejects the request.

---

### Requirement: User order list displays commercial information

The system SHALL display user-friendly order information in the order list.

#### Scenario: Order list item is displayed

Given a user has an order  
When the order list is displayed  
Then the system shows order number, follow-up number, date, total, delivery method, payment method, order status and payment status.

---

### Requirement: User order detail displays products and totals

The system SHALL display products, snapshots and totals in order detail.

#### Scenario: Order detail is displayed

Given a user opens an order detail  
When the order is displayed  
Then the system shows products, SKU, quantity, unit price, item subtotal, shipping cost and final total.

---

### Requirement: Pending Mercado Pago orders can be paid from account

The system SHOULD allow users to continue payment for pending Mercado Pago orders.

#### Scenario: Mercado Pago order is pending

Given a user has a Mercado Pago order with pending payment  
When the user opens the order detail  
Then the system shows an action to pay with Mercado Pago.

---

### Requirement: Cash orders explain payment timing

The system SHALL explain when cash payment is due.

#### Scenario: Cash pickup order

Given a cash pickup order exists  
When the user opens order detail  
Then the system explains that payment is due when picking up the order.

#### Scenario: Cash shipping order

Given a cash shipping order exists  
When the user opens order detail  
Then the system explains that payment is due when receiving the order.
