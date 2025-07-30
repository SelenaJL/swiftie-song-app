class Api::V1::TiersController < Api::ApiController
  def index
    @tiers = Tier.all.order(:id)
    render json: @tiers
  end
end
