class SpotifyController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:callback] # Is CSRF protection for the auth request or callback or both???

  def callback
    # Check that the state parameter matches the one we sent.
    # if params[:state] != session[:spotify_state]
    #   render json: { error: 'State mismatch' }, status: :unauthorized
    #   return
    # end

    # Exchange the authorization code for an access token.
    spotify_user = RSpotify::User.new(request.env['omniauth.auth'])

    # Save the user's Spotify credentials.
    current_user.update!(
      spotify_access_token: spotify_user.credentials.token,
      spotify_refresh_token: spotify_user.credentials.refresh_token,
      spotify_token_expires_at: Time.at(spotify_user.credentials.expires_at)
    )

    # Redirect the user back to the frontend application.
    redirect_to "#{ENV['FRONTEND_URL']}/?spotify_connected=true"
  end
end
