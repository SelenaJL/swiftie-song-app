class Api::V1::UsersController < ApplicationController
  before_action :authenticate_request!

  def album_summaries
    albums = Album.all.order(:id).includes(:rankings)
    tier_values = Tier.all.pluck(:id, :value).to_h

    album_summaries = albums.map do |album|
      song_count = album.song_count
      tier_breakdown = tier_values.keys.map { |tier_id| [tier_id, 0] }.to_h
      base_album_summary = {
        album_id: album.id,
        album_title: album.title,
        album_color: album.color,
        song_count: song_count,
      }
      album_rankings = album.rankings.where(rankings: { user_id: current_user.id })

      if album_rankings.any?
        unranked_count = song_count - album_rankings.size
        tier_breakdown = tier_values.keys.map { |tier_id| [tier_id, 0] }.to_h
        album_rankings.each do |ranking|
          tier_breakdown[ranking.tier_id] += 1
        end
        score = album_rankings.sum { |ranking| tier_values[ranking.tier_id] } / song_count

        base_album_summary.merge!({
          unranked_count: unranked_count,
          tier_breakdown: tier_breakdown,
          score: score,
        })
      else
        base_album_summary.merge!({
          unranked_count: song_count,
          tier_breakdown: tier_breakdown,
          score: 0,
        })
      end
    end

    render json: album_summaries
  end
end