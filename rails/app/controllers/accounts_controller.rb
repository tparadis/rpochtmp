class AccountsController < ApplicationController
  
  before_action :require_admin, only: [:index, :destroy]
  
  def index
	
	@UsersAll = User.all

  end

  def destroy
	@user.destroy
	redirect_to accounts_path, notice:"L'utilisateur a été supprimé."
  end

  private 
  def user_params
  	params.require(:user).permit(:username, :email, :password, :password_confirmation, :status)
  end

end
