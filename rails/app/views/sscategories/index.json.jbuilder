json.array!(@sscategories) do |sscategory|
  json.extract! sscategory, :id, :nom
  json.url sscategory_url(sscategory, format: :json)
end
