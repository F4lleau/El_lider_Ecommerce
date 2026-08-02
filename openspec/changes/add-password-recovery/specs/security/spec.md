# Auth Security Spec Delta

## ADDED Requirements

### Requirement: Login attempts can temporarily lock an account

The system SHALL temporarily lock accounts after repeated failed login attempts.

#### Scenario: Failed login attempts exceed limit

Given a user enters an incorrect password repeatedly  
When the number of failed attempts exceeds the configured limit  
Then the system locks the account temporarily.

#### Scenario: User tries to login while locked

Given a user account is locked  
When the user tries to log in  
Then the system rejects the login  
And informs the user that they must wait before trying again.

---

### Requirement: Account lockout lasts 30 minutes

The system SHALL lock accounts for 30 minutes when the failed login threshold is reached.

#### Scenario: Account is locked

Given a user exceeded failed login attempts  
When the lock is created  
Then `lockedUntil` is set to 30 minutes in the future.

#### Scenario: Lock period has not expired

Given `lockedUntil` is in the future  
When the user tries to login  
Then the system rejects the login  
And reports the remaining wait time.

#### Scenario: Lock period expired

Given `lockedUntil` is in the past  
When the user tries to login with valid credentials  
Then the system allows login  
And clears failed login attempts.

---

### Requirement: Password reset can clear lockout

The system SHOULD clear lockout after a successful password reset.

#### Scenario: Locked user resets password

Given a user account is locked  
When the user resets the password successfully  
Then the system clears failed login attempts  
And removes the temporary lock.

---

### Requirement: Password recovery does not reveal account existence

The system SHALL not reveal whether an email exists during password recovery.

#### Scenario: Existing email

Given a registered email is submitted  
When password recovery is requested  
Then the response is generic.

#### Scenario: Non-existing email

Given an unregistered email is submitted  
When password recovery is requested  
Then the response is the same generic message.

---

### Requirement: Reset token is not stored in plain text

The system SHALL store only a secure hash of password reset tokens.

#### Scenario: Token is created

Given a reset token is generated  
When it is saved  
Then the plain token is not stored.