# Shipping Settings Spec Delta

## ADDED Requirements

### Requirement: Shipping cost is defined by backend configuration

The system SHALL calculate shipping cost from backend configuration and not from frontend input.

#### Scenario: Shipping selected

Given the user selects delivery method `SHIPPING`  
When checkout is calculated  
Then the backend uses configured shipping cost.

#### Scenario: Pickup selected

Given the user selects delivery method `PICKUP`  
When checkout is calculated  
Then shipping cost is zero.

---

### Requirement: Admin can configure shipping cost

The system SHOULD allow admins to configure the default shipping cost.

#### Scenario: Admin updates shipping cost

Given an authenticated admin  
When the admin updates shipping cost  
Then the system stores the new shipping cost  
And future shipping checkouts use it.

---

### Requirement: Fallback shipping cost can be used temporarily

The system MAY use `DEFAULT_SHIPPING_COST` as a temporary fallback if admin settings are not implemented in this change.

#### Scenario: No shipping settings model exists

Given no shipping settings model exists  
When shipping checkout is calculated  
Then the backend uses `DEFAULT_SHIPPING_COST`  
And documents the fallback in `current-state.md`.