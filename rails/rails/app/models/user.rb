class User < ActiveRecord::Base
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  before_save { self.email = email.downcase }
  validates :username, presence:true, length: { maximum: 25 },
    uniqueness: { case_sensitive: false },
    format: { with: /\A[\w+\-.]+\z/i }
  validates :email, presence:true, length: { minimum:7, maximum: 100 },
    format: { with: VALID_EMAIL_REGEX },
    uniqueness: { case_sensitive: false }
  validates :status, presence:true
  has_secure_password
  validates :password, presence:true, length: { minimum: 7 }
  has_many :commerces, foreign_key: "user_id"
end
