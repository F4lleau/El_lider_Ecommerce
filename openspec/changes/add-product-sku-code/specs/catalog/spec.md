# Product SKU Code Spec Delta

## ADDED Requirements

### Requirement: Products have an internal SKU code

The system SHALL support an internal product code using the field `sku`.

#### Scenario: Product has SKU

Given a product has a SKU
When the product is requested from the API
Then the response includes the product SKU.

#### Scenario: Product has no SKU

Given a product has no SKU
When the product is requested from the API
Then the response remains valid
And the SKU is null or omitted according to API conventions.

---

### Requirement: SKU is unique

The system SHALL prevent duplicate product SKUs.

#### Scenario: Admin creates product with unique SKU

Given an admin submits a product with a unique SKU
When the product is created
Then the product is saved with that SKU.

#### Scenario: Admin creates product with duplicate SKU

Given a product already exists with SKU `REP-CHOCO-001`
When an admin creates another product with the same SKU
Then the system rejects the request.

#### Scenario: Admin updates product with duplicate SKU

Given two products exist
When an admin updates one product using the other product's SKU
Then the system rejects the request.

---

### Requirement: Admin can manage SKU

The system SHALL allow admins to create and edit product SKU from the admin panel.

#### Scenario: Admin creates product with SKU

Given an authenticated admin
When the admin fills the product form with SKU
Then the SKU is sent to the backend
And saved in the product.

#### Scenario: Admin edits SKU

Given an existing product
When the admin changes the SKU
Then the product is updated with the new SKU.

---

### Requirement: Admin can search products by SKU

The system SHALL allow admins to search products by SKU.

#### Scenario: Search by SKU

Given a product exists with SKU `REP-CHOCO-001`
When the admin searches for `REP-CHOCO-001`
Then the product appears in the results.

---

### Requirement: Product seed includes SKUs

The system SHALL seed products with unique SKU values.

#### Scenario: Seed products

Given the seed runs
When products are inserted or updated
Then each seeded product has a unique SKU.

---

### Requirement: Order items can store product SKU snapshot

The system SHOULD store the product SKU in order item snapshots.

#### Scenario: Checkout creates order item

Given a product has SKU `REP-CHOCO-001`
When checkout creates an order item
Then the order item stores `productSku` with value `REP-CHOCO-001`.

#### Scenario: Product SKU changes after order

Given an order item stored product SKU
When the product SKU changes later
Then the order item keeps the original product SKU snapshot.
