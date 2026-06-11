# Auth Spec Delta

## ADDED Requirements

### Requirement: Public users can register

The system SHALL allow a public visitor to create an account using valid registration data.

#### Scenario: User registers successfully

Given a visitor submits valid registration data  
When the backend receives the request  
Then the system creates a user with role `user`  
And does not return the password hash.

#### Scenario: User registration rejects duplicated email

Given a user already exists with the submitted email  
When a visitor submits registration with that same email  
Then the system rejects the request.

---

### Requirement: Users can login

The system SHALL allow registered users and admins to login using valid credentials.

#### Scenario: User logs in successfully

Given a registered user submits valid credentials  
When the backend validates the credentials  
Then the system returns a JWT token  
And the token contains the user role.

#### Scenario: Login rejects invalid password

Given a registered user submits an incorrect password  
When the backend validates the credentials  
Then the system rejects the request with an authentication error.

---

### Requirement: Authenticated users can fetch their session

The system SHALL provide an endpoint to fetch the authenticated user session.

#### Scenario: Authenticated user fetches current session

Given a valid JWT token  
When the user requests `/api/auth/me`  
Then the system returns the current user without sensitive fields.

#### Scenario: Anonymous user fetches current session

Given no JWT token  
When the user requests `/api/auth/me`  
Then the system rejects the request.

---

### Requirement: Admin routes require admin role

The system SHALL restrict admin routes to authenticated users with role `admin`.

#### Scenario: Admin accesses admin route

Given an authenticated user with role `admin`  
When the user accesses an admin route  
Then the system allows the request.

#### Scenario: Common user accesses admin route

Given an authenticated user with role `user`  
When the user accesses an admin route  
Then the system rejects the request.

#### Scenario: Anonymous user accesses admin route

Given no authenticated user  
When the visitor accesses an admin route  
Then the system rejects the request.

---

### Requirement: Frontend protects private routes

The frontend SHALL protect private user routes and admin routes according to authentication state and role.

#### Scenario: Anonymous visitor enters user private route

Given a visitor without token  
When the visitor opens `/mi-cuenta`  
Then the frontend redirects to login.

#### Scenario: Common user enters admin route

Given an authenticated user with role `user`  
When the user opens `/admin`  
Then the frontend blocks access.

#### Scenario: Admin enters admin route

Given an authenticated user with role `admin`  
When the admin opens `/admin`  
Then the frontend allows access.