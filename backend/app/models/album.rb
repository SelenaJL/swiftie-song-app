class Album < ApplicationRecord
  has_many :songs
  has_many :rankings
  validates :title, presence: true
  validates :release_year, presence: true

  def song_count
    songs.count
  end
end
