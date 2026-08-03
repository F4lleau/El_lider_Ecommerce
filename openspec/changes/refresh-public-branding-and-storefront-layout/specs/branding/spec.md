# Branding Refresh Spec Delta

## ADDED Requirements

### Requirement: Public branding reflects the real business identity

The system SHALL present the store as “El Líder” with branding aligned to the real business references.

#### Scenario: Public brand is displayed

Given a user visits the public storefront
When the branding is displayed
Then the user sees “El Líder” as the main brand
And the visual identity is aligned with the real store references.

---

### Requirement: Main claim uses “Todo en insumos”

The system SHALL use “Todo en insumos” as the main claim instead of “Todo para crear”.

#### Scenario: Brand subtitle is displayed

Given the user sees the main brand or hero area
When supporting brand text is shown
Then the claim displayed is “Todo en insumos”.

---

### Requirement: Store is presented as a multipurpose wholesale business

The system SHALL communicate the store as a polirrubro mayorista rather than focusing only on disposable products.

#### Scenario: Public description is displayed

Given the user sees the public presentation of the business
When descriptive text is shown
Then the store is communicated as a wholesale multipurpose supplier
And may include core supply categories such as descartables, repostería, panificación, limpieza y golosinas.