# Stock Request Email Spec Delta 
## ADDED Requirements 

### Requirement: Stock request notification email is sent 
The system SHALL send an email when a stock request is marked as notified or contacted and the request has an email. 

#### Scenario: Stock request is notified 

Given a stock request has an email When admin marks the request as `NOTIFIED` Then the system sends a stock available notification email. 

#### Scenario: Stock request has no email 

Given a stock request does not have an email When admin marks the request as `NOTIFIED` Then the system skips email sending And the status update remains successful. --- 

### Requirement: Stock notification email includes product information 

The system SHALL include product information in stock request notification emails. 

#### Scenario: Email is sent 

Given a stock request notification email is sent When the user receives it Then the email includes the product name And a product link if available.