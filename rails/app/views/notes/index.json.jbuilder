json.array!(@notes) do |note|
  json.extract! note, :id, :note, :commerce, :commentaire, :idtel
  json.url note_url(note, format: :json)
end
