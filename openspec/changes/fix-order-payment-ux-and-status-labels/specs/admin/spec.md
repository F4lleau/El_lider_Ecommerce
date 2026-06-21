Contenido:

# Admin Order UX Spec Delta

## ADDED Requirements

### Requirement: Admin order labels are shown in Spanish

The system SHALL display order status, payment status, payment method and delivery method in Spanish in admin views.

#### Scenario: Admin views order list

Given admin opens the order list  
When orders are displayed  
Then methods and statuses are shown with Spanish labels.

#### Scenario: Admin views order detail

Given admin opens order detail  
When order data is displayed  
Then methods and statuses are shown with Spanish labels.

---

### Requirement: Admin only sees valid order status transitions

The system SHALL avoid offering invalid status transitions when changing an order status.

#### Scenario: Pickup order

Given an order has delivery method `PICKUP`  
When admin opens status options  
Then pickup-related statuses are shown.

#### Scenario: Shipping order

Given an order has delivery method `SHIPPING`  
When admin opens status options  
Then shipping-related statuses are shown.

---

### Requirement: Admin status conflict is handled clearly

The system SHALL show a clear message when backend rejects a status transition with conflict.

#### Scenario: Backend returns 409

Given admin tries to change an order status  
And the backend returns 409  
When the UI handles the error  
Then the admin sees a clear message explaining that the transition is not allo