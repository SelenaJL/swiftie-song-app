class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  include Authenticable

  protect_from_forgery with: :exception # Necessary??? Requires ApiController to skip for non-spotify routes.


  def csrf_token
    render json: { csrf_token: form_authenticity_token }
  end
end
