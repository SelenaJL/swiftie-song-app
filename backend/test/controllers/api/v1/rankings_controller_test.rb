require "test_helper"

class Api::V1::RankingsControllerTest < ActionDispatch::IntegrationTest
  setup do 
    @user = users(:one)
    @token = JWT.encode({ user_id: @user.id }, Rails.application.credentials.secret_key_base)
    @tier = tiers(:two)
    @song = songs(:two)
    @ranking = rankings(:user_one_song_one)
    @album = albums(:one)
  end

  test "should create ranking" do
    assert_difference('Ranking.count') do
      post api_v1_rankings_url, params: { ranking: { song_id: @song.id, tier_id: @tier.id } }, headers: { 'Authorization' => @token }
    end
    assert_response :created
    json_response = JSON.parse(@response.body)
    assert_equal @song.id, json_response['song_id']
    assert_equal @tier.id, json_response['tier_id']
    assert_equal @user.id, json_response['user_id']
  end

  test "create ranking fails without user" do
    assert_no_difference('Ranking.count') do
      post api_v1_rankings_url, params: { ranking: { song_id: @song.id, tier_id: @tier.id } }
    end
    assert_response :unauthorized
  end

  test "should update ranking" do
    assert_not_equal @tier.id, @ranking.reload.tier_id
    patch api_v1_ranking_url(@ranking), params: { ranking: { tier_id: @tier.id } }, headers: { 'Authorization' => @token }
    assert_response :ok
    json_response = JSON.parse(@response.body)
    assert_equal @ranking.id, json_response['id']
    assert_equal @tier.id, json_response['tier_id']
    assert_equal @tier.id, @ranking.reload.tier_id
  end

  test "update ranking fails for incorrect user" do
    user = users(:two)
    token = JWT.encode({ user_id: user.id }, Rails.application.credentials.secret_key_base)
    patch api_v1_ranking_url(@ranking), params: { ranking: { tier_id: @tier.id } }, headers: { 'Authorization' => token }
    assert_response :not_found
  end

  test "update ranking fails without user" do
    patch api_v1_ranking_url(@ranking), params: { ranking: { tier_id: @tier.id } }
    assert_response :unauthorized
  end

  test "should get index for a specific album" do
    get api_v1_album_rankings_url(@album), headers: { 'Authorization' => @token }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 1, json_response.length
    assert_equal @ranking.id, json_response[0]['id']
  end

  test "getting index for a specific album fails without user" do
    get api_v1_album_rankings_url(@album)
    assert_response :unauthorized
  end
end