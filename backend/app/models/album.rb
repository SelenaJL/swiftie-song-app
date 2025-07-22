class Album < ApplicationRecord
  has_many :songs
  validates :title, presence: true
  validates :release_year, presence: true
end
