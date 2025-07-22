module Authenticable
  def current_user
    return @current_user if @current_user

    header = request.headers['Authorization']
    return nil if header.nil?

    user_id = decode_token(header)['user_id']
    @current_user = User.find(user_id) if user_id
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