module Algo

  require "interface.rb"

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
		#Interface.getAllCommerce()
	end




end
