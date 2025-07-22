require "test_helper"

class TierTest < ActiveSupport::TestCase
  test "should be valid" do
    tier = Tier.new(name: "S Tier", description: "Top tier songs", value: 5)
    assert tier.valid?
  end

  test "should require a name" do
    tier = Tier.new(description: "Top tier songs", value: 5)
    assert_not tier.valid?
    assert_includes tier.errors[:name], "can't be blank"
  end

  test "should require a description" do
    tier = Tier.new(name: "S Tier", value: 5)
    assert_not tier.valid?
    assert_includes tier.errors[:description], "can't be blank"
  end

  test "should require a value" do
    tier = Tier.new(name: "S Tier", description: "Top tier songs")
    assert_not tier.valid?
    assert_includes tier.errors[:value], "can't be blank"
  end
end
