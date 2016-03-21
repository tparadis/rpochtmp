class Promotion < ActiveRecord::Base
  belongs_to :user
  mount_uploader :rid, RidUploader
  mount_uploader :kbis, KbisUploader
  validates :user_id, uniqueness: true
end
