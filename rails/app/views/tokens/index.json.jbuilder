json.array!(@tokens) do |token|
  json.extract! token, :id, :mail, :valeur, :valide
  json.url token_url(token, format: :json)
end
