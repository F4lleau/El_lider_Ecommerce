# Mercado Pago Webhooks Spec Delta

## ADDED Requirements

### Requirement: Webhook processes Mercado Pago payment events

The system SHALL receive Mercado Pago payment notifications and update internal payment records.

#### Scenario: Approved payment webhook

Given Mercado Pago sends an approved payment notification  
When the webhook is processed  
Then the system verifies the payment with Mercado Pago  
And updates the related order and payment.

#### Scenario: Pending payment webhook

Given Mercado Pago sends a pending payment notification  
When the webhook is processed  
Then the system stores the payment as pending or in process  
And keeps the order as pending payment.

#### Scenario: Rejected payment webhook

Given Mercado Pago sends a rejected payment notification  
When the webhook is processed  
Then the system stores the payment as rejected  
And allows payment retry.

---

### Requirement: Webhook processing is idempotent

The system SHALL process duplicated Mercado Pago webhook notifications safely.

#### Scenario: Duplicate approved webhook

Given an approved payment webhook was already processed  
When the same notification is received again  
Then the system does not duplicate payment records  
And does not decrease stock again.

---

### Requirement: Webhook signature can be validated

The system SHALL validate Mercado Pago webhook signature when `MERCADOPAGO_WEBHOOK_SECRET` is configured.

#### Scenario: Secret configured

Given `MERCADOPAGO_WEBHOOK_SECRET` is configured  
When a webhook is received  
Then the system validates the signature before processing.

#### Scenario: Secret missing in local test

Given `MERCADOPAGO_WEBHOOK_SECRET` is empty in local test  
When a mocked webhook test runs  
Then the system may bypass signature validation  
And documents this limitation.