require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get album summaries for current user" do
    user = users(:one)
    token = JWT.encode({ user_id: user.id }, Rails.application.credentials.secret_key_base)
    get api_v1_me_album_summaries_url, headers: { 'Authorization' => token }
    assert_response :success

    json_response = JSON.parse(@response.body)
    assert_equal Album.count, json_response.length

    json_response.each do |album_summary|
      validate_album_summary(album_summary, user.id)
    end
  end

  test "should not get album summaries without user" do
    get api_v1_me_album_summaries_url
    assert_response :unauthorized
  end

  private

  def tier_values
    @tier_values ||= Tier.all.pluck(:id, :value).to_h
  end

  def validate_album_summary(album_summary, user_id)
    album = Album.find(album_summary['album_id'])
    album_song_count = album.song_count
    album_rankings = album.rankings.where(user_id: user_id)
    max_tier_value = tier_values.values.max
    expected_score = (album_rankings.sum { |ranking| tier_values[ranking.tier_id] }.to_f / (max_tier_value * album_song_count) * 100).round(2)

    tier_values.keys.each do |tier_id|
      count = album_rankings.where(tier_id: tier_id).count
      percentage = (count.to_f / album_song_count * 100).round(2)
      assert_equal({ "count" => count, "percentage" => percentage }, album_summary['tier_breakdown'][tier_id.to_s])
    end

    assert_equal album.id, album_summary['album_id']
    assert_equal album.title, album_summary['album_title']
    assert_equal album.color, album_summary['album_color']
    assert_equal album_song_count, album_summary['song_count']
    assert_equal album_song_count - album_rankings.size, album_summary['unranked_count']
    assert_equal expected_score, album_summary['score']
  end
end