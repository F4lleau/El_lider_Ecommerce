# Catalog Spec Delta

## MODIFIED Requirements

### Requirement: Broken encoding must not appear

The system SHALL display all Spanish text using valid UTF-8 characters in frontend source files, backend source files, seeds, API responses and database records.

#### Scenario: Source code contains valid Spanish text

Given the project source files are searched for broken characters  
When the search excludes binary assets and dependencies  
Then no broken encoding text is found in frontend or backend source files.

#### Scenario: API returns valid Spanish text

Given the backend is running  
When public product and category endpoints are requested  
Then the API responses return Spanish text with valid UTF-8 characters.

#### Scenario: Category text renders correctly

Given a label contains "Categorías"  
When the page renders  
Then the text appears as "Categorías"  
And not as "CategorÃ­as".

#### Scenario: Login text renders correctly

Given a label contains "Iniciar Sesión"  
When the page renders  
Then the text appears as "Iniciar Sesión"  
And not as "Iniciar SesiÃ³n".

#### Scenario: Bakery text renders correctly

Given a label contains "Repostería"  
When the page renders  
Then the text appears as "Repostería"  
And not as "ReposterÃ­a".