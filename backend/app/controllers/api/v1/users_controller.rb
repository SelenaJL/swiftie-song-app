class Api::V1::UsersController < Api::ApiController
  before_action :authenticate_request!

  def album_summaries
    albums = Album.all.order(:id).includes(:rankings)
    highest_song_count = albums.map(&:song_count).max

    album_summaries = albums.map do |album|
      song_count = album.song_count
      unranked_count = song_count
      tier_breakdown = tier_values.keys.map { |tier_id| [tier_id, {count: 0, percent: 0}] }.to_h
      score = 0
      weighted_score = 0
      album_rankings = album.rankings.where(rankings: { user_id: current_user.id })

      if album_rankings.any?
        unranked_count = song_count - album_rankings.size
        tier_breakdown = calculate_tier_breakdown(album_rankings, tier_breakdown, song_count)
        value_of_rankings = calculate_value_of_rankings(tier_breakdown)
        score = calculate_score(value_of_rankings, song_count)
        weighted_score = calculate_score(value_of_rankings, highest_song_count)
      end

      {
        album_id: album.id,
        album_title: album.title,
        album_color: album.color,
        song_count: song_count,
        unranked_count: unranked_count,
        tier_breakdown: tier_breakdown,
        score: score,
        weighted_score: weighted_score,
      }
    end

    render json: album_summaries
  end

  def spotify_token
    if current_user.spotify_token_expired?
      current_user.refresh_spotify_token!
    end

    render json: { access_token: current_user.spotify_access_token }
  end
  
  private

  def tier_values
    @tier_values ||= Tier.all.pluck(:id, :value).to_h
  end

  def max_tier_value
    @max_tier_value ||= tier_values.values.max
  end

  def calculate_tier_breakdown(album_rankings, tier_breakdown, song_count)
    album_rankings.each do |ranking|
      tier_breakdown[ranking.tier_id][:count] += 1
      tier_breakdown[ranking.tier_id][:percent] = (tier_breakdown[ranking.tier_id][:count].to_f / song_count * 100).round
    end

    tier_breakdown
  end

  def calculate_value_of_rankings(tier_breakdown)
    tier_breakdown.reduce(0) do |total_score, (tier_id, breakdown)|
      total_score + (breakdown[:count] * tier_values[tier_id])
    end
  end

  def calculate_score(value_of_rankings, song_count)
    (value_of_rankings.to_f / (max_tier_value * song_count) * 100).round
  end
end