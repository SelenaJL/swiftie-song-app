require 'net/http'
require 'uri'

class SpotifyController < ApplicationController
  # TODO: Create fronted routes for error handling.
  def callback
    code = params[:code]
    state = params[:state]

    # Verify state to prevent CSRF attacks and and clear stored state to prevent replay attacks
    # stored_state_info = session[:spotify_auth_state]
    # session.delete(:spotify_auth_state)

    stored_state_info = Rails.cache.read("spotify_auth")

    puts "stored state: #{stored_state_info}"
    puts "state: #{state}"

    # raise RuntimeError

    if stored_state_info.nil? || state != stored_state_info[:state]
      redirect_to "#{ENV['FRONTEND_URL']}/?spotify_connected=false&error=state_mismatch"
      return
    end

    user = User.find_by(id: stored_state_info[:user_id])

    unless user
      redirect_to "#{ENV['FRONTEND_URL']}/?spotify_connected=false&error=user_not_found"
      return
    end

    # Exchange the Spotify authorization code for an access token
    uri = URI.parse("https://accounts.spotify.com/api/token")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri)
    request.set_form_data(
      grant_type: "authorization_code",
      code: code,
      redirect_uri: ENV['SPOTIFY_REDIRECT_URI'],
      client_id: Rails.application.credentials.spotify_client_id,
      client_secret: Rails.application.credentials.spotify_client_secret
    )
    response = http.request(request)
    token_data = JSON.parse(response.body)

    if token_data["access_token"]
      user.update!(
        spotify_access_token: token_data["access_token"],
        spotify_refresh_token: token_data["refresh_token"],
        spotify_token_expires_at: Time.now + token_data["expires_in"].to_i.seconds
      )
      redirect_to "#{ENV['FRONTEND_URL']}/?spotify_connected=true"
    else
      redirect_to "#{ENV['FRONTEND_URL']}/?spotify_connected=false&error=#{token_data["error"]}"
    end
  end

  def callback2
    puts "IN CALLBACK 2"
  end
end
