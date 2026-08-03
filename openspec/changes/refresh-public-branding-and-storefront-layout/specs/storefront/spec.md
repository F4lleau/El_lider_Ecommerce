# Storefront Content Refresh Spec Delta

## ADDED Requirements

### Requirement: Public storefront content uses updated commercial copy

The system SHALL update public-facing copy to match the business identity and supply categories.

#### Scenario: Home copy is displayed

Given a user visits the home page
When the main commercial copy is shown
Then the storefront uses updated business-oriented copy
And includes “Todo en insumos” or equivalent messaging.

---

### Requirement: Footer displays business hours

The system SHALL display the store opening hours in the footer.

#### Scenario: Footer hours are displayed

Given a user views the footer
When operating hours are shown
Then the user sees:
- lunes a sábado
- 8:00 a 12:30
- 16:30 a 20:30

---

### Requirement: Footer displays store location

The system SHALL display the real business location in the footer.

#### Scenario: Footer location is displayed

Given a user views the footer
When the address is shown
Then the user sees:
- Av. Manuel Belgrano, La Leonesa, Chaco
- Frente del salón ex fantasía