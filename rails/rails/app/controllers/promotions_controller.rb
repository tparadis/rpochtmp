class PromotionsController < ApplicationController
    before_action :logged_in_user
    #before_action :authorized
    before_action :require_admin, only: [:accept, :index]

    @@pending = 0

    def index
        @promotions = Promotion.all
    end

    def new
        @promotion = Promotion.new
        if @@pending == 1
            flash[:danger] = "Une requête de promotion est déja en cours."
            redirect_to current_user
        end
    end

    def create
        @user = User.find(session[:user_id])
        if (@@pending == 1 || Promotion.find_by(user_id: @user.id))
            flash.now[:danger] = "Une requête de promotion est déja en cours."
            redirect_to root_url
        end
            @promotion = Promotion.new
            @promotion.kbis = params[:promotion][:kbis]
            @promotion.rid = params[:promotion][:rid]
            @promotion.siret = params[:promotion][:siret]
            @promotion.user_id = @user.id
            @promotion.status = 'pending' # kind of useless for now
            @promotion.save
            @@pending += 1
            flash.now[:success] = "Votre demande sera traitée sous peu."
    end

    def accept
        @promotion = Promotion.find(params[:id])
        @promoted = User.find(@promotion.user_id)
        @promoted.update_attribute(:status, 'promoted')
        @promotion.destroy
        flash[:success] = "Promotion acceptée."
        @@pending = 0
        redirect_to current_user
    end

end
