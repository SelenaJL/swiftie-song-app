class Api::V1::TiersController < ApplicationController
  def index
    @tiers = Tier.all
    render json: @tiers
  end
end
