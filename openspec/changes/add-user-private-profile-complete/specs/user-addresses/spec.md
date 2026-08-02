# User Addresses Spec Delta

## ADDED Requirements

### Requirement: Users can manage saved addresses

The system SHALL allow authenticated users to manage their own saved addresses.

#### Scenario: User lists addresses

Given a user is authenticated  
When the user opens `/mi-cuenta/direcciones`  
Then the system displays the user's saved addresses.

#### Scenario: User creates address

Given a user is authenticated  
When the user submits a valid address  
Then the system saves the address for that user.

#### Scenario: User edits address

Given a user owns an address  
When the user updates valid address data  
Then the system saves the changes.

#### Scenario: User deletes address

Given a user owns an address  
When the user deletes it  
Then the system removes the address.

---

### Requirement: Users can set default address

The system SHALL allow users to mark one address as default.

#### Scenario: User sets default address

Given a user owns multiple addresses  
When the user marks one address as default  
Then that address becomes the user's default address  
And other addresses are no longer default.

---

### Requirement: Users cannot access addresses owned by others

The system SHALL prevent users from reading or modifying addresses owned by other users.

#### Scenario: User edits another user's address

Given a user is authenticated  
And an address belongs to another user  
When the user attempts to edit that address  
Then the system rejects the request.

#### Scenario: User deletes another user's address

Given a user is authenticated  
And an address belongs to another user  
When the user attempts to delete that address  
Then the system rejects the request.
