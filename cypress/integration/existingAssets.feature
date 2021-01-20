Feature: Existing Assets

#Background:

Scenario: C7 with no assets table should be empty
 Given I navigate existing asset page with 0 assets
    And I see table
  Then I see entries text of "Showing 0 entries"
  # table should be empty, not with the 'no matching record' which implies a search result message
  Then I see table with 0 rows

  Scenario: C8 table with 10 assets
    Given I navigate existing asset page with 10 assets
    Then I see entries text of "Showing 1 to 10 of 10 entries"
    Then I see table with 10 rows
    Then I see 1 result pages

  Scenario: C9 table with 50 assets
    Given I navigate existing asset page with 50 assets
    Then I see table with 10 rows
    Then I see entries text of "Showing 1 to 10 of 50 entries"
    Then I see 5 result pages

  Scenario: C10 table with 1 assets
    Given I navigate existing asset page with 1 assets
    Then I see table with 1 rows
    Then I see entries text of "Showing 1 to 1 of 1 entries"
    Then I see 1 result pages

# Scenario: initial texts are correct

# Scenario: search for exact match
# Scenario: search for partial match
# Scenario: search with capital letters
# Scenario: search with lowercase letters
# Scenario: search to narrow down and delete to see table fills again

# scenario: sort table by ascend on first results page should show ordered results by ascend
# scenario: sort table by descend  on first results page should show ordered results by descend
# scenario: sort table by ascend on second results page should stay on page 2
# scenario: sort table by descend  on second results page should stay on page 2
# scenario: on hover should highlights row


