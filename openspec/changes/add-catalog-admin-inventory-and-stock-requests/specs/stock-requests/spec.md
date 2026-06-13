# Stock Requests Spec Delta

## ADDED Requirements

### Requirement: Visitors can request notification for out-of-stock products

The system SHALL allow visitors to request contact when an out-of-stock product becomes available.

#### Scenario: Guest requests stock notification

Given a product has no stock  
And the visitor is not authenticated  
When the visitor submits name, email and phone  
Then the system creates a stock request for that product.

---

### Requirement: Authenticated users can request stock notification

The system SHALL allow authenticated users to request stock notification without re-entering their data.

#### Scenario: User requests stock notification

Given a product has no stock  
And the user is authenticated  
When the user requests stock notification  
Then the system creates a stock request linked to the user.

---

### Requirement: Users can see their stock requests

The system SHALL allow authenticated users to view their own stock requests.

#### Scenario: User opens stock requests

Given an authenticated user has stock requests  
When the user requests `/api/me/stock-requests`  
Then the system returns only that user's requests.

---

### Requirement: Admin can manage stock requests

The system SHALL allow admins to view and update stock request statuses.

#### Scenario: Admin views stock requests

Given an authenticated admin  
When the admin requests stock requests  
Then the system returns pending stock requests.

#### Scenario: Admin updates request status

Given an authenticated admin  
And a stock request exists  
When the admin updates the request status  
Then the system saves the new status.