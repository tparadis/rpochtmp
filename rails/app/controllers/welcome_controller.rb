class WelcomeController < ApplicationController

  require "algo.rb"
  require "interface.rb"

  def index

  	params.require(:req)
		
	if request.headers["CONTENT_TYPE"] == "application/json" || (params.has_key?(:format) && params[:format]=="json")
		if params[:req] == "path"
			
			if params.has_key?(:nombreMagasins) && params[:nombreMagasins].to_i > 0 
				@y = Algo.getPath(params[:nombreMagasins].to_i)
			else	
				@y = Algo.getPath(0)
			end
			render json: {:size => @y.size(), :commerces => @y}
		end

		if params[:req] == "spec"
			render json: { :commerce => Interface.getSpecificCommerce}
		end

		if params[:req] == "rand"
			render json: { :commerce => Interface.getRandomCommerce}
		end
		
		if params[:req] == "predef"
			@y = Interface.getParcoursPredefinis
			render json: { :parcourspredefs => @y }
		end

		if params[:req] == "cat"
			@y = Interface.getCategories
			render json: {:size => @y.size(), :categories => @y}
		end

		if params[:req] == "sscat"
			@y = Interface.getSSCategories
			render json: {:size => @y.size(), :sscategories => @y}
		end

		if params[:req] == "tags"
			@y = Interface.getTags
			render json: {:size => @y.size(), :tags => @y}
		end

	else

		@y = Algo.getPath(0)
	end

  end

end
