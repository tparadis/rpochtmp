class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  
  #include ActionController::HttpAuthentication::Basic::ControllerMethods
  protect_from_forgery with: :exception

	#Definition pour la protection des pages
	#Je ferai un switch case avec une variable de session qui précisera
	#le niveau auquel l'utilisateur est loggué: admin ou app
	#
	#Seul le compte app est autorisé pour le moment avec tous les droits.
	USERADMIN, PASSWORDADMIN = 'administrateur','3petitsc'
	USER,PASSWORD = 'application','app404'
	
	#Accès lors de la demande d'une page
	before_filter :auth_check#, :except => :index
	private
		def auth_check
			authenticate_or_request_with_http_basic do |user,password|
				if user == USER && password == PASSWORD
					session[:privilege] = "application"
					true
				elsif user == USERADMIN && password == PASSWORDADMIN
					session[:privilege] = "administrateur"
					true
				else
					session[:privilege] = "intrus"
					false
				end

			end
		end
	

end
