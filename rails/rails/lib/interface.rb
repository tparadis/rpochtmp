module Interface

	require "algo.rb"


	#requete qui rend un commerce aléatoire
	def Interface.randomNew(tags)


		#on Remplace par mixte 
		hasMixte =  false;
		homme = false
		femme = false
		tags.each_with_index do |t,i|
			if t == 59
				homme = true
			
			elsif t == 58
				femme = true
				
			#pour eviter de chercher dans un tag vide
			elsif t == 0
				tags[i] = tags[0]
			end
		end
		#On remplace homme et femme par mixte
		if homme && femme
			tags.each_with_index do |t,i|
				if t == 59 || t == 58
					tags[i] = 62
				end
			end
		end

		#On vérifie que la taille est bonne
		if tags.length < 1 || tags.length > 4

			return nil

		end

		#on ajuste la taille du tableau pour la requete
		while tags.length < 4 do
			tags.push(tags[0])
		end
		

		commerce = Commerce.where("(tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?) AND (tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?) AND (tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?) AND (tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?)",tags[0],tags[0],tags[0],tags[0],tags[1],tags[1],tags[1],tags[1],tags[2],tags[2],tags[2],tags[2],tags[3],tags[3],tags[3],tags[3]).order("Random()").first

		#Tableau de retour
		if !commerce.nil?
			infos = {}
			infos["id"] = commerce.id
			infos["enseigne"] = commerce.enseigne
			infos["location_lat"] = commerce.location_lat
			infos["location_lng"] = commerce.location_lng
			infos["image"] = commerce.image
			infos["tags"] = [commerce.tag0,commerce.tag1,commerce.tag2,commerce.tag3]
			infos["tagsSent"] = tags
			infos
		else
			nil
		end

	end

	def Interface.randomNewR(tags,uuid)


		#on Remplace par mixte 
		homme = false
		femme = false
		tags.each_with_index do |t,i|
			if t == 59
				homme = true
			
			elsif t == 58
				femme = true
				
			#pour eviter de chercher dans un tag vide
			elsif t == 0
				tags[i] = tags[0]
			end
		end
		#On remplace homme et femme par mixte
		if homme && femme
			tags.each_with_index do |t,i|
				if t == 59 || t == 58
					tags[i] = 62
				end
			end
		end

		#On vérifie que la taille est bonne
		if tags.length < 1 || tags.length > 4

			return nil

		end

		#on ajuste la taille du tableau pour la requete
		while tags.length < 4 do
			tags.push(tags[0])
		end
		

		commerce = Commerce.where("id != ? AND (tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?) AND (tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?) AND (tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?) AND (tag0 = ? OR tag1 = ? OR tag2 = ? OR tag3 = ?)",uuid,tags[0],tags[0],tags[0],tags[0],tags[1],tags[1],tags[1],tags[1],tags[2],tags[2],tags[2],tags[2],tags[3],tags[3],tags[3],tags[3]).order("Random()").first

		#Tableau de retour
		if !commerce.nil?
			infos = {}
			infos["id"] = commerce.id
			infos["enseigne"] = commerce.enseigne
			infos["location_lat"] = commerce.location_lat
			infos["location_lng"] = commerce.location_lng
			infos["image"] = commerce.image
			infos["tags"] = [commerce.tag0,commerce.tag1,commerce.tag2,commerce.tag3]
			infos["tagsSent"] = tags
			infos
		else
			nil
		end

	end





	#requete qui remplace le commerce si necessaire
	def Interface.replace_if_necessary(comm,tags)

		comm.each_with_index do |c, i|
			while tags[i].length < 4
				tags[i].push(tags[i][0])
			end
			valide = Interface.verifie_valide(c,tags[i])
			if !valide 
				
				comTemp = Interface.randomNew(tags[i])
				
				if !comTemp.blank?
					comm[i] = comTemp
				end
			end
		end


	end

	def Interface.verifie_valide(c,tags)

		femme = false
		homme = false
		ctags = []

		ct0 = Commerce.where("id = ?", c.id).first.tag0
		ct1 = Commerce.where("id = ?", c.id).first.tag1
		ct2 = Commerce.where("id = ?", c.id).first.tag2
		ct3 = Commerce.where("id = ?", c.id).first.tag3

		ctags.push([ct0,ct1,ct2,ct3])


		tags.each_with_index do |t,i|
			if t == 59
				homme = true
			
			elsif t == 58
				femme = true
				
			#pour eviter de chercher dans un tag vide
			elsif t == 0
				tags[i] = tags[0]
			end
		end
		#On remplace homme et femme par mixte
		if homme && femme
			tags.each_with_index do |t,i|
				if t == 59 || t == 58
					tags[i] = 62
				end
			end
		end

		#On teste pour savoir si le magasin correspond bien 
		convient = true
		trouve = false
		res = [false,false,false,false]

		tags.each_with_index do |t,i|
			
			trouve = false

			ctags.each_with_index do |c,j|
				if !c.nil? 	
					if c == t
						trouve = true
					end
				end

			end

			convient = trouve && convient

		end		

		convient

	end

	#Requete pour ajouter des notes, commentaires
	def Interface.addNote(note, commerce, commentaire, idtel)
	
		#variabes de retour
		status = false
		error = "Merci pour votre commentaire."
		ret = {}


		#on s'assure qu'il n'a jamais commenté ce magasin
		prev = Note.select("idtel, commerce").where("idtel = ? AND commerce = ?", idtel, commerce).first
		begin
			exist = Commerce.where("id = ?", commerce).first
			if prev.nil? && !exist.nil?

				if !(note.to_i > 5) && !(note.to_i < 0) 
					#On prépare la sauvegarde
					@note = Note.new
					@note.idtel = idtel
					@note.commentaire = commentaire
					@note.commerce = commerce
					@note.note = note

					if @note.save
						status = true	
					else
						error = "Impossible de sauvegarder la note, problème interne au serveur..."
					end


				else
					error = "Erreur, la note n'est pas comprise entre 0 et 5"
				end


			else
				status = false
				error = "Vous avez déja commenté ce commerce"
			end

		rescue
			
			error = "Erreur, l'UUID passé n'est pas valide"
		
		end

		#On retourne le résultat
		ret["status"] = status
		ret["error"] = error
		ret

	end



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
	
	#requetes sur les horaires
	def Interface.ouvertAuj?(id)

		#ci-dessous sont les variables qui seront retournees
		continu = false
		heure = Time.new.hour.to_i
		minute = Time.new.min.to_i
		ouvert = false
		infos = {}


		days = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]
		indice = Date.today.wday - 1
		if indice < 0
			indice = 6
		end
		jour = days[indice]
		horaire = Commerce.find_by(id: id).horaires
		ret = []
		reg = Regexp.new(jour)

		#on récupère les horaires qui nous intéressent
		horaire.each do |h|
			if h[0] =~ reg
				ret.push(h[1].to_i)
			end
		end	

		#on teste si le commerce est ouvert en continu
		if ret[2] == ret[4] && ret[3] == ret[5]
			continu = true
		end


		#on teste si l'heure courant est dans l'intervalle
		#pour un intervalle continu ou non
		if continu 				
			ouvert = Interface.checkInterval([ret[0], ret[1], ret[6], ret[7]])
		else
			ouvert = (Interface.checkInterval([ret[0], ret[1], ret[2], ret[3]]) || Interface.checkInterval([ret[4], ret[5], ret[6], ret[7]]))
		end



		#Ajout des infos au tableau de retour
		infos["jour"] = jour
		infos["heure"] = heure
		infos["minute"] = minute
		infos["continu"] = continu
		infos["ouvert"] = ouvert
		infos["horairesok"] = false
		if horaire.to_s != '{}' 
			infos["horairesok"] = true
		end
		if continu
			infos["horaires"] = [ret[0],ret[1], ret[6], ret[7]]
		else
			infos["horaires"] = ret
		end

		#on retourne infos
		infos


	end

	#vérifie que l'heure est bien dans l'intervalle passé en paramètre
	def Interface.checkInterval(tab)

		heure = Time.new.hour.to_i
		minute = Time.new.min.to_i
		ouvert = false

		if tab[0] == tab[2] && tab[1] == tab[3]
			return false
		end

		if heure > tab[0] && heure < tab[2]
				ouvert = true
		elsif heure == tab[0]
			if minute >= tab[1]
				ouvert = true
			end
		elsif heure == tab[2]
			if minute < tab[3]
				ouvert = true
			end
		end
		
		ouvert
	end

	def Interface.getTags
		Tag.order('id')
	end
	
	def Interface.getSSCategorieByID(lid)
		Sscategorie.where(:id => lid).first
	end

	def Interface.incrStatMag(id)
		@y = Commerce.where(:id => id).first
		@y.increment!(:nbvisite)
		@y.save
	end
	
	def Interface.incrStatSSCat(id)
		@y = Sscategorie.where(:id => id).first
		@y.increment!(:stat)
		@y.save
	end

	def Interface.incrStatCat(id)
		@y = Categorie.where(:id => id).first
		@y.increment!(:stat)
		@y.save
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
	def Interface.getAleatoireR(tags, uuid) 
	
		i = 0
		max = 5
		candidat = nil
		loop do
			i = i + 1
			candidat = randomNewR(tags, uuid)
			break if candidat.nil? || i == max 
		end

		candidat

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










