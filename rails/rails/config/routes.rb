Rails.application.routes.draw do


  root 'welcome#index'
  #root "session#new"

  #scope '/api' do
  #	get '/', to: "welcome#index"
  	resources :tags
  	resources :sscategories
  	resources :categories
  	resources :parcours_predefinis
  	resources :commerces
  	resources :resultats
  #end

  #Routes pour le BACK-OFFICE
  scope '/bo' do
  	
  	resources :users
  	resources :promotions
  	get '/', to: "sessions#new"
  	get     'home'    => 'main#index'
  	get     'help'    => 'main#help'
  	get     'about'   => 'main#about'
  	get     'contact' => 'main#contact'
  	get     'news'    => 'main#news'
  	get 	'statmap' => 'statmap#index'
  	get    'signup'   => 'users#new'
  	get    'login'    => 'sessions#new'
  	post   'login'    => 'sessions#login'
  	delete 'logout'   => 'sessions#logout'

	get 'statistique/:id' => 'statistique#show', as: 'statistique'

  	get   'promotions/new'
  	post 'promotions/create'
  	get 'promotions/accept/:id' => 'promotions#accept', as: "paccept"
  end

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end