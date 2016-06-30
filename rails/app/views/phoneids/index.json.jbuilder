json.array!(@phoneids) do |phoneid|
  json.extract! phoneid, :id, :info
  json.url phoneid_url(phoneid, format: :json)
end
