class WelcomeController < ApplicationController

  require "algo.rb"
  require "interface.rb"

  def index

  	params.require(:req)
		
	if request.headers["CONTENT_TYPE"] == "application/json" || (params.has_key?(:format) && params[:format]=="json")
		if params[:req] == "path"
			
			if params.has_key?(:nombreMagasins) && params[:nombreMagasins].to_i > 0 

				@y = Algo.getPath(params[:nombreMagasins].to_i)				
			
			elsif params.has_key?(:coord_dep_lat)

				@y = Algo.getTagsPath(params['coord_dep_lat'], params['coord_dep_lng'], params['coord_arr_lat'], params['coord_arr_lng'], params['dist_max'], params['commerces'])

			else	
				@y = Algo.getPath(0)
			end
			render json: {:size => @y.size(), :commerces => @y}
		end

		if params[:req] == "spec"
			if params.has_key?(:id) && params.has_key?(:type) && params[:type] == "coord"

					@y = Interface.getCommerceCoordByID(params[:id])
					render json: { :commerce => @y }
			else

				render json: { :commerce => Interface.getSpecificCommerce}
			end
		end

		if params[:req] == "rand"
			render json: { :commerce => Interface.getRandomCommerce}
		end
		
		if params[:req] == "predef"

			if params.has_key?(:nom) && params[:nom] != ""
				@y = Interface.getPredefParNom(params[:nom])
				render json: {:size => @y.size(), :magasins => @y }	
			else			

				@y = Interface.getParcoursPredefinis
				render json: {:size => @y.size(), :parcourspredefs => @y }
			end
		end
		
		if params[:req] == "allcat"
			i = Interface.getCategories
			j = Interface.getSSCategories
			k = Interface.getTags
			render json: {:sizecat => i.size(), :sizesscat => j.size(), :sizetags => k.size(), :cat => i, :sscat => j, :tags => k  }		
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

		# Debut test 
		if params[:req] == "yolo"
			@y = Algo.getDynamicPath(params[:coord_dep_lat].to_f,params[:coord_dep_lng].to_f,
									 params[:coord_arr_lat].to_f,params[:coord_arr_lng].to_f,
									 params[:dist_max].to_f, params[:commerces])
			# @y = Interface.getComCT(13, 48.117, 48.11017, -1.6866, -1.676)
			render json: { :tags => @y}
		end
		if params[:req] == "yolodist"
			@y = Algo.distLL(params[:a_lat].to_f,params[:a_lng].to_f,params[:b_lat].to_f,params[:b_lng].to_f)
			render json: { :tags => @y}
		end

		# Fin test

	else

		@y = Algo.getPath(0)
	end

  end

end
