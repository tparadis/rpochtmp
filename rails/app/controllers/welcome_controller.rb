class WelcomeController < ApplicationController

  require "algo.rb"
  require "interface.rb"

  def index

  	params.require(:req)
	
	@y = Algo.getPath()
	
	if request.headers["CONTENT_TYPE"] == "application/json" || (params.has_key?(:format) && params[:format]=="json")
		if params[:req] == "path" 
			render json: {:size => @y.size(), :magasins => @y}
		end
		if params[:req] == "spec"
			render json: { :magasin => Interface.getRandomMagasin()}
		end
	end

  end

end
