json.array!(@commerces) do |commerce|
  json.extract! commerce, :id
  json.url commerce_url(commerce, format: :json)
end
