class Api::V1::UsersController < ApplicationController
  before_action :authenticate_request!

  def album_summaries
    albums = Album.all.order(:id).includes(:rankings)
    tier_values = Tier.all.pluck(:id, :value).to_h

    album_summaries = albums.map do |album|
      song_count = album.song_count
      unranked_count = song_count
      tier_breakdown = tier_values.keys.map { |tier_id| [tier_id, {count: 0, percentage: 0}] }.to_h
      score = 0
      album_rankings = album.rankings.where(rankings: { user_id: current_user.id })

      if album_rankings.any?
        unranked_count = song_count - album_rankings.size
        tier_breakdown = calculate_tier_breakdown(album_rankings, tier_breakdown, song_count)
        score = calculate_score(tier_breakdown, tier_values, song_count)
      end

      {
        album_id: album.id,
        album_title: album.title,
        album_color: album.color,
        song_count: song_count,
        unranked_count: unranked_count,
        tier_breakdown: tier_breakdown,
        score: score,
      }
    end

    render json: album_summaries
  end

  private

  def calculate_tier_breakdown(album_rankings, tier_breakdown, song_count)
    album_rankings.each do |ranking|
      tier_breakdown[ranking.tier_id][:count] += 1
      tier_breakdown[ranking.tier_id][:percentage] = (tier_breakdown[ranking.tier_id][:count].to_f / song_count * 100).round(2)
    end

    tier_breakdown
  end

  def calculate_score(tier_breakdown, tier_values, song_count)
    numerator = tier_breakdown.reduce(0) do |total_score, (tier_id, breakdown)|
      total_score + (breakdown[:count] * tier_values[tier_id])
    end
    denominator = tier_values.values.max * song_count

    (numerator.to_f / denominator * 100).round(2)
  end
end