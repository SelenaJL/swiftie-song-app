class Song < ApplicationRecord
  belongs_to :album
  validates :title, presence: true, uniqueness: { scope: :album_id, message: "should be unique within the same album" }
end
