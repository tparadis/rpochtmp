module Interface

	require "algo.rb"
 
	#Fonctions sur la récupération des categories
	def Interface.getCategories
		Categorie.where(:visible => true).order('nom')
	end

	def Interface.getSSCategories
		#Sscategorie.order('nom').select('id,nom,catparent,en,esp,de')
		sscats = Sscategorie.order('nom').select('id,nom,catparent,en,esp,de')
		sscatsRet = []
		sscats.each do |s|
			if Commerce.where('tag0 = ?',s.id).count > 0
				sscatsRet.push(s)
			end
		end		
		sscatsRet

	end

	def Interface.getTags
		Tag.order('id')
	end

	def Interface.getSSCategorieByID(lid)
		Sscategorie.where(:id => lid).first
	end

	#Permet d'obtenir un magasin aleatoire
	def Interface.getRandomCommerce

		offset = rand(Commerce.count)
		Commerce.offset(offset).select("id,enseigne,location_lat,location_lng,location_type,vp_ne_lat,vp_ne_lng,vp_sw_lat,vp_sw_lng").first

	end

	#Obtenir les coordonnees uniquement pour un ID de commerce
	def Interface.getCommerceCoordByID(id)

		Commerce.where(:id => id).select('id,enseigne,location_lat,location_lng,location_type,vp_ne_lat,vp_ne_lng,vp_sw_lat,vp_sw_lng').first

	end

	#permet l'obtenton d'un commerce par son nom
	def Interface.getCommerceByNom(nom)

		Commerce.where(:enseigne => nom).select('id,enseigne,tag0,tag1,tag2,tag3,email,facebook,description,image,instagram,website').first

	end
	
	#Relatif aux commerces
	def Interface.getParcoursPredefinis

		ParcoursPredefini.where(:visible => true).order("id ASC")

	end

	def Interface.getPredefParNom(nom)

		listid = ParcoursPredefini.where(:name => nom).first

		ret = Array.new
		
		listid.commerces.each do |com|
			ret.push Commerce.where(:id => com).select('id,enseigne,location_lat,location_lng').first
		end
		ret

	end

	def Interface.getIdbyNum( nomTag )
		Sscategorie.where(:nom => nomTag).select('id').first
	end

	# On retourne une liste de 10 commerces en fonction de leurs coordonées
	# et de leurs tags :
	def Interface.getComCT( nomTag, lat_max, lat_min,
						    lng_max, lng_min, limit )
		
	
		offset = rand(Commerce.count);
		commercesTaggued = Commerce.where("tag0 = ? OR tag1 = ? OR tag2 = ? ",nomTag,nomTag,nomTag)
		
		commercesInCoord = commercesTaggued.where("location_lat <= ? AND location_lat >= ? AND 
							     location_lng >= ? AND location_lng <= ?",
								lat_max, lat_min, lng_max, lng_min).select('id,enseigne,location_lat,location_lng').order("RANDOM()").limit(limit)

		commercesInCoord
				

	end

	def Interface.getComLL( nomTag, lat_max, lat_min, lng_max, lng_min,
							lat_dep, lat_arr, lng_dep, lng_arr, dist_max, limit )
		offset = rand(Commerce.count);
		commercesTaggued = Commerce.where("tag0 = ? OR tag1 = ? OR tag2 = ? ",nomTag,nomTag,nomTag);
		# On commence par affiner la recherche : les resultats sont contenus dans un rectangle autour
		# de la coordonée moyenne entre l'arrivée et le départ du parcours
		commercesInCoord = commercesTaggued.where("location_lat <= ? AND location_lat >= ? AND 
							     				   location_lng >= ? AND location_lng <= ?",
												   lat_max, lat_min, lng_max, lng_min).select('id,enseigne,location_lat,location_lng').order("RANDOM()")
		# à présent, on prend uniquement les étapes qui ne produisent pas une chemin plus grand que
		# la distance maximale
		res = [];
		cpt = 0;
		commercesInCoord.each do |com|
			partie1 = Algo.distLL(com.location_lat, com.location_lng, lat_dep, lng_dep);
			partie2 = Algo.distLL(com.location_lat, com.location_lng, lat_arr, lng_arr);
			if( (partie1+partie2) < dist_max )
				res << com;
				cpt += 1;
				if cpt > limit
					return res;
				end
			end
		end
		return res;

	end

	def Interface.getComLL_opti( nomTag, lat_max, lat_min, lng_max, lng_min,
							lat_dep, lat_arr, lng_dep, lng_arr, dist_max, limit )
		offset = rand(Commerce.count);
		commercesTaggued = Commerce.where("tag0 = ? OR tag1 = ? OR tag2 = ? ",nomTag,nomTag,nomTag);
		# On commence par affiner la recherche : les resultats sont contenus dans un rectangle autour
		# de la coordonée moyenne entre l'arrivée et le départ du parcours
		commercesInCoord = commercesTaggued.where("location_lat <= ? AND location_lat >= ? AND 
							     				   location_lng >= ? AND location_lng <= ?",
												   lat_max, lat_min, lng_max, lng_min).select('id,enseigne,location_lat,location_lng').order("RANDOM()")
		# à présent, on prend uniquement les étapes qui ne produisent pas une chemin plus grand que
		# la distance maximale

		res = [];
		cpt = 0;
		if commercesInCoord.empty?
			return [];
		end
		commercesInCoord.each do |com|
			partie1 = Algo.distLL(com.location_lat, com.location_lng, lat_dep, lng_dep);
			partie2 = Algo.distLL(com.location_lat, com.location_lng, lat_arr, lng_arr);

			# On test si la distance totale est inférieure à la distance maximale :
			if ( partie1 + partie2 < dist_max )
				# dans le cas ou l'on n'a pas encore atteint la limite :
				if ( cpt < limit )
					res << [com,partie1+partie2];
					res.sort! {|a,b| a[1] <=> b[1]};
					cpt += 1;
				else
					# sinon : si le nouveau magasin a un meilleur chemin :
					if ( partie1+partie2 < res[res.length-1][1] )
						res.pop;
						# On l'ajoute au tableau de résultat
						res << [com,partie1+partie2];
						res.sort! {|a,b| a[1] <=> b[1]};
					end
				end
			end
		end
		# On retourne uniquement la première partie du tableau :
		res.map! {|a| a[0]};
		return res;

	end

	# Pour retourner une liste de magasins se trouvant dans un rayon défini par la position
	# de l'utilisateur et par la coordonnée du magasin
	def Interface.getCom_client_pos( nomTag, lat_max, lat_min, lng_max, lng_min,
							lat_ref, lng_ref, dist_max, limit )
		offset = rand(Commerce.count);
		commercesTaggued = Commerce.where("tag0 = ? OR tag1 = ? OR tag2 = ? ",nomTag,nomTag,nomTag);
		# On commence par affiner la recherche : les resultats sont contenus dans un rectangle autour
		# de la coordonée moyenne entre l'arrivée et le départ du parcours
		commercesInCoord = commercesTaggued.where("location_lat <= ? AND location_lat >= ? AND 
							     				   location_lng >= ? AND location_lng <= ?",
												   lat_max, lat_min, lng_max, lng_min).select('id,enseigne,location_lat,location_lng').order("RANDOM()")
		# à présent, on prend uniquement les étapes qui ne produisent pas une chemin plus grand que
		# la distance maximale
		res = [];
		cpt = 0;
		commercesInCoord.each do |com|

			distance = Algo.distLL(com.location_lat, com.location_lng, lat_ref, lng_ref);
			if( distance < dist_max )
				res << com;
				cpt += 1;
				if cpt > limit
					return res;
				end
			end
		end
		return res;

	end

	#retourne un magasin complet
	def Interface.getSpecificCommerce

		Commerce.first

	end

	def Interface.getCommerceByID(lid)

		Commerce.where(:id => lid).first

	end

	def Interface.getAllCommerce

		Commerce.all()

	end

	#
	#Fonctions concernant le BACKOFFICE
	#
	def Interface.uuidexists?(uuid)
		Commerce.where(:id => uuid).size() >= 1
	end

	#Retourne un magasin aleatoire selon l'id, hors celui dont l'uuid est passé en parametres
	#pour eviter les doublons
	def Interface.getAleatoire(tag, uuid) 
	
		candidat = Commerce.where("(tag0 = ? OR tag1 = ? OR tag2 = ?) AND id != ?", tag, tag, tag, uuid).order("RANDOM()").first

	end

	#Retourne des magasins - 3 au max - dont l'enseigne contient deb
	def Interface.getSuggestion(deb)
	
	candidats = Commerce.all
	total = candidats.length
	ret = []
	i = 0
	k = 0
	while i < total do
		

		if candidats[i].enseigne.include? deb.upcase
			ret.push(candidats[i])
			k = k + 1
		end

		if k == 3
			break
		else
			i = i + 1
		end


	end

	ret

	end

	#Retourne des magasins - indice au max - dont l'enseigne contient deb
	def Interface.getSuggestionIndice(deb, indice)
	
	candidats = Commerce.all
	total = candidats.length
	ret = []
	i = 0
	k = 0
	while i < total do
		

		if candidats[i].enseigne.include? deb.upcase
			ret.push(candidats[i])
			k = k + 1
		end

		if k == indice
			break
		else
			i = i + 1
		end


	end

	ret

	end





end










