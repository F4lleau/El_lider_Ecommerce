# Inventory Spec Delta

## ADDED Requirements

### Requirement: Products have branch stock

The system SHALL track product stock available in branch using the product `stock` field for the MVP.

#### Scenario: Product has stock

Given a product has stock greater than zero  
When the product is displayed  
Then users can add it to cart.

#### Scenario: Product has no stock

Given a product has stock equal to zero  
When the product is displayed  
Then users cannot add it to cart  
And the system displays an option to request stock notification.

---

### Requirement: Admin can update stock

The system SHALL allow admins to update product stock.

#### Scenario: Admin updates product stock

Given an authenticated admin  
When the admin updates product stock with a non-negative value  
Then the product stock is updated.

---

### Requirement: Stock is not decreased by cart actions

The system SHALL NOT decrease stock when products are added to cart.

#### Scenario: User adds product to cart

Given a product has available stock  
When a user adds the product to cart  
Then the product stock remains unchanged.

---

### Requirement: Stock decreases after confirmed purchase

The system SHALL decrease stock when an order is confirmed or paid, according to checkout rules.

#### Scenario: Order is paid

Given an order contains product items  
When the order payment is approved  
Then the system decreases stock according to purchased quantities.