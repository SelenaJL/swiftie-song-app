class Api::V1::RankingsController < ApplicationController
  before_action :authenticate_request!

  def index
    @rankings = current_user.rankings.joins(:song).where(songs: { album_id: params[:album_id] })
    render json: @rankings
  end

  def create
    @ranking = current_user.rankings.new(ranking_params)
    if @ranking.save
      render json: @ranking, status: :created
    else
      render json: @ranking.errors, status: :unprocessable_entity
    end
  end

  def update
    @ranking = current_user.rankings.find(params[:id])
    if @ranking.update(ranking_params)
      render json: @ranking
    else
      render json: @ranking.errors, status: :unprocessable_entity
    end
  end

  private

  def ranking_params
    params.require(:ranking).permit(:song_id, :tier_id)
  end
end
