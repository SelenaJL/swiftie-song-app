module Authenticable
  def current_user
    return @current_user if @current_user

    header = request.headers['Authorization']
    return nil if header.nil?

    decoded_token = decode_token(header)
    @current_user = User.find(decoded_token[:user_id]) if decoded_token
  rescue JWT::DecodeError
    nil
  end

  def authenticate_request!
    render json: { error: 'Not Authorized' }, status: 401 unless current_user
  end

  private

  def decode_token(token)
    JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
  end
end