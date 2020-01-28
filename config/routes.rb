Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  #get 'route_list/index' # Use this type of route in case there's no model associated with it!

  namespace "user" do
    resources :posts do
      resources :post_images # Nested hierarchy!
    end
  end

  namespace "api" do 
    resources :posts, except: [:new, :edit] do
      resources :post_images, except: [:new, :edit]
    end
  end
  
  #root 'user/posts#index' #Tells rails to route root requests to index action of route_list (routeList) controller
  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end

