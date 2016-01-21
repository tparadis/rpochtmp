json.array!(@tags) do |tag|
  json.extract! tag, :id, :nom
  json.url tag_url(tag, format: :json)
end
