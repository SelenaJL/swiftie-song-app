Rails.application.config.middleware.use OmniAuth::Builder do
  # OmniAuth.config.allowed_request_methods = [:get] # Works but not protected against CSRF attacks???
  provider :spotify,
    Rails.application.credentials.spotify_client_id,
    Rails.application.credentials.spotify_client_secret,
    scope: 'streaming user-read-email user-read-private user-modify-playback-state'
end