require "test_helper"

class AlbumTest < ActiveSupport::TestCase
  test "should be valid" do
    album = Album.new(title: "Test Album", release_year: 2023, color: "blue")
    assert album.valid?
  end

  test "should require a title" do
    album = Album.new(release_year: 2023, color: "blue")
    assert_not album.valid?
    assert_includes album.errors[:title], "can't be blank"
  end

  test "should require a release year" do
    album = Album.new(title: "Test Album", color: "blue")
    assert_not album.valid?
    assert_includes album.errors[:release_year], "can't be blank"
  end

  test "#song_count should return the number of song associations" do
    album = albums(:one)
    assert_equal Song.where(album_id: album.id).count, album.song_count
  end
end
