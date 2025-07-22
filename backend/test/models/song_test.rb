require "test_helper"

class SongTest < ActiveSupport::TestCase
  setup do
    @album = albums(:one)
  end

  test "should be valid" do
    song = Song.new(title: "Test Song", album: @album)
    assert song.valid?
  end

  test "should require a title" do
    song = Song.new(album: @album)
    assert_not song.valid?
    assert_includes song.errors[:title], "can't be blank"
  end

  test "should require an album" do
    song = Song.new(title: "Test Song")
    assert_not song.valid?
    assert_includes song.errors[:album], "must exist"
  end

  test "should enforce unique title within album" do
    Song.create(title: "Existing Song", album: @album)
    song = Song.new(title: "Existing Song", album: @album)
    assert_not song.valid?
    assert_includes song.errors[:title], "should be unique within the same album"
  end
end
