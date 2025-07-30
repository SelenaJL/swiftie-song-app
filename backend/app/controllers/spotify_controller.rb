require 'net/http'
require 'uri'

class SpotifyController < ApplicationController
  def callback
    code = params[:code]
    state = params[:state]

    # TODO: Verify the 'state' parameter to prevent CSRF attacks.
    # This will require storing the state on the frontend and comparing it here.

    auth_token = state.split("token=", 2).last # Error if this is nil???

    puts "Entered callback with code: #{code} and state: #{state}"
    # Exchange the authorization code for an access token
    uri = URI.parse("https://accounts.spotify.com/api/token")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    puts "Redirect URI: #{ENV['SPOTIFY_REDIRECT_URI']}"
    request = Net::HTTP::Post.new(uri.request_uri)
    request.set_form_data(
      grant_type: "authorization_code",
      code: code,
      redirect_uri: ENV['SPOTIFY_REDIRECT_URI'],
      client_id: Rails.application.credentials.spotify_client_id,
      client_secret: Rails.application.credentials.spotify_client_secret
    )

    puts "Request: #{request}"
    response = http.request(request)
    token_data = JSON.parse(response.body)

    puts "Response: #{response} Token data: #{token_data}"
    if token_data["access_token"]
      set_current_user(auth_token)
      puts "Current user: #{current_user}"
      current_user.update!(
        spotify_access_token: token_data["access_token"],
        spotify_refresh_token: token_data["refresh_token"],
        spotify_token_expires_at: Time.now + token_data["expires_in"].to_i.seconds
      )
      redirect_to "#{ENV['FRONTEND_URL']}/?spotify_connected=true"
    else
      # Handle error, e.g., redirect to an error page or show a message
      redirect_to "#{ENV['FRONTEND_URL']}/?spotify_connected=false&error=#{token_data["error"]}"
    end
  end
end
