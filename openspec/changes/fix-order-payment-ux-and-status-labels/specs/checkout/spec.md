# Checkout UX and Error Handling Spec Delta

## ADDED Requirements

### Requirement: Cash pickup confirmation is clear

The system SHALL show a clear confirmation message for cash pickup orders.

#### Scenario: Cash pickup order confirmed

Given a guest creates an order with `CASH` and `PICKUP`  
When the confirmation page is displayed  
Then the user sees that the order was registered for pickup  
And that payment will be made in cash at pickup.

---

### Requirement: Cash shipping confirmation is clear

The system SHALL show a clear confirmation message for cash shipping orders.

#### Scenario: Cash shipping order confirmed

Given a guest creates an order with `CASH` and `SHIPPING`  
When the confirmation page is displayed  
Then the user sees that the order was registered for home delivery  
And that payment will be made in cash upon receiving.

---

### Requirement: Mercado Pago payment page is clear

The system SHALL show a clear payment page for Mercado Pago orders.

#### Scenario: Mercado Pago order payment page

Given an order was created with payment method `MERCADOPAGO`  
When the user opens the payment page  
Then the page explains that the purchase is completed by paying online with Mercado Pago  
And shows a button to start payment.

---

### Requirement: Mercado Pago errors are understandable

The system SHALL show a useful error message if Mercado Pago preference creation fails.

#### Scenario: Preference creation fails

Given a Mercado Pago order exists  
When preference creation fails  
Then the frontend shows a clear error  
And offers retry  
And offers to view order tracking.

---

### Requirement: Payment pages do not depend on cart state

The system SHALL allow payment pages to load based on order data, not cart data.

#### Scenario: Cart is empty after order creation

Given an order was created and the cart is empty  
When the user opens the payment page  
Then the page loads the order data  
And does not repeatedly validate an empty cart.

---

### Requirement: Checkout validation does not spam errors

The system SHALL avoid repeatedly calling checkout validation when checkout cannot proceed.

#### Scenario: Empty cart validation

Given the cart is empty  
When the checkout page validates the cart  
Then the system shows a clear empty cart message  
And does not repeatedly send failing validation requests.

---

### Requirement: Checkout confirmation uses user-friendly labels

The system SHALL display payment method, delivery method and order status using user-friendly Spanish labels.

#### Scenario: Cash pickup labels

Given a cash pickup order is confirmed  
When the confirmation page is displayed  
Then the payment method is shown as `Efectivo`  
And the delivery method is shown as `Retiro en sucursal`  
And the status is shown as `Pedido confirmado`.

#### Scenario: Mercado Pago labels

Given a Mercado Pago order is created  
When the payment page is displayed  
Then the payment method is shown as `Mercado Pago`  
And the payment status is shown as `Pago pendiente`.

---

### Requirement: Checkout confirmation shows follow-up code clearly

The system SHALL display the tracking code as a user-friendly follow-up code.

#### Scenario: Confirmation displays follow-up code

Given an order is created  
When the confirmation page is displayed  
Then the tracking code is labeled as `Número de seguimiento` or `Código de seguimiento`  
And the user is told to save it to check the order status.