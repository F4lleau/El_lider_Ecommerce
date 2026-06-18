# Payments Spec Delta

## ADDED Requirements

### Requirement: Pending Mercado Pago orders can create payment preferences

The system SHALL create Mercado Pago Checkout Pro preferences only for orders using `MERCADOPAGO`.

#### Scenario: Create preference for Mercado Pago order

Given an order exists with payment method `MERCADOPAGO`  
And order status is `PENDING_PAYMENT`  
When the user requests a payment preference  
Then the backend creates a Mercado Pago preference  
And returns an initialization URL.

#### Scenario: Reject preference for cash order

Given an order exists with payment method `CASH`  
When the user requests a Mercado Pago preference  
Then the system rejects the request.

#### Scenario: Reject preference for paid order

Given an order is already paid  
When the user requests a new preference  
Then the system rejects the request.

---

### Requirement: Backend owns payment amount

The system SHALL use the order total stored in backend as the payment amount.

#### Scenario: Preference created

Given an order has a stored total  
When the Mercado Pago preference is created  
Then the backend uses the stored order total  
And ignores any amount sent by frontend.

---

### Requirement: Payment status is visible

The system SHALL show payment method and payment status in public tracking, user orders and admin orders.

#### Scenario: Tracking displays payment status

Given an order exists  
When a visitor opens tracking  
Then payment method and payment status are displayed.

#### Scenario: Admin displays payment status

Given an order exists  
When admin opens order detail  
Then payment method and payment status are displayed.