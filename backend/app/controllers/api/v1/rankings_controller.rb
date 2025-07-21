class Api::V1::RankingsController < ApplicationController
  def create
    @ranking = Ranking.new(ranking_params)
    if @ranking.save
      render json: @ranking, status: :created
    else
      render json: @ranking.errors, status: :unprocessable_entity
    end
  end

  def update
    @ranking = Ranking.find(params[:id])
    if @ranking.update(ranking_params)
      render json: @ranking
    else
      render json: @ranking.errors, status: :unprocessable_entity
    end
  end

  private

  def ranking_params
    params.require(:ranking).permit(:song_id, :tier_id, :user_id)
  end
end
