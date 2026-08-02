Auth Email Spec Delta ## ADDED Requirements 
### Requirement: Password recovery sends email 
The system SHALL send a password recovery email when a registered user requests password reset. 
#### Scenario: Existing user requests password recovery 
Given a registered user submits their email When password recovery is requested Then the system generates a reset token And sends a password recovery email. 
#### Scenario: Unknown email requests password recovery 
Given an unregistered email is submitted When password recovery is requested Then the system returns the same generic response And does not reveal whether the email exists. --- 
### Requirement: Password reset email includes secure reset link 
The system SHALL include a reset link with a valid token in the password recovery email. 
#### Scenario: Reset email is sent 
Given a reset token was generated When the password recovery email is sent Then the email includes a reset link And the link points to the frontend reset password page. --- 
### Requirement: Production does not expose reset URL in response 
The system SHALL not expose password reset URLs in API responses in production. 
#### Scenario: Production password recovery 
Given the system runs in production When password recovery is requested Then the API response does not include the reset URL.