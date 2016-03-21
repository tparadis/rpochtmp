class UsersController < ApplicationController

    before_action :logged_in_user, only: [:show, :edit, :update]
    before_action :authorized, only: [:show, :edit, :update]
    before_action :require_admin, only: [:destroy]

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

    def new
        @user = User.new
    end

    def create
        @user = User.new(user_params)
        @user.status = 'basic'
        if @user.save
            log_in @user
            flash.now[:success] = "Enregistrement réussi."
            redirect_to @user
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
    end

    private

    def user_params
        params.require(:user).permit(:username, :email,
                                     :password, :password_confirmation)
    end

end
