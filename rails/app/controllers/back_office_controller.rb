class BackOfficeController < ApplicationController
  
  before_action :authentification
  require "interface.rb"
  
  #Fonction appelée au lancement
  #Permet de vérifier si le login (l'uuid du magasin) existe bien et en fait part à l'utilisateur au view.
  def authentification
		if params.has_key?(:login) && Interface.uuidexists?(params[:login])
			@welcomeMsg = "ok"
			@uuidEdition = params[:login]
		elsif
			@welcomeMsg = "UUID non déclaré"
		end
  end

  def index
  end

  def show
  end

  def edit
	if Interface.uuidexists?(@uuidEdition) == false
		@uuidEdition = -1
	end
  end

end
