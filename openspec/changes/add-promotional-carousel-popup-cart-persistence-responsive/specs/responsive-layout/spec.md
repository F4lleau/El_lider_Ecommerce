# responsive-layout Specification

## ADDED Requirements

### Requirement: Storefront responsive layout

The storefront SHALL be usable on mobile, tablet and desktop.

#### Scenario: Mobile home

- GIVEN a user opens the home page on a mobile device
- WHEN the page loads
- THEN the header, promotional carousel, category cards and product sections SHALL fit the viewport without horizontal scroll

#### Scenario: Mobile carousel

- GIVEN a user opens the carousel on mobile
- WHEN slides are displayed
- THEN the carousel SHALL not occupy the entire screen height and SHALL provide readable text and tappable CTA

#### Scenario: Mobile product listing

- GIVEN a user opens product listing on mobile
- WHEN products are displayed
- THEN product cards, filters and actions SHALL be usable without layout overflow

#### Scenario: Mobile checkout

- GIVEN a user opens checkout on mobile
- WHEN the checkout form is displayed
- THEN all fields and actions SHALL be readable and tappable

### Requirement: Admin responsive baseline

The admin panel SHALL remain usable on tablet and basic mobile widths for essential actions.

#### Scenario: Admin opens promotional content section on tablet

- GIVEN an ADMIN user opens the promotional content section on tablet
- WHEN the list and forms are displayed
- THEN the admin SHALL be able to create, edit, activate and deactivate promotions

### Requirement: No horizontal overflow

The app SHALL avoid unintended horizontal scrolling.

#### Scenario: Small viewport

- GIVEN a viewport width of 360px
- WHEN the user navigates through public pages
- THEN the app SHALL not produce unintended horizontal overflow