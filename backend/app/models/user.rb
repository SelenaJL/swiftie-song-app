class User < ApplicationRecord
  has_many :rankings
  has_secure_password
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  def spotify_token_expired?
    spotify_token_expires_at && spotify_token_expires_at < Time.now
  end

  def refresh_spotify_token!
    uri = URI.parse("https://accounts.spotify.com/api/token")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri)
    request.set_form_data(
      grant_type: "refresh_token",
      refresh_token: spotify_refresh_token,
      client_id: Rails.application.credentials.spotify_client_id,
    )
    response = http.request(request)
    token_data = JSON.parse(response.body)

    if token_data["access_token"]
      user.update!(
        spotify_access_token: token_data["access_token"],
        spotify_refresh_token: token_data["refresh_token"],
        spotify_token_expires_at: Time.now + token_data["expires_in"].to_i.seconds
      )
    end
  end
end
