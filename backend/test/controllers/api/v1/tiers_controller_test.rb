require "test_helper"

class Api::V1::TiersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_tiers_url
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal Tier.count, json_response.length
  end
end
