json.array!(@parcours_predefinis) do |parcours_predefini|
  json.extract! parcours_predefini, :id, :name, :description, :image, :commerces
  json.url parcours_predefini_url(parcours_predefini, format: :json)
end
