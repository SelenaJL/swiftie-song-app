class Tier < ApplicationRecord
  validates :name, presence: true
  validates :description, presence: true
  validates :value, presence: true
end
