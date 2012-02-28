Microbuilder::Application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  root :to => 'pages#home'
  get '/editor', :to => 'pages#editor', :as => 'pages_editor'
  get '/ember', :to => 'pages#ember', :as => 'pages_editor'
    
  resources :users, :only => [:show]

end
