class WelcomeController < ApplicationController

  require "algo.rb"
  require "interface.rb"

  def index

  	params.require(:req)
	
	@y = Algo.getPath(0)
	
	if request.headers["CONTENT_TYPE"] == "application/json" || (params.has_key?(:format) && params[:format]=="json")
		if params[:req] == "path"
			
			if params.has_key?(:nombreMagasins) && params[:nombreMagasins].to_i > 0 
				@y = Algo.getPath(params[:nombreMagasins].to_i)
			end
			

			render json: {:size => @y.size(), :commerces => @y}
		end
		if params[:req] == "spec"
			render json: { :commerce => Interface.getSpecificCommerce()}
		end
	end

  end

end
