# Deployment Preparation Spec Delta

## ADDED Requirements

### Requirement: Project documents environment separation

The system SHALL document separate local, QA and production environments.

#### Scenario: Deployment guide is read

Given a developer opens the deployment guide  
When environment setup is reviewed  
Then local, QA and production environments are described separately.

---

### Requirement: Frontend and backend environment variables are separated

The system SHALL document which variables belong to frontend and which belong to backend.

#### Scenario: Environment variables are reviewed

Given a developer configures deployment  
When variables are read  
Then frontend only contains public variables  
And backend contains secrets.

---

### Requirement: QA uses public deployment URLs

The system SHALL define public URLs for QA frontend and backend.

#### Scenario: QA is configured

Given QA deployment is prepared  
When URLs are configured  
Then frontend QA points to backend QA  
And backend QA allows frontend QA through CORS.