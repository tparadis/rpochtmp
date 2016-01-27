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

		# tableau contenant la liste des tags par magasins :
		tab_mags = [];
		tab_res = [];
		commerces = eval(commerces)
		commerces.each do |com|
			id_com = Interface.getIdbyNum(com);
			tab_mags << Interface.getComCT(id_com, lat_max, lat_min,
										   lng_max, lng_min);
		end 

		# Init du tableau de résultat :
		tab_mags[0].each do |init|
			tmp = []
			test = distLL(coord_dep_lat, coord_dep_lng,
						  init.location_lat, init.location_lng)
			if test < dist_max
				tmp << test
				tmp << init
				tab_res << tmp
			end
		end
		# return tab_res
		# Construisons à présent le chemin entre le premier magasin
		# Et la destination finale :
		tab_res_tmp = []
		for indice in 1..commerces.length-1
			tab_mags[indice].each do |mag|
				tab_res.each do |prec|
					precedent_lat = prec[prec.length-1].location_lat;
					precedent_lng = prec[prec.length-1].location_lng;
					test = distLL(precedent_lat, precedent_lng,
								  mag.location_lat, mag.location_lng);
					if (prec[0] + test) < dist_max
						tmp = prec.clone;
						tmp[0] += test;
						tmp << mag;
						tab_res_tmp << tmp;
					end
				end
			end
			tab_res = tab_res_tmp.clone
			tab_res_tmp = []
		end
		# return tab_res
		# Nous intégrons à présent le chemin final :
		tab_final = []
		tab_res.each do |fin|
			precedent_lat = fin[fin.length-1].location_lat;
			precedent_lng = fin[fin.length-1].location_lng;
			test = distLL(precedent_lat, precedent_lng,
						  coord_arr_lat, coord_arr_lng)
			if (fin[0] + test) < dist_max
				tab_final << fin
			end
		end
		# return tab_final
		return tab_final[0]
	end

	# Calcule la distance en kilomètre entre deux coordonées.
	def Algo.distLL(a_lat,a_lng,b_lat,b_lng)
		r = 6371;
		dLat = deg2rad(b_lat - a_lat);
		dLon = deg2rad(b_lng - a_lng);
		a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(deg2rad(a_lat)) * Math.cos(deg2rad(b_lat)) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
		d = r * c;
		return d;
	end

	def Algo.deg2rad(deg)
		return deg * (Math::PI/180);
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
