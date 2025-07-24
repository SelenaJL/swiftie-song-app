class Api::V1::TiersController < ApplicationController
  def index
    @tiers = Tier.all.order(:id)
    render json: @tiers
  end
end
