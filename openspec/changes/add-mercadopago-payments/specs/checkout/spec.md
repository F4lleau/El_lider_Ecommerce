# Checkout Payment Spec Delta

## ADDED Requirements

### Requirement: Checkout supports payment method selection

The system SHALL allow users to choose between Mercado Pago online payment and cash payment.

#### Scenario: User selects Mercado Pago

Given the user is in checkout  
When the user selects payment method `MERCADOPAGO`  
Then the order is created as pending payment  
And the user can continue to Mercado Pago.

#### Scenario: User selects cash

Given the user is in checkout  
When the user selects payment method `CASH`  
Then the order is confirmed or pending confirmation  
And no Mercado Pago preference is created.

---

### Requirement: Checkout supports delivery method selection

The system SHALL allow users to choose pickup or shipping.

#### Scenario: Pickup selected

Given the user selects `PICKUP`  
When checkout is calculated  
Then shipping cost is zero.

#### Scenario: Shipping selected

Given the user selects `SHIPPING`  
When checkout is calculated  
Then shipping address is required  
And shipping cost is added to the order total.

---

### Requirement: Backend calculates checkout totals

The system SHALL calculate subtotal, shipping cost and total in backend.

#### Scenario: Total is calculated

Given the checkout is submitted  
When the backend creates the order  
Then it calculates subtotal from products  
And calculates shipping cost  
And calculates final total.

---

### Requirement: Cash orders discount stock immediately

The system SHALL decrease stock when a cash order is confirmed.

#### Scenario: Cash order created

Given a valid cart  
And payment method is `CASH`  
When the order is created or confirmed  
Then stock decreases according to ordered quantities.