class SessionsController < ApplicationController

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
        redirect_to root_url
    end
end