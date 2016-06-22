class Note < ActiveRecord::Base
	validates :note, :inclusion => {:in => [0,1,2,3,4,5]}
end
