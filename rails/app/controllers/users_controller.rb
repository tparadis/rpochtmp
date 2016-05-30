class UsersController < ApplicationController

    before_action :logged_in_user, only: [:show, :edit, :update]
	before_action :authorized, only: [:show, :edit, :update]
	before_action :require_admin, only: [:editUser, :destroy]

    def show
        @users = {}
        @shops = {}
        case @user.status
        when 'admin'
            @users = User.all
            @shops = Commerce.all
            @tags = Sscategorie.all
        when 'promoted'
            @shops = Commerce.where(user_id: @user.id)
        end
    end

    def edit
        @modified = Commerce.new
        @shop = Commerce.find_by(user_id: params[:id])
    end

	def edituser

		@usermod = User.find(params[:id])

	end

    def new
        @user = User.new
    end

    def create
        @user = User.new(user_params)
		@user.status = 'basic'
        if @user.save
            flash.now[:success] = "Enregistrement réussi."
			if !is_admin?
            	log_in @user
				redirect_to @user
			else
				redirect_to accounts_path
			end
        else
            render 'new'
        end
    end

    def update

        	params.require(:updated)
        	@shop = Commerce.find_by(user_id: params[:id])
        	keys = params[:updated].keys
        	keys.each do |u|
            	@shop.update_attribute(u, params[:updated][u])
        	end
			redirect_to user_url


    end

	def updateuser

		@usermod = User.find(params[:id])
		keys = params[:updated].keys
        keys.each do |u|
           	@usermod.update_attribute(u, params[:updated][u])
        end

		redirect_to accounts_path, notice: 'Utilisateur mis à jour'

	end	

	def destroy
		
		elem = User.find(params[:id])

		elem.destroy
		
		redirect_to accounts_path, notice: "L'utilisateur a été supprimé."
	end


    private
	
    def user_params
        params.require(:user).permit(:username, :email,
                                     :password, :password_confirmation, :status)
    end

	def user_paramsAdmin
		params.require(:user).permit(:username, :email, :status)
	end


end
