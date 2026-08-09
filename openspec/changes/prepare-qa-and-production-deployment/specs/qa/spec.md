# QA Environment Spec Delta

## ADDED Requirements

### Requirement: QA environment can be shared with client

The system SHALL provide a QA URL that can be shared with the client for testing.

#### Scenario: Client opens QA link

Given the QA frontend is deployed  
When the client opens the QA URL  
Then the storefront loads publicly.

---

### Requirement: QA database is separate from production

The system SHALL use a separate database for QA.

#### Scenario: QA order is created

Given a client tests checkout in QA  
When an order is created  
Then the data is stored in the QA database  
And production data is not affected.

---

### Requirement: QA checklist exists

The system SHALL provide a manual QA checklist covering critical MVP flows.

#### Scenario: QA checklist is used

Given a tester validates the application  
When they open the QA checklist  
Then they can follow public, auth, checkout, payment, account and admin flows.