json.array!(@tutos) do |tuto|
  json.extract! tuto, :id, :fr, :de, :esp, :en, :page
  json.url tuto_url(tuto, format: :json)
end
