class StatistiqueController < ApplicationController
  
  before_action :logged_in_user, only: [:show]
  before_action :authorized, only: [:show]
  
  def show	

	@shops = {}

	case @user.status
	when 'promoted'
		
		@shops = Commerce.where(user_id: @user.id)

	when 'basic'

	when 'admin'

		@shops = Commerce.all

	end


  end
end
