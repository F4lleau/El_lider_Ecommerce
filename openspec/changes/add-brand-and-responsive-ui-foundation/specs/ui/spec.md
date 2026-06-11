# UI Spec Delta

## ADDED Requirements

### Requirement: Public frontend must be responsive

The frontend SHALL render correctly on mobile, tablet and desktop devices.

#### Scenario: User opens home on mobile

Given a visitor opens the home page on a mobile viewport  
When the page renders  
Then the content fits the screen  
And no horizontal scroll appears.

#### Scenario: User opens catalog on desktop

Given a visitor opens the product catalog on desktop  
When products are loaded  
Then products are displayed in a responsive grid.

---

### Requirement: Header must support desktop and mobile navigation

The system SHALL provide a usable header for desktop and mobile users.

#### Scenario: Visitor opens mobile menu

Given a visitor is using a mobile viewport  
When the visitor opens the navigation menu  
Then the menu displays the main navigation links.

#### Scenario: Cart counter is visible

Given the cart contains products  
When the header renders  
Then the cart counter displays the current item quantity.

---

### Requirement: Brand identity must be visually consistent

The system SHALL use a consistent visual identity across public pages.

#### Scenario: User navigates public pages

Given a visitor navigates home, catalog and cart  
When each page renders  
Then colors, buttons, spacing and typography remain consistent.

---

### Requirement: Product cards must be commercially clear

The system SHALL display product cards with clear image, name, price, offer state and add-to-cart action.

#### Scenario: Product is on offer

Given a product has an old price and current price  
When the product card renders  
Then the old price is visually crossed out  
And the current price is visually prominent.

#### Scenario: Product has no stock

Given a product has no stock  
When the product card renders  
Then the add-to-cart action is disabled  
And a clear no-stock state is shown.

---

### Requirement: Cart page must be clear and responsive

The system SHALL display cart contents in a clear responsive layout.

#### Scenario: Cart has items

Given the cart contains products  
When the user opens `/carrito`  
Then the page displays item list, quantity controls, subtotal and main actions.

#### Scenario: Cart is empty

Given the cart has no products  
When the user opens `/carrito`  
Then the page displays a friendly empty state  
And a call to continue shopping.