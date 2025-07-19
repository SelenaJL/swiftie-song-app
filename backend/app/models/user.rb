class User < ApplicationRecord
  has_many :rankings
  validates :email, uniqueness: true
end
