require "test_helper"

class Api::V1::AlbumsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_albums_url
    assert_response :success
  end

  test "should get songs for an album" do
    album = albums(:one)
    get songs_api_v1_album_url(album)
    assert_response :success
  end
end
