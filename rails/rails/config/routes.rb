Rails.application.routes.draw do

  root 'welcome#index'

  #scope '/api' do
  #	get '/', to: "welcome#index"
  	#resources :commerces
  #end

  #Routes pour le BACK-OFFICE
  scope '/bo' do
	resources :phoneids
	resources :tutos
  	resources :notes
  	resources :blacklists
  	resources :tokens
  	resources :users
  	resources :promotions
	resources :categories
	resources :sscategories
	resources :resultats
	resources :parcours_predefinis
	resources :commerces
  	get '/', to: "sessions#new"
	get 	'accounts' => 'accounts#index'
	post 	'accounts/edituser'
	get 	'users/edituser/:id' => 'users#edituser', :as => :edituser
	patch 	'users/updateuser/:id' => 'users#updateuser', :as => :updateuser
  	get     'home'    => 'main#index'
  	get     'help'    => 'main#help'
  	get     'about'   => 'main#about'
  	get     'contact' => 'main#contact'
  	get     'news'    => 'main#news'
  	get 	'statmap' => 'statmap#index'
	get 	'newcomm' => 'users#newcomm', :as => :newcomm
	post    'createcomm'   => 'users#createcomm', :as => :createcomm
  	get     'signup'   => 'users#new'
	get	    'resultats' => 'resultats#index'
  	get     'login'    => 'sessions#new'
  	post    'login'    => 'sessions#login'
  	delete  'logout'   => 'sessions#logout'
	get 	'tokens/changemdp' => 'tokens#changemdp', :as => :changemdp
	post    'tokens/reinit' => 'tokens#reinit', :as => :reinit

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
