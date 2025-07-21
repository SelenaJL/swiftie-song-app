class User < ApplicationRecord
  has_many :rankings
  has_secure_password
  validates :email, uniqueness: true
end
