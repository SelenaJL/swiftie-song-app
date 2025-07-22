require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "should be valid" do
    user = User.new(name: "Test User", email: "test@example.com", password: "password", password_confirmation: "password")
    assert user.valid?
  end

  test "should require a name" do
    user = User.new(email: "test@example.com", password: "password", password_confirmation: "password")
    assert_not user.valid?
    assert_includes user.errors[:name], "can't be blank"
  end

  test "should require an email" do
    user = User.new(name: "Test User", password: "password", password_confirmation: "password")
    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
  end

  test "should enforce unique email" do
    User.create(name: "Existing User", email: "unique@example.com", password: "password", password_confirmation: "password")
    user = User.new(name: "New User", email: "unique@example.com", password: "password", password_confirmation: "password")
    assert_not user.valid?
    assert_includes user.errors[:email], "has already been taken"
  end
end
