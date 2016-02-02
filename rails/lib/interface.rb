module Interface
 
	#Fonctions sur la récupération des categories
	def Interface.getCategories
		Categorie.order('id').select('id,nom,reference,en,esp')
	end

	def Interface.getSSCategories
		Sscategorie.order('catparent').select('id,nom,catparent,en,esp')
	end

	def Interface.getTags
		Tag.order('id')
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


	#Relatif aux commerces
	def Interface.getParcoursPredefinis

		ParcoursPredefini.all

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

	#retourne un magasin complet
	def Interface.getSpecificCommerce

		Commerce.first

	end

	def Interface.getAllCommerce

		Commerce.all()

	end

end
