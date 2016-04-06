module Algo

  require "interface.rb"

	#Permet d'obtenir un itineraire a partir de tags

	def Algo.getTagsPath(coord_dep_lat,coord_dep_lng,
						 coord_arr_lat,coord_arr_lng,
						 dist_max, commerces)


		y = ["1","2"]

	end
	
	# -> Test de l'algo en faisant les calculs intermédiaires 
	# pour chaque parcours :
	def Algo.getInterPath(coord_dep_lat,coord_dep_lng,
						  coord_arr_lat,coord_arr_lng,
						  dist_max, commerces)

		# --> compute de time of execution :
		start = Time.now;

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
		commerces = eval(commerces)

		# Determinons le nombre de magasins que l'utilisateur veut visiter
		# afin d'ajuster le nombre de magasins à prendre dans la bdd
		limit = 0;

		if commerces.length() > 7
			limit = 5;
		else
			limit = 10;
		end

		commerces.each do |com|
			# id_com = Interface.getIdbyNum(com);
			# test = Interface.getComCT(id_com, lat_max, lat_min, lng_max, lng_min, limit);
			# test = Interface.getComCT(com, lat_max, lat_min, lng_max, lng_min, limit);
			test = Interface.getComLL_opti(com, lat_max, lat_min, lng_max, lng_min, 
									  coord_dep_lat, coord_arr_lat, coord_dep_lng, coord_arr_lng,
									  dist_max,limit);
			if not test.empty?
				tab_mags << test;
			end
		end 


		tab_max = []; 		# stock la taille de chaque liste de commerces
		tab_indice = []; 	# permet de savoir quels commerces ont été testés
		tab_mags.each do |mag|
			tab_max << mag.length()-1;
			tab_indice << 0;
		end

		# dans un premier temps, bouclons jusque'a trouver un parcours :
		tmp_old_lat=0.0;
		tmp_old_lng=0.0;
		debug = [];
		while true
			cpt = 0;
			blacklist = []; 	# éviter de donner le même magasin plusieurs fois
								# dans un parcours
			valid = true; 		# permet de savoir si le chemin n'est pas redondant
			# Calculons la distance du parcours avant l'arrivée
			for indice in 0..(tab_mags.length() -1)
				tmp_lat = tab_mags[indice][ tab_indice[indice] ].location_lat;
				tmp_lng = tab_mags[indice][ tab_indice[indice] ].location_lng;

				# On ajoute le nouveau magasin testé à la blacklist
				if blacklist.include?(tab_mags[indice][ tab_indice[indice] ].id)
					# et si il est déjà dedans -> on le précise grace au booléen 'valid'
					# et on quitte la boucle
					valid = false;
					break;
				end
				# Sinon, on met à jour la blacklist
				blacklist << tab_mags[indice][ tab_indice[indice] ].id;

				if indice == 0
					cpt += distLL(coord_dep_lat, coord_dep_lng,
						 		  tmp_lat, tmp_lng );
					if ( cpt + distLL(tmp_lat, tmp_lng, coord_arr_lat, coord_arr_lng) ) > dist_max
						valid = false;
						break;
					end
				else
					cpt += distLL(tmp_lat, tmp_lng,
						 		  tmp_old_lat, tmp_old_lng );
					if ( cpt + distLL(tmp_lat, tmp_lng, coord_arr_lat, coord_arr_lng) ) > dist_max
						valid = false;
						break;
					end
				end
				tmp_old_lat = tmp_lat;
				tmp_old_lng = tmp_lng;
			end

			# le parcours généré à t'il la bonne longueur et est-il valide ?
			if valid
				# succès : on retourne le parcours
				res = [];
				# if faut ajouter au cpt la distance entre le dernier
				# magasin, et le lieu d'arrivée :
				cpt += distLL(tmp_old_lat, tmp_old_lng, coord_arr_lat, coord_arr_lng);
				res << cpt;
				for indice in 0..(tab_mags.length() -1)
					res << tab_mags[indice][ tab_indice[indice] ];
				end
				finish = Time.now;
				res << finish - start;
				return res;
			end

			# ici ==> le parcours ne convenait pas.
			# vérifions que la requête ne prend pas trop de temps :
			# les requêtes qui mettent plus de 0.5 secondes à
			# s'éxecuter retourne automatiquement un tableau vide.
			time_inter = Time.now;
			if time_inter - start > 0.5
				return [];
			end

			# mettons à jour le tableau des indices, et réitérons.
	
			degrad = false;
			for indice in (tab_indice.length()-1).downto(0)
				if indice == tab_indice.length()-1
					if tab_indice[indice] == tab_max[indice]
						degrad = true;
						tab_indice[indice] = 0;
					else
						tab_indice[indice]+=1;
					end
				else
					if degrad
						if tab_indice[indice] == tab_max[indice]
							if indice == 0
								# Ici => aucuns parcours n'éxiste en respectant les critères
								# de recherche précisés par l'utilisateur : 
								# on retourne un tableau vide.
								return [];
							end
							tab_indice[indice] = 0;
						else
							tab_indice[indice]+=1;
							degrad = false;
						end
					end
				end
			end


		end # Fin boucle while
	end

	# Implémentation de l'algo qui calcule les parcours dynamiques
	# qui utilise un algo de parcours en profondeur.
	def Algo.getNewPath(coord_dep_lat,coord_dep_lng,
						coord_arr_lat,coord_arr_lng,
						dist_max, commerces)
		start = Time.now;
		# dans le premier algo -> parcours en largeur
		# faisons à présent un parcours en profondeur
		
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
		commerces = eval(commerces)

		# Determinons le nombre de magasins que l'utilisateur veut visiter
		# afin d'ajuster le nombre de magasins à prendre dans la bdd
		limit = 0;
		if commerces.length() > 7
			limit = 5;
		else
			limit = 10;
		end


		commerces.each do |com|
			# id_com = Interface.getIdbyNum(com);
			# test = Interface.getComCT(id_com, lat_max, lat_min, lng_max, lng_min, limit);
			# test = Interface.getComCT(com, lat_max, lat_min, lng_max, lng_min, limit);
			test = Interface.getComLL_opti(com, lat_max, lat_min, lng_max, lng_min, 
									  coord_dep_lat, coord_arr_lat, coord_dep_lng, coord_arr_lng,
									  dist_max,limit);
			if not test.empty?
				tab_mags << test;
			end
		end 


		tab_max = []; 		# stock la taille de chaque liste de commerces
		tab_indice = []; 	# permet de savoir quels commerces ont été testés
		tab_mags.each do |mag|
			tab_max << mag.length()-1;
			tab_indice << 0;
		end

		# dans un premier temps, bouclons jusque'a trouver un parcours :
		tmp_old_lat=0.0;
		tmp_old_lng=0.0;
		debug = [];
		while true
			cpt = 0;
			blacklist = []; 	# éviter de donner le même magasin plusieurs fois
								# dans un parcours
			valid = true; 		# permet de savoir si le chemin n'est pas redondant
			# Calculons la distance du parcours avant l'arrivée
			for indice in 0..(tab_mags.length() -1)
				tmp_lat = tab_mags[indice][ tab_indice[indice] ].location_lat;
				tmp_lng = tab_mags[indice][ tab_indice[indice] ].location_lng;

				# On ajoute le nouveau magasin testé à la blacklist
				if blacklist.include?(tab_mags[indice][ tab_indice[indice] ].id)
					# et si il est déjà dedans -> on le précise grace au booléen 'valid'
					# et on quitte la boucle
					valid = false;
					break;
				end
				# Sinon, on met à jour la blacklist
				blacklist << tab_mags[indice][ tab_indice[indice] ].id;

				if indice == 0
					cpt += distLL(coord_dep_lat, coord_dep_lng,
						 		  tmp_lat, tmp_lng );
				else
					cpt += distLL(tmp_lat, tmp_lng,
						 		  tmp_old_lat, tmp_old_lng );
				end
				tmp_old_lat = tmp_lat;
				tmp_old_lng = tmp_lng;
			end
			# Ajoutons à présent la distance pour arriver à la fin du parcours :
			cpt += distLL(tmp_old_lat, tmp_old_lng,
						  coord_arr_lat,coord_arr_lng)

			# le parcours généré à t'il la bonne longueur et est-il valide ?
			if cpt <= dist_max and valid
				# succès : on retourne le parcours
				res = [];
				res << cpt;
				for indice in 0..(tab_mags.length() -1)
					res << tab_mags[indice][ tab_indice[indice] ];
				end
				finish = Time.now;
				res << finish - start;
				return res;
			end

			# ici ==> le parcours ne convenait pas.
			# vérifions que la requête ne prend pas trop de temps :
			# les requêtes qui mettent plus de 0.5 secondes à
			# s'éxecuter retourne automatiquement un tableau vide.
			time_inter = Time.now;
			if time_inter - start > 0.50
				return [];
			end
			
			# mettons à jour le tableau des indices, et réitérons.
	
			degrad = false;
			for indice in (tab_indice.length()-1).downto(0)
				if indice == tab_indice.length()-1
					if tab_indice[indice] == tab_max[indice]
						degrad = true;
						tab_indice[indice] = 0;
					else
						tab_indice[indice]+=1;
					end
				else
					if degrad
						if tab_indice[indice] == tab_max[indice]
							if indice == 0
								# Ici => aucuns parcours n'éxiste en respectant les critères
								# de recherche précisés par l'utilisateur : 
								# on retourne un tableau vide.
								return [];
							end
							tab_indice[indice] = 0;
						else
							tab_indice[indice]+=1;
							degrad = false;
						end
					end
				end
			end


		end # Fin boucle while
	end

	# Retourne une liste de magasins de même type, dans un rayon donné
	def Algo.randList(coord_ref_lat,coord_ref_lng,
					  dist_max, limit, tag )
	# Dans un premier temps :  calcul des coordonnées qui encadre les magasins
	# que l'on doit trouver :
	
	conv_lat = 110.574;
	conv_lng = 111.320;

	tmp1 = (dist_max / conv_lat);
	tmp2 = (dist_max / (conv_lng * Math.cos(coord_ref_lat)));
	lat_max = coord_ref_lat + tmp1;
	lat_min = coord_ref_lat - tmp1;
	lng_max = coord_ref_lng + tmp2;
	lng_min = coord_ref_lng - tmp2;

	# On prend une liste de 'limit' magasins dans ce rayon :
	res = Interface.getComLL_opti(tag, lat_max, lat_min, lng_max, lng_min, 
								   coord_ref_lat, coord_ref_lng, dist_max,limit);
	return res;
		

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
