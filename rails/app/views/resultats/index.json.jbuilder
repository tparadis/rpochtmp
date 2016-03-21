json.array!(@resultats) do |resultat|
  json.extract! resultat, :id, :magasin, :type, :message
  json.url resultat_url(resultat, format: :json)
end
