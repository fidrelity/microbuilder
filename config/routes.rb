Microbuilder::Application.routes.draw do
  root :to => 'pages#home'
  
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  resources :users, :only => [:show]
  resources :graphics, :only => [:create]
  resources :games, :only => [:create]
  
  get '/gallery', :to => 'games#index'
  get '/play/:id', :to => 'games#show'
  get '/build', :to => 'games#new'
  get '/editor', :to => 'pages#editor', :as => 'pages_editor' #route for testing only
end
