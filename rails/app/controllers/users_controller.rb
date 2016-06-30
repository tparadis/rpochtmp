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

	#Nouvel utilisateur promoted, depuis le formulaire commerçant avec l'uuid et tout là
	def newcomm
		@user = User.new
	end

	def createcomm
		respond_to do |format|
			@user = User.new(user_paramscomm)
			@user.status = 'promoted'

			userExiste = User.where("email = ?", @user.email).first.blank?

			if !userExiste
				puts "L'utilisateur existe deja..."
				format.json {render json: {status: "exist"}}
			else
				
				if Commerce.where("id = ?",params[:uuid]).first.blank?
			
					format.json {render json: {status: "nouuid"}}

				elsif !Commerce.where("id = ?",params[:uuid]).first.user_id.blank?

					format.json {render json: {status: "assigne"}}

				elsif @user.save

					@user = User.where("email = ?",@user.email).first
					@c = Commerce.where("id = ?",params["uuid"]).first
					@c.email = @user.email
					@c.user_id = @user.id
					@c.save	

					format.json {render json: {status:"ok"}}

				else
					format.json {render json: {status:"internerror"}}
				end
			end
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

	#Permet d'ajouter un UUID à un utilisateur précis
	def add_uuid_to_user

		uuid = params[:uuid]
		sleep 2
		begin

			c = Commerce.where("id = ?", uuid).first

			if c.blank? 
				flash[:danger] = "Erreur, l'identifiant de commerce n'existe pas"
			elsif !c.user_id.blank?
				flash[:danger] = "Ce commerce appartient deja à quelqu'un..."
			else
				#Commerce disponible
				user = User.where("id = ?",params[:user]).first
				c.user_id = params[:user]
				if c.save
					flash[:notice] = "Vous avez bien ajouté ce commerce"
				else
					flash[:danger] = "Erreur lors de la sauvegarde, réessayez plus tard"
				end
			end


		rescue
			flash[:danger] = "Erreur, mauvais format d'identifiant..."
		end

				redirect_to user_url(params[:user])
	end

	def destroy
		
		elem = User.find(params[:id])
		comms = Commerce.where('user_id = ?', params[:id])
		req = "update commerces set user_id = NULL where user_id = " + params[:id]
		ActiveRecord::Base.connection.execute(req)

		elem.destroy
		
		redirect_to accounts_path, notice: "L'utilisateur a été supprimé."
	end


    private
	def user_paramscomm
        params.require(:user).permit(:username, :email,
                                     :password, :password_confirmation, :status)
    end

    def user_params
        params.require(:user).permit(:username, :email,
                                     :password, :password_confirmation, :status)
    end

	def user_paramsAdmin
		params.require(:user).permit(:username, :email, :status)
	end


end
