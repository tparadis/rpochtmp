module Interface

	#Fonctions sur la récupération des categories
	def Interface.getCategories
		Categorie.order('nom').select('id,nom')
	end

	def Interface.getSSCategories
		Sscategorie.order('nom').select('id,nom,catparent')
	end

	def Interface.getTags
		Tag.order('name').select('id,name')
	end


	#Permet d'obtenir un magasin aleatoire
	def Interface.getRandomCommerce

		offset = rand(Commerce.count)
		Commerce.offset(offset).select("id,enseigne,location_lat,location_lng,location_type,vp_ne_lat,vp_ne_lng,vp_sw_lat,vp_sw_lng").first

	end

	def Interface.getParcoursPredefinis

		ParcoursPredefini.all

	end

	#retourne un magasin complet
	def Interface.getSpecificCommerce

		Commerce.first

	end

	def Interface.getAllCommerce

		Commerce.all()

	end

end
