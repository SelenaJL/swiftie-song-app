class Ranking < ApplicationRecord
  belongs_to :song
  belongs_to :user
  validates :song_id, uniqueness: { scope: :user_id, message: "can only have one ranking per user" }
end
