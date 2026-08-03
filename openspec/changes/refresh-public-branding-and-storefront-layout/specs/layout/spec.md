# Public Layout Refresh Spec Delta

## ADDED Requirements

### Requirement: Header and footer remain visually consistent

The system SHALL maintain a coherent visual language between header and footer.

#### Scenario: Public layout is displayed

Given a user opens the storefront
When the header and footer are displayed
Then both sections share a harmonious style, colors and branding.

---

### Requirement: Home hero is more compact

The system SHALL reduce the visual height of the home hero so the catalog becomes visible sooner.

#### Scenario: Home opens on desktop

Given a user opens the home page
When the hero is rendered
Then the hero occupies less height than the previous version
And the catalog or product sections become visible with less scrolling.

#### Scenario: Home opens on mobile

Given a user opens the home page on mobile
When the hero is rendered
Then it remains compact, readable and visually balanced.

---

### Requirement: Footer includes real business information

The system SHALL display real contact and business information in the footer.

#### Scenario: Footer is displayed

Given a user reaches the footer
When business information is shown
Then the footer includes the store location and operating hours.