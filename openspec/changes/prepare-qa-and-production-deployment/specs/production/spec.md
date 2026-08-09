# Production Deployment Spec Delta

## ADDED Requirements

### Requirement: Production deployment path is documented

The system SHALL document the steps needed to move from QA to production.

#### Scenario: Production guide is reviewed

Given QA is validated  
When production deployment is planned  
Then required URLs, variables, database and credentials are documented.

---

### Requirement: Production uses production secrets

The system SHALL require production-specific secrets and credentials.

#### Scenario: Production variables are configured

Given production deployment is configured  
When environment variables are set  
Then production uses production database, JWT secret and payment credentials.

---

### Requirement: Production is not published before QA validation

The system SHOULD only be published after QA validation and client corrections.

#### Scenario: QA has unresolved issues

Given QA has unresolved critical issues  
When production deployment is considered  
Then the system should not be promoted to production yet.