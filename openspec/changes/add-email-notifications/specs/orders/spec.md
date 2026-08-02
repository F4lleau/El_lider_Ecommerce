# Order Email Notification Spec Delta 

## ADDED Requirements 

### Requirement: Order confirmation email is sent 
The system SHALL send an order confirmation email when an order is created and the customer email is available. 
#### Scenario: Cash order is created 
Given a customer creates a cash order When the order is successfully created Then the system sends an order confirmation email. 
#### Scenario: Mercado Pago order is created 
Given a customer creates a Mercado Pago order When the order is successfully created Then the system may send an email indicating that the order is pending payment. --- 
### Requirement: Payment approved email is sent once The system 
SHALL send a payment approved email when Mercado Pago confirms payment approval. 
#### Scenario: Payment approved 
Given Mercado Pago confirms an approved payment When the webhook is processed for the first time Then the system sends a payment approved email. 
#### Scenario: Duplicate webhook 
Given the payment approved email was already triggered When a duplicate webhook is received Then the system does not send a duplicate email. --- 
### Requirement: Order status emails are sent 
The system SHALL send customer emails for key order status changes. 
#### Scenario: Order ready for pickup 
Given an order status changes to `READY_FOR_PICKUP` When the status update succeeds Then the system sends a ready for pickup email. 
#### Scenario: Order shipped 
Given an order status changes to `SHIPPED` When the status update succeeds Then the system sends a shipped email.