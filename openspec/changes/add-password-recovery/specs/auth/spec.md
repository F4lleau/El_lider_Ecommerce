# Auth Password Recovery Spec Delta

## ADDED Requirements

### Requirement: Users can request password recovery

The system SHALL allow users to request password recovery from the login screen.

#### Scenario: User opens forgot password

Given a user is on the login page  
When the user clicks `Olvidé mi contraseña`  
Then the system navigates to the password recovery page.

#### Scenario: User submits registered email

Given a user enters a registered email  
When the password recovery request is submitted  
Then the system generates a password reset token  
And returns a generic confirmation message.

#### Scenario: User submits unregistered email

Given a user enters an unregistered email  
When the password recovery request is submitted  
Then the system returns the same generic confirmation message  
And does not reveal whether the email exists.

---

### Requirement: Password reset token is secure

The system SHALL generate secure password reset tokens.

#### Scenario: Token is generated

Given a registered user requests password recovery  
When the token is created  
Then only a hash of the token is stored  
And the token has an expiration date.

#### Scenario: Token expires

Given a reset token is expired  
When the user tries to reset the password  
Then the system rejects the request.

#### Scenario: Token is reused

Given a reset token was already used  
When the user tries to use it again  
Then the system rejects the request.

---

### Requirement: Users can set a new password

The system SHALL allow users with a valid reset token to set a new password.

#### Scenario: Valid reset

Given a user has a valid reset token  
When the user submits a valid new password and confirmation  
Then the system updates the password  
And marks the token as used.

#### Scenario: Password confirmation mismatch

Given a user enters different password and confirmation values  
When the reset form is submitted  
Then the system rejects the request.

---

### Requirement: New password must be secure

The system SHALL enforce the password security policy on password reset.

#### Scenario: Password too short

Given the new password has fewer than 6 characters  
When the reset is submitted  
Then the system rejects the request.

#### Scenario: Password without uppercase

Given the new password has no uppercase letter  
When the reset is submitted  
Then the system rejects the request.

#### Scenario: Password without lowercase

Given the new password has no lowercase letter  
When the reset is submitted  
Then the system rejects the request.

#### Scenario: Password without special character

Given the new password has no special character  
When the reset is submitted  
Then the system rejects the request.

---

### Requirement: Successful password reset allows login

The system SHALL allow the user to log in with the new password after a successful reset.

#### Scenario: Login after reset

Given a user has reset the password successfully  
When the user logs in with the new password  
Then the system authenticates the user.