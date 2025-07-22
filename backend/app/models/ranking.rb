class Ranking < ApplicationRecord
  belongs_to :song
  belongs_to :user
  belongs_to :tier
  validates :song, presence: true
  validates :user, presence: true
  validates :tier, presence: true
  validates :song_id, uniqueness: { scope: :user_id, message: "can only have one ranking per user" }
end
