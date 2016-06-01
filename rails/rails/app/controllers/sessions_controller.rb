class SessionsController < ApplicationController

before_filter :already_logged, :except => [:logout]



    def login
        user = User.find_by(email: params[:session][:email].downcase)
        if user && user.authenticate(params[:session][:password])
            log_in user
            redirect_to user
        else
            flash.now[:danger] = "Email ou mot de passe invalide."
            render 'new'
        end
    end

    def logout
        log_out
        redirect_to '/api/bo/'
    end
	
	
end
