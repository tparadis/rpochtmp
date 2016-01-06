module Interface

	def Interface.getRandomMagasin

		y = Magasin.all().size()
		randy = rand(1..y)
		return Magasin.find(randy)

	end

	def Interface.getAllMagasin

		Magasin.all()

	end

end
