module Algo

  require "interface.rb"

	#Permet d'obtenir un itineraire a partir de tags

	def Algo.getTagsPath(coord_dep_lat,coord_dep_lng,
						 coord_arr_lat,coord_arr_lng,
						 dist_max, commerces)


		y = ["1","2"]

	end

	def Algo.getDynamicPath(coord_dep_lat,coord_dep_lng,
						 	coord_arr_lat,coord_arr_lng,
						 	dist_max, commerces)
		# Constantes utiles à la conversion
		# km <=> latitude et longitude
		conv_lat = 110.574;
		conv_lng = 111.320;

		# On prend la moyenne entre les points de départ
		# et d'arrivée du parcours :
		coord_ref_lat = (coord_dep_lat + coord_arr_lat)/2;
		coord_ref_lng = (coord_dep_lng + coord_arr_lng)/2;

		# Calcul des limites dans lesquelles nous allons
		# rechercher l'information dans la base de donnée :
		tmp1 = (dist_max / conv_lat);
		tmp2 = (dist_max / (conv_lng * Math.cos(coord_ref_lat)));
		lat_max = coord_ref_lat + tmp1;
		lat_min = coord_ref_lat - tmp1;
		lng_max = coord_ref_lng + tmp2;
		lng_min = coord_ref_lng - tmp2;

		# travaux en cours !
	end

	def Algo.distLL(a_lat,a_lng,b_lat,b_lng)
		d_lng = b_lng - a_lng;
		dist_angulaire = Math.acos(
							Math.sin(a_lat)*Math.sin(b_lat) +
							Math.cos(a_lat)*Math.cos(b_lat)*Math.cos(d_lng)
						)
		# On retourne la distance en kilomètre : 
		return ( dist_angulaire * 6378 )
	end


	#Permet d'obtenir un itineraire aleatoire

	def Algo.getPath(nbMagasins)
		
		nb = nbMagasins
		if nbMagasins < 1
			nb = 10
		end
		i = 0
		y = Array.new
		while i < nb
			
			y.push Interface.getRandomCommerce()
			i = i + 1
		end			
		y	
	end




end
