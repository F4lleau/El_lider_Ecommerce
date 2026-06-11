# Cart Spec Delta

## ADDED Requirements

### Requirement: Guest users can add products to cart

The system SHALL allow visitors to add active products to a cart without authentication.

#### Scenario: Guest adds active product

Given a visitor is viewing an active product with stock  
When the visitor clicks "Agregar al carrito"  
Then the product is added to the guest cart  
And the cart counter is updated.

#### Scenario: Guest tries to add product without stock

Given a visitor is viewing a product without stock  
When the visitor tries to add the product to cart  
Then the system prevents the action  
And displays a clear message.

---

### Requirement: Guest cart persists locally

The system SHALL persist guest cart data locally.

#### Scenario: Guest refreshes page

Given a guest has products in the cart  
When the guest refreshes the page  
Then the cart still contains the products.

---

### Requirement: Authenticated users have backend cart

The system SHALL persist authenticated user carts in the backend.

#### Scenario: User adds product to cart

Given an authenticated user is viewing an active product with stock  
When the user adds the product to cart  
Then the backend stores the item in the user's cart.

#### Scenario: User reloads page

Given an authenticated user has items in the cart  
When the user reloads the page  
Then the cart is loaded from the backend.

---

### Requirement: Guest cart syncs after login

The system SHALL sync guest cart items with the authenticated user's backend cart after login.

#### Scenario: Guest logs in with local cart

Given a guest has products in local cart  
When the guest logs in successfully  
Then the system syncs the local cart with the user's backend cart  
And clears the local cart after successful sync.

#### Scenario: Product already exists in user cart

Given a product exists in both local cart and backend cart  
When the sync runs  
Then the system merges quantities  
And does not create duplicate items.

---

### Requirement: Backend validates stock and price

The system SHALL use the backend as the source of truth for product price, availability and stock.

#### Scenario: Cart subtotal is calculated

Given a cart contains products  
When the cart is requested  
Then the backend calculates subtotal using current product prices.

#### Scenario: Product price changed

Given a product price changed after it was added to cart  
When the cart is requested or validated  
Then the system uses the current backend price.

---

### Requirement: Users can manage cart items

The system SHALL allow users to update quantities, remove items and clear the cart.

#### Scenario: User updates quantity

Given a cart item exists  
When the user changes the quantity  
Then the system updates the item  
And recalculates subtotal.

#### Scenario: User removes item

Given a cart item exists  
When the user removes the item  
Then the item no longer appears in the cart.

#### Scenario: User clears cart

Given the cart contains items  
When the user clears the cart  
Then the cart becomes empty.