require "test_helper"

class RankingTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @song = songs(:album_one_a)
    @tier = tiers(:one)
  end

  test "should be valid and set album id based on song" do
    new_user = User.new(name: "Test User", email: "test@example.com", password: "password", password_confirmation: "password")
    ranking = Ranking.new(user: new_user, song: @song, tier: @tier)
    assert ranking.valid?
    assert_equal @song.album_id, ranking.album_id
  end

  test "should require a user" do
    ranking = Ranking.new(song: @song, tier: @tier)
    assert_not ranking.valid?
    assert_includes ranking.errors[:user], "must exist"
  end

  test "should require a song" do
    ranking = Ranking.new(user: @user, tier: @tier)
    assert_not ranking.valid?
    assert_includes ranking.errors[:song], "must exist"
  end

  test "should require a tier" do
    ranking = Ranking.new(user: @user, song: @song)
    assert_not ranking.valid?
    assert_includes ranking.errors[:tier], "must exist"
  end

  test "should enforce unique ranking per song and user" do
    ranking = Ranking.new(user: @user, song: @song, tier: @tier)
    assert_not ranking.valid?
    assert_includes ranking.errors[:song_id], "can only have one ranking per user"
  end
end
