class User < ApplicationRecord
  has_many :rankings
  has_secure_password
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  def spotify_token_expired?
    spotify_token_expires_at < Time.now
  end

  def refresh_spotify_token!
    new_token_info = RSpotify.get_new_access_token(spotify_refresh_token) # TODO: Don't use RSpotify???
    update!(
      spotify_access_token: new_token_info['access_token'],
      spotify_token_expires_at: Time.now + new_token_info['expires_in'].seconds
    )
  end
end
