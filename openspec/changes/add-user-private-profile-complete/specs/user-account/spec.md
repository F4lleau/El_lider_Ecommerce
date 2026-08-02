# User Account Spec Delta

## ADDED Requirements

### Requirement: Authenticated users can access private account area

The system SHALL provide a private account area for authenticated users.

#### Scenario: Authenticated user opens account

Given a user is authenticated  
When the user opens `/mi-cuenta`  
Then the system displays the private account dashboard.

#### Scenario: Guest opens account

Given a user is not authenticated  
When the user opens `/mi-cuenta`  
Then the system redirects to `/login`.

---

### Requirement: Private account dashboard shows user summary

The system SHALL show a summary of the user's account.

#### Scenario: User has account activity

Given an authenticated user has orders or stock requests  
When the user opens `/mi-cuenta`  
Then the system displays recent orders, stock request summary and quick actions.

#### Scenario: User has no activity

Given an authenticated user has no orders  
When the user opens `/mi-cuenta`  
Then the system displays an empty state.

---

### Requirement: User can view and update profile

The system SHALL allow authenticated users to view and update their own profile data.

#### Scenario: User views profile

Given a user is authenticated  
When the user opens `/mi-cuenta/perfil`  
Then the system displays the user's profile information.

#### Scenario: User updates profile

Given a user is authenticated  
When the user updates valid profile data  
Then the system saves the changes.

#### Scenario: User cannot update another user's profile

Given a user is authenticated  
When the user attempts to update another user's profile  
Then the system rejects the request.

---

### Requirement: User account labels are displayed in Spanish

The system SHALL display all account navigation and messages in Spanish.

#### Scenario: Account menu is displayed

Given a user is authenticated  
When the account menu is shown  
Then the labels are displayed in Spanish.
