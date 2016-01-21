json.array!(@categories_controllers) do |categories_controller|
  json.extract! categories_controller, :id
  json.url categories_controller_url(categories_controller, format: :json)
end
