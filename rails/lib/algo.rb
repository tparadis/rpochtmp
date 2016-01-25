module Algo

  require "interface.rb"

	#Permet d'obtenir un itineraire a partir de tags

	def Algo.getTagsPath(coord_dep,coord_arr,dist_max, commerces)


		y = ["1","2"]

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
