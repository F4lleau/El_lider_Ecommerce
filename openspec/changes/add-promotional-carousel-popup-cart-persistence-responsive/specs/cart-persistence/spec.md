# cart-persistence Specification

## ADDED Requirements

### Requirement: Guest cart persistence

The system SHALL persist guest cart contents locally until checkout completion or explicit removal.

#### Scenario: Guest leaves and returns

- GIVEN a guest adds products to the cart
- WHEN the guest closes and reopens the browser
- THEN the cart SHALL restore the previously added products from local storage

#### Scenario: Guest removes item

- GIVEN a guest has products in the cart
- WHEN the guest removes a product
- THEN the persisted cart SHALL be updated

### Requirement: Authenticated cart persistence

The system SHALL persist authenticated user carts in the backend.

#### Scenario: User logs out before checkout

- GIVEN an authenticated user has products in the cart
- WHEN the user logs out before completing checkout
- THEN the backend cart SHALL remain persisted for that user

#### Scenario: User logs back in

- GIVEN a user previously had an unfinished cart
- WHEN the user logs back in
- THEN the app SHALL restore the user cart from the backend

### Requirement: Guest cart sync on login

The system SHALL sync guest cart contents into the authenticated user cart on login.

#### Scenario: Guest cart merges with user cart

- GIVEN a guest has products in local cart
- AND the user logs in
- WHEN the session is established
- THEN the system SHALL merge the guest cart with the authenticated cart

#### Scenario: Same product exists in both carts

- GIVEN the same product exists in guest cart and backend user cart
- WHEN the carts are merged
- THEN the system SHALL combine quantities safely according to stock availability

### Requirement: Cart prices and stock are validated

The system SHALL validate stock and prices from the backend before checkout.

#### Scenario: Product price changed

- GIVEN a product price changed after it was added to cart
- WHEN the user proceeds to checkout
- THEN the backend SHALL recalculate totals using current prices

#### Scenario: Product stock is insufficient

- GIVEN cart quantity exceeds available stock
- WHEN the user proceeds to checkout
- THEN the system SHALL prevent checkout and show a clear message