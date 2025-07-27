class Ranking < ApplicationRecord
  belongs_to :song
  belongs_to :album
  belongs_to :user
  belongs_to :tier

  before_validation :set_album_id

  validates :song, presence: true
  validates :song_id, uniqueness: { scope: :user_id, message: "can only have one ranking per user" }
  validates :album, presence: true
  validates :user, presence: true
  validates :tier, presence: true

  private

  def set_album_id
    self.album_id = song.album_id if song.present?
  end
end
