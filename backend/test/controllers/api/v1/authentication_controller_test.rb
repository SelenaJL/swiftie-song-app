require "test_helper"

class Api::V1::AuthenticationControllerTest < ActionDispatch::IntegrationTest
  test "should register a new user" do
    assert_difference('User.count') do
      post api_v1_register_url, params: { name: "Test User", email: "test@example.com", password: "password", password_confirmation: "password" }
    end
    assert_response :created
  end

  test "should login a user" do
    user = users(:one)
    post api_v1_login_url, params: { email: user.email, password: "password" }
    assert_response :ok
    assert_not_nil JSON.parse(@response.body)['token']
  end
end
