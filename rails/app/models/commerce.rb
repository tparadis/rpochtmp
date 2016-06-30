class Commerce < ActiveRecord::Base
  mount_uploader :image, ImageUploader
end
