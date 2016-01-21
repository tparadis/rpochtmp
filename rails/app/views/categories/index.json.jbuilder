json.array!(@categories) do |category|
  json.extract! category, :id, :nom
  json.url category_url(category, format: :json)
end
