json.array!(@blacklists) do |blacklist|
  json.extract! blacklist, :id, :siret, :enseigne, :rasoc
  json.url blacklist_url(blacklist, format: :json)
end
