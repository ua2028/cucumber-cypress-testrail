Feature: Adding Asset

#Background:

Scenario: C1 Should show error with invalid ISIN
 Given I navigate add asset page
    And I see field to add asset
    And I type 'SIN0000000010'
    And I click add Asset
   Then I see validation error message

Scenario: C2 Should add new asset with valid ISIN
 Given I navigate add asset page
    And I see field to add asset
    And I type 'ISIN0000000015'
    And I click add Asset
   Then I see new asset is successfully added

Scenario: C3 I see error message that assets exists
 Given I navigate add asset page
    And I see field to add asset
    And I type existing asset 'ISIN0000000015'
    And I click add Asset
   Then I see error message that assets exists

#  Scenario: Should show error with valid ISIN and spaces
#  Scenario: Should show error with submiting with an empty input
#  Scenario: Should not send request with an invalid ISIN
#  Scenario: Should not send request with an empty input

# no validation on addAsset api, test for api?
# check for mobile


