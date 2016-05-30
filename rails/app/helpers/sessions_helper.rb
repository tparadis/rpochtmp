module SessionsHelper

    def log_in(user)
        session[:user_id] = user.id
    end

    def current_user
        @current_user ||= User.find_by(id: session[:user_id])
    end

    def current_user?(user)
        @current_user == user
    end

    def logged_in?
        !current_user.nil?
    end

	def is_admin?
		logged_in? && @current_user.status == 'admin'
	end

    def log_out
        session.delete(:user_id)
        @current_user = nil
    end

    def logged_in_user
        unless logged_in?
            flash[:danger] = "Veuillez vous connecter."
            redirect_to login_url
        end
    end

    def authorized
        @user = User.find(params[:id])
        unless @current_user == @user
            flash[:danger] = "Droits insuffisants."
            redirect_to root_url
        end
    end

    def require_admin
        unless logged_in? && @current_user.status == 'admin'
            flash[:danger] = "Droits insuffisants."
            redirect_to root_url
        end
    end

end
