# Shipping Spec Delta

## ADDED Requirements

### Requirement: Pickup has no shipping cost

The system SHALL set shipping cost to zero when the delivery method is pickup.

#### Scenario: Pickup selected

Given a user selects pickup at branch  
When checkout is calculated  
Then shipping cost is 0  
And total equals products subtotal.

---

### Requirement: Shipping requires address

The system SHALL require a delivery address when the delivery method is shipping.

#### Scenario: Shipping without address

Given a user selects shipping  
When checkout is submitted without address  
Then the system rejects the checkout.

---

### Requirement: Shipping cost is shown separately

The system SHALL display shipping cost separately from product subtotal.

#### Scenario: Shipping total displayed

Given a user selects shipping  
When checkout summary is displayed  
Then the system shows product subtotal  
And shipping cost  
And final total.

---

### Requirement: Shipping data is stored

The system SHALL store delivery data for shipping orders.

#### Scenario: Shipping order created

Given checkout with shipping succeeds  
When the order is created  
Then the system stores recipient, phone, address, city, province, postal code and references if provided.