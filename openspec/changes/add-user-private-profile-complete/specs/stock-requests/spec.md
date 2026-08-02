# User Stock Requests Spec Delta

## ADDED Requirements

### Requirement: Users can view their own stock requests

The system SHALL allow authenticated users to view their own stock requests.

#### Scenario: User opens stock requests

Given a user is authenticated  
When the user opens `/mi-cuenta/solicitudes-stock`  
Then the system displays only stock requests belonging to that user.

#### Scenario: User has no stock requests

Given a user has no stock requests  
When the user opens `/mi-cuenta/solicitudes-stock`  
Then the system displays an empty state.

---

### Requirement: Users can cancel pending stock requests

The system SHOULD allow authenticated users to cancel their own pending stock requests.

#### Scenario: User cancels own pending request

Given a user owns a pending stock request  
When the user cancels it  
Then the request status changes to cancelled.

#### Scenario: User cancels another user's request

Given a stock request belongs to another user  
When the user attempts to cancel it  
Then the system rejects the request.

---

### Requirement: Stock request statuses are displayed in Spanish

The system SHALL display stock request statuses in Spanish.

#### Scenario: Pending stock request

Given a stock request has status `PENDING`  
When it is displayed  
Then the UI shows `Pendiente`.

#### Scenario: Cancelled stock request

Given a stock request has status `CANCELLED`  
When it is displayed  
Then the UI shows `Cancelado`.
