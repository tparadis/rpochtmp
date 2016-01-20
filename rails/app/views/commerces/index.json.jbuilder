# Retourne un tableau dont les objets sont de la forme
# {
#     id: "3e68e806-b640-428a-98e5-3ed057c53a27",
#     name: "LE BOCAL",
#     loc: {
#         lat: 48.1096255,
#         lng: -1.681241
#     },
#     url: "http://rpoch.istic.univ-rennes1.fr/api/commerces/3e68e806-b640-428a-98e5-3ed057c53a27.json"
# }

#format.json { render json: @commerces.as_json(only: [:id, :name, :email,:city, :created_at, :updated_at], include: [:second_model_name , :third_model_name]) }

json.array!(@commerces) do |commerce|
  json.extract! commerce, :id
  json.name commerce["enseigne"]
  json.loc @loc={lat:commerce["location_lat"], lng:commerce["location_lng"]}
  json.url commerce_url(commerce, format: :json)
end
