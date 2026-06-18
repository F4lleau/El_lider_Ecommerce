# Orders Payment Spec Delta

## MODIFIED Requirements

### Requirement: Orders store payment method

The system SHALL store the selected payment method in the order.

#### Scenario: Mercado Pago order

Given checkout is submitted with `MERCADOPAGO`  
When the order is created  
Then the order stores payment method `MERCADOPAGO`.

#### Scenario: Cash order

Given checkout is submitted with `CASH`  
When the order is created  
Then the order stores payment method `CASH`.

---

### Requirement: Approved Mercado Pago payments update order status

The system SHALL update order status when Mercado Pago confirms approved payment.

#### Scenario: Payment approved

Given Mercado Pago confirms payment approved  
When the backend processes the webhook  
Then payment status becomes `APPROVED`  
And order status becomes `PAID`.

---

### Requirement: Mercado Pago stock decreases after approved payment

The system SHALL decrease product stock when Mercado Pago payment is approved.

#### Scenario: Approved payment discounts stock

Given an order contains product items  
And Mercado Pago payment is approved  
When the webhook is processed  
Then product stock decreases according to purchased quantities.

#### Scenario: Duplicate webhook

Given an approved payment was already processed  
When the same webhook is received again  
Then stock is not decreased a second time.

---

### Requirement: Cash orders do not require Mercado Pago

The system SHALL allow cash orders without creating Mercado Pago payment data.

#### Scenario: Cash pickup order

Given checkout uses `PICKUP` and `CASH`  
When the order is created  
Then no Mercado Pago preference is created  
And shipping cost is zero.

#### Scenario: Cash shipping order

Given checkout uses `SHIPPING` and `CASH`  
When the order is created  
Then no Mercado Pago preference is created  
And shipping cost is included in total.