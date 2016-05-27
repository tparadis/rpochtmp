json.array!(@sscategories) do |sscategory|
  json.extract! sscategory, :id, :nom, :catparent
  json.url sscategory_url(sscategory, format: :json)
end
