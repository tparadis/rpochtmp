class StatmapController < ApplicationController
  
  before_action :require_admin, only: [:index, :show, :edit, :update, :destroy]
  
  def index

		#retourne les coordonnees de tous les points qui ont ete visites

		allStats = Stat.all
		taille = allStats.length
		ret = []
		
		#utile pour le calcul du max
		present = {}
		max = 1


		allStats.each do |s|
			
			if !present.include? s.commerce
			
				present[s.commerce] =  1

			else
				newV = present[s.commerce] + 1
				if newV > max
					max = newV
				end
				present[s.commerce] = newV

			end

			tmp = Commerce.select("id, enseigne, vp_ne_lat, vp_ne_lng").where("id = ?", s.commerce).first
			ret.push(tmp)

		end
		
		@maximum = max.to_json
		@detailsMagasins = present.to_json
		@allStats = ret.to_json
  end
end
