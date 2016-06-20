class Note < ActiveRecord::Base
	validates :note, :inclusion => {:in => [0,5]}
end
