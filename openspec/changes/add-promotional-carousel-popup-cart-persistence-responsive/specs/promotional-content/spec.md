# promotional-content Specification

## ADDED Requirements

### Requirement: Public promotional carousel

The system SHALL provide a public promotional carousel for the storefront home.

#### Scenario: Active slides are displayed

- GIVEN there are active promotional slides within their valid date range
- WHEN a visitor opens the home page
- THEN the storefront SHALL display those slides in priority order

#### Scenario: Featured event promotion appears first

- GIVEN there is an active featured event promotion
- AND the current date is within its valid range
- WHEN the home carousel loads
- THEN the featured event promotion SHALL appear before normal promotions

#### Scenario: Slide CTA navigates correctly

- GIVEN a promotional slide has a configured CTA
- WHEN the user clicks the CTA
- THEN the app SHALL navigate to the configured destination

#### Scenario: No active slides

- GIVEN there are no active promotional slides
- WHEN the home page loads
- THEN the app SHALL show a fallback hero or default promotional section

### Requirement: Admin promotional carousel management

The system SHALL allow ADMIN users to manage promotional slides.

#### Scenario: Admin creates a slide

- GIVEN an authenticated ADMIN user
- WHEN the admin creates a promotional slide with valid data
- THEN the slide SHALL be saved and available according to its active status and date range

#### Scenario: Non-admin cannot create slide

- GIVEN a non-admin user
- WHEN the user attempts to create a promotional slide
- THEN the system SHALL reject the request

#### Scenario: Admin disables slide

- GIVEN an existing active promotional slide
- WHEN the admin disables it
- THEN it SHALL no longer appear in the public carousel

### Requirement: Promotional pop-up

The system SHALL provide an administrable promotional pop-up for special campaigns.

#### Scenario: Active popup appears

- GIVEN there is an active popup within its valid date range
- WHEN a visitor enters a configured page
- THEN the popup SHALL appear according to its frequency rules

#### Scenario: User closes popup

- GIVEN the popup is visible
- WHEN the user closes it
- THEN the system SHALL store that interaction and avoid showing it again according to the configured frequency

#### Scenario: Popup CTA works

- GIVEN a popup has a CTA
- WHEN the user clicks the CTA
- THEN the app SHALL navigate to the configured destination

#### Scenario: Popup is mobile friendly

- GIVEN the user opens the site from a mobile device
- WHEN the popup appears
- THEN it SHALL fit the viewport and provide a visible close action