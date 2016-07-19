class WelcomeController < ApplicationController

  require "algo.rb"
  require "interface.rb"


  def index

	

  	#params.require(:req)

	if !params.has_key?(:req)
		redirect_to 'https://www.rennespoche.fr/api/bo'
	end
		
	if request.headers["CONTENT_TYPE"] == "application/json" || (params.has_key?(:format) && params[:format]=="json")
	

	# Debut des requetes
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

		#Ajouter des stats aux parcours prédefinis
		if params[:req] == "incpredef" && params.has_key?(:nom) && params[:nom] != ""
	
			p = ParcoursPredefini.where("name = ?", params[:nom]).first
			if p.blank?
				render json: {:msg => "error"}
			end
			p.stats = p.stats + 1
			if !p.save
				render json: {:msg => "pasok"}
			else
				render json: {:msg => "ok"}
			end

		end

		#Afficher les informations d'un commerce
		if params[:req] == "spec"
			if params.has_key?(:nom) && params[:nom] != ""

				#Retourne les infos du magasin en se basant sur le nom
				@y = Interface.getCommerceByNom(params[:nom])
				render json: {:commerce => @y}

			elsif params.has_key?(:id) && params.has_key?(:type) && params[:type] == "coord"

					@y = Interface.getCommerceCoordByID(params[:id])
					render json: { :commerce => @y }

			elsif params.has_key?(:id)

					@y = Interface.getCommerceByID(params[:id])
					render json: { :commerce => @y}

			else

				render json: { :commerce => Interface.getSpecificCommerce}
			end
		end

		#Requetes qui permettent de voir si les UUID sont valides ou non
		if params[:req] == "verifyuuid" && params.has_key?(:uuid)

			uuid = params[:uuid]
			begin
				c = Commerce.where("id = ?", uuid).first
				err = ""

				if c.blank?
					err = "Erreur, aucun commerce n'est répertorié avec cet identifiant..."
				elsif !c.user_id.blank?
					err = "Ce commerce est déja affilié à un utilisateur..."
				else
					err = "ok"
				end



			rescue
				err = "L'identifiant indiqué n'a pas le bon format. Auriez-vous oublié un caractère ? Avez-vous bien mis les tirets ?"
			end
			
			#Volontairement nous faisons un délai de 2 secondes pour limiter les attaques par essais successifs
			sleep 2
			render json: {:err => err}

		end

		#Permet de voir si un utilisateur avec ce mail existe
		if params[:req] == "verifyemail" && params.has_key?(:email)

			err = ""

			blank = User.where("email = ?",params[:email]).first.blank?
			if blank
		
				#C'est ok, le mail n'existe pas
				err = "ok"

			else

				err = "Erreur, un utilisateur existe deja avec ce mail."

			end

			#on fait volontairement attendre la requete de 3 secondes pour eviter les attaques
			sleep 3
			render json: {:err => err}	

		
		end



		#requete qui va permettre de signaler des erreurs de la part d'un utilisateur
		if params[:req] == "signaler"

			if params.has_key?(:magasin) && params.has_key?(:objet) && params.has_key?(:message) && params["magasin"]!= "" && params["objet"] != "" && params["message"] != ""
				
				Resultat.new(:magasin => params["magasin"], :objet => params["objet"], :message => params["message"]).save
				render json: "ok"
			else
				render json: ""
			end
		end
		
		#Renvoie des commerces Random
		if params[:req] == "rand"
			render json: { :commerce => Interface.getRandomCommerce}
		end
		
		#Obtenir les textes des tutoriaux
		if params[:req] == "tutos" && params.has_key?(:page)

			@y = Tuto.where("page = ?", params[:page]).first
			render json: @y

		elsif params[:req] == "tutos"
			@y = Tuto.all
			render json: @y
		end

		#Recuperer un uuid d'identifiant
		if params[:req] == "new"


			@y = Phoneid.new
			@y.info = "utilisateur réel"
			if !@y.save
				
				render json: {:code => "error"}

			end
			
			render json: @y
		end
		
		#Verifier l'existence d'un uuid
		if params[:req] == "userExists" && params.has_key?(:id)

			@y = Phoneid.find_by(id: params[:id])
			render json: !@y.blank?
		end
		
		#Retourne un magasin Random lorsque l'utilisateur veut un magasin avec des tags précis
		if params[:req] == "randomNew" && params.has_key?(:tags)

			tags = eval(params[:tags])

			@y = Interface.randomNew(tags)
			render json: @y	

		end


		#requete sur les horaires d'un magasin
		if params[:req] == "ouvert" && params.has_key?(:id) && params[:id] != ""
		
			@y = Interface.ouvertAuj?(params[:id])
			render json: @y

		end

		#Renvoie le parcours predefinis demandée (ou tous les parcours predefinis)
		if params[:req] == "predef"

			if params.has_key?(:nom) && params[:nom] != ""
				@y = Interface.getPredefParNom(params[:nom])
				@z = ParcoursPredefini.select("description,image,fr,de,en,esp").where("name = ?",params[:nom]).first
				render json: {:size => @y["commerces"].length, :magasins => @y["commerces"], :description =>@z.description, :image => @z.image, :fr => @z.fr, :en => @z.en, :de => @z.de, :esp => @z.esp}	
			else			

				@y = Interface.getParcoursPredefinis
				render json: {:size => @y.size(), :parcourspredefs => @y }
			end
		end
		
		#Renvoie toutes les categories
		if params[:req] == "allcat"
			i = Interface.getCategories
			j = Interface.getSSCategories
			#k = Interface.getTags
			render json: {:sizecat => i.size(), :sizesscat => j.size(), :cat => i, :sscat => j}#, :tags => k  }		
		end
		#Renvoie une categorie
		if params[:req] == "cat"
			@y = Interface.getCategories
			render json: {:size => @y.size(), :categories => @y}
		end

		#Renvoie une Sous Categorie
		if params[:req] == "sscat" && params.has_key?(:id) && params[:id].to_i >0
			@y = Interface.getSSCategorieByID(params[:id])
			render json: {:tag => @y}
		elsif params[:req] == "sscat"
			@y = Interface.getSSCategories
			render json: {:size => @y.size(), :sscategories => @y}
		end
		
		if params[:req] == "tags"
			@y = Interface.getTags
			render json: {:size => @y.size(), :tags => @y}
		end

		#Renvoie toute les Sscategory
		if params[:req] == "sscatAll"
			@y = Sscategory.order("nom").all
			render json: {:size => @y.size(), :sscategories => @y}
		end

		# Debut test
		# On rajoute un parametre pour avoir des items plus précis !
		if params[:req] == "yolo"
			
			@y = Algo.getNewPath(params[:coord_dep_lat].to_f,params[:coord_dep_lng].to_f,
									 params[:coord_arr_lat].to_f,params[:coord_arr_lng].to_f,
									 params[:dist_max].to_f, params[:commerces])
			
			#@y = Interface.replace_if_necessary(@y)	

			
			render json: { :tags => @y}

		end

		#Requete pour créer un parcours prennant en compte un tableau de tags
		if params[:req] == "yoloR"
			
			@y = Algo.getNewPath(params[:coord_dep_lat].to_f,params[:coord_dep_lng].to_f,
									 params[:coord_arr_lat].to_f,params[:coord_arr_lng].to_f,
									 params[:dist_max].to_f, params[:commerces])
			
			@y = Interface.replace_if_necessary(@y,eval(params[:tags]))	
			
			render json: { :tags => @y}

		end


		if params[:req] == "yolo_inter"
			@y = Algo.getInterPath(params[:coord_dep_lat].to_f,params[:coord_dep_lng].to_f,
									 params[:coord_arr_lat].to_f,params[:coord_arr_lng].to_f,
									 params[:dist_max].to_f, params[:commerces])
			render json: { :tags => @y}
		end

		if params[:req] == "yolodist"
			# @y = Algo.distLL(params[:a_lat].to_f,params[:a_lng].to_f,params[:b_lat].to_f,params[:b_lng].to_f)
			@y = Interface.getComLL(13, 48.117, 48.11017, -1.6866, -1.676,
									params[:coord_dep_lat].to_f,params[:coord_arr_lat].to_f,
									params[:coord_dep_lng].to_f,params[:coord_arr_lng].to_f,
									10,4);
			# render json: { :tags => @y}
			render json: { :tags => @y }
		end
		if params[:req] == "test_corr"
			# @y = Interface.getIdbyNum("Boucherie");
			# Test sur la requête avec distLL ->
			@y = 
			render json: { :tags => @y}
		end
		if params[:req] == "new_path"
			@y = Algo.getNewPath(params[:coord_dep_lat].to_f,params[:coord_dep_lng].to_f,
									 params[:coord_arr_lat].to_f,params[:coord_arr_lng].to_f,
									 params[:dist_max].to_f, params[:commerces])
			render json: { :tags => @y}
		end

		#Requete qui permet d'avoir un magasin random selon un tag passe en parametre
		#Aucune optimisation n'est prise en compte

		if params[:req] == "aleatoire" && params.has_key?(:tag) && params[:tag] != "" && params.has_key?(:uuid) && params[:uuid] != ""
			@y = Interface.getAleatoire(params[:tag], params[:uuid])

			render json: {:magasin => @y}

		end

		#Memme requete que "aleatoire" mais avec un tableau de tags en parametre
		if params[:req] == "aleatoireR" && params.has_key?(:tags) && params[:tags] != "" && params.has_key?(:uuid) && params[:uuid] != ""
			@y = Interface.getAleatoireR(eval(params[:tags]), params[:uuid])

			render json: {:magasin => @y}

		end


		if params[:req] == "suggestion" && params.has_key?(:deb) && params.has_key?(:indice) && params[:indice] != "" && params["deb"] != ""
			@y = Interface.getSuggestionIndice(params[:deb], params[:indice].to_i)
			render json: {:size => @y.size, :magasins => @y }


		elsif params[:req] == "suggestion" && params.has_key?(:deb) && params[:deb] != ""

			@y = Interface.getSuggestion(params[:deb])
			render json: {:size => @y.size, :magasins => @y }

		end
		# Fin test

		if params[:req] == "stats" && params.has_key?(:id) && params[:id] != ""
			@y = Interface.incrStatMag(params[:id])
			render json: "ok"
		end
		
		if params[:req] == "statSSCat" && params.has_key?(:idcat) && params[:idcat] != ""
			@y = Interface.incrStatSSCat(params[:idcat])
			render json: {:status => "ok"}
		end
		if params[:req] == "statCat" && params.has_key?(:idcat) && params[:idcat] != ""
			@y = Interface.incrStatCat(params[:idcat])
			render json: {:status => "ok"}
		end

		#Requete pour les appréciations
		if params[:req] == "addNote" && params.has_key?(:commentaire) && params.has_key?(:idtel) && params[:idtel] != "" && params.has_key?(:commerce) && params.has_key?(:note) 
			@y = Interface.addNote(params[:note], params[:commerce], params[:commentaire], params[:idtel])
			render json: @y
		end
	else

		@y = Algo.getPath(0)
	end

  end

end
