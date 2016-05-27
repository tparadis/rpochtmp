module Admin

	extend ActiveSupport::Concern
	#Connexion aux pages de la base de donnees
	#Pour en modifier les acces, changer la variable 'user' dans la fonction auth
	#ainsi que 'password' dans cette meme fonction ci dessous
	
	included do
		before_action :auth
	end

	def auth
		
		authenticate_or_request_with_http_basic do |user,password|

				user == "application" && password == "app404"
		
		end

	end


end
