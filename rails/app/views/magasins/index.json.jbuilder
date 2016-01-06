json.array!(@magasins) do |magasin|
  json.extract! magasin, :id, :nom, :latitude, :longitude
  json.url magasin_url(magasin, format: :json)
end
