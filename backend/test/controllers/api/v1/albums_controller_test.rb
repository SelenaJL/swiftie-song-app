require "test_helper"

class Api::V1::AlbumsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_albums_url
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal Album.count, json_response.length
  end

  test "should get show" do
    album = albums(:one)
    get api_v1_album_url(album)
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal album.title, json_response['title']
  end

  test "should get songs for an album" do
    album = albums(:one)
    get songs_api_v1_album_url(album)
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal album.songs.count, json_response.length
  end
end
