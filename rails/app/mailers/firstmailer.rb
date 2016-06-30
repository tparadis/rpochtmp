class Firstmailer < ApplicationMailer
	default from: "contact@rennespoche.fr"

	def sample_email("leopoldo@hotmail.fr")
		mail(to: mail, subject: 'Sample Email')
	end

end
