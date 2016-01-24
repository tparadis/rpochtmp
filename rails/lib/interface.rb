module Interface

	#Fonctions sur la récupération des categories
	def Interface.getCategories
		Categorie.order('id').select('id,nom')
	end

	def Interface.getSSCategories
		Sscategorie.order('catparent').select('id,nom,catparent')
	end

	def Interface.getTags
		Tag.order('id').select('id,nom')
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
		i = 0
		
		listid.commerces.each do |com|
			ret.push Commerce.where(:id => com).select('id,enseigne,location_lat,location_lng').first
		end
		ret

	end

	#retourne un magasin complet
	def Interface.getSpecificCommerce

		Commerce.first

	end

	def Interface.getAllCommerce

		Commerce.all()

	end

end
