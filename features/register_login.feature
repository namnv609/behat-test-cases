Feature: Register and Login CVox
	Register and Login

	@javascript
	Scenario: Register with null value
		Given I go to "/agent/register"
		When I press "登録"
		And I wait for "3" seconds
		Then I should get all message

	@javascript
	Scenario: Register with full info
		Given I go to "/agent/register"
		When I fill in the following:
			| last_name | User |
			| first_name | Test |
			| career_period | 1 |
			| email | testuser@gmail.com |
			| email_agent | testuser@gmail.com |
			| password | 12345678 |
			| confirmed_password | 12345678 |
		And I press "登録"
		And I wait for "2" seconds
		Then I should see "エージェントを登録しました"
	
	@javascript
	Scenario: Login with info has registered
		Given I go to "/agent/login"
		When I fill in the following:
			| email | testuser@gmail.com |
			| password | 12345678 |
		And I press "ログイン"
		And I wait for "3" seconds
		Then I should see "testuser@gmail.com"