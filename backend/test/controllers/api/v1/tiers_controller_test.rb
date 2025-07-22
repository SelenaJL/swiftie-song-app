require "test_helper"

class Api::V1::TiersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_tiers_url
    assert_response :success
  end
end
