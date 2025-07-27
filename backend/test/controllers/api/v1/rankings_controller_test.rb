require "test_helper"

class Api::V1::RankingsControllerTest < ActionDispatch::IntegrationTest
  setup do 
    @user1 = users(:one)
    @user2 = users(:two)
    @token1 = JWT.encode({ user_id: @user1.id }, Rails.application.credentials.secret_key_base)
    @token2 = JWT.encode({ user_id: @user2.id }, Rails.application.credentials.secret_key_base)
    @tier = tiers(:one)
    @song = songs(:album_one_b)
    @ranking = rankings(:user_one_album_one_b)
    @album = albums(:one)
  end

  test "should create ranking" do
    assert_difference('Ranking.count') do
      post api_v1_rankings_url, params: { ranking: { song_id: @song.id, tier_id: @tier.id } }, headers: { 'Authorization' => @token2 }
    end
    assert_response :created
    json_response = JSON.parse(@response.body)
    assert_equal @song.id, json_response['song_id']
    assert_equal @tier.id, json_response['tier_id']
    assert_equal @user2.id, json_response['user_id']
  end

  test "create ranking fails without user" do
    assert_no_difference('Ranking.count') do
      post api_v1_rankings_url, params: { ranking: { song_id: @song.id, tier_id: @tier.id } }
    end
    assert_response :unauthorized
  end

  test "should update ranking" do
    assert_not_equal @tier.id, @ranking.reload.tier_id
    patch api_v1_ranking_url(@ranking), params: { ranking: { tier_id: @tier.id } }, headers: { 'Authorization' => @token1 }
    assert_response :ok
    json_response = JSON.parse(@response.body)
    assert_equal @ranking.id, json_response['id']
    assert_equal @tier.id, json_response['tier_id']
    assert_equal @tier.id, @ranking.reload.tier_id
  end

  test "update ranking fails for incorrect user" do
    patch api_v1_ranking_url(@ranking), params: { ranking: { tier_id: @tier.id } }, headers: { 'Authorization' => @token2 }
    assert_response :not_found
  end

  test "update ranking fails without user" do
    patch api_v1_ranking_url(@ranking), params: { ranking: { tier_id: @tier.id } }
    assert_response :unauthorized
  end

  test "should get index for a specific album" do
    get api_v1_album_rankings_url(@album), headers: { 'Authorization' => @token1 }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal Ranking.where(album_id: @album.id, user_id: @user1.id).count, json_response.length
    assert_equal @ranking.id, json_response[0]['id']
  end

  test "getting index for a specific album fails without user" do
    get api_v1_album_rankings_url(@album)
    assert_response :unauthorized
  end

  test "should destroy ranking" do
    assert_difference('Ranking.count', -1) do
      delete api_v1_ranking_url(@ranking), headers: { 'Authorization' => @token1 }
    end
    assert_response :no_content
  end

  test "destroy ranking fails for incorrect user" do
    assert_no_difference('Ranking.count') do
      delete api_v1_ranking_url(@ranking), headers: { 'Authorization' => @token2 }
    end
    assert_response :not_found
  end

  test "destroy ranking fails without user" do
    assert_no_difference('Ranking.count') do
      delete api_v1_ranking_url(@ranking)
    end
    assert_response :unauthorized
  end
end